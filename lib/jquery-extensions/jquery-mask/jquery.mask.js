/**
 * jquery.mask.js
 * @version: v1.14.0
 * @author: Igor Escobar
 *
 * Created by Igor Escobar on 2012-03-10. Please report any bug at http://blog.igorescobar.com
 *
 * Copyright (c) 2012 Igor Escobar http://blog.igorescobar.com
 *
 * The MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/*
 Modified by Evgeniy Kalibrov:
 I rename all occurrences "mask" to "maskin"
 I rename all occurrences "Mask" to "Maskin"
*/

/* jshint laxbreak: true */
/* global define, jQuery, Zepto */

'use strict';

// UMD (Universal Module Definition) patterns for JavaScript modules that work everywhere.
// https://github.com/umdjs/umd/blob/master/jqueryPluginCommonjs.js
(function (factory) {

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery || Zepto);
    }

}(function ($) {

    var Maskin = function (el, maskin, options) {

        var p = {
            invalid: [],
            getCaret: function () {
                try {
                    var sel,
                        pos = 0,
                        ctrl = el.get(0),
                        dSel = document.selection,
                        cSelStart = ctrl.selectionStart;

                    // IE Support
                    if (dSel && navigator.appVersion.indexOf('MSIE 10') === -1) {
                        sel = dSel.createRange();
                        sel.moveStart('character', -p.val().length);
                        pos = sel.text.length;
                    }
                    // Firefox support
                    else if (cSelStart || cSelStart === '0') {
                        pos = cSelStart;
                    }

                    return pos;
                } catch (e) {}
            },
            setCaret: function(pos) {
                try {
                    if (el.is(':focus')) {
                        var range, ctrl = el.get(0);

                        // Firefox, WebKit, etc..
                        if (ctrl.setSelectionRange) {
                            ctrl.focus();
                            ctrl.setSelectionRange(pos, pos);
                        } else { // IE
                            range = ctrl.createTextRange();
                            range.collapse(true);
                            range.moveEnd('character', pos);
                            range.moveStart('character', pos);
                            range.select();
                        }
                    }
                } catch (e) {}
            },
            events: function() {
                el
                .on('keydown.maskin', function(e) {
                    el.data('maskin-keycode', e.keyCode || e.which);
                })
                .on($.jMaskinGlobals.useInput ? 'input.maskin' : 'keyup.maskin', p.behaviour)
                .on('paste.maskin drop.maskin', function() {
                    setTimeout(function() {
                        el.keydown().keyup();
                    }, 100);
                })
                .on('change.maskin', function(){
                    el.data('changed', true);
                })
                .on('blur.maskin', function(){
                    if (oldValue !== p.val() && !el.data('changed')) {
                        el.trigger('change');
                    }
                    el.data('changed', false);
                })
                // it's very important that this callback remains in this position
                // otherwhise oldValue it's going to work buggy
                .on('blur.maskin', function() {
                    oldValue = p.val();
                })
                // select all text on focus
                .on('focus.maskin', function (e) {
                    if (options.selectOnFocus === true) {
                        $(e.target).select();
                    }
                })
                // clear the value if it not complete the maskin
                .on('focusout.maskin', function() {
                    if (options.clearIfNotMatch && !regexMaskin.test(p.val())) {
                       p.val('');
                   }
                });
            },
            getRegexMaskin: function() {
                var maskinChunks = [], translation, pattern, optional, recursive, oRecursive, r;

                for (var i = 0; i < maskin.length; i++) {
                    translation = jMaskin.translation[maskin.charAt(i)];

                    if (translation) {

                        pattern = translation.pattern.toString().replace(/.{1}$|^.{1}/g, '');
                        optional = translation.optional;
                        recursive = translation.recursive;

                        if (recursive) {
                            maskinChunks.push(maskin.charAt(i));
                            oRecursive = {digit: maskin.charAt(i), pattern: pattern};
                        } else {
                            maskinChunks.push(!optional && !recursive ? pattern : (pattern + '?'));
                        }

                    } else {
                        maskinChunks.push(maskin.charAt(i).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
                    }
                }

                r = maskinChunks.join('');

                if (oRecursive) {
                    r = r.replace(new RegExp('(' + oRecursive.digit + '(.*' + oRecursive.digit + ')?)'), '($1)?')
                         .replace(new RegExp(oRecursive.digit, 'g'), oRecursive.pattern);
                }

                return new RegExp(r);
            },
            destroyEvents: function() {
                el.off(['input', 'keydown', 'keyup', 'paste', 'drop', 'blur', 'focusout', ''].join('.maskin '));
            },
            val: function(v) {
                var isInput = el.is('input'),
                    method = isInput ? 'val' : 'text',
                    r;

                if (arguments.length > 0) {
                    if (el[method]() !== v) {
                        el[method](v);
                    }
                    r = el;
                } else {
                    r = el[method]();
                }

                return r;
            },
            getMCharsBeforeCount: function(index, onCleanVal) {
                for (var count = 0, i = 0, maskinL = maskin.length; i < maskinL && i < index; i++) {
                    if (!jMaskin.translation[maskin.charAt(i)]) {
                        index = onCleanVal ? index + 1 : index;
                        count++;
                    }
                }
                return count;
            },
            caretPos: function (originalCaretPos, oldLength, newLength, maskinDif) {
                var translation = jMaskin.translation[maskin.charAt(Math.min(originalCaretPos - 1, maskin.length - 1))];

                return !translation ? p.caretPos(originalCaretPos + 1, oldLength, newLength, maskinDif)
                                    : Math.min(originalCaretPos + newLength - oldLength - maskinDif, newLength);
            },
            behaviour: function(e) {
                e = e || window.event;
                p.invalid = [];

                var keyCode = el.data('maskin-keycode');

                if ($.inArray(keyCode, jMaskin.byPassKeys) === -1) {
                    var caretPos    = p.getCaret(),
                        currVal     = p.val(),
                        currValL    = currVal.length,
                        newVal      = p.getMaskined(),
                        newValL     = newVal.length,
                        maskinDif     = p.getMCharsBeforeCount(newValL - 1) - p.getMCharsBeforeCount(currValL - 1),
                        changeCaret = caretPos < currValL;

                    p.val(newVal);

                    if (changeCaret) {
                        // Avoid adjusting caret on backspace or delete
                        if (!(keyCode === 8 || keyCode === 46)) {
                            caretPos = p.caretPos(caretPos, currValL, newValL, maskinDif);
                        }
                        p.setCaret(caretPos);
                    }

                    return p.callbacks(e);
                }
            },
            getMaskined: function(skipMaskinChars, val) {
                var buf = [],
                    value = val === undefined ? p.val() : val + '',
                    m = 0, maskinLen = maskin.length,
                    v = 0, valLen = value.length,
                    offset = 1, addMethod = 'push',
                    resetPos = -1,
                    lastMaskinChar,
                    check;

                if (options.reverse) {
                    addMethod = 'unshift';
                    offset = -1;
                    lastMaskinChar = 0;
                    m = maskinLen - 1;
                    v = valLen - 1;
                    check = function () {
                        return m > -1 && v > -1;
                    };
                } else {
                    lastMaskinChar = maskinLen - 1;
                    check = function () {
                        return m < maskinLen && v < valLen;
                    };
                }

                while (check()) {
                    var maskinDigit = maskin.charAt(m),
                        valDigit = value.charAt(v),
                        translation = jMaskin.translation[maskinDigit];

                    if (translation) {
                        if (valDigit.match(translation.pattern)) {
                            buf[addMethod](valDigit);
                             if (translation.recursive) {
                                if (resetPos === -1) {
                                    resetPos = m;
                                } else if (m === lastMaskinChar) {
                                    m = resetPos - offset;
                                }

                                if (lastMaskinChar === resetPos) {
                                    m -= offset;
                                }
                            }
                            m += offset;
                        } else if (translation.optional) {
                            m += offset;
                            v -= offset;
                        } else if (translation.fallback) {
                            buf[addMethod](translation.fallback);
                            m += offset;
                            v -= offset;
                        } else {
                          p.invalid.push({p: v, v: valDigit, e: translation.pattern});
                        }
                        v += offset;
                    } else {
                        if (!skipMaskinChars) {
                            buf[addMethod](maskinDigit);
                        }

                        if (valDigit === maskinDigit) {
                            v += offset;
                        }

                        m += offset;
                    }
                }

                var lastMaskinCharDigit = maskin.charAt(lastMaskinChar);
                if (maskinLen === valLen + 1 && !jMaskin.translation[lastMaskinCharDigit]) {
                    buf.push(lastMaskinCharDigit);
                }

                return buf.join('');
            },
            callbacks: function (e) {
                var val = p.val(),
                    changed = val !== oldValue,
                    defaultArgs = [val, e, el, options],
                    callback = function(name, criteria, args) {
                        if (typeof options[name] === 'function' && criteria) {
                            options[name].apply(this, args);
                        }
                    };

                callback('onChange', changed === true, defaultArgs);
                callback('onKeyPress', changed === true, defaultArgs);
                callback('onComplete', val.length === maskin.length, defaultArgs);
                callback('onInvalid', p.invalid.length > 0, [val, e, el, p.invalid, options]);
            }
        };

        el = $(el);
        var jMaskin = this, oldValue = p.val(), regexMaskin;

        maskin = typeof maskin === 'function' ? maskin(p.val(), undefined, el,  options) : maskin;


        // public methods
        jMaskin.maskin = maskin;
        jMaskin.options = options;
        jMaskin.remove = function() {
            var caret = p.getCaret();
            p.destroyEvents();
            p.val(jMaskin.getCleanVal());
            p.setCaret(caret - p.getMCharsBeforeCount(caret));
            return el;
        };

        // get value without maskin
        jMaskin.getCleanVal = function() {
           return p.getMaskined(true);
        };

        // get maskined value without the value being in the input or element
        jMaskin.getMaskinedVal = function(val) {
           return p.getMaskined(false, val);
        };

       jMaskin.init = function(onlyMaskin) {
            onlyMaskin = onlyMaskin || false;
            options = options || {};

            jMaskin.clearIfNotMatch  = $.jMaskinGlobals.clearIfNotMatch;
            jMaskin.byPassKeys       = $.jMaskinGlobals.byPassKeys;
            jMaskin.translation      = $.extend({}, $.jMaskinGlobals.translation, options.translation);

            jMaskin = $.extend(true, {}, jMaskin, options);

            regexMaskin = p.getRegexMaskin();

            if (onlyMaskin === false) {

                if (options.placeholder) {
                    el.attr('placeholder' , options.placeholder);
                }

                // this is necessary, otherwise if the user submit the form
                // and then press the "back" button, the autocomplete will erase
                // the data. Works fine on IE9+, FF, Opera, Safari.
                if (el.data('maskin')) {
                  el.attr('autocomplete', 'off');
                }

                p.destroyEvents();
                p.events();

                var caret = p.getCaret();
                p.val(p.getMaskined());
                p.setCaret(caret + p.getMCharsBeforeCount(caret, true));

            } else {
                p.events();
                p.val(p.getMaskined());
            }
        };

        jMaskin.init(!el.is('input'));
    };

    $.maskinWatchers = {};
    var HTMLAttributes = function () {
        var input = $(this),
            options = {},
            prefix = 'data-maskin-',
            maskin = input.attr('data-maskin');

        if (input.attr(prefix + 'reverse')) {
            options.reverse = true;
        }

        if (input.attr(prefix + 'clearifnotmatch')) {
            options.clearIfNotMatch = true;
        }

        if (input.attr(prefix + 'selectonfocus') === 'true') {
           options.selectOnFocus = true;
        }

        if (notSameMaskinObject(input, maskin, options)) {
            return input.data('maskin', new Maskin(this, maskin, options));
        }
    },
    notSameMaskinObject = function(field, maskin, options) {
        options = options || {};
        var maskinObject = $(field).data('maskin'),
            stringify = JSON.stringify,
            value = $(field).val() || $(field).text();
        try {
            if (typeof maskin === 'function') {
                maskin = maskin(value);
            }
            return typeof maskinObject !== 'object' || stringify(maskinObject.options) !== stringify(options) || maskinObject.maskin !== maskin;
        } catch (e) {}
    },
    eventSupported = function(eventName) {
        var el = document.createElement('div'), isSupported;

        eventName = 'on' + eventName;
        isSupported = (eventName in el);

        if ( !isSupported ) {
            el.setAttribute(eventName, 'return;');
            isSupported = typeof el[eventName] === 'function';
        }
        el = null;

        return isSupported;
    };

    $.fn.maskin = function(maskin, options) {
        options = options || {};
        var selector = this.selector,
            globals = $.jMaskinGlobals,
            interval = globals.watchInterval,
            watchInputs = options.watchInputs || globals.watchInputs,
            maskinFunction = function() {
                if (notSameMaskinObject(this, maskin, options)) {
                    return $(this).data('maskin', new Maskin(this, maskin, options));
                }
            };

        $(this).each(maskinFunction);

        if (selector && selector !== '' && watchInputs) {
            clearInterval($.maskinWatchers[selector]);
            $.maskinWatchers[selector] = setInterval(function(){
                $(document).find(selector).each(maskinFunction);
            }, interval);
        }
        return this;
    };

    $.fn.maskined = function(val) {
        return this.data('maskin').getMaskinedVal(val);
    };

    $.fn.unmaskin = function() {
        clearInterval($.maskinWatchers[this.selector]);
        delete $.maskinWatchers[this.selector];
        return this.each(function() {
            var dataMaskin = $(this).data('maskin');
            if (dataMaskin) {
                dataMaskin.remove().removeData('maskin');
            }
        });
    };

    $.fn.cleanVal = function() {
        return this.data('maskin').getCleanVal();
    };

    $.applyDataMaskin = function(selector) {
        selector = selector || $.jMaskinGlobals.maskinElements;
        var $selector = (selector instanceof $) ? selector : $(selector);
        $selector.filter($.jMaskinGlobals.dataMaskinAttr).each(HTMLAttributes);
    };

    var globals = {
        maskinElements: 'input,td,span,div',
        dataMaskinAttr: '*[data-maskin]',
        dataMaskin: true,
        watchInterval: 300,
        watchInputs: true,
        useInput: eventSupported('input'),
        watchDataMaskin: false,
        byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
        translation: {
            '0': {pattern: /\d/},
            '9': {pattern: /\d/, optional: true},
            '#': {pattern: /\d/, recursive: true},
            'A': {pattern: /[a-zA-Z0-9]/},
            'S': {pattern: /[a-zA-Z]/}
        }
    };

    $.jMaskinGlobals = $.jMaskinGlobals || {};
    globals = $.jMaskinGlobals = $.extend(true, {}, globals, $.jMaskinGlobals);

    // looking for inputs with data-maskin attribute
    if (globals.dataMaskin) {
        $.applyDataMaskin();
    }

    setInterval(function() {
        if ($.jMaskinGlobals.watchDataMaskin) {
            $.applyDataMaskin();
        }
    }, globals.watchInterval);
}));
