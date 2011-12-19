Genghis.Views.Nav = Backbone.View.extend({
    tagName: 'div',
    template: _.template($('#nav-template').html()),
    events: {
        'keyup input#navbar-query': 'findDocuments',
        'click a':                  'navigate'
    },
    initialize: function() {
        _.bindAll(this, 'render', 'updateQuery', 'findDocuments', 'navigate', 'navigateToServers', 'navigateUp', 'focusSearch');

        this.model.bind('change', this.render);
        this.model.bind('change', this.render);
        this.model.bind('change', this.render);
        this.model.bind('change', this.render);
        this.model.bind('change', this.render);

        this.model.bind('change:query',      this.toggleSections);
        this.model.bind('change:query',      this.updateQuery);

        $('body').bind('click', function(e) {
            $('.dropdown-toggle, .menu').parent('li').removeClass('open');
        });

        $(document).bind('keyup', 's', this.navigateToServers);
        $(document).bind('keyup', 'u', this.navigateUp);

        this.render();
    },
    render: function() {
        var view, selection;

        selection = this.model.toJSON(),

        $(this.el).html(this.template({query: this.model.get('query')}));

        $(document).bind('keyup', '/', this.focusSearch);

        if (selection.server) {
            view = new Genghis.Views.NavSection({
                model: selection.server,
                collection: Genghis.servers
            });

            this.$('ul.nav').append(view.render().el);
        }

        if (selection.database) {
            view = new Genghis.Views.NavSection({
                model: selection.database,
                collection: selection.server.databases
            });

            this.$('ul.nav').append(view.render().el);
        }

        if (selection.collection) {
            view = new Genghis.Views.NavSection({
                model: selection.collection,
                collection: selection.database.collections
            });

            this.$('ul.nav').append(view.render().el);
        }

        return this;
    },
    updateQuery: function() {
        var q = (this.model.get('query') || this.model.get('document') || '')
                .trim()
                .replace(/^\{\s*\}$/, '')
                .replace(/^\{\s*(['"]?)_id\1\s*:\s*\{\s*(['"]?)\$id\2\s*:\s*(["'])([a-z\d]+)\3\s*\}\s*\}$/, '$4');

        this.$('input#navbar-query').val(q);
    },
    findDocuments: function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();

            var q    = $(e.target).val(),
                base = Genghis.Util.route(this.model.CurrentCollection.url + '/documents'),
                url  = base + (q.match(/^([a-z\d]+)$/i) ? '/' + q : '?' + Genghis.Util.buildQuery({q: encodeURIComponent(q)}));

            Genghis.app.router.navigate(url, true);
        } else if (e.keyCode == 27) {
            this.$('input#navbar-query').blur();
            this.updateQuery();
        }
    },
    navigate: function(e) {
        e.preventDefault();
        Genghis.app.router.navigate(Genghis.Util.route($(e.target).attr('href')), true);
    },
    navigateToServers: function(e) {
        e.preventDefault();
        Genghis.app.router.redirectToIndex();
    },
    navigateUp: function(e) {
        e.preventDefault();
        Genghis.app.router.redirectTo(
            this.model.has('database')   && this.model.get('server'),
            this.model.has('collection') && this.model.get('database'),
            (this.model.has('document') || this.model.has('query')) && this.model.get('collection')
        );
    },
    focusSearch: function(e) {
        if (this.$('input#navbar-query').is(':visible')) {
            e.preventDefault();
            this.$('input#navbar-query').focus();
        }
    }
});

Genghis.app.addInitializer(function(options) {
    Genghis.app.nav.show(new Genghis.Views.Nav({model: options.selection}));
});
