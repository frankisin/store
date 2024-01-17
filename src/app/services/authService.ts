import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7067';

  constructor(private http: HttpClient) {}

  // Return server response on login...
  login(username: string, password: string): Observable<any> {
    this.clearUserClaims();
    return this.http.post(`${this.apiUrl}/Auth/login`, { Username: username, Password: password });
  }
  logout(): void {
    // Implement logout logic, such as clearing local storage, revoking tokens, etc.
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
  }

  isLoggedIn(): boolean {
    // Check if the user is logged in based on the presence of the token
    return !!localStorage.getItem('token');
  }

  decodeToken(token: string): any {
    return jwtDecode(token) as any;
  }

  getUserClaims(): any {
    const token = localStorage.getItem('token');
    
    console.log('Token attempting to authenticate: ', token);
  
    if (token) {
      return this.decodeToken(token);
    }
    return null;
  }

  // Check if the user is an admin
  isAdmin(): boolean {
    const userClaims = this.getUserClaims();
    console.log(userClaims);
    // Assuming your decoded token contains a 'role' field
    return userClaims && userClaims.role === 'admin';
  }
  // Clear user claims
  clearUserClaims(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  }
}
