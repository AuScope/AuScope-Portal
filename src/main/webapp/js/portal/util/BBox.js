/**
 * Represents a simple Bounding Box
 * {
 * northBoundLatitude : Northern most latitude
 * southBoundLatitude : Southern most latitude
 * eastBoundLongitude : Eastern most longitude (in the range [-180, 180) )
 * westBoundLongitude : Western most longitude (in the range [-180, 180) )
 * crs : Coordinate reference system
 * }
 */
Ext.define('portal.util.BBox', {
    constructor : function(cfg) {
        Ext.apply(this, cfg);
        if (!this.crs) {
            this.crs = 'EPSG:4326';
        }

        this.callParent(arguments);
    },

    /**
     * Returns true if the bounding box spans the entire planet
     */
    isGlobal : function() {
        return this.eastBoundLongitude == 180 && this.northBoundLatitude == 90 &&
        this.southBoundLatitude == -90 && this.westBoundLongitude == -180;
    },

    /**
     * Returns a clone of this bounding box
     */
    clone : function() {
        return Ext.create('portal.util.BBox', {
            northBoundLatitude : this.northBoundLatitude,
            southBoundLatitude : this.southBoundLatitude,
            eastBoundLongitude : this.eastBoundLongitude,
            westBoundLongitude : this.westBoundLongitude,
            crs : this.crs
        });
    },

    /**
     * Combines this bounding box with the specified bbox by taking the maxima/minima of both bounding boxes.
     *
     * The 'super' bounding box will be returned as a BBox
     */
    combine : function(bbox) {
        return Ext.create('portal.util.BBox', {
            northBoundLatitude : Math.max(this.northBoundLatitude, bbox.northBoundLatitude),
            southBoundLatitude : Math.min(this.southBoundLatitude, bbox.southBoundLatitude),
            eastBoundLongitude : Math.max(this.eastBoundLongitude, bbox.eastBoundLongitude),
            westBoundLongitude : Math.min(this.westBoundLongitude, bbox.westBoundLongitude),
            crs : this.crs
        });
    },

    /**
     * Returns a list of BBox objects representing the bbox being split into 2 at the
     * specified latitude and longitudes (Will return 1,2 or 4 bbox objects)
     * @param longitude [Optional] The longitude to split at in the range [-180, 180)
     * @param latitude [Optional] The latitude to split at
     * @return
     */
    splitAt : function(longitude, latitude) {
        var splitter = function (left, right, value, splits) {
            var newSplits = [];

            for (var i = 0; i < splits.length; i++) {
                var bbox = splits[i];
                var leftSplit = bbox.clone();
                var rightSplit = bbox.clone();

                //If we split across a range that sees a sign flip
                //ensure the sign across each split rectangle is equal
                var leftSplitValue = value;
                while (leftSplitValue < 0 && leftSplit[left] > 0) {
                    leftSplitValue += 360;
                }
                while (leftSplitValue > 0 && leftSplit[left] < 0) {
                    leftSplitValue -= 360;
                }
                var rightSplitValue = value;
                while (rightSplitValue < 0 && rightSplit[right] > 0) {
                    rightSplitValue += 360;
                }
                while (rightSplitValue > 0 && rightSplit[right] < 0) {
                    rightSplitValue -= 360;
                }

                leftSplit[left] = bbox[left];
                leftSplit[right] = leftSplitValue;
                rightSplit[left] = rightSplitValue;
                rightSplit[right] = bbox[right];

                newSplits.push(leftSplit);
                newSplits.push(rightSplit);
            }

            return newSplits;
        };

        var splits = [this];

        if (longitude !== undefined) {
            splits = splitter('westBoundLongitude', 'eastBoundLongitude', longitude, splits);
        }

        if (latitude !== undefined) {
            splits = splitter('northBoundLatitude', 'southBoundLatitude', latitude, splits);
        }

        return splits;
    },

    /**
     * Recursively splits the specified bbox
     *
     * bbox : The bounding box to split
     * resultList : A list that the results will be appended to
     */
    _splitBboxes : function(bbox, resultList) {

        //SPLIT CASE 1: Polygon crossing meridian
        if (bbox.westBoundLongitude < 0 && bbox.eastBoundLongitude > 0) {
            var splits = bbox.splitAt(0);
            for (var i = 0; i < splits.length; i++) {
                this._splitBboxes(splits[i], resultList);
            }
            return resultList;
        }

        //SPLIT CASE 2: Polygon crossing anti meridian
        if (bbox.westBoundLongitude > 0 && bbox.eastBoundLongitude < 0) {
            var splits = bbox.splitAt(-180);
            for (var i = 0; i < splits.length; i++) {
                this._splitBboxes(splits[i], resultList);
            }
            return resultList;
        }

        //SPLIT CASE 3: Polygon is too wide (Gmap can't handle click events for wide polygons)
        if (Math.abs(bbox.westBoundLongitude - bbox.eastBoundLongitude) > 60) {
            var splits = bbox.splitAt((bbox.westBoundLongitude + bbox.eastBoundLongitude) / 2);
            for (var i = 0; i < splits.length; i++) {
                this._splitBboxes(splits[i], resultList);
            }
            return resultList;
        }

        //OTHERWISE - bounding box is OK to render
        resultList.push(bbox);
        return resultList;
    },

    /**
     * Converts a portal bbox into an array of GMap Polygon's
     *
     * Normally a single polygon is returned but if the polygon wraps around the antimeridian, it will be split
     * around the meridians.
     */
    toGMapPolygon : function(id, sourceOnlineResource, sourceLayer,strokeColor, strokeWeight, strokeOpacity, fillColor, fillOpacity, opts) {
        var splits = this._splitBboxes(this, []);
        var result = [];

        for (var i = 0; i < splits.length; i++) {
            var splitBbox = splits[i];
            var ne = new GLatLng(splitBbox.northBoundLatitude, splitBbox.eastBoundLongitude);
            var se = new GLatLng(splitBbox.southBoundLatitude, splitBbox.eastBoundLongitude);
            var sw = new GLatLng(splitBbox.southBoundLatitude, splitBbox.westBoundLongitude);
            var nw = new GLatLng(splitBbox.northBoundLatitude, splitBbox.westBoundLongitude);

            result.push(portal.util.gmap.OverlayFactory.makePolygon(id, sourceOnlineResource, sourceLayer,
                    [sw, nw, ne, se, sw], strokeColor, strokeWeight, strokeOpacity, fillColor, fillOpacity, opts));
        }

        return result;
    },

    /**
     * Function for comparing 2 instances of BBox. If the internal fields are all exactly the same then
     * true will be returned, otherwise false.
     */
    equals : function(bbox) {
        return this.eastBoundLongitude === bbox.eastBoundLongitude &&
            this.westBoundLongitude === bbox.westBoundLongitude &&
            this.southBoundLatitude === bbox.southBoundLatitude &&
            this.northBoundLatitude === bbox.northBoundLatitude &&
            this.crs === bbox.crs;
    }
});
