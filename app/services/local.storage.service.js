System.register([], function(exports_1) {
    var LocalStorageService;
    return {
        setters:[],
        execute: function() {
            LocalStorageService = (function () {
                function LocalStorageService() {
                }
                LocalStorageService.getRecentProjects = function () {
                    var projects = window.localStorage.getItem("recentProjects");
                    if (!projects)
                        return {};
                    else
                        return JSON.parse(projects);
                };
                LocalStorageService.addRecentProject = function (projectID, title) {
                    var projects = LocalStorageService.getRecentProjects();
                    if (!projects[projectID]) {
                        projects[projectID] = { id: projectID, title: title };
                        window.localStorage.setItem("recentProjects", JSON.stringify(projects));
                    }
                };
                return LocalStorageService;
            })();
            exports_1("LocalStorageService", LocalStorageService);
        }
    }
});
//# sourceMappingURL=local.storage.service.js.map