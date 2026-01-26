import { Component } from '@angular/core';
import { DefaultLoginLayout } from '../../components/default-login-layout/default-login-layout';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { PrimaryInput } from '../../components/primary-input/primary-input';
import { Router } from '@angular/router';
import { Login as LoginService } from '../../services/login';
import { ToastrService } from 'ngx-toastr';

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
})
export class Signup {
  signupForm!: FormGroup<SignupForm>;

  constructor(
    private router: Router,
    private signupService: LoginService,
    private toastr: ToastrService
  ){
    this.signupForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  submit(){
    this.signupService.signup(this.signupForm.value.name!, this.signupForm.value.email!, this.signupForm.value.password!, this.signupForm.value.passwordConfirm!).subscribe({
      next: () => {
        this.toastr.success('Conta criada com sucesso!');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.toastr.error('Erro ao criar conta. Verifique suas credenciais.');
      }
    });
  }

  navigate(){
    this.router.navigate(['/login']);
  }
}
