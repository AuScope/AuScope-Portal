package org.auscope.portal.pressuredb;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import javax.xml.xpath.XPathFactoryConfigurationException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.client.methods.HttpRequestBase;
import org.auscope.portal.core.services.PortalServiceException;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 * Static utility class for parsing possible exception responses from the pressure db dataservices
 * 
 * @author JoshVote
 *
 */
public class PressureDBExceptionParser {

    private static final Log log = LogFactory.getLog(PressureDBExceptionParser.class);

    /**
     * Will attempt to parse an <DataServiceError> element
     *
     * Will throw an PressureDBException if document does contain an <DataServiceError>, otherwise it will do nothing
     * 
     * @param doc
     * @throws PressureDBException
     */
    public static void checkForExceptionResponse(Document doc) throws PortalServiceException {
    	XPathFactory factory;
        try {
            factory = XPathFactory.newInstance(XPathFactory.DEFAULT_OBJECT_MODEL_URI, "org.apache.xpath.jaxp.XPathFactoryImpl", null);
            XPath xPath = factory.newXPath();   

            //Check for an exception response
            NodeList exceptionNodes = (NodeList) xPath.evaluate("/DataServiceError", doc, XPathConstants.NODESET);
            if (exceptionNodes.getLength() > 0) {
                Node exceptionNode = exceptionNodes.item(0);

                throw new PortalServiceException((HttpRequestBase) null, exceptionNode.getTextContent());
            }
        } catch (XPathExpressionException | XPathFactoryConfigurationException ex) {
            //This should *hopefully* never occur
            log.error("Error whilst attempting to check for errors in PressureDB response: ", ex);
        }   
    }
}
