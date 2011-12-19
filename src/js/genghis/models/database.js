Genghis.Models.Database = Backbone.Model.extend({
    initialize: function() {
        this.collections = new Genghis.Collections.Collections;
        this.collections.url = this.url() + '/collections';
    }
});
