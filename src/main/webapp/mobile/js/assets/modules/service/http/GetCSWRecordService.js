/**
 * Service class related to handling all things related to making http cswrecords
 * @module http
 * @class GetCSWRecordService
 * 
 */
allModules.service('GetCSWRecordService',['$http','$q',function ($http,$q) {
     var promise; 
     
     var allKnownLayers;

     var searchedLayers;
     /**
      * Retrieve knownlayer csw records async
      * @method getCSWKnownLayers
      * @return promise - a promise of the csw records when it has complete
      */
     this.getCSWKnownLayers = function(){    
         if ( !promise ) {
                promise = $http.get('../getKnownLayers.do').then(function (response) {
                    var data = response.data.data;
                    var cswRecords = {};
                    
                    data.forEach(function(item, i, ar){ 
                        if(cswRecords[item.group]===undefined){
                            cswRecords[item.group] = [];
                        }
                        cswRecords[item.group].push(item);                                                  
                    });
                    
                allKnownLayers = cswRecords;
                
                return cswRecords; 
             });
         }
         return promise;
    }
                 

    /**
     * Search knownlayer csw records name and description with supplied keywords
     * @method searchLayers
     */
    this.searchLayers = function(keywords) {
        if (keywords) {
            searchedLayers = {};
            // search for csw based on record name
            // iterate each of the words that was
            // entered
            var keys = keywords.split(' ');

            for ( var keyIdx in keys) {
                for ( var i in allKnownLayers) {
                    var layerGroup = allKnownLayers[i];

                    // search each layer in the layer
                    // header
                    for ( var j in layerGroup) {
                        var layer = layerGroup[j];
                        var regex = new RegExp(keys[keyIdx], 'i');
                        // matches name or description
                        if (regex.test(layer.name) || regex.test(layer.description)) {
                            if (searchedLayers[layer.group] === undefined) {
                                searchedLayers[layer.group] = [];
                            }
                            searchedLayers[layer.group].push(layer);
                        }
                    }
                }
            }
        } else {
            searchedLayers = null;
        }
    };

    /**
     * Return csw records to be displayed in the layer panel.
     * @method getSearchedLayers
     * @return csw records that match the search, or all known layer csw records if search is empty
     */
    this.getSearchedLayers = function() {
        if (searchedLayers) {
            return searchedLayers;
        }
        return allKnownLayers;
    };

} ]);