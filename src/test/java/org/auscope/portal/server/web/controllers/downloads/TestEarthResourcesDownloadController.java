package org.auscope.portal.server.web.controllers.downloads;

import java.io.ByteArrayInputStream;

import javax.servlet.http.HttpServletResponse;

import junit.framework.Assert;

import org.apache.commons.httpclient.HttpMethodBase;
import org.auscope.portal.core.services.PortalServiceException;
import org.auscope.portal.core.test.ByteBufferedServletOutputStream;
import org.auscope.portal.core.test.PortalTestClass;
import org.auscope.portal.server.web.service.download.MineralOccurrenceDownloadService;
import org.jmock.Expectations;
import org.junit.Before;
import org.junit.Test;


public class TestEarthResourcesDownloadController extends PortalTestClass {
    private EarthResourcesDownloadController earthResourcesDownloadController;
    private MineralOccurrenceDownloadService mineralOccurrenceDownloadService;
    private HttpServletResponse response;

    /**
     * Needed so we can check the contents of our zip file after it is written
     */
    final class MyServletOutputStream extends ByteBufferedServletOutputStream {
        public MyServletOutputStream(int length) {
            super(length);
        }

        public String getInputString() {
           return this.getStream().toString();
        }
    }

    @Before
    public void setUp() {

        this.mineralOccurrenceDownloadService = context.mock(MineralOccurrenceDownloadService.class);
        this.earthResourcesDownloadController = new EarthResourcesDownloadController(this.mineralOccurrenceDownloadService);
        this.response = context.mock(HttpServletResponse.class);
    }



    /**
     * Test doing a mine download
     * @throws Exception
     */
    @Test
    public void testMineDownload() throws Exception {
        final String mineName = "testMine";
        final String serviceURL = "http://testblah.com";
        final String resultXML = "<result>this is a test</result>";
        final ByteArrayInputStream ins = new ByteArrayInputStream(resultXML.getBytes());
        final MyServletOutputStream out = new MyServletOutputStream(resultXML.length());


        context.checking(new Expectations() {{
            allowing(response).setContentType(with(any(String.class)));
            oneOf(response).getOutputStream();will(returnValue(out));
            oneOf(mineralOccurrenceDownloadService).downloadMinesGml(serviceURL, mineName, null, 0);will(returnValue(ins));
        }});

        this.earthResourcesDownloadController.doMineFilterDownload(serviceURL, mineName, null, 0,this.response);
        Assert.assertTrue(out.getInputString().equals(resultXML));

    }


    /**
     * Test doing a mine download with PortalException thrown
     * @throws Exception
     */
    @Test
    public void testMineDownloadException() throws Exception {
        final String mineName = "testMine";
        final String serviceURL = "http://testblah.com";
        final String resultXML = "<result>this is a test</result>";
        final MyServletOutputStream out = new MyServletOutputStream(resultXML.length());
        final HttpMethodBase mockMethod = context.mock(HttpMethodBase.class);

        context.checking(new Expectations() {{
            allowing(response).setContentType(with(any(String.class)));
            oneOf(response).getOutputStream();will(returnValue(out));
            oneOf(mineralOccurrenceDownloadService).downloadMinesGml(serviceURL, mineName, null, 0);
                will(throwException(new PortalServiceException(mockMethod)));
        }});

        this.earthResourcesDownloadController.doMineFilterDownload(serviceURL, mineName, null, 0,this.response);
        Assert.assertTrue(out.getInputString().startsWith("<StackTrace>http://testblah.com"));
    }


    /**
     * Tests using the mineral occurrence download service
     * @throws Exception
     */
    @Test
    public void testMineralOccurrenceDownload() throws Exception {
        final String serviceUrl = "http://localhost?";
        final int maxFeatures = 21341;
        final String commodityName = "cn";
        final String measureType = "mt";
        final String minOreAmount = "1";
        final String minOreAmountUOM = "2";
        final String minCommodityAmount = "3";
        final String minCommodityAmountUOM = "4";
        final String resultXML = "<result>this is a test</result>";
        final ByteArrayInputStream ins = new ByteArrayInputStream(resultXML.getBytes());
        final MyServletOutputStream out = new MyServletOutputStream(resultXML.length());

        context.checking(new Expectations() {
            {
                allowing(response).setContentType(with(any(String.class)));
                oneOf(response).getOutputStream();will(returnValue(out));
                oneOf(mineralOccurrenceDownloadService)
                        .downloadMineralOccurrenceGml(serviceUrl,
                                commodityName, measureType, minOreAmount,
                                minOreAmountUOM, minCommodityAmount,
                                minCommodityAmountUOM, maxFeatures, null);
                will(returnValue(ins));
            }
        });

        this.earthResourcesDownloadController
                .doMineralOccurrenceFilterDownload(serviceUrl, commodityName,
                        measureType, minOreAmount, minOreAmountUOM,
                        minCommodityAmount, minCommodityAmountUOM, null,
                        maxFeatures, this.response);

        Assert.assertTrue(out.getInputString().equals(resultXML));
    }

