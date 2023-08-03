import { Directive, HostListener, Input } from '@angular/core';
import { getEventType } from '@dynamic/builder';
import { FieldActionType } from './field-action-type.enum';

@Directive({
  selector: '[app-events]'
})
export class EventsDirective {
  @Input('app-events') events: Record<string, any>;

  @HostListener('focus', ['$event']) onFocus($event: Event) {
    this.executeAction(FieldActionType.focus, $event);
  }

  @HostListener('blur', ['$event']) onBlur($event: Event) {
    this.executeAction(FieldActionType.blur, $event);
  }

  @HostListener('click', ['$event']) onClick($event: Event) {
    this.executeAction(FieldActionType.click, $event);
  }

  @HostListener('change', ['$event']) onChange($event: Event) {
    this.executeAction(FieldActionType.change, $event);
  }

  @HostListener('selectionChange', ['$event']) onSelectionChange($event: Event) {
    this.executeAction(FieldActionType.selectionChange, $event);
  }

  @HostListener('compositionend', ['$event']) onCompositionEnd($event: Event) {
    this.executeAction(FieldActionType.compositionend, $event);
  }

  @HostListener('input', ['$event']) onInput($event: Event) {
    this.executeAction(FieldActionType.input, $event);
  }

  @HostListener('keydown', ['$event']) onKeyDown($event: Event) {
    this.executeAction(FieldActionType.keydown, $event);
  }

  @HostListener('keyup', ['$event']) onKeyUp($event: Event) {
    this.executeAction(FieldActionType.keyup, $event);
  }

  @HostListener('paste', ['$event']) onpaste($event: Event) {
    this.executeAction(FieldActionType.paste, $event);
  }

  @HostListener('document:keydown.tab', ['$event']) onTabKeyDown($event: Event) {
    this.executeAction(FieldActionType.tabKeyDown, $event);
  }

  executeAction(type: FieldActionType, $event: any) {
    const eventHandler = (this.events || {})[getEventType(type)];
    if (eventHandler) eventHandler($event);
  }

}
