Genghis.Views.NotFound = Backbone.View.extend({
    tagName:  'div',
    template: _.template($('#not-found-template').html()),
    initialize: function() {
        _.bindAll(this, 'render', 'remove');
    },
    render: function() {
        $(this.el).html(this.template());
        return this;
    },
    remove: function() {
        $(this.el).remove();
    }
});
