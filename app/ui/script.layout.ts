import {ShapeFactory} from "../shapes/shape.factory";
import {Geometry} from "../shapes/geometry";
import {StackShape} from "../shapes/stack.shape";
import {Graphics} from "../utils/graphics";
import {BlockArgModel} from "../model/blockarg.model";
import {ScriptModel} from "../model/script.model";
import {BlockModel} from "../model/block.model";

export class ScriptLayout {

    static drawScripts(scripts: ScriptModel[]) {
      Graphics.ScriptPane.remove("#script-work-area");
      let scriptWorkArea = Graphics.ScriptPane.group("script-work-area", 220, 0);
      scripts.forEach( script => {
        ScriptLayout.drawScript(script, scriptWorkArea);
      });
    }

    static drawScript(script: ScriptModel, scriptWorkArea: Snap.Element) {
        let current = script.firstBlock;
        // let previous = undefined;
        // let next = undefined;

        let scriptGroup = Graphics.ScriptPane.group("script" + script.index, script.x, script.y);
        scriptWorkArea.append(scriptGroup);

        // let y = 0;

        this.drawBlock(current, scriptGroup, 0, 0);

        // while (current) {
        //     current.shape.move(0, y);
        //     current.shape.draw(newScript);
        //     current.shape.setDraggable(false);
        //     if (current.stack1) {
        //       let subcurrent = current.stack1;
        //       let suby = y;
        //       subcurrent.shape.move(20, y);
        //       subcurrent.shape.draw(newScript);
        //       subcurrent.shape.setDraggable(false);
        //     }
        //
        //     let shapeHeight = current.shape.getGroup().getBBox().h;
        //     y += shapeHeight - 2;
        //
        //     current = current.nextBlock;
        // }

    }

    static drawBlock(b: BlockModel, scriptGroup: Snap.Element, x: number, y: number): number {

      let stackHeight: number = 0;
      b.shape = ShapeFactory.createShape(b.spec); // , b.labelsAndArgs);
      if (b.shape instanceof StackShape) {
        let stackShape = <StackShape> b.shape;
        let subStackHeight = this.drawBlock(b.stack1, scriptGroup, x + Geometry.SubstackInset, y + stackShape.stack1y);
        // let subcurrent = b.stack1;
        // let suby = y;
        // subcurrent.shape.move(20, y);
        // subcurrent.shape.draw(scriptGroup);
        // subcurrent.shape.setDraggable(false);
        stackShape.stack1h = subStackHeight;
      }

      b.shape.newGroup(scriptGroup, x, y);
      b.shape.drawHeader(b.labelsAndArgs);
      b.shape.draw(0, 0, true);
      // b.shape.move(x, y);
      b.shape.setDraggable(false);

      let shapeHeight = b.shape.getGroup().getBBox().h;
      // y += shapeHeight - 2;
      stackHeight += shapeHeight - 3;

      if (b.nextBlock) {
        stackHeight += this.drawBlock(b.nextBlock, scriptGroup, x, y + stackHeight);
      }
      return stackHeight;

    }

    //
    // static with(block: BlockModel): BlockPlacement {
    //     BlockPlacement.INSTANCE.current = block;
    //     return BlockPlacement.INSTANCE;
    // }
    //
    // drawAt(x: number, y: number) {
    //
    // }
    //
    // drawAfter(previous: BlockModel) {
    //
    // }


  // fixExpressionLayout():void {
  // 	// fix expression layout up to the enclosing command block
  // 	let b:BlockModel = this;
  // 	while (b.isReporter) {
  // 		b.fixArgLayout();
  // 		if (b.parent instanceof BlockModel) b = b.parent
  // 		else return;
  // 	}
  // 	if (b instanceof BlockModel) b.fixArgLayout();
  // }

