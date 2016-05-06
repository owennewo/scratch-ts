System.register([], function(exports_1) {
    var StringUtils;
    return {
        setters:[],
        execute: function() {
            StringUtils = (function () {
                function StringUtils() {
                }
                /**
                 * format('My {animal} is named {name}.', {animal:'goat',name:'Eric'}) => 'My goat is named Eric.'
                     * Tokens not contained in the dictionary will not be modified.
                 */
                StringUtils.substitute = function (s, context) {
                    for (var token in context) {
                        s = s.replace("{" + token + "}", context[token]);
                    }
                    return s;
                };
                return StringUtils;
            })();
            exports_1("StringUtils", StringUtils);
        }
    }
});
//# sourceMappingURL=stringutils.js.map