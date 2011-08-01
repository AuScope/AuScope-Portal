package org.auscope.portal.server.web.service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.httpclient.HttpMethodBase;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.auscope.portal.csw.CSWGetRecordResponse;
import org.auscope.portal.csw.CSWMethodMakerGetDataRecords;
import org.auscope.portal.csw.CSWMethodMakerGetDataRecords.ResultType;
import org.auscope.portal.csw.CSWRecord;
import org.auscope.portal.csw.CSWThreadExecutor;
import org.auscope.portal.server.domain.ows.OWSExceptionParser;
import org.auscope.portal.server.util.DOMUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;

/**
 * A service for creating a cache of all keywords at a CSW.
 *
 * The cache will be periodically refreshed by crawling
 * through all CSW records
 *
 * @author Josh Vote
 *
 */
@Service
public class CSWKeywordCacheService {

    /**
     * The maximum number of records that will be requested from a CSW at a given time.
     *
     * If a CSW has more records than this value then multiple requests will be made
     */
    public static final int MAX_QUERY_LENGTH = 1000;

    /**
     * The frequency in which the cache updates (in milli seconds).
     */
    public static final long CACHE_UPDATE_FREQUENCY_MS = 1000L * 60L * 60L * 1L; //Set to 1 hour

    protected final Log log = LogFactory.getLog(getClass());


    protected Map<String, Integer> cache;
    protected HttpServiceCaller serviceCaller;
    protected CSWThreadExecutor executor;
    protected CSWServiceItem[] cswServiceList;
    protected boolean updateRunning;  //don't set this variable directly
    protected Date lastCacheUpdate;


    /**
     * Creates a new instance of a CSWKeywordCacheService. This constructor is normally autowired
     * by the spring framework.
     *
     * @param executor A thread executor that will be used to manage multiple simultaneous CSW requests
     * @param serviceCaller Will be involved in actually making a HTTP request
     * @param cswServiceList Must be an untyped array of CSWServiceItem objects (for bean autowiring) representing CSW URL endpoints
     * @throws Exception
     */
    @Autowired
    public CSWKeywordCacheService(CSWThreadExecutor executor,
                      HttpServiceCaller serviceCaller,
                      @Qualifier(value = "cswServiceList") ArrayList cswServiceList) throws Exception {
        this.updateRunning = false;
        this.executor = executor;
        this.serviceCaller = serviceCaller;
        this.cache = new HashMap<String, Integer>();
        this.cswServiceList = new CSWServiceItem[cswServiceList.size()];
        for (int i = 0; i < cswServiceList.size(); i++) {
            this.cswServiceList[i] = (CSWServiceItem) cswServiceList.get(i);
        }
    }

    /**
     * Get's whether the currently running thread is OK to start a cache update
     *
     * If true is returned, ensure that the calling thread makes a call to updateFinished
     * @return
     */
    private synchronized boolean okToUpdate() {
        if (this.updateRunning) {
            return false;
        }

        this.updateRunning = true;
        return true;
    }

    /**
     * Called by the update thread whenever an update finishes (successful or not)
     *
     * if newCache is NOT NULL it will update the internal cache.
     */
    private synchronized void updateFinished(Map<String, Integer> newCache) {
        this.updateRunning = false;
        if (newCache != null) {
            this.cache = newCache;
        }
        this.lastCacheUpdate = new Date();

        log.info(String.format("Keyword cache updated! Cache now has '%1$d' unique keyword names", this.cache.size()));
    }

    /**
     * Returns an unmodifiable Map of keyword names to integer counts
     *
     * This function may trigger a cache update to begin on a seperate thread.
     * @return
     */
    public synchronized Map<String, Integer> getKeywordCache() {
        if (lastCacheUpdate == null ||
                (new Date().getTime() - lastCacheUpdate.getTime()) > CACHE_UPDATE_FREQUENCY_MS) {
            updateKeywordCache();
        }

        return Collections.unmodifiableMap(this.cache);
    }

    /**
     * Updates the internal keyword cache by querying all known CSW's
     *
     * If an update is already running this function will have no effect
     *
     * The update will occur on a seperate thread so this function will return immediately
     * with true if an update has started or false if an update is already running
     */
    public boolean updateKeywordCache() {
        if (!okToUpdate()) {
            return false;
        }

        //This will be our new cache
        Map<String, Integer> newCache = new HashMap<String, Integer>();

        //Create our worker threads (ensure they are all aware of eachother)
        CSWKeywordUpdateThread[] updateThreads = new CSWKeywordUpdateThread[cswServiceList.length];
        for (int i = 0; i < updateThreads.length; i++) {
            updateThreads[i] = new CSWKeywordUpdateThread(this, updateThreads, cswServiceList[i], newCache, serviceCaller);
        }

        //Fire off our worker threads, the last one to finish will update the
        //internal cache and call 'updateFinished'
        for (CSWKeywordUpdateThread thread : updateThreads) {
            this.executor.execute(thread);
        }

        return true;
    }

