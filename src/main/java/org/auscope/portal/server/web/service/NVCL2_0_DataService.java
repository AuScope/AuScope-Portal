package org.auscope.portal.server.web.service;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map.Entry;

import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;

import org.apache.commons.io.IOUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.Header;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpRequestBase;
import org.auscope.portal.core.server.http.HttpServiceCaller;
import org.auscope.portal.core.util.DOMUtil;
import org.auscope.portal.server.domain.nvcldataservice.BinnedCSVResponse;
import org.auscope.portal.server.domain.nvcldataservice.BinnedCSVResponse.Bin;
import org.auscope.portal.server.domain.nvcldataservice.CSVDownloadResponse;
import org.auscope.portal.server.domain.nvcldataservice.GetLogCollectionResponse;
import org.auscope.portal.server.domain.nvcldataservice.TrayThumbNailResponse;
import org.auscope.portal.server.web.NVCL2_0_DataServiceMethodMaker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import au.com.bytecode.opencsv.CSVReader;

@Service
public class NVCL2_0_DataService {

    private final Log log = LogFactory.getLog(getClass());
    private NVCL2_0_DataServiceMethodMaker nvclMethodMaker;
    private HttpServiceCaller httpServiceCaller;

    @Autowired
    public NVCL2_0_DataService(HttpServiceCaller httpServiceCaller,
            NVCL2_0_DataServiceMethodMaker nvclMethodMaker) {
        this.nvclMethodMaker = nvclMethodMaker;
        this.httpServiceCaller = httpServiceCaller;
    }



    /**
     * Makes a CSV download request from NVCL 2.0 service and returns the resulting data in a CSVDownloadResponse
     *
     * Response should be a stream of bytes for a CSV file
     *
     * @param serviceUrl
     *            The URL of an observation and measurements URL (obtained from a getDatasetCollection response)
     * @param datasetId
     *            The dataset to download
     * @return
     * @throws Exception
     */
    public CSVDownloadResponse getNVCL2_0_CSVDownload(String serviceUrl, String[] logIds) throws Exception {

        serviceUrl += "downloadscalars.html";

        HttpRequestBase method = nvclMethodMaker.getDownloadCSVMethod(serviceUrl, logIds);
        HttpResponse httpResponse = httpServiceCaller.getMethodResponseAsHttpResponse(method);
        InputStream responseStream = httpResponse.getEntity().getContent();
        Header contentHeader = httpResponse.getEntity().getContentType();

        return new CSVDownloadResponse(responseStream, contentHeader == null ? null : contentHeader.getValue());
    }

    private String getMostCountedValue(HashMap<String, Integer> map) {
        String largestValue = null;
        int largestCount = Integer.MIN_VALUE;

        for (Entry<String, Integer> entry : map.entrySet()) {
            if (entry.getValue() > largestCount) {
                largestCount = entry.getValue();
                largestValue = entry.getKey();
            }
        }

        return largestValue;
    }

    /**
     * Makes a CSV download request from an NVCL 2.0 service and parses the resulting data into a series of 1 metre bins where
     * each bin represents the average value for that range of the borehole.
     * @param serviceUrl
     * @param logIds
     * @return
     * @throws Exception
     */
    public BinnedCSVResponse getNVCL2_0_CSVBinned(String serviceUrl, String[] logIds) throws Exception {
       return  getNVCL2_0_CSVBinned(serviceUrl, logIds, 1.0);
    }

