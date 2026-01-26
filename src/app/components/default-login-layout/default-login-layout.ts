import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-default-login-layout',
  imports: [CommonModule],
  templateUrl: './default-login-layout.html',
})
export class DefaultLoginLayout {
  @Input() title: string = '';
  @Input() primaryButtonText: string = '';
  @Input() secondaryButtonText: string = '';
  @Input() disablePrimaryButton: boolean = true;
  @Input() isLoading: boolean = false;
  @Output("submit") onSubmit = new EventEmitter();
  @Output("navigate") onNavigate = new EventEmitter();

  submit(){
    this.onSubmit.emit(

    );
  }

  navigate(){
    this.onNavigate.emit(

    );
  }
}
