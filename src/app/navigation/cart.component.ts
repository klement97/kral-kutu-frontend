import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/order/services/order.service';
import { BehaviorSubject } from 'rxjs';
import { setProductsInCart } from 'src/app/common/const';


@Component({
  selector: 'app-cart',
  template: `
      <mat-list role="list">
          <mat-list-item role="listitem" *ngFor="let product of products | async">
              <img [src]="product.image" alt="product-image" width="70px">
              <button mat-icon-button (click)="removeProduct(product.id)">
                  <mat-icon color="warn">delete</mat-icon>
              </button>
          </mat-list-item>
      </mat-list>
  `,
  styles: []
})
export class CartComponent implements OnInit {

  products: BehaviorSubject<any[]>;

  constructor(
    private orderService: OrderService
  ) {
    this.products = orderService.productsInCart;
  }

  ngOnInit(): void {
  }

  removeProduct(id: number) {
    const products = this.products.getValue();
    const index: number = products.findIndex((product) => product.id === id);
    products.splice(index, 1);
    setProductsInCart(this.products, products);
  }

}
