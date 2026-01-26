import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskStats, ExpiredTask } from '../types/task.type';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserStatsService {
  private readonly baseUrl = `${environment.apiUrl}/api/user/stats`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getTaskStats(): Observable<TaskStats> {
    return this.http.get<TaskStats>(`${this.baseUrl}/tasks`, {
      headers: this.getHeaders()
    });
  }

  getAllExpiredTasks(): Observable<ExpiredTask[]> {
    return this.http.get<ExpiredTask[]>(`${this.baseUrl}/expired-tasks`, {
      headers: this.getHeaders()
    });
  }

  getExpiredTasksByProject(projectId: string): Observable<ExpiredTask[]> {
    return this.http.get<ExpiredTask[]>(`${this.baseUrl}/projects/${projectId}/expired-tasks`, {
      headers: this.getHeaders()
    });
  }

  getExpiredTasksCount(projectId: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/projects/${projectId}/expired-count`, {
      headers: this.getHeaders()
    });
  }
}
