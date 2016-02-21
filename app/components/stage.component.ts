import {Component} from 'angular2/core';

@Component({
  selector: 'section[id=stage]',
  template: `
   
        <div id="stage-header">stage header</div>
        <div id="stage-content">stage content</div>
   
  `,
  styles: [`
    #stage-header
    {
      height: 40px;
    }
    #stage-content
    {
      width: 480px;
      height: 360px;
      background: lightblue;
    }
  `]
})
export class StageComponent {
  
}