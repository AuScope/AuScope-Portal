import { Injectable } from '@angular/core';

declare var window: any;
declare var XPathResult: any;
/**
 * Constances
 */
@Injectable()
export class Constants {

     public static resourceType = {
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
    }

     public static WMSVersion = {
        '1.1.1': '1.1.1',
        '1.1.0': '1.1.0',
        '1.3.0': '1.3.0'
    }

     public static geometryType = {
        'POINT': 'POINT',
        'LINESTRING': 'LINESTRING',
        'POLYGON': 'POLYGON'
    }


     public static analyticLoader = {
        'capdf-hydrogeochem' : 'views/analytic/capdf-hydrogeochem.htm',
        'pressuredb-borehole' : 'views/analytic/pressureDb.htm'
    }

     public static rendererLoader = {
        'nvcl-borehole': 'WFSService',
        'gsml-borehole': 'WFSService',
        'mineral-tenements' : 'WMSService'
    }

    public static XPATH_STRING_TYPE = (window.XPathResult ? XPathResult.STRING_TYPE : 0);

    public static XPATH_UNORDERED_NODE_ITERATOR_TYPE = (window.XPathResult ? XPathResult.UNORDERED_NODE_ITERATOR_TYPE : 1);

    public static smallScreenTest = '(max-width: 658px)';

    public static TILE_SIZE = 256;

    public static WMSMAXURLGET = 2000;

    public static SLDURL = 'http://portal.auscope.org/portal/';

    // Centre of Australia in EPSG:3857
    public static CENTRE_COORD: [number, number] = [14793316.706200, -2974317.644633];

}
