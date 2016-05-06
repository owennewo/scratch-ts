System.register([], function(exports_1) {
    var BlockShapeModel;
    return {
        setters:[],
        execute: function() {
            BlockShapeModel = (function () {
                function BlockShapeModel(type, color) {
                }
                BlockShapeModel.prototype.setColor = function (a) { };
                BlockShapeModel.prototype.nextBlockY = function () { };
                BlockShapeModel.prototype.setSubstack2Height = function (a) { };
                BlockShapeModel.prototype.setSubstack1Height = function (a) { };
                BlockShapeModel.prototype.substack2y = function () { };
                BlockShapeModel.prototype.substack1y = function () { };
                BlockShapeModel.prototype.canHaveSubstack1 = function () { };
                BlockShapeModel.prototype.canHaveSubstack2 = function () { };
                BlockShapeModel.prototype.setWidthAndTopHeight = function (width, height) { };
                BlockShapeModel.prototype.redraw = function () { };
                // // Shapes
                BlockShapeModel.RectShape = 1;
                BlockShapeModel.BooleanShape = 2;
                BlockShapeModel.NumberShape = 3;
                BlockShapeModel.CmdShape = 4;
                BlockShapeModel.FinalCmdShape = 5;
                BlockShapeModel.CmdOutlineShape = 6;
                BlockShapeModel.HatShape = 7;
                BlockShapeModel.ProcHatShape = 8;
                // C-shaped blocks
                BlockShapeModel.LoopShape = 9;
                BlockShapeModel.FinalLoopShape = 10;
                // E-shaped blocks
                BlockShapeModel.IfElseShape = 11;
                return BlockShapeModel;
            })();
            exports_1("BlockShapeModel", BlockShapeModel);
        }
    }
});
//# sourceMappingURL=block.shape.model.js.map