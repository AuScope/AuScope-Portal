var app = angular.module('app', ['ngAnimate','allControllers','allModules','ui.bootstrap','uiGmapgoogle-maps','angular-svg-round-progressbar','rzModule','ngSanitize','angularTreeview','ngTouch']);

app.constant('Constants', {
    resourceType: {
        WMS: 'WMS',
        WFS: 'WFS',
        WCS: 'WCS',
        WWW: 'WWW',
        OPeNDAP : 'OPeNDAP',
        FTP : 'FTP',
        SOS : 'SOS',
        IRIS : 'IRIS',
        CSWService : 'CSWService',
        NCSS : 'NCSS',
        UNSUPPORTED : 'Unsupported',        
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
    statusProgress:{
        'RUNNING': 'RUNNING',
        'COMPLETED': 'COMPLETED',
        'SKIPPED' : 'SKIPPED',
        'ERROR': 'ERROR'
    },
    analyticLoader:{        
        'capdf-hydrogeochem' : 'views/analytic/capdf-hydrogeochem.htm'       
    },
    rendererLoader:{
        'nvcl-borehole': 'WFSService',
        'gsml-borehole': 'WFSService',        
        'mineral-tenements' : 'WMSService'
    },
    XPATH_STRING_TYPE : (window.XPathResult ? XPathResult.STRING_TYPE : 0),
    XPATH_UNORDERED_NODE_ITERATOR_TYPE: (window.XPathResult ? XPathResult.UNORDERED_NODE_ITERATOR_TYPE : 1),
    
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

app.directive('querierPanel', function() {
  return {
	  scope: {
		  activeView: '=',
		  showQuerierPanel: '='		
	    },  
	  templateUrl: 'views/querierPanel.htm'
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


app.directive('filterPanel', function() {
    return {
        scope: {
            layer  : "=",  
        },
        templateUrl: 'views/filters/loadFilter.htm'
       
    };
});

app.directive('analyticPanel', function() {
    return {
        scope: {
            layer  : "=",  
        },
        templateUrl: 'views/analytic/loadAnalytic.htm'
       
    };
});