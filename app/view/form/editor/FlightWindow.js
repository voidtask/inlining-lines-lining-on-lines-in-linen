/**
 * Created by kalibrov on 15.08.2016.
 */
Backbone.Form.editors.FlightWindow = Backbone.Form.editors.Text.extend({

    flightWindowMessage: null,

    initialize: function(options) {
        var self = this;

        this.flightWindowWrapper = $('#mg-echo-booking-form-step-2 #flight-window-wrapper');
        this.dateWrapperEl = $('#mg-echo-booking-form-step-2 .date-wrapper');
        this.flightWindowMessages = this.flightWindowWrapper.find('.flight-checker-messages');

        this.inputs = {
            'flightNumber' : this.flightWindowWrapper.find('input[name="flightNumber"]'),
            'scheduledLandingDate' : this.flightWindowWrapper.find('input[name="scheduledLandingDate"]')
        };

        this.dateEditor = new Backbone.Form.editors.DateTime({
            el: '#mg-echo-booking-form-step-2 .adjustPickupTimeBlock-landingDate #flight-window-date',
            schema : {
                config: {
                    format: mg_echo_global.getDateFormat(),
                    viewMode: 'days',
                    ignoreReadonly: true,
                    minDate: moment().startOf('day'),
                    useCurrent: false,
                    allowInputToggle: true,
                    collapse: false
                }
            }
        });

        this.dateEditor.$el.on('dp.select', function(event) {
            var landingDateWithTime = mg_echo_global.formStep1.getForm()
                .getLandingDateTimeByDay(self.dateEditor.getValue());

            mg_echo_global.formStep2.getEditor('date').setValue(
                landingDateWithTime.clone()
            );
            self.requestFlightWindow(landingDateWithTime);
        });

    },

    // Показываем виджет
    // ======================================
    showFlightWindow: function(flightNumber) {
        this.flightWindowWrapper.show();
        this.dateWrapperEl.hide();
        this.setValue();
    },

    setValue: function() {
        this.inputs.flightNumber.val(mg_echo_global.getBookingModel().get('flightNumber'));
        this.inputs.scheduledLandingDate.val(
            moment(mg_echo_global.getBookingModel().get('date')).format(mg_echo_global.getDateFormat())
        );
    },

    requestFlightWindow: function (flightDate) {
        if(!flightDate) return;

        var self = this;
        var tripType = mg_echo_global.formStep1.getForm().airportSelected.get('type'),
            airportId = null,
            addressLatitude = null,
            addressLongitude = null;

        if (tripType === 'ARRIVAL') {
            airportId = mg_echo_global.formStep2.getValue().pickup.get('meetingPlaceId');
            addressLatitude = mg_echo_global.formStep2.getValue().dropoff.get('latitude');
            addressLongitude = mg_echo_global.formStep2.getValue().dropoff.get('longitude');
        } else {
            airportId = mg_echo_global.formStep2.getValue().dropoff.get('meetingPlaceId');
            addressLatitude = mg_echo_global.formStep2.getValue().pickup.get('latitude');
            addressLongitude = mg_echo_global.formStep2.getValue().pickup.get('longitude');
        }

        self.flightWindowWrapper.mask(translate('loading'));

        mg_echo_global.ajax({
                url: "/booking/flightWindow",
                type: 'POST',
                data: JSON.stringify({
                    airportId: airportId,
                    addressLatitude: addressLatitude,
                    addressLongitude: addressLongitude,
                    date: flightDate.format(mg_echo_global.getDatetimeFormat()),
                    tripType: tripType
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            }, false
        ).done(function (data, textStatus, jqXHR) {
            self.flightWindowWrapper.unmask();
            if (data.success) {
                if (data.rows[0]['pickupFrom'] && data.rows[0]['pickupTo']) {

                    var pickupFrom = moment(data.rows[0]['pickupFrom'], mg_echo_global.getDatetimeFormat());
                    var pickupTo = moment(data.rows[0]['pickupTo'], mg_echo_global.getDatetimeFormat());
                    var resultEstimatedPickUpTime = '';

                    mg_echo_global.formStep2.getEditor('date').setValue(pickupFrom, mg_echo_global.getDateFormat());

                    // Если один и тот же день
                    if (pickupFrom.format(mg_echo_global.getDateFormat()) === pickupTo.format(mg_echo_global.getDateFormat())) {
                        resultEstimatedPickUpTime = pickupFrom
                            .format(mg_echo_global.getDatetimeFormat()) + ' – ' + pickupTo.format('HH:mm');
                    } else {
                        resultEstimatedPickUpTime = pickupFrom
                            .format(mg_echo_global.getDatetimeFormat()) + ' – ' + pickupTo.format(mg_echo_global.getDatetimeFormat());
                    }

                    var flightNumber = mg_echo_global.getBookingModel().get('flightNumber');
                    var availableDate = mg_echo_global.formStep1
                        .getForm()
                        .getAvailableDateByDay(flightDate);

                    self.addFlightDetailsMessage(
                        flightDate,
                        resultEstimatedPickUpTime,
                        tripType,
                        availableDate,
                        flightNumber
                    );

                    self.addFlightDetailsToPickUp(
                        availableDate,
                        flightNumber,
                        tripType
                    );

                    self.flightWindowMessage = resultEstimatedPickUpTime;

                    // Set lateAllowance
                    var lateAllowance = parseInt(moment.duration(pickupTo.diff(pickupFrom)).asMinutes(), 10);
                    if (lateAllowance <= 0) {
                        lateAllowance = null;
                    }
                    mg_echo_global.formStep2.getEditor('lateAllowance').setValue(lateAllowance);

                    mg_echo_global.formStep2.loadPriceAndCapacity();
                }
            }
        });
    },

    addFlightDetailsMessage: function(
        flightDate,
        resultEstimatedPickUpTime,
        tripType,
        availableDate,
        flightNumber
    ) {

        var successMessage;
        var scheduledLandingDate = availableDate.date;

        if(tripType === 'ARRIVAL') {
            var flightDelay = availableDate.delay;
            var scheduledLandingDateDelay = availableDate.date.clone();

            if(flightDelay !== 0) {
                scheduledLandingDate.add(flightDelay, 'minutes');
            }

            successMessage = mg_echo_global.getFlightChecker()
                .getSuccessMessage(
                    flightNumber,
                    scheduledLandingDate,
                    scheduledLandingDateDelay,
                    -flightDelay
                );
        } else {
            successMessage = StringUtils.format(
                translate('successMessageFcDeparture'),
                flightNumber,
                scheduledLandingDate.format(translate('date_format')),
                scheduledLandingDate.format('HH:mm')
            );
        }

        successMessage +=
            '<p class="pick-up-time">'
            + translate('your_estimated_pick_up_time_is')
            + '<br>'
            + '<span class="value">' + resultEstimatedPickUpTime + '</span>'
            + '<br>'
            + translate('accurate_estimation_text')
            + '</p>';

        this.flightWindowMessages.html(successMessage);
    },

    addFlightDetailsToPickUp: function (availableDate, flightNumber, tripType) {
        if(tripType === 'ARRIVAL') {
            var pickupModel = mg_echo_global.formStep2.getEditor('pickup').getValue().clone();

            pickupModel
                .set('scheduledLandingDate',
                    availableDate.date.format(mg_echo_global.getDatetimeFormat())
                )
                .set('flightNumber', flightNumber)
                .set('holdOffTime',
                    mg_echo_global.getBookingConfig('defaultHoldOffTimeMinutes')
                );

            mg_echo_global.formStep2
                .getEditor('pickup')
                .setValue(pickupModel);

        } else {
            var dropoffModel = mg_echo_global.formStep2.getEditor('dropoff').getValue().clone();

            var notesForDriver = 'Flight ' + flightNumber + ' '
                + availableDate.date.clone().format('DD MMMM HH:mm');

            dropoffModel.set('notes', notesForDriver);

            mg_echo_global.formStep2
                .getEditor('dropoff')
                .setValue(dropoffModel);
        }


    }
});