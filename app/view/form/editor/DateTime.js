Backbone.Form.editors.DateTime = Backbone.Form.editors.Text.extend({
    initialize: function(options) {
        Backbone.Form.editors.Text.prototype.initialize.call(this, options);

        this.$el.addClass('datetime');

        var dpConfig = options.schema.config,
            self = this;

        moment.locale(mg_echo_conf.locale, {
            week: { dow: 1 } // Monday is the first day of the week
        });
        this.$el.datetimepicker(dpConfig)
            .on('dp.asap', function() {
                //mask input field as 'ASAP'
                self.setAsapView();
                self.trigger('asapClicked', self);
            })
            .on('dp.ok', function() {
                self.trigger('setClicked', self);
            })
            .on('dp.select', function() {
                // 'dp.select' when we select datetime (not fires when we invoke setValue for datetimepicker.js)
                self.trigger('select', self);
            })
            .on('dp.show', function() {
                self.showDate = self.$el.data('DateTimePicker').date();
                self.showDateText = self.$el.find('input').val();
                self.trigger('pickerShow', self);
            })
            .on('dp.pickerBlur', function(data) {
                if (data.set !== true) {
                    self.$el.data('DateTimePicker').date(self.showDate);
                    self.$el.find('input').val(self.showDateText);
                }
                self.trigger('pickerBlur', self);
            })
            .on('dp.hide', function() {
                // fired when change value
                self.trigger('pickerHide', self);
            });
    },

    validateInput: function() {
        //    todo
    },

    getValue: function() {
        var value = this.$el.data('DateTimePicker').date();
        return value;
    },

    setValue: function(value, isStepping) {
        if(!value) {
            this.$el.data('DateTimePicker').clear();
        } else {
            this.$el.data('DateTimePicker').date(value, isStepping);
        }
    },

    setAsapView: function() {
        this.$el.find('input').val(mg_echo_global.getAsapText());
        this.showDateText = mg_echo_global.getAsapText();
    },

    render: function() {
        Backbone.Form.editors.Text.prototype.render.apply(this, arguments);
        this.$el.datepicker({
        });
        return this;
    }
});