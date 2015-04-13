package org.auscope.portal.service.colorcoding;

import java.util.HashMap;

public class ColorCodingConfig {

    int max,min,intervals;
    COLOR color;

    final String[] RED = { "#1A0000", "#330000", "#4C0000", "#660000",
            "#800000", "#990000", "#B20000", "#CC0000", "#E60000", "#FF0000",
            "#FF1919", "#FF3333", "#FF4D4D", "#FF6666", "#FF8080", "#FF9999",
            "#FFB2B2", "#FFCCCC", "#FFE6E6" };

    final String[] BLUE = { "#000A1A", "#001433", "#001F4C", "#002966",
            "#003380", "#003D99", "#0047B2", "#0052CC", "#005CE6", "#0066FF",
            "#1975FF", "#3385FF", "#4D94FF", "#66A3FF", "#80B2FF", "#99C2FF",
            "#B2D1FF", "#CCE0FF", "#E6F0FF" };

    final String[] GREEN = { "#001400", "#002900", "#003D00",
            "#005200", "#006600", "#007A00", "#008F00", "#00A300", "#00B800",
            "#00CC00", "#19D119", "#33D633", "#4DDB4D", "#66E066", "#80E680",
            "#99EB99", "#B2F0B2", "#CCF5CC", "#E6FAE6" };



    public enum COLOR {
        RED,GREEN,BLUE
    }

    public ColorCodingConfig(int min, int max, int intervals,COLOR color){
        this.max = max;
        this.min = min;
        this.intervals = intervals;
        this.color=color;
    }

    public int getIntervals(){
        return this.intervals + 2;
    }


    public HashMap<String,Integer> getIteration(int iteration){
        HashMap<String,Integer> result=new HashMap<String,Integer>();

        int avg=Math.abs((this.max-this.min)/this.intervals);

        int minIteration = iteration -1;
        if(minIteration < 0){
            result.put("lowerBound", null);
        }else{
            result.put("lowerBound", (minIteration * avg) + this.min);
        }

        int upperBound = (iteration * avg) + this.min;

        if(iteration > this.intervals){
            result.put("upperBound", null);
        }else{
            result.put("upperBound",upperBound);
        }

        return result;
    }

    public String getColor(int iteration){
        switch(this.color){
        case RED: return this.RED[iteration];
        case BLUE: return this.BLUE[iteration];
        case GREEN: return this.GREEN[iteration];
        default:  return null;
        }
    }





}
