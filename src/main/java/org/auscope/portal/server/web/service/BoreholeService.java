package org.auscope.portal.server.web.service;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.client.methods.HttpRequestBase;
import org.auscope.portal.core.server.http.HttpServiceCaller;
import org.auscope.portal.core.services.BaseWFSService;
import org.auscope.portal.core.services.CSWCacheService;
import org.auscope.portal.core.services.PortalServiceException;
import org.auscope.portal.core.services.csw.CSWRecordsFilterVisitor;
import org.auscope.portal.core.services.methodmakers.WFSGetFeatureMethodMaker;
import org.auscope.portal.core.services.methodmakers.WFSGetFeatureMethodMaker.ResultType;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.core.services.methodmakers.filter.IFilter;
import org.auscope.portal.core.services.responses.csw.AbstractCSWOnlineResource;
import org.auscope.portal.core.services.responses.csw.AbstractCSWOnlineResource.OnlineResourceType;
import org.auscope.portal.core.services.responses.csw.CSWRecord;
import org.auscope.portal.core.services.responses.ows.OWSExceptionParser;
import org.auscope.portal.core.services.responses.wfs.WFSTransformedResponse;
import org.auscope.portal.core.util.DOMUtil;
import org.auscope.portal.core.xslt.WfsToKmlTransformer;
import org.auscope.portal.gsml.BoreholeFilter;
import org.auscope.portal.nvcl.NVCLNamespaceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 * A utility class which provides methods for querying borehole service
 *
 * @author Jarek Sanders
 * @version $Id$
 *
 */
@Service
public class BoreholeService extends BaseWFSService {

    // -------------------------------------------------------------- Constants

    private final Log log = LogFactory.getLog(getClass());

    
	/** different styles that apply for the different layers managed by this controller */
	public enum Styles {
		ALL_BOREHOLES("circle", 6, "#ff9c2c", "#000000", 0.15);
		
		public final String shape;
		public final int size;
		public final String fillColour;
		public final String borderColour;
		public final double borderWidth;
		
		private Styles(final String shape, final int size, final String fillColour, final String borderColour, final double borderWidth) {
			this.shape = shape;
			this.size = size;
			this.fillColour = fillColour;
			this.borderColour = borderColour;
			this.borderWidth = borderWidth;
		}
	}
    // ----------------------------------------------------- Instance variables
    private WfsToKmlTransformer wfsToKml;

    // ----------------------------------------------------------- Constructors

    @Autowired
    public BoreholeService(HttpServiceCaller serviceCaller, WFSGetFeatureMethodMaker methodMaker,
            WfsToKmlTransformer wfsToKml) {
        super(serviceCaller, methodMaker);
        this.wfsToKml = wfsToKml;
    }

    // --------------------------------------------------------- Public Methods

    /**
     * Get all boreholes from a given service url and return the response
     * 
     * @param serviceURL
     * @param bbox
     *            Set to the bounding box in which to fetch results, otherwise set it to null
     * @param restrictToIDList
     *            [Optional] A list of gml:id values that the resulting filter should restrict its search space to
     * @return
     * @throws Exception
     */
    public WFSTransformedResponse getAllBoreholes(String serviceURL, String boreholeName, String custodian,
            String dateOfDrilling, int maxFeatures, FilterBoundingBox bbox, List<String> restrictToIDList)
            throws Exception {
        String filterString;
        BoreholeFilter nvclFilter = new BoreholeFilter(boreholeName, custodian, dateOfDrilling, restrictToIDList);
        if (bbox == null) {
            filterString = nvclFilter.getFilterStringAllRecords();
        } else {
            filterString = nvclFilter.getFilterStringBoundingBox(bbox);
        }

        HttpRequestBase method = null;
        try {
            // Create a GetFeature request with an empty filter - get all
            method = this.generateWFSRequest(serviceURL, getTypeName(), null, filterString, maxFeatures, null,
                    ResultType.Results);
            String responseGml = this.httpServiceCaller.getMethodResponseAsString(method);
            String responseKml = this.wfsToKml.convert(responseGml, serviceURL);

            return new WFSTransformedResponse(responseGml, responseKml, method);
        } catch (Exception ex) {
            throw new PortalServiceException(method, ex);
        }
    }

    private void appendHyloggerBoreholeIDs(String url, String typeName, List<String> idList)
            throws PortalServiceException, URISyntaxException {
        //Make request
        HttpRequestBase method = wfsMethodMaker.makeGetMethod(url, typeName, (Integer) null, null);
        try {
            String wfsResponse = httpServiceCaller.getMethodResponseAsString(method);

            //Parse response
            Document doc = DOMUtil.buildDomFromString(wfsResponse);

            OWSExceptionParser.checkForExceptionResponse(doc);

            XPath xPath = XPathFactory.newInstance().newXPath();
            xPath.setNamespaceContext(new NVCLNamespaceContext());

            //Get our ID's
            NodeList publishedDatasets = (NodeList) xPath.evaluate("/wfs:FeatureCollection/gml:featureMembers/"
                    + NVCLNamespaceContext.PUBLISHED_DATASETS_TYPENAME + "/nvcl:scannedBorehole", doc,
                    XPathConstants.NODESET);
            for (int i = 0; i < publishedDatasets.getLength(); i++) {
                Node holeIdentifier = (Node) xPath.evaluate("@xlink:href", publishedDatasets.item(i),
                        XPathConstants.NODE);
                if (holeIdentifier != null) {
                    String[] urnBlocks = holeIdentifier.getTextContent().split("/");
                    if (urnBlocks.length > 1) {
                        // skip invalid URIs
                        idList.add(urnBlocks[urnBlocks.length - 1].trim());
                    }
                }

            }
        } catch (Exception ex) {
            throw new PortalServiceException(method, ex);
        }
    }

