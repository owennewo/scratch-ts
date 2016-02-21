import {BaseShape} from './base.shape';
import {Graphics} from '../utils/graphics';
import {SpecCategoryModel} from '../model/spec.category.model';
import {SpecModel} from '../model/spec.model';


export class CommandShape extends BaseShape
{
    w: number;
    hasNotch: boolean = true;
    
    constructor(category: SpecCategoryModel, spec: SpecModel    , x: number, y: number)
    {
        super(category, spec, x, y);
        this.indentTop = 3;
    }
    
   	draw()
    {
        super.draw();
        this.g
            .drawTop(this.w)
		    .drawRightAndBottom(this.topH, this.w, this.hasNotch)
            .fill(this.color)
            .drawText(5, 18, this.title, '#EEE');
	}

}