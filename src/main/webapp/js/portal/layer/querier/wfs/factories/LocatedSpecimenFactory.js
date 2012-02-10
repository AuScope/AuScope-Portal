/**
 * A factory for parsing a sa:LocatedSpecimen element.
 */
Ext.define('portal.layer.querier.wfs.factories.LocatedSpecimenFactory', {
    extend : 'portal.layer.querier.wfs.factories.BaseFactory',

    /**
     * Accepts all GenericParser.Factory.BaseFactory configuration options
     */
    constructor : function(cfg) {
        this.callParent(arguments);
    },

    supportsNode : function(domNode) {
        return domNode.namespaceURI === this.XMLNS_SA &&
            portal.util.xml.SimpleDOM.getNodeLocalName(domNode) === 'LocatedSpecimen';
    },

    /**
     * Generates a panel containing all located specimen observations
     */
    parseNode : function(domNode, wfsUrl, rootCfg) {
        //Lookup various fields via xPath
        var gmlId = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, '@gml:id');
        var allAnalyteNodes = portal.util.xml.SimpleXPath.evaluateXPathNodeArray(domNode, 'sa:relatedObservation/om:Observation/om:result/swe:Quantity/gml:name');
        var materialClass = portal.util.xml.SimpleXPath.evaluateXPathString(domNode, 'sa:materialClass');

        if (!materialClass) {
            materialClass = '';
        }

        var allAnalytes = [];
        for (var i = 0; i < allAnalyteNodes.length; i++) {
            allAnalytes.push(portal.util.xml.SimpleDOM.getNodeTextContent(allAnalyteNodes[i]));
        }

        //This store will hold our parsed located specimen
        var locSpecStore = Ext.create('Ext.data.Store', {
            model : 'portal.knownlayer.yilgarngeochem.LocatedSpecimen',
            proxy : {
                type : 'ajax',
                url: 'doLocatedSpecimenFeature.do',
                timeout: 180000,
                extraParams: {
                    serviceUrl : wfsUrl,
                    featureId : gmlId
                }
            },
            reader: {
                type : 'array'
            },
            groupField : 'analyteName',
            sorters : ['analyteName']
        });

        //Build our component
        Ext.apply(rootCfg, {
            layout : 'fit',
            listeners : {
                afterrender : function(cmp) {
                    var loadMask = new Ext.LoadMask(cmp.getEl(), {
                        removeMask : true
                    });
                    loadMask.show();
                    Ext.Ajax.request( {
                        url : 'doLocatedSpecimenFeature.do',
                        callingInstance : this,
                        params : {
                            serviceUrl : wfsUrl,
                            featureId : gmlId
                        },
                        failure: function (response, options){
                            loadMask.hide();
                            Ext.Msg.alert('Error Describing LocSpecimen Records', 'Error (' + response.status + '): ' + response.statusText);
                        },
                        success: function (response, options) {
                            loadMask.hide();
                            var jsonData = Ext.util.JSON.decode(response.responseText);
                            if (!jsonData.success) {
                                Ext.Msg.alert('Error Describing LocSpecimen Records', 'There was an error whilst communicating with ' + wfsUrl);
                                return;
                            } else if (jsonData.data.records.length === 0) {
                                Ext.Msg.alert('Error Describing LocSpecimen Records', 'The URL ' + wfsUrl + ' returned no parsable LocatedSpecimen records');
                                return;
                            }

                            var records = jsonData.data.records;
                            var recordItems = [];
                            for (var i = 0; i < records.length ; i++) {
                                recordItems.push([
                                        records[i].analyteName,
                                        records[i].analyteValue,
                                        records[i].uom,
                                        records[i].analyticalMethod,
                                        records[i].labDetails,
                                        records[i].date,
                                        records[i].preparationDetails,
                                        i
                                    ]);
                            }

                            locSpecStore.loadData(recordItems);
                        }
                    });
                }
            },
            items : [{
                xtype : 'grid',
                store : locSpecStore,
                frame:true,
                columnLines: true,
                iconCls:'icon-grid',
                colModel:new Ext.grid.ColumnModel({
                    defaults: {
                        sortable: true // columns are not sortable by default
                    },
                    columns: [{
                        id: 'analyteName',
                        header: 'Analyte',
                        dataIndex: 'analyteName',
                        width: 100
                    },{
                        header: 'Value',
                        dataIndex: 'analyteValue',
                        width: 100
                    },{
                        header: 'Unit Of Measure',
                        dataIndex: 'uom',
                        width: 100
                    },{
                        header: 'Analytical Method',
                        dataIndex: 'analyticalMethod',
                        width: 100
                    },{
                        header: 'Lab Details',
                        dataIndex: 'labDetails',
                        width: 100
                    },{
                        header: 'Analysis Date',
                        dataIndex: 'analysisDate',
                        width: 100
                    },{
                        header: 'Preparation Details',
                        dataIndex: 'preparationDetails',
                        width: 200
                    }]
                }),
                view: new Ext.grid.GroupingView({
                    forceFit: true,
                    groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
                }),
                tbar: [
                    'Select Analyte: ',
                    new Ext.ux.form.ClearableComboBox({
                        store: allAnalytes,
                        width:200,
                        typeAhead: true,
                        forceSelection: true,
                        listeners:{
                            select : function(combo, record, index){
                                //This will occur if our field is cleared
                                if (record == null) {
                                    locSpecStore.filter('analyteName', '', false, false);
                                } else {
                                    var selectedMineral = record.get('field1'); //TODO change to a proper field name
                                    locSpecStore.filter('analyteName', selectedMineral, false, false);
                                }
                            }
                        }
                    }),
                    {xtype: 'tbfill'},
                    'Material Description: ',
                    materialClass]
            }]
        });

        return Ext.create('portal.layer.querier.BaseComponent', rootCfg);
    }
});