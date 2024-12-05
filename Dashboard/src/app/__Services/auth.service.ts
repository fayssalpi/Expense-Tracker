import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5001/api/auth'; 

  constructor(private http: HttpClient) {}


  register(username: string, password: string): Observable<any> {
    const payload = { username, password };
    return this.http.post(`${this.apiUrl}/register`, payload);
  }


  login(username: string, password: string): Observable<any> {
    const payload = { username, password };
    return this.http.post(`${this.apiUrl}/login`, payload).pipe(
      tap((response: any) => {
        if (response.token) {
          this.saveToken(response.token);
        }
      })
    );
  }


  logout(): void {
    localStorage.removeItem('authToken');
  }


  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) return false;

    const expiry = payload.exp * 1000; 
    return Date.now() < expiry;
  }


  private saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }


  getToken(): string | null {
    return localStorage.getItem('authToken');
  }


  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Failed to decode token', e);
      return null;
    }
  }
}
