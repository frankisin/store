import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'https://localhost:7067';

  constructor(private http: HttpClient) { }
  private userCart: any; // Define the type based on your actual data model
  private cartItems: any[] = [];
  

  setUserCart(cart: any): void {
    this.userCart = cart;
  }
  getTotalCartQuantity$(): Observable<number> {
    return this.cartItems$.pipe(
      map(cartItems => cartItems.reduce((total, item) => total + item.Quantity, 0))
    );
  }

  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  setCartItems(cartItems: any[]): void {
    this.cartItemsSubject.next(cartItems);
  }
  deleteCartItem(username: string, itemId: number): Observable<any> {
    const url = `${this.apiUrl}/Carts/${username}/cartitems/${itemId}`;
    return this.http.delete(url);
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
  public getUsername(): string | null {
    return localStorage.getItem('username');
  }
  // cart.service.ts
  // ... (existing code)

  addToCart(productId: string, quantity: number): Observable<any> {
    const username = this.getUsername();
    if (!username) {
      // Return an observable with an error message
      return of({ error: 'Username not available' });
    }

    let cart = this.getUserCart();
    
    //Big TODO 
    const addToCartPayload = {
      CartID: cart.ID,
      ProductID: productId,
      Quantity: quantity
    };

    console.log(addToCartPayload);

    return this.http.post(`${this.apiUrl}/Carts/${username}/cart/AddToCart`, addToCartPayload).pipe(
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

  

  fetchUserCart(): Observable<any> {
    const username = this.getUsername();

    if (!username) {
      // Return an observable with an error message
      return of({ error: 'Username not available/Not logged in...' });
    }

    return this.http.get(`${this.apiUrl}/User/${username}/Cart`).pipe(
      // Update local cartItems and notify subscribers
      map((userCart: any) => {
        if (userCart && userCart.CartItems) {
          console.log('fetched items...', userCart);
          this.cartItems = userCart.CartItems;
          this.setCartItems(this.cartItems);
        }
        return userCart;
      })
    );
  }


}
