import { Component } from '@angular/core';
import { BuilderTest } from './builder.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  builderProps = new BuilderTest();
  title = 'dynamic-app';
}
