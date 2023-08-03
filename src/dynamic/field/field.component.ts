import { ChangeDetectionStrategy, Component, ComponentRef, Input, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { DynamicUtilityService } from '../services/dynamic-utility.service';
import { BuilderFieldExtensions } from '@dynamic/builder';
import { Subscription } from 'rxjs';
import { ElementProps } from '@dynamic/plugin';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldComponent implements OnDestroy {
  private dynamicManage = this.utility.dynamicManage;
  private listenerDetectSub: Subscription;
  private _builderField: BuilderFieldExtensions;
  private componentRef: ComponentRef<Component>;

  @ViewChild('tplRef', { read: ViewContainerRef, static: true }) tplRef: ViewContainerRef;
  @Input() set builderField(field: BuilderFieldExtensions) {
    this._builderField = field;
    if (!this.componentRef) {
      this.listenerDetectSub = field.instance.listenerDetect.subscribe(this.dynamicManage.getForceUpdate(this.forceUpdate.bind(this)));
      this.render(field);
    } else {
      this.forceUpdate();
    }
  }

  constructor(private utility: DynamicUtilityService) { }

  private createProps() {
    return this.dynamicManage.getElementProps(this._builderField);
  }

  render(field: BuilderFieldExtensions) {
    const { element } = field;
    this.tplRef.clear();
    if (element) {
      this.componentRef = this.utility.renderDynamicComponent(element, this.tplRef, { props: this.createProps() });
      field.instance.current = this.componentRef.instance;
    }
  }

  forceUpdate() {
    if (this.componentRef) {
      const { props } = this.componentRef.instance as { props: ElementProps };
      Object.assign(props, this.createProps());
      this.componentRef.changeDetectorRef.detectChanges();
    }
  }

  ngOnDestroy(): void {
    this.listenerDetectSub.unsubscribe();
    this._builderField.instance.onDestroy(this._builderField.id);
  }
}
