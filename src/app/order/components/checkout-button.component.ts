import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-checkout-button',
  template: `
      <ng-container *transloco="let t">
          <div class="wrapper">
              <button mat-stroked-button [routerLink]="'/order/checkout'">
                <span style="display: flex; align-items: center; justify-content: center;">
                    <mat-icon>shopping_cart</mat-icon>&nbsp;{{t('cart')}}
                </span>
              </button>
          </div>
      </ng-container>
  `,
  styles: [`
      button {
          background-color: white;
          border-color: rgba(0, 168, 28, 0.88);
          color: rgba(0, 168, 28, 0.88);
          position: fixed;
          bottom: 100px;
          right: 5px;
          opacity: 0.5;
          transition: all .2s ease-in-out;
          z-index: 3;
      }

      button:hover {
          opacity: 1;
      }
  `]
})
export class CheckoutButtonComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {}

}
