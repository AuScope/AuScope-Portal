/**
 * A widget that attaches to a div ID for showing notifications from a backend NotificationService
 */
Ext.define('auscope.widgets.NotificationWidget', {

    notifications: null,
    currentNotificationCount: null,
    localStorage: null,
    lastNotified: null,


    /**
     * divId: String - The div ID to bind events/notifications to
     * maxAgeInDays: Number - The maximum number of days a notification can be before it's ignored. Defaults to 7
     */
    constructor: function(config) {
        this.divId = config.divId;
        this.maxAgeInDays = Ext.isNumber(config.maxAgeInDays) ? config.maxAgeInDays : 7;
        this.localStorage = new Ext.util.LocalStorage({
            id: 'auscope.widgets.NotificationWidget'
        });

        this.lastNotified = this.localStorage.getItem('lastNotified');
        if (Ext.isString(this.lastNotified)) {
            this.lastNotified = Number(this.lastNotified);
        }

        this.callParent(arguments);

        Ext.get(this.divId).on('click', this.onClick, this);
        this.refreshNotifications();
    },

    /**
     * Returns true if a notification is deemed to be "not seen" and "recent" to the user
     */
    isCurrentNotification: function(notification) {
        var now = new Date().getTime();
        var difference = Math.abs(now - notification.time);
        var differenceInDays = Math.ceil(difference / (1000 * 3600 * 24));

        //Really old notifications aren't current
        if (differenceInDays > this.maxAgeInDays) {
            return false;
        }

        //Notifications older than the last time we checked arent current
        if (Ext.isNumber(this.lastNotified) && this.lastNotified > notification.time) {
            return false;
        }

        return true;
    },

    onClick: function() {

        var configs = [];
        Ext.each(this.notifications, function(n) {
            configs.push({
                xtype: 'notificationpanel',
                notification: n,
                margin: '0 20 0 0',
            });
        });

        var popup = Ext.create('Ext.window.Window', {
            width: 420,
            height: 400,
            title: 'Notifications',
            padding: '5',
            border: false,
            modal: true,
            layout: 'fit',
            resizable: false,
            items: [{
                xtype: 'container',
                scrollable: true,
                layout: {
                    type: 'auto',
                    reserveScrollbar: true
                },
                items: configs
            }]
        });

        popup.show();

        this.lastNotified = new Date().getTime();
        this.localStorage.setItem('lastNotified', this.lastNotified);
        this.updateIcon();
    },

    /**
     * Updates the status of the notification icon
     */
    updateIcon: function() {
        var el = Ext.get(this.divId);
        el.setHtml('Notifications');

        this.currentNotificationCount = 0;
        Ext.each(this.notifications, function(notification) {
            if (this.isCurrentNotification(notification)) {
                notification.current = true;
                this.currentNotificationCount++;
            } else {
                notification.current = false;
            }
        }, this);

        if (this.currentNotificationCount) {
            var el = Ext.get(this.divId);
            el.setHtml('Notifications <div style="display:inline-block;position:relative;top:2px;"><img src="img/notification.png" width="16" height="16"/></div>');
        }
    },

    /**
     * Makes an AJAX request for the latest notification data
     */
    refreshNotifications: function() {
        portal.util.Ajax.request({
            url: 'getNotifications.do',
            scope: this,
            success: function(data) {
                this.notifications = data;
                this.updateIcon();
            }
        });
    }
});

/**
 * Widget for emulating a simple tweet display
 */
Ext.define('auscope.widgets.NotificationWidget.NotificationPanel', {
    extend : 'Ext.container.Container',
    alias: 'widget.notificationpanel',

    notification: null,

    constructor: function(config) {

        this.notification = config.notification;
        var dateString = Ext.util.Format.date(new Date(this.notification.time), 'd/m/Y');

        Ext.apply(config, {
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'center'
            },

            style: config.notification.current ? '' : 'background-color: #ddd;',
            items: [{
                xtype: 'image',
                src: 'img/twitter.png',
                width: 84,
                height: 64,
                padding: '0 10 0 10'
            },{
                xtype: 'container',
                flex: 1,
                layout: {
                    type: 'vbox',
                    align: 'stretch',
                    pack: 'center'
                },
                items: [{
                    xtype: 'container',
                    height: 24,
                    layout: 'fit',
                    items: [{
                        xtype: 'component',
                        html: Ext.util.Format.format('<div style="display:inline-block;"><a href="https://twitter.com/{0}" target="_blank">@{0}</a></div><div style="float:right;display:inline-block;">{1}</div>', this.notification.author, dateString)
                    }]
                },{
                    xtype: 'textarea',
                    fieldStyle: config.notification.current ? '' : 'background-color: #ddd;',
                    readOnly: true,
                    flex: 1,
                    value: this.notification.content
                }]
            }]
        });

        this.callParent(arguments);
    }
});
