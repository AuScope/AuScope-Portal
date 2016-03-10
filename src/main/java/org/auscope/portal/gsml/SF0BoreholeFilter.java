package org.auscope.portal.gsml;

import java.util.ArrayList;
import java.util.List;

import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.springframework.stereotype.Service;

/**
 * A class for filter SF0 Borehole web service
 *
 * @author Florence Tan
 *
 */
@Service
public class SF0BoreholeFilter extends BoreholeFilter {

    // ----------------------------------------------------------- Constructors

    public SF0BoreholeFilter() {
        // test
        super(null, null, null, null, null);
    }

    public SF0BoreholeFilter(String boreholeName, String custodian, String dateOfDrillingStart, String dateOfDrillingEnd,List<String> ids) {
        super(boreholeName, custodian, dateOfDrillingStart, dateOfDrillingEnd, ids);
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
                                "gsmlp:shape"),
                        this.generateFilterFragment()));
    }

    @Override
    protected String generateFilterFragment() {
        List<String> parameterFragments = new ArrayList<String>();
        if (boreholeName != null && !boreholeName.isEmpty()) {
            parameterFragments.add(this.generatePropertyIsLikeFragment(
                    "gsmlp:name", this.boreholeName));
        }

        if (custodian != null && !custodian.isEmpty()) {
            parameterFragments
                    .add(this
                            .generatePropertyIsLikeFragment(
                                    "gsmlp:boreholeMaterialCustodian",
                                    this.custodian));
        }

        if (dateOfDrillingStart != null && !dateOfDrillingStart.isEmpty()
                && dateOfDrillingEnd != null && !dateOfDrillingEnd.isEmpty()) {
            // AUS-2595 Due to the date compare does not like the
            // PropertyIsLike, it was change to use PropertyIsGreaterThan & PropertyIsLessThan.
            DateTimeFormatter formatter = DateTimeFormat
                    .forPattern("yyyy-MM-dd");
            DateTime dtStart = formatter
                    .parseDateTime(this.dateOfDrillingStart);
            DateTime dtEnd = formatter.parseDateTime(this.dateOfDrillingEnd);
            // LJ: Need to minus 1 second for startDate to cover the time of
            // 00:00:00
            // Need to plus 1 second for endDate to cover the time of 00:00:00
            dtStart = dtStart.minusSeconds(1);
            dtEnd = dtEnd.plusSeconds(1);
            DateTimeFormatter outFormatter = DateTimeFormat
                    .forPattern("yyyy-MM-dd HH:mm:ss");
            String utcDateofDrillingStart = outFormatter.print(dtStart);
            String utcDateofDrillingEnd = outFormatter.print(dtEnd);
            parameterFragments.add(this.generateDatePropertyIsGreaterThan(
                    "gsmlp:drillStartDate",false,
                    this.generateFunctionDateParse(utcDateofDrillingStart)));

            parameterFragments.add(this.generateDatePropertyIsLessThan(
                    "gsmlp:drillStartDate",false,
                    this.generateFunctionDateParse(utcDateofDrillingEnd)));
        }

        if (this.restrictToIDList != null && !this.restrictToIDList.isEmpty()) {
            List<String> idFragments = new ArrayList<String>();
            for (String id : restrictToIDList) {
                if (id != null && id.length() > 0) {
                    idFragments.add(this.generateFeatureIdFragment("gsml.borehole." + id));
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
