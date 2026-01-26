import { Component, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { DefaultLoginLayout } from '../../components/default-login-layout/default-login-layout';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { PrimaryInput } from '../../components/primary-input/primary-input';
import { Router } from '@angular/router';
import { Login as LoginService } from '../../services/login';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

interface LoginForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-login',
  imports: [
    DefaultLoginLayout,
    PrimaryInput,
    ReactiveFormsModule,
  ],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnDestroy {
  loginForm: FormGroup<LoginForm>;
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  /**
   * Computed property that evaluates the button disabled state.
   * With OnPush strategy, this is only evaluated when markForCheck() is called.
   */
  get disableButton(): boolean {
    return this.loginForm.invalid || this.isLoading;
  }

  submit(): void {
    if (this.isLoading || this.loginForm.invalid) {
      return;
    }

    this.setLoadingState(true);

    this.loginService
      .login(this.loginForm.value.email!, this.loginForm.value.password!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.setLoadingState(false);
          this.toastr.success('Login realizado com sucesso!');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.setLoadingState(false);
          this.handleLoginError(error);
        },
      });
  }

  /**
   * Centralized method to update loading state and trigger change detection.
   * Using markForCheck() with OnPush strategy ensures Angular only re-renders
   * when we explicitly tell it to, avoiding NG0100 errors.
   */
  private setLoadingState(loading: boolean): void {
    this.isLoading = loading;
    this.cdr.markForCheck();
  }

  private handleLoginError(error: { status?: number }): void {
    if (error.status === 429) {
      this.toastr.error('Muitas tentativas de login. Por favor, tente novamente mais tarde.');
    } else if (error.status === 0) {
      // ERR_CONNECTION_REFUSED - backend offline
      this.toastr.error('Servidor indisponível. Verifique sua conexão.');
    } else {
      this.toastr.error('Erro ao fazer login. Verifique suas credenciais.');
    }
  }

  navigate(): void {
    this.router.navigate(['/signup']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
