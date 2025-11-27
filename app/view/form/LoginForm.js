Magenta.Echo.InlineBooking.Views.LoginForm = Magenta.Echo.InlineBooking.Views.AbstractForm.extend({

    initialize: function() {
        _.bindAll(this, 'onClickSubmit', 'onClickClose', 'onClickSkip', 'onClickRemindPwd');
        Magenta.Echo.InlineBooking.Views.AbstractForm.prototype.initialize.apply(this, arguments);

        this.$el.find('.submit').on('click', this.onClickSubmit);
        this.$el.find('.mg-close').on('click', this.onClickClose);
        this.$el.find('.without-signing-in').on('click', this.onClickSkip);
        this.$el.find('.remind-pwd.trigger').on('click', this.onClickRemindPwd);
    },

    onClickSubmit: function () {
        var thiz = this,
            errors = this.validate();
        if (!errors || errors.length == 0) {
            this.$el.mask(translate('loading_logging_in'));
            $.ajax({
                url: mg_echo_conf.rootPath + "/api/auth/login",
                data: thiz.getValue(),
                type: 'GET',
                dataType: 'json'
            }).done(function (data, textStatus, jqXHR) {
                thiz.$el.unmask();
                thiz.exceptionHandler.onResponse(jqXHR);
                if(data.success) {
                    mg_echo_global.setSecuredOnFormStep2();

                    thiz.hideLoginForm();
                    mg_echo_global.showBookingStep2Wrapper();

                    thiz.loadCurrentContact(function(){
                        this.loadDefaultValues(function(){
                            mg_echo_global.formStep2.loadPriceAndCapacity()
                        }, thiz)
                    }, thiz);
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                thiz.$el.unmask();
                thiz.exceptionHandler.onResponse(jqXHR);
            });
        }
    },

    loadCurrentContact: function(callback, scope) {
        var thiz = this;
        mg_echo_global.formStep2.mask(translate('loading'));
        mg_echo_global.ajax({
            url: "/contact/current/get",
            type: 'GET',
            dataType: 'json'
        }, true).done(function (data, textStatus, jqXHR) {
            thiz.exceptionHandler.onResponse(jqXHR);
            if(data.success && data.rows && data.rows.length === 1) {
                mg_echo_global.getContactModel().clear();
                var contact = data.rows[0],
                    existedContactModel = mg_echo_global.formStep2.getEditor('contactRecord').getValue(),
                    existingContactId = existedContactModel ? existedContactModel.get('id') : '',
                    contactExistsInModel = existingContactId || existingContactId === 0,
                    firstLogIn = !contactExistsInModel,
                    loggedInWithAnotherContact = (contactExistsInModel && existingContactId != contact.id),
                    setContactData = function() {
                        mg_echo_global.getContactModel().set(contact);
                        mg_echo_global.formStep2.getEditor('contactRecord').setValue(new Magenta.Echo.InlineBooking.Models.AbstractModel(contact));
                        if(contact.creditCard) {
                            var creditCardModel = new Magenta.Echo.InlineBooking.Models.CreditCard(contact.creditCard);
                            mg_echo_global.formStep2.getEditor('creditCard').setValue(creditCardModel);
                        }
                    },
                    invokeCallback = function() {
                        if(callback) {
                            callback.apply(scope || thiz);
                        }
                    };

                if(existingContactId == contact.id) { //session expired and customer logs in with the same user
                    mg_echo_global.formStep2.loadPriceAndCapacity(); //the session can be expired during price/capacity request => need to recalculate them
                } else if (loggedInWithAnotherContact) {
                    mg_echo_global.clearBookingModel();
                    mg_echo_global.formStep2.updateView();
                    mg_echo_global.formStep2.setDefaultValues();
                    setContactData();
                    invokeCallback();
                } else if (firstLogIn) { //if no contact set in the booking form (first time log in)
                    mg_echo_global.formStep2.updateView();
                    setContactData();
                    invokeCallback();
                }
            }
            mg_echo_global.formStep2.unmask();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            mg_echo_global.formStep2.unmask();
            thiz.exceptionHandler.onResponse(jqXHR);
        });
    },

    loadDefaultValues: function(callback, scope) {
        var thiz = this;
        mg_echo_global.formStep2.mask(translate('loading'));
        mg_echo_global.ajax({
            url: "/booking/defaultValues",
            type: 'GET',
            dataType: 'json'
        }, true).done(function (data, textStatus, jqXHR) {
            thiz.exceptionHandler.onResponse(jqXHR);
            if(data.success && data.rows && data.rows.length === 1) {
                var defaultValues = data.rows[0],
                    service = defaultValues.service,
                    mop = defaultValues.mop;
                mg_echo_global.formStep2.getEditor('serviceRecord').setValue(new Magenta.Echo.InlineBooking.Models.Service(service));
                mg_echo_global.formStep2.getEditor('mop').setValue(mop);
            }
            mg_echo_global.formStep2.unmask();
            if(callback) {
                callback.apply(scope || thiz);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            mg_echo_global.formStep2.unmask();
            thiz.exceptionHandler.onResponse(jqXHR);
        });
    },

    onClickRemindPwd: function() {
        var errors = this.fields['username'].validate(),
            thiz = this;
        if(!errors || errors.length == 0) {
            this.$el.mask(translate('loading'));
            this.hideAndEmptyMessages();
            $.ajax({
                url: mg_echo_conf.rootPath + "/api/auth/recovery_request",
                data: {
                    'username': thiz.getEditor('username').getValue()
                },
                type: 'POST',
                dataType: 'json'
            }).done(function (data, textStatus, jqXHR) {
                thiz.$el.unmask();
                thiz.exceptionHandler.onResponse(jqXHR);
                if(data.success) {
                    thiz.showSuccess("Recovery link has been sent to your email");
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                thiz.$el.unmask();
                thiz.exceptionHandler.onResponse(jqXHR);
            });
        }
    },

    onClickClose: function () {
        mg_echo_global.hideLoginWrapper();
        mg_echo_global.showBookingStep1Form();
    },

    onClickSkip: function () {
        mg_echo_global.formStep2.updateView();
        mg_echo_global.formStep2.loadPriceAndCapacity();
        mg_echo_global.hideLoginWrapper();
        mg_echo_global.showBookingStep2Wrapper();
    },

    hideLoginForm: function() {
        mg_echo_global.hideLoginWrapper();
    }
});