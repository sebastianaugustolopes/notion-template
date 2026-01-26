import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.baseUrl, {
      headers: this.getHeaders()
    });
  }

  updateProfile(data: UpdateProfileRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(this.baseUrl, data, {
      headers: this.getHeaders()
    });
  }
}
