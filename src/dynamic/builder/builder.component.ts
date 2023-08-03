import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { DynamicUtilityService } from '../services/dynamic-utility.service';
import { Additional, BuilderModel, BuilderProps, Grid } from '@dynamic/builder';
import { Subscription } from 'rxjs';
import { UIElement } from '@dynamic/plugin';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UIElement('builder')
export class BuilderComponent implements OnDestroy, OnChanges {
  private dynamicManage = this.utility.dynamicManage;
  private uuid = this.dynamicManage.getBuilderUUID();
  public builder: BuilderModel;
  private listenerDetectSub: Subscription;
  private _props: BuilderProps;

  spacing: number;
  justify: string;
  className: string;
  style: Record<string, string>;
  additional: any[];

  @Input() set props(props: any) {
    const { instance } = props;
    if (!this.builder) {
      this.updateBuilderAndGrid(props);
      this.listenerDetectSub = (this.builder as any).listenerDetect.subscribe(this.dynamicManage.getForceUpdate(this.forceUpdate.bind(this)));
    }
    if (instance) {
      instance.current = this.builder;
    }

    this._props = props;
  }

  constructor(private utility: DynamicUtilityService, private ref: ChangeDetectorRef) { }

  updateGridView() {
    const grid = (this.builder as unknown as { __grid__: Grid }).__grid__;
    if (!grid) return;

    const { spacing, justify, className = '', additional = [], style = {} } = grid.getViewGrid({});
    this.spacing = spacing;
    this.justify = justify;
    this.additional = additional;
    this.className = className;
    this.style = style;
  }

  updateBuilderAndGrid(props: BuilderProps) {
    this.builder = this.dynamicManage.factory(this.uuid, props) as BuilderModel;
    this.updateGridView();
  }

  forceUpdate() {
    this.updateBuilderAndGrid(this._props);
    this.ref.detectChanges();
  }

  getRowStyle(additional: Additional, style: Record<string, string>) {
    const { spacing = this.spacing } = additional;
    return { marginBottom: `${spacing || 0}px`, ...style };
  }

  ngOnChanges(): void {
    this.updateBuilderAndGrid(this.props);
    (this.builder as any).onChange(this.props);
  }

  ngOnDestroy(): void {
    if (this.listenerDetectSub) this.listenerDetectSub.unsubscribe();
    this.dynamicManage.deleteBuilder(this.uuid);
  }
}
