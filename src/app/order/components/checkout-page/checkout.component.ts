import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrderService } from 'src/app/order/services/order.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { clearCart, fromEntries, positiveIntegerWithZeroRegex, productsInCart } from 'src/app/common/const';
import { Router } from '@angular/router';
import { LeatherSelectResult, LeatherSerial, OrderUnit } from 'src/app/order/order.model';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { LeatherSelectComponent } from 'src/app/order/components/checkout-page/leather-select.component';
import { takeUntil } from 'rxjs/operators';


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

      /* Hide Up Down Buttons on Number Input */
      /* Chrome, Safari, Edge, Opera */
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
      }

      /* Firefox */
      input[type=number] {
          -moz-appearance: textfield;
      }

      .cursor-pointer {
          cursor: pointer;
      }
  `],
  template: `
      <ng-container *transloco="let t">
          <div style="padding: 15px; width: 100%; margin: 50px auto 0 auto">
              <mat-card class="title">
                  <h1>{{t('checkout title')}}</h1>
                  <button mat-stroked-button color="primary" routerLink="/order">
                      <mat-icon>keyboard_backspace</mat-icon>
                  </button>
              </mat-card>
              <br>
              <!-- The Checkout form -->
              <mat-card class="mat-elevation-z2" style="padding: 16px 0">
                  <form [formGroup]="orderForm" class="vertical-form">
                      <h2>{{t('leathers')}}</h2>
                      <ng-container>
                          <!-- Inner Leather -->
                          <mat-form-field color="primary" appearance="outline" class="cursor-pointer">
                              <mat-label>{{t('inner_leather')}}</mat-label>
                              <input type="text" matInput (click)="openLeatherSelection('inner_leather')"
                                     class="cursor-pointer"
                                     readonly formControlName="inner_leather_str">
                          </mat-form-field>

                          <!-- Outer Leather -->
                          <mat-form-field color="primary" appearance="outline" class="cursor-pointer">
                              <mat-label>{{t('outer_leather')}}</mat-label>
                              <input type="text" matInput (click)="openLeatherSelection('outer_leather')"
                                     class="cursor-pointer"
                                     readonly formControlName="outer_leather_str">
                          </mat-form-field>
                      </ng-container>

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
              <app-order-review-table *ngIf="(productsInCart | async).length > 0"
                                      [orderUnits]="productsInCart">
              </app-order-review-table>
              <br>
              <mat-divider></mat-divider>
              <!-- Selected Products in Cards -->
              <div style="margin: 20px auto; width: 100%">
                  <mat-card><h3>{{t('selected products')}}</h3></mat-card>
              </div>
              <div class="products" style="margin: 20px auto; width: 100%" *ngIf="(productsInCart | async).length > 0">
                  <!-- Selected Products -->
                  <div class="product-card" *ngFor="let unit of productsInCart | async">
                      <ng-container *ngIf="unit?.product?.properties">
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
                              <input type="number" [value]="unit.quantity" class="quantity-input"
                                     (input)="changeAmount(unit, quantity, $event)" #quantity>
                              <span>=</span>
                              <span>{{(unit.product.price * unit.quantity | number) | prefix: '€'}}</span>
                          </div>
                      </ng-container>
                  </div>
              </div>
          </div>
      </ng-container>
  `
})
export class CheckoutComponent implements OnInit, OnDestroy {
  productsInCart: BehaviorSubject<OrderUnit[]>;
  leathersSerials: LeatherSerial[];
  orderForm: FormGroup;
  uns$ = new Subject();


  constructor(
    private orderService: OrderService,
    private fb: FormBuilder,
    private router: Router,
    private bottomSheet: MatBottomSheet
  ) {
  }


  ngOnInit(): void {
    this.productsInCart = productsInCart;
    this.initializeOrderForm();
    this.getLeathers();
  }


  ngOnDestroy(): void {
    this.orderService.orderFormValue = this.orderForm.value;
    this.uns$.next();
    this.uns$.complete();
  }


  getLeathers() {
    this.orderService.getLeatherSerials().subscribe((leathersSerials) => {
      this.leathersSerials = leathersSerials;
    });
  }


  initializeOrderForm() {
    this.orderForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.maxLength(50)]],
      last_name: ['', [Validators.required, Validators.maxLength(50)]],
      phone: ['', [Validators.required, Validators.maxLength(20)]],
      address: ['', [Validators.maxLength(254)]],
      products: [[], [Validators.required]],
      inner_leather: [null, [Validators.required]],
      inner_leather_str: '',
      outer_leather: [null, [Validators.required]],
      outer_leather_str: '',
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


  changeAmount(unit: OrderUnit, input, event) {
    if (this.validateInput(input, event)) {
      unit.quantity = +input.value;
    }
  }


  validateInput(input, event) {
    const inputChar: string = event.data;
    // setting a timeout to let the user understand the changes
    if (!input.value || input.value === '0') {
      input.value = '1';
      return false;
    }
    if (inputChar && !positiveIntegerWithZeroRegex.test(inputChar)) {
      const inputValueArray: string[] = input.value.split('');
      inputValueArray.splice(input.value.indexOf(inputChar), 1);
      input.value = inputValueArray.join('');
      return false;
    }
    if (Number(input.value) > 10_000) {
      input.value = '10000';
      return false;
    }

    return true;
  }


  openLeatherSelection(identifier: 'inner_leather' | 'outer_leather') {
    const data = {leathersSerials: this.leathersSerials, identifier};

    this.bottomSheet.open(LeatherSelectComponent, {data}).afterDismissed().pipe(takeUntil(this.uns$))
      .subscribe((result: LeatherSelectResult | undefined) => {
        if (result?.leather?.id) {
          this.patchLeather(identifier, result);
        }
      });
  }


  patchLeather(identifier: 'inner_leather' | 'outer_leather', result: LeatherSelectResult) {
    const entries = fromEntries([
      [identifier, result.leather.id],
      [`${identifier}_str`, `${result.leatherSerial.name} ${result.leather.code}`]
    ]);
    this.orderForm.patchValue(entries);
  }


  /**
   * Serialization process is to replace products with their respective ID
   * instead of a product object and flattening the product properties.
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
    this.orderService.createOrder(this.orderForm.value).subscribe(
      () => this.onSuccess(),
      (err) => this.onError(err)
    );
  }


  onSuccess() {
    this.productsInCart.next([]);
    clearCart();
    this.orderService.orderFormValue = null;
    this.initializeOrderForm();
    this.router.navigate(['order', 'post-checkout', ''], {}).then();
  }


  onError(err) {
    console.log('Error: ', err);
  }

}
