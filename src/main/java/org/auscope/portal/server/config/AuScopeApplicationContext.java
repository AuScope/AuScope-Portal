package org.auscope.portal.server.config;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.HashSet;
import java.util.Map;
import java.util.Properties;
import java.util.Arrays;

import org.springframework.context.support.ConversionServiceFactoryBean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.MethodInvokingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import org.auscope.portal.core.cloud.MachineImage;
import org.auscope.portal.core.cloud.StagingInformation;
import org.auscope.portal.core.configuration.ServiceConfiguration;
import org.auscope.portal.core.configuration.ServiceConfigurationItem;
import org.auscope.portal.core.server.http.HttpServiceCaller;
import org.auscope.portal.core.services.CSWCacheService;
import org.auscope.portal.core.services.CSWFilterService;
import org.auscope.portal.core.services.KnownLayerService;
import org.auscope.portal.core.services.OpendapService;
import org.auscope.portal.core.services.PortalServiceException;
import org.auscope.portal.core.services.WCSService;
import org.auscope.portal.core.services.WMSService;
import org.auscope.portal.core.services.WFSService;

import org.auscope.portal.core.services.csw.CSWServiceItem;
import org.auscope.portal.core.services.csw.custom.CustomRegistry;
import org.auscope.portal.core.services.methodmakers.OPeNDAPGetDataMethodMaker;
import org.auscope.portal.core.services.methodmakers.WCSMethodMaker;
import org.auscope.portal.core.services.methodmakers.WFSGetFeatureMethodMaker;
import org.auscope.portal.core.services.methodmakers.WMSMethodMaker;
import org.auscope.portal.core.services.methodmakers.WMSMethodMakerInterface;
import org.auscope.portal.core.services.methodmakers.WMS_1_3_0_MethodMaker;
import org.auscope.portal.core.services.namespaces.ErmlNamespaceContext;
import org.auscope.portal.core.view.ViewKnownLayerFactory;
import org.auscope.portal.core.view.knownlayer.KnownLayer;

import org.auscope.portal.core.view.ViewCSWRecordFactory;
import org.auscope.portal.core.xslt.WfsToKmlTransformer;
import org.auscope.portal.core.services.VocabularyCacheService;
import org.auscope.portal.core.services.VocabularyFilterService;
import org.auscope.portal.core.services.responses.vocab.ConceptFactory;
import org.auscope.portal.core.services.methodmakers.sissvoc.SISSVoc2MethodMaker;
import org.auscope.portal.core.services.SISSVoc2Service;
import org.auscope.portal.server.web.service.ErmlVocabService;
import org.auscope.portal.server.web.service.NvclVocabService;
import org.auscope.portal.core.server.http.download.FileDownloadService;
import org.auscope.portal.core.services.vocabs.VocabularyServiceItem;
import org.auscope.portal.server.web.controllers.sessonobject.StringArrayToCustomRegistry;
import org.auscope.portal.core.services.VocabularyCacheService;
import org.auscope.portal.nvcl.NvclVocabMethodMaker;
import org.auscope.portal.mineraloccurrence.CommodityVocabMethodMaker;
import org.auscope.portal.core.server.PortalPropertySourcesPlaceholderConfigurer;
import org.auscope.portal.server.web.service.NotificationService;
import org.auscope.portal.core.services.methodmakers.Nagios4MethodMaker;
import org.auscope.portal.core.services.Nagios4CachedService;
import org.auscope.portal.mscl.MSCLWFSService;


import org.auscope.portal.core.server.controllers.NamespaceController;
import org.auscope.portal.core.services.NamespaceService;
import org.auscope.portal.core.services.LocalCSWFilterService;


/**
 * Bean definitions.
 * 
 * Most definitions originally migrated from Spring MVC applicationContext.xml.
 * 
 *
 */
@Configuration
public class AuScopeApplicationContext {

    @Autowired
    ArrayList<CSWServiceItem> cswServiceList;

    @Autowired
    ArrayList<KnownLayer> knownTypes;

    @Bean
    public LocalCSWFilterService localCSWFilterService() {
        return(new LocalCSWFilterService(cswFilterService(), taskExecutor()));
    }

