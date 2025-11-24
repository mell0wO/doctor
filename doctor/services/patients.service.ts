import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../src/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PatientsService {
  private base = `${environment.apiUrl}/patients/`; 

  constructor(private http: HttpClient) {}

  // GET methods
  getPatients(): Observable<any[]> { 
    return this.http.get<any[]>(this.base); 
  }

  list(): Observable<any[]> { 
    return this.getPatients(); 
  }

  get(id: number): Observable<any> { 
    return this.http.get<any>(`${this.base}${id}/`); 
  }

  // CREATE methods - Handle both FormData and regular objects
// ...existing code...
  create(data: FormData | any): Observable<any> {
    console.log('🟡 CREATE - Sending data to backend:', data);
    
    if (data instanceof FormData) {
      console.log('📦 CREATE - FormData contents:');
      data.forEach((value, key) => {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name})`);
        } else {
          console.log(`  ${key}:`, value);
        }
      });
    } else {
      console.log('📦 CREATE - Regular object:', data);
    }
    
    return this.http.post<any>(this.base, data);
  }

  update(id: number, data: FormData | any): Observable<any> {
    console.log('🟡 UPDATE - Sending data to backend for ID:', id);
    
    if (data instanceof FormData) {
      console.log('📦 UPDATE - FormData contents:');
      data.forEach((value, key) => {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name})`);
        } else {
          console.log(`  ${key}:`, value);
        }
      });
    } else {
      console.log('📦 UPDATE - Regular object:', data);
    }
    
    return this.http.patch<any>(`${this.base}${id}/`, data);
  }

  // DELETE method
  delete(id: number): Observable<any> { 
    return this.http.delete(`${this.base}${id}/`); 
  }
  
}