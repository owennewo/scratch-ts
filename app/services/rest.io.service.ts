import {ScriptLayoutService} from "../services/script.layout.service";
import {Http, Response, HTTP_PROVIDERS} from "angular2/http";
import {Inject, Injectable} from "angular2/core";
import {ProjectIOService} from "../services/project.io.service";
import {Log} from "../logging/Log";
import {StageModel} from "../model/stage.model";
import {SpriteModel} from "../model/sprite.model";
import {SpecLayoutService} from "../services/spec.layout.service";
import {SpecModel} from "../model/spec.model";
import {SpecCategoryModel} from "../model/spec.category.model";
import {Graphics} from "../utils/graphics";

@Injectable()
export class RestIOService {
    id: number;
    name: string;
    lastProjectDir: string;

    constructor( @Inject(Http) private http: Http) { // , @Inject (RunService) private runner: RunService) {

    }

    loadProjectJson(res: Response) {
        let json = JSON.parse(res["_body"]);
        Log.info("Reading project", JSON.stringify(json));

        // var scratch: Scratch = new Scratch();
        let projectIO: ProjectIOService = new ProjectIOService();
        let project = projectIO.readProject(json);

        SpecLayoutService.drawCategories();

        if (project.children.length > 0) {
          let sprite = project.children[0];
          if (sprite.scripts && sprite.scripts.length > 0) {
            ScriptLayoutService.drawObject(sprite);
          }
        }




    }

    load() {
        let projectID = "97867080";
        let projectUrl = "http://projects.scratch.mit.edu/internalapi/project/" + projectID + "/get/";
        console.log("reading project file:" + projectUrl);
        this.http.get(projectUrl).subscribe((res: Response) => this.loadProjectJson(res));
    }

}
