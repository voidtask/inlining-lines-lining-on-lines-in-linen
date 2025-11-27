window.mg_echo_global = (function($){
    var storageAvailable = function(type) {
        try {
            var storage = window[type],
                x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch(e) {
            return false;
        }
    }
    // Динаимческая загрузка формы
    $( document ).ready(function() {
        setTimeout(function () {
            $.get(mg_echo_conf.rootPath + '/getHTML?lang=' + mg_echo_conf.locale + '&widgetType=' + mg_echo_conf.widgetType, function (result) {
                var html = $('<div />').html(result);

                var _html = $(html[0]);
                var csrfTokenHeaderName = _html.find('meta[name="_csrf_header"]').attr('content');
                var csrfToken = _html.find('meta[name="_csrf"]').attr('content');
                if (csrfToken) {
                    $(document).ajaxSend(function(e, xhr, options) {
                        xhr.setRequestHeader(csrfTokenHeaderName, csrfToken);
                    });
                }

                $('#mg-echo-ib-form').html($(html[0]).find('#mg-echo-booking-form-step-1'));
                $('body').append($(html[0]).find('#mg-echo-hidden-wrap'));

                inlineBookingReady();
            });
        }, 100);
        $.ajaxSetup({
            xhrFields: {
                withCredentials: true
            }
        });
    });

    var bookingConfigModel,
        bookingModel, loginModel,
        contactModel, MOPListModel,
        PassengersListModel,
        formStep1,
        bookingConfirmationWindow,
        formStep2, bookingFormWrapperStep2,
        flightChecker,
        flightWindow,
        registrationAndLoginForm,
        resetPasswordForm,
        confirmationWindow,
        currentRequests = {},
        minDate,
        dateFormat = 'DD/MM/YYYY',
        datetimeFormat = 'DD/MM/YYYY HH:mm',
        cardExpiryFormat = 'MM/YY',
        apiPath = mg_echo_conf.rootPath + '/api',
        isToFixedBroken = (0.9).toFixed() !== '1',
        dateType = {
            asap: 'ASAP',
            pickup: 'PICKUP'
        },
        mop = {
            credit_card: '1',
            cash: '2'
        },
        clientMop = {
            'CREDIT_TYPE': { type : 1, value : translate('new_credit_card'), order: 10000 },
            'CASH_TYPE': { type : 2, value : translate('cash'), order: -1 }
        },
        addressTypes = {
            '22': 'airport',
            '1' : 'meeting',
            '0' : 'train'
        },
        responseHandlerKey = {
            price: 'price',
            capacity: 'capacity'
        },
        widgetTypes = {
            airport: 'airport',
        };

    //todo: check if it`s ok on the site where the code will be added to as it is global
    $.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
        var abortOnRetry = true;
        if (abortOnRetry) {
            if ( currentRequests[ options.url ] ) {
                currentRequests[ options.url ].abort();
            }
            currentRequests[ options.url ] = jqXHR;
        }
    });

    function loadBookingConfig(form) {
        return new Promise(function(resolve, reject){
            var thiz = form;
            thiz.$el.mask(translate('loading_configuration'));
            var extra = '';
            try {
                extra = mg_echo_conf.extraParams;
                if (extra && typeof extra === 'string' && extra.indexOf('?') == 0) {
                    extra = extra.substring(1);
                    extra = decodeURIComponent(extra);
                }
                else {
                    extra = '';
                    console.log('Unsupported extra parameter, ignored');
                }
            }
            catch(e) {
                console.log('Invalid extra parameter, ignored');
                extra = '';
            }
            $.ajax({
                url: mg_echo_conf.rootPath + "/api/bookingConfig",
                data: {'extraParams' : extra},
                type: 'GET',
                dataType: 'json'
            }).done(function (data, textStatus, jqXHR) {
                thiz.$el.unmask();
                thiz.exceptionHandler.onResponse(jqXHR);
                if (data.success) {
                    mg_echo_global.setBookingConfig(data.rows[0]);
                    mg_echo_global.setInfoAboutVATText(data.rows[0].showInfoAboutVAT ? true : false);
                    mg_echo_global.removePassportIdField(data.rows[0].passportIdEnabled);
                    mg_echo_global.removePostCodeField(false);
                    mg_echo_global.removeMopDescription(data.rows[0].showAdditionalChargeWarning);
                    mg_echo_global.removeCreditCardPrePaymentText(data.rows[0].isIndividualApplyCreditCardPrePayment);
                    mg_echo_global.setAutocompleteDelay(mg_echo_global.getBookingConfig('addressQueryDelay'));
                    mg_echo_global.setAgreeTermsText();
                    form.setDefaultValues();

                    if (data.rows[0].isGooglePlacesSearch) {
                        thiz.loadGooglePlacesLib();
                    }

                    // Load current user
                    formStep2.loadCurrentContact();
                    resolve();
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                thiz.$el.unmask();
                thiz.exceptionHandler.onResponse(jqXHR);
                reject();
            });

            $.ajax({
                url: mg_echo_conf.rootPath + "/api/jobExtras",
                type: 'GET',
                dataType: 'json'
            }).done(function (data, textStatus, jqXHR) {
                if(data.success && data.rows && data.rows.length) {
                    var extrasEditor = mg_echo_global.formStep2.getEditor('extras');
                    extrasEditor.addOptions(data.rows);
                }
            });
        });
    }

    function loadAvailableToBookOnline (form) {
        var thiz = form;
        thiz.$el.mask(translate('loading_services'));
        $.ajax({
            url: mg_echo_conf.rootPath + "/api/services/availableToBookOnline",
            type: 'POST',
            dataType: 'json'
        }).done(function (data, textStatus, jqXHR) {
            thiz.$el.unmask();
            thiz.exceptionHandler.onResponse(jqXHR);
            if(data.success) {
                if (data.rows.length > 0) {
                    mg_echo_global.getBookingConfig('defaultValues').CA_service = data.rows[0];
                    mg_echo_global.getBookingConfig('defaultValues').service = data.rows[0];
                    mg_echo_global.formStep2.getEditor('serviceRecord').setValue(
                        new Magenta.Echo.InlineBooking.Models.Service(data.rows[0])
                    );
                    mg_echo_global.formStep2.getForm().updatePassengersMaxValue();
                    if (!mg_echo_global.manualChangeService) {
                        mg_echo_global.getBookingModel().set('serviceRecord', new Magenta.Echo.InlineBooking.Models.Service(data.rows[0]));
                    }
                    mg_echo_global.formStep2.updateView();
                } else {
                    thiz.showError(translate('services_not_enabled') + ' ' + mg_echo_conf.companyPhone, 'heap');
                    thiz.$el.find('.next').addClass('disabled');
                }
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            thiz.$el.unmask();
            thiz.exceptionHandler.onResponse(jqXHR);
        });
    }

    function initialize () {
        bookingModel = new Magenta.Echo.InlineBooking.Models.Booking({
            mop: mop.cash,
            dateType: dateType.pickup,
        });
        loginModel = new Magenta.Echo.InlineBooking.Models.Login({});
        bookingConfigModel = new Magenta.Echo.InlineBooking.Models.BookingConfig({});
        contactModel = new Magenta.Echo.InlineBooking.Models.AbstractModel({});
        MOPListModel = new Magenta.Echo.InlineBooking.Models.MOPList({});
        PassengersListModel = new Magenta.Echo.InlineBooking.Models.PassengersList({});
    };

    function inlineBookingReady() {
        // extend maskin pattern
        $.extend( $.jMaskinGlobals.translation, {
            'F': {pattern: /[a-zA-Z0-9\s\-]/, recursive: true},
            'L': {pattern: /[a-zA-Z\s\.\-\\']/, recursive: true},
            'P': {pattern: /[\d\-\s\(\)]/, recursive: true},

            // допустимые символы в email
            'E': {pattern: /[a-zA-Z0-9\@\!\#\$\%\&\'\*\+\-\/\=\?\^\_\`\{\|\}\~\.]/, recursive: true},
        });

        Backbone.Form.validators.errMessages.required = translate('fill_out_required_fields');

        bookingFormWrapperStep2 = $('#mg-echo-booking-form-step-2-wrapper');
        mg_echo_global.bookingConfirmationWindow = $('#mg-echo-booking-confirmation-wrapper');

        initialize();
        flightChecker = new Backbone.Form.editors.FlightChecker();
        flightWindow = new Backbone.Form.editors.FlightWindow();

        formStep1 = Magenta.Echo.InlineBooking.Views.Wrappers.BookingWrapperShort.initializeForm();
        formStep2 = Magenta.Echo.InlineBooking.Views.Wrappers.BookingWrapperFull.initializeForm();
        registrationAndLoginForm = Magenta.Echo.InlineBooking.Views.Wrappers.RegistrationAndLoginWrapper.initializeForm();
        resetPasswordForm = Magenta.Echo.InlineBooking.Views.Wrappers.ResetPasswordWrapper.initializeForm();
        confirmationWindow = Magenta.Echo.InlineBooking.Views.BookingConfirmationWindow.initialize();


        loadBookingConfig(formStep1).then(function () {
            // Если перешли по ссылке на восстановление пароля
            mg_echo_global.confirmationCode = mg_echo_global.getUrlParameter('ib-confirmationCode');
            if (mg_echo_global.confirmationCode != null) {

                history.pushState("", document.title,
                    window.location.pathname +
                    window.location.search.replace("ib-confirmationCode=" + mg_echo_global.confirmationCode, "")
                );
                mg_echo_global.showBookingStep2Wrapper();
                mg_echo_global.formStep2.getForm().showResetPasswordForm();
                mg_echo_global.formStep2.getForm().onNext();

                // Get State from LocalStorage
                var formState = mg_echo_global.getLocalStorage().getItem('formState');
                if (formState) {
                    formState = JSON.parse(formState);
                    formState.date =  moment(formState.date, mg_echo_global.getDatetimeFormat());
                    formState.serviceRecord = new Magenta.Echo.InlineBooking.Models.Service(formState.serviceRecord);
                    mg_echo_global.manualChangeService = true;
                    mg_echo_global.getBookingModel().set(formState);
                    mg_echo_global.formStep2.updateView();
                    mg_echo_global.formStep2.getEditor('pickup').setValue(
                        new Magenta.Echo.InlineBooking.Models.Address(mg_echo_global.getBookingModel().getValue().pickup)
                    );
                    mg_echo_global.formStep2.getEditor('dropoff').setValue(
                        new Magenta.Echo.InlineBooking.Models.Address(mg_echo_global.getBookingModel().getValue().dropoff)
                    );
                    mg_echo_global.formStep2.loadPriceAndCapacity();
                }
            }
        });

        bookingFormWrapperStep2.find('.mg-echo-close-icon').on('click', function(){
            $(mg_echo_global).trigger('event.login.exit');
            formStep2.close();
        });
        mg_echo_global.bookingConfirmationWindow.find('.mg-echo-close-icon')
            .on('click', function(){
                mg_echo_global.bookingConfirmationWindow.hide();
            });

        // Переводим фокус на поле при клике на label
        $('.field-container-wrapper .mg-echo-label').on('click', function(){
            setTimeout(function () {
                $(this).closest('.field-container-wrapper').find('input').focus();
            }.bind(this), 100);
        });

        // Убираем плавающую кнопку book, когда проскролили до низу
        $('.mg-echo-booking-form-full').on('scroll', function () {
            var errorMsg = $('.for-mobile.form-error-messages');
            var bottomPanelFixed = $('.mg-echo-bottom-panel-fixed');
            if ($(this).scrollTop() + $(this).outerHeight() + bottomPanelFixed.outerHeight() + errorMsg.outerHeight() >= Math.round($('.mg-echo-booking-form-full-inner_wrap').outerHeight())) {
                bottomPanelFixed.addClass('mg-echo-hide');
            } else {
                bottomPanelFixed.removeClass('mg-echo-hide');
            }
        });

        // Отслеживаем размеры экрана (переключаем в мобильный вид)
        $(window).on('resize', function () {
            mg_echo_global.isMobile = ($(this).width() <= 800) ? true : false;
        }).trigger('resize');

        // Автоматическая прокрутка до выбранного поля при появление виртуальной клавиатуры на андроиде
        function scrollToInput(activeElement) {
            window.setTimeout(function () {
                if (activeElement.tagName == 'INPUT' || activeElement.tagName == 'TEXTAREA') {
                    var scrollElement =  $('#mg-echo-booking-form-step-2-wrapper').css('display') == 'block' ? $('#mg-echo-booking-form-step-2 .mg-echo-booking-form-full') : $('body');
                    var oldScrollTop = $(scrollElement).scrollTop();
                    var newScrollTop = $(activeElement).closest('.field-container-wrapper').position().top - ($(window).height() - $('.mg-echo-bottom-panel-fixed').height() - $(activeElement).height()) / 2.5;
                    if (newScrollTop > oldScrollTop) {
                        $(scrollElement).animate({
                            scrollTop: newScrollTop
                        }, 200);
                    }
                }
            }, 1);
        }

        if (/android/i.test(navigator.userAgent)) {
            $(window).on('resize', function () {
                scrollToInput(document.activeElement);
            });
            $('input, textarea').on('focus', function () {
                scrollToInput(this);
            });
        }
        
        // Поддежка touch для switch инпута
        (function onoffswitchTouch() {
            var onoffswitchPositionStart = 0,
                onoffswitchPositionEnd   = 0;
            $('.onoffswitch-switch')
                .on('touchstart click', function (event) {
                    if (event.originalEvent.changedTouches) {
                        onoffswitchPositionStart = event.originalEvent.changedTouches[event.originalEvent.changedTouches.length - 1].pageX;
                    }
                })
                .on('touchend', function (event) {
                    onoffswitchPositionEnd = event.originalEvent.changedTouches[event.originalEvent.changedTouches.length-1].pageX;
                    if (onoffswitchPositionStart < onoffswitchPositionEnd) {
                        $(this).closest('.onoffswitch').find('input[type="checkbox"]').prop('checked', true).trigger('change');
                    }
                    if (onoffswitchPositionStart > onoffswitchPositionEnd) {
                        $(this).closest('.onoffswitch').find('input[type="checkbox"]').prop('checked', false).trigger('change');
                    }
                })
        })();

    }

    function isIE () {
        var myNav = navigator.userAgent.toLowerCase();
        return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1], 10) : false;
    };
    return {

        getAsapText:  function() {
            return translate('for_now');
        },

        setMinDate: function (date) {
          minDate = date;
        },

        getMinDate: function () {
          return minDate ? minDate : moment();
        },

        loadAvailableToBookOnline: function() {
            return loadAvailableToBookOnline(formStep1);
        },

        getDateFormat: function() {
            return dateFormat;
        },

        getDatetimeFormat: function() {
            return datetimeFormat;
        },

        getCardExpiryFormat: function() {
            return cardExpiryFormat;
        },

        getBookingConfig: function(name) {
            return bookingConfigModel.get(name);
        },

        getBookingModel: function() {
            return bookingModel;
        },

        getLoginModel: function() {
            return loginModel;
        },

        getMOPListModel: function() {
            return MOPListModel;
        },

        getPassengersListModel: function() {
            return PassengersListModel;
        },

        getDateType: function(name) {
           return dateType[name];
        },

        getResponseHandlerKey: function(name) {
           return responseHandlerKey[name];
        },

        setBookingConfig: function(json) {
            bookingConfigModel.set(json);
        },

        setBookingReferenceText: function(bookingId) {
            formStep1.$el.find('.echo-title').text('Booking #' + bookingId + ' has been created');
        },

        setInfoAboutVATText: function(showInfoAboutVAT) {
            var value = '';
            if(showInfoAboutVAT) {
                if (mg_echo_global.getBookingConfig('priceVisibilityMode') == 1) {
                    value = translate('excl_VAT');
                } else {
                    value = translate('incl_VAT');
                }
            }
            formStep2.$el.find('.extra-charges-vat').text(value);
            mg_echo_global.bookingConfirmationWindow.find('.extra-charges-vat').text(value);
        },

        setAgreeTermsText: function () {
            registrationAndLoginForm.$el.find('.mg-checkbox-label').html(
                translate('agreeRegistration')
                    .replace('{0}', mg_echo_global.getBookingConfig('termsUrl'))
                    .replace('{1}', mg_echo_global.getBookingConfig('policyUrl'))
            );
        },

        removePassportIdField: function(passportIdEnabled) {
            if (!passportIdEnabled) {
                $('#mg-echo-booking-form-step-2 .passport-wrapper').remove();
            }
        },

        removePostCodeField: function(checkPostcodeForCreditCard) {
            if (!checkPostcodeForCreditCard) {
                $('#mg-echo-booking-form-step-2 .postcode-wrapper').remove();
            }
        },

        removeMopDescription: function(isCreditCardPrePaymentText) {
            if (!isCreditCardPrePaymentText) {
                $('#mg-echo-booking-form-step-2 .mg-echo-creditCard-PrePayment-Text').remove();
            }
        },

        removeCreditCardPrePaymentText: function(showAdditionalChargeWarning) {
            if (!showAdditionalChargeWarning) {
                $('#mg-echo-booking-form-step-2 .mop-description').remove();
            }
        },

        isDisplayMopDescription: function(isShow) {
            if (!isShow) {
                $('#mg-echo-booking-form-step-2 .mop-description').hide();
            } else {
                $('#mg-echo-booking-form-step-2 .mop-description').show();
            }
        },

        isMopAvailable: function (mopTypeName) {

            // temporarily no support PayPal
            if (mopTypeName == 'PAYPAL') return false;

            var availableMops = mg_echo_global.getBookingConfig('availableMops');
            var available = false;
            $.each(availableMops, function(key, mopItem) {
               if (mopItem.typeName == mopTypeName && mopItem.allowed == true) {
                   available = true;
                   return false;
               }
            });
            return available;
        },

        showBookingStep1Form:  function () {
            formStep1.show();
        },

        clearBookingModel: function() {
            bookingModel.clear();
        },

        getContactModel: function() {
            return contactModel;
        },

        ajax: function(ajaxConfig, isSecuredMode) {
            if(ajaxConfig.url) {
                ajaxConfig.url = apiPath + (isSecuredMode ? '/secured' :'') + ajaxConfig.url;
            }
            ajaxConfig.xhrFields = {
                withCredentials: true
            };
            ajaxConfig.headers = ajaxConfig.headers || {};
            ajaxConfig.headers['Authorization'] = 'Bearer ' + this.getLocalStorage().getItem('iba_token') || '';
            return $.ajax(ajaxConfig);
        },

        showBookingConfirmationWindow: function(responseValues) {
            formStep2.close();
            mg_echo_global.bookingConfirmationWindow.show();
            $('body').addClass('bookingConfirmationWindowShow');
            $(mg_echo_global).trigger('pageview.thankyou', [responseValues]);
        },

        getConfirmationWindow: function() {
            return confirmationWindow;
        },

        showLoginWrapper: function (noSkip) {
            loginModel.clear();
            loginForm.updateView();
            var skipEl= loginForm.$el.find(".without-signing-in");
            if(noSkip) {
                skipEl.hide();
            } else {
                skipEl.show();
            }
            loginFormWrapper.show();
        },

        getUTCDateFormatted: function(moment) {
            return moment.format ? moment.format(datetimeFormat) : moment;
        },

        hideLoginWrapper: function () {
            loginFormWrapper.hide();
            loginForm.clearValidationAndMessages();
        },

        showBookingStep2Wrapper: function () {
            formStep2.clearValidationAndMessages();
            formStep2.beforeShow();
            bookingFormWrapperStep2.show();
            formStep2.afterShow();

            $('body').addClass('mg-echo-booking-form-show');

            this.manualChangeService = false;
            this.manualChangeDate = mg_echo_conf.widgetType === mg_echo_global.widgetTypes.airport;
            $(mg_echo_global).trigger('pageview.book_from');
        },

        hideBookingStep2Wrapper: function () {
            bookingFormWrapperStep2.hide();
            formStep2.clearValidationAndMessages();
        },

        getFlightChecker: function() {
           return flightChecker;
        },

        getFlightWindow: function() {
            return flightWindow;
        },

        setAutocompleteDelay: function (addressQueryDelay) {
            $()
            .add(formStep1.fields.pickup.$el.find('input'))
            .add(formStep1.fields.dropoff.$el.find('input'))
            .add(formStep2.fields.pickup.$el.find('input'))
            .add(formStep2.fields.dropoff.$el.find('input'))
                .autocomplete('setOptions', {deferRequestBy: addressQueryDelay});
        },

        formatCurrency: function (value) {
            value = '<span class="mg-value">' + value + '</span>';

            if (mg_echo_conf.currencyPosition == 'right') {
                value = value + mg_echo_conf.currency;
            } else {
                if (mg_echo_conf.preferredCountries == 'jo') {
                    value = '<span class="mg-value">JOD&nbsp</span>' + value;
                } else {
                    value = mg_echo_conf.currency + value
                }
            }
            return value;
        },

        formStep1: {
            getForm: function () {
                return formStep1;
            }
        },

        formStep2: {

            mask: function(msg) {
                msg = msg || translate('loading');
                formStep2.$el.mask(msg);
            },

            unmask: function() {
                formStep2.$el.unmask();
            },

            updateView: function() {
                formStep2.updateView();
            },

            getEditor: function(name) {
                if(!name) {
                    return;
                }
                return formStep2.getEditor(name);
            },

            loadPriceAndCapacity: function() {
                formStep2.onChangedForPriceAndCapacity();
            },

            loadDefaultValues: function () {
                formStep2.loadDefaultValues();
            },

            clearPriceAndHidePriceSection: function() {
                formStep2.clearPriceAndResponseTimeAndHide();
            },

            setDefaultValues: function() {
                return formStep2.setDefaultValues();
            },

            getJson: function() {
                return formStep2.getJson();
            },

            getValue: function() {
                return formStep2.getValue();
            },

            getForm: function() {
                return formStep2;
            }

        },

        getRegistrationAndLoginForm: function() {
            return registrationAndLoginForm;
        },

        getResetPasswordForm: function() {
            return resetPasswordForm;
        },

        updateViewBookingFormStep1: function() {
            formStep1.setDefaultValues();
        },

        setSecuredOnFormStep2: function() {
            formStep2.setSecuredMode(true)
        },

        log: function (message) {
            if (isIE()!=7 && console && console.log) {
                console.log(message);
            }
        },

        toFixed: isToFixedBroken ? function(value, precision) {
            precision = precision || 0;
            var pow = math.pow(10, precision);
            return (math.round(value * pow) / pow).toFixed(precision);
        } : function(value, precision) {
            if (value)
                return value.toFixed(precision);
        },

        isObject: function(val) {
            return val instanceof Object;
        },

        getUrlParameter: function(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        },

        getLocalStorage: function() {
            if (storageAvailable('localStorage')) {
                return window.localStorage;
            } else {
                this._local_storage = this._local_storage || {
                    data: {},
                    setItem: function(name, value) {
                        return this.data[name] = value;
                    },
                    getItem: function(name) {
                        return this.data[name];
                    },
                    removeItem: function(name) {
                        return delete this.data[name];
                    }
                }
                return this._local_storage;
            }
        },

        manualChangeService: false,
        manualChangeDate: false,
        clientMop: clientMop,
        mop: mop,
        addressTypes: addressTypes,
        widgetTypes: widgetTypes,
        totalPrice: null,
        need3ds: false,
        responseTime: null,
        meteredPriceEstimate: null
    }

});

// Получаем файл переводов
$.getScript( mg_echo_conf.rootPath + '/l10n.js?lang='+mg_echo_conf.locale )
    .done(function( script, textStatus ) {
        window.mg_echo_global = window.mg_echo_global(window.$jQueryEcho || jQuery);
        $(document).trigger('app-ready');
    });






