Magenta.Echo.InlineBooking.Views.Wrappers.BookingWrapperShort = {
    initializeForm:  function() {

        var checkNotEmpty = function (value, formValues, editor) {
            if(editor.$el.is(':visible')) {
                return editor.getValidator('required')(value, formValues);
            }
            return;
        };

        return new Magenta.Echo.InlineBooking.Views.BookingFormShort({
            model: mg_echo_global.getBookingModel(),
            fields: ['date', 'dateType', 'pickup', 'dropoff', 'flightNumber'],
            schema: {
                date: {
                    type: 'DateTime',
                    el: '#mg-echo-booking-form-step-1 #mg-echo-date-wrapper .field-container',
                    config: {
                        format: mg_echo_global.getDateFormat(),
                        viewMode: 'days',
                        minDate: moment().startOf('day'),
                        ignoreReadonly: true,
                        useCurrent: false,
                        allowInputToggle: true,
                        collapse: false
                    },
                    validators: [
                        'required',
                        function(value, formValues, editor) {
                            if (editor.$el.find('#mg-echo-datetime').val() === '') {

                                var err = {
                                    type: 'date',
                                    message: 'Required'
                                };

                                return err;
                            }
                        }
                    ]
                },
                dateType: {
                    type: 'BaseTextField',
                    el: '#mg-echo-booking-form-step-1 #mg-echo-date-type'
                },
                pickup: {
                    type: 'PickUpField',
                    el: '#mg-echo-booking-form-step-1 .pickup-wrapper',
                    config: {
                        options: new Magenta.Echo.InlineBooking.Models.AddressList(),
                        minChars: 3,
                        preventBadQueries: false,
                        width: 'auto',
                        container: '#mg-echo-booking-form-step-1 .pickup-wrapper .field-container',
                        containerClass: 'autocomplete-suggestions short-form-autocomplete autocomplete-suggestions-address',
                        displayField: 'address',
                        isAddress: true
                    },
                    validators: [{ type: 'required', message: translate('not_found_address') }]
                },
                dropoff: {
                    type: 'Autocomplete',
                    el: '#mg-echo-booking-form-step-1 .dropoff-wrapper',
                    config: {
                        options: new Magenta.Echo.InlineBooking.Models.AddressList(),
                        fetchConfig: {
                            method: 'POST'
                        },
                        minChars: 3,
                        preventBadQueries: false,
                        width: 'auto',
                        container: '#mg-echo-booking-form-step-1 .dropoff-wrapper .field-container',
                        containerClass: 'autocomplete-suggestions short-form-autocomplete autocomplete-suggestions-address',
                        displayField: 'address',
                        isAddress: true
                    },
                    validators: [{ type: 'required', message: translate('not_found_address') }]
                },
                flightNumber: {
                    type: 'BaseTextField',
                    el: '#mg-echo-booking-form-step-1 .flightNumber-wrapper',
                    validators: [checkNotEmpty]
                }
            },
            el: '#mg-echo-booking-form-step-1'
        });
    }
};