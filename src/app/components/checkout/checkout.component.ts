import { Component , NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { CartService } from '../../services/cartservice.service';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  constructor(public cartService: CartService) { }

  cartItems: any[] = []; // Assuming your cartItems structure
  displayCart: any[] = [];
  userName: string = '';

  ngOnInit(): void {
    let user = this.cartService.getUsername();
    let cart = this.cartService.getCartItems();

  
    if (user !== null) {
      this.userName = user;
      console.log('user cart initialized: ', user);
      this.cartService.cartItems$.subscribe((cartItems) => {
        // Handle cart items in the checkout component
        this.transformCartItems(cartItems);
      });
    } else {
      console.error('Username not available');
      // Handle the case where the username is null, show an error, redirect, or take appropriate action
    }
  }
  // Calculate subtotal for all items in the cart
  calculateSubtotal(): number {
    let subtotal = 0;

    // Iterate through cart items and sum the price times quantity
    this.displayCart.forEach(displayItem => {
      subtotal += displayItem.ProductDetails.Price * displayItem.Quantity;
    });

    return subtotal;
  }

  
  
  
  onDelete(username: string, itemId: number): void {
    console.log('Deleting username: ',username, ' item ID: ',itemId);
    this.cartService.deleteCartItem(username, itemId).subscribe(
      (response) => {
        // Handle success, you might want to update your UI or take other actions
        console.log('Item deleted from cart:', response);

        // Assuming you want to refresh the cart items after deletion
        this.cartService.fetchUserCart().subscribe(
          (userCart) => {
            // Update local cartItems and notify subscribers
            if (userCart && userCart.CartItems) {
              console.log('User Cart Initialized for checkout: ', userCart);
              this.cartItems = userCart.CartItems;
              this.cartService.setCartItems(this.cartItems);
            }
          },
          (error) => {
            console.error('Error fetching user cart after deletion:', error);
          }
        );
      },
      (error) => {
        // Handle error
        console.error('Error deleting item from cart:', error);
        // You might want to show an error message to the user
      }
    );
    location.reload();
  }


  transformCartItems(cartItems: any[]): void {
    // Reset the displayCart array
    this.displayCart = [];

    // Create an array to store the observables for getProductDetails
    const productDetailObservables: Observable<any>[] = [];

    // Iterate through each cart item
    for (const cartItem of cartItems) {
      // Push each observable to the array
      productDetailObservables.push(
        this.cartService.getProductDetails(cartItem.ProductID)
      );
    }

    // Use forkJoin to wait for all getProductDetails observables to complete
    forkJoin(productDetailObservables).subscribe((productDetailsArray: any[]) => {
      // Iterate through each cart item and its corresponding product details
      for (let i = 0; i < cartItems.length; i++) {
        const cartItem = cartItems[i];
        const productDetails = productDetailsArray[i];

        const displayItem = {
          ID : cartItem.ID,
          Title: productDetails.Title,
          Description: productDetails.Description,
          AverageRating: productDetails.AverageRating,
          DescriptionLong: productDetails.DescriptionLong,
          ProductID: cartItem.ProductID,
          Quantity: cartItem.Quantity,
          ImageUrlDetail: productDetails.ImageUrlDetail,
          ProductDetails: productDetails,
        };

        // Push the combined item to the displayCart array
        this.displayCart.push(displayItem);
      }

      console.log('Cart cards generated: ', this.displayCart);
    });
  }


}
