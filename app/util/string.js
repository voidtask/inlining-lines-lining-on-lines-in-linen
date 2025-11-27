StringUtils = (function() {

    this.formatRe      = /\{(\d+)\}/g;

    this.format = function (format) {
        var args = Array.from(arguments);
        args.shift();
        return format.replace(this.formatRe, function (m, i) {
            return args[i];
        });
    }

    return this;

})();