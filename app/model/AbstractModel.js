Magenta.Echo.InlineBooking.Models.AbstractModel = Backbone.Model.extend({
    clear: function(){
        //clear sub models
        for (var key in this.attributes) {
            var attr = this.attributes[key];
            if(attr instanceof Backbone.Model) {
               attr.clear();
            }
        }
        return Backbone.Model.prototype.clear.apply(this, arguments);
    }
});