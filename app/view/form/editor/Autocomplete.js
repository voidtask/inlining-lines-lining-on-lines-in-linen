Backbone.Form.editors.Autocomplete = Backbone.Form.editors.Text.extend({
    events: {
        "keyup":  "onChange"
    },
    initialize: function(options) {
        _.bindAll(this, 'onSelect', 'onChange');
        Backbone.Form.editors.Text.prototype.initialize.call(this, options);

        this.$el.addClass('autocomplete');

        var acConfig = _.extend({}, {
            onSelect: this.onSelect
        }, options.schema.config);

        var loadingEl = this.$el.find('.mg-echo-loading');
        this.$el.find('input').autocomplete(acConfig)
            .on('beforeFetch', function(event) {
                loadingEl.show();
            })
            .on('fetchSuccess', function(event, response, responseOpts) {
                loadingEl.hide();
            })
            .on('fetchError', function(event, response, responseOpts) {
                if(response.statusText != 'abort') { //abort comes here when old requests aborted when typing
                    loadingEl.hide();
                }
            });
    },

    onChange: function() {
        this.trigger('onChange', this);
    },

    onSelect: function(suggestion) {
        this.value = suggestion;
        this.trigger('valueSelected', this);
    },

    getValue: function() {
        var self = this;
        if (this.schema.config.isGetLookupValue && this.schema.config.isGetLookupValue == true) {
            var tmpValue = null;
            $.each(this.schema.config.lookup, function(key, val){
                if (val.value && val.value == self.value) {
                    tmpValue = val.getValue();
                    return false;
                }
            });
            return tmpValue;
        }
        var val = this.$el.find('input').autocomplete().getValue();
        if(val && val instanceof Backbone.Model) {
            return val;
        } else {
            var emptyObject = null;
            if (self.schema.config.emptyObject != null) {
                emptyObject = self.schema.config.emptyObject;
            }
            if (emptyObject instanceof Backbone.Model) {
                return emptyObject.getEmptyObject();
            } else {
                return ''; //force selection
            }
        }
    },

    setValue: function(value) {
        value = (value || value === 0) ? value : '';
        this.$el.find('input').autocomplete().setValue(value);
        this.trigger('setValue', this);
    },

    render: function() {
        Backbone.Form.editors.Text.prototype.render.apply(this, arguments);
        this.$el.find('input').autocomplete({});
        return this;
    }
});