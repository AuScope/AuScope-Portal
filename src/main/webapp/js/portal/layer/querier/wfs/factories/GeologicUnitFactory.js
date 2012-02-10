/**
 * A factory for parsing a gsml:GeologicUnit element.
 */
Ext.define('portal.layer.querier.wfs.factories.GeologicUnitFactory', {
    extend : 'portal.layer.querier.wfs.factories.BaseFactory',

    /**
     * Accepts all GenericParser.Factory.BaseFactory configuration options
     */
    constructor : function(cfg) {
        this.callParent(arguments);
    },

    supportsNode : function(domNode) {
        return domNode.namespaceURI === this.XMLNS_GSML_2 &&
            portal.util.xml.SimpleDOM.getNodeLocalName(domNode) === 'GeologicUnit';
    },

    /**
     * Generates a simple tree panel that represents the specified node
     */
    parseNode : function(domNode, wfsUrl, rootCfg) {
        //Lookup various fields via xPath
        var gmlId = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, '@gml:id');
        var coords = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'gsml:occurrence/gsml:MappedFeature/gsml:shape/gml:Point');
        var obsMethod = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'gsml:occurrence/gsml:MappedFeature/gsml:observationMethod/gsml:CGI_TermValue/gsml:value[@codeSpace=\'www.ietf.org/rfc/rfc1738\']');
        var rockMaterial = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'gsml:composition/gsml:CompositionPart/gsml:material/gsml:RockMaterial/gsml:lithology/@xlink:href');
        var proportion = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'gsml:composition/gsml:CompositionPart/gsml:proportion/gsml:CGI_TermValue/gsml:value');
        var weatheringDesc = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'gsml:weatheringCharacter/gsml:WeatheringDescription/gsml:weatheringProduct/gsml:RockMaterial/gsml:lithology/@xlink:href');

        //Figure out our located specimen id
        var geoUnitPrefix = 'geologicUnit_';
        var locSpecimenFeatureId = 'locatedSpecimen_' + gmlId.substring(geoUnitPrefix.length);

        var geoUnitFact = this;

        //Build our component
        Ext.apply(rootCfg, {
            border : false,
            items : [{
                xtype : 'fieldset',
                title : 'Geologic Unit',
                items : [{
                    xtype : 'label',
                    fieldLabel : 'Name',
                    html : this._makeWFSPopupHtml(wfsUrl, 'gsml:GeologicUnit', gmlId, gmlId, 'Click here to open a styled view of this feature.')
                },{
                    xtype : 'label',
                    fieldLabel : 'Location',
                    text : coords
                },{
                    xtype : 'label',
                    fieldLabel : 'Observation Method',
                    html : this._makeVocabPopupHtml('CGI/' + obsMethod, obsMethod, 'Click here to view the SISSVoc concept definition.')
                },{
                    xtype : 'label',
                    fieldLabel : 'Rock Material',
                    html : this._makeVocabPopupHtml('CGI/' + rockMaterial, rockMaterial, 'Click here to view the SISSVoc concept definition.')
                },{
                    xtype : 'label',
                    fieldLabel : 'Proportion',
                    html : this._makeVocabPopupHtml('CGI/' + proportion, proportion, 'Click here to view the SISSVoc concept definition.')
                },{
                    xtype : 'label',
                    fieldLabel : 'Weathering Description',
                    text : weatheringDesc
                }]
            }],
            buttonAlign : 'right',
            buttons : [{
                xtype : 'button',
                text : 'Download Chemistry',
                iconCls : 'download',
                handler : function() {
                    //Generate our URL (with params) and make the download
                    var key = 'serviceUrls';
                    var locSpecLink=window.location.protocol + "//" + window.location.host + WEB_CONTEXT + "/" + "requestFeature.do" + "?" +
                    "serviceUrl=" + wfsUrl + "&typeName=" + "sa:LocatedSpecimen" +
                    "&featureId=" + locSpecimenFeatureId;

                    var geoLink = window.location.protocol + "//" + window.location.host + WEB_CONTEXT + "/" + "requestFeature.do" + "?" +
                        "serviceUrl=" + wfsUrl + "&typeName=" + "gsml:GeologicUnit" +
                        "&featureId=" + gmlId;

                    var url = 'downloadGMLAsZip.do?';
                    url += '&' + key + '=' + escape(locSpecLink);
                    url += '&' + key + '=' + escape(geoLink);

                    FileDownloader.downloadFile(url);
                }
            },{
                xtype : 'button',
                text : 'Chemistry Details',
                iconCls : 'info',
                handler : function() {
                    var wfsParser = new GenericParser.WFSParser({
                        wfsUrl : wfsUrl,
                        typeName : 'sa:LocatedSpecimen',
                        featureId : locSpecimenFeatureId,
                        rootCfg : {
                            autoScroll : true
                        }
                    });

                    wfsParser.makeWFSRequest(function(wfsParser, rootCmp) {
                        if (rootCmp) {
                            var popup = Ext.create('Ext.Window', {
                                title: 'Specimen Chemical Analyses',
                                layout : 'fit',
                                width : 1000,
                                height : 500,
                                items : [rootCmp]
                            });
                            popup.show();
                        }
                    });
                }
            }]
        });
        return Ext.create('portal.layer.querier.BaseComponent', rootCfg);
    }
});