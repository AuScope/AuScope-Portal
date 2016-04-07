Ext.ns('admin.AuScopeDiagnosticFunctions');

admin.AuScopeDiagnosticFunctions.ClearCswCache = Ext.create('admin.DiagnosticFunction', {
    name : 'Clear CS/W Cache',
    description : 'This function clears the internal CS/W cache which will force an immediate update request to be sent to each registry.',
    group : 'General',
    executeFn : function(callback) {
        Ext.Ajax.request({
            url : 'updateCSWCache.do',
            callback : function(options, success, response) {
                if (!success) {
                    callback(false, 'Unable to connect to server.');
                    return;
                }

                var responseObj = Ext.JSON.decode(response.responseText);
                callback(responseObj.success, responseObj.msg);
            }
        });
    }
});

admin.AuScopeDiagnosticFunctions.ClearGsmlpNSCache = Ext.create('admin.DiagnosticFunction', {
    name : 'Clear GsmlpNSCache',
    description : 'This function clears the internal GsmlpNS cache.',
    group : 'General',
    executeFn : function(callback) {
        Ext.Ajax.request({
            url : 'updateGsmlpNSCache.do',
            callback : function(options, success, response) {
                if (!success) {
                    callback(false, 'Unable to connect to server.');
                    return;
                }

                var responseObj = Ext.JSON.decode(response.responseText);
                callback(responseObj.success, responseObj.msg);
            }
        });
    }
});