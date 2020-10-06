import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from 'src/app/order/services/order.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ProductDetailComponent } from 'src/app/order/components/product-page/product-detail.component';
import {
  composeOrderUnit, FIRST_CATEGORY_TO_FILTER,
  hashCodeFromProduct,
  IDNameModel,
  positiveIntegerWithZeroRegex,
  productsInCart,
  setProductsInCart
} from 'src/app/common/const';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@ngneat/transloco';
import { Product } from 'src/app/order/order.model';
import { MatPaginator } from '@angular/material/paginator';


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
  `],
  template: `
      <ng-container *transloco="let t">
          <app-checkout-button *ngIf="productsInCart.getValue().length as length"></app-checkout-button>
          <div style="margin: 30px auto; width: 85%">
              <mat-card><h1 style="margin: 0">{{t('products')}}</h1></mat-card>
          </div>
          <ng-container *ngIf="productCategories.length > 0">
              <app-product-category-tabs [categories]="productCategories" (categoryChange)="filterByCategory($event)">
              </app-product-category-tabs>
          </ng-container>
          <div class="products">

              <!-- CARD -->
              <div class="product-card" *ngFor="let product of products">
                  <div class="image-wrapper" (click)="openProductDetails(product)">
                      <img [src]="product.image" alt="product-image">
                  </div>

                  <!-- CARD CONTENT -->
                  <ng-container [ngSwitch]="product.category.name.toLowerCase()">
                      <app-table-content *ngSwitchCase="'tabaka'" [product]="product"></app-table-content>
                      <app-accessory-content *ngSwitchCase="'aksesor'" [product]="product"></app-accessory-content>
                  </ng-container>

                  <!-- CARD ACTIONS -->
                  <div class="card-actions">
                      <span class="product-price">{{product.price | number | prefix: '€'}}</span>
                      <div class="quantity-input-group">
                          <button mat-icon-button type="button"
                                  (click)="changeInputValue($event, quantity, -1)">
                              <mat-icon color="primary">-</mat-icon>
                          </button>
                          <input type="text" [value]="'1'" (click)="$event.stopPropagation()"
                                 (input)="onInputChange($event, quantity)" #quantity class="quantity-input">
                          <button mat-icon-button type="button" (click)="changeInputValue($event, quantity, 1)">
                              <mat-icon color="primary">+</mat-icon>
                          </button>
                      </div>
                      <button mat-icon-button color="primary" type="button" class="add-to-cart"
                              (click)="addProductToCart(product, quantity.value, addToCartIcon, addedToCartIcon)">
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
          <mat-paginator [length]="productsCount" [pageSize]="10" #paginator (page)="getProducts()"></mat-paginator>
      </ng-container>
  `
})
export class ProductPageComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  products: Product[];
  productsCount = 0;
  productCategories: IDNameModel[] = [];
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
  ) {
    this.leathers$ = orderService.getLeathers();
    this.leatherSerials$ = orderService.getLeatherSerials();
  }


  ngOnInit(): void {
    this.getProductCategories();
    this.productFilterForm = this.getProductFilterForm();
    this.productsInCart = productsInCart;
  }


  ngAfterViewInit() {
    this.getProducts();
  }


  getProductCategories() {
    this.orderService.getProductCategories().subscribe(
      categories => this.productCategories = categories
    );
  }


  getProductFilterForm(): FormGroup {
    return this.fb.group({
      title: '', price_min: null, price_max: null,
      category: FIRST_CATEGORY_TO_FILTER.id, inner_leather: null, outer_leather: null
    });
  }


  getProducts() {
    this.orderService.getProducts(this.paginator, this.productFilterForm.value).subscribe(
      (res: any) => {
        this.products = res.results ? res.results : res;
        this.productsCount = res.count ? res.count : res.length;
      });
  }


  filterByCategory(category: IDNameModel) {
    if (this.productFilterForm.value.category !== category.id) {
      this.productFilterForm.patchValue({category: category.id});
      this.paginator.pageIndex = 0;
      this.getProducts();
    }
  }


  openProductDetails(product): void {
    this.bottomSheet.open(ProductDetailComponent, {data: {product}, panelClass: 'no-top-padding'})
      .afterDismissed().subscribe(((result: { addToCart: boolean, quantity: number }) => {
      if (result?.addToCart) {
        this.addProductToCart(product, result.quantity.toString());
      }
    }));
  }


  /**
   * Add selected product with selected quantity to the cart.
   * If the product is already in the cart we just increment the quantity of it.
   * Otherwise we add a new unit to the cart.
   * @param product           Selected product to add to the cart
   * @param quantity          Quantity of the product, taken from input
   * @param addToCartIcon     Respective icon of the product, if never added to cart
   * @param addedToCartIcon   Respective icon of the product, if already in cart
   */
  addProductToCart(product, quantity: string, addToCartIcon?, addedToCartIcon?) {
    // Generating a hash here to check if the product is already in cart
    const hash = hashCodeFromProduct(product);

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
    console.log(this.productsInCart.getValue());
    this.snackbar.open(this.transloco.translate('cart success message'), 'OK', {
      horizontalPosition: 'end', verticalPosition: 'bottom', duration: 2000, panelClass: ['success-snackbar']
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

}
