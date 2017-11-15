package org.auscope.portal.pressuredb;

import java.util.ArrayList;
import java.util.List;

import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.auscope.portal.gsml.BoreholeFilter;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.springframework.stereotype.Service;

/**
 * A class for PressureDB
 *
 * @author Lingbo Jiang
 *
 */
@Service
public class PressureDBFilter extends BoreholeFilter {
    public static final int CC_START = -999999; 
    public static final int CC_END = -999999;     
    private String ccProperty  = "Elevation";
    private int     ccStart = CC_START;
    private int     ccEnd = CC_END;
    public PressureDBFilter() {
        // test
        super(null, null, null, null, null,null);
    }

    public PressureDBFilter(String boreholeName, String custodian, String dateOfDrillingStart, String dateOfDrillingEnd, String ccProperty,int ccStart,int ccEnd, String optionalFilter) {
        super(boreholeName, custodian, dateOfDrillingStart, dateOfDrillingEnd, null, optionalFilter );
        this.ccProperty = ccProperty;
        this.ccStart = ccStart;
        this.ccEnd = ccEnd;
    }

    public String getFilterString(FilterBoundingBox bbox) {
        String filterString = null;
        if (bbox == null) {
            filterString = this.getFilterStringAllRecords();
        } else {
            filterString = this.getFilterStringBoundingBox(bbox);
        }

        return filterString;
    }
    
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
        List<String> parameterFragments = null;
        String optionalFilters = this.getxPathFilters();
        if(optionalFilters == null || optionalFilters.isEmpty()){
            parameterFragments = new ArrayList<String>();
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
                    ) {
                DateTimeFormatter formatter = DateTimeFormat
                        .forPattern("yyyy-MM-dd");
                DateTime dtStart = formatter
                        .parseDateTime(this.dateOfDrillingStart);
                // LJ: Need to minus 1 second for startDate to cover the time of
                // 00:00:00
                // Need to plus 1 second for endDate to cover the time of 00:00:00
                dtStart = dtStart.minusSeconds(1);

                DateTimeFormatter outFormatter = DateTimeFormat
                        .forPattern("yyyy-MM-dd HH:mm:ss");
                String utcDateofDrillingStart = outFormatter.print(dtStart);
                parameterFragments.add(this.generateDatePropertyIsGreaterThan(
                        "gsmlp:drillStartDate",false,
                        this.generateFunctionDateParse(utcDateofDrillingStart)));
            }
            
            if (dateOfDrillingEnd != null && !dateOfDrillingEnd.isEmpty()) {
                DateTimeFormatter formatter = DateTimeFormat
                        .forPattern("yyyy-MM-dd");
                DateTime dtEnd = formatter.parseDateTime(this.dateOfDrillingEnd);
                dtEnd = dtEnd.plusSeconds(1);
                DateTimeFormatter outFormatter = DateTimeFormat
                        .forPattern("yyyy-MM-dd HH:mm:ss");
                String utcDateofDrillingEnd = outFormatter.print(dtEnd);
                parameterFragments.add(this.generateDatePropertyIsLessThan(
                        "gsmlp:drillEndDate",false,
                        this.generateFunctionDateParse(utcDateofDrillingEnd)));
                
            }

            if (ccProperty != null && !ccProperty.isEmpty()) {
                String ccGsmlpProperty;
                switch (ccProperty) {
                case "Length":
                    ccGsmlpProperty = "gsmlp:boreholeLength_m";
                    break;
                case "Elevation":
                    ccGsmlpProperty = "gsmlp:elevation_m";
                    break;
                default:
                    ccGsmlpProperty = "";
                    break;
                }
                if (ccStart == CC_START) {
                    parameterFragments.add(this.generatePropertyIsLessThan(
                            ccGsmlpProperty,String.valueOf(ccEnd)));                    
                } else if (ccEnd == CC_END) {
                    parameterFragments.add(this.generatePropertyIsGreaterThanOrEqualTo(
                            ccGsmlpProperty,String.valueOf(ccStart)));                    
                } else {
                    parameterFragments.add(this.generatePropertyIsGreaterThanOrEqualTo(
                            ccGsmlpProperty,String.valueOf(ccStart)));          
                    parameterFragments.add(this.generatePropertyIsLessThan(
                            ccGsmlpProperty,String.valueOf(ccEnd)));
                }
            }

        }else{
            parameterFragments = this.generateParameterFragments();
        }

        return this.generateAndComparisonFragment(parameterFragments.toArray(new String[parameterFragments.size()]));

    }
}