    /**
     * Makes a CSV download request from an NVCL 2.0 service and parses the resulting data into a series of binSizeMetres bins where
     * each bin represents the average value for that range of the borehole.
     * @param serviceUrl
     * @param logIds
     * @return
     * @throws Exception
     */
    public BinnedCSVResponse getNVCL2_0_CSVBinned(String serviceUrl, String[] logIds, double binSizeMetres) throws Exception {
        final String MISSING_DATA_STRING = "null";
        serviceUrl += "downloadscalars.html";

        HttpRequestBase method = nvclMethodMaker.getDownloadCSVMethod(serviceUrl, logIds);
        InputStream responseStream = httpServiceCaller.getMethodResponseAsStream(method);
        CSVReader reader = null;
        BinnedCSVResponse binnedResponse = new BinnedCSVResponse();
        try {
            //Prepare parsing
            reader = new CSVReader(new InputStreamReader(responseStream), ',', '\'', 0);
            String[] headerLine = reader.readNext();
            if (headerLine == null || headerLine.length <= 2) {
                throw new IOException("No or malformed CSV header sent");
            }

            //Prepare our bins
            Bin[] bins = new Bin[headerLine.length - 2];
            List<HashMap<String, Integer>> valueCounts = new ArrayList<HashMap<String, Integer>>(bins.length);
            double[] numericTotal = new double[bins.length];
            int[] numericCount = new int[bins.length];
            double currentBinStartDepth = -Double.MAX_VALUE;
            int currentBinSize = 0;
            for (int i = 0; i < bins.length; i++) {
                bins[i] = binnedResponse.new Bin(headerLine[2 + i], new ArrayList<Double>(512), true, new ArrayList<Object>(512));
                bins[i].setNumeric(true);
                valueCounts.add(new HashMap<String, Integer>());
            }

            //Start parsing our data - loading it into bins
            String[] dataLine = null;
            while ((dataLine = reader.readNext()) != null) {
                if (dataLine.length != headerLine.length) {
                    continue; //skip malformed lines
                }

                //If we've exceeded our current bin size - save the data and start a new bin
                double depth = Double.parseDouble(dataLine[0]);
                if (depth - currentBinStartDepth >= binSizeMetres) {

                    if (currentBinStartDepth == -Double.MAX_VALUE) {
                        currentBinStartDepth = depth;
                    }

                    for (int i = 0; i < bins.length; i++) {
                        if (bins[i].isNumeric()) {
                            if (numericCount[i] > 0) {
                                bins[i].getValues().add(numericTotal[i] / (double) numericCount[i]);
                                bins[i].getStartDepths().add(currentBinStartDepth);
                            }
                        } else {
                            String value = getMostCountedValue(valueCounts.get(i));
                            if (value != null) {
                                bins[i].getValues().add(value);
                                bins[i].getStartDepths().add(currentBinStartDepth);
                            }
                        }
                    }

                    //Reset our working bin data
                    for (int i = 0; i < bins.length; i++) {
                        valueCounts.get(i).clear();
                        numericTotal[i] = 0.0;
                        numericCount[i] = 0;
                    }

                    currentBinStartDepth = depth;
                    currentBinSize = 0;
                }

                //Build up our current bin
                boolean dataAdded = false;
                for (int i = 0; i < bins.length; i++) {
                    String rawBinData = dataLine[2 + i];
                    if (rawBinData == null || rawBinData.isEmpty() || rawBinData.equals(MISSING_DATA_STRING)) {
                        continue; //skip missing data
                    } else {
                        dataAdded = true;
                    }

                    if (bins[i].isNumeric()) {
                        try {
                            double newData = Double.parseDouble(rawBinData);
                            numericCount[i]++;
                            numericTotal[i] += newData;
                        } catch (NumberFormatException nfe) {
                            //OK - this column isn't actually numeric
                            bins[i].setNumeric(false);
                        }
                    }

                    if (!bins[i].isNumeric()) {
                        Integer currentCount = valueCounts.get(i).get(rawBinData);
                        if (currentCount == null) {
                            valueCounts.get(i).put(rawBinData, 1);
                        } else {
                            valueCounts.get(i).put(rawBinData, currentCount + 1);
                        }
                    }
                }
                if (dataAdded) {
                    currentBinSize++;
                }
            }

            //If we've got a partial bin at the end - let's include the data
            if (currentBinSize > 0) {
                for (int i = 0; i < bins.length; i++) {
                    if (bins[i].isNumeric()) {
                        if (numericCount[i] > 0) {
                            bins[i].getValues().add(numericTotal[i] / (double) numericCount[i]);
                            bins[i].getStartDepths().add(currentBinStartDepth);
                        }
                    } else {
                        String value = getMostCountedValue(valueCounts.get(i));
                        if (value != null) {
                            bins[i].getValues().add(value);
                            bins[i].getStartDepths().add(currentBinStartDepth);
                        }
                    }
                }
            }

            binnedResponse.setBins(bins);
            binnedResponse.setBinSize(binSizeMetres);
        } finally {
            IOUtils.closeQuietly(reader);
            IOUtils.closeQuietly(responseStream);
        }

        return binnedResponse;
    }

    public TrayThumbNailResponse getTrayThumbNail(String dataSetId, String serviceUrl, String logId,
            Integer width, Integer startSampleNo, Integer endSampleNo) throws Exception {

        HttpRequestBase method = nvclMethodMaker.getTrayThumbNailMethodMaker(dataSetId, serviceUrl, logId, width,
                startSampleNo, endSampleNo);
        HttpResponse httpResponse = httpServiceCaller.getMethodResponseAsHttpResponse(method);
        InputStream responseStream = httpResponse.getEntity().getContent();
        Header contentHeader = httpResponse.getEntity().getContentType();

        return new TrayThumbNailResponse(responseStream, contentHeader == null ? null : contentHeader.getValue());

    }

    /**
     * Makes and parses a getLogCollection request to a NVCLDataService
     *
     * @param serviceUrl
     *            The NVCLDataService url
     * @param datasetId
     *            The unique dataset ID to query
     * @param forMosaicService
     *            [Optional] indicates if the getLogCollection service should generate a result specifically for the use of a Mosaic Service
     * @throws Exception
     */
    public List<GetLogCollectionResponse> getLogCollection(String serviceUrl, String datasetId, Boolean forMosaicService)
            throws Exception {
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
