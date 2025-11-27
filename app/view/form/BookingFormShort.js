Magenta.Echo.InlineBooking.Views.BookingFormShort = Magenta.Echo.InlineBooking.Views.BookingForm.extend({

    initialize: function() {
        _.bindAll(this, 'onNext');
        Magenta.Echo.InlineBooking.Views.BookingForm.prototype.initialize.apply(this, arguments);

        var thiz = this;

        this.$el.find('.next').on('click', this.onNext);

        thiz.pickupInput = this.$el.find('#mg-echo-pickup');
        thiz.dropoffInput = this.$el.find('#mg-echo-dropoff');

        thiz.errorMessage = this.$el.find('.error-message');
        thiz.flightNumberInput = this.$el.find('#mg-echo-flightNumber');
        thiz.tripsWrapper = this.$el.find('.mg-echo-trips-wrapper');
        thiz.airportPickupWrapper = this.$el.find('.pickup-wrapper');
        thiz.airportDropoffWrapper = this.$el.find('.dropoff-wrapper');
        thiz.pickupAutoFillAirport = thiz.airportPickupWrapper.find('.mg-auto-fill-airport');
        thiz.dropoffAutoFillAirport = thiz.airportDropoffWrapper.find('.mg-auto-fill-airport');
        thiz.manualFillPickup = thiz.airportPickupWrapper.find('.mg-manual-fill-pickup');
        thiz.manualFillDropoff = thiz.airportDropoffWrapper.find('.mg-manual-fill-dropoff');
        thiz.airportPickupList = this.$el.find('.mg-echo-pickup-list');
        thiz.airportDropoffList = this.$el.find('.mg-echo-dropoff-list');
        thiz.dateWrapper = this.$el.find('.date-wrapper');
        thiz.dateWrapperField = thiz.dateWrapper.find('.field-container');
        thiz.airportSearchBtn = this.$el.find('.mg-echo-airport-search-btn');
        thiz.airportErrorWrapper = this.$el.find('.mg-echo-airport-error-wrapper');
        thiz.airportErrorMessage = this.$el.find('.mg-echo-airport-error-message');
        thiz.airportMessage = this.$el.find('.airport-message');
        thiz.availableDates = [];

        this.on('pickup:valueSelected', function () {
           if (thiz.pickupInput.data().autocomplete.selection.attributes.clarify == true) {
               thiz.pickupInput.val('');
               thiz.clarifyAddress(thiz.pickupInput);
           }
        });

        this.on('dropoff:valueSelected', function () {
            if (thiz.dropoffInput.data().autocomplete.selection.attributes.clarify == true) {
                thiz.dropoffInput.val('');
                thiz.clarifyAddress(thiz.dropoffInput);
            }
        });

        this.$el.on('input', thiz.pickupInput, function(e){
            thiz.$el.find('.button-preprice').html('');
            if (e.target.value.indexOf('\"') > -1) {
                var oldValue = e.target.value;
                e.target.value = oldValue.replace(/\"/g, "\'")
            }
        });

        this.on('pickup:valueSelected dropoff:valueSelected date:select', function(){
            if (this.$el.find('.error-message').text() != '') {
                this.commit();
            }

            var condition;

            if (mg_echo_conf.widgetType === mg_echo_global.widgetTypes.airport) {
                condition = thiz.pickupInput.val() && thiz.dropoffInput.val() && thiz.dateWrapperField.data().date && !this.validate();
                this.getEditor('date').setValue(
                    this.getLandingDateTimeByDay( this.getValue('date') )
                );
            } else {
                condition = thiz.pickupInput.val() && thiz.dropoffInput.val() && !this.validate();
            }

            if (condition) {
                thiz.hideAndEmptyMessages();
                thiz.getPrice();
            }
        });

        // Для аэропортового виджета
        if (mg_echo_conf.widgetType === mg_echo_global.widgetTypes.airport) {
            thiz.airports = [];
            thiz.airportErrorWrapper.hide();
            thiz.rerenderAirportsTemplate();
            thiz.airportSearchBtn.on('click', function () {
                thiz.getFlightDetails();
            });
            thiz.flightNumberInput.on('input', function () {
                thiz.airportSearchBtn.show();
                thiz.tripsWrapper.hide();
                thiz.disableDatePicker();
                thiz.airportMessage.hide();
            });
        }
    },

    onNext:  function (e) {
        //Once the user is done with the form, call form.commit() to apply the updated values to the model. If there are validation errors they will be returned
        var errors = this.commit();
        //validate on blur: http://jsfiddle.net/evilcelery/FqLR2/
        if (!errors || errors.length === 0) {
            mg_echo_global.formStep2.updateView();
            mg_echo_global.showBookingStep2Wrapper();
            if(mg_echo_conf.widgetType === mg_echo_global.widgetTypes.airport) return;
            mg_echo_global.formStep2.loadPriceAndCapacity();
        } else {
            $(mg_echo_global).trigger('event.stops.first_screen.no_results');
        }
    },

    clarifyAddress: function (record) {
        var thiz = this;
        thiz.$el.mask(translate('loading'));
        mg_echo_global.ajax({
                url: "/addresses/clarifyAddress",
                data: {'addressDetails' : record.data().autocomplete.selection.attributes.address},
                type: 'POST',
                dataType: 'json'
            }, false
        ).done(function (data, textStatus, jqXHR) {
            if (data.success) {
                record[0].value = data.rows[0].address;
                record.data().autocomplete.selection.attributes = data.rows[0];
                thiz.$el.unmask();

                var condition;

                if (mg_echo_conf.widgetType === mg_echo_global.widgetTypes.airport) {
                    condition = thiz.pickupInput.val() && thiz.dropoffInput.val() && thiz.dateWrapperField.data().date && !this.validate();
                    this.getEditor('date').setValue(
                        this.getLandingDateTimeByDay(this.getValue('date'))
                    );
                } else {
                    condition = thiz.pickupInput.val() && thiz.dropoffInput.val();
                }

                if (condition) {
                    thiz.hideAndEmptyMessages();
                    thiz.getPrice();
                }
            } else {
                thiz.exceptionHandler.onResponse(jqXHR);
                thiz.$el.unmask();
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            thiz.$el.unmask();
        });
    },

    getPrice: function() {
        var thiz = this;

        var value = this.getValue();
        var defaultValues = mg_echo_global.getBookingConfig('defaultValues');

        value.dateType = 'ASAP';
        value.date = mg_echo_global.getUTCDateFormatted(value.date);
        value.serviceRecord = defaultValues.service;
        value.contactRecord = {};
        value.creditCard = {};
        value.additionalInstructions = "";
        var bookingModel = mg_echo_global.getBookingModel()
        if (!bookingModel.get('idGeneratedByClient')) {
            bookingModel.set('idGeneratedByClient', (new Date()).getTime());
        }
        value.idGeneratedByClient = bookingModel.get('idGeneratedByClient');

        thiz.$el.mask(translate('loading'));

        mg_echo_global.ajax({
                url: "/booking/getPrice?notCheckResponseTime=true",
                data: JSON.stringify(value), //do not update model as we are not to necessary fill all the mandatory form fields
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            }, mg_echo_global.formStep2.getForm().getSecuredMode()
        ).done(function (data, textStatus, jqXHR) {
                if (
                    data.errors.length == 0
                    && data.rows[0].pricingInfo
                    && data.rows[0].pricingInfo.details[0]
                    && data.rows[0].pricingInfo.details[0].price
                ) {
                    var totalPrice = mg_echo_global.toFixed(data.rows[0].pricingInfo.details[0].price, 2);
                    var messageBookBtn = ' ' + translate('from_price_button') + ' ' + mg_echo_global.formatCurrency(totalPrice);

                    if(mg_echo_conf.widgetType === mg_echo_global.widgetTypes.airport) {
                        messageBookBtn += ' ' + translate('per_person');
                    }

                    thiz.$el.find('.button-preprice').html(messageBookBtn);
                }
                thiz.$el.unmask();
            }).fail(function (jqXHR, textStatus, errorThrown) {
                thiz.exceptionHandler.onResponse(jqXHR, mg_echo_global.getResponseHandlerKey("price"));
                thiz.$el.unmask();
            });
    },

    getFlightDetails: function() {
        var thiz = this;

        thiz.fields.flightNumber.setValue(thiz.fields.flightNumber.$el.find('input').val());
        thiz.errorMessage.empty().hide();
        var errorFlightNumber = this.fields.flightNumber.validate();

        if (errorFlightNumber) {
            return false;
        }

        thiz.$el.mask(translate('loading'));
        mg_echo_global.ajax({
                url: "/booking/flightDetails/" + thiz.flightNumberInput.val(),
                type: 'GET',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            }, false
        ).done(function (data, textStatus, jqXHR) {
            thiz.$el.unmask();
            //thiz.exceptionHandler.onResponse(jqXHR);
            if(data.success) {
                thiz.airports = data.rows[0].trips;

                // thiz.airports[1] = _.clone(data.rows[0].trips[0]);
                // thiz.airports[1].meetingPlace = 'Barcelona Airlane';
                // data.rows[0].trips[0].type = 'DEPARTURE';

                var airportObject = thiz.airports.length === 1 ? new Magenta.Echo.InlineBooking.Models.Airport(thiz.airports[0]) : null;

                if (thiz.airports.length === 0) {

                    if(mg_echo_conf.widgetType === mg_echo_global.widgetTypes.airport) {
                        thiz.airportErrorMessage.html(translate('does_not_operate_at_airport'));
                    } else {
                        thiz.airportErrorMessage.html(translate('web.unavailable_zone_plural'));
                    }

                    thiz.airportErrorWrapper.show();
                } else {
                    thiz.airportErrorWrapper.hide();
                    thiz.airportSearchBtn.hide();
                }

                thiz.onSelectAirport(airportObject);
                thiz.rerenderAirportsTemplate();
            } else {
                if (data.errors[0] && data.errors[0].type === 'FLIGHT_CHECKER_DISABLED') {
                    thiz.airportErrorMessage.html(translate('flight_cannot_be_validated'));
                } else if (mg_echo_conf.widgetType === mg_echo_global.widgetTypes.airport
                    && data.errors[0]
                    && data.errors[0].type === 'FC_FLIGHT_AIRPORTS_DOES_MOT_MATCH'
                ) {
                    thiz.airportErrorMessage.html(translate('web.unavailable_zone_plural'));
                } else if (data.errors[0] && data.errors[0].message) {
                    thiz.airportErrorMessage.html(data.errors[0].message);
                } else {
                    thiz.airportErrorMessage.html(translate('flight_is_not_found'));
                }
                thiz.airportErrorWrapper.show();
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            thiz.exceptionHandler.onResponse(jqXHR, mg_echo_global.getResponseHandlerKey("price"));
            thiz.$el.unmask();
        });

    },

    rerenderAirportsTemplate: function() {
        var thiz = this;

        if (thiz.airports.length === 0) {
            thiz.tripsWrapper.hide();
            thiz.disableDatePicker();
            return false;
        }

        thiz.tripsWrapper.show();
        thiz.manualFillPickup.hide();
        thiz.manualFillDropoff.hide();
        thiz.pickupAutoFillAirport.hide();
        thiz.dropoffAutoFillAirport.hide();
        thiz.airportPickupList.html('');
        thiz.airportDropoffList.html('');

        var airportsArrival = _.filter(thiz.airports, {type: "ARRIVAL"});
        var airportsDeparture = _.filter(thiz.airports, {type: "DEPARTURE"});

        if (!thiz.airportSelected) {
            if (airportsArrival.length > 0) {
                thiz.pickupAutoFillAirport.show();
                $.each(airportsArrival, function (key, airportItem) {
                    thiz.airportPickupList.append(thiz.airportItemInit(airportItem));
                });
            }
            if (airportsDeparture.length > 0) {
                thiz.dropoffAutoFillAirport.show();
                $.each(airportsDeparture, function (key, airportItem) {
                    thiz.airportDropoffList.append(thiz.airportItemInit(airportItem));
                });
            }
            thiz.disableDatePicker();
        } else {
            if (thiz.airportSelected.get('type') === 'ARRIVAL') {
                thiz.airportPickupList.append(thiz.airportSelectedItemInit(thiz.airportSelected));
                thiz.pickupAutoFillAirport.show();
                thiz.manualFillDropoff.show();
            } else if (thiz.airportSelected.get('type') === 'DEPARTURE') {
                thiz.airportDropoffList.append(thiz.airportSelectedItemInit(thiz.airportSelected));
                thiz.dropoffAutoFillAirport.show();
                thiz.manualFillPickup.show();
            }
            thiz.dateWrapper.show();
        }
    },

    airportItemInit: function(airportItem) {
        var thiz = this;
        var airportObject = new Magenta.Echo.InlineBooking.Models.Airport(airportItem);
        airportObject.el = $(airportObject.renderItem());

        airportObject.el.on('click', function () {
            thiz.onSelectAirport(airportObject);
            thiz.rerenderAirportsTemplate();
        });

        return airportObject.el;
    },

    airportSelectedItemInit: function(airportObject) {
        var thiz = this;

        airportObject.el = $(airportObject.renderSelectedItem(thiz.airports.length > 1));
        airportObject.el.on('click', '.mg-echo-edit-icon', function () {
            thiz.onSelectAirport(null);
            thiz.rerenderAirportsTemplate();
        });

        return airportObject.el;
    },

    onSelectAirport: function(airportObject) {
        var thiz = this;

        thiz.airportSelected = airportObject;
        thiz.fields.pickup.setValue(null);
        thiz.fields.dropoff.setValue(null);


        if (airportObject) {
            thiz.airportMessage.show();
            thiz.airportMessage.text();

            if (airportObject.get('type') === 'ARRIVAL') {
                thiz.fields.pickup.setValue(new Magenta.Echo.InlineBooking.Models.Address(airportObject.get('meetingPlace')));
                mg_echo_global.formStep2.getEditor('pickup').$el.find('input').attr('disabled', true);
                mg_echo_global.formStep2.getEditor('dropoff').$el.find('input').attr('disabled', false);
                thiz.airportMessage.text(translate('airport_arrival_message'));
            } else if (airportObject.get('type') === 'DEPARTURE') {
                thiz.fields.dropoff.setValue(new Magenta.Echo.InlineBooking.Models.Address(airportObject.get('meetingPlace')));
                mg_echo_global.formStep2.getEditor('dropoff').$el.find('input').attr('disabled', true);
                mg_echo_global.formStep2.getEditor('pickup').$el.find('input').attr('disabled', false);
                thiz.airportMessage.text(translate('airport_departure_message'));
            }

            var availableDays = airportObject.get('dates');
            // Если пришёл массив с доступными датами, то блокируем другие
            if (availableDays && availableDays.length > 0) {

                var availableDatesMoments = [];

                thiz.availableDates = availableDays.map(function (val) {
                    var momentDate = moment.utc(val.date, 'DD/MM/YYYY HH:mm');
                    availableDatesMoments.push(momentDate.clone().startOf('day'));

                    return {
                        date: momentDate,
                        delay: val.delay
                    }
                });

                var datePickerLimits = {
                    enabledDates: availableDatesMoments,
                    maxDate: availableDatesMoments[availableDatesMoments.length - 1].endOf('day')
                };

                thiz.dateWrapperField.data('DateTimePicker').options(datePickerLimits);
                mg_echo_global.getFlightWindow().dateEditor.$el.data('DateTimePicker').options(datePickerLimits);
            }
        }
    },

    disableDatePicker: function() {
        this.dateWrapper.hide();
        mg_echo_global.getBookingModel().set('date', null);
    },

    loadGooglePlacesLib: function() {
        var script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB3Oxdfo2x-LP86NkSEhLgJ805rJgkLfdo&libraries=places&callback=initGooglePlacesSearch';
        script.type = 'text/javascript';
        document.getElementsByTagName('head')[0].appendChild(script);
    },

    getLandingDateTimeByDay: function (selectedDay, withDelay) {
        if(!selectedDay) return;

        var selectedAvailableDate = this.getAvailableDateByDay(selectedDay);
        var resultDay = selectedDay.clone();

        resultDay.hour(selectedAvailableDate.date.hour());
        resultDay.minute(selectedAvailableDate.date.minute());

        if(withDelay) {
            resultDay.add(selectedAvailableDate.delay, 'minutes');
        }

        return resultDay;
    },

    getAvailableDateByDay: function (selectedDay) {
       return this.availableDates.find(function (availableDate) {
           var utcSelectedDay = selectedDay.clone().add(selectedDay.utcOffset(),'minutes').utc();
           return availableDate.date.isSame(utcSelectedDay, 'day');
       });
    }

});

window.initGooglePlacesSearch = function() {
    mg_echo_global.googlePlaces = {
        defaultBounds: new google.maps.LatLngBounds(
            new google.maps.LatLng(40.559358, -3.942189),
            new google.maps.LatLng(40.264914, -3.454338)
        ),
        autocompleteService: new google.maps.places.AutocompleteService(),
        placesService: new google.maps.places.PlacesService(document.createElement('div'))
    };
}