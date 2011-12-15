package org.auscope.portal.server.web.controllers;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;

import org.apache.commons.httpclient.HttpMethodBase;
import org.apache.commons.httpclient.methods.GetMethod;
import org.auscope.portal.csw.CSWGetRecordResponse;
import org.auscope.portal.csw.CSWMethodMakerGetDataRecords;
import org.auscope.portal.csw.CSWMethodMakerGetDataRecords.ResultType;
import org.auscope.portal.server.domain.filter.FilterBoundingBox;
import org.auscope.portal.server.domain.filter.IFilter;
import org.auscope.portal.server.domain.filter.SimpleBBoxFilter;
import org.auscope.portal.server.domain.ows.OWSException;
import org.auscope.portal.server.domain.ows.OWSExceptionParser;
import org.auscope.portal.server.domain.vocab.Description;
import org.auscope.portal.server.domain.vocab.DescriptionFactory;
import org.auscope.portal.server.domain.vocab.VocabNamespaceContext;
import org.auscope.portal.server.util.DOMUtil;
import org.auscope.portal.server.util.FileIOUtil;
import org.auscope.portal.server.util.PortalPropertyPlaceholderConfigurer;
import org.auscope.portal.server.web.SISSVocMethodMaker;
import org.auscope.portal.server.web.WFSGetFeatureMethodMaker;
import org.auscope.portal.server.web.service.CSWServiceItem;
import org.auscope.portal.server.web.service.HttpServiceCaller;
import org.auscope.portal.server.web.view.JSONView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.xml.sax.SAXException;

import sun.misc.IOUtils;

/**
 * Provides a controller interface into some basic administration functionality/tests
 * @author Josh Vote
 *
 */
@Controller
public class AdminController {


    /** For testing basic requests */
    private HttpServiceCaller serviceCaller;
    /** For accessing the various CSW's*/
    private @Qualifier(value = "cswServiceList") ArrayList cswServiceList;
    /** for checking config options*/
    private PortalPropertyPlaceholderConfigurer portalProperties;

    /**
     * Creates a new instance of this class
     */
    @Autowired
    public AdminController(HttpServiceCaller serviceCaller,
            @Qualifier(value = "cswServiceList") ArrayList cswServiceList,
            PortalPropertyPlaceholderConfigurer portalProperties) {
        this.serviceCaller = serviceCaller;
        this.cswServiceList = cswServiceList;
        this.portalProperties = portalProperties;
    }

    /**
     * Generates a ModelAndView JSON response with the specified params
     * @param success Whether a test succeeded or not
     * @param warnings can be null - list of warning strings
     * @param errors can be null - list of error strings
     * @param details can be null - list of general information strings
     * @return
     */
    private ModelAndView generateTestResponse(boolean success, List<String> errors, List<String> warnings, List<String> details) {
        return generateTestResponse(success,
                errors == null ? null : errors.toArray(new String[errors.size()]),
                warnings == null ? null : warnings.toArray(new String[warnings.size()]),
                details == null ? null : details.toArray(new String[details.size()]));
    }

    /**
     * Generates a ModelAndView JSON response with the specified params
     * @param success Whether a test succeeded or not
     * @param warnings can be null - list of warning strings
     * @param errors can be null - list of error strings
     * @param details can be null - list of general information strings
     * @return
     */
    private ModelAndView generateTestResponse(boolean success, String[] errors, String[] warnings, String[] details) {
        JSONView view = new JSONView();
        ModelMap model = new ModelMap();

        if (warnings == null) {
            warnings = new String[0];
        }
        if (errors == null) {
            errors = new String[0];
        }
        if (details == null) {
            details = new String[0];
        }

        model.put("success", success);
        model.put("warnings", warnings);
        model.put("errors", errors);
        model.put("details", details);

        return new ModelAndView(view, model);

    }

