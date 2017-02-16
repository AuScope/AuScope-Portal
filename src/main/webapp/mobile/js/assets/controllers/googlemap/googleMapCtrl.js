/**
 * googleMapCtrl class initialises the Google map used to display the main map
 * @module controllers
 * @class googleMapCtrl
 * @param map-div-id the HTML id attribute of the div where the map will be placed
 */
allControllers.controller('googleMapCtrl', ['$scope','$rootScope','$attrs','GoogleMapService','RenderStatusService','$timeout','Constants','UtilitiesService','FilterStateService',
                                            function ($scope,$rootScope,$attrs,GoogleMapService,RenderStatusService,$timeout,Constants,UtilitiesService,FilterStateService) {
    
    $scope.active = {};
    
    $scope.showlayerPanel=false;
    
    // Show permanent link in an input box
    $scope.showPermalink = false;
    
    $scope.zoomDrawActive = false;
    
    // Used to control the map's loading mask
    $scope.mapMaskFlag = false;
    
    GoogleMapService.onDrawZoomStart($scope,function(){
        $scope.zoomDrawActive = true;
    });
    
    GoogleMapService.onDrawZoomEnd($scope,function(){
        $scope.zoomDrawActive = false;
    });
    
    // Register a function that will be called when the website is busy,
    // thus it will enable the map's loading mask
    GoogleMapService.onBusyStart(function(){        
        $scope.mapMaskFlag = true;             
    });
    
    // Register a function that will be called when the website is not busy anymore,
    // thus it will disable the map's loading mask
    GoogleMapService.onBusyEnd(function(){
       // When the user clicks multiple times on many features, this timeout makes sure that the mask is always disabled in the end
       $timeout(function() {           
            $scope.mapMaskFlag = false;         
       },0);

    });
    

    //VT: on a small screen, close the panel after adding the layer
    var mq = window.matchMedia(Constants.smallScreenTest);
    if(mq.matches){
        $scope.$on('layer.add', function (evt,layer) {
            $scope.showlayerPanel=false;
        });
        
        GoogleMapService.onSelectDataStart($scope,function(){
            $scope.showlayerPanel=false;
        });

        GoogleMapService.onSelectDataEnd($scope,function(){
            $scope.showlayerPanel=true;
        });
        
    }

    // Initialise the map with the map's div id parameter
    GoogleMapService.initMap($attrs.mapDivId);


    $scope.floatingGroupStatus = RenderStatusService.getRenderStatus().group;
    
    RenderStatusService.onUpdate($scope, function (newRenderStatus) {
        //VT: Inconsistent API (Sync/Async): https://docs.angularjs.org/error/$rootScope/inprog?p0=$digest
        $timeout(function() {
            $scope.floatingLayerStatus = newRenderStatus;
        },0);
    });
    
    
    $scope.addHeatMapOverlay = function(){
        if(GoogleMapService.heatmap==null){
            var containsPoint = GoogleMapService.addHeatMapOverlay();
            if(!containsPoint){
                alert("No Points rendered on Map yet. Add a point layer to utilize heatmap");
            }
        }else{
            GoogleMapService.removeHeatMapOverlay();
        }
    };
    
    /**
     * Turn on/off drawing of box on map for zooming/panning to an area
     * @method toggleZoomDraw
     */
    $scope.toggleZoomDraw = function(){
        $scope.showPermalink=false;
        if($scope.zoomDrawActive){
            GoogleMapService.zoomDrawCancel();
        }else{
            GoogleMapService.zoomDraw();
        }        
    };

    /**
     * Alternately displays or hides the permanent link
     * If displaying it generates a new permanent link
     * @method togglePermalink
     */
    $scope.togglePermalink = function() {
        GoogleMapService.zoomDrawCancel();
        if ($scope.showPermalink) {
            $scope.showPermalink=false;
        } else {
            // Create a permanent link
            var pLink;
            var currentURL = window.location.href;
            var qpos = currentURL.indexOf("?");
            if (qpos!=-1) {
                pLink = currentURL.substring(0,qpos);
            } else {
                pLink = currentURL;
            }
            // Get state of website
            var currentMapState=GoogleMapService.getMapState();
            var currentFilterState=FilterStateService.getFilterState();
            var uncompStateStr=JSON.stringify({m: currentMapState, f: currentFilterState});
            // Compress the state object
            LZMA.compress(uncompStateStr, 1, function on_compress_complete(result) {
                
                // Encode state in base64 so it can be used in a URL
                var stateStr=UtilitiesService.encode_base64(String.fromCharCode.apply(String, result));
                
                // Assemble and reveal permanent link to user
                $scope.permalink=pLink+"?state="+stateStr;
                $scope.showPermalink=true;
                // Because we are in a non-Angular callback, we must force it to evaluate the changes to $scope
                $scope.$apply();
            });
            
        }
    };
    
    /**
     * Copies the generated URL to the local computer's clipboard for use by a paste operation
     * @method copyLinkToClipboard
     */
    $scope.copyLinkToClipboard = function(txtInputId) {
        // Internet Explorer
        if (window.clipboardData && window.clipboardData.setData) {
            clipboardData.setData("Text", $('#'+txtInputId).val());
        // Other browsers            
        } else {
            var inputElem = document.getElementById(txtInputId);
            inputElem.focus();
            inputElem.select();
            document.execCommand('copy');
        }
    };
    
    
    /**
     * Process the state parameter to the website's URL, panning,zooming and adding layers and markers as required etc.
     * @method processState
     */
    $scope.processState = function() {
        // If there is a state (permalink) parameter in the website's URL, then process it
        var URLparams=UtilitiesService.getUrlParameters(window.location.href);
        if (URLparams.hasOwnProperty('state')) {
            var plusStr = URLparams.state.replace(/ /g, '+');//LJ:Aus-2598-permanent link does't work.
            var stateStr = UtilitiesService.decode_base64(plusStr);
            
            // Convert LZMA string into byte array
            var compressedByteArray = [];
            for (var i = 0; i < stateStr.length; i++) {
                compressedByteArray.push(stateStr.charCodeAt(i));
            }
            // Decompress LZMA string  
            LZMA.decompress(compressedByteArray, function on_decompress_complete(result) {
                var objState={};
                try {
                    objState = JSON.parse(result);
                } catch(err) {
                    console.error("permalink JSON parse error=", err);
                }
                if (objState && objState!={}) {
                    // Add layers and set map position and zoom according to state object
                    if (objState.hasOwnProperty('m')) {
                        GoogleMapService.setMapState(objState.m);
                    }
                    if (objState.hasOwnProperty('f')) {
                        FilterStateService.setFiltersState(objState.f);
                    }
                }
            });
        }
    };
    
    // Register a function to be called when filters have all been initialised
    // The registered function will process the 'state' parameter in the website's URL
    FilterStateService.registerIsReadyCB($scope.processState);


}]);
