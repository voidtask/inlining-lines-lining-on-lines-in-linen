Backbone.Form.editors.CreditCard = Backbone.Form.editors.FormField.extend({

    threedsPaymentButton: null,
    threedsApplyCardButton: null,
    paymentWindow: null,
    timer: null,
    webPaymentPopup: new Magenta.Echo.InlineBooking.Views.WebPaymentPopup(),
    exceptionHandler: new Magenta.Echo.InlineBooking.Utils.ExceptionResponseHandler(),

    //bind dom events to Backbone view
    events : {
        "click .change-credit-card-btn" :"onChangeCardBtnPressed",
        "click .back-to-existed-card-btn" :"onBackToExistedCardBtnPressed"
    },

    initialize: function(options) {
        _.bindAll(this, 'onChangeCardBtnPressed', 'onBackToExistedCardBtnPressed');
        Backbone.Form.editors.FormField.prototype.initialize.call(this, options);

        this.viewModes = {
            "existedCard": "existed-card",
            "newCard": "new-card"
        };
    },

    setCardView: function() {
       $('.credit-card-number-wrapper').hide();
       $('.holder-wrapper').hide();
       $('.expiry-and-cvv-wrapper').hide();
       $('.postcode-wrapper').hide();

       mg_echo_global.getBookingModel().set({'paymentReference' : null});
       mg_echo_global.getBookingModel().set({'receiptId' : null});
    },

    setValue: function(value) {
        Backbone.Form.editors.FormField.prototype.setValue.apply(this, arguments);

        this.setCardView();

        this.onValueSet(value);
    },

    setViewMode: function(mode, value) {
        mode = mode || this.viewModes.newCard;
        this.nestedForm.clearValidation();
    },

    onValueSet: function(value) {
        this.setViewMode(this.getModeByValue(value), value);
    },

    onChangeCardBtnPressed: function() {
        this.setViewMode(this.viewModes.newCard);
    },

    onBackToExistedCardBtnPressed: function() {
         this.trigger('existedCardBtnPressed');
    },

    isEmpty: function(value) {
        var attributes = {};
        if(value instanceof Backbone.Model) {
            attributes = value.attributes;
        } else if(typeof value =='object') {
            attributes = value;
        }

        return _.isEmpty(attributes);
    },

    getModeByValue: function(value) {
       return this.isEmpty(value) ? 'new-card' : 'existed-card';
    },

    getHolderEditor: function() {
        return this.nestedForm.getEditor('name');
    },

    getExpiryEditor: function() {
          return this.nestedForm.getEditor('expiry');
    },


});