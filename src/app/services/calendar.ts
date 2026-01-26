import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CalendarTask } from '../types/calendar.type';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private readonly baseUrl = `${environment.apiUrl}/api/calendar`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllTasks(): Observable<CalendarTask[]> {
    return this.http.get<CalendarTask[]>(`${this.baseUrl}/tasks`, {
      headers: this.getHeaders()
    });
  }

  getTasksByDateRange(startDate: string, endDate: string): Observable<CalendarTask[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<CalendarTask[]>(`${this.baseUrl}/tasks/range`, {
      headers: this.getHeaders(),
      params
    });
  }
}
