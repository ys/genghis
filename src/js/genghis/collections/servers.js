Genghis.Collections.Servers = Backbone.Collection.extend({
    model: Genghis.Models.Server
});

Genghis.app.addInitializer(function(options) {
    Genghis.servers = new Genghis.Collections.Servers;
    Genghis.servers.url = options.baseUrl + 'servers';
    Genghis.servers.fetch();
});