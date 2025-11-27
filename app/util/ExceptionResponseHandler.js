Magenta.Echo.InlineBooking.Utils.ExceptionResponseHandler = function() {

    this.onResponse = function(responseOpts, key) {
        this.trigger((key ? key + ':' : '' ) + 'beforeResponseProcessed');
        var response = responseOpts.xhr || responseOpts;
        if(response.aborted || response.statusText == 'abort') return;
        if (response.status && response.status != 200){
            this.onResponseError(response, key);
        }
        else if (response.responseText != undefined) {
            // responseText was returned, decode it
            var responseObj = $.parseJSON(response.responseText);
            if (responseObj != null) {
                if (responseObj.warnings && responseObj.warnings.length > 0) {
                    this.onServerWarning(responseObj.warnings, key);
                }
                if (responseObj.errors && responseObj.errors.length > 0) {
                    this.onServerError(responseObj.errors, key);
                }
            }
            else {
                this.showDefaultErrorMessage(key);
            }
        }
        else {
            this.showDefaultErrorMessage(key);
        }
    };

    this.onServerError = function(errors, key) {
        var message = "";
        var coreCommunicationException = false;
        var sessionError = false;
        for(var i = 0; i < errors.length; i++) {
            if (errors[i].type == 'CoreCommunicationException') {
                coreCommunicationException = true;
                break;
            }
            if (errors[i].type == 'CloseServerSessionException') {
                sessionError = true;
                break;
            }

            if (message) {
                message += '</br>';
            }
            message += translate(errors[i].message);

            // if phone error
            if (errors[i].type == 'INCORRECT_PHONE_REG') {
                this.trigger('INCORRECT_PHONE_REG');
            }

            if (errors[i].type == 'IllegalArgumentException') {
                this.trigger('ILLEGAL_ARGUMENT_EXCEPTION');
            }
        }

        if (coreCommunicationException) {
            this.showError('Service is unavailable. Please try later', key);
        }
        else if (sessionError) {
            this.onSessionExpiredError();
        }
        else {
            this.showError(message ? message : 'Unknown server error', key);
        }
    };

    this.showError = function(msg, key) {
        this.trigger((key ? key + ':' : '' ) + "error", msg);
    };


    this.onServerWarning = function(warnings, key) {
        var message = "";
        for(var i = 0; i < warnings.length; i++) {
            if (message) {
                message += '</br>';
            }
            message += warnings[i].message;
        }

        this.showWarning(message, key);
    };

    this.showWarning = function(msg, key) {
        this.trigger((key ? key + ':' : '' ) + "warning", msg);
    };

    this.onResponseError = function(response, key) {
        if (response.status == 503) {
            $(mg_echo_global).trigger('event.connect_error.server');
        }

        if (response.status == 403) {
            this.onSessionExpiredError();
        }
        else {
            this.showError(response.status + ': ' + response.statusText, key);
        }
    },

    this.onSessionExpiredError = function() {
        //if session expired then you are to log in again (noSkip = true)
        //mg_echo_global.showLoginWrapper(true);
    },

    this.showDefaultErrorMessage = function(key) {
        this.showError('Service is unavailable. Please try later', key);
    }
};