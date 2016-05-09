import {StageModel} from "../model/stage.model";
import {ListWatcher} from "../runtime/list.watcher";
import {Primitives} from "./primitives";
import {Interpreter} from "../runtime/interpreter";
import {BlockModel} from "../model/block.model";
import {SpecOperation} from "../model/spec.model";
// ListPrimitives.as
// John Maloney, September 2010
//
// List primitives.

export class ListPrims {

  contents: string;

    constructor() {
    }

    public addPrimsTo(primTable: any): void {
        primTable[SpecOperation.GetList] = this.primContents;
        primTable["append:toList:"] = this.primAppend;
        primTable["deleteLine:ofList:"] = this.primDelete;
        primTable["insert:at:ofList:"] = this.primInsert;
        primTable["setLine:ofList:to:"] = this.primReplace;
        primTable["getLine:ofList:"] = this.primGetItem;
        primTable["lineCountOfList:"] = this.primLength;
        primTable["list:contains:"] = this.primContains;
    }

    private primContents(b: BlockModel, interp: Interpreter): string {
      console.log("todo prime contenst");
      return "";
        // let list: ListWatcher = this.interp.targetObj().lookupOrCreateList(b.spec);
        // if (!list) return "";
        // let allSingleLetters: boolean = true;
        // for (let el of list.contents) {
        //     if (!((el instanceof String) && (el.length === 1))) {
        //         allSingleLetters = false;
        //         break;
        //     }
        // }
        // return (list.contents.join(allSingleLetters ? "" : " "));
    }

    private primAppend(b: BlockModel, interp: Interpreter): void {
        // let list: ListWatcher = this.listarg(b, 1);
        // if (!list) return;
        // this.listAppend(list, this.interp.arg(b, 0));
        // if (list.visible) list.updateWatcher(list.contents.length, false, this.interp);
    }

    protected listAppend(list: ListWatcher, item: any): void {
        // list.contents.push(item);
    }

    private primDelete(b: BlockModel, interp: Interpreter): void {
        // let which: any = this.interp.arg(b, 0);
        // let list: ListWatcher = this.listarg(b, 1);
        // if (!list) return;
        // let len: number = list.contents.length;
        // if (which === "all") {
        //     this.listSet(list, []);
        //     if (list.visible) list.updateWatcher(-1, false, this.interp);
        // }
        // let n: number = (which === "last") ? len : Number(which);
        // if (isNaN(n)) return;
        // let i: number = Math.round(n);
        // if ((i < 1) || (i > len)) return;
        // this.listDelete(list, i);
        // if (list.visible) list.updateWatcher(((i === len) ? i - 1 : i), false, this.interp);
    }

    protected listSet(list: ListWatcher, newValue: any[]): void {
        // list.contents = newValue;
    }

    protected listDelete(list: ListWatcher, i: number): void {
        // list.contents.splice(i - 1, 1);
    }

    private primInsert(b: BlockModel, interp: Interpreter): void {
        // let val: any = this.interp.arg(b, 0);
        // let where: any = this.interp.arg(b, 1);
        // let list: ListWatcher = this.listarg(b, 2);
        // if (!list) return;
        // if (where === "last") {
        //     this.listAppend(list, val);
        //     if (list.visible) list.updateWatcher(list.contents.length, false, this.interp);
        // } else {
        //     let i: number = this.computeIndex(where, list.contents.length + 1);
        //     if (i < 0) return;
        //     this.listInsert(list, i, val);
        //     if (list.visible) list.updateWatcher(i, false, this.interp);
        // }
    }

    protected listInsert(list: ListWatcher, i: number, item: any): void {
        // list.contents.splice(i - 1, 0, item);
    }

    private primReplace(b: BlockModel, interp: Interpreter): void {
        // let list: ListWatcher = this.listarg(b, 1);
        // if (!list) return;
        // let i: number = this.computeIndex(this.interp.arg(b, 0), list.contents.length);
        // if (i < 0) return;
        // this.listReplace(list, i, this.interp.arg(b, 2));
        // if (list.visible) list.updateWatcher(i, false, this.interp);
    }

    protected listReplace(list: ListWatcher, i: number, item: any): void {
        // list.contents[i - 1] = item;
    }

    private primGetItem(b: BlockModel, interp: Interpreter): any {
        // let list: ListWatcher = this.listarg(b, 1);
        // if (!list) return "";
        // let i: number = this.computeIndex(this.interp.arg(b, 0), list.contents.length);
        // if (i < 0) return "";
        // if (list.visible) list.updateWatcher(i, true, this.interp);
        // return list.contents[i - 1];
    }

    private primLength(b: BlockModel, interp: Interpreter): number {
        // let list: ListWatcher = this.listarg(b, 0);
        // if (!list) return 0;
        // return list.contents.length;
        return 0;
    }

    private primContains(b: BlockModel, interp: Interpreter): boolean {
        // let list: ListWatcher = this.listarg(b, 0);
        // if (!list) return false;
        // let item: any = this.interp.arg(b, 1);
        // if (list.contents.indexOf(item) >= 0) return true;
        // for (let el of list.contents) {
        //     // use Scratch comparison operator (Scratch considers the string "123" equal to the number 123)
        //     if (Primitives.compare(el, item) === 0) return true;
        // }
        return false;
    }

    private listarg(b: BlockModel, i: number): ListWatcher {
        // let listName: string = this.interp.arg(b, i);
        // if (listName.length === 0) return null;
        // let obj: ObjectModel = this.interp.targetObj();
        // let result: ListWatcher = obj.listCache[listName];
        // if (!result) {
        //     result = obj.listCache[listName] = obj.lookupOrCreateList(listName);
        // }
        // return result;
        return null;
    }

    private computeIndex(n: any, len: number): number {
        let i: number;
        if (!(n instanceof Number)) {
            if (n === "last") return (len === 0) ? -1 : len;
            if ((n === "any") || (n === "random")) return (len === 0) ? -1 : 1 + Math.floor(Math.random() * len);
            n = Number(n);
            if (isNaN(n)) return -1;
        }
        i = Math.floor(n); // (n instanceof number) ? n : Math.floor(n);
        if ((i < 1) || (i > len)) return -1;
        return i;
    }

}
