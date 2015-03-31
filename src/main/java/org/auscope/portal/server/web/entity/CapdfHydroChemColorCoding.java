package org.auscope.portal.server.web.entity;

import java.util.HashMap;

public class CapdfHydroChemColorCoding {

    private String field;

    private String[] RED = { "#1A0000", "#330000", "#4C0000", "#660000",
            "#800000", "#990000", "#B20000", "#CC0000", "#E60000", "#FF0000",
            "#FF1919", "#FF3333", "#FF4D4D", "#FF6666", "#FF8080", "#FF9999",
            "#FFB2B2", "#FFCCCC", "#FFE6E6" };
    private String[] BLUE = { "#000A1A", "#001433", "#001F4C", "#002966",
            "#003380", "#003D99", "#0047B2", "#0052CC", "#005CE6", "#0066FF",
            "#1975FF", "#3385FF", "#4D94FF", "#66A3FF", "#80B2FF", "#99C2FF",
            "#B2D1FF", "#CCE0FF", "#E6F0FF" };
    private String[] GREEN = { "#001400", "#002900", "#003D00",
            "#005200", "#006600", "#007A00", "#008F00", "#00A300", "#00B800",
            "#00CC00", "#19D119", "#33D633", "#4DDB4D", "#66E066", "#80E680",
            "#99EB99", "#B2F0B2", "#CCF5CC", "#E6FAE6" };

    public static enum SHADES{
        RED,BLUE,GREEN;
    }

    private HashMap<String,FieldConfigObj> fieldConfigMap;



    public CapdfHydroChemColorCoding(String field) {
        this.setField(field);
        fieldConfigMap=new HashMap<String,FieldConfigObj>();
        fieldConfigMap.put("public:elev", new FieldConfigObj(SHADES.RED,200,400));
        fieldConfigMap.put("public:wt", new FieldConfigObj(SHADES.BLUE,1,20));
        fieldConfigMap.put("public:sd", new FieldConfigObj(SHADES.GREEN,1,20));
    }

    public String[] getShades(SHADES s){
        switch (s) {
        case RED:
            return this.RED;
        case GREEN:
            return this.GREEN;
        case BLUE:
            return this.BLUE;
        default:
            return null;
        }
    }


    public String[] getShades(String field){
        return getShades(fieldConfigMap.get(field).getShade());
    }


    public String[] getShades(){
        return getShades(fieldConfigMap.get(field).getShade());
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public int getMin(){
        return (fieldConfigMap.get(field).getMin());
    }

    public int getMax(){
        return (fieldConfigMap.get(field).getMax());
    }

    /**
     * Based on the min/max and iteration, calculate the lower bound of the field value
     * @param iteration
     * @return
     */
    public int getMin(int iteration) {
        iteration--;
        if(iteration<0){
            return -1;
        }
        FieldConfigObj config = fieldConfigMap.get(field);

        int max = config.getMax();
        int min = config.getMin();

        int iterations=this.getShades().length;

        int avg=(max-min)/iterations;

        return (iteration * avg) + min;
    }

    /**
     * Based on the min/max and iteration, calculate the upper bound of the field value
     * @param iteration
     * @return
     */
    public int getMax(int iteration) {

        FieldConfigObj config = fieldConfigMap.get(field);

        int max = config.getMax();
        int min = config.getMin();

        int iterations=this.getShades().length;

        int avg=(max-min)/iterations;

        int result = (iteration * avg) + min;

        if(result > max){
            return -1;
        }
        return result;
    }


    public class FieldConfigObj {
        private SHADES shade;
        private int min;
        private int max;

        public FieldConfigObj(SHADES shade, int min, int max) {
            this.shade = shade;
            this.min = min;
            this.max = max;
        }

        SHADES getShade() {
            return shade;
        }

        void setShade(SHADES shade) {
            this.shade = shade;
        }

        int getMin() {
            return min;
        }

        void setMin(int min) {
            this.min = min;
        }

        int getMax() {
            return max;
        }

        void setMax(int max) {
            this.max = max;
        }


    }


}
