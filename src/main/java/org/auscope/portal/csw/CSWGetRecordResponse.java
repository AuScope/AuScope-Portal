package org.auscope.portal.csw;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import java.util.ArrayList;
import java.util.List;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

/**
 * User: Mathew Wyatt
 * Date: 11/02/2009
 * Time: 11:56:00 AM
 */
public class CSWGetRecordResponse {
    private Document recordResponse;

    // -------------------------------------------------------------- Constants

    /** Log object for this class. */
    protected final Log log = LogFactory.getLog(getClass());

    // --------------------------------------------------------- Public Methods


    public CSWGetRecordResponse(Document getRecordResponseText) {
        this.recordResponse = getRecordResponseText;
    }

    /**
     * Returns the number of CSWRecords as recorded in the header of the GetRecordsResponse element
     *
     * If the document cannot be parsed for the required fields 0 will be returned
     * @return
     * @throws XPathExpressionException
     */
    public int getCSWRecordsCount() throws XPathExpressionException {
        XPath xPath = XPathFactory.newInstance().newXPath();
        xPath.setNamespaceContext(new CSWNamespaceContext());

        String recordCountExpression = "/csw:GetRecordsResponse/csw:SearchResults/@numberOfRecordsMatched";
        Node node = (Node) xPath.evaluate( recordCountExpression
                                                  , this.recordResponse
                                                  , XPathConstants.NODE);

        if (node == null) {
            log.warn("Couldn't find numberOfRecordsMatched element. Returning 0");
            return 0;
        }

        int count = 0;
        try {
            count = Integer.parseInt(node.getTextContent());
        } catch (NumberFormatException ex) {
            log.warn("numberOfRecordsMatched format is not parseable into an int", ex);
        }
        return count;
    }

    public List<CSWRecord> getCSWRecords() throws XPathExpressionException {

        XPath xPath = XPathFactory.newInstance().newXPath();
        xPath.setNamespaceContext(new CSWNamespaceContext());

        String serviceTitleExpression
                = "/csw:GetRecordsResponse/csw:SearchResults/gmd:MD_Metadata";

        NodeList nodes = (NodeList) xPath.evaluate( serviceTitleExpression
                                                  , this.recordResponse
                                                  , XPathConstants.NODESET );

        log.info("Number of records retrieved from GeoNetwork: " + nodes.getLength());

        List<CSWRecord> records = new ArrayList<CSWRecord>(nodes.getLength());

        for(int i=0; i<nodes.getLength(); i++ ) {
            Node metadataNode = nodes.item(i);
            CSWRecordTransformer transformer = new CSWRecordTransformer(metadataNode);
            CSWRecord newRecord = transformer.transformToCSWRecord();
            records.add(newRecord);
            log.trace("GN layer " + (i+1) + " : " + newRecord.toString());
        }

        return records;
    }

}
