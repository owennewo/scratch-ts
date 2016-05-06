System.register([], function(exports_1) {
    var ReadStream;
    return {
        setters:[],
        execute: function() {
            /**
             * A simple character stream with two character look-ahead and tokenization.
             *
             * John Maloney, October 2009
             */
            ReadStream = (function () {
                function ReadStream(s) {
                    this.src = s;
                    this.i = 0;
                }
                ReadStream.prototype.atEnd = function () {
                    return this.i >= this.src.length;
                };
                ReadStream.prototype.next = function () {
                    if (this.i >= this.src.length)
                        return "";
                    return this.src.charAt(this.i++);
                };
                ReadStream.prototype.peek = function () {
                    return (this.i < this.src.length) ? this.src.charAt(this.i) : "";
                };
                ReadStream.prototype.peek2 = function () {
                    return ((this.i + 1) < this.src.length) ? this.src.charAt(this.i + 1) : "";
                };
                ReadStream.prototype.peekString = function (n) { return this.src.slice(this.i, this.i + n); };
                ReadStream.prototype.nextString = function (n) {
                    this.i += n;
                    return this.src.slice(this.i - n, this.i);
                };
                ReadStream.prototype.pos = function () { return this.i; };
                ReadStream.prototype.setPos = function (newPos) { this.i = newPos; };
                ReadStream.prototype.skip = function (count) { this.i += count; };
                ReadStream.prototype.skipWhiteSpace = function () {
                    while ((this.i < this.src.length) && (this.src.charCodeAt(this.i) <= 32))
                        this.i++;
                };
                ReadStream.prototype.upToEnd = function () {
                    var result = (this.i < this.src.length) ? this.src.slice(this.i, this.src.length) : "";
                    this.i = this.src.length;
                    return result;
                };
                ReadStream.tokenize = function (s) {
                    var stream = new ReadStream(s);
                    var result = [];
                    while (!stream.atEnd()) {
                        var token = stream.nextToken();
                        if (token.length > 0)
                            result.push(token);
                    }
                    return result;
                };
                ReadStream.prototype.nextToken = function () {
                    this.skipWhiteSpace();
                    if (this.atEnd())
                        return "";
                    var token = "";
                    var isArg;
                    var start = this.i;
                    while (this.i < this.src.length) {
                        if (this.src.charCodeAt(this.i) <= 32)
                            break;
                        var ch = this.src.charAt(this.i);
                        if (ch === "\\") {
                            token += ch + this.src.charAt(this.i + 1);
                            this.i += 2;
                            continue;
                        }
                        if (ch === "%") {
                            if (this.i > start)
                                break; // percent sign starts new token
                            isArg = true;
                        }
                        // certain punctuation marks following an argument start a new token
                        // example: 'touching %m?' (question mark after arg starts a new token) vs. 'loud?' (doesn't)
                        if (isArg && (ch === "?" || ch === "-"))
                            break;
                        token += ch;
                        this.i++;
                    }
                    return token;
                };
                ReadStream.escape = function (s) {
                    return s.replace(/[\\%@]/g, "\\$&");
                };
                ReadStream.unescape = function (s) {
                    var result = "";
                    for (var i = 0; i < s.length; i++) {
                        var ch = s.charAt(i);
                        if (ch === "\\") {
                            result += s.charAt(i + 1);
                            i++;
                        }
                        else {
                            result += ch;
                        }
                    }
                    return result;
                };
                return ReadStream;
            })();
            exports_1("ReadStream", ReadStream);
        }
    }
});
//# sourceMappingURL=read.stream.js.map