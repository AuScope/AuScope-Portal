package org.auscope.portal.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import org.auscope.portal.core.services.vocabs.VocabularyServiceItem;
import org.auscope.portal.core.services.methodmakers.VocabularyMethodMaker;
import org.auscope.portal.core.server.http.HttpServiceCaller;

import au.gov.geoscience.portal.services.vocabularies.GeologicTimescaleVocabService;
import au.gov.geoscience.portal.services.vocabularies.CommodityVocabService;
import au.gov.geoscience.portal.services.vocabularies.MineStatusVocabService;
import au.gov.geoscience.portal.services.vocabularies.ResourceCategoryVocabService;
import au.gov.geoscience.portal.services.vocabularies.ReserveCategoryVocabService;


@Configuration
class ExtraVocabularies {
    
    @Bean
    @Primary
    public HttpServiceCaller httpServiceCaller() {
    	return new HttpServiceCaller(900000);
    }
    
    
/*
    <bean id="vocabularyGeologicTimescales" class="org.auscope.portal.core.services.vocabs.VocabularyServiceItem">
        <constructor-arg name="id" value="vocabularyGeologicTimescales" />
        <constructor-arg name="title" value="Geological Timescales Vocabulary" />
        <constructor-arg name="vocabularyService">
            <bean id="geologicTimescaleService" class="au.gov.geoscience.portal.services.vocabularies.GeologicTimescaleVocabService">
                <constructor-arg name="baseUrl" value="http://vocabs.ands.org.au/repository/api/lda/csiro/international-chronostratigraphic-chart/2017" />
                <constructor-arg name="httpServiceCaller" ref="httpServiceCaller"/>
                <constructor-arg name="vocabularyMethodMaker">
                    <bean class="org.auscope.portal.core.services.methodmakers.VocabularyMethodMaker">
                    </bean>
                </constructor-arg>
            </bean>
        </constructor-arg>
    </bean>
*/
    @Bean
    public GeologicTimescaleVocabService geologicTimescaleService() {
        return new GeologicTimescaleVocabService(httpServiceCaller(), new VocabularyMethodMaker(), "http://vocabs.ands.org.au/repository/api/lda/csiro/international-chronostratigraphic-chart/2017");
    }
    @Bean
    public VocabularyServiceItem vocabularyGeologicTimescales() {
        return new VocabularyServiceItem("vocabularyGeologicTimescales", "Geological Timescales Vocabulary", geologicTimescaleService());
    }


/*
    <bean id="vocabularyCommodities" class="org.auscope.portal.core.services.vocabs.VocabularyServiceItem">
        <constructor-arg name="id" value="vocabularyCommodities" />
        <constructor-arg name="title" value="Commodities Vocabulary" />
        <constructor-arg name="vocabularyService">
            <bean id="commodityService" class="au.gov.geoscience.portal.services.vocabularies.CommodityVocabService">
                <constructor-arg name="serviceUrl" value="http://vocabs.ga.gov.au/cgi/sissvoc/commodity-code" />
                <constructor-arg name="httpServiceCaller" ref="httpServiceCaller"/>
                <constructor-arg name="vocabularyMethodMaker">
                    <bean class="org.auscope.portal.core.services.methodmakers.VocabularyMethodMaker">
                    </bean>
                </constructor-arg>
            </bean>
        </constructor-arg>
    </bean>
*/
    @Bean
    public CommodityVocabService commodityCodeService() {
        return new CommodityVocabService(httpServiceCaller(), new VocabularyMethodMaker(), "http://vocabs.ga.gov.au/cgi/sissvoc/commodity-code");
    }
    @Bean
    public VocabularyServiceItem vocabularyCommodities() {
        return new VocabularyServiceItem("vocabularyCommodities", "Commodities Vocabulary", commodityCodeService());
    }



/*
    <bean id="vocabularyMineStatuses" class="org.auscope.portal.core.services.vocabs.VocabularyServiceItem">
        <constructor-arg name="id" value="vocabularyMineStatuses" />
        <constructor-arg name="title" value="Mine Statuses Vocabulary" />
        <constructor-arg name="vocabularyService">
            <bean id="commodityService" class="au.gov.geoscience.portal.services.vocabularies.MineStatusVocabService">
                <constructor-arg name="serviceUrl" value="http://vocabs.ga.gov.au/cgi/sissvoc/mine-status" />
                <constructor-arg name="httpServiceCaller" ref="httpServiceCaller"/>
                <constructor-arg name="vocabularyMethodMaker">
                    <bean class="org.auscope.portal.core.services.methodmakers.VocabularyMethodMaker">
                    </bean>
                </constructor-arg>
            </bean>
        </constructor-arg>
    </bean>
*/
    @Bean
    public MineStatusVocabService mineStatusService() {
        return new MineStatusVocabService(httpServiceCaller(), new VocabularyMethodMaker(), "http://vocabs.ga.gov.au/cgi/sissvoc/mine-status");
    }
    @Bean
    public VocabularyServiceItem vocabularyMineStatuses() {
        return new VocabularyServiceItem("vocabularyMineStatuses", "Mine Statuses Vocabulary", mineStatusService());
    }

/*
    <bean id="vocabularyResourceCategories" class="org.auscope.portal.core.services.vocabs.VocabularyServiceItem">
        <constructor-arg name="id" value="vocabularyResourceCategories" />
        <constructor-arg name="title" value="Resource Categories Vocabulary" />
        <constructor-arg name="vocabularyService">
            <bean id="commodityService" class="au.gov.geoscience.portal.services.vocabularies.ResourceCategoryVocabService">
                <constructor-arg name="serviceUrl" value="http://vocabs.ga.gov.au/cgi/sissvoc/resource-assessment-category" />
                <constructor-arg name="httpServiceCaller" ref="httpServiceCaller"/>
                <constructor-arg name="vocabularyMethodMaker">
                    <bean class="org.auscope.portal.core.services.methodmakers.VocabularyMethodMaker">
                    </bean>
                </constructor-arg>
            </bean>
        </constructor-arg>
    </bean>
*/
    @Bean
    public ResourceCategoryVocabService resourceCategoryService() {
        return new ResourceCategoryVocabService(httpServiceCaller(), new VocabularyMethodMaker(), "http://vocabs.ga.gov.au/cgi/sissvoc/resource-assessment-category");
    }
    @Bean
    public VocabularyServiceItem vocabularyResourceCategories() {
        return new VocabularyServiceItem("vocabularyResourceCategories", "Resource Categories Vocabulary", resourceCategoryService());
    }

/*
    <bean id="vocabularyReserveCategories" class="org.auscope.portal.core.services.vocabs.VocabularyServiceItem">
        <constructor-arg name="id" value="vocabularyReserveCategories" />
        <constructor-arg name="title" value="Reserve Categories Vocabulary" />
        <constructor-arg name="vocabularyService">
            <bean id="commodityService" class="au.gov.geoscience.portal.services.vocabularies.ReserveCategoryVocabService">
                <constructor-arg name="serviceUrl" value="http://vocabs.ga.gov.au/cgi/sissvoc/reserve-assessment-category" />
                <constructor-arg name="httpServiceCaller" ref="httpServiceCaller"/>
                <constructor-arg name="vocabularyMethodMaker">
                    <bean class="org.auscope.portal.core.services.methodmakers.VocabularyMethodMaker">
                    </bean>
                </constructor-arg>
            </bean>
        </constructor-arg>
    </bean>
*/
    @Bean
    public ReserveCategoryVocabService reserveCategoryService() {
        return new ReserveCategoryVocabService(httpServiceCaller(), new VocabularyMethodMaker(), "http://vocabs.ga.gov.au/cgi/sissvoc/reserve-assessment-category");
    }
    @Bean
    public VocabularyServiceItem vocabularyReserveCategories() {
        return new VocabularyServiceItem("vocabularyReserveCategories", "Reserve Categories Vocabulary", reserveCategoryService());
    }

}
