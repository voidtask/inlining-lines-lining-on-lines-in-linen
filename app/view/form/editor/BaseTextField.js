Backbone.Form.editors.BaseTextField = Backbone.Form.editors.Text.extend({

    initialize: function() {
        Backbone.Form.editors.Text.prototype.initialize.apply(this, arguments);
    },

    setValue: function(value) {
        var oldValue = this.getValue();
        Backbone.Form.editors.Text.prototype.setValue.apply(this, arguments);

        if(oldValue != this.getValue()) {
            this.trigger('change', this);
        }
    }
});