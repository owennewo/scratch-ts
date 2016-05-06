System.register(["./services/model.service", "angular2/platform/browser", "./app.component", "angular2/http", "./services/rest.io.service"], function(exports_1) {
    var model_service_1, browser_1, app_component_1, http_1, rest_io_service_1;
    return {
        setters:[
            function (model_service_1_1) {
                model_service_1 = model_service_1_1;
            },
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (rest_io_service_1_1) {
                rest_io_service_1 = rest_io_service_1_1;
            }],
        execute: function() {
            browser_1.bootstrap(app_component_1.AppComponent, [http_1.HTTP_PROVIDERS, rest_io_service_1.RestIOService, model_service_1.ModelService]);
        }
    }
});
//# sourceMappingURL=main.js.map