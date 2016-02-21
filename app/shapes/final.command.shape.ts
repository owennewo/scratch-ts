import {BaseShape} from './base.shape';
import {CommandShape} from './command.shape';
import {Graphics} from '../utils/graphics';
import {SpecCategoryModel} from '../model/spec.category.model';
import {SpecModel} from '../model/spec.model';


export class FinalCommandShape extends CommandShape
{
    constructor(category: SpecCategoryModel, spec: SpecModel, x: number, y: number)
    {
        super(category, spec, x, y);
        this.hasNotch = false;
		this.indentTop = 5;
        //this.isTerminal = true;
    }
    
}