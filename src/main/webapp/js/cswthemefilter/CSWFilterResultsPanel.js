/**
 * A Ext.grid.GridPanel specialisation for allowing the user to browse
 * a CSW service with a configured filter.
 *
 * The filter is designed to be generated from a CSWThemeFilterForm
 */
CSWFilterResultsPanel = Ext.extend(Ext.grid.GridPanel, {


    cswRecordStore : null,
    filterParams : null,

    /**
     * Constructor for this class, accepts all configuration options that can be
     * specified for a Ext.grid.GridPanel as well as the following values
     * {
     *  filterParams : An object containing filter parameters (generate this from a CSWThemeFilterForm)
     * }
     */
    constructor : function(cfg) {
        var cswFilterResultsPanel = this;

        this.filterParams = cfg.filterParams;
        this.cswRecordStore = new CSWRecordStore('getFilteredCSWRecords.do', cfg.filterParams);

        var initialLoadParams = Ext.apply(this.filterParams, {
            limit : 10,
            start : 0
        })
        this.cswRecordStore.load(initialLoadParams);

        //Build our configuration object
        Ext.apply(cfg, {
            cm : new Ext.grid.ColumnModel([{
                id : 'title',
                dataIndex : 'serviceName',
                renderer : function(value, p, record) {
                    return String.format('<div><b>{0}</b></div>', value);
                }
            }]),
            store : this.cswRecordStore,
            sm : new Ext.grid.RowSelectionModel({
                singleSelect : false
            }),
            loadMask : {msg : 'Performing CSW Filter...'},
            viewConfig : {
                forceFit : true,
                enableRowBody:true,
                showPreview:true,
                getRowClass : function(record, rowIndex, p, ds){
                    if(this.showPreview){
                        p.body = '<p style="margin:5px 10px 10px 25px;color:#555;">'+record.data.dataIdentificationAbstract+'</p>';
                        return 'x-grid3-row-expanded';
                    }
                    return 'x-grid3-row-collapsed';
                }
            },
            bbar : new Ext.PagingToolbar({
                pageSize: 10,
                store: this.cswRecordStore,
                displayInfo : true,
                displayMsg : 'Displaying records {0} - {1} of {2}',
                emptyMsg: 'No records pass the specified filter(s)'
            })

        });

        //Call parent constructor
        CSWFilterResultsPanel.superclass.constructor.call(this, cfg);
    }
});