/**
 *
 * Function class to handle Geotransect WMS. Method are exposed as public static method as they represent functions rather then Objects.
 */

Ext.define('portal.layer.querier.wms.type.Geotransect',{
   url: null,
   wmsOnlineResource: null,
   map: null,
   latlng: null,
   queryTarget: null,
   geoserverURL:null,

   GETSEISMICSECTIONS : "/geotransect-dataservices/getSeismicSections.json?",

   GETSEGYDATASETS : "/geotransect-dataservices/getSEGYDatasets.json?",

    constructor : function(config) {
        this.url=config.url;
        this.wmsOnlineResource=config.wmsOnlineResource;
        this.map=config.map;
        this.latlng=config.latlng;
        this.queryTarget=config.queryTarget;

        var str = this.wmsOnlineResource.get('url').slice( ("http://").length);
        this.geoserverURL='http://' + str.slice(0,str.indexOf("/"));
    },
//    statics : {
        /**
         * Function to handle Geotransect record. lineId is extracted from returned result made via the ajax request
         *
         * @param url - the url to where the wms service is located
         * @param wmsOnlineResource - portal.csw.OnlineResource that holds wms online resource
         * @param map - a handler to the map map object used by the renderer
         * @param queryTarget - portal.layer.querier.QueryTarget
         * @param callback - function used for callback, normally to present the data
         */
        handleGeotransectWmsRecord : function(callback){
            var me = this;
            Ext.Ajax.request({
                url: me.url+"&INFO_FORMAT=application/vnd.ogc.gml",
                timeout     : 180000,
                callback    : callback,
                wmsOnlineResource : me.wmsOnlineResource,
                queryTarget : me.queryTarget,
                success: function(response, options) {
                    if ((response.responseText).toLowerCase().indexOf('<gml:featuremember>') > 0) {

                        //Parse the response
                        var XmlDoc = GXml.parse(response.responseText);
                        if (g_IsIE) {
                          XmlDoc.setProperty("SelectionLanguage", "XPath");
                        }
                        var rootNode = XmlDoc.documentElement;
                        if (!rootNode) {
                          return;
                        }

                        var schemaLoc = rootNode.getAttribute("xsi:schemaLocation");

                        var reqTypeName = schemaLoc.substring(schemaLoc.indexOf("typeName")+9,
                                schemaLoc.indexOf(' ', schemaLoc.indexOf("typeName")+9));
                        //Browser may have replaced certain characters
                        reqTypeName = reqTypeName.replace("%3A", ":");

                        //Extract the line Id from the XML
                        var line = rootNode.getElementsByTagName("gt:LINE");
                        if(line === null || line.length <= 0) {
                            //Chrome, Opera may not want the namespace prefix
                            line = rootNode.getElementsByTagName("LINE");
                        }

                        // Change to enable the SURV_LINE which is the key in the shapefile
                            if(line === null || line.length <= 0) {
                                line = rootNode.getElementsByTagName("gt:SURV_LINE");
                                if(line == null || line.length <= 0) {
                                    line = rootNode.getElementsByTagName("SURV_LINE");
                                }
                            }

                            //Get the line
                            var lineId = "";
                            if(line !== null && line.length > 0) {
                                if(document.all) { //IE
                                    lineId = line[0].text;
                                } else {
                                    lineId = line[0].textContent;
                                }

                                //Remove the prefixes - we dont store them in the DB
                                if(lineId.indexOf("cdp") === 0) {
                                    lineId = lineId.substring(3, lineId.length);
                                }

                                //var infoWindow = new GeotransectsInfoWindow(latlng, map, lineId, options.cswRecord, options.wmsOnlineResource, url);
                                var allComponents=me._getWMSComponent(lineId);
                                options.callback(this, allComponents, options.queryTarget);
                                //infoWindow.show();
                            } else {
                                alert("Remote server returned an unsupported response.");
                            }

                        }
                },
                failure: function(response, options) {
                    Ext.Msg.alert('Error requesting data', 'Error (' +
                            response.status + '): ' + response.statusText);
                }
            });
        },


        /**
         * Helper function use to return components which can be used by the
         * callback function(portal.layer.querier.QueryTargetHandler._queryCallback).
         */
        _getWMSComponent : function(lineId){
            var allComponents = [];
            var tab1=this._getGeotransectTab1(lineId);
            var tab2=this._getGeotransectTab2(lineId);

            allComponents.push(tab1);
            allComponents.push(tab2);
            return allComponents;

        },//end of getWMSComponent

        _getGeotransectTab1 : function(iLineId){
            var cswRecord=this.queryTarget.get('layer').get('source').getRelatedCSWRecordsByKeywords(iLineId);

            var tab1= Ext.create('portal.layer.querier.BaseComponent',{
                        xtype : 'fieldset',
                        border : false,
                        autoScroll:true,
                        labelWidth: 75,
                        layout:'anchor',

                        items : [{
                            xtype : 'displayfield',
                            fieldLabel : 'ID',
                            value : '<a href="'+ this.queryTarget.get('cswRecord').get('recordInfoUrl') +'" TARGET=_blank>' + iLineId + '</a>'
                        },{
                            xtype : 'textarea',
                            fieldLabel : 'Description',
                            readOnly : true,
                            anchor : '100%',
                            height : 200,
                            value :  cswRecord[0].get('description') ,
                        },{
                            xtype : 'displayfield',
                            fieldLabel : 'HighRes Service URL',
                            value : cswRecord[0].get('onlineResources')[0].get('url')
                        },{
                            xtype : 'displayfield',
                            fieldLabel : 'HighRes Layer Name',
                            value : cswRecord[0].get('onlineResources')[0].get('name')
                        }]
                    });
            return tab1;
        },

        _getGeotransectTab2 : function(iLineId){

            var gsURL = this.geoserverURL;
            gsURL += this.GETSEISMICSECTIONS;
            gsURL += "lineId="+iLineId;

            var value = this._getGeotransectData(gsURL);
            var test = null;

        },

        _getGeotransectData : function(url){
            var me = this;

            Ext.Ajax.request({
                url: 'requestGeotransectsData.do',
                timeout     : 180000,
                params      : {
                    serviceUrl      : url
                },
                success: function(response, options) {
                    var responseObj;
                    try {
                        responseObj = Ext.JSON.decode(Ext.JSON.decode(response.responseText).json);
                    }
                    catch (err) {
                        me.mask.hide();
                        Ext.Msg.alert('Error downloading data', 'There was an error whilst communicating with the geotransects data server');
                        return;
                    }

                    //Generate an error / success fragment to display to the user
                    if (!responseObj.result.success) {
                        me.mask.hide();
                        Ext.Msg.alert('Error downloading data', 'The service returned a failure result status ' + url);
                        return;
                    }


                    //Parse records and download the data
                    var values = [responseObj.items.length];
                    for (var i = 0; i < responseObj.items.length; i++) {
                        values[i] = responseObj.items[i].url;
                    }
                    //TODO: VT - some way perhaps to return this value else might need to slightly modify this file.
                    //me._getGeotransectTab2(values);

                },
                failure: function(response, options) {
                    Ext.Msg.alert('Error requesting data', 'Error (' + response.status + '): ' + response.statusText);
                    me.mask.hide();
                }
            });

        }

//    } //end of statics

});