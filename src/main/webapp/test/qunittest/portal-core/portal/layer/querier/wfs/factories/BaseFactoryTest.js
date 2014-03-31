module( "Test portal.layer.querier.wfs.factories" );

var factory = new portal.layer.querier.wfs.factories.BaseFactory({
    listeners : null
})

var VOCAB_SERVICE_URL='http://example_vocab_service/';

test( "Test BaseFactory:_filterNodesWithXPath", function() {
    var txt="<bookstore><book>";
    txt=txt+"<title>Everyday Italian</title>";
    txt=txt+"<author>Giada De Laurentiis</author>";
    txt=txt+"<year>2005</year>";
    txt=txt+"</book></bookstore>";

    var xmlDoc1 = portal.util.xml.SimpleDOM.parseStringToDOM(txt);

    txt="<bookstore><book>";
    txt=txt+"<title>Everyday Chinese</title>";
    txt=txt+"<author>VictorTey</author>";
    txt=txt+"<year>2005</year>";
    txt=txt+"</book></bookstore>";

    var xmlDoc2 = portal.util.xml.SimpleDOM.parseStringToDOM(txt);



    xmlDocs=[];
    xmlDocs.push(xmlDoc1.documentElement);
    xmlDocs.push(xmlDoc2.documentElement);

    var nodelist = factory._filterNodesWithXPath(xmlDocs, '/bookstore/book/title', 'Everyday Italian');
    ok(nodelist.length==1, 'test single match');

    var nodelist = factory._filterNodesWithXPath(xmlDocs, '/bookstore/book/year', '2005');
    ok(nodelist.length==2,'test multi match');

});

test( "Test BaseFactory:_makeWfsUriPopupHtml", function() {
    var result = factory._makeWfsUriPopupHtml('uriTest', 'contentTest', 'qtiptest');
    equal(result,'<a href="#" qtip="qtiptest" onclick="var w=window.open(\'wfsFeaturePopup.do?url=uriTest\',\'AboutWin\',\'toolbar=no, menubar=no,location=no,resizable=yes,scrollbars=yes,statusbar=no,height=450,width=820\');w.focus();return false;">contentTest</a>')

});

test( "Test BaseFactory:_makeWFSPopupHtml", function() {
    var result = factory._makeWFSPopupHtml('wfsUrl', 'typeName', 'featureId', 'contentTest', 'qtiptest');
    equal(result,'<a href="#" qtip="qtiptest" onclick="var w=window.open(\'wfsFeaturePopup.do?url=wfsUrl&typeName=typeName&featureId=featureId\',\'AboutWin\',\'toolbar=no, menubar=no,location=no,resizable=yes,scrollbars=yes,statusbar=no,height=450,width=820\');w.focus();return false;">contentTest</a>')

});

test( "Test BaseFactory:_makeGeneralPopupHtml", function() {
    var result = factory._makeGeneralPopupHtml('url', 'contentTest', 'qtiptest');
    equal(result,'<a href="#" qtip="qtiptest" onclick="var w=window.open(\'url\',\'AboutWin\',\'toolbar=no, menubar=no,location=no,resizable=yes,scrollbars=yes,statusbar=no,height=450,width=820\');w.focus();return false;">contentTest</a>')

});

test( "Test BaseFactory:_makeVocabPopupHtml", function() {
    var result = factory._makeVocabPopupHtml('url', 'contentTest', 'qtiptest');
    equal(result,'<a href="#" qtip="qtiptest" onclick="var w=window.open(\'http://example_vocab_service/getConceptByURI?url\',\'AboutWin\',\'toolbar=no, menubar=no,location=no,resizable=yes,scrollbars=yes,statusbar=no,height=450,width=820\');w.focus();return false;">contentTest</a>')

});

test( "Test BaseFactory:_makeFeatureRequestUrl", function() {
    var result = factory._makeFeatureRequestUrl('wfsUrl', 'typeName', 'featureTypeId', null);
    equal(result,'http://localhost:8088/requestFeature.do?serviceUrl=wfsUrl&typeName=typeName&featureId=featureTypeId')

});

test( "Test BaseFactory:_makeWFSFeatureRequestUrl", function() {
    var result = factory._makeWFSFeatureRequestUrl('wfsUrl', 'typeName', 'featureTypeId', null);
    equal(result,'wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=typeName&featureId=featureTypeId')

});

test( "Test BaseFactory:_getBaseUrl", function() {
    var result = factory._getBaseUrl('http://google.com:8081/sub1/sub1/1234.html');
    console.log(result);
    equal(result,'http://google.com:8081');

});