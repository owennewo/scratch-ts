import {Observable} from "../../node_modules/rxjs/Observable.d";
import {ProjectDetailModel} from "../model/project.detail.model";
import {ScriptLayoutService} from "../services/script.layout.service";
import {SpecLayoutService} from "../services/spec.layout.service";
import {ProjectIOService} from "../services/project.io.service";
import {StageModel} from "../model/stage.model";
import {ObjectModel} from "../model/object.model";
import {Injectable, Inject} from "@angular/core";
import {Http, Response} from "@angular/http";
import {EventEmitter} from "@angular/core";

@Injectable()
export class ModelService {
  items: Array<any>;

  onProjectLoaded = new EventEmitter<StageModel>();
  onObjectSelected = new EventEmitter<ObjectModel>();

  projectDetail: ProjectDetailModel;

  constructor(@Inject(Http) private http: Http) {

  }

  selectObject(scratchObject: ObjectModel) {
    this.onObjectSelected.emit(scratchObject);
  }

  loadProject(projectId: string) {

    let projectIO: ProjectIOService = new ProjectIOService();

    let projectInfoUrl = "https://scratch.mit.edu/api/v1/project/" + projectId + "/?format=json";
    let self = this;
    this.projectDetail = undefined;

    this.http.get(projectInfoUrl)
              .subscribe(res => {
                  let json = JSON.parse(res["_body"]);
                  self.projectDetail = projectIO.readProjectDetail(json);
                }, err => {
                    let errMsg = "error obtaining project info, perhaps it's private: " + JSON.stringify(err);
                    console.log(errMsg);
                });


    let projectUrl = "http://projects.scratch.mit.edu/internalapi/project/" + projectId + "/get/";
    console.log("reading project file:" + projectUrl);
    this.http.get(projectUrl).subscribe((res: Response) => {
      let json = JSON.parse(res["_body"]);
      let project = projectIO.readProject(json, projectId);
      project.detail = self.projectDetail;

      this.onProjectLoaded.emit(project);

    });
  }

}
