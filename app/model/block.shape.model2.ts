/*
 * Scratch Project Editor and Player
 * Copyright (C) 2014 Massachusetts Institute of Technology
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

// BlockShape.as
// John Maloney, August 2009
//
// BlockShape handles drawing and resizing of a block shape.

//module blocks {

//import {Shape} from "../stubs/Shape";
 import {Graphics} from "../utils/graphics";	
// import {GlowFilter} from "../stubs/GlowFilter";	
// import {BevelFilter} from "../stubs/BevelFilter";	
import {Specs} from "../specs";
import {BlockModel} from './block.model';	

export class BlockShapeModel2 {

	width: number;
	height: number;
	static graphics: Graphics = new Graphics();

	// // Shapes
	public static RectShape:number = 1;
	public static BooleanShape:number = 2;
	public static NumberShape:number = 3;
	public static CmdShape:number = 4;
	public static FinalCmdShape:number = 5;
	public static CmdOutlineShape:number = 6;
	public static HatShape:number = 7;
	public static ProcHatShape:number = 8;
	// C-shaped blocks
	public static LoopShape:number = 9;
	public static FinalLoopShape:number = 10;
	// E-shaped blocks
	public static IfElseShape:number = 11;

	// // Geometry
	public static NotchDepth:number = 3;
	public static EmptySubstackH:number = 12;
	public static SubstackInset:number = 15;

	
	private BottomBarH:number = 16; // height of the bottom bar of a C or E block
	private DividerH:number = 18; // height of the divider bar in an E block
	private NotchL1:number = 13;
	private NotchL2:number = this.NotchL1 + BlockShapeModel.NotchDepth;
	private NotchR1:number = this.NotchL2 + 8;
	private NotchR2:number = this.NotchR1 + BlockShapeModel.NotchDepth;

	// // Variables
	public color:number;
	public hasLoopArrow:boolean;

	private shape:number;
	private w:number;
	private topH:number;
	private substack1H:number = BlockShapeModel.EmptySubstackH;
	private substack2H:number = BlockShapeModel.EmptySubstackH;
	private drawFunction:Function = this.drawRectShape;
	private redrawNeeded:boolean = true;

	constructor(shape:number = 1, color:number = 0xFFFFFF) {
		
		this.color = color;
		this.shape = shape;
		this.setShape(shape);
		//this.filters = this.blockShapeFilters();
	}

	public setWidthAndTopHeight(newW:number, newTopH:number, doRedraw:boolean = false):void {
		// Set the width and 'top' height of this block. For normal command
		// and reporter blocks, the top height is the height of the block.
		// For C and E shaped blocks (conditionals and loops), the top height
		// is the height of the top bar, which contains block labels and arguments.
		if ((newW == this.w) && (newTopH == this.topH)) return;
		this.w = newW;
		this.topH = newTopH;
		this.redrawNeeded = true;
		if (doRedraw) this.redraw();
	}

	public setWidth(newW:number):void {
		if (newW == this.w) return;
		this.w = newW;
		this.redrawNeeded = true;
	}

	public copyFeedbackShapeFrom(b:any, reporterFlag:boolean, isInsertion:boolean = false, targetHeight:number = 0):void {
		// Set my shape from b, which is a Block or BlockArg.
		var s:BlockShapeModel = b.base;
		this.color = 0x0093ff;
		this.setShape(s.shape);
		this.w = s.w;
		this.topH = s.topH;
		this.substack1H = s.substack1H;
		this.substack2H = s.substack2H;
		if (!reporterFlag) {
			if (isInsertion) {
				// inserting in middle or at end of stack (i.e. not above or wrapping around)
				this.setShape(BlockShapeModel.CmdShape);
				this.topH = 6;
			} else {
				if (!this.canHaveSubstack1() && !b.isHat) this.topH = b.height; // normal command block (not hat, C, or E)
				if (targetHeight) this.substack1H = targetHeight - BlockShapeModel.NotchDepth; // wrapping a C or E block
			}
		}
		//this.filters = this.dropFeedbackFilters(reporterFlag);
		this.redrawNeeded = true;
		this.redraw();
	}

	public setColor(color:number):void { this.color = color; this.redrawNeeded = true }

	public nextBlockY():number {
		if (BlockShapeModel.ProcHatShape == this.shape) return this.topH;
		return this.height - BlockShapeModel.NotchDepth;
	}

	public setSubstack1Height(h:number):void {
		h = Math.max(h, BlockShapeModel.EmptySubstackH);
		if (h != this.substack1H) { this.substack1H = h; this.redrawNeeded = true }
	}

	public setSubstack2Height(h:number):void {
		h = Math.max(h, BlockShapeModel.EmptySubstackH);
		if (h != this.substack2H) { this.substack2H = h; this.redrawNeeded = true }
	}

	public canHaveSubstack1():boolean { return this.shape >= BlockShapeModel.LoopShape }
	public canHaveSubstack2():boolean { return this.shape == BlockShapeModel.IfElseShape }

	public substack1y():number { return this.topH }
	public substack2y():number { return this.topH + this.substack1H + this.DividerH - BlockShapeModel.NotchDepth }

	public redraw():void {
		if (!this.redrawNeeded) return;
		var g:Graphics = new Graphics();// BlockShapeModel.graphics;
		g.clear();
		g.beginFill(this.color);
		this.drawFunction(g);
		g.endFill();
		this.redrawNeeded = false;
	}

	// private blockShapeFilters():any[] {
	// 	// filters for command and reporter Block outlines
	// 	var f:BevelFilter = new BevelFilter(1);
	// 	f.blurX = f.blurY = 3;
	// 	f.highlightAlpha = 0.3;
	// 	f.shadowAlpha = 0.6;
	// 	return [f];
	// }

	// private dropFeedbackFilters(forReporter:boolean):any[] {
	// 	// filters for command/reporter block drop feedback
	// 	var f:GlowFilter;
	// 	if (forReporter) {
	// 		f = new GlowFilter(0xFFFFFF);
	// 		f.strength = 5;
	// 		f.blurX = f.blurY = 8;
	// 		f.quality = 2;
	// 	} else {
	// 		f = new GlowFilter(0xFFFFFF);
	// 		f.strength = 12;
	// 		f.blurX = f.blurY = 6;
	// 		f.inner = true;
	// 	}
	// 	f.knockout = true;
	// 	return [f];
	// }

	private setShape(shape:number):void {
		this.shape = shape;
		switch(shape) {
		case BlockShapeModel.RectShape:			this.drawFunction = this.drawRectShape; break;
		case BlockShapeModel.BooleanShape:		this.drawFunction = this.drawBooleanShape; break;
		case BlockShapeModel.NumberShape:		this.drawFunction = this.drawNumberShape; break;
		case BlockShapeModel.CmdShape:
		case BlockShapeModel.FinalCmdShape:		this.drawFunction = this.drawCmdShape; break;
		case BlockShapeModel.CmdOutlineShape:	this.drawFunction = this.drawCmdOutlineShape; break;
		case BlockShapeModel.LoopShape:
		case BlockShapeModel.FinalLoopShape:	this.drawFunction = this.drawLoopShape; break;
		case BlockShapeModel.IfElseShape:		this.drawFunction = this.drawIfElseShape; break;
		case BlockShapeModel.HatShape:			this.drawFunction = this.drawHatShape; break;
		case BlockShapeModel.ProcHatShape:		this.drawFunction = this.drawProcHatShape; break;
		}
	}

	
}

