Magenta.Echo.InlineBooking.Views.Wrappers.LoginWrapper = {
    initializeForm:  function() {
        return new Magenta.Echo.InlineBooking.Views.LoginForm({
            model: mg_echo_global.getLoginModel(),
            schema: {
                username: {
                    type: 'TextField',
                    el: '#mg-echo-login-form #mg-echo-username-wrapper',
                    validators: ['required']
                },
                password: {
                    type: 'TextField',
                    el: '#mg-echo-login-form #mg-echo-password-wrapper',
                    validators: ['required']
                }
            },
            fields: ['username', 'password']
            , el: '#mg-echo-login-form'
        });
    }
};