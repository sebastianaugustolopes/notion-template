import { Component, EventEmitter, Input, Output, forwardRef, HostListener, ElementRef, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.componente.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  @ViewChild('selectContainer', { read: ElementRef }) selectContainer?: ElementRef<HTMLElement>;
  @ViewChild('searchInput', { read: ElementRef }) searchInput?: ElementRef<HTMLInputElement>;

  @Input() label = '';
  @Input() options: Array<{ 
    value: any; 
    label: string; 
    icon?: string; 
    iconColor?: string; 
    bgColor?: string; 
    textColor?: string;
    description?: string;
  }> = [];
  @Input() required: boolean | string = false;
  @Input() icon: boolean | string = false;
  @Input() errorMsg = '';
  @Input() placeholder = 'Selecione uma opção...';
  @Input() compact: boolean | string = false;
  @Input() searchable: boolean | string = false;

  @Output() valueChange = new EventEmitter<any>();

  @Input() value: any = null;
  open = false;
  searchTerm = '';
  hoveredIndex = -1;

  onChange = (v: any) => {};
  onTouched = () => {};

  isCompact(): boolean {
    return this.compact === true || this.compact === 'true' || this.compact === '';
  }

  isSearchable(): boolean {
    return this.searchable === true || this.searchable === 'true' || this.searchable === '';
  }

  writeValue(value: any): void { 
    this.value = value; 
  }

  registerOnChange(fn: any): void { 
    this.onChange = fn; 
  }

  registerOnTouched(fn: any): void { 
    this.onTouched = fn; 
  }

  onSelect(v: any) {
    this.value = v;
    this.onChange(v);
    this.onTouched();
    this.valueChange.emit(v);
    this.close();
  }

  getSelectedLabel(): string {
    const found = this.options.find(o => o.value === this.value);
    return found ? found.label : '';
  }

  getSelectedOption() {
    return this.options.find(o => o.value === this.value);
  }

  getFilteredOptions() {
    if (!this.searchTerm) return this.options;
    
    const term = this.searchTerm.toLowerCase();
    return this.options.filter(o => 
      o.label.toLowerCase().includes(term) ||
      (o.description && o.description.toLowerCase().includes(term))
    );
  }

  toggleOpen() {
    if (this.open) {
      this.close();
    } else {
      this.open = true;
      // Focus search input if searchable
      if (this.isSearchable() && this.searchInput) {
        setTimeout(() => {
          this.searchInput?.nativeElement.focus();
        }, 0);
      }
    }
  }

  close() {
    this.open = false;
    this.searchTerm = '';
    this.hoveredIndex = -1;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const container = this.selectContainer?.nativeElement;
    
    if (container && !container.contains(target)) {
      this.close();
    }
  }

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.hoveredIndex = -1;
  }

  onMouseEnterOption(index: number) {
    this.hoveredIndex = index;
  }

  getIconColorClasses(iconColor?: string): string {
    const colorMap: Record<string, string> = {
      violet: 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-violet-500/30 group-hover/item:shadow-violet-500/50',
      blue: 'bg-gradient-to-br from-blue-500 to-cyan-600 shadow-blue-500/30 group-hover/item:shadow-blue-500/50',
      emerald: 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30 group-hover/item:shadow-emerald-500/50',
      amber: 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/30 group-hover/item:shadow-amber-500/50',
      rose: 'bg-gradient-to-br from-rose-500 to-pink-600 shadow-rose-500/30 group-hover/item:shadow-rose-500/50',
      indigo: 'bg-gradient-to-br from-indigo-500 to-blue-600 shadow-indigo-500/30 group-hover/item:shadow-indigo-500/50',
      fuchsia: 'bg-gradient-to-br from-fuchsia-500 to-pink-600 shadow-fuchsia-500/30 group-hover/item:shadow-fuchsia-500/50',
      lime: 'bg-gradient-to-br from-lime-500 to-green-600 shadow-lime-500/30 group-hover/item:shadow-lime-500/50',
      sky: 'bg-gradient-to-br from-sky-500 to-blue-600 shadow-sky-500/30 group-hover/item:shadow-sky-500/50',
      slate: 'bg-gradient-to-br from-slate-500 to-gray-600 shadow-slate-500/30 group-hover/item:shadow-slate-500/50',
    };
    
    return iconColor ? (colorMap[iconColor] || colorMap['slate']) : colorMap['slate'];
  }
}