    @Bean
    public NamespaceService namespaceService() {
        return(new NamespaceService(httpServiceCallerApp(), methodMaker()));
    }

    @Bean
    public ServiceConfiguration serviceConfiguration() {
        List<ServiceConfigurationItem> sciList = new ArrayList<ServiceConfigurationItem>();
        return new ServiceConfiguration(sciList);
    }


    @Bean
    public WFSGetFeatureMethodMaker methodMaker() {
    	return new WFSGetFeatureMethodMaker();
    }

    @Bean
    public MSCLWFSService msclWfsService() {
        return new MSCLWFSService(httpServiceCallerApp(), methodMaker());
    }

    @Bean
    public WFSService wfsService() {
        return new WFSService(httpServiceCallerApp(), methodMaker(), null);
    }


    /*<bean id="propertyConfigurer" class="org.auscope.portal.core.server.PortalPropertySourcesPlaceholderConfigurer">
        <property name="locations">
            <list>
                <value>classpath:config.properties</value>
                <value>classpath:env.properties</value>
            </list>
        </property>
    </bean>*/
    @Bean
    public static PortalPropertySourcesPlaceholderConfigurer propertyConfigurer() {
        PortalPropertySourcesPlaceholderConfigurer pPropConf = new PortalPropertySourcesPlaceholderConfigurer();
        pPropConf.setLocations(new ClassPathResource("config.properties"), new ClassPathResource("config.properties"));
        return new PortalPropertySourcesPlaceholderConfigurer();
    }
        

    /*<!-- This list all the implementation of converters used in spring -->

    <bean id="conversionService" class="org.springframework.context.support.ConversionServiceFactoryBean">
        <property name="converters">
            <set>
                <bean class="org.auscope.portal.server.web.controllers.sessonobject.StringArrayToCustomRegistry" />
            </set>
        </property>
    </bean>*/
    @Bean
    public ConversionServiceFactoryBean conversionServiceFactoryBean() {
        StringArrayToCustomRegistry strReg = new StringArrayToCustomRegistry();
        HashSet<StringArrayToCustomRegistry> converters = new HashSet<StringArrayToCustomRegistry>();
        converters.add(strReg);
        ConversionServiceFactoryBean convServ = new ConversionServiceFactoryBean();
        convServ.setConverters(converters);
        return convServ;
    }


    /*<!-- This is the core threadpool shared by object instances throughout the portal -->
    <bean id="taskExecutor" class="org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor">
        <property name="corePoolSize" value="5" />
        <property name="maxPoolSize" value="5" />
        <property name="queueCapacity" value="25" />
    </bean>*/
    @Bean
    public ThreadPoolTaskExecutor taskExecutor() {
    	ThreadPoolTaskExecutor taskExec = new ThreadPoolTaskExecutor();
    	taskExec.setCorePoolSize(5);
    	taskExec.setMaxPoolSize(5);
    	taskExec.setQueueCapacity(25);
    	return taskExec;
    }


    /*<bean id="httpServiceCaller" class="org.auscope.portal.core.server.http.HttpServiceCaller">
        <constructor-arg type="int" name="connectionTimeOut">
            <value>900000</value>
        </constructor-arg>
    </bean>*/
    @Bean
    @Autowired
    @Primary
    public HttpServiceCaller httpServiceCallerApp() {
    	return new HttpServiceCaller(900000);
    }
    

    /*<bean id="viewCswRecordFactory" class="org.auscope.portal.core.view.ViewCSWRecordFactory">
    </bean>*/
    @Bean
    public ViewCSWRecordFactory viewCswRecordFactory() {
    	return new ViewCSWRecordFactory();
    }
    
    

    /*<bean id="viewKnownLayerFactory" class="org.auscope.portal.core.view.ViewKnownLayerFactory">
    </bean>*/
    
    @Bean
    public ViewKnownLayerFactory viewKnownLayerFactory() {
    	return new ViewKnownLayerFactory();
    }
    

