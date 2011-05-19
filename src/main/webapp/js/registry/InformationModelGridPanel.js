/**
 * An extension of a normal GridPanel that makes it specialize into rendering a InformationModelStore
 *
 * id				: unique ID to identify this grid
 * title 			: The title this grid panel will display
 * informationModelStore 	: an instance of InformationModelStore that will be used to populate this panel
 * addLayerHandler	: function(InformationModelRecord) This will be called when the user adds a layer.
 *
 */
InformationModelGridPanel = function(id, title, description, informationModelStore, addLayerHandler) {
	this.addLayerHandler = addLayerHandler;
	
	InformationModelGridPanel.superclass.constructor.call(this, {
		id				 : id,
        stripeRows       : true,
        autoExpandColumn : 'title',
        viewConfig       : {scrollOffset: 0, forceFit:true},
        title            : '<span qtip="' + description + '">' + title + '</span>',
        region           :'north',
        split            : true,
        height           : 160,
        autoScroll       : true,
        store            : informationModelStore,
        columns: [{
                id:'title',
                header: "Title",
                sortable: true,
                dataIndex: 'name'
            },{
            	id : 'recordType',
            	header : '',
            	width: 18,
            	dataIndex: 'vocabularyUrns',
            	renderer: function(value, metadata, record) {
            		return '<div style="text-align:center"><img src="img/binary.png" width="16" height="16" align="CENTER"/></div>';
            	}
            }
        ],
        bbar: [{
            text:'Add Layer to Map',
            tooltip:'Add Layer to Map',
            iconCls:'add',
            pressed:true,
            scope:this,
            handler: function() {
        		var recordToAdd = new InformationModelRecord(this.getSelectionModel().getSelected());
        		addLayerHandler(recordToAdd);
        	}
        }],
        listeners: {
        	cellclick : function (grid, rowIndex, colIndex, e) {
            	var fieldName = grid.getColumnModel().getDataIndex(colIndex);
            	var record = grid.getStore().getInformationModelRecordAt(rowIndex);
            	if (fieldName === 'vocabularyUrns') {
            		e.stopEvent();

            		//Close an existing popup
            		if (this.onlineResourcesPopup && this.onlineResourcesPopup.isVisible()) {
            			this.onlineResourcesPopup.close();
            		}

            		this.onlineResourcesPopup = new InformationModelDescriptionWindow(record);
            		this.onlineResourcesPopup.show(e.getTarget());
            	}
        	}
        }
    });

};

Ext.extend(InformationModelGridPanel, Ext.grid.GridPanel, {
	
});