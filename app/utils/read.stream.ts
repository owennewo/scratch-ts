/**
 * A simple character stream with two character look-ahead and tokenization.
 *
 * John Maloney, October 2009
 */
export class ReadStream {


    private src: string;
    private i: number;

    constructor(s: string) {
        this.src = s;
        this.i = 0;
    }

    public atEnd(): boolean {
        return this.i >= this.src.length;
    }

    public next(): string {
        if (this.i >= this.src.length) return "";
        return this.src.charAt(this.i++);
    }

    public peek(): string {
        return (this.i < this.src.length) ? this.src.charAt(this.i) : "";
    }

    public peek2(): string {
        return ((this.i + 1) < this.src.length) ? this.src.charAt(this.i + 1) : "";
    }

    public peekString(n: number): string { return this.src.slice(this.i, this.i + n); }

    public nextString(n: number): string {
        this.i += n;
        return this.src.slice(this.i - n, this.i);
    }

    public pos(): number { return this.i; }

    public setPos(newPos: number): void { this.i = newPos; }

    public skip(count: number): void { this.i += count; }

    public skipWhiteSpace(): void {
        while ((this.i < this.src.length) && (this.src.charCodeAt(this.i) <= 32)) this.i++;
    }

    public upToEnd(): string {
        let result: string = (this.i < this.src.length) ? this.src.slice(this.i, this.src.length) : "";
        this.i = this.src.length;
        return result;
    }

    public static tokenize(s: string): any[] {
        let stream: ReadStream = new ReadStream(s);
        let result: any[] = [];
        while (!stream.atEnd()) {
            let token: string = stream.nextToken();
            if (token.length > 0) result.push(token);
        }
        return result;
    }

    public nextToken(): string {
        this.skipWhiteSpace();
        if (this.atEnd()) return "";
        let token: string = "";
        let isArg: boolean;
        let start: number = this.i;
        while (this.i < this.src.length) {
            if (this.src.charCodeAt(this.i) <= 32) break;
            let ch: string = this.src.charAt(this.i);
            if (ch === "\\") {
                token += ch + this.src.charAt(this.i + 1);
                this.i += 2;
                continue;
            }
            if (ch === "%") {
                if (this.i > start) break; // percent sign starts new token
                isArg = true;
            }
            // certain punctuation marks following an argument start a new token
            // example: 'touching %m?' (question mark after arg starts a new token) vs. 'loud?' (doesn't)
            if (isArg && (ch === "?" || ch === "-")) break;
            token += ch;
            this.i++;
        }
        return token;
    }

    public static escape(s: string): string {
        return s.replace(/[\\%@]/g, "\\$&");
    }

    public static unescape(s: string): string {
        let result: string = "";
        for (let i: number = 0; i < s.length; i++) {
            let ch: string = s.charAt(i);
            if (ch === "\\") {
                result += s.charAt(i + 1);
                i++;
            } else {
                result += ch;
            }
        }
        return result;
    }

}
