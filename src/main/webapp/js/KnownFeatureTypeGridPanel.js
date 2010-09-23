/**
 * An extension of a normal GridPanel that makes it specialize into rendering a KnownFeatureTypeStore
 * 
 * 
 * title 			: The title this grid panel will display
 * map   			: the GMap2 instance
 * knownFeatureTypeStore 	: an instance of KnownFeatureTypeStore that will be used to populate this panel
 * addLayerHandler	: function(KnownFeatureType) This will be called when the user adds a layer. 
 * visibleKftHandler: function(record) This will be called to filter every visible KnownFeatureType 
 * showBoundsHandler: function(KnownFeatureType) called when the user wants to see a brief highlight of the records bounds
 * moveToBoundsHandler: function(KnownFeatureType) called when the user wants to find the location of the record bounds
 *                    
 */
KnownFeatureTypeGridPanel = function(id, title, knownFeatureTypeStore, addLayerHandler, visibleKftHandler, showBoundsHandler, moveToBoundsHandler) {
	this.addLayerHandler = addLayerHandler;
	
	//This is so we can reference our search panel
	var searchPanelId = id + '-search-panel';
	
	
	var rowExpander = new Ext.grid.RowExpander({
        tpl : new Ext.Template('<p>{description} </p><br>')
    });
	
	KnownFeatureTypeGridPanel.superclass.constructor.call(this, {
        stripeRows       : true,
        autoExpandColumn : 'title',
        plugins          : [ rowExpander ],
        viewConfig       : {scrollOffset: 0, forceFit:true},
        title            : title,
        region           :'north',
        split            : true,
        height           : 160,
        //width: 80,
        autoScroll       : true,
        store            : knownFeatureTypeStore,
        columns: [
            rowExpander,
            {
                id:'title',
                header: "Title",
                width: 80,
                sortable: true,
                dataIndex: 'displayName'
            },{
            	id:'search',
            	header: '',
            	width: 45,
            	dataIndex: 'proxyUrl', //this isn't actually rendered in this column
            	resizable: false,
            	menuDisabled: true,
            	sortable: false,
            	fixed: true,
            	renderer: function (value, metadata, record) {
            		//Assume every known feature type will have at least one visible bbox
            		return '<img src="img/magglass.gif"/>';
            	}
            }
        ],
        bbar: [{
            text:'Add Layer to Map',
            tooltip:'Add Layer to Map',
            iconCls:'add',
            pressed: true,
            scope: this,
            handler: function() {
                var kftToAdd = new KnownFeatureType(this.getSelectionModel().getSelected());
                addLayerHandler(kftToAdd);
            }
        }],
        
        tbar: [
               'Search: ', ' ',
               new Ext.ux.form.ClientSearchField({
                   store: knownFeatureTypeStore,
                   width:200,
                   id:searchPanelId,
                   fieldName:'displayName'
               }), {
              	   	xtype:'button',
               	   	text:'Visible',
               	   	handler:function() {
               	   		var searchPanel = Ext.getCmp(searchPanelId);
               	   		searchPanel.runCustomFilter('<visible layers>', visibleKftHandler);
                  		}
               }
           ],
        listeners: {
           	cellclick : function (grid, rowIndex, colIndex, e) {
               	var fieldName = grid.getColumnModel().getDataIndex(colIndex);
               	if (fieldName !== 'proxyUrl') {
               		return;
               	}
               	
               	e.stopEvent();
               	
               	showBoundsHandler(grid.getStore().getKnownFeatureTypeAt(rowIndex));
           	},
           	
           	celldblclick : function (grid, rowIndex, colIndex, e) {
               	var record = grid.getStore().getAt(rowIndex);
               	var fieldName = grid.getColumnModel().getDataIndex(colIndex);
               	if (fieldName !== 'proxyUrl') {
               		return;
               	}
               	
               	e.stopEvent();
               	
               	moveToBoundsHandler(grid.getStore().getKnownFeatureTypeAt(rowIndex));
           	}
        }
    });
};

KnownFeatureTypeGridPanel.prototype.addLayerHandler = null;

Ext.extend(KnownFeatureTypeGridPanel, Ext.grid.GridPanel, {
	/**
	 * Whenever the internal datastore changes, update our filtered copy
	 */
	internalOnDataChanged : function(store) {
		this.getStore().copyFrom(store, this.cswRecordFilter);
	}
});