Magenta.Echo.InlineBooking.Collections.AbstractCollection = Backbone.Collection.extend({
    fetch: function(options) {
        var thiz = this;
        var opts =  {
            method: 'POST',
            success: function(collection, response, responseOpts) {
                if (options && options.success) {
                    options.success.apply(thiz, arguments);
                }

                if(response && !response.success) {
                    thiz.trigger('fail', response, responseOpts);
                }

            },
            error: function(collection, response, responseOpts) {
                // Allow views to respond to failed fetch calls
                thiz.trigger('fail', response, responseOpts);
                if (options && options.error)
                    options.error.apply(thiz, arguments);
            }
        };
        Backbone.Collection.prototype.fetch.apply(thiz, [_.extend({}, options, opts)]);
    },

    parse: function (response, options) {
        if (response.success && response.rows) {
            return response.rows;
        } else if (!response.success) {
            if (response.errors && response.errors.length > 0) {
                mg_echo_global.log('error when collection load: ' + response.errors[0]);
            } else {
                mg_echo_global.log('error when collection load');
            }
        }
        return [];
    }
});

