/**
 * A downloader that creates an Ext.Window specialised into showing a
 * dialog for the user to download features from a WFS in a zip file
 */
Ext.define('portal.layer.downloader.wfs.WFSDownloader', {
    extend: 'portal.layer.downloader.Downloader',

    statics : {
        DOWNLOAD_CURRENTLY_VISIBLE : 1,
        DOWNLOAD_ORIGINALLY_VISIBLE : 2,
        DOWNLOAD_ALL : 3
    },

    currentTooltip : null,

    constructor : function(cfg) {
        this.callParent(arguments);
    },

    /**
     * An implementation of an abstract method, see parent method for details
     *
     * resources - an array of data sources that were used to render data
     * renderedFilterer - custom filter that was applied when rendering the specified data sources
     * currentFilterer - The value of the custom filter, this may differ from renderedFilterer if the
     *                   user has updated the form/map without causing a new render to occur
     */
    downloadData : function(resources, renderedFilterer, currentFilterer) {
        var isDifferentBBox = false;
        var originallyVisibleBBox = null;
        var currentlyVisibleBBox = null;
        if (renderedFilterer instanceof portal.layer.filterer.SpatialFilterer &&
            currentFilterer instanceof portal.layer.filterer.SpatialFilterer) {

            originallyVisibleBBox = renderedFilterer.getSpatialParam();
            currentlyVisibleBBox = currentFilterer.getSpatialParam();
            isDifferentBBox = !originallyVisibleBBox.equals(currentlyVisibleBBox);
        }

        //Create a popup showing our options
        Ext.create('Ext.Window', {
            title : 'Download Options',
            layout : 'fit',
            buttonAlign : 'right',
            buttons : [{
               text : 'Download',
               iconCls : 'download',
               handler : function() {
                   var bboxJson = '';
                   var radioGroup = me.findByType('radiogroup')[0];

                   switch(radioGroup.getValue().initialConfig.inputValue) {
                   case portal.layer.downloader.wfs.WFSDownloader.DOWNLOAD_CURRENTLY_VISIBLE:
                       me._handleDownload(currentFilterer, resources);
                       break;
                   case portal.layer.downloader.wfs.WFSDownloader.DOWNLOAD_ORIGINALLY_VISIBLE:
                       me._handleDownload(renderedFilterer, resources);
                       break;
                   default:
                       me._handleDownload(renderedFilterer, resources);
                       break;
                   }

                   me.close();

               }
            }],
            items : [{
                xtype : 'fieldset',
                layout : 'fit',
                items : [{
                    xtype : 'label',
                    style : 'font-size: 12px;',
                    text : 'The portal will make a download request on your behalf and return the results in a ZIP archive. How would you like the portal to filter your download?',
                },{
                    xtype : 'spacer',
                    width : 10,
                    height : 10
                },{
                    //Our radiogroup can see its item list vary according to the presence of bounding boxes
                    xtype : 'radiogroup',
                    columns : [0.99, 18],
                    listeners : {
                        change : function(radioGroup, radio) {
                            switch(radio.initialConfig.inputValue) {
                            case portal.layer.downloader.wfs.WFSDownloader.DOWNLOAD_CURRENTLY_VISIBLE:
                                alert('TODO');
                                break;
                            case portal.layer.downloader.wfs.WFSDownloader.DOWNLOAD_ORIGINALLY_VISIBLE:
                                alert('TODO');
                                break;
                            }
                        }
                    },
                    items : [{
                        boxLabel : 'Filter my download using the current visible map bounds.',
                        name : 'wfs-download-radio',
                        inputValue : portal.layer.downloader.wfs.WFSDownloader.DOWNLOAD_CURRENTLY_VISIBLE,
                        hidden : !isDifferentBBox,
                        checked : isDifferentBBox

                    },{
                        xtype : 'box',
                        autoEl : {
                            tag : 'img',
                            src : 'img/magglass.gif',
                            qtip : 'Click to display the spatial bounds, double click to pan the map so they are visible.'
                        },
                        width : 18,
                        height : 21,
                        hidden : !isDifferentBBox,
                        style : 'padding:3px 0px 0px 0px;',
                        listeners : {
                            render : function(c) {
                                c.getEl().on('click', function(e) {
                                    alert('TODO');
                                }, c);
                                c.getEl().on('dblclick', function(e) {
                                    alert('TODO');
                                }, c);
                            }
                        }
                    },{
                        boxLabel : 'Filter my download using the original bounds that were used to load the layer.',
                        name : 'wfs-download-radio',
                        inputValue : portal.layer.downloader.wfs.WFSDownloader.DOWNLOAD_ORIGINALLY_VISIBLE,
                        checked : !isDifferentBBox && originallyVisibleBBox !== null,
                        hidden : originallyVisibleBBox === null
                    },{
                        xtype : 'box',
                        autoEl : {
                            tag : 'img',
                            src : 'img/magglass.gif',
                            qtip : 'Click to display the spatial bounds, double click to pan the map so they are visible.'
                        },
                        width : 18,
                        height : 21,
                        style : 'padding:3px 0px 0px 0px;',
                        hidden : originallyVisibleBBox === null,
                        listeners : {
                            render : function(c) {
                                c.getEl().on('click', function(e) {
                                    me.fireEvent('renderbbox', me, originallyVisibleBBox);
                                }, c);
                                c.getEl().on('dblclick', function(e) {
                                    me.fireEvent('scrolltobbox', me, originallyVisibleBBox);
                                }, c);
                            }
                        }
                    },{
                        boxLabel : 'Don\'t filter my download. Return all available data.',
                        name : 'wfs-download-radio',
                        inputValue : portal.layer.downloader.wfs.WFSDownloader.DOWNLOAD_ALL,
                        checked : !isDifferentBBox && originallyVisibleBBox === null
                    }]
                }]
            }],

        });
    },

    /**
     * Handles a download the specifeid set of online resources and filterer
     *
     * filterer - a portal.layer.filterer.Filterer
     * resources - an array portal.csw.OnlineResource
     */
    _handleDownload : function(filterer, resources) {
        var filterParameters = filterer.getParameters();
        var downloadParameters = {
            serviceUrls : []
        };
        var proxyUrl = this.activeLayerRecord.getProxyFetchUrl() &&  this.activeLayerRecord.getProxyFetchUrl().length > 0 ? this.activeLayerRecord.getProxyFetchUrl() : 'getAllFeatures.do';
        var prefixUrl = window.location.protocol + "//" + window.location.host + WEB_CONTEXT + "/" + proxyUrl + "?";
        var cswRecords = this.activeLayerRecord.getCSWRecordsWithType('WFS');

        //Iterate our WFS records and generate the array of PORTAL BACKEND requests that will be
        //used to proxy WFS requests. That array will be sent to a backend handler for making
        //multiple requests and zipping the responses into a single stream for the user to download.
        var wfsResources = portal.csw.OnlineResource.getFilteredFromArray(resources, portal.csw.OnlineResource.WFS);
        for (var i = 0; i < wfsResources.length; i++) {
            //Create a copy of the last set of filter parameters
            var url = wfsOnlineResources[j].url;
            var currentFilterParameters = {};
            Ext.apply(currentFilterParameters, filterParameters);

            currentFilterParameters.serviceUrl = wfsOnlineResources[j].url;
            currentFilterParameters.typeName = wfsOnlineResources[j].name;
            currentFilterParameters.maxFeatures = 0;

            downloadParameters.serviceUrls.push(Ext.urlEncode(currentFilterParameters, prefixUrl));
        }

        //download the service URLs through our zipping proxy
        portal.util.FileDownloader.downloadFile('downloadGMLAsZip.do', downloadParameters);
    }
});