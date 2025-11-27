if (mg_echo_conf.analytics != null && mg_echo_conf.analytics != '') {
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }
            , i[r].l = 1 * new Date();
        a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
    ga('create', mg_echo_conf.analytics, 'auto', {'name': 'echo'});

    $(document).on('app-ready', function () {

        ga('echo.require', 'ecommerce');

        $(mg_echo_global).on('pageview.book_from', function () {
            if (mg_echo_global.getContactModel().id) {
                ga('echo.send', 'pageview', '/book_from/authorized');
                ga('echo.send', 'pageview', '/book_info');
            } else {
                ga('echo.send', 'pageview', '/book_from/non-authorized');
                ga('echo.send', 'pageview', '/book_from/bookers_info');
            }
        });

        $(mg_echo_global).on('pageview.email_old', function () {
            ga('echo.send', 'pageview', '/email_old');
        });

        $(mg_echo_global).on('pageview.email_new', function () {
            ga('echo.send', 'pageview', '/email_new');
        });

        $(mg_echo_global).on('pageview.phone_name', function () {
            ga('echo.send', 'pageview', '/phone_name');
        });

        $(mg_echo_global).on('pageview.book_info', function () {
            ga('echo.send', 'pageview', '/book_info');
        });

        $(mg_echo_global).on('pageview.thankyou', function (event, bookingValues) {
            ga('echo.send', 'pageview', '/thankyou');

            ga('echo.ecommerce:addTransaction', {
                'id': bookingValues.id,
                'affiliation': 'From ' + bookingValues.pickup.postcode + ' to ' + bookingValues.dropoff.postcode,
                'revenue': bookingValues.totalPrice,
                'shipping': '0',
                'tax': mg_echo_global.vatPrice
            });

            ga('echo.ecommerce:addItem', {
                'id': bookingValues.id,
                'name': bookingValues.dateType,
                'sku': '0',
                'category': bookingValues.serviceRecord.name,
                'price': bookingValues.totalPrice,
                'quantity': '1'
            });

            ga('echo.ecommerce:send');
        });


        $(mg_echo_global).on('event.login.pass_reset', function () {
            ga('echo.send', 'event', 'login', 'password', 'Reset_pass');
        });

        $(mg_echo_global).on('event.login.logout', function () {
            ga('echo.send', 'event', 'login', 'log_out', 'LogOut');
        });

        $(mg_echo_global).on('event.create_booking.cancel', function () {
            ga('echo.send', 'event', 'create_booking', 'cancel', 'cancel');
        });

        $(mg_echo_global).on('event.stops.first_screen.no_results', function () {
            ga('echo.send', 'event', 'stops', 'first_screen', 'No results');
        });

        $(mg_echo_global).on('event.login.email_empty', function () {
            ga('echo.send', 'event', 'login', 'email', 'Fill out required fields');
        });

        $(mg_echo_global).on('event.login.email_invalid', function () {
            ga('echo.send', 'event', 'login', 'email', 'Invalid email address');
        });

        $(mg_echo_global).on('event.login.email_invalid', function () {
            ga('echo.send', 'event', 'login', 'email', 'Invalid email address');
        });

        $(mg_echo_global).on('event.login.email_success', function () {
            ga('echo.send', 'event', 'login', 'email', 'Success');
        });

        $(mg_echo_global).on('event.login.email_edit', function () {
            ga('echo.send', 'event', 'login', 'email', 'Edit');
        });

        $(mg_echo_global).on('event.login.exit', function () {
            ga('echo.send', 'event', 'login', 'exit', 'Exit');
        });

        $(mg_echo_global).on('event.login.password.invalid', function () {
            ga('echo.send', 'event', 'login', 'password', 'Invalid email or password');
        });

        $(mg_echo_global).on('event.register.phone.success', function () {
            ga('echo.send', 'event', 'register', 'phone', 'Success');
        });

        $(mg_echo_global).on('event.register.phone.error', function () {
            ga('echo.send', 'event', 'register', 'phone', 'Provide your mobile number');
        });


        $(mg_echo_global).on('event.register.resend_pass', function () {
            ga('send', 'event', 'register', 'phone', 'Resend_pass');
        });

        $(mg_echo_global).on('event.created_booking.show_on_map', function () {
            ga('send', 'event', 'created_booking', 'show_on_map', 'Web-tracking');
        });

        $(mg_echo_global).on('event.created_booking.print', function () {
            ga('send', 'event', 'created_booking', 'print', 'Print_book');
        });

        $(mg_echo_global).on('event.created_booking.terms_link', function () {
            ga('send', 'event', 'created_booking', 'T&C_link', 'T&C');
        });

        $(mg_echo_global).on('event.created_booking.close', function () {
            ga('send', 'event', 'created_booking', 'close', 'Close');
        });


        $(mg_echo_global).on('event.flight_checker.incorrect_terminal', function () {
            ga('send', 'event', 'flight_checker', 'airport', 'Incorrect terminal');
        });

        $(mg_echo_global).on('event.flight_checker.incorrect_airport', function () {
            ga('send', 'event', 'flight_checker', 'airport', 'Incorrect airport');
        });

        $(mg_echo_global).on('event.flight_checker.incorrect_flight_number', function () {
            ga('send', 'event', 'flight_checker', 'flight_number', 'Incorrect Flight number');
        });

        $(mg_echo_global).on('event.flight_checker.incorrect_flight_date', function () {
            ga('send', 'event', 'flight_checker', 'flight_date', 'Incorrect Flight date');
        });

        $(mg_echo_global).on('event.flight_checker.success', function () {
            ga('send', 'event', 'flight_checker', 'flight_data', 'Success');
        });


        $(mg_echo_global).on('event.connect_error.server', function () {
            ga('send', 'event', 'connect_error', 'Server', 'Server is not responding');
        });

        // Недоступная зона при выборе адресов стопов
        $(mg_echo_global).on('event.stops.book_info.booking_unavailable_zone', function () {
            ga('send', 'event', 'stops', 'book_info', 'Booking unavailable zone');
        });

        // Неактивный контакт
        $(mg_echo_global).on('event.login.email.inactive', function () {
            ga('send', 'event', 'login', 'email', 'User is inactive');
        });

        $(mg_echo_global).on('event.stops.book_info.no_results', function () {
            ga('send', 'event', 'stops', 'book_info', 'No results');
        });

        $(mg_echo_global).on('event.stops.book_info.fully_booked_for_now', function () {
            ga('send', 'event', 'stops', 'book_info', 'Fully booked for now');
        });

        $(mg_echo_global).on('event.stops.book_info.prebook_service_is_not_available', function () {
            ga('send', 'event', 'stops', 'book_info', 'Prebook service is not available');
        });

        $(mg_echo_global).on('event.credit_card.credit_card_details.fail', function () {
            ga('send', 'event', 'credit_card', 'credit_card_details', 'Card has been declined');
        });

        $(mg_echo_global).on('event.credit_card.credit_card_details.success', function () {
            ga('send', 'event', 'credit_card', 'credit_card_details', 'Success');
        });

        $(mg_echo_global).on('event.login.email.blacklisted', function () {
            ga('send', 'event', 'login', 'email', 'User is blacklisted');
        });


    });
}

