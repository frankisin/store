import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'https://localhost:7067';

  constructor(private http: HttpClient) {}
  private userCart: any; // Define the type based on your actual data model
  private cartItems: any[] = [];

  setUserCart(cart: any): void {
    this.userCart = cart;
  }

  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  setCartItems(cartItems: any[]): void {
    this.cartItemsSubject.next(cartItems);
  }

  getUserCart(): any {
    return this.userCart;
  }
  // Fetch product details by product ID
  getProductDetails(productId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Product/${productId}`);
  }

  getCartItems(): any[] {
    return this.cartItems;
  }
  // Get the username from local storage
  private getUsername(): string | null {
    return localStorage.getItem('username');
  }
  fetchUserCart(): Observable<any> {
    const username = this.getUsername();
  
    if (!username) {
      // Return an observable with an error message
      return of({ error: 'Username not available' });
    }
  
    return this.http.get(`${this.apiUrl}/User/${username}/Cart`).pipe(
      // Update local cartItems and notify subscribers
      map((userCart: any) => {
        if (userCart && userCart.CartItems) {
          this.cartItems = userCart.CartItems;
          this.setCartItems(this.cartItems);
        }
        return userCart;
      })
    );
  }


}
