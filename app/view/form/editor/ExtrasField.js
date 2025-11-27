Backbone.Form.editors.ExtrasField = Backbone.Form.editors.Text.extend({
    extrasOptions: [],
    addButton: null,
    optionsContainer: null,
    selectedItems: [],
    selectedItemsContainer: [],
    validators: [
        function(value, formValues, editor) {
            var isValidateError = false;

            editor.$el.find('.mg-extras-result .column-title').removeClass('error-icon');

            $.each(value, function (key, extras) {
                var extrasFromOptions = editor.extrasOptions.find(function (item) {
                    return item.id == extras.get('extrasId');
                });

                if (extrasFromOptions.mandatory && extras.get('value') === '') {
                    isValidateError = true;
                }
            });

            if (isValidateError) {
                mg_echo_global.formStep2.getForm().showError(Backbone.Form.validators.errMessages.required, 'heap');
                editor.$el.find('.mg-extras-result .column-title').addClass('error-icon');

                return false;
            }
        }
    ],
    initialize: function(options) {
        _.bindAll(this, 'onItemSelect', 'closeListener', 'onRemoveItem');
    },
    addOptions: function(extrasOptions) {
        this.activateOptions(extrasOptions);
        this.initField();
    },

    activateOptions: function(extrasOptions) {
        this.extrasOptions = extrasOptions.map(function (option) {
            option.isActive = true;
            return option;
        });
    },

    initField: function() {
        if (!this.extrasOptions || !this.extrasOptions.length) {
            return;
        }

        this.addButton = $(this.el).find('.mg-extras-name');
        this.optionsContainer = $(this.el).find('.mg-extras-options');
        this.selectedItemsContainer = $(this.el).find('.mg-extras-selected-items');
        this.extrasResultEl = $(this.el).find('.mg-extras-result');
        this.extrasAddButtonText1 = $(this.el).find('.mg-extras-add-button-text-1');
        this.extrasAddButtonText2 = $(this.el).find('.mg-extras-add-button-text-2');

        $(this.el).show();
        this.hideSuggestions();
        this.checkAvailable();

        this.addButton.on('click', this.onOpenOptions.bind(this));
    },

    setDefaultValues: function() {
        this.extrasOptions.forEach(function (item) {
            if(item.isDefault || item.mandatory) {
                this.addItem(item);
            }
        }.bind(this));
    },

    onItemSelect: function(event) {
        var item = $(event.data[0]).data();
        this.addItem(item, true);
    },

    addItem: function(item, withTrigger) {
        this.extrasOptions.forEach(function (option){
            (option.id === item.id) && (option.isActive = false);
        });

        var defaultValue = item.type === 'NUMERIC' ?
                item.mandatory ?
                    '' : 1
                : true

        var newItem = new Magenta.Echo.InlineBooking.Models.Extras({
            name: item.name,
            enabled: true,
            value: defaultValue,
            extrasId: item.id
        });
        this.selectedItems.push(newItem);
        this.renderSelectedItems();
        this.checkAvailable();
        withTrigger && this.trigger('valueChange', this);
    },

    checkAvailable: function() {
        var isActiveOptionsAvailable = this.extrasOptions
            .some(function (option) { return option.isActive });
        isActiveOptionsAvailable ? this.addButton.show() : this.addButton.hide();

        if (this.selectedItems.length) {
            this.extrasResultEl.show();
            this.extrasAddButtonText1.hide();
            this.extrasAddButtonText2.show();
        } else {
            this.extrasResultEl.hide();
            this.extrasAddButtonText1.show();
            this.extrasAddButtonText2.hide();
        }
    },

    onOpenOptions: function() {
        this.optionsContainer.show();

        setTimeout(function () {
            $(window).on('click', this.closeListener );
        }.bind(this));

        this.renderOptions();
    },

    renderSelectedItems: function() {
        if(!this.selectedItemsContainer || !this.selectedItemsContainer.length) return;
        this.selectedItemsContainer.html('');

        $.each(this.selectedItems, function (key, extras) {
            var extrasFromOptions = this.extrasOptions.find(function (item) {
                return item.id == extras.get('extrasId');
            });

            var extrasItemEl = $('<div class="mg-selected-item"></div>');

            if (!extrasFromOptions.mandatory) {
                var removeIconEl = $('<div class="mx-remove-icon"></div>');

                extrasItemEl.append(removeIconEl);
                removeIconEl.on('click', extrasItemEl, this.onRemoveItem);
            } else {
                var mandatoryIconEl = $('<div class="mx-mandatory-icon">*</div>');

                extrasItemEl.append(mandatoryIconEl);
            }

            extrasItemEl.append($('<span>' + extras.get('name') + '</span>'));

            extrasItemEl.data(extras);

            // if numeric type
            if (extrasFromOptions.type === 'NUMERIC') {
                var selectInputEl = $('<select></select>');
                var n = 1;

                if (extrasFromOptions.mandatory) {
                    selectInputEl.append('<option></option>');
                    n = 0;
                }

                for (n; n <= extrasFromOptions.maxValue; n++) {
                    selectInputEl.append('<option>' + n + '</option>');
                }

                selectInputEl.val(extras.get('value'));
                extrasItemEl.addClass('mg-numeric-extras');
                
                selectInputEl.on('change', function() {
                    var value = selectInputEl.val();

                    extras.set('value', value !== '' ? parseInt(value, 10) : value);
                    this.validate();
                    this.trigger('valueChange', this);
                }.bind(this));

                extrasItemEl.append(
                    $('<div class="mg-styled-select"></div>').append(selectInputEl)
                );
            }

            this.selectedItemsContainer.append(extrasItemEl);
        }.bind(this));
    },

    renderOptions: function() {
        this.optionsContainer.html('');

        $.each(this.extrasOptions, function (key, option) {
            if(!option.isActive) {
                return;
            }
            var optionItem = $('<div class="customSelect-suggestion">' + option.name + '</div>');
            optionItem.data(option);

            optionItem.on('click', optionItem, this.onItemSelect );
            optionItem.on('mousedown', optionItem, function(event) {
                event.preventDefault();
            });

            this.optionsContainer.append(optionItem);
        }.bind(this));
    },

    hideSuggestions: function() {
        this.optionsContainer.hide();
    },

    closeListener: function() {
        this.hideSuggestions();
        $(window).off('click', this.closeListener );
    },

    onRemoveItem: function (event) {
        var element = $(event.data[0]);
        var removeItem = element.data();

        $(element).remove();
        
        this.extrasOptions.forEach(function (option){
            (option.id === removeItem.get('extrasId')) && (option.isActive = true);
        });

        this.selectedItems = this.selectedItems.filter(function(item) {
            return item.get('extrasId') !== removeItem.get('extrasId');
        });

        this.checkAvailable();
        this.trigger('valueChange', this);
    },

    setValue: function () {
        this.selectedItems.length = 0;
        this.setDefaultValues();
        this.renderSelectedItems();
    },

    clear: function() {
        this.selectedItems.length = 0;
        if(this.addButton) {
            this.addButton.show();
        }

        this.activateOptions(this.extrasOptions);
        this.renderSelectedItems();
    },

    getValue: function () {
        return this.selectedItems;
    }
});