    /**
     * Tests using the mineral occurrence download service
     * @throws Exception
     */
    @Test
    public void testMineralOccurrenceDownloadException() throws Exception {
        final String serviceUrl = "http://testblah.com";
        final int maxFeatures = 21341;
        final String commodityName = "cn";
        final String measureType = "mt";
        final String minOreAmount = "1";
        final String minOreAmountUOM = "2";
        final String minCommodityAmount = "3";
        final String minCommodityAmountUOM = "4";
        final String resultXML = "<result>this is a test</result>";
        final MyServletOutputStream out = new MyServletOutputStream(resultXML.length());
        final HttpMethodBase mockMethod = context.mock(HttpMethodBase.class);

        context.checking(new Expectations() {
            {
                allowing(response).setContentType(with(any(String.class)));
                oneOf(response).getOutputStream();will(returnValue(out));
                oneOf(mineralOccurrenceDownloadService)
                        .downloadMineralOccurrenceGml(serviceUrl,
                                commodityName, measureType, minOreAmount,
                                minOreAmountUOM, minCommodityAmount,
                                minCommodityAmountUOM, maxFeatures, null);
                will(throwException(new PortalServiceException(mockMethod)));
            }
        });

        this.earthResourcesDownloadController
                .doMineralOccurrenceFilterDownload(serviceUrl, commodityName,
                        measureType, minOreAmount, minOreAmountUOM,
                        minCommodityAmount, minCommodityAmountUOM, null,
                        maxFeatures, this.response);

        Assert.assertTrue(out.getInputString().startsWith("<StackTrace>http://testblah.com"));
    }

    /**
     * Tests using the mine activity download service
     * @throws Exception
     */
    @Test
    public void testMineActivityDownload() throws Exception {
        final String serviceURL = "http://testblah.com";
        final int maxFeatures = 21341;
        final String mineName = "mineName"; // to get all mines
        final String startDate = "2010-01-01";
        final String endDate = "2011-01-01";
        final String oreProcessed = "3";
        final String producedMaterial = "pm";
        final String cutOffGrade = "55";
        final String production = "prod";
        final String resultXML = "<result>this is a test</result>";
        final ByteArrayInputStream ins = new ByteArrayInputStream(resultXML.getBytes());
        final MyServletOutputStream out = new MyServletOutputStream(resultXML.length());

        context.checking(new Expectations() {
            {
                allowing(response).setContentType(with(any(String.class)));
                oneOf(response).getOutputStream();will(returnValue(out));
                oneOf(mineralOccurrenceDownloadService)
                        .downloadMiningActivityGml(serviceURL, mineName,
                                startDate, endDate, oreProcessed,
                                producedMaterial, cutOffGrade, production,
                                maxFeatures, null);
                will(returnValue(ins));
            }
        });

        this.earthResourcesDownloadController.doMiningActivityFilterDownload(
                serviceURL, mineName, startDate, endDate, oreProcessed,
                producedMaterial, cutOffGrade, production, null, maxFeatures,
                this.response);
        Assert.assertTrue(out.getInputString().equals(resultXML));
    }


    /**
     * Tests using the mine activity download service
     * @throws Exception
     */
    @Test
    public void testMineActivityDownloadException() throws Exception {
        final String serviceURL = "http://testblah.com";
        final int maxFeatures = 21341;
        final String mineName = "mineName"; // to get all mines
        final String startDate = "2010-01-01";
        final String endDate = "2011-01-01";
        final String oreProcessed = "3";
        final String producedMaterial = "pm";
        final String cutOffGrade = "55";
        final String production = "prod";
        final String resultXML = "<result>this is a test</result>";
        final MyServletOutputStream out = new MyServletOutputStream(resultXML.length());
        final HttpMethodBase mockMethod = context.mock(HttpMethodBase.class);


        context.checking(new Expectations() {
            {
                allowing(response).setContentType(with(any(String.class)));
                oneOf(response).getOutputStream();will(returnValue(out));
                oneOf(mineralOccurrenceDownloadService)
                        .downloadMiningActivityGml(serviceURL, mineName,
                                startDate, endDate, oreProcessed,
                                producedMaterial, cutOffGrade, production,
                                maxFeatures, null);
                will(throwException(new PortalServiceException(mockMethod)));
            }
        });

        this.earthResourcesDownloadController.doMiningActivityFilterDownload(
                serviceURL, mineName, startDate, endDate, oreProcessed,
                producedMaterial, cutOffGrade, production, null, maxFeatures,
                this.response);
        Assert.assertTrue(out.getInputString().startsWith("<StackTrace>http://testblah.com"));
    }


}
