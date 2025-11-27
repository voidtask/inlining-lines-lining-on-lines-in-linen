Magenta.Echo.InlineBooking.Models.MOP = Magenta.Echo.InlineBooking.Models.AbstractModel.extend({

    initialize: function(args) {
        // if Credit Card
        if (args.number != null) {
            this.set('creditCard', new Magenta.Echo.InlineBooking.Models.CreditCard(args));
            this.set('type', 1);
            this.set('value', args.type + ' ' + args.number.replace(/\*/g, String.fromCharCode(8226)).match(/.{1,4}/g).join(' '));
        } else {
            this.set('value', args.value);
        }
        return args;
    },

    convertClientMOP: function() {
        $.extend(this.attributes, mg_echo_global.clientMop[this.get('typeName')]);
    },

    getValue: function() {
        return this.get('type') ? this.get('type') : this.get('id');
    },

    setValue: function() {

        if (
            (this.get('type') == 2 && mg_echo_global.getBookingConfig('isCreditCardRequired') == true && mg_echo_global.getContactModel().get('creditCards').length == 0) ||
            (this.get('type') == 1 && this.get('creditCard') == null)
        ) {
            $(mg_echo_global.formStep2.getEditor('creditCard').el).show();

            // Если Cash, то показываем дополнительный текст
            if (this.get('type') == 2) {
                $(mg_echo_global.formStep2.getEditor('creditCard').el).find('#mg-echo-isCreditCardRequired').show();
            } else {
                $(mg_echo_global.formStep2.getEditor('creditCard').el).find('#mg-echo-isCreditCardRequired').hide();
            }
        } else {
            $(mg_echo_global.formStep2.getEditor('creditCard').el).hide();
        }


        // If your existing credit card
        if (this.get('creditCard') != null) {
            mg_echo_global.formStep2.getEditor('creditCard').setValue(this.get('creditCard'));
        } else {
            mg_echo_global.formStep2.getEditor('creditCard').setValue(new Magenta.Echo.InlineBooking.Models.CreditCard());
            mg_echo_global.formStep2.getEditor('creditCard').setValue(this.get('type'));
        }

        // Если Credit Card, то отображаем предупреждение
        mg_echo_global.isDisplayMopDescription(this.get('type') == 1);
    },

    toString: function() {
        return this.get('value');
    }
});

Magenta.Echo.InlineBooking.Models.MOPList = Magenta.Echo.InlineBooking.Models.AbstractModel.extend({

    MOPlist: [],

    availableUpdate: function (args) {

        this.MOPlist = this.MOPlist.filter(function(mop) {
           if (mop.get('number') != null) {
               return true;
           } else {
               return false;
           }
        });

        if (mg_echo_global.isMopAvailable('CASH_TYPE')) {
            this.MOPlist.push(new Magenta.Echo.InlineBooking.Models.MOP(mg_echo_global.clientMop['CASH_TYPE']));
        }
        if (mg_echo_global.isMopAvailable('CREDIT_TYPE')) {
            this.MOPlist.push(new Magenta.Echo.InlineBooking.Models.MOP(mg_echo_global.clientMop['CREDIT_TYPE']));
        }
    },

    clear: function() {
        this.MOPlist = [];
    }
});