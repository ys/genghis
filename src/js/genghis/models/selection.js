Genghis.Models.Selection = Backbone.Model.extend({
    defaults: {
        server:     null,
        database:   null,
        collection: null,
        query:      null,
        page:       null
    },
    initialize: function() {
        _.bindAll(this, 'select', 'update', 'nextPage', 'previousPage');
        this.bind('change', this.update);

        this.pagination        = this.options.pagination;
        this.servers           = this.options.servers;
        this.currentServer     = this.options.currentServer;
        this.databases         = this.options.databases;
        this.currentDatabase   = this.options.currentDatabase;
        this.collections       = this.options.collections;
        this.currentCollection = this.options.currentCollection;
        this.documents         = this.options.documents;
        this.currentDocument   = this.options.currentDocument;
    },
    select: function(server, database, collection, documentId, query, page) {
        this.set({
            server:     server     || null,
            database:   database   || null,
            collection: collection || null,
            document:   documentId || null,
            query:      query      || null,
            page:       page       || null
        });
    },
    update: function() {
        var server     = this.get('server'),
            database   = this.get('database'),
            collection = this.get('collection'),
            documentId = this.get('document'),
            query      = this.get('query'),
            page       = this.get('page'),
            url        = Genghis.baseUrl,
            params     = {};

        url = url + 'servers';
        this.servers.url = url;
        this.servers.fetch();

        if (server) {
            url = url + '/' + server;
            this.currentServer.url = url;
            this.currentServer.fetch();

            url = url + '/databases';
            this.databases.url = url;
            this.databases.fetch();
        } else {
            this.currentServer.clear();
            this.databases.reset();
        }

        if (database) {
            url = url + '/' + database;
            this.currentDatabase.url = url;
            this.currentDatabase.fetch();

            url = url + '/collections';
            this.collections.url = url;
            this.collections.fetch();
        } else {
            this.currentDatabase.clear();
            this.collections.reset();
        }

        if (collection) {
            url = url + '/' + collection;
            this.currentCollection.url = url;
            this.currentCollection.fetch();

            url = url + '/documents';

            var url_query = '';
            if (query || page) {
                if (query) params.q = encodeURIComponent(query);
                if (page)  params.page = encodeURIComponent(page);
                url_query = '?' + Genghis.Util.buildQuery(params);
            }

            this.documents.url = url + url_query;
            this.documents.fetch();
        } else {
            this.currentCollection.clear();
            this.documents.reset();
        }

        if (documentId) {
            this.currentDocument.id = documentId;
            this.currentDocument.urlRoot = url;
            this.currentDocument.fetch();
        }
    },
    nextPage: function() {
        return 1 + (this.get('page') || 1);
    },
    previousPage: function() {
        return Math.max(1, (this.get('page') || 1) - 1);
    }
});
