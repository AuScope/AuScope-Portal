/**
 * Class for transforming a W3C DOM Document into a GenericParserComponent
 * by utilising a number of 'plugin' factories.
 */
Ext.define('auscope.layer.querier.wfs.AuScopeParser', {
    extend: 'portal.layer.querier.wfs.Parser',

    /**
     * Builds a new Parser from a list of factories. Factories in factoryList will be tested before
     * the items in factoryNames
     *
     * {
     *  factoryNames : String[] - an array of class names which will be instantiated as portal.layer.querier.wfs.factories.BaseFactory objects
     *  factoryList : portal.layer.querier.wfs.factories.BaseFactory[] - an array of already instantiated factory objects
     * }
     */
    constructor : function(config) {
        Ext.apply(config, {
            factoryNames : [
                'auscope.layer.querier.wfs.factories.GeologicUnitFactory',
                'auscope.layer.querier.wfs.factories.LocatedSpecimenFactory',
                'auscope.layer.querier.wfs.factories.SamplingFeatureCollectionFactory',
                'auscope.layer.querier.wfs.factories.BoreholeFactory',
                'auscope.layer.querier.wfs.factories.MappedFeatureFactory',
                'auscope.layer.querier.wfs.factories.MiningFeatureOccurrenceFactory',
                'auscope.layer.querier.wfs.factories.GeophysicsAnomaliesFactory',
                'auscope.layer.querier.wfs.factories.GnssStationFactory',
                'portal.layer.querier.wfs.factories.SimpleFactory' //The simple factory should always go last
            ]
        });

        this.callParent(arguments);
    }
});