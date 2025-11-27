Backbone.Form.editors.FormField = Backbone.Form.editors.NestedModel.extend({

    initialize: function(options) {
        Backbone.Form.editors.NestedModel.prototype.initialize.call(this, options);
    },

    getValue: function() {
        if(this.nestedForm.model) {
            return this.nestedForm.model;
        }
        return Backbone.Form.editors.NestedModel.prototype.getValue.apply(this, arguments);

    },

    setValue: function(value) {
        if(value instanceof Backbone.Model) {
            this.nestedForm.model = value;
        } else {
            this.nestedForm.model.set(value);
        }
        this.nestedForm.updateView();
    },

    disable: function() {
        this.nestedForm.disable();
    },

    enable: function() {
        this.nestedForm.enable();
    }
});