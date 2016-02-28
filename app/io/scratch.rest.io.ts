import {ScriptLayout} from "../ui/script.layout";
import {Http, Response, HTTP_PROVIDERS} from "angular2/http";
import {Inject, Injectable} from "angular2/core";
import {ProjectIO} from "../io/project.io";
import {Log} from "../logging/Log";
import {ProjectModel} from "../model/project.model";
import {SpriteModel} from "../model/sprite.model";
import {SpecLayout} from "../ui/spec.layout";
import {SpecModel} from "../model/spec.model";
import {SpecCategoryModel} from "../model/spec.category.model";
import {Graphics} from "../utils/graphics";

@Injectable()
export class ScratchRestIO {
    id: number;
    name: string;
    lastProjectDir: string;

    constructor( @Inject(Http) private http: Http) { // , @Inject (RunService) private runner: RunService) {

    }

    loadProjectJson(res: Response) {
        let json = JSON.parse(res["_body"]);
        Log.info("Reading project", JSON.stringify(json));

        // var scratch: Scratch = new Scratch();
        let projectIO: ProjectIO = new ProjectIO();
        let project = projectIO.readProject(json);

        SpecLayout.drawCategories();

        if (project.children.length > 0) {
          let sprite = project.children[0];
          if (sprite.scripts && sprite.scripts.length > 0) {
            ScriptLayout.drawScripts(sprite.scripts);
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
