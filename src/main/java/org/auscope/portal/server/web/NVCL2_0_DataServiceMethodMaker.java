package org.auscope.portal.server.web;

import java.net.URISyntaxException;

import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.client.utils.URIBuilder;
import org.auscope.portal.core.services.methodmakers.AbstractMethodMaker;
import org.springframework.stereotype.Repository;

@Repository
public class NVCL2_0_DataServiceMethodMaker extends AbstractMethodMaker {

    public HttpRequestBase getDownloadCSVMethod(String serviceUrl, String[] logIds) throws Exception {

        HttpGet method = new HttpGet(serviceUrl);
        URIBuilder builder = new URIBuilder(serviceUrl);

        for (String logId : logIds) {
            builder.addParameter("logid", logId);
        }

        method.setURI(builder.build());
        return method;
    }

    /**
     * Generates a method for making a request to NVCL 2.0 for the Mosaic imagery for a particular logId
     *
     * The response will be either HTML or a binary stream representing an image
     *
     * @param serviceUrl
     *            The URL of the NVCLDataService
     * @param logId
     *            The dataSetId (from a getLogCollection request) to query
     * @param logId
     *            The logID (from a getLogCollection request) to query
     * @param width
     *            [Optional] specify the number of column the images are to be displayed
     * @param startSampleNo
     *            [Optional] the first sample image to be displayed
     * @param endSampleNo
     *            [Optional] the last sample image to be displayed
     * @return
     * @throws URISyntaxException
     */
    public HttpRequestBase getTrayThumbNailMethodMaker(String dataSetId, String serviceUrl, String logId,
            Integer width, Integer startSampleNo, Integer endSampleNo) throws URISyntaxException {
        HttpGet method = new HttpGet();

        URIBuilder builder = new URIBuilder(urlPathConcat(serviceUrl, "mosaictraythumbnail.html"));

        //set all of the parameters
        builder.setParameter("logid", logId);
        builder.setParameter("datasetid", dataSetId);
        if (width != null) {
            builder.setParameter("width", width.toString());
        }
        if (startSampleNo != null) {
            builder.setParameter("startsampleno", startSampleNo.toString());
        }
        if (endSampleNo != null) {
            builder.setParameter("endsampleno", endSampleNo.toString());
        }

        //attach them to the method
        method.setURI(builder.build());

        return method;
    }

    /**
     * Generates a method for making a request for all NVCL logged elements that belong to a particular dataset
     *
     * @param serviceUrl
     *            The URL of the NVCLDataService
     * @param datasetId
     *            The dataset ID to query
     * @param forMosaicService
     *            [Optional] indicates if the getLogCollection service should generate a result specifically for the use of a Mosaic Service
     * @return
     * @throws URISyntaxException
     */
    public HttpRequestBase getLogCollectionMethod(String serviceUrl, String datasetId, Boolean forMosaicService)
            throws URISyntaxException {
        HttpGet method = new HttpGet();

        URIBuilder builder = new URIBuilder(urlPathConcat(serviceUrl, "getLogCollection.html"));

        //set all of the parameters
        builder.setParameter("datasetid", datasetId);
        if (forMosaicService != null) {
            builder.setParameter("mosaicsvc", forMosaicService.booleanValue() ? "yes" : "no");
        }

        //attach them to the method
        method.setURI(builder.build());

        return method;
    }

    /**
     * Generates a method for returning all algorithms supported by the NVCL analytical engine
     * @param serviceUrl
     * @return
     * @throws URISyntaxException
     */
    public HttpRequestBase getAlgorithms(String serviceUrl) throws URISyntaxException {
        HttpGet method = new HttpGet();
        URIBuilder builder = new URIBuilder(urlPathConcat(serviceUrl, "getAlgorithms.html"));
        method.setURI(builder.build());
        return method;
    }

    /**
     * Generates a method for returning all classifications for a given algorithm (supported by the NVCL analytical engine)
     * @param serviceUrl
     * @return
     * @throws URISyntaxException
     */
    public HttpRequestBase getClassifications(String serviceUrl, int algorithmOutputId) throws URISyntaxException {
        HttpGet method = new HttpGet();
        URIBuilder builder = new URIBuilder(urlPathConcat(serviceUrl, "getClassifications.html"));
        builder.setParameter("algorithmoutputid", Integer.toString(algorithmOutputId));
        method.setURI(builder.build());
        return method;
    }

}
