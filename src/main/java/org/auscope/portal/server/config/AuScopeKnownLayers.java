package org.auscope.portal.server.config;

import java.awt.Dimension;
import java.awt.Point;
import java.util.ArrayList;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.apache.commons.lang3.tuple.ImmutablePair;

import org.auscope.portal.core.uifilter.AbstractBaseFilter;
import org.auscope.portal.core.uifilter.mandatory.AbstractMandatoryParamBinding;
import org.auscope.portal.core.view.knownlayer.CSWRecordSelector;
import org.auscope.portal.core.view.knownlayer.KnownLayer;
import org.auscope.portal.core.view.knownlayer.WFSSelector;
import org.auscope.portal.core.view.knownlayer.WMSSelector;
import org.auscope.portal.core.uifilter.FilterCollection;
import org.auscope.portal.core.uifilter.optional.xpath.UITextBox;
import org.auscope.portal.core.uifilter.optional.UICheckBoxGroupProvider;
import org.auscope.portal.core.uifilter.Predicate;
import org.auscope.portal.core.uifilter.optional.xpath.UIDropDownRemote;
import org.auscope.portal.core.uifilter.optional.xpath.UIDropDownSelectList;
import org.auscope.portal.core.uifilter.optional.xpath.UIDate;
import org.auscope.portal.core.uifilter.optional.xpath.UIPolygonBBox;





/**
 * Known layer bean definitions (originally migrated from Spring MVC auscope-known-layers.xml)
 *
 */
@Configuration
public class AuScopeKnownLayers { 


    private void setupIcon(KnownLayer layer) {
        Point iconAnchor = new Point(16,32);
        layer.setIconAnchor(iconAnchor);
        Dimension iconSize = new Dimension(32,32);
        layer.setIconSize(iconSize);
    }


    private FilterCollection createProviderFilterCollection() {
        UICheckBoxGroupProvider uiCheckBoxGroupProvider = new UICheckBoxGroupProvider("Provider", null);
        List<AbstractBaseFilter> optionalFilters = new ArrayList<AbstractBaseFilter> ();
        optionalFilters.add(uiCheckBoxGroupProvider);
        FilterCollection filterCollection = new FilterCollection();
        filterCollection.setOptionalFilters(optionalFilters); 
        return filterCollection;
    }


    private FilterCollection createTextBoxFilterCollection(String label, String value) {
        List<AbstractBaseFilter> optionalFilters = new ArrayList<AbstractBaseFilter>();
        UITextBox nameTextBox = new UITextBox(label, value, null, Predicate.ISLIKE);
        optionalFilters.add(nameTextBox);
        FilterCollection filterCollection = new FilterCollection();
        filterCollection.setOptionalFilters(optionalFilters);
        return filterCollection;
    }


    private FilterCollection createIgsnFilterCollection() {
        List<AbstractBaseFilter> optionalFilters = new ArrayList<AbstractBaseFilter>();
        UITextBox nameTextBox = new UITextBox("Name", "gsmlp:name", null, Predicate.ISLIKE);
        UITextBox igsnTextBox = new UITextBox("IGSN", "igsn", null, Predicate.ISLIKE);
        optionalFilters.add(nameTextBox);
        optionalFilters.add(igsnTextBox);
        FilterCollection filterCollection = new FilterCollection();
        filterCollection.setOptionalFilters(optionalFilters);
        return filterCollection;
    }


    private void addDrillDateFilters(List<AbstractBaseFilter> optionalFilters) {
        UIDate startFromDate = new UIDate("Drilling Start From", "gsmlp:drillStartDate", null, Predicate.BIGGER_THAN);
        UIDate startToDate = new UIDate("Drilling Start To", "gsmlp:drillStartDate", null, Predicate.SMALLER_THAN);
        UIDate endFromDate = new UIDate("Drilling End From", "gsmlp:drillEndDate", null, Predicate.BIGGER_THAN);
        UIDate endToDate = new UIDate("Drilling End To", "gsmlp:drillEndDate", null, Predicate.SMALLER_THAN);
        optionalFilters.add(startFromDate);
        optionalFilters.add(startFromDate);
        optionalFilters.add(startFromDate);
        optionalFilters.add(startFromDate);
    }

/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeMine">
        <ns0:constructor-arg name="id" value="erml-mine" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="er:MiningFeatureOccurrence" />
                <ns0:property name="relatedFeatureTypeNames">
                    <ns0:list>
                        <ns0:value>er:Mine</ns0:value>
                        <ns0:value>gsml:MappedFeature</ns0:value>
                    </ns0:list>
                </ns0:property>
            </ns0:bean>
        </ns0:constructor-arg>

        <ns0:property name="name" value="Earth Resource Mine" />
        <ns0:property name="description" value="A collection of services that implement the AuScope EarthResourceML v1 Profile for er:Mine" />
        <ns0:property name="group" value="Earth Resources(old)" />
        <ns0:property name="proxyUrl" value="doMineFilter.do" />
        <ns0:property name="proxyCountUrl" value="doMineFilterCount.do" />
        <ns0:property name="proxyStyleUrl" value="doMineFilterStyle.do" />
        <ns0:property name="proxyDownloadUrl" value="doMineFilterDownload.do" />
        <ns0:property name="iconUrl" value="http://maps.google.com/mapfiles/kml/paddle/pink-blank.png" />
        <ns0:property name="iconAnchor">
            <ns0:bean class="java.awt.Point">
                <ns0:constructor-arg index="0" value="16" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="iconSize">
            <ns0:bean class="java.awt.Dimension">
                <ns0:constructor-arg index="0" value="32" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="order" value="10" />
        <ns0:property name="nagiosHostGroup" value="GeolSurveySISSDeployments" />
        <ns0:property name="nagiosServiceGroup" value="EarthResourcesLayers" />
        <ns0:property name="filterCollection">
             <ns0:bean class="org.auscope.portal.core.uifilter.FilterCollection">
                <ns0:property name="optionalFilters">
                    <ns0:list>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UITextBox">
                            <ns0:constructor-arg name="label" value="Mine Name" />
                            <ns0:constructor-arg name="xpath" value="er:specification/er:Mine/er:mineName/er:MineName/er:mineName" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISLIKE</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>                          
                         <ns0:bean class="org.auscope.portal.core.uifilter.optional.UICheckBoxGroupProvider">
                            <ns0:constructor-arg name="label" value="Provider" />                            
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                                                        
                        </ns0:bean>   
                    </ns0:list>
                </ns0:property>                       
            </ns0:bean>        
        </ns0:property>
    </ns0:bean>
    
*/

