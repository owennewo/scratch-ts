import {StageModel} from "../model/stage.model";
import {LocalStorageService} from "../services/local.storage.service";
import {ModelService} from "../services/model.service";
import {Component, Inject} from "angular2/core";

@Component({
  selector: "nav[id=menu-bar]",
  template: `

        <div class="container-fluid">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">Scratch</a>
          </div>
          <div id="navbar" class="navbar-collapse collapse" aria-expanded="false" style="height: 1px;">
            <ul class="nav navbar-nav">
              <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">File <span class="caret"></span></a>
                <ul class="dropdown-menu">
                  <li><a href="#" (click)="promptProject()">Open project</a></li>
                  <li role="separator" class="divider"></li>
                  <li class="dropdown-header">Recent projects</li>
                  <li *ngFor="let key of recentProjectKeys"><a href="#" (click)="openProject(key)">{{key + " (" + recentProjects[key].title + ")" }}</a></li>
                  <li role="separator" class="divider"></li>
                  <li><a href="#">Revert</a></li>
                </ul>
              </li>
               <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Edit <span class="caret"></span></a>
                <ul class="dropdown-menu">
                  <li><a href="#">Undelete</a></li>
                  <li role="separator" class="divider"></li>
                  <li><a href="#">Small Stage Layout</a></li>
                  <li><a href="#">Turbo Mode</a></li>
                </ul>
              </li>
              <li><a href="#">Tips</a></li>
              <li><a href="#">About</a></li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
               <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Account <span class="caret"></span></a>
                <ul class="dropdown-menu">
                  <li><a href="#">Profile</a></li>
                  <li><a href="#">My Stuff</a></li>
                  <li><a href="#">Account Settingss</a></li>
                  <li role="separator" class="divider"></li>
                  <li><a href="#">Sign out</a></li>
                </ul>
              </li>
            </ul>
          </div><!--/.nav-collapse -->
        </div><!--/.container-fluid -->

  `,
  styles: [`

  `]
})
export class MenuBarComponent {
    recentProjects;
    recentProjectKeys;
    constructor(@Inject(ModelService) private modelService: ModelService) {
        this.recentProjects = LocalStorageService.getRecentProjects();
        this.recentProjectKeys = Object.keys(this.recentProjects);
        modelService.onProjectLoaded.subscribe(data => {
            let stage = <StageModel> data;
            let title = "private";
            if (stage.detail) title = stage.detail.title;
            LocalStorageService.addRecentProject(stage.id, title);
        });
    }

    promptProject() {
        let projectID = window.prompt("Please enter the project id");
        if (projectID) {
            console.log("loading project: " + projectID);
            this.modelService.loadProject(projectID);
        }
    }

    openProject(projectId: any) {
        if (projectId) {
            console.log("loading project: " + projectId + ":" + this.recentProjects[projectId]);
            this.modelService.loadProject(projectId);
        }
    }
}
