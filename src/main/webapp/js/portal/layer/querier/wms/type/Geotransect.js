/**
 *
 * Function class to handle Geotransect WMS. Method are exposed as public static method as they represent functions rather then Objects.
 */

Ext.define('portal.layer.querier.wms.type.Geotransect',{

    statics : {
        /**
         * Function to handle Geotransect record. lineId is extracted from returned result made via the ajax request
         *
         * @param url - the url to where the wms service is located
         * @param wmsOnlineResource - portal.csw.OnlineResource that holds wms online resource
         * @param map - a handler to the map map object used by the renderer
         * @param queryTarget - portal.layer.querier.QueryTarget
         * @param callback - function used for callback, normally to present the data
         */
        handleGeotransectWmsRecord : function(url,wmsOnlineResource, map, latlng, queryTarget, callback){
            Ext.Ajax.request({
                url: url+"&INFO_FORMAT=application/vnd.ogc.gml",
                timeout     : 180000,
                callback    : callback,
                wmsOnlineResource : wmsOnlineResource,
                queryTarget : queryTarget,
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
                                var allComponents=portal.layer.querier.wms.type.Geotransect._getWMSComponent(latlng, map, lineId, options.wmsOnlineResource, url,queryTarget);
                                callback(this, allComponents, queryTarget);
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
        _getWMSComponent : function(iLatlng, iMap, iLineId, iOnlineResource, iUrl,queryTarget){
            var cswRecord=queryTarget.get('layer').get('source').getRelatedCSWRecordsByKeywords(iLineId);

            var tab1={
                    border : false,
                    layout : 'fit',
                    items : [{
                        xtype : 'fieldset',
                        title : 'GeoTransact',
                        labelWidth: 75,
                        items : [{
                            xtype : 'displayfield',
                            fieldLabel : 'ID',
                            value : iLineId
                        },{
                            xtype : 'displayfield',
                            fieldLabel : 'Description',
                            value : cswRecord[0].get('description')
                        }]
                    }]
                };

            var allComponents = [];
            allComponents.push(tab1);
            return allComponents;

        }//end of getWMSComponent

    }

});