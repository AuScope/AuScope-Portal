/**
 * A class for creating instances of portal.layer.renderer.Renderer
 */
Ext.define('auscope.layer.analytic.AnalyticFormFactory', {
    singleton: true,

    getAnalyticForm : function(layer,map){
       if(layer.get('id')==='capdf-hydrogeochem'){
           return Ext.create('auscope.layer.analytic.form.CapdfGraphingForm',{
               layer:layer,
               map : map
           });
       }

       if(layer.get('id')==='sf0-borehole-nvcl'){
           return Ext.create('auscope.layer.analytic.form.NVCLAnalyticsForm',{
               layer:layer,
               map : map
           });
       }

       return null;

   },

   supportLayer : function(layer){
       switch(layer.get('id')){
           case 'capdf-hydrogeochem':
           case 'sf0-borehole-nvcl':
               return true;

           default:
               return false
       }
   }


});