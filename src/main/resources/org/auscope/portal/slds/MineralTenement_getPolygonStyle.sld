<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:mt="http://xmlns.geoscience.gov.au/mineraltenementml/1.0" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ows="http://www.opengis.net/ows" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <NamedLayer>
        <Name>[name]</Name>
        <UserStyle>
            <Title>style</Title>
            <FeatureTypeStyle>
                <Rule>
                    <Name>[styleName]</Name>
                    <Title>Mineral Tenement</Title>
                    <Abstract>60 percent transparent green fill with a green outline 1 pixel in width</Abstract>
                    [filter]
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">[color]</CssParameter>
                            <CssParameter name="fill-opacity">0.6</CssParameter>
                        </Fill>
                        <Stroke>
                            <CssParameter name="stroke">[borderColor]</CssParameter>
                            <CssParameter name="stroke-width">1</CssParameter>
                        </Stroke>
                    </PolygonSymbolizer>
                </Rule>
            </FeatureTypeStyle>
        </UserStyle>
    </NamedLayer>
</StyledLayerDescriptor>