System.register([], function(exports_1) {
    var Geometry, Rectangle, Point;
    return {
        setters:[],
        execute: function() {
            Geometry = (function () {
                function Geometry() {
                }
                // Geometry Constants
                Geometry.CornerInset = 3;
                Geometry.InnerCornerInset = 2;
                Geometry.EmptyStackH = 12;
                Geometry.StackInset = 15;
                Geometry.BottomBarH = 16; // height of the bottom bar of a C or E block
                Geometry.DividerH = 18; // height of the divider bar in an E block
                Geometry.NotchDepth = 3;
                Geometry.NotchL1 = 13;
                Geometry.NotchL2 = Geometry.NotchL1 + Geometry.NotchDepth;
                Geometry.NotchR1 = Geometry.NotchL2 + 8;
                Geometry.NotchR2 = Geometry.NotchR1 + Geometry.NotchDepth;
                Geometry.SubstackInset = 15;
                return Geometry;
            })();
            exports_1("Geometry", Geometry);
            Rectangle = (function () {
                function Rectangle(x, y, width, height) {
                    this.x = x;
                    this.y = y;
                    this.width = width;
                    this.height = height;
                    this.left = x;
                    this.right = x + width;
                    this.top = y;
                    this.bottom = y + height;
                }
                Rectangle.fromBBox = function (box) {
                    return new Rectangle(box.x, box.y, box.w, box.h);
                };
                return Rectangle;
            })();
            exports_1("Rectangle", Rectangle);
            Point = (function () {
                function Point(x, y) {
                    this.x = x;
                    this.y = y;
                }
                return Point;
            })();
            exports_1("Point", Point);
        }
    }
});
//# sourceMappingURL=geometry.js.map