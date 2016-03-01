import {Component, Inject} from "angular2/core";
import {MenuBarComponent} from "./components/menubar.component";
import {ContainerComponent} from "./components/container.component";

import {SpecModel} from "./model/spec.model";
import {SpecCategoryModel} from "./model/spec.category.model";
import {Graphics} from "./utils/graphics";


@Component({
  selector: "body",
  template: `
    <nav id="menu-bar" class="navbar navbar-inverse navbar-fixed-top"></nav>
    <div id="container" class="container-fluid"></div>
  `,
  styles: [`
    #container { top:50px; position: fixed; width: 100%; }
  `],
  directives: [MenuBarComponent, ContainerComponent]
})
export class AppComponent {

    constructor() {
      SpecCategoryModel.initialize();
      SpecModel.initialize();

    }

}
