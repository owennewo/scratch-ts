import {BaseShape} from './base.shape';
import {CommandShape} from './command.shape';
import {Graphics} from '../utils/graphics';

export class FinalCommandShape extends CommandShape
{
    constructor(color: number)
    {
        super(color);
        this.hasNotch = false;
		this.indentTop = 5;
        //this.isTerminal = true;
    }
    
}