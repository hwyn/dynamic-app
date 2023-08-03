import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ElementProps, UIElement } from '@dynamic/plugin';

interface SelectProps extends ElementProps {
  label: string;
}

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
@UIElement('select')
export class SelectComponent {
  @Input() props: SelectProps & { control: FormControl };
  private _control: FormControl;

  selectionChange(event: any) {
    const { onChange } = this.props.events || {};
    if (onChange) {
      onChange(event.value);
    }
  }

  get events() {
    return { ...this.props.events, onSelectionChange: ($event: Event) => this.selectionChange($event) };
  }

  get control(): FormControl {
    return this.props.control ?? this._control ?? (this._control = new FormControl());
  }
}
