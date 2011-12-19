Genghis.Models.Collection = Backbone.Model.extend({
    initialize: function() {
        this.documents = new Genghis.Collections.Documents;
        this.documents.url = this.url() + '/documents';
    }
});
