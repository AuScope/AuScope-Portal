package org.auscope.portal.mineraloccurrence;

/**
 * Class that represents ogc:Filter markup for mt:mineralTenement queries with CCStatus&CCType supporting 
 *
 * @author Lingbo Jiang
 * @version
 */
public class MineralTenementColorCodeFilter extends  MineralTenementFilter {
    private String ccTypeExplorationFilter = "<ogc:Or>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>ancillary mining licence</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>Christmas Island mining lease</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>coal mining lease</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>consolidated mining lease</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>dredging lease</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>extractive mineral lease</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>extractive mineral permit</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>general purpose lease</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>general purpose lease sa</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>gold lease</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>lease</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>licence to treat tailings</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>mineral claim converted to lease</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>mineral lease</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>mineral lease sa</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>mineral claim production</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>mining claim</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>mining lease</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>mining lease SA</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>mining licence</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>mining mineral owner lease</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>mining permit</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>mining purposes lease</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>miscellaneous licence</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>miscellaneous licence sa</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>miscellaneous purposes licence</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>offshore mining licence</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>private lands lease</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>private lands mining purposes lease</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>private mine</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>private mining operation</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>production licence</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>retention lease</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>special crown private lands lease</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>special lease</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>special mining lease</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>special purpose mining permit</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>work authority</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                    "</ogc:Or>";
    private String ccTypeProductionFilter = "<ogc:Or>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>assessment lease</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>assessment lease private mineral</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>christmas island exploration licence</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>commonwealth exploration licence</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>continental shelf licence</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>exploration licence</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>exploration licence application</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>exploration licence offshore</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>exploration licence private mineral</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>exploration licence substitution</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>exploration licence in retention</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>exploration permit</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>exploration permit for coal</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>exploration permit for minerals</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>exploration permit special</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>exploration prospecting lease</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>exploration release area</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>extractive mineral exploration licence</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>fossicking area</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>gold fossicking area</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>licence</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>mineral claim exploration</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>mineral development licence</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>offshore exploration licence</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>offshore mineral licence</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>offshore retention licence</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>offshore special purpose consents</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>prospecting licence</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>prospecting permit</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>retention licence</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>special exploration licence</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>temporary reserve</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                        "<ogc:PropertyIsLike escapeChar=\"!\" wildCard=\"*\" matchCase=\"false\" singleChar=\"#\" >"+
                                            "<ogc:PropertyName>mt:tenementType</ogc:PropertyName>"+
                                            "<ogc:Literal>tourist mining authority</ogc:Literal>"+
                                        "</ogc:PropertyIsLike>"+
                                    "</ogc:Or>";


    public MineralTenementColorCodeFilter(String name, String tenementType, String owner, String size, String endDate) {
        super(name, tenementType, owner, size, endDate);

    }
    
    public String getFilterStringForTypeProduction() {
        String formFilter = this.generateAndComparisonFragment(fragments.toArray(new String[fragments.size()]));        
        return this.generateFilter(this.generateAndComparisonFragment(formFilter,ccTypeProductionFilter));
    }   
    public String getFilterStringForTypeExploration() {
        String formFilter = this.generateAndComparisonFragment(fragments.toArray(new String[fragments.size()]));        
        return this.generateFilter(this.generateAndComparisonFragment(formFilter,ccTypeExplorationFilter));
    }        
}