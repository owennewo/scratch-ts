import {BaseShape} from './base.shape';
import {Graphics} from '../utils/graphics';
import {Geometry} from './geometry';

export class CommandOutlineShape extends BaseShape
{
    hasNotch: boolean;
    constructor(color: number, hasNotch: boolean)
    {
        super(color);
        this.hasNotch = hasNotch;
        //			this.base.filters = []; // no bezel
			this.indentTop = 3;
    }
    
   	draw() 
    {
        Graphics.builder()
                .endFill() // do not fill
		        .lineStyle(2, 0xFFFFFF, 0.2)
		        .drawTop(this.w)
		        .drawRightAndBottom(this.topH, this.w, this.hasNotch)
		        .lineTo(0, Geometry.CornerInset)
                .draw();
	}

}