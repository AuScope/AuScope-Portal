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
					<Abstract>40 percent transparent [color] fill with a [borderColor] outline 0.5 pixels in width and a text label below 4m zoom</Abstract>
					<MaxScaleDenominator>4000000</MaxScaleDenominator>
                    [filter]
					<PolygonSymbolizer>
						<Fill>
							<CssParameter name="fill">[color]</CssParameter>
							<CssParameter name="fill-opacity">0.4</CssParameter>
						</Fill>
						<Stroke>
							<CssParameter name="stroke">[borderColor]</CssParameter>
							<CssParameter name="stroke-width">0.5</CssParameter>
						</Stroke>
					</PolygonSymbolizer>
					<TextSymbolizer>
						<Label>
							<ogc:Function name="strSubstringStart">
								<ogc:PropertyName>mt:name</ogc:PropertyName>
								<ogc:Function name="parseInt">
									<ogc:Literal>27</ogc:Literal>
								</ogc:Function>
							</ogc:Function>
						</Label>
						<Font>
							<CssParameter name="font-family">Arial</CssParameter>
							<CssParameter name="font-size">12</CssParameter>
							<CssParameter name="font-style">normal</CssParameter>
							<CssParameter name="font-weight">normal</CssParameter>
						</Font>
						<Fill>
							<CssParameter name="fill">#000000</CssParameter>
						</Fill>
					</TextSymbolizer>
				</Rule>
				<Rule>
					<Name>[styleName]1</Name>
					<Title>Mineral Tenement</Title>
					<Abstract>40 percent transparent [color] fill with a [borderColor] outline 0.5 pixels in width</Abstract>
                    [filter]
					<PolygonSymbolizer>
						<Fill>
							<CssParameter name="fill">[color]</CssParameter>
							<CssParameter name="fill-opacity">0.4</CssParameter>
						</Fill>
						<Stroke>
							<CssParameter name="stroke">[borderColor]</CssParameter>
							<CssParameter name="stroke-width">0.5</CssParameter>
						</Stroke>
					</PolygonSymbolizer>
				</Rule>
			</FeatureTypeStyle>
		</UserStyle>
	</NamedLayer>
</StyledLayerDescriptor>