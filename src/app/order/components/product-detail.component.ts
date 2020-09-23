import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { positiveIntegerWithZeroRegex } from 'src/app/common/const';


@Component({
  selector: 'app-product-detail',
  styles: [`
      .close-button {
          display: flex;
          justify-content: flex-end;
      }

      .add-to-cart-button {
          background-color: #3f51b5;
          color: white;
          width: 60px;
          height: 60px;
          box-shadow: 0 0 15px grey;
      }

      .add-to-cart-button mat-icon {
          width: 30px;
          font-size: 30px;
          height: 25px;
      }
  `],
  template: `
      <ng-container *transloco="let t">
          <div class="details">
              <div class="close-button">
                  <button mat-icon-button color="warn" (click)="closeBottomSheet()">
                      <mat-icon>close</mat-icon>
                  </button>
              </div>
              <div class="image-wrapper">
                  <img [src]="data.product.image" alt="product-image">
              </div>
              <mat-list>
                  <mat-list-item>
                      {{t('code')}}: {{data.product.code}}
                  </mat-list-item>
                  <mat-list-item *ngIf="data.product.title as title">
                      {{t('title')}}: {{title}}
                  </mat-list-item>
                  <mat-list-item *ngIf="data.product.description as description">
                      {{t('description')}}: {{description}}
                  </mat-list-item>
                  <mat-list-item *ngIf="data.product.inner_leather as inner_leather">
                      {{t('inner leather')}}: {{inner_leather.serial.name}}-{{inner_leather.code}}
                  </mat-list-item>
                  <mat-list-item *ngIf="data.product.outer_leather as outer_leather">
                      {{t('outer leather')}}: {{outer_leather.serial.name}}-{{outer_leather.code}}
                  </mat-list-item>
                  <mat-list-item *ngIf="data.product.price as price">
                      {{t('price')}}: {{price | prefix: '$'}}
                  </mat-list-item>
                  <mat-list-item *ngIf="data.product.height as height">
                      {{t('height')}}: {{height}}cm
                  </mat-list-item>
                  <mat-list-item *ngIf="data.product.width as width">
                      {{t('width')}}: {{width}}cm
                  </mat-list-item>
                  <mat-list-item *ngIf="data.product.length as length">
                      {{t('length')}}: {{length}}cm
                  </mat-list-item>
              </mat-list>
          </div>
          <hr>
          <div class="card-actions">
              <!-- Product Price -->
              <span class="product-price">{{data.product.price | prefix: '$'}}</span>

              <!-- Quantity Inputs -->
              <div class="quantity-input-group">
                    <span class="up-down-buttons">
                      <button mat-icon-button (click)="changeInputValue($event, quantity, -1)">
                          <mat-icon color="primary">keyboard_arrow_down</mat-icon>
                      </button>
                      <input type="text" [value]="1" (click)="$event.stopPropagation()"
                             (input)="onInputChange($event, quantity)" #quantity class="quantity-input">
                      <button mat-icon-button (click)="changeInputValue($event, quantity, 1)">
                          <mat-icon color="primary">keyboard_arrow_up</mat-icon>
                      </button>
              </span>
              </div>

              <!-- Add To Shopping Cart Button -->
              <button mat-icon-button color="primary" (click)="addToCart(quantity.value)" class="add-to-cart-button">
                  <mat-icon>add_shopping_cart</mat-icon>
              </button>
          </div>
      </ng-container>
  `
})
export class ProductDetailComponent implements OnInit {

  constructor(
    private bottomSheetRef: MatBottomSheetRef<ProductDetailComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { product: any }
  ) { }

  ngOnInit(): void {
  }

  onInputChange(e, input) {
    const inputChar: string = e.data;
    // setting a timeout to let the user understand the changes
    setTimeout(() => {
      if (!input.value || input.value === '0') {
        input.value = '1';
        return;
      }
      if (inputChar && !positiveIntegerWithZeroRegex.test(inputChar)) {
        const inputValueArray: string[] = input.value.split('');
        inputValueArray.splice(input.value.indexOf(inputChar), 1);
        input.value = inputValueArray.join('');
        return;
      }
      if (Number(input.value) > 10_000) {
        input.value = '10000';
      }
    }, 200);
  }

  changeInputValue(e, input, value) {
    e.stopPropagation();
    if (!input.value) {
      input.value = '1';
      return;
    }
    let inputValue = Number(input.value);
    if (inputValue === 1 && value === -1) {
      return;
    }
    inputValue += value;
    input.value = inputValue.toString();
    e.data = '1';
    this.onInputChange(e, input);
  }

  addToCart(quantity: string) {
    this.bottomSheetRef.dismiss({addToCart: true, quantity: Number(quantity)});
  }

  closeBottomSheet() {
    this.bottomSheetRef.dismiss({addToCart: false, quantity: null});
  }

}
