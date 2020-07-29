import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/order/services/order.service';
import { PRODUCTS_IN_CART } from 'src/app/common/const';


@Component({
  selector: 'app-header',
  template: `
      <ng-container *transloco="let t">
          <!-- BEGIN TOOLBAR -->
          <mat-toolbar color="primary" style="height: 50px">
              <span routerLink="/" style="cursor: pointer">Kral Kutu</span>
              <span class="spacer"></span>

              <!-- BEGIN ACTIONS -->
              <div>
                  <button mat-icon-button [matMenuTriggerFor]="menu">
                      <mat-icon [matBadge]="productsInCartCount"
                                matBadgeColor="warn"
                                [matBadgeDescription]="t('product count')">
                          shopping_cart
                      </mat-icon>
                  </button>
              </div>
              <mat-menu #menu yPosition="below" xPosition="before" class="menu">
                  <ng-template matMenuContent>
                      <app-cart (click)="$event.stopPropagation()"></app-cart>
                  </ng-template>
              </mat-menu>
              <!-- END ACTIONS -->

          </mat-toolbar>
          <!-- END TOOLBAR -->
      </ng-container>
  `,
  styles: [
      `
          .spacer {
              display: flex;
              flex: 1 1 auto;
          }
    `
  ]
})
export class HeaderComponent implements OnInit {

  productsInCartCount = '0';

  constructor(
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.loadProductsFromLocalStorage();
    this.getCountOfProductsInCart();
  }

  loadProductsFromLocalStorage() {
    const productsInLocalStorage = localStorage.getItem(PRODUCTS_IN_CART);
    if (productsInLocalStorage) {
      this.orderService.productsInCart.next(JSON.parse(productsInLocalStorage));
    }
  }

  getCountOfProductsInCart() {
    this.orderService.productsInCart.subscribe((value) => {
      let quantity = 0;
      value.forEach((v) => quantity += v.quantity);
      this.productsInCartCount = quantity.toString();
    });
  }
}
