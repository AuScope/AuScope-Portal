var app = angular.module('app', ['ngAnimate','allControllers','allModules','ui.bootstrap','uiGmapgoogle-maps']);

app.constant('Constants', {
    resourceType: {
        WMS: 'WMS',
        WFS: 'WFS',
        OTHERS: 'OTHERS'
    },
    WMSVersion:{
        '1.1.1': '1.1.1',
        '1.1.0': '1.1.0',
        '1.3.0': '1.3.0'
    }, 
    geometryType:{
        'POINT': 'POINT',
        'LINESTRING': 'LINESTRING',
        'POLYGON': 'POLYGON'
    },
    XPATH_STRING_TYPE : (window.XPathResult ? XPathResult.STRING_TYPE : 0),
    XPATH_UNORDERED_NODE_ITERATOR_TYPE: (window.XPathResult ? XPathResult.UNORDERED_NODE_ITERATOR_TYPE : 1)
}); 


app.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyBArcbrWG8q6cUeP4WrhD3-s1D0aYbkxfA',
        //v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
});


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