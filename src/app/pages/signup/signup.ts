import { Component, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { DefaultLoginLayout } from '../../components/default-login-layout/default-login-layout';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { PrimaryInput } from '../../components/primary-input/primary-input';
import { Router } from '@angular/router';
import { Login as LoginService } from '../../services/login';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

interface SignupForm {
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  passwordConfirm: FormControl<string | null>;
}

@Component({
  selector: 'app-signup',
  imports: [
    DefaultLoginLayout,
    PrimaryInput,
    ReactiveFormsModule,
  ],
  templateUrl: './signup.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Signup implements OnDestroy {
  signupForm: FormGroup<SignupForm>;
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private signupService: LoginService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.signupForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  /**
   * Computed property that evaluates the button disabled state.
   * With OnPush strategy, this is only evaluated when markForCheck() is called.
   */
  get disableButton(): boolean {
    return this.signupForm.invalid || this.isLoading;
  }

  submit(): void {
    if (this.isLoading || this.signupForm.invalid) {
      return;
    }

    this.setLoadingState(true);

    this.signupService
      .signup(
        this.signupForm.value.name!,
        this.signupForm.value.email!,
        this.signupForm.value.password!,
        this.signupForm.value.passwordConfirm!
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.setLoadingState(false);
          this.toastr.success('Conta criada com sucesso!');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.setLoadingState(false);
          this.handleSignupError(error);
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

  private handleSignupError(error: { status?: number }): void {
    if (error.status === 0) {
      // ERR_CONNECTION_REFUSED - backend offline
      this.toastr.error('Servidor indisponível. Verifique sua conexão.');
    } else {
      this.toastr.error('Erro ao criar conta. Verifique suas credenciais.');
    }
  }

  navigate(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
