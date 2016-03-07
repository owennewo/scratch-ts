export class Geometry {
    // Geometry Constants
    static CornerInset: number = 3;
    static InnerCornerInset: number = 2;

    static EmptyStackH: number = 12;
    static StackInset: number = 15;

    static BottomBarH: number = 16; // height of the bottom bar of a C or E block
    static DividerH: number = 18; // height of the divider bar in an E block

    static NotchDepth: number = 3;
    static NotchL1: number = 13;
    static NotchL2: number = Geometry.NotchL1 + Geometry.NotchDepth;
    static NotchR1: number = Geometry.NotchL2 + 8;
    static NotchR2: number = Geometry.NotchR1 + Geometry.NotchDepth;

}

export class Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
    left: number;
    right: number;
    bottom: number;
    top: number;

    static fromBBox(box: any) {
      return new Rectangle(box.x, box.y, box.w, box.h);
    }

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.left = x;
        this.right = x + width;
        this.top = y;
        this.bottom = y + height;
    }

}

export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

}
