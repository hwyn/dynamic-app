import './hoc/forward-builder';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BuilderComponent } from './builder/builder.component';
import { FieldComponent } from './field/field.component';
import { EventsDirective } from './directive/events.directive';

@NgModule({
  declarations: [
    BuilderComponent,
    FieldComponent,
    EventsDirective
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FlexLayoutModule
  ],
  exports: [
    BuilderComponent,
    EventsDirective,
    FlexLayoutModule
  ]
})
export class DynamicModule { }
