Magenta.Echo.InlineBooking.Models.Passenger = Magenta.Echo.InlineBooking.Models.AbstractModel.extend({

    initialize: function (args) {
        this.set('value', args);
    },

    getValue: function () {
        return this.get('value');
    },

    setValue: function() {},

    toString: function () {
        return this.get('value');
    }
});
Magenta.Echo.InlineBooking.Models.PassengersList = Magenta.Echo.InlineBooking.Models.AbstractModel.extend({


    PassangersList: [],

    generateOptions: function(maxValue) {
        this.PassangersList = [];
        for(var i = 0; i <= maxValue - 1; i++) {
            this.PassangersList.push(
                new Magenta.Echo.InlineBooking.Models.Passenger(i + 1)
            );
        }
    },

    defaultValue: new Magenta.Echo.InlineBooking.Models.Passenger(1),

    clear: function() {
        this.PassangersList = [];
    }
});