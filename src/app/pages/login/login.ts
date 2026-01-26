import { Component } from '@angular/core';
import { DefaultLoginLayout } from '../../components/default-login-layout/default-login-layout';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { PrimaryInput } from '../../components/primary-input/primary-input';
import { Router } from '@angular/router';
import { Login as LoginService } from '../../services/login';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

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
})
export class Login {
  loginForm!: FormGroup<LoginForm>;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastr: ToastrService
  ){
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  get isFormInvalid(): boolean {
    return this.loginForm.invalid || this.isLoading;
  }

  submit(){
    if (this.isLoading || this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.loginService.login(this.loginForm.value.email!, this.loginForm.value.password!).pipe(finalize(() => {
      this.isLoading = false;
    })).subscribe({
      next: () => {
        this.toastr.success('Login realizado com sucesso!');
        this.router.navigate(['/dashboard']);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 429) {
          this.toastr.error('Muitas tentativas de login. Por favor, tente novamente mais tarde.');
        } else {
          this.toastr.error('Erro ao fazer login. Verifique suas credenciais.');
        }
      }
    });
  }

  navigate(){
    this.router.navigate(['/signup']);
  }
}
