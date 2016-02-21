import {BaseShape} from './base.shape';
import {Graphics} from '../utils/graphics';

export class RectangleShape extends BaseShape
{
    constructor(color: number)
    {
        super(color);
    }
    
    draw() 
    { 
        Graphics.builder()
            .drawRect(0, 0, this.w, this.topH)
            .draw(); 
    }
    
}