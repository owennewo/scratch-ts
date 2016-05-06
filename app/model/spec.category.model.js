System.register([], function(exports_1) {
    var SpecCategoryModel;
    return {
        setters:[],
        execute: function() {
            SpecCategoryModel = (function () {
                function SpecCategoryModel(id, name, color) {
                    this.id = id;
                    this.name = name;
                    this.color = color;
                    this.specs = [];
                }
                SpecCategoryModel.GetColorFromSpec = function (spec) {
                    // TODO find correct color
                    return "#FC0";
                };
                SpecCategoryModel.GetByType = function (type) {
                    // TODO
                    return null;
                };
                SpecCategoryModel.prototype.addSpec = function (spec) {
                    this.specs.push(spec);
                };
                SpecCategoryModel.prototype.toString = function () {
                    return "[SpecCategoryModel name=" + name + "]";
                };
                SpecCategoryModel.initialize = function () {
                    // SpecCategoryModel.add(SpecCategoryModel.UNDEFINED);
                    SpecCategoryModel.add(SpecCategoryModel.MOTION);
                    SpecCategoryModel.add(SpecCategoryModel.LOOKS);
                    SpecCategoryModel.add(SpecCategoryModel.SOUND);
                    SpecCategoryModel.add(SpecCategoryModel.PEN);
                    SpecCategoryModel.add(SpecCategoryModel.EVENTS);
                    SpecCategoryModel.add(SpecCategoryModel.CONTROL);
                    SpecCategoryModel.add(SpecCategoryModel.SENSING);
                    SpecCategoryModel.add(SpecCategoryModel.OPERATORS);
                    SpecCategoryModel.add(SpecCategoryModel.DATA);
                    SpecCategoryModel.add(SpecCategoryModel.MORE);
                    SpecCategoryModel.add(SpecCategoryModel.LIST);
                    SpecCategoryModel.add(SpecCategoryModel.EXTENSION);
                };
                SpecCategoryModel.add = function (category) {
                    SpecCategoryModel.CATEGORIES.set(category.id, category);
                };
                SpecCategoryModel.CATEGORIES = new Map();
                // SPRITE CATEGORIES
                SpecCategoryModel.UNDEFINED = new SpecCategoryModel(0, "undefined", "#D42828");
                SpecCategoryModel.MOTION = new SpecCategoryModel(1, "Motion", "#4a6cd4");
                SpecCategoryModel.LOOKS = new SpecCategoryModel(2, "Looks", "#8a55d7");
                SpecCategoryModel.SOUND = new SpecCategoryModel(3, "Sound", "#bb42c3");
                SpecCategoryModel.PEN = new SpecCategoryModel(4, "Pen", "#0e9a6c"); // Scratch 1.4: 0x009870
                SpecCategoryModel.EVENTS = new SpecCategoryModel(5, "Events", "#c88330");
                SpecCategoryModel.CONTROL = new SpecCategoryModel(6, "Control", "#e1a91a");
                SpecCategoryModel.SENSING = new SpecCategoryModel(7, "Sensing", "#2ca5e2");
                SpecCategoryModel.OPERATORS = new SpecCategoryModel(8, "Operators", "#5cb712");
                SpecCategoryModel.DATA = new SpecCategoryModel(9, "Data", "#EE7D16"); // Scratch 1.4: 0xF3761D
                SpecCategoryModel.MORE = new SpecCategoryModel(10, "More Blocks", "#632D99"); // 0x531E99;
                SpecCategoryModel.PARAMETER = new SpecCategoryModel(11, "Parameter", "#5947B1");
                SpecCategoryModel.LIST = new SpecCategoryModel(12, "List", "#CC5B22"); // Scratch 1.4: 0xD94D11
                SpecCategoryModel.EXTENSION = new SpecCategoryModel(20, "Extension", "#4B4A60"); // 0x72228C; // 0x672D79;
                // STAGE CATEGORIES
                SpecCategoryModel.LOOKS_STAGE = new SpecCategoryModel(102, "Looks", "#8a55d7");
                SpecCategoryModel.PEN_STAGE = new SpecCategoryModel(104, "Pen", "#0x0e9a6c");
                SpecCategoryModel.CONTROL_STAGE = new SpecCategoryModel(104, "Control", "#e1a91a");
                SpecCategoryModel.SENSING_STAGE = new SpecCategoryModel(7, "Sensing", "#2ca5e2");
                SpecCategoryModel.OLD = new SpecCategoryModel(98, "OLD", "#4B4A60"); // 0x72228C; // 0x672D79;
                SpecCategoryModel.BETA = new SpecCategoryModel(99, "BETA", "#4B4A60"); // 0x72228C; // 0x672D79;
                return SpecCategoryModel;
            })();
            exports_1("SpecCategoryModel", SpecCategoryModel);
        }
    }
});
//# sourceMappingURL=spec.category.model.js.map