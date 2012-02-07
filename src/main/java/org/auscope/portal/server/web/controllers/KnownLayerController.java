package org.auscope.portal.server.web.controllers;

import java.util.ArrayList;
import java.util.List;

import org.auscope.portal.csw.record.CSWRecord;
import org.auscope.portal.server.domain.auscope.KnownLayerAndRecords;
import org.auscope.portal.server.domain.auscope.KnownLayerGrouping;
import org.auscope.portal.server.web.service.KnownLayerService;
import org.auscope.portal.server.web.view.JSONModelAndView;
import org.auscope.portal.server.web.view.ViewCSWRecordFactory;
import org.auscope.portal.server.web.view.ViewKnownLayerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * Contains methods for requesting the list of known feature types
 * @author Josh Vote
 *
 */
@Controller
public class KnownLayerController extends BaseCSWController {

    /** Used for requesting groupings of CSWRecords under known layers*/
    private KnownLayerService knownLayerService;
    /** Used for converting data to something the view can understand*/
    private ViewKnownLayerFactory viewKnownLayerFactory;

    @Autowired
    public KnownLayerController(KnownLayerService knownLayerService,
            ViewKnownLayerFactory viewFactory, ViewCSWRecordFactory viewCSWRecordFactory) {
        super(viewCSWRecordFactory);
        this.knownLayerService = knownLayerService;
        this.viewKnownLayerFactory = viewFactory;
    }

    private ModelAndView generateResponse(List<KnownLayerAndRecords> knownLayers, List<CSWRecord> unmappedRecords) {
        List<ModelMap> viewUnmappedRecords = new ArrayList<ModelMap>();
        for (CSWRecord rec : unmappedRecords) {
            viewUnmappedRecords.add(viewCSWRecordFactory.toView(rec));
        }

        List<ModelMap> viewKnownLayers = new ArrayList<ModelMap>();
        for (KnownLayerAndRecords kl : knownLayers) {
            ModelMap viewKnownLayer = viewKnownLayerFactory.toView(kl.getKnownLayer());

            List<ModelMap> viewMappedRecords = new ArrayList<ModelMap>();
            for (CSWRecord rec : kl.getBelongingRecords()) {
                viewMappedRecords.add(viewCSWRecordFactory.toView(rec));
            }

            viewKnownLayer.put("records", viewMappedRecords);
            viewKnownLayers.add(viewKnownLayer);
        }

        //Generate our response (and augment it with a list of unmapped records)
        ModelMap responseModel = generateResponseModel(true, viewKnownLayers, null, "", null);
        responseModel.put("unmappedRecords", viewUnmappedRecords);
        return new JSONModelAndView(responseModel);
    }

    /**
     * Gets a JSON response which contains the representations of each and every "KnownFeatureTypeDefinition".
     *
     * Each KnownFeatureTypeDefinition will map [0, N] CSWRecords with display information.
     * @return
     */
    @RequestMapping("getKnownLayers.do")
    public ModelAndView getKnownLayers() {
        KnownLayerGrouping grouping = knownLayerService.groupKnownLayerRecords();

        return generateResponse(grouping.getKnownLayers(), grouping.getUnmappedRecords());
    }
}
