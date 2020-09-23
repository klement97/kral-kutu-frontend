import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { OrderService } from 'src/app/order/services/order.service';
import { BehaviorSubject } from 'rxjs';
import { productsInCart, setProductsInCart } from 'src/app/common/const';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cart',
  styles: [`
  `],
  template: `
      <ng-container *transloco="let t">
          <mat-list role="list">

              <mat-list-item role="listitem" *ngFor="let orderUnit of orderUnits | async">
                  <img [src]="orderUnit.product.image" [alt]="orderUnit.product.image | imageAlt" width="100px">
                  <button mat-icon-button (click)="removeProduct(orderUnit.product.id)">
                      <mat-icon color="warn">remove_shopping_cart</mat-icon>
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
  `
})
export class CartComponent implements OnInit {

  @Output() buttonsClicked = new EventEmitter<boolean>();

  orderUnits: BehaviorSubject<{ product, quantity: number }[]>;

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {
    this.orderUnits = productsInCart;
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
