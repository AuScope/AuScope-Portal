package org.auscope.portal.mineraloccurrence;

import java.util.Collection;

/**
 * User: Michael Stegherr
 * Date: 23/03/2009
 * Time: 1:59:02 PM
 */
public class CommodityFilter implements IFilter {
    private String             commodityGroup;
    private Collection<String> commodityNames;

    public CommodityFilter(String             commodityGroup,
                           Collection<String> commodityNames) {
        this.commodityGroup = commodityGroup;
        this.commodityNames = commodityNames;
    }

    /**
     * Build the query string based on given properties
     * @return
     */
    public String getFilterString() {
        StringBuffer queryString = new StringBuffer();

        queryString.append("<ogc:Filter \n" +
                "                xmlns:er=\"urn:cgi:xmlns:GGIC:EarthResource:1.1\"\n" +
                "                xmlns:wfs=\"http://www.opengis.net/wfs\"\n" +
                "                xmlns:ogc=\"http://www.opengis.net/ogc\" " +
                "                xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n");

        if(checkMany())
            queryString.append("<ogc:And>\n");

        if(!this.commodityGroup.equals(""))
            queryString.append("<ogc:PropertyIsEqualTo>\n" +
                    "                   <ogc:PropertyName>er:commodityGroup</ogc:PropertyName>\n" +
                    "                   <ogc:Literal>"+this.commodityGroup+"</ogc:Literal>\n" +
                    "           </ogc:PropertyIsEqualTo>\n");

        if(this.commodityNames != null)
        {
            // if commodities, filter that
            if( this.commodityNames.size()!=0 )
            {
                if( this.commodityNames.size()>1 )
                    queryString.append("<ogc:Or>\n");
                
                for( String commodityName : this.commodityNames ) {
                    queryString.append("<ogc:PropertyIsEqualTo>\n" +
                                       "        <ogc:PropertyName>er:commodityName</ogc:PropertyName>\n" +
                                       "        <ogc:Literal>"+commodityName+"</ogc:Literal>\n" +
                                       "</ogc:PropertyIsEqualTo>\n");
                }
                
                if( this.commodityNames.size()>1 )
                    queryString.append("</ogc:Or>\n");
            }
        }

        if(checkMany())
            queryString.append("</ogc:And>\n");

        queryString.append("</ogc:Filter>\n");

        return queryString.toString();
    }
    

    /**
     * Do more than one query parameter have a value
     * @return
     */
    private boolean checkMany() {
        int howManyHaveaValue = 0;

        if(!this.commodityGroup.equals(""))
            howManyHaveaValue++;
        if(this.commodityNames != null) {
            if(!this.commodityNames.isEmpty())
                howManyHaveaValue++;
        }
        
        if(howManyHaveaValue >= 2)
            return true;

        return false;
    }
}
