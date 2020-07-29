import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/order/services/order.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-order-page',
  template: `
      <ng-container *transloco="let t">
          <div>
              <p>Products</p>
              <div class="products">
                  <mat-card *ngFor="let product of products">
                      <img mat-card-image [src]="product.image" alt="product-image">
                      <mat-card-actions>
                          <button mat-stroked-button color="primary" type="button">{{t('add')}}</button>
                      </mat-card-actions>
                  </mat-card>
              </div>
          </div>
      </ng-container>
  `,
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
      }

      mat-card-actions {
          flex: 1;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
      }

      @media screen and (max-width: 1000px) {
          .products {
              grid-template-columns: 1fr;
          }
      }
  `]
})
export class OrderPageComponent implements OnInit {

  products: any[];
  productsCount = 0;
  productCategories$: Observable<any>;
  leathers$: Observable<any>;
  leatherSerials$: Observable<any>;

  productFilterForm: FormGroup;

  constructor(
    private orderService: OrderService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.productFilterForm = this.getProductFilterForm();
    this.getProducts();
    this.productCategories$ = this.orderService.getProductCategories();
    this.leathers$ = this.orderService.getLeathers();
    this.leatherSerials$ = this.orderService.getLeatherSerials();
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

}
