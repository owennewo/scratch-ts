import {Geometry} from '../shapes/geometry';
import {Color} from '../utils/color';

export class Graphics
{
    static PAPER;
    
    static initialize()
    {
        Graphics.PAPER = Snap("#svg-script-pane");
    }
    
    static builder(): GraphicsBuilder
    {
        return new GraphicsBuilder();
    }
}
    
export class GraphicsBuilder
{
    
    color: string;
    path: string = "";
    
    xCurrent: number = 10;
    yCurrent: number = 10;
	
	clear(): GraphicsBuilder
	{
		this.path = "";
        return this;
	}

	endFill(): GraphicsBuilder
	{
		var p = Graphics.PAPER.path(this.path)
        if (this.color)
        {
             p.attr("fill", this.color);
        }
        return this;
	}
	
	drawRect(x: number, y: number, width: number, height: number): GraphicsBuilder
	{
        if (!x) x = 5;
        if (!y) y = 5;
        if (!width) width = 5;
        if (!height) height = 5;
        // this.moveTo(x, y);
		// this.lineTo(x + width, y);
        // this.lineTo(x + width, y + height);
        // this.lineTo(x, y + height);
        // this.lineTo(x, y);
        let rect = Graphics.PAPER.rect(x, y, width, height);
        rect.attr({
            fill: this.color
        });
        return this;
	}
    
    drawText(x: number, y: number, text: string)
    {
        let t = Graphics.PAPER.text(x, y, text);
        t.attr({
            fill: this.color
        });
    }
	
	moveTo(x: number,y: number): GraphicsBuilder
	{
        if (!x) x = 5;
        if (!y) y = 5;
        this.xCurrent = x;
        this.yCurrent = y;
		this.appendPath("M" + x + "," + y );
        return this;        
	}
	lineTo(x: number, y: number): GraphicsBuilder
	{
        if (!x) x = 5;
        if (!y) y = 5;
        this.xCurrent = x;
        this.yCurrent = y;
		this.appendPath("L" + x + "," + y );
        return this;
	}
	
	lineStyle(thickness?: number, color?: number, alpha?: number, pixelHinting?: boolean): GraphicsBuilder
	{
		console.log("todo: Graphics");
        return this;
	}
	
	beginFill(color: number, alpha?: number): GraphicsBuilder
	{
		this.color = color;
        return this;
	}
	
	curveTo(cx, cy, p2x, p2y): GraphicsBuilder
	{
        if (!cx) cx = 5;
        if (!cy) cy = 5;
        if (!p2x) p2x = 5;
        if (!p2y) p2y = 5;
		this.appendPath("C" + cx + "," + cy + "," + p2x + "," + p2y);
        return this;
	}
    
    private appendPath(extra: string): GraphicsBuilder
    {
        this.path = this.path + extra;
        return this;
    }
    
    draw()
    {
        console.log("drawing:" + this.path);
        Graphics.PAPER.path(this.path);
    }
    
    drawTop(w: number): GraphicsBuilder {
		this.moveTo(0, Geometry.CornerInset);
        this.lineTo(Geometry.CornerInset, 0)
        this.lineTo(Geometry.NotchL1, 0)
        this.lineTo(Geometry.NotchL2, Geometry.NotchDepth)
        this.lineTo(Geometry.NotchR1, Geometry.NotchDepth)
        this.lineTo(Geometry.NotchR2, 0)
        this.lineTo(w - Geometry.CornerInset, 0)
        this.lineTo(w, Geometry.CornerInset)
        return this;
	}

	drawRightAndBottom(bottomY:number, w: number, hasNotch:boolean, inset:number = 0): GraphicsBuilder {
        
		this.lineTo(w, bottomY - Geometry.CornerInset);
		this.lineTo(w - Geometry.CornerInset, bottomY);
		if (hasNotch) {
			this.lineTo(inset + Geometry.NotchR2, bottomY);
			this.lineTo(inset + Geometry.NotchR1, bottomY + Geometry.NotchDepth);
			this.lineTo(inset + Geometry.NotchL2, bottomY + Geometry.NotchDepth);
			this.lineTo(inset + Geometry.NotchL1, bottomY);
		}
		if (inset > 0) { // bottom of control structure arm
			this.lineTo(inset + Geometry.InnerCornerInset, bottomY);
			this.lineTo(inset, bottomY + Geometry.InnerCornerInset);
		} else { // bottom of entire block
			this.lineTo(inset + Geometry.CornerInset, bottomY);
			this.lineTo(0, bottomY - Geometry.CornerInset);
		}
        return this;
	}

	drawLoopArrow(w: number, h:number): GraphicsBuilder {
		// Draw the arrow on loop blocks.
		var arrow:any[] = [
			[8, 0], [2, -2], [0, -3],
			[3, 0], [-4, -5], [-4, 5], [3, 0],
			[0, 3], [-8, 0], [0, 2]];
        
        this.beginFill(0, 0.3)
        this.drawPath(w - 15, h - 3, arrow) // shadow
		this.beginFill(0xFFFFFF, 0.9);
        this.drawPath(w - 16, h - 4, arrow); // white arrow
		this.endFill();
        return this;
	}

	drawPath(startX:number, startY:number, deltas:any[]): GraphicsBuilder {
		// Starting at startX, startY, draw a sequence of lines following the given position deltas.
		var nextX:number = startX;
		var nextY:number = startY;
		this.moveTo(nextX, nextY);
		for (var d of deltas) {
			this.lineTo(nextX += d[0], nextY += d[1]);
		}
        
        return this;
	}



	drawArm(armTop:number, w: number):GraphicsBuilder {
		this.lineTo(Geometry.SubstackInset, armTop - Geometry.InnerCornerInset);
		this.lineTo(Geometry.SubstackInset + Geometry.InnerCornerInset, armTop);
		this.lineTo(w - Geometry.CornerInset, armTop);
		this.lineTo(w, armTop + Geometry.CornerInset);
        return this;
	}

	curve(p1x:number, p1y:number, p2x:number, p2y:number, roundness:number = 0.42):GraphicsBuilder {
		// Compute the Bezier control point by following an orthogonal vector from the midpoint
		// of the line between p1 and p2 scaled by roundness * dist(p1, p2). The default roundness
		// approximates a circular arc. Negative roundness gives a concave curve.

		var midX:number = (p1x + p2x) / 2.0;
		var midY:number = (p1y + p2y) / 2.0;
		var cx:number = midX + (roundness * (p2y - p1y));
		var cy:number = midY - (roundness * (p2x - p1x));
		this.curveTo(cx, cy, p2x, p2y);
        return this;
	}
	
}

