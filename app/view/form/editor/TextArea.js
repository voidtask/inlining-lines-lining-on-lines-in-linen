Backbone.Form.editors.TextArea = Backbone.Form.editors.BaseTextField.extend({
    initialize: function(options) {
        Backbone.Form.editors.BaseTextField.prototype.initialize.call(this, options);
    },

    getValue: function() {
        return this.$el.find('textarea').val();
    },

    setValue: function(value) {
        value = (value || value === 0) ? value : '';

        this.$el.find('textarea').val(value);
    }
});
