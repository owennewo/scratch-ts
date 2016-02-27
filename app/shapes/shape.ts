export interface Shape {
    h: number;
    y: number;
    getGroup(): any;
    draw();
    move(x: number, y: number);
    setWidthAndTopHeight(w: number, h: number);
    setColor(color: any);
}
