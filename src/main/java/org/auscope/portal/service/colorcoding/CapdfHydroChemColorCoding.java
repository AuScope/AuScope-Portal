package org.auscope.portal.service.colorcoding;


import java.util.Hashtable;

public class CapdfHydroChemColorCoding {

    private String field;
    CapdfConfigObject capdfConfigObject;

    public CapdfHydroChemColorCoding(String field) {
        this.field=field;
        this.capdfConfigObject = new CapdfConfigObject(field);
    }


    public String getField() {
        return field;
    }

    public ColorCodingConfig getColorCodingConfig() {
        return capdfConfigObject.getColorCodingConfig();
    }

    public class CapdfConfigObject{
        ColorCodingConfig colorConfig;
        String field;
        Hashtable<String,ColorCodingConfig> colorMap;

        public CapdfConfigObject(String field){
            colorMap = new Hashtable<String,ColorCodingConfig>();
            colorMap.put("elev",new ColorCodingConfig(200,600,10,ColorCodingConfig.COLOR.RED));
            colorMap.put("wt",new ColorCodingConfig(5,20,10,ColorCodingConfig.COLOR.BLUE));
            colorMap.put("sd",new ColorCodingConfig(5,20,10,ColorCodingConfig.COLOR.GREEN));
            this.field=field;
        }

        public ColorCodingConfig getColorCodingConfig(){
            return this.colorMap.get(this.field);
        }


    }

}
