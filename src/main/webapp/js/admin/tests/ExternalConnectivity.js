Ext.ns('Admin.Tests');

/**
 * Tests that certain globally accessable URL's are available via HTTP and HTTPS
 */
Admin.Tests.ExternalConnectivity = Ext.extend(Admin.Tests.BaseTest, {

    constructor : function(cfg) {
        Admin.Tests.ExternalConnectivity.superclass.constructor.call(this, cfg);
    },

    getTitle : function() {
        return 'Portal external connectivity';
    },

    getDescription : function() {
        var baseDescription = 'This test seeks to connect the backend server to a globally accessable URL via HTTP and HTTPS.';

        baseDescription += Admin.Tests.ExternalConnectivity.superclass.getDescription.call(this);

        return baseDescription;
    },


    /**
     * The entirety of our test is making a request to the controller and parsing the resposne
     */
    startTest : function() {
        this._changeStatus(Admin.Tests.TestStatus.Running);

        Ext.Ajax.request({
            url : 'testExternalConnectivity.do',
            scope : this,
            callback : function(options, success, response) {
                if (!success) {
                    this._errors.push(response.responseText);
                    this._changeStatus(Admin.Tests.TestStatus.Unavailable);
                    return;
                }

                var responseObj = Ext.util.JSON.decode(response.responseText);
                this._handleAdminControllerResponse(responseObj);
            }
        })
    }
});