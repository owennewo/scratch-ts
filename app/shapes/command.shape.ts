import {BaseShape} from './base.shape';
import {Graphics} from '../utils/graphics';

export class CommandShape extends BaseShape
{
    w: number;
    hasNotch: boolean = true;
    
    constructor(color: number)
    {
        super(color);
        this.indentTop = 3;
    }
    
   	draw()
    {
        Graphics.builder()
            .drawTop(this.w)
		    .drawRightAndBottom(this.topH, this.w, this.hasNotch)
            .draw();
	}

}