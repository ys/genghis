window.Genghis = {
    Base:        {},
    Models:      {},
    Collections: {},
    Views:       {},
    app:         new Backbone.Marionette.Application(),
    boot:        function(baseUrl) {
        baseUrl = baseUrl + (baseUrl.charAt(baseUrl.length - 1) == '/' ? '' : '/')
        Genghis.baseUrl = baseUrl;
        Genghis.selection = new Genghis.Models.Selection;
        Genghis.app.start({
            baseUrl:   baseUrl,
            selection: Genghis.selection,
            alerts:    new Genghis.Collections.Alerts
        });
    }
};

Genghis.app.addRegions({
    main:   '#main',
    nav:    'header.navbar .container',
    alerts: '#alerts'
});
