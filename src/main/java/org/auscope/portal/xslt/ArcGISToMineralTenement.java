package org.auscope.portal.xslt;

import java.io.InputStream;
import java.io.StringReader;
import java.util.Properties;

import javax.xml.transform.stream.StreamSource;

import org.auscope.portal.core.xslt.PortalXSLTTransformer;
import org.springframework.stereotype.Component;

@Component
public class ArcGISToMineralTenement extends PortalXSLTTransformer {

	public ArcGISToMineralTenement() {
		super("/org/auscope/portal/xslt/ArcGISToMineralTenement.xsl");
	}
	
    /**
     * Utility method to transform a WFS response into kml
     *
     * @param wfs
     *            WFS response to be transformed
     * @param serviceUrl
     *            The WFS URL where the response came from
     * @return Kml output string
     */
    public String convert(String wms, String serviceUrl) {
        return convert(new StreamSource(new StringReader(wms)), serviceUrl);
    }

    /**
     * Utility method to transform a WFS response into kml
     *
     * @param wfs
     *            WFS response to be transformed
     * @param serviceUrl
     *            The WFS URL where the response came from
     * @return Xml output string
     */
    public String convert(InputStream wms, String serviceUrl) {
        return convert(new StreamSource(wms), serviceUrl);
    }

    /**
     * Utility method to transform a WFS response into kml
     *
     * @param wfs
     *            WFS response to be transformed
     * @param serviceUrl
     *            The WFS URL where the response came from
     * @return Xml output string
     */
    public String convert(StreamSource wms, String serviceUrl) {
        Properties stylesheetParams = new Properties();
        stylesheetParams.setProperty("serviceURL", serviceUrl);
        return convert(wms, stylesheetParams);
    }
}
