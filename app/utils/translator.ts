import {StringUtils} from "../utils/stringutils";

export class Translator {

    public static languages: any[] = []; // contains pairs: [<language code>, <utf8 language name>]
    public static currentLang: string = "en";

    public static rightToLeft: boolean;
    public static rightToLeftMath: boolean; // true only for Arabic

    private static font12: any[] = ["fa", "he", "ja", "ja_HIRA", "zh_CN"];
    private static font13: any[] = ["ar"];

    private static dictionary: Object = {};

    public static initializeLanguageList(): void {
        // Get a list of language names for the languages menu from the server.
        function saveLanguageList(data: string): void {
            if (!this.data) return;
            for (let line of this.data.split("\n")) {
                let fields: any[] = this.line.split(",");
                if (this.fields.length >= 2) {
                    Translator.languages.push([this.fields[0].trim(), this.fields[1].trim()]);
                }
            }
        }
        Translator.languages = [["en", "English"]]; // English is always the first entry
        // Scratch.app.server.getLanguageList(saveLanguageList);
    }

    // public static setLanguageValue(lang:string):void {
    // 	function gotPOFile(data:ByteArray):void {
    // 		if (this.data) {
    // 			Translator.dictionary = Translator.parsePOData(this.data);
    // 			Translator.setFontsFor(lang); // also sets currentLang
    // 			Translator.checkBlockTranslations();
    // 		}
    // 		this.Scratch.app.translationChanged();
    // 	}

    // 	Translator.dictionary = {}; // default to English (empty dictionary) if there's no .po file
    // 	Translator.setFontsFor('en');
    // 	if ('en' == lang) Scratch.app.translationChanged(); // there is no .po file English
    // 	else Scratch.app.server.getPOFile(lang, gotPOFile);

    // }

    // public static setLanguage(lang:string):void {
    // 	if ('import translation file' == lang) { Translator.importTranslationFromFile(); return; }
    // 	if ('set font size' == lang) { Translator.fontSizeMenu(); return; }

    // 	Translator.setLanguageValue(lang);
    // 	Scratch.app.server.setSelectedLang(lang);
    // }

    // public static importTranslationFromFile():void {
    // 	function fileLoaded(e:Event):void {
    // 		let file:FileReference = this.FileReference(this.e.target);
    // 		let i:number = this.file.name.lastIndexOf('.');
    // 		let langName:string = this.file.name.slice(0, this.i);
    // 		let data:ByteArray = this.file.data;
    // 		if (this.data) {
    // 			Translator.dictionary = Translator.parsePOData(this.data);
    // 			Translator.setFontsFor(this.langName);
    // 			Translator.checkBlockTranslations();
    // 			this.Scratch.app.translationChanged();
    // 		}
    // 	}

    // 	Scratch.loadSingleFile(fileLoaded);
    // }

    // private static fontSizeMenu():void {
    // 	function setFontSize(labelSize:number):void {
    // 		let argSize:number = Math.round(0.9 * this.labelSize);
    // 		let vOffset:number = this.labelSize > 13 ? 1 : 0;
    // 		Block.setFonts(this.labelSize, this.argSize, false, this.vOffset);
    // 		this.Scratch.app.translationChanged();
    // 	}
    // 	let m:Menu = new Menu(setFontSize);
    // 	for (let i:number = 8; i < 25; i++) m.addItem(i.toString(), i);
    // 	m.showOnStage(Scratch.app.stage);
    // }

    // private static setFontsFor(lang:string):void {
    // 	// Set the rightToLeft flag and font sizes the given language.

    // 	Translator.currentLang = lang;

    // 	let rtlLanguages:any[] = ['ar', 'fa', 'he'];
    // 	Translator.rightToLeft = rtlLanguages.indexOf(lang) > -1;
    // 	Translator.rightToLeftMath = ('ar' == lang);
    // 	Block.setFonts(10, 9, true, 0); // default font settings
    // 	if (Translator.font12.indexOf(lang) > -1) Block.setFonts(11, 10, false, 0);
    // 	if (Translator.font13.indexOf(lang) > -1) Block.setFonts(13, 12, false, 0);
    // }

    public static map(s: string, context?: any): string {
        let result: any = Translator.dictionary[s];
        if ((result == null) || (result.length === 0)) result = s;
        if (context) result = StringUtils.substitute(result, context);
        return result;
    }

    // private static parsePOData(bytes:ByteArray):Object {
    // 	// Parse the given data in gettext .po file format.
    // 	Translator.skipBOM(bytes);
    // 	let lines:any[] = [];
    // 	while (bytes.bytesAvailable > 0) {
    // 		let s:string = StringUtil.trim(Translator.nextLine(bytes));
    // 		if ((s.length > 0) && (s.charAt(0) != '#')) lines.push(s);
    // 	}
    // 	return Translator.makeDictionary(lines);
    // }

    // private static skipBOM(bytes:ByteArray):void {
    // 	// Some .po files begin with a three-byte UTF-8 Byte Order Mark (BOM).
    // 	// Skip this BOM if it exists, otherwise do nothing.
    // 	if (bytes.bytesAvailable < 3) return;
    // 	let b1:number = bytes.readUnsignedByte();
    // 	let b2:number = bytes.readUnsignedByte();
    // 	let b3:number = bytes.readUnsignedByte();
    // 	if ((b1 == 0xEF) && (b2 == 0xBB) && (b3 == 0xBF)) return; // found BOM
    // 	bytes.position = bytes.position - 3; // BOM not found; back up
    // }

    // private static nextLine(bytes:ByteArray):string {
    // 	// Read the next line from the given ByteArray. A line ends with CR, LF, or CR-LF.
    // 	let buf:ByteArray = new ByteArray();
    // 	while (bytes.bytesAvailable > 0) {
    // 		let nextByte:number = bytes.readUnsignedByte();
    // 		if (nextByte == 13) { // CR
    // 			// line could end in CR or CR-LF
    // 			if (bytes.readUnsignedByte() != 10) bytes.position--; // try to read LF, but backup if not LF
    // 			break;
    // 		}
    // 		if (nextByte == 10) break; // LF
    // 		buf.writeByte(nextByte); // append anything else
    // 	}
    // 	buf.position = 0;
    // 	return buf.readUTFBytes(buf.length);
    // }

    private static makeDictionary(lines: any[]): Object {
        // Return a dictionary mapping original strings to their translations.
        let dict: Object = {};
        let mode: string = "none"; // none, key, val
        let key: string = "";
        let val: string = "";
        for (let line of lines) {
            if ((line.length >= 5) && (line.slice(0, 5).toLowerCase() === "msgid")) {
                if (mode === "val") dict[key] = val; // recordPairIn(key, val, dict);
                mode = "key";
                key = "";
            } else if ((line.length >= 6) && (line.slice(0, 6).toLowerCase() === "msgstr")) {
                mode = "val";
                val = "";
            }
            if (mode === "key") key += Translator.extractQuotedString(line);
            if (mode === "val") val += Translator.extractQuotedString(line);
        }
        if (mode === "val") dict[key] = val; // recordPairIn(key, val, dict);
        delete dict[""]; // remove the empty-string metadata entry, if present.
        return dict;
    }

    private static extractQuotedString(s: string): string {
        // Remove leading and trailing whitespace characters.
        let i: number = s.indexOf("\""); // find first double-quote
        if (i < 0) i = s.indexOf(" "); // if no double-quote, start after first space
        let result: string = "";
        for (i = i + 1; i < s.length; i++) {
            let ch: string = s.charAt(i);
            if ((ch === "\\\\") && (i < (s.length - 1))) {
                ch = s.charAt(++i);
                if (ch === "n") ch = "\n";
                if (ch === "r") ch = "\r";
                if (ch === "t") ch = "\t";
            }
            if (ch === "\"") return result; // closing double-quote
            result += ch;
        }
        return result;
    }

    // private static checkBlockTranslations():void {
    // 	for (let entry of Specs.commands) Translator.checkBlockSpec(entry[0]);
    // 	for (let spec of Specs.extensionSpecs) Translator.checkBlockSpec(spec);
    // }

    // private static checkBlockSpec(spec:string):void {
    // 	let translatedSpec:string = Translator.map(spec);
    // 	if (translatedSpec == spec) return; // not translated
    // 	if (!Translator.argsMatch(Translator.extractArgs(spec), Translator.extractArgs(translatedSpec))) {
    // 		Scratch.app.log(
    // 				LogLevel.WARNING, 'Block argument mismatch',
    // 				{language: this.currentLang, spec: spec, translated: translatedSpec});
    // 		delete Translator.dictionary[spec]; // remove broken entry from dictionary
    // 	}
    // }

    // private static argsMatch(args1:any[], args2:any[]):boolean {
    // 	if (args1.length != args2.length) return false;
    // 	for (let i:number = 0; i < args1.length; i++) {
    // 		if (args1[i] != args2[i]) return false;
    // 	}
    // 	return true;
    // }

    // private static extractArgs(spec:string):any[] {
    // 	let result:any[] = [];
    // 	let tokens:any[] = ReadStream.tokenize(spec);
    // 	for (let s of tokens) {
    // 		if ((s.length > 1) && ((s.charAt(0) == '%') || (s.charAt(0) == '@'))) result.push(s);
    // 	}
    // 	return result;
    // }

}
