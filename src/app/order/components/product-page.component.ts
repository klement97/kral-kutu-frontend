import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/order/services/order.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ProductDetailComponent } from 'src/app/order/components/product-detail.component';
import {
  composeOrderUnit,
  hashCodeFromObject,
  positiveIntegerWithZeroRegex,
  productsInCart,
  setProductsInCart
} from 'src/app/common/const';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@ngneat/transloco';
import { Product } from 'src/app/order/models/order.model';


@Component({
  selector: 'app-order-page',
  styles: [`

      /*
      Even though add-to-cart and added-to-cart classes are present in common-style
      they are still required to be here too.
       */
      .add-to-cart {
          display: block;
          position: absolute;
          right: 5px;
          bottom: 5px;
          color: white;
          transition: .4s;
          transition-timing-function: linear;
      }

      .added-to-cart {
          position: absolute;
          right: 5px;
          bottom: 5px;
          z-index: 3;
          pointer-events: none;
          width: 40px;
          line-height: 24px;
          font-size: 24px;
          color: white;
      }

      .metric-hint {
          font-size: 10px;
          color: gray;
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
  `],
  template: `
      <ng-container *transloco="let t">
          <app-checkout-button *ngIf="productsInCart.getValue().length as length"></app-checkout-button>
          <div style="margin: 30px auto; width: 85%">
              <mat-card><h1 style="margin: 0">{{t('products')}}</h1></mat-card>
          </div>
          <div class="products">

              <!-- CARD -->
              <div class="product-card" *ngFor="let product of products" (click)="openProductDetails(product)">
                  <div class="image-wrapper">
                      <img [src]="product.image" alt="product-image">
                  </div>

                  <!-- CARD CONTENT -->
                  <div class="card-content">
                      <h4>{{product.code}}</h4>
                      <div class="dimensions">
                          <div class="size" (click)="focusInput($event, width.focus())">
                              <input type="number" class="quantity-input" [value]="product.width | number" #width
                                     (input)="product.width = width.value">
                              <img src="../../../assets/images/width-arrow.svg" alt="width-icon">
                              <span class="metric-hint">(cm)</span>
                          </div>
                          <div class="size length-dimension" (click)="focusInput($event, length.focus())">
                              <input type="number" class="quantity-input" [value]="product.length | number" #length
                                     (input)="product.length = length.value">
                              <img src="../../../assets/images/depth-arrow.svg" alt="length-icon">
                              <span class="metric-hint">(cm)</span>
                          </div>
                          <div class="size" (click)="focusInput($event, height.focus())">
                              <input type="number" class="quantity-input" [value]="product.height | number" #height
                                     (input)="product.height = height.value">
                              <img src="../../../assets/images/height-arrow.svg" alt="height-icon">
                              <span class="metric-hint">(cm)</span>
                          </div>
                      </div>
                  </div>

                  <!-- CARD ACTIONS -->
                  <div class="card-actions">
                      <span class="product-price">{{product.price | prefix: '$'}}</span>
                      <div class="quantity-input-group">
                              <span class="up-down-buttons">
                                  <button mat-icon-button type="button"
                                          (click)="changeInputValue($event, quantity, -1)">
                                      <mat-icon color="primary">keyboard_arrow_down</mat-icon>
                                  </button>
                                  <input type="text" [value]="'1'" (click)="$event.stopPropagation()"
                                         (input)="onInputChange($event, quantity)" #quantity class="quantity-input">
                                  <button mat-icon-button type="button" (click)="changeInputValue($event, quantity, 1)">
                                      <mat-icon color="primary">keyboard_arrow_up</mat-icon>
                                  </button>
                              </span>
                      </div>
                      <button mat-icon-button color="primary" type="button" class="add-to-cart"
                              (click)="addProductToCart($event, product, quantity.value, addToCartIcon, addedToCartIcon)">
                          <mat-icon #addToCartIcon style="z-index: 2; position: relative;">
                              add_shopping_cart
                          </mat-icon>
                      </button>
                      <button mat-icon-button class="added-to-cart">
                          <mat-icon #addedToCartIcon>shopping_cart</mat-icon>
                      </button>
                  </div>
              </div>
          </div>
      </ng-container>
  `
})
export class ProductPageComponent implements OnInit {

