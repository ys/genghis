Genghis.Models.Server = Backbone.Model.extend({
    initialize: function() {
        this.databases = new Genghis.Collections.Databases;
        this.databases.url = this.url() + '/databases';
    }
});
