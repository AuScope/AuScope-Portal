Ext.ns('Admin.Tests');

Admin.Tests.TestIDCounter = 0;

/**
 * The base test containing the interface that all tests must extend
 * and utilities for all tests to leverage
 */
Admin.Tests.BaseTest = Ext.extend(Ext.util.Observable, {
    _id : null,
    _status : null,

    /**
     * Accepts all Ext.util.Observable configuration options with the following additions
     * {
     *
     * }
     *
     * Adds the following events
     * statuschanged : function(Admin.Tests.BaseTest test, Admin.Tests.TestStatus status) - Called when this test undergoes a status change
     */
    constructor : function(cfg) {
        this.addEvents('statuschanged');
        this.listeners  = cfg.listeners;
        this._id = String.format('admintest-{0}', Admin.Tests.TestIDCounter++);
        this._status = Admin.Tests.TestStatus.Initialising;
        Admin.Tests.BaseTest.superclass.constructor.call(this, cfg);
    },

    /**
     * Gets the unique ID of this test as a String
     */
    getId : function() {
        return this._id;
    },

    /**
     * [Abstract] Gets the title of this test as a String
     */
    getTitle : Ext.emptyFn,

    /**
     * [Abstract] Gets the description of this test as a HTML String.
     *
     * This function may be called before, during or after a test is run. Ideally the results of this function
     * should be amended with details of the TestResult.
     */
    getDescription : Ext.emptyFn,

    /**
     * Gets the tooltip string for the current status of this test. This f
     */
    getStatusTip : function() {
        switch(this._status) {
        case Admin.Tests.TestStatus.Success:
            return 'This test has succeeded';
        case Admin.Tests.TestStatus.Warning:
            return 'This test has resulted in 1 or more non critical warnings. Please see the description for more information.';
        case Admin.Tests.TestStatus.Error:
            return 'This test has failed. Please see the description for more information.';
        case Admin.Tests.TestStatus.Running:
            return 'This test is currently running. The result will be available shortly.';
        case Admin.Tests.TestStatus.Unavailable:
            return 'This test is currently unavailable as it is unable to initialise all of it\'s dependencies.';
        }
    },

    /**
     * [Abstract] Starts this test. Extensions should raise the 'teststarted' event befo
     */
    startTest : Ext.emptyFn,

    /**
     * Utility function for changing the status of this test & alerting any listeners
     */
    _changeStatus : function(newStatus) {
        this._status = newStatus;
        this.fireEvent('statuschanged', this, newStatus);
    }

});