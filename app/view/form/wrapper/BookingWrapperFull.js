Magenta.Echo.InlineBooking.Views.Wrappers.BookingWrapperFull = {

    initializeForm: function () {

        var checkNotEmpty = function (value, formValues, editor) {
            if(editor.$el.is(':visible')) {
                return editor.getValidator('required')(value, formValues);
            }
            return;
        };

        var  bookingForm = new Magenta.Echo.InlineBooking.Views.BookingFormFull({
            model: mg_echo_global.getBookingModel(),
            fields: [
                'serviceRecord', 'date', 'dateType', 'pickup',
                'dropoff', 'mop', 'creditCard', 'additionalInstructions',
                'contactRecord', 'extras', 'passengers', 'lateAllowance',
                'jobWorkflowType'
            ],
            schema: {
                serviceRecord: {
                    type: 'Autocomplete',
                    el: '#mg-echo-booking-form-step-2 #mg-echo-service-wrapper',
                    config: {
                        options: new Magenta.Echo.InlineBooking.Models.ServiceList(),
                        readonly: true,
                        triggerSelectOnValidInput: false,
                        preventBadQueries: false,
                        zIndex: 99999,
                        offsetLabel: true,
                        minChars: 0,
                        width: 'auto',
                        container: '#mg-echo-booking-form-step-2 .service-wrapper .field-container',
                        displayField: 'name',
                        position: 'absolute',
                        appendTo: $('#mg-echo-booking-form-step-2 .service-wrapper .mg-echo-dropdown'),
                        onSelect: function(suggestion, test) {
                            mg_echo_global.manualChangeService = true;
                            mg_echo_global.formStep2.getForm().updatePassengersMaxValue();
                            Backbone.Form.editors.Autocomplete.prototype.onSelect.call(mg_echo_global.formStep2.getEditor('serviceRecord'), suggestion);
                        },
                        transformResult: function(response) {
                            // sort result
                            response = typeof response === 'string' ? $.parseJSON(response) : response;
                            response.models.sort(function(a, b){
                                var aName = a.get('name').toLowerCase();
                                var bName = b.get('name').toLowerCase();
                                return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
                            });
                            return response;
                        }
                    },
                    validators: ['required']
                },
                date: {
                    type: 'DateTime',
                    el: '#mg-echo-booking-form-step-2 #mg-echo-date-wrapper-step-2 .field-container',
                    config: {
                        format: mg_echo_global.getDatetimeFormat(),
                        showAsap: true,
                        showSetButton: true,
                        ignoreReadonly: true,
                        minDate: moment(),
                        useCurrent: false,
                        stepping: 5,
                        allowInputToggle: true
                    },
                    validators: ['required']
                },
                dateType: {
                    type: 'BaseTextField',
                    el: '#mg-echo-booking-form-step-2 #mg-echo-date-type-step-2'
                },
                pickup: {
                    type: 'PickUpField',
                    el: '#mg-echo-booking-form-step-2 .pickup-wrapper',
                    config: {
                        options: new Magenta.Echo.InlineBooking.Models.AddressList(),
                        fetchConfig: {
                            method: 'POST'
                        },
                        minChars: 3,
                        preventBadQueries: false,
                        width: 'auto',
                        zIndex: 99999,
                        offsetLabel: true,
                        container: '#mg-echo-booking-form-step-2 .pickup-wrapper .field-container',
                        containerClass: 'autocomplete-suggestions autocomplete-suggestions-address',
                        displayField: 'address',
                        isAddress: true,
                        position: 'absolute',
                        appendTo: $('#mg-echo-booking-form-step-2 .pickup-wrapper .mg-echo-dropdown'),
                    },
                    validators: [
                        'required',
                        function(value, formValues, editor) {
                            if (value.get('flightNumber') == "error") {
                                var err = {
                                    type: 'flightNumber'
                                };

                                return err;
                            }
                        }
                    ]
                },
                dropoff: {
                    type: 'Autocomplete',
                    el: '#mg-echo-booking-form-step-2 .dropoff-wrapper',
                    config: {
                        options: new Magenta.Echo.InlineBooking.Models.AddressList(),
                        emptyObject: new Magenta.Echo.InlineBooking.Models.Address(),
                        fetchConfig: {
                            method: 'POST'
                        },
                        minChars: 3,
                        preventBadQueries: false,
                        width: 'auto',
                        zIndex: 99999,
                        offsetLabel: true,
                        container: '#mg-echo-booking-form-step-2 .dropoff-wrapper .field-container',
                        containerClass: 'autocomplete-suggestions autocomplete-suggestions-address',
                        displayField: 'address',
                        isAddress: true,
                        position: 'absolute',
                        appendTo: $('#mg-echo-booking-form-step-2 .dropoff-wrapper .mg-echo-dropdown'),
                    },
                    validators: [
                        'required',
                        function(value) {
                            if (value && value.addrId === null) {
                                var err = {
                                    type: 'required',
                                    message: Backbone.Form.validators.errMessages.required
                                };

                                return err;
                            }
                        }
                    ]
                },
                mop: {
                    type: 'CustomSelect',
                    el: '#mg-echo-booking-form-step-2 #mg-echo-mop-wrapper',
                    options: function() {
                        return mg_echo_global.getMOPListModel().MOPlist;
                    },
                    onSelect: function() {
                        this.trigger('valueSelected', this);
                    },
                    position: 'absolute',
                    validators: ['required'],
                    appendTo: $('#mg-echo-booking-form-step-2 .mop-wrapper .mg-echo-dropdown')
                },
                creditCard: {
                    model: new Magenta.Echo.InlineBooking.Models.AbstractModel(),
                    type: 'CreditCard',
                    constructor: Magenta.Echo.InlineBooking.Views.AbstractForm,
                    subSchema: {
                        id: {
                            type: 'Text',
                            el: '#mg-echo-credit-card-id'
                        },
                        type: {
                            type: 'Text',
                            el: '#mg-echo-credit-card-type'
                        },
                        number: {
                            type:'TextField',
                            el: '#mg-echo-credit-card-number-wrapper', //selector to match inside parent scheme
                            validators: [
                                checkNotEmpty,
                                {
                                    type: 'regexp',
                                    regexp: /^[\d\s\*]{1,19}$/,
                                    message: translate('wrong_format_numbers')
                                }
                            ]
                        },
                        name: {
                            type: 'TextField',
                            el: '#mg-echo-holder-wrapper', //selector to match inside parent scheme
                            validators: [
                                checkNotEmpty
                            ]
                        },
                        expiry: {
                            type:'TextField',
                            el: '#mg-echo-expiry-wrapper', //selector to match inside parent scheme
                            validators: [
                                checkNotEmpty,
                                /^[0-9\/]{1,5}$/,
                                //check format
                                function(value, formValues, editor) {
                                    if(editor.$el.is(':visible')) {
                                        if(!moment(value, mg_echo_global.getCardExpiryFormat(), true).isValid()) {
                                            var err = {
                                                type: 'expiry',
                                                message: translate('wrong_format_use') + ' ' + mg_echo_global.getCardExpiryFormat()
                                            };

                                            return err;
                                        }
                                    }
                                }
                            ]
                        },
                        secureCode: {
                            validators: [
                                checkNotEmpty
                            ],
                            type:'TextField',
                            el: '#mg-echo-cvv-wrapper',
                        },
                        postcode: {
                            validators: [
                                checkNotEmpty
                            ],
                            type:'TextField',
                            el: '#mg-echo-postcode-wrapper',
                        }
                    }
                    ,el: '#mg-echo-booking-form-step-2 #mg-echo-credit-card-form-wrapper'
                },
                additionalInstructions: {
                    type: 'TextArea',
                    el: '#mg-echo-booking-form-step-2 #mg-echo-additional-instructions-wrapper-step-2'
                },
                extras: {
                    type: 'ExtrasField',
                    el: '#mg-echo-booking-form-step-2 #mg-echo-extras-wrapper',
                    model: new Magenta.Echo.InlineBooking.Models.AbstractModel(),
                    constructor: Magenta.Echo.InlineBooking.Views.AbstractForm
                },
                passengers: {
                    type: 'CustomSelect',
                    el: '#mg-echo-booking-form-step-2 #mg-echo-passengers-wrapper',
                    options: function() {
                        var listModel = mg_echo_global.getPassengersListModel();
                        return listModel.PassangersList;
                    },
                    onSelect: function() {
                        this.trigger('valueSelected', this);
                    },
                    position: 'absolute',
                    validators: ['required'],
                    appendTo: $('#mg-echo-booking-form-step-2 #mg-echo-passengers-wrapper .mg-echo-dropdown')
                },
                contactRecord: {
                    type: 'FormField',
                    model: new Magenta.Echo.InlineBooking.Models.AbstractModel(),
                    constructor: Magenta.Echo.InlineBooking.Views.AbstractForm,
                    subSchema: {
                        phone: {
                            type: 'TextField',
                            el: '#mg-echo-booking-form-step-2 #mg-echo-phone-wrapper',
                            validators: [
                                function(value, formValues, form) {
                                    if (
                                        (mg_echo_global.getBookingConfig('isPassengerPhoneMandatory') && !mg_echo_global.formStep2.getForm().validatePhone(value)) ||
                                        (!mg_echo_global.getBookingConfig('isPassengerPhoneMandatory') && value.trim() != '' && !mg_echo_global.formStep2.getForm().validatePhone(value))
                                    ) {
                                        return {
                                            type: 'phone',
                                            message: translate('wrong_format_phone')
                                        };
                                    }
                                }
                            ]
                        },
                        fullName: {
                            type: 'TextField',
                            el: '#mg-echo-booking-form-step-2 #mg-echo-name-wrapper',
                            validators: [
                                {
                                    type: 'regexp',
                                    regexp: /^[a-zA-Z\s\-]+$/,
                                    message: translate('wrong_format_hyphen')
                                }
                            ]
                        },
                        email: {
                            type: 'TextField',
                            el: '#mg-echo-booking-form-step-2 #mg-echo-email-wrapper',
                            validators: ['email']
                        },
                        passportId: {
                            type: 'TextField',
                            el: '#mg-echo-booking-form-step-2' + ' #mg-echo-passport-wrapper',
                            validators: [
                                checkNotEmpty
                            ]
                        }
                    },
                    el: '#mg-echo-booking-form-step-2 #mg-echo-contact-wrapper'
                },
                lateAllowance: {
                    type: 'Number',
                    el: '#mg-echo-booking-form-step-2 #mg-echo-lateAllowance-wrapper'
                },
                jobWorkflowType: {
                    type: 'Hidden',
                    el: '#mg-echo-booking-form-step-2 #mg-echo-jobWorkflowType-wrapper'
                }
            }
            , el: '#mg-echo-booking-form-step-2'
        });

        return bookingForm;
    }
};