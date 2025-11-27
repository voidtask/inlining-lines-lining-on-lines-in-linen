Magenta.Echo.InlineBooking.Models.Booking = Magenta.Echo.InlineBooking.Models.AbstractModel.extend({
    url:  function() {
        return mg_echo_conf.rootPath + "/api/booking/create";
    },

    //ugly hack to meet the serverside date format
   getJson: function() {
       var attrs = _.clone(this.attributes);
       attrs.date = mg_echo_global.getUTCDateFormatted(this.get('date'));
       return JSON.stringify(attrs);
   },

    //ugly hack to meet the serverside date format
    getValue: function() {
        var attrs = _.clone(this.attributes);
        attrs.date = mg_echo_global.getUTCDateFormatted(this.get('date'));
        return attrs;
    }
});