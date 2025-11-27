Magenta.Echo.InlineBooking.Models.CreditCard = Magenta.Echo.InlineBooking.Models.AbstractModel.extend({

    initialize: function() {
        if (this.get('expiry')) {
            this.expiryDate = moment(this.get('expiry'), "MM/YY").endOf('month').toDate();
        }
    },

    isValidExpiry: function() {
        var expiryDate = this.expiryDate;
        var now = new Date();
        if (now.getYear() > expiryDate.getYear())
            return false;
        else if (now.getMonth() > expiryDate.getYear())
            return false;
        else
           return true;
    }


});