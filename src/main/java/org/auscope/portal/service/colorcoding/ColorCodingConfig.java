package org.auscope.portal.service.colorcoding;

import java.util.HashMap;

public class ColorCodingConfig {

    int max,min,intervals;
    COLOR color;

    final String[] RED =  { "#FFE6E6", "#FFCCCC","#FFB2B2", "#FF9999", "#FF8080","#FF6666","#FF4D4D","#FF3333","#FF1919","#FF0000","#E60000","#CC0000","#B20000","#990000","#800000","#660000","#4C0000","#330000", "#1A0000" };

    final String[] BLUE = { "#E6F0FF", "#CCE0FF","#B2D1FF", "#99C2FF", "#80B2FF","#66A3FF","#4D94FF","#3385FF","#1975FF","#0066FF","#005CE6","#0052CC","#0047B2","#003D99","#003380","#002966","#001F4C","#001433", "#000A1A" };

    final String[] GREEN ={ "#E6FAE6", "#CCF5CC","#B2F0B2", "#99EB99", "#80E680","#66E066","#4DDB4D","#33D633","#19D119","#00CC00","#00B800","#00A300","#008F00","#007A00","#006600","#005200","#003D00","#002900", "#001400" };



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
