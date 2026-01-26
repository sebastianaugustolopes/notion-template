import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task, TaskRequest, TaskStatus } from '../types/task.type';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly baseUrl = `${environment.apiUrl}/api/projects`;

  constructor(private readonly httpClient: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getTasks(projectId: string): Observable<Task[]> {
    return this.httpClient.get<Task[]>(`${this.baseUrl}/${projectId}/tasks`, {
      headers: this.getHeaders(),
    });
  }

  getTask(projectId: string, taskId: string): Observable<Task> {
    return this.httpClient.get<Task>(`${this.baseUrl}/${projectId}/tasks/${taskId}`, {
      headers: this.getHeaders(),
    });
  }

  createTask(projectId: string, task: TaskRequest): Observable<Task> {
    return this.httpClient.post<Task>(`${this.baseUrl}/${projectId}/tasks`, task, {
      headers: this.getHeaders(),
    });
  }

  updateTask(projectId: string, taskId: string, task: TaskRequest): Observable<Task> {
    return this.httpClient.put<Task>(`${this.baseUrl}/${projectId}/tasks/${taskId}`, task, {
      headers: this.getHeaders(),
    });
  }

  updateTaskStatus(projectId: string, taskId: string, status: TaskStatus): Observable<Task> {
    return this.httpClient.patch<Task>(
      `${this.baseUrl}/${projectId}/tasks/${taskId}/status`,
      { status },
      { headers: this.getHeaders() }
    );
  }

  deleteTask(projectId: string, taskId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${projectId}/tasks/${taskId}`, {
      headers: this.getHeaders(),
    });
  }
}
