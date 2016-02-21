import {BaseShape} from './base.shape';
import {Graphics} from '../utils/graphics';
import {Specs} from '../specs';
import {SpecCategoryModel} from '../model/spec.category.model';
import {SpecModel} from '../model/spec.model';


export class ProcHatShape extends BaseShape
{
    constructor(category: SpecCategoryModel, spec: SpecModel, x: number, y: number)
    {
        super(category, spec, x, y);
        //this.isHat = true;
    }
    
    draw() {
        super.draw();
		var trimColor:string = "#8E2EC2"; // 0xcf4ad9;
		var archRoundness:number = Math.min(0.2, 35 / this.w);
        
        var trimColor = "#FF0"; 
        
        this.g
                .beginFill(Specs.ProcedureColor)
		        .moveTo(0, 15)
		        .curve(0, 15, this.w, 15, archRoundness)
		        .drawRightAndBottom(this.topH, this.w, true)
		        .beginFill(trimColor)
		        .lineStyle(1, Specs.ProcedureColor)
                .moveTo(-1, 13)
		        .curve(-1, 13, this.w + 1, 13, archRoundness)
		        .curve(this.w + 1, 13, this.w, 16, 0.6)
		        .curve(this.w, 16, 0, 16, -archRoundness)
		        .curve(0, 16, -1, 13, 0.6)
                .fill(this.color);
	}
    
}