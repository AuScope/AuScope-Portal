package org.auscope.portal.server.web.controllers;

import org.junit.Before;
import org.junit.Test;
import org.xml.sax.SAXException;
import org.springframework.mock.web.MockHttpServletRequest;
import org.jmock.Mockery;
import org.jmock.Expectations;
import org.auscope.portal.server.web.HttpServiceCaller;
import org.auscope.portal.server.web.mineraloccurrence.MineralOccurrencesCSWHelper;
import org.auscope.portal.server.web.mineraloccurrence.IMineralOccurrencesCSWHelper;

import java.io.*;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;

import javax.xml.xpath.XPathExpressionException;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSession;
import javax.servlet.ServletContext;

/**
 * User: Mathew Wyyatt
 * Date: 23/03/2009
 * Time: 12:50:56 PM
 */
public class TestMineralOccurrencesFilterController {
    private Mockery mockery = new Mockery();


    @Before
    public void setup() {

    }

    @Test
    public void testQueryAllMineralOccurrenceServices() throws IOException, SAXException, XPathExpressionException, ParserConfigurationException, TransformerException {
        final IMineralOccurrencesCSWHelper mineralOccurrencesCSWHelper = mockery.mock(IMineralOccurrencesCSWHelper.class);

        MineralOccurrencesFilterController mineralOccurrencesFilerController = new MineralOccurrencesFilterController(new HttpServiceCaller(), mineralOccurrencesCSWHelper);

        final HttpServletRequest request = mockery.mock(HttpServletRequest.class);
        final HttpSession session = mockery.mock(HttpSession.class);
        final ServletContext servletContext = mockery.mock(ServletContext.class);

        mockery.checking(new Expectations() {{
            oneOf (mineralOccurrencesCSWHelper).getMineralOccurrenceServiceUrls(); will(returnValue(new ArrayList(Arrays.asList("http://www.gsv-tb.dpi.vic.gov.au/AuScope-MineralOccurrence/services?", "http://apacsrv3.arrc.csiro.au/deegree-wfs/services?"))));

            oneOf (request).getSession(); will(returnValue(session));
            oneOf (session).getServletContext(); will(returnValue(servletContext));
            oneOf (servletContext).getResourceAsStream("/WEB-INF/xsl/kml.xsl"); will(returnValue(new BufferedInputStream(new FileInputStream(new File("src/main/webapp/WEB-INF/xsl/kml.xsl")))));

            oneOf (request).getSession(); will(returnValue(session));
            oneOf (session).getServletContext(); will(returnValue(servletContext));
            oneOf (servletContext).getResourceAsStream("/WEB-INF/xsl/kml.xsl"); will(returnValue(new BufferedInputStream(new FileInputStream(new File("src/main/webapp/WEB-INF/xsl/kml.xsl")))));
        }});

        mineralOccurrencesFilerController.doAllMineralOccurrenceFilter("", "", "", "", "", "", "", "", "", request);
    }

    @Test
    public void testGetAllForMine() throws IOException, SAXException, XPathExpressionException, ParserConfigurationException {
        MineralOccurrencesFilterController minOccController = new MineralOccurrencesFilterController(new HttpServiceCaller(), new MineralOccurrencesCSWHelper());
        minOccController.doMiningActivityFilter("http://www.gsv-tb.dpi.vic.gov.au/AuScope-MineralOccurrence/services?", "Good Hope", "18/Mar/2009", "26/Mar/2009", "", "", "", "", null);
    }

    @Test
    public void testConvertToKML() {
       MineralOccurrencesFilterController minOccController = new MineralOccurrencesFilterController(new HttpServiceCaller(), new MineralOccurrencesCSWHelper());
       
       // TODO write test case
    /*   
       //C:\Projects\AuScope-Portal
       String basePath = new File("").getAbsolutePath();
       //C:\Projects\AuScope-Portal\src\main\webapp\WEB-INF\xsl\ma.xml    mine.xml
       //String testRunner = "file:///" + basePath + "/src/test/js/testRunner.html";
       //String testSuite  = new File(new URI("file:///" + basePath.replace("\\", "/") + "/src/main/webapp/WEB-INF/xsl/ma.xml")).getAbsolutePath();
       //String testSuite1  = new File(new URI("file:///" + basePath.replace("\\", "/") + "/src/main/webapp/WEB-INF/xsl/mine.xml")).getAbsolutePath();
       String mineFilePath = basePath + "/src/main/webapp/WEB-INF/xsl/mine.xml";
       String maFilePath = basePath + "/src/main/webapp/WEB-INF/xsl/ma.xml";
       String s = new String();
       
       try {
          BufferedReader inMine = new BufferedReader (new FileReader(mineFilePath));
          BufferedReader inMA   = new BufferedReader (new FileReader(maFilePath));
          try {
             while ((s = inMine.readLine()) != null )
                System.out.println(s);

                System.out.println("---------------------");
                
             while ((s = inMA.readLine()) != null )
                System.out.println(s);
             
                System.out.println("========---------------------");                
          } catch(IOException iox) {
             System.out.println("File read error...");
             iox.printStackTrace();
          }
       
          System.out.println("....Calling ...minOccController.convertToKML");
          minOccController.convertToKML(new FileInputStream(mineFilePath), 
                                        new FileInputStream(maFilePath),
                                        null);
          
       } catch (FileNotFoundException e) {
          System.out.println("File not found...");
       }
    */   
    }

    public static void main(String[] args) {
        System.out.println(new String("09/Mar/9008").toUpperCase());
    }
}
