package org.auscope.portal.gsml;

import java.util.ArrayList;
import java.util.List;

import org.auscope.portal.core.services.methodmakers.filter.AbstractFilter;
import org.auscope.portal.core.services.methodmakers.filter.FilterBoundingBox;
import org.springframework.stereotype.Service;


/**
 * A class for filter SF0 Borehole web service
 * @author Florence Tan
 *
 */
@Service

public class SF0BoreholeFilter extends AbstractFilter {

    private String boreholeName;
    private String custodian;
    private String dateOfDrilling;

    // ----------------------------------------------------------- Constructors

    public SF0BoreholeFilter() {
        // test
    }

    public SF0BoreholeFilter(String boreholeName, String custodian, String dateOfDrilling) {
        this.boreholeName = boreholeName;
        this.custodian = custodian;
        this.dateOfDrilling = dateOfDrilling;
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

    // -------------------------------------------------------- Private Methods
    private String generateFilterFragment() {
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

        if (dateOfDrilling != null && !dateOfDrilling.isEmpty()) {
            parameterFragments.add(this.generatePropertyIsLikeFragment(
                    "gsmlp:drillStartDate",
                    this.dateOfDrilling));
        }

        return this.generateAndComparisonFragment(this
                .generateAndComparisonFragment(parameterFragments
                        .toArray(new String[parameterFragments.size()])));
    }
}
