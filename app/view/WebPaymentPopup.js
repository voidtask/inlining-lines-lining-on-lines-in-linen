Magenta.Echo.InlineBooking.Views.WebPaymentPopup = function (_configs, onClosePopup) {

    var declined = false;

    var configs = {
        url: '',
        height: 600,
        width: 800,
        title: ''
    };

    var timer = null;
    var pollingTimer = null;

    setConfigs(_configs);

    return {
        webPayment: webPayment,
        registerCard: registerCard,
        closeWebPaymentWindow: closeWebPaymentWindow
    };

    /**
     * Public API
     */

    /**
     * Processing payment with specified amount and existed credit card includes 3d secure
     *  - options.data - {amount, card_id, expire_date, cvv}
     */
    function webPayment(options) {
        performWebPayment(options.data, options.success, options.failure);
    }

    /**
     * Registering new cards and then processing payment with specified amount
     *  - options.data  - {amount}
     */
    function registerCard(options) {
        performRegisterCard(options.data, options.success, options.failure);
    }

    /**
     * Private Methods
     */

    function openPaymentTab(url, formData) {
        var form = document.createElement('form');
        form.method = 'POST';
        form.action = url;
        form.target = '_blank';
        form.rel = 'noopener';
        
        for (var key in formData) {
            if (formData.hasOwnProperty(key)) {
                var input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = formData[key];
                form.appendChild(input);
            }
        }
        
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }

    function performWebPayment(data, success, failure) {
        mg_echo_global.ajax({
            url: "/payments/threeds",
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(data)
        }, true)
            .done(function (data, textStatus, jqXHR) {
                var isFailed = !data || !data.success || !data.rows || data.rows.length === 0;
                if (isFailed) {
                    failure({});
                    closeWebPaymentWindow();
                    return;
                }

                var result = data.rows[0];
                if (!result.need3ds) {
                    success(result);
                    closeWebPaymentWindow();
                } else if (result.needDeviceDetail) {
                    loadDeviceDetails(result, success, failure);
                } else if (result.challenge) {
                    loadChallenge(result, success, failure);
                } else {
                    load3dsPayment(result, success, failure);
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                failure({});
                closeWebPaymentWindow();
            });
    }

    function load3dsPayment(data, success, failure) {
        openPaymentTab(data.acsUrl, {
            TermUrl: data.termUrl,
            PaReq: data.paReq,
            MD: data.md
        });

        waitForWindowPopupFeedback(function (result) {
            success(result);
            closeWebPaymentWindow();
        }, function (result) {
            failure(result);
            closeWebPaymentWindow();
        }, { receiptId: data.receipt });
    }

    function loadDeviceDetails(data, success, failure) {
        openPaymentTab(data.methodUrl, {
            threeDSMethodData: data.md
        });

        waitForWindowPopupFeedback.call(this, function (response) {
            success(response);

            closeWebPaymentWindow();
        }, function (response) {
            failure(response);

            closeWebPaymentWindow();
        }, { receiptId: data.receipt });
    }

    function loadChallenge(data, success, failure) {
        openPaymentTab(data.challengeUrl, {
            creq: data.md
        });

        waitForWindowPopupFeedback.call(this, function (response) {
            success(response);

            closeWebPaymentWindow();
        }, function (response) {
            failure(response);

            closeWebPaymentWindow();
        }, { receiptId: data.receipt });
    }

    function performRegisterCard(data, success, failure) {
        mg_echo_global.ajax({
            url: "/payments",
            type: "POST",
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(data)
        }, true)
            .done(function (data, textStatus, jqXHR) {
                var isFailed = !data || !data.success || !data.rows || data.rows.length === 0;
                if (isFailed) {
                    failure({});
                    closeWebPaymentWindow();
                    return;
                }

                var result = data.rows[0];
                if (!result.need3ds) {
                    success(result);
                    closeWebPaymentWindow();
                } else {
                    successRegisterCard(result, success, failure);
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                failure({});
                closeWebPaymentWindow();
            });
    }

    function successRegisterCard(data, success, failure) {
        openPaymentTab(data.url, {
            Reference: data.reference
        });

        waitForWindowPopupFeedback(function (result) {
            success(result);
            closeWebPaymentWindow();
        }, function (result) {
            failure(result);
            closeWebPaymentWindow();
        }, { localPaymentReference: data.localPaymentReference });
    }

    function closeWebPaymentWindow() {
         onClosePopup();
    }

    function waitForWindowPopupFeedback(success, failure, paymentReference) {
        if (pollingTimer) {
            clearInterval(pollingTimer);
        }

        pollingTimer = setInterval(function () {
            mg_echo_global.ajax({
                url: "/paymentCompleted",
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: JSON.stringify(paymentReference)
            }, true)
                .done(function (data) {
                    if (data && data.success === true) {
                        clearInterval(pollingTimer);
                        success(data);
                    }
                })
                .fail(function () {
                    clearInterval(pollingTimer);
                    failure({});
                });
        }, 15000);
    }

    function setConfigs(_configs) {
        for (var key in _configs) {
            if (_configs.hasOwnProperty(key)) {
                configs[key] = _configs[key];
            }
        }
    }

};