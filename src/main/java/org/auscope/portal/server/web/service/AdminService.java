package org.auscope.portal.server.web.service;

import java.io.InputStream;
import java.net.URL;
import java.util.List;

import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;

import org.apache.commons.httpclient.HttpMethodBase;
import org.apache.commons.httpclient.methods.GetMethod;
import org.auscope.portal.csw.CSWGetRecordResponse;
import org.auscope.portal.csw.CSWMethodMakerGetDataRecords;
import org.auscope.portal.csw.CSWMethodMakerGetDataRecords.ResultType;
import org.auscope.portal.server.domain.admin.AdminDiagnosticResponse;
import org.auscope.portal.server.domain.ows.OWSExceptionParser;
import org.auscope.portal.server.domain.vocab.Description;
import org.auscope.portal.server.domain.vocab.DescriptionFactory;
import org.auscope.portal.server.domain.vocab.VocabNamespaceContext;
import org.auscope.portal.server.util.DOMUtil;
import org.auscope.portal.server.web.SISSVocMethodMaker;
import org.auscope.portal.server.web.controllers.VocabController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

/**
 * Service class providing access into some portal low level functionality purely for the purposes
 * of getting diagnostic information
 * @author Josh Vote
 *
 */
@Service
public class AdminService {
    /** For testing basic requests */
    private HttpServiceCaller serviceCaller;


    /**
     * Creates a new AdminService
     * @param serviceCaller For testing basic requests
     * @param cswServiceList For accessing the various CSW's
     * @param portalProperties for checking config options
     */
    @Autowired
    public AdminService(HttpServiceCaller serviceCaller) {
        super();
        this.serviceCaller = serviceCaller;
    }


    /**
     * Tests external connectivity by attempting to access the specified URLs
     * @param urlsToTest The URLs tp test
     * @return
     */
    public AdminDiagnosticResponse externalConnectivity(URL[] urlsToTest) {
        AdminDiagnosticResponse response = new AdminDiagnosticResponse();
        for (URL url : urlsToTest) {
            String protocol = url.getProtocol().toLowerCase();
            String urlString = url.toString();

            try {
                GetMethod method = new GetMethod(urlString);
                serviceCaller.getMethodResponseAsString(method, serviceCaller.getHttpClient()); //we dont care about the response
                response.addDetail(String.format("Succesfully connected to %1$s via '%2$s'.", urlString, protocol));
            } catch (Exception ex) {
                //We treat HTTP errors as critical, non http as warnings (such as https)
                if (protocol.equals("http")) {
                   response.addError(String.format("Unable to connect to %1$s via http. The error was %2$s", urlString, ex));
                } else {
                   response.addWarning(String.format("Unable to connect to %1$s via '%2$s'. The error was %3$s", urlString, protocol, ex));
                }
            }
        }

        return response;
    }

    /**
     * Tests connectivity to a set of CSW's - also tests some basic CSW requests
     * @param serviceItems The services to test
     * @return
     */
    public AdminDiagnosticResponse cswConnectivity(List<CSWServiceItem> serviceItems) {
        AdminDiagnosticResponse response = new AdminDiagnosticResponse();
        final int numRecordsToRequest = 1;

        //Iterate our configured registries performing a simple CSW request to ensure they are 'available'
        for (CSWServiceItem item : serviceItems) {
            InputStream responseStream = null;
            try {
                CSWMethodMakerGetDataRecords methodMaker = new CSWMethodMakerGetDataRecords(item.getServiceUrl());
                HttpMethodBase method = methodMaker.makeMethod(null, ResultType.Results, numRecordsToRequest);
                responseStream = serviceCaller.getMethodResponseAsStream(method, serviceCaller.getHttpClient());
            } catch (Exception ex) {
                response.addWarning(String.format("Unable to request a CSW record from '%1$s': %2$s", item.getServiceUrl(), ex));
                continue;
            }

            //Then test the response
            try {
                Document responseDoc = DOMUtil.buildDomFromStream(responseStream);
                OWSExceptionParser.checkForExceptionResponse(responseDoc);

                CSWGetRecordResponse responseRecs = new CSWGetRecordResponse(item, responseDoc);
                if (numRecordsToRequest != responseRecs.getRecords().size()) {
                    throw new Exception(String.format("Expecting a response with %1$s records. Got %2$s records instead.", numRecordsToRequest, responseRecs.getRecords().size()));
                }

                response.addDetail(String.format("Succesfully requested %1$s record(s) from '%2$s'. There are %3$s records available.", numRecordsToRequest, item.getServiceUrl(), responseRecs.getRecordsMatched()));
            } catch (Exception ex) {
                response.addWarning(String.format("Unable to parse a CSW record response from '%1$s': %2$s", item.getServiceUrl(), ex));
                continue;
            }
        }

        return response;
    }

    /**
     * Tests connectivity to a particular SISSVoc service - also tests some basic SISSVoc requests
     * @param vocabServiceUrl The SISSVoc endpoint
     * @return
     */
    public AdminDiagnosticResponse vocabConnectivity(String vocabServiceUrl) {
        AdminDiagnosticResponse diagnosticResponse = new AdminDiagnosticResponse();

        //Is the repository info request returning valid XML?
        SISSVocMethodMaker methodMaker = new SISSVocMethodMaker();
        HttpMethodBase method = methodMaker.getRepositoryInfoMethod(vocabServiceUrl);
        try {
            String serviceResponse = serviceCaller.getMethodResponseAsString(method, serviceCaller.getHttpClient());
            try {
                DOMUtil.buildDomFromString(serviceResponse);
            } catch (Exception ex) {
                diagnosticResponse.addError(String.format("Unable to XML parse a repository info response from '%1$s'. Exception - %2$s", vocabServiceUrl, ex));
            }
        } catch (Exception ex) {
            diagnosticResponse.addError(String.format("Unable to query for repository info '%1$s'. Exception - %2$s", vocabServiceUrl, ex));
        }

        //Is the commodity vocab up and running (does it have any concepts?)
        //We want a pretty good level of error granularity here (hence the nested try-catch blocks)
        method = methodMaker.getConceptByLabelMethod(vocabServiceUrl, VocabController.COMMODITY_REPOSITORY, "*");
        try {
            diagnosticResponse.addDetail(String.format("Test commodities URL has been resolved as '%1$s'", method.getURI()));
        } catch (Exception ex) {
            diagnosticResponse.addDetail(String.format("Test commodities URL has been resolved as UNRESOLVABLE - '%1$s'", ex));
        }
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
                            diagnosticResponse.addWarning(String.format("commodities - cannot parse descriptions - The service returned valid XML but no descriptions could be parsed. No Exceptions"));
                        }
                    } catch (Exception ex) {
                        diagnosticResponse.addWarning(String.format("commodities - cannot parse descriptions - The service returned valid XML but it couldn't be turned into a set of Description objects. Exception - %1$s", ex));
                    }
                } catch (Exception ex) {
                    diagnosticResponse.addWarning(String.format("commodities - cannot parse descriptions - The service returned valid XML but it didn't contain a root RDF node. Exception - %1$s", ex));
                }
            } catch (Exception ex) {
                diagnosticResponse.addWarning(String.format("commodities - cannot parse descriptions - The service returned invalid XML. Exception - %1$s", ex));
            }
        } catch (Exception ex) {
            diagnosticResponse.addWarning(String.format("commodities - cannot get response from service. Exception - %1$s", ex));
        }

        return diagnosticResponse;
    }
}