    @Bean
    public WMSSelector knownTypeMineSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeMine() {
        KnownLayer layer = new KnownLayer("erml-mine", knownTypeMineSelector());
        layer.setName("Earth Resource Mine");
        layer.setDescription("A collection of services that implement the AuScope EarthResourceML v1 Profile for er:Mine");
        layer.setGroup("Earth Resources(old)");
        layer.setProxyUrl("doMineFilter.do");
        layer.setProxyCountUrl("doMineFilterCount.do");
        layer.setProxyStyleUrl("doMineFilterStyle.do");
        layer.setProxyDownloadUrl("doMineFilterDownload.do");
        layer.setIconUrl("http://maps.google.com/mapfiles/kml/paddle/pink-blank.png");
        setupIcon(layer);
        layer.setOrder("10");
        layer.setNagiosHostGroup("GeolSurveySISSDeployments");
        layer.setNagiosServiceGroup("EarthResourcesLayers");
        
        UITextBox uiTextBox = new UITextBox("Mine Name", "er:specification/er:Mine/er:mineName/er:MineName/er:mineName", null, Predicate.ISLIKE);
        UICheckBoxGroupProvider uiCheckBoxGroupProvider = new UICheckBoxGroupProvider("Provider", null);
        List<AbstractBaseFilter> optionalFilters = new ArrayList<AbstractBaseFilter> ();
        optionalFilters.add(uiTextBox);
        optionalFilters.add(uiCheckBoxGroupProvider);
        FilterCollection filterCollection = new FilterCollection();
        filterCollection.setOptionalFilters(optionalFilters);        
        layer.setFilterCollection(filterCollection);
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeMineralOccurrence">
        <ns0:constructor-arg name="id" value="erml-mineraloccurrence" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="gsml:MappedFeature" />
                <ns0:property name="relatedFeatureTypeNames">
                    <ns0:list>
                        <ns0:value>er:Commodity</ns0:value>
                        <ns0:value>er:MineralOccurrence</ns0:value>
                    </ns0:list>
                </ns0:property>
            </ns0:bean>
        </ns0:constructor-arg>

        <ns0:property name="name" value="Earth Resource Mineral Occurrence" />
        <ns0:property name="description" value="A collection of services that implement the AuScope EarthResourceML v1 Profile for er:MineralOccurence" />
        <ns0:property name="group" value="Earth Resources(old)" />
        <ns0:property name="proxyUrl" value="doMineralOccurrenceFilter.do" />
        <ns0:property name="proxyCountUrl" value="doMineralOccurrenceFilterCount.do" />
        <ns0:property name="proxyStyleUrl" value="doMineralOccurrenceFilterStyle.do" />
        <ns0:property name="proxyDownloadUrl" value="doMineralOccurrenceFilterDownload.do" />
        <ns0:property name="iconUrl" value="http://maps.google.com/mapfiles/kml/paddle/purple-blank.png" />
        <ns0:property name="iconAnchor">
            <ns0:bean class="java.awt.Point">
                <ns0:constructor-arg index="0" value="16" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="iconSize">
            <ns0:bean class="java.awt.Dimension">
                <ns0:constructor-arg index="0" value="32" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="order" value="11" />
        <ns0:property name="nagiosHostGroup" value="GeolSurveySISSDeployments" />
        <ns0:property name="nagiosServiceGroup" value="EarthResourcesLayers" />
        <ns0:property name="filterCollection">
             <ns0:bean class="org.auscope.portal.core.uifilter.FilterCollection">
                <ns0:property name="optionalFilters">
                    <ns0:list>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UIDropDownRemote">
                            <ns0:constructor-arg name="label" value="Commodity" />
                            <ns0:constructor-arg name="xpath" value="gsml:specification/er:MineralOccurrence/er:commodityDescription/er:Commodity/er:commodityName" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISEQUAL</ns0:value>
                            </ns0:constructor-arg>
                            <ns0:constructor-arg name="url" value="getAllCommodities.do" />
                        </ns0:bean>  
                         <ns0:bean class="org.auscope.portal.core.uifilter.optional.UICheckBoxGroupProvider">
                            <ns0:constructor-arg name="label" value="Provider" />                            
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                                                        
                        </ns0:bean> 
                    </ns0:list>
                </ns0:property>                             
            </ns0:bean>        
        </ns0:property>
    </ns0:bean>
    
*/

    @Bean
    public WMSSelector knownTypeMineralOccurrenceSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeMineralOccurrence() {
        KnownLayer layer = new KnownLayer("erml-mineraloccurrence", knownTypeMineralOccurrenceSelector());
        layer.setName("Earth Resource Mineral Occurrence");
        layer.setDescription("A collection of services that implement the AuScope EarthResourceML v1 Profile for er:MineralOccurence");
        layer.setGroup("Earth Resources(old)");
        layer.setProxyUrl("doMineralOccurrenceFilter.do");
        layer.setProxyCountUrl("doMineralOccurrenceFilterCount.do");
        layer.setProxyStyleUrl("doMineralOccurrenceFilterStyle.do");
        layer.setProxyDownloadUrl("doMineralOccurrenceFilterDownload.do");
        layer.setIconUrl("http://maps.google.com/mapfiles/kml/paddle/purple-blank.png");
        setupIcon(layer);
        layer.setOrder("11");
        layer.setNagiosHostGroup("GeolSurveySISSDeployments");
        layer.setNagiosServiceGroup("EarthResourcesLayers");

        UIDropDownRemote uiDropDownRemote = new UIDropDownRemote("Commodity", "gsml:specification/er:MineralOccurrence/er:commodityDescription/er:Commodity/er:commodityName", null, Predicate.ISEQUAL, "getAllCommodities.do");
        UICheckBoxGroupProvider uiCheckBoxGroupProvider = new UICheckBoxGroupProvider("Provider", null);
        List<AbstractBaseFilter> optionalFilters = new ArrayList<AbstractBaseFilter> ();
        optionalFilters.add(uiDropDownRemote);
        optionalFilters.add(uiCheckBoxGroupProvider);
        FilterCollection filterCollection = new FilterCollection();
        filterCollection.setOptionalFilters(optionalFilters);        
        layer.setFilterCollection(filterCollection);
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeMiningActivity">
        <ns0:constructor-arg name="id" value="erml-miningactivity" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="er:MiningFeatureOccurrence" />
                <ns0:property name="relatedFeatureTypeNames">
                    <ns0:list>
                        <ns0:value>er:MiningActivity</ns0:value>
                        <ns0:value>gsml:MappedFeature</ns0:value>
                    </ns0:list>
                </ns0:property>
            </ns0:bean>
        </ns0:constructor-arg>

        <ns0:property name="name" value="Earth Resource Mining Activity" />
        <ns0:property name="description" value="A collection of services that implement the AuScope EarthResourceML v1 Profile for er:MiningActivity" />
        <ns0:property name="group" value="Earth Resources(old)" />
        <ns0:property name="proxyUrl" value="doMiningActivityFilter.do" />
        <ns0:property name="proxyCountUrl" value="doMiningActivityFilterCount.do" />
        <ns0:property name="proxyStyleUrl" value="doMiningActivityFilterStyle.do" />
        <ns0:property name="proxyDownloadUrl" value="doMiningActivityFilterDownload.do" />
        <ns0:property name="iconUrl" value="http://maps.google.com/mapfiles/kml/paddle/orange-blank.png" />
        <ns0:property name="iconAnchor">
            <ns0:bean class="java.awt.Point">
                <ns0:constructor-arg index="0" value="16" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="iconSize">
            <ns0:bean class="java.awt.Dimension">
                <ns0:constructor-arg index="0" value="32" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="order" value="12" />
        <ns0:property name="nagiosHostGroup" value="GeolSurveySISSDeployments" />
        <ns0:property name="nagiosServiceGroup" value="EarthResourcesLayers" />
        <ns0:property name="filterCollection">
             <ns0:bean class="org.auscope.portal.core.uifilter.FilterCollection">
                <ns0:property name="optionalFilters">
                    <ns0:list>                        
                         <ns0:bean class="org.auscope.portal.core.uifilter.optional.UICheckBoxGroupProvider">
                            <ns0:constructor-arg name="label" value="Provider" />                            
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                                                        
                        </ns0:bean>                                        
                    </ns0:list>
                </ns0:property>                             
            </ns0:bean>        
        </ns0:property>
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeMiningActivitySelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeMiningActivity() {
        KnownLayer layer = new KnownLayer("erml-miningactivity", knownTypeMiningActivitySelector());
        layer.setName("Earth Resource Mining Activity");
        layer.setDescription("A collection of services that implement the AuScope EarthResourceML v1 Profile for er:MiningActivity");
        layer.setGroup("Earth Resources(old)");
        layer.setProxyUrl("doMiningActivityFilter.do");
        layer.setProxyCountUrl("doMiningActivityFilterCount.do");
        layer.setProxyStyleUrl("doMiningActivityFilterStyle.do");
        layer.setProxyDownloadUrl("doMiningActivityFilterDownload.do");
        layer.setIconUrl("http://maps.google.com/mapfiles/kml/paddle/orange-blank.png");
        setupIcon(layer);
        layer.setOrder("12");
        layer.setNagiosHostGroup("GeolSurveySISSDeployments");
        layer.setNagiosServiceGroup("EarthResourcesLayers");
        
        // Optional filters        
        layer.setFilterCollection(this.createProviderFilterCollection());
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeMineralTenements">
        <ns0:constructor-arg name="id" value="mineral-tenements" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSWFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="mt:MineralTenement" />
                <ns0:constructor-arg name="layerName" value="MineralTenement" />
            </ns0:bean>
        </ns0:constructor-arg>

        <ns0:property name="name" value="Mineral Tenements" />
        <ns0:property name="description" value="A collection of services that implement the AuScope EarthResourceML v1 Profile for mt:Mineral Tenement" />
        <ns0:property name="group" value="Tenements" />
        <ns0:property name="proxyUrl" value="getAllMineralTenementFeatures.do" />
		<ns0:property name="proxyGetFeatureInfoUrl" value="getMineralTenementFeatureInfo.do" />
        <ns0:property name="proxyCountUrl" value="getMineralTenementCount.do" />
        <ns0:property name="proxyStyleUrl" value="getMineralTenementStyle.do" />
        <ns0:property name="proxyDownloadUrl" value="doMineralTenementCSVDownload.do" />       
        <ns0:property name="order" value="150" />
        <ns0:property name="nagiosHostGroup" value="GeolSurveySISSDeployments" />
        <ns0:property name="nagiosServiceGroup" value="TenementsLayers" />
        <ns0:property name="filterCollection">
             <ns0:bean class="org.auscope.portal.core.uifilter.FilterCollection">
                <ns0:property name="optionalFilters">
                    <ns0:list>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UITextBox">
                            <ns0:constructor-arg name="label" value="Name" />
                            <ns0:constructor-arg name="xpath" value="mt:name" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISLIKE</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean> 
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UIDropDownSelectList">
                            <ns0:constructor-arg name="label" value="Tenement Type" />  
                             <ns0:constructor-arg name="xpath" value="mt:tenementType" />                          
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>
                             <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISLIKE</ns0:value>
                            </ns0:constructor-arg>                            
                            <ns0:constructor-arg name="options">
                                <ns0:list>
                                    <ns0:bean class="org.apache.commons.lang3.tuple.ImmutablePair">
                                        <ns0:constructor-arg name="left"><ns0:value type="java.lang.String">Exploration</ns0:value></ns0:constructor-arg>
                                        <ns0:constructor-arg name="right"><ns0:value type="java.lang.String">exploration</ns0:value></ns0:constructor-arg>
                                    </ns0:bean>
                                    <ns0:bean class="org.apache.commons.lang3.tuple.ImmutablePair">
                                        <ns0:constructor-arg name="left"><ns0:value type="java.lang.String">Prospecting</ns0:value></ns0:constructor-arg>
                                        <ns0:constructor-arg name="right"><ns0:value type="java.lang.String">prospecting</ns0:value></ns0:constructor-arg>
                                    </ns0:bean>
                                    <ns0:bean class="org.apache.commons.lang3.tuple.ImmutablePair">
                                        <ns0:constructor-arg name="left"><ns0:value type="java.lang.String">Miscellaneous</ns0:value></ns0:constructor-arg>
                                        <ns0:constructor-arg name="right"><ns0:value type="java.lang.String">miscellaneous</ns0:value></ns0:constructor-arg>
                                    </ns0:bean>
                                    <ns0:bean class="org.apache.commons.lang3.tuple.ImmutablePair">
                                        <ns0:constructor-arg name="left"><ns0:value type="java.lang.String">Mining Lease</ns0:value></ns0:constructor-arg>
                                        <ns0:constructor-arg name="right"><ns0:value type="java.lang.String">mining</ns0:value></ns0:constructor-arg>
                                    </ns0:bean>
                                    <ns0:bean class="org.apache.commons.lang3.tuple.ImmutablePair">
                                        <ns0:constructor-arg name="left"><ns0:value type="java.lang.String">Licence</ns0:value></ns0:constructor-arg>
                                        <ns0:constructor-arg name="right"><ns0:value type="java.lang.String">licence</ns0:value></ns0:constructor-arg>
                                    </ns0:bean>
                                </ns0:list>                               
                            </ns0:constructor-arg>
                        </ns0:bean>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UITextBox">
                            <ns0:constructor-arg name="label" value="Owner" />
                            <ns0:constructor-arg name="xpath" value="mt:owner" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISLIKE</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>                         
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UIDate">
                            <ns0:constructor-arg name="label" value="Expiry From" />
                            <ns0:constructor-arg name="xpath" value="mt:expireDate" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">BIGGER_THAN</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UIDate">
                            <ns0:constructor-arg name="label" value="Expiry To" />
                            <ns0:constructor-arg name="xpath" value="mt:expireDate" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">SMALLER_THAN</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>                      
                         <ns0:bean class="org.auscope.portal.core.uifilter.optional.UICheckBoxGroupProvider">
                            <ns0:constructor-arg name="label" value="Provider" />                            
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                                                        
                        </ns0:bean>
                    </ns0:list>
                </ns0:property> 
                <ns0:property name="mandatoryFilters">
                    <ns0:list>
                        <ns0:bean class="org.auscope.portal.core.uifilter.mandatory.UIDropDownSelectList">
                            <ns0:constructor-arg name="label" type="java.lang.String" value="Color Code" />
                            <ns0:constructor-arg name="parameter" type="java.lang.String" value="ccProperty" />                         
                            <ns0:constructor-arg name="value" type="java.lang.String" value="TenementType" />  
                            <ns0:constructor-arg name="options">
                                <ns0:list>
                                    <ns0:bean class="org.apache.commons.lang3.tuple.ImmutablePair">
                                        <ns0:constructor-arg name="left"><ns0:value type="java.lang.String">Tenement Type</ns0:value></ns0:constructor-arg>
                                        <ns0:constructor-arg name="right"><ns0:value type="java.lang.String">TenementType</ns0:value></ns0:constructor-arg>
                                    </ns0:bean>
                                    <ns0:bean class="org.apache.commons.lang3.tuple.ImmutablePair">
                                        <ns0:constructor-arg name="left"><ns0:value type="java.lang.String">Tenement Status</ns0:value></ns0:constructor-arg>
                                        <ns0:constructor-arg name="right"><ns0:value type="java.lang.String">TenementStatus</ns0:value></ns0:constructor-arg>
                                    </ns0:bean>
                                    <ns0:bean class="org.apache.commons.lang3.tuple.ImmutablePair">
                                        <ns0:constructor-arg name="left"><ns0:value type="java.lang.String">UnStyled</ns0:value></ns0:constructor-arg>
                                        <ns0:constructor-arg name="right"><ns0:value type="java.lang.String" /></ns0:constructor-arg>
                                    </ns0:bean>                                    
                                </ns0:list>                               
                            </ns0:constructor-arg>                                                      
                        </ns0:bean>
                    </ns0:list>
                </ns0:property>               
            </ns0:bean>        
        </ns0:property>
    </ns0:bean>
    
    
*/

    @Bean
    public WMSSelector knownTypeMineralTenementsSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeMineralTenements() {
        KnownLayer layer = new KnownLayer("mineral-tenements", knownTypeMineralTenementsSelector());
        layer.setName("Mineral Tenements");
        layer.setDescription("A collection of services that implement the AuScope EarthResourceML v1 Profile for mt:Mineral Tenement");
        layer.setGroup("Tenements");
        layer.setProxyUrl("getAllMineralTenementFeatures.do");
        layer.setProxyGetFeatureInfoUrl("getMineralTenementFeatureInfo.do");
        layer.setProxyCountUrl("getMineralTenementCount.do");
        layer.setProxyStyleUrl("getMineralTenementStyle.do");
        layer.setProxyDownloadUrl("doMineralTenementCSVDownload.do");
        layer.setOrder("150");
        layer.setNagiosHostGroup("GeolSurveySISSDeployments");
        layer.setNagiosServiceGroup("TenementsLayers");

        UITextBox nameTextBox = new UITextBox("Name", "mt:name", null, Predicate.ISLIKE);
        List<ImmutablePair<String,String>> options = new ArrayList<ImmutablePair<String,String>>();
        options.add(new ImmutablePair("Exploration", "exploration"));
        options.add(new ImmutablePair("Prospecting", "prospecting"));
        options.add(new ImmutablePair("Miscellaneous", "miscellaneous"));
        options.add(new ImmutablePair("Mining Lease", "mining"));
        options.add(new ImmutablePair("Licence", "licence"));
        UIDropDownSelectList uiDropDownSelectList = new UIDropDownSelectList("Tenement Type", "mt:tenementType", null, Predicate.ISLIKE, options);
        UITextBox ownerTextBox = new UITextBox("Owner", "mt:owner", null, Predicate.ISLIKE);
        UIDate expiryFromDate = new UIDate("Expiry From", "mt:expireDate", null, Predicate.BIGGER_THAN);
        UIDate expiryToDate = new UIDate("Expiry To", "mt:expireDate", null, Predicate.SMALLER_THAN);
        UICheckBoxGroupProvider uiCheckBoxGroupProvider = new UICheckBoxGroupProvider("Provider", null);
        
        List<AbstractBaseFilter> optionalFilters = new ArrayList<AbstractBaseFilter>();
        optionalFilters.add(nameTextBox);
        optionalFilters.add(uiDropDownSelectList);
        optionalFilters.add(ownerTextBox);
        optionalFilters.add(expiryFromDate);
        optionalFilters.add(expiryToDate);
        optionalFilters.add(uiCheckBoxGroupProvider);
        FilterCollection filterCollection = new FilterCollection();
        filterCollection.setOptionalFilters(optionalFilters);
        
        // Mandatory filters - note use of full path names for declaring vars to prevent clashes with imported optional params
        List<ImmutablePair<String,String>> mandatoryOptions = new ArrayList<ImmutablePair<String,String>>();
        mandatoryOptions.add(new ImmutablePair("Tenement Type", "TenementType"));
        mandatoryOptions.add(new ImmutablePair("Tenement Status", "TenementStatus"));
        mandatoryOptions.add(new ImmutablePair("UnStyled", null));
        org.auscope.portal.core.uifilter.mandatory.UIDropDownSelectList mandDropDownSelectList;
        mandDropDownSelectList = new org.auscope.portal.core.uifilter.mandatory.UIDropDownSelectList("Color Code", "ccProperty", "TenementType", mandatoryOptions);
        List<AbstractMandatoryParamBinding> mandParamList  = new ArrayList<AbstractMandatoryParamBinding>();
        mandParamList.add(mandDropDownSelectList);
        filterCollection.setMandatoryFilters(mandParamList);
        layer.setFilterCollection(filterCollection);
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeColorCodeMineralTenements">
        <ns0:constructor-arg name="id" value="colorcode-mineral-tenements" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="mt:MineralTenement" />
            </ns0:bean>
        </ns0:constructor-arg>

        <ns0:property name="name" value="ColorCode Mineral Tenements" />
        <ns0:property name="description" value="A collection of services that implement the AuScope EarthResourceML v1 Profile for mt:Mineral Tenement" />
        <ns0:property name="group" value="Tenements" />

        
        <ns0:property name="proxyUrl" value="" />
        <ns0:property name="proxyCountUrl" value="" />
        <ns0:property name="proxyStyleUrl" value="getColorCodeMineralTenementStyle.do" />
        <ns0:property name="proxyDownloadUrl" value="doMineralTenementDownload.do" />
        
        <ns0:property name="order" value="151" />
    </ns0:bean>
        
    
*/

    @Bean
    public WMSSelector knownTypeColorCodeMineralTenementsSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeColorCodeMineralTenements() {
        KnownLayer layer = new KnownLayer("colorcode-mineral-tenements", knownTypeColorCodeMineralTenementsSelector());
        layer.setName("ColorCode Mineral Tenements");
        layer.setDescription("A collection of services that implement the AuScope EarthResourceML v1 Profile for mt:Mineral Tenement");
        layer.setGroup("Tenements");
        layer.setProxyUrl("");
        layer.setProxyCountUrl("");
        layer.setProxyStyleUrl("getColorCodeMineralTenementStyle.do");
        layer.setProxyDownloadUrl("doMineralTenementDownload.do");
        layer.setOrder("151");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypehydrogeochem">
        <ns0:constructor-arg name="id" value="capdf-hydrogeochem" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="public:hydrogeochem" />
            </ns0:bean>
        </ns0:constructor-arg>

        <ns0:property name="name" value="Hydrogeochemistry" />
        <ns0:property name="description" value="Northern Yilgarn Hydrogeochemistry " />
        <ns0:property name="group" value="Northern Yilgarn Hydrogeochemistry " />

        
        <ns0:property name="proxyUrl" value="" />
        <ns0:property name="proxyCountUrl" value="" />
        <ns0:property name="proxyStyleUrl" value="getCapdfHydroGeoChemStyle.do" />
        <ns0:property name="proxyDownloadUrl" value="doCapdfHydroGeoChemDownload.do" />
        <ns0:property name="order" value="160" />
        <ns0:property name="filterCollection">
             <ns0:bean class="org.auscope.portal.core.uifilter.FilterCollection">
                <ns0:property name="optionalFilters">
                    <ns0:list>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UITextBox">
                            <ns0:constructor-arg name="label" value="Batch Id" />
                            <ns0:constructor-arg name="xpath" value="batch_id" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISLIKE</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>                                 
                    </ns0:list>
                </ns0:property>                       
            </ns0:bean>        
        </ns0:property>   
    </ns0:bean>
    
    
*/

    @Bean
    public WMSSelector knownTypehydrogeochemSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypehydrogeochem() {
        KnownLayer layer = new KnownLayer("capdf-hydrogeochem", knownTypehydrogeochemSelector());
        layer.setName("Hydrogeochemistry");
        layer.setDescription("Northern Yilgarn Hydrogeochemistry ");
        layer.setGroup("Northern Yilgarn Hydrogeochemistry ");
        layer.setProxyUrl("");
        layer.setProxyCountUrl("");
        layer.setProxyStyleUrl("getCapdfHydroGeoChemStyle.do");
        layer.setProxyDownloadUrl("doCapdfHydroGeoChemDownload.do");
        layer.setOrder("160");
        
        // Optional filters
        layer.setFilterCollection(this.createTextBoxFilterCollection("Batch Id", "batch_id"));
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeErlMineView">
        <ns0:constructor-arg name="id" value="erl-mineview" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="erl:MineView" />
            </ns0:bean>
        </ns0:constructor-arg>

        <ns0:property name="name" value="Mine View" />
        <ns0:property name="description" value="Earth ResourceML Lite Mine" />
        <ns0:property name="group" value="Earth Resources Lite(new)" />

        
        <ns0:property name="proxyUrl" value="" />
        <ns0:property name="proxyCountUrl" value="" />
        <ns0:property name="proxyStyleUrl" value="getErlMineViewStyle.do" />
        <ns0:property name="proxyDownloadUrl" value="" />
        <ns0:property name="order" value="160" />
        <ns0:property name="nagiosHostGroup" value="GeolSurveySISSDeployments" />
        <ns0:property name="nagiosServiceGroup" value="EarthResourcesLayers" />
        <ns0:property name="filterCollection">
             <ns0:bean class="org.auscope.portal.core.uifilter.FilterCollection">
                <ns0:property name="optionalFilters">
                    <ns0:list>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UITextBox">
                            <ns0:constructor-arg name="label" value="Name" />
                            <ns0:constructor-arg name="xpath" value="erl:name" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISLIKE</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UIDropDownRemote">
                            <ns0:constructor-arg name="label" value="Status" />
                            <ns0:constructor-arg name="xpath" value="erl:status_uri" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISEQUAL</ns0:value>
                            </ns0:constructor-arg>
                            <ns0:constructor-arg name="url" value="getAllMineStatuses.do" />
                        </ns0:bean>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.UICheckBoxGroupProvider">
                            <ns0:constructor-arg name="label" value="Provider" />                            
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                                                        
                        </ns0:bean>  
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UIPolygonBBox">
                            <ns0:constructor-arg name="label" value="Polygon BBox" />
                            <ns0:constructor-arg name="xpath" value="erl:shape" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISEQUAL</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>   
                    </ns0:list>
                </ns0:property>                       
            </ns0:bean>        
        </ns0:property>   
    </ns0:bean>
    
    
*/

    @Bean
    public WMSSelector knownTypeErlMineViewSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeErlMineView() {
        KnownLayer layer = new KnownLayer("erl-mineview", knownTypeErlMineViewSelector());
        layer.setName("Mine View");
        layer.setDescription("Earth ResourceML Lite Mine");
        layer.setGroup("Earth Resources Lite(new)");
        layer.setProxyUrl("");
        layer.setProxyCountUrl("");
        layer.setProxyStyleUrl("getErlMineViewStyle.do");
        layer.setProxyDownloadUrl("");
        layer.setOrder("160");
        layer.setNagiosHostGroup("GeolSurveySISSDeployments");
        layer.setNagiosServiceGroup("EarthResourcesLayers");
        
        // Optional filters
        List<AbstractBaseFilter> optionalFilters = new ArrayList<AbstractBaseFilter>();
        UITextBox nameTextBox = new UITextBox("Name", "erl:name", null, Predicate.ISLIKE);
        UIDropDownRemote uiDropDownRemote = new UIDropDownRemote("Status", "erl:status_uri", null, Predicate.ISEQUAL, "getAllMineStatuses.do");
        UICheckBoxGroupProvider uiCheckBoxGroupProvider = new UICheckBoxGroupProvider("Provider", null);
        UIPolygonBBox uiPolygonBBox = new UIPolygonBBox("Polygon BBox","erl:shape",null,Predicate.ISEQUAL);
        optionalFilters.add(nameTextBox);
        optionalFilters.add(uiDropDownRemote);
        optionalFilters.add(uiCheckBoxGroupProvider);
        optionalFilters.add(uiPolygonBBox);
        FilterCollection filterCollection = new FilterCollection();
        filterCollection.setOptionalFilters(optionalFilters);
        layer.setFilterCollection(filterCollection);
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeErlMineralOccurrenceView">
        <ns0:constructor-arg name="id" value="erl-mineraloccurrenceview" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="erl:MineralOccurrenceView" />
            </ns0:bean>
        </ns0:constructor-arg>

        <ns0:property name="name" value="Mineral Occurrence" />
        <ns0:property name="description" value="Earth ResourceML Lite Mineral Occurrence View" />
        <ns0:property name="group" value="Earth Resources Lite(new)" />

        
        <ns0:property name="proxyUrl" value="" />
        <ns0:property name="proxyCountUrl" value="" />
        <ns0:property name="proxyStyleUrl" value="getErlMineralOccurrenceViewStyle.do" />
        <ns0:property name="proxyDownloadUrl" value="" />
        <ns0:property name="order" value="160" />
        <ns0:property name="nagiosHostGroup" value="GeolSurveySISSDeployments" />
        <ns0:property name="nagiosServiceGroup" value="EarthResourcesLayers" />
        <ns0:property name="filterCollection">
             <ns0:bean class="org.auscope.portal.core.uifilter.FilterCollection">
                <ns0:property name="optionalFilters">
                    <ns0:list>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UITextBox">
                            <ns0:constructor-arg name="label" value="Name" />
                            <ns0:constructor-arg name="xpath" value="erl:name" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISLIKE</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UIDropDownRemote">
                            <ns0:constructor-arg name="label" value="Commodity" />
                            <ns0:constructor-arg name="xpath" value="erl:representativeCommodity_uri" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISEQUAL</ns0:value>
                            </ns0:constructor-arg>
                            <ns0:constructor-arg name="url" value="getAllCommodities.do" />
                        </ns0:bean>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UIDropDownRemote">
                            <ns0:constructor-arg name="label" value="Geologic Timescale" />
                            <ns0:constructor-arg name="xpath" value="erl:representativeAge_uri" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISEQUAL</ns0:value>
                            </ns0:constructor-arg>
                            <ns0:constructor-arg name="url" value="getAllTimescales.do" />
                        </ns0:bean>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.UICheckBoxGroupProvider">
                            <ns0:constructor-arg name="label" value="Provider" />                            
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                                                        
                        </ns0:bean>  
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UIPolygonBBox">
                            <ns0:constructor-arg name="label" value="Polygon BBox" />
                            <ns0:constructor-arg name="xpath" value="erl:shape" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISEQUAL</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean> 
                    </ns0:list>
                </ns0:property>                       
            </ns0:bean>        
        </ns0:property>   
    </ns0:bean>
    
    
*/

    @Bean
    public WMSSelector knownTypeErlMineralOccurrenceViewSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeErlMineralOccurrenceView() {
        KnownLayer layer = new KnownLayer("erl-mineraloccurrenceview", knownTypeErlMineralOccurrenceViewSelector());
        layer.setName("Mineral Occurrence");
        layer.setDescription("Earth ResourceML Lite Mineral Occurrence View");
        layer.setGroup("Earth Resources Lite(new)");
        layer.setProxyUrl("");
        layer.setProxyCountUrl("");
        layer.setProxyStyleUrl("getErlMineralOccurrenceViewStyle.do");
        layer.setProxyDownloadUrl("");
        layer.setOrder("160");
        layer.setNagiosHostGroup("GeolSurveySISSDeployments");
        layer.setNagiosServiceGroup("EarthResourcesLayers");
        
        // Optional filters
        List<AbstractBaseFilter> optionalFilters = new ArrayList<AbstractBaseFilter>();
        UITextBox nameTextBox = new UITextBox("Name", "erl:name", null, Predicate.ISLIKE);
        UIDropDownRemote commodityDropDownRemote = new UIDropDownRemote("Commodity", "erl:representativeCommodity_uri", null, Predicate.ISEQUAL, "getAllCommodities.do");
        UIDropDownRemote timescaleDropDownRemote = new UIDropDownRemote("Geologic Timescale", "erl:representativeAge_uri", null, Predicate.ISEQUAL, "getAllTimescales.do");
        UICheckBoxGroupProvider uiCheckBoxGroupProvider = new UICheckBoxGroupProvider("Provider", null);
        UIPolygonBBox uiPolygonBBox = new UIPolygonBBox("Polygon BBox","erl:shape",null,Predicate.ISEQUAL);
        optionalFilters.add(nameTextBox);
        optionalFilters.add(commodityDropDownRemote);
        optionalFilters.add(timescaleDropDownRemote);
        optionalFilters.add(uiCheckBoxGroupProvider);
        optionalFilters.add(uiPolygonBBox);
        FilterCollection filterCollection = new FilterCollection();
        filterCollection.setOptionalFilters(optionalFilters);
        layer.setFilterCollection(filterCollection);
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeErlCommodityResourceView">
        <ns0:constructor-arg name="id" value="erl-commodityresourceview" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="erl:CommodityResourceView" />
            </ns0:bean>
        </ns0:constructor-arg>

        <ns0:property name="name" value="Commodity Resource" />
        <ns0:property name="description" value="Earth ResourceML Lite Commodity Resource View" />
        <ns0:property name="group" value="Earth Resources Lite(new)" />

        
        <ns0:property name="proxyUrl" value="" />
        <ns0:property name="proxyCountUrl" value="" />
        <ns0:property name="proxyStyleUrl" value="getErlCommodityResourceViewStyle.do" />
        <ns0:property name="proxyDownloadUrl" value="" />
        <ns0:property name="order" value="160" />
        <ns0:property name="nagiosHostGroup" value="GeolSurveySISSDeployments" />
        <ns0:property name="nagiosServiceGroup" value="EarthResourcesLayers" />
        <ns0:property name="filterCollection">
             <ns0:bean class="org.auscope.portal.core.uifilter.FilterCollection">
                <ns0:property name="optionalFilters">
                    <ns0:list>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UITextBox">
                            <ns0:constructor-arg name="label" value="Mine Name" />
                            <ns0:constructor-arg name="xpath" value="erl:mineName" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISLIKE</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UIDropDownRemote">
                            <ns0:constructor-arg name="label" value="Commodity" />
                            <ns0:constructor-arg name="xpath" value="erl:commodityClassifier_uri" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISEQUAL</ns0:value>
                            </ns0:constructor-arg>
                            <ns0:constructor-arg name="url" value="getAllCommodities.do" />
                        </ns0:bean>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UIDropDownRemote">
                            <ns0:constructor-arg name="label" value="JORC Category" />
                            <ns0:constructor-arg name="xpath" value="erl:resourcesCategory_uri" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISEQUAL</ns0:value>
                            </ns0:constructor-arg>
                            <ns0:constructor-arg name="url" value="getAllJorcCategories.do" />
                        </ns0:bean> 
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.UICheckBoxGroupProvider">
                            <ns0:constructor-arg name="label" value="Provider" />                            
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                                                        
                        </ns0:bean>      
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UIPolygonBBox">
                            <ns0:constructor-arg name="label" value="Polygon BBox" />
                            <ns0:constructor-arg name="xpath" value="erl:shape" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISEQUAL</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean> 
                    </ns0:list>
                </ns0:property>                       
            </ns0:bean>        
        </ns0:property>   
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeErlCommodityResourceViewSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeErlCommodityResourceView() {
        KnownLayer layer = new KnownLayer("erl-commodityresourceview", knownTypeErlCommodityResourceViewSelector());
        layer.setName("Commodity Resource");
        layer.setDescription("Earth ResourceML Lite Commodity Resource View");
        layer.setGroup("Earth Resources Lite(new)");
        layer.setProxyUrl("");
        layer.setProxyCountUrl("");
        layer.setProxyStyleUrl("getErlCommodityResourceViewStyle.do");
        layer.setProxyDownloadUrl("");
        layer.setOrder("160");
        layer.setNagiosHostGroup("GeolSurveySISSDeployments");
        layer.setNagiosServiceGroup("EarthResourcesLayers");
        
        // Optional filters
        List<AbstractBaseFilter> optionalFilters = new ArrayList<AbstractBaseFilter>();
        UITextBox nameTextBox = new UITextBox("Mine Name", "erl:mineName", null, Predicate.ISLIKE);
        UIDropDownRemote commodityDropDownRemote = new UIDropDownRemote("Commodity", "erl:commodityClassifier_uri", null, Predicate.ISEQUAL, "getAllCommodities.do");
        UIDropDownRemote resourcesDropDownRemote = new UIDropDownRemote("JORC Category", "erl:resourcesCategory_uri", null, Predicate.ISEQUAL, "getAllJorcCategories.do");
        UICheckBoxGroupProvider uiCheckBoxGroupProvider = new UICheckBoxGroupProvider("Provider", null);
        UIPolygonBBox uiPolygonBBox = new UIPolygonBBox("Polygon BBox","erl:shape",null,Predicate.ISEQUAL);
        optionalFilters.add(nameTextBox);
        optionalFilters.add(commodityDropDownRemote);
        optionalFilters.add(resourcesDropDownRemote);
        optionalFilters.add(uiCheckBoxGroupProvider);
        optionalFilters.add(uiPolygonBBox);
        FilterCollection filterCollection = new FilterCollection();
        filterCollection.setOptionalFilters(optionalFilters);
        layer.setFilterCollection(filterCollection);
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeMineralOccurrenceView">
        <ns0:constructor-arg name="id" value="mineral-occ-view" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="mo:MinOccView" />
            </ns0:bean>
        </ns0:constructor-arg>

        <ns0:property name="name" value="Mineral Occurrence View" />
        <ns0:property name="description" value="A collection of services that implement the AuScope EarthResourceML v1 Profile for mo:MinOccView" />
        <ns0:property name="group" value="Earth Resources(old)" />
        
        <ns0:property name="proxyUrl" value="" />
        <ns0:property name="proxyCountUrl" value="" />
        <ns0:property name="proxyStyleUrl" value="doMinOccurViewFilterStyle.do" />
        <ns0:property name="proxyDownloadUrl" value="downloadMinOccurView.do" />
        <ns0:property name="order" value="13" />
        <ns0:property name="nagiosHostGroup" value="GeolSurveySISSDeployments" />
        <ns0:property name="nagiosServiceGroup" value="EarthResourcesLayers" />
        <ns0:property name="filterCollection">
             <ns0:bean class="org.auscope.portal.core.uifilter.FilterCollection">
                <ns0:property name="optionalFilters">
                    <ns0:list>                        
                         <ns0:bean class="org.auscope.portal.core.uifilter.optional.UICheckBoxGroupProvider">
                            <ns0:constructor-arg name="label" value="Provider" />                            
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                                                        
                        </ns0:bean> 
                    </ns0:list>
                </ns0:property>                             
            </ns0:bean>        
        </ns0:property>
    </ns0:bean>

  
    
*/

    @Bean
    public WMSSelector knownTypeMineralOccurrenceViewSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeMineralOccurrenceView() {
        KnownLayer layer = new KnownLayer("mineral-occ-view", knownTypeMineralOccurrenceViewSelector());
        layer.setName("Mineral Occurrence View");
        layer.setDescription("A collection of services that implement the AuScope EarthResourceML v1 Profile for mo:MinOccView");
        layer.setGroup("Earth Resources(old)");
        layer.setProxyUrl("");
        layer.setProxyCountUrl("");
        layer.setProxyStyleUrl("doMinOccurViewFilterStyle.do");
        layer.setProxyDownloadUrl("downloadMinOccurView.do");
        layer.setOrder("13");
        layer.setNagiosHostGroup("GeolSurveySISSDeployments");
        layer.setNagiosServiceGroup("EarthResourcesLayers");
        layer.setFilterCollection(this.createProviderFilterCollection());
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGeotransects">
        <ns0:constructor-arg name="id" value="ga-geotransects" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="Onshore_Seismic_Surveys" />
            </ns0:bean>
        </ns0:constructor-arg>

        <ns0:property name="id" value="ga-geotransects" />
        <ns0:property name="name" value="GA Onshore Seismic Surveys" />
        <ns0:property name="description" value="The Onshore Seismic Data of Australia is a collection of all land seismic traverses cross the Australian continent and its margins. The data includes raw and processed data in SEGY format. The metadata includes acquisition reports, processing reports, processed images, logs, and so on. The data acquisition was carried out in Australia from 1949-2012 by Geoscience Australia and various partners. The set of reflection and refraction data comprises over 12,000 km of coverage, and provides an insight into the variations in crustal architecture in the varied geological domains. The complete processed dataset was first available for public access in Oct 2013 (http://www.ga.gov.au/minerals/projects/current-projects/seismic-acquisition-processing.html ). The location of seismic traverses is shown by the Gallery link on the webpage. The new survey data will be updated on the webpage by the official data release date. The attribute structure of the dataset has also been revised to be more compatible with the GeoSciML data standard, published by the IUGS Commission for Geoscience Information. The onshore seismic data were collected with partner organizations: Australian Geodynamics Cooperative Research Centre, National Research Facility for Earth Sounding, Australian Nuclear Science and Technology Organisation, Cooperative Research Centre for Greenhouse Gas Technologies, Curtin University of Technology, Geological Survey of New South Wales, NSW Department of Mineral Resources, NSW Department of Primary Industries Mineral Resources, An organisation for a National Earth Science Infrastructure Program, Geological Survey Western Australia, Northern Territory Geological Survey, Primary Industries and Resources South Australia, Predictive Mineral Discovery Cooperative Research Centre, Queensland Geological Survey, GeoScience Victoria Department of Primary Industries, Tasmania Development and Resources, University of Western Australia." />
        <ns0:property name="order" value="400" />
    </ns0:bean>
    
    
*/

    @Bean
    public WMSSelector knownTypeGeotransectsSelector() {
        return new WMSSelector("Onshore_Seismic_Surveys");
    }

    @Bean
    public KnownLayer knownTypeGeotransects() {
        KnownLayer layer = new KnownLayer("ga-geotransects", knownTypeGeotransectsSelector());
        layer.setId("ga-geotransects");
        layer.setName("GA Onshore Seismic Surveys");
        layer.setDescription("The Onshore Seismic Data of Australia is a collection of all land seismic traverses cross the Australian continent and its margins. The data includes raw and processed data in SEGY format. The metadata includes acquisition reports, processing reports, processed images, logs, and so on. The data acquisition was carried out in Australia from 1949-2012 by Geoscience Australia and various partners. The set of reflection and refraction data comprises over 12,000 km of coverage, and provides an insight into the variations in crustal architecture in the varied geological domains. The complete processed dataset was first available for public access in Oct 2013 (http://www.ga.gov.au/minerals/projects/current-projects/seismic-acquisition-processing.html ). The location of seismic traverses is shown by the Gallery link on the webpage. The new survey data will be updated on the webpage by the official data release date. The attribute structure of the dataset has also been revised to be more compatible with the GeoSciML data standard, published by the IUGS Commission for Geoscience Information. The onshore seismic data were collected with partner organizations: Australian Geodynamics Cooperative Research Centre, National Research Facility for Earth Sounding, Australian Nuclear Science and Technology Organisation, Cooperative Research Centre for Greenhouse Gas Technologies, Curtin University of Technology, Geological Survey of New South Wales, NSW Department of Mineral Resources, NSW Department of Primary Industries Mineral Resources, An organisation for a National Earth Science Infrastructure Program, Geological Survey Western Australia, Northern Territory Geological Survey, Primary Industries and Resources South Australia, Predictive Mineral Discovery Cooperative Research Centre, Queensland Geological Survey, GeoScience Victoria Department of Primary Industries, Tasmania Development and Resources, University of Western Australia.");
        layer.setOrder("400");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypePMDCRCReports">
        <ns0:constructor-arg name="id" value="portal-pmd-crc-reports" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="descriptiveKeyword" value="PMD*CRC Publication" />
            </ns0:bean>
        </ns0:constructor-arg>

        <ns0:property name="name" value="GA PMD*CRC Reports" />
        <ns0:property name="description" value="A collection of PMD*CRC reports from Geoscience Australia's Catalogue" />
        <ns0:property name="iconUrl" value="http://maps.google.com/mapfiles/kml/paddle/blu-square.png" />
        <ns0:property name="iconAnchor">
            <ns0:bean class="java.awt.Point">
                <ns0:constructor-arg index="0" value="16" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="iconSize">
            <ns0:bean class="java.awt.Dimension">
                <ns0:constructor-arg index="0" value="32" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="order" value="405" />
    </ns0:bean>
    
     
    
*/

    @Bean
    public WMSSelector knownTypePMDCRCReportsSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypePMDCRCReports() {
        KnownLayer layer = new KnownLayer("portal-pmd-crc-reports", knownTypePMDCRCReportsSelector());
        layer.setName("GA PMD*CRC Reports");
        layer.setDescription("A collection of PMD*CRC reports from Geoscience Australia's Catalogue");
        layer.setIconUrl("http://maps.google.com/mapfiles/kml/paddle/blu-square.png");
        setupIcon(layer);
        layer.setOrder("405");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGeoModels">
        <ns0:constructor-arg name="id" value="portal-geo-models" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="descriptiveKeyword" value="3D Geological Models" />
            </ns0:bean>
        </ns0:constructor-arg>

        <ns0:property name="name" value="3D Geological Models" />
		<ns0:property name="group" value="Models" />
        <ns0:property name="description" value="Various Geological Models" />
        <ns0:property name="iconUrl" value="http://maps.google.com/mapfiles/kml/paddle/blu-square.png" />
        <ns0:property name="iconAnchor">
            <ns0:bean class="java.awt.Point">
                <ns0:constructor-arg index="0" value="16" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="iconSize">
            <ns0:bean class="java.awt.Dimension">
                <ns0:constructor-arg index="0" value="32" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="order" value="407" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeGeoModelsSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeGeoModels() {
        KnownLayer layer = new KnownLayer("portal-geo-models", knownTypeGeoModelsSelector());
        layer.setName("3D Geological Models");
        layer.setGroup("Models");
        layer.setDescription("Various Geological Models");
        layer.setIconUrl("http://maps.google.com/mapfiles/kml/paddle/blu-square.png");
        setupIcon(layer);
        layer.setOrder("407");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeReports">
        <ns0:constructor-arg name="id" value="portal-reports" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="descriptiveKeyword" value="Report" />
            </ns0:bean>
        </ns0:constructor-arg>

        <ns0:property name="name" value="Reports" />
        <ns0:property name="description" value="A collection of scientific reports that have been spatially located" />
        <ns0:property name="iconUrl" value="http://maps.google.com/mapfiles/kml/paddle/blu-square.png" />
        <ns0:property name="iconAnchor">
            <ns0:bean class="java.awt.Point">
                <ns0:constructor-arg index="0" value="16" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="iconSize">
            <ns0:bean class="java.awt.Dimension">
                <ns0:constructor-arg index="0" value="32" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="order" value="410" />
    </ns0:bean>
    
*/

    @Bean
    public WMSSelector knownTypeReportsSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeReports() {
        KnownLayer layer = new KnownLayer("portal-reports", knownTypeReportsSelector());
        layer.setName("Reports");
        layer.setDescription("A collection of scientific reports that have been spatially located");
        layer.setIconUrl("http://maps.google.com/mapfiles/kml/paddle/blu-square.png");
        setupIcon(layer);
        layer.setOrder("410");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeYilgarnGeochemistry">
        <ns0:constructor-arg name="id" value="yilgarn-geochem" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="gsml:GeologicUnit" />
                <ns0:property name="relatedFeatureTypeNames">
                    <ns0:list>
                        <ns0:value>omx:ObservationProcess</ns0:value>
                        <ns0:value>gml:TimeInstant</ns0:value>
                        <ns0:value>sa:LocatedSpecimen</ns0:value>
                    </ns0:list>
                </ns0:property>
            </ns0:bean>
        </ns0:constructor-arg>

        <ns0:property name="name" value="Yilgarn Laterite Geochemistry" />
        <ns0:property name="description" value="A collection of detailed information about all analytes that were detected at a specific location" />
        <ns0:property name="proxyUrl" value="doYilgarnGeochemistry.do" />
        <ns0:property name="proxyCountUrl" value="doYilgarnGeochemistryCount.do" />
        <ns0:property name="proxyStyleUrl" value="" />
        <ns0:property name="iconUrl" value="http://maps.google.com/mapfiles/kml/paddle/grn-blank.png" />
        <ns0:property name="iconAnchor">
            <ns0:bean class="java.awt.Point">
                <ns0:constructor-arg index="0" value="16" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="iconSize">
            <ns0:bean class="java.awt.Dimension">
                <ns0:constructor-arg index="0" value="32" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="order" value="430" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeYilgarnGeochemistrySelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeYilgarnGeochemistry() {
        KnownLayer layer = new KnownLayer("yilgarn-geochem", knownTypeYilgarnGeochemistrySelector());
        layer.setName("Yilgarn Laterite Geochemistry");
        layer.setDescription("A collection of detailed information about all analytes that were detected at a specific location");
        layer.setProxyUrl("doYilgarnGeochemistry.do");
        layer.setProxyCountUrl("doYilgarnGeochemistryCount.do");
        layer.setProxyStyleUrl("");
        layer.setIconUrl("http://maps.google.com/mapfiles/kml/paddle/grn-blank.png");
        setupIcon(layer);
        layer.setOrder("430");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeBoreholeNvclV2">
        <ns0:constructor-arg name="id" value="nvcl-v2-borehole" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="gsmlp:BoreholeView" />
                <ns0:constructor-arg name="includeEndpoints" value="true" />
                <ns0:constructor-arg name="serviceEndpoints">
                    <ns0:list>
                        <ns0:value>http://nvclwebservices.vm.csiro.au:80/geoserverBH/wfs</ns0:value>
                        <ns0:value>https://nvclwebservices.vm.csiro.au:80/geoserverBH/wfs</ns0:value>
                        <ns0:value>http://www.mrt.tas.gov.au:80/web-services/wfs</ns0:value>
                        <ns0:value>https://www.mrt.tas.gov.au:80/web-services/wfs</ns0:value>
                        <ns0:value>http://geossdi.dmp.wa.gov.au:80/services/wfs</ns0:value>
                        <ns0:value>http://geossdi.dmp.wa.gov.au/services/wfs</ns0:value>
                        <ns0:value>https://geossdi.dmp.wa.gov.au/services/wfs</ns0:value>
                        <ns0:value>http://geology.data.nt.gov.au:80/geoserver/wfs</ns0:value>
                        <ns0:value>https://geology.data.nt.gov.au/geoserver/wfs</ns0:value>
                        <ns0:value>https://gs.geoscience.nsw.gov.au/geoserver/wfs</ns0:value>
                        <ns0:value>https://sarigdata.pir.sa.gov.au/geoserver/wfs</ns0:value>
                        <ns0:value>http://geology-uat.information.qld.gov.au/geoserver/wfs</ns0:value>
                        <ns0:value>https://geology-uat.information.qld.gov.au/geoserver/wfs</ns0:value>
                        <ns0:value>http://geology.information.qld.gov.au/geoserver/wfs</ns0:value>
                        <ns0:value>https://geology.information.qld.gov.au/geoserver/wfs</ns0:value>
                        <ns0:value>http://geology.data.vic.gov.au/nvcl/wfs</ns0:value>
                        <ns0:value>https://geology.data.vic.gov.au/nvcl/wfs</ns0:value>
                    </ns0:list>
                </ns0:constructor-arg>
                <ns0:property name="relatedFeatureTypeNames">
                    <ns0:list>
                        
                        <ns0:value>sa:SamplingFeatureCollection</ns0:value>
                        <ns0:value>om:GETPUBLISHEDSYSTEMTSA</ns0:value>
                        <ns0:value>nvcl:scannedBorehole</ns0:value>
                        <ns0:value>nvcl:ScannedBoreholeCollection</ns0:value>
                    </ns0:list>
                </ns0:property>
            </ns0:bean>
        </ns0:constructor-arg>

        <ns0:property name="name" value="National Virtual Core Library V-2.0" />
        <ns0:property name="group" value="Boreholes" />
        <ns0:property name="description" value="A collection of services implementing the National Virtual Core Library Profile v1 for gsml:Borehole and a collection of observations" />
        <ns0:property name="proxyUrl" value="doBoreholeViewFilter.do" />
        <ns0:property name="proxyCountUrl" value="" />
        <ns0:property name="proxyDownloadUrl" value="doNVCLBoreholeViewCSVDownload.do" />
        <ns0:property name="proxyStyleUrl" value="doNvclV2FilterStyle.do" />
        
        <ns0:property name="iconAnchor">
            <ns0:bean class="java.awt.Point">
                <ns0:constructor-arg index="0" value="16" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="iconSize">
            <ns0:bean class="java.awt.Dimension">
                <ns0:constructor-arg index="0" value="32" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="order" value="51" />
        <ns0:property name="nagiosHostGroup" value="GeolSurveySISSDeployments" />
        <ns0:property name="nagiosServiceGroup" value="NVCLBoreholeViewLayer" />
        <ns0:property name="filterCollection">
             <ns0:bean class="org.auscope.portal.core.uifilter.FilterCollection">    
             <ns0:property name="mandatoryFilters">
                    <ns0:list>
                        <ns0:bean class="org.auscope.portal.core.uifilter.mandatory.UITextBox">
                            <ns0:constructor-arg name="label" type="java.lang.String" value="Analytics Job Id" />
                            <ns0:constructor-arg name="parameter" type="java.lang.String" value="analyticsJobId" />                         
                            <ns0:constructor-arg name="value" type="java.lang.String" value="" />                                                        
                        </ns0:bean>
                    </ns0:list>
                </ns0:property>            
                <ns0:property name="optionalFilters">
                    <ns0:list>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UITextBox">
                            <ns0:constructor-arg name="label" value="Name" />
                            <ns0:constructor-arg name="xpath" value="gsmlp:name" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISLIKE</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UITextBox">
                            <ns0:constructor-arg name="label" value="Identifier" />
                            <ns0:constructor-arg name="xpath" value="gsmlp:identifier" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISLIKE</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UIDate">
                            <ns0:constructor-arg name="label" value="Drilling Start From" />
                            <ns0:constructor-arg name="xpath" value="gsmlp:drillStartDate" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">BIGGER_THAN</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UIDate">
                            <ns0:constructor-arg name="label" value="Drilling Start To" />
                            <ns0:constructor-arg name="xpath" value="gsmlp:drillStartDate" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">SMALLER_THAN</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>
                         <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UIDate">
                            <ns0:constructor-arg name="label" value="Drilling End From" />
                            <ns0:constructor-arg name="xpath" value="gsmlp:drillEndDate" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">BIGGER_THAN</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UIDate">
                            <ns0:constructor-arg name="label" value="Drilling End To" />
                            <ns0:constructor-arg name="xpath" value="gsmlp:drillEndDate" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">SMALLER_THAN</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.UICheckBoxGroupProvider">
                            <ns0:constructor-arg name="label" value="Provider" />                            
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                                                        
                        </ns0:bean>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UIPolygonBBox">
                            <ns0:constructor-arg name="label" value="Polygon BBox - Clipboard" />
                            <ns0:constructor-arg name="xpath" value="gsmlp:shape" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISEQUAL</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>                          
                    </ns0:list>
                </ns0:property>  
                <ns0:property name="hiddenParams">
                    <ns0:list>
                        <ns0:bean class="org.auscope.portal.core.uifilter.mandatory.UIHiddenResourceAttribute">
                            <ns0:constructor-arg name="parameter" type="java.lang.String" value="serviceUrl" />
                            <ns0:constructor-arg name="attribute" type="java.lang.String" value="url" />                         
                            <ns0:constructor-arg name="value" type="java.lang.String" value="true" />                                                        
                        </ns0:bean>
                    </ns0:list>
                </ns0:property>
            </ns0:bean>        
        </ns0:property>
    </ns0:bean>
    
     
*/

    @Bean
    public WMSSelector knownTypeBoreholeNvclV2Selector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeBoreholeNvclV2() {
        KnownLayer layer = new KnownLayer("nvcl-v2-borehole", knownTypeBoreholeNvclV2Selector());
        layer.setName("National Virtual Core Library V-2.0");
        layer.setGroup("Boreholes");
        layer.setDescription("A collection of services implementing the National Virtual Core Library Profile v1 for gsml:Borehole and a collection of observations");
        layer.setProxyUrl("doBoreholeViewFilter.do");
        layer.setProxyCountUrl("");
        layer.setProxyDownloadUrl("doNVCLBoreholeViewCSVDownload.do");
        layer.setProxyStyleUrl("doNvclV2FilterStyle.do");
        setupIcon(layer);
        layer.setOrder("51");
        layer.setNagiosHostGroup("GeolSurveySISSDeployments");
        layer.setNagiosServiceGroup("NVCLBoreholeViewLayer");
        
        // Mandatory filters
        org.auscope.portal.core.uifilter.mandatory.UITextBox jobidTextBox;
        jobidTextBox = new org.auscope.portal.core.uifilter.mandatory.UITextBox("Analytics Job Id", "analyticsJobId", "");
        List<AbstractMandatoryParamBinding> mandParamList  = new ArrayList<AbstractMandatoryParamBinding>();
        mandParamList.add(jobidTextBox);

        // Optional filters
        List<AbstractBaseFilter> optionalFilters = new ArrayList<AbstractBaseFilter>();
        UITextBox nameTextBox = new UITextBox("Name", "gsmlp:name", null, Predicate.ISLIKE);
        UITextBox identifierTextBox = new UITextBox("Identifier", "gsmlp:identifier", null, Predicate.ISLIKE);
        this.addDrillDateFilters(optionalFilters);
        UIPolygonBBox uiPolygonBBox = new UIPolygonBBox("Polygon BBox - Clipboard","gsmlp:shape",null, Predicate.ISEQUAL);
        UICheckBoxGroupProvider uiCheckBoxGroupProvider = new UICheckBoxGroupProvider("Provider", null);
        optionalFilters.add(nameTextBox);
        optionalFilters.add(identifierTextBox);
        optionalFilters.add(uiPolygonBBox);
        optionalFilters.add(uiCheckBoxGroupProvider);
        FilterCollection filterCollection = new FilterCollection();
        filterCollection.setOptionalFilters(optionalFilters);
        filterCollection.setMandatoryFilters(mandParamList);
        layer.setFilterCollection(filterCollection);
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeTimaGeoSample">
        <ns0:constructor-arg name="id" value="tima-geosample" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="tima:geosample_and_mineralogy" />                           
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="TESCAN TIMA Heavy Mineral Analyses" />
        <ns0:property name="group" value="Curtin University" />
        <ns0:property name="description" value="A collection of the results published from TIMA" />
        <ns0:property name="proxyUrl" value="doTIMAGeoSample.do" />
        <ns0:property name="proxyCountUrl" value="" />
        <ns0:property name="proxyDownloadUrl" value="doTIMAGeoSampleCSVDownload.do" />
        <ns0:property name="iconUrl" value="http://maps.google.com/mapfiles/kml/paddle/grn-circle.png" />
        <ns0:property name="iconAnchor">
            <ns0:bean class="java.awt.Point">
                <ns0:constructor-arg index="0" value="16" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="iconSize">
            <ns0:bean class="java.awt.Dimension">
                <ns0:constructor-arg index="0" value="32" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="order" value="180" />
         <ns0:property name="filterCollection">
             <ns0:bean class="org.auscope.portal.core.uifilter.FilterCollection">
                <ns0:property name="optionalFilters">
                    <ns0:list>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UITextBox">
                            <ns0:constructor-arg name="label" value="Name" />
                            <ns0:constructor-arg name="xpath" value="name" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISLIKE</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean> 
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UITextBox">
                            <ns0:constructor-arg name="label" value="IGSN" />
                            <ns0:constructor-arg name="xpath" value="igsn" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISLIKE</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>                                                                       
                    </ns0:list>
                </ns0:property>                       
            </ns0:bean>        
        </ns0:property>
    </ns0:bean>
     
*/

    @Bean
    public WMSSelector knownTypeTimaGeoSampleSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeTimaGeoSample() {
        KnownLayer layer = new KnownLayer("tima-geosample", knownTypeTimaGeoSampleSelector());
        layer.setName("TESCAN TIMA Heavy Mineral Analyses");
        layer.setGroup("Curtin University");
        layer.setDescription("A collection of the results published from TIMA");
        layer.setProxyUrl("doTIMAGeoSample.do");
        layer.setProxyCountUrl("");
        layer.setProxyDownloadUrl("doTIMAGeoSampleCSVDownload.do");
        layer.setIconUrl("http://maps.google.com/mapfiles/kml/paddle/grn-circle.png");
        setupIcon(layer);
        layer.setOrder("180");
        
        // Optional filters
        layer.setFilterCollection(this.createIgsnFilterCollection());
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeSHRIMPGeoSample">
        <ns0:constructor-arg name="id" value="tima-shrimp-geosample" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="tima:view_shrimp_geochronology_result" />                           
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="SHRIMP Geochronology" />
        <ns0:property name="group" value="Curtin University" />
        <ns0:property name="description" value="A collection of the results published from SHRIMP U-Pb mass spectrometer" />
        <ns0:property name="proxyUrl" value="doSHRIMPGeoSample.do" />
        <ns0:property name="proxyCountUrl" value="" />
        <ns0:property name="proxyDownloadUrl" value="doSHRIMPGeoSampleCSVDownload.do" />
        <ns0:property name="iconUrl" value="http://maps.google.com/mapfiles/kml/paddle/ylw-circle.png" />
        <ns0:property name="iconAnchor">
            <ns0:bean class="java.awt.Point">
                <ns0:constructor-arg index="0" value="16" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="iconSize">
            <ns0:bean class="java.awt.Dimension">
                <ns0:constructor-arg index="0" value="32" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="order" value="180" />
         <ns0:property name="filterCollection">
             <ns0:bean class="org.auscope.portal.core.uifilter.FilterCollection">
                <ns0:property name="optionalFilters">
                    <ns0:list>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UITextBox">
                            <ns0:constructor-arg name="label" value="Name" />
                            <ns0:constructor-arg name="xpath" value="name" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISLIKE</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean> 
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UITextBox">
                            <ns0:constructor-arg name="label" value="IGSN" />
                            <ns0:constructor-arg name="xpath" value="igsn" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISLIKE</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>                                                                       
                    </ns0:list>
                </ns0:property>                       
            </ns0:bean>        
        </ns0:property>
    </ns0:bean>
        
    
*/

    @Bean
    public WMSSelector knownTypeSHRIMPGeoSampleSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeSHRIMPGeoSample() {
        KnownLayer layer = new KnownLayer("tima-shrimp-geosample", knownTypeSHRIMPGeoSampleSelector());
        layer.setName("SHRIMP Geochronology");
        layer.setGroup("Curtin University");
        layer.setDescription("A collection of the results published from SHRIMP U-Pb mass spectrometer");
        layer.setProxyUrl("doSHRIMPGeoSample.do");
        layer.setProxyCountUrl("");
        layer.setProxyDownloadUrl("doSHRIMPGeoSampleCSVDownload.do");
        layer.setIconUrl("http://maps.google.com/mapfiles/kml/paddle/ylw-circle.png");
        setupIcon(layer);
        layer.setOrder("180");

        // Optional filters
        layer.setFilterCollection(this.createIgsnFilterCollection());
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeSF0BoreholeNVCL">
        <ns0:constructor-arg name="id" value="sf0-borehole-nvcl" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="gsmlp:BoreholeView" />
                <ns0:property name="relatedFeatureTypeNames">
                    <ns0:list>
                        
                        <ns0:value>sa:SamplingFeatureCollection</ns0:value>
                        <ns0:value>om:GETPUBLISHEDSYSTEMTSA</ns0:value>
                        <ns0:value>nvcl:scannedBorehole</ns0:value>
                        <ns0:value>nvcl:ScannedBoreholeCollection</ns0:value>
                    </ns0:list>
                </ns0:property>
            </ns0:bean>
        </ns0:constructor-arg>

        <ns0:property name="name" value="All Boreholes" />
        <ns0:property name="group" value="Boreholes" />
        <ns0:property name="description" value="A collection of services implementing the GeoSciML Portrayal Borehole View (gsmlp:BoreholeView)" />
        <ns0:property name="proxyUrl" value="doBoreholeViewFilter.do" />
        <ns0:property name="proxyCountUrl" value="" />
        <ns0:property name="proxyStyleUrl" value="doBoreholeViewFilterStyle.do" />
        
        <ns0:property name="iconAnchor">
            <ns0:bean class="java.awt.Point">
                <ns0:constructor-arg index="0" value="16" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="iconSize">
            <ns0:bean class="java.awt.Dimension">
                <ns0:constructor-arg index="0" value="32" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="order" value="52" />
        <ns0:property name="nagiosHostGroup" value="GeolSurveySISSDeployments" />
        <ns0:property name="nagiosServiceGroup" value="BoreholeViewLayer" />
        <ns0:property name="filterCollection">
             <ns0:bean class="org.auscope.portal.core.uifilter.FilterCollection">                
                <ns0:property name="mandatoryFilters">
                    <ns0:list>
                        <ns0:bean class="org.auscope.portal.core.uifilter.mandatory.UICheckbox">
                            <ns0:constructor-arg name="label" type="java.lang.String" value="Show Hylogged boreholes" />
                            <ns0:constructor-arg name="parameter" type="java.lang.String" value="showNoneHylogged" />                         
                            <ns0:constructor-arg name="value" type="java.lang.String" value="false" />                                                        
                        </ns0:bean>
                    </ns0:list>
                </ns0:property>
                <ns0:property name="hiddenParams">
                    <ns0:list>
                        <ns0:bean class="org.auscope.portal.core.uifilter.mandatory.UIHiddenResourceAttribute">
                            <ns0:constructor-arg name="parameter" type="java.lang.String" value="serviceUrl" />
                            <ns0:constructor-arg name="attribute" type="java.lang.String" value="url" />                         
                            <ns0:constructor-arg name="value" type="java.lang.String" value="true" />                                                        
                        </ns0:bean>
                    </ns0:list>
                </ns0:property>
                <ns0:property name="optionalFilters">
                    <ns0:list>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UITextBox">
                            <ns0:constructor-arg name="label" value="Name" />
                            <ns0:constructor-arg name="xpath" value="gsmlp:name" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISLIKE</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UIDate">
                            <ns0:constructor-arg name="label" value="Drilling Start From" />
                            <ns0:constructor-arg name="xpath" value="gsmlp:drillStartDate" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">BIGGER_THAN</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UIDate">
                            <ns0:constructor-arg name="label" value="Drilling Start To" />
                            <ns0:constructor-arg name="xpath" value="gsmlp:drillStartDate" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">SMALLER_THAN</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>
                         <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UIDate">
                            <ns0:constructor-arg name="label" value="Drilling End From" />
                            <ns0:constructor-arg name="xpath" value="gsmlp:drillEndDate" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">BIGGER_THAN</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UIDate">
                            <ns0:constructor-arg name="label" value="Drilling End To" />
                            <ns0:constructor-arg name="xpath" value="gsmlp:drillEndDate" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">SMALLER_THAN</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.UICheckBoxGroupProvider">
                            <ns0:constructor-arg name="label" value="Provider" />                            
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                                                        
                        </ns0:bean>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UIPolygonBBox">
                            <ns0:constructor-arg name="label" value="Polygon BBox - Clipboard" />
                            <ns0:constructor-arg name="xpath" value="gsmlp:shape" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISEQUAL</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>       
                    </ns0:list>
                </ns0:property>                
            </ns0:bean>        
        </ns0:property>
    </ns0:bean>
        
    
*/

    @Bean
    public WMSSelector knownTypeSF0BoreholeNVCLSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeSF0BoreholeNVCL() {
        KnownLayer layer = new KnownLayer("sf0-borehole-nvcl", knownTypeSF0BoreholeNVCLSelector());
        layer.setName("All Boreholes");
        layer.setGroup("Boreholes");
        layer.setDescription("A collection of services implementing the GeoSciML Portrayal Borehole View (gsmlp:BoreholeView)");
        layer.setProxyUrl("doBoreholeViewFilter.do");
        layer.setProxyCountUrl("");
        layer.setProxyStyleUrl("doBoreholeViewFilterStyle.do");
        setupIcon(layer);
        layer.setOrder("52");
        layer.setNagiosHostGroup("GeolSurveySISSDeployments");
        layer.setNagiosServiceGroup("BoreholeViewLayer");
        
        
        // Mandatory filters
        org.auscope.portal.core.uifilter.mandatory.UITextBox jobidTextBox;
        jobidTextBox = new org.auscope.portal.core.uifilter.mandatory.UITextBox("Analytics Job Id", "analyticsJobId", "");
        List<AbstractMandatoryParamBinding> mandParamList  = new ArrayList<AbstractMandatoryParamBinding>();
        mandParamList.add(jobidTextBox);

        // Optional filters
        List<AbstractBaseFilter> optionalFilters = new ArrayList<AbstractBaseFilter>();
        UITextBox nameTextBox = new UITextBox("Name", "gsmlp:name", null, Predicate.ISLIKE);
        this.addDrillDateFilters(optionalFilters);
        UIPolygonBBox uiPolygonBBox = new UIPolygonBBox("Polygon BBox - Clipboard","gsmlp:shape", null, Predicate.ISEQUAL);
        UICheckBoxGroupProvider uiCheckBoxGroupProvider = new UICheckBoxGroupProvider("Provider", null);
        optionalFilters.add(nameTextBox);
        optionalFilters.add(uiPolygonBBox);
        optionalFilters.add(uiCheckBoxGroupProvider);
        FilterCollection filterCollection = new FilterCollection();
        filterCollection.setOptionalFilters(optionalFilters);
        filterCollection.setMandatoryFilters(mandParamList);
        layer.setFilterCollection(filterCollection);
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeBoreholeMSCL">
        <ns0:constructor-arg name="id" value="mscl-borehole" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="gsmlp:BoreholeView" />
                <ns0:constructor-arg name="includeEndpoints" value="true" />
                <ns0:constructor-arg name="serviceEndpoints">
                    <ns0:list>
                        <ns0:value>http://sisstest.arrc.csiro.au:8080/agos/wfs</ns0:value>
                        <ns0:value>http://meiproc.earthsci.unimelb.edu.au:80/geoserver/wfs</ns0:value>
                    </ns0:list>
                </ns0:constructor-arg>
                <ns0:property name="relatedFeatureTypeNames">
                    <ns0:list>
                        <ns0:value>mscl:scanned_data</ns0:value>
                        <ns0:value>sa:SamplingFeatureCollection</ns0:value>
                    </ns0:list>
                </ns0:property>
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="MSCL Data" />
        <ns0:property name="description" value="Borehole observations made with a multi-sensor core logger." />
        <ns0:property name="group" value="Boreholes" />
        <ns0:property name="proxyUrl" value="doBoreholeViewFilter.do" />
        <ns0:property name="proxyStyleUrl" value="" />
                
        <ns0:property name="proxyCountUrl" value="" />
        
        <ns0:property name="iconAnchor">
            <ns0:bean class="java.awt.Point">
                <ns0:constructor-arg index="0" value="16" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="iconSize">
            <ns0:bean class="java.awt.Dimension">
                <ns0:constructor-arg index="0" value="32" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="order" value="200" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeBoreholeMSCLSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeBoreholeMSCL() {
        KnownLayer layer = new KnownLayer("mscl-borehole", knownTypeBoreholeMSCLSelector());
        layer.setName("MSCL Data");
        layer.setDescription("Borehole observations made with a multi-sensor core logger.");
        layer.setGroup("Boreholes");
        layer.setProxyUrl("doBoreholeViewFilter.do");
        layer.setProxyStyleUrl("");
        layer.setProxyCountUrl("");
        setupIcon(layer);
        layer.setOrder("200");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeSeismologyInSchool">
        <ns0:constructor-arg name="id" value="seismology-in-schools-site" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.view.knownlayer.IRISSelector">
                <ns0:constructor-arg name="serviceEndpoint" value="http://service.iris.edu" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="IRIS Feed" />
        <ns0:property name="description" value="Seismographs in Schools data feed from Incorporated Research Institutions for Seismology (IRIS). S network code." />
        <ns0:property name="group" value="Seismographs in Schools Network" />
        <ns0:property name="proxyUrl" value="getIRISStations.do" />
        <ns0:property name="iconUrl" value="http://maps.google.com/mapfiles/kml/paddle/ltblu-blank.png" />
        <ns0:property name="iconAnchor">
            <ns0:bean class="java.awt.Point">
                <ns0:constructor-arg index="0" value="16" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="iconSize">
            <ns0:bean class="java.awt.Dimension">
                <ns0:constructor-arg index="0" value="32" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="order" value="300" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeSeismologyInSchoolSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeSeismologyInSchool() {
        KnownLayer layer = new KnownLayer("seismology-in-schools-site", knownTypeSeismologyInSchoolSelector());
        layer.setName("IRIS Feed");
        layer.setDescription("Seismographs in Schools data feed from Incorporated Research Institutions for Seismology (IRIS). S network code.");
        layer.setGroup("Seismographs in Schools Network");
        layer.setProxyUrl("getIRISStations.do");
        layer.setIconUrl("http://maps.google.com/mapfiles/kml/paddle/ltblu-blank.png");
        setupIcon(layer);
        layer.setOrder("300");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeBoreholePressureDB">
        <ns0:constructor-arg name="id" value="pressuredb-borehole" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">                
                <ns0:constructor-arg name="featureTypeName" value="gsmlp:BoreholeView" />
                <ns0:constructor-arg name="includeEndpoints" value="true" />
                <ns0:constructor-arg name="serviceEndpoints">
                    <ns0:list>
                        <ns0:value>http://services-test.auscope.org:80/pressuredb/wfs</ns0:value>
                        <ns0:value>http://services.auscope.org:80/pressuredb/wfs</ns0:value>
                    </ns0:list>
                </ns0:constructor-arg>
                <ns0:property name="relatedFeatureTypeNames">
                    <ns0:list>
                        <ns0:value>sa:SamplingFeatureCollection</ns0:value>
                        <ns0:value>om:GETPUBLISHEDSYSTEMTSA</ns0:value>
                        <ns0:value>pdb:rft</ns0:value>
                        <ns0:value>pdb:nacl</ns0:value>
                        <ns0:value>pdb:t</ns0:value>
                        <ns0:value>pdb:cl</ns0:value>
                        <ns0:value>pdb:tds</ns0:value>
                        <ns0:value>pdb:dst</ns0:value>
                        <ns0:value>pdb:fitp</ns0:value>
                    </ns0:list>
                </ns0:property>
            </ns0:bean>
        </ns0:constructor-arg>

        <ns0:property name="name" value="Pressure DB" />
        <ns0:property name="description" value="A collection of services implementing the Pressure DB Profile for gsml:Borehole and a collection of observations" />
        <ns0:property name="group" value="Boreholes" />
        <ns0:property name="proxyUrl" value="doBoreholeViewFilter.do" />
        <ns0:property name="proxyCountUrl" value="" />
        <ns0:property name="proxyStyleUrl" value="doPressureDBFilterStyle.do" />       
        <ns0:property name="order" value="52" />
        <ns0:property name="filterCollection">
             <ns0:bean class="org.auscope.portal.core.uifilter.FilterCollection">
                <ns0:property name="optionalFilters">
                    <ns0:list>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UITextBox">
                            <ns0:constructor-arg name="label" value="Borehole Name" />
                            <ns0:constructor-arg name="xpath" value="gsmlp:name" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISLIKE</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UIDate">
                            <ns0:constructor-arg name="label" value="Drilling Start Date" />
                            <ns0:constructor-arg name="xpath" value="gsmlp:drillStartDate" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">BIGGER_THAN</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UIDate">
                            <ns0:constructor-arg name="label" value="Drilling End Date" />
                            <ns0:constructor-arg name="xpath" value="gsmlp:drillStartDate" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">SMALLER_THAN</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UIPolygonBBox">
                            <ns0:constructor-arg name="label" value="Polygon BBox" />
                            <ns0:constructor-arg name="xpath" value="gsmlp:shape" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISEQUAL</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>                        
                    </ns0:list>
                </ns0:property>
                <ns0:property name="mandatoryFilters">
                    <ns0:list>
                        <ns0:bean class="org.auscope.portal.core.uifilter.mandatory.UIDropDownSelectList">
                            <ns0:constructor-arg name="label" type="java.lang.String" value="Color Code" />
                            <ns0:constructor-arg name="parameter" type="java.lang.String" value="ccProperty" />                         
                            <ns0:constructor-arg name="value" type="java.lang.String" value="" />  
                            <ns0:constructor-arg name="options">
                                <ns0:list>
                                    <ns0:bean class="org.apache.commons.lang3.tuple.ImmutablePair">
                                        <ns0:constructor-arg name="left"><ns0:value type="java.lang.String">Length</ns0:value></ns0:constructor-arg>
                                        <ns0:constructor-arg name="right"><ns0:value type="java.lang.String">Length</ns0:value></ns0:constructor-arg>
                                    </ns0:bean>
                                    <ns0:bean class="org.apache.commons.lang3.tuple.ImmutablePair">
                                        <ns0:constructor-arg name="left"><ns0:value type="java.lang.String">Elevation</ns0:value></ns0:constructor-arg>
                                        <ns0:constructor-arg name="right"><ns0:value type="java.lang.String">Elevation</ns0:value></ns0:constructor-arg>
                                    </ns0:bean>
                                    <ns0:bean class="org.apache.commons.lang3.tuple.ImmutablePair">
                                        <ns0:constructor-arg name="left"><ns0:value type="java.lang.String">Default</ns0:value></ns0:constructor-arg>
                                        <ns0:constructor-arg name="right"><ns0:value type="java.lang.String" /></ns0:constructor-arg>
                                    </ns0:bean>                                    
                                </ns0:list>                               
                            </ns0:constructor-arg>                                                      
                        </ns0:bean>
                    </ns0:list>
                </ns0:property>                   
            </ns0:bean>        
        </ns0:property>
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeBoreholePressureDBSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeBoreholePressureDB() {
        KnownLayer layer = new KnownLayer("pressuredb-borehole", knownTypeBoreholePressureDBSelector());
        layer.setName("Pressure DB");
        layer.setDescription("A collection of services implementing the Pressure DB Profile for gsml:Borehole and a collection of observations");
        layer.setGroup("Boreholes");
        layer.setProxyUrl("doBoreholeViewFilter.do");
        layer.setProxyCountUrl("");
        layer.setProxyStyleUrl("doPressureDBFilterStyle.do");
        layer.setOrder("52");

        // Optional filters
        List<AbstractBaseFilter> optionalFilters = new ArrayList<AbstractBaseFilter>();
        UITextBox nameTextBox = new UITextBox("Borehole Name", "gsmlp:name", null, Predicate.ISLIKE);
        UIDate startDate = new UIDate("Drilling Start Date", "gsmlp:drillStartDate", null, Predicate.BIGGER_THAN);
        UIDate endDate = new UIDate("Drilling End Date", "gsmlp:drillStartDate", null, Predicate.SMALLER_THAN);
        UIPolygonBBox uiPolygonBBox = new UIPolygonBBox("Polygon BBox - Clipboard","gsmlp:shape",null, Predicate.ISEQUAL);
        optionalFilters.add(nameTextBox);
        optionalFilters.add(startDate);
        optionalFilters.add(endDate);
        optionalFilters.add(uiPolygonBBox);
        FilterCollection filterCollection = new FilterCollection();
        filterCollection.setOptionalFilters(optionalFilters);
        
        // Mandatory filters - note use of full path names for declaring vars to prevent clashes with imported optional params
        List<ImmutablePair<String,String>> mandatoryOptions = new ArrayList<ImmutablePair<String,String>>();
        mandatoryOptions.add(new ImmutablePair("Length", "Length"));
        mandatoryOptions.add(new ImmutablePair("Elevation", "Elevation"));
        mandatoryOptions.add(new ImmutablePair("Default", null));
        org.auscope.portal.core.uifilter.mandatory.UIDropDownSelectList mandDropDownSelectList;
        mandDropDownSelectList = new org.auscope.portal.core.uifilter.mandatory.UIDropDownSelectList("Color Code", "ccProperty", "", mandatoryOptions);
        List<AbstractMandatoryParamBinding> mandParamList = new ArrayList<AbstractMandatoryParamBinding>();
        mandParamList.add(mandDropDownSelectList);
        filterCollection.setMandatoryFilters(mandParamList);

        layer.setFilterCollection(filterCollection);
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeAster">
        <ns0:constructor-arg name="id" value="aster-main" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="recordId" value="E6029ED0-636B-4F91-A6A1-535EBA4B5AD1" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="ASTER Maps" />
        <ns0:property name="description" value="This is the parent datafile of a datset that comprises a set of 14+ geoscience products made up of mosaiced ASTER scenes across Australia." />
        <ns0:property name="group" value="ASTER Maps" />
        <ns0:property name="hidden" value="true" />
         <ns0:property name="order" value="30_ASTER Maps_010" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeAsterSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeAster() {
        KnownLayer layer = new KnownLayer("aster-main", knownTypeAsterSelector());
        layer.setName("ASTER Maps");
        layer.setDescription("This is the parent datafile of a datset that comprises a set of 14+ geoscience products made up of mosaiced ASTER scenes across Australia.");
        layer.setGroup("ASTER Maps");
        layer.setHidden(true);
        layer.setOrder("30_ASTER Maps_010");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeAsterAloh">
        <ns0:constructor-arg name="id" value="aster-aloh" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="recordId" value="1c3f5e49-4241-4511-a3cc-60314ea09414" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="ASTER Map AlOH group composition" />
        <ns0:property name="description" value="1. Band ratio: B5/B7Blue is well ordered kaolinite, Al-rich muscovite/illite, paragonite, pyrophyllite Red is Al-poor (Si-rich) muscovite (phengite)" />
        <ns0:property name="group" value="ASTER Maps" />
        <ns0:property name="order" value="30_ASTER Maps_020" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeAsterAlohSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeAsterAloh() {
        KnownLayer layer = new KnownLayer("aster-aloh", knownTypeAsterAlohSelector());
        layer.setName("ASTER Map AlOH group composition");
        layer.setDescription("1. Band ratio: B5/B7Blue is well ordered kaolinite, Al-rich muscovite/illite, paragonite, pyrophyllite Red is Al-poor (Si-rich) muscovite (phengite)");
        layer.setGroup("ASTER Maps");
        layer.setOrder("30_ASTER Maps_020");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeAsterFerrous">
        <ns0:constructor-arg name="id" value="aster-ferrous" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="recordId" value="02e4fa4c-cbd0-429f-b487-381282debb8f" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="ASTER Map Ferrous iron index" />
        <ns0:property name="description" value="1. Band ratio: B5/B4Blue is low abundance, Red is high abundance" />
        <ns0:property name="group" value="ASTER Maps" />
        <ns0:property name="order" value="30_ASTER Maps_030" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeAsterFerrousSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeAsterFerrous() {
        KnownLayer layer = new KnownLayer("aster-ferrous", knownTypeAsterFerrousSelector());
        layer.setName("ASTER Map Ferrous iron index");
        layer.setDescription("1. Band ratio: B5/B4Blue is low abundance, Red is high abundance");
        layer.setGroup("ASTER Maps");
        layer.setOrder("30_ASTER Maps_030");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeAsterOpaque">
        <ns0:constructor-arg name="id" value="aster-opaque" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="recordId" value="ab9e636a-86f8-4366-acec-c24db7b72ff5" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="ASTER Map Opaque index" />
        <ns0:property name="description" value="1. Band ratio: B1/B4Blue is low abundance, Red is high abundance(potentially includes  carbon black (e.g. ash), magnetite, Mn oxides, and sulphides in unoxidised envornments" />
        <ns0:property name="group" value="ASTER Maps" />
        <ns0:property name="order" value="30_ASTER Maps_040" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeAsterOpaqueSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeAsterOpaque() {
        KnownLayer layer = new KnownLayer("aster-opaque", knownTypeAsterOpaqueSelector());
        layer.setName("ASTER Map Opaque index");
        layer.setDescription("1. Band ratio: B1/B4Blue is low abundance, Red is high abundance(potentially includes  carbon black (e.g. ash), magnetite, Mn oxides, and sulphides in unoxidised envornments");
        layer.setGroup("ASTER Maps");
        layer.setOrder("30_ASTER Maps_040");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeAsterFerricOxideContent">
        <ns0:constructor-arg name="id" value="aster-ferric-oxide-content" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="recordId" value="7bc66a7a-5ba0-447e-9a00-bf1ccd84e4f3" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="ASTER Map Ferric oxide content" />
        <ns0:property name="description" value="1. Band ratio: B4/B3Blue is low abundance, Red is high abundance" />
        <ns0:property name="group" value="ASTER Maps" />
        <ns0:property name="order" value="30_ASTER Maps_050" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeAsterFerricOxideContentSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeAsterFerricOxideContent() {
        KnownLayer layer = new KnownLayer("aster-ferric-oxide-content", knownTypeAsterFerricOxideContentSelector());
        layer.setName("ASTER Map Ferric oxide content");
        layer.setDescription("1. Band ratio: B4/B3Blue is low abundance, Red is high abundance");
        layer.setGroup("ASTER Maps");
        layer.setOrder("30_ASTER Maps_050");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeAsterFeoh">
        <ns0:constructor-arg name="id" value="aster-feoh" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="recordId" value="f938456a-926d-4547-b111-093844f8fc5d" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="ASTER Map FeOH group content" />
        <ns0:property name="description" value="1. Band ratio: (B6+B8)/B7Blue is low content, Red is high content(potentially includes: chlorite, epidote, jarosite, nontronite, gibbsite, gypsum, opal-chalcedony)" />
        <ns0:property name="group" value="ASTER Maps" />
        <ns0:property name="order" value="30_ASTER Maps_060" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeAsterFeohSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeAsterFeoh() {
        KnownLayer layer = new KnownLayer("aster-feoh", knownTypeAsterFeohSelector());
        layer.setName("ASTER Map FeOH group content");
        layer.setDescription("1. Band ratio: (B6+B8)/B7Blue is low content, Red is high content(potentially includes: chlorite, epidote, jarosite, nontronite, gibbsite, gypsum, opal-chalcedony)");
        layer.setGroup("ASTER Maps");
        layer.setOrder("30_ASTER Maps_060");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeFerricOxideComp">
        <ns0:constructor-arg name="id" value="aster-ferric-oxide-comp" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="recordId" value="aa27099f-13dd-4294-8558-595661eeba01" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="ASTER Map Ferric oxide composition" />
        <ns0:property name="description" value="1. Band ratio: B2/B1Blue-cyan is goethite rich, Green is hematite-goethite, Red-yellow is hematite-rich" />
        <ns0:property name="group" value="ASTER Maps" />
        <ns0:property name="order" value="30_ASTER Maps_070" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeFerricOxideCompSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeFerricOxideComp() {
        KnownLayer layer = new KnownLayer("aster-ferric-oxide-comp", knownTypeFerricOxideCompSelector());
        layer.setName("ASTER Map Ferric oxide composition");
        layer.setDescription("1. Band ratio: B2/B1Blue-cyan is goethite rich, Green is hematite-goethite, Red-yellow is hematite-rich");
        layer.setGroup("ASTER Maps");
        layer.setOrder("30_ASTER Maps_070");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGroupIndex">
        <ns0:constructor-arg name="id" value="aster-group-index" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="recordId" value="ea755cf7-eb59-41d1-86bd-4d1954c93bfe" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="ASTER Map Kaolin group index" />
        <ns0:property name="description" value="B6/B5(potential includes: pyrophyllite, alunite, well-ordered kaolinite)Blue is low content, Red is high content" />
        <ns0:property name="group" value="ASTER Maps" />
        <ns0:property name="order" value="30_ASTER Maps_080" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeGroupIndexSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeGroupIndex() {
        KnownLayer layer = new KnownLayer("aster-group-index", knownTypeGroupIndexSelector());
        layer.setName("ASTER Map Kaolin group index");
        layer.setDescription("B6/B5(potential includes: pyrophyllite, alunite, well-ordered kaolinite)Blue is low content, Red is high content");
        layer.setGroup("ASTER Maps");
        layer.setOrder("30_ASTER Maps_080");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeQuartzIndex">
        <ns0:constructor-arg name="id" value="aster-quartz-index" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="recordId" value="137a4e7e-9633-40d8-9b2f-2d2d1eb15c08" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="ASTER Map TIR Quartz index" />
        <ns0:property name="description" value="1. Band ratio: B11/(B10+B12)Blue is low quartz contentRed is high quartz content" />
        <ns0:property name="group" value="ASTER Maps" />
        <ns0:property name="order" value="30_ASTER Maps_090" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeQuartzIndexSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeQuartzIndex() {
        KnownLayer layer = new KnownLayer("aster-quartz-index", knownTypeQuartzIndexSelector());
        layer.setName("ASTER Map TIR Quartz index");
        layer.setDescription("1. Band ratio: B11/(B10+B12)Blue is low quartz contentRed is high quartz content");
        layer.setGroup("ASTER Maps");
        layer.setOrder("30_ASTER Maps_090");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeMgohContent">
        <ns0:constructor-arg name="id" value="aster-mgoh-content" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="recordId" value="a101fef8-2c52-4d62-9b43-0914487af197" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="ASTER Map MgOH group content" />
        <ns0:property name="description" value="1. Band ratio: (B6+B9/(B7+B8)Blue is low content, Red is high content(potentially includes: calcite, dolomite, magnesite, chlorite, epidote, amphibole, talc, serpentine)" />
        <ns0:property name="group" value="ASTER Maps" />
        <ns0:property name="order" value="30_ASTER Maps_100" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeMgohContentSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeMgohContent() {
        KnownLayer layer = new KnownLayer("aster-mgoh-content", knownTypeMgohContentSelector());
        layer.setName("ASTER Map MgOH group content");
        layer.setDescription("1. Band ratio: (B6+B9/(B7+B8)Blue is low content, Red is high content(potentially includes: calcite, dolomite, magnesite, chlorite, epidote, amphibole, talc, serpentine)");
        layer.setGroup("ASTER Maps");
        layer.setOrder("30_ASTER Maps_100");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGreenVeg">
        <ns0:constructor-arg name="id" value="aster-green-veg" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="recordId" value="2bd17d05-22f8-4b0d-a318-3eaabc1b5c2a" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="ASTER Map green vegetation content" />
        <ns0:property name="description" value="Band ratio: B3/B2 Blue is low contentRed is high content" />
        <ns0:property name="group" value="ASTER Maps" />
        <ns0:property name="order" value="30_ASTER Maps_110" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeGreenVegSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeGreenVeg() {
        KnownLayer layer = new KnownLayer("aster-green-veg", knownTypeGreenVegSelector());
        layer.setName("ASTER Map green vegetation content");
        layer.setDescription("Band ratio: B3/B2 Blue is low contentRed is high content");
        layer.setGroup("ASTER Maps");
        layer.setOrder("30_ASTER Maps_110");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeFerrCarb">
        <ns0:constructor-arg name="id" value="aster-ferr-carb" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="recordId" value="8601612e-3f3e-4334-9d31-3c6ec30f092a" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="ASTER Map Ferrous iron content in MgOH/carbonate" />
        <ns0:property name="description" value="1. Band ratio: B5/B4Blue is low ferrous iron content in carbonate and MgOH minerals like talc and tremolite.Red is high ferrous iron content in carbonate and MgOH minerals like chlorite and actinolite." />
        <ns0:property name="group" value="ASTER Maps" />
        <ns0:property name="order" value="30_ASTER Maps_120" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeFerrCarbSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeFerrCarb() {
        KnownLayer layer = new KnownLayer("aster-ferr-carb", knownTypeFerrCarbSelector());
        layer.setName("ASTER Map Ferrous iron content in MgOH/carbonate");
        layer.setDescription("1. Band ratio: B5/B4Blue is low ferrous iron content in carbonate and MgOH minerals like talc and tremolite.Red is high ferrous iron content in carbonate and MgOH minerals like chlorite and actinolite.");
        layer.setGroup("ASTER Maps");
        layer.setOrder("30_ASTER Maps_120");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeMgohGroupComp">
        <ns0:constructor-arg name="id" value="aster-mgoh-group-comp" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="recordId" value="8348fe99-0d50-45cd-8a0a-5439e82da833" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="ASTER Map MgOH group composition" />
        <ns0:property name="description" value="1. Band ratio: B7/B8Blue-cyan is magnesite-dolomite, amphibole, chlorite\tRed is calcite, epidote, amphibole" />
        <ns0:property name="group" value="ASTER Maps" />
        <ns0:property name="order" value="30_ASTER Maps_130" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeMgohGroupCompSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeMgohGroupComp() {
        KnownLayer layer = new KnownLayer("aster-mgoh-group-comp", knownTypeMgohGroupCompSelector());
        layer.setName("ASTER Map MgOH group composition");
        layer.setDescription("1. Band ratio: B7/B8Blue-cyan is magnesite-dolomite, amphibole, chlorite\tRed is calcite, epidote, amphibole");
        layer.setGroup("ASTER Maps");
        layer.setOrder("30_ASTER Maps_130");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeFalseColor">
        <ns0:constructor-arg name="id" value="aster-false-color" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="recordId" value="bfd6b137-7227-47f4-82f0-9e7fb788c507" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="ASTER Map false colour mosaic" />
        <ns0:property name="description" value="1. False colour RGB composite Red: B3Green: B2Blue: B1(red = green vegetation)" />
        <ns0:property name="group" value="ASTER Maps" />
        <ns0:property name="order" value="30_ASTER Maps_140" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeFalseColorSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeFalseColor() {
        KnownLayer layer = new KnownLayer("aster-false-color", knownTypeFalseColorSelector());
        layer.setName("ASTER Map false colour mosaic");
        layer.setDescription("1. False colour RGB composite Red: B3Green: B2Blue: B1(red = green vegetation)");
        layer.setGroup("ASTER Maps");
        layer.setOrder("30_ASTER Maps_140");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeRegolithRatios">
        <ns0:constructor-arg name="id" value="aster-reg-ratio" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="recordId" value="768dcbde-ae8a-440e-9b4b-44624ba4c836" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="ASTER Map Regolith Ratios" />
        <ns0:property name="description" value="1. 3 band RGB composite Red: B3/B2Green: B3/B7Blue: B4/B7(white = green vegetation)" />
        <ns0:property name="group" value="ASTER Maps" />
        <ns0:property name="order" value="30_ASTER Maps_150" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeRegolithRatiosSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeRegolithRatios() {
        KnownLayer layer = new KnownLayer("aster-reg-ratio", knownTypeRegolithRatiosSelector());
        layer.setName("ASTER Map Regolith Ratios");
        layer.setDescription("1. 3 band RGB composite Red: B3/B2Green: B3/B7Blue: B4/B7(white = green vegetation)");
        layer.setGroup("ASTER Maps");
        layer.setOrder("30_ASTER Maps_150");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeAlohGroupContent">
        <ns0:constructor-arg name="id" value="aster-aloh-group-content" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="recordId" value="b070d1d4-6420-4770-8ca6-3bf4b6682c3d" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="ASTER Map AlOH group content" />
        <ns0:property name="description" value="1. Band ratio: (B5+B7)/B6Blue is low abundance, Red is high abundance potentially includes: phengite, muscovite, paragonite, lepidolite, illite, brammalite, montmorillonite, beidellite, kaolinite, dickite" />
        <ns0:property name="group" value="ASTER Maps" />
        <ns0:property name="order" value="30_ASTER Maps_160" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeAlohGroupContentSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeAlohGroupContent() {
        KnownLayer layer = new KnownLayer("aster-aloh-group-content", knownTypeAlohGroupContentSelector());
        layer.setName("ASTER Map AlOH group content");
        layer.setDescription("1. Band ratio: (B5+B7)/B6Blue is low abundance, Red is high abundance potentially includes: phengite, muscovite, paragonite, lepidolite, illite, brammalite, montmorillonite, beidellite, kaolinite, dickite");
        layer.setGroup("ASTER Maps");
        layer.setOrder("30_ASTER Maps_160");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGypsumContent">
        <ns0:constructor-arg name="id" value="aster-gypsum-content" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="recordId" value="EB574238-BCB9-4A98-B1C1-71D1D1B0A946" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="ASTER Map TIR Gypsum index" />
        <ns0:property name="description" value="1. Band ratio: (B10+B12)/B11Blue is low gypsum contentRed is high gypsum content" />
        <ns0:property name="group" value="ASTER Maps" />
        <ns0:property name="order" value="30_ASTER Maps_170" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeGypsumContentSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeGypsumContent() {
        KnownLayer layer = new KnownLayer("aster-gypsum-content", knownTypeGypsumContentSelector());
        layer.setName("ASTER Map TIR Gypsum index");
        layer.setDescription("1. Band ratio: (B10+B12)/B11Blue is low gypsum contentRed is high gypsum content");
        layer.setGroup("ASTER Maps");
        layer.setOrder("30_ASTER Maps_170");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeSilicaContent">
        <ns0:constructor-arg name="id" value="aster-silica-content" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="recordId" value="cca633fe-5cdc-4fea-b77f-71b81c701c47" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="ASTER Map TIR Silica index" />
        <ns0:property name="description" value="1. Band ratio: B13/B10Blue is low silica contentRed is high silica content(potentially includes Si-rich minerals, such as quartz, feldspars, Al-clays)" />
        <ns0:property name="group" value="ASTER Maps" />
        <ns0:property name="order" value="30_ASTER Maps_180" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeSilicaContentSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeSilicaContent() {
        KnownLayer layer = new KnownLayer("aster-silica-content", knownTypeSilicaContentSelector());
        layer.setName("ASTER Map TIR Silica index");
        layer.setDescription("1. Band ratio: B13/B10Blue is low silica contentRed is high silica content(potentially includes Si-rich minerals, such as quartz, feldspars, Al-clays)");
        layer.setGroup("ASTER Maps");
        layer.setOrder("30_ASTER Maps_180");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeRemanentAnomalies">
        <ns0:constructor-arg name="id" value="remanent-anomalies" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="RemAnom:Anomaly" />
                <ns0:constructor-arg name="includeEndpoints" value="true" />
                <ns0:constructor-arg name="serviceEndpoints">
                    <ns0:list>
                        <ns0:value>http://remanentanomalies.csiro.au/geoserver/wfs</ns0:value>
                    </ns0:list>
                </ns0:constructor-arg>
            </ns0:bean>
        </ns0:constructor-arg>

        <ns0:property name="name" value="AUS5 - Remanent Anomalies" />
        <ns0:property name="description" value="A collection of services publishing magnetic anomalies" />
        <ns0:property name="group" value="Magnetics" />

        
        <ns0:property name="proxyUrl" value="" />
        <ns0:property name="proxyCountUrl" value="" />
        <ns0:property name="proxyStyleUrl" value="getRemanentAnomaliesStyle.do" />
        <ns0:property name="proxyDownloadUrl" value="doRemanentAnomaliesDownload.do" />
        <ns0:property name="order" value="80" />
        <ns0:property name="filterCollection">
             <ns0:bean class="org.auscope.portal.core.uifilter.FilterCollection">
                <ns0:property name="optionalFilters">
                    <ns0:list>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UITextBox">
                            <ns0:constructor-arg name="label" value="Remanent Anomaly Name" />
                            <ns0:constructor-arg name="xpath" value="RemAnom:AnomalyName" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISLIKE</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>   
                    </ns0:list>
                </ns0:property>                       
            </ns0:bean>        
        </ns0:property>
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeRemanentAnomaliesSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeRemanentAnomalies() {
        KnownLayer layer = new KnownLayer("remanent-anomalies", knownTypeRemanentAnomaliesSelector());
        layer.setName("AUS5 - Remanent Anomalies");
        layer.setDescription("A collection of services publishing magnetic anomalies");
        layer.setGroup("Magnetics");
        layer.setProxyUrl("");
        layer.setProxyCountUrl("");
        layer.setProxyStyleUrl("getRemanentAnomaliesStyle.do");
        layer.setProxyDownloadUrl("doRemanentAnomaliesDownload.do");
        layer.setOrder("80");
        
        // Optional filters
        layer.setFilterCollection(this.createTextBoxFilterCollection("Remanent Anomaly Name", "RenAnom:AnomalyName"));
         
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeRemanentAnomaliesAutoSearch">
        <ns0:constructor-arg name="id" value="remanent-anomalies-AutoSearch" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="RemAnomAutoSearch:AutoSearchAnomalies" />
            </ns0:bean>
        </ns0:constructor-arg>

        <ns0:property name="name" value="AUS5 - AutoSearch Anomalies" />
        <ns0:property name="description" value="A collection of services publishing magnetic anomalies" />
        <ns0:property name="group" value="Magnetics" />

        <ns0:property name="proxyUrl" value="" />
        <ns0:property name="proxyCountUrl" value="" />
        <ns0:property name="proxyStyleUrl" value="getRemanentAnomaliesAutoSearchStyle.do" />
        <ns0:property name="proxyDownloadUrl" value="doRemanentAnomaliesAutoSearchDownload.do" />
        <ns0:property name="order" value="81" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeRemanentAnomaliesAutoSearchSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeRemanentAnomaliesAutoSearch() {
        KnownLayer layer = new KnownLayer("remanent-anomalies-AutoSearch", knownTypeRemanentAnomaliesAutoSearchSelector());
        layer.setName("AUS5 - AutoSearch Anomalies");
        layer.setDescription("A collection of services publishing magnetic anomalies");
        layer.setGroup("Magnetics");
        layer.setProxyUrl("");
        layer.setProxyCountUrl("");
        layer.setProxyStyleUrl("getRemanentAnomaliesAutoSearchStyle.do");
        layer.setProxyDownloadUrl("doRemanentAnomaliesAutoSearchDownload.do");
        layer.setOrder("81");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeRemanentAnomaliesTMI">
        <ns0:constructor-arg name="id" value="remanent-anomaliesTMI" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="mag:australia_tmihires2a" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="AUS5 - Total Magnetic Intensity" />
        <ns0:property name="description" value="Total Magnetic Intensity from Magnetic Anomaly Map of Australia (fifth edition), Geoscience Australia and other sources" />
        <ns0:property name="group" value="Magnetics" />
        <ns0:property name="order" value="82" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeRemanentAnomaliesTMISelector() {
        return new WMSSelector("mag:australia_tmihires2a");
    }

    @Bean
    public KnownLayer knownTypeRemanentAnomaliesTMI() {
        KnownLayer layer = new KnownLayer("remanent-anomaliesTMI", knownTypeRemanentAnomaliesTMISelector());
        layer.setName("AUS5 - Total Magnetic Intensity");
        layer.setDescription("Total Magnetic Intensity from Magnetic Anomaly Map of Australia (fifth edition), Geoscience Australia and other sources");
        layer.setGroup("Magnetics");
        layer.setOrder("82");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeEMAGRemanentAnomalies">
        <ns0:constructor-arg name="id" value="remanent-anomalies-EMAG" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="RemAnom:Anomaly" />
                <ns0:constructor-arg name="includeEndpoints" value="true" />
                <ns0:constructor-arg name="serviceEndpoints">
                    <ns0:list>
                        <ns0:value>http://remanentanomalies.csiro.au/geoserverEMAG/wfs</ns0:value>
                    </ns0:list>
                </ns0:constructor-arg>
            </ns0:bean>
        </ns0:constructor-arg>

        <ns0:property name="name" value="EMAG2 - Remanent Anomalies" />
        <ns0:property name="description" value="A collection of services publishing magnetic anomalies from the EMAG2 layer" />
        <ns0:property name="group" value="Magnetics" />

        
        <ns0:property name="proxyUrl" value="" />
        <ns0:property name="proxyCountUrl" value="" />
        <ns0:property name="proxyStyleUrl" value="getRemanentAnomaliesStyle.do" />
        <ns0:property name="proxyDownloadUrl" value="doRemanentAnomaliesDownload.do" />
        <ns0:property name="order" value="83" />
        <ns0:property name="filterCollection">
             <ns0:bean class="org.auscope.portal.core.uifilter.FilterCollection">
                <ns0:property name="optionalFilters">
                    <ns0:list>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UITextBox">
                            <ns0:constructor-arg name="label" value="Remanent Anomaly Name" />
                            <ns0:constructor-arg name="xpath" value="RemAnom:AnomalyName" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISLIKE</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean> 
                    </ns0:list>
                </ns0:property>                       
            </ns0:bean>        
        </ns0:property>
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeEMAGRemanentAnomaliesSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeEMAGRemanentAnomalies() {
        KnownLayer layer = new KnownLayer("remanent-anomalies-EMAG", knownTypeEMAGRemanentAnomaliesSelector());
        layer.setName("EMAG2 - Remanent Anomalies");
        layer.setDescription("A collection of services publishing magnetic anomalies from the EMAG2 layer");
        layer.setGroup("Magnetics");
        layer.setProxyUrl("");
        layer.setProxyCountUrl("");
        layer.setProxyStyleUrl("getRemanentAnomaliesStyle.do");
        layer.setProxyDownloadUrl("doRemanentAnomaliesDownload.do");
        layer.setOrder("83");
      
        // Optional filters
        layer.setFilterCollection(this.createTextBoxFilterCollection("Remanent Anomaly Name", "RemAnom:AnomalyName"));
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeEMAGRemanentAnomaliesTMI">
        <ns0:constructor-arg name="id" value="remanent-anomalies-EMAGTMI" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="z" />
                <ns0:constructor-arg name="includeEndpoints" value="true" />
                <ns0:constructor-arg name="serviceEndpoints">
                    <ns0:list>
                        <ns0:value>http://remanentanomalies.csiro.au/thredds/wms/Emag2/EMAG2.nc</ns0:value>
                    </ns0:list>
                </ns0:constructor-arg>
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="EMAG2 - Total Magnetic Intensity" />
        <ns0:property name="description" value="Total Magnetic Intensity from the EMAG2 datasource.http://www.geomag.org/models/emag2.html" />
        <ns0:property name="group" value="Magnetics" />
        <ns0:property name="order" value="84" />
    </ns0:bean>

    
    
*/

    @Bean
    public WMSSelector knownTypeEMAGRemanentAnomaliesTMISelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeEMAGRemanentAnomaliesTMI() {
        KnownLayer layer = new KnownLayer("remanent-anomalies-EMAGTMI", knownTypeEMAGRemanentAnomaliesTMISelector());
        layer.setName("EMAG2 - Total Magnetic Intensity");
        layer.setDescription("Total Magnetic Intensity from the EMAG2 datasource.http://www.geomag.org/models/emag2.html");
        layer.setGroup("Magnetics");
        layer.setOrder("84");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeSamplingPoint">
        <ns0:constructor-arg name="id" value="notused-samplingpoint" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="sa:SamplingPoint" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="hidden" value="true" />
        <ns0:property name="order" value="450" />
    </ns0:bean>
    
    
*/

    @Bean
    public WMSSelector knownTypeSamplingPointSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeSamplingPoint() {
        KnownLayer layer = new KnownLayer("notused-samplingpoint", knownTypeSamplingPointSelector());
        layer.setHidden(true);
        layer.setOrder("450");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeFeatureCollection">
        <ns0:constructor-arg name="id" value="notused-featurecollection" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="gml:FeatureCollection" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="hidden" value="true" />
        
    </ns0:bean>
    
    
*/

    @Bean
    public WMSSelector knownTypeFeatureCollectionSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeFeatureCollection() {
        KnownLayer layer = new KnownLayer("notused-featurecollection", knownTypeFeatureCollectionSelector());
        layer.setHidden(true);
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeLateriteYilgarnGeoChem">
        <ns0:constructor-arg name="id" value="notused-lateriteyilgarngeochem" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="Geochem:LateriteYilgarnGeoChem" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="hidden" value="true" />
    </ns0:bean>
    
    
*/

    @Bean
    public WMSSelector knownTypeLateriteYilgarnGeoChemSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeLateriteYilgarnGeoChem() {
        KnownLayer layer = new KnownLayer("notused-lateriteyilgarngeochem", knownTypeLateriteYilgarnGeoChemSelector());
        layer.setHidden(true);
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeHighPSiteFeatureType">
        <ns0:constructor-arg name="id" value="notused-highpsitefeaturetype" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="highp:HighPSiteFeatureType" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="hidden" value="true" />
    </ns0:bean>
    
    
*/

    @Bean
    public WMSSelector knownTypeHighPSiteFeatureTypeSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeHighPSiteFeatureType() {
        KnownLayer layer = new KnownLayer("notused-highpsitefeaturetype", knownTypeHighPSiteFeatureTypeSelector());
        layer.setHidden(true);
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeHighPFeatureType">
        <ns0:constructor-arg name="id" value="notused-highpfeaturetype" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="highp:HighPFeatureType" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="hidden" value="true" />
    </ns0:bean>
    
    
*/

    @Bean
    public WMSSelector knownTypeHighPFeatureTypeSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeHighPFeatureType() {
        KnownLayer layer = new KnownLayer("notused-highpfeaturetype", knownTypeHighPFeatureTypeSelector());
        layer.setHidden(true);
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeHighPREIronLayer">
        <ns0:constructor-arg name="id" value="notused-highpreironlayer" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="HighP-RE-IronLayer" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="hidden" value="true" />
    </ns0:bean>
    
    
*/

    @Bean
    public WMSSelector knownTypeHighPREIronLayerSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeHighPREIronLayer() {
        KnownLayer layer = new KnownLayer("notused-highpreironlayer", knownTypeHighPREIronLayerSelector());
        layer.setHidden(true);
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeHighPREPhosLayer">
        <ns0:constructor-arg name="id" value="notused-highprephoslayer" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="HighP-RE-PhosLayer" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="hidden" value="true" />
    </ns0:bean>
    
    
*/

    @Bean
    public WMSSelector knownTypeHighPREPhosLayerSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeHighPREPhosLayer() {
        KnownLayer layer = new KnownLayer("notused-highprephoslayer", knownTypeHighPREPhosLayerSelector());
        layer.setHidden(true);
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeHighPSiteIronLayer">
        <ns0:constructor-arg name="id" value="notused-highpsiteironlayer" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="HighP-Site-IronLayer" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="hidden" value="true" />
    </ns0:bean>
    
    
*/

    @Bean
    public WMSSelector knownTypeHighPSiteIronLayerSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeHighPSiteIronLayer() {
        KnownLayer layer = new KnownLayer("notused-highpsiteironlayer", knownTypeHighPSiteIronLayerSelector());
        layer.setHidden(true);
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeHighPSitePhosLayer">
        <ns0:constructor-arg name="id" value="notused-highpsitephoslayer" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="HighP-Site-PhosLayer" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="hidden" value="true" />
    </ns0:bean>
    
    
*/

    @Bean
    public WMSSelector knownTypeHighPSitePhosLayerSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeHighPSitePhosLayer() {
        KnownLayer layer = new KnownLayer("notused-highpsitephoslayer", knownTypeHighPSitePhosLayerSelector());
        layer.setHidden(true);
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypePortals">
        <ns0:constructor-arg name="id" value="notused-portals" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="descriptiveKeyword" value="Portal" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="hidden" value="true" />
    </ns0:bean>
    
    
*/

    @Bean
    public WMSSelector knownTypePortalsSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypePortals() {
        KnownLayer layer = new KnownLayer("notused-portals", knownTypePortalsSelector());
        layer.setHidden(true);
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGeoNetworks">
        <ns0:constructor-arg name="id" value="notused-geonetwork" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="descriptiveKeyword" value="GeoNetwork" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="hidden" value="true" />
    </ns0:bean>
    
    
    
*/

    @Bean
    public WMSSelector knownTypeGeoNetworksSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeGeoNetworks() {
        KnownLayer layer = new KnownLayer("notused-geonetwork", knownTypeGeoNetworksSelector());
        layer.setHidden(true);
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeBouguerGeodetic">
        <ns0:constructor-arg name="id" value="ga-onshore-bouguer-geodetic" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="onshore_only_Bouguer_geodetic" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="Onshore Only Bouguer Geodetic" />
        <ns0:property name="description" value="" />
        <ns0:property name="group" value="Analytic - Geoscience Australia Coverages" />
        <ns0:property name="order" value="110" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeBouguerGeodeticSelector() {
        return new WMSSelector("onshore_only_Bouguer_geodetic");
    }

    @Bean
    public KnownLayer knownTypeBouguerGeodetic() {
        KnownLayer layer = new KnownLayer("ga-onshore-bouguer-geodetic", knownTypeBouguerGeodeticSelector());
        layer.setName("Onshore Only Bouguer Geodetic");
        layer.setDescription("");
        layer.setGroup("Analytic - Geoscience Australia Coverages");
        layer.setOrder("110");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGravAnomalyGeodetic">
        <ns0:constructor-arg name="id" value="ga-grav-anom-geo" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="onshore_and_offshore_gravity_anomaly_geodetic" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="Onshore and Offshore Gravity Anomaly Geodetic" />
        <ns0:property name="description" value="" />
        <ns0:property name="group" value="Analytic - Geoscience Australia Coverages" />
        <ns0:property name="order" value="111" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeGravAnomalyGeodeticSelector() {
        return new WMSSelector("onshore_and_offshore_gravity_anomaly_geodetic");
    }

    @Bean
    public KnownLayer knownTypeGravAnomalyGeodetic() {
        KnownLayer layer = new KnownLayer("ga-grav-anom-geo", knownTypeGravAnomalyGeodeticSelector());
        layer.setName("Onshore and Offshore Gravity Anomaly Geodetic");
        layer.setDescription("");
        layer.setGroup("Analytic - Geoscience Australia Coverages");
        layer.setOrder("111");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeMagMap">
        <ns0:constructor-arg name="id" value="ga-magmap-v5-2010" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="magmap_V5_2010" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="MagMap V5 2010" />
        <ns0:property name="description" value="" />
        <ns0:property name="group" value="Analytic - Geoscience Australia Coverages" />
        <ns0:property name="order" value="112" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeMagMapSelector() {
        return new WMSSelector("magmap_V5_2010");
    }

    @Bean
    public KnownLayer knownTypeMagMap() {
        KnownLayer layer = new KnownLayer("ga-magmap-v5-2010", knownTypeMagMapSelector());
        layer.setName("MagMap V5 2010");
        layer.setDescription("");
        layer.setGroup("Analytic - Geoscience Australia Coverages");
        layer.setOrder("112");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeRadMapTotaldose">
        <ns0:constructor-arg name="id" value="ga-radmap-totaldose" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="radmap10_filtered_totaldose" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="RadMap Totaldose" />
        <ns0:property name="description" value="" />
        <ns0:property name="group" value="Geoscience Australia Coverages" />
        <ns0:property name="order" value="120" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeRadMapTotaldoseSelector() {
        return new WMSSelector("radmap10_filtered_totaldose");
    }

    @Bean
    public KnownLayer knownTypeRadMapTotaldose() {
        KnownLayer layer = new KnownLayer("ga-radmap-totaldose", knownTypeRadMapTotaldoseSelector());
        layer.setName("RadMap Totaldose");
        layer.setDescription("");
        layer.setGroup("Geoscience Australia Coverages");
        layer.setOrder("120");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGocadModels">
        <ns0:constructor-arg name="id" value="gocad-models" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="descriptiveKeyword" value="http://vgl.auscope.org/model/gocad" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="GOCAD Models" />
        <ns0:property name="description" value="A collection of spatially located 3D models that have been generated using GOCAD" />
        <ns0:property name="group" value="Analytic - Geoscience Australia" />
        <ns0:property name="iconUrl" value="http://maps.google.com/mapfiles/kml/paddle/blu-square.png" />
        <ns0:property name="iconAnchor">
            <ns0:bean class="java.awt.Point">
                <ns0:constructor-arg index="0" value="16" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="iconSize">
            <ns0:bean class="java.awt.Dimension">
                <ns0:constructor-arg index="0" value="32" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="order" value="130" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeGocadModelsSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeGocadModels() {
        KnownLayer layer = new KnownLayer("gocad-models", knownTypeGocadModelsSelector());
        layer.setName("GOCAD Models");
        layer.setDescription("A collection of spatially located 3D models that have been generated using GOCAD");
        layer.setGroup("Analytic - Geoscience Australia");
        layer.setIconUrl("http://maps.google.com/mapfiles/kml/paddle/blu-square.png");
        setupIcon(layer);
        layer.setOrder("130");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="KnownTypeGeophysicsDatasets">
        <ns0:constructor-arg name="id" value="geophysics-datasets" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="descriptiveKeyword" value="GeophysicsDataset" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="GA Geophysics Projects" />
        <ns0:property name="description" value="A collection of spatially located geophysics datasets from GA" />
        <ns0:property name="group" value="Analytic - Geoscience Australia" />
        <ns0:property name="iconUrl" value="http://maps.google.com/mapfiles/kml/paddle/blu-square.png" />
        <ns0:property name="iconAnchor">
            <ns0:bean class="java.awt.Point">
                <ns0:constructor-arg index="0" value="16" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="iconSize">
            <ns0:bean class="java.awt.Dimension">
                <ns0:constructor-arg index="0" value="32" />
                <ns0:constructor-arg index="1" value="32" />
            </ns0:bean>
        </ns0:property>
        <ns0:property name="order" value="131" />
    </ns0:bean>

     
*/

    @Bean
    public WMSSelector KnownTypeGeophysicsDatasetsSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer KnownTypeGeophysicsDatasets() {
        KnownLayer layer = new KnownLayer("geophysics-datasets", KnownTypeGeophysicsDatasetsSelector());
        layer.setName("GA Geophysics Projects");
        layer.setDescription("A collection of spatially located geophysics datasets from GA");
        layer.setGroup("Analytic - Geoscience Australia");
        layer.setIconUrl("http://maps.google.com/mapfiles/kml/paddle/blu-square.png");
        setupIcon(layer);
        layer.setOrder("131");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGAAemSurvey">
        <ns0:constructor-arg name="id" value="ga-aem" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="ga:aemsurveys" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="Paterson Airbone Electromagnetic Survey" />
        <ns0:property name="description" value="" />
        <ns0:property name="group" value="Analytic - Geoscience Australia" />
        <ns0:property name="order" value="132" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeGAAemSurveySelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeGAAemSurvey() {
        KnownLayer layer = new KnownLayer("ga-aem", knownTypeGAAemSurveySelector());
        layer.setName("Paterson Airbone Electromagnetic Survey");
        layer.setDescription("");
        layer.setGroup("Analytic - Geoscience Australia");
        layer.setOrder("132");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGARumJungleAEM">
        <ns0:constructor-arg name="id" value="ga-rum-jungle-aem" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="ga:rum_jungle_aem" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="Rum Jungle Airbone Electromagnetic Survey" />
        <ns0:property name="description" value="" />
        <ns0:property name="group" value="Analytic - Geoscience Australia" />
        <ns0:property name="order" value="133" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeGARumJungleAEMSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeGARumJungleAEM() {
        KnownLayer layer = new KnownLayer("ga-rum-jungle-aem", knownTypeGARumJungleAEMSelector());
        layer.setName("Rum Jungle Airbone Electromagnetic Survey");
        layer.setDescription("");
        layer.setGroup("Analytic - Geoscience Australia");
        layer.setOrder("133");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGAWoolnerAEM">
        <ns0:constructor-arg name="id" value="ga-woolner-aem" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="ga:woolner_aem" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="Woolner Airbone Electromagnetic Survey" />
        <ns0:property name="description" value="" />
        <ns0:property name="group" value="Analytic - Geoscience Australia" />
        <ns0:property name="order" value="134" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeGAWoolnerAEMSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeGAWoolnerAEM() {
        KnownLayer layer = new KnownLayer("ga-woolner-aem", knownTypeGAWoolnerAEMSelector());
        layer.setName("Woolner Airbone Electromagnetic Survey");
        layer.setDescription("");
        layer.setGroup("Analytic - Geoscience Australia");
        layer.setOrder("134");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGAGravitySurvey">
        <ns0:constructor-arg name="id" value="ga-gravity" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="ga:gravitypoints" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="Australian Point Gravity" />
        <ns0:property name="description" value="" />
        <ns0:property name="group" value="Analytic - Geoscience Australia" />
        <ns0:property name="order" value="135" />
    </ns0:bean>
    
    
*/

    @Bean
    public WMSSelector knownTypeGAGravitySurveySelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeGAGravitySurvey() {
        KnownLayer layer = new KnownLayer("ga-gravity", knownTypeGAGravitySurveySelector());
        layer.setName("Australian Point Gravity");
        layer.setDescription("");
        layer.setGroup("Analytic - Geoscience Australia");
        layer.setOrder("135");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeMusgraveAem">
        <ns0:constructor-arg name="id" value="csiro-musgrave-aem" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="ga:musgrave_aem" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="Musgrave Airbone Electromagnetic Survey" />
        <ns0:property name="description" value="" />
        <ns0:property name="group" value="Analytic - CSIRO" />
        <ns0:property name="order" value="140" />
    </ns0:bean>
    
    
*/

    @Bean
    public WMSSelector knownTypeMusgraveAemSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeMusgraveAem() {
        KnownLayer layer = new KnownLayer("csiro-musgrave-aem", knownTypeMusgraveAemSelector());
        layer.setName("Musgrave Airbone Electromagnetic Survey");
        layer.setDescription("");
        layer.setGroup("Analytic - CSIRO");
        layer.setOrder("140");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeWesternAreaAem">
        <ns0:constructor-arg name="id" value="csiro-western-area-aem" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="ga:western_area_aem" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="Western Area Airbone Electromagnetic Survey" />
        <ns0:property name="description" value="Western Area 70001" />
        <ns0:property name="group" value="Analytic - CSIRO" />
        <ns0:property name="order" value="141" />
    </ns0:bean>
    
    
*/

    @Bean
    public WMSSelector knownTypeWesternAreaAemSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeWesternAreaAem() {
        KnownLayer layer = new KnownLayer("csiro-western-area-aem", knownTypeWesternAreaAemSelector());
        layer.setName("Western Area Airbone Electromagnetic Survey");
        layer.setDescription("Western Area 70001");
        layer.setGroup("Analytic - CSIRO");
        layer.setOrder("141");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeAshburtonAem">
        <ns0:constructor-arg name="id" value="csiro-ashburton-aem" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="ga:ashburton_aem" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="name" value="Ashburton Airbone Electromagnetic Survey" />
        <ns0:property name="description" value="" />
        <ns0:property name="group" value="Analytic - CSIRO" />
        <ns0:property name="order" value="142" />
    </ns0:bean>
    

    
    
*/

    @Bean
    public WMSSelector knownTypeAshburtonAemSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeAshburtonAem() {
        KnownLayer layer = new KnownLayer("csiro-ashburton-aem", knownTypeAshburtonAemSelector());
        layer.setName("Ashburton Airbone Electromagnetic Survey");
        layer.setDescription("");
        layer.setGroup("Analytic - CSIRO");
        layer.setOrder("142");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGsvGeologicalUnit250K">
        <ns0:constructor-arg name="id" value="gsv-geological-unit-250k-" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="erdd:GSV_SG_250K_GEOLUNIT" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="gsv-geological-unit-250k-" />
        <ns0:property name="name" value="Gsv Geological Unit 250K " />
        <ns0:property name="group" value="Geological Survey of Victoria" />
        <ns0:property name="description" value="Geological units represented as two dimensional polygons, designed for portrayal" />
        <ns0:property name="order" value="Registered_1" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeGsvGeologicalUnit250KSelector() {
        return new WMSSelector("erdd:GSV_SG_250K_GEOLUNIT");
    }

    @Bean
    public KnownLayer knownTypeGsvGeologicalUnit250K() {
        KnownLayer layer = new KnownLayer("gsv-geological-unit-250k-", knownTypeGsvGeologicalUnit250KSelector());
        layer.setId("gsv-geological-unit-250k-");
        layer.setName("Gsv Geological Unit 250K ");
        layer.setGroup("Geological Survey of Victoria");
        layer.setDescription("Geological units represented as two dimensional polygons, designed for portrayal");
        layer.setOrder("Registered_1");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGsvGeologicalUnitContact250K">
        <ns0:constructor-arg name="id" value="gsv-geological-unit-contact-250k-" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="erdd:GSV_SG_250K_GEOLUNITCONTACT" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="gsv-geological-unit-contact-250k-" />
        <ns0:property name="name" value="Gsv Geological Unit Contact 250K " />
        <ns0:property name="group" value="Geological Survey of Victoria" />
        <ns0:property name="description" value="Geological boundaries represented as two dimensional lines, designed for portray" />
        <ns0:property name="order" value="Registered_2" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeGsvGeologicalUnitContact250KSelector() {
        return new WMSSelector("erdd:GSV_SG_250K_GEOLUNITCONTACT");
    }

    @Bean
    public KnownLayer knownTypeGsvGeologicalUnitContact250K() {
        KnownLayer layer = new KnownLayer("gsv-geological-unit-contact-250k-", knownTypeGsvGeologicalUnitContact250KSelector());
        layer.setId("gsv-geological-unit-contact-250k-");
        layer.setName("Gsv Geological Unit Contact 250K ");
        layer.setGroup("Geological Survey of Victoria");
        layer.setDescription("Geological boundaries represented as two dimensional lines, designed for portray");
        layer.setOrder("Registered_2");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGsvGeologicalUnitContact50K">
        <ns0:constructor-arg name="id" value="gsv-geological-unit-contact-50k-" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="erdd:GSV_SG_50K_GEOLUNITCONTACT" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="gsv-geological-unit-contact-50k-" />
        <ns0:property name="name" value="Gsv Geological Unit Contact 50K " />
        <ns0:property name="group" value="Geological Survey of Victoria" />
        <ns0:property name="description" value="Geological boundaries represented as two dimensional lines, designed for portray" />
        <ns0:property name="order" value="Registered_3" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeGsvGeologicalUnitContact50KSelector() {
        return new WMSSelector("erdd:GSV_SG_50K_GEOLUNITCONTACT");
    }

    @Bean
    public KnownLayer knownTypeGsvGeologicalUnitContact50K() {
        KnownLayer layer = new KnownLayer("gsv-geological-unit-contact-50k-", knownTypeGsvGeologicalUnitContact50KSelector());
        layer.setId("gsv-geological-unit-contact-50k-");
        layer.setName("Gsv Geological Unit Contact 50K ");
        layer.setGroup("Geological Survey of Victoria");
        layer.setDescription("Geological boundaries represented as two dimensional lines, designed for portray");
        layer.setOrder("Registered_3");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGsvGeologicalUnit250KAge">
        <ns0:constructor-arg name="id" value="gsv-geological-unit-250k-age" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="erdd:GSV_SG_250K_GEOLUNIT_AGE" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="gsv-geological-unit-250k-age" />
        <ns0:property name="name" value="Gsv Geological Unit 250K Age" />
        <ns0:property name="group" value="Geological Survey of Victoria" />
        <ns0:property name="description" value="Geological units represented as two dimensional polygons, designed for portrayal" />
        <ns0:property name="order" value="Registered_4" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeGsvGeologicalUnit250KAgeSelector() {
        return new WMSSelector("erdd:GSV_SG_250K_GEOLUNIT_AGE");
    }

    @Bean
    public KnownLayer knownTypeGsvGeologicalUnit250KAge() {
        KnownLayer layer = new KnownLayer("gsv-geological-unit-250k-age", knownTypeGsvGeologicalUnit250KAgeSelector());
        layer.setId("gsv-geological-unit-250k-age");
        layer.setName("Gsv Geological Unit 250K Age");
        layer.setGroup("Geological Survey of Victoria");
        layer.setDescription("Geological units represented as two dimensional polygons, designed for portrayal");
        layer.setOrder("Registered_4");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGsvShearDisplacementStructure250K">
        <ns0:constructor-arg name="id" value="gsv-shear-displacement-structure-250k-" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="erdd:GSV_SG_250K_SHEARDISPSTRUCTURE" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="gsv-shear-displacement-structure-250k-" />
        <ns0:property name="name" value="Gsv Shear Displacement Structure 250K " />
        <ns0:property name="group" value="Geological Survey of Victoria" />
        <ns0:property name="description" value="Shear displacement structures (faults) represented as two dimensional lines, des" />
        <ns0:property name="order" value="Registered_5" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeGsvShearDisplacementStructure250KSelector() {
        return new WMSSelector("erdd:GSV_SG_250K_SHEARDISPSTRUCTURE");
    }

    @Bean
    public KnownLayer knownTypeGsvShearDisplacementStructure250K() {
        KnownLayer layer = new KnownLayer("gsv-shear-displacement-structure-250k-", knownTypeGsvShearDisplacementStructure250KSelector());
        layer.setId("gsv-shear-displacement-structure-250k-");
        layer.setName("Gsv Shear Displacement Structure 250K ");
        layer.setGroup("Geological Survey of Victoria");
        layer.setDescription("Shear displacement structures (faults) represented as two dimensional lines, des");
        layer.setOrder("Registered_5");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGsvGeologicalUnit250KLithology">
        <ns0:constructor-arg name="id" value="gsv-geological-unit-250k-lithology" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="erdd:GSV_SG_250K_GEOLUNIT_LITHOLOGY" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="gsv-geological-unit-250k-lithology" />
        <ns0:property name="name" value="Gsv Geological Unit 250K Lithology" />
        <ns0:property name="group" value="Geological Survey of Victoria" />
        <ns0:property name="description" value="Geological units represented as two dimensional polygons, designed for portrayal" />
        <ns0:property name="order" value="Registered_6" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeGsvGeologicalUnit250KLithologySelector() {
        return new WMSSelector("erdd:GSV_SG_250K_GEOLUNIT_LITHOLOGY");
    }

    @Bean
    public KnownLayer knownTypeGsvGeologicalUnit250KLithology() {
        KnownLayer layer = new KnownLayer("gsv-geological-unit-250k-lithology", knownTypeGsvGeologicalUnit250KLithologySelector());
        layer.setId("gsv-geological-unit-250k-lithology");
        layer.setName("Gsv Geological Unit 250K Lithology");
        layer.setGroup("Geological Survey of Victoria");
        layer.setDescription("Geological units represented as two dimensional polygons, designed for portrayal");
        layer.setOrder("Registered_6");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGsvGeologicalUnit50KLithology">
        <ns0:constructor-arg name="id" value="gsv-geological-unit-50k-lithology" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="erdd:GSV_SG_50K_GEOLUNIT_LITHOLOGY" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="gsv-geological-unit-50k-lithology" />
        <ns0:property name="name" value="Gsv Geological Unit 50K Lithology" />
        <ns0:property name="group" value="Geological Survey of Victoria" />
        <ns0:property name="description" value="Geological units represented as two dimensional polygons, designed for portrayal" />
        <ns0:property name="order" value="Registered_7" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeGsvGeologicalUnit50KLithologySelector() {
        return new WMSSelector("erdd:GSV_SG_50K_GEOLUNIT_LITHOLOGY");
    }

    @Bean
    public KnownLayer knownTypeGsvGeologicalUnit50KLithology() {
        KnownLayer layer = new KnownLayer("gsv-geological-unit-50k-lithology", knownTypeGsvGeologicalUnit50KLithologySelector());
        layer.setId("gsv-geological-unit-50k-lithology");
        layer.setName("Gsv Geological Unit 50K Lithology");
        layer.setGroup("Geological Survey of Victoria");
        layer.setDescription("Geological units represented as two dimensional polygons, designed for portrayal");
        layer.setOrder("Registered_7");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGsvGeologicalUnit50K">
        <ns0:constructor-arg name="id" value="gsv-geological-unit-50k-" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="erdd:GSV_SG_50K_GEOLUNIT" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="gsv-geological-unit-50k-" />
        <ns0:property name="name" value="Gsv Geological Unit 50K " />
        <ns0:property name="group" value="Geological Survey of Victoria" />
        <ns0:property name="description" value="Geological units represented as two dimensional polygons, designed for portrayal" />
        <ns0:property name="order" value="Registered_8" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeGsvGeologicalUnit50KSelector() {
        return new WMSSelector("erdd:GSV_SG_50K_GEOLUNIT");
    }

    @Bean
    public KnownLayer knownTypeGsvGeologicalUnit50K() {
        KnownLayer layer = new KnownLayer("gsv-geological-unit-50k-", knownTypeGsvGeologicalUnit50KSelector());
        layer.setId("gsv-geological-unit-50k-");
        layer.setName("Gsv Geological Unit 50K ");
        layer.setGroup("Geological Survey of Victoria");
        layer.setDescription("Geological units represented as two dimensional polygons, designed for portrayal");
        layer.setOrder("Registered_8");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGsvShearDisplacementStructure50K">
        <ns0:constructor-arg name="id" value="gsv-shear-displacement-structure-50k-" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="erdd:GSV_SG_50K_SHEARDISPSTRUCTURE" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="gsv-shear-displacement-structure-50k-" />
        <ns0:property name="name" value="Gsv Shear Displacement Structure 50K " />
        <ns0:property name="group" value="Geological Survey of Victoria" />
        <ns0:property name="description" value="Shear displacement structures (faults) represented as two dimensional lines, des" />
        <ns0:property name="order" value="Registered_9" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeGsvShearDisplacementStructure50KSelector() {
        return new WMSSelector("erdd:GSV_SG_50K_SHEARDISPSTRUCTURE");
    }

    @Bean
    public KnownLayer knownTypeGsvShearDisplacementStructure50K() {
        KnownLayer layer = new KnownLayer("gsv-shear-displacement-structure-50k-", knownTypeGsvShearDisplacementStructure50KSelector());
        layer.setId("gsv-shear-displacement-structure-50k-");
        layer.setName("Gsv Shear Displacement Structure 50K ");
        layer.setGroup("Geological Survey of Victoria");
        layer.setDescription("Shear displacement structures (faults) represented as two dimensional lines, des");
        layer.setOrder("Registered_9");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGsvGeologicalUnit50KAge">
        <ns0:constructor-arg name="id" value="gsv-geological-unit-50k-age" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="erdd:GSV_SG_50K_GEOLUNIT_AGE" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="gsv-geological-unit-50k-age" />
        <ns0:property name="name" value="Gsv Geological Unit 50K Age" />
        <ns0:property name="group" value="Geological Survey of Victoria" />
        <ns0:property name="description" value="Geological units represented as two dimensional polygons, designed for portrayal" />
        <ns0:property name="order" value="Registered_10" />
    </ns0:bean>





    
*/

    @Bean
    public WMSSelector knownTypeGsvGeologicalUnit50KAgeSelector() {
        return new WMSSelector("erdd:GSV_SG_50K_GEOLUNIT_AGE");
    }

    @Bean
    public KnownLayer knownTypeGsvGeologicalUnit50KAge() {
        KnownLayer layer = new KnownLayer("gsv-geological-unit-50k-age", knownTypeGsvGeologicalUnit50KAgeSelector());
        layer.setId("gsv-geological-unit-50k-age");
        layer.setName("Gsv Geological Unit 50K Age");
        layer.setGroup("Geological Survey of Victoria");
        layer.setDescription("Geological units represented as two dimensional polygons, designed for portrayal");
        layer.setOrder("Registered_10");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeL180MtIsaDeepCrusSeisSurvQld2006StacAndMigrDataAndImagForLine06GaTo06Ga">
        <ns0:constructor-arg name="id" value="l180-mt-isa-deep-crus-seis-surv-qld-2006-stac-and-migr-data-and-imag-for-line-06ga-to-06ga" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="recordId" value="a05f7892-ee53-7506-e044-00144fdd4fa6" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="l180-mt-isa-deep-crus-seis-surv-qld-2006-stac-and-migr-data-and-imag-for-line-06ga-to-06ga" />
        <ns0:property name="name" value="L180 Mt Isa Deep Crustal Seismic Survey Qld 2006 Stacked And Migrated Data And Images For Lines 06Ga M1 To 06Ga M6" />
        <ns0:property name="group" value="Geoscience Australia" />
        <ns0:property name="description" value="Processed seismic data (SEG-Y format) and TIFF images for the 2006 Mt Isa Deep C" />
        <ns0:property name="order" value="Registered_14" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeL180MtIsaDeepCrusSeisSurvQld2006StacAndMigrDataAndImagForLine06GaTo06GaSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeL180MtIsaDeepCrusSeisSurvQld2006StacAndMigrDataAndImagForLine06GaTo06Ga() {
        KnownLayer layer = new KnownLayer("l180-mt-isa-deep-crus-seis-surv-qld-2006-stac-and-migr-data-and-imag-for-line-06ga-to-06ga", knownTypeL180MtIsaDeepCrusSeisSurvQld2006StacAndMigrDataAndImagForLine06GaTo06GaSelector());
        layer.setId("l180-mt-isa-deep-crus-seis-surv-qld-2006-stac-and-migr-data-and-imag-for-line-06ga-to-06ga");
        layer.setName("L180 Mt Isa Deep Crustal Seismic Survey Qld 2006 Stacked And Migrated Data And Images For Lines 06Ga M1 To 06Ga M6");
        layer.setGroup("Geoscience Australia");
        layer.setDescription("Processed seismic data (SEG-Y format) and TIFF images for the 2006 Mt Isa Deep C");
        layer.setOrder("Registered_14");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeAreTherAnySandUranSystInTheEromBasi">
        <ns0:constructor-arg name="id" value="are-ther-any-sand-uran-syst-in-the-erom-basi" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="recordId" value="a05f7892-f9c4-7506-e044-00144fdd4fa6" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="are-ther-any-sand-uran-syst-in-the-erom-basi" />
        <ns0:property name="name" value="Are There Any Sandstone Hosted Uranium Systems In The Eromanga Basin " />
        <ns0:property name="group" value="Geoscience Australia" />
        <ns0:property name="description" value="As part of Geoscience Australia's Onshore Energy Security Program the authors ha" />
        <ns0:property name="order" value="Registered_15" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeAreTherAnySandUranSystInTheEromBasiSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeAreTherAnySandUranSystInTheEromBasi() {
        KnownLayer layer = new KnownLayer("are-ther-any-sand-uran-syst-in-the-erom-basi", knownTypeAreTherAnySandUranSystInTheEromBasiSelector());
        layer.setId("are-ther-any-sand-uran-syst-in-the-erom-basi");
        layer.setName("Are There Any Sandstone Hosted Uranium Systems In The Eromanga Basin ");
        layer.setGroup("Geoscience Australia");
        layer.setDescription("As part of Geoscience Australia's Onshore Energy Security Program the authors ha");
        layer.setOrder("Registered_15");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeL164CurnSeisSurvSa20032004StacAndMigrSeisDataAndImagForLine03Ga">
        <ns0:constructor-arg name="id" value="l164-curn-seis-surv-sa-2003-2004-stac-and-migr-seis-data-and-imag-for-line-03ga" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="recordId" value="cd697530-5b75-3811-e044-00144fdd4fa6" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="l164-curn-seis-surv-sa-2003-2004-stac-and-migr-seis-data-and-imag-for-line-03ga" />
        <ns0:property name="name" value="L164 Curnamona Seismic Survey Sa 2003 2004 Stacked And Migrated Seismic Data And Images For Lines 03Ga Cu1" />
        <ns0:property name="group" value="Geoscience Australia" />
        <ns0:property name="description" value="A seismic survey using the Australian National Seismic Imaging Resource (ANSIR) " />
        <ns0:property name="order" value="Registered_16" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeL164CurnSeisSurvSa20032004StacAndMigrSeisDataAndImagForLine03GaSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeL164CurnSeisSurvSa20032004StacAndMigrSeisDataAndImagForLine03Ga() {
        KnownLayer layer = new KnownLayer("l164-curn-seis-surv-sa-2003-2004-stac-and-migr-seis-data-and-imag-for-line-03ga", knownTypeL164CurnSeisSurvSa20032004StacAndMigrSeisDataAndImagForLine03GaSelector());
        layer.setId("l164-curn-seis-surv-sa-2003-2004-stac-and-migr-seis-data-and-imag-for-line-03ga");
        layer.setName("L164 Curnamona Seismic Survey Sa 2003 2004 Stacked And Migrated Seismic Data And Images For Lines 03Ga Cu1");
        layer.setGroup("Geoscience Australia");
        layer.setDescription("A seismic survey using the Australian National Seismic Imaging Resource (ANSIR) ");
        layer.setOrder("Registered_16");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeLawnHillPlatAndLeicRiveFaulTrouMeasStraSectOnliGis">
        <ns0:constructor-arg name="id" value="lawn-hill-plat-and-leic-rive-faul-trou-meas-stra-sect-onli-gis" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="recordId" value="a05f7892-b7a0-7506-e044-00144fdd4fa6" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="lawn-hill-plat-and-leic-rive-faul-trou-meas-stra-sect-onli-gis" />
        <ns0:property name="name" value="Lawn Hill Platform And Leichhardt River Fault Trough Measured Stratigraphic Section Online Gis" />
        <ns0:property name="group" value="Geoscience Australia" />
        <ns0:property name="description" value="This GIS web browser contains stratigraphic information from the southern flank " />
        <ns0:property name="order" value="Registered_17" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeLawnHillPlatAndLeicRiveFaulTrouMeasStraSectOnliGisSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeLawnHillPlatAndLeicRiveFaulTrouMeasStraSectOnliGis() {
        KnownLayer layer = new KnownLayer("lawn-hill-plat-and-leic-rive-faul-trou-meas-stra-sect-onli-gis", knownTypeLawnHillPlatAndLeicRiveFaulTrouMeasStraSectOnliGisSelector());
        layer.setId("lawn-hill-plat-and-leic-rive-faul-trou-meas-stra-sect-onli-gis");
        layer.setName("Lawn Hill Platform And Leichhardt River Fault Trough Measured Stratigraphic Section Online Gis");
        layer.setGroup("Geoscience Australia");
        layer.setDescription("This GIS web browser contains stratigraphic information from the southern flank ");
        layer.setOrder("Registered_17");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypePredMineDiscInTheEastYilgCratAnExamOfDistTargOfAnOrogGoldMineSyst">
        <ns0:constructor-arg name="id" value="pred-mine-disc-in-the-east-yilg-crat-an-exam-of-dist-targ-of-an-orog-gold-mine-syst" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="recordId" value="a05f7892-eafd-7506-e044-00144fdd4fa6" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="pred-mine-disc-in-the-east-yilg-crat-an-exam-of-dist-targ-of-an-orog-gold-mine-syst" />
        <ns0:property name="name" value="Predictive Mineral Discovery In The Eastern Yilgarn Craton An Example Of District Scale Targeting Of An Orogenic Gold Mineral System" />
        <ns0:property name="group" value="Geoscience Australia" />
        <ns0:property name="description" value="Predictive mineral discovery is concerned with the application of a whole of sys" />
        <ns0:property name="order" value="Registered_18" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypePredMineDiscInTheEastYilgCratAnExamOfDistTargOfAnOrogGoldMineSystSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypePredMineDiscInTheEastYilgCratAnExamOfDistTargOfAnOrogGoldMineSyst() {
        KnownLayer layer = new KnownLayer("pred-mine-disc-in-the-east-yilg-crat-an-exam-of-dist-targ-of-an-orog-gold-mine-syst", knownTypePredMineDiscInTheEastYilgCratAnExamOfDistTargOfAnOrogGoldMineSystSelector());
        layer.setId("pred-mine-disc-in-the-east-yilg-crat-an-exam-of-dist-targ-of-an-orog-gold-mine-syst");
        layer.setName("Predictive Mineral Discovery In The Eastern Yilgarn Craton An Example Of District Scale Targeting Of An Orogenic Gold Mineral System");
        layer.setGroup("Geoscience Australia");
        layer.setDescription("Predictive mineral discovery is concerned with the application of a whole of sys");
        layer.setOrder("Registered_18");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeFinaRepo3DGeolModeOfTheEastYilgCratProjPmdY2Sept2001Dece2004">
        <ns0:constructor-arg name="id" value="fina-repo-3d-geol-mode-of-the-east-yilg-crat-proj-pmd-y2-sept-2001-dece-2004" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.CSWRecordSelector">
                <ns0:property name="recordId" value="a05f7892-ccc9-7506-e044-00144fdd4fa6" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="fina-repo-3d-geol-mode-of-the-east-yilg-crat-proj-pmd-y2-sept-2001-dece-2004" />
        <ns0:property name="name" value="Final Report 3D Geological Models Of The Eastern Yilgarn Craton Project Pmd Crc Y2 September 2001 December 2004" />
        <ns0:property name="group" value="Geoscience Australia" />
        <ns0:property name="description" value="The pmd*CRC Y2 project operated for a little over three years, and in this time " />
        <ns0:property name="order" value="Registered_19" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeFinaRepo3DGeolModeOfTheEastYilgCratProjPmdY2Sept2001Dece2004Selector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeFinaRepo3DGeolModeOfTheEastYilgCratProjPmdY2Sept2001Dece2004() {
        KnownLayer layer = new KnownLayer("fina-repo-3d-geol-mode-of-the-east-yilg-crat-proj-pmd-y2-sept-2001-dece-2004", knownTypeFinaRepo3DGeolModeOfTheEastYilgCratProjPmdY2Sept2001Dece2004Selector());
        layer.setId("fina-repo-3d-geol-mode-of-the-east-yilg-crat-proj-pmd-y2-sept-2001-dece-2004");
        layer.setName("Final Report 3D Geological Models Of The Eastern Yilgarn Craton Project Pmd Crc Y2 September 2001 December 2004");
        layer.setGroup("Geoscience Australia");
        layer.setDescription("The pmd*CRC Y2 project operated for a little over three years, and in this time ");
        layer.setOrder("Registered_19");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeMineralFields">
        <ns0:constructor-arg name="id" value="mineral-fields" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="Mineral_Fields" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="mineral-fields" />
        <ns0:property name="name" value="Mineral Fields" />
        <ns0:property name="group" value="WA Department of Mines and Petroleum" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_22" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeMineralFieldsSelector() {
        return new WMSSelector("Mineral_Fields");
    }

    @Bean
    public KnownLayer knownTypeMineralFields() {
        KnownLayer layer = new KnownLayer("mineral-fields", knownTypeMineralFieldsSelector());
        layer.setId("mineral-fields");
        layer.setName("Mineral Fields");
        layer.setGroup("WA Department of Mines and Petroleum");
        layer.setDescription("");
        layer.setOrder("Registered_22");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeHistoricalExplorationActivityPoints">
        <ns0:constructor-arg name="id" value="historical-exploration-activity-points" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="Historical_Exploration_Activity_-_points" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="historical-exploration-activity-points" />
        <ns0:property name="name" value="Historical Exploration Activity Points" />
        <ns0:property name="group" value="WA Department of Mines and Petroleum" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_23" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeHistoricalExplorationActivityPointsSelector() {
        return new WMSSelector("Historical_Exploration_Activity_-_points");
    }

    @Bean
    public KnownLayer knownTypeHistoricalExplorationActivityPoints() {
        KnownLayer layer = new KnownLayer("historical-exploration-activity-points", knownTypeHistoricalExplorationActivityPointsSelector());
        layer.setId("historical-exploration-activity-points");
        layer.setName("Historical Exploration Activity Points");
        layer.setGroup("WA Department of Mines and Petroleum");
        layer.setDescription("");
        layer.setOrder("Registered_23");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeReleases">
        <ns0:constructor-arg name="id" value="releases" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="Releases" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="releases" />
        <ns0:property name="name" value="Releases" />
        <ns0:property name="group" value="WA Department of Mines and Petroleum" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_24" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeReleasesSelector() {
        return new WMSSelector("Releases");
    }

    @Bean
    public KnownLayer knownTypeReleases() {
        KnownLayer layer = new KnownLayer("releases", knownTypeReleasesSelector());
        layer.setId("releases");
        layer.setName("Releases");
        layer.setGroup("WA Department of Mines and Petroleum");
        layer.setDescription("");
        layer.setOrder("Registered_24");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeSection574">
        <ns0:constructor-arg name="id" value="section-57-4" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="Section_57-4" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="section-57-4" />
        <ns0:property name="name" value="Section 57 4" />
        <ns0:property name="group" value="WA Department of Mines and Petroleum" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_25" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeSection574Selector() {
        return new WMSSelector("Section_57-4");
    }

    @Bean
    public KnownLayer knownTypeSection574() {
        KnownLayer layer = new KnownLayer("section-57-4", knownTypeSection574Selector());
        layer.setId("section-57-4");
        layer.setName("Section 57 4");
        layer.setGroup("WA Department of Mines and Petroleum");
        layer.setDescription("");
        layer.setOrder("Registered_25");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeSection19">
        <ns0:constructor-arg name="id" value="section-19" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="Section_19" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="section-19" />
        <ns0:property name="name" value="Section 19" />
        <ns0:property name="group" value="WA Department of Mines and Petroleum" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_26" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeSection19Selector() {
        return new WMSSelector("Section_19");
    }

    @Bean
    public KnownLayer knownTypeSection19() {
        KnownLayer layer = new KnownLayer("section-19", knownTypeSection19Selector());
        layer.setId("section-19");
        layer.setName("Section 19");
        layer.setGroup("WA Department of Mines and Petroleum");
        layer.setDescription("");
        layer.setOrder("Registered_26");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeMinesAndMineralDepositsMinedex">
        <ns0:constructor-arg name="id" value="mines-and-mineral-deposits-minedex" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="Mines_and_Mineral_Deposits_-_MINEDEX" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="mines-and-mineral-deposits-minedex" />
        <ns0:property name="name" value="Mines And Mineral Deposits Minedex" />
        <ns0:property name="group" value="WA Department of Mines and Petroleum" />
        <ns0:property name="description" value="Mines and Mineral Deposits of Western Australia (MINEDEX)" />
        <ns0:property name="order" value="Registered_27" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeMinesAndMineralDepositsMinedexSelector() {
        return new WMSSelector("Mines_and_Mineral_Deposits_-_MINEDEX");
    }

    @Bean
    public KnownLayer knownTypeMinesAndMineralDepositsMinedex() {
        KnownLayer layer = new KnownLayer("mines-and-mineral-deposits-minedex", knownTypeMinesAndMineralDepositsMinedexSelector());
        layer.setId("mines-and-mineral-deposits-minedex");
        layer.setName("Mines And Mineral Deposits Minedex");
        layer.setGroup("WA Department of Mines and Petroleum");
        layer.setDescription("Mines and Mineral Deposits of Western Australia (MINEDEX)");
        layer.setOrder("Registered_27");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeMineralisationZonesNonS572Aa">
        <ns0:constructor-arg name="id" value="mineralisation-zones-non-s57-2aa" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="Mineralisation_Zones_Non_S57-2AA" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="mineralisation-zones-non-s57-2aa" />
        <ns0:property name="name" value="Mineralisation Zones Non S57 2Aa" />
        <ns0:property name="group" value="WA Department of Mines and Petroleum" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_28" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeMineralisationZonesNonS572AaSelector() {
        return new WMSSelector("Mineralisation_Zones_Non_S57-2AA");
    }

    @Bean
    public KnownLayer knownTypeMineralisationZonesNonS572Aa() {
        KnownLayer layer = new KnownLayer("mineralisation-zones-non-s57-2aa", knownTypeMineralisationZonesNonS572AaSelector());
        layer.setId("mineralisation-zones-non-s57-2aa");
        layer.setName("Mineralisation Zones Non S57 2Aa");
        layer.setGroup("WA Department of Mines and Petroleum");
        layer.setDescription("");
        layer.setOrder("Registered_28");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeAmalgamations">
        <ns0:constructor-arg name="id" value="amalgamations" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="Amalgamations" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="amalgamations" />
        <ns0:property name="name" value="Amalgamations" />
        <ns0:property name="group" value="WA Department of Mines and Petroleum" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_29" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeAmalgamationsSelector() {
        return new WMSSelector("Amalgamations");
    }

    @Bean
    public KnownLayer knownTypeAmalgamations() {
        KnownLayer layer = new KnownLayer("amalgamations", knownTypeAmalgamationsSelector());
        layer.setId("amalgamations");
        layer.setName("Amalgamations");
        layer.setGroup("WA Department of Mines and Petroleum");
        layer.setDescription("");
        layer.setOrder("Registered_29");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeTenementsCurrent">
        <ns0:constructor-arg name="id" value="tenements-current" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="Tenements_Current" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="tenements-current" />
        <ns0:property name="name" value="Tenements Current" />
        <ns0:property name="group" value="WA Department of Mines and Petroleum" />
        <ns0:property name="description" value="Current Mining Tenements of Western Australia" />
        <ns0:property name="order" value="Registered_30" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeTenementsCurrentSelector() {
        return new WMSSelector("Tenements_Current");
    }

    @Bean
    public KnownLayer knownTypeTenementsCurrent() {
        KnownLayer layer = new KnownLayer("tenements-current", knownTypeTenementsCurrentSelector());
        layer.setId("tenements-current");
        layer.setName("Tenements Current");
        layer.setGroup("WA Department of Mines and Petroleum");
        layer.setDescription("Current Mining Tenements of Western Australia");
        layer.setOrder("Registered_30");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeHistoricalExplorationActivityLines">
        <ns0:constructor-arg name="id" value="historical-exploration-activity-lines" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="Historical_Exploration_Activity_-_lines" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="historical-exploration-activity-lines" />
        <ns0:property name="name" value="Historical Exploration Activity Lines" />
        <ns0:property name="group" value="WA Department of Mines and Petroleum" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_31" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeHistoricalExplorationActivityLinesSelector() {
        return new WMSSelector("Historical_Exploration_Activity_-_lines");
    }

    @Bean
    public KnownLayer knownTypeHistoricalExplorationActivityLines() {
        KnownLayer layer = new KnownLayer("historical-exploration-activity-lines", knownTypeHistoricalExplorationActivityLinesSelector());
        layer.setId("historical-exploration-activity-lines");
        layer.setName("Historical Exploration Activity Lines");
        layer.setGroup("WA Department of Mines and Petroleum");
        layer.setDescription("");
        layer.setOrder("Registered_31");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeRestorations">
        <ns0:constructor-arg name="id" value="restorations" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="Restorations" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="restorations" />
        <ns0:property name="name" value="Restorations" />
        <ns0:property name="group" value="WA Department of Mines and Petroleum" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_32" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeRestorationsSelector() {
        return new WMSSelector("Restorations");
    }

    @Bean
    public KnownLayer knownTypeRestorations() {
        KnownLayer layer = new KnownLayer("restorations", knownTypeRestorationsSelector());
        layer.setId("restorations");
        layer.setName("Restorations");
        layer.setGroup("WA Department of Mines and Petroleum");
        layer.setDescription("");
        layer.setOrder("Registered_32");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeHist">
        <ns0:constructor-arg name="id" value="hist" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="Historical_Exploration_Activity_-_polygons" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="hist" />
        <ns0:property name="name" value="Historical Exploration Activity Polygons" />
        <ns0:property name="group" value="WA Department of Mines and Petroleum" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_33" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeHistSelector() {
        return new WMSSelector("Historical_Exploration_Activity_-_polygons");
    }

    @Bean
    public KnownLayer knownTypeHist() {
        KnownLayer layer = new KnownLayer("hist", knownTypeHistSelector());
        layer.setId("hist");
        layer.setName("Historical Exploration Activity Polygons");
        layer.setGroup("WA Department of Mines and Petroleum");
        layer.setDescription("");
        layer.setOrder("Registered_33");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeRsSample">
        <ns0:constructor-arg name="id" value="rs-sample" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="test:rs_sample" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="rs-sample" />
        <ns0:property name="name" value="Rs Sample" />
        <ns0:property name="group" value="Geological Survey of New South Wales" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_34" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeRsSampleSelector() {
        return new WMSSelector("test:rs_sample");
    }

    @Bean
    public KnownLayer knownTypeRsSample() {
        KnownLayer layer = new KnownLayer("rs-sample", knownTypeRsSampleSelector());
        layer.setId("rs-sample");
        layer.setName("Rs Sample");
        layer.setGroup("Geological Survey of New South Wales");
        layer.setDescription("");
        layer.setOrder("Registered_34");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeBorehole">
        <ns0:constructor-arg name="id" value="borehole" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WFSSelector">
                <ns0:constructor-arg name="featureTypeName" value="gsmlbh:Borehole" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="borehole" />
        <ns0:property name="name" value="Borehole" />
        <ns0:property name="group" value="CSIRO" />
        <ns0:property name="description" value="Boreholes submitted to CSIRO by industry and government organisations for analys" />
        <ns0:property name="order" value="Registered_35" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeBoreholeSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeBorehole() {
        KnownLayer layer = new KnownLayer("borehole", knownTypeBoreholeSelector());
        layer.setId("borehole");
        layer.setName("Borehole");
        layer.setGroup("CSIRO");
        layer.setDescription("Boreholes submitted to CSIRO by industry and government organisations for analys");
        layer.setOrder("Registered_35");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeHighpSiteIronlayer">
        <ns0:constructor-arg name="id" value="highp-site-ironlayer" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="HighP-Site-IronLayer" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="highp-site-ironlayer" />
        <ns0:property name="name" value="Highp Site Ironlayer" />
        <ns0:property name="group" value="CSIRO" />
        <ns0:property name="description" value="Layer-Group type layer: HighP-Site-IronLayer" />
        <ns0:property name="order" value="Registered_36" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeHighpSiteIronlayerSelector() {
        return new WMSSelector("HighP-Site-IronLayer");
    }

    @Bean
    public KnownLayer knownTypeHighpSiteIronlayer() {
        KnownLayer layer = new KnownLayer("highp-site-ironlayer", knownTypeHighpSiteIronlayerSelector());
        layer.setId("highp-site-ironlayer");
        layer.setName("Highp Site Ironlayer");
        layer.setGroup("CSIRO");
        layer.setDescription("Layer-Group type layer: HighP-Site-IronLayer");
        layer.setOrder("Registered_36");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeHighpfeaturetype">
        <ns0:constructor-arg name="id" value="highpfeaturetype" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="highp:HighPFeatureType" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="highpfeaturetype" />
        <ns0:property name="name" value="Highpfeaturetype" />
        <ns0:property name="group" value="CSIRO" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_37" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeHighpfeaturetypeSelector() {
        return new WMSSelector("highp:HighPFeatureType");
    }

    @Bean
    public KnownLayer knownTypeHighpfeaturetype() {
        KnownLayer layer = new KnownLayer("highpfeaturetype", knownTypeHighpfeaturetypeSelector());
        layer.setId("highpfeaturetype");
        layer.setName("Highpfeaturetype");
        layer.setGroup("CSIRO");
        layer.setDescription("");
        layer.setOrder("Registered_37");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeHighpSiteFeatureType">
        <ns0:constructor-arg name="id" value="highp-site-feature-type" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="highp:HighPSiteFeatureType" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="highp-site-feature-type" />
        <ns0:property name="name" value="Highp Site Feature Type" />
        <ns0:property name="group" value="CSIRO" />
        <ns0:property name="description" value="Generated from highp" />
        <ns0:property name="order" value="Registered_38" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeHighpSiteFeatureTypeSelector() {
        return new WMSSelector("highp:HighPSiteFeatureType");
    }

    @Bean
    public KnownLayer knownTypeHighpSiteFeatureType() {
        KnownLayer layer = new KnownLayer("highp-site-feature-type", knownTypeHighpSiteFeatureTypeSelector());
        layer.setId("highp-site-feature-type");
        layer.setName("Highp Site Feature Type");
        layer.setGroup("CSIRO");
        layer.setDescription("Generated from highp");
        layer.setOrder("Registered_38");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeHighpSitePhoslayer">
        <ns0:constructor-arg name="id" value="highp-site-phoslayer" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="HighP-Site-PhosLayer" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="highp-site-phoslayer" />
        <ns0:property name="name" value="Highp Site Phoslayer" />
        <ns0:property name="group" value="CSIRO" />
        <ns0:property name="description" value="Layer-Group type layer: HighP-Site-PhosLayer" />
        <ns0:property name="order" value="Registered_39" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeHighpSitePhoslayerSelector() {
        return new WMSSelector("HighP-Site-PhosLayer");
    }

    @Bean
    public KnownLayer knownTypeHighpSitePhoslayer() {
        KnownLayer layer = new KnownLayer("highp-site-phoslayer", knownTypeHighpSitePhoslayerSelector());
        layer.setId("highp-site-phoslayer");
        layer.setName("Highp Site Phoslayer");
        layer.setGroup("CSIRO");
        layer.setDescription("Layer-Group type layer: HighP-Site-PhosLayer");
        layer.setOrder("Registered_39");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeLateriteWesternYilgarnGeochem">
        <ns0:constructor-arg name="id" value="laterite-western-yilgarn-geochem" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="Geochem:LateriteYilgarnGeoChem" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="laterite-western-yilgarn-geochem" />
        <ns0:property name="name" value="Laterite Western Yilgarn Geochem" />
        <ns0:property name="group" value="CSIRO" />
        <ns0:property name="description" value="This Record is the ?nal release of a 53-element dataset for approximately 3150 l" />
        <ns0:property name="order" value="Registered_40" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeLateriteWesternYilgarnGeochemSelector() {
        return new WMSSelector("Geochem:LateriteYilgarnGeoChem");
    }

    @Bean
    public KnownLayer knownTypeLateriteWesternYilgarnGeochem() {
        KnownLayer layer = new KnownLayer("laterite-western-yilgarn-geochem", knownTypeLateriteWesternYilgarnGeochemSelector());
        layer.setId("laterite-western-yilgarn-geochem");
        layer.setName("Laterite Western Yilgarn Geochem");
        layer.setGroup("CSIRO");
        layer.setDescription("This Record is the ?nal release of a 53-element dataset for approximately 3150 l");
        layer.setOrder("Registered_40");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeHighpRePhoslayer">
        <ns0:constructor-arg name="id" value="highp-re-phoslayer" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="HighP-RE-PhosLayer" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="highp-re-phoslayer" />
        <ns0:property name="name" value="Highp Re Phoslayer" />
        <ns0:property name="group" value="CSIRO" />
        <ns0:property name="description" value="Layer-Group type layer: HighP-RE-PhosLayer" />
        <ns0:property name="order" value="Registered_41" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeHighpRePhoslayerSelector() {
        return new WMSSelector("HighP-RE-PhosLayer");
    }

    @Bean
    public KnownLayer knownTypeHighpRePhoslayer() {
        KnownLayer layer = new KnownLayer("highp-re-phoslayer", knownTypeHighpRePhoslayerSelector());
        layer.setId("highp-re-phoslayer");
        layer.setName("Highp Re Phoslayer");
        layer.setGroup("CSIRO");
        layer.setDescription("Layer-Group type layer: HighP-RE-PhosLayer");
        layer.setOrder("Registered_41");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeHighpReIronlayer">
        <ns0:constructor-arg name="id" value="highp-re-ironlayer" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="HighP-RE-IronLayer" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="highp-re-ironlayer" />
        <ns0:property name="name" value="Highp Re Ironlayer" />
        <ns0:property name="group" value="CSIRO" />
        <ns0:property name="description" value="Layer-Group type layer: HighP-RE-IronLayer" />
        <ns0:property name="order" value="Registered_42" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeHighpReIronlayerSelector() {
        return new WMSSelector("HighP-RE-IronLayer");
    }

    @Bean
    public KnownLayer knownTypeHighpReIronlayer() {
        KnownLayer layer = new KnownLayer("highp-re-ironlayer", knownTypeHighpReIronlayerSelector());
        layer.setId("highp-re-ironlayer");
        layer.setName("Highp Re Ironlayer");
        layer.setGroup("CSIRO");
        layer.setDescription("Layer-Group type layer: HighP-RE-IronLayer");
        layer.setOrder("Registered_42");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeCate3ExplLicePolyOfTasmMinResoTasm">
        <ns0:constructor-arg name="id" value="cate-3-expl-lice-poly-of-tasm-min-reso-tasm" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="mrtwfs:LicenceCategory3" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="cate-3-expl-lice-poly-of-tasm-min-reso-tasm" />
        <ns0:property name="name" value="Category 3 Exploration Licence Polygons Of Tasmania Mineral Resources Tasmania " />
        <ns0:property name="group" value="Mineral Resources Tasmania" />
        <ns0:property name="description" value="Category 3 Exploration Licence polygons and Exploration Release Areas across Tas" />
        <ns0:property name="order" value="Registered_43" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeCate3ExplLicePolyOfTasmMinResoTasmSelector() {
        return new WMSSelector("mrtwfs:LicenceCategory3");
    }

    @Bean
    public KnownLayer knownTypeCate3ExplLicePolyOfTasmMinResoTasm() {
        KnownLayer layer = new KnownLayer("cate-3-expl-lice-poly-of-tasm-min-reso-tasm", knownTypeCate3ExplLicePolyOfTasmMinResoTasmSelector());
        layer.setId("cate-3-expl-lice-poly-of-tasm-min-reso-tasm");
        layer.setName("Category 3 Exploration Licence Polygons Of Tasmania Mineral Resources Tasmania ");
        layer.setGroup("Mineral Resources Tasmania");
        layer.setDescription("Category 3 Exploration Licence polygons and Exploration Release Areas across Tas");
        layer.setOrder("Registered_43");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeCate1ExplLicePolyOfTasmMinResoTasm">
        <ns0:constructor-arg name="id" value="cate-1-expl-lice-poly-of-tasm-min-reso-tasm" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="mrtwfs:LicenceCategory1" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="cate-1-expl-lice-poly-of-tasm-min-reso-tasm" />
        <ns0:property name="name" value="Category 1 Exploration Licence Polygons Of Tasmania Mineral Resources Tasmania " />
        <ns0:property name="group" value="Mineral Resources Tasmania" />
        <ns0:property name="description" value="Category 1 Exploration Licence polygons and Exploration Release Areas across Tas" />
        <ns0:property name="order" value="Registered_44" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeCate1ExplLicePolyOfTasmMinResoTasmSelector() {
        return new WMSSelector("mrtwfs:LicenceCategory1");
    }

    @Bean
    public KnownLayer knownTypeCate1ExplLicePolyOfTasmMinResoTasm() {
        KnownLayer layer = new KnownLayer("cate-1-expl-lice-poly-of-tasm-min-reso-tasm", knownTypeCate1ExplLicePolyOfTasmMinResoTasmSelector());
        layer.setId("cate-1-expl-lice-poly-of-tasm-min-reso-tasm");
        layer.setName("Category 1 Exploration Licence Polygons Of Tasmania Mineral Resources Tasmania ");
        layer.setGroup("Mineral Resources Tasmania");
        layer.setDescription("Category 1 Exploration Licence polygons and Exploration Release Areas across Tas");
        layer.setOrder("Registered_44");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeProcLandAreaOfTasmMinResoTasm">
        <ns0:constructor-arg name="id" value="proc-land-area-of-tasm-min-reso-tasm" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="mrtwfs:ProclaimedAreasPoly" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="proc-land-area-of-tasm-min-reso-tasm" />
        <ns0:property name="name" value="Proclaimed Landslip Areas Of Tasmania Mineral Resources Tasmania " />
        <ns0:property name="group" value="Mineral Resources Tasmania" />
        <ns0:property name="description" value="Proclaimed Landslip Areas (A and B) of Tasmania, which are defined under the Min" />
        <ns0:property name="order" value="Registered_45" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeProcLandAreaOfTasmMinResoTasmSelector() {
        return new WMSSelector("mrtwfs:ProclaimedAreasPoly");
    }

    @Bean
    public KnownLayer knownTypeProcLandAreaOfTasmMinResoTasm() {
        KnownLayer layer = new KnownLayer("proc-land-area-of-tasm-min-reso-tasm", knownTypeProcLandAreaOfTasmMinResoTasmSelector());
        layer.setId("proc-land-area-of-tasm-min-reso-tasm");
        layer.setName("Proclaimed Landslip Areas Of Tasmania Mineral Resources Tasmania ");
        layer.setGroup("Mineral Resources Tasmania");
        layer.setDescription("Proclaimed Landslip Areas (A and B) of Tasmania, which are defined under the Min");
        layer.setOrder("Registered_45");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeAirbGeopSurvOfTasmMinResoTasm">
        <ns0:constructor-arg name="id" value="airb-geop-surv-of-tasm-min-reso-tasm" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="mrtwfs:AirborneSurveys" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="airb-geop-surv-of-tasm-min-reso-tasm" />
        <ns0:property name="name" value="Airborne Geophysical Surveys Of Tasmania Mineral Resources Tasmania " />
        <ns0:property name="group" value="Mineral Resources Tasmania" />
        <ns0:property name="description" value="Spatial index of open file airborne geophysical surveys for which digital data i" />
        <ns0:property name="order" value="Registered_46" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeAirbGeopSurvOfTasmMinResoTasmSelector() {
        return new WMSSelector("mrtwfs:AirborneSurveys");
    }

    @Bean
    public KnownLayer knownTypeAirbGeopSurvOfTasmMinResoTasm() {
        KnownLayer layer = new KnownLayer("airb-geop-surv-of-tasm-min-reso-tasm", knownTypeAirbGeopSurvOfTasmMinResoTasmSelector());
        layer.setId("airb-geop-surv-of-tasm-min-reso-tasm");
        layer.setName("Airborne Geophysical Surveys Of Tasmania Mineral Resources Tasmania ");
        layer.setGroup("Mineral Resources Tasmania");
        layer.setDescription("Spatial index of open file airborne geophysical surveys for which digital data i");
        layer.setOrder("Registered_46");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeLandPoinOfTasmMinResoTasm">
        <ns0:constructor-arg name="id" value="land-poin-of-tasm-min-reso-tasm" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="mrtwfs:LandSlidePoint" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="land-poin-of-tasm-min-reso-tasm" />
        <ns0:property name="name" value="Landslide Points Of Tasmania Mineral Resources Tasmania " />
        <ns0:property name="group" value="Mineral Resources Tasmania" />
        <ns0:property name="description" value="Landslide features across Tasmania as representative points, with summary landsl" />
        <ns0:property name="order" value="Registered_47" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeLandPoinOfTasmMinResoTasmSelector() {
        return new WMSSelector("mrtwfs:LandSlidePoint");
    }

    @Bean
    public KnownLayer knownTypeLandPoinOfTasmMinResoTasm() {
        KnownLayer layer = new KnownLayer("land-poin-of-tasm-min-reso-tasm", knownTypeLandPoinOfTasmMinResoTasmSelector());
        layer.setId("land-poin-of-tasm-min-reso-tasm");
        layer.setName("Landslide Points Of Tasmania Mineral Resources Tasmania ");
        layer.setGroup("Mineral Resources Tasmania");
        layer.setDescription("Landslide features across Tasmania as representative points, with summary landsl");
        layer.setOrder("Registered_47");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeMineOccuPoinOfTasmMinResoTasm">
        <ns0:constructor-arg name="id" value="mine-occu-poin-of-tasm-min-reso-tasm" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="mrtwfs:MineralOccurences" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="mine-occu-poin-of-tasm-min-reso-tasm" />
        <ns0:property name="name" value="Mineral Occurrence Points Of Tasmania Mineral Resources Tasmania " />
        <ns0:property name="group" value="Mineral Resources Tasmania" />
        <ns0:property name="description" value="Mineral occurrences, including operating and abandoned mines, located in Tasmani" />
        <ns0:property name="order" value="Registered_48" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeMineOccuPoinOfTasmMinResoTasmSelector() {
        return new WMSSelector("mrtwfs:MineralOccurences");
    }

    @Bean
    public KnownLayer knownTypeMineOccuPoinOfTasmMinResoTasm() {
        KnownLayer layer = new KnownLayer("mine-occu-poin-of-tasm-min-reso-tasm", knownTypeMineOccuPoinOfTasmMinResoTasmSelector());
        layer.setId("mine-occu-poin-of-tasm-min-reso-tasm");
        layer.setName("Mineral Occurrence Points Of Tasmania Mineral Resources Tasmania ");
        layer.setGroup("Mineral Resources Tasmania");
        layer.setDescription("Mineral occurrences, including operating and abandoned mines, located in Tasmani");
        layer.setOrder("Registered_48");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeLandLineOfTasmMinResoTasm">
        <ns0:constructor-arg name="id" value="land-line-of-tasm-min-reso-tasm" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="mrtwfs:LandSlideLine" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="land-line-of-tasm-min-reso-tasm" />
        <ns0:property name="name" value="Landslide Lines Of Tasmania Mineral Resources Tasmania " />
        <ns0:property name="group" value="Mineral Resources Tasmania" />
        <ns0:property name="description" value="Linear landslide components of landslide features mapped across Tasmania, with s" />
        <ns0:property name="order" value="Registered_49" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeLandLineOfTasmMinResoTasmSelector() {
        return new WMSSelector("mrtwfs:LandSlideLine");
    }

    @Bean
    public KnownLayer knownTypeLandLineOfTasmMinResoTasm() {
        KnownLayer layer = new KnownLayer("land-line-of-tasm-min-reso-tasm", knownTypeLandLineOfTasmMinResoTasmSelector());
        layer.setId("land-line-of-tasm-min-reso-tasm");
        layer.setName("Landslide Lines Of Tasmania Mineral Resources Tasmania ");
        layer.setGroup("Mineral Resources Tasmania");
        layer.setDescription("Linear landslide components of landslide features mapped across Tasmania, with s");
        layer.setOrder("Registered_49");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeLandDamaPolyOfTasmMinResoTasm">
        <ns0:constructor-arg name="id" value="land-dama-poly-of-tasm-min-reso-tasm" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="mrtwfs:DamagePoly" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="land-dama-poly-of-tasm-min-reso-tasm" />
        <ns0:property name="name" value="Landslide Damage Polygons Of Tasmania Mineral Resources Tasmania " />
        <ns0:property name="group" value="Mineral Resources Tasmania" />
        <ns0:property name="description" value="Polygons of structures or property known to be damaged by a landslide in Tasmani" />
        <ns0:property name="order" value="Registered_50" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeLandDamaPolyOfTasmMinResoTasmSelector() {
        return new WMSSelector("mrtwfs:DamagePoly");
    }

    @Bean
    public KnownLayer knownTypeLandDamaPolyOfTasmMinResoTasm() {
        KnownLayer layer = new KnownLayer("land-dama-poly-of-tasm-min-reso-tasm", knownTypeLandDamaPolyOfTasmMinResoTasmSelector());
        layer.setId("land-dama-poly-of-tasm-min-reso-tasm");
        layer.setName("Landslide Damage Polygons Of Tasmania Mineral Resources Tasmania ");
        layer.setGroup("Mineral Resources Tasmania");
        layer.setDescription("Polygons of structures or property known to be damaged by a landslide in Tasmani");
        layer.setOrder("Registered_50");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeCate4ExplLicePolyOfTasmMinResoTasm">
        <ns0:constructor-arg name="id" value="cate-4-expl-lice-poly-of-tasm-min-reso-tasm" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="mrtwfs:LicenceCategory4" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="cate-4-expl-lice-poly-of-tasm-min-reso-tasm" />
        <ns0:property name="name" value="Category 4 Exploration Licence Polygons Of Tasmania Mineral Resources Tasmania " />
        <ns0:property name="group" value="Mineral Resources Tasmania" />
        <ns0:property name="description" value="Category 4 Exploration Licence polygons and Exploration Release Areas across Tas" />
        <ns0:property name="order" value="Registered_51" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeCate4ExplLicePolyOfTasmMinResoTasmSelector() {
        return new WMSSelector("mrtwfs:LicenceCategory4");
    }

    @Bean
    public KnownLayer knownTypeCate4ExplLicePolyOfTasmMinResoTasm() {
        KnownLayer layer = new KnownLayer("cate-4-expl-lice-poly-of-tasm-min-reso-tasm", knownTypeCate4ExplLicePolyOfTasmMinResoTasmSelector());
        layer.setId("cate-4-expl-lice-poly-of-tasm-min-reso-tasm");
        layer.setName("Category 4 Exploration Licence Polygons Of Tasmania Mineral Resources Tasmania ");
        layer.setGroup("Mineral Resources Tasmania");
        layer.setDescription("Category 4 Exploration Licence polygons and Exploration Release Areas across Tas");
        layer.setOrder("Registered_51");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeCate6ExplLicePolyOfTasmMinResoTasm">
        <ns0:constructor-arg name="id" value="cate-6-expl-lice-poly-of-tasm-min-reso-tasm" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="mrtwfs:LicenceCategory6" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="cate-6-expl-lice-poly-of-tasm-min-reso-tasm" />
        <ns0:property name="name" value="Category 6 Exploration Licence Polygons Of Tasmania Mineral Resources Tasmania " />
        <ns0:property name="group" value="Mineral Resources Tasmania" />
        <ns0:property name="description" value="Category 6 Exploration Licence polygons and Exploration Release Areas across Tas" />
        <ns0:property name="order" value="Registered_52" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeCate6ExplLicePolyOfTasmMinResoTasmSelector() {
        return new WMSSelector("mrtwfs:LicenceCategory6");
    }

    @Bean
    public KnownLayer knownTypeCate6ExplLicePolyOfTasmMinResoTasm() {
        KnownLayer layer = new KnownLayer("cate-6-expl-lice-poly-of-tasm-min-reso-tasm", knownTypeCate6ExplLicePolyOfTasmMinResoTasmSelector());
        layer.setId("cate-6-expl-lice-poly-of-tasm-min-reso-tasm");
        layer.setName("Category 6 Exploration Licence Polygons Of Tasmania Mineral Resources Tasmania ");
        layer.setGroup("Mineral Resources Tasmania");
        layer.setDescription("Category 6 Exploration Licence polygons and Exploration Release Areas across Tas");
        layer.setOrder("Registered_52");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeMiniLeasPolyOfTasmMinResoTasm">
        <ns0:constructor-arg name="id" value="mini-leas-poly-of-tasm-min-reso-tasm" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="mrtwfs:Leases" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="mini-leas-poly-of-tasm-min-reso-tasm" />
        <ns0:property name="name" value="Mining Lease Polygons Of Tasmania Mineral Resources Tasmania " />
        <ns0:property name="group" value="Mineral Resources Tasmania" />
        <ns0:property name="description" value="Mining Lease polygons and production licence polygons for all mineral categories" />
        <ns0:property name="order" value="Registered_53" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeMiniLeasPolyOfTasmMinResoTasmSelector() {
        return new WMSSelector("mrtwfs:Leases");
    }

    @Bean
    public KnownLayer knownTypeMiniLeasPolyOfTasmMinResoTasm() {
        KnownLayer layer = new KnownLayer("mini-leas-poly-of-tasm-min-reso-tasm", knownTypeMiniLeasPolyOfTasmMinResoTasmSelector());
        layer.setId("mini-leas-poly-of-tasm-min-reso-tasm");
        layer.setName("Mining Lease Polygons Of Tasmania Mineral Resources Tasmania ");
        layer.setGroup("Mineral Resources Tasmania");
        layer.setDescription("Mining Lease polygons and production licence polygons for all mineral categories");
        layer.setOrder("Registered_53");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeCate2ExplLicePolyOfTasmMinResoTasm">
        <ns0:constructor-arg name="id" value="cate-2-expl-lice-poly-of-tasm-min-reso-tasm" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="mrtwfs:LicenceCategory2" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="cate-2-expl-lice-poly-of-tasm-min-reso-tasm" />
        <ns0:property name="name" value="Category 2 Exploration Licence Polygons Of Tasmania Mineral Resources Tasmania " />
        <ns0:property name="group" value="Mineral Resources Tasmania" />
        <ns0:property name="description" value="Category 2 Exploration Licence polygons and Exploration Release Areas across Tas" />
        <ns0:property name="order" value="Registered_54" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeCate2ExplLicePolyOfTasmMinResoTasmSelector() {
        return new WMSSelector("mrtwfs:LicenceCategory2");
    }

    @Bean
    public KnownLayer knownTypeCate2ExplLicePolyOfTasmMinResoTasm() {
        KnownLayer layer = new KnownLayer("cate-2-expl-lice-poly-of-tasm-min-reso-tasm", knownTypeCate2ExplLicePolyOfTasmMinResoTasmSelector());
        layer.setId("cate-2-expl-lice-poly-of-tasm-min-reso-tasm");
        layer.setName("Category 2 Exploration Licence Polygons Of Tasmania Mineral Resources Tasmania ");
        layer.setGroup("Mineral Resources Tasmania");
        layer.setDescription("Category 2 Exploration Licence polygons and Exploration Release Areas across Tas");
        layer.setOrder("Registered_54");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGravMeasOfTasmMinResoTasm">
        <ns0:constructor-arg name="id" value="grav-meas-of-tasm-min-reso-tasm" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="mrtwfs:GravityMeasurements" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="grav-meas-of-tasm-min-reso-tasm" />
        <ns0:property name="name" value="Gravity Measurements Of Tasmania Mineral Resources Tasmania " />
        <ns0:property name="group" value="Mineral Resources Tasmania" />
        <ns0:property name="description" value="Primary and derived (i.e. Bouguer anomaly) gravity observation points (stations)" />
        <ns0:property name="order" value="Registered_55" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeGravMeasOfTasmMinResoTasmSelector() {
        return new WMSSelector("mrtwfs:GravityMeasurements");
    }

    @Bean
    public KnownLayer knownTypeGravMeasOfTasmMinResoTasm() {
        KnownLayer layer = new KnownLayer("grav-meas-of-tasm-min-reso-tasm", knownTypeGravMeasOfTasmMinResoTasmSelector());
        layer.setId("grav-meas-of-tasm-min-reso-tasm");
        layer.setName("Gravity Measurements Of Tasmania Mineral Resources Tasmania ");
        layer.setGroup("Mineral Resources Tasmania");
        layer.setDescription("Primary and derived (i.e. Bouguer anomaly) gravity observation points (stations)");
        layer.setOrder("Registered_55");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeCate5ExplLicePolyOfTasmMinResoTasm">
        <ns0:constructor-arg name="id" value="cate-5-expl-lice-poly-of-tasm-min-reso-tasm" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="mrtwfs:LicenceCategory5" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="cate-5-expl-lice-poly-of-tasm-min-reso-tasm" />
        <ns0:property name="name" value="Category 5 Exploration Licence Polygons Of Tasmania Mineral Resources Tasmania" />
        <ns0:property name="group" value="Mineral Resources Tasmania" />
        <ns0:property name="description" value="Category 5 Exploration Licence polygons and Exploration Release Areas across Tas" />
        <ns0:property name="order" value="Registered_56" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeCate5ExplLicePolyOfTasmMinResoTasmSelector() {
        return new WMSSelector("mrtwfs:LicenceCategory5");
    }

    @Bean
    public KnownLayer knownTypeCate5ExplLicePolyOfTasmMinResoTasm() {
        KnownLayer layer = new KnownLayer("cate-5-expl-lice-poly-of-tasm-min-reso-tasm", knownTypeCate5ExplLicePolyOfTasmMinResoTasmSelector());
        layer.setId("cate-5-expl-lice-poly-of-tasm-min-reso-tasm");
        layer.setName("Category 5 Exploration Licence Polygons Of Tasmania Mineral Resources Tasmania");
        layer.setGroup("Mineral Resources Tasmania");
        layer.setDescription("Category 5 Exploration Licence polygons and Exploration Release Areas across Tas");
        layer.setOrder("Registered_56");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeLandDamaPoinOfTasmMinResoTasm">
        <ns0:constructor-arg name="id" value="land-dama-poin-of-tasm-min-reso-tasm" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="mrtwfs:DamagePoint" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="land-dama-poin-of-tasm-min-reso-tasm" />
        <ns0:property name="name" value="Landslide Damage Points Of Tasmania Mineral Resources Tasmania " />
        <ns0:property name="group" value="Mineral Resources Tasmania" />
        <ns0:property name="description" value="Point locations of known damage to structures or property caused by a landslide " />
        <ns0:property name="order" value="Registered_57" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeLandDamaPoinOfTasmMinResoTasmSelector() {
        return new WMSSelector("mrtwfs:DamagePoint");
    }

    @Bean
    public KnownLayer knownTypeLandDamaPoinOfTasmMinResoTasm() {
        KnownLayer layer = new KnownLayer("land-dama-poin-of-tasm-min-reso-tasm", knownTypeLandDamaPoinOfTasmMinResoTasmSelector());
        layer.setId("land-dama-poin-of-tasm-min-reso-tasm");
        layer.setName("Landslide Damage Points Of Tasmania Mineral Resources Tasmania ");
        layer.setGroup("Mineral Resources Tasmania");
        layer.setDescription("Point locations of known damage to structures or property caused by a landslide ");
        layer.setOrder("Registered_57");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGravBaseStatOfTasmMinResoTasm">
        <ns0:constructor-arg name="id" value="grav-base-stat-of-tasm-min-reso-tasm" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="mrtwfs:GravityBaseStations" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="grav-base-stat-of-tasm-min-reso-tasm" />
        <ns0:property name="name" value="Gravity Base Stations Of Tasmania Mineral Resources Tasmania " />
        <ns0:property name="group" value="Mineral Resources Tasmania" />
        <ns0:property name="description" value="Precise locations where the absolute value of gravity is known." />
        <ns0:property name="order" value="Registered_58" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeGravBaseStatOfTasmMinResoTasmSelector() {
        return new WMSSelector("mrtwfs:GravityBaseStations");
    }

    @Bean
    public KnownLayer knownTypeGravBaseStatOfTasmMinResoTasm() {
        KnownLayer layer = new KnownLayer("grav-base-stat-of-tasm-min-reso-tasm", knownTypeGravBaseStatOfTasmMinResoTasmSelector());
        layer.setId("grav-base-stat-of-tasm-min-reso-tasm");
        layer.setName("Gravity Base Stations Of Tasmania Mineral Resources Tasmania ");
        layer.setGroup("Mineral Resources Tasmania");
        layer.setDescription("Precise locations where the absolute value of gravity is known.");
        layer.setOrder("Registered_58");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeBorePoinOfTasmMinResoTasm">
        <ns0:constructor-arg name="id" value="bore-poin-of-tasm-min-reso-tasm" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="mrtwfs:Boreholes" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="bore-poin-of-tasm-min-reso-tasm" />
        <ns0:property name="name" value="Borehole Points Of Tasmania Mineral Resources Tasmania " />
        <ns0:property name="group" value="Mineral Resources Tasmania" />
        <ns0:property name="description" value="Borehole features across Tasmania derived from the Borehole Database, administer" />
        <ns0:property name="order" value="Registered_59" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeBorePoinOfTasmMinResoTasmSelector() {
        return new WMSSelector("mrtwfs:Boreholes");
    }

    @Bean
    public KnownLayer knownTypeBorePoinOfTasmMinResoTasm() {
        KnownLayer layer = new KnownLayer("bore-poin-of-tasm-min-reso-tasm", knownTypeBorePoinOfTasmMinResoTasmSelector());
        layer.setId("bore-poin-of-tasm-min-reso-tasm");
        layer.setName("Borehole Points Of Tasmania Mineral Resources Tasmania ");
        layer.setGroup("Mineral Resources Tasmania");
        layer.setDescription("Borehole features across Tasmania derived from the Borehole Database, administer");
        layer.setOrder("Registered_59");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeStrategicProspectivityZones">
        <ns0:constructor-arg name="id" value="strategic-prospectivity-zones" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="mrtwfs:StrategicProspectivityZones" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="strategic-prospectivity-zones" />
        <ns0:property name="name" value="Strategic Prospectivity Zones" />
        <ns0:property name="group" value="Mineral Resources Tasmania" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_60" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeStrategicProspectivityZonesSelector() {
        return new WMSSelector("mrtwfs:StrategicProspectivityZones");
    }

    @Bean
    public KnownLayer knownTypeStrategicProspectivityZones() {
        KnownLayer layer = new KnownLayer("strategic-prospectivity-zones", knownTypeStrategicProspectivityZonesSelector());
        layer.setId("strategic-prospectivity-zones");
        layer.setName("Strategic Prospectivity Zones");
        layer.setGroup("Mineral Resources Tasmania");
        layer.setDescription("");
        layer.setOrder("Registered_60");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeLandPolyOfTasmMinResoTasm">
        <ns0:constructor-arg name="id" value="land-poly-of-tasm-min-reso-tasm" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="mrtwfs:LandSlidePoly" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="land-poly-of-tasm-min-reso-tasm" />
        <ns0:property name="name" value="Landslide Polygons Of Tasmania Mineral Resources Tasmania " />
        <ns0:property name="group" value="Mineral Resources Tasmania" />
        <ns0:property name="description" value="Landslide component polygons of landslide features mapped across Tasmania, with " />
        <ns0:property name="order" value="Registered_61" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeLandPolyOfTasmMinResoTasmSelector() {
        return new WMSSelector("mrtwfs:LandSlidePoly");
    }

    @Bean
    public KnownLayer knownTypeLandPolyOfTasmMinResoTasm() {
        KnownLayer layer = new KnownLayer("land-poly-of-tasm-min-reso-tasm", knownTypeLandPolyOfTasmMinResoTasmSelector());
        layer.setId("land-poly-of-tasm-min-reso-tasm");
        layer.setName("Landslide Polygons Of Tasmania Mineral Resources Tasmania ");
        layer.setGroup("Mineral Resources Tasmania");
        layer.setDescription("Landslide component polygons of landslide features mapped across Tasmania, with ");
        layer.setOrder("Registered_61");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeBoreTracOfTasmMinResoTasm">
        <ns0:constructor-arg name="id" value="bore-trac-of-tasm-min-reso-tasm" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="mrtwfs:BoreholeTrace" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="bore-trac-of-tasm-min-reso-tasm" />
        <ns0:property name="name" value="Borehole Traces Of Tasmania Mineral Resources Tasmania " />
        <ns0:property name="group" value="Mineral Resources Tasmania" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_62" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeBoreTracOfTasmMinResoTasmSelector() {
        return new WMSSelector("mrtwfs:BoreholeTrace");
    }

    @Bean
    public KnownLayer knownTypeBoreTracOfTasmMinResoTasm() {
        KnownLayer layer = new KnownLayer("bore-trac-of-tasm-min-reso-tasm", knownTypeBoreTracOfTasmMinResoTasmSelector());
        layer.setId("bore-trac-of-tasm-min-reso-tasm");
        layer.setName("Borehole Traces Of Tasmania Mineral Resources Tasmania ");
        layer.setGroup("Mineral Resources Tasmania");
        layer.setDescription("");
        layer.setOrder("Registered_62");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeRadnlOperR25PcprrL3Knmi">
        <ns0:constructor-arg name="id" value="radnl-oper-r-25pcprr-l3-knmi" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="RADNL_OPER_R___25PCPRR_L3_KNMI" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="radnl-oper-r-25pcprr-l3-knmi" />
        <ns0:property name="name" value="Radnl Oper R 25Pcprr L3 Knmi" />
        <ns0:property name="group" value="Unknown" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_66" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeRadnlOperR25PcprrL3KnmiSelector() {
        return new WMSSelector("RADNL_OPER_R___25PCPRR_L3_KNMI");
    }

    @Bean
    public KnownLayer knownTypeRadnlOperR25PcprrL3Knmi() {
        KnownLayer layer = new KnownLayer("radnl-oper-r-25pcprr-l3-knmi", knownTypeRadnlOperR25PcprrL3KnmiSelector());
        layer.setId("radnl-oper-r-25pcprr-l3-knmi");
        layer.setName("Radnl Oper R 25Pcprr L3 Knmi");
        layer.setGroup("Unknown");
        layer.setDescription("");
        layer.setOrder("Registered_66");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeRadnlOperR25PcprrL3Color">
        <ns0:constructor-arg name="id" value="radnl-oper-r-25pcprr-l3-color" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="RADNL_OPER_R___25PCPRR_L3_COLOR" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="radnl-oper-r-25pcprr-l3-color" />
        <ns0:property name="name" value="Radnl Oper R 25Pcprr L3 Color" />
        <ns0:property name="group" value="Unknown" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_67" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeRadnlOperR25PcprrL3ColorSelector() {
        return new WMSSelector("RADNL_OPER_R___25PCPRR_L3_COLOR");
    }

    @Bean
    public KnownLayer knownTypeRadnlOperR25PcprrL3Color() {
        KnownLayer layer = new KnownLayer("radnl-oper-r-25pcprr-l3-color", knownTypeRadnlOperR25PcprrL3ColorSelector());
        layer.setId("radnl-oper-r-25pcprr-l3-color");
        layer.setName("Radnl Oper R 25Pcprr L3 Color");
        layer.setGroup("Unknown");
        layer.setDescription("");
        layer.setOrder("Registered_67");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswDrillhole">
        <ns0:constructor-arg name="id" value="nsw-drillhole" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:dw_drillhole" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-drillhole" />
        <ns0:property name="name" value="Nsw Drillhole" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="This is the full NSW drilling dataset available from Geoscientific Data Warehous" />
        <ns0:property name="order" value="Registered_68" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswDrillholeSelector() {
        return new WMSSelector("gsnsw:dw_drillhole");
    }

    @Bean
    public KnownLayer knownTypeNswDrillhole() {
        KnownLayer layer = new KnownLayer("nsw-drillhole", knownTypeNswDrillholeSelector());
        layer.setId("nsw-drillhole");
        layer.setName("Nsw Drillhole");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("This is the full NSW drilling dataset available from Geoscientific Data Warehous");
        layer.setOrder("Registered_68");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswAssaySurface">
        <ns0:constructor-arg name="id" value="nsw-assay-surface" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:dw_surfassay" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-assay-surface" />
        <ns0:property name="name" value="Nsw Assay Surface" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="This dataset contains geochemical assay data collected by companies exploring in" />
        <ns0:property name="order" value="Registered_69" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswAssaySurfaceSelector() {
        return new WMSSelector("gsnsw:dw_surfassay");
    }

    @Bean
    public KnownLayer knownTypeNswAssaySurface() {
        KnownLayer layer = new KnownLayer("nsw-assay-surface", knownTypeNswAssaySurfaceSelector());
        layer.setId("nsw-assay-surface");
        layer.setName("Nsw Assay Surface");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("This dataset contains geochemical assay data collected by companies exploring in");
        layer.setOrder("Registered_69");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswFieldObservations">
        <ns0:constructor-arg name="id" value="nsw-field-observations" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:dw_fieldobs_full" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-field-observations" />
        <ns0:property name="name" value="Nsw Field Observations" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_70" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswFieldObservationsSelector() {
        return new WMSSelector("gsnsw:dw_fieldobs_full");
    }

    @Bean
    public KnownLayer knownTypeNswFieldObservations() {
        KnownLayer layer = new KnownLayer("nsw-field-observations", knownTypeNswFieldObservationsSelector());
        layer.setId("nsw-field-observations");
        layer.setName("Nsw Field Observations");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("");
        layer.setOrder("Registered_70");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswDownholeAssaySamples">
        <ns0:constructor-arg name="id" value="nsw-downhole-assay-samples" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:dw_assayhole" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-downhole-assay-samples" />
        <ns0:property name="name" value="Nsw Downhole Assay Samples" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_71" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswDownholeAssaySamplesSelector() {
        return new WMSSelector("gsnsw:dw_assayhole");
    }

    @Bean
    public KnownLayer knownTypeNswDownholeAssaySamples() {
        KnownLayer layer = new KnownLayer("nsw-downhole-assay-samples", knownTypeNswDownholeAssaySamplesSelector());
        layer.setId("nsw-downhole-assay-samples");
        layer.setName("Nsw Downhole Assay Samples");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("");
        layer.setOrder("Registered_71");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswDrillholeAll">
        <ns0:constructor-arg name="id" value="nsw-drillhole-all" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:dw_drillhole_full" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-drillhole-all" />
        <ns0:property name="name" value="Nsw Drillhole All" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_72" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswDrillholeAllSelector() {
        return new WMSSelector("gsnsw:dw_drillhole_full");
    }

    @Bean
    public KnownLayer knownTypeNswDrillholeAll() {
        KnownLayer layer = new KnownLayer("nsw-drillhole-all", knownTypeNswDrillholeAllSelector());
        layer.setId("nsw-drillhole-all");
        layer.setName("Nsw Drillhole All");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("");
        layer.setOrder("Registered_72");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswDrillholesCoal">
        <ns0:constructor-arg name="id" value="nsw-drillholes-coal" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:dw_drillhole_full_coal" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-drillholes-coal" />
        <ns0:property name="name" value="Nsw Drillholes Coal" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="This is the coal subset of the NSW drilling dataset available from Geoscientific" />
        <ns0:property name="order" value="Registered_73" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswDrillholesCoalSelector() {
        return new WMSSelector("gsnsw:dw_drillhole_full_coal");
    }

    @Bean
    public KnownLayer knownTypeNswDrillholesCoal() {
        KnownLayer layer = new KnownLayer("nsw-drillholes-coal", knownTypeNswDrillholesCoalSelector());
        layer.setId("nsw-drillholes-coal");
        layer.setName("Nsw Drillholes Coal");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("This is the coal subset of the NSW drilling dataset available from Geoscientific");
        layer.setOrder("Registered_73");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswGeologicalFieldObservations">
        <ns0:constructor-arg name="id" value="nsw-geological-field-observations" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:dw_fieldobs" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-geological-field-observations" />
        <ns0:property name="name" value="Nsw Geological Field Observations" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="The Field Observations (FieldObs) database stores observations and measurements " />
        <ns0:property name="order" value="Registered_74" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswGeologicalFieldObservationsSelector() {
        return new WMSSelector("gsnsw:dw_fieldobs");
    }

    @Bean
    public KnownLayer knownTypeNswGeologicalFieldObservations() {
        KnownLayer layer = new KnownLayer("nsw-geological-field-observations", knownTypeNswGeologicalFieldObservationsSelector());
        layer.setId("nsw-geological-field-observations");
        layer.setName("Nsw Geological Field Observations");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("The Field Observations (FieldObs) database stores observations and measurements ");
        layer.setOrder("Registered_74");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswDrillholesMinerals">
        <ns0:constructor-arg name="id" value="nsw-drillholes-minerals" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:dw_drillhole_full_min" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-drillholes-minerals" />
        <ns0:property name="name" value="Nsw Drillholes Minerals" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="This is the mineral subset of the NSW drilling dataset available from Geoscienti" />
        <ns0:property name="order" value="Registered_75" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswDrillholesMineralsSelector() {
        return new WMSSelector("gsnsw:dw_drillhole_full_min");
    }

    @Bean
    public KnownLayer knownTypeNswDrillholesMinerals() {
        KnownLayer layer = new KnownLayer("nsw-drillholes-minerals", knownTypeNswDrillholesMineralsSelector());
        layer.setId("nsw-drillholes-minerals");
        layer.setName("Nsw Drillholes Minerals");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("This is the mineral subset of the NSW drilling dataset available from Geoscienti");
        layer.setOrder("Registered_75");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswGeologySimplified">
        <ns0:constructor-arg name="id" value="nsw-geology-simplified" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:ge_geology15m" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-geology-simplified" />
        <ns0:property name="name" value="Nsw Geology Simplified" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_76" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswGeologySimplifiedSelector() {
        return new WMSSelector("gsnsw:ge_geology15m");
    }

    @Bean
    public KnownLayer knownTypeNswGeologySimplified() {
        KnownLayer layer = new KnownLayer("nsw-geology-simplified", knownTypeNswGeologySimplifiedSelector());
        layer.setId("nsw-geology-simplified");
        layer.setName("Nsw Geology Simplified");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("");
        layer.setOrder("Registered_76");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswDrillholesPetroleum">
        <ns0:constructor-arg name="id" value="nsw-drillholes-petroleum" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:dw_drillhole_full_pet" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-drillholes-petroleum" />
        <ns0:property name="name" value="Nsw Drillholes Petroleum" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="The petroleum drillholes dataset stores information about conventional petroleum" />
        <ns0:property name="order" value="Registered_77" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswDrillholesPetroleumSelector() {
        return new WMSSelector("gsnsw:dw_drillhole_full_pet");
    }

    @Bean
    public KnownLayer knownTypeNswDrillholesPetroleum() {
        KnownLayer layer = new KnownLayer("nsw-drillholes-petroleum", knownTypeNswDrillholesPetroleumSelector());
        layer.setId("nsw-drillholes-petroleum");
        layer.setName("Nsw Drillholes Petroleum");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("The petroleum drillholes dataset stores information about conventional petroleum");
        layer.setOrder("Registered_77");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeMineralOccurenceIndustryFull">
        <ns0:constructor-arg name="id" value="mineral-occurence-industry-full" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:dw_mineraloccurrence_full" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="mineral-occurence-industry-full" />
        <ns0:property name="name" value="Mineral Occurence Industry Full" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_78" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeMineralOccurenceIndustryFullSelector() {
        return new WMSSelector("gsnsw:dw_mineraloccurrence_full");
    }

    @Bean
    public KnownLayer knownTypeMineralOccurenceIndustryFull() {
        KnownLayer layer = new KnownLayer("mineral-occurence-industry-full", knownTypeMineralOccurenceIndustryFullSelector());
        layer.setId("mineral-occurence-industry-full");
        layer.setName("Mineral Occurence Industry Full");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("");
        layer.setOrder("Registered_78");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswHistoricExplorationTitles">
        <ns0:constructor-arg name="id" value="nsw-historic-exploration-titles" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:bl_histels" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-historic-exploration-titles" />
        <ns0:property name="name" value="Nsw Historic Exploration Titles" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_79" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswHistoricExplorationTitlesSelector() {
        return new WMSSelector("gsnsw:bl_histels");
    }

    @Bean
    public KnownLayer knownTypeNswHistoricExplorationTitles() {
        KnownLayer layer = new KnownLayer("nsw-historic-exploration-titles", knownTypeNswHistoricExplorationTitlesSelector());
        layer.setId("nsw-historic-exploration-titles");
        layer.setName("Nsw Historic Exploration Titles");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("");
        layer.setOrder("Registered_79");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswMapBlockGraticule">
        <ns0:constructor-arg name="id" value="nsw-map-block-graticule" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:bl_mapblock" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-map-block-graticule" />
        <ns0:property name="name" value="Nsw Map Block Graticule" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_80" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswMapBlockGraticuleSelector() {
        return new WMSSelector("gsnsw:bl_mapblock");
    }

    @Bean
    public KnownLayer knownTypeNswMapBlockGraticule() {
        KnownLayer layer = new KnownLayer("nsw-map-block-graticule", knownTypeNswMapBlockGraticuleSelector());
        layer.setId("nsw-map-block-graticule");
        layer.setName("Nsw Map Block Graticule");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("");
        layer.setOrder("Registered_80");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeBlLocalaboriginallandcouncil">
        <ns0:constructor-arg name="id" value="bl-localaboriginallandcouncil" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:bl_localaboriginallandcouncil" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="bl-localaboriginallandcouncil" />
        <ns0:property name="name" value="Bl Localaboriginallandcouncil" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_81" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeBlLocalaboriginallandcouncilSelector() {
        return new WMSSelector("gsnsw:bl_localaboriginallandcouncil");
    }

    @Bean
    public KnownLayer knownTypeBlLocalaboriginallandcouncil() {
        KnownLayer layer = new KnownLayer("bl-localaboriginallandcouncil", knownTypeBlLocalaboriginallandcouncilSelector());
        layer.setId("bl-localaboriginallandcouncil");
        layer.setName("Bl Localaboriginallandcouncil");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("");
        layer.setOrder("Registered_81");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswMineralOccurrenceIndustry">
        <ns0:constructor-arg name="id" value="nsw-mineral-occurrence-industry" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:dw_metindustry" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-mineral-occurrence-industry" />
        <ns0:property name="name" value="Nsw Mineral Occurrence Industry" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_82" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswMineralOccurrenceIndustrySelector() {
        return new WMSSelector("gsnsw:dw_metindustry");
    }

    @Bean
    public KnownLayer knownTypeNswMineralOccurrenceIndustry() {
        KnownLayer layer = new KnownLayer("nsw-mineral-occurrence-industry", knownTypeNswMineralOccurrenceIndustrySelector());
        layer.setId("nsw-mineral-occurrence-industry");
        layer.setName("Nsw Mineral Occurrence Industry");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("");
        layer.setOrder("Registered_82");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNsw100KMapSheetExtents">
        <ns0:constructor-arg name="id" value="nsw-100k-map-sheet-extents" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:bl_mapsheet100k" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-100k-map-sheet-extents" />
        <ns0:property name="name" value="Nsw 100K Map Sheet Extents" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_83" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNsw100KMapSheetExtentsSelector() {
        return new WMSSelector("gsnsw:bl_mapsheet100k");
    }

    @Bean
    public KnownLayer knownTypeNsw100KMapSheetExtents() {
        KnownLayer layer = new KnownLayer("nsw-100k-map-sheet-extents", knownTypeNsw100KMapSheetExtentsSelector());
        layer.setId("nsw-100k-map-sheet-extents");
        layer.setName("Nsw 100K Map Sheet Extents");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("");
        layer.setOrder("Registered_83");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswFossickingDistricts">
        <ns0:constructor-arg name="id" value="nsw-fossicking-districts" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:bl_fossicking" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-fossicking-districts" />
        <ns0:property name="name" value="Nsw Fossicking Districts" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="Fossicking is the small scale search for and collection of minerals, gemstones o" />
        <ns0:property name="order" value="Registered_84" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswFossickingDistrictsSelector() {
        return new WMSSelector("gsnsw:bl_fossicking");
    }

    @Bean
    public KnownLayer knownTypeNswFossickingDistricts() {
        KnownLayer layer = new KnownLayer("nsw-fossicking-districts", knownTypeNswFossickingDistrictsSelector());
        layer.setId("nsw-fossicking-districts");
        layer.setName("Nsw Fossicking Districts");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("Fossicking is the small scale search for and collection of minerals, gemstones o");
        layer.setOrder("Registered_84");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswGeologicalFieldObservationsPhoto">
        <ns0:constructor-arg name="id" value="nsw-geological-field-observations-photo" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:dw_photo" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-geological-field-observations-photo" />
        <ns0:property name="name" value="Nsw Geological Field Observations Photo" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_85" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswGeologicalFieldObservationsPhotoSelector() {
        return new WMSSelector("gsnsw:dw_photo");
    }

    @Bean
    public KnownLayer knownTypeNswGeologicalFieldObservationsPhoto() {
        KnownLayer layer = new KnownLayer("nsw-geological-field-observations-photo", knownTypeNswGeologicalFieldObservationsPhotoSelector());
        layer.setId("nsw-geological-field-observations-photo");
        layer.setName("Nsw Geological Field Observations Photo");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("");
        layer.setOrder("Registered_85");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGeopTotaMagnInteRtpTmiRtpTiltFilt">
        <ns0:constructor-arg name="id" value="geop-tota-magn-inte-rtp-tmi-rtp-tilt-filt" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="geophys:MagRTPtilt" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="geop-tota-magn-inte-rtp-tmi-rtp-tilt-filt" />
        <ns0:property name="name" value="Geophysics Total Magnetic Intensity Rtp Tmi Rtp Tilt Filter" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="This dataset is part of the Geological Survey NSW Geophysics dataset series.  To" />
        <ns0:property name="order" value="Registered_86" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeGeopTotaMagnInteRtpTmiRtpTiltFiltSelector() {
        return new WMSSelector("geophys:MagRTPtilt");
    }

    @Bean
    public KnownLayer knownTypeGeopTotaMagnInteRtpTmiRtpTiltFilt() {
        KnownLayer layer = new KnownLayer("geop-tota-magn-inte-rtp-tmi-rtp-tilt-filt", knownTypeGeopTotaMagnInteRtpTmiRtpTiltFiltSelector());
        layer.setId("geop-tota-magn-inte-rtp-tmi-rtp-tilt-filt");
        layer.setName("Geophysics Total Magnetic Intensity Rtp Tmi Rtp Tilt Filter");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("This dataset is part of the Geological Survey NSW Geophysics dataset series.  To");
        layer.setOrder("Registered_86");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswSeismic">
        <ns0:constructor-arg name="id" value="nsw-seismic" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:dw_seismic" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-seismic" />
        <ns0:property name="name" value="Nsw Seismic" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_87" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswSeismicSelector() {
        return new WMSSelector("gsnsw:dw_seismic");
    }

    @Bean
    public KnownLayer knownTypeNswSeismic() {
        KnownLayer layer = new KnownLayer("nsw-seismic", knownTypeNswSeismicSelector());
        layer.setId("nsw-seismic");
        layer.setName("Nsw Seismic");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("");
        layer.setOrder("Registered_87");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswCurrMiniAndExplTitl">
        <ns0:constructor-arg name="id" value="nsw-curr-mini-and-expl-titl" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:bl_title" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-curr-mini-and-expl-titl" />
        <ns0:property name="name" value="Nsw Current Mining And Exploration Titles" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_88" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswCurrMiniAndExplTitlSelector() {
        return new WMSSelector("gsnsw:bl_title");
    }

    @Bean
    public KnownLayer knownTypeNswCurrMiniAndExplTitl() {
        KnownLayer layer = new KnownLayer("nsw-curr-mini-and-expl-titl", knownTypeNswCurrMiniAndExplTitlSelector());
        layer.setId("nsw-curr-mini-and-expl-titl");
        layer.setName("Nsw Current Mining And Exploration Titles");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("");
        layer.setOrder("Registered_88");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGeopTotaMagnInte1StDeriReduToPole">
        <ns0:constructor-arg name="id" value="geop-tota-magn-inte-1st-deri-redu-to-pole" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="geophys:TMI_RTP_1st" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="geop-tota-magn-inte-1st-deri-redu-to-pole" />
        <ns0:property name="name" value="Geophysics Total Magnetic Intensity 1St Derivative Reduced To Pole" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_89" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeGeopTotaMagnInte1StDeriReduToPoleSelector() {
        return new WMSSelector("geophys:TMI_RTP_1st");
    }

    @Bean
    public KnownLayer knownTypeGeopTotaMagnInte1StDeriReduToPole() {
        KnownLayer layer = new KnownLayer("geop-tota-magn-inte-1st-deri-redu-to-pole", knownTypeGeopTotaMagnInte1StDeriReduToPoleSelector());
        layer.setId("geop-tota-magn-inte-1st-deri-redu-to-pole");
        layer.setName("Geophysics Total Magnetic Intensity 1St Derivative Reduced To Pole");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("");
        layer.setOrder("Registered_89");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswGeologicalSpectralSamples">
        <ns0:constructor-arg name="id" value="nsw-geological-spectral-samples" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:dw_spectral" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-geological-spectral-samples" />
        <ns0:property name="name" value="Nsw Geological Spectral Samples" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_90" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswGeologicalSpectralSamplesSelector() {
        return new WMSSelector("gsnsw:dw_spectral");
    }

    @Bean
    public KnownLayer knownTypeNswGeologicalSpectralSamples() {
        KnownLayer layer = new KnownLayer("nsw-geological-spectral-samples", knownTypeNswGeologicalSpectralSamplesSelector());
        layer.setId("nsw-geological-spectral-samples");
        layer.setName("Nsw Geological Spectral Samples");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("");
        layer.setOrder("Registered_90");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGeopTernRadiPota">
        <ns0:constructor-arg name="id" value="geop-tern-radi-pota" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="geophys:Radio" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="geop-tern-radi-pota" />
        <ns0:property name="name" value="Geophysics Ternary Radioelement Potassium K Thorium Th Uranium U " />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="This dataset is part of the Geological Survey NSW Geophysics dataset series.  Te" />
        <ns0:property name="order" value="Registered_91" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeGeopTernRadiPotaSelector() {
        return new WMSSelector("geophys:Radio");
    }

    @Bean
    public KnownLayer knownTypeGeopTernRadiPota() {
        KnownLayer layer = new KnownLayer("geop-tern-radi-pota", knownTypeGeopTernRadiPotaSelector());
        layer.setId("geop-tern-radi-pota");
        layer.setName("Geophysics Ternary Radioelement Potassium K Thorium Th Uranium U ");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("This dataset is part of the Geological Survey NSW Geophysics dataset series.  Te");
        layer.setOrder("Registered_91");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswDrillholesCsg">
        <ns0:constructor-arg name="id" value="nsw-drillholes-csg" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:dw_drillhole_full_csg" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-drillholes-csg" />
        <ns0:property name="name" value="Nsw Drillholes Csg" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="The coal seam gas drillholes dataset stores information about CSG sites within N" />
        <ns0:property name="order" value="Registered_92" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswDrillholesCsgSelector() {
        return new WMSSelector("gsnsw:dw_drillhole_full_csg");
    }

    @Bean
    public KnownLayer knownTypeNswDrillholesCsg() {
        KnownLayer layer = new KnownLayer("nsw-drillholes-csg", knownTypeNswDrillholesCsgSelector());
        layer.setId("nsw-drillholes-csg");
        layer.setName("Nsw Drillholes Csg");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("The coal seam gas drillholes dataset stores information about CSG sites within N");
        layer.setOrder("Registered_92");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswCurrentMiningApplications">
        <ns0:constructor-arg name="id" value="nsw-current-mining-applications" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:bl_titleappl" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-current-mining-applications" />
        <ns0:property name="name" value="Nsw Current Mining Applications" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_93" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswCurrentMiningApplicationsSelector() {
        return new WMSSelector("gsnsw:bl_titleappl");
    }

    @Bean
    public KnownLayer knownTypeNswCurrentMiningApplications() {
        KnownLayer layer = new KnownLayer("nsw-current-mining-applications", knownTypeNswCurrentMiningApplicationsSelector());
        layer.setId("nsw-current-mining-applications");
        layer.setName("Nsw Current Mining Applications");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("");
        layer.setOrder("Registered_93");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswOperatingMineralMines">
        <ns0:constructor-arg name="id" value="nsw-operating-mineral-mines" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:dw_opmines" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-operating-mineral-mines" />
        <ns0:property name="name" value="Nsw Operating Mineral Mines" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_94" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswOperatingMineralMinesSelector() {
        return new WMSSelector("gsnsw:dw_opmines");
    }

    @Bean
    public KnownLayer knownTypeNswOperatingMineralMines() {
        KnownLayer layer = new KnownLayer("nsw-operating-mineral-mines", knownTypeNswOperatingMineralMinesSelector());
        layer.setId("nsw-operating-mineral-mines");
        layer.setName("Nsw Operating Mineral Mines");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("");
        layer.setOrder("Registered_94");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGeophysicsElevation">
        <ns0:constructor-arg name="id" value="geophysics-elevation" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="geophys:DEM" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="geophysics-elevation" />
        <ns0:property name="name" value="Geophysics Elevation" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="Elevation is a pseudocolour layer with a histogram-equalised colour-stretch. Coo" />
        <ns0:property name="order" value="Registered_95" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeGeophysicsElevationSelector() {
        return new WMSSelector("geophys:DEM");
    }

    @Bean
    public KnownLayer knownTypeGeophysicsElevation() {
        KnownLayer layer = new KnownLayer("geophysics-elevation", knownTypeGeophysicsElevationSelector());
        layer.setId("geophysics-elevation");
        layer.setName("Geophysics Elevation");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("Elevation is a pseudocolour layer with a histogram-equalised colour-stretch. Coo");
        layer.setOrder("Registered_95");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswGeolSimpRockUnitBoun">
        <ns0:constructor-arg name="id" value="nsw-geol-simp-rock-unit-boun" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:ge_geology15m_bdy" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-geol-simp-rock-unit-boun" />
        <ns0:property name="name" value="Nsw Geology Simplified Rock Unit Boundary" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_96" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswGeolSimpRockUnitBounSelector() {
        return new WMSSelector("gsnsw:ge_geology15m_bdy");
    }

    @Bean
    public KnownLayer knownTypeNswGeolSimpRockUnitBoun() {
        KnownLayer layer = new KnownLayer("nsw-geol-simp-rock-unit-boun", knownTypeNswGeolSimpRockUnitBounSelector());
        layer.setId("nsw-geol-simp-rock-unit-boun");
        layer.setName("Nsw Geology Simplified Rock Unit Boundary");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("");
        layer.setOrder("Registered_96");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeBlocksAndUnitsGraticule">
        <ns0:constructor-arg name="id" value="blocks-and-units-graticule" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:Map Blocks and Units" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="blocks-and-units-graticule" />
        <ns0:property name="name" value="Blocks And Units Graticule" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="Layer-Group type layer: gsnsw:Map Blocks and Units" />
        <ns0:property name="order" value="Registered_97" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeBlocksAndUnitsGraticuleSelector() {
        return new WMSSelector("gsnsw:Map Blocks and Units");
    }

    @Bean
    public KnownLayer knownTypeBlocksAndUnitsGraticule() {
        KnownLayer layer = new KnownLayer("blocks-and-units-graticule", knownTypeBlocksAndUnitsGraticuleSelector());
        layer.setId("blocks-and-units-graticule");
        layer.setName("Blocks And Units Graticule");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("Layer-Group type layer: gsnsw:Map Blocks and Units");
        layer.setOrder("Registered_97");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswMapUnitGraticule">
        <ns0:constructor-arg name="id" value="nsw-map-unit-graticule" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:bl_mapunit" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-map-unit-graticule" />
        <ns0:property name="name" value="Nsw Map Unit Graticule" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_98" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswMapUnitGraticuleSelector() {
        return new WMSSelector("gsnsw:bl_mapunit");
    }

    @Bean
    public KnownLayer knownTypeNswMapUnitGraticule() {
        KnownLayer layer = new KnownLayer("nsw-map-unit-graticule", knownTypeNswMapUnitGraticuleSelector());
        layer.setId("nsw-map-unit-graticule");
        layer.setName("Nsw Map Unit Graticule");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("");
        layer.setOrder("Registered_98");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswGeochronology">
        <ns0:constructor-arg name="id" value="nsw-geochronology" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:dw_geochron" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-geochronology" />
        <ns0:property name="name" value="Nsw Geochronology" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="The radiogenic isotope database contains geochronological data managed by the Ge" />
        <ns0:property name="order" value="Registered_99" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswGeochronologySelector() {
        return new WMSSelector("gsnsw:dw_geochron");
    }

    @Bean
    public KnownLayer knownTypeNswGeochronology() {
        KnownLayer layer = new KnownLayer("nsw-geochronology", knownTypeNswGeochronologySelector());
        layer.setId("nsw-geochronology");
        layer.setName("Nsw Geochronology");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("The radiogenic isotope database contains geochronological data managed by the Ge");
        layer.setOrder("Registered_99");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGeophysicsIsostaticBougerGravity">
        <ns0:constructor-arg name="id" value="geophysics-isostatic-bouger-gravity" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="geophys:IsoGrav" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="geophysics-isostatic-bouger-gravity" />
        <ns0:property name="name" value="Geophysics Isostatic Bouger Gravity" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="This dataset is part of the Geological Survey NSW Geophysics dataset series.  Is" />
        <ns0:property name="order" value="Registered_100" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeGeophysicsIsostaticBougerGravitySelector() {
        return new WMSSelector("geophys:IsoGrav");
    }

    @Bean
    public KnownLayer knownTypeGeophysicsIsostaticBougerGravity() {
        KnownLayer layer = new KnownLayer("geophysics-isostatic-bouger-gravity", knownTypeGeophysicsIsostaticBougerGravitySelector());
        layer.setId("geophysics-isostatic-bouger-gravity");
        layer.setName("Geophysics Isostatic Bouger Gravity");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("This dataset is part of the Geological Survey NSW Geophysics dataset series.  Is");
        layer.setOrder("Registered_100");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGeopTotaMagnInteReduToPole">
        <ns0:constructor-arg name="id" value="geop-tota-magn-inte-redu-to-pole" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="geophys:MagRTP" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="geop-tota-magn-inte-redu-to-pole" />
        <ns0:property name="name" value="Geophysics Total Magnetic Intensity Reduced To Pole" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="This dataset is part of the Geological Survey NSW Geophysics dataset series.  To" />
        <ns0:property name="order" value="Registered_101" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeGeopTotaMagnInteReduToPoleSelector() {
        return new WMSSelector("geophys:MagRTP");
    }

    @Bean
    public KnownLayer knownTypeGeopTotaMagnInteReduToPole() {
        KnownLayer layer = new KnownLayer("geop-tota-magn-inte-redu-to-pole", knownTypeGeopTotaMagnInteReduToPoleSelector());
        layer.setId("geop-tota-magn-inte-redu-to-pole");
        layer.setName("Geophysics Total Magnetic Intensity Reduced To Pole");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("This dataset is part of the Geological Survey NSW Geophysics dataset series.  To");
        layer.setOrder("Registered_101");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswCoreLibrarySamples">
        <ns0:constructor-arg name="id" value="nsw-core-library-samples" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:dw_corelibhole" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-core-library-samples" />
        <ns0:property name="name" value="Nsw Core Library Samples" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_102" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswCoreLibrarySamplesSelector() {
        return new WMSSelector("gsnsw:dw_corelibhole");
    }

    @Bean
    public KnownLayer knownTypeNswCoreLibrarySamples() {
        KnownLayer layer = new KnownLayer("nsw-core-library-samples", knownTypeNswCoreLibrarySamplesSelector());
        layer.setId("nsw-core-library-samples");
        layer.setName("Nsw Core Library Samples");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("");
        layer.setOrder("Registered_102");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswGeochemistrySamples">
        <ns0:constructor-arg name="id" value="nsw-geochemistry-samples" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:dw_geochemistry" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-geochemistry-samples" />
        <ns0:property name="name" value="Nsw Geochemistry Samples" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="The Geochemistry (Whole Rock) dataset contains information about the chemistry o" />
        <ns0:property name="order" value="Registered_103" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswGeochemistrySamplesSelector() {
        return new WMSSelector("gsnsw:dw_geochemistry");
    }

    @Bean
    public KnownLayer knownTypeNswGeochemistrySamples() {
        KnownLayer layer = new KnownLayer("nsw-geochemistry-samples", knownTypeNswGeochemistrySamplesSelector());
        layer.setId("nsw-geochemistry-samples");
        layer.setName("Nsw Geochemistry Samples");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("The Geochemistry (Whole Rock) dataset contains information about the chemistry o");
        layer.setOrder("Registered_103");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswTitles">
        <ns0:constructor-arg name="id" value="nsw-titles" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:Titles" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-titles" />
        <ns0:property name="name" value="Nsw Titles" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="Layer-Group type layer: gsnsw:Titles" />
        <ns0:property name="order" value="Registered_104" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswTitlesSelector() {
        return new WMSSelector("gsnsw:Titles");
    }

    @Bean
    public KnownLayer knownTypeNswTitles() {
        KnownLayer layer = new KnownLayer("nsw-titles", knownTypeNswTitlesSelector());
        layer.setId("nsw-titles");
        layer.setName("Nsw Titles");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("Layer-Group type layer: gsnsw:Titles");
        layer.setOrder("Registered_104");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswGeology">
        <ns0:constructor-arg name="id" value="nsw-geology" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:NSW_Geology" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-geology" />
        <ns0:property name="name" value="Nsw Geology" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="Layer-Group type layer: gsnsw:NSW_Geology" />
        <ns0:property name="order" value="Registered_105" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswGeologySelector() {
        return new WMSSelector("gsnsw:NSW_Geology");
    }

    @Bean
    public KnownLayer knownTypeNswGeology() {
        KnownLayer layer = new KnownLayer("nsw-geology", knownTypeNswGeologySelector());
        layer.setId("nsw-geology");
        layer.setName("Nsw Geology");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("Layer-Group type layer: gsnsw:NSW_Geology");
        layer.setOrder("Registered_105");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGeopIsosGravOverTmiRtpTilt">
        <ns0:constructor-arg name="id" value="geop-isos-grav-over-tmi-rtp-tilt" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="geophys:IsoGravTilt" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="geop-isos-grav-over-tmi-rtp-tilt" />
        <ns0:property name="name" value="Geophysics Isostatic Gravity Over Tmi Rtp Tilt" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="This dataset is part of the Geological Survey NSW Geophysics dataset series.  Bo" />
        <ns0:property name="order" value="Registered_106" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeGeopIsosGravOverTmiRtpTiltSelector() {
        return new WMSSelector("geophys:IsoGravTilt");
    }

    @Bean
    public KnownLayer knownTypeGeopIsosGravOverTmiRtpTilt() {
        KnownLayer layer = new KnownLayer("geop-isos-grav-over-tmi-rtp-tilt", knownTypeGeopIsosGravOverTmiRtpTiltSelector());
        layer.setId("geop-isos-grav-over-tmi-rtp-tilt");
        layer.setName("Geophysics Isostatic Gravity Over Tmi Rtp Tilt");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("This dataset is part of the Geological Survey NSW Geophysics dataset series.  Bo");
        layer.setOrder("Registered_106");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswLithologySamples">
        <ns0:constructor-arg name="id" value="nsw-lithology-samples" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:dw_lithhole" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-lithology-samples" />
        <ns0:property name="name" value="Nsw Lithology Samples" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="" />
        <ns0:property name="order" value="Registered_107" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswLithologySamplesSelector() {
        return new WMSSelector("gsnsw:dw_lithhole");
    }

    @Bean
    public KnownLayer knownTypeNswLithologySamples() {
        KnownLayer layer = new KnownLayer("nsw-lithology-samples", knownTypeNswLithologySamplesSelector());
        layer.setId("nsw-lithology-samples");
        layer.setName("Nsw Lithology Samples");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("");
        layer.setOrder("Registered_107");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswBase">
        <ns0:constructor-arg name="id" value="nsw-base" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:NSW_Base" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-base" />
        <ns0:property name="name" value="Nsw Base" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="Layer-Group type layer: gsnsw:NSW_Base" />
        <ns0:property name="order" value="Registered_108" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeNswBaseSelector() {
        return new WMSSelector("gsnsw:NSW_Base");
    }

    @Bean
    public KnownLayer knownTypeNswBase() {
        KnownLayer layer = new KnownLayer("nsw-base", knownTypeNswBaseSelector());
        layer.setId("nsw-base");
        layer.setName("Nsw Base");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("Layer-Group type layer: gsnsw:NSW_Base");
        layer.setOrder("Registered_108");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeNswMineralOccurrenceCommodity">
        <ns0:constructor-arg name="id" value="nsw-mineral-occurrence-commodity" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="gsnsw:dw_metelement" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="nsw-mineral-occurrence-commodity" />
        <ns0:property name="name" value="Nsw Mineral Occurrence Commodity" />
        <ns0:property name="group" value="Geological Survey NSW" />
        <ns0:property name="description" value="This spatial dataset is a derivative product of the New South Wales Mineral Occu" />
        <ns0:property name="order" value="Registered_109" />
    </ns0:bean>
    

	
*/

    @Bean
    public WMSSelector knownTypeNswMineralOccurrenceCommoditySelector() {
        return new WMSSelector("gsnsw:dw_metelement");
    }

    @Bean
    public KnownLayer knownTypeNswMineralOccurrenceCommodity() {
        KnownLayer layer = new KnownLayer("nsw-mineral-occurrence-commodity", knownTypeNswMineralOccurrenceCommoditySelector());
        layer.setId("nsw-mineral-occurrence-commodity");
        layer.setName("Nsw Mineral Occurrence Commodity");
        layer.setGroup("Geological Survey NSW");
        layer.setDescription("This spatial dataset is a derivative product of the New South Wales Mineral Occu");
        layer.setOrder("Registered_109");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeGeologicalProvinces">
		<ns0:constructor-arg name="id" value="geological-provinces" />
		<ns0:constructor-arg name="knownLayerSelector">
			<ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSWFSSelector">
				<ns0:constructor-arg name="featureTypeName" value="gml:ProvinceFullExtent" />
				<ns0:constructor-arg name="layerName" value="GeologicalProvinces" />
			</ns0:bean>
		</ns0:constructor-arg>

		<ns0:property name="name" value="Geological Provinces" />
		<ns0:property name="description" value="Geological Provinces provided by GA" />
		<ns0:property name="group" value="Geological Provinces" />
		
		
		
		<ns0:property name="proxyStyleUrl" value="getGeologicalProvincestyle.do" /> 
		
		<ns0:property name="order" value="provinces_01" />

		<ns0:property name="filterCollection">
			<ns0:bean class="org.auscope.portal.core.uifilter.FilterCollection">
				<ns0:property name="optionalFilters">
					<ns0:list>
						<ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UITextBox">
							<ns0:constructor-arg name="label" value="Name" />
							<ns0:constructor-arg name="xpath" value="NAME" />
							<ns0:constructor-arg name="value">
								<ns0:null />
							</ns0:constructor-arg>
							<ns0:constructor-arg name="predicate">
								<ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISLIKE</ns0:value>
							</ns0:constructor-arg>
						</ns0:bean>
                        <ns0:bean class="org.auscope.portal.core.uifilter.optional.xpath.UIPolygonBBox">
                            <ns0:constructor-arg name="label" value="Polygon BBox" />
                            <ns0:constructor-arg name="xpath" value="the_geom" />
                            <ns0:constructor-arg name="value"><ns0:null /></ns0:constructor-arg>                            
                            <ns0:constructor-arg name="predicate">
                                <ns0:value type="org.auscope.portal.core.uifilter.Predicate">ISEQUAL</ns0:value>
                            </ns0:constructor-arg>
                        </ns0:bean>                          
					</ns0:list>
				</ns0:property>
			</ns0:bean>
		</ns0:property>
	</ns0:bean>
    
    
*/

    @Bean
    public WMSSelector knownTypeGeologicalProvincesSelector() {
        return new WMSSelector("?");
    }

    @Bean
    public KnownLayer knownTypeGeologicalProvinces() {
        KnownLayer layer = new KnownLayer("geological-provinces", knownTypeGeologicalProvincesSelector());
        layer.setName("Geological Provinces");
        layer.setDescription("Geological Provinces provided by GA");
        layer.setGroup("Geological Provinces");
        layer.setProxyStyleUrl("getGeologicalProvincestyle.do");
        layer.setOrder("provinces_01");
        
        // Optional filters
        List<AbstractBaseFilter> optionalFilters = new ArrayList<AbstractBaseFilter>();
        UITextBox nameTextBox = new UITextBox("Name", "erl:name", null, Predicate.ISLIKE);        
        UIPolygonBBox uiPolygonBBox = new UIPolygonBBox("Polygon BBox", "the_geom", null, Predicate.ISEQUAL);
        optionalFilters.add(nameTextBox);
        optionalFilters.add(uiPolygonBBox);
        FilterCollection filterCollection = new FilterCollection();
        filterCollection.setOptionalFilters(optionalFilters);
        layer.setFilterCollection(filterCollection);
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeUOWCrnAusBasins">
        <ns0:constructor-arg name="id" value="UOW-Crn-Aus-Basins" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="be10-denude:crn_aus_basins" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="UOW-Crn-Aus-Basins" />
        <ns0:property name="name" value="CRN Australia: river Basins" />
        <ns0:property name="group" value="University of Wollongong" />
        <ns0:property name="description" value="CRN Australia: river Basins" />
        <ns0:property name="proxyStyleUrl" value="getDefaultPolygonStyle.do?colour=0x0000EE" />
        <ns0:property name="order" value="Registered_1" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeUOWCrnAusBasinsSelector() {
        return new WMSSelector("be10-denude:crn_aus_basins");
    }

    @Bean
    public KnownLayer knownTypeUOWCrnAusBasins() {
        KnownLayer layer = new KnownLayer("UOW-Crn-Aus-Basins", knownTypeUOWCrnAusBasinsSelector());
        layer.setId("UOW-Crn-Aus-Basins");
        layer.setName("CRN Australia: river Basins");
        layer.setGroup("University of Wollongong");
        layer.setDescription("CRN Australia: river Basins");
        layer.setProxyStyleUrl("getDefaultPolygonStyle.do?colour=0x0000EE");
        layer.setOrder("Registered_1");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeUOWCrnAusOutlets">
        <ns0:constructor-arg name="id" value="UOW-Crn-Aus-Outlets" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="be10-denude:crn_aus_outlets" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="UOW-Crn-Aus-Outlets" />
        <ns0:property name="name" value="CRN Australia: sample sites" />
        <ns0:property name="group" value="University of Wollongong" />
        <ns0:property name="description" value="CRN Australia: sample sites" />
        <ns0:property name="proxyStyleUrl" value="getDefaultStyle.do?colour=0x00AAFF&amp;layerName=be10-denude:crn_aus_outlets" />        
        <ns0:property name="order" value="Registered_1" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeUOWCrnAusOutletsSelector() {
        return new WMSSelector("be10-denude:crn_aus_outlets");
    }

    @Bean
    public KnownLayer knownTypeUOWCrnAusOutlets() {
        KnownLayer layer = new KnownLayer("UOW-Crn-Aus-Outlets", knownTypeUOWCrnAusOutletsSelector());
        layer.setId("UOW-Crn-Aus-Outlets");
        layer.setName("CRN Australia: sample sites");
        layer.setGroup("University of Wollongong");
        layer.setDescription("CRN Australia: sample sites");
        layer.setProxyStyleUrl("getDefaultStyle.do?colour=0x00AAFF&layerName=be10-denude:crn_aus_outlets");
        layer.setOrder("Registered_1");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeUOWCrnInprepBasins">
        <ns0:constructor-arg name="id" value="UOW-Crn-Inprep-Basins" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="be10-denude:crn_inprep_basins" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="UOW-Crn-Inprep-Basins" />
        <ns0:property name="name" value="CRN InPrep: river Basins" />
        <ns0:property name="group" value="University of Wollongong" />
        <ns0:property name="description" value="CRN InPrep: river Basins" />
        <ns0:property name="proxyStyleUrl" value="getDefaultPolygonStyle.do?colour=0x00FFFF" />
        <ns0:property name="order" value="Registered_1" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeUOWCrnInprepBasinsSelector() {
        return new WMSSelector("be10-denude:crn_inprep_basins");
    }

    @Bean
    public KnownLayer knownTypeUOWCrnInprepBasins() {
        KnownLayer layer = new KnownLayer("UOW-Crn-Inprep-Basins", knownTypeUOWCrnInprepBasinsSelector());
        layer.setId("UOW-Crn-Inprep-Basins");
        layer.setName("CRN InPrep: river Basins");
        layer.setGroup("University of Wollongong");
        layer.setDescription("CRN InPrep: river Basins");
        layer.setProxyStyleUrl("getDefaultPolygonStyle.do?colour=0x00FFFF");
        layer.setOrder("Registered_1");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeUOWCrnInprepOutlets">
        <ns0:constructor-arg name="id" value="UOW-Crn-Inprep-Outlets" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="be10-denude:crn_inprep_outlets" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="UOW-Crn-Inprep-Outlets" />
        <ns0:property name="name" value="CRN InPrep: sample sites" />
        <ns0:property name="group" value="University of Wollongong" />
        <ns0:property name="description" value="CRN InPrep: sample sites" />
        <ns0:property name="proxyStyleUrl" value="getDefaultStyle.do?colour=0x00FFBB&amp;layerName=be10-denude:crn_inprep_outlets" />             
        <ns0:property name="order" value="Registered_1" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeUOWCrnInprepOutletsSelector() {
        return new WMSSelector("be10-denude:crn_inprep_outlets");
    }

    @Bean
    public KnownLayer knownTypeUOWCrnInprepOutlets() {
        KnownLayer layer = new KnownLayer("UOW-Crn-Inprep-Outlets", knownTypeUOWCrnInprepOutletsSelector());
        layer.setId("UOW-Crn-Inprep-Outlets");
        layer.setName("CRN InPrep: sample sites");
        layer.setGroup("University of Wollongong");
        layer.setDescription("CRN InPrep: sample sites");
        layer.setProxyStyleUrl("getDefaultStyle.do?colour=0x00FFBB&layerName=be10-denude:crn_inprep_outlets");
        layer.setOrder("Registered_1");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeUOWCrnIntBasins">
        <ns0:constructor-arg name="id" value="UOW-Crn-Int-Basins" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="be10-denude:crn_int_basins" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="UOW-Crn-Int-Basins" />
        <ns0:property name="name" value="CRN International: river Basins" />
        <ns0:property name="group" value="University of Wollongong" />
        <ns0:property name="description" value="CRN International: river Basins" />
        <ns0:property name="proxyStyleUrl" value="getDefaultPolygonStyle.do?colour=0xBBFF00" />
        <ns0:property name="order" value="Registered_1" />
    </ns0:bean>


    
*/

    @Bean
    public WMSSelector knownTypeUOWCrnIntBasinsSelector() {
        return new WMSSelector("be10-denude:crn_int_basins");
    }

    @Bean
    public KnownLayer knownTypeUOWCrnIntBasins() {
        KnownLayer layer = new KnownLayer("UOW-Crn-Int-Basins", knownTypeUOWCrnIntBasinsSelector());
        layer.setId("UOW-Crn-Int-Basins");
        layer.setName("CRN International: river Basins");
        layer.setGroup("University of Wollongong");
        layer.setDescription("CRN International: river Basins");
        layer.setProxyStyleUrl("getDefaultPolygonStyle.do?colour=0xBBFF00");
        layer.setOrder("Registered_1");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeUOWCrnIntOutlets">
        <ns0:constructor-arg name="id" value="UOW-Crn-Int-Outlets" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="be10-denude:crn_int_outlets" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="UOW-Crn-Int-Outlets" />
        <ns0:property name="name" value="CRN International: sample sites" />
        <ns0:property name="group" value="University of Wollongong" />
        <ns0:property name="description" value="CRN International: sample sites" />
        <ns0:property name="proxyStyleUrl" value="getDefaultStyle.do?colour=0xBBFFAA&amp;layerName=be10-denude:crn_int_outlets" />             
        <ns0:property name="order" value="Registered_1" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeUOWCrnIntOutletsSelector() {
        return new WMSSelector("be10-denude:crn_int_outlets");
    }

    @Bean
    public KnownLayer knownTypeUOWCrnIntOutlets() {
        KnownLayer layer = new KnownLayer("UOW-Crn-Int-Outlets", knownTypeUOWCrnIntOutletsSelector());
        layer.setId("UOW-Crn-Int-Outlets");
        layer.setName("CRN International: sample sites");
        layer.setGroup("University of Wollongong");
        layer.setDescription("CRN International: sample sites");
        layer.setProxyStyleUrl("getDefaultStyle.do?colour=0xBBFFAA&layerName=be10-denude:crn_int_outlets");
        layer.setOrder("Registered_1");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeUOWCrnXXLBasins">
        <ns0:constructor-arg name="id" value="UOW-Crn-XXL-Basins" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="be10-denude:crn_xxl_basins" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="UOW-Crn-XXL-Basins" />
        <ns0:property name="name" value="CRN XXL: river Basins" />
        <ns0:property name="group" value="University of Wollongong" />
        <ns0:property name="description" value="CRN XXL: river Basins" />
        <ns0:property name="proxyStyleUrl" value="getDefaultPolygonStyle.do?colour=0xDDFF00" />
        <ns0:property name="order" value="Registered_1" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeUOWCrnXXLBasinsSelector() {
        return new WMSSelector("be10-denude:crn_xxl_basins");
    }

    @Bean
    public KnownLayer knownTypeUOWCrnXXLBasins() {
        KnownLayer layer = new KnownLayer("UOW-Crn-XXL-Basins", knownTypeUOWCrnXXLBasinsSelector());
        layer.setId("UOW-Crn-XXL-Basins");
        layer.setName("CRN XXL: river Basins");
        layer.setGroup("University of Wollongong");
        layer.setDescription("CRN XXL: river Basins");
        layer.setProxyStyleUrl("getDefaultPolygonStyle.do?colour=0xDDFF00");
        layer.setOrder("Registered_1");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeUOWCrnXXLOutlets">
        <ns0:constructor-arg name="id" value="UOW-Crn-XXL-Outlets" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="be10-denude:crn_xxl_outlets" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="UOW-Crn-XXL-Outlets" />
        <ns0:property name="name" value="CRN XXL: sample sites" />
        <ns0:property name="group" value="University of Wollongong" />
        <ns0:property name="description" value="CRN XXL: sample sites" />
        <ns0:property name="proxyStyleUrl" value="getDefaultStyle.do?colour=0xDDFFAA&amp;layerName=be10-denude:crn_xxl_outlets" />             
        <ns0:property name="order" value="Registered_1" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeUOWCrnXXLOutletsSelector() {
        return new WMSSelector("be10-denude:crn_xxl_outlets");
    }

    @Bean
    public KnownLayer knownTypeUOWCrnXXLOutlets() {
        KnownLayer layer = new KnownLayer("UOW-Crn-XXL-Outlets", knownTypeUOWCrnXXLOutletsSelector());
        layer.setId("UOW-Crn-XXL-Outlets");
        layer.setName("CRN XXL: sample sites");
        layer.setGroup("University of Wollongong");
        layer.setDescription("CRN XXL: sample sites");
        layer.setProxyStyleUrl("getDefaultStyle.do?colour=0xDDFFAA&layerName=be10-denude:crn_xxl_outlets");
        layer.setOrder("Registered_1");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeUOWOSLTLBasins">
        <ns0:constructor-arg name="id" value="UOW-OSLTL-Basins" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="be10-denude:osltl_basins" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="UOW-OSLTL-Basins" />
        <ns0:property name="name" value="OSL &amp; TL: river Basins" />
        <ns0:property name="group" value="University of Wollongong" />
        <ns0:property name="description" value="OSL &amp; TL: river Basins" />
        <ns0:property name="proxyStyleUrl" value="getDefaultPolygonStyle.do?colour=0xFFDD00" />
        <ns0:property name="order" value="Registered_1" />
    </ns0:bean>

    
*/

    @Bean
    public WMSSelector knownTypeUOWOSLTLBasinsSelector() {
        return new WMSSelector("be10-denude:osltl_basins");
    }

    @Bean
    public KnownLayer knownTypeUOWOSLTLBasins() {
        KnownLayer layer = new KnownLayer("UOW-OSLTL-Basins", knownTypeUOWOSLTLBasinsSelector());
        layer.setId("UOW-OSLTL-Basins");
        layer.setName("OSL & TL: river Basins");
        layer.setGroup("University of Wollongong");
        layer.setDescription("OSL & TL: river Basins");
        layer.setProxyStyleUrl("getDefaultPolygonStyle.do?colour=0xFFDD00");
        layer.setOrder("Registered_1");
        return layer;
    }


/*
<ns0:bean xmlns:ns0="http://www.springframework.org/schema/beans" class="org.auscope.portal.core.view.knownlayer.KnownLayer" id="knownTypeUOWOSLTLOutlets">
        <ns0:constructor-arg name="id" value="UOW-OSLTL-Outlets" />
        <ns0:constructor-arg name="knownLayerSelector">
            <ns0:bean class="org.auscope.portal.core.view.knownlayer.WMSSelector">
                <ns0:constructor-arg name="layerName" value="be10-denude:osltl_samples" />
            </ns0:bean>
        </ns0:constructor-arg>
        <ns0:property name="id" value="UOW-OSLTL-Outlets" />
        <ns0:property name="name" value="OSL &amp; TL: sample sites" />
        <ns0:property name="group" value="University of Wollongong" />
        <ns0:property name="description" value="OSL &amp; TL: sample sites" />
        <ns0:property name="proxyStyleUrl" value="getDefaultStyle.do?colour=0xFFDDAA&amp;layerName=be10-denude:osltl_samples" />             
        <ns0:property name="order" value="Registered_1" />
    </ns0:bean>
    

*/

    @Bean
    public WMSSelector knownTypeUOWOSLTLOutletsSelector() {
        return new WMSSelector("be10-denude:osltl_samples");
    }

    @Bean
    public KnownLayer knownTypeUOWOSLTLOutlets() {
        KnownLayer layer = new KnownLayer("UOW-OSLTL-Outlets", knownTypeUOWOSLTLOutletsSelector());
        layer.setId("UOW-OSLTL-Outlets");
        layer.setName("OSL & TL: sample sites");
        layer.setGroup("University of Wollongong");
        layer.setDescription("OSL & TL: sample sites");
        layer.setProxyStyleUrl("getDefaultStyle.do?colour=0xFFDDAA&layerName=be10-denude:osltl_samples");
        layer.setOrder("Registered_1");
        return layer;
    }

}
