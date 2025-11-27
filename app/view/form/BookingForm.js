Magenta.Echo.InlineBooking.Views.BookingForm = Magenta.Echo.InlineBooking.Views.AbstractForm.extend({

    initialize: function() {
        _.bindAll(this, 'onClickAsap', 'onSelect', 'setClicked');
        Magenta.Echo.InlineBooking.Views.AbstractForm.prototype.initialize.apply(this, arguments);

        this.getEditor('date').on('asapClicked',this.onClickAsap);
        this.getEditor('date').on('select',this.onSelect);
        this.getEditor('date').on('setClicked',this.setClicked);

        this.$el.find('input.credit-card-number').maskin("0000 0000 0000 0000");
        this.$el.find('input.holder').maskin("L");
        this.$el.find('input.cvv').maskin("0000");
        this.$el.find('input.expiry').maskin("00/00");
        this.$el.find('input.postcode').maskin("F");
    },

    onUpdateView: function() {
        if(this.isAsap()) {
            this.getEditor('date').setAsapView();
            mg_echo_global.getFlightChecker().notAdjustDateEditor.setAsapView();
        }
    },

    onClickAsap: function () {
        mg_echo_global.manualChangeDate = true;
        this.getEditor('dateType').setValue(mg_echo_global.getDateType('asap'));
        mg_echo_global.getBookingModel().set('dateType', mg_echo_global.getDateType('asap'));
    },

    setClicked: function (editor) {
        mg_echo_global.manualChangeDate = true;
        this.getEditor('dateType').setValue(mg_echo_global.getDateType('pickup'));
        mg_echo_global.getBookingModel().set('dateType', mg_echo_global.getDateType('pickup'));
        mg_echo_global.getBookingModel().set('date', editor.getValue());

    },

    onSelect: function() {},

    setDefaultAddress: function () {
        var thiz = this
        this.$el.mask(translate('Setting default address...'));
        mg_echo_global.ajax({
            url: "/addresses/search",
            data: {query: mg_echo_conf.defaultPickup},
            type: 'POST',
            dataType: 'json'
        }).done(function (data, textStatus, jqXHR) {
            if (data.rows.length === 0) {
                thiz.exceptionHandler.showError('Default address was not set');
                thiz.$el.unmask();
                return
            }
            mg_echo_global.getBookingModel().set(
                'pickup',
                new Magenta.Echo.InlineBooking.Models.Address(data.rows[0])
            )

            if (mg_echo_conf.blockAddressChange) {
                document.getElementById('mg-echo-pickup').setAttribute("disabled", "");
                document.getElementById('mg-echo-pickup-step-2').setAttribute("disabled", "");
            }

            thiz.updateView();
            thiz.$el.unmask();
            }
        ).fail(function (jqXHR, textStatus, errorThrown) {
            thiz.$el.unmask();
            thiz.exceptionHandler.onResponse(jqXHR);
        });
    },
    
    setDefaultPU: function () {
        mg_echo_global.getBookingModel().set(
            'pickup',
            new Magenta.Echo.InlineBooking.Models.Address(mg_echo_global.getBookingConfig('defaultPU'))
        );
        if (mg_echo_conf.blockAddressChange) {
            document.getElementById('mg-echo-pickup').setAttribute("disabled", "");
            document.getElementById('mg-echo-pickup-step-2').setAttribute("disabled", "");
        }
        this.updateView();
    },
    
    setDefaultValues: function() {
        if(mg_echo_global.getBookingConfig('setAsapAsDefault')) {
            mg_echo_global.getBookingModel().set('dateType', mg_echo_global.getDateType('asap'));
        } else {
            mg_echo_global.getBookingModel().set('dateType', mg_echo_global.getDateType('pickup'));
        }
        
        if (mg_echo_global.getBookingConfig('defaultPU')) {
           this.setDefaultPU();
        }
        
        if (mg_echo_conf.defaultPickup) {
            this.setDefaultAddress()
        }

        if (mg_echo_conf.widgetType === mg_echo_global.widgetTypes.airport) {
            mg_echo_global.getBookingModel().set('date', null);
            mg_echo_global.getBookingModel().set('jobWorkflowType', 'AIRPORT_FLIGHT_NUMBER');
        } else {
            mg_echo_global.getBookingModel().set('date', mg_echo_global.getMinDate());
            mg_echo_global.getBookingModel().set('jobWorkflowType', 'STANDARD');
        }

        var defaultValues = mg_echo_global.getBookingConfig('defaultValues');
        
        if(defaultValues && defaultValues.mop) {
            mg_echo_global.getBookingModel().set('mop', defaultValues.mop.id);
        }

        if(defaultValues && defaultValues.service) {
            mg_echo_global.getBookingModel().set(
                'serviceRecord',
                new Magenta.Echo.InlineBooking.Models.Service(defaultValues.service)
            );
            mg_echo_global.formStep2.getEditor('serviceRecord').setValue(
                new Magenta.Echo.InlineBooking.Models.Service(defaultValues.service)
            );
            mg_echo_global.formStep2.getForm().updatePassengersMaxValue();
        } else {
            mg_echo_global.loadAvailableToBookOnline();
        }

        this.updateView();

        if (mg_echo_global.getBookingConfig('defaultValues').CA_service == null) {
            mg_echo_global.getBookingConfig('defaultValues').CA_service = defaultValues.service;
        }

        if(!mg_echo_global.getBookingConfig('setAsapAsDefault')) {
            this.$el.find('#mg-echo-datetime').val('');
        }

        // Clear pre price
        this.$el.find('.button-preprice').html('');
    },

    isAsap: function() {
        return this.getEditor('dateType').getValue() === mg_echo_global.getDateType('asap');
    },

    isFound: function(value) {
        return value != -1;
    },
    validatePhone: function(phone,isMobile) {

        return true;
        var phone = phone.replace(/[^\+^0-9]/g,'');

        // Если номер международного формата (начинается с +)
        if (phone[0] == '+') {

            if ( this.isFound(phone.search(/^(\+44|0).+$/)) ) { // UK

                if ( this.isFound(phone.search(/^(\+447|07).{9}$/)) ) // Международный, мобильный
                    return true;
                if ( this.isFound(phone.search(/^(\+44[^7]|0[^7]).{9}$/)) || this.isFound(phone.search(/^(\+441|01).{8,9}$/)) ) // Международный, стационарный
                    return isMobile ? false : true;

            } else if ( this.isFound(phone.search(/^(\+34\d).+$/)) ) { // Spain

                if ( this.isFound(phone.search(/^\+34(6|7).{8}$/)) ) // Международный, мобильный
                    return true;
                if ( this.isFound(phone.search(/^\+34[^67].{8}$/)) ) // Международный, стационарный
                    return isMobile ? false : true;

            } else if ( this.isFound(phone.search(/^\+\d.{8,14}$/)) ) {
                return true; // Международный, мобильный, из другой страны
            } else
                return false; // Международный, мобильный, не соответсвует ни одному формату

        } else { // Если номер в локальном формате
            // Проверяем на соответсвие отдному из форматов по странам, в зависимости от локали инстанса Echo
            switch (mg_echo_global.getBookingConfig('clientCountry')) {
                case 'UK':
                    if ( this.isFound(phone.search(/^07.{9}$/)) ) // Локальный, мобильный
                        return true;
                    if ( this.isFound(phone.search(/^0[^7].{9}$/)) || this.isFound(phone.search(/^01.{8,9}$/)) ) // Локальный, стационарный
                        return isMobile ? false : true;
                    break;
                case 'Spain':
                    if ( this.isFound(phone.search(/^(6|7).{8}$/)) ) // Локальный, мобильный
                        return true;
                    if ( this.isFound(phone.search(/^.{9}$/)) ) // Локальный, стационарный
                        return isMobile ? false : true;
                    break;
            }
        }
        return false;
    }
});