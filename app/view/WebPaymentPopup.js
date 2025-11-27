Magenta.Echo.InlineBooking.Views.WebPaymentPopup = function (_configs, onClosePopup) {

    var webPaymentWindow = null;
    var declined = false;

    var configs = {
        url: '',
        height: 600,
        width: 800,
        title: ''
    };

    var webPaymentWindowConfigs = {
        features: '',
        left: 0,
        right: 0,
        template: '<form method="post"><input id="Reference" name="Reference" type="hidden"></form><strong>Loading ...</strong>'
    };

    var timer = null;
    var pollingTimer = null;

    setConfigs(_configs);
    setWebPaymentWindowConfigs();

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
        if (isWebPaymentWindowOpened()) {
            webPaymentWindow.focus();
            return;
        }

        openWebPaymentWindow();
        performWebPayment(options.data, options.success, options.failure);
    }

    /**
     * Registering new cards and then processing payment with specified amount
     *  - options.data  - {amount}
     */
    function registerCard(options) {
        if (isWebPaymentWindowOpened()) {
            webPaymentWindow.focus();
            return;
        }

        openWebPaymentWindow();
        performRegisterCard(options.data, options.success, options.failure);
    }

    /**
     * Private Methods
     */

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
        webPaymentWindow.document.body.innerHTML = '<form method="post" action="' + data.acsUrl + '">'
            + '<input name="TermUrl" value="' + data.termUrl + '" type="hidden">'
            + '<input name="PaReq" value="' + data.paReq + '" type="hidden">'
            + '<input name="MD" value="' + data.md + '" type="hidden">'
            + '</form><strong>Loading ...</strong>';

        waitForWindowPopupFeedback(function (result) {
            success(result);
            closeWebPaymentWindow();
        }, function (result) {
            failure(result);
            closeWebPaymentWindow();
        }, { receiptId: data.receipt });
    }

    function loadDeviceDetails(data, success, failure) {
        webPaymentWindow.document.body.innerHTML = '<html>'
            + '<form method="post" action="' + data.methodUrl + '">'
            + '<input name="threeDSMethodData" value="' + data.md + '" type="hidden">'
            + '</form>' +
            '<strong>Loading ...</strong>' +
            '</html>';

        waitForWindowPopupFeedback.call(this, function (response) {
            success(response);

            closeWebPaymentWindow();
        }, function (response) {
            failure(response);

            closeWebPaymentWindow();
        }, { receiptId: data.receipt });

        this.submitWindowPopupForm();
    }

    function loadChallenge(data, success, failure) {
        webPaymentWindow.document.body.innerHTML = '<html>'
            + '<form method="post" action="' + data.challengeUrl + '">'
            + '<input name="creq" value="'+data.md+'" type="hidden">'
            + '</form>' +
            '<strong>Loading ...</strong>' +
            '</html>';

        waitForWindowPopupFeedback.call(this, function (response) {
            success(response);

            closeWebPaymentWindow();
        }, function (response) {
            failure(response);

            closeWebPaymentWindow();
        }, { receiptId: data.receipt });

        this.submitWindowPopupForm();
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
        webPaymentWindow.document.body.innerHTML = '<form method="post" action="' + data.url + '">'
            + '<input id="Reference" name="Reference" type="hidden" value="' + data.reference  + '">'
            + '</form><strong>Loading ...</strong>';

        waitForWindowPopupFeedback(function (result) {
            success(result);
            closeWebPaymentWindow();
        }, function (result) {
            failure(result);
            closeWebPaymentWindow();
        }, { localPaymentReference: data.localPaymentReference });
    }

    function openWebPaymentWindow() {
        declined = false;
        webPaymentWindow = window.open(configs.url, configs.title, webPaymentWindowConfigs.features);
        webPaymentWindow.focus();
        webPaymentWindow.document.body.innerHTML = webPaymentWindowConfigs.template;
    }

    function closeWebPaymentWindow() {
         onClosePopup();
         if (webPaymentWindow) {
             webPaymentWindow.close();
             webPaymentWindow = null;
         }
    }

    function isWebPaymentWindowOpened() {
        return webPaymentWindow && !webPaymentWindow.closed;
    }

    function waitForWindowPopupFeedback(success, failure, paymentReference) {
        if (timer) {
            clearInterval(timer);
        }
        if (pollingTimer) {
            clearInterval(pollingTimer);
        }

        timer = setInterval(function () {
            if (!webPaymentWindow || webPaymentWindow.closed) {
                clearInterval(timer);
                if (pollingTimer) {
                    clearInterval(pollingTimer);
                }
                onClosePopup();
            }
        }, 1000);

        pollingTimer = setInterval(function () {
            if (!webPaymentWindow || webPaymentWindow.closed) {
                return;
            }
            mg_echo_global.ajax({
                url: "/paymentCompleted",
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: JSON.stringify(paymentReference)
            }, true)
                .done(function (data) {
                    if (data && data.success === true) {
                        clearInterval(timer);
                        clearInterval(pollingTimer);
                        success(data);
                    }
                })
                .fail(function () {
                    clearInterval(timer);
                    clearInterval(pollingTimer);
                    failure({});
                    closeWebPaymentWindow();
                });
        }, 15000);

        webPaymentWindow.document.forms[0].submit();
    }

    function setConfigs(_configs) {
        for (var key in _configs) {
            if (_configs.hasOwnProperty(key)) {
                configs[key] = _configs[key];
            }
        }
    }

    function setWebPaymentWindowConfigs() {
        var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;
        var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        webPaymentWindowConfigs.left = ((width / 2) - (configs.width / 2)) + dualScreenLeft;
        webPaymentWindowConfigs.top = ((height / 3) - (configs.height / 3)) + dualScreenTop;
        webPaymentWindowConfigs.features = 'scrollbars=yes, width=' + configs.width + ', height=' + configs.height + ', top=' + webPaymentWindowConfigs.top + ', left=' + webPaymentWindowConfigs.left;
    }

};