import {StageModel} from "../model/stage.model";
import {ListPrims} from "./list.prims";
import {SensingPrims} from "./sensing.prims";
import {VideoMotionPrims} from "./video.motion.prims";
import {SoundPrims} from "./sound.prims";
import {MotionAndPenPrims} from "./motion.and.pen.prims";
import {LooksPrims} from "./looks.prims";
import {Interpreter} from "../runtime/interpreter";
import {BlockArgModel} from "../model/block.arg.model";
import {SpriteModel} from "../model/sprite.model";
import {BlockModel} from "../model/block.model";
// Primitives.as
// John Maloney, April 2010
//
// Miscellaneous primitives. Registers other primitive modules.
// Note: A few control structure primitives are implemented directly in Interpreter.as.


export class Primitives {

    private MaxCloneCount: number = 300;

    private counter: number;

    constructor() {

    }

    public addPrimsTo(primTable: any) {

        primTable["noop"] = function(b: any, interp: Interpreter): any { };
        // operators
          primTable["+"] = (b: any, interp: Interpreter): any => { return interp.numarg(b, 0) + interp.numarg(b, 1); };
        primTable["-"] = (b: any, interp: Interpreter): any => { return interp.numarg(b, 0) - interp.numarg(b, 1); };
        primTable["*"] = (b: any, interp: Interpreter): any => { return interp.numarg(b, 0) * interp.numarg(b, 1); };
        primTable["/"] = (b: any, interp: Interpreter): any => { return interp.numarg(b, 0) / interp.numarg(b, 1); };
        primTable["randomFrom:to:"] = this.primRandom;
        primTable["<"] = (b: any, interp: Interpreter): any => { return Primitives.compare(interp.arg(b, 0), interp.arg(b, 1)) < 0; };
        primTable["="] = (b: any, interp: Interpreter): any => { return Primitives.compare(interp.arg(b, 0), interp.arg(b, 1)) === 0; };
        primTable[">"] = (b: any, interp: Interpreter): any => { return Primitives.compare(interp.arg(b, 0), interp.arg(b, 1)) > 0; };
        primTable["&"] = (b: any, interp: Interpreter): any => { return interp.arg(b, 0) && interp.arg(b, 1); };
        primTable["|"] = (b: any, interp: Interpreter): any => { return interp.arg(b, 0) || interp.arg(b, 1); };
        primTable["not"] = (b: any, interp: Interpreter): any => { return !interp.arg(b, 0); };
        primTable["abs"] = (b: any, interp: Interpreter): any => { return Math.abs(interp.numarg(b, 0)); };
        primTable["sqrt"] = (b: any, interp: Interpreter): any => { return Math.sqrt(interp.numarg(b, 0)); };

        primTable["concatenate:with:"] = (b: any, interp: Interpreter): any => { return ("" + interp.arg(b, 0) + interp.arg(b, 1)).substr(0, 10240); };
        primTable["letter:of:"] = this.primLetterOf;
        primTable["stringLength:"] = (b: any, interp: Interpreter): any => { return String(interp.arg(b, 0)).length; };

        primTable["%"] = this.primModulo;
        primTable["rounded"] = (b: any, interp: Interpreter): any => { return Math.round(interp.numarg(b, 0)); };
        primTable["computeFunction:of:"] = this.primMathFunction;

        // clone
        primTable["createCloneOf"] = this.primCreateCloneOf;
        primTable["deleteClone"] = this.primDeleteClone;
        primTable["whenCloned"] = primTable["noop"];

        primTable["NOOP"] = primTable["noop"];
        // testing (for development)
        primTable["COUNT"] = (b: any, interp: Interpreter): any => { return this.counter; };
        primTable["INCR_COUNT"] = (b: any, interp: Interpreter): any => { this.counter++; };
        primTable["CLR_COUNT"] = (b: any, interp: Interpreter): any => { this.counter = 0; };

        new LooksPrims().addPrimsTo(primTable);
        new MotionAndPenPrims().addPrimsTo(primTable);
        new SoundPrims().addPrimsTo(primTable);
        new VideoMotionPrims().addPrimsTo(primTable);
        this.addOtherPrims(primTable);
    }

    protected addOtherPrims(primTable: any): void {
        new SensingPrims().addPrimsTo(primTable);
        new ListPrims().addPrimsTo(primTable);
    }

    private primRandom(b: BlockModel, interp: Interpreter): number {
        let n1: number = interp.numarg(b, 0);
        let n2: number = interp.numarg(b, 1);
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

    private primLetterOf(b: BlockModel, interp: Interpreter): string {
        let s: string = interp.arg(b, 1);
        let i: number = interp.numarg(b, 0) - 1;
        if ((i < 0) || (i >= s.length)) return "";
        return s.charAt(i);
    }

    private primModulo(b: BlockModel, interp: Interpreter): number {
        let n: number = interp.numarg(b, 0);
        let modulus: number = interp.numarg(b, 1);
        let result: number = n % modulus;
        if (result / modulus < 0) result += modulus;
        return result;
    }

    private primMathFunction(b: BlockModel, interp: Interpreter): number {
        let op: any = interp.arg(b, 0);
        let n: number = interp.numarg(b, 1);
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

    private primCreateCloneOf(b: BlockModel, interp: Interpreter) {
      console.log("todo create clone");
        // let objName: string = interp.arg(b, 0);
        // let proto: SpriteModel = this.stage.stage.spriteNamed(objName);
        // if ("_myself_" === objName) proto = interp.activeThread.target;
        // if (!proto) return;
        // if (this.stage.runtime.cloneCount > this.MaxCloneCount) return;
        // let clone: SpriteModel = new SpriteModel();
        // if (proto.parent === this.stage.stagePane)
        //     this.stage.stage.addChildAt(clone, this.stage.stage.getChildIndex(proto));
        // else
        //     this.stage.stage.addChild(clone);
        //
        // clone.initFrom(proto, true);
        // clone.name = proto.name;
        // clone.isClone = true;
        // for (let stack of clone.scripts) {
        //     if (stack.firstBlock.spec.code === "whenCloned") {
        //         interp.startThreadForClone(stack, clone);
        //     }
        // }
        // this.stage.runtime.cloneCount++;
    }

    private primDeleteClone(b: BlockModel, interp: Interpreter): void {
      console.log("todo delete clone");
        // let clone: SpriteModel = interp.targetSprite();
        // if ((clone === null) || (!clone.isClone) || (clone.parent === null)) return;
        // if (clone.bubble && clone.bubble.parent) clone.bubble.parent.removeChild(clone.bubble);
        // clone.parent.removeChild(clone);
        // this.stage.interp.stopThreadsFor(clone);
        // this.stage.runtime.cloneCount--;
    }

}
