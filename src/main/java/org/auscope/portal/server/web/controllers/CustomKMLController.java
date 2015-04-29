package org.auscope.portal.server.web.controllers;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.auscope.portal.core.server.controllers.BasePortalController;
import org.auscope.portal.server.web.FileUploadBean;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.google.gson.Gson;


@Controller
public class CustomKMLController extends BasePortalController {



    @RequestMapping("/addKMLLayer.do")
    public @ResponseBody String addKMLLayer( FileUploadBean uploadItem, BindingResult result,HttpServletResponse response){
        try{
            CommonsMultipartFile file = uploadItem.getFile();
            ModelMap model = new ModelMap();
            model.put("success", true);
            model.put("file", IOUtils.toString(file.getInputStream()));
            model.put("name", file.getOriginalFilename());
            return new Gson().toJson(model);
        }catch(Exception e){
            ModelMap model = new ModelMap();
            model.put("success", false);
            return new Gson().toJson(model);
        }
    }
}
