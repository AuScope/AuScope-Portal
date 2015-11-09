package org.auscope.portal.server.domain.nvcldataservice;

import java.io.Serializable;
import java.util.List;

/**
 * Represents a NVCL CSV download response down sampled into fixed sized bins of X metres.
 * @author Josh Vote (CSIRO)
 *
 */
public class BinnedCSVResponse implements Serializable {

    private double binSize;
    private Bin[] bins;

    public double getBinSize() {
        return binSize;
    }

    public Bin[] getBins() {
        return bins;
    }

    public void setBinSize(double binSize) {
        this.binSize = binSize;
    }

    public void setBins(Bin[] bins) {
        this.bins = bins;
    }

    /**
     * A typed array of (non null) values
     * @author Josh Vote (CSIRO)
     *
     */
    public class Bin {
        private boolean numeric;
        private String name;
        private List<Object> values;
        private List<Double> startDepths;

        public Bin(String name, List<Double> startDepths, boolean numeric, List<Object> values) {
            super();
            this.name = name;
            this.numeric = numeric;
            this.values = values;
            this.startDepths = startDepths;
        }
        public String getName() {
            return name;
        }
        public List<Double> getStartDepths() {
            return startDepths;
        }
        public void setStartDepths(List<Double> startDepths) {
            this.startDepths = startDepths;
        }
        public boolean isNumeric() {
            return numeric;
        }
        public void setNumeric(boolean numeric) {
            this.numeric = numeric;
        }
        public List<Object> getValues() {
            return values;
        }
        public void setValues(List<Object> values) {
            this.values = values;
        }
    }
}
