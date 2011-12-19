Genghis.Router = Backbone.Router.extend({
    routes: {
        '':                                                                                  'index',
        'servers':                                                                           'redirectToIndex',
        'servers/:server':                                                                   'server',
        'servers/:server/databases':                                                         'redirectToServer',
        'servers/:server/databases/:database':                                               'database',
        'servers/:server/databases/:database/collections':                                   'redirectToDatabase',
        'servers/:server/databases/:database/collections/:collection':                       'collection',
        'servers/:server/databases/:database/collections/:collection/documents':             'redirectToCollection',
        'servers/:server/databases/:database/collections/:collection/documents?*query':      'collectionQuery',
        'servers/:server/databases/:database/collections/:collection/documents/:documentId': 'document',
        '*path':                                                                             'notFound'
    },
    initialize: function(options) {
        this.selection = options.selection;

        // route to home when the logo is clicked
        $('.topbar a.logo').click(function(e) {
            e.preventDefault();
            this.navigate('', true);
        });
    },
    index: function() {
        document.title = 'Genghis';
        this.selection.select();
        Genghis.app.main.show(new Genghis.Views.Servers({collection: this.selection.servers}));
    },
    redirectToIndex: function() {
        this.navigate('', true);
    },
    server: function(server) {
        document.title = this.buildTitle(server)
        this.selection.select(server);
        Genghis.app.main.show(new Genghis.Views.Databases({
            model:      this.selection.server,
            collection: this.selection.databases
        }));
    },
    redirectToServer: function(server) {
        this.navigate('servers/'+server, true);
    },
    database: function(server, database) {
        document.title = this.buildTitle(server, database)
        this.selection.select(server, database);
        Genghis.app.main.show(new Genghis.Views.Collections({
            model:      this.selection.database,
            collection: this.selection.collections
        }));
    },
    redirectToDatabase: function(server, database) {
        this.navigate('servers/'+server+'/databases/'+database, true);
    },
    collection: function(server, database, collection) {
        document.title = this.buildTitle(server, database, collection)
        this.selection.select(server, database, collection);
        Genghis.app.main.show(new Genghis.Views.Documents({collection: this.selection.documents}))
    },
    redirectToCollection: function(server, database, collection) {
        this.navigate('servers/'+server+'/databases/'+database+'/collections/'+collection, true);
    },
    collectionQuery: function(server, database, collection, query) {
        document.title = this.buildTitle(server, database, collection, 'Query results');
        var params = Genghis.Util.parseQuery(query);
        this.selection.select(server, database, collection, null, params.q, params.page);
        Genghis.app.main.show(new Genghis.Views.Documents({collection: this.selection.documents}))
    },
    redirectToQuery: function(server, database, collection, query) {
        this.navigate('servers/'+server+'/databases/'+database+'/collections/'+collection+'?'+Genghis.Util.buildQuery({q: encodeURIComponent(query)}), true);
    },
    document: function(server, database, collection, documentId) {
        document.title = this.buildTitle(server, database, collection, documentId);
        this.selection.select(server, database, collection, documentId);
        Genghis.app.main.show(new Genghis.Views.Document({model: this.selection.doc}));
    },
    redirectToDocument: function(server, database, collection, document) {
        this.navigate('servers/'+server+'/databases/'+database+'/collections/'+collection+'/documents/'+document, true);
    },
    redirectTo: function(server, database, collection, document, query) {
        if (!server)     return this.redirectToIndex();
        if (!database)   return this.redirectToServer(server);
        if (!collection) return this.redirectToDatabase(server, database);

        if (!document && !query) {
            return this.redirectToCollection(server, database, collection);
        } else if (!query) {
            return this.redirectToDocument(server, database, collection, document);
        } else {
            return this.redirectToQuery(server, database, collection, query);
        }
    },
    notFound: function(path) {
        // fix a weird case where the Backbone router won't route if the root url == the current pathname.
        if (path.replace(/\/$/, '') == Genghis.baseUrl.replace(/\/$/, '')) return App.Router.navigate('', true);

        document.title = this.buildTitle('404: Not Found');
        Genghis.app.main.show(new Genghis.Views.NotFound);
    },
    buildTitle: function() {
        var args = Array.prototype.slice.call(arguments);
        return (args.length) ? 'Genghis \u2014 ' + args.join(' \u203A ') : 'Genghis';
    }
});

Genghis.app.addInitializer(function(options) {
    Genghis.app.router = new Genghis.Router(options);
});

// Genghis.app.bind("initialize:after", function(options) {
//     Backbone.history.start({pushState: true, root: options.baseUrl});
// });
