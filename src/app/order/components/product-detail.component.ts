import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';


@Component({
  selector: 'app-product-detail',
  template: `
      <ng-container *transloco="let t">
          <p>
              product-detail works!
          </p>
          <p>
              {{data.product.code}}
          </p>
          <hr>
          <div class="quantity-input-group">
              <input type="text" [value]="1"
                     (click)="$event.stopPropagation()"
                     (input)="onInputChange($event, quantity)"
                     #quantity
                     style="height: 100%; width: 50px">
              <span class="up-down-buttons">
                  <button mat-icon-button type="button" (click)="changeInputValue($event, quantity, 1)">
                      <mat-icon color="primary">keyboard_arrow_up</mat-icon>
                  </button>
                  <button mat-icon-button type="button"
                          (click)="changeInputValue($event, quantity, -1)">
                      <mat-icon color="primary">keyboard_arrow_down</mat-icon>
                  </button>
              </span>
              <button mat-raised-button color="primary" type="button" (click)="addToCart(quantity.value)">
                  {{t('add to cart')}}
              </button>
          </div>
      </ng-container>
  `,
  styles: []
})
export class ProductDetailComponent implements OnInit {

  positiveIntegerRegex = new RegExp('^[1-9]\\d*$');
  positiveIntegerWithZeroRegex = new RegExp('^\\d+$');

  constructor(
    private bottomSheetRef: MatBottomSheetRef<ProductDetailComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
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
      if (inputChar && !this.positiveIntegerWithZeroRegex.test(inputChar)) {
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

}
