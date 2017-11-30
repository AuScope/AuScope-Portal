

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<!-- Credits for icons from http://www.fatcow.com/free-icons/ under http://creativecommons.org/licenses/by/3.0/us/-->

<html xmlns:v="urn:schemas-microsoft-com:vml">
   <head>
      <title>AuScope Discovery Portal</title>

      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="description" content="Access geoscientific information from around Australia, via AuScopes national e-Research infrastructure.">
      <meta name="keywords" content="AuScope, Discovery, Resources, GeoSciML, Mineral Occurrence, Geologic Unit, Australia">
      <meta name="author" content="AuScope">
      <meta charset="UTF-8" />
                 

      <%-- Open Layers Imports --%>
      <link rel="stylesheet" href="portal-core/js/OpenLayers-2.13.1/theme/default/style.css" type="text/css">
      <script src="portal-core/js/OpenLayers-2.13.1/OpenLayers.js" type="text/javascript"></script>
      <script src="portal-core/js/threejs/three.min.js" type="text/javascript"></script>
      <script src="portal-core/js/threejs/controls/OrbitControls.js" type="text/javascript"></script>
      <script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
      <script src="portal-core/js/d3Legends/d3.legend.js" type="text/javascript"></script>
      <script type="text/javascript" src="//wurfl.io/wurfl.js"></script>
      
      <%
	    String ua=request.getHeader("User-Agent").toLowerCase();
	    if(ua.matches("(?i).*((android|bb\\d+|meego).+mobile|avantgo|bada\\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\\.(browser|link)|vodafone|wap|windows ce|xda|xiino).*")||ua.substring(0,4).matches("(?i)1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\\-(n|u)|c55\\/|capi|ccwa|cdm\\-|cell|chtm|cldc|cmd\\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\\-s|devi|dica|dmob|do(c|p)o|ds(12|\\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\\-|_)|g1 u|g560|gene|gf\\-5|g\\-mo|go(\\.w|od)|gr(ad|un)|haie|hcit|hd\\-(m|p|t)|hei\\-|hi(pt|ta)|hp( i|ip)|hs\\-c|ht(c(\\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\\-(20|go|ma)|i230|iac( |\\-|\\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\\/)|klon|kpt |kwc\\-|kyo(c|k)|le(no|xi)|lg( g|\\/(k|l|u)|50|54|\\-[a-w])|libw|lynx|m1\\-w|m3ga|m50\\/|ma(te|ui|xo)|mc(01|21|ca)|m\\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\\-2|po(ck|rt|se)|prox|psio|pt\\-g|qa\\-a|qc(07|12|21|32|60|\\-[2-7]|i\\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\\-|oo|p\\-)|sdk\\/|se(c(\\-|0|1)|47|mc|nd|ri)|sgh\\-|shar|sie(\\-|m)|sk\\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\\-|v\\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\\-|tdg\\-|tel(i|m)|tim\\-|t\\-mo|to(pl|sh)|ts(70|m\\-|m3|m5)|tx\\-9|up(\\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\\-|your|zeto|zte\\-")) {
	      response.sendRedirect("mobile/index.htm");
	      return;
	    }
       %>
		


      <script type="text/javascript">
         var VOCAB_SERVICE_URL = "${vocabServiceUrl}";
         var NVCL_WEB_SERVICE_IP = "${nvclWebServiceIP}";
         var MAX_FEATURES = "${maxFeatureValue}";
         var LOCALHOST = "${localhost}";
         var WEB_CONTEXT = '<%= request.getContextPath() %>';
      </script>

      <%-- JS imports - relative paths back to the webapp directory --%>
      <jsp:include page="../../portal-core/jsimports.jsp"/>
      <jsp:include page="../../portal-core/jsimports-openlayers.jsp"/>
      <jsp:include page="../../jsimports.htm"/>

      <%-- CSS imports - relative paths back to the webapp directory--%>
      <jsp:include page="../../portal-core/cssimports.jsp"/>      
      <jsp:include page="../../cssimports.htm"/>

      <script src="js/auscope/Main-UI.js" type="text/javascript"></script>
            

      <link rel="shortcut icon" href="img/favicon.ico" type="image/x-icon" />
      <c:if test="${not empty analyticKey}">
          <script type="text/javascript">

          var _gaq = _gaq || [];
          _gaq.push(['_setAccount', '${analyticKey}']);
          _gaq.push(['_trackPageview']);

            (function() {
                var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
              })();

          </script>
      </c:if>
      
    <!-- Piwik -->
    <c:if test="${not empty piwikSiteId}">
		<script type="text/javascript">
		  var _paq = _paq || [];
		  _paq.push(['trackPageView']);	
		  _paq.push(['trackVisibleContentImpressions']);
		  _paq.push(['enableLinkTracking']);
		  (function() {
		    var u="//cg-admin.arrc.csiro.au/piwik/";
		    _paq.push(['setTrackerUrl', u+'piwik.php']);
		    _paq.push(['setSiteId', parseInt('${piwikSiteId}')]);
		    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
		    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
		  })();
		</script>
		<noscript><p><img src="//cg-admin.arrc.csiro.au/piwik/piwik.php?idsite=1" style="border:0;" alt="" /></p></noscript>
	</c:if>
    <!-- End Piwik Code -->
      
      
   </head>

    <body>
      <!-- Include Navigation Header -->
      <%@ include file="page_header.jsp" %>
   </body>


</html>