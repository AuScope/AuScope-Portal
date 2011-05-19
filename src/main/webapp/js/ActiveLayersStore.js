/**
 * A specialized store for holding "Active" layers that will come from individual CSWRecords or KnownFeatureTypes
 */
ActiveLayersStore = function() {	
	ActiveLayersStore.superclass.constructor.call(this, {
	    storeId     : 'active-layers-store',
		reader		: new Ext.data.JsonReader({
			idProperty		: 'id',
			root			: 'records',
			fields 			: [
			    {   name	: 'id'              },	//String: The unique ID of this active layer.
	            {   name	: 'title'           },	//String: Text appears under the title column
			    {   name	: 'featureTypes'    },	//[FeatureType]: Objects that represent the content of this layer
			    {	name	: 'webServices'		},	//[WebService]: Objects that represent the content of this layer 
			    {   name	: 'iconUrl'         },	//String: The raw URL pointing to an appropriate image icon (used for WFS) 
			    {   name	: 'isLoading' 		},	//boolean: Whether this layer is currently 'loading'
			    {   name	: 'layerVisible'    },	//boolean: Whether the layer is currently visible
		    ]
		})
	});
};


Ext.extend(ActiveLayersStore, Ext.data.Store, {
	/**
	 * Not for usage outside this class
	 */
	internalAddSingleRecord : function(recObj) {
		var data  = {
			success : true,
			records : [recObj]
		};
		
		ActiveLayersStore.superclass.loadData.call(this, data, true);
	},
	
	addInformationModelDescription : function(describeInformationModel) {
		this.internalAddSingleRecord({
			id : describeInformationModel.getInformationModel().getUrn(),
			title : describeInformationModel.getInformationModel().getName(),
			informationModel : describeInformationModel.getInformationModel(),
			featureTypes : describeInformationModel.getFeatureTypes(),
			webServices : describeInformationModel.getWebServices(),
			iconUrl : 'http://maps.google.com/mapfiles/kml/paddle/pink-blank.png',
			isLoading : false,
			layerVisible : true
		});
		
		var rec =  ActiveLayersStore.superclass.getById.call(this, describeInformationModel.getInformationModel().getUrn());
		if (rec) {
			return new ActiveLayersRecord(rec);
		} else {
			return null;
		}
	},
	
	/**
	 * Removes the specified activeLayersRecord from this store
	 */
	removeActiveLayersRecord : function(activeLayersRecord) {
		if (activeLayersRecord) {
			ActiveLayersStore.superclass.remove.call(this, activeLayersRecord.internalRecord);
		}
	},
	
	/**
	 * Get the ActiveLayersRecord at the specified index (or null)
	 */
	getActiveLayerAt : function(index) {
		var rec = ActiveLayersStore.superclass.getAt.call(this, index);
		if (rec) {
			return new ActiveLayersRecord(rec);
		}
		return null;
	},
	
	/**
	 * Get the ActiveLayersRecord represented by InformationModelRecord or NULL
	 */
	getByInformationModelRecord : function(informationModelRecord) {
		var rec = ActiveLayersStore.superclass.getById.call(this, informationModelRecord.getUrn());
		if (rec) {
			return new ActiveLayersRecord(rec);
		}
		return null;
	}
});