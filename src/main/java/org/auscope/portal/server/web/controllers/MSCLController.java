package org.auscope.portal.server.web.controllers;

import java.io.ByteArrayInputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathFactory;

import org.auscope.portal.core.server.controllers.BasePortalController;
import org.auscope.portal.core.services.namespaces.IterableNamespace;
import org.auscope.portal.core.services.responses.ows.OWSExceptionParser;
import org.auscope.portal.gsml.YilgarnNamespaceContext;
import org.auscope.portal.mscl.MSCLWFSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 * This class handles requests for MSCL observation data; it does so without
 * requiring the same to have defined SRSs. This is important as the GML Point,
 * into which the observation depths are encoded, doesn't have an SRS set.
 * @author bro879
 *
 */
@Controller
public class MSCLController extends BasePortalController {

	/**
	 * The MSCL WFS Service. It is used to interact with the WFS endpoint.
	 */
	private MSCLWFSService msclWfsService;

	/**
	 * Initialises a new instance of MSCLController class.
	 * @param msclWfsService
	 * 		The MSCL WFS Service that can be used by this class.
	 */
	@Autowired
	public MSCLController(MSCLWFSService msclWfsService) {
	    this.msclWfsService = msclWfsService;
	}

	/**
	 *
	 * @param serviceUrl
	 * 		The URL of the WFS's endpoint. It should be of the form: http://{domain}:{port}/{path}/wfs
	 * @param featureType
	 * 		The name of the feature type you wish to request (including its prefix if necessary).
	 * @param featureId
	 * 		The ID of the feature you want to return.
	 * @return
	 * 		A ModelAndView object encapsulating the WFS response along with an indicator of success or
	 * 		failure.
	 * @throws Exception
	 */
	@RequestMapping("/getMsclObservations.do")
	public ModelAndView getMsclObservations(
		@RequestParam("serviceUrl") final String serviceUrl,
		@RequestParam("typeName") final String featureType,
		@RequestParam("featureId") final String featureId) {

		try {
			String wfsResponse = msclWfsService.getWFSReponse(
					serviceUrl,
					featureType,
					featureId);

			// I have to wrap this response in a 'gml' JSON tag in order to keep the
			// "Download Feature" part happy.
			ModelMap data = new ModelMap();
		    data.put("gml", wfsResponse);
		    return generateJSONResponseMAV(true, data, null);
		}
		catch (Exception e) {
			return generateJSONResponseMAV(false, null, e.getMessage());
		}
	}

	@RequestMapping("/getMsclObservationsForGraph.do")
	public ModelAndView getMsclObservationsForGraph(
        @RequestParam("serviceUrl") final String serviceUrl,
        @RequestParam("boreholeHeaderId") final String boreholeHeaderId,
        @RequestParam("startDepth") final String startDepth,
        @RequestParam("endDepth") final String endDepth,
        @RequestParam("observationToReturn") final String observationToReturn) {

	    try {
            String wfsResponse = msclWfsService.getObservations(
                    serviceUrl,
                    boreholeHeaderId,
                    startDepth,
                    endDepth);

            DocumentBuilderFactory domFactory = DocumentBuilderFactory.newInstance();
            domFactory.setNamespaceAware(true); // never forget this!
            DocumentBuilder builder = domFactory.newDocumentBuilder();
            Document msclDoc = builder.parse(
                    new ByteArrayInputStream(wfsResponse.getBytes("UTF-8")));

            XPath xPath = XPathFactory.newInstance().newXPath();
//            xPath.setNamespaceContext(new MSCLNamespaceContext());
  
            xPath.setNamespaceContext(new IterableNamespace() {
                {
                    map.put("mscl", "http://example.org/mscl");
                    map.put("ogc", "http://www.opengis.net/ogc");
                    map.put("sa", "http://www.opengis.net/sampling/1.0");
                    map.put("om", "http://www.opengis.net/om/1.0");
                    map.put("wfs", "http://www.opengis.net/wfs");
                    map.put("xsi", "http://www.w3.org/2001/XMLSchema-instance");
                    map.put("gsml", "urn:cgi:xmlns:CGI:GeoSciML:2.0");
                    map.put("ows", "http://www.opengis.net/ows");
                    map.put("gml", "http://www.opengis.net/gml");
                    map.put("xlink", "http://www.w3.org/1999/xlink");
                }
            });

            // Do some rudimentary error testing:
            OWSExceptionParser.checkForExceptionResponse(msclDoc);

            ModelMap data = new ModelMap();

            XPathExpression expr = xPath.compile("//mscl:scanned_data/mscl:depth | //mscl:scanned_data/mscl:" + observationToReturn);
            NodeList results = (NodeList)expr.evaluate(msclDoc, XPathConstants.NODESET);
            ArrayList<ModelMap> series = new ArrayList<ModelMap>();
            
            // We check against length-1 because we look ahead +1 in the loop.
            for (int i = 0; i < results.getLength()-1; i++) {
                // Look at i and its neighbour, i+1, to see if they belong to the same scanned data object:
                Node result = results.item(i);
                Node resultNeighbour = results.item(i+1);
                
                if (!result.getParentNode().equals(resultNeighbour.getParentNode())) {
                    // If they're not the same then we need not go any further, it means
                    // that the observation being sought is missing at this particular depth
                    continue;
                }
                
                // If the results' parents do match then it means that the observation relates
                // to this depth.
                
                // Because we've processed the neighbour we can increment i so that we don't
                // try to handle it again:
                i++;

                ModelMap pair = new ModelMap();
                pair.put(result.getLocalName(), Float.parseFloat(result.getTextContent()));
                pair.put(resultNeighbour.getLocalName(), Float.parseFloat(resultNeighbour.getTextContent()));
                series.add(pair);
            }
            
            ModelMap[] seriesArray = new ModelMap[series.size()]; 
            series.toArray(seriesArray);
            Arrays.<ModelMap>sort(seriesArray, new Comparator<ModelMap>() {
                public int compare(ModelMap o1, ModelMap o2) {
                    // Just use float's comparison implementation:
                    return ((Float)o1.get("depth")).compareTo((Float)o2.get("depth"));
                }
            });
            
            data.put("series", seriesArray);
            return generateJSONResponseMAV(true, data, null);
        }
        catch (Exception e) {
            return generateJSONResponseMAV(false, null, e.getMessage());
        }
	} 
}