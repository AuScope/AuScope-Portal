package org.auscope.portal.server.web.service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.Header;
import org.apache.http.client.methods.HttpRequestBase;
import org.auscope.portal.core.server.http.HttpServiceCaller;
import org.auscope.portal.core.util.DOMUtil;
import org.auscope.portal.server.domain.nvcldataservice.CSVDownloadResponse;
import org.auscope.portal.server.domain.nvcldataservice.GetLogCollectionResponse;
import org.auscope.portal.server.domain.nvcldataservice.MosaicResponse;
import org.auscope.portal.server.domain.nvcldataservice.TrayThumbNailResponse;
import org.auscope.portal.server.web.NVCL2_0_DataServiceMethodMaker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

@Service
public class NVCL2_0_DataService{

    private final Log log = LogFactory.getLog(getClass());
    private NVCL2_0_DataServiceMethodMaker nvclMethodMaker;
    private HttpServiceCaller httpServiceCaller;

    @Autowired
    public NVCL2_0_DataService(HttpServiceCaller httpServiceCaller,
            NVCL2_0_DataServiceMethodMaker nvclMethodMaker) {
        this.nvclMethodMaker=nvclMethodMaker;
        this.httpServiceCaller=httpServiceCaller;
    }


    /**
     * Makes a CSV download request from NVCL 2.0 service and returns the resulting data in a CSVDownloadResponse
     *
     * Response should be a stream of bytes for a CSV file
     *
     * @param serviceUrl The URL of an observation and measurements URL (obtained from a getDatasetCollection response)
     * @param datasetId The dataset to download
     * @return
     * @throws Exception
     */

    public CSVDownloadResponse getNVCL2_0_CSVDownload(String serviceUrl, String [] logIds) throws Exception {

        serviceUrl += "downloadscalars.html";

        HttpRequestBase method = nvclMethodMaker.getDownloadCSVMethod(serviceUrl,logIds);
        InputStream responseStream = httpServiceCaller.getMethodResponseAsStream(method);
        Header contentHeader = method.getFirstHeader("Content-Type");

        return new CSVDownloadResponse(responseStream, contentHeader == null ? null : contentHeader.getValue());
    }


    public TrayThumbNailResponse getTrayThumbNail(String dataSetId, String serviceUrl,String logId,
            Integer width, Integer startSampleNo, Integer endSampleNo) throws Exception {

        HttpRequestBase method = nvclMethodMaker.getTrayThumbNailMethodMaker(dataSetId, serviceUrl, logId, width, startSampleNo, endSampleNo);
        InputStream responseStream = httpServiceCaller.getMethodResponseAsStream(method);
        Header contentHeader = method.getFirstHeader("Content-Type");

        return new TrayThumbNailResponse(responseStream, contentHeader == null ? null : contentHeader.getValue());

    }


      /**
     * Makes and parses a getLogCollection request to a NVCLDataService
     * @param serviceUrl The NVCLDataService url
     * @param datasetId The unique dataset ID to query
     * @param forMosaicService [Optional] indicates if the getLogCollection service should generate a result specifically for the use of a Mosaic Service
     * @throws Exception
     */
    public List<GetLogCollectionResponse> getLogCollection(String serviceUrl, String datasetId, Boolean forMosaicService) throws Exception {
        HttpRequestBase method = nvclMethodMaker.getLogCollectionMethod(serviceUrl, datasetId, forMosaicService);

        //Make our request, parse it into a DOM document
        InputStream responseStream = httpServiceCaller.getMethodResponseAsStream(method);
        Document responseDoc = DOMUtil.buildDomFromStream(responseStream);

        //Get our dataset nodes
        XPathExpression expr = DOMUtil.compileXPathExpr("LogCollection/Log");
        NodeList nodeList = (NodeList) expr.evaluate(responseDoc, XPathConstants.NODESET);

        //Parse our response objects
        List<GetLogCollectionResponse> responseObjs = new ArrayList<GetLogCollectionResponse>();
        XPathExpression exprLogId = DOMUtil.compileXPathExpr("LogID");
        XPathExpression exprLogName = DOMUtil.compileXPathExpr("LogName");
        XPathExpression exprSampleCount = DOMUtil.compileXPathExpr("SampleCount");

        for (int i = 0; i < nodeList.getLength(); i++) {
            Node node = nodeList.item(i);

            String logId = (String) exprLogId.evaluate(node, XPathConstants.STRING);
            String logName = (String) exprLogName.evaluate(node, XPathConstants.STRING);
            String sampleCountString = (String) exprSampleCount.evaluate(node, XPathConstants.STRING);
            int sampleCount = 0;
            if (sampleCountString != null && !sampleCountString.isEmpty()) {
                sampleCount = Integer.parseInt(sampleCountString);
            }

            responseObjs.add(new GetLogCollectionResponse(logId, logName, sampleCount));
        }

        return responseObjs;
    }


}
