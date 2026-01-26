import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of, tap, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profilePhoto: string | null;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  profilePhoto?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private readonly baseUrl = `${environment.apiUrl}/api/user/profile`;
  
  // Cache do perfil do usuário
  private profileSubject = new BehaviorSubject<UserProfile | null>(null);
  private profileLoaded = false;
  private profileRequest$: Observable<UserProfile> | null = null;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Retorna o perfil do usuário.
   * Se já estiver em cache, retorna imediatamente.
   * Caso contrário, faz a requisição e armazena em cache.
   */
  getProfile(): Observable<UserProfile> {
    // Se já temos o perfil em cache, retorna imediatamente
    if (this.profileLoaded && this.profileSubject.value) {
      return of(this.profileSubject.value);
    }

    // Se já existe uma requisição em andamento, retorna ela (evita requisições duplicadas)
    if (this.profileRequest$) {
      return this.profileRequest$;
    }

    // Faz a requisição e armazena em cache
    this.profileRequest$ = this.http.get<UserProfile>(this.baseUrl, {
      headers: this.getHeaders()
    }).pipe(
      tap(profile => {
        this.profileSubject.next(profile);
        this.profileLoaded = true;
        this.profileRequest$ = null;
      }),
      shareReplay(1)
    );

    return this.profileRequest$;
  }

  /**
   * Atualiza o perfil do usuário e o cache local
   */
  updateProfile(data: UpdateProfileRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(this.baseUrl, data, {
      headers: this.getHeaders()
    }).pipe(
      tap(profile => {
        // Atualiza o cache com o novo perfil
        this.profileSubject.next(profile);
        this.profileLoaded = true;
        
        // Atualiza o nome no sessionStorage se foi alterado
        if (data.name) {
          sessionStorage.setItem('name', data.name);
        }
      })
    );
  }

  /**
   * Retorna um Observable que emite sempre que o perfil é atualizado
   */
  getProfileChanges(): Observable<UserProfile | null> {
    return this.profileSubject.asObservable();
  }

  /**
   * Força o recarregamento do perfil do servidor
   */
  refreshProfile(): Observable<UserProfile> {
    this.profileLoaded = false;
    this.profileRequest$ = null;
    return this.getProfile();
  }

  /**
   * Limpa o cache (usar no logout)
   */
  clearCache(): void {
    this.profileSubject.next(null);
    this.profileLoaded = false;
    this.profileRequest$ = null;
  }
}
