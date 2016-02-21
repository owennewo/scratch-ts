import {BaseShape} from './base.shape';
import {Graphics} from '../utils/graphics';
import {Geometry} from './geometry';
import {SpecCategoryModel} from '../model/spec.category.model';
import {SpecModel} from '../model/spec.model';


export class CommandOutlineShape extends BaseShape
{
    hasNotch: boolean;
    constructor(category: SpecCategoryModel, spec: SpecModel, hasNotch: boolean, x: number, y: number)
    {
        super(category, spec, x, y);
        this.hasNotch = hasNotch;
        //			this.base.filters = []; // no bezel
			this.indentTop = 3;
    }
    
   	draw() 
    {
        super.draw();
        this.g
                .endFill() // do not fill
		        .lineStyle(2, "#FFFFFF", 0.2)
		        .drawTop(this.w)
		        .drawRightAndBottom(this.topH, this.w, this.hasNotch)
		        .lineTo(0, Geometry.CornerInset)
                .fill(this.color);
	}

}