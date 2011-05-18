package org.auscope.portal.serql;

/**
 * The base SeRQL exception
 * 
 * @author Josh Vote
 * 
 */
public class SerqlException extends Exception {
	public SerqlException(String msg) {
		super(msg);
	}

	public SerqlException(String msg, Throwable t) {
		super(msg, t);
	}

	public SerqlException(Throwable t) {
		super(t);
	}
}
