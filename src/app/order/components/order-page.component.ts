import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/order/services/order.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ProductDetailComponent } from 'src/app/order/components/product-detail.component';
import { composeOrderUnit, setProductsInCart } from 'src/app/common/const';


@Component({
  selector: 'app-order-page',
  styles: [`
      .products {
          width: 75%;
          margin: auto;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-column-gap: 30px;
          grid-row-gap: 30px;
      }

      mat-card {
          display: flex;
          flex-direction: column;
          cursor: pointer;
      }

      mat-card:hover {
          box-shadow: 0 0 10px gray;
          transform: scale(1.05, 1.05);
      }

      mat-card-actions {
          flex: 1;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
      }

      .quantity-input-group {
      }

      .up-down-buttons {
      }

      .up-down-buttons button {
      }

      @media screen and (max-width: 1000px) {
          .products {
              grid-template-columns: 1fr;
          }
      }
  `],
  template: `
      <ng-container *transloco="let t">
          <div>
              <h1>Products</h1>
              <div class="products">
                  <mat-card *ngFor="let product of products" (click)="openProductDetails(product)">
                      <img mat-card-image [src]="product.image" alt="product-image">
                      <mat-card-content>
                          <p>
                              {{product.code}} - $ {{product.price}}
                          </p>
                      </mat-card-content>
                      <mat-card-actions>
                          <div class="quantity-input-group">
                              <input type="text" [value]="'1'"
                                     (click)="$event.stopPropagation()"
                                     (input)="onInputChange($event, quantity)"
                                     #quantity
                                     style="height: 30px; width: 50px">
                              <span class="up-down-buttons">
                                  <button mat-icon-button type="button" (click)="changeInputValue($event, quantity, 1)">
                                      <mat-icon color="primary">keyboard_arrow_up</mat-icon>
                                  </button>
                                  <button mat-icon-button type="button"
                                          (click)="changeInputValue($event, quantity, -1)">
                                      <mat-icon color="primary">keyboard_arrow_down</mat-icon>
                                  </button>
                              </span>
                          </div>
                          <button mat-stroked-button color="primary" type="button"
                                  (click)="addProductToCart($event, product, quantity.value)">
                              {{t('add')}}
                          </button>
                      </mat-card-actions>
                  </mat-card>
              </div>
          </div>
      </ng-container>
  `
})
export class OrderPageComponent implements OnInit {

  products: any[];
  productsCount = 0;
  productCategories$: Observable<any>;
  leathers$: Observable<any>;
  leatherSerials$: Observable<any>;

  productFilterForm: FormGroup;
  productsInCart: BehaviorSubject<any>;

  positiveIntegerRegex = new RegExp('^[1-9]\\d*$');
  positiveIntegerWithZeroRegex = new RegExp('^\\d+$');

  constructor(
    private orderService: OrderService,
    private fb: FormBuilder,
    private bottomSheet: MatBottomSheet
  ) { }

  ngOnInit(): void {
    this.productFilterForm = this.getProductFilterForm();
    this.getProducts();
    this.productCategories$ = this.orderService.getProductCategories();
    this.leathers$ = this.orderService.getLeathers();
    this.leatherSerials$ = this.orderService.getLeatherSerials();
    this.productsInCart = this.orderService.productsInCart;
  }

  getProductFilterForm(): FormGroup {
    return this.fb.group({
      title: '', price_min: null, price_max: null,
      category: null, inner_leather: null, outer_leather: null
    });
  }

  getProducts() {
    // fixme: fix paginator here
    this.orderService.getProducts(null, this.productFilterForm.value).subscribe(
      (res: any) => {
        this.products = res.results ? res.results : res;
        this.productsCount = res.count ? res.count : res.length();
      });
  }

  openProductDetails(product) {
    this.bottomSheet.open(ProductDetailComponent, {data: {product}})
      .afterDismissed().subscribe(((result: { addToCart: boolean, quantity: number }) => {
      if (result?.addToCart) {
        const fakeEvent = {stopPropagation: () => {}};
        this.addProductToCart(fakeEvent, product, result.quantity.toString());
      }
    }));
  }

  addProductToCart(e, product, quantity: string) {
    e.stopPropagation(); // prevents product detail to be opened up
    const productsInCart: any[] = this.productsInCart.getValue();
    const productIndex: number = this.findProductInCart(product.id);
    if (productIndex > -1) {
      productsInCart[productIndex].quantity += Number(quantity);
    } else {
      productsInCart.push(composeOrderUnit(product, Number(quantity)));
    }
    setProductsInCart(this.productsInCart, productsInCart);
  }

  findProductInCart(productId): number {
    return this.productsInCart.getValue()
      .findIndex((orderUnit) => orderUnit.product.id === productId);
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

  onInputChange(e, input) {
    e.stopPropagation();
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

}
