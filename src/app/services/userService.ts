// userService.ts
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';


declare var require: any; // Declare require

@Injectable({
  providedIn: 'root',
})
export class UserService {

  decodeToken(token: string): any {
    
    return jwtDecode(token) as any; // You may need to adjust the return type
  }
  getUserClaims(): any {
    const token = localStorage.getItem('token'); // Assuming you store the token in local storage
    if (token) {
      return this.decodeToken(token);
    }
    return null;
  }
  getUserName(): string{
    const userName = localStorage.getItem('username');

    if(userName){return userName;}else{return '';}
  }
}


