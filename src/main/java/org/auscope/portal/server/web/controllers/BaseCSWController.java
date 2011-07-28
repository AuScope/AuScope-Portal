package org.auscope.portal.server.web.controllers;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.auscope.portal.csw.CSWRecord;
import org.auscope.portal.server.web.view.ViewCSWRecordFactory;
import org.springframework.ui.ModelMap;
import org.springframework.web.servlet.ModelAndView;

/**
 * Base class for all controllers that intend on returning CSWRecords
 * @author Josh Vote
 *
 */
public abstract class BaseCSWController extends BasePortalController {

    protected ViewCSWRecordFactory viewCSWRecordFactory;

    protected BaseCSWController(ViewCSWRecordFactory viewCSWRecordFactory) {
        this.viewCSWRecordFactory = viewCSWRecordFactory;
    }

    /**
     * Utility for generating a response model
     * @param records
     * @return
     */
    protected ModelAndView generateJSONResponseMAV(CSWRecord[] records) {
        if (records == null) {
            return generateJSONResponseMAV(false, new CSWRecord[] {}, "");
        }

        List<ModelMap> recordRepresentations = new ArrayList<ModelMap>();

        try {
            for (CSWRecord record : records) {
                recordRepresentations.add(viewCSWRecordFactory.toView(record));
            }
         } catch (Exception ex) {
             log.error("Error converting data records", ex);
             return generateJSONResponseMAV(false, new CSWRecord[] {}, "Error converting data records");
         }
        return generateJSONResponseMAV(true, recordRepresentations, "No errors");
    }
}
