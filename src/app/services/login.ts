import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../types/login-response.type';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Login {
  constructor(private httpClient: HttpClient) {}
  
  private apiUrl = environment.apiUrl;

  login(email: string, password: string){
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((value) => {
        sessionStorage.setItem('token', value.token);
        sessionStorage.setItem('name', value.name);
      })
    );
  }

  signup(name: string, email: string, password: string, passwordConfirm: string){
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}/auth/signup`, { name, email, password, passwordConfirm }).pipe(
      tap((value) => {
        sessionStorage.setItem('token', value.token);
        sessionStorage.setItem('name', value.name);
      })
    );
  }
}
