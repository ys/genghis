Genghis.Views.App = Backbone.View.extend({
    el: 'section#genghis',
    initialize: function() {
        _.bindAll(this, 'showSection');

        // let's save this for later
        Genghis.baseUrl = this.options.base_url;

        // check the server status...
        $.getJSON(Genghis.baseUrl + 'check-status')
            .error(Genghis.Alerts.handleError)
            .success(function(status) {
                _.each(status.alerts, function(alert) {
                    Genghis.Alerts.add(_.extend({block: !alert.msg.search(/<(p|ul|ol|div)[ >]/i)}, alert));
                });
            });

        // trigger the first selection change. go go gadget app!
        Genghis.Selection.change();
    },
    showSection: function(section) {
        this.$('section').hide()
            .filter('#'+(_.isArray(section) ? section.join(',#') : section))
                .addClass('spinning').show();

        $(document).scrollTop(0);
    }
});
