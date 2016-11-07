/**
 * GMLParserService handles the parsing of GML documents
 * @module utility
 * @class GMLParserService
 * 
 */
allModules.service('GMLParserService',['$rootScope','SimpleXMLService','UtilitiesService','Constants',function ($rootScope,SimpleXMLService,UtilitiesService,Constants) {
   
    /**
     * Get rootnode from a gml string
     * 
     * @method getRootNode
     * @param gml - GML String
     * @return dom - the root node
     */
    this.getRootNode = function(gml) {
        return SimpleXMLService.parseStringToDOM(gml);               
    },
    
    /**
     * create a point object
     * 
     * @method createPoint
     * @param lat - latitude
     * @param lon - longtitude
     * @return point - point object
     */
    this.createPoint = function(lat,lon){
        return {
            lat : lat,
            lng : lon
        };
    };

    //Given a series of space seperated tuples, return a list of object
    /**
     * Create line string objects in a array
     * @method generateCoordList
     * @param coordsAsString - The coordinates in a string from the feature gml
     * @param srsName - the srs of the feature
     * @return array - an array of points
     */
    this.generateCoordList = function(coordsAsString, srsName) {
        var coordinateList = coordsAsString.split(' ');
        var parsedCoordList = [];
        
        for (var i = 0; i < coordinateList.length; i+=2) {
            this.forceLonLat(coordinateList, srsName, i);

            parsedCoordList.push(this.createPoint(parseFloat(coordinateList[i + 1]),parseFloat(coordinateList[i])));
        }

        return parsedCoordList;
    },
    
    /**
     * Get the srs name
     * 
     * @method getSrsName
     * @param node - coordinate node
     * @return string - srs name
     */
    this.getSrsName = function(node) {
        var srsName = node.getAttribute("srsName");
        if (UtilitiesService.isEmpty(srsName)) {
            srsName = node.getAttribute("srs");
        }
        
        if (!srsName) {
            return '';
        }
        
        return srsName;
    },
    
    /**
     * Forces lon/lat coords into coords (an array). Swaps coords[offset] and coords[offset + 1] if srsName requires it
     * @method forceLonLat
     * @param coords - the coordinates
     * @param srsName - the srs
     * @param offset - offset the coord if required.
     * 
     */
    this.forceLonLat = function(coords, srsName, offset) {
        if (!offset) {
            offset = 0;
        }
        
        if (srsName.indexOf('http://www.opengis.net/gml/srs/epsg.xml#4283') == 0 || 
            srsName.indexOf('urn:x-ogc:def:crs:EPSG') == 0) {
            //lat/lon
            var tmp = coords[offset];
            coords[offset] = coords[offset + 1];
            coords[offset + 1] = tmp;
        } else if (srsName.indexOf('EPSG') == 0 ||
                   srsName.indexOf('http://www.opengis.net/gml/srs/epsg.xml') == 0) {
            //lon/lat (no action required)
        } else {
            //fallback to lon/lat
        }
    },

    /**
     * Create line string objects in a array
     * @method parseLineString
     * @param name - the name of the feature
     * @param description - description of the feature
     * @param lineStringNode - the coordinate node containing the linestring
     * @return array - an array of points
     */
    this.parseLineString = function(name, description,lineStringNode,featureNode) {
        var srsName = this.getSrsName(lineStringNode);
        var parsedCoordList = this.generateCoordList(SimpleXMLService.getNodeTextContent(lineStringNode.getElementsByTagNameNS("*", "posList")[0]), srsName);
        if (parsedCoordList.length === 0) {
            return null;
        }

        //I've seen a few lines come in with start/end points being EXACTLY the same with no other points. These can be ignored
        if (parsedCoordList.length === 2) {
            if (parsedCoordList[0].longitude === parsedCoordList[1].longitude &&
                parsedCoordList[0].latitude === parsedCoordList[1].latitude) {
                return null;
            }
        }
        
        return {
            name : name,
            description: description,
            srsName:srsName,
            coords: parsedCoordList,
            geometryType : Constants.geometry.LINESTRING,
            featureNode:featureNode
        };
    },


    /**
     * Given a root placemark node attempt to parse it as a single point and return it. Returns a single portal.map.primitives.Polygon
     * @method parsePolygon
     * @param name - the name of the feature
     * @param description - description of the feature
     * @param polygonNode - the coordinate node containing the polygonNode
     * @return array - an array of points
     */
    this.parsePolygon = function(name, description,polygonNode,featureNode) {
        var srsName = this.getSrsName(polygonNode);
        var parsedCoordList = this.generateCoordList(SimpleXMLService.getNodeTextContent(polygonNode.getElementsByTagNameNS("*", "posList")[0]), srsName);
        if (parsedCoordList.length === 0) {
            return null;
        }
        
        //I've seen a few lines come in with start/end points being EXACTLY the same with no other points. These can be ignored
        if (parsedCoordList.length === 2) {
            if (parsedCoordList[0].longitude === parsedCoordList[1].longitude &&
                parsedCoordList[0].latitude === parsedCoordList[1].latitude) {
                return null;
            }
        }

        return {
            name : name,
            description: description,
            srsName:srsName,
            coords: parsedCoordList,
            geometryType : Constants.geometry.POLYGON,
            featureNode:featureNode
        };
            
        
    },

    
    /**
     * Given a root placemark node attempt to parse it as a single point and return it.Returns a single portal.map.primitives.Marker
     * @method parsePoint
     * @param name - the name of the feature
     * @param description - description of the feature
     * @param pointNode - the coordinate node containing the pointNode
     * @param featureNode - the featureNode of the feature we are parsing
     * @return point - a point
     */
    this.parsePoint = function(name, description,pointNode,featureNode) {
        var rawPoints = SimpleXMLService.getNodeTextContent(pointNode.getElementsByTagNameNS("*", "pos")[0]);
        var coordinates = rawPoints.split(' ');
        if (!coordinates || coordinates.length < 2) {
            return null;
        }
        
        //Workout whether we are lat/lon or lon/lat
        var srsName = this.getSrsName(pointNode);
        this.forceLonLat(coordinates, srsName);

        var lon = coordinates[0];
        var lat = coordinates[1];
        var point = this.createPoint(parseFloat(lat), parseFloat(lon));
        
        return {
            name : name,
            description: description,
            srsName:srsName,
            coords: point,
            geometryType : Constants.geometryType.POINT,
            featureNode:featureNode
        };
            
       
    },

    /**
     * Returns the feature count as reported by the WFS response. Returns null if the count cannot be parsed.
     * @method getFeatureCount
     * @param rootNode - rootNode
     * @return Number - the feature count
     */
    this.getFeatureCount = function(rootNode) {
        var wfsFeatureCollection = SimpleXMLService.getMatchingChildNodes(rootNode, null, "FeatureCollection");
        if (UtilitiesService.isEmpty(wfsFeatureCollection)) {
            return null;
        }
        
        var count = parseInt(wfsFeatureCollection[0].getAttribute('numberOfFeatures'));
        if (UtilitiesService.isNumber(count)) {
            return count;
        }
        
        return null;
    },
    
    /**
     * Top level function  that organize how the gml should be parsed
     * @method makePrimitives
     * @param rootNode - the root node of the gml
     * @return Array - can be anything from a single point to a array for polygons and line string:{
            name : name,
            description: description,
            srsName:srsName,
            coords: point,
            geometryType : Constants.geometryType.POINT
        }
     */
    this.makePrimitives = function(rootNode) {
        var primitives = [];
        var wfsFeatureCollection = SimpleXMLService.getMatchingChildNodes(rootNode, null, "FeatureCollection");
        var features = null;
        //Read through our wfs:FeatureCollection and gml:featureMember(s) elements
        if (UtilitiesService.isEmpty(wfsFeatureCollection)) {
            return primitives;
        }
        var featureMembers = SimpleXMLService.getMatchingChildNodes(wfsFeatureCollection[0], null, "featureMembers");        
        if (UtilitiesService.isEmpty(featureMembers)) {
            featureMembers = SimpleXMLService.getMatchingChildNodes(wfsFeatureCollection[0], null, "featureMember");
            features = featureMembers;
        }else{
            features = featureMembers[0].childNodes;
        }
        if (UtilitiesService.isEmpty(featureMembers)) {
            return primitives;
        }
        
        
        for(var i = 0; i < features.length; i++) {
            //Pull out some general stuff that we expect all features to have
            var featureNode = features[i]; 
            var name = featureNode.getAttribute('gml:id');
            var description = SimpleXMLService.evaluateXPath(rootNode, featureNode, "gml:description", Constants.XPATH_STRING_TYPE).stringValue;
            if (UtilitiesService.isEmpty(description)) {
                description = SimpleXMLService.evaluateXPath(rootNode, featureNode, "gml:name", Constants.XPATH_STRING_TYPE).stringValue;
                if (UtilitiesService.isEmpty(description)) {
                    description = name; //resort to gml ID if we have to
                }
            }
            
            //Look for geometry under this feature
            var pointNodes = featureNode.getElementsByTagNameNS("*", "Point");
            var polygonNodes = featureNode.getElementsByTagNameNS("*", "Polygon");
            var lineStringNodes = featureNode.getElementsByTagNameNS("*", "LineString");
            
            //Parse the geometry we found into map primitives
            for (var geomIndex = 0; geomIndex < polygonNodes.length; geomIndex++) {
                mapItem = this.parsePolygon(name, description, polygonNodes[geomIndex],featureNode);
                if (mapItem !== null) {
                    primitives.push(mapItem);
                }
            }
            
            for (var geomIndex = 0; geomIndex < pointNodes.length; geomIndex++) {
                mapItem = this.parsePoint(name, description, pointNodes[geomIndex],featureNode);
                if (mapItem !== null) {
                    primitives.push(mapItem);
                }
            }
            
            for (var geomIndex = 0; geomIndex < lineStringNodes.length; geomIndex++) {
                mapItem = this.parseLineString(name, description, lineStringNodes[geomIndex],featureNode);
                if (mapItem !== null) {
                    primitives.push(mapItem);
                }
            }
        }

        return primitives;
    };
   
     
}]);