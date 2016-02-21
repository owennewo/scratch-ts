import {BaseShape} from './base.shape';
import {LoopShape} from './loop.shape';
import {Graphics} from '../utils/graphics';
import {SpecCategoryModel} from '../model/spec.category.model';
import {SpecModel} from '../model/spec.model';



export class FinalLoopShape extends LoopShape
{
    constructor(category: SpecCategoryModel, spec: SpecModel, x: number, y: number)
    {
        super(category, spec, x, y);
        //this.isTerminal = true;
    }
    
}