import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/order/services/order.service';
import { BehaviorSubject } from 'rxjs';
import { setProductsInCart } from 'src/app/common/const';


@Component({
  selector: 'app-cart',
  template: `
      <mat-list role="list">
          <mat-list-item role="listitem" *ngFor="let orderUnit of orderUnits | async">
              <img [src]="orderUnit.product.image" alt="product-image" width="70px">
              <button mat-icon-button (click)="removeProduct(orderUnit.product.id)">
                  <mat-icon color="warn">delete</mat-icon>
              </button>
          </mat-list-item>
      </mat-list>
  `,
  styles: []
})
export class CartComponent implements OnInit {

  orderUnits: BehaviorSubject<{ product, quantity: number }[]>;

  constructor(
    private orderService: OrderService
  ) {
    this.orderUnits = orderService.productsInCart;
  }

  ngOnInit(): void {
  }

  removeProduct(id: number) {
    const products = this.orderUnits.getValue();
    const index: number = products.findIndex((orderUnit) => orderUnit.product.id === id);
    products.splice(index, 1);
    setProductsInCart(this.orderUnits, products);
  }

}
