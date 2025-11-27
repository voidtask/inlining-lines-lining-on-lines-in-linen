/**
 *  Ajax Autocomplete for jQuery, version 1.2.24
 *  (c) 2015 Tomas Kirda
 *  Modified by Anna Troshkina, 2015 !!!!!!!
 *
 * need jquery "jquery": ">=1.7"
 *  Ajax Autocomplete for jQuery is freely distributable under the terms of an MIT-style license.
 *  For details, see the web site: https://github.com/devbridge/jQuery-Autocomplete
 */

/*jslint  browser: true, white: true, plusplus: true, vars: true */
/*global define, window, document, jQuery, exports, require */

// Expose plugin as an AMD module if AMD loader is present:
(function (factory, root) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object' && typeof require === 'function') {
        // Browserify
        factory(require('jquery'));
        var _ = root._ || require('underscore'),
            Backbone = root.Backbone || require('backbone');
    } else {
        // Browser globals
        factory(jQuery);
        var _ = root._,
            Backbone = root.Backbone;
    }

}(function ($) {
    'use strict';

    function isIE () {
        var myNav = navigator.userAgent.toLowerCase();
        return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1], 10) : false;
    };

    function log(message) {
        //if (isIE()!=7 && console && console.log) {
        //    console.log(message);
        //}
    };

    var
        utils = (function () {
            return {
                escapeRegExChars: function (value) {
                    return value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                },
                createNode: function (containerClass, position) {
                    var div = document.createElement('div');
                    div.className = containerClass;
                    div.style.position = position;
                    div.style.display = 'none';
                    return div;
                }
            };
        }()),

        keys = {
            ESC: 27,
            TAB: 9,
            RETURN: 13,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40
        };

    function Autocomplete(el, options) {
        var noop = function () { },
            that = this,
            defaults = {
                ajaxSettings: {},
                autoSelectFirst: false,
                appendTo: document.body,
                serviceUrl: null,
                lookup: null,
                onSelect: null,
                width: 'auto',
                minChars: 1,
                maxHeight: 300,
                overflow: 'auto',
                deferRequestBy: 0,
                params: {},
                formatResult: Autocomplete.formatResult,
                delimiter: null,
                zIndex: 9999,
                type: 'GET',
                noCache: false,
                onSearchStart: noop,
                onSearchComplete: noop,
                onSearchError: noop,
                preserveInput: false,
                containerClass: 'autocomplete-suggestions',
                tabDisabled: false,
                dataType: 'json',
                currentRequest: null,
                triggerSelectOnValidInput: true,
                preventBadQueries: true,
                lookupFilter: function (suggestion, originalQuery, queryLowerCase, options) {
                    return Autocomplete.getSuggestionValue(suggestion, options).toLowerCase().indexOf(queryLowerCase) !== -1;
                },
                paramName: 'query',
                customParams: {},
                transformResult: function (response) {
                    return typeof response === 'string' ? $.parseJSON(response) : response;
                },
                showNoSuggestionNotice: true,
                noSuggestionNotice: translate('notFoundAddress'),
                orientation: 'bottom',
                forceFixPosition: false,
                allowTextValue: false,
                position: 'absolute',
                isAddress: false
            };

        // Shared variables:
        that.element = el;
        that.el = $(el);
        that.suggestions = [];
        that.badQueries = [];
        that.selectedIndex = -1;
        that.currentValue = that.element.value;
        that.intervalId = 0;
        that.cachedResponse = {};
        that.onChangeInterval = null;
        that.onChange = null;
        that.isLocal = false;
        that.suggestionsContainer = null;
        that.noSuggestionsContainer = null;
        that.options = $.extend({}, defaults, options);
        that.classes = {
            selected: 'autocomplete-selected',
            suggestion: 'autocomplete-suggestion'
        };
        that.hint = null;
        that.hintValue = '';
        that.selection = null;
        that.inputContainer = that.options.container ? $(that.options.container) :that.el;

        // Initialize and set options:
        that.initialize();
        that.setOptions(options);
    }

    Autocomplete.utils = utils;

    $.Autocomplete = Autocomplete;

    Autocomplete.formatResult = function (suggestion, currentValue, options) {
        var pattern = '(' + utils.escapeRegExChars(currentValue) + ')';

        return Autocomplete.getSuggestionValue(suggestion, options)
            .replace(new RegExp(pattern, 'gi'), '<strong>$1<\/strong>')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/&lt;(\/?strong)&gt;/g, '<$1>');
    };

    Autocomplete.getSuggestionValue = function(suggestion, options) {
        if(suggestion instanceof Backbone.Model) {
            return suggestion.toString();
        } else {
            var value = options.displayField ? options.displayField : 'value';
            return suggestion[value];
        }
    };

    Autocomplete.prototype = {

        killerFn: null,

        initialize: function () {
            var that = this,
                suggestionSelector = '.' + that.classes.suggestion,
                selected = that.classes.selected,
                options = that.options,
                container;

            // Remove autocomplete attribute to prevent native suggestions:
            that.element.setAttribute('autocomplete', 'off');

            that.killerFn = function (e) {
                if (
                    ($(e.target).closest('.' + that.options.containerClass).length === 0)
                    && !$(e.target).is(that.el) /*when click input do not hide suggestions list. Modified by Anna*/
                    && !$(e.target).is($(that.el).closest('.field-container').find('.trigger'))
                    && !$(e.target).hasClass('try-again') /*when click input trigger do not hide suggestions list. Modified by Evgeniy*/
                ) {
                    that.killSuggestions();
                }
            };

            // html() deals with many types: htmlString or Element or Array or jQuery
            that.noSuggestionsContainer = $('<div class="autocomplete-no-suggestion"></div>')
                .html(this.options.noSuggestionNotice).get(0);

            that.suggestionsContainer = Autocomplete.utils.createNode(options.containerClass, options.position);

            container = $(that.suggestionsContainer);

            container.appendTo(options.appendTo);

            // Only set width if it was provided:
            if (options.width !== 'auto') {
                container.width(options.width);
            }

            // Listen for mouse over event on suggestions list:
            container.on('mouseover.autocomplete', suggestionSelector, function (event) {
                that.activate($(this).data('index'), $(event.target).text());
            });

            // Deselect active element when mouse leaves suggestions container:
            container.on('mouseout.autocomplete', function () {
                that.selectedIndex = -1;
                container.children('.' + selected).removeClass(selected);
            });

            // Listen for click event on suggestions list:
            container.on('click.autocomplete', suggestionSelector, function (event) {
                that.select($(this).data('index'), $(this).data('value'));
            });

            that.fixPositionCapture = function () {
                if (that.visible) {
                    that.fixPosition();
                }
            };

            that.el.prop("readonly", that.options.readonly === true ? true : false);
            var trigger = that.inputContainer.find('.trigger');
            if(trigger) {
                trigger.on("click", function (e) {
                    that.onTriggerClick(e);
                });
            }

            //hide suggestions when click outside the element
            $(document).click(function(e){
                that.enableKillerFn(e);
            });

            $(window).on('resize.autocomplete', function (e) { that.onKeyPress(e); });

            that.el.on('keydown.autocomplete', function (e) { that.onKeyPress(e); });
            that.el.on('keyup.autocomplete', function (e) { that.onKeyUp(e); });
            //that.el.on('blur.autocomplete', function () { that.onBlur(); });
            that.el.on('focus.autocomplete', function () { that.onFocus(); });
            that.el.on('change.autocomplete', function (e) { that.onKeyUp(e); });
            that.el.on('input.autocomplete', function (e) { that.onKeyUp(e); });

            that.el.on('click', function () {
                if (that.visible && mg_echo_global.isMobile == true) {
                    that.hide();
                    that.el.blur();
                }
            });

        },

        onTriggerClick: function() {
            var that = this;
            that.onValueChange(true);
        },

        onFocus: function () {
            var that = this;
            that.fixPosition();
            if (that.options.minChars === 0) {
                that.onValueChange();
            }
        },

        onBlur: function () {
            this.enableKillerFn();
        },

        abortAjax: function () {
            var that = this;
            if (that.currentRequest) {
                that.currentRequest.abort();
                that.currentRequest = null;
            }
        },

        setOptions: function (suppliedOptions) {
            var that = this,
                options = that.options;

            $.extend(options, suppliedOptions);

            that.isLocal = $.isArray(options.lookup);

            if (that.isLocal) {
                options.lookup = that.verifySuggestionsFormat(options.lookup);
            }

            options.orientation = that.validateOrientation(options.orientation, 'bottom');

            // Adjust height, width and z-index:
            $(that.suggestionsContainer).css({
                'max-height': options.maxHeight + 'px',
                'width': options.width + 'px',
                'z-index': options.zIndex,
                'overflow': options.overflow
            });
        },


        clearCache: function () {
            this.cachedResponse = {};
            this.badQueries = [];
        },

        clear: function () {
            this.clearCache();
            this.currentValue = '';
            this.suggestions = [];
        },

        disable: function () {
            var that = this;
            that.disabled = true;
            clearInterval(that.onChangeInterval);
            that.abortAjax();
        },

        enable: function () {
            this.disabled = false;
        },

        fixPosition: function () {
            // Use only when container has already its content

            var that = this,
                $container = $(that.suggestionsContainer),
                containerParent = $container.parent().get(0);
            // Fix position automatically when appended to body.
            // In other cases force parameter must be given.
            if (mg_echo_global.isMobile && containerParent !== document.body && !that.options.forceFixPosition) {
                $container.css({
                    width: $(containerParent).width() + 2,
                    margin: '5px 0 0 -1px'
                });
                return;
            }

            // Choose orientation
            var orientation = that.options.orientation,
                containerHeight = $container.outerHeight(),
                inputContainer = that.inputContainer,
                height = inputContainer.outerHeight(),
                offset = inputContainer.offset();

            if (that.options.offsetLabel && mg_echo_global.isMobile == false) {
                var labelWidth = inputContainer.find('.mg-echo-label').outerWidth();
                var marginTop = 4;
            } else {
                var labelWidth = 0;
                var marginTop = 1;
            }

            var styles = { 'top': offset.top, 'left': offset.left + labelWidth };

            if (orientation === 'auto') {
                var viewPortHeight = $(window).height(),
                    scrollTop = $(window).scrollTop(),
                    topOverflow = -scrollTop + offset.top - containerHeight,
                    bottomOverflow = scrollTop + viewPortHeight - (offset.top + height + containerHeight);

                orientation = (Math.max(topOverflow, bottomOverflow) === topOverflow) ? 'top' : 'bottom';
            }

            if (orientation === 'top') {
                styles.top += -containerHeight;
            } else {
                styles.top += height;
            }
            styles.top = styles.top + marginTop;

            // If container is not positioned to body,
            // correct its position using offset parent offset
            if(containerParent !== document.body) {
                var opacity = $container.css('opacity'),
                    parentOffsetDiff;

                if (!that.visible){
                    $container.css('opacity', 0).show();
                }

                parentOffsetDiff = $container.offsetParent().offset();
                styles.top -= parentOffsetDiff.top;
                styles.left -= parentOffsetDiff.left;

                if (!that.visible){
                    $container.css('opacity', opacity).hide();
                }
            }

            // -2px to account for suggestions border.
            if (that.options.width === 'auto') {
                styles.width = (inputContainer.outerWidth() - labelWidth - 2) + 'px';
            }

            // fix position for fixed style
            if (that.options.position === 'fixed') {
                styles.top = styles.top - $(document).scrollTop();
            }

            $container.css(styles);
        },

        enableKillerFn: function () {
            var that = this;
            $(document).off('click.autocomplete', that.killerFn);
            $(document).on('click.autocomplete', that.killerFn);
        },

        killSuggestions: function () {
            var that = this;
            that.stopKillSuggestions();
            that.intervalId = window.setInterval(function () {
                if (that.visible) {
                    that.el.val(that.currentValue);
                    that.hide();
                }

                that.stopKillSuggestions();
            }, 50);
        },

        stopKillSuggestions: function () {
            window.clearInterval(this.intervalId);
        },

        isCursorAtEnd: function () {
            var that = this,
                valLength = that.el.val().length,
                selectionStart = that.element.selectionStart,
                range;

            if (typeof selectionStart === 'number') {
                return selectionStart === valLength;
            }
            if (document.selection) {
                range = document.selection.createRange();
                range.moveStart('character', -valLength);
                return valLength === range.text.length;
            }
            return true;
        },

        onKeyPress: function (e) {
            var that = this;

            // If suggestions are hidden and user presses arrow down, display suggestions:
            if (!that.disabled && !that.visible && e.which === keys.DOWN && that.currentValue) {
                that.suggest();
                return;
            }

            if (that.disabled || !that.visible) {
                return;
            }

            switch (e.which) {
                case keys.ESC:
                    that.el.val(that.currentValue);
                    that.hide();
                    break;
                case keys.RIGHT:
                    if (that.hint && that.options.onHint && that.isCursorAtEnd()) {
                        that.selectHint();
                        break;
                    }
                    return;
                case keys.TAB:
                    if (that.hint && that.options.onHint) {
                        that.selectHint();
                        return;
                    }
                    if (that.selectedIndex === -1) {
                        that.hide();
                        return;
                    }
                    that.select(that.selectedIndex);
                    if (that.options.tabDisabled === false) {
                        return;
                    }
                    break;
                case keys.RETURN:
                    if (that.selectedIndex === -1) {
                        that.hide();
                        return;
                    }
                    that.select(that.selectedIndex);
                    break;
                case keys.UP:
                    that.moveUp($(that.suggestionsContainer).find('.autocomplete-selected').prev().data('value'));
                    break;
                case keys.DOWN:
                    that.moveDown($(that.suggestionsContainer).find('.autocomplete-selected').next().data('value'));
                    break;
                default:
                    return;
            }

            // Cancel event if function did not return:
            e.stopImmediatePropagation();
            e.preventDefault();
        },

        onKeyUp: function (e) {
            var that = this;

            if (that.disabled) {
                return;
            }

            switch (e.which) {
                case keys.UP:
                case keys.DOWN:
                    return;
            }

            clearInterval(that.onChangeInterval);

            if (that.currentValue !== that.el.val()) {
                that.findBestHint();
                if (that.options.deferRequestBy > 0) {
                    // Defer lookup in case when value changes very quickly:
                    that.onChangeInterval = setInterval(function () {
                        that.onValueChange();
                    }, that.options.deferRequestBy);
                } else {
                    that.onValueChange();
                }
            }
        },

        onValueChange: function (isTriggerClicked) {
            var that = this,
                options = that.options,
                value = that.el.val(),
                query = that.getQuery(value);

            if (that.selection && that.currentValue !== query) {
                that.selection = null;
                (options.onInvalidateSelection || $.noop).call(that.element);
            }

            clearInterval(that.onChangeInterval);
            that.currentValue = value;
            that.selectedIndex = -1;

            // Check existing suggestion for the match before proceeding:
            if (options.triggerSelectOnValidInput && that.isExactMatch(query)) {
                that.select(0);
                return;
            }

            if (!isTriggerClicked && (query.length < options.minChars)) {
                that.hide();
            } else {
                that.getSuggestions(query);
            }
        },

        isExactMatch: function (query) {
            var suggestions = this.suggestions,
                options = this.options,
                suggestion;

            if(this.suggestions && this.suggestions instanceof Backbone.Collection) {
                suggestion = this.suggestions.at(0);
            } else {
                suggestion = suggestions[0];
            }

            return (suggestions.length === 1 && Autocomplete.getSuggestionValue(suggestion, options).toLowerCase() === query.toLowerCase());
        },

        getQuery: function (value) {
            var delimiter = this.options.delimiter,
                parts;

            if (!delimiter) {
                return value;
            }
            parts = value.split(delimiter);
            return $.trim(parts[parts.length - 1]);
        },

        getSuggestionsLocal: function (query) {
            var that = this,
                options = that.options,
                queryLowerCase = query.toLowerCase(),
                filter = options.lookupFilter,
                limit = parseInt(options.lookupLimit, 10),
                data;

            data = {
                suggestions: $.grep(options.lookup, function (suggestion) {
                    return filter(suggestion, query, queryLowerCase, options);
                })
            };

            if (limit && data.suggestions.length > limit) {
                data.suggestions = data.suggestions.slice(0, limit);
            }

            return data;
        },

        getSuggestions: function (q) {
            var response,
                that = this,
                options = that.options,
                serviceUrl = options.serviceUrl,
                params,
                cacheKey,
                ajaxSettings,
                container = $(that.suggestionsContainer);

            options.params[options.paramName] = q;
            if(options.customParams && Object.keys(options.customParams).length > 0) {
                $.extend(options.params, options.customParams);
            }
            params = options.ignoreParams ? null : options.params;

            if (options.onSearchStart.call(that.element, options.params) === false) {
                return;
            }

            if ($.isFunction(options.lookup)){
                options.lookup(q, function (data) {
                    that.suggestions = data.suggestions;
                    that.suggest();
                    options.onSearchComplete.call(that.element, q, data.suggestions);
                });
                return;
            } else if (options.options && options.options instanceof Backbone.Collection) {
                //If a collection was passed, check if it needs fetching
                var collection = options.options,
                    onCollectionNotEmpty = function(collection) {
                        var result;
                        that.currentRequest = null;
                        result = options.transformResult(collection, q);
                        that.processResponse(result, q, cacheKey);
                        options.onSearchComplete.call(that.element, q, result.suggestions);
                    };

                var fetchConfig = {
                    success: function (collection, response, responseOpts) {
                        container.find('.loadBar').hide();
                        if (response.sphinxError) {
                            that.sphinxError = true;
                            var sphinxErrorContainer = $('<div class="autocomplete-no-suggestion">' +
                                ''+translate('sphinxError')+'.&nbsp;<a class="try-again" href="javascript:void(0)">'+translate('tryAgainBtnText')+'</a>' +
                                '</div>');
                            container.append(sphinxErrorContainer);
                            sphinxErrorContainer.find('.try-again').off().on('click', function () {
                                that.onValueChange();
                            });
                        } else {
                            that.sphinxError = false;
                        }
                        that.el.trigger('fetchSuccess', [response, responseOpts]);

                        if (mg_echo_global.getBookingConfig('isGooglePlacesSearch') && that.options.isAddress) {
                            mg_echo_global.googlePlaces.autocompleteService.getPlacePredictions(
                                {
                                    input: q,
                                    bounds: mg_echo_global.googlePlaces.defaultBounds,
                                    componentRestrictions: {
                                        country: 'ES'
                                    }
                                },
                                function (res, status) {
                                    if (res) {
                                        $.each(res, function (i, googlePlace) {
                                            collection.add(
                                                new Magenta.Echo.InlineBooking.Models.Address({
                                                    address: googlePlace.description,
                                                    details: googlePlace.description,
                                                    id: googlePlace.id,
                                                    googlePlacesId: googlePlace.place_id,
                                                    sourceType: "GOOGLE_PLACES"
                                                })
                                            );
                                        });
                                    }
                                    onCollectionNotEmpty(collection);
                                }
                            );
                        } else {
                            onCollectionNotEmpty(collection);
                        }
                    },
                    error: function(collection, response, responseOpts) {
                        that.el.trigger('fetchError', [response, responseOpts]);
                    },
                    data: params
                };
                if(options.fetchConfig) {
                    $.extend(true /*deep extend*/, fetchConfig, options.fetchConfig);
                }

                that.el.trigger('beforeFetch');

                // Если поиск адреса, то добавляем специальный лоадер
                if (container.hasClass('autocomplete-suggestions-address')) {
                    container.html('<div class="autocomplete-no-suggestion loadBar">' + translate('fetchingAddresses') + '</div>');
                    container.show();
                }

                collection.fetch(fetchConfig);
                return;
            }
            if (that.isLocal) {
                response = that.getSuggestionsLocal(q);
            } else {
                if ($.isFunction(serviceUrl)) {
                    serviceUrl = serviceUrl.call(that.element, q);
                }
                cacheKey = serviceUrl + '?' + $.param(params || {});
                response = that.cachedResponse[cacheKey];
            }

            if (response && $.isArray(response.suggestions)) {
                that.suggestions = response.suggestions;
                that.suggest();
                options.onSearchComplete.call(that.element, q, response.suggestions);
            } else if (!that.isBadQuery(q)) {
                that.abortAjax();

                ajaxSettings = {
                    url: serviceUrl,
                    data: params,
                    type: options.type,
                    dataType: options.dataType
                };

                $.extend(ajaxSettings, options.ajaxSettings);

                that.currentRequest = $.ajax(ajaxSettings).done(function (data) {
                    var result;
                    that.currentRequest = null;
                    result = options.transformResult(data, q);
                    that.processResponse(result, q, cacheKey);
                    options.onSearchComplete.call(that.element, q, result.suggestions);
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    options.onSearchError.call(that.element, q, jqXHR, textStatus, errorThrown);
                });
            } else {
                options.onSearchComplete.call(that.element, q, []);
            }
        },

        isBadQuery: function (q) {
            if (!this.options.preventBadQueries){
                return false;
            }

            var badQueries = this.badQueries,
                i = badQueries.length;

            while (i--) {
                if (q.indexOf(badQueries[i]) === 0) {
                    return true;
                }
            }

            return false;
        },

        hide: function () {
            var that = this,
                container = $(that.suggestionsContainer);

            if ($.isFunction(that.options.onHide) && that.visible) {
                that.options.onHide.call(that.element, container);
            }

            that.visible = false;
            that.selectedIndex = -1;
            clearInterval(that.onChangeInterval);
            $(that.suggestionsContainer).hide();
            that.signalHint(null);

            // delete focus field container
            that.el.closest('.field-container-wrapper').removeClass('mg-echo-focus');
        },

        suggest: function () {
            if (this.suggestions.length === 0) {
                if (this.options.showNoSuggestionNotice) {
                    this.noSuggestions();
                } else {
                    this.hide();
                }
                return;
            }

            var that = this,
                options = that.options,
                groupBy = options.groupBy,
                formatResult = options.formatResult,
                value = that.getQuery(that.currentValue),
                className = that.classes.suggestion,
                classSelected = that.classes.selected,
                container = $(that.suggestionsContainer),
                noSuggestionsContainer = $(that.noSuggestionsContainer),
                beforeRender = options.beforeRender,
                html = '',
                category,
                formatGroup = function (suggestion, index) {
                    var currentCategory = suggestion.data[groupBy];

                    if (category === currentCategory){
                        return '';
                    }

                    category = currentCategory;

                    return '<div class="autocomplete-group"><strong>' + category + '</strong></div>';
                };

            if (options.triggerSelectOnValidInput && that.isExactMatch(value)) {
                that.select(0);
                return;
            }

            if(that.suggestions instanceof Backbone.Collection) {
                var i = 0;
                that.suggestions.each(function(model) {
                    html += '<div class="' + className + '" data-index="' + i + '" data-value="' + model.toString() + '">' + ((typeof model.getItem != "undefined")?model.getItem():model.toString()) + '</div>';
                    i++;
                });

            }  else {
                // Build suggestions inner HTML:
                $.each(that.suggestions, function (i, suggestion) {
                    if (groupBy) {
                        html += formatGroup(suggestion, value, i);
                    }

                    html += '<div class="' + className + '" data-index="' + i + '">' + formatResult(suggestion, value, options) + '</div>';
                });
            }

            this.adjustContainerWidth();

            noSuggestionsContainer.detach();
            container.find('.autocomplete-suggestion').remove();
            container.append(html);

            // Если поиск через Google Places API, то добавляем логотип Google
            if (mg_echo_global.getBookingConfig('isGooglePlacesSearch') && that.options.isAddress) {
                container.append('<div class="powered_by_google"></div>');
            }

            if ($.isFunction(beforeRender)) {
                beforeRender.call(that.element, container);
            }

            that.fixPosition();
            container.show();

            // add focus field container
            that.el.closest('.field-container-wrapper').addClass('mg-echo-focus');

            // Select first value by default:
            if (options.autoSelectFirst) {
                that.selectedIndex = 0;
                container.scrollTop(0);
                container.children('.' + className).first().addClass(classSelected);
            }

            //
            that.updateSelectedSuggestion();

            that.visible = true;
            that.findBestHint();
        },

        updateSelectedSuggestion: function() {
            var that = this;
            $.each($(this.suggestionsContainer).find('.autocomplete-suggestion'), function(key, item) {
                $(item).removeClass('selected');

                if (that.getValue() instanceof Backbone.Model && $(item).attr('data-value') == that.getValue().toString()) {
                    $(item).addClass('selected');
                }
            });
        },

        noSuggestions: function() {
            var that = this,
                container = $(that.suggestionsContainer),
                noSuggestionsContainer = $(that.noSuggestionsContainer);

            if (that.sphinxError) {
                return;
            }

            this.adjustContainerWidth();

            // Some explicit steps. Be careful here as it easy to get
            // noSuggestionsContainer removed from DOM if not detached properly.
            noSuggestionsContainer.detach();
            container.empty(); // clean suggestions if any
            container.append(noSuggestionsContainer);

            that.fixPosition();

            container.show();
            that.visible = true;
        },

        adjustContainerWidth: function() {
            var that = this,
                options = that.options,
                width,
                container = $(that.suggestionsContainer);

            // If width is auto, adjust width before displaying suggestions,
            // because if instance was created before input had width, it will be zero.
            // Also it adjusts if input width has changed.
            // -2px to account for suggestions border.
            if (options.width === 'auto') {
                width = that.el.outerWidth() - 2;
                container.width(width > 0 ? width : 300);
            }
        },

        findBestHint: function () {
            var that = this,
                options = that.options,
                value = that.el.val().toLowerCase(),
                bestMatch = null;

            if (!value) {
                return;
            }

            if(that.suggestions && that.suggestions instanceof Backbone.Collection) {
                that.suggestions.each(function(model) {
                    var foundMatch = Autocomplete.getSuggestionValue(model, options).toLowerCase().indexOf(value) === 0;
                    if (foundMatch) {
                        bestMatch = model;
                    }
                    return !foundMatch;
                });
            } else {
                $.each(that.suggestions, function (i, suggestion) {
                    var foundMatch = Autocomplete.getSuggestionValue(suggestion, options).toLowerCase().indexOf(value) === 0;
                    if (foundMatch) {
                        bestMatch = suggestion;
                    }
                    return !foundMatch;
                });
            }

            that.signalHint(bestMatch);
        },

        signalHint: function (suggestion) {
            var hintValue = '',
                that = this,
                options = that.options;
            if (suggestion) {
                hintValue = that.currentValue + Autocomplete.getSuggestionValue(suggestion, options).substr(that.currentValue.length);
            }
            if (that.hintValue !== hintValue) {
                that.hintValue = hintValue;
                that.hint = suggestion;
                (this.options.onHint || $.noop)(hintValue);
            }
        },

        verifySuggestionsFormat: function (suggestions) {
            // If suggestions is string array, convert them to supported format:
            if (suggestions.length && typeof suggestions[0] === 'string') {
                return $.map(suggestions, function (value) {
                    return { value: value, data: null };
                });
            }

            return suggestions;
        },

        validateOrientation: function(orientation, fallback) {
            orientation = $.trim(orientation || '').toLowerCase();

            if($.inArray(orientation, ['auto', 'bottom', 'top']) === -1){
                orientation = fallback;
            }

            return orientation;
        },

        processResponse: function (result, originalQuery, cacheKey) {
            var that = this,
                options = that.options,
                suggestions = result;

            if(result instanceof Backbone.Collection) {
                // do nothing
            }  else {
                //todo: add normal response handler
                if (!result.success) {
                    log('ajax autocomplete post request is unsuccessful');
                    return;
                }

                var suggestions = that.verifySuggestionsFormat(result.rows);

                // Cache results if cache is not disabled:
                if (!options.noCache) {
                    that.cachedResponse[cacheKey] = result;
                    if (options.preventBadQueries && suggestions.length === 0) {
                        that.badQueries.push(originalQuery);
                    }
                }
            }

            // Return if originalQuery is not matching current query:
            if (originalQuery !== that.getQuery(that.currentValue)) {
                return;
            }

            that.suggestions = suggestions;
            that.suggest();
        },

        activate: function (index, selectedText) {
            var that = this,
                activeItem,
                selected = that.classes.selected,
                container = $(that.suggestionsContainer),
                children = container.find('.' + that.classes.suggestion);

            container.find('.' + selected).removeClass(selected);

            if(this.suggestions && this.suggestions instanceof Backbone.Collection) {
                activeItem = that.getSuggestionItem(children, selectedText);
            }

            that.selectedIndex = index;

            if ((that.selectedIndex !== -1 && children.length > that.selectedIndex) || activeItem) {
                activeItem = activeItem || children.get(that.selectedIndex);
                $(activeItem).addClass(selected);
                return activeItem;
            }

            return null;
        },

        getSuggestionItem: function(items, text) {
            if(!items || (!text && text !== 0)) {
                return;
            }

            var result = [];
            items.each(function(index) {
                if(text == $(this).text()) {
                    result.push($(this));
                }
            });
            if(result.length == 0 ){
                log("getSuggestionItem: no result found for text : " + "'" + text + "'");
                return;
            }
            if(result.length > 1) {
                log("getSuggestionItem: more than 1 result matches text: " + "'" + text + "'");
            }
            return result[0];
        },

        selectHint: function () {
            var that = this,
                i = $.inArray(that.hint, that.suggestions);

            that.select(i);
        },

        select: function (i, selectedText) {
            var that = this;
            that.hide();
            that.onSelect(i, selectedText);
        },

        moveUp: function (selectedText) {
            var that = this;

            if (that.selectedIndex === -1) {
                return;
            }


            if(this.suggestions && this.suggestions instanceof Backbone.Collection) {
                //var selectedModel = that.findModel(selectedText);
            } else {
                //todo: what to do here when use Backbone collection?
                if (that.selectedIndex === 0) {
                    $(that.suggestionsContainer).children().first().removeClass(that.classes.selected);
                    that.selectedIndex = -1;
                    that.el.val(that.currentValue);
                    that.findBestHint();
                    return;
                }
            }

            that.adjustScroll(that.selectedIndex - 1, selectedText);
        },

        moveDown: function (selectedText) {
            var that = this;

            if (that.selectedIndex === (that.suggestions.length - 1)) {
                return;
            }

            that.adjustScroll(that.selectedIndex + 1, selectedText);
        },

        adjustScroll: function (index, selectedText) {
            var that = this,
                options = that.options,
                activeItem = that.activate(index, selectedText);

            if (!activeItem) {
                return;
            }

            var offsetTop,
                upperBound,
                lowerBound,
                heightDelta = $(activeItem).outerHeight();

            offsetTop = activeItem[0]? activeItem[0].offsetTop : activeItem.offsetTop;
            upperBound = $(that.suggestionsContainer).scrollTop();
            lowerBound = upperBound + that.options.maxHeight - heightDelta;

            if (offsetTop < upperBound) {
                $(that.suggestionsContainer).scrollTop(offsetTop);
            } else if (offsetTop > lowerBound) {
                $(that.suggestionsContainer).scrollTop(offsetTop - that.options.maxHeight + heightDelta);
            }

            if (!that.options.preserveInput) {
                var suggestion;
                suggestion = that.suggestions.models[index];
                that.el.val(that._getValue(Autocomplete.getSuggestionValue(suggestion, options)));
            }
            that.signalHint(null);
        },

        onSelect: function (index, selectedText) {
            var that = this,
                options = that.options,
                onSelectCallback = that.options.onSelect,
                suggestion;

            suggestion = that.suggestions.models[index];

            that.currentValue = that._getValue(Autocomplete.getSuggestionValue(suggestion, options));

            if (that.currentValue !== that.el.val() && !that.options.preserveInput) {
                that.el.val(that.currentValue);
                if ((typeof suggestion.setValue != "undefined")) {
                    suggestion.setValue(that);
                }
            }

            that.signalHint(null);
            //todo:check if the next comment will not crash everything
            //that.suggestions = [];

            // Если поиск через Google Places API, то запрашиваем координаты
            if (
                suggestion.get('googlePlacesId')
                && mg_echo_global.getBookingConfig('isGooglePlacesSearch')
                && that.options.isAddress
            ) {
                mg_echo_global.googlePlaces.placesService.getDetails({
                    placeId: suggestion.get('googlePlacesId')
                }, function (res, status) {
                    if (status != "OK") return;
                    suggestion.set('latitude', res.geometry.location.lat());
                    suggestion.set('longitude', res.geometry.location.lng());
                    suggestion.set('id', -1);

                    that.selection = suggestion;

                    if ($.isFunction(onSelectCallback)) {
                        onSelectCallback.call(that.element, suggestion);
                    }
                });
            } else {

                that.selection = suggestion;

                if ($.isFunction(onSelectCallback)) {
                    onSelectCallback.call(that.element, suggestion);
                }
            }
        },

        setValue: function(value) {
            if($.type(value) === "string") {
                this.currentValue = value;
            } else {
                this.currentValue = this._getValue(Autocomplete.getSuggestionValue(value, this.options));
            }
            this.el.val(this.currentValue);
            if ((typeof value.setValue != "undefined")) {
                value.setValue(this);
            }
            this.rawRecord = value;
        },

        findModel: function(val) {
            var that = this;
            if(!val && val !== 0) {
                return;
            }
            if(this.suggestions && this.suggestions instanceof Backbone.Collection) {
                var result = [];
                this.suggestions.each(function(model) {
                    if(model.toString() == val) {
                        result.push(that.clone(model));
                    }
                });
                if(result.length == 0 ){
                    log("findModel: no result found for query : " + "'" + val + "'");
                    return;
                }
                if(result.length > 1) {
                    log("findModel: more than 1 result matches the query: " + "'" + val + "'");
                }
                return result[0];
            }
        },

        clone: function(model) {
            return new model.constructor($.extend(true, {}, model.attributes));
        },

        _getValue: function (value) {
            var that = this,
                delimiter = that.options.delimiter,
                currentValue,
                parts;

            if(that.suggestions && that.suggestions instanceof Backbone.Collection) {
                return value;
            }

            if (!delimiter) {
                return value;
            }

            currentValue = that.currentValue;
            parts = currentValue.split(delimiter);

            if (parts.length === 1) {
                return value;
            }

            return currentValue.substr(0, currentValue.length - parts[parts.length - 1].length) + value;
        },

        getRawValue: function() {
            return this.el.val() || this.currentValue;
        },

        //todo: move to editor
        getValue: function() {
            var value = this.getRawValue();
            if (value || value === 0) {
                var recordValue = this.findModel(value);
                if (!recordValue) {
                    if (this.rawRecord && this.rawRecord instanceof Backbone.Model &&
                        this.rawRecord.toString() == value) {
                        value = this.rawRecord;
                    }
                    else {
                        value = this.options.allowTextValue ? value : null;
                    }
                }
                else {
                    value = recordValue;
                }
            }
            return value;
        },

        dispose: function () {
            var that = this;
            that.el.off('.autocomplete').removeData('autocomplete');
            $(window).off('resize.autocomplete', that.fixPositionCapture);
            $(that.suggestionsContainer).remove();
        }
    };

    // Create chainable jQuery plugin:
    $.fn.autocomplete = $.fn.devbridgeAutocomplete = function (options, args) {
        var dataKey = 'autocomplete';
        // If function invoked without argument return
        // instance of the first matched element:
        if (arguments.length === 0) {
            return this.first().data(dataKey);
        }

        return this.each(function () {
            var inputElement = $(this),
                instance = inputElement.data(dataKey);

            if (typeof options === 'string') {
                if (instance && typeof instance[options] === 'function') {
                    instance[options](args);
                }
            } else {
                // If instance already exists, destroy it:
                if (instance && instance.dispose) {
                    instance.dispose();
                }
                instance = new Autocomplete(this, options);
                inputElement.data(dataKey, instance);
            }
        });
    };
}, window || global || this));
