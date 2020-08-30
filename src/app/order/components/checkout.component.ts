import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/order/services/order.service';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { clearCart, productsInCart } from 'src/app/common/const';


@Component({
  selector: 'app-checkout',
  template: `
      <ng-container *transloco="let t">
          <h1>{{t('checkout')}}</h1>

          <form [formGroup]="orderForm" class="vertical-form" (ngSubmit)="submit()">

              <!-- First Name -->
              <mat-form-field color="primary">
                  <mat-label>{{t('first name')}}</mat-label>
                  <input matInput type="text" formControlName="first_name" required maxlength="50">
              </mat-form-field>

              <!-- Last Name -->
              <mat-form-field color="primary">
                  <mat-label>{{t('last name')}}</mat-label>
                  <input matInput type="text" formControlName="last_name" required maxlength="50">
              </mat-form-field>

              <!-- Phone -->
              <mat-form-field color="primary">
                  <mat-label>{{t('phone')}}</mat-label>
                  <input matInput type="tel" formControlName="phone" required maxlength="20">
                  <mat-icon matSuffix>phone</mat-icon>
                  <mat-hint>{{t('phone hint')}}</mat-hint>
              </mat-form-field>

              <!-- Address -->
              <mat-form-field color="primary">
                  <mat-label>{{t('address')}}</mat-label>
                  <input matInput type="text" formControlName="address" required maxlength="254">
                  <mat-icon matSuffix>location_on</mat-icon>
                  <mat-hint>{{t('address hint')}}</mat-hint>
              </mat-form-field>

              <button type="submit" mat-stroked-button color="primary">Submit</button>

          </form>
      </ng-container>
  `,
  styles: [`
      .vertical-form {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
      }

      .vertical-form mat-form-field, button {
          width: 80%;
          margin-top: 20px;
      }
  `]
})
export class CheckoutComponent implements OnInit {

  productsInCart: BehaviorSubject<any[]>;
  orderForm: FormGroup;

  constructor(
    private orderService: OrderService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.productsInCart = productsInCart;
    this.orderForm = this.getOrderForm();
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
        }
      );
  }

}
