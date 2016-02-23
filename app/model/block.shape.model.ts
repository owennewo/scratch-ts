export class BlockShapeModel {
    public setColor(a: number): any { }
    public nextBlockY(): any { }
    public setSubstack2Height(a: number): any { }
    public setSubstack1Height(a: number): any { }
    public substack2y(): any { }
    public substack1y(): any { }


    // // Shapes
    public static RectShape: number = 1;
    public static BooleanShape: number = 2;
    public static NumberShape: number = 3;
    public static CmdShape: number = 4;
    public static FinalCmdShape: number = 5;
    public static CmdOutlineShape: number = 6;
    public static HatShape: number = 7;
    public static ProcHatShape: number = 8;
    // C-shaped blocks
    public static LoopShape: number = 9;
    public static FinalLoopShape: number = 10;
    // E-shaped blocks
    public static IfElseShape: number = 11;

    // Member variables;
    type: number;
    hasLoopArrow: boolean;

    constructor(type: string, color: string) {

    }

    public canHaveSubstack1(): any { }
    public canHaveSubstack2(): any { }
    public setWidthAndTopHeight(width: number, height: number): any { }
    public redraw(): any { }




}
