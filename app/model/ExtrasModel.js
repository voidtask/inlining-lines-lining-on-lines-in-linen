Magenta.Echo.InlineBooking.Models.Extras = Magenta.Echo.InlineBooking.Models.AbstractModel.extend({
    getItem: function() {
        // console.log(this);
        // debugger;
    },

    toString: function () {
        var extrasString = this.get('name');

        if (Number.isInteger(this.get('value'))) {
            extrasString += ' × ' + this.get('value');
        }

        return extrasString;
    }
});
