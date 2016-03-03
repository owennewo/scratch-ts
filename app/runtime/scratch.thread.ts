import {BlockModel} from "../model/block.model";
import {SpecOperation} from "../model/spec.model";
// Thread.as
// John Maloney, March 2010
//
// Thread is an internal data structure used by the interpreter. It holds the
// state of a thread so it can continue from where it left off, and it has
// a stack to support nested control structures and procedure calls.

export class ScratchThread {

    public target: any;			// object that owns the stack
    public topBlock: BlockModel;		// top BlockModel of the stack
    public tmpObj: any;			// temporary object (not saved on stack)
    public startDelayCount: number;	// number of frames to delay before starting

    // the following state is pushed and popped when running substacks
    public block: BlockModel;
    public isLoop: boolean;
    public firstTime: boolean;	// used by certain control structures
    public tmp: number;				// used by repeat and wait
    public args: any[];			// arguments to a user-defined procedure

    // the stack
    private stack: StackFrame[];
    private sp: number;

    constructor(b: BlockModel, targetObj: any, startupDelay: number = 0) {
        this.target = targetObj;
        this.stop();
        this.topBlock = b;
        this.startDelayCount = startupDelay;
        // initForBlock
        this.block = b;
        this.isLoop = false;
        this.firstTime = true;
        this.tmp = 0;
    }

    public pushStateForBlock(b: BlockModel): void {
        if (this.sp >= (this.stack.length - 1)) this.growStack();
        let old: StackFrame = this.stack[this.sp++];
        old.block = this.block;
        old.isLoop = this.isLoop;
        old.firstTime = this.firstTime;
        old.tmp = this.tmp;
        old.args = this.args;
        // initForBlock
        this.block = b;
        this.isLoop = false;
        this.firstTime = true;
        this.tmp = 0;
    }

    public popState(): boolean {
        if (this.sp === 0) return false;
        let old: StackFrame = this.stack[--this.sp];
        this.block = old.block;
        this.isLoop = old.isLoop;
        this.firstTime = old.firstTime;
        this.tmp = old.tmp;
        this.args = old.args;
        return true;
    }

    public stackEmpty(): boolean { return this.sp === 0; }

    public stop(): void {
        this.block = null;
        this.stack = new Array<StackFrame>(4);
        this.stack[0] = new StackFrame();
        this.stack[1] = new StackFrame();
        this.stack[2] = new StackFrame();
        this.stack[3] = new StackFrame();
        this.sp = 0;
    }

    public isRecursiveCall(procCall: BlockModel, procHat: BlockModel): boolean {
        let callCount: number = 5; // maximum number of enclosing procedure calls to examine
        for (let i: number = this.sp - 1; i >= 0; i--) {
            let b: BlockModel = this.stack[i].block;
            if (b.spec.code === SpecOperation.Call) {
                if (procCall === b) return true;
                console.log ("todo proc cache");
                // if (procHat === this.target.procCache[b.spec]) return true;
            }
            if (--callCount < 0) return false;
        }
        return false;
    }

    public returnFromProcedure(): boolean {
        for (let i: number = this.sp - 1; i >= 0; i--) {
            if (this.stack[i].block.spec.code === SpecOperation.Call) {
                this.sp = i + 1;  // 'hack' the stack pointer, but don't do the final popState here
                this.block = null;  // make it do the final popState through the usual stepActiveThread mechanism
                return true;
            }
        }
        return false;
    }

    private initForBlock(b: BlockModel): void {
        this.block = b;
        this.isLoop = false;
        this.firstTime = true;
        this.tmp = 0;
    }

    private growStack(): void {
        // The stack is an array of Thread instances, pre-allocated for efficiency.
        // When growing, the current size is doubled.
        let s: number = this.stack.length;
        let n: number = s + s;
        this.stack.length = n;
        for (let i: number = s; i < n; ++i)
            this.stack[i] = new StackFrame();
    }

}



class StackFrame {
	/*internal*/ block: BlockModel;
	/*internal*/ isLoop: boolean;
	/*internal*/ firstTime: boolean;
	/*internal*/ tmp: number;
	/*internal*/ args: any[];
}
