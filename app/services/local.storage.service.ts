export class LocalStorageService {
    static getRecentProjects(): string[] {
        let projects = window.localStorage.getItem("recentProjects");
        if (!projects) return [];
        else return JSON.parse(projects);
    }

    static addRecentProject(projectID: string) {
        let projects = LocalStorageService.getRecentProjects();
        if (!(projects.indexOf(projectID) > -1)) {
            projects.push(projectID);
            window.localStorage.setItem("recentProjects", JSON.stringify(projects));
        }
    }
}
