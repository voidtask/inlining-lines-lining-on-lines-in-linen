Magenta.Echo.InlineBooking.Views.Wrappers.ResetPasswordWrapper = {

    initializeForm:  function() {
        return new Magenta.Echo.InlineBooking.Views.ResetPasswordForm({
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
                }
            },
            fields: ['email', 'password'],
            el: '#mg-echo-reset-password-form'
        });
    }
};