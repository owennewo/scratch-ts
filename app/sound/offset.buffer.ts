// Provides the equivalent functionality of an AS ByteArray
// using JavaScript ArrayBuffers and viewers

export class OffsetBuffer {

    offset: number;
    private ab: ArrayBuffer;

    constructor(data: ArrayBuffer) {
        this.offset = 0;
        this.ab = data;
    }

    // Read various datatypes from the ArrayBuffer, seeking the offset.
    readString(length) {
        let str = this.ab2str(this.ab.slice(this.offset, this.offset + length));
        this.offset += length;
        return str;
    }

    readInt() {
        let num = this.ab2int(this.ab.slice(this.offset, this.offset + 4));
        this.offset += 4;
        return num;
    }

    readUint() {
        let num = this.ab2uint(this.ab.slice(this.offset, this.offset + 4));
        this.offset += 4;
        return num;
    }

    readShort() {
        let num = this.ab2short(this.ab.slice(this.offset, this.offset + 2));
        this.offset += 2;
        return num;
    }

    readBytes(length) {
        let bytes = this.ab.slice(this.offset, this.offset + length);
        this.offset += length;
        return bytes;
    }

    // Length of the internal buffer
    getLength() {
        return this.ab.byteLength;
    }

    // Number of bytes remaining from the current offset
    bytesAvailable() {
        return this.getLength() - this.offset;
    }

    // ArrayBuffer -> JS type conversion methods
    ab2str(buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
    }

    // These create Javascript Numbers
    ab2int(buf) {
        return new Int32Array(buf)[0];
    }

    ab2uint(buf) {
        return new Uint32Array(buf)[0];
    }

    ab2short(buf) {
        return new Int16Array(buf)[0];
    }
}
