package org.auscope.portal.server.web;

import java.net.URISyntaxException;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.client.utils.URIBuilder;
import org.auscope.portal.core.services.methodmakers.AbstractMethodMaker;
import org.springframework.stereotype.Repository;

/**
 * Class for making HTTP methods tailored to pressure DB webservice requests
 * 
 * @author Josh Vote
 *
 */
@Repository
public class PressureDBMethodMaker extends AbstractMethodMaker {

    /**
     * Makes a HTTP method for a pressure db getAvailableOM request.
     * 
     * @param serviceUrl
     * @param wellID
     * @return
     * @throws URISyntaxException
     */
    public HttpRequestBase makeGetAvailableOMMethod(String serviceUrl, String wellID) throws URISyntaxException {
        HttpGet method = new HttpGet();

        URIBuilder builder = new URIBuilder(urlPathConcat(serviceUrl, "getAvailableOM.html"));

        builder.setParameter("wellid", wellID);
        method.setURI(builder.build());

        return method;
    }

    /**
     * Makes a HTTP method for a pressure db download request.
     * 
     * @param serviceUrl
     * @param wellID
     * @return
     * @throws URISyntaxException
     */
    public HttpRequestBase makeDownloadMethod(String serviceUrl, String wellID, String[] features)
            throws URISyntaxException {
        HttpGet method = new HttpGet();
        URIBuilder builder = new URIBuilder(urlPathConcat(serviceUrl, "download.html"));
        builder.setParameter("wellid", wellID);

        for (String feature : features) {
            builder.addParameter("feature", feature);
        }

        method.setURI(builder.build());

        return method;
    }
    /**
     * Makes a HTTP method for a pressuredb-plot request.
     * 
     * @param serviceUrl
     * @param wellID
     * @return
     * @throws URISyntaxException
     */
    public HttpRequestBase makePlotMethod(String serviceUrl, String wellID, String[] features) throws URISyntaxException {
        HttpGet method = new HttpGet();

        URIBuilder builder = new URIBuilder(urlPathConcat(serviceUrl, "downloadjson.html"));

        builder.setParameter("wellid", wellID);
        
        for (String feature : features) {
            builder.addParameter("feature", feature);
        }
        
        method.setURI(builder.build());

        return method;
    }    
}
