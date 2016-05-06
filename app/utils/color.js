System.register([], function(exports_1) {
    var Color;
    return {
        setters:[],
        execute: function() {
            /**
             * Color utility methods, such as HSV/RGB conversions.
             *
             * John Maloney, August 2009
             */
            Color = (function () {
                function Color() {
                }
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
                Color.decimalToHex = function (d) {
                    var hex = Number(d).toString(16);
                    hex = "#000000".substr(0, 7 - hex.length) + hex;
                    return hex;
                };
                return Color;
            })();
            exports_1("Color", Color);
        }
    }
});
//# sourceMappingURL=color.js.map