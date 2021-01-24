import { Component, OnInit } from '@angular/core';
import { PRODUCTS_IN_CART, productsInCart } from 'src/app/common/const';
import { TranslocoService } from '@ngneat/transloco';


@Component({
  selector: 'app-header',
  styles: [`
      .spacer {
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
          z-index: 9998;
      }

      .loader {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 9999;
      }

      .flag-button {
          margin-right: 3px;
      }

      .flag-button > img {
          width: 18px;
      }

      .no-style-button {
          background-color: rgb(50, 50, 50);
          border: none;
          box-shadow: none;
          cursor: pointer;
      }

      .no-style-button:focus {
          outline: none;
      }

      @media print {
          .header {
              display: none;
              position: absolute;
          }
      }
  `
  ],
  template: `
      <ng-container *transloco="let t">
          <!-- BEGIN TOOLBAR -->
          <mat-toolbar class="header">
              <span routerLink="/" queryParamsHandling="preserve" class="no-style-button">ITALGOLD</span>
              <span class="spacer"></span>

              <!-- BEGIN ACTIONS -->
              <div>
                  <!-- Language selection -->
                  <button class="flag-button no-style-button" (click)="changeLanguage('en')">
                      <img src="../../../assets/images/flags/uk.png" alt="united-kingdom-flag">
                  </button>
                  <button class="flag-button no-style-button" (click)="changeLanguage('sq')">
                      <img src="../../../assets/images/flags/albania.png" alt="albania-flag">
                  </button>
                  <button class="flag-button no-style-button" (click)="changeLanguage('tr')">
                      <img src="../../../assets/images/flags/turkey.png" alt="turkey-flag">
                  </button>

                  <!-- Cart button -->
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


  constructor(
    private transloco: TranslocoService
  ) {
  }


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


  changeLanguage(language) {
    this.transloco.setActiveLang(language);
  }
}
