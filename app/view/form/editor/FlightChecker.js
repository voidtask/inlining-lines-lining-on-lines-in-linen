/**
 * Created by kalibrov on 15.08.2016.
 */
Backbone.Form.editors.FlightChecker = Backbone.Form.editors.Text.extend({

    validators: [
        function(value, formValues, editor) {
            editor.hideErrors();
            editor.isError = false;
            if (editor.showState === true && editor.checkEl.prop('checked')) {
                if (Object.keys(editor.errors).length > 0) {
                    Object.keys(editor.errors).map(function (value) {
                        if (editor.inputs[value] != null) {
                            editor.inputs[value].closest('.flight-checker-inputWrapper').addClass('mg-echo-error');
                        }
                    });
                    editor.isError = true;
                    mg_echo_global.formStep2.getForm().showError(Backbone.Form.validators.errMessages.required, 'heap');
                    return false;
                } else {
                    return true;
                }
            }
            return true;
        }
    ],

    initialize: function(options) {
        _.bindAll(this, 'hideErrors', 'setStartState', 'validateAirportFlightDetails', 'onChangeAdjustPickupTime', 'changePickUp', 'changeDateAsap', 'isSelectedUpHoldOffTime', 'getHoldOffTimeOptions');

        var self = this;

        this.timeMode = 'auto';

        this.errors = [];
        this.errors['flightNumber'] = true;
        this.isError = false;

        this.showState = false;

        this.timerValid = null;
        this.scheduledLandingDate = null;
        this.flightChecker = mg_echo_global.getFlightChecker();


        this.flightCheckerWrapper = $('#mg-echo-booking-form-step-2 #flight-checker-wrapper');
        this.dateWrapperEl = $('#mg-echo-booking-form-step-2 .date-wrapper');

        this.checkEl = this.flightCheckerWrapper.find('#adjust-pickup-time');
        this.adjustPickupTimeBlock = this.flightCheckerWrapper.find('.adjustPickupTimeBlock');
        this.notAdjustPickupTimeBlock = this.flightCheckerWrapper.find('.notAdjustPickupTimeBlock');
        this.flightCheckerMessages = this.flightCheckerWrapper.find('.flight-checker-messages');
        this.getHoldOffTimeOptions();
        this.holdOffTimeWrapper = this.flightCheckerWrapper.find('.adjustPickupTimeBlock-holdOff');
        this.onoffswitchWrapper = this.flightCheckerWrapper.find('.mg-onoffswitch-wrapper');

        this.inputs = {
            'flightNumber' : this.adjustPickupTimeBlock.find('input[name="flightNumber"]'),
            'scheduledLandingDate' : this.adjustPickupTimeBlock.find('input[name="scheduledLandingDate"]'),
            'holdOffTime' : this.adjustPickupTimeBlock.find('select[name="holdOffTime"]')
        }

        this.checkEl.on('change', function(){
            self.onChangeAdjustPickupTime();
        });

        this.inputs.flightNumber.on('keyup', {timeout: true, checkPrevVal: true}, this.validateAirportFlightDetails);
        this.inputs.holdOffTime.on('change', function (event) {
            event.target.defaultValue = event.target.value;
        });
        this.inputs.holdOffTime.on('change', this.isSelectedUpHoldOffTime);

        this.notAdjustDateEditor = new Backbone.Form.editors.DateTime({
            el: '#flight-checker-wrapper .notAdjustPickupTimeBlock .flight-checker-inputWrapper',
            schema : {
                config: {
                    format: mg_echo_global.getDatetimeFormat(),
                    showAsap: true,
                    showSetButton: true,
                    ignoreReadonly: true,
                    minDate: moment.utc(),
                    useCurrent: false,
                    stepping: 5,
                    allowInputToggle: true
                }
            }
        });
        this.notAdjustDateEditor.$el.on('dp.asap', function(){
            mg_echo_global.formStep2.getForm().onClickAsap();
            self.trigger('changeDateAsap', self);
        });
        this.notAdjustDateEditor.$el.on('dp.ok', function(event) {
            mg_echo_global.manualChangeDate = true;
            mg_echo_global.formStep2.getEditor('date').setValue(event.date);
            mg_echo_global.formStep2.getEditor('dateType').setValue(mg_echo_global.getDateType('pickup'));
            self.trigger('changeDatePickup', self);
        });


        this.adjustDateEditor = new Backbone.Form.editors.DateTime({
            el: '#flight-checker-wrapper .adjustPickupTimeBlock-landingDate .flight-checker-inputWrapper',
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
        this.adjustDateEditor.$el.on('dp.select dp.asap dp.ok', function(event) {
            if (event.namespace == 'select' && self.timeMode == 'auto') {
                self.validateAirportFlightDetails();
            } else if ((event.namespace == 'asap' || event.namespace == 'ok') && self.timeMode == 'manual') {
                self.validateAirportFlightDetails();
            }
        });
        this.adjustDateEditor.$el.on('dp.show', function(event) {
            $(event.target).find('.bootstrap-datetimepicker-widget .day.disabled').attr('title', translate('no_matching_flights'));
        });

        this.flightCheckerWrapper.find('.flight-checker-inputWrapper .trigger').on('click', function(){
            $(this).closest('.flight-checker-inputWrapper').find('input').focus();
        });

        this.setStartState();

    },

    hideErrors: function() {
        var self = this;
        Object.keys(this.inputs).map(function (value) {
            self.inputs[value].closest('.flight-checker-inputWrapper').removeClass('mg-echo-error');
        });
    },

    convertIntMinutesToDate: function(minutes){
        var fullPart = Math.floor(minutes/60),
            decimalPart = minutes - fullPart*60;
        if (fullPart === 0) return minutes+' min';
        if (decimalPart === 0) return fullPart === 1 ? fullPart + ' hour' : fullPart + ' hours';
        return fullPart === 1 ? fullPart + ' h ' + decimalPart + ' m'
            : fullPart + ' h ' + decimalPart + ' m';
    },

    // Устанавливам начальное состояние
    // ======================================
    setStartState: function() {
        this.defaultMessage = translate('flight_defaultMessage');

        this.notAdjustPickupTimeBlock.hide();
        this.notAdjustDateEditor.setValue(mg_echo_global.getMinDate());
        this.adjustDateEditor.setValue(mg_echo_global.getMinDate());
        this.inputs.flightNumber.val(this.flightNumberStareState);
        this.inputs.scheduledLandingDate.val(moment().format('DD/MM/YYYY'));

        if (
            mg_echo_global.getBookingConfig('defaultHoldOffTimeMinutes') !== null && mg_echo_global.getBookingConfig('defaultHoldOffTimeMinutes') !== undefined
        ) {
            this.inputs.holdOffTime.val(
                this.convertIntMinutesToDate(mg_echo_global.getBookingConfig('defaultHoldOffTimeMinutes'))
            );
        }

        this.flightCheckerMessages.html(this.defaultMessage);
        this.autoTimeMode();
        this.hideErrors();
    },

    // Изменение положение чекбокса "AdjustPickupTime"
    // ======================================
    onChangeAdjustPickupTime: function(checked, isAsap) {
        if (checked == null) {
            var checked = this.checkEl.prop('checked');
        }

        this.checkEl.prop('checked', checked);

        if (checked) {
            this.showFlightDetails();
        } else {
            this.hideFlightDetails(isAsap?true:false);
        }
    },

    // Показываем флайчекер
    // ======================================
    showFlightChecker: function(flightNumber) {
        this.flightNumberStareState = flightNumber ? flightNumber : '';
        this.showState = true;
        this.flightCheckerWrapper.show();
        this.dateWrapperEl.hide();
        this.onChangeAdjustPickupTime(true);
    },

    // Скрываем флайчекер
    // ======================================
    hideFlightChecker: function() {
        mg_echo_global.manualChangeDate = false;

        this.showState = false;
        this.flightCheckerWrapper.hide();
        this.dateWrapperEl.show();

        mg_echo_global.formStep2.getEditor('date').setValue(moment(), false);

        if(mg_echo_global.getBookingConfig('setAsapAsDefault')) {
            mg_echo_global.formStep2.getEditor('date').$el.trigger('dp.asap');
        } else {
            mg_echo_global.formStep2.getEditor('dateType').setValue(mg_echo_global.getDateType('pickup'));
        }
    },

    // Показываем панель регулирования времени прилёта
    // ======================================
    showFlightDetails: function() {
        mg_echo_global.manualChangeDate = false;

        this.setStartState();

        this.adjustPickupTimeBlock.show();
        this.notAdjustPickupTimeBlock.hide();
        this.flightNumberPrevVal = null;
        this.autoTimeMode();
        this.validateAirportFlightDetails();
        mg_echo_global.formStep2.clearPriceAndHidePriceSection();

    },

    // Скрываем панель регулирования времени прилёта
    // ======================================
    hideFlightDetails: function(isAsap) {
        mg_echo_global.manualChangeDate = false;

        var isAsap = isAsap ? true : false;

        this.adjustPickupTimeBlock.hide();
        this.notAdjustPickupTimeBlock.show();

        mg_echo_global.formStep2.getEditor('date').setValue(moment(), false);

        if(isAsap || mg_echo_global.getBookingConfig('setAsapAsDefault')) {
            this.notAdjustDateEditor.$el.trigger('dp.asap');
        } else {
            mg_echo_global.formStep2.getEditor('dateType').setValue(mg_echo_global.getDateType('pickup'));
        }

        this.trigger('hideFlightDetails');
    },

    // Переключаем в режим автоматического определения времени прилёта
    // ======================================
    autoTimeMode: function () {
        var self = this;
        if (self.timeMode != 'auto') {
            self.timeMode = 'auto';
            self.adjustDateEditor.$el.data('DateTimePicker').options({
                showSetButton: false,
                format: mg_echo_global.getDateFormat(),
                collapse: false
            });
            $('.adjustPickupTimeBlock-landingDate .flight-checker-label').html(translate('landing<br>date'));
        }
    },

    // Переключаем в режим ручного ввода времени прилёта
    // ======================================
    manuallyTimeMode: function () {
        var self = this;
        if (self.timeMode != 'manual') {
            self.adjustDateEditor.$el.data('DateTimePicker').options({
                showSetButton: true,
                format: mg_echo_global.getDatetimeFormat(),
                stepping: 5,
                collapse: true
            });
            self.adjustDateEditor.setValue(mg_echo_global.getMinDate());
            $('.adjustPickupTimeBlock-landingDate .flight-checker-label').html(translate('landing<br>date_time'));
            self.timeMode = 'manual';
            self.defaultMessage = '' +
                '<p>' + translate('flight_cannot_validated_full') + '</p>' +
                '<p>' + self.defaultMessage + '</p>';
            self.flightCheckerMessages.html(self.defaultMessage);
        }
    },

    // Получаем данные по флайчекеру
    // ======================================
    getValue: function() {

        var value = {
            'flightNumber': null,
            'scheduledLandingDate': null,
            'holdOffTime': 0
        };

        if (this.showState === true && this.checkEl.prop('checked')) {
            var holdOffTimeMin = this.inputs.holdOffTime.val();
            if (holdOffTimeMin !== null) {
                var hours = holdOffTimeMin.match(/\d(?=\sh)/g);
                var minutes = holdOffTimeMin.match(/\d{1,2}(?=\sm)/g);
                holdOffTimeMin = hours * 60 + minutes * 1;
            } else {
                holdOffTimeMin = -1;
            }
            value = {
                'flightNumber': $.trim(this.inputs.flightNumber.val()),
                'scheduledLandingDate': this.scheduledLandingDate ?
                                            this.scheduledLandingDate :
                                            (
                                                this.timeMode == 'auto' ?
                                                    this.inputs.scheduledLandingDate.val() + ' 00:00' :
                                                    this.inputs.scheduledLandingDate.val()
                                            ),
                'holdOffTime': holdOffTimeMin
            };
        }
        return value;
    },

    // Отправка запроса на валидацию
    // ======================================
    validateAirportFlightDetails: function(attr) {
        
        var self = this;

        self.errors['flightNumber'] = true;
        this.hideErrors();

        var preValidateFunction = function() {
            self.errors = [];

            // Проверяем изменился ли номер рейса
            if (attr && attr.data && attr.data.checkPrevVal && attr.data.checkPrevVal === true && self.flightNumberPrevVal != null && self.getValue().flightNumber === self.flightNumberPrevVal) {
                self.errors['flightNumber'] = true;
                return false;
            } else {
                if (self.timeMode == 'auto') {
                    // Сбрасываем доступность дат
                    self.adjustDateEditor.$el.data('DateTimePicker').options({
                        disabledDates: [],
                        maxDate: false
                    });
                }
            }
            self.flightNumberPrevVal = self.getValue().flightNumber;

            // Проверяем заполненность необходимых полей
            if (self.getValue().flightNumber === "" || self.getValue().holdOffTime === "") {
                self.flightCheckerMessages.html(self.defaultMessage);
                if (self.getValue().flightNumber === "") {
                    self.errors['flightNumber'] = true;
                } else {
                    self.errors['holdOffTime'] = true;
                }
            }

            if (Object.keys(self.errors).length > 0) {
                mg_echo_global.formStep2.clearPriceAndHidePriceSection();
                return false;
            } else {
                self.errors['flightNumber'] = true;
                return true;
            }
        };


        var validateFunction = function() {

            if (!preValidateFunction()) return false;

            var airportStopRecord = mg_echo_global.formStep2.getValue().pickup;
            self.scheduledLandingDate = null;
            mg_echo_global.manualChangeDate = true;

            if (!mg_echo_global.formStep2.getValue().date) {
                return false;
            }

            // Делаем запрос на серверную валидацию
            self.flightCheckerWrapper.mask(translate('loading'));
            mg_echo_global.ajax({
                    url: "/booking/validateAirportFlightDetails",
                    data: mg_echo_global.formStep2.getJson(),
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json'
                }, true
            ).done(function (data, textStatus, jqXHR) {
                self.flightCheckerWrapper.unmask();
                var responseStopRecord = data.rows[0];
                self.onValidateAirportFlightDetailsResponse(airportStopRecord, responseStopRecord);
            }).fail(function (jqXHR, textStatus, errorThrown) {

            });
        };

        // Если валидация по таймауту
        if (attr && attr.data && attr.data.timeout != null) {
            if (this.timerValid) {
                clearTimeout(this.timerValid);
            }
            self.errors['flightNumber'] = true;
            this.timerValid = setTimeout(validateFunction, 1000);
        } else {
            if (!preValidateFunction()) return false;
            validateFunction();
        }

    },

    // Обработка без серверной валидации (при недоступном флайчекере)
    // ======================================
    processingWithoutServerValidation: function (airportStopRecord) {
        var self = this;
        var scheduledLandingDate = null;
        var pickUpDateTime = null;
        var holdOffTime = this.inputs.holdOffTime.val();
        var hours = holdOffTime.match(/\d(?=\sh)/g);
        var minutes = holdOffTime.match(/\d{1,2}(?=\sm)/g);
        hours === null ? hours = "0" : hours = hours.join();
        minutes === null ? minutes = "0" : minutes = minutes.join();

        scheduledLandingDate = moment(airportStopRecord.get('scheduledLandingDate'), mg_echo_global.getDatetimeFormat());
        pickUpDateTime = scheduledLandingDate.clone();
        pickUpDateTime.add(hours, 'hours').add(minutes, 'minutes');
        self.afterSuccessfulValidation(scheduledLandingDate, pickUpDateTime);

        self.flightCheckerMessages.html('' +
            '<p>' + translate('flight_cannot_validated') + '</p>' +
            '<p class="pick-up-time">' + translate('current_pick_up_time_is') + '<br><span class="value">' + pickUpDateTime.format(mg_echo_global.getDatetimeFormat()) + '</span></p>'
        );
    },

    // Обработка ответа от валидатора
    // ======================================
    onValidateAirportFlightDetailsResponse: function(airportStopRecord, responseStopRecord) {
        var self = this;
        var flightCheckerMessagesContent = $('<div></div>');
        var scheduledLandingDate = null;
        var flightDelay = null;
        var pickUpDateTime = null;
        var holdOffTime = this.inputs.holdOffTime.val();
        var hours = holdOffTime.match(/\d(?=\sh)/g);
        var minutes = holdOffTime.match(/\d{1,2}(?=\sm)/g);
        hours === null ? hours = "0" : hours = hours.join();
        minutes === null ? minutes = "0" : minutes = minutes.join();
        if (responseStopRecord.scheduledLandingDate != null) {
            scheduledLandingDate = moment(responseStopRecord.scheduledLandingDate, mg_echo_global.getDatetimeFormat());
        } else {
            scheduledLandingDate = moment(airportStopRecord.get('scheduledLandingDate'), mg_echo_global.getDatetimeFormat());
        }
        flightDelay = responseStopRecord.delay;
        mg_echo_global.getBookingModel().set('flightDelay', flightDelay);

        pickUpDateTime = scheduledLandingDate.clone();
        pickUpDateTime.add(hours, 'hours').add(minutes, 'minutes');


        // Если пришёл массив с доступными датами, то блокируем другие
        if (responseStopRecord.validDates != null && responseStopRecord.validDates.length > 0) {
            this.adjustDateEditor.$el.data('DateTimePicker').options({
                enabledDates: responseStopRecord.validDates.map(function(val) { return moment.utc(val) } ),
                maxDate: moment.utc(responseStopRecord.validDates[responseStopRecord.validDates.length - 1])
            });
        }

        if (responseStopRecord.errorType) {
            self.errorType = responseStopRecord.errorType;
        } else {
            self.errorType = null;
        }

        if (responseStopRecord.errorType === "WRONG_FLIGHT_DETAILS") {
            flightCheckerMessagesContent.html('<p>' + responseStopRecord.error + '</p>');
            self.errors['flightNumber'] = true;

            $(mg_echo_global).trigger('event.flight_checker.incorrect_flight_number');

        } else if (
                (
                    responseStopRecord.errorType == "FLIGHT_WRONG_TERMINAL" ||
                    responseStopRecord.errorType == "FLIGHT_WRONG_AIRPORT" ||
                    responseStopRecord.errorType == "FLIGHT_DIVERTED"
                ) && airportStopRecord.get('meetingPlaceId') !== responseStopRecord.meetingPlaceId) {
            flightCheckerMessagesContent.html('<p>' + responseStopRecord.error + '</p>');

            $('<div class="flight-checker-btn">' + translate('change_pick_up') + '</div>')
                .click(function() {
                    self.changePickUp(responseStopRecord);
                })
                .appendTo(flightCheckerMessagesContent);

            self.errors = [];
            self.errors['pickup'] = true;

            if (responseStopRecord.errorType == "FLIGHT_WRONG_TERMINAL") {
                $(mg_echo_global).trigger('event.flight_checker.incorrect_terminal');
            } else if (responseStopRecord.errorType == "FLIGHT_WRONG_AIRPORT") {
                $(mg_echo_global).trigger('event.flight_checker.incorrect_airport');
            }

        } else if(responseStopRecord.errorType === "BOOKING_INVALID_PICKUP_TIME") {
            flightCheckerMessagesContent.html('<p>' + responseStopRecord.error + '</p>');

            $('<div class="flight-checker-btn">' + translate('book_for_then') + '</div>')
                .click(function() {
                    self.changeDateAsap(responseStopRecord);
                })
                .appendTo(flightCheckerMessagesContent);

            flightCheckerMessagesContent.append('<p class="pick-up-time">' + translate('current_pick_up_time_is') + '<br><span class="value">' + pickUpDateTime.format(mg_echo_global.getDatetimeFormat()) + '</span></p>');

            self.errors['flightNumber'] = true;

            $(mg_echo_global).trigger('event.flight_checker.incorrect_flight_date');

        } else if (responseStopRecord.errorType === "PROBLEM_WITH_FLIGHT_CHECKER") {
            var airportStopRecord = mg_echo_global.formStep2.getValue().pickup;
            self.manuallyTimeMode();
            self.processingWithoutServerValidation(airportStopRecord);
            self.afterSuccessfulValidation(scheduledLandingDate, pickUpDateTime);
            return;
        } else if(responseStopRecord.errorType !== null) {
            flightCheckerMessagesContent.html(responseStopRecord.error);
        }

        if (flightCheckerMessagesContent.text() == '') {
            var scheduledLandingDateDelay = new moment(scheduledLandingDate).add(flightDelay, 'minutes');

            var successMessage = self.getSuccessMessage(
                responseStopRecord.flightNumber,
                scheduledLandingDate,
                scheduledLandingDateDelay,
                flightDelay
            );

            if(flightDelay !== 0) {
                scheduledLandingDateDelay.add(hours, 'hours').add(minutes, 'minutes');
            } else {
                scheduledLandingDateDelay = null;
            }

            flightCheckerMessagesContent.html(''
                + successMessage
                + '</p><p class="pick-up-time">' + translate('current_pick_up_time_is') + '<br><span class="value">'
                + (scheduledLandingDateDelay || pickUpDateTime).format(mg_echo_global.getDatetimeFormat())
                + '</span></p>'
            );

            self.afterSuccessfulValidation(scheduledLandingDate, pickUpDateTime);
            flightCheckerMessagesContent.removeClass('flight-checker-error');

            $(mg_echo_global).trigger('event.flight_checker.success');

        } else {
            mg_echo_global.formStep2.clearPriceAndHidePriceSection();
            flightCheckerMessagesContent.addClass('flight-checker-error');
        }

        this.flightCheckerMessages.html(flightCheckerMessagesContent);
    },

    getSuccessMessage: function(
        flightNumber,
        scheduledLandingDate,
        scheduledLandingDateDelay,
        flightDelay
    ) {
        var successMessage;

        if (flightDelay !== 0) {

            successMessage =
                StringUtils.format(
                    translate('successMessageFcDelay1'),
                    flightNumber,
                    scheduledLandingDate.format(translate('date_format')),
                    scheduledLandingDate.format('HH:mm')
                )
                + '<div class="scheduled-landing-delay">'
                + StringUtils.format(
                translate('successMessageFcDelay2'),
                translate(
                    (flightDelay > 0) ? 'successMessageDelayPart' : 'successMessageEarlyPart'
                ),
                scheduledLandingDateDelay.format(translate('date_format')),
                scheduledLandingDateDelay.format('HH:mm')
                )
                + '</div>';
        } else {
            successMessage =
                '<p>'
                + StringUtils.format(
                translate('successMessageFc'),
                flightNumber,
                scheduledLandingDate.format(translate('date_format')),
                scheduledLandingDate.format('HH:mm')
                )
                + '</p>';
        }

        return successMessage;
    },

    // После успешной валидации
    // ======================================
    afterSuccessfulValidation: function (scheduledLandingDate, pickUpDateTime) {
        var self = this;
        self.scheduledLandingDate = scheduledLandingDate.format(mg_echo_global.getDatetimeFormat());
        mg_echo_global.formStep2.getEditor('date').setValue(pickUpDateTime, false);
        mg_echo_global.formStep2.getEditor('dateType').setValue(mg_echo_global.getDateType('pickup'));

        self.errors = [];

        mg_echo_global.formStep2.loadPriceAndCapacity();
    },

    // Меняем pickUp
    // ======================================
    changePickUp: function(pickUp) {
        var address =  new Magenta.Echo.InlineBooking.Models.Address(pickUp.address);
        mg_echo_global.formStep2.getEditor('pickup').setValue(address);
        this.validateAirportFlightDetails();
    },

    // Меняем Дату на ASAP и выключаем "Link pickup time to landing time"
    // ======================================
    changeDateAsap: function() {
        this.notAdjustDateEditor.$el.trigger('dp.asap');
        this.onChangeAdjustPickupTime(false, true);
    },

    // Отлавливаем изменения в поле Hold Off Time
    isSelectedUpHoldOffTime: function(event){
        setTimeout(function () {
            this.validateAirportFlightDetails();
        }.bind(this), 0);
    },

    getHoldOffTimeOptions: function () {
        var selectHoldOffTime = this.adjustPickupTimeBlock.find('select[name="holdOffTime"]')
        for (var minutes = 0; minutes<=180; minutes+=10){
            var fullPart = Math.floor(minutes/60),
                decimalPart = minutes - fullPart*60;
            if (fullPart === 0) {
                selectHoldOffTime.append('<option>' + minutes + ' min' + '</option>')
            } else {
                if (decimalPart === 0) {
                    selectHoldOffTime.append(fullPart === 1 ? '<option>' + fullPart + ' hour' + '</option>'
                                                            : '<option>' + fullPart + ' hours' + '</option>')
                } else {
                    selectHoldOffTime.append('<option>' + fullPart + ' h ' + decimalPart + ' m' + '</option>')
                }
            }
        }
    }
});
