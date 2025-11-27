Magenta.Echo.InlineBooking.Views.BookingFormFull = Magenta.Echo.InlineBooking.Views.BookingForm.extend({
    heapCls: 'heap',
    capacityCls: 'heap',
    priceCls: 'heap',
    sessionCls: 'session',

    steps: {
        start: 'start',
        registration: 'registration',
        login: 'login',
        confirmationCode: 'confirmationCode',
        end: 'end'
    },

    webPaymentPopup: null,
    isLocked: false,

    initialize: function() {
        _.bindAll(this, 'initPriceMsg', 'initCapacityMsg', 'onChangedForPriceAndCapacity', 'onExistedCardBtnPressed', 'onBook', 'onClose', 'onLogout', 'onResendCode', 'onResetPassword');
        Magenta.Echo.InlineBooking.Views.BookingForm.prototype.initialize.apply(this, arguments);

        var thiz = this;
        this.getEditor('date').on('asapClicked setClicked',this.onChangedForPriceAndCapacity);
        this.getEditor('serviceRecord').on('valueSelected setValue',this.onChangedForPriceAndCapacity);
        this.getEditor('pickup').on('valueSelected', function(editor) {
            if (editor.value.attributes.clarify === true) {
                thiz.clarifyAddress(editor.value.attributes, 'pickup');
            } else {
                thiz.onChangedForPriceAndCapacity();
                mg_echo_global.getBookingModel().set('pickup', editor.getValue());
            }
        });
        this.getEditor('dropoff').on('valueSelected', function(editor) {
            if (editor.value.attributes.clarify === true) {
                thiz.clarifyAddress(editor.value.attributes, 'dropoff');
            } else {
                thiz.onChangedForPriceAndCapacity();
                mg_echo_global.getBookingModel().set('dropoff', editor.getValue());
            }
        });
        this.getEditor('extras').on('valueChange',this.onChangedForPriceAndCapacity);
        this.getEditor('passengers').on('valueSelected', this.onChangedForPriceAndCapacity);
        this.getEditor('mop').on('valueSelected', function() {
            if (
                (this.$el.find('input').val() != mg_echo_global.clientMop['CREDIT_TYPE'].value) &&
                !(this.$el.find('input').val() == mg_echo_global.clientMop['CASH_TYPE'].value &&
                    mg_echo_global.getBookingConfig('isCreditCardRequired') == true &&
                    mg_echo_global.getContactModel().get('creditCards').length == 0)
            ) {
                thiz.clientValidateForm();
            }
            thiz.onChangedForPriceAndCapacity();

            if (mg_echo_global.getFlightChecker().isError == true) {
                mg_echo_global.getFlightChecker().validate();
            }
        });

        this.getEditor('pickup').on('onChange',function(){
            if (this.getValue() === "") {
                thiz.clearPriceAndResponseTimeAndHide();
            }
            mg_echo_global.getBookingModel().set('pickup', this.getValue());
        });
        this.getEditor('dropoff').on('onChange',function(){
            if (this.getValue() && this.getValue().addrId === null) {
                thiz.clearPriceAndResponseTimeAndHide();
            }
            mg_echo_global.getBookingModel().set('dropoff', this.getValue());
        });

        mg_echo_global.getFlightChecker().on('hideFlightDetails changeDateAsap changeDatePickup', this.onChangedForPriceAndCapacity);

        this.getEditor('creditCard').on('existedCardBtnPressed', this.onExistedCardBtnPressed);

        this.getBookBtn().on('click', this.onBook);
        this.getCloseBtn().on('click', this.onClose);
        this.getLogoutBtn().on('click', this.onLogout);
        this.getNextBtn().on('click', function () {
            thiz.onNext();
        });

        this.getResendCodeBtn().on('click', this.onResendCode);
        this.getResetPasswordBtn().on('click', this.onResetPassword);

        this.initPriceMsg();
        this.initCapacityMsg();
        this.initMultiStepRegistration();

        this.initInputFocused();
        this.setupCompanyPhone(mg_echo_conf.companyPhone);

        this.toggleShowPasswordIcon = this.$el.find('.mg-echo-eye-icon');
        this.toggleShowPasswordIcon.on('click', function () {
            if (!$(this).hasClass('mg-visible')) {
                $(this).addClass('mg-visible');
                $(this).closest('.field-container').find('input[name="password"]').attr('type', 'text');
            } else {
                $(this).removeClass('mg-visible');
                $(this).closest('.field-container').find('input[name="password"]').attr('type', 'password');
            }
        });

        if (mg_echo_conf.widgetType === mg_echo_global.widgetTypes.airport) {
            $(this.el).addClass('mg-echo-airport');
        }

        this.webPaymentPopup = new Magenta.Echo.InlineBooking.Views.WebPaymentPopup(null, function () {
            thiz.unlock();
            thiz.cancelQuote();
            if (!thiz.webPaymentPopup.declined) {
                thiz.getPriceAndResponseTime();
            }
        });
        window.addEventListener("beforeunload", function (e) {
            thiz.onClosePage();
        }, false);
    },

    initMultiStepRegistration: function() {

        var thiz = this;

        thiz.step = this.steps.start;

        thiz.stepForm = thiz.$el.find('.mg-echo-step-form');
        thiz.nextBtn = thiz.$el.find('.mg-echo-next-btn');
        thiz.stepAllEl = thiz.$el.find('.mg-echo-step');
        thiz.stepStartEl = thiz.$el.find('.mg-echo-step-start');
        thiz.stepLoginEl = thiz.$el.find('.mg-echo-step-login');
        thiz.stepRegistrationEl = thiz.$el.find('.mg-echo-step-registration');
        thiz.stepConfirmationCodeEl = thiz.$el.find('.mg-echo-step-confirmation-code');
        thiz.editEmailIcon = thiz.stepStartEl.find('.mg-echo-edit-icon');
        thiz.logoutLink = thiz.$el.find('.mg-echo-logout-link');


        thiz.updateMultiStepRegistration();

        thiz.stepForm.on('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            thiz.updateMultiStepRegistration();
        });

        thiz.editEmailIcon.on('click', function() {
            thiz.step = thiz.steps.start;
            thiz.updateMultiStepRegistration({'notClear' : true});
            $(mg_echo_global).trigger('event.login.email_edit');
        });

        thiz.stepRegistrationEl.find('input[name="phone"]').intlTelInput({
            separateDialCode: true,
            preferredCountries: mg_echo_conf.preferredCountries ? [mg_echo_conf.preferredCountries] : ['gb'],
        });

        thiz.logoutLink.on('click', function() {
            thiz.step = thiz.steps.start;
            thiz.updateMultiStepRegistration({focus : true, forcibly: true});
            thiz.onLogout();
        });

        thiz.stepRegistrationEl.find('input[name="phone"]').maskin('P');
        thiz.stepStartEl.find('input[name="email"]').maskin("E");

        thiz.$el.find('.mg-echo-credit-card-lock-close-icon').on('click', function() {
            thiz.unlock();
            thiz.onClosePage();
            thiz.getPriceAndResponseTime();
        });

        thiz.$el.find('.mg-echo-proceed-payment-lock-close-icon').on('click', function() {
            thiz.proceedPaymentUnlock();
            thiz.cancelQuote();
            thiz.getPriceAndResponseTime();
        });

        thiz.$el.find('.mg-echo-proceed-payment-lock-button').on('click', function() {
            thiz.proceedPayment();
        });
    },

    updateMultiStepRegistration: function(args) {

        var args = args || {};

        // Если авторизованы, то не нужно ничего делать
        if (!args.forcibly && mg_echo_global.getContactModel().get('id') != null) {
            return false;
        }

        if (args && args.step) {
            this.step = args.step;
        }
        if (args.notClear !== true && mg_echo_global.getRegistrationAndLoginForm()) {
          mg_echo_global.getRegistrationAndLoginForm().clearValidationAndMessages();
        }
        if (this.step == this.steps.start) {

            this.stepStartEl.find('input[name="email"]').prop('disabled', false);

            // Очищаем поля
            if (args.notClear == null || args.notClear !== true ) {
                this.stepStartEl.find('input[name="email"]').val('');
            }
            this.stepLoginEl.find('input[name="password"]').val('');
            this.stepRegistrationEl.find('input[name="phone"]').val('') ;
            this.stepRegistrationEl.find('input[name="name"]').val('') ;
            this.stepConfirmationCodeEl.find('input[name="confirmationCode"]').val('') ;

            $(this.el).removeClass('state-authorized').addClass('state-anonym');
            this.stepForm.find('fieldset').prop('disabled', false);
            this.stepStartEl.show().addClass('mg-echo-step-active');
            this.stepStartEl.removeClass('disabled');

            if (args == null || args.focus == null || args.focus !== false) {
                this.stepStartEl.find('input:first').focus();
            }

            this.stepRegistrationEl.hide();
            this.stepConfirmationCodeEl.hide();
            this.stepLoginEl.hide();
            this.step = this.steps.registration;

            this.hideResetMessage();
        }
        else if (this.step == this.steps.registration) {

            this.stepStartEl.removeClass('mg-echo-step-active');

            // validate email
            if (!mg_echo_global.getRegistrationAndLoginForm().fields.email.validate()) {
                this.stepStartEl.addClass('disabled');
                this.stepStartEl.find('input[name="email"]').prop('disabled', true);
                this.checkUserExists();
                $(mg_echo_global).trigger('event.login.email_success');
            } else {
                this.step = this.steps.start;
                this.updateMultiStepRegistration({'notClear' : true});

                if (mg_echo_global.getRegistrationAndLoginForm().getValue().email == '') {
                    $(mg_echo_global).trigger('event.login.email_empty');
                } else {
                    $(mg_echo_global).trigger('event.login.email_invalid');
                }
            }
        }
        else if (this.step == this.steps.login) {
            if (!mg_echo_global.getRegistrationAndLoginForm().fields.password.validate()) {
                this.login();
            } else {
                this.stepToLogin();
            }
        }
        else if (this.step == this.steps.confirmationCode) {
            mg_echo_global.getRegistrationAndLoginForm().fields.password.clearError();

            // validate agree checkbox
            var errorAgree = mg_echo_global.getRegistrationAndLoginForm().fields.agreeTerms.validate();

            // validate phone and name
            var errorPhone = mg_echo_global.getRegistrationAndLoginForm().fields.phone.validate();
            var errorName = mg_echo_global.getRegistrationAndLoginForm().fields.name.validate();
            var emptyPasswordError = !/[\s\S]{1}/.test(this.stepRegistrationEl.find('input[name="password"]').val());

            if (errorPhone || errorName || errorAgree || emptyPasswordError) {
                this.stepToRegistration();
                if (errorPhone) {
                    $(mg_echo_global).trigger('event.register.phone.error');
                }
                if (emptyPasswordError) {
                    mg_echo_global.getRegistrationAndLoginForm().fields.password.setError(translate('fill_out_required_fields'));
                }
            } else {
                this.recaptchaVerification();
                $(mg_echo_global).trigger('event.register.phone.success');
            }
        }
        else if (this.step == this.steps.end) {
            // validate confirmation code
            if (!mg_echo_global.getRegistrationAndLoginForm().fields.confirmationCode.validate()) {
                this.registrationConfirm();
            } else {
                this.stepToConfirmationCode();
            }
        }
    },

    checkUserExists: function() {
        var thiz = this;
        var username = $(this.stepStartEl).find('input[name="email"]').val();
        this.$el.mask(translate('loading_logging_in'));
        mg_echo_global.ajax({
            url: "/auth/userExists",
            data: {'username' : username},
            type: 'GET',
            dataType: 'json'
        }).done(function (data, textStatus, jqXHR) {
            thiz.$el.unmask();

            // Если присутвует ошибка на панеле регистрации, то запоминаем её
            if (
                !thiz.multiStepRegistrationInitializationError
                && thiz.$el.find('.mg-echo-right-overlay .error-message.heap').html() != ''
            ) {
                thiz.multiStepRegistrationInitializationError = thiz.$el.find('.mg-echo-right-overlay .error-message.heap').html();
            }
            thiz.exceptionHandler.onResponse(jqXHR);

            if(data.success) {
                thiz.stepLoginEl.show().addClass('mg-echo-step-active');
                thiz.stepLoginEl.find('input:first').focus();
                thiz.step = thiz.steps.login;
                $(mg_echo_global).trigger('pageview.email_old');
            } else {
                thiz.stepToRegistration();
                $(mg_echo_global).trigger('pageview.email_new');
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            thiz.$el.unmask();
            thiz.exceptionHandler.onResponse(jqXHR);
        });
    },

    login: function() {
        var thiz = this;
        var username = this.stepStartEl.find('input[name="email"]').val();
        var password = this.stepLoginEl.find('input[name="password"]').val();
        this.$el.mask(translate('loading_logging_in'));
        mg_echo_global.ajax({
            url: "/auth/login",
            data: {'username' : username, 'password' : password},
            type: 'POST',
            dataType: 'json'
        }).done(function (data, textStatus, jqXHR) {
            thiz.$el.unmask();
            thiz.exceptionHandler.onResponse(jqXHR);
            if (data.success) {
                mg_echo_global.getLocalStorage().setItem('iba_token', data.authToken);
                thiz.stepLoginEl.removeClass('mg-echo-step-active');
                $(mg_echo_global).trigger('pageview.book_info');
                thiz.loadCurrentContact();
            } else {
                thiz.stepToLogin();

                if (data.errors[0] && data.errors[0].type == 'BLACKLISTED_PHONE') {
                    $(mg_echo_global).trigger('event.login.email.blacklisted');
                }
                else if (data.errors[0] && data.errors[0].type == 'INACTIVE_ACCOUNT') {
                    $(mg_echo_global).trigger('event.login.email.inactive');
                } else {
                    $(mg_echo_global).trigger('event.login.password.invalid');
                }
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            thiz.$el.unmask();
            thiz.exceptionHandler.onResponse(jqXHR);
        });
    },

    stepToRegistration: function() {
        this.stepRegistrationEl.show().addClass('mg-echo-step-active');
        this.stepRegistrationEl.find('input:first').focus();
        this.step = this.steps.confirmationCode;
    },

    stepToConfirmationCode: function() {
        this.stepConfirmationCodeEl.show().addClass('mg-echo-step-active');
        this.stepConfirmationCodeEl.find('input:first').focus();
        this.step = this.steps.end;
    },

    stepToLogin: function() {
        this.stepLoginEl.show().addClass('mg-echo-step-active');
        this.stepLoginEl.find('input:first').focus();
        this.step = this.steps.login;
    },

    loadCurrentContact: function(callback, scope) {
        var thiz = this;
        mg_echo_global.formStep2.mask(translate('loading'));
        mg_echo_global.ajax({
            url: "/contact/current/get",
            type: 'POST',
            dataType: 'json'
        }, true).done(function (data, textStatus, jqXHR) {
            thiz.exceptionHandler.onResponse(jqXHR);
            if(data.success && data.rows && data.rows.length === 1) {
                mg_echo_global.setSecuredOnFormStep2();
                mg_echo_global.getContactModel().clear();
                $(thiz.el).removeClass('state-anonym').addClass('state-authorized');
                thiz.stepForm.find('fieldset').prop('disabled', true);
                var contact = data.rows[0],
                    existedContactModel = mg_echo_global.formStep2.getEditor('contactRecord').getValue(),
                    existingContactId = existedContactModel ? existedContactModel.get('id') : '',
                    contactExistsInModel = existingContactId || existingContactId === 0,
                    firstLogIn = !contactExistsInModel,
                    loggedInWithAnotherContact = (contactExistsInModel && existingContactId != contact.id),
                    setContactData = function() {
                        // Filter Credit Card on Expiry Date
                        contact.creditCards = contact.creditCards.filter(function(creditCard){
                            var creditCardObject = new Magenta.Echo.InlineBooking.Models.CreditCard(creditCard);
                            return creditCardObject.isValidExpiry();
                        });
                        mg_echo_global.getContactModel().set(contact);
                        mg_echo_global.getBookingModel().set({'contactRecord' : contact});
                        mg_echo_global.formStep2.getEditor('contactRecord').setValue(new Magenta.Echo.InlineBooking.Models.AbstractModel(contact));
                        if(contact.creditCards && contact.creditCards.length > 0) {
                            mg_echo_global.formStep2.getEditor('mop').schema.creditCards = contact.creditCards;
                            mg_echo_global.formStep2.getEditor('creditCard').setValue(new Magenta.Echo.InlineBooking.Models.AbstractModel(contact.creditCards[0]));
                            mg_echo_global.getBookingConfig('defaultValues').defaultForBookingCard = null;
                            if (mg_echo_global.isMopAvailable('CREDIT_TYPE')) {
                                $.each(contact.creditCards, function (key, creditCard) {
                                    thiz.addCreditCardInMop(creditCard);
                                });
                            }
                        }
                        var mopEditor = mg_echo_global.formStep2.getEditor('mop');
                        mg_echo_global.getMOPListModel().availableUpdate();
                        mopEditor.renderSuggestions();

                        //Magenta.Echo.InlineBooking.Models.ServiceList.prototype.url = "/inline-booking/api/secured/services/availableToBookOnline";

                        thiz.findPassengerByContact();
                        thiz.loadDefaultValues();
                        thiz.updateUserPanel();
                    },
                    invokeCallback = function() {
                        if(callback) {
                            callback.apply(scope || thiz);
                        }
                    };
                if(existingContactId == contact.id) { //session expired and customer logs in with the same user
                    mg_echo_global.getMOPListModel().clear();
                    mg_echo_global.clearBookingModel();
                    mg_echo_global.formStep2.updateView();
                    mg_echo_global.formStep2.setDefaultValues();
                    setContactData();
                    invokeCallback();
                } else if (loggedInWithAnotherContact) {
                    mg_echo_global.clearBookingModel();
                    mg_echo_global.formStep2.updateView();
                    mg_echo_global.formStep2.setDefaultValues();
                    setContactData();
                    invokeCallback();
                } else if (firstLogIn) { //if no contact set in the booking form (first time log in)
                    //mg_echo_global.formStep2.updateView();
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

    registrationRequest: function(token) {
        var thiz = this;
        grecaptcha.reset();

        var requestData = {
            'username' : this.stepStartEl.find('input[name="email"]').val(),
            'phone' : this.stepRegistrationEl.find('.selected-dial-code').text() + this.stepRegistrationEl.find('input[name="phone"]').val(),
            'name' : this.stepRegistrationEl.find('input[name="name"]').val(),
            'password' : this.stepRegistrationEl.find('input[name="password"]').val(),
            'g-recaptcha-response': token
        };
        this.$el.mask(translate('loading_registration'));
        mg_echo_global.ajax({
            url: "/auth/registration_request",
            data: requestData,
            type: 'POST',
            dataType: 'json'
        }).done(function (data, textStatus, jqXHR) {
            thiz.$el.unmask();
            thiz.exceptionHandler.onResponse(jqXHR);
            if(data.success) {
                thiz.stepRegistrationEl.removeClass('mg-echo-step-active');
                thiz.stepConfirmationCodeEl.show().addClass('mg-echo-step-active');
                thiz.step = thiz.steps.end;
                thiz.stepConfirmationCodeEl.find('.phone-label').html(requestData.phone);
                $(mg_echo_global).trigger('pageview.phone_name');
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            thiz.$el.unmask();
            thiz.exceptionHandler.onResponse(jqXHR);
        });
    },

    recaptchaVerification: function () {
        var thiz = this;
        const recaptcha = document.getElementById("reCaptchaBlock");
        if (!recaptcha.innerHTML) {
            grecaptcha.render('reCaptchaBlock', {
                sitekey: mg_echo_conf.captchaPublicKey,
                size: "invisible",
                callback: function (token) {
                    thiz.registrationRequest(token)
                }
            });
        }
        grecaptcha.execute();
    },

    registrationConfirm: function() {
        var thiz = this;

        var confirmationCode = $(this.stepConfirmationCodeEl).find('input[name="confirmationCode"]').val();
        this.$el.mask(translate('loading_registration'));
        mg_echo_global.ajax({
            url: "/auth/registration/" + confirmationCode,
            type: 'GET',
            dataType: 'json'
        }).done(function (data, textStatus, jqXHR) {
            thiz.$el.unmask();
            thiz.exceptionHandler.onResponse(jqXHR);
            if (data.success) {
                mg_echo_global.getLocalStorage().setItem('iba_token', data.authToken);
                $(mg_echo_global).trigger('pageview.book_info');
                thiz.loadCurrentContact();
                $(thiz.el).removeClass('state-anonym').addClass('state-authorized');
                thiz.stepForm.find('fieldset').prop('disabled', true);
            } else {
                mg_echo_global.getRegistrationAndLoginForm().fields.confirmationCode.setError(translate('incorrect_password'));
                thiz.stepToConfirmationCode();
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            thiz.$el.unmask();
            thiz.exceptionHandler.onResponse(jqXHR);
        });
    },

    showResetPasswordForm: function () {
        this.getStepForm().hide();
        this.getResetPasswordForm().show();
    },

    hideResetPasswordForm: function () {
        this.getStepForm().show();
        this.getResetPasswordForm().hide();
    },

    initPriceMsg: function() {
        var thiz = this;
        this.exceptionHandler.on(mg_echo_global.getResponseHandlerKey("price") + ":beforeResponseProcessed", function(msg){
            if (thiz.isAsap() || thiz.capacityError != true) {
                thiz.hideAndEmptyErrorsAndWarnings(thiz.priceCls);
            }
        });
        this.exceptionHandler.on(mg_echo_global.getResponseHandlerKey("price") + ":error", function(msg){
            thiz.showError(msg, thiz.priceCls);
        });
        this.exceptionHandler.on(mg_echo_global.getResponseHandlerKey("price") + ":warning", function(msg){
            if (thiz.isAsap()) {
                $(mg_echo_global).trigger('event.stops.book_info.fully_booked_for_now');
            }
            thiz.showWarning(msg, thiz.priceCls);
        });

        this.exceptionHandler.on('INCORRECT_PHONE_REG', function () {
            if (thiz.isSecuredMode) {
                $(mg_echo_global.formStep2.getForm().el).find('.passengers-info .phone-wrapper').addClass('mg-echo-error');
            } else {
                $(mg_echo_global.formStep2.getForm().el).find('.mg-echo-right-overlay .phone-wrapper').addClass('mg-echo-error');
            }
        });

        this.exceptionHandler.on('ILLEGAL_ARGUMENT_EXCEPTION', function () {
            mg_echo_global.getRegistrationAndLoginForm().fields.password.setError();
        });
    },

    initCapacityMsg: function() {
        var thiz = this;
        this.exceptionHandler.on(mg_echo_global.getResponseHandlerKey("capacity") + ":beforeResponseProcessed", function(msg){
            thiz.capacityError = false;
            thiz.hideAndEmptyErrorsAndWarnings(thiz.capacityCls);
        });
        this.exceptionHandler.on(mg_echo_global.getResponseHandlerKey("capacity") + ":error", function(msg){
            thiz.capacityError = true;
            $(mg_echo_global).trigger('event.stops.book_info.prebook_service_is_not_available');
            thiz.showError(msg, thiz.capacityCls);
        });
        this.exceptionHandler.on(mg_echo_global.getResponseHandlerKey("capacity") + ":warning", function(msg){
            thiz.showWarning(msg, thiz.capacityCls);
        });
    },

    onUpdateView: function() {
        Magenta.Echo.InlineBooking.Views.BookingForm.prototype.onUpdateView.apply(this, arguments);
    },

    clientValidateForm: function() {
        this.hideAndEmptyMessages(this.heapCls);
        this.commit();
    },

    clarifyAddress: function (record, stopName) {
        var thiz = this;
        thiz.$el.mask(translate('loading'));
        mg_echo_global.ajax({
                url: "/addresses/clarifyAddress",
                data: {'addressDetails' : record.address},
                type: 'POST',
                dataType: 'json'
            }
        ).done(function (data, textStatus, jqXHR) {
            if (data.success) {
                thiz.$el.find('#mg-echo-' + stopName + '-step-2')[0].value = data.rows[0].address;
                mg_echo_global.getBookingModel().get(stopName).attributes = data.rows[0];
                mg_echo_global.formStep2.getEditor(stopName).value.attributes = data.rows[0];
                thiz.$el.unmask();
                thiz.onChangedForPriceAndCapacity();
            } else {
                thiz.exceptionHandler.onResponse(jqXHR);
                thiz.$el.unmask();
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            thiz.$el.unmask();
        });
    },

    onChangedForPriceAndCapacity: function (editor) {
        // Обновляем стоимость каждые 5 минут
        if (this.changedForPriceAndCapacityInterval != null) {
            clearInterval(this.changedForPriceAndCapacityInterval);
        }
        this.changedForPriceAndCapacityInterval = setInterval( this.onChangedForPriceAndCapacity, 1000 * 60 * 5 );

        editor = editor ? editor : this.getEditor('dropoff'); /* get the last one from fields participating in capacity check request to show loading image in while performing capacity check*/
        var loadingEl = editor.$el.find('.mg-echo-loading');
        this.getCapacity(loadingEl);
        this.getPriceAndResponseTime();
    },

    isValidForPrice: function() {
        var dateError = this.getEditor('date').validate(),
            serviceError = this.getEditor('serviceRecord').validate(),
            pickupError = this.getEditor('pickup').validate(),
            dropofError = this.getEditor('dropoff').validate();

        // Если Flight Checker ключен и в нём есть ошибка
        if (
            mg_echo_global.getFlightChecker().checkEl.prop('checked')
            && mg_echo_global.getFlightChecker().errorType != null
        ) {
            return false;
        }

        return (!dateError && !serviceError && !pickupError && !dropofError);
    },

    getPriceAndResponseTime: function() {
        var thiz = this;
        if (thiz.isLocked === true) {
            return;
        }

        if ( mg_echo_global.getFlightChecker().errorType == 'BOOKING_UNAVAILABLE_ZONE_PLURAL' ) {
            mg_echo_global.getFlightChecker().validateAirportFlightDetails();
        }

        if(!thiz.isValidForPrice()) {
            return;
        }

        thiz.getInfoPanel().mask(translate('loading'));

        var minAvailableDate = '';
        if (mg_echo_global.manualChangeDate == false) {
            minAvailableDate = '?minAvailableDate=true';
        }

        this.multiStepRegistrationInitializationError = null;

        mg_echo_global.ajax({
                url: "/booking/getPrice" + minAvailableDate,
                data: thiz.getJson(), //do not update model as we are not to necessary fill all the mandatory form fields
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            }, this.isSecuredMode
        ).done(function (data, textStatus, jqXHR) {
                thiz.getInfoPanel().unmask();
                thiz.clearPrice();
                thiz.clearEstimatedJourneyTime();

                if(thiz.hasWarning(translate('web.unavailable_zone_plural'), thiz.priceCls)
                   && mg_echo_conf.widgetType === mg_echo_global.widgetTypes.airport
                ) {
                    return;
                }

                if(data.success && data.rows && data.rows.length >= 1) {
                    if (
                        !thiz.isAsap()
                        && mg_echo_global.manualChangeDate == false
                        && data.rows[0].date != null
                    ) {
                        mg_echo_global.setMinDate(data.rows[0].date);
                        thiz.fields.date.setValue(data.rows[0].date)
                    }

                    var total = data.rows[0].pricingResult.priceVisibilityMode === 1  ? data.rows[0].pricingResult.netPrice : data.rows[0].pricingResult.totalPrice,
                        responseTime = data.rows[0].pricingResult.responseTime,
                        journeyTimeFormatted = data.rows[0].journeyTimeFormatted,
                        meteredPriceEstimate = data.rows[0].pricingResult.meteredPriceEstimate,
                        vatPrice = data.rows[0].pricingResult.vatPrice;
                    mg_echo_global.meteredPriceEstimate = mg_echo_global.toFixed(meteredPriceEstimate, 2);
                    mg_echo_global.vatPrice = mg_echo_global.toFixed(vatPrice, 2);
                    thiz.onPriceChanged(total);
                    thiz.onResponseTimeChanged(responseTime);

                    if (!!mg_echo_global.getBookingConfig('displayJourneyTime')) {
                        thiz.onEstimatedJourneyTimeChanged(journeyTimeFormatted);
                    }
                } else {
                    // Недоступная зона
                    if (data.errors[0] && data.errors[0].type === 'BOOKING_UNAVAILABLE_ZONE_PLURAL') {
                        $(mg_echo_global).trigger('event.stops.book_info.booking_unavailable_zone');
                    }
                    thiz.clearPriceAndResponseTimeAndHide();
                }

                if (
                    mg_echo_conf.widgetType === mg_echo_global.widgetTypes.airport
                    && data.errors[0]
                    && (data.errors[0].type === 'BOOKING_UNAVAILABLE_ZONE' || data.errors[0].type === 'BOOKING_UNAVAILABLE_ZONE_PLURAL')
                ) {
                    thiz.showWarning(translate('web.unavailable_zone_plural'), thiz.priceCls);
                } else {
                    thiz.exceptionHandler.onResponse(jqXHR, mg_echo_global.getResponseHandlerKey("price"));
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                thiz.exceptionHandler.onResponse(jqXHR, mg_echo_global.getResponseHandlerKey("price"));
            });
    },

    isValidForCapacity: function() {
        var dateError = this.getEditor('date').validate(),
            serviceError = this.getEditor('serviceRecord').validate(),
            pickupError = this.getEditor('pickup').validate(),
            dropofError = this.getEditor('dropoff').validate();
        return (!dateError && !serviceError && !pickupError && !dropofError);
    },

    getCapacity: function(loadingEl, callback) {
        if(!this.isSecuredMode || !this.isValidForCapacity()) {
            return;
        }
        if(this.isAsap()) {
            if(callback) {
                callback.apply(this);
            }
            return;
        }

        var minAvailableDate = '';
        if (mg_echo_global.manualChangeDate == false) {
            minAvailableDate = '?minAvailableDate=true';
        }

        var thiz = this;
        thiz.capacityError = false;
        loadingEl.show();
        mg_echo_global.ajax({
                url: "/booking/validateCapacityManagement" + minAvailableDate,
                data: thiz.getJson(), //do not update model as we are not to necessary fill all the mandatory form fields
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            }, true
        ).done(function (data, textStatus, jqXHR) {
                loadingEl.hide();

                if (
                    mg_echo_conf.widgetType === mg_echo_global.widgetTypes.airport
                    && data.errors[0]
                    && (data.errors[0].type === 'BOOKING_UNAVAILABLE_ZONE' || data.errors[0].type === 'BOOKING_UNAVAILABLE_ZONE_PLURAL')
                ) {
                    thiz.showWarning(translate('web.unavailable_zone_plural'), thiz.capacityCls);
                } else {
                    thiz.exceptionHandler.onResponse(jqXHR, mg_echo_global.getResponseHandlerKey("capacity"));
                }

                if(data.success && data.rows && data.rows.length === 1) {
                    thiz.onCapacityResponse(data.rows[0], callback);
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                loadingEl.hide();
                thiz.exceptionHandler.onResponse(jqXHR, mg_echo_global.getResponseHandlerKey("capacity"));
                if (jqXHR.status == 403) {
                    thiz.isServerError403Response();
                }
            });
    },

    onCapacityResponse: function(response, callback) {
        var defaultBlockBookingMsg = translate('defaultBlockBookingMsg');

        if(response.blockBooking) {
            var warning =  response.warning ? response.warning : defaultBlockBookingMsg;
            this.exceptionHandler.trigger(
                mg_echo_global.getResponseHandlerKey("capacity") + ":error",
                warning
            );
            this.enableBookBtn(false);
        } else {
            if(response.warning) {
                this.capacityError = true;
                this.showWarning(response.warning, this.capacityCls);
            }
            this.enableBookBtn(true);

            if(callback) {
                callback.apply(this);
            }
        }
    },

    onBook: function() {
        // pre validate
        // if "name" field is not empty, then "phone" field should not be empty
        // ====================================================================
        if (
            this.fields.contactRecord.editor.nestedForm.getValue().fullName != ''
            && mg_echo_global.getBookingConfig('isPassengerPhoneMandatory')
        ) {
            this.fields.contactRecord.editor.nestedForm.fields.phone.schema.validators.push('required');
            this.fields.contactRecord.editor.nestedForm.fields.phone.initialize(this.fields.contactRecord.editor.nestedForm.fields.phone);
        } else {
            this.fields.contactRecord.editor.nestedForm.fields.phone.schema.validators = $.grep(this.fields.contactRecord.editor.nestedForm.fields.phone.schema.validators, function(value) {
                return value != 'required';
            });
            this.fields.contactRecord.editor.nestedForm.fields.phone.initialize(this.fields.contactRecord.editor.nestedForm.fields.phone);
        }

        // Если ошибки в валидации в форме или во флайчекере, то не отправляем запрос
        var validateFlighChecker = mg_echo_global.getFlightChecker().validate();
        var validateExtras = mg_echo_global.formStep2.getEditor('extras').validate();

        if (this.commit() || !validateFlighChecker || validateExtras === false) {

            if (
                !this.fields.pickup.getValue().get('address')
                || !this.fields.dropoff.getValue().get('address')
            ) {
                $(mg_echo_global).trigger('event.stops.book_info.no_results');
            }

            return false;
        }

        var thiz = this,
            bookBtn = this.getBookBtn(),
            loadingEl = (function() {
                return {
                    show: function() {
                        var loadingEl = bookBtn.find('.mg-echo-loading');
                        loadingEl.addClass('visible');
                        loadingEl.show();
                        bookBtn.find('.mg-echo-btn-text').hide();
                    },
                    hide: function() {
                        var loadingEl = bookBtn.find('.mg-echo-loading');
                        loadingEl.removeClass('visible');
                        loadingEl.hide();
                        bookBtn.find('.mg-echo-btn-text').show();
                    }
                }
            })();

        thiz.getCapacity(loadingEl, function() {
            this.processCreditCard();
        }, thiz)
    },

    processCreditCard: function() {
        var scope = this;
        var mop = mg_echo_global.getBookingModel().get('mop');
        var mopIsCreditCard = mop === mg_echo_global.clientMop['CREDIT_TYPE'].type;
        var mopIsCash = mop === mg_echo_global.clientMop['CASH_TYPE'].type;
        var cardRequired = mg_echo_global.getBookingConfig('isCreditCardRequired');
        var creditCard = mg_echo_global.getBookingModel().get('creditCard');
        var creditCardNotSpecified = !creditCard || !creditCard.get('number');

        mg_echo_global.getBookingModel().set({'id' : null});

        this.quote = null;

        this.isRegisterCard = (mopIsCash && cardRequired) || (mopIsCreditCard && creditCardNotSpecified);

        if (this.isRegisterCard) {
            this.createQuote(true, function (quote) {
                scope.quote = quote;
                scope.proceedPaymentLock();
            }, function () {
                scope.isRegisterCard = false;
                scope.quote = null;
            });
            return;
        }

        var needPay = mg_echo_global.getBookingConfig('isIndividualApplyCreditCardPreAuth')
            || mg_echo_global.getBookingConfig('isIndividualApplyCreditCardPrePayment');
        this.isPayment = mopIsCreditCard && needPay && !creditCardNotSpecified;

        if (this.isPayment) {
            this.createQuote(false, function (quote) {
                scope.quote = quote;
                scope.proceedPaymentLock();
            }, function () {
                scope.isPayment = false;
                scope.quote = null;
            });

            return;
        }

        this.saveBooking();
    },

    proceedPayment: function () {
        var mop = mg_echo_global.getBookingModel().get('mop');
        var mopIsCreditCard = mop === mg_echo_global.clientMop['CREDIT_TYPE'].type;
        var needPay = mg_echo_global.getBookingConfig('isIndividualApplyCreditCardPreAuth') || mg_echo_global.getBookingConfig('isIndividualApplyCreditCardPrePayment');
        var scope = this;
        this.webPaymentPopup.declined = false;
        if (this.isRegisterCard) {
            var amount = needPay && mopIsCreditCard ? mg_echo_global.totalPrice : 1.01;
            this.registerCard(amount, function () {
                if (mopIsCreditCard) {
                    scope.updatePaymentDetails(scope.quote);
                } else {
                    scope.showBookingConfirmation(scope.quote);
                    scope.loadCurrentContact();
                }
            });
            return;
        }

        if (this.isPayment) {
            this.webPayment(function () {
                scope.updatePaymentDetails(scope.quote);
            });
        }
    },

    saveBooking: function() {
        var errors = this.commit(),
            thiz = this;
        if (!errors || errors.length == 0) {

            // empty fields to replace the data active contact
            var contactRecord = this.model.get('contactRecord');
            if (
                contactRecord.get('fullName') == ""
                && contactRecord.get('phone') == ""
                && contactRecord.get('email') == ""
            ) {
                contactRecord.set('fullName', mg_echo_global.getContactModel().get('fullName'));
                contactRecord.set('phone', mg_echo_global.getContactModel().get('phone'));
                contactRecord.set('email', mg_echo_global.getContactModel().get('email'));
            }

            this.$el.mask(translate('loading'));
            mg_echo_global.ajax({
                    url: "/booking/create",
                    async:false,
                    data: thiz.model.getJson(),
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json'
                }, this.isSecuredMode
            ).done(function (data, textStatus, jqXHR) {
                    // Если добавляли новую кредитную карту
                    if (
                        mg_echo_global.getBookingModel().get('mop') == 1
                        && !mg_echo_global.getBookingModel().get('creditCard').get('id')
                    ) {
                        // Если была ошибка при добавлении кредитки
                        if (
                            data.errors[0] && (
                                data.errors[0].type == 'FUNDS_NOT_SUFFICIENT'
                                || data.errors[0].type == 'CREDIT_CARD_NOT_REGISTERED'
                                || data.errors[0].type == 'CREDIT_CARD_PROVIDER_UNAVAILABLE'
                                || data.errors[0].type == 'BOOKING_INVALID_ACCOUNT_CARD'
                            )
                        ) {
                            $(mg_echo_global).trigger('event.credit_card.credit_card_details.fail');
                        } else {
                            $(mg_echo_global).trigger('event.credit_card.credit_card_details.success');
                        }

                    }

                    thiz.$el.unmask();
                    thiz.exceptionHandler.onResponse(jqXHR);
                    if(data.success && data.rows && data.rows.length === 1) {
                        mg_echo_global.getConfirmationWindow().setValues(thiz.model.getValue(), data.rows[0]);
                        mg_echo_global.showBookingConfirmationWindow(data.rows[0]);
                        thiz.loadCurrentContact();
                    }
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    thiz.$el.unmask();
                    thiz.exceptionHandler.onResponse(jqXHR);

                    if (jqXHR.status == 403) {
                        thiz.isServerError403Response();
                    }
                });
        }
    },

    showBookingConfirmation: function(quote) {
        mg_echo_global.getConfirmationWindow().setValues(this.model.getValue(), quote);
        mg_echo_global.showBookingConfirmationWindow(quote);
        this.unlock();
    },

    updatePaymentDetails: function(quote) {
        const scope = this;

        mg_echo_global.ajax({
                url: "/booking/jobPaymentDetails?bookingId=" + quote['id'],
                async: false,
                type: 'POST'
            }, this.isSecuredMode
        ).done(function (data, textStatus, jqXHR) {
            scope.exceptionHandler.onResponse(jqXHR);
            if (data.success && data.rows && data.rows.length === 1) {
                quote['creditCard'] = data.rows[0];
                quote['_processed'] = true;
            }
            scope.showBookingConfirmation(quote);
            scope.loadCurrentContact();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            scope.exceptionHandler.onResponse(jqXHR);
            scope.unlock();
            if (jqXHR.status == 403) {
                thiz.isServerError403Response();
            }
        });
    },

    createQuote: function(newCard, success, failure) {
        var errors = this.commit(),
            thiz = this;
        if (!errors || errors.length == 0) {
            // empty fields to replace the data active contact
            var contactRecord = this.model.get('contactRecord');
            if (
                contactRecord.get('fullName') == ""
                && contactRecord.get('phone') == ""
                && contactRecord.get('email') == ""
            ) {
                contactRecord.set('fullName', mg_echo_global.getContactModel().get('fullName'));
                contactRecord.set('phone', mg_echo_global.getContactModel().get('phone'));
                contactRecord.set('email', mg_echo_global.getContactModel().get('email'));
            }

            this.$el.mask(translate('loading'));
            mg_echo_global.ajax({
                    url: "/booking/createQuote",
                    async: false,
                    data: thiz.model.getJson(),
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json'
                }, this.isSecuredMode
            ).done(function (data, textStatus, jqXHR) {
                thiz.$el.unmask();
                thiz.exceptionHandler.onResponse(jqXHR);
                if(data.success && data.rows && data.rows.length === 1) {
                    mg_echo_global.getBookingModel().set({'id' : data.rows[0].id});
                    success(data.rows[0]);
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                failure();
                thiz.$el.unmask();
                thiz.unlock();
                thiz.exceptionHandler.onResponse(jqXHR);

                if (jqXHR.status == 403) {
                    thiz.isServerError403Response();
                }
            });
        }
    },

    isServerError403Response: function () {
        var thiz = this;
        thiz.step = thiz.steps.start;
        thiz.updateMultiStepRegistration({focus : true, forcibly: true});
        thiz.setSecuredMode(false);
        thiz.logout(function() {
            thiz.showError('Your session has been expired, please relogin', thiz.sessionCls);
        }, thiz);
        $(mg_echo_global).trigger('event.login.logout');
    },

    addCreditCardInMop: function(creditCard) {
        var creditCardObject = new Magenta.Echo.InlineBooking.Models.CreditCard(creditCard);
        var mopObject = new Magenta.Echo.InlineBooking.Models.MOP(creditCard);
        if (creditCardObject.isValidExpiry()) {
            mg_echo_global.getMOPListModel().MOPlist.push(mopObject);
            var mopEditor = mg_echo_global.formStep2.getEditor('mop');
            if (creditCard.defaultForBooking) {
                mg_echo_global.getBookingConfig('defaultValues').defaultForBookingCard = creditCard;
                mg_echo_global.defaultMop = creditCard;
                mopEditor.setValue(mopObject);
                mg_echo_global.getBookingModel().set('creditCard', mg_echo_global.getBookingConfig('defaultValues').defaultForBookingCard);
            }
            mopEditor.renderSuggestions();
        }
    },

    setSecuredMode: function(isSecuredMode) {
        this.isSecuredMode = isSecuredMode;
    },

    getSecuredMode: function() {
        return this.isSecuredMode;
    },

    onExistedCardBtnPressed: function() {
        var creditCardModel = new Magenta.Echo.InlineBooking.Models.CreditCard(
            mg_echo_global.getContactModel().get('creditCard')
        );
        this.getEditor('creditCard').setValue(creditCardModel);
    },

    onClose: function () {
        this.close();
        $(mg_echo_global).trigger('event.create_booking.cancel');
    },

    onBeforeResponseProcessed: function() {
        if (this.multiStepRegistrationInitializationError) {
            this.showError(this.multiStepRegistrationInitializationError, this.heapCls);
            return;
        }
        this.hideAndEmptyMessages(this.heapCls);
    },

    onError: function(msg) {
        this.showError(msg, this.heapCls);
    },

    onWarning: function(msg) {
        this.showWarning(msg, this.heapCls);
    },

    close: function() {
        this.step = this.steps.start;
        this.updateMultiStepRegistration();

        var bookingModel = mg_echo_global.getBookingModel()
        bookingModel.clear();
        bookingModel.set({'contactRecord' : mg_echo_global.getContactModel().attributes});
        bookingModel.set({'mop' : mg_echo_global.defaultMop});
        bookingModel.set('creditCard', mg_echo_global.getBookingConfig('defaultValues').defaultForBookingCard);

        if (bookingModel.get('contactRecord').id == null) {
            mg_echo_global.getBookingConfig('defaultValues').service = mg_echo_global.getBookingConfig('defaultValues').CA_service;
        }

        if (mg_echo_conf.widgetType === mg_echo_global.widgetTypes.airport) {
            mg_echo_global.formStep1.getForm().flightNumberInput.val('').trigger('input');
        }

        mg_echo_global.formStep2.getEditor('extras').clear();
        //todo release reserve
        bookingModel.set('idGeneratedByClient', null);

        this.updateView();

        mg_echo_global.updateViewBookingFormStep1();
        mg_echo_global.hideBookingStep2Wrapper();

        $('body').removeClass('mg-echo-booking-form-show');
    },

    onLogout: function() {
        this.setSecuredMode(false);
        this.logout(function() {}, this);
        $(mg_echo_global).trigger('event.login.logout');
    },

    // For mobile
    onNext:  function () {
//        $(this.el).removeClass('first-time-booking');
    },

    onResendCode: function() {
        // validate phone and name
        var errorPhone = mg_echo_global.getRegistrationAndLoginForm().fields.phone.validate();
        var errorName = mg_echo_global.getRegistrationAndLoginForm().fields.name.validate();

        if (!errorPhone && !errorName) {
            this.recaptchaVerification();
        }
        $(mg_echo_global).trigger('event.register.resend_pass');
    },

    onResetPassword: function() {
        var thiz = this;
        this.$el.mask(translate('loading'));
        this.hideAndEmptyMessages();
        var username = this.stepStartEl.find('input[name="email"]').val();
        mg_echo_global.ajax({
            url: "/auth/recovery_request",
            data: {
                'username': username
            },
            type: 'POST',
            dataType: 'json'
        }).done(function (data, textStatus, jqXHR) {
            thiz.$el.unmask();
            thiz.exceptionHandler.onResponse(jqXHR);
            if(data.success) {
                thiz.showResetMessage(username);
            }
            // Save State Form in LocalStorage
            mg_echo_global.getLocalStorage().setItem('formState', mg_echo_global.formStep2.getForm().getValueJson());

        }).fail(function (jqXHR, textStatus, errorThrown) {
            thiz.$el.unmask();
            thiz.exceptionHandler.onResponse(jqXHR);
        });
        $(mg_echo_global).trigger('event.login.pass_reset');
    },

    showResetMessage: function(username) {
        var successMessage = StringUtils.format(
                translate('email_was_sent'),
                username,
                mg_echo_global.getBookingConfig('passwordRecoveryDelayMin')
        );
        this.getResetMsgWrapper().html(successMessage);
        this.getResetPasswordBtn().html(translate('reset_password_again'));
    },

    hideResetMessage: function() {
        this.getResetMsgWrapper().html('');
        this.getResetPasswordBtn().html(translate('reset_password'));
    },

    onResponseTimeChanged: function (value) {
        var responseTimeText = mg_echo_global.toFixed(value, 0) + ' ' + translate('min');
        this.clearResponseTime()
            .append(mg_echo_global.toFixed(value, 0) + ' ' + translate('min'));
        if(this.isAsap()) {
            mg_echo_global.responseTime = responseTimeText;
            this.showResponseTimeSection();
        } else {
            mg_echo_global.responseTime = null;
            this.hideResponseTimeSection();
        }
    },

    onEstimatedJourneyTimeChanged: function(value) {
        this.clearEstimatedJourneyTime()
            .append(value);
        mg_echo_global.estimatedJourneyTime = value;

        this.getEstimatedJourneyTimeWrapper().show();
    },

    showResponseTimeSection: function () {
        this.getResponseTimeWrapper().show();
    },

    hideResponseTimeSection: function () {
        this.clearResponseTime();
        this.getResponseTimeWrapper().hide();
    },

    onPriceChanged: function (value) {
        this.clearPrice();
        var totalPrice = mg_echo_global.toFixed(value, 2);

        mg_echo_global.totalPrice = totalPrice;

        this.getPriceWrapper().find('.mg-echo-price')
            .append(mg_echo_global.formatCurrency(totalPrice));

        if (mg_echo_global.meteredPriceEstimate && totalPrice != mg_echo_global.meteredPriceEstimate) {
            this.getPriceWrapper().find('.mg-echo-price')
                .append('-' + mg_echo_global.meteredPriceEstimate);
        }

        this.getPriceWrapper().show();

        $('.mg-echo-bottom-panel-fixed .mg-echo-btn-text').append(' <span class="mg-echo-price">for <strong>' + mg_echo_global.formatCurrency(totalPrice) + '</strong></span>');
    },

    clearPriceAndResponseTimeAndHide: function () {
        this.clearPrice();
        this.getPriceWrapper().hide();

        this.clearResponseTime();
        this.getResponseTimeWrapper().hide();

        this.clearEstimatedJourneyTime();
        this.getEstimatedJourneyTimeWrapper().hide();

    },

    clearPrice: function() {
        mg_echo_global.totalPrice = null;
        $('.mg-echo-bottom-panel-fixed .mg-echo-btn-text .mg-echo-price').remove();
        return this.getPriceWrapper().find('.mg-echo-price')
            .empty();
    },

    clearResponseTime: function() {
        mg_echo_global.responseTime = null;
        return this.getResponseTimeWrapper().find('.value')
            .empty();
    },

    clearEstimatedJourneyTime: function() {
        mg_echo_global.estimatedJourneyTime = null;
        return this.getEstimatedJourneyTimeWrapper().find('.value')
            .empty();
    },

    getInfoPanel: function() {
        return this.$el.find('.mg-echo-info-panel');
    },

    getResponseTimeWrapper: function () {
        return this.getInfoPanel().find('.response-time');
    },

    getPriceWrapper: function () {
        return this.getInfoPanel().find('.price-wrapper');
    },

    getEstimatedJourneyTimeWrapper: function () {
        return this.getInfoPanel().find('.estimated-journey-time');
    },

    beforeShow: function() {
//        $(this.el).addClass('first-time-booking');
        this.clearPriceAndResponseTimeAndHide();
        this.enableBookBtn(true);

        this.getEditor('passengers').setValue(
            mg_echo_global.getPassengersListModel().defaultValue
        );
        this.showNotes();

        if (mg_echo_conf.widgetType === mg_echo_global.widgetTypes.airport) {
            mg_echo_global.getFlightWindow().showFlightWindow();
            mg_echo_global.getFlightWindow().requestFlightWindow(
                mg_echo_global.formStep1.getForm().getValue('date')
            );
            this.getEditor('extras').setDefaultValues();
        } else {
            $('.passangers-wrapper').hide();
        }
    },

    afterShow: function() {
        if (!mg_echo_global.isMobile) {
            this.stepStartEl.find('input:first').focus();
        }

        this.hideResetPasswordForm();
    },

    onClickAsap: function () {
        Magenta.Echo.InlineBooking.Views.BookingForm.prototype.onClickAsap.apply(this, arguments);
        //as we don`t check capacity for asap bookings
        this.enableBookBtn(true);
    },

    enableBookBtn: function(enabled) {
        this.getBookBtn().off('click'); //in case the button is listening to the event уже
        if(enabled) {
            this.getBookBtn().prop("disabled", false);
            this.getBookBtn().removeClass("disabled");
            this.getBookBtn().on('click', this.onBook);
        } else {
            this.getBookBtn().prop("disabled", true);
            this.getBookBtn().addClass("disabled");
            this.getBookBtn().off('click');
        }
    },

    showNotes: function() {
        var pickup = this.getValue().pickup;
        var notes = pickup && pickup.get('customerNotes');
        var noteContainer = this.$el.find('.pickup-notes');

        if(!notes) {
            noteContainer.hide();
            noteContainer.text();
        } else {
            noteContainer.text(notes);
            noteContainer.show();
        }
    },

    showSuccess: function(msg, cls) {
        var successEl = this.getSuccessEl(cls);
        successEl.empty();
        successEl.text(msg);
        successEl.show();
    },

    showWarning: function(msg, cls) {
        var warningEl = this.getWarningEl(cls);
        warningEl.empty();
        warningEl.text(msg);
        warningEl.show();
    },

    hasWarning: function(msg, cls) {
        var warningEl = this.getWarningEl(cls);
        return new RegExp(msg).test(warningEl.text());
    },

    showError: function(msg, cls) {
        var errorEl = this.getErrorEl(cls);
        errorEl.empty();
        errorEl.html(msg);
        errorEl.show();
    },

    hideAndEmptyErrorsAndWarnings: function(cls) {
        this.hideAndEmpty(this.getErrorEl(cls));
        this.hideAndEmpty(this.getWarningEl(cls));
    },

    clearValidationAndMessages: function() {
        var thiz = this;
        this.clearValidation();
        _.each(this.$el.find(this.errorCls), function(value, key, list) {
            thiz.hideAndEmpty($(value));
        });
        _.each(this.$el.find(this.warningCls), function(value, key, list) {
            thiz.hideAndEmpty($(value));
        });
        _.each(this.$el.find(this.successCls), function(value, key, list) {
            thiz.hideAndEmpty($(value));
        });
    },

    getBookBtn: function() {
        return this.$el.find('.mg-echo-book');
    },

    getNextBtn: function() {
        return this.$el.find('.mg-echo-btn-next');
    },

    getCloseBtn: function() {
        return this.$el.find('.mg-close');
    },

    getLogoutBtn: function() {
        return this.$el.find('.logout');
    },

    getResendCodeBtn: function() {
        return this.$el.find('#code-resend');
    },

    getResetPasswordBtn: function() {
        return this.$el.find('#reset-password');
    },

    getResetMsgWrapper: function() {
        return this.$el.find('.reset-password-msg');
    },

    getResetPasswordWrapper: function() {
        return this.$el.find('.reset-password-wrapper');
    },

    getStepForm: function () {
        return this.$el.find('#mg-echo-step-form');
    },

    getResetPasswordForm: function () {
        return this.$el.find('#mg-echo-reset-password-form');
    },

    getJson: function() {
        var value = this.getValue();
        value.date = mg_echo_global.getUTCDateFormatted(value.date);
        value.idGeneratedByClient = mg_echo_global.getBookingModel().get('idGeneratedByClient');
        return JSON.stringify(value);
    },

    getErrorEl: function(cls) {
        if(cls) {
            return this.$el.find(this.errorCls + '.' + cls);
        }
        return Magenta.Echo.InlineBooking.Views.BookingForm.prototype.getErrorEl.apply(this);
    },

    getWarningEl: function(cls) {
        if(cls) {
            return this.$el.find(this.errorCls + '.' + cls);
        }
        return Magenta.Echo.InlineBooking.Views.BookingForm.prototype.getWarningEl.apply(this);
    },

    getSuccessEl: function(cls) {
        if(cls) {
            return this.$el.find(this.successCls + '.' + cls);
        }
        return Magenta.Echo.InlineBooking.Views.BookingForm.prototype.getSuccessEl.apply(this);
    },

    initInputFocused: function() {
        this.$el.find('input, textarea')
            .on('focus', function(){
                $(this).closest('.field-container-wrapper').addClass('mg-echo-focus');
            })
            .on('blur', function(){
                $(this).closest('.field-container-wrapper').removeClass('mg-echo-focus');
            });
    },

    setupCompanyPhone: function(phone) {
        this.$el.find('.mg-echo-company-phone').text(phone);
    },

    findPassengerByContact: function () {

        mg_echo_global.ajax({
                url: "/passenger/getByParams",
                data: JSON.stringify({
                    bookerId: mg_echo_global.getContactModel().get('id'),
                    phone: mg_echo_global.getContactModel().get('phone'),
                    email: mg_echo_global.getContactModel().get('email'),
                    name: mg_echo_global.getContactModel().get('fullName')
                }),
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            }, this.isSecuredMode
        ).done(function (data, textStatus, jqXHR) {
            if (data.rows[0] && data.rows[0].passportId) {
                mg_echo_global.getContactModel().set('passportId', data.rows[0].passportId);
                mg_echo_global.getBookingModel().set({'contactRecord' : mg_echo_global.getContactModel().toJSON() });
                mg_echo_global.formStep2.updateView();
            }
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
                    mop = defaultValues.mop,
                    isCreditCardRequired = defaultValues.isCreditCardRequired;

                if (mg_echo_global.isMopAvailable(mop.typeName)) {
                    var defaultForBookingCard = mg_echo_global.getBookingConfig('defaultValues').defaultForBookingCard || null;
                    if (mg_echo_global.getBookingConfig('defaultValues').mop.id == 1 && defaultForBookingCard != null) {
                        mop = new Magenta.Echo.InlineBooking.Models.MOP(defaultForBookingCard);
                    } else {
                        mop = new Magenta.Echo.InlineBooking.Models.MOP(mop);
                    }
                    mop.convertClientMOP();
                } else {
                    mop = mg_echo_global.getMOPListModel().MOPlist[0];
                }
                mg_echo_global.setBookingConfig({'isCreditCardRequired' : isCreditCardRequired});

                mg_echo_global.defaultMop = mop;
                mg_echo_global.formStep2.getEditor('mop').setValue(mop);
                mg_echo_global.getBookingModel().set('mop', mop.get('type'));

                // if not changed in the service manual
                if (mg_echo_global.manualChangeService !== true && service != null) {
                    mg_echo_global.getBookingConfig('defaultValues').service = service;
                    mg_echo_global.getBookingModel().set('serviceRecord', new Magenta.Echo.InlineBooking.Models.Service(service));
                    mg_echo_global.formStep2.getEditor('serviceRecord').setValue(new Magenta.Echo.InlineBooking.Models.Service(service));
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
                        } else {
                            mg_echo_global.getBookingModel().set(
                                'serviceRecord',
                                new Magenta.Echo.InlineBooking.Models.Service( data.rows[0] )
                            );
                            mg_echo_global.formStep2.getEditor('serviceRecord')
                                .setValue( new Magenta.Echo.InlineBooking.Models.Service( data.rows[0] ) );

                            mg_echo_global.formStep2.updateView();
                        }

                        thiz.updatePassengersMaxValue();
                        thiz.onChangedForPriceAndCapacity();
                    });
                }
            }

            thiz.updatePassengersMaxValue();

            mg_echo_global.formStep2.unmask();
            if(callback) {
                callback.apply(scope || thiz);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            mg_echo_global.formStep2.unmask();
            thiz.exceptionHandler.onResponse(jqXHR);
        });
    },

    updateUserPanel: function() {
        var thiz = this;
        var link = thiz.$el.find('.mg-echo-auth-name-value').text(mg_echo_global.getContactModel().get('fullName'));

        link.attr('href', link[0].protocol + '//' + link[0].hostname + '/web-portal/login_private?email='+mg_echo_global.getContactModel().get('email'));

        thiz.$el.find('.mg-echo-auth-email-value').text(mg_echo_global.getContactModel().get('email'));
    },

    updatePassengersMaxValue: function () {
        var service = this.getEditor('serviceRecord').getValue();
        if(!service) return;

        var maxSeats = service.get('maxSeats');
        if(!maxSeats) return;

        var editor = this.getEditor('passengers');

        mg_echo_global.getPassengersListModel().generateOptions(maxSeats);
        editor.renderSuggestions();

        var selectedPassengers = editor.getValue() || 1;

        editor.setValue(new Magenta.Echo.InlineBooking.Models.Passenger(
            maxSeats > selectedPassengers ? selectedPassengers : maxSeats
        ));
    },

    registerCard: function(amount, confirmQuoteCallback) {
        var scope = this;
        scope.proceedPaymentUnlock();
        scope.lock();

        this.webPaymentPopup.registerCard({
            data: {
                amount: amount,
                register: amount === 1.01,
                job_id: mg_echo_global.getBookingModel().get('id')
            },
            success: function (result) {
                mg_echo_global.getBookingModel().set({'paymentReference' : result.reference});
                confirmQuoteCallback();
            },
            failure: function (result) {
                mg_echo_global.getBookingModel().set({'paymentReference' : null});
                scope.webPaymentPopup.declined = true;
                scope.cancelQuote();
                if (result && result.error) {
                    scope.exceptionHandler.showError(result.error);
                } else {
                    scope.exceptionHandler.onResponse({});
                }
            }
        });
    },

    webPayment: function (confirmQuoteCallback) {
        var scope = this;
        scope.proceedPaymentUnlock();
        scope.lock();
        var creditCard = mg_echo_global.getBookingModel().get('creditCard');

        this.webPaymentPopup.webPayment({
            data: {
                amount: mg_echo_global.totalPrice,
                card_id: creditCard.get('id'),
                quote_id: mg_echo_global.getBookingModel().get('id')
            },
            success: function (result) {
                confirmQuoteCallback();
            },
            failure: function (result) {
                scope.webPaymentPopup.declined = true;
                scope.cancelQuote();
                if (result && result.error) {
                    scope.exceptionHandler.showError(result.error);
                } else {
                    scope.exceptionHandler.onResponse({});
                }
            }
        });
    },

    setLock: function(overlay, locked) {
        this.isLocked = locked;
        var ol = this.$el.find(overlay);
        if (locked) {
            ol.show();
        } else {
            ol.hide();
        }
    },

    lock: function() {
        this.setLock('.mg-echo-lock-overlay', true);
    },

    unlock: function() {
        this.setLock('.mg-echo-lock-overlay', false);
    },

    proceedPaymentLock: function() {
        this.setLock('.mg-echo-proceed-payment-lock-overlay', true);
    },

    proceedPaymentUnlock: function() {
        this.setLock('.mg-echo-proceed-payment-lock-overlay', false);
    },

    cancelQuote: function () {
        if (this.quote && this.quote['_processed'] !== true) {
            var quoteId = this.quote['id'];
            mg_echo_global.ajax({
                url: '/booking/cancelQuote',
                type: 'POST',
                data: {
                    quoteId: quoteId
                }
            }, true);
            this.quote['_processed'] = true;
        }
    },

    onClosePage: function () {
        if (this.webPaymentPopup) {
            this.webPaymentPopup.closeWebPaymentWindow();
        }
    }
});