    /**
     * Our worker class for updating our CSW cache
     */
    private class CSWKeywordUpdateThread extends Thread {
        protected final Log log = LogFactory.getLog(getClass());

        private CSWKeywordCacheService parent;
        private CSWKeywordUpdateThread[] siblings; //this is also used as a shared locking object
        private CSWServiceItem endpoint;
        private Map<String, Integer> newCache;
        private HttpServiceCaller serviceCaller;
        private boolean finishedExecution;

        public CSWKeywordUpdateThread(CSWKeywordCacheService parent,
                CSWKeywordUpdateThread[] siblings, CSWServiceItem endpoint,
                Map<String, Integer> newCache, HttpServiceCaller serviceCaller) {
            super();
            this.parent = parent;
            this.siblings = siblings;
            this.endpoint = endpoint;
            this.newCache = newCache;
            this.serviceCaller = serviceCaller;
            this.finishedExecution = false;
        }

        /**
         * This is synchronized on the siblings object
         * @return
         */
        private boolean isFinishedExecution() {
            synchronized(siblings) {
                return finishedExecution;
            }
        }

        /**
         * This is synchronized on the siblings object
         * @param finishedExecution
         */
        private void setFinishedExecution(boolean finishedExecution) {
            synchronized(siblings) {
                this.finishedExecution = finishedExecution;
            }
        }

        /**
         * When our threads finish they check whether sibling threads have finished yet
         * The last thread to finish has to update the parent
         * To avoid race conditions we ensure that checking the termination condition
         * is a synchronized operation
         *
         * This function is synchronized on the siblings object
         */
        private void attemptCleanup() {
            synchronized(siblings) {
                this.setFinishedExecution(true);

                //This is all synchronized so nothing can finish execution until we release
                //the lock on siblings
                boolean cleanupRequired = true;
                for (CSWKeywordUpdateThread sibling : siblings) {
                    if (!sibling.isFinishedExecution()) {
                        cleanupRequired = false;
                        break;
                    }
                }

                //Last thread to finish tells our parent we've terminated
                if (cleanupRequired) {
                    parent.updateFinished(newCache);
                }
            }
        }

        @Override
        public void run() {
            try {
                CSWMethodMakerGetDataRecords methodMaker = new CSWMethodMakerGetDataRecords(this.endpoint.getServiceUrl());
                int startPosition = 1;

                //Request page after page of CSWRecords until we've iterated the entire store
                do {
                    log.trace(String.format("%1$s - requesting startPosition %2$s", this.endpoint.getServiceUrl(), startPosition));

                    //Request our set of records
                    HttpMethodBase method = methodMaker.makeMethod(null, ResultType.Results, MAX_QUERY_LENGTH, startPosition);
                    InputStream responseStream = serviceCaller.getMethodResponseAsStream(method, serviceCaller.getHttpClient());

                    log.trace(String.format("%1$s - Response received", this.endpoint.getServiceUrl()));

                    //Parse the response into newCache (remember that maps are NOT thread safe)
                    Document responseDocument = DOMUtil.buildDomFromStream(responseStream);
                    OWSExceptionParser.checkForExceptionResponse(responseDocument);
                    CSWGetRecordResponse response = new CSWGetRecordResponse(responseDocument);
                    synchronized(newCache) {
                        for (CSWRecord record : response.getRecords()) {
                            for (String keyword : record.getDescriptiveKeywords()) {
                                if (keyword == null || keyword.isEmpty()) {
                                    continue;
                                }

                                Integer count = newCache.get(keyword);
                                if (count == null) {
                                    count = new Integer(1);
                                    newCache.put(keyword, count);
                                } else {
                                    count = count + 1;
                                    newCache.put(keyword, count);
                                }
                            }
                        }
                    }

                    log.trace(String.format("%1$s - Response parsed!", this.endpoint.getServiceUrl()));

                    //Prepare to request next 'page' of records (if required)
                    if (response.getNextRecord() > response.getRecordsMatched() ||
                        response.getNextRecord() <= 0) {
                        startPosition = -1; //we are done in this case
                    } else {
                        startPosition = response.getNextRecord();
                    }
                } while (startPosition > 0);
            } catch (Exception ex) {
                log.warn("Error updating keyword cache", ex);
            } finally {
                attemptCleanup();
            }
        }
    }
}
