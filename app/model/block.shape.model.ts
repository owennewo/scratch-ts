export class BlockShapeModel
{
    
    // // Shapes
	public static RectShape:number = 1;
	public static BooleanShape:number = 2;
	public static NumberShape:number = 3;
	public static CmdShape:number = 4;
	public static FinalCmdShape:number = 5;
	public static CmdOutlineShape:number = 6;
	public static HatShape:number = 7;
	public static ProcHatShape:number = 8;
	// C-shaped blocks
	public static LoopShape:number = 9;
	public static FinalLoopShape:number = 10;
	// E-shaped blocks
	public static IfElseShape:number = 11;
    
    // Member variables;
    type: number;
    
    constructor(type: string, color: number) {
        
    }
    
 private drawRectShape(g:Graphics):void { g.drawRect(0, 0, this.w, this.topH) }






	
   
    
}