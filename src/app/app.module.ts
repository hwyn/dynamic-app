import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {  MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DynamicModule } from '../dynamic/dynamic.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SelectComponent } from './ui-element/select/select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextComponent } from './ui-element/text/text.component';

@NgModule({
  declarations: [
    AppComponent,
    SelectComponent,
    TextComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DynamicModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
