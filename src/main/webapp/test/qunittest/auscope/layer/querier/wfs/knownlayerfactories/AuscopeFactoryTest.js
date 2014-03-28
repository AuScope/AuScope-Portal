//VT: This file tests everything in /AuScope-Portal/src/main/webapp/js/auscope/layer/querier/wfs/knownlayerfactories
//VT : plus AuscopeParser.js and AuScopeKnownLayerParser.js
module( "Test Factories" );
test( "Test supportsKnownLayer PortrayalBoreholeViewFactory", function() {
    var factory = new auscope.layer.querier.wfs.knownlayerfactories.PortrayalBoreholeViewFactory({
        name : 'Test'
    });
    var knownLayer = Ext.create('portal.knownlayer.KnownLayer', {
        id : 'sf0-borehole-nvcl'
    });
    ok(factory.supportsKnownLayer(knownLayer), 'PortrayalBoreholeView Supports sf0-borehole-nvcl' );

});

test( "Test supportsKnownLayer GeodesyFactory", function() {
    var factory = new auscope.layer.querier.wfs.knownlayerfactories.GeodesyFactory({
        name : 'Test'
    });
    var knownLayer = Ext.create('portal.knownlayer.KnownLayer', {
        id : 'geodesy:gnssstation'
    });
    ok(factory.supportsKnownLayer(knownLayer), 'GeodesyFactory Supports geodesy:gnssstation' );

});

test( "Test supportsKnownLayer NVCLFactory", function() {
    var factory = new auscope.layer.querier.wfs.knownlayerfactories.NVCLFactory({
        name : 'Test'
    });
    var knownLayer = Ext.create('portal.knownlayer.KnownLayer', {
        id : 'nvcl-borehole'
    });
    ok(factory.supportsKnownLayer(knownLayer), 'NVCLFactory Supports nvcl-borehole' );

});


test( "Test supportsKnownLayer PressureDBFactory", function() {
    var factory = new auscope.layer.querier.wfs.knownlayerfactories.PressureDBFactory({
        name : 'Test'
    });
    var knownLayer = Ext.create('portal.knownlayer.KnownLayer', {
        id : 'pressuredb-borehole'
    });
    ok(factory.supportsKnownLayer(knownLayer), 'PressureDBFactory Supports pressuredb-borehole' );

});



module( "Test Auscope Factory Parser" );
test( "AuScopeParser count", function() {
    var auscopeParser = new auscope.layer.querier.wfs.AuScopeParser({
        name : 'test',
    })

   equal(auscopeParser.factoryNames.length,13, 'Count Number of factories configured ');

    var auscopeklParser = new auscope.layer.querier.wfs.AuScopeKnownLayerParser({
        name : 'test',
    })

   equal(auscopeklParser.factoryNames.length,5, 'Count Number of knownlayer factories configured ')

});

//QUnit.jUnitReport = function(report) {
//    console.log(report.xml);
//};





