    /*<bean id="wfsMethodMaker" class="org.auscope.portal.core.services.methodmakers.WFSGetFeatureMethodMaker">
        <property name="namespaces">
            <bean class="org.auscope.portal.core.services.namespaces.ErmlNamespaceContext"/>
        </property>
    </bean>*/
/*
    @Bean 
    public ErmlNamespaceContext ermlNamespaceContext() {
    	return new ErmlNamespaceContext();
    }
    @Bean("wfsMethodMakerErmlNamespace")
    public WFSGetFeatureMethodMaker wfsMethodMakerErmlNamespace() {
    	WFSGetFeatureMethodMaker methodMaker = new WFSGetFeatureMethodMaker();
    	methodMaker.setNamespaces(ermlNamespaceContext());
    	return methodMaker;
    }
*/


    /*<bean id="wfsToKmlTransformer" class="org.auscope.portal.core.xslt.WfsToKmlTransformer">
    </bean>*/
    @Bean
    public WfsToKmlTransformer wfsToKmlTransformer() {
        return new WfsToKmlTransformer();
    }
    
    /*<bean id="vocabularyServiceList" class="java.util.ArrayList" >
        <constructor-arg>
            <list value-type="org.auscope.portal.core.services.vocabs.VocabularyServiceItem">
                <ref bean="vocabularyGeologicTimescales" />
                <ref bean="vocabularyCommodities" />
                <ref bean="vocabularyMineStatuses" />
                <ref bean="vocabularyReserveCategories" />
                <ref bean="vocabularyResourceCategories" />
            </list>
        </constructor-arg>
    </bean>*/

    @Autowired
    VocabularyServiceItem vocabularyGeologicTimescales;

    @Autowired
    VocabularyServiceItem vocabularyCommodities;

    @Autowired
    VocabularyServiceItem vocabularyMineStatuses;

    @Autowired
    VocabularyServiceItem vocabularyReserveCategories;

    @Autowired
    VocabularyServiceItem vocabularyResourceCategories;

    @Bean
    public ArrayList<VocabularyServiceItem> vocabularyServiceList() {
        ArrayList<VocabularyServiceItem> servList = new ArrayList<VocabularyServiceItem>();
        servList.add(vocabularyGeologicTimescales);
        servList.add(vocabularyCommodities);
        servList.add(vocabularyMineStatuses);
        servList.add(vocabularyReserveCategories);
        servList.add(vocabularyResourceCategories);
        return servList;
    }
    
    /*<bean id="vocabularyCacheService" class="org.auscope.portal.core.services.VocabularyCacheService">
        <constructor-arg name="executor" ref="taskExecutor" />
        <constructor-arg name="serviceList" ref="vocabularyServiceList" />
    </bean>*/
    @Bean
    public VocabularyCacheService vocabularyCacheService() {
        return new VocabularyCacheService(taskExecutor(), vocabularyServiceList());
    }

	/*<bean id="vocabularyFilterService" class="org.auscope.portal.core.services.VocabularyFilterService">
        <constructor-arg name="vocabularyCacheService" ref="vocabularyCacheService"/>
    </bean>*/
    @Bean
    public VocabularyFilterService vocabularyFilterService() {
        return new VocabularyFilterService(vocabularyCacheService());
    }
    
    
    /*<bean id="cswCacheService" class="org.auscope.portal.core.services.CSWCacheService">
        <constructor-arg name="executor" ref="taskExecutor"/>
        <constructor-arg name="serviceCaller" ref="httpServiceCaller"/>
        <constructor-arg name="cswServiceList" ref="cswServiceList"/> <!-- This is pulled from the profile xml -->
    </bean>*/
    @Bean
    @Primary
    public CSWCacheService cswCacheService() {
    	CSWCacheService cacheService = new CSWCacheService(
    			taskExecutor(), httpServiceCallerApp(), cswServiceList);
    	cacheService.setForceGetMethods(true);
    	return cacheService;
    }

    /*<bean id="cswFilterService" class="org.auscope.portal.core.services.CSWFilterService">
        <constructor-arg name="executor" ref="taskExecutor"/>
        <constructor-arg name="serviceCaller" ref="httpServiceCaller"/>
        <constructor-arg name="cswServiceList" ref="cswServiceList"/> <!-- This is pulled from the profile xml -->
    </bean>*/
    @Bean
    public CSWFilterService cswFilterService() {
    	return new CSWFilterService(taskExecutor(), httpServiceCallerApp(), cswServiceList);
    }

