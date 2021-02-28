import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrderService } from 'src/app/order/services/order.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { clearCart, fromEntries, productsInCart } from 'src/app/common/const';
import { Router } from '@angular/router';
import { LeatherSelectResult, LeatherSerial, Order, OrderUnit } from 'src/app/order/order.model';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { LeatherSelectComponent } from 'src/app/order/components/checkout-page/leather-select.component';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ErrorHandler } from 'src/app/common/error-handler';
import { TranslocoService } from '@ngneat/transloco';


@Component({
  selector: 'app-checkout',
  styles: [`
      .container {
          padding: 15px;
          width: 100%;
          margin: 0 auto;
      }

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

      .leather-select-group {
          width: 80%;
          display: flex;
          flex-direction: column;
      }

      .leather-select {
          width: 100%;
          display: flex;
          flex-direction: row;
      }

      .leather-select > mat-form-field {
          width: 85%;
      }

      .leather-image {
          width: 15%;
          border-radius: 4px;
          border: 3px solid rgba(27, 163, 30, 0.6);
          margin-left: 10px;
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

      .input-group {
          display: flex;
          align-items: center;
      }

      .input-group > button {
          width: unset;
      }

      .input-group .material-icons {
          font-size: 21px;
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

      @media print {
          .container {
              padding: 0;
          }
      }

      @media only screen and (max-width: 800px) {
          .leather-select > mat-form-field {
              width: 75%;
          }

          .leather-image {
              width: 25%;
          }
      }

      @media only screen and (max-width: 450px) {
          .leather-select > mat-form-field {
              width: 65%;
          }

          .leather-image {
              width: 35%;
          }
      }
  `],
  template: `
      <ng-container *transloco="let t">
          <div class="container">
              <mat-card class="title">
                  <h1>{{t('checkout title')}}</h1>
                  <button mat-stroked-button color="primary" routerLink="/order" queryParamsHandling="preserve">
                      <mat-icon>keyboard_backspace</mat-icon>
                  </button>
              </mat-card>
              <br>
              <!-- The Checkout form -->
              <mat-card class="mat-elevation-z2" style="padding: 16px 0">
                  <form [formGroup]="orderForm" class="vertical-form">
                      <h2>{{t('leathers')}}</h2>
                      <ng-container>
                          <div class="leather-select-group">
                              <!-- Inner Leather -->
                              <div class="leather-select" (click)="openLeatherSelection('inner_leather')">
                                  <mat-form-field color="primary" appearance="outline" class="cursor-pointer">
                                      <mat-label>{{t('inner_leather')}}</mat-label>
                                      <input type="text" matInput class="cursor-pointer"
                                             readonly formControlName="inner_leather_str">
                                      <mat-error>{{errors.inner_leather}}</mat-error>
                                  </mat-form-field>
                                  <img [src]="orderForm.value.inner_leather_img"
                                       [alt]="orderForm.value.inner_leather_img | imageAlt"
                                       class="leather-image cursor-pointer">
                              </div>

                              <!-- Outer Leather -->
                              <br>
                              <div class="leather-select" (click)="openLeatherSelection('outer_leather')">
                                  <mat-form-field color="primary" appearance="outline" class="cursor-pointer">
                                      <mat-label>{{t('outer_leather')}}</mat-label>
                                      <input type="text" matInput class="cursor-pointer"
                                             readonly formControlName="outer_leather_str">
                                      <mat-error>{{errors.outer_leather}}</mat-error>
                                  </mat-form-field>
                                  <img [src]="orderForm.value.outer_leather_img"
                                       [alt]="orderForm.value.outer_leather_img | imageAlt"
                                       class="leather-image cursor-pointer">
                              </div>
                          </div>
                      </ng-container>

                      <h2>{{t('personal details')}}</h2>
                      <!-- First Name -->
                      <mat-form-field color="primary" appearance="outline">
                          <mat-label>{{t('first name')}}</mat-label>
                          <input matInput type="text" formControlName="first_name" required maxlength="50">
                          <mat-icon matSuffix>person</mat-icon>
                          <mat-error>{{errors.first_name}}</mat-error>
                      </mat-form-field>

                      <!-- Last Name -->
                      <mat-form-field color="primary" appearance="outline">
                          <mat-label>{{t('last name')}}</mat-label>
                          <input matInput type="text" formControlName="last_name" required maxlength="50">
                          <mat-error>{{errors.last_name}}</mat-error>
                      </mat-form-field>

                      <!-- Phone -->
                      <mat-form-field color="primary" appearance="outline">
                          <mat-label>{{t('phone')}}</mat-label>
                          <input matInput type="tel" formControlName="phone" required maxlength="20">
                          <mat-icon matSuffix>phone</mat-icon>
                          <mat-hint>{{t('phone hint')}}</mat-hint>
                          <mat-error>{{errors.phone}}</mat-error>
                      </mat-form-field>

                      <!-- Address -->
                      <mat-form-field color="primary" appearance="outline">
                          <mat-label>{{t('business address')}}</mat-label>
                          <input matInput type="text" formControlName="address" required maxlength="254">
                          <mat-icon matSuffix>location_on</mat-icon>
                          <mat-hint>{{t('address hint')}}</mat-hint>
                          <mat-error>{{errors.address}}</mat-error>
                      </mat-form-field>

                      <button type="button"
                              color="primary"
                              mat-raised-button
                              [class.spinner]="isSubmitting"
                              [disabled]="isSubmitting"
                              (click)="submit()">
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
                              <img [src]="unit.product.image" [alt]="unit.product.image | imageAlt">
                          </div>

                          <!-- CARD CONTENT -->
                          <div class="card-content">
                              <h4>{{unit.product.properties.code.toUpperCase()}}</h4>
                              <div class="dimensions">
                                  <div class="size">
                                      <span>{{unit.product.properties.width | number}}</span> <img
                                          src="../../../../assets/images/width-arrow.svg"
                                          [alt]="'width-icon' | imageAlt">
                                  </div>
                                  <div class="size length-dimension">
                                      <span>{{unit.product.properties.length | number}}</span> <img
                                          src="../../../../assets/images/depth-arrow.svg"
                                          [alt]="'length-icon' | imageAlt">
                                  </div>
                                  <div class="size">
                                      <span>{{unit.product.properties.height | number}}</span> <img
                                          src="../../../../assets/images/height-arrow.svg"
                                          [alt]="'height-icon' | imageAlt">
                                  </div>
                              </div>
                          </div>

                          <!-- CARD ACTIONS -->
                          <div class="price-quantity" style="margin-bottom: 10px">
                              <span>{{unit.product.price | number | prefix: '$'}}</span> <span>x</span>
                              <span class="input-group">
                                  <button mat-icon-button type="button" color="primary"
                                          (click)="increaseDecreaseQuantity(unit, quantity, -1)">
                                      <mat-icon>remove</mat-icon>
                                  </button>
                                  <input type="number"
                                         [value]="unit.quantity"
                                         class="quantity-input"
                                         disabled
                                         #quantity>
                                  <button mat-icon-button type="button" color="primary"
                                          (click)="increaseDecreaseQuantity(unit, quantity, 1)">
                                      <mat-icon>add</mat-icon>
                                  </button>
                              </span>
                              <span>=</span>
                              <span>{{(unit.product.price * unit.quantity | number) | prefix: '$'}}</span>
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
  errors: any = {};
  uns$ = new Subject();
  isSubmitting = false;


  constructor(
    private orderService: OrderService,
    private fb: FormBuilder,
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private snackbar: MatSnackBar,
    private eh: ErrorHandler,
    private transloco: TranslocoService
  ) {
  }


  ngOnInit(): void {
    this.productsInCart = productsInCart;
    this.initializeOrderForm();
    this.eh.handleErrors(this.orderForm, this.errors);
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
      products: [[]],   // not required, will be checked manually
      inner_leather: [null, [Validators.required]],
      inner_leather_str: '',  // helper field
      inner_leather_img: '../../../assets/images/white.png', // helper field
      outer_leather: [null, [Validators.required]],
      outer_leather_str: '',
      outer_leather_img: '../../../assets/images/white.png',
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


  increaseDecreaseQuantity(unit: OrderUnit, input: HTMLInputElement, value: number) {
    const newQuantity = +input.value + value;
    if (newQuantity && newQuantity >= 1 && newQuantity <= 1000) {
      unit.quantity = newQuantity;
      this.triggerValueChange();
    }
  }


  /**
   * In cases like changing quantity of a unit, the subscribers doesn't receive any information on that.
   * We are triggering a value change to let each subscriber do their actions based on that.
   */
  triggerValueChange() {
    this.productsInCart.next(this.productsInCart.getValue());
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
      [`${identifier}_str`, `${result.leatherSerial.name} ${result.leather.code.toUpperCase()}`],
      [`${identifier}_img`, result.leather.image]
    ]);
    this.orderForm.patchValue(entries);
  }


  /**
   * Serialization process is to replace products with their respective ID
   * instead of a product object and flattening the product properties.
   */
  getSerializedProducts(orderUnits) {
    orderUnits.forEach(orderUnit => {
      Object.keys(orderUnit.product.properties).forEach(key => {
        orderUnit[key] = orderUnit.product.properties[key];
      });
      orderUnit.product = orderUnit.product.id;
    });

    return orderUnits;
  }


  submit() {
    this.isSubmitting = true;
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      this.snackbar.open(this.transloco.translate('fill in details warning'), 'OK', {
        verticalPosition: 'bottom', horizontalPosition: 'right', duration: 3000,
        panelClass: 'warning-snackbar'
      });
      this.isSubmitting = false;
      return;
    }

    // Making a manual check if there are any products in the cart.
    // We can't assign a required validator
    const orderUnits = Array.from(this.productsInCart.getValue());
    if (orderUnits.length === 0) {
      this.snackbar.open(
        'cart empty warning',
        'OK',
        {
          verticalPosition: 'bottom', horizontalPosition: 'right', duration: 3000,
          panelClass: 'warning-snackbar'
        });
      this.isSubmitting = false;
      return;
    }

    // Replace products with serialized ones
    this.orderForm.get('products').patchValue(this.getSerializedProducts(orderUnits));
    this.orderService.createOrder(this.orderForm.value).subscribe(
      (order: Order) => this.onSuccess(order),
      (err) => this.onError(err)
    );
  }


  onSuccess(order: Order) {
    this.isSubmitting = false;
    this.productsInCart.next([]);
    clearCart();
    this.orderService.orderFormValue = null;
    this.initializeOrderForm();
    this.router.navigate(['order', 'post-checkout', order.id.toString()], {queryParamsHandling: 'preserve'}).then();
  }


  onError(err) {
    this.isSubmitting = false;
    const message = err.message ? err.message : 'Ka ndodhur një gabim, ju lutem provoni përsëri!';
    const config: MatSnackBarConfig = {
      horizontalPosition: 'right', duration: 3000, verticalPosition: 'bottom', panelClass: 'danger-snackbar'
    };
    this.snackbar.open(message, 'OK', config);
  }

}
