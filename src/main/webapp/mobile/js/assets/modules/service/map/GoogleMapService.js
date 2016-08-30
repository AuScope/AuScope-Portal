allModules.service('googleMapService',['$rootScope',function ($rootScope) {
   
    this.mainMap;
    
    this.getMap = function(){
        return this.mainMap;
    };
     
  
     this.initMap = function() {
         this.mainMap = new google.maps.Map(document.getElementById('google-map-main'), {
           center: {lat: -28.397, lng: 132.644},
           zoom: 5,
           mapTypeControlOptions: {
               style: google.maps.MapTypeControlStyle.DROPDOWN_MENU ,
               position: google.maps.ControlPosition.TOP_RIGHT
           },
         });
         
       
      }
   
    
    
    
     
    
     
}]);