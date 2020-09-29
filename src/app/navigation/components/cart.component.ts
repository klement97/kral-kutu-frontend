import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { OrderService } from 'src/app/order/services/order.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { productsInCart, setProductsInCart } from 'src/app/common/const';
import { Router } from '@angular/router';
import { Product } from 'src/app/order/models/order.model';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-cart',
  styles: [`
      .cart-item {
          position: relative;
      }

      .cart-item button {
          position: absolute;
          top: 3px;
          right: 3px;
      }

      .cart-item-image {
          vertical-align: middle;
          margin: 10px 10px;
          border: 1px solid #989898;
          border-radius: 4px;
      }

      .small-icon {
          width: 17px;
          height: 17px;
          font-size: 17px;
          color: #474747;
      }

      .small-icon:hover {
          color: #bd0003;
      }

      .totals {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 25px 0 10px;
      }

      .cart-actions {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 15px 10px 7px;
      }
  `],
  template: `
      <ng-container *transloco="let t">
          <mat-list role="list">
              <!-- Cart items -->
              <div role="listitem" *ngFor="let orderUnit of orderUnits | async" class="cart-item mat-elevation-z1">
                  <img [src]="orderUnit.product.image"
                       [alt]="orderUnit.product.image | imageAlt"
                       width="70px" height="70px" class="cart-item-image">
                  <span style="display: inline-flex; flex-direction: column">
                      <span style="color: grey"><b>{{orderUnit.product.code}}</b></span>
                      <span style="color: #474747">
                          {{orderUnit.product.price | number | prefix: '$'}}
                          x
                          {{orderUnit.quantity | number}}
                          =
                          {{(orderUnit.product.price * orderUnit.quantity) | number | prefix: '$' }}
                      </span>
                  </span>
                  <!-- Remove cart item button -->
                  <button mat-icon-button (click)="removeProduct(orderUnit.product.id)">
                      <mat-icon class="small-icon" color="warn">close</mat-icon>
                  </button>
              </div>

              <!-- Totals -->
              <div class="totals">
                  <h4>{{t('total')}}:</h4>
                  <h4><b>{{totalPrice | number | prefix: '$'}}</b></h4>
              </div>
              <mat-divider></mat-divider>

              <!-- Continue shopping button -->
              <div class="cart-actions">
                  <button mat-stroked-button color="primary" type="button" (click)="navigateTo(['order'])">
                      <span style="font-size:smaller;">{{t('continue shopping')}}</span>
                  </button>
                  <button mat-raised-button color="primary" type="button" (click)="navigateTo(['order', 'checkout'])">
                      <span style="font-size: smaller">{{t('checkout')}}</span>
                  </button>
              </div>
          </mat-list>
      </ng-container>
  `
})
export class CartComponent implements OnInit, OnDestroy {

  @Output() buttonsClicked = new EventEmitter<boolean>();

  orderUnits: BehaviorSubject<{ product: Product, quantity: number }[]>;
  uns$ = new Subject();
  totalPrice = 0;


  constructor(
    private orderService: OrderService,
    private router: Router
  ) {
    this.orderUnits = productsInCart;
  }


  ngOnInit(): void {
    this.calculateTotalPrice();
  }


  ngOnDestroy(): void {
  }


  removeProduct(id: number) {
    const products = this.orderUnits.getValue();
    const index: number = products.findIndex((orderUnit) => orderUnit.product.id === id);
    products.splice(index, 1);
    setProductsInCart(this.orderUnits, products);
  }


  calculateTotalPrice() {
    this.orderUnits.pipe(takeUntil(this.uns$))
      .subscribe((units) => {
        this.totalPrice = 0;
        units.forEach(unit => this.totalPrice += Number(unit.product.price) * unit.quantity);
      });
  }


  navigateTo(commands: string[]) {
    this.buttonsClicked.emit(true);
    this.router.navigate(commands).then();
  }

}
