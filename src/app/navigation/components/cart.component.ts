import { Component, OnInit, Output } from '@angular/core';
import { OrderService } from 'src/app/order/services/order.service';
import { BehaviorSubject } from 'rxjs';
import { setProductsInCart } from 'src/app/common/const';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';


@Component({
  selector: 'app-cart',
  template: `
      <ng-container *transloco="let t">
          <mat-list role="list">
              <mat-list-item role="listitem" *ngFor="let orderUnit of orderUnits | async">
                  <img [src]="orderUnit.product.image" alt="product-image" width="70px">
                  <button mat-icon-button (click)="removeProduct(orderUnit.product.id)">
                      <mat-icon color="warn">delete</mat-icon>
                  </button>
              </mat-list-item>
              <mat-list-item role="listitem" style="margin-top: 40px">
                  <button mat-stroked-button color="primary" type="button" (click)="navigateTo(['order'])">
                      {{t('continue shopping')}}
                  </button>
              </mat-list-item>
              <mat-list-item role="listitem">
                  <button mat-raised-button color="primary" type="button" (click)="navigateTo(['order', 'checkout'])">
                      {{t('checkout')}}
                  </button>
              </mat-list-item>
          </mat-list>
      </ng-container>
  `,
  styles: []
})
export class CartComponent implements OnInit {

  @Output() buttonsClicked = new EventEmitter<boolean>();

  orderUnits: BehaviorSubject<{ product, quantity: number }[]>;

  constructor(
    private orderService: OrderService,
    private router: Router
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

  navigateTo(commands: string[]) {
    this.buttonsClicked.emit(true);
    this.router.navigate(commands).then();
  }

}
