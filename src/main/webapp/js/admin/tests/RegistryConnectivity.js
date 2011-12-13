Ext.ns('Admin.Tests');

/**
 * Tests that configured registries are responding to basic CSW requests
 */
Admin.Tests.RegistryConnectivity = Ext.extend(Admin.Tests.BaseTest, {

    constructor : function(cfg) {
        Admin.Tests.RegistryConnectivity.superclass.constructor.call(this, cfg);
    },

    getTitle : function() {
        return 'Portal registry connectivity';
    },

    getDescription : function() {
        var baseDescription = 'This test ensures that the backend is capable of making basic CSW requests to all configured registries. The registry responses are also tested for validity.';

        baseDescription += Admin.Tests.RegistryConnectivity.superclass.getDescription.call(this);

        return baseDescription;
    },


    /**
     * The entirety of our test is making a request to the controller and parsing the resposne
     */
    startTest : function() {
        this._changeStatus(Admin.Tests.TestStatus.Running);

        Ext.Ajax.request({
            url : 'testCSWConnectivity.do',
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