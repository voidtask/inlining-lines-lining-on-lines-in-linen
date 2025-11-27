Magenta.Echo.InlineBooking.Models.Airport = Magenta.Echo.InlineBooking.Models.AbstractModel.extend({

    el: null,

    renderItem: function () {
        return '<div class="mg-echo-airport-item">' + this.get('meetingPlace').address + '</div>';
    },

    renderSelectedItem: function (isEditable) {
        var customerNotes = '',
            editIcon = '';
        
        if (this.get('type') === 'ARRIVAL') {
            customerNotes = this.get('meetingPlace').customerNotes ?
                '<div class="mg-echo-airport-notes">' + this.get('meetingPlace').customerNotes + '</div>'
                : '';
        }
        editIcon = isEditable ? '<div class="mg-echo-edit-icon"></div>' : '';

        return '' +
            '<div class="mg-echo-airport-selected-item">' + this.get('meetingPlace').address + '' +
                editIcon +
                customerNotes +
            '</div>';
    }

});