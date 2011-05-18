package org.auscope.portal.server.domain.xml;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.xml.namespace.NamespaceContext;

/**
 * An extension of a regular NamespaceContext to support iteration of all available prefixes 
 * @author vot002
 *
 */
public abstract class IterableNamespaceContext implements NamespaceContext, Iterable<String> {

	protected Map<String, String> namespaces = new HashMap<String, String>();
	
	@Override
	public String getNamespaceURI(String prefix) {
		return namespaces.get(prefix);
	}

	/**
	 * Unsupported by default (subclasses may choose to implement)
	 */
	@Override
	public String getPrefix(String namespaceURI) {
		throw new UnsupportedOperationException();
	}

	/**
	 * Unsupported by default (subclasses may choose to implement)
	 */
	@Override
	public Iterator getPrefixes(String namespaceURI) {
		throw new UnsupportedOperationException();
	}

	/**
	 * Gets an iterator for the set of prefixes in this namespace context
	 */
	@Override
	public Iterator<String> iterator() {
		return namespaces.keySet().iterator();
	}

}
