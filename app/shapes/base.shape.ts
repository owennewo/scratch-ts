import {Shape} from './shape';
import {Graphics, GraphicsBuilder} from '../utils/graphics';


export abstract class BaseShape implements Shape
{
    
    color: number;
    h: number = 10;
    w: number = 40;
    topH: number;
    indentTop: number = 0;
    
    constructor(color: number)
    {
        this.color = color;
    }
    
    abstract draw();
    
}