    /**
     * Goes to the CSWService to get all services that support the PUBLISHED_DATASETS_TYPENAME and queries them to generate a list of borehole ID's that
     * represent every borehole with Hylogger data.
     *
     * If any of the services queried fail to return valid responses they will be skipped
     *
     * @param cswService
     *            Will be used to find the appropriate service to query
     * @param CSWRecordsFilterVisitor
     *            A filter visitor used to perform filter operation on the online resource. Use null if not required
     * @throws Exception
     */
    public List<String> discoverHyloggerBoreholeIDs(CSWCacheService cswService, CSWRecordsFilterVisitor visitor) {
        List<String> ids = new ArrayList<String>();

        for (CSWRecord record : cswService.getWFSRecords()) {
            for (AbstractCSWOnlineResource resource : record.getOnlineResourcesByType(visitor, OnlineResourceType.WFS)) {
                if (resource.getName().equals(NVCLNamespaceContext.PUBLISHED_DATASETS_TYPENAME)) {
                    try {
                        appendHyloggerBoreholeIDs(resource.getLinkage().toString(), resource.getName(), ids);
                    } catch (Exception ex) {
                        log.warn(String.format("Discovering boreholes at '%1$s' failed", resource.getLinkage()), ex);
                    }
                }
            }
        }

        return ids;
    }

    public String getFilter(String boreholeName, String custodian, String dateOfDrilling,
            int maxFeatures, FilterBoundingBox bbox, List<String> ids) throws Exception {
        BoreholeFilter filter = new BoreholeFilter(boreholeName, custodian, dateOfDrilling, ids);
        return generateFilterString(filter, bbox);
    }

    /**
     * Utility for turning a filter and optional bounding box into a OGC filter string
     * 
     * @param filter
     *            The filter
     * @param bbox
     *            [Optional] the spatial bounds to constrain the result set
     * @return
     */
    public static String generateFilterString(IFilter filter, FilterBoundingBox bbox) {
        String filterString = null;
        if (bbox == null) {
            filterString = filter.getFilterStringAllRecords();
        } else {
            filterString = filter.getFilterStringBoundingBox(bbox);
        }

        return filterString;
    }

    public String getStyle(String filter, String hyloggerFilter, String hyloggerColor, Styles styles) {

        String style = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
                + "<StyledLayerDescriptor version=\"1.0.0\" xmlns:gsmlp=\"http://xmlns.geosciml.org/geosciml-portrayal/2.0\" "
                + "xsi:schemaLocation=\"http://www.opengis.net/sld StyledLayerDescriptor.xsd\" xmlns:ogc=\"http://www.opengis.net/ogc\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:gml=\"http://www.opengis.net/gml\" xmlns:gsml=\"urn:cgi:xmlns:CGI:GeoSciML:2.0\" xmlns:sld=\"http://www.opengis.net/sld\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">"
                + "<NamedLayer>" + "<Name>"
                + getTypeName()
                + "</Name>"
                + "<UserStyle>"
                + "<Name>portal-style</Name>"
                + "<Title>portal-style</Title>"
                + "<Abstract>portal-style</Abstract>"
                + "<IsDefault>1</IsDefault>"
                + "<FeatureTypeStyle>"
                + "<Rule>"
                + "<Name>Borehole</Name>"
                + filter
                + "<PointSymbolizer>"
                + "<Geometry><ogc:PropertyName>" + getGeometryName() + "</ogc:PropertyName></Geometry>"
                + "<Graphic>"
                + "<Mark>"
                + "<WellKnownName>"+ styles.shape + "</WellKnownName>"
                + "<Fill>"
                + "<CssParameter name=\"fill\">" + styles.fillColour
                + "</CssParameter>"
                + "</Fill>"
                + "<Stroke>" 
                + "<CssParameter name=\"stroke\">" + styles.borderColour + "</CssParameter>" 
                + "<CssParameter name=\"stroke-width\">" + styles.borderWidth + "</CssParameter>" 
                + "</Stroke>" 
                + "</Mark>"
                + "<Size>" + styles.size + "</Size>"
                + "</Graphic>"
                + "</PointSymbolizer>"
                + "</Rule>"
                + "</FeatureTypeStyle>"
                + "</UserStyle>" + "</NamedLayer>" + "</StyledLayerDescriptor>";

        return style;
    }

    public String getTypeName() {
        return "gsml:Borehole";
    }

    public String getGeometryName() {
        return "gsml:collarLocation/gsml:BoreholeCollar/gsml:location";
    }
}
