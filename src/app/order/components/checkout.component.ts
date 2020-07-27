import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/order/services/order.service';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { clearCart, productsInCart } from 'src/app/common/const';


@Component({
  selector: 'app-checkout',
  styles: [`
      .vertical-form {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
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

      .order-review-table {
      }

      .order-review-table th, td {
          padding: 16px 10px;
          text-align: end;
      }
  `],
  template: `
      <ng-container *transloco="let t">
          <h1>{{t('checkout')}}</h1>

          <!-- The Checkout form -->
          <form [formGroup]="orderForm" class="vertical-form" (ngSubmit)="submit()">

              <!-- First Name -->
              <mat-form-field color="primary" appearance="outline">
                  <mat-label>{{t('first name')}}</mat-label>
                  <input matInput type="text" formControlName="first_name" required maxlength="50">
              </mat-form-field>

              <!-- Last Name -->
              <mat-form-field color="primary" appearance="outline">
                  <mat-label>{{t('last name')}}</mat-label>
                  <input matInput type="text" formControlName="last_name" required maxlength="50">
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
                  <mat-label>{{t('address')}}</mat-label>
                  <input matInput type="text" formControlName="address" required maxlength="254">
                  <mat-icon matSuffix>location_on</mat-icon>
                  <mat-hint>{{t('address hint')}}</mat-hint>
              </mat-form-field>

              <button type="submit" mat-stroked-button color="primary">Submit</button>

          </form>

          <!-- Selected Products in Cards -->
          <div class="products">
              <h3>{{t('selected products')}}</h3>
              <!-- Selected Products -->
              <div class="product-card" *ngFor="let unit of productsInCart.getValue()">
                  <div class="image-wrapper">
                      <img [src]="unit.product.image" alt="product-image">
                  </div>

                  <!-- CARD CONTENT -->
                  <div class="card-content">
                      <h4>{{unit.product.code}}</h4>
                      <div class="dimensions">
                          <div class="size">
                              <span>{{unit.product.width | number}}</span> <img
                                  src="../../../assets/images/width-arrow.svg" alt="width-icon">
                          </div>
                          <div class="size length-dimension">
                              <span>{{unit.product.length | number}}</span> <img
                                  src="../../../assets/images/depth-arrow.svg" alt="length-icon">
                          </div>
                          <div class="size">
                              <span>{{unit.product.height | number}}</span> <img
                                  src="../../../assets/images/height-arrow.svg" alt="height-icon">
                          </div>
                      </div>
                  </div>

                  <!-- CARD ACTIONS -->
                  <div class="price-quantity">
                      <span>{{unit.product.price | number | prefix: '$'}}</span> <span>x</span>
                      <span>{{unit.quantity}}</span> <span>=</span>
                      <span>{{(unit.product.price * unit.quantity | number) | prefix: '$'}}</span>
                  </div>
              </div>
          </div>

          <!-- Order Review Section -->
          <h3>{{t('order review')}}</h3>
          <table class="order-review-table mat-table">
              <thead>
              <tr>
                  <th class="mat-header-cell">{{t('code') | titlecase}}</th>
                  <th class="mat-header-cell">{{t('price') | titlecase}}</th>
                  <th class="mat-header-cell">{{t('quantity') | titlecase}}</th>
                  <th class="mat-header-cell">{{t('sub total') | titlecase}}</th>
              </tr>
              </thead>

              <tbody>
              <tr *ngFor="let unit of productsInCart.getValue()">
                  <td class="mat-cell">{{unit.product.code}}</td>
                  <td class="mat-cell">{{unit.product.price | number | prefix: '$'}}</td>
                  <td class="mat-cell">{{unit.quantity}}</td>
                  <td class="mat-cell">{{(unit.product.price * unit.quantity) | prefix: '$'}}</td>
              </tr>
              </tbody>

              <tfoot>
              <tr>
                  <td class="mat-footer-cell" [colSpan]="3">{{totalQuantity}}</td>
                  <td class="mat-footer-cell">{{totalPrice | number | prefix: '$'}}</td>
              </tr>
              </tfoot>
          </table>
      </ng-container>
  `
})
export class CheckoutComponent implements OnInit {

  productsInCart: BehaviorSubject<any[]>;
  orderForm: FormGroup;
  totalPrice = 0;
  totalQuantity = 0;

  constructor(
    private orderService: OrderService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.productsInCart = productsInCart;
    this.orderForm = this.getOrderForm();
    this.calculateTotalQuantityAndPrice();
  }

  getOrderForm(): FormGroup {
    return this.fb.group({
      first_name: ['klement', [Validators.required, Validators.maxLength(50)]],
      last_name: ['omeri', [Validators.required, Validators.maxLength(50)]],
      phone: ['123123', [Validators.required, Validators.maxLength(20)]],
      address: ['tirane', [Validators.maxLength(254)]],
      order_units: [[]],
      inner_leather: ['1'],
      outer_leather: ['1'],
    });
  }

  calculateTotalQuantityAndPrice(): void {
    this.productsInCart.getValue().forEach(unit => {
      this.totalQuantity += unit.quantity;
      this.totalPrice += unit.product.price * unit.quantity;
    });
  }

  /**
   * Serialization process is to replace products with their respective ID
   * instead of a product object.
   */
  getSerializedOrderUnits() {
    const orderUnits = Array.from(this.productsInCart.getValue());
    orderUnits.forEach(orderUnit => orderUnit.product = orderUnit.product.id);

    return orderUnits;
  }

  submit() {
    // Replace order units with serialized ones
    this.orderForm.get('order_units').patchValue(this.getSerializedOrderUnits());
    this.orderService.createOrder(this.orderForm.value)
      .subscribe(
        () => {
          console.log('The order has been created successfully!');
          clearCart();
          this.orderForm = this.getOrderForm();
        },
        () => {
          console.log('The order cannot been created! Please try again later.');
        });
  }

}
