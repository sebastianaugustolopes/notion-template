import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project, ProjectRequest } from '../types/project.type';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/api/projects`;

  constructor(private httpClient: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  createProject(project: ProjectRequest): Observable<Project> {
    return this.httpClient.post<Project>(this.apiUrl, project, {
      headers: this.getHeaders(),
    });
  }

  getProjects(): Observable<Project[]> {
    return this.httpClient.get<Project[]>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  getProject(id: string): Observable<Project> {
    return this.httpClient.get<Project>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  updateProject(id: string, project: ProjectRequest): Observable<Project> {
    return this.httpClient.put<Project>(`${this.apiUrl}/${id}`, project, {
      headers: this.getHeaders(),
    });
  }

  deleteProject(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
