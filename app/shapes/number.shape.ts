import {BaseShape} from './base.shape';
import {Graphics} from '../utils/graphics';

export class NumberShape extends BaseShape
{
    constructor(color: number, type: string)
    {
        super(color);
        this.indentTop = 2;
        // this.indentBottom = 2;
        // this.indentLeft = 6;
        // this.indentRight = 4;
        
        
        //this.type = 'r';
			
        //this.isReporter = true;
        //this.isRequester = ((type == 'R') || (type == 'rR'));
        //this.forcedRequester = (type == 'rR');
        
    }
    
    draw() {
        
        var centerY:number = this.topH / 2;
        
        Graphics.builder()
                .moveTo(centerY, this.topH)
                .curve(centerY, this.topH, 0, centerY)
		        .curve(0, centerY, centerY, 0)
		        .lineTo(this.w - centerY, 0)
		        .curve(this.w - centerY, 0, this.w, centerY)
		        .curve(this.w, centerY, this.w - centerY, this.topH)
                .draw();
	}
    
}