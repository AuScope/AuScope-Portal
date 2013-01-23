package org.auscope.portal.view.knownlayer;

import java.net.MalformedURLException;
import java.net.URL;

import org.auscope.portal.core.services.responses.csw.AbstractCSWOnlineResource;
import org.auscope.portal.core.services.responses.csw.AbstractCSWOnlineResource.OnlineResourceType;
import org.auscope.portal.core.services.responses.csw.CSWRecord;
import org.auscope.portal.core.view.knownlayer.KnownLayerSelector;

public class IRISSelector implements KnownLayerSelector {
    
    private URL serviceEndpoint;
    
    public IRISSelector(String serviceEndpoint) throws MalformedURLException {
        this.serviceEndpoint = new URL(serviceEndpoint);
    }
    
    @Override
    public RelationType isRelatedRecord(CSWRecord record) {
        AbstractCSWOnlineResource[] onlineResources = record.getOnlineResourcesByType(OnlineResourceType.IRIS);

        if (onlineResources.length > 0) {
            for (AbstractCSWOnlineResource onlineResource : onlineResources) {
                if(serviceEndpoint.sameFile(onlineResource.getLinkage())) {
                    return RelationType.Belongs;
                }
            }
        }

        return RelationType.NotRelated;
    }
}