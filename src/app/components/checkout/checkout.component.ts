import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { CartService } from '../../services/cartservice.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [NavbarComponent,CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  constructor(public cartService: CartService) { }

  cartItems: any[] = []; // Assuming your cartItems structure
  displayCart: any[] = [];

  ngOnInit(): void {
    
    this.cartService.cartItems$.subscribe((cartItems) => {
      console.log('Cart items in CheckoutComponent:', cartItems);
      // Handle cart items in the checkout component
      this.transformCartItems(cartItems);
    });
  
    // Fetch user cart
    this.cartService.fetchUserCart().subscribe();

  }

  transformCartItems(cartItems: any[]): void {
    // Reset the displayCart array
    this.displayCart = [];

    // Iterate through each cart item
    for (const cartItem of cartItems) {
      // Assuming there's a getProductDetails method in your productService
      this.cartService.getProductDetails(cartItem.ProductID).subscribe((productDetails) => {
        // Combine cart item and product details
        const displayItem = {
          Title: productDetails.Title,
          Description: productDetails.Description,
          AverageRating: productDetails.AverageRating,
          DescriptionLong: productDetails.DescriptionLong,
          // Include other product-related properties as needed
          ProductID: cartItem.ProductID,
          Quantity: cartItem.Quantity,
          ImageUrlDetail: productDetails.ImageUrlDetail,
          ProductDetails: productDetails, // Include product details
        };

        // Push the combined item to the displayCart array
        this.displayCart.push(displayItem);
      });
    }
    console.log('Cart cards generated: ',this.displayCart);
  }
}
