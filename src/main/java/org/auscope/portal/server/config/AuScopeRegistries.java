package org.auscope.portal.server.config;

import org.auscope.portal.core.services.csw.CSWServiceItem;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class AuScopeRegistries {

    /*
        <bean id="cswAuscopeTest" class="org.auscope.portal.core.services.csw.CSWServiceItem">
            <constructor-arg name="id" value="cswAuscopeTest"/>
            <constructor-arg name="title" value="AuScope Test Geonetwork"/>
            <constructor-arg name="serviceUrl" value="http://au-portal-2.it.csiro.au/geonetwork/srv/eng/csw"/>
            <constructor-arg name="recordInformationUrl" value="http://au-portal-2.it.csiro.au/geonetwork/srv/eng/catalog.search#/metadata/%1$s"/>
        </bean>
    */
    @Bean
    public CSWServiceItem cswAuscopeTest() {
        return(new CSWServiceItem("cswAuscopeTest", "AuScope Test Geonetwork", "http://au-portal-2.it.csiro.au/geonetwork/srv/eng/csw", "http://au-portal-2.it.csiro.au/geonetwork/srv/eng/catalog.search#/metadata/%1$s"));
    }


    /*
        <bean id="cswAuscopeProduction" class="org.auscope.portal.core.services.csw.CSWServiceItem">
            <constructor-arg name="id" value="cswAuscopeProduction"/>
            <constructor-arg name="title" value="AuScope Geonetwork"/>
            <constructor-arg name="serviceUrl" value="http://portal.auscope.org/geonetwork/srv/eng/csw"/>
            <constructor-arg name="recordInformationUrl" value="http://portal.auscope.org/geonetwork/srv/eng/catalog.search#/metadata/%1$s"/>
        </bean>
    */
    @Bean
    public CSWServiceItem cswAuscopeProduction() {
        return(new CSWServiceItem("cswAuscopeProduction", "AuScope Geonetwork", "http://portal.auscope.org/geonetwork/srv/eng/csw", "http://portal.auscope.org/geonetwork/srv/eng/catalog.search#/metadata/%1$s"));
    }


    /*
        <bean id="cswMDUTest" class="org.auscope.portal.core.services.csw.CSWServiceItem">
            <constructor-arg name="id" value="cswMDUTest"/>
            <constructor-arg name="title" value="MDU Test Geonetwork"/>
            <constructor-arg name="serviceUrl" value="http://mdu-data-2.arrc.csiro.au/geonetwork/srv/en/csw"/>
            <constructor-arg name="recordInformationUrl" value="http://mdu-data-2.arrc.csiro.au/geonetwork/srv/en/metadata.show?uuid=%1$s"/>
        </bean>
    */
    @Bean
    public CSWServiceItem cswMDUTest() {
        return(new CSWServiceItem("cswMDUTest", "MDU Test Geonetwork", "http://mdu-data-2.arrc.csiro.au/geonetwork/srv/en/csw", "http://mdu-data-2.arrc.csiro.au/geonetwork/srv/en/metadata.show?uuid=%1$s"));
    }


    /*
        <bean id="cswMDUProduction" class="org.auscope.portal.core.services.csw.CSWServiceItem">
            <constructor-arg name="id" value="cswMDUProduction"/>
            <constructor-arg name="title" value="MDU Geonetwork"/>
            <constructor-arg name="serviceUrl" value="http://mdu-data.arrc.csiro.au/geonetwork/srv/en/csw"/>
            <constructor-arg name="recordInformationUrl" value="http://mdu-data.arrc.csiro.au/geonetwork/srv/en/main.home?uuid=%1$s"/>
        </bean>
    */
    @Bean
    public CSWServiceItem cswMDUProduction() {
        return(new CSWServiceItem("cswMDUProduction", "MDU Geonetwork", "http://mdu-data.arrc.csiro.au/geonetwork/srv/en/csw", "http://mdu-data.arrc.csiro.au/geonetwork/srv/en/main.home?uuid=%1$s"));
    }


    /*
        <bean id="cswGAPetroleumTest" class="org.auscope.portal.core.services.csw.CSWServiceItem">
            <constructor-arg name="id" value="cswGAPetroleumTest"/>
            <constructor-arg name="title" value="GA Petroleum Geonetwork"/>
            <constructor-arg name="serviceUrl" value="http://auscope-portal-dev.arrc.csiro.au/geonetwork/srv/eng/csw"/>
            <constructor-arg name="recordInformationUrl" value="http://auscope-portal-dev.arrc.csiro.au/geonetwork/srv/eng/main.home?uuid=%1$s"/>
        </bean>
    */
    @Bean
    public CSWServiceItem cswGAPetroleumTest() {
        return(new CSWServiceItem("cswGAPetroleumTest", "GA Petroleum Geonetwork", "http://auscope-portal-dev.arrc.csiro.au/geonetwork/srv/eng/csw", "http://auscope-portal-dev.arrc.csiro.au/geonetwork/srv/eng/main.home?uuid=%1$s"));
    }
        
        
    /*
        <bean id=" "class="org.auscope.portal.core.services.csw.CSWServiceItem">
            <constructor-arg name="id" value="cswMRTTest"/>
            <constructor-arg name="title" value="Tasmania Test Geonetwork"/>
            <constructor-arg name="serviceUrl" value="http://www.mrt.tas.gov.au/web-catalogue/srv/eng/csw"/>
            <constructor-arg name="recordInformationUrl" value="http://www.mrt.tas.gov.au/web-catalogue/srv/eng/main.home?uuid=%1$s"/>
        </bean>
    */
    @Bean
    public CSWServiceItem cswMRTTest() {
        return(new CSWServiceItem("cswMRTTest", "Tasmania Test Geonetwork", "http://www.mrt.tas.gov.au/web-catalogue/srv/eng/csw", "http://www.mrt.tas.gov.au/web-catalogue/srv/eng/main.home?uuid=%1$s"));
    }


    /*
        <bean id=" "class="org.auscope.portal.core.services.csw.CSWServiceItem">
            <constructor-arg name="id" value="cswMRTProduction"/>
            <constructor-arg name="title" value="Tasmania Geonetwork"/>
            <constructor-arg name="serviceUrl" value="http://www.mrt.tas.gov.au/web-catalogue/srv/eng/csw"/>
            <constructor-arg name="recordInformationUrl" value="http://www.mrt.tas.gov.au/web-catalogue/srv/eng/main.home?uuid=%1$s"/>
        </bean>
    */
    @Bean
    public CSWServiceItem cswMRTProduction() {
        return(new CSWServiceItem("cswMRTProduction", "Tasmania Geonetwork", "http://www.mrt.tas.gov.au/web-catalogue/srv/eng/csw", "http://www.mrt.tas.gov.au/web-catalogue/srv/eng/main.home?uuid=%1$s"));
    }


    /*
        <bean id="cswGAPMDCRC" class="org.auscope.portal.core.services.csw.CSWServiceItem">
            <constructor-arg name="id" value="cswGAPMDCRC" />
            <constructor-arg name="title" value="Geoscience Australia PMD*CRC Publications" />
            <constructor-arg name="serviceUrl" value="http://www.ga.gov.au/geonetwork/srv/en/csw" />
            <constructor-arg name="cqlText" value="csw:AnyText Like '%PMD*CRC Publication%' AND BBOX(ows:BoundingBox, 110,-9,160,-55)" /> <!-- The BBOX excludes CSW records which cannot be placed on map -->
            <constructor-arg name="recordInformationUrl" value="http://www.ga.gov.au/geonetwork/srv/en/csw?request=GetRecordById&amp;service=CSW&amp;version=2.0.2&amp;OUTPUTSCHEMA=http://www.isotc211.org/2005/gmd&amp;elementSetName=full&amp;id=%1$s" />
        </bean>
    */
    @Bean
    public CSWServiceItem cswGAPMDCRC() {
        return(new CSWServiceItem("cswGAPMDCRC", "Geoscience Australia PMD*CRC Publications", "http://www.ga.gov.au/geonetwork/srv/en/csw", "csw:AnyText Like '%PMD*CRC Publication%' AND BBOX(ows:BoundingBox, 110,-9,160,-55)",
                                  "http://www.ga.gov.au/geonetwork/srv/en/csw?request=GetRecordById&amp;service=CSW&amp;version=2.0.2&amp;OUTPUTSCHEMA=http://www.isotc211.org/2005/gmd&amp;elementSetName=full&amp;id=%1$s"));
    }

}
