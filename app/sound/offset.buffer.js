// Provides the equivalent functionality of an AS ByteArray
// using JavaScript ArrayBuffers and viewers
System.register([], function(exports_1) {
    var OffsetBuffer;
    return {
        setters:[],
        execute: function() {
            OffsetBuffer = (function () {
                function OffsetBuffer(data) {
                    this.offset = 0;
                    this.ab = data;
                }
                // Read various datatypes from the ArrayBuffer, seeking the offset.
                OffsetBuffer.prototype.readString = function (length) {
                    var str = this.ab2str(this.ab.slice(this.offset, this.offset + length));
                    this.offset += length;
                    return str;
                };
                OffsetBuffer.prototype.readInt = function () {
                    var num = this.ab2int(this.ab.slice(this.offset, this.offset + 4));
                    this.offset += 4;
                    return num;
                };
                OffsetBuffer.prototype.readUint = function () {
                    var num = this.ab2uint(this.ab.slice(this.offset, this.offset + 4));
                    this.offset += 4;
                    return num;
                };
                OffsetBuffer.prototype.readShort = function () {
                    var num = this.ab2short(this.ab.slice(this.offset, this.offset + 2));
                    this.offset += 2;
                    return num;
                };
                OffsetBuffer.prototype.readBytes = function (length) {
                    var bytes = this.ab.slice(this.offset, this.offset + length);
                    this.offset += length;
                    return bytes;
                };
                // Length of the internal buffer
                OffsetBuffer.prototype.getLength = function () {
                    return this.ab.byteLength;
                };
                // Number of bytes remaining from the current offset
                OffsetBuffer.prototype.bytesAvailable = function () {
                    return this.getLength() - this.offset;
                };
                // ArrayBuffer -> JS type conversion methods
                OffsetBuffer.prototype.ab2str = function (buf) {
                    return String.fromCharCode.apply(null, new Uint8Array(buf));
                };
                // These create Javascript Numbers
                OffsetBuffer.prototype.ab2int = function (buf) {
                    return new Int32Array(buf)[0];
                };
                OffsetBuffer.prototype.ab2uint = function (buf) {
                    return new Uint32Array(buf)[0];
                };
                OffsetBuffer.prototype.ab2short = function (buf) {
                    return new Int16Array(buf)[0];
                };
                return OffsetBuffer;
            })();
            exports_1("OffsetBuffer", OffsetBuffer);
        }
    }
});
//# sourceMappingURL=offset.buffer.js.map