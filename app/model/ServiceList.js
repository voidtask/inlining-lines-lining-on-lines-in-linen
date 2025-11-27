Magenta.Echo.InlineBooking.Models.Service = Magenta.Echo.InlineBooking.Models.AbstractModel.extend({

    getItem: function() {
        return '' +
            '<div class="mg-echo-service-name">' + this.get('name') + '</div>' +
            '<div class="mg-echo-service-desc-wrap">' +
                this.renderParamsString() +
                '<div class="mg-echo-service-desc">' + this.get('description') + '</div>' +
            '</div>';
    },

    setValue: function(input) {
        if (this.get('description') != null) {
            var desc = '<span class="mg-echo-service-desc">' + this.get('description') + '</span>';
            input.el.next('.mg-echo-service-desc').remove();
            input.el.after(desc);
        }
    },

    toString: function() {
        return this.get('clientServiceName')?this.get('clientServiceName'):this.get('name');
    },

    renderParamsString: function () {
        var serviceParameters = this.get('serviceParameters'),
            serviceParametersString = '',
            serviceParametersArray = [];

        if (serviceParameters.length > 0) {
            $.each(serviceParameters, function (key, item) {
                serviceParametersArray.push(item.value + ' ' + item.name);
            });
            serviceParametersString = serviceParametersArray.join(', ');
            serviceParametersString = '<div class="mg-echo-service-params">' + serviceParametersString + '</div>';
        }
        return serviceParametersString;
    }

});

Magenta.Echo.InlineBooking.Models.ServiceList = Magenta.Echo.InlineBooking.Collections.AbstractCollection.extend({
    model: Magenta.Echo.InlineBooking.Models.Service,
    url:  mg_echo_conf.rootPath + '/api/services/availableToBookOnline'
});