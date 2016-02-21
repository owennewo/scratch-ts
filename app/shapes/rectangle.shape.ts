import {BaseShape} from './base.shape';
import {Graphics} from '../utils/graphics';
import {SpecCategoryModel} from '../model/spec.category.model';
import {SpecModel} from '../model/spec.model';


export class RectangleShape extends BaseShape
{
    constructor(category: SpecCategoryModel, spec: SpecModel, x:number, y: number)
    {
        super(category, spec, x, y);
    }
    
    draw() 
    { 
        super.draw();
        this.g
            .drawRect(0, 0, this.w, this.topH)
            .fill(this.color); 
    }
    
}