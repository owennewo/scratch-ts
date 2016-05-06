System.register([], function(exports_1) {
    var ProjectDetailModel, Creator, UserProfile;
    return {
        setters:[],
        execute: function() {
            ProjectDetailModel = (function () {
                function ProjectDetailModel() {
                    this.creator = new Creator();
                }
                return ProjectDetailModel;
            })();
            exports_1("ProjectDetailModel", ProjectDetailModel);
            Creator = (function () {
                function Creator() {
                    this.userprofile = new UserProfile();
                }
                return Creator;
            })();
            exports_1("Creator", Creator);
            UserProfile = (function () {
                function UserProfile() {
                }
                return UserProfile;
            })();
            exports_1("UserProfile", UserProfile);
        }
    }
});
//# sourceMappingURL=project.detail.model.js.map