    /**
     * Performs an external connectivity test through the HttpServiceCaller
     * @return
     */
    @RequestMapping("/testExternalConnectivity.do")
    public ModelAndView testExternalConnectivity() {
        final String httpGetUrl = "http://www.google.com";
        final String httpsGetUrl = "https://www.google.com";
        GetMethod httpGet = new GetMethod(httpGetUrl);
        GetMethod httpsGet = new GetMethod(httpsGetUrl);

        //Make the request, ignore the response
        try {
            serviceCaller.getMethodResponseAsString(httpGet, serviceCaller.getHttpClient());
        } catch (Exception ex) {
            return generateTestResponse(false, new String[] {String.format("Unable to connect to %1$s. The error was %2$s", httpGetUrl, ex)},null, null);
        }

        //Failing HTTPS is only a warning
        try {
            serviceCaller.getMethodResponseAsString(httpsGet, serviceCaller.getHttpClient());
        } catch (Exception ex) {
            return generateTestResponse(true, null, new String[] {String.format("There was a problem with HTTPS when connecting to %1$s. The error was %2$s", httpsGetUrl, ex)},null);
        }

        String[] details = new String[] {
            String.format("Succesfully connected via HTTP to %1$s", httpGetUrl),
            String.format("Succesfully connected via HTTPS to %1$s", httpsGetUrl)
        };
        return generateTestResponse(true, null, null, details);
    }

    /**
     * Performs an external connectivity test to the various CSW's through the HttpServiceCaller
     * @return
     */
    @RequestMapping("/testCSWConnectivity.do")
    public ModelAndView testCSWConnectivity() {
        List<String> errors = new ArrayList<String>();
        List<String> warnings = new ArrayList<String>();
        List<String> details = new ArrayList<String>();
        int successfulRequests = 0;
        final int numRecordsToRequest = 1;

        //Iterate our configured registries performing a simple CSW request to ensure they are 'available'
        for (Object itemObj : cswServiceList) {
            //This will be caused by bad configuration
            if (!(itemObj instanceof CSWServiceItem)) {
                errors.add(String.format("The 'cswServiceList' has an item that cannot be cast into org.auscope.portal.server.web.service.CSWServiceItem: '%1$s'", itemObj));
                continue;
            }

            //We attempt to connect and request a single record
            CSWServiceItem item = (CSWServiceItem) itemObj;
            InputStream response = null;
            try {
                CSWMethodMakerGetDataRecords methodMaker = new CSWMethodMakerGetDataRecords(item.getServiceUrl());
                HttpMethodBase method = methodMaker.makeMethod(null, ResultType.Results, numRecordsToRequest);
                response = serviceCaller.getMethodResponseAsStream(method, serviceCaller.getHttpClient());
            } catch (Exception ex) {
                warnings.add(String.format("Unable to request a CSW record from '%1$s': %2$s", item.getServiceUrl(), ex));
                continue;
            }

            //Then test the response
            try {
                Document responseDoc = DOMUtil.buildDomFromStream(response);
                OWSExceptionParser.checkForExceptionResponse(responseDoc);

                CSWGetRecordResponse responseRecs = new CSWGetRecordResponse(item, responseDoc);
                if (numRecordsToRequest != responseRecs.getRecords().size()) {
                    throw new Exception(String.format("Expecting a response with %1$s records. Got %2$s records instead.", numRecordsToRequest, responseRecs.getRecords().size()));
                }

                details.add(String.format("Succesfully requested %1$s record(s) from '%2$s'. There are %3$s records available.", numRecordsToRequest, item.getServiceUrl(), responseRecs.getRecordsMatched()));
                successfulRequests++;
            } catch (Exception ex) {
                warnings.add(String.format("Unable to parse a CSW record response from '%1$s': %2$s", item.getServiceUrl(), ex));
                continue;
            }
        }

        boolean success = errors.size() == 0 && successfulRequests > 0;
        return generateTestResponse(success, errors, warnings, details);
    }

