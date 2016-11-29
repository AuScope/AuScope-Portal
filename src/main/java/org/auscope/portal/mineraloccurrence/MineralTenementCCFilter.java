package org.auscope.portal.mineraloccurrence;

/**
 * Class that represents ogc:Filter markup for mt:mineralTenement queries with CCStatus&CCType supporting 
 *
 * @author Lingbo Jiang
 * @version
 */
public class MineralTenementCCFilter extends  MineralTenementFilter {

    public MineralTenementCCFilter(String name, String tenementType, String owner, String size, String endDate) {
        super(name, tenementType, owner, size, endDate, null);

    }
    /**
     * Given a status name, this method will add mt:status into the filter list.
     * @param CCStatus
     *            the mt:status name
     * @return 
     */
    public void addCCStatusInFilter(String CCStatus) {
        if (CCStatus != null && !CCStatus.isEmpty()) {
            fragments.add(this.generatePropertyIsLikeFragment("mt:status", CCStatus));
        }

    }  
    /**
     * Given a type name,  this method will add mt:tenementType into the filter list.
     * @param CCType
     *            the mt:tenementType name
     * @return 
     */
    public void addCCTypeInFilter(String CCType) {
        if (CCType != null && !CCType.isEmpty()) {
            fragments.add(this.generatePropertyIsLikeFragment("mt:tenementType", CCType));
        }
    }        
}
