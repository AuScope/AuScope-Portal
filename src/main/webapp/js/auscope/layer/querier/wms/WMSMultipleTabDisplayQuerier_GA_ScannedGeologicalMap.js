/**
 * Sub-Class for making and then parsing a WMS request/response for WMSGetFeatureRequests on Geological Maps / Scanned 250K Geological Map index.
 * Then render each field in a tab in the panel / window.
 */
Ext.define('portal.layer.querier.wms.WMSMultipleTabDisplayQuerier_GA_ScannedGeologicalMaps', {
    extend: 'portal.layer.querier.wms.WMSMultipleTabDisplayQuerier',

    constructor: function(config){
        this.callParent(arguments);
    },

    getFieldNameMappingMap : function() {
        var fieldNameMappingMap = {
                QMAPID: "1:250K Map ID",
                QMAPNAME: "1:250K Tile Name",
                EDITION: "Edition",
                PUBYEAR: "Publication Year",
                LOCN125: "View / Download Map image 125dpi",
                LOCN250: "View / Download Map image 250dpi",
                LABEL: "Map Title"
        };
        return fieldNameMappingMap;
    },
    
    getTabTitleMappedName : function() {
        return 'Map Title';
    },
    
    populateFeatureFieldsDisplayArray : function(featureFieldsArray, featureFieldsDisplayArray) {
        for (var i = 0; i < featureFieldsArray.length; i++) {
            var record = {};
            var order = []; // Order want to retrieve field from record map
            record['order'] = order;
            featureFieldsDisplayArray.push(record);

            var tile = featureFieldsArray[i];
            
            var mapTitle = this._lookupTileData(tile, "LABEL");
            record[mapTitle[0]] = mapTitle[1];
            order.push(mapTitle[0]);

            var mapId = this._lookupTileData(tile, "QMAPID");
            record[mapId[0]] = mapId[1];
            order.push(mapId[0]);
            
            var tileName = this._lookupTileData(tile, "QMAPNAME");
            record[tileName[0]] = tileName[1];
            order.push(tileName[0]);
            
            var edition = this._lookupTileData(tile, "EDITION");
            record[edition[0]] = edition[1];
            order.push(edition[0]);
            
            var pubYear = this._lookupTileData(tile, "PUBYEAR");
            record[pubYear[0]] = pubYear[1];
            order.push(pubYear[0]);
            
            var pubAgency = "";
            if (tile.data['AGENCY1']) {
                pubAgency = tile.data['AGENCY1'];
            }
            if (tile.data['AGENCY2']) {
                if (pubAgency.size > 0) {
                    pubAgency += ", ";
                } 
                pubAgency += tile.data['AGENCY2'];
            }
            record["Publishing Agency"] = pubAgency;
            order.push("Publishing Agency");
            
            var location125 = this._lookupTileData(tile, "LOCN125");
            record[location125[0]] = location125[1];
            order.push(location125[0]);
            
            var location250 = this._lookupTileData(tile, "LOCN250");
            record[location250[0]] = location250[1];
            order.push(location250[0]);
        }
    },
    
    _lookupTileData : function(featureFields, fieldName) {
        return [this._fieldNameMapping(fieldName), featureFields.data[fieldName]];
    }
});