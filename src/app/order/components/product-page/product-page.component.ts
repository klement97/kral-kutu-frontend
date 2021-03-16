import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { OrderService } from 'src/app/order/services/order.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  activeCategories,
  composeOrderUnit,
  FIRST_CATEGORY_TO_FILTER,
  FIRST_SUB_CATEGORY_TO_FILTER,
  hashCodeFromProduct,
  IDNameModel,
  positiveIntegerWithZeroRegex,
  productsInCart,
  setProductsInCart
} from 'src/app/common/const';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@ngneat/transloco';
import { Product, ProductCategory } from 'src/app/order/order.model';
import { MatPaginator } from '@angular/material/paginator';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ProductImageComponent } from 'src/app/order/components/product-page/product-image.component';
import { MatDialog } from '@angular/material/dialog';


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

      .only-text-menu {
          width: 100%;
      }

      ::ng-deep .only-text-menu > .mat-form-field-appearance-outline .mat-form-field-wrapper {
          margin: 0 !important;
      }

      .notes {
          width: 100%;
      }

      ::ng-deep .notes .mat-form-field-appearance-outline .mat-form-field-wrapper {
          margin: 0 !important;
      }

      ::ng-deep .notes .mat-form-field-wrapper {
          padding-bottom: 0 !important;
      }
  `],
  template: `
      <ng-container *transloco="let t">
          <app-checkout-button *ngIf="productsInCart.getValue().length as length"></app-checkout-button>

          <!-- Header, (Products and search bar) -->
          <mat-card>
              <h1 style="margin: 0 10px 0 0; display: inline-block">{{t('products')}}</h1>
              <mat-form-field appearance="outline" color="primary">
                  <input #code
                         matInput
                         autocapitalize="off"
                         autocomplete="off"
                         type="search"
                         (input)="searchCode$.next(code.value)"
                         [placeholder]="t('search') + '...'">
                  <button mat-icon-button matPrefix (click)="code.value = ''">
                      <mat-icon>search</mat-icon>
                  </button>
                  <div id="navigator"></div>
              </mat-form-field>
          </mat-card>

          <!-- Product categories tab switcher -->
          <app-content-loader *ngIf="isCategoriesLoading"></app-content-loader>
          <ng-container *ngIf="productCategories.length > 0">
              <app-product-category-tabs [categories]="productCategories"></app-product-category-tabs>
          </ng-container>

          <!-- Product list container -->
          <div class="products-container">
              <app-no-results *ngIf="products?.length == 0 && !isProductsLoading"></app-no-results>
              <div class="products">

                  <!-- Loader skeleton -->
                  <ng-container *ngIf="isProductsLoading">
                      <app-content-loader class="product-card" *ngFor="let _ of skeletonProducts"></app-content-loader>
                  </ng-container>

                  <!-- CARD -->
                  <div class="product-card" *ngFor="let product of products">
                      <div class="image-wrapper" (click)="openProductDetails(product)">
                          <img [src]="product.image" [alt]="product.image | imageAlt">
                      </div>

                      <!-- CARD CONTENT -->
                      <span style="display: flex">
                          <span [ngSwitch]="product.category.name.toLowerCase()" style="width: 95%">
                          <app-table-content *ngSwitchCase="'table'" [product]="product"></app-table-content>
                          <app-table-content *ngSwitchCase="'premium table'" [product]="product"></app-table-content>
                          <app-table-content *ngSwitchCase="'service table'" [product]="product"></app-table-content>
                          <app-accessory-content *ngSwitchCase="'accessory'"
                                                 [product]="product"></app-accessory-content>
                          </span>
                          <span class="card-content">
                              <div (click)="autoFocusNotes()">
                              <button mat-icon-button [matMenuTriggerFor]="menu" id="menuTrigger" color="primary">
                                  <mat-icon>add_comment</mat-icon>
                              </button>
                            </div>
                            <mat-menu #menu yPosition="below" xPosition="before" class="only-text-menu">
                                <ng-template matMenuContent>
                                    <mat-form-field appearance="outline" class="notes">
                                        <textarea type="text"
                                                  #notes
                                                  cdkTextareaAutosize
                                                  cdkAutosizeMinRows="2"
                                                  cdkAutosizeMaxRows="10"
                                                  (input)="product.properties.notes = notes.value"
                                                  [value]="product.properties.notes || ''"
                                                  (click)="$event.stopPropagation()"
                                                  [placeholder]="t('notes') + '...'"
                                                  matInput
                                                  autofocus
                                                  autocomplete="off"
                                                  autocapitalize="off"
                                                  class="notes-text-area"></textarea>
                                    </mat-form-field>
                                </ng-template>
                            </mat-menu>
                          </span>
                      </span>

                      <!-- CARD ACTIONS -->
                      <div class="card-actions">
                          <span class="product-price">{{product.price | number | prefix: '$'}}</span>
                          <div class="quantity-input-group align-center">
                              <button mat-icon-button type="button" (click)="changeInputValue($event, quantity, -1)">
                                  <mat-icon color="primary">remove</mat-icon>
                              </button>
                              <input readonly type="text" [value]="'1'" (click)="$event.stopPropagation()" #quantity
                                     class="quantity-input">
                              <button mat-icon-button type="button" (click)="changeInputValue($event, quantity, 1)">
                                  <mat-icon color="primary">add</mat-icon>
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

              <!-- Paginator -->
              <mat-card style="padding: 0; margin: 15px 0 0 0;">
                  <mat-paginator #paginator
                                 showFirstLastButtons
                                 [length]="productsCount"
                                 [pageSize]="12"
                                 [pageSizeOptions]="[12, 21, 30]"
                                 (page)="getProducts()">
                  </mat-paginator>
              </mat-card>
          </div>
      </ng-container>
  `
})
export class ProductPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  products: Product[];
  // an array of random numbers to be used as skeleton loaders
  skeletonProducts = [...Array(12)].map(() => Math.random());
  productsCount = 0;
  productCategories: ProductCategory[] = [];
  productFilterForm: FormGroup;
  isProductsLoading = false;
  isCategoriesLoading = false;

  productsInCart: BehaviorSubject<any>;
  searchCode$ = new BehaviorSubject<string>(null);
  uns$ = new Subject();


  constructor(
    private orderService: OrderService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private transloco: TranslocoService,
    private route: ActivatedRoute,
  ) {
  }


  ngOnInit(): void {
    this.getProductsAndCategories();
    this.productFilterForm = this.getProductFilterForm();
    this.productsInCart = productsInCart;
  }


  ngAfterViewInit() {
    this.searchCode();
    this.watchQueryParams();
  }


  ngOnDestroy() {
    this.uns$.next();
    this.uns$.complete();
  }


  watchQueryParams() {
    activeCategories
      .pipe(takeUntil(this.uns$))
      .subscribe(categories => this.filterByCategory(categories.category, categories.sub_category));
  }


  searchCode() {
    this.searchCode$.pipe(takeUntil(this.uns$), distinctUntilChanged())
      .subscribe((code) => {
        if (code && code !== '') {
          this.filterByCode(code, null);
        } else if (code === '') {
          this.filterByCode('', this.productFilterForm.value.category);
        }
      });
  }


  getProductsAndCategories() {
    this.isCategoriesLoading = true;
    this.isProductsLoading = true;
    this.orderService.getProductCategories().subscribe(
      categories => {
        this.productCategories = categories;
        this.isCategoriesLoading = false;
        this.getProducts();
      }, () => this.isCategoriesLoading = false
    );
  }


  getProducts() {
    this.orderService.getProducts(this.paginator, this.productFilterForm.value).subscribe(
      res => {
        this.products = res.results;
        this.productsCount = res.count;
        this.isProductsLoading = false;
        const navigator = document.getElementById('navigator');
        if (navigator) {
          navigator.scrollIntoView({behavior: 'smooth'});
        }
      }, () => this.isProductsLoading = false);
  }


  getProductFilterForm(): FormGroup {
    const paramMap = this.route.snapshot.queryParamMap;
    let category = +paramMap.get('category');
    if (!category) {
      category = FIRST_CATEGORY_TO_FILTER.id;
    }
    let sub_category = +paramMap.get('sub_category');
    if (!sub_category) {
      sub_category = FIRST_SUB_CATEGORY_TO_FILTER.id;
    }
    return this.fb.group({code: '', category, sub_category});
  }


  filterByCategory(category: ProductCategory, sub_category: IDNameModel = null) {
    if (category && this.productFilterForm.value.category !== category.id) {
      this.productFilterForm.get('category').patchValue(category.id);
    }
    if (sub_category && this.productFilterForm.value.sub_category !== sub_category.id) {
      this.productFilterForm.get('sub_category').patchValue(sub_category.id);
    }
    this.paginator.pageIndex = 0;
    this.getProducts();
  }


  filterByCode(code, category) {
    this.paginator.pageIndex = 0;
    this.orderService.getProductsByCode(this.paginator, {code, category})
      .subscribe(response => this.products = response.results);
  }


  openProductDetails(product): void {
    this.dialog.open(ProductImageComponent, {data: product, panelClass: 'no-top-padding'});
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
  addProductToCart(product: Product, quantity: string, addToCartIcon?, addedToCartIcon?) {
    if (product.category.name.toLowerCase() === 'accessory') {
      if (!product.properties.code || !product.properties.codes.includes(product.properties.code)) {
        // For an accessory type of product, a code must be selected from `codes`
        this.snackbar.open(
          this.transloco.translate('select a code warning'),
          '',
          {panelClass: 'warning-snackbar', duration: 2500},
        );
        return;
      } else {
        // If code is selected then find the price from properties.prices
        const selectedCode = product.properties.code;
        const selectedCodeIndex = product.properties.codes.findIndex(code => code === selectedCode);
        product.price = product.properties.prices[selectedCodeIndex];
      }
    }

    // Generating a hash here to check if the product is already in cart
    const hash = hashCodeFromProduct(product);

    // If hash can not be found inside the products in cart
    // this means that we need to add the product as a new unit
    const productIndex: number = this.findProductByHash(hash);
    const isProductInCart: boolean = productIndex > -1;

    const selectedProducts: any[] = this.productsInCart.getValue();
    if (isProductInCart) {
      selectedProducts[productIndex].quantity += Number(quantity);
      selectedProducts[productIndex].product.properties.notes = product.properties.notes;
    } else {
      selectedProducts.push(composeOrderUnit(product, Number(quantity), hash));
    }
    setProductsInCart(this.productsInCart, selectedProducts);
    this.snackbar.open(this.transloco.translate('cart success message'), 'OK', {
      horizontalPosition: 'end', verticalPosition: 'bottom', duration: 2000, panelClass: ['success-snackbar']
    });
    if (addToCartIcon) {
      this.animate(addToCartIcon, addedToCartIcon);
    }

    if (product.category.name.toLowerCase() === 'accessory') {
      // Only for accessories, we set the code and price based on the selected one.
      // After the product is added to the cart successfully we reset the selected code and price.
      product.properties.code = null;
      product.price = null;
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


  autoFocusNotes() {
    const textAreaEl: HTMLTextAreaElement = document.getElementsByClassName(
      'notes-text-area')[0] as HTMLTextAreaElement;
    textAreaEl.focus();
  }

}