    /**
     * Tests that the Vocabulary service is up and running
     * @return
     */
    @RequestMapping("/testVocabulary.do")
    public ModelAndView testVocabulary() throws Exception {
        List<String> errors = new ArrayList<String>();
        List<String> warnings = new ArrayList<String>();
        List<String> details = new ArrayList<String>();

        //Has the user setup the portal?
        String vocabServiceUrl = portalProperties.resolvePlaceholder("HOST.vocabService.url");
        details.add(String.format("Vocabulary service URL has been resolved as '%1$s'", vocabServiceUrl));
        try {
            new URL(vocabServiceUrl);
        } catch (Exception ex) {
            errors.add(String.format("HOST.vocabService.url resolves into an invalid URL '%1$s'. Exception - %2$s", vocabServiceUrl, ex));
            return generateTestResponse(false, errors, warnings, details); // no point proceeding in this case
        }

        //Is the repository info returning valid XML?
        SISSVocMethodMaker methodMaker = new SISSVocMethodMaker();
        HttpMethodBase method = methodMaker.getRepositoryInfoMethod(vocabServiceUrl);
        try {
            String serviceResponse = serviceCaller.getMethodResponseAsString(method, serviceCaller.getHttpClient());
            try {
                DOMUtil.buildDomFromString(serviceResponse);
            } catch (Exception ex) {
                errors.add(String.format("Unable to XML parse a repository info response from '%1$s'. Exception - %2$s", vocabServiceUrl, ex));
            }
        } catch (Exception ex) {
            errors.add(String.format("Unable to query for repository info '%1$s'. Exception - %2$s", vocabServiceUrl, ex));
        }


        //Is the commodity vocab up and running (does it have any concepts?)
        //We want a pretty good level of error granularity here (hence the nested try-catch blocks)
        method = methodMaker.getConceptByLabelMethod(vocabServiceUrl, VocabController.COMMODITY_REPOSITORY, "*");
        details.add(String.format("Test commodities URL has been resolved as '%1$s'", method.getURI()));
        try {
            String serviceResponse = serviceCaller.getMethodResponseAsString(method, serviceCaller.getHttpClient());
            Document doc = null;
            try {
                doc = DOMUtil.buildDomFromString(serviceResponse);

                try {
                    XPathExpression rdfExpression = DOMUtil.compileXPathExpr("rdf:RDF", new VocabNamespaceContext());
                    Node rdfNode = (Node) rdfExpression.evaluate(doc, XPathConstants.NODE);
                    if (rdfNode == null) {
                        throw new Exception("looking up rdf:RDF returned null");
                    }

                    DescriptionFactory df = new DescriptionFactory();
                    try {
                        Description[] description = df.parseFromRDF(rdfNode);
                        if (description == null || description.length == 0) {
                            warnings.add(String.format("commodities - cannot parse descriptions - The service returned valid XML but no descriptions could be parsed. No Exceptions"));
                        }
                    } catch (Exception ex) {
                        warnings.add(String.format("commodities - cannot parse descriptions - The service returned valid XML but it couldn't be turned into a set of Description objects. Exception - %1$s", ex));
                    }
                } catch (Exception ex) {
                    warnings.add(String.format("commodities - cannot parse descriptions - The service returned valid XML but it didn't contain a root RDF node. Exception - %1$s", ex));
                }
            } catch (Exception ex) {
                warnings.add(String.format("commodities - cannot parse descriptions - The service returned invalid XML. Exception - %1$s", ex));
            }
        } catch (Exception ex) {
            warnings.add(String.format("commodities - cannot get response from service. Exception - %1$s", ex));
        }

        return generateTestResponse(errors.size() == 0, errors, warnings, details);
    }


    /**
     * Tests that all serviceUrls + typeNames are accessible via WFS. There must be a 1-1 correspondence between serviceUrls and typeNames
     *
     * Any duplicated serviceUrl + typename combos will be culled
     *
     * This method is intentionally avoiding the WFSService to focus on the WFS request/response (ignoring the XSLT pipeline)
     * @return
     */
    @RequestMapping("/testWFS.do")
    public ModelAndView testWFS(@RequestParam("serviceUrls") String[] serviceUrls,
                                @RequestParam("typeNames") String[] typeNames,
                                @RequestParam("bbox") String bboxJson) {
        List<String> errors = new ArrayList<String>();
        List<String> warnings = new ArrayList<String>();
        List<String> details = new ArrayList<String>();

        if (serviceUrls == null || typeNames == null || serviceUrls.length != typeNames.length) {
            throw new IllegalArgumentException("serviceUrls.length != typeNames.length");
        }

        //No point in proceeding with test without a valid bbox
        FilterBoundingBox bbox = FilterBoundingBox.attemptParseFromJSON(bboxJson);
        if (bbox == null) {
            errors.add(String.format("The backend cannot parse the provided bbox string into a FilterBoundingBox - %1$s", bboxJson));
            return generateTestResponse(false, errors, warnings, details);
        }

        //we remember all serviceUrl+typeName combos to skip any duplicates
        Map<String, List<String>> wfsRequestMap = new HashMap<String, List<String>>();

        //Iterate our service urls, making a basic WFS GetFeature and more complicated BBOX request to each
        WFSGetFeatureMethodMaker methodMaker = new WFSGetFeatureMethodMaker();
        for (int i = 0; i < serviceUrls.length; i++) {
            String serviceUrl = serviceUrls[i];
            String typeName = typeNames[i];

            //Ensure we haven't already requested this type from this URL
            List<String> typesRequested = wfsRequestMap.get(serviceUrl);
            if (typesRequested == null) {
                typesRequested = new ArrayList<String>();
                wfsRequestMap.put(serviceUrl, typesRequested);
            }
            if (typesRequested.contains(typeName)) {
                continue;
            } else {
                typesRequested.add(typeName);
            }

            //Make a request for a single feature, no filter
            HttpMethodBase method = methodMaker.makeMethod(serviceUrl, typeName, 1);
            InputStream response = null;
            try {
                response = serviceCaller.getMethodResponseAsStream(method, serviceCaller.getHttpClient());
                Document doc = DOMUtil.buildDomFromStream(response);
                OWSExceptionParser.checkForExceptionResponse(doc);
            } catch (OWSException ex) {
                errors.add(String.format("WFS '%1$s' returned an OWS exception for type '%2$s' - %3$s", serviceUrl, typeName, ex));
            } catch (Exception ex) {
                errors.add(String.format("WFS '%1$s' cannot be reached or is returning invalid XML for type '%2$s' - %3$s", serviceUrl, typeName, ex));
            } finally {
                FileIOUtil.closeQuietly(response);
            }

            //Next make a slightly more complex BBOX filter (to ensure we have a spatial field set at the WFS)
            IFilter filter = new SimpleBBoxFilter();
            String filterString = filter.getFilterStringBoundingBox(bbox);
            method = methodMaker.makeMethod(serviceUrl, typeName, filterString, 1, bbox.getBboxSrs(), WFSGetFeatureMethodMaker.ResultType.Results);
            response = null;
            try {
                response = serviceCaller.getMethodResponseAsStream(method, serviceCaller.getHttpClient());
                Document doc = DOMUtil.buildDomFromStream(response);
                OWSExceptionParser.checkForExceptionResponse(doc);
            } catch (OWSException ex) {
                warnings.add(String.format("WFS '%1$s' returned an OWS exception for type '%2$s' with a bbox request - %3$s", serviceUrl, typeName, ex));
            } catch (Exception ex) {
                warnings.add(String.format("WFS '%1$s' cannot be reached or is returning invalid XML for type '%2$s'  with a bbox request - %3$s", serviceUrl, typeName, ex));
            } finally {
                FileIOUtil.closeQuietly(response);
            }
        }

        //Some nice statistical info
        int serviceCount = wfsRequestMap.size();
        int typeCount = 0;
        for (String key : wfsRequestMap.keySet()) {
            typeCount += wfsRequestMap.get(key).size();
        }

        details.add(String.format("Testing %1$s different type names spread over %2$s unique WFS endpoints", typeCount, serviceCount));

        return generateTestResponse(errors.size() == 0, errors, warnings, details);
    }
}
