package org.auscope.portal.server.web.service;

import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;

import org.apache.commons.httpclient.HttpMethodBase;
import org.auscope.portal.core.server.http.HttpServiceCaller;
import org.auscope.portal.core.services.admin.AdminDiagnosticResponse;
import org.auscope.portal.core.services.admin.AdminService;
import org.auscope.portal.core.services.methodmakers.sissvoc.SISSVoc2MethodMaker;
import org.auscope.portal.core.services.namespaces.VocabNamespaceContext;
import org.auscope.portal.core.services.responses.vocab.Description;
import org.auscope.portal.core.services.responses.vocab.DescriptionFactory;
import org.auscope.portal.core.util.DOMUtil;
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
public class AuScopeAdminService extends AdminService {

    /**
     * Creates a new AdminService
     * @param serviceCaller For testing basic requests
     * @param cswServiceList For accessing the various CSW's
     * @param portalProperties for checking config options
     */
    @Autowired
    public AuScopeAdminService(HttpServiceCaller serviceCaller) {
        super(serviceCaller);
    }

    /**
     * Tests connectivity to a particular SISSVoc service - also tests some basic SISSVoc requests
     * @param vocabServiceUrl The SISSVoc endpoint
     * @return
     */
    public AdminDiagnosticResponse sissVoc2Connectivity(String vocabServiceUrl) {
        AdminDiagnosticResponse diagnosticResponse = new AdminDiagnosticResponse();

        //Is the repository info request returning valid XML?
        SISSVoc2MethodMaker methodMaker = new SISSVoc2MethodMaker();
        HttpMethodBase method = methodMaker.getRepositoryInfoMethod(vocabServiceUrl);
        try {
            String serviceResponse = serviceCaller.getMethodResponseAsString(method);
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
        method = methodMaker.getConceptByLabelMethod(vocabServiceUrl, "commodity_vocab", "*");
        try {
            diagnosticResponse.addDetail(String.format("Test commodities URL has been resolved as '%1$s'", method.getURI()));
        } catch (Exception ex) {
            diagnosticResponse.addDetail(String.format("Test commodities URL has been resolved as UNRESOLVABLE - '%1$s'", ex));
        }
        try {
            String serviceResponse = serviceCaller.getMethodResponseAsString(method);
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
                        diagnosticResponse.addError(String.format("commodities - cannot parse descriptions - The service returned valid XML but it couldn't be turned into a set of Description objects. Exception - %1$s", ex));
                    }
                } catch (Exception ex) {
                    diagnosticResponse.addError(String.format("commodities - cannot parse descriptions - The service returned valid XML but it didn't contain a root RDF node. Exception - %1$s", ex));
                }
            } catch (Exception ex) {
                diagnosticResponse.addError(String.format("commodities - cannot parse descriptions - The service returned invalid XML. Exception - %1$s", ex));
            }
        } catch (Exception ex) {
            diagnosticResponse.addError(String.format("commodities - cannot get response from service. Exception - %1$s", ex));
        }

        return diagnosticResponse;
    }
}
