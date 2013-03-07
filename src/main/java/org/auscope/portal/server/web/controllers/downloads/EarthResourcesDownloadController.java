package org.auscope.portal.server.web.controllers.downloads;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.auscope.portal.core.server.controllers.BasePortalController;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.core.util.FileIOUtil;
import org.auscope.portal.server.web.service.download.MineralOccurrenceDownloadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class EarthResourcesDownloadController extends BasePortalController{

 // ----------------------------------------------------- Instance variables

    private MineralOccurrenceDownloadService mineralOccurrenceDownloadService;

    private final Log log = LogFactory.getLog(getClass());

    @Autowired
    public EarthResourcesDownloadController(MineralOccurrenceDownloadService mineralOccurrenceDownloadService) {
        this.mineralOccurrenceDownloadService = mineralOccurrenceDownloadService;

    }


    /**
     * Handles the Earth Resource Mine filter queries.
     * (If the bbox elements are specified, they will limit the output response to 200 records implicitly)
     *
     * @param serviceUrl the url of the service to query
     * @param mineName   the name of the mine to query for
     * @param request    the HTTP client request
     * @return a WFS response converted into KML
     * @throws Exception
     */
    @RequestMapping("/doMineFilterDownload.do")
    public void doMineFilterDownload(
            @RequestParam("serviceUrl") String serviceUrl,
            @RequestParam("mineName") String mineName,
            @RequestParam(required = false, value = "bbox") String bboxJson,
            @RequestParam(required = false, value = "maxFeatures", defaultValue = "0") int maxFeatures,
            HttpServletResponse response) throws Exception {

        //The presence of a bounding box causes us to assume we will be using this GML for visualizing on a map
        //This will in turn limit the number of points returned to 200
        FilterBoundingBox bbox = FilterBoundingBox.attemptParseFromJSON(bboxJson);
        response.setContentType("text/xml");
        OutputStream outputStream = response.getOutputStream();
        File file=null;
        try {
            InputStream results = this.mineralOccurrenceDownloadService.downloadMinesGml(serviceUrl, mineName, bbox, maxFeatures);

            file= this.writeStreamToFileTemporary(results, "MFD", ".xml", true);
            FileInputStream in=new FileInputStream(file);
            FileIOUtil.writeInputToOutputStream(in, outputStream, 8 * 1024, true);

        } catch (Exception e) {
            log.warn(String.format("Error performing filter for '%1$s': %2$s", serviceUrl, e));
            log.debug("Exception: ", e);
            FileIOUtil.writeExceptionToXMLStream(e, outputStream,false,serviceUrl);

        }finally{
            outputStream.flush();
            outputStream.close();
            if(file != null){
                file.delete();
            }
        }
    }



    /**
     * Handles the Earth Resource MineralOccerrence filter queries.
     *
     * @param serviceUrl
     * @param commodityName
     * @param measureType
     * @param minOreAmount
     * @param minOreAmountUOM
     * @param minCommodityAmount
     * @param minCommodityAmountUOM
     * @param request                the HTTP client request
     *
     * @return a WFS response converted into KML
     * @throws Exception
     */
    @RequestMapping("/doMineralOccurrenceFilterDownload.do")
    public void doMineralOccurrenceFilterDownload(
        @RequestParam(value = "serviceUrl",            required = false) String serviceUrl,
        @RequestParam(value = "commodityName",         required = false) String commodityName,
        @RequestParam(value = "measureType",           required = false) String measureType,
        @RequestParam(value = "minOreAmount",          required = false) String minOreAmount,
        @RequestParam(value = "minOreAmountUOM",       required = false) String minOreAmountUOM,
        @RequestParam(value = "minCommodityAmount",    required = false) String minCommodityAmount,
        @RequestParam(value = "minCommodityAmountUOM", required = false) String minCommodityAmountUOM,
        @RequestParam(required = false, value = "bbox") String bboxJson,
        @RequestParam(required = false, value = "maxFeatures", defaultValue = "0") int maxFeatures,
        HttpServletResponse response) throws Exception {
        //The presence of a bounding box causes us to assume we will be using this GML for visualising on a map
        //This will in turn limit the number of points returned to 200
        FilterBoundingBox bbox = FilterBoundingBox.attemptParseFromJSON(bboxJson);
        response.setContentType("text/xml");
        OutputStream outputStream = response.getOutputStream();
        File file=null;

        try {
            //get the mineral occurrences
            InputStream results = this.mineralOccurrenceDownloadService.downloadMineralOccurrenceGml(
                    serviceUrl,
                    commodityName,
                    measureType,
                    minOreAmount,
                    minOreAmountUOM,
                    minCommodityAmount,
                    minCommodityAmountUOM,
                    maxFeatures,
                    bbox);

            file= this.writeStreamToFileTemporary(results, "MOD", ".xml", true);
            FileInputStream in=new FileInputStream(file);
            FileIOUtil.writeInputToOutputStream(in, outputStream, 8 * 1024, true);

        } catch (Exception e) {
            log.warn(String.format("Error performing filter for '%1$s': %2$s", serviceUrl, e));
            log.debug("Exception: ", e);
            FileIOUtil.writeExceptionToXMLStream(e, outputStream,false,serviceUrl);
        }finally{
            outputStream.flush();
            outputStream.close();
            if(file != null){
                file.delete();
            }
        }
    }




    /**
     * Handles Mining Activity filter queries
     * Returns WFS response converted into KML.
     *
     * @param serviceUrl
     * @param mineName
     * @param startDate
     * @param endDate
     * @param oreProcessed
     * @param producedMaterial
     * @param cutOffGrade
     * @param production
     * @param request
     * @return the KML response
     * @throws Exception
     */
    @RequestMapping("/doMiningActivityFilterDownload.do")
    public void doMiningActivityFilterDownload(
            @RequestParam("serviceUrl")       String serviceUrl,
            @RequestParam(required = false, value = "mineName", defaultValue = "")         String mineName,
            @RequestParam(required = false, value = "startDate", defaultValue = "")        String startDate,
            @RequestParam(required = false, value = "endDate", defaultValue = "")          String endDate,
            @RequestParam(required = false, value = "oreProcessed", defaultValue = "")     String oreProcessed,
            @RequestParam(required = false, value = "producedMaterial", defaultValue = "") String producedMaterial,
            @RequestParam(required = false, value = "cutOffGrade", defaultValue = "")      String cutOffGrade,
            @RequestParam(required = false, value = "production", defaultValue = "")       String production,
            @RequestParam(required = false, value = "bbox", defaultValue = "")             String bboxJson,
            @RequestParam(required = false, value = "maxFeatures", defaultValue = "0")     int maxFeatures,
            HttpServletResponse response)
    throws Exception
    {
        //The presence of a bounding box causes us to assume we will be using this GML for visualizing on a map
        //This will in turn limit the number of points returned to 200
        FilterBoundingBox bbox = FilterBoundingBox.attemptParseFromJSON(bboxJson);
        response.setContentType("text/xml");
        OutputStream outputStream = response.getOutputStream();
        File file=null;

        try {
            // Get the mining activities
            InputStream results = this.mineralOccurrenceDownloadService.downloadMiningActivityGml(serviceUrl
                    , mineName
                    , startDate
                    , endDate
                    , oreProcessed
                    , producedMaterial
                    , cutOffGrade
                    , production
                    , maxFeatures
                    , bbox);


            file= this.writeStreamToFileTemporary(results, "MAD", ".xml", true);
            FileInputStream in=new FileInputStream(file);
            FileIOUtil.writeInputToOutputStream(in, outputStream, 8 * 1024, true);


        } catch (Exception e) {
            log.warn(String.format("Error performing filter for '%1$s': %2$s", serviceUrl, e));
            log.debug("Exception: ", e);
            FileIOUtil.writeExceptionToXMLStream(e, outputStream,false,serviceUrl);
        }finally{
            outputStream.flush();
            outputStream.close();
            if(file != null){
                file.delete();
            }
        }
    }


    private File writeStreamToFileTemporary(InputStream ins,String identifier,String fileSuffix,boolean closeIns) throws IOException {
        BufferedOutputStream out=null;
        File f=null;
        try{
            f = File.createTempFile(identifier, fileSuffix);
            out= new BufferedOutputStream(new FileOutputStream(f));
            FileIOUtil.writeInputToOutputStream(ins, out, 8 * 1024, false);
            out.flush();
            out.close();

            //VT: After we have finish writing the stream to file we want to return it.
            log.info(f.getCanonicalPath() + " : Complete writing of temporary file");
            return f;

        }catch(IOException e){
            throw e;
        }finally{
            out.close();
            if(closeIns){
                ins.close();
            }
        }
    }




}
