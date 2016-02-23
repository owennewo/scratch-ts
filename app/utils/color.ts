/**
 * Color utility methods, such as HSV/RGB conversions.
 *
 * John Maloney, August 2009
 */
export class Color {

	// // Convert hue (0-360), saturation (0-1), and brightness (0-1) to RGB.
	// public static fromHSV(h:number, s:number, v:number):number {
	// 	var r:number, g:number, b:number;
	// 	h = h % 360;
	// 	if (h < 0) h += 360;
	// 	s = Math.max(0, Math.min(s, 1));
	// 	v = Math.max(0, Math.min(v, 1));

	// 	var i:number = Math.floor(h / 60);
	// 	var f:number = (h / 60) - i;
	// 	var p:number = v * (1 - s);
	// 	var q:number = v * (1 - (s * f));
	// 	var t:number = v * (1 - (s * (1 - f)));
	// 	if (i == 0) { r = v; g = t; b = p; }
	// 	else if (i == 1) { r = q; g = v; b = p; }
	// 	else if (i == 2) { r = p; g = v; b = t; }
	// 	else if (i == 3) { r = p; g = q; b = v; }
	// 	else if (i == 4) { r = t; g = p; b = v; }
	// 	else if (i == 5) { r = v; g = p; b = q; }
	// 	r = Math.floor(r * 255);
	// 	g = Math.floor(g * 255);
	// 	b = Math.floor(b * 255);
	// 	return (r << 16) | (g << 8) | b;
	// }

    static decimalToHex(d) {
        let hex = Number(d).toString(16);
        hex = "#000000".substr(0, 7 - hex.length) + hex;
        return hex;
    }

	// // Convert RGB to an array containing the hue, saturation, and brightness.
	// public static rgb2hsv(rgb:number):any[] {
	// 	var h:number, s:number, v:number, x:number, f:number, i:number;
	// 	var r:number = ((rgb >> 16) & 255) / 255;
	// 	var g:number = ((rgb >> 8) & 255) / 255;
	// 	var b:number = (rgb & 255) / 255;
	// 	x = Math.min(Math.min(r, g), b);
	// 	v = Math.max(Math.max(r, g), b);
	// 	if (x == v) return [0, 0, v]; // gray; hue arbitrarily reported as zero
	// 	f = (r == x) ? g - b : ((g == x) ? b - r : r - g);
	// 	i = (r == x) ? 3 : ((g == x) ? 5 : 1);
	// 	h = ((i - (f / (v - x))) * 60) % 360;
	// 	s = (v - x) / v;
	// 	return [h, s, v];
	// }

	// public static scaleBrightness(rgb:number, scale:number):number {
	// 	var hsv:any[] = Color.rgb2hsv(rgb);
	// 	var val:number = Math.max(0, Math.min(scale * hsv[2], 1));
	// 	return Color.fromHSV(hsv[0], hsv[1], val);
	// }

	// public static mixRGB(rgb1:number, rgb2:number, fraction:number):number {
	// 	// Mix rgb1 with rgb2. 0 gives all rgb1, 1 gives rbg2, .5 mixes them 50/50.
	// 	if (fraction <= 0) return rgb1;
	// 	if (fraction >= 1) return rgb2;
	// 	var r1:number = (rgb1 >> 16) & 255;
	// 	var g1:number = (rgb1 >> 8) & 255;
	// 	var b1:number = rgb1 & 255;
	// 	var r2:number = (rgb2 >> 16) & 255;
	// 	var g2:number = (rgb2 >> 8) & 255;
	// 	var b2:number = rgb2 & 255;
	// 	var r:number = ((fraction * r2) + ((1.0 - fraction) * r1)) & 255;
	// 	var g:number = ((fraction * g2) + ((1.0 - fraction) * g1)) & 255;
	// 	var b:number = ((fraction * b2) + ((1.0 - fraction) * b1)) & 255;
	// 	return (r << 16) | (g << 8) | b;
	// }

	// public static random():number {
	// 	// return a random color
	// 	let h:number = 360 * Math.random();
	// 	let s:number = 0.7 + (0.3 * Math.random());
	// 	let v:number = 0.6 + (0.4 * Math.random());
	// 	return Color.fromHSV(h, s, v);
	// }

}
