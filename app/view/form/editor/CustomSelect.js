Backbone.Form.editors.CustomSelect = Backbone.Form.editors.Text.extend({
    initialize: function(options) {
        _.bindAll(this, 'onSelect', 'renderSuggestions', 'showSuggestions', 'hideSuggestions');
        Backbone.Form.editors.Text.prototype.initialize.call(this, options);

        var self = this;

        this.suggestionElements = [];
        this.suggestionsActive = false;
        this.showTimer = false;
        this.suggestionsContainer =
            $('<div class="customSelect-suggestions"></div>')
                .appendTo(this.schema.appendTo ? this.schema.appendTo : 'body')
                .hide()
                .css('position', this.schema.position || 'absolute');

        $(this.el).on('click', 'input', function(event) {
            self.showSuggestions(event);
        });
        $(this.el).on('focus', 'input', function(event) {
            self.showSuggestions(event);
        });
        $(this.el).on('click', '.trigger', function() {
            $(self.el).find('input').focus();
        });
        $(window).on('click', function (event) {
            if (event.target.offsetParent != self.el) {
                self.hideSuggestions();
            }
        });

        // $(this.el).on('blur', 'input', function(event) {
        //     self.hideSuggestions();
        // });

        this.renderSuggestions()
    },

    onSelect: function(suggestion) {
        var fieldContainer = $(this.el);
        var fieldInput = fieldContainer.find('input');
        var suggestionModel = $(suggestion.data[0]).data();

        this.value = suggestionModel.getValue();
        fieldInput.val(suggestionModel.toString());

        this.hideSuggestions();
        this.setValue(suggestionModel);

        if (typeof this.schema.onSelect === "function") {
            this.schema.onSelect.call(this, suggestion);
        }
    },

    getValue: function() {
        return this.value;
    },

    setValue: function(value) {

        var fieldContainer = $(this.el);
        var fieldInput = fieldContainer.find('input');

        if (typeof value.getValue === "function") {
            this.value = value.getValue();
        } else {
            this.value = value;
        }

        if (typeof value.setValue === "function") {
            value.setValue();
            fieldInput.val(value.toString());
        }

        this.updateSelectedSuggestion();
        this.trigger('setValue', this);
    },

    renderSuggestions: function() {
        var self = this;
        this.suggestionsContainer.html('');
        this.suggestionElements = [];
        var options = [];

        if (typeof this.schema.options === "function") {
            options = this.schema.options();
        } else {
            options = this.schema.options;
        }

        if (options && options.length > 0) {

            // sort options
            options.sort(function(a, b){
                var aOrder = a.get('order') ? a.get('order') : 0;
                var bOrder = b.get('order') ? b.get('order') : 0;
                return ((aOrder < bOrder) ? -1 : ((aOrder > bOrder) ? 1 : 0));
            });

            $.each(options, function (key, value) {
                var suggestionItem = $('<div class="customSelect-suggestion">' + value.toString() + '</div>');
                suggestionItem.data(value);

                suggestionItem.on('click', suggestionItem, self.onSelect);
                suggestionItem.on('mousedown', suggestionItem, function(event) {
                    event.preventDefault();
                });

                self.suggestionsContainer.append(suggestionItem);
                self.suggestionElements.push(suggestionItem);
            })
        }
    },

    showSuggestions: function(event) {
        var self = this;

        if (this.suggestionsActive !== true) {
            this.suggestionsActive = true;
            this.suggestionsContainerReposition();
            this.suggestionsContainer.show();
            this.showTimer = true;
            setTimeout(function () {
                self.showTimer = false;
            }, 100);
        } else {
            this.hideSuggestions();
        }
    },

    hideSuggestions: function() {
        if (this.showTimer == true) {
            return;
        }

        this.suggestionsActive = false;
        this.suggestionsContainer.hide();
    },

    suggestionsContainerReposition: function() {
        var fieldContainer = $(this.el);
        var fieldLabel = fieldContainer.find('.mg-echo-label');
        if (mg_echo_global.isMobile) {
            this.suggestionsContainer.css({
                'left'  : 0,
                'margin-top' : 5,
                'width' : fieldContainer.width()
            });
        } else {
            this.suggestionsContainer.css({
                'left'  : fieldLabel.outerWidth(),
                'width' : fieldContainer.width() - fieldLabel.outerWidth(),
                'margin-top' : -4
            });
        }
    },

    updateSelectedSuggestion: function() {
        var fieldContainer = $(this.el);
        var fieldInput = fieldContainer.find('input');
        $.each(this.suggestionElements, function(key, item) {
            $(item).removeClass('selected');
            if ($(item).html() == fieldInput.val()) {
               $(item).addClass('selected');
            }
        });
    }

});