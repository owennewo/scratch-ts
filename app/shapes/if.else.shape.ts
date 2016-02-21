import {BaseShape} from './base.shape';
import {LoopShape} from './loop.shape';
import {Graphics} from '../utils/graphics';
import {Geometry} from './geometry';
import {SpecCategoryModel} from '../model/spec.category.model';
import {SpecModel} from '../model/spec.model';


export class IfElseShape extends LoopShape
{
	substack2H:number = Geometry.EmptySubstackH; 
    
    constructor(category: SpecCategoryModel, spec: SpecModel, x: number, y: number)
    {
        super(category, spec, x, y);
    }
    
    draw() {
        super.draw();
		var h1:number = this.topH + this.substack1H - Geometry.NotchDepth;
		var h2:number = h1 + Geometry.DividerH + this.substack2H - Geometry.NotchDepth;
        
        this.g
                .drawTop(this.w)
                .drawRightAndBottom(this.topH, this.w, true, Geometry.SubstackInset)
		        .drawArm(h1, this.w)
		        .drawRightAndBottom(h1 + Geometry.DividerH, this.w, true, Geometry.SubstackInset)
		        .drawArm(h2, this.w)
		        .drawRightAndBottom(h2 + Geometry.BottomBarH, this.w, true)
                .fill(this.color);
	}
    
}