import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../src/environment';
@Injectable({
  providedIn: 'root'
})
export class FinanceService {

  private baseUrl = environment.api.finance;

  constructor(private http: HttpClient) {}

  getEntries(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all/`);
  }

  addEntry(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add/`, data);
  }

  getTotals(): Observable<any> {
    return this.http.get(`${this.baseUrl}/totals/`);
  }

  getChartData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/chart/`);
  }

  deleteEntry(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}/`);
  }

  updateEntry(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}/`, data);
  }
}
