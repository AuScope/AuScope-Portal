var app = angular.module('app', ['ngAnimate','allControllers','allModules','ui.bootstrap']);

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
    }
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