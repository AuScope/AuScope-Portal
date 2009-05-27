package org.auscope.portal.server.web.mineraloccurrence;

import org.auscope.portal.csw.CSWRecord;
import org.auscope.portal.csw.CSWClient;
import org.xml.sax.SAXException;
import org.apache.xmlbeans.XmlException;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.io.Serializable;
import java.io.IOException;

import net.sf.json.JSONArray;

import javax.xml.xpath.XPathExpressionException;
import javax.xml.parsers.ParserConfigurationException;

/**
 * User: Mathew Wyatt
 * Date: 18/05/2009
 * Time: 9:27:45 AM
 */
@Repository
public class MineralOccurrencesCSWHelper implements IMineralOccurrencesCSWHelper {
    private static Logger logger = Logger.getLogger(MineralOccurrencesCSWHelper.class);

    public ArrayList<String> getMineralOccurrenceServiceUrls() {

        try {
            CSWRecord[] cswRecords = new CSWClient("http://auscope-portal.arrc.csiro.au/geonetwork/srv/en/csw", "<?xml+version=\"1.0\"+encoding=\"UTF-8\"?><Filter+xmlns=\"http://www.opengis.net/ogc\"+xmlns:gml=\"http://www.opengis.net/gml\"><And><PropertyIsEqualTo><PropertyName>keyword</PropertyName><Literal>WFS</Literal></PropertyIsEqualTo><PropertyIsEqualTo><PropertyName>keyword</PropertyName><Literal>mo:MineralOccurrence</Literal></PropertyIsEqualTo></And></Filter>&constraintLanguage=FILTER&constraint_language_version=1.1.0").getRecordResponse().getCSWRecords();

            ArrayList<String> urls = new ArrayList<String>();
            for(CSWRecord record : cswRecords) {
                urls.add(record.getServiceUrl());
            }

            return urls;
        } catch (XPathExpressionException e) {
            logger.error(e);
        } catch (IOException e) {
            logger.error(e);
        } catch (ParserConfigurationException e) {
            logger.error(e);
        } catch (SAXException e) {
            logger.error(e);
        } catch (XmlException e) {
            logger.error(e);
        }

        return new ArrayList<String>();
    }

    public ArrayList<String> getMiningActivityServiceUrls() {
        return null;
    }

    public ArrayList<String> getMineServiceUrls() {
        return null;
    }
}
