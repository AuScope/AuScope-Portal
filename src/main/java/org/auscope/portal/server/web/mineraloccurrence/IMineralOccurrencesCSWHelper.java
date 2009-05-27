package org.auscope.portal.server.web.mineraloccurrence;

import java.util.ArrayList;

/**
 * User: Mathew Wyatt
 * Date: 26/05/2009
 * Time: 4:44:57 PM
 */
public interface IMineralOccurrencesCSWHelper {
    ArrayList<String> getMineralOccurrenceServiceUrls();

    ArrayList<String> getMiningActivityServiceUrls();

    ArrayList<String> getMineServiceUrls();
}