  // fixArgLayout(): void {
  //     let item: any, i: number;
  //     if (this.suppressLayout) return;
  //     let x: number = this.indentLeft - this.indentAjustmentFor(this.labelsAndArgs[0]);
  //     let maxH: number = 0;
  //     for (i = 0; i < this.labelsAndArgs.length; i++) {
  //         item = this.labelsAndArgs[i];
  //         // Next line moves the argument of if and if-else blocks right slightly:
  //         if ((i === 1) && !(this.labelsAndArgs[i].type === ArgType.Label)) x = Math.max(x, 30);
  //         item.x = x;
  //         maxH = Math.max(maxH, item.height);
  //         x += item.width + 2;
  //         if (this.labelsAndArgs[i].type === ArgType.Icon) x += 3;
  //     }
  //     x -= this.indentAjustmentFor(this.labelsAndArgs[this.labelsAndArgs.length - 1]);
  //
  //     for (i = 0; i < this.labelsAndArgs.length; i++) {
  //         item = this.labelsAndArgs[i];
  //         item.y = this.indentTop + ((maxH - item.height) / 2) + BlockModel.vOffset;
  //         if ((item instanceof BlockArgModel) && (!item.numberType)) item.y += 1;
  //     }
  //
  //     if ([" ", "", "o"].indexOf(this.type) >= 0) x = Math.max(x, this.minCommandWidth); // minimum width for command blocks
  //     if (["c", "cf", "e"].indexOf(this.type) >= 0) x = Math.max(x, this.minLoopWidth); // minimum width for C and E blocks
  //     if (["h"].indexOf(this.type) >= 0) x = Math.max(x, this.minHatWidth); // minimum width for hat blocks
  //     // if (this.elseLabel) x = Math.max(x, this.indentLeft + this.elseLabel.width + 2);
  //
  //     // this.shape.setWidthAndTopHeight(x + this.indentRight, this.indentTop + maxH + this.indentBottom);
  //     // if ((this.type === "c") || (this.type === "e")) this.fixStackLayout();
  //     // this.shape.redraw();
  //     // this.fixElseLabel();
  //
  // }
  //
  // private indentAjustmentFor(item: any): number {
  //     let itemType: string = "";
  //     if (item instanceof BlockModel) itemType = item.type;
  //     if (item instanceof BlockArgModel) itemType = item.type;
  //     if ((this.type === "b") && (itemType === "b")) return 4;
  //     if ((this.type === "r") && ((itemType === "r") || (itemType === "d") || (itemType === "n"))) return 2;
  //     return 0;
  // }
  //
  // fixStackLayout(): void {
  //     let b: BlockModel = this;
  //     while (b != null) {
  //         if (b.shape instanceof StackShape) {
  //             let stackShape = <StackShape>b.shape;
  //             let stackH: number = Geometry.EmptyStackH;
  //             if (b.stack1) {
  //                 b.stack1.fixStackLayout();
  //                 b.stack1.x = Geometry.StackInset;
  //                 // b.stack1.y = b.shape.stack1y();
  //                 // stackH = b.stack1.getRect(b).height;
  //                 // if (b.stack1.bottomBlock().isTerminal) stackH += Geometry.NotchDepth;
  //             }
  //             stackShape.stack1h = stackH;
  //             if (b.shape instanceof DoubleStackShape) {
  //                 let doubleStackShape = <DoubleStackShape>b.shape;
  //                 stackH = Geometry.EmptyStackH;
  //                 if (b.stack2) {
  //                     b.stack2.fixStackLayout();
  //                     b.stack2.x = Geometry.StackInset;
  //                     b.stack2.y = doubleStackShape.stack2y;
  //                     // stackH = b.stack2.getRect(b).height;
  //                     if (b.stack2.bottomBlock().isTerminal) stackH += Geometry.NotchDepth;
  //                 }
  //                 doubleStackShape.stack2h = stackH;
  //                 b.shape.draw();
  //                 b.fixElseLabel();
  //             }
  //         }
  //         if (b.nextBlock != null) {
  //             b.nextBlock.x = 0;
  //             b.nextBlock.y = b.shape.y + b.shape.h;
  //         }
  //         b = b.nextBlock;
  //     }
  // }
  //
  // private fixElseLabel(): void {
  //     // if (this.elseLabel) {
  //     // 	let metrics:TextLineMetrics = this.elseLabel.getLineMetrics(0);
  //     // 	let dy:number = (metrics.ascent + metrics.descent) / 2;
  //     // 	this.elseLabel.x = 4;
  //     // 	this.elseLabel.y = this.shape.stack2y() - 11 - dy + BlockModel.vOffset;
  //     // }
  // }
  //
  // // previewstack1Height(h:number):void {
  // // 	this.shape.setstack1Height(h);
  // // 	this.shape.redraw();
  // // 	this.fixElseLabel();
  // // 	if (this.nextBlock) this.nextBlock.y = this.shape.nextBlockY();
  // // }
  //
  // // duplicate(forClone:boolean, forStage:boolean = false):BlockModel {
  // // 	let newSpec:string = this.spec;
  // // 	if (this.op === 'whenClicked') newSpec = forStage ? 'when Stage clicked' : 'when this sprite clicked';
  // // 	let dup:BlockModel = new BlockModel(newSpec, this.type, (forClone ? -1 : this.shape.color), this.op);
  // // 	dup.isRequester = this.isRequester;
  // // 	dup.forcedRequester = this.forcedRequester;
  // // 	dup.parameterNames = this.parameterNames;
  // // 	dup.defaultArgValues = this.defaultArgValues;
  // // 	dup.warpProcFlag = this.warpProcFlag;
  // // 	if (forClone) {
  // // 		dup.copyArgsForClone(this.args);
  // // 	} else {
  // // 		dup.copyArgs(this.args);
  // // 		if (this.op === 'stopScripts' && this.args[0] instanceof BlockArgModel) {
  // // 			if(this.args[0].argValue.indexOf('other scripts') === 0) {
  // // 				if (forStage) dup.args[0].setArgValue('other scripts in stage');
  // // 				else dup.args[0].setArgValue('other scripts in sprite');
  // // 			}
  // // 		}
  // // 	}
  // // 	if (this.nextBlock != null) dup.addChild(dup.nextBlock = this.nextBlock.duplicate(forClone, forStage));
  // // 	if (this.stack1 != null) dup.addChild(dup.stack1 = this.stack1.duplicate(forClone, forStage));
  // // 	if (this.stack2 != null) dup.addChild(dup.stack2 = this.stack2.duplicate(forClone, forStage));
  // // 	if (!forClone) {
  // // 		dup.x = this.x;
  // // 		dup.y = this.y;
  // // 		dup.fixExpressionLayout();
  // // 		dup.fixStackLayout();
  // // 	}
  // // 	return dup;
  // // }
  //   // private static INSTANCE = new BlockPlacement;
  //
  //   // current: BlockModel;
  //   //


}
