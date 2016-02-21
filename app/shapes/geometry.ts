export class Geometry
{
    // Geometry Constants
    static CornerInset:number = 3;
	static InnerCornerInset:number = 2;
	
	static EmptySubstackH:number = 12;
	static SubstackInset:number = 15;
    
    static BottomBarH:number = 16; // height of the bottom bar of a C or E block
	static DividerH:number = 18; // height of the divider bar in an E block
    
    static NotchDepth:number = 3;
   	static NotchL1:number = 13;
	static NotchL2:number = Geometry.NotchL1 + Geometry.NotchDepth;
	static NotchR1:number = Geometry.NotchL2 + 8;
	static NotchR2:number = Geometry.NotchR1 + Geometry.NotchDepth;

}