import {BaseShape} from './base.shape';
import {Graphics} from '../utils/graphics';
import {Geometry} from './geometry';

export class LoopShape extends BaseShape
{
    substack1H: number = Geometry.EmptySubstackH;
    hasLoopArrow: boolean;
    
    constructor(color: number)
    {
        super(color);
    }
    
   	draw()
    {
        var h1:number = this.topH + this.substack1H - Geometry.NotchDepth;
        
        let g = Graphics.builder()
                g.drawTop(this.w)
		        g.drawRightAndBottom(this.topH, this.w, true, Geometry.SubstackInset)
		        g.drawArm(h1, this.w)
		        g.drawRightAndBottom(h1 + Geometry.BottomBarH, this.w, true)
		if (this.hasLoopArrow) 
        {
            g.drawLoopArrow(this.w, h1 + Geometry.BottomBarH)
        }
        g.draw();
	}

    
}