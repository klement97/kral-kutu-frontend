import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrderService } from 'src/app/order/services/order.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { clearCart, productsInCart } from 'src/app/common/const';
import { Router } from '@angular/router';
import { Order, OrderUnit } from 'src/app/order/order.model';


@Component({
  selector: 'app-checkout',
  styles: [`
      .vertical-form {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
      }

      .vertical-form > h1 {
          margin-top: 16px;
      }

      .vertical-form > mat-form-field, button {
          width: 80%;
      }

      .vertical-form > button {
          margin-top: 20px;
      }

      .price-quantity {
          display: flex;
          justify-content: space-around;
          align-items: center;
      }

      .order-review-table th, td {
          padding-right: 20px;
      }

      tr.mat-footer-row {
          font-weight: bold;
      }

      .title {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
      }

      .title button {
          width: unset;
      }
  `],
  template: `
      <ng-container *transloco="let t">
          <div style="padding: 15px; width: 100%">
              <!-- The Checkout form -->
              <mat-card class="title">
                  <h1>{{t('checkout title')}}</h1>
                  <button mat-stroked-button color="primary" routerLink="/order">
                      <mat-icon>keyboard_backspace</mat-icon>
                  </button>
              </mat-card>
              <br>
              <mat-card class="mat-elevation-z2" style="padding: 16px 0">
                  <form [formGroup]="orderForm" class="vertical-form">
                      <h2>{{t('personal details')}}</h2>
                      <!-- First Name -->
                      <mat-form-field color="primary" appearance="outline">
                          <mat-label>{{t('first name')}}</mat-label>
                          <input matInput type="text" formControlName="first_name" required maxlength="50">
                          <mat-icon matSuffix>person</mat-icon>
                      </mat-form-field>

                      <!-- Last Name -->
                      <mat-form-field color="primary" appearance="outline">
                          <mat-label>{{t('last name')}}</mat-label>
                          <input matInput type="text" formControlName="last_name" required maxlength="50">
                          <!--                          <mat-icon matSuffix>person</mat-icon>-->
                      </mat-form-field>

                      <!-- Phone -->
                      <mat-form-field color="primary" appearance="outline">
                          <mat-label>{{t('phone')}}</mat-label>
                          <input matInput type="tel" formControlName="phone" required maxlength="20">
                          <mat-icon matSuffix>phone</mat-icon>
                          <mat-hint>{{t('phone hint')}}</mat-hint>
                      </mat-form-field>

                      <!-- Address -->
                      <mat-form-field color="primary" appearance="outline">
                          <mat-label>{{t('business address')}}</mat-label>
                          <input matInput type="text" formControlName="address" required maxlength="254">
                          <mat-icon matSuffix>location_on</mat-icon>
                          <mat-hint>{{t('address hint')}}</mat-hint>
                      </mat-form-field>

                      <ng-container *ngIf="leathers$ | async as leathers">
                          <!-- Inner Leather -->
                          <mat-form-field color="primary" appearance="outline">
                              <mat-label>{{t('inner leather')}}</mat-label>
                              <mat-select formControlName="inner_leather">
                                  <mat-option *ngFor="let leather of leathers" [value]="leather.id">
                                      {{leather.code}}
                                  </mat-option>
                              </mat-select>
                          </mat-form-field>

                          <!-- Outer Leather -->
                          <mat-form-field color="primary" appearance="outline">
                              <mat-label>{{t('outer leather')}}</mat-label>
                              <mat-select formControlName="outer_leather">
                                  <mat-option *ngFor="let leather of leathers" [value]="leather.id">
                                      {{leather.code}}
                                  </mat-option>
                              </mat-select>
                          </mat-form-field>
                      </ng-container>

                      <button type="button" (click)="submit()" mat-raised-button color="primary">
                          {{t('submit')}}
                      </button>
                  </form>
              </mat-card>

              <br>
              <mat-divider></mat-divider>
              <br>

              <!-- Order Review Section -->
              <mat-card class="mat-elevation-z2"><h3>{{t('order review')}}</h3></mat-card>
              <br>
              <app-order-review-table [orderUnits]="productsInCart"></app-order-review-table>
              <br>
              <mat-divider></mat-divider>
              <!-- Selected Products in Cards -->
              <div style="margin: 20px auto; width: 100%">
                  <mat-card><h3>{{t('selected products')}}</h3></mat-card>
              </div>
              <div class="products" style="margin: 20px auto; width: 100%">
                  <!-- Selected Products -->
                  <div class="product-card" *ngFor="let unit of productsInCart.getValue()">
                      <div class="image-wrapper">
                          <img [src]="unit.product.image" alt="product-image">
                      </div>

                      <!-- CARD CONTENT -->
                      <div class="card-content">
                          <h4>{{unit.product.properties.code}}</h4>
                          <div class="dimensions">
                              <div class="size">
                                  <span>{{unit.product.properties.width | number}}</span> <img
                                      src="../../../../assets/images/width-arrow.svg" alt="width-icon">
                              </div>
                              <div class="size length-dimension">
                                  <span>{{unit.product.properties.length | number}}</span> <img
                                      src="../../../../assets/images/depth-arrow.svg" alt="length-icon">
                              </div>
                              <div class="size">
                                  <span>{{unit.product.properties.height | number}}</span> <img
                                      src="../../../../assets/images/height-arrow.svg" alt="height-icon">
                              </div>
                          </div>
                      </div>

                      <!-- CARD ACTIONS -->
                      <div class="price-quantity" style="margin-bottom: 10px">
                          <span>{{unit.product.price | number | prefix: '€'}}</span> <span>x</span>
                          <span>{{unit.quantity}}</span> <span>=</span>
                          <span>{{(unit.product.price * unit.quantity | number) | prefix: '€'}}</span>
                      </div>
                  </div>
              </div>
          </div>
      </ng-container>
  `
})
export class CheckoutComponent implements OnInit, OnDestroy {
  productsInCart: BehaviorSubject<OrderUnit[]>;
  leathers$: Observable<any[]>;
  orderForm: FormGroup;


  constructor(
    private orderService: OrderService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.leathers$ = orderService.getLeathers();
  }


  ngOnInit(): void {
    this.productsInCart = productsInCart;
    this.initializeOrderForm();
  }


  ngOnDestroy(): void {
    this.orderService.orderFormValue = this.orderForm.value;
  }


  initializeOrderForm() {
    this.orderForm = this.fb.group({
      first_name: ['klement', [Validators.required, Validators.maxLength(50)]],
      last_name: ['omeri', [Validators.required, Validators.maxLength(50)]],
      phone: ['12341243', [Validators.required, Validators.maxLength(20)]],
      address: ['tirane', [Validators.maxLength(254)]],
      products: [[]],
      inner_leather: [1],
      outer_leather: [1],
    });
    this.backupRestoreOrderForm();
  }


  backupRestoreOrderForm() {
    if (this.orderService.orderFormValue) {
      this.orderForm.patchValue(this.orderService.orderFormValue);
    } else {
      this.orderService.orderFormValue = this.orderForm.value;
    }
  }


  /**
   * Serialization process is to replace products with their respective ID
   * instead of a product object.
   */
  getSerializedProducts() {
    const orderUnits = Array.from(this.productsInCart.getValue());
    orderUnits.forEach(orderUnit => {
      Object.keys(orderUnit.product.properties).forEach(key => {
        orderUnit[key] = orderUnit.product.properties[key];
      });
      orderUnit.product = orderUnit.product.id;
    });

    return orderUnits;
  }


  submit() {
    // Replace products with serialized ones
    this.orderForm.get('products').patchValue(this.getSerializedProducts());
    this.orderService.createOrder(this.orderForm.value)
      .subscribe(
        (order: Order) => {
          this.router.navigate(['order', 'post-checkout', order.id]).then();
          clearCart();
          this.orderForm.reset();
        },
        () => {
        });
  }

}