  products: Product[];
  productsCount = 0;
  productCategories$: Observable<any>;
  leathers$: Observable<any>;
  leatherSerials$: Observable<any>;

  productFilterForm: FormGroup;
  productsInCart: BehaviorSubject<any>;


  constructor(
    private orderService: OrderService,
    private fb: FormBuilder,
    private bottomSheet: MatBottomSheet,
    private snackbar: MatSnackBar,
    private transloco: TranslocoService
  ) { }


  ngOnInit(): void {
    this.productFilterForm = this.getProductFilterForm();
    this.getProducts();
    this.productCategories$ = this.orderService.getProductCategories();
    this.leathers$ = this.orderService.getLeathers();
    this.leatherSerials$ = this.orderService.getLeatherSerials();
    this.productsInCart = productsInCart;
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


  openProductDetails(product): void {
    this.bottomSheet.open(ProductDetailComponent, {data: {product}, panelClass: 'no-top-padding'})
      .afterDismissed().subscribe(((result: { addToCart: boolean, quantity: number }) => {
      if (result?.addToCart) {
        const fakeEvent = {stopPropagation: () => {}};
        this.addProductToCart(fakeEvent, product, result.quantity.toString());
      }
    }));
  }


  /**
   * Add selected product with selected quantity to the cart.
   * If the product is already in the cart we just increment the quantity of it.
   * Otherwise we add a new unit to the cart.
   * @param e                 Event, used to prevent product detail to be opened up
   * @param product           Selected product to add to the cart
   * @param quantity          Quantity of the product, taken from input
   * @param addToCartIcon     Respective icon of the product, if never added to cart
   * @param addedToCartIcon   Respective icon of the product, if already in cart
   */
  addProductToCart(e, product, quantity: string, addToCartIcon?, addedToCartIcon?) {
    e.stopPropagation(); // prevents product detail to be opened up

    // Generating a hash here to check if the product is already in cart
    const hash = hashCodeFromObject(product, ['code', 'width', 'height', 'length']);

    // If hash can not be found inside the products in cart
    // this means that we need to add the product as a new unit
    const selectedProducts: any[] = this.productsInCart.getValue();
    const productIndex: number = this.findProductByHash(hash);
    const isProductInCart: boolean = productIndex > -1;

    if (isProductInCart) {
      selectedProducts[productIndex].quantity += Number(quantity);
    } else {
      selectedProducts.push(composeOrderUnit(product, Number(quantity), hash));
    }
    setProductsInCart(this.productsInCart, selectedProducts);
    this.snackbar.open(this.transloco.translate('cart success message'), 'OK', {
      horizontalPosition: 'end', verticalPosition: 'top', duration: 3000, panelClass: ['success-snackbar']
    });
    if (addToCartIcon) {
      this.animate(addToCartIcon, addedToCartIcon);
    }
  }


  animate(addToCartIcon, addedToCartIcon) {
    const isItemAlreadyInCart: boolean = addToCartIcon._elementRef.nativeElement.style.opacity === '0';
    if (typeof addToCartIcon.counter === 'undefined') {
      Object.defineProperty(addToCartIcon, 'counter', {writable: true, value: 1});
    }
    if (isItemAlreadyInCart) {
      const counter = addToCartIcon.counter;
      Object.defineProperty(addToCartIcon, 'counter', {writable: true, value: counter + 1});
      const rotateDegree = `${360 * addToCartIcon.counter}deg`;
      addedToCartIcon._elementRef.nativeElement.style.transform = 'rotate(' + rotateDegree + ')';
      return;
    }

    addToCartIcon._elementRef.nativeElement.style.opacity = 0;
    addedToCartIcon._elementRef.nativeElement.style.opacity = 1;
    addToCartIcon._elementRef.nativeElement.style.transform = 'rotate(360deg)';
    addedToCartIcon._elementRef.nativeElement.style.transform = 'rotate(360deg)';
  }


  findProductByHash(hash: number): number {
    return this.productsInCart.getValue().findIndex(unit => unit.hash === hash);
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


  focusInput(e, _) {
    e.stopPropagation();
  }

}
