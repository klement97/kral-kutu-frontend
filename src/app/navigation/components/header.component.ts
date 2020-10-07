import { Component, OnInit } from '@angular/core';
import { PRODUCTS_IN_CART, productsInCart } from 'src/app/common/const';


@Component({
  selector: 'app-header',
  styles: [
    `.spacer {
        display: flex;
        flex: 1 1 auto;
    }

    ::ng-deep .mat-menu-panel {
        width: 280px;
        max-height: 80vh !important;
    }

    ::ng-deep .mat-menu-content:not(:empty) {
        padding: 0 !important;
    }

    .header {
        height: 50px;
        background-color: rgb(50, 50, 50);
        color: white;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 9999;
    }
    `
  ],
  template: `
      <ng-container *transloco="let t">
          <!-- BEGIN TOOLBAR -->
          <mat-toolbar class="header">
              <span routerLink="/" style="cursor: pointer">ITALGOLD</span> <span class="spacer"></span>

              <!-- BEGIN ACTIONS -->
              <div>
                  <!--                  <button mat-icon-button [routerLink]="'/order/checkout'" id="menuTrigger">-->
                  <button mat-icon-button [matMenuTriggerFor]="menu" id="menuTrigger">
                      <mat-icon [matBadge]="productsInCartCount" matBadgeColor="warn"
                                [matBadgeDescription]="t('product count')">
                          shopping_cart
                      </mat-icon>
                  </button>
              </div>
              <mat-menu #menu yPosition="below" xPosition="before" class="menu">
                  <ng-template matMenuContent>
                      <app-cart (click)="$event.stopPropagation()" (buttonsClicked)="closeMenu()"></app-cart>
                  </ng-template>
              </mat-menu>
              <!-- END ACTIONS -->

          </mat-toolbar>
          <!-- END TOOLBAR -->
      </ng-container>
  `
})
export class HeaderComponent implements OnInit {
  productsInCartCount = '0';


  constructor() { }


  ngOnInit(): void {
    this.loadProductsFromLocalStorage();
    this.getCountOfProductsInCart();
  }


  loadProductsFromLocalStorage() {
    const productsInLocalStorage = localStorage.getItem(PRODUCTS_IN_CART);
    if (productsInLocalStorage) {
      productsInCart.next(JSON.parse(productsInLocalStorage));
    }
  }


  getCountOfProductsInCart() {
    productsInCart.subscribe((value) => {
      let quantity = 0;
      value.forEach((v) => quantity += v.quantity);
      this.productsInCartCount = quantity.toString();
    });
  }


  closeMenu() {
    document.getElementById('menuTrigger').click();
  }
}
