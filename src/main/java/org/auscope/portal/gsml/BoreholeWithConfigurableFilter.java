package org.auscope.portal.gsml;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.auscope.portal.core.services.methodmakers.filter.AbstractFilter;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.core.uifilter.GenericFilter;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

/**
 * @author Tannu Gupta
 *
 * @version $Id$
 */

public class BoreholeWithConfigurableFilter extends GenericFilter {

    protected List<String> restrictToIDList;

    // -------------------------------------------------------------- Constants

    /** Log object for this class. */
    protected final Log logger = LogFactory.getLog(getClass());

    // ----------------------------------------------------------- Constructors

    public BoreholeWithConfigurableFilter(String xPathFilters,List<String> restrictToIDList) {
        super(xPathFilters);
        this.restrictToIDList = restrictToIDList;
    }

    // --------------------------------------------------------- Public Methods

    @Override
    public String getFilterStringAllRecords() {
        return this.generateFilter(this.generateFilterFragment());
    }


    @Override
    public String getFilterStringBoundingBox(FilterBoundingBox bbox) {

        return this
                .generateFilter(this.generateAndComparisonFragment(
                        this.generateBboxFragment(bbox,
                                "gsml:collarLocation/gsml:BoreholeCollar/gsml:location"),
                                this.generateFilterFragment()));
    }

    // -------------------------------------------------------- Private Methods

    /**
     * we had to override generateFilterFragment just for NVCL as we need to filter by id for nvcl boreholes
     */
    @Override
    protected String generateFilterFragment() {
        List<String> parameterFragments = generateParameterFragments();

        if (this.restrictToIDList != null && !this.restrictToIDList.isEmpty()) {
            List<String> idFragments = new ArrayList<String>();
            for (String id : restrictToIDList) {
                if (id != null && id.length() > 0) {
                    idFragments.add(generateFeatureIdFragment("gsml.borehole." + id));
                }
            }
            parameterFragments.add(this
                    .generateOrComparisonFragment(idFragments
                            .toArray(new String[idFragments.size()])));
        }

        return this.generateAndComparisonFragment(this
                .generateAndComparisonFragment(parameterFragments
                        .toArray(new String[parameterFragments.size()])));
    }
}
