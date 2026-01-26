import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './textarea.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})
export class TextareaComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() rows = 3;
  // accept boolean or attribute string
  @Input() required: boolean | string = false;
  @Input() errorMsg: string = '';
  @Input() controlName?: string;

  value = '';
  onChange = (v: any) => {};
  onTouched = () => {};

  writeValue(value: any): void { this.value = value ?? ''; }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

  onInput(event: Event) {
    const v = (event.target as HTMLTextAreaElement).value;
    this.value = v;
    this.onChange(v);
  }
}
