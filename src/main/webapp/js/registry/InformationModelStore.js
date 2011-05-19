/**
 * An extension of a normal JSON store that makes it specialize into storing and retrieving InformationModelRecord's
 */
InformationModelStore = function(url) {
	var conn = new Ext.data.Connection({
		url: url, 
		timeout:180000
	});
	
	InformationModelStore.superclass.constructor.call(this, {
		proxy			: new Ext.data.HttpProxy(conn),
		sortInfo		: {
			field			: 'name',
			direction		: 'ASC'
		},
		reader			: new Ext.data.JsonReader({
			root			: 'data',
			id				: 'urn',
			successProperty	: 'success',
			messageProperty : 'msg',
			fields			: [
			    'urn',
			    'name',
			    'vocabularyUrns',
			    'featureTypeUrns'
			]
		})
	});
};


Ext.extend(InformationModelStore, Ext.data.GroupingStore, {
	/**
	 * Gets a CSWRecord object representation of the record at the specified location
	 */
    getInformationModelRecordAt	: function(index) {
		var dataRecord = InformationModelStore.superclass.getAt.call(this,index);
		if (!dataRecord) {
			return null;
		}
		
		return new InformationModelRecord({dataStoreRecord:dataRecord});
	},

	/**
	 * Gets a CSWRecord object representation of the record with the specified id
	 */
	getInformationModelRecordById	: function(id) {
		var dataRecord = InformationModelStore.superclass.getById.call(this, id);
		if (!dataRecord) {
			return null;
		}
		
		return new InformationModelRecord({dataStoreRecord:dataRecord});
	}
});