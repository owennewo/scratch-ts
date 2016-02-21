import {BaseShape} from './base.shape';
import {Graphics} from '../utils/graphics';
import {SpecCategoryModel} from '../model/spec.category.model';
import {SpecModel} from '../model/spec.model';


export class BooleanShape extends BaseShape
{
    constructor(category: SpecCategoryModel, spec: SpecModel, x: number, y: number)
    {
        super(category, spec, x, y);
        // this.isReporter = true;
		// this.indentLeft = 9;
		// this.indentRight = 7;
    }
    
    draw()
    {
        super.draw();
		var centerY:number = this.topH / 2;
        
		this.g
            .moveTo(this.centerY, this.topH)
            .lineTo(this.x, this.centerY)
            .lineTo(centerY, this.y)
            .lineTo(this.w - this.centerY, this.y)
            .lineTo(this.w, this.centerY)
            .lineTo(this.w - this.centerY, this.topH)
            .fill(this.color);
	}

    
}