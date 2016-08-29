var app = angular.module('app', ['ngAnimate','allControllers','allModules','ui.bootstrap']);


//app.config(function(uiGmapGoogleMapApiProvider) {
//    uiGmapGoogleMapApiProvider.configure({
//        key: 'AIzaSyBArcbrWG8q6cUeP4WrhD3-s1D0aYbkxfA',
//        //v: '3.20', //defaults to latest 3.X anyhow
//        libraries: 'weather,geometry,visualization'
//    });
//});


app.directive('layerPanel', function() {
  return {
    templateUrl: 'views/layerPanel.htm'
  };
});

app.directive('activePanel', function() {
  return {
	  scope: {
		  activeView: '=',
		  showActivePanel: '='		
	    },  
	  templateUrl: 'views/activePanel.htm'
  };
});


app.directive('infoPanel', function() {
  return {
	  scope: {
	      infoPanelCsw: "="
	    },  	    	    
	  templateUrl: 'views/infoPanel.htm'
  };
});


app.directive('filterPanel', function($http,$templateCache,$compile) {
    return {
        scope: {
            filterPanelCsw  : "=",                  
        },
        templateUrl: 'views/filters/loadFilter.htm'
       
    };
});