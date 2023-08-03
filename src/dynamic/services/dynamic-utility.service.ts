import { ComponentRef, Injectable, Type, ViewContainerRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CREATE_FORM_CONTROL, DynamicManage, PLUGIN_GET_CONFIG, builderContext } from '@dynamic/plugin';
import { INJECTOR_SCOPE, Injector, ROOT_SCOPE } from '@fm/di';
import { ControlOptions, Grid } from '@dynamic/builder';
import { AsyncValidatorFn, FormControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DynamicUtilityService {
  private dynamicInject: Injector;
  public dynamicManage: DynamicManage;

  constructor(protected http: HttpClient) {
    builderContext.forwardBuilderLayout((grid: Grid, builder: any) => builder.__grid__ = grid);
    this.dynamicInject = Injector.create([
      DynamicUtilityService,
      { provide: INJECTOR_SCOPE, useValue: ROOT_SCOPE },
      { provide: PLUGIN_GET_CONFIG, useFactory: () => this.getConfig.bind(this) },
      { provide: CREATE_FORM_CONTROL, useFactory: () => this.createFormControl.bind(this) },
    ]);
    this.dynamicManage = this.dynamicInject.get(DynamicManage);
  }

  public createFormControl(value: any, { validators, asyncValidators }: ControlOptions) {
    return new FormControl(value, validators as unknown as ValidatorFn[], asyncValidators as unknown as AsyncValidatorFn[]);
  }

  private getConfig(url: string) {
    return this.http.get(url);
  }

  renderDynamicComponent<T>(dynamicComponent: Type<T>, viewContainerRef: ViewContainerRef, params?: any): ComponentRef<T> {
    const componentRef = viewContainerRef.createComponent(dynamicComponent);
    const dynamicComponentInstance: any = componentRef.instance;

    if (params) {
      Object.keys(params).forEach(propertyName => {
        dynamicComponentInstance[propertyName] = params[propertyName];
      });
    }

    return componentRef;
  }
}
