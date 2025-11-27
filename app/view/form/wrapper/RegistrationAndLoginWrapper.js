Magenta.Echo.InlineBooking.Views.Wrappers.RegistrationAndLoginWrapper = {

    initializeForm:  function() {
        return new Magenta.Echo.InlineBooking.Views.RegistrationAndLoginForm({
            schema: {
                email: {
                    type: 'TextField',
                    el: '#mg-echo-step-form .email-wrapper',
                    validators: ['required', 'email']
                },
                password: {
                    type: 'TextField',
                    el: '#mg-echo-step-form .password-wrapper',
                    validators: ['required']
                },
                phone: {
                    type: 'TextField',
                    el: '#mg-echo-step-form .phone-wrapper',
                    validators: [
                        'required',
                        function(value, formValues, form) {
                            if (!mg_echo_global.formStep2.getForm().validatePhone(form.$el.find('.selected-dial-code').text() + value, true)) {
                                return {
                                    type: 'phone',
                                    message: 'We are unable to send text messages to the telephone number provided. Please provide your mobile number'
                                };
                            }
                        }
                    ]
                },
                name: {
                    type: 'TextField',
                    el: '#mg-echo-step-form .name-wrapper',
                    validators: ['required']
                },
                confirmationCode: {
                    type: 'TextField',
                    el: '#mg-echo-step-form .confirmationCode-wrapper',
                    validators: ['required']
                },
                agreeTerms: {
                    type: 'Checkbox',
                    el: '#mg-echo-step-form .mg-agree-wrapper input',
                    validators: [
                        {
                            type: 'required',
                            message: translate('agreeRegistrationError')
                        }
                    ]
                }
            },
            fields: ['email', 'password', 'phone', 'name', 'confirmationCode', 'agreeTerms'],
            el: '#mg-echo-step-form'
        });
    }
};