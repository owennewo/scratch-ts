import {ListPrims} from "./list.prims";
import {SensingPrims} from "./sensing.prims";
import {VideoMotionPrims} from "./video.motion.prims";
import {SoundPrims} from "./sound.prims";
import {MotionAndPenPrims} from "./motion.and.pen.prims";
import {LooksPrims} from "./looks.prims";
import {Interpreter} from "../interpreter";
import {Scratch} from "../scratch";
import {BlockArgModel} from "../../model/blockarg.model";
import {SpriteModel} from "../../model/sprite.model";
import {BlockModel} from "../../model/block.model";
// Primitives.as
// John Maloney, April 2010
//
// Miscellaneous primitives. Registers other primitive modules.
// Note: A few control structure primitives are implemented directly in Interpreter.as.


export class Primitives {

    private MaxCloneCount: number = 300;

    protected app: Scratch;
    protected interp: Interpreter;
    private counter: number;

    constructor(app: Scratch, interpreter: Interpreter) {
        this.app = app;
        this.interp = interpreter;
    }

    public addPrimsTo(primTable: any) {
        // operators
        primTable["+"] = function(b: any): any { return this.interp.numarg(this.b, 0) + this.interp.numarg(this.b, 1); };
        primTable["-"] = function(b: any): any { return this.interp.numarg(this.b, 0) - this.interp.numarg(this.b, 1); };
        primTable["*"] = function(b: any): any { return this.interp.numarg(this.b, 0) * this.interp.numarg(this.b, 1); };
        primTable["/"] = function(b: any): any { return this.interp.numarg(this.b, 0) / this.interp.numarg(this.b, 1); };
        primTable["randomFrom:to:"] = this.primRandom;
        primTable["<"] = function(b: any): any { return Primitives.compare(this.interp.arg(this.b, 0), this.interp.arg(this.b, 1)) < 0; };
        primTable["="] = function(b: any): any { return Primitives.compare(this.interp.arg(this.b, 0), this.interp.arg(this.b, 1)) === 0; };
        primTable[">"] = function(b: any): any { return Primitives.compare(this.interp.arg(this.b, 0), this.interp.arg(this.b, 1)) > 0; };
        primTable["&"] = function(b: any): any { return this.interp.arg(this.b, 0) && this.interp.arg(this.b, 1); };
        primTable["|"] = function(b: any): any { return this.interp.arg(this.b, 0) || this.interp.arg(this.b, 1); };
        primTable["not"] = function(b: any): any { return !this.interp.arg(this.b, 0); };
        primTable["abs"] = function(b: any): any { return Math.abs(this.interp.numarg(this.b, 0)); };
        primTable["sqrt"] = function(b: any): any { return Math.sqrt(this.interp.numarg(this.b, 0)); };

        primTable["concatenate:with:"] = function(b: any): any { return ("" + this.interp.arg(this.b, 0) + this.interp.arg(this.b, 1)).substr(0, 10240); };
        primTable["letter:of:"] = this.primLetterOf;
        primTable["stringLength:"] = function(b: any): any { return String(this.interp.arg(this.b, 0)).length; };

        primTable["%"] = this.primModulo;
        primTable["rounded"] = function(b: any): any { return Math.round(this.interp.numarg(this.b, 0)); };
        primTable["computeFunction:of:"] = this.primMathFunction;

        // clone
        primTable["createCloneOf"] = this.primCreateCloneOf;
        primTable["deleteClone"] = this.primDeleteClone;
        primTable["whenCloned"] = this.interp.primNoop;

        // testing (for development)
        primTable["NOOP"] = this.interp.primNoop;
        primTable["COUNT"] = function(b: any): any { return this.counter; };
        primTable["INCR_COUNT"] = function(b: any): any { this.counter++; };
        primTable["CLR_COUNT"] = function(b: any): any { this.counter = 0; };

        new LooksPrims(this.app, this.interp).addPrimsTo(primTable);
        new MotionAndPenPrims(this.app, this.interp).addPrimsTo(primTable);
        new SoundPrims(this.app, this.interp).addPrimsTo(primTable);
        new VideoMotionPrims(this.app, this.interp).addPrimsTo(primTable);
        this.addOtherPrims(primTable);
    }

    protected addOtherPrims(primTable: any): void {
        new SensingPrims(this.app, this.interp).addPrimsTo(primTable);
        new ListPrims(this.app, this.interp).addPrimsTo(primTable);
    }

