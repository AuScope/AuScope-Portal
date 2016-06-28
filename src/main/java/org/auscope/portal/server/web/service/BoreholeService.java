package org.auscope.portal.server.web.service;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

import javax.xml.xpath.XPathConstants;

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
import org.auscope.portal.core.services.namespaces.WFSNamespaceContext;
import org.auscope.portal.core.services.responses.csw.AbstractCSWOnlineResource;
import org.auscope.portal.core.services.responses.csw.AbstractCSWOnlineResource.OnlineResourceType;
import org.auscope.portal.core.services.responses.csw.CSWRecord;
import org.auscope.portal.core.services.responses.ows.OWSExceptionParser;
import org.auscope.portal.core.services.responses.wfs.WFSResponse;
import org.auscope.portal.core.util.DOMUtil;
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

    private String gsmlpNameSpace = null;
    // ----------------------------------------------------------- Constructors

    @Autowired
    public BoreholeService(HttpServiceCaller serviceCaller, WFSGetFeatureMethodMaker methodMaker) {
        super(serviceCaller, methodMaker);
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
    public WFSResponse getAllBoreholes(String serviceURL, String boreholeName, String custodian,
            String dateOfDrillingStart,String dateOfDrillingEnd, int maxFeatures, FilterBoundingBox bbox, List<String> restrictToIDList, String outputFormat)
            throws Exception {
        String filterString;
        BoreholeFilter nvclFilter = new BoreholeFilter(boreholeName, custodian, dateOfDrillingStart, dateOfDrillingEnd,restrictToIDList);
        if (bbox == null) {
            filterString = nvclFilter.getFilterStringAllRecords();
        } else {
            filterString = nvclFilter.getFilterStringBoundingBox(bbox);
        }

        HttpRequestBase method = null;
        try {
            // Create a GetFeature request with an empty filter - get all
            method = this.generateWFSRequest(serviceURL, getTypeName(), null, filterString, maxFeatures, null,
                    ResultType.Results, outputFormat);
            String responseData = this.httpServiceCaller.getMethodResponseAsString(method);

            return new WFSResponse(responseData, method);
        } catch (Exception ex) {
            throw new PortalServiceException(method, ex);
        }
    }

    /**
     * Counts all boreholes from a given service url and return the response
     *
     * @param serviceURL
     * @param bbox
     *            Set to the bounding box in which to fetch results, otherwise set it to null
     * @param restrictToIDList
     *            [Optional] A list of gml:id values that the resulting filter should restrict its search space to
     * @return
     * @throws Exception
     */
    public int countAllBoreholes(String serviceURL, String boreholeName, String custodian,
            String dateOfDrillingStart,String dateOfDrillingEnd, int maxFeatures, FilterBoundingBox bbox, List<String> restrictToIDList)
            throws Exception {
        String filterString;
        BoreholeFilter nvclFilter = new BoreholeFilter(boreholeName, custodian, dateOfDrillingStart, dateOfDrillingEnd,restrictToIDList);
        if (bbox == null) {
            filterString = nvclFilter.getFilterStringAllRecords();
        } else {
            filterString = nvclFilter.getFilterStringBoundingBox(bbox);
        }

        HttpRequestBase method = null;
        try {
            // Create a GetFeature request with an empty filter - get all
            method = this.generateWFSRequest(serviceURL, getTypeName(), null, filterString, maxFeatures, null,
                    ResultType.Hits, null);
            String responseGml = this.httpServiceCaller.getMethodResponseAsString(method);

            Document doc = DOMUtil.buildDomFromString(responseGml, true);
            String number = (String) DOMUtil.compileXPathExpr("wfs:FeatureCollection/@numberOfFeatures", new WFSNamespaceContext()).evaluate(doc, XPathConstants.STRING);
            return Integer.parseInt(number);
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

            NVCLNamespaceContext nc = new NVCLNamespaceContext();

            //Get our ID's
            NodeList publishedDatasets = (NodeList) DOMUtil.compileXPathExpr("/wfs:FeatureCollection/gml:featureMembers/" + NVCLNamespaceContext.PUBLISHED_DATASETS_TYPENAME + "/nvcl:scannedBorehole", nc)
                                                            .evaluate(doc, XPathConstants.NODESET);
            for (int i = 0; i < publishedDatasets.getLength(); i++) {
                Node holeIdentifier = (Node) DOMUtil.compileXPathExpr("@xlink:href", nc)
                                                    .evaluate(publishedDatasets.item(i), XPathConstants.NODE);
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

    public String getFilter(String boreholeName, String custodian, String dateOfDrillingStart,String dateOfDrillingEnd,
            int maxFeatures, FilterBoundingBox bbox, List<String> ids, Boolean justNVCL) throws Exception {
        BoreholeFilter filter = new BoreholeFilter(boreholeName, custodian, dateOfDrillingStart,dateOfDrillingEnd, ids);
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
    public String getStyle(String filter, String color, String hyloggerFilter, String hyloggerColor,String gsmlpNameSpace) {
        setGsmlpNameSpace(gsmlpNameSpace);
        return getStyle(filter, color, hyloggerFilter, hyloggerColor);
    }
    public String getStyle(String filter, String color, String hyloggerFilter, String hyloggerColor) {
    	String ruleForHylogged = "";
    	if (getGsmlpNameSpace().equals("http://xmlns.geosciml.org/geosciml-portrayal/4.0") 
    			&& hyloggerFilter.isEmpty() == false ) { //For NVCL logged data, apply gsmlp:nvclCollection check, and put red colour.
        	ruleForHylogged = "</FeatureTypeStyle><FeatureTypeStyle><Rule>" +
				"<Name>Hylogged</Name>" +
				"<Title>Red Square</Title>" +
				"<Abstract>portal-style</Abstract>" +
				 hyloggerFilter +
				"<PointSymbolizer>" +
                "<Geometry><ogc:PropertyName>" + getGeometryName() + "</ogc:PropertyName></Geometry>" +
				"<Graphic>" +
				"<Mark>" +
				"<WellKnownName>square</WellKnownName>" +
				"<Fill>" +
				"<CssParameter name=\"fill\">"+
				hyloggerColor +
				"</CssParameter>" +
				"</Fill>" +
				"</Mark>" +
				"<Size>8</Size>" +
				"</Graphic>" +
				"</PointSymbolizer>" +
				"</Rule>";
    	}
    	
        String style = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
                + "<StyledLayerDescriptor version=\"1.0.0\" xmlns:gsmlp=\"" + getGsmlpNameSpace() + "\" "
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
                + "<Name>Boreholes</Name>"
                + filter
                + "<PointSymbolizer>"
                + "<Geometry><ogc:PropertyName>" + getGeometryName() + "</ogc:PropertyName></Geometry>"
                + "<Graphic>"
                + "<Mark>"
                + "<WellKnownName>square</WellKnownName>"
                + "<Fill>"
                + "<CssParameter name=\"fill\">"
                + color
                + "</CssParameter>"
                + "</Fill>"
                + "</Mark>"
                + "<Size>8</Size>"
                + "</Graphic>"
                + "</PointSymbolizer>"
                + "</Rule>"
                + ruleForHylogged 
                // Won't do this until SISS-1513 is fixed.
                //                + "<Rule>"
                //                + "<Name>National Virtual Core Library</Name>"
                //				+ hyloggerFilter
                //				+ "<PointSymbolizer>"
                //				+ "<Geometry><ogc:PropertyName>"
                //				+ getGeometryName()
                //				+ "</ogc:PropertyName></Geometry>"
                //				+ "<Graphic>"
                //				+ "<Mark>"
                //				+ "<WellKnownName>square</WellKnownName>"
                //				+ "<Fill>"
                //				+ "<CssParameter name=\"fill\">"
                //				+ hyloggerColor
                //				+ "</CssParameter>"
                //				+ "</Fill>"
                //				+ "</Mark>"
                //				+ "<Size>8</Size>"
                //				+ "</Graphic>"
                //				+ "</PointSymbolizer>"
                //				+ "</Rule>"
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
    public String getGsmlpNameSpace() {
        if (gsmlpNameSpace == null)
            return " xmlns:gsmlp=\"http://xmlns.geosciml.org/geosciml-portrayal/2.0\" ";
        else
            return gsmlpNameSpace;
    }
    public void setGsmlpNameSpace(String gsmlpNameSpace) {
        this.gsmlpNameSpace = gsmlpNameSpace;
    }
}
