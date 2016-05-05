export class LocalStorageService {
    static getRecentProjects(): any {
        let projects = window.localStorage.getItem("recentProjects");
        if (!projects) return {};
        else return JSON.parse(projects);
    }

    static addRecentProject(projectID: string, title: string) {
        let projects = LocalStorageService.getRecentProjects();
        if (!projects[projectID]) {
            projects[projectID] = { id: projectID, title: title};
            window.localStorage.setItem("recentProjects", JSON.stringify(projects));
        }
    }
}
