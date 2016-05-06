System.register(["../shapes/geometry"], function(exports_1) {
    var geometry_1;
    var PathBuilder;
    return {
        setters:[
            function (geometry_1_1) {
                geometry_1 = geometry_1_1;
            }],
        execute: function() {
            PathBuilder = (function () {
                function PathBuilder() {
                    this.path = "";
                }
                PathBuilder.create = function () {
                    return new PathBuilder();
                };
                PathBuilder.prototype.moveTo = function (x, y) {
                    // if (!x) x = 5;
                    // if (!y) y = 5;
                    // this.xCurrent = x;
                    // this.yCurrent = y;
                    this.appendPath("M" + x + "," + y);
                    return this;
                };
                PathBuilder.prototype.lineTo = function (x, y) {
                    // if (!x) x = 5;
                    // if (!y) y = 5;
                    // this.xCurrent = x;
                    // this.yCurrent = y;
                    this.appendPath("L" + x + "," + y);
                    return this;
                };
                PathBuilder.prototype.appendPath = function (extra) {
                    this.path = this.path + extra;
                    return this;
                };
                PathBuilder.prototype.drawTop = function (w) {
                    this.moveTo(0, geometry_1.Geometry.CornerInset);
                    this.lineTo(geometry_1.Geometry.CornerInset, 0);
                    this.lineTo(geometry_1.Geometry.NotchL1, 0);
                    this.lineTo(geometry_1.Geometry.NotchL2, geometry_1.Geometry.NotchDepth);
                    this.lineTo(geometry_1.Geometry.NotchR1, geometry_1.Geometry.NotchDepth);
                    this.lineTo(geometry_1.Geometry.NotchR2, 0);
                    this.lineTo(w - geometry_1.Geometry.CornerInset, 0);
                    this.lineTo(w, geometry_1.Geometry.CornerInset);
                    return this;
                };
                PathBuilder.prototype.drawRightAndBottom = function (bottomY, w, hasNotch, inset) {
                    if (inset === void 0) { inset = 0; }
                    this.lineTo(w, bottomY - geometry_1.Geometry.CornerInset);
                    this.lineTo(w - geometry_1.Geometry.CornerInset, bottomY);
                    if (hasNotch) {
                        this.lineTo(inset + geometry_1.Geometry.NotchR2, bottomY);
                        this.lineTo(inset + geometry_1.Geometry.NotchR1, bottomY + geometry_1.Geometry.NotchDepth);
                        this.lineTo(inset + geometry_1.Geometry.NotchL2, bottomY + geometry_1.Geometry.NotchDepth);
                        this.lineTo(inset + geometry_1.Geometry.NotchL1, bottomY);
                    }
                    if (inset > 0) {
                        this.lineTo(inset + geometry_1.Geometry.InnerCornerInset, bottomY);
                        this.lineTo(inset, bottomY + geometry_1.Geometry.InnerCornerInset);
                    }
                    else {
                        this.lineTo(inset + geometry_1.Geometry.CornerInset, bottomY);
                        this.lineTo(0, bottomY - geometry_1.Geometry.CornerInset);
                    }
                    return this;
                };
                PathBuilder.prototype.drawLoopArrow = function (w, h) {
                    // Draw the arrow on loop blocks.
                    var arrow = [
                        [8, 0], [2, -2], [0, -3],
                        [3, 0], [-4, -5], [-4, 5], [3, 0],
                        [0, 3], [-8, 0], [0, 2]];
                    // TODO sort out color
                    // this.beginFill("#000", 0.3);
                    this.drawPath(w - 15, h - 3, arrow); // shadow
                    // this.beginFill("#FFFFFF", 0.9);
                    this.drawPath(w - 16, h - 4, arrow); // white arrow
                    // this.endFill();
                    return this;
                };
                PathBuilder.prototype.drawPath = function (startX, startY, deltas) {
                    // Starting at startX, startY, draw a sequence of lines following the given position deltas.
                    var nextX = startX;
                    var nextY = startY;
                    this.moveTo(nextX, nextY);
                    for (var _i = 0; _i < deltas.length; _i++) {
                        var d = deltas[_i];
                        this.lineTo(nextX += d[0], nextY += d[1]);
                    }
                    return this;
                };
                PathBuilder.prototype.drawArm = function (armTop, w) {
                    this.lineTo(geometry_1.Geometry.SubstackInset, armTop - geometry_1.Geometry.InnerCornerInset);
                    this.lineTo(geometry_1.Geometry.SubstackInset + geometry_1.Geometry.InnerCornerInset, armTop);
                    this.lineTo(w - geometry_1.Geometry.CornerInset, armTop);
                    this.lineTo(w, armTop + geometry_1.Geometry.CornerInset);
                    return this;
                };
                PathBuilder.prototype.curve = function (p1x, p1y, p2x, p2y, roundness) {
                    // Compute the Bezier control point by following an orthogonal vector from the midpoint
                    // of the line between p1 and p2 scaled by roundness * dist(p1, p2). The default roundness
                    // approximates a circular arc. Negative roundness gives a concave curve.
                    if (roundness === void 0) { roundness = 0.42; }
                    // this.appendPath("Q" + p1x + "," + p1y + "," + p2x + "," + p2y);
                    var midX = (p1x + p2x) / 2.0;
                    var midY = (p1y + p2y) / 2.0;
                    var cx = midX + (roundness * (p2y - p1y));
                    var cy = midY - (roundness * (p2x - p1x));
                    this.curveTo(cx, cy, p2x, p2y);
                    return this;
                };
                PathBuilder.prototype.curveTo = function (cx, cy, p2x, p2y) {
                    this.appendPath("R" + cx + "," + cy + "," + p2x + "," + p2y);
                    return this;
                };
                PathBuilder.prototype.curveBezier = function () {
                    var coords = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        coords[_i - 0] = arguments[_i];
                    }
                    var path = "R";
                    coords.forEach(function (coord) {
                        path = path + coord + ",";
                    });
                    path = path.substring(0, path.length - 1);
                    this.appendPath(path);
                    return this;
                };
                PathBuilder.prototype.build = function () {
                    return this.path;
                };
                return PathBuilder;
            })();
            exports_1("PathBuilder", PathBuilder);
        }
    }
});
//# sourceMappingURL=path.builder.js.map