/**
 * Utility class for handling a series of portal.layer.querier.QueryTarget objects
 * by opening selection menus (if appropriate) or by simply passing along the
 * QueryTarget objects to the appropriate querier instances
 */
Ext.define('portal.layer.querier.QueryTargetHandler', {

    statics : {
        /**
         * Handles a query response by opening up info windows
         */
        _queryCallback : function(querier, baseComponents, queryTarget) {
            if (!baseComponents || baseComponents.length === 0) {
                return;
            }

            alert('Got - ' + baseComponents.length);
        },

        /**
         * Just query everything in queryTargets
         */
        _handleWithQuery : function(queryTargets) {
            for (var i = 0; i < queryTargets.length; i++) {
                var queryTarget = queryTargets[i];
                var layer = queryTarget.data.layer;
                var querier = layer.data.querier;

                querier.query(queryTarget, portal.layer.querier.QueryTargetHandler._queryCallback);
            }
        },

        /**
         * Show some form of selection to the user, ask them to decide
         * which query target they meant
         */
        _handleWithSelection : function(queryTargets) {
            alert('TODO - handle overlapping polygons/markers')
        },

        /**
         * Given an array of portal.layer.querier.QueryTarget objects,
         * figure out how to pass these to appropriate querier instances
         * and optionally show popup information on the map.
         *
         * @param queryTargets Array of portal.layer.querier.QueryTarget objects
         */
        handleQueryTargets : function(queryTargets) {
            if (!queryTargets || queryTargets.length === 0) {
                return;
            }

            var explicitTargets = []; // all QueryTarget instances with the explicit flag set
            for (var i = 0; i < queryTargets.length; i++) {
                if (queryTargets[i].get('explicit')) {
                    explicitTargets.push(queryTargets[i]);
                }
            }

            //If we have an ambiguous set of targets - let's just ask the user what they meant
            if (explicitTargets.length > 1) {
                portal.layer.querier.QueryTargetHandler._handleWithSelection(explicitTargets);
                return;
            }

            //If we have a single explicit target, then our decision is really easy
            if (explicitTargets.length === 1) {
                portal.layer.querier.QueryTargetHandler._handleWithQuery(explicitTargets);
                return;
            }

            //Otherwise query everything
            portal.layer.querier.QueryTargetHandler._handleWithQuery(queryTargets);
        }
    }
});