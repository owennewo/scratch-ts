System.register(["./stage.model", "angular2/testing"], function(exports_1) {
    var stage_model_1, testing_1;
    return {
        setters:[
            function (stage_model_1_1) {
                stage_model_1 = stage_model_1_1;
            },
            function (testing_1_1) {
                testing_1 = testing_1_1;
            }],
        execute: function() {
            /**
             * Example Unit Test
             */
            testing_1.describe("project.model", function () {
                var initial = new stage_model_1.StageModel();
                initial.tempo = 60;
                initial.videoAlpha = 1.0;
                var duplicate = initial.duplicate();
                testing_1.describe("duplicate checks", function () {
                    testing_1.it("duplicate has different reference", function () { return testing_1.expect(initial).not.toBe(duplicate); });
                    testing_1.it("duplicate has same tempo", function () { return testing_1.expect(initial.tempo).toEqual(duplicate.tempo); });
                    testing_1.it("duplicate has same videoAlpha", function () { return testing_1.expect(initial.videoAlpha).toEqual(duplicate.videoAlpha); });
                });
            });
        }
    }
});
//# sourceMappingURL=project.model.spec.js.map