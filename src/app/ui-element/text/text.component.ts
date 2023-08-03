import { Component, Input } from '@angular/core';
import { ElementProps, UIElement } from '@dynamic/plugin';

interface TextProps extends ElementProps {
  label: string;
  text: string;
}

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
@UIElement('text')
export class TextComponent {
  @Input() props: TextProps;
}
