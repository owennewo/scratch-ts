import {BaseShape} from './base.shape';
import {Graphics} from '../utils/graphics';
import {Geometry} from './geometry';
import {SpecCategoryModel} from '../model/spec.category.model';
import {SpecModel} from '../model/spec.model';


export class LoopShape extends BaseShape
{
    substack1H: number = Geometry.EmptySubstackH;
    hasLoopArrow: boolean;
    
    constructor(category: SpecCategoryModel, spec: SpecModel, x: number, y: number)
    {
        super(category, spec, x, y);
    }
    
   	draw()
    {
        super.draw();
        var h1:number = this.topH + this.substack1H - Geometry.NotchDepth;
        
        this.g
                .drawTop(this.w)
		        .drawRightAndBottom(this.topH, this.w, true, Geometry.SubstackInset)
		        .drawArm(h1, this.w)
		        .drawRightAndBottom(h1 + Geometry.BottomBarH, this.w, true);
		if (this.hasLoopArrow) 
        {
            this.g.drawLoopArrow(this.w, h1 + Geometry.BottomBarH)
        }
        this.g.fill(this.color);
	}

    
}