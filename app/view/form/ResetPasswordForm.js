Magenta.Echo.InlineBooking.Views.ResetPasswordForm = Magenta.Echo.InlineBooking.Views.AbstractForm.extend({

    initialize: function() {
        Magenta.Echo.InlineBooking.Views.AbstractForm.prototype.initialize.apply(this, arguments);

        this.emailEl = $(this.el).find('input[name="email"]');
        this.passwordEl = $(this.el).find('input[name="password"]');

        $(this.el).on('submit', this.resetPasswordRequest.bind(this));
    },

    resetPasswordRequest: function (e) {
        var thiz = this;

        e.preventDefault();
        e.stopPropagation();

        var data = {
            username: this.emailEl.val(),
            password: this.passwordEl.val(),
            confirmationCode: mg_echo_global.confirmationCode
        };

        this.$el.mask(translate('loading_logging_in'));
        mg_echo_global.ajax({
            url: "/auth/login",
            data: data,
            type: 'POST',
            dataType: 'json'
        }).done(function (data, textStatus, jqXHR) {
            thiz.$el.unmask();

            if (data.errors[0] && data.errors[0].message === 'invalidLoginOrPassword') {
                thiz.close();
                return;
            }

            thiz.exceptionHandler.onResponse(jqXHR);

            if (data.success) {
                mg_echo_global.getLocalStorage().setItem('iba_token', data.authToken);
                $(mg_echo_global).trigger('pageview.book_info');
                mg_echo_global.formStep2.getForm().loadCurrentContact();
                mg_echo_global.formStep2.getForm().hideResetPasswordForm();
            }
        }).fail(function (jqXHR) {
            thiz.$el.unmask();
            thiz.exceptionHandler.onResponse(jqXHR);
        });

    },

    getErrorEl: function(cls) {
        if(cls) {
            return this.$el.find(this.errorCls + '.' + cls);
        }
        return Magenta.Echo.InlineBooking.Views.BookingForm.prototype.getErrorEl.apply(this);
    },

    showError: function(msg, cls) {
        var errorEl = this.getErrorEl(cls);
        errorEl.empty();
        errorEl.text(msg);
        errorEl.show();
    },

    close: function() {
        mg_echo_global.formStep2.getForm().close();
    }
});