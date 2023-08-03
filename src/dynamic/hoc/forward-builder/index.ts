import { BuilderModel, BuilderProps } from '@dynamic/builder';
import { FORWARD_BUILDER, forwardHocComponent } from '@dynamic/plugin';
import { Type } from '@fm/di';

export const forwardBuilder = forwardHocComponent(FORWARD_BUILDER, <T extends BuilderModel>(Model: Type<T>, props: BuilderProps) => {
  return class BuilderModelProps {
    BuilderModel = Model;
    constructor(_props?: any) {
      Object.assign(this, props, _props);
    }
  };
})
