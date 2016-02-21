import {Shape} from './shape'
import {BooleanShape} from './boolean.shape'
import {CommandOutlineShape} from './command.outline.shape'
import {CommandShape} from './command.shape'
import {FinalCommandShape} from './final.command.shape'
import {FinalLoopShape} from './final.loop.shape'
import {HatShape} from './hat.shape'
import {IfElseShape} from './if.else.shape'
import {LoopShape} from './loop.shape'
import {NumberShape} from './number.shape'
import {ProcHatShape} from './proc.hat.shape'
import {RectangleShape} from './rectangle.shape'


export class ShapeFactory
{
    static createShape(type: string, color: number): Shape
    {
        switch (type)
        {
            case " ": 
            case "" :
            case "w":
                return new CommandShape(color);
            case "b":
                return new BooleanShape(color);
            case "r":
            case "R":
            case "rR":
                return new NumberShape(color, type);
            case "h":
                return new HatShape(color);
            case "c":
                return new LoopShape(color);
            case "cf":
                return new FinalLoopShape(color); 
            case "e":
                return new IfElseShape(color);        
            case "f":
                return new CommandOutlineShape(color, false);        
            case "o":
                return new ProcHatShape(color);
            case "p":        
                return new ProcHatShape(color);
            default:
                return new RectangleShape(color);
                 
        }
        
    }
}