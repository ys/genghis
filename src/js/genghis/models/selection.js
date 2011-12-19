Genghis.Models.Selection = Backbone.Model.extend({
    defaults: {
        server:     null,
        database:   null,
        collection: null,
        doc:        null //,
        // query:      null,
        // page:       null
    },
    initialize: function() {
        _.bindAll(this, 'select', 'update', 'nextPage', 'previousPage');

        // this.bind('change', this.update);
    },
    select: function(serverName, databaseName, collectionName, documentId, query, page) {
        var sel = {},
            that = this;

        that.servers = Genghis.servers;
        that.servers.fetch({success: function() {
            if (serverName) {
                sel.server = that.servers.get(serverName);
                that.databases = sel.server.databases;
                that.databases.fetch({success: function() {
                    if (databaseName) {
                        sel.database = server.databases.get(databaseName);
                        that.collections = sel.database.collections;
                        that.collections.fetch({success: function() {
                            if (collectionName) {
                                sel.collection = database.collections.get(collectionName);
                                that.documents = sel.collection.documents;
                                that.documents.fetch({success: function() {
                                    if (documentId) {
                                        sel.doc = collection.documents.get(documentId);
                                    }
                                    that.set(sel);
                                }});
                            } else {
                                that.set(sel);
                            }
                        }});
                    } else {
                        that.set(sel);
                    }
                }});
            } else {
                that.set(sel);
            }
        }});
    },
    update: function() {
        var server            = this.get('server'),
            servers           = this.get('servers'),
            currentServer     = this.get('currentServer'),
            database          = this.get('database'),
            databases         = this.get('databases'),
            currentDatabase   = this.get('currentDatabase'),
            collection        = this.get('collection'),
            collections       = this.get('collections'),
            currentCollection = this.get('currentCollection'),
            documentId        = this.get('document'),
            documents         = this.get('documents'),
            currentDocument   = this.get('currentDocument'),
            query             = this.get('query'),
            page              = this.get('page'),
            url               = Genghis.baseUrl,
            params            = {};

        url = url + 'servers';
        servers.url = url;
        servers.fetch();

        if (server) {
            url = url + '/' + server;
            currentServer.url = url;
            currentServer.fetch();

            url = url + '/databases';
            databases.url = url;
            databases.fetch();
        } else {
            currentServer.clear();
            databases.reset();
        }

        if (database) {
            url = url + '/' + database;
            currentDatabase.url = url;
            currentDatabase.fetch();

            url = url + '/collections';
            collections.url = url;
            collections.fetch();
        } else {
            currentDatabase.clear();
            collections.reset();
        }

        if (collection) {
            url = url + '/' + collection;
            currentCollection.url = url;
            currentCollection.fetch();

            url = url + '/documents';

            var urlQuery = '';
            if (query || page) {
                if (query) params.q = encodeURIComponent(query);
                if (page)  params.page = encodeURIComponent(page);
                urlQuery = '?' + Genghis.Util.buildQuery(params);
            }

            documents.url = url + urlQuery;
            documents.fetch();
        } else {
            currentCollection.clear();
            documents.reset();
        }

        if (documentId) {
            currentDocument.id = documentId;
            currentDocument.urlRoot = url;
            currentDocument.fetch();
        }
    },
    nextPage: function() {
        return 1 + (this.get('page') || 1);
    },
    previousPage: function() {
        return Math.max(1, (this.get('page') || 1) - 1);
    }
});
