package org.auscope.portal.server.web.controllers;


import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Hashtable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.httpclient.Header;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.auscope.portal.core.server.controllers.BasePortalController;
import org.auscope.portal.core.server.http.HttpServiceCaller;
import org.auscope.portal.core.server.http.download.DownloadResponse;
import org.auscope.portal.core.server.http.download.DownloadTracker;
import org.auscope.portal.core.server.http.download.Progression;
import org.auscope.portal.core.server.http.download.ServiceDownloadManager;
import org.auscope.portal.core.util.FileIOUtil;
import org.auscope.portal.core.util.MimeUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * User: Mathew Wyatt
 * Date: 02/09/2009
 * Time: 12:33:48 PM
 */

@Controller
public class DownloadController extends BasePortalController {
    private final Log logger = LogFactory.getLog(getClass());
    private HttpServiceCaller serviceCaller;


    @Autowired
    public DownloadController(HttpServiceCaller serviceCaller) {
        this.serviceCaller = serviceCaller;
    }

    @RequestMapping("/getGmlDownload.do")
    public void getGmlDownload(
            @RequestParam("email") final String email,
            HttpServletResponse response) throws Exception {
        DownloadTracker downloadTracker=DownloadTracker.getTracker(email);
        Progression progress= downloadTracker.getProgress();
        if(progress==Progression.COMPLETED){
            FileIOUtil.writeInputToOutputStream( downloadTracker.getFile(), response.getOutputStream(), 1024, true);
        }

    }

    @RequestMapping("/checkGMLDownloadStatus.do")
    public void checkGMLDownloadStatus(
            @RequestParam("email") final String email,
            HttpServletResponse response,
            HttpServletRequest request) throws Exception {

        DownloadTracker downloadTracker=DownloadTracker.getTracker(email);
        Progression progress= downloadTracker.getProgress();
        String htmlResponse="";
        response.setContentType("text/html");

        if(progress==Progression.INPROGRESS){
            htmlResponse="<html><p>Download currently still in progress</p></html>";
        }else if(progress==Progression.NOT_STARTED){
            htmlResponse="<html><p>No download request found..</p></html>";
        }else if(progress==Progression.COMPLETED){
            htmlResponse="<html><p>Your download has successfully completed.</p><p><a href='getGmlDownload.do?email="+ email +"'>Click on this link to download</a></p></html>";
        }else{
            htmlResponse="<html><p>Serious error has occured, Please contact our Administrator on cg-admin@csiro.au</p></html>";
        }

        response.getOutputStream().write(htmlResponse.getBytes());
    }

    /**
     * Given a list of URls, this function will collate the responses
     * into a zip file and send the response back to the browser.
     * if no email is provided, a zip is written to the response output
     * If email address is provided, a html response is returned to the user informing
     * his request has been processed and to check back again later.
     *
     * @param serviceUrls
     * @param response
     * @throws Exception
     */
    @RequestMapping("/downloadGMLAsZip.do")
    public void downloadGMLAsZip(
            @RequestParam("serviceUrls") final String[] serviceUrls,
            @RequestParam(required = false,value = "email" , defaultValue ="") final String email,
            HttpServletResponse response) throws Exception {
        ExecutorService pool = Executors.newCachedThreadPool();
        downloadGMLAsZip(serviceUrls,response,pool,email);
    }


    public void downloadGMLAsZip(String[] serviceUrls,HttpServletResponse response,ExecutorService threadpool,String email) throws Exception {

        logger.trace("No. of serviceUrls: " + serviceUrls.length);
        ServiceDownloadManager downloadManager = new ServiceDownloadManager(serviceUrls, serviceCaller,threadpool);

        if(email != null && email.length() > 0){

            DownloadTracker downloadTracker=DownloadTracker.getTracker(email);
            Progression progress= downloadTracker.getProgress();
            String htmlResponse="";
            response.setContentType("text/html");
            if(progress==Progression.INPROGRESS){
                 htmlResponse="<html><p>You are not allowed to start a new download when another download is in progress Please wait for your previous download to complete.</p>" +
                         " <p>To check the progress of your download, enter your email address on the download popup and click on 'Check Status'</p>" +
                         " <p>Please contact the administrator if you encounter any issues</p></html>";
                 response.getOutputStream().write(htmlResponse.getBytes());
                 return;
            }

            downloadTracker.startTrack(downloadManager);

            htmlResponse="<html><p>Your request has been submitted. The download process may take sometime depending on the size of the dataset</p>" +
                    " <p>To check the progress of your download, enter your email address on the download popup and click on 'Check Status'</p>" +
                    " <p>Please contact the administrator if you encounter any issues</p></html>";

            response.getOutputStream().write(htmlResponse.getBytes());



        }else{
            // set the content type for zip files
            response.setContentType("application/zip");
            response.setHeader("Content-Disposition",
                    "inline; filename=GMLDownload.zip;");
            ZipOutputStream zout = new ZipOutputStream(response.getOutputStream());
            //VT: threadpool is closed within downloadAll();
            ArrayList<DownloadResponse> gmlDownloads = downloadManager.downloadAll();
            FileIOUtil.writeResponseToZip(gmlDownloads,zout);
            zout.finish();
            zout.flush();
            zout.close();
        }


    }



    /**
     * Given a list of WMS URL's, this function will collate the responses
     * into a zip file and send the response back to the browser.
     *
     * @param serviceUrls
     * @param filename
     * @param response
     * @throws Exception
     */
    @RequestMapping("/downloadDataAsZip.do")
    public void downloadDataAsZip( @RequestParam("serviceUrls") final String[] serviceUrls,
                                  @RequestParam("filename") final String filename,
                                  HttpServletResponse response) throws Exception {

        String filenameStr = filename == null || filename.length() < 0 ? "DataDownload" : filename;

        //set the content type for zip files
        response.setContentType("application/zip");
        response.setHeader("Content-Disposition","inline; filename=" + filenameStr + ".zip;");

        //create the output stream
        ZipOutputStream zout = new ZipOutputStream(response.getOutputStream());

        for (int i = 0; i<serviceUrls.length; i++) {

            GetMethod method = new GetMethod(serviceUrls[i]);
            byte[] responseBytes = serviceCaller.getMethodResponseAsBytes(method);
            Header contentType = method.getResponseHeader("Content-Type");

            //create a new entry in the zip file with a timestamped name
            String mime = null;
            if (contentType != null) {
                mime = contentType.getValue();
            }
            String fileExtension = MimeUtil.mimeToFileExtension(mime);
            if (fileExtension != null && !fileExtension.isEmpty()) {
                fileExtension = "." + fileExtension;
            }
            zout.putNextEntry(new ZipEntry(new SimpleDateFormat((i + 1) + "_yyyyMMdd_HHmmss").format(new Date()) + fileExtension));


            zout.write(responseBytes);
            zout.closeEntry();
        }

        zout.finish();
        zout.flush();
        zout.close();
    }

}
