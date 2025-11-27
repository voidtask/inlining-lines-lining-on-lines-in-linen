Magenta.Echo.InlineBooking.Views.AbstractForm = Backbone.Form.extend({
    errorCls: '.error-message',
    warningCls: '.warning-message',
    successCls: '.success-message',

    initialize: function(config) {
        if(config.schema) {
            var thiz = this,
                key;
            for (key in config.schema) {
                var schemaItem = config.schema[key];
                if (
                    schemaItem && schemaItem.config
                    && schemaItem.config.options
                    && schemaItem.config.options instanceof Backbone.Collection
                ) {
                    this.listenTo(schemaItem.config.options, 'fail', thiz.onCollectionFail);
                }
            }
        }


        this.exceptionHandler = new Magenta.Echo.InlineBooking.Utils.ExceptionResponseHandler();
        _.extend(this.exceptionHandler, Backbone.Events);
        this.exceptionHandler.on("beforeResponseProcessed", function(){
            thiz.onBeforeResponseProcessed();
        });
        this.exceptionHandler.on("error", function(msg){
            thiz.onError(msg);
        });
        this.exceptionHandler.on("warning", function(msg){
             thiz.onWarning(msg);
        });

        Backbone.Form.prototype.initialize.apply(this, arguments);
    },

    commit: function() {
        _.each(this.fields, function(field) {
            var editor = field.editor;
            if(editor.nestedForm && editor.nestedForm.model){
                editor.commit();
            }
        });
        return Backbone.Form.prototype.commit.apply(this, arguments);
    },

    disable: function() {
        _.each(this.fields, function(field) {
            field.disable();
        });
    },

    enable: function() {
        _.each(this.fields, function(field) {
            field.enable();
        });
    },

    onBeforeResponseProcessed: function() {
        this.hideAndEmptyMessages();
    },

    onError: function(msg) {
        this.showError(msg);
    },

    onWarning: function(msg) {
        this.showWarning(msg);
    },

    onCollectionFail: function(response, responseOpts) {
        this.exceptionHandler.onResponse(responseOpts);
    },

    show: function() {
        this.clearValidationAndMessages();
        this.$el.show();
    },

    hide: function() {
        this.clearValidationAndMessages();
        this.$el.hide();
    },

    clearValidationAndMessages: function() {
        this.clearValidation();
        this.hideAndEmptyMessages();
    },

   hideAndEmpty: function(el) {
       el.empty();
       el.hide();
   },

    hideAndEmptyByCls: function(cls) {
        var thiz = this;
        this.$el.find(cls).each(function(i) {
           thiz.hideAndEmpty($(this));
       })
    },

    hideAndEmptyMessages: function() {
        this.hideAndEmptyByCls(this.errorCls);
        this.hideAndEmptyByCls(this.warningCls);
        this.hideAndEmptyByCls(this.successCls);
    },

    showSuccess: function(msg) {
        var successEl = this.getSuccessEl();
        successEl.empty();
        successEl.text(msg);
        successEl.show();
    },

    showWarning: function(msg) {
        var warningEl = this.getWarningEl();
        warningEl.empty();
        warningEl.text(msg);
        warningEl.show();
    },

    showError: function(msg) {
        var errorEl = this.getErrorEl();
        errorEl.empty();
        errorEl.text(msg);
        errorEl.show();
    },

    clearValidation: function() {
        var self = this,
            fields = this.fields;

        _.each(fields, function(field) {
            field.clearError();
            if(field.editor.nestedForm) {
                field.editor.nestedForm.clearValidation();
            }
        });
    },

    clearFields: function() {
        for (var key in this.schema) {
            var field = this.fields[key],
                nestedForm = field.editor.nestedForm;

            if(nestedForm) {
                if(nestedForm.clearFields) {
                    nestedForm.clearFields();
                } else {
                    mg_echo_global.log("Nested form" + nestedForm.name + " has no clearFields method. NOT CLEARED")
                }
            } else {
                field.setValue('');
            }
        }
    },

    updateView: function() {
        if(!this.model) {
            return;
        }
        var key;
        for (key in this.schema) {
            var field = this.fields[key],
                nestedForm = field.editor.nestedForm,
                nestedModel = nestedForm ? nestedForm.model : null;

            if(nestedModel) {
                nestedModel.clear();
                if(this.model.get(key)) {
                    nestedModel.set(this.model.get(key));
                }
            }

            if(nestedForm) {
                field.setValue(nestedModel);
            } else {
                field.setValue(this.model.get(key) || '');
            }
        }

        this.onUpdateView();
    },

    //protected
    onUpdateView: function() {

    },

    logout: function(callback, scope) {
        var thiz = scope || this;

        thiz.$el.mask(translate('loading'));
        mg_echo_global.ajax({
            url: "/auth/logout",
            type: 'POST',
            dataType: 'json'
        }).done(function (data, textStatus, jqXHR) {
            thiz.$el.unmask();
            if (data.success && callback) {
                mg_echo_global.getLocalStorage().removeItem('iba_token');
                if (mg_echo_global.formStep2.getForm().validate() == null) {
                    thiz.clearValidationAndMessages();
                }

                callback.apply(thiz);

                $(mg_echo_global.formStep2.getEditor('creditCard').el).hide();
                mg_echo_global.getBookingModel().set('creditCard', null);

                mg_echo_global.getContactModel().clear();
                mg_echo_global.formStep2.getEditor('contactRecord').getValue().clear();

                mg_echo_global.getMOPListModel().clear();

                var mopEditor = mg_echo_global.formStep2.getEditor('mop');
                mg_echo_global.getMOPListModel().availableUpdate();
                mopEditor.renderSuggestions();

                // revert to the default mop
                mg_echo_global.formStep2.getEditor('mop').setValue(mg_echo_global.defaultMop);
                mg_echo_global.getBookingModel().set('mop', mg_echo_global.defaultMop.get('type'));

                mg_echo_global.getBookingModel().set({ 'contactRecord' : null });
                mg_echo_global.getBookingConfig('defaultValues').defaultForBookingCard = null;

                mg_echo_global.getFlightChecker().hideErrors();
                mg_echo_global.formStep2.getForm().isValidForPrice();

                if (mg_echo_global.manualChangeService !== true) {
                    mg_echo_global.getBookingConfig('defaultValues').service = mg_echo_global.getBookingConfig('defaultValues').CA_service;
                    mg_echo_global.getBookingModel().set(
                        'serviceRecord',
                        new Magenta.Echo.InlineBooking.Models.Service( mg_echo_global.getBookingConfig('defaultValues').CA_service )
                    );
                    mg_echo_global.formStep2.updateView();
                } else {
                    // // reset to the default service if it is not changed manually
                    $.ajax({
                        url: mg_echo_conf.rootPath + "/api/services/availableToBookOnline",
                        type: 'POST',
                        dataType: 'json'
                    }).done(function (data, textStatus, jqXHR) {

                        // Ищем выбранный сервис контакта среди сервисов аккаунта, если есть, то оставляем его выбранным
                        if(data.rows.find(function(item){
                            return item.id == mg_echo_global.formStep2.getEditor('serviceRecord').getValue().id
                        })) {
                            mg_echo_global.getBookingModel().set(
                                'serviceRecord',
                                mg_echo_global.formStep2.getEditor('serviceRecord').getValue()
                            );
                        }

                        mg_echo_global.formStep2.updateView();
                    });
                }

                thiz.$el.unmask();
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            thiz.$el.unmask();
            thiz.exceptionHandler.onResponse(jqXHR);
        });
    },

    getErrorEl: function() {
        return this.$el.find(this.errorCls);
    },

    getWarningEl: function() {
        return this.$el.find(this.warningCls);
    },

    getSuccessEl: function() {
        return this.$el.find(this.successCls);
    },

    getValueJson: function() {
        var attrs = this.getValue();
        if (attrs.date !== null) {
            attrs.date = mg_echo_global.getUTCDateFormatted(attrs.date);
        }
        return JSON.stringify(attrs);
    }
});