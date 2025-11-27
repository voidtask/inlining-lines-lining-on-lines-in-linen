Magenta.Echo.InlineBooking.Models.Address = Magenta.Echo.InlineBooking.Models.AbstractModel.extend({
    getEmptyObject: function() {
        return {
            addrId: null,
            address: "",
            alias: "",
            clientAddressId: null,
            flightNumber: "",
            holdOffTime: null,
            id: null,
            latitude: "",
            longitude: "",
            meetingPlaceId: null,
            notes: "",
            customerNotes: "",
            scheduledLandingDate: null,
            country: null
        }
    },

    getItem: function () {
        var icon = '<i class="mg-icon mg-icon-'+ mg_echo_global.addressTypes[this.get('typeOrdinal')]+'"></i>';
        var details = '<span class="mg-details">'+this.get('details')+'</span>';
        return icon + details;
    },

    toString: function () {
        return this.get('details');
    }
});

Magenta.Echo.InlineBooking.Models.AddressList = Magenta.Echo.InlineBooking.Collections.AbstractCollection.extend({
    model: Magenta.Echo.InlineBooking.Models.Address,
    url: mg_echo_conf.rootPath + '/api/addresses/search'
});
