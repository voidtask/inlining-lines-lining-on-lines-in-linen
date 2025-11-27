Backbone.Form.editors.RadioButtonGroup = Backbone.Form.editors.Text.extend({
    initialize: function(options) {
        _.bindAll(this, 'onItemClick');
        Backbone.Form.editors.Text.prototype.initialize.call(this, options);
        var thiz = this;
        jQuery.fn.extend({
            getGroupVal: function() {
                return thiz.$el.find('.' + thiz.getSelectedCls() + ' input').val();
            },
            setGroupVal: function(val) {
                _.each(thiz.getItems(), function(item) {
                    var jqItem = $(item),
                        selectedCls = thiz.getSelectedCls();
                    jqItem.removeClass(selectedCls);
                    if(jqItem.find('input[value="' + val + '"]').length == 1) {
                        jqItem.addClass(selectedCls);
                    }
                });
            }
        });

        thiz.$el.on('click', '.' + this.getItemBaseCls(), this.onItemClick);
    },

    getValue: function() {
        return this.$el.getGroupVal();
    },

    setValue: function(value) {
        value = (value || value === 0) ? (mg_echo_global.isObject(value) ? value.id : value)  : '';
        this.$el.setGroupVal(value);
    },

    render: function() {
        Backbone.Form.editors.Text.prototype.render.apply(this, arguments);
        this.$el.find('input').autocomplete({});
        return this;
    },

    onItemClick: function(e) {
        this.setSelectedItem($(e.currentTarget));
    },

    getItems: function() {
        return this.$el.find('.radio-button');
    },

    setSelectedItem: function(selected) {
        var thiz = this;
        _.each(this.getItems(), function(item) {
            var jqItem = $(item),
                selectedCls = thiz.getSelectedCls();
            if(jqItem.is(selected)) {
                jqItem.addClass(selectedCls);
            } else {
                jqItem.removeClass(selectedCls);
            }
        });
    },

    getSelectedItem: function() {
        var thiz = this,
            selectedItem;
        _.each(this.getItems(), function(item) {
            var jqItem = $(item),
                selectedCls = thiz.getSelectedCls();
            if(jqItem.hasClass(selectedCls)) {
                selectedItem = jqItem;
            }
        });
        return selectedItem;
    },

    getSelectedCls: function() {
        return 'selected';
    },

    getItemBaseCls: function() {
       return 'radio-button';
    },

    getItemCls: function(name) {
        if(name === 'creditCard') {
            return 'credit-card';
        } else if (name === 'cash') {
            return 'cash';
        }
    }
});
