import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/order/services/order.service';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-checkout',
  template: `
      <ng-container *transloco="let t">
          <h1>{{t('checkout')}}</h1>

          <form [formGroup]="orderForm">

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

              <button type="submit">Submit</button>

          </form>
      </ng-container>
  `,
  styles: []
})
export class CheckoutComponent implements OnInit {

  productsInCart: BehaviorSubject<any[]>;
  orderForm: FormGroup;

  constructor(
    private orderService: OrderService,
    private fb: FormBuilder
  ) {
    this.productsInCart = orderService.productsInCart;
  }

  ngOnInit(): void {
    this.orderForm = this.getOrderForm();
  }

  getOrderForm(): FormGroup {
    return this.fb.group({
      first_name: ['', [Validators.required, Validators.maxLength(50)]],
      last_name: ['', [Validators.required, Validators.maxLength(50)]],
      phone: ['', [Validators.required, Validators.maxLength(20)]],
      address: ['', [Validators.maxLength(254)]],
      order_units: [[]],
      inner_leather: [''],
      outer_leather: [''],
    });
  }

}