    private primRandom(b: BlockModel): number {
        let n1: number = this.interp.numarg(b, 0);
        let n2: number = this.interp.numarg(b, 1);
        let low: number = (n1 <= n2) ? n1 : n2;
        let hi: number = (n1 <= n2) ? n2 : n1;
        if (low === hi) return low;

        // if both low and hi are ints, truncate the result to an int
        let ba1: BlockArgModel = <BlockArgModel>b.args[0];
        let ba2: BlockArgModel = <BlockArgModel>b.args[1];
        let int1: boolean = ba1 ? ba1.numberType === BlockArgModel.NT_INT : Math.floor(n1) === n1;
        let int2: boolean = ba2 ? ba2.numberType === BlockArgModel.NT_INT : Math.floor(n2) === n2;
        if (int1 && int2)
            return low + Math.floor(Math.random() * ((hi + 1) - low));

        return (Math.random() * (hi - low)) + low;
    }

    private primLetterOf(b: BlockModel): string {
        let s: string = this.interp.arg(b, 1);
        let i: number = this.interp.numarg(b, 0) - 1;
        if ((i < 0) || (i >= s.length)) return "";
        return s.charAt(i);
    }

    private primModulo(b: BlockModel): number {
        let n: number = this.interp.numarg(b, 0);
        let modulus: number = this.interp.numarg(b, 1);
        let result: number = n % modulus;
        if (result / modulus < 0) result += modulus;
        return result;
    }

    private primMathFunction(b: BlockModel): number {
        let op: any = this.interp.arg(b, 0);
        let n: number = this.interp.numarg(b, 1);
        switch (op) {
            case "abs": return Math.abs(n);
            case "floor": return Math.floor(n);
            case "ceiling": return Math.ceil(n);
            case "int": return n - (n % 1); // used during alpha, but removed from menu
            case "sqrt": return Math.sqrt(n);
            case "sin": return Math.sin((Math.PI * n) / 180);
            case "cos": return Math.cos((Math.PI * n) / 180);
            case "tan": return Math.tan((Math.PI * n) / 180);
            case "asin": return (Math.asin(n) * 180) / Math.PI;
            case "acos": return (Math.acos(n) * 180) / Math.PI;
            case "atan": return (Math.atan(n) * 180) / Math.PI;
            case "ln": return Math.log(n);
            case "log": return Math.log(n) / Math.LN10;
            case "e ^": return Math.exp(n);
            case "10 ^": return Math.pow(10, n);
        }
        return 0;
    }

    private static emptyDict: any = {};
    private static lcDict: any = {};
    public static compare(a1: any, a2: any): number {
        // This is static so it can be used by the list "contains" primitive.
        let n1: number = Interpreter.asNumber(a1);
        let n2: number = Interpreter.asNumber(a2);
        // X !== X is faster than isNaN()
        if (n1 !== n1 || n2 !== n2) {
            // Suffix the strings to avoid properties and methods of the Dictionary class (constructor, hasOwnProperty, etc)
            if (a1 instanceof String && Primitives.emptyDict[a1]) a1 += "_";
            if (a2 instanceof String && Primitives.emptyDict[a2]) a2 += "_";

            // at least one argument can"t be converted to a number: compare as strings
            let s1: string = Primitives.lcDict[a1];
            if (!s1) s1 = Primitives.lcDict[a1] = String(a1).toLowerCase();
            let s2: string = Primitives.lcDict[a2];
            if (!s2) s2 = Primitives.lcDict[a2] = String(a2).toLowerCase();
            return s1.localeCompare(s2);
        } else {
            // compare as numbers
            if (n1 < n2) return -1;
            if (n1 === n2) return 0;
            if (n1 > n2) return 1;
        }
        return 1;
    }

    private primCreateCloneOf(b: BlockModel) {
      console.log("todo create clone");
        // let objName: string = this.interp.arg(b, 0);
        // let proto: SpriteModel = this.app.stage.spriteNamed(objName);
        // if ("_myself_" === objName) proto = this.interp.activeThread.target;
        // if (!proto) return;
        // if (this.app.runtime.cloneCount > this.MaxCloneCount) return;
        // let clone: SpriteModel = new SpriteModel();
        // if (proto.parent === this.app.stagePane)
        //     this.app.stage.addChildAt(clone, this.app.stage.getChildIndex(proto));
        // else
        //     this.app.stage.addChild(clone);
        //
        // clone.initFrom(proto, true);
        // clone.name = proto.name;
        // clone.isClone = true;
        // for (let stack of clone.scripts) {
        //     if (stack.firstBlock.spec.code === "whenCloned") {
        //         this.interp.startThreadForClone(stack, clone);
        //     }
        // }
        // this.app.runtime.cloneCount++;
    }

    private primDeleteClone(b: BlockModel): void {
      console.log("todo delete clone");
        // let clone: SpriteModel = this.interp.targetSprite();
        // if ((clone === null) || (!clone.isClone) || (clone.parent === null)) return;
        // if (clone.bubble && clone.bubble.parent) clone.bubble.parent.removeChild(clone.bubble);
        // clone.parent.removeChild(clone);
        // this.app.interp.stopThreadsFor(clone);
        // this.app.runtime.cloneCount--;
    }

}
