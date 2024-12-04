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

  /**
   * Register a new user
   * @param username The username of the user
   * @param password The password of the user
   * @returns Observable with the server response
   */
  register(username: string, password: string): Observable<any> {
    const payload = { username, password };
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  /**
   * Login a user
   * @param username The username of the user
   * @param password The password of the user
   * @returns Observable with the server response
   */
  login(username: string, password: string): Observable<any> {
    const payload = { username, password };
    return this.http.post(`${this.apiUrl}/login`, payload).pipe(
      tap((response: any) => {
        // Assuming the backend response includes { token: 'jwt-token' }
        if (response.token) {
          this.saveToken(response.token);
        }
      })
    );
  }

  /**
   * Logout a user (Clears local storage token)
   */
  logout(): void {
    localStorage.removeItem('authToken');
  }

  /**
   * Check if the user is authenticated
   * @returns True if the token exists and is valid, otherwise false
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) return false;

    const expiry = payload.exp * 1000; 
    return Date.now() < expiry;
  }

  /**
   * Save the JWT token to local storage
   * @param token The JWT token to save
   */
  private saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  /**
   * Retrieve the JWT token from local storage
   * @returns The JWT token or null
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Decode a JWT token
   * @param token The JWT token to decode
   * @returns Decoded payload or null if decoding fails
   */
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
