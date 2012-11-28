package org.auscope.portal.mineraloccurrence;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.httpclient.HttpMethodBase;
import org.apache.commons.httpclient.NameValuePair;
import org.auscope.portal.core.services.methodmakers.sissvoc.SISSVoc3MethodMaker;
import org.springframework.stereotype.Component;

/**
 * Additions to the SISSVoc3 method maker to better support the commodity vocab
 * @author Josh Vote
 *
 */
public class CommodityVocabMethodMaker extends SISSVoc3MethodMaker {
    /**
     * Generates a method for requesting all concepts (as rdf:Descriptions) in the specified repository
     *
     * The request supports rudimentary paging of the returned results
     *
     * @param sissVocUrl The base URL of a SISSVoc service
     * @param repository The repository name to query
     * @param format How the response should be structured.
     * @param pageSize [Optional] How many concepts should be returned per page
     * @param pageNumber [Optional] The page number to request (0 based)
     * @return
     */
    public HttpMethodBase getAllCommodities(String sissVocUrl, String repository, Format format, Integer pageSize, Integer pageNumber) {
        List<NameValuePair> params = new ArrayList<NameValuePair>();

        appendPagingParams(params, pageSize, pageNumber);

        return buildGetMethod(sissVocUrl, repository, "commodity", format, params);
    }

    /**
     * Generates a method for requesting all concepts that match the specified urn pattern
     *
     * The request supports rudimentary paging of the returned results
     *
     * @param sissVocUrl The base URL of a SISSVoc service
     * @param repository The repository name to query
     * @param format How the response should be structured.
     * @param pageSize [Optional] How many concepts should be returned per page
     * @param pageNumber [Optional] The page number to request (0 based)
     * @param urn A regular expression to match against URNs
     * @return
     */
    public HttpMethodBase getCommoditiesMatchingUrn(String sissVocUrl, String repository, Format format, Integer pageSize, Integer pageNumber, String urn) {
        List<NameValuePair> params = new ArrayList<NameValuePair>();

        params.add(new NameValuePair("urncontains", urn));
        appendPagingParams(params, pageSize, pageNumber);


        return buildGetMethod(sissVocUrl, repository, "commodity", format, params);
    }
}
