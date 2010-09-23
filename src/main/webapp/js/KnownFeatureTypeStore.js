/**
 * An extension of a normal JSON store that makes it specialize into storing and retrieving CSWRecord's
 */
KnownFeatureTypeStore = function(url) {
	var conn = new Ext.data.Connection({
		url: url, 
		timeout:180000
	});
	
	KnownFeatureTypeStore.superclass.constructor.call(this, {
		proxy			: new Ext.data.HttpProxy(conn),
		storeId			: 'knownFeatureTypeRecordStore',
		root			: 'records',
		id				: 'featureTypeName',
		successProperty	: 'success',
		messageProperty : 'msg',
		fields			: [
		    'featureTypeName',
		    'displayName',
		    'description',
		    'proxyUrl',
		    'iconUrl',
		    'iconAnchor',
		    'infoWindowAnchor',
		    'iconSize'
		]
	});
};


Ext.extend(KnownFeatureTypeStore, Ext.data.JsonStore, {
	/**
	 * Gets a KnownFeatureType object representation of the record at the specified location
	 */
    getKnownFeatureTypeAt		: function(index) {
		var dataRecord = KnownFeatureTypeStore.superclass.getAt.call(this,index);
		if (!dataRecord) {
			return null;
		}
		
		return new KnownFeatureType(dataRecord);
	},

	/**
	 * Gets a KnownFeatureType object representation of the record with the specified id
	 */
	getKnownFeatureTypeById	: function(id) {
		var dataRecord = KnownFeatureTypeStore.superclass.getById.call(this, id);
		if (!dataRecord) {
			return null;
		}
		
		return new KnownFeatureType(dataRecord);
	}
});