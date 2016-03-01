import {ModelService} from "./components/model.service";
import {bootstrap}    from "angular2/platform/browser";
import {AppComponent} from "./app.component";
import {HTTP_PROVIDERS} from "angular2/http";
import {ScratchRestIO} from "./io/scratch.rest.io";

bootstrap(AppComponent, [HTTP_PROVIDERS, ScratchRestIO, ModelService]);
