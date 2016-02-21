import {BaseShape} from './base.shape';
import {Graphics} from '../utils/graphics';

export class BooleanShape extends BaseShape
{
    constructor(color: number)
    {
        super(color);
        // this.isReporter = true;
		// this.indentLeft = 9;
		// this.indentRight = 7;
    }
    
    draw()
    {
		var centerY:number = this.topH / 2;
        Graphics.builder()
		          .moveTo(centerY, this.topH)
		          .lineTo(0, centerY)
		          .lineTo(centerY, 0)
		          .lineTo(this.w - centerY, 0)
		          .lineTo(this.w, centerY)
		          .lineTo(this.w - centerY, this.topH)
                  .draw();
	}

    
}