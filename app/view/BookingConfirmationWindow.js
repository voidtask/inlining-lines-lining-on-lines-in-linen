Magenta.Echo.InlineBooking.Views.BookingConfirmationWindow = {

    initialize: function () {
        _.bindAll(this, 'onClose', 'onPrint', 'showOnMap');

        this.confirmationWindow = mg_echo_global.bookingConfirmationWindow;
        this.values = null;

        this.closeButton = this.confirmationWindow.find('.mg-echo-booking-confirmation-close-btn');
        this.closeButton.on('click', this.onClose);

        this.printButton = this.confirmationWindow.find('.echo-btn-print');
        this.printButton.on('click', this.onPrint);

        this.showOnMapButton = this.confirmationWindow.find('.echo-btn-show-on-map');
        this.showOnMapButton.on('click', this.showOnMap);

        this.extraChargesLink = this.confirmationWindow.find('.extra-charges-link');
        this.extraChargesLink.on('click', this.onExtraChargesLink);

        return this;
    },

    setValues: function(sendValues, responseValues) {

        this.values = JSON.parse(JSON.stringify(sendValues));
        this.values.id = responseValues.id;
        this.values.creditCard = responseValues.creditCard;
        this.values.webTrackingUrl = responseValues.webTrackingUrl;
        this.values.totalPrice = mg_echo_global.totalPrice;
        this.values.responseTime = mg_echo_global.responseTime;

        this.setBookingID();

        this.setServiceName();
        this.setPickup();
        this.setDropoff();
        this.setDate();
        this.setEmail();
        this.setFullName();
        this.setPhone();
        this.setExtras();
        this.setMop();
        this.setTotalPrice();
        this.setResponseTime();
    },

    setBookingID: function() {
        this.confirmationWindow.find('[data-bind="id"]').text(this.values.id ? this.values.id : '');
    },

    setServiceName: function() {
        this.confirmationWindow.find('[data-bind="serviceRecord.name"]').text(this.values.serviceRecord.name ? this.values.serviceRecord.name : '');
        if (this.values.serviceRecord.description) {
            this.confirmationWindow.find('[data-bind="serviceRecord.name"]').append('<div class="echo-service-desc">' + this.values.serviceRecord.description + '</div>');
        }
    },

    setPickup: function() {
        this.confirmationWindow.find('[data-bind="pickup.address"]').text(this.values.pickup.address ? this.values.pickup.address : '');
        var notes = this.values.pickup.customerNotes;
        this.confirmationWindow.find('[data-bind="pickup.customerNotes"]').text(notes);
        var confirmationContainer = this.confirmationWindow.find('.pickup-notes-confirmation');
        notes ? confirmationContainer.show() : confirmationContainer.hide();
    },

    setDropoff: function() {
        this.confirmationWindow.find('[data-bind="dropoff.address"]').text(this.values.dropoff.address ? this.values.dropoff.address : '');
    },

    setDate: function() {
        if(mg_echo_conf.widgetType === mg_echo_global.widgetTypes.airport){
            this.confirmationWindow.find('[data-bind="date"]').text(
                mg_echo_global.getFlightWindow().flightWindowMessage
            );
        } else if (this.values.dateType === mg_echo_global.getDateType('asap')) {
            this.confirmationWindow.find('[data-bind="date"]').text(mg_echo_global.getAsapText());
        } else if (this.values.pickup.flightNumber) {
            var holdOffTimeHr = Math.floor(this.values.pickup.holdOffTime / 60);
            var holdOffTimeMin = this.values.pickup.holdOffTime - (holdOffTimeHr * 60);

            var pickUpTime = '';
            if (this.values.flightDelay) {
                pickUpTime = new moment(
                            this.values.pickup.scheduledLandingDate, mg_echo_global.getDatetimeFormat()
                        )
                        .add(this.values.flightDelay, 'minutes')
                        .format(mg_echo_global.getDatetimeFormat());
            } else {
                pickUpTime = this.values.pickup.scheduledLandingDate;
            }

            this.confirmationWindow.find('[data-bind="date"]').html(this.values.pickup.flightNumber +', ' + translate('landing_on') + ' ' + pickUpTime + '<br>' + translate('pickup_delay') + ' ' + holdOffTimeHr + ' hr ' + holdOffTimeMin + ' ' + translate(' min'));
        } else {
            var momentDate = moment(this.values.date, mg_echo_global.getDatetimeFormat());
            var result = momentDate.calendar(null, {
                sameDay: '[Today], DD MMMM, YYYY, dddd [at] HH:mm',
                nextDay: '[Tomorrow], DD MMMM, YYYY, dddd [at] HH:mm',
                lastDay: 'DD MMMM, YYYY, dddd [at] HH:mm',
                lastWeek: 'DD MMMM, YYYY, dddd [at] HH:mm',
                nextWeek: 'DD MMMM, YYYY, dddd [at] HH:mm',
                sameElse: 'DD MMMM, YYYY, dddd [at] HH:mm'
            });
            this.confirmationWindow.find('[data-bind="date"]').text(result);
        }
    },

    setEmail: function() {
        this.confirmationWindow.find('[data-bind="contactRecord.email"]').html(this.values.contactRecord.email ? this.values.contactRecord.email : '&mdash;');
    },

    setFullName: function() {
        this.confirmationWindow.find('[data-bind="contactRecord.fullName"]').html(this.values.contactRecord.fullName ? this.values.contactRecord.fullName : '&mdash;');
    },

    setPhone: function() {
        this.confirmationWindow.find('[data-bind="contactRecord.phone"]').html(this.values.contactRecord.phone ? this.values.contactRecord.phone : '&mdash;');
    },

    setExtras: function() {
        if (this.values.extras && this.values.extras.length > 0) {
            this.confirmationWindow.find('[data-bind="extras"]').show();
            var extrasStringArray = [];
            _.each(this.values.extras, function (extrasItem) {
                extrasStringArray.push(new Magenta.Echo.InlineBooking.Models.Extras(extrasItem).toString());
            });
            this.confirmationWindow.find('[data-bind="extras"]').html(extrasStringArray.join(', '));
        } else {
            this.confirmationWindow.find('[data-bind="extras"]').hide();
        }

    },

    setMop: function() {
        var mopText = '';
        var self = this;
        if (this.values.creditCard && this.values.creditCard.number) {
            mopText = this.values.creditCard.type + ' ' + this.values.creditCard.number.replace(/\*/g, String.fromCharCode(8226)).match(/.{1,4}/g).join(' ');
        } else {
            Object.keys(mg_echo_global.clientMop).map(function(value) {
                if (mg_echo_global.clientMop[value].type === self.values.mop) {
                    mopText = mg_echo_global.clientMop[value].value
                    return false;
                }
            });
        }

        this.confirmationWindow.find('[data-bind="mop"]').text(mopText);
    },

    setMopType: function() {
        var self = this;
        var mopText = '';
        if (this.values.mop == 1) {
            mopText = 'Personal Credit Card'
        } else {
            Object.keys(mg_echo_global.clientMop).map(function(value) {
                if (mg_echo_global.clientMop[value].type === self.values.mop) {
                    mopText = mg_echo_global.clientMop[value].value
                    return false;
                }
            });
        }
        this.confirmationWindow.find('[data-bind="mop-type"]').text(mopText);
    },

    setCreditCardDetails: function() {
        if (this.values.creditCard) {
            this.confirmationWindow.find('[data-bind="creditCard.name"]').html(this.values.creditCard.name);
            this.confirmationWindow.find('[data-bind="creditCard.expiry"]').html(this.values.creditCard.expiry);
            this.confirmationWindow.find('.card-details').show();
        } else {
            this.confirmationWindow.find('.card-details').hide();
        }
    },

    setTotalPrice: function() {
        if (this.values.totalPrice != null) {
            this.confirmationWindow.find('[data-bind="totalPrice"]').html(mg_echo_global.formatCurrency(this.values.totalPrice));

            if (mg_echo_global.meteredPriceEstimate && this.values.totalPrice != mg_echo_global.meteredPriceEstimate) {
                this.confirmationWindow.find('[data-bind="totalPrice"]')
                    .append('-' + mg_echo_global.meteredPriceEstimate);
            }

            this.confirmationWindow.find('.total-price').show();
        } else {
            this.confirmationWindow.find('.total-price').hide();
        }
    },

    setResponseTime: function() {
        if (this.values.responseTime != null) {
            this.confirmationWindow.find('[data-bind="responseTime"]').html(this.values.responseTime);
            this.confirmationWindow.find('.response-time').show();
        } else {
            this.confirmationWindow.find('.response-time').hide();
        }
    },

    onClose: function() {
        this.confirmationWindow.hide();
        mg_echo_global.updateViewBookingFormStep1();
        $(mg_echo_global).trigger('event.created_booking.close');
    },

    onPrint: function() {
        var self = this;

        $.get(mg_echo_conf.rootPath + '/report', function(result){
            reportOnload(result);
        });

        var reportOnload = function(result) {

            var body = result.replace(/^[\S\s]*<body[^>]*?>/i, "")
                .replace(/<\/body[\S\s]*$/i, "");
            self.confirmationWindow = $('<div>' + body + '</div>');

            self.setBookingID();
            self.setServiceName();
            self.setPickup();
            self.setDropoff();
            self.setDate();
            self.setEmail();
            self.setFullName();
            self.setPhone();
            self.setExtras();
            self.setMop();
            self.setMopType();
            self.setCreditCardDetails();

            // Небольшая задержка исправляем баг ECHO-9642 в FF
            setTimeout(function () {
                $('.mg-echo-print-report').html(self.confirmationWindow);
                setTimeout(function () {
                    window.print();
                    self.confirmationWindow = mg_echo_global.bookingConfirmationWindow;
                }, 200);
            }, 20);
        };

        $(mg_echo_global).trigger('event.created_booking.show_on_map');
    },

    showOnMap: function() {
        window.open(this.values.webTrackingUrl);
        $(mg_echo_global).trigger('event.created_booking.print');
    },

    onExtraChargesLink: function () {
        $(mg_echo_global).trigger('event.created_booking.terms_link');
        return true;
    }


}