    /*<bean id="cswKnownLayerService" class="org.auscope.portal.core.services.KnownLayerService">
        <constructor-arg name="knownTypes" ref="knownTypes"/> <!-- This is pulled from the profile xml -->
        <constructor-arg name="cswCacheService" ref="cswCacheService"/>
    </bean>*/
    @Bean
    public KnownLayerService cswKnownLayerService() {
    	return new KnownLayerService(knownTypes, cswCacheService());
    }

    /*<bean id="opendapService" class="org.auscope.portal.core.services.OpendapService">
        <constructor-arg name="serviceCaller" ref="httpServiceCaller"/>
        <constructor-arg name="getDataMethodMaker">
            <bean class="org.auscope.portal.core.services.methodmakers.OPeNDAPGetDataMethodMaker">
            </bean>
        </constructor-arg>
    </bean>*/
    @Bean
    public OPeNDAPGetDataMethodMaker getDataMethodMaker() {
    	return new OPeNDAPGetDataMethodMaker();
    }
    @Bean
    public OpendapService opendapService() {
    	return new OpendapService(httpServiceCallerApp(), getDataMethodMaker());
    }
    

    /*<bean id="sissVocService" class="org.auscope.portal.core.services.SISSVoc2Service">
        <constructor-arg name="httpServiceCaller" ref="httpServiceCaller"/>
        <constructor-arg name="conceptFactory">
            <bean class="org.auscope.portal.core.services.responses.vocab.ConceptFactory">
            </bean>
        </constructor-arg>
        <constructor-arg name="sissVocMethodMaker">
            <bean class="org.auscope.portal.core.services.methodmakers.sissvoc.SISSVoc2MethodMaker">
            </bean>
        </constructor-arg>
    </bean>*/
    @Bean
    public SISSVoc2MethodMaker sissVocMethodMaker() {
        return new SISSVoc2MethodMaker();
    }
    
    @Bean
    public ConceptFactory conceptFactory() {
        return new ConceptFactory();
    }
    
    @Bean
    public SISSVoc2Service sissVocService() {
        return new SISSVoc2Service(httpServiceCallerApp(), conceptFactory(),  sissVocMethodMaker());
    }

    /*<bean id="wcsService" class="org.auscope.portal.core.services.WCSService">
        <constructor-arg name="serviceCaller" ref="httpServiceCaller"/>
        <constructor-arg name="methodMaker">
            <bean class="org.auscope.portal.core.services.methodmakers.WCSMethodMaker">
            </bean>
        </constructor-arg>
    </bean>*/
    @Bean
    public WCSMethodMaker wcsMethodMaker() {
    	return new WCSMethodMaker();
    }
    
    @Bean
    public WCSService wcsService() {
    	return new WCSService(httpServiceCallerApp(), wcsMethodMaker());
    }

    /*<bean id= "WMSMethodMaker" class="org.auscope.portal.core.services.methodmakers.WMSMethodMaker">
        <constructor-arg name="serviceCaller" ref="httpServiceCaller"/>
    </bean>*/
    @Bean
    public WMSMethodMaker wmsMethodMaker() {
    	return new WMSMethodMaker(httpServiceCallerApp());
    }

    /*<bean id= "WMS_1_3_0_MethodMaker" class="org.auscope.portal.core.services.methodmakers.WMS_1_3_0_MethodMaker">
        <constructor-arg name="serviceCaller" ref="httpServiceCaller"/>
    </bean>*/
    @Bean
    public WMS_1_3_0_MethodMaker wms130methodMaker() {
    	return new WMS_1_3_0_MethodMaker(httpServiceCallerApp());
    }
    

    /*<bean id="wmsService" class="org.auscope.portal.server.web.service.AuScopeWMSService">
        <constructor-arg name="serviceCaller" ref="httpServiceCaller"/>
        <constructor-arg name="methodMaker">
            <list>
               <ref bean="WMS_1_3_0_MethodMaker"/>  
               <ref bean="WMSMethodMaker"/>                             
            </list>
        </constructor-arg>
    </bean>*/
    @Bean
    public WMSService wmsService() {
    	List<WMSMethodMakerInterface> methodMakers = new ArrayList<WMSMethodMakerInterface>();
    	methodMakers.add(wmsMethodMaker());
    	methodMakers.add(wms130methodMaker());
    	return new WMSService(httpServiceCallerApp(), methodMakers);
    }
    

    /*<bean id="ermlVocabService" class="org.auscope.portal.server.web.service.ErmlVocabService">
        <constructor-arg name="httpServiceCaller" ref="httpServiceCaller"/>
        <constructor-arg name="commodityVocabMethodMaker">
            <bean class="org.auscope.portal.mineraloccurrence.CommodityVocabMethodMaker">
            </bean>
        </constructor-arg>
        <constructor-arg name="baseUrl" value="${HOST.vocabService.url}"/>
    </bean>*/
    @Value("${env.vocabService.url}") private String ermlVocabServiceURL;
    
    @Bean
    public ErmlVocabService ermlVocabService() {
        return new ErmlVocabService(httpServiceCallerApp(), new CommodityVocabMethodMaker(), ermlVocabServiceURL);
    }
    

    /*<bean id="nvclVocabService" class="org.auscope.portal.server.web.service.NvclVocabService">
        <constructor-arg name="httpServiceCaller" ref="httpServiceCaller"/>
        <constructor-arg name="nvclVocabMethodMaker">
            <bean class="org.auscope.portal.nvcl.NvclVocabMethodMaker">
            </bean>
        </constructor-arg>
        <constructor-arg name="baseUrl" value="${HOST.nvclVocabService.url}"/>
    </bean>*/
    @Value("${env.nvclVocabService.url}") private String nvclVocabServiceURL;
    @Bean
    public NvclVocabService nvclVocabService() {
        return new NvclVocabService(httpServiceCallerApp(), new NvclVocabMethodMaker(), nvclVocabServiceURL);
    }


    /*<bean id="fileDownloadService" class="org.auscope.portal.core.server.http.download.FileDownloadService">
        <constructor-arg name="serviceCaller" ref="httpServiceCaller"/>
    </bean>*/    
    @Bean
    public FileDownloadService fileDownloadService() {
        return new FileDownloadService(httpServiceCallerApp());
    }


    /*<bean id="nagios4CachedService" class="org.auscope.portal.core.services.Nagios4CachedService">
        <constructor-arg name="serviceUrl" value="${HOST.nagios.url}"/>
        <constructor-arg name="serviceCaller" ref="httpServiceCaller"/>
        <constructor-arg name="methodMaker">
            <bean class="org.auscope.portal.core.services.methodmakers.Nagios4MethodMaker">
            </bean>
        </constructor-arg>
        <property name="userName" value="${env.nagios.user}" />
        <property name="password" value="${env.nagios.password}" />
    </bean>*/
    @Value("${env.nagios.url}") private String nagiosURL;
    @Value("${env.nagios.user}") private String nagiosUser;
    @Value("${env.nagios.password}") private String nagiosPassword;
    @Bean
    public Nagios4CachedService nagios4CachedService() {
        return new Nagios4CachedService(nagiosURL, httpServiceCallerApp(), new Nagios4MethodMaker());
    }
    

    /*<!-- Registries to be listed on Custom registry handler but not in feature or register tab -->
    <!--bean id="cswVeglProduction" class="org.auscope.portal.core.services.csw.custom.CustomRegistry">
        <constructor-arg name="id" value="cswVeglProduction" />
        <constructor-arg name="title" value="Virtual Geophysics Laboratory Registry" />
        <constructor-arg name="serviceUrl" value="http://vgl-reg.auscope.org/geonetwork/srv/eng/csw" />
        <constructor-arg name="recordInformationUrl" value="http://vgl-reg.auscope.org/geonetwork/srv/eng/main.home?uuid=%1$s" />
    </bean-->*/
    
    /*<bean id="cswSARegistry" class="org.auscope.portal.core.services.csw.custom.CustomRegistry">
        <constructor-arg name="id" value="cswSARegistry" />
        <constructor-arg name="title" value="South Australia Registry" />
        <constructor-arg name="serviceUrl" value="https://sarigdata.pir.sa.gov.au/geonetwork/srv/eng/csw" />
        <constructor-arg name="recordInformationUrl" value="https://sarigdata.pir.sa.gov.au/geonetwork/srv/eng/main.home?uuid=%1$s" />
    </bean>*/
    @Bean("cswSARegistry")
    public CustomRegistry cswSARegistry() {
        return new CustomRegistry("cswSARegistry", "South Australia Registry", "https://sarigdata.pir.sa.gov.au/geonetwork/srv/eng/csw", "https://sarigdata.pir.sa.gov.au/geonetwork/srv/eng/main.home?uuid=%1$s");
    }
    
    /*<bean id="cswNTRegistry" class="org.auscope.portal.core.services.csw.custom.CustomRegistry">
        <constructor-arg name="id" value="cswNTRegistry" />
        <constructor-arg name="title" value="Northern Territory Registry" />
        <constructor-arg name="serviceUrl" value="http://geology.data.nt.gov.au/geonetwork/srv/eng/csw" />
        <constructor-arg name="recordInformationUrl" value="http://geology.data.nt.gov.au/geonetwork/srv/eng/main.home?uuid=%1$s" />
    </bean>*/
    @Bean("cswNTRegistry")
    public CustomRegistry cswNTRegistry() {
        return new CustomRegistry("cswNTRegistry", "Northern Territory Registry", "http://geology.data.nt.gov.au/geonetwork/srv/eng/csw", "http://geology.data.nt.gov.au/geonetwork/srv/eng/main.home?uuid=%1$s");
    }
    
    /*<bean id="customRegistryList" class="java.util.ArrayList">
        <constructor-arg>
            <list>
                <!--ref bean="cswVeglProduction" /-->
                <ref bean="cswSARegistry" />
                <ref bean="cswNTRegistry" />
            </list>
        </constructor-arg>
    </bean>*/
    @Bean
    public List<CustomRegistry> customRegistryList() {
        List<CustomRegistry> custRegList = new ArrayList<CustomRegistry>();
        custRegList = Arrays.asList(cswSARegistry(), cswNTRegistry());
        return custRegList;
    }
  
    
    /*<bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
        <!-- one of the properties available; the maximum file size in bytes -->
        <property name="maxUploadSize" value="10000000"/>
    </bean>*/
    @Bean
    public CommonsMultipartResolver multipartResolver() {
        CommonsMultipartResolver res = new CommonsMultipartResolver();
        res.setMaxUploadSize(10000000);
        return res;
    }
    
    /*<bean name="notificationService" class="org.auscope.portal.server.web.service.NotificationService" autowire="constructor">
        <constructor-arg name="enableTwitter" value="${env.twitter.enable}"/>        
        <constructor-arg name="notificationAccount" value="${HOST.notification.twitter.user}"/>
        <constructor-arg name="consumerKey" value="${env.twitter.consumerKey}"/>
        <constructor-arg name="consumerSecret" value="${env.twitter.consumerSecret}"/>
        <constructor-arg name="accessToken" value="${env.twitter.accessToken}"/>
        <constructor-arg name="accessTokenSecret" value="${env.twitter.accessTokenSecret}"/>
    </bean>*/
    @Value("${env.twitter.enable}") private boolean twitterEnable;
    @Value("${env.twitter.user}") private String twitterUser;
    @Value("${env.twitter.consumerKey}") private String twitterConsumerKey;
    @Value("${env.twitter.consumerSecret}") private String twitterConsumerSecret;
    @Value("${env.twitter.accessToken}") private String twitterAccessToken;
    @Value("${env.twitter.accessTokenSecret}") private String twitterAccessTokenSecret;
    @Bean 
    public NotificationService notificationService() {
        return new NotificationService(twitterEnable, twitterUser, twitterConsumerKey, twitterConsumerSecret, twitterAccessToken, twitterAccessTokenSecret);
    }
}
