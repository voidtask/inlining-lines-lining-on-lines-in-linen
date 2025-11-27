Backbone.Form.editors.PickUpField = Backbone.Form.editors.Autocomplete.extend({
    events: {
        "keyup":  "onChange"
    },
    initialize: function(options) {
        _.bindAll(this, 'onSelect', 'onChange');

        var self = this;
        Backbone.Form.editors.Autocomplete.prototype.initialize.call(this, options);

        this.flightChecker = mg_echo_global.getFlightChecker();

    },

    onChange: function(event) {
        if (this.getValue() === "" && this.flightChecker.showState === true) {
            this.flightChecker.hideFlightChecker();
        }
        Backbone.Form.editors.Autocomplete.prototype.onChange.call(this, event);
    },

    onSelect: function(suggestion) {
        if (
            mg_echo_global.getBookingConfig('flightCheckEnabled') === true &&
            mg_echo_global.addressTypes[suggestion.get('typeOrdinal')] == 'airport'
        ) {
            this.flightChecker.showFlightChecker();
        } else if (this.flightChecker.showState === true) {
            this.flightChecker.hideFlightChecker();
        }

        Backbone.Form.editors.Autocomplete.prototype.onSelect.call(this, suggestion);
    },

    getValue: function() {
        var value = Backbone.Form.editors.Autocomplete.prototype.getValue.call(this);

        if(mg_echo_conf.widgetType === mg_echo_global.widgetTypes.airport){
            return value;
        }

        if (value != '') {
            var flightCheckerValue = this.flightChecker.getValue();

            if (flightCheckerValue) {
                $.extend(value.attributes, this.flightChecker.getValue());
            }
        }

        return value;
    }

});