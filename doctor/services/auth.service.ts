import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../src/environment';

interface LoginResponse {
  access: string;
  refresh: string;
  user?: any;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = environment.api.auth;

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string, remember = false): Observable<LoginResponse> {
    const payload = { username: username, password };
    return this.http.post<LoginResponse>(`${this.apiUrl}/login/`, payload).pipe(
      map(res => {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem('access_token', res.access);
        storage.setItem('refresh_token', res.refresh);
        storage.setItem('user', JSON.stringify(res.user || {}));
        return res;
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  }

    isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
        const decoded: any = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);
        return decoded.exp && decoded.exp > now;
    } catch {
        return false;
    }
    }
}