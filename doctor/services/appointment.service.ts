import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../src/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppointmentService {

  

  private apiUrl = environment.api.appointments;

  constructor(private http: HttpClient) {}

  getAppointments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createAppointment(appointment: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, appointment);
  }
}
