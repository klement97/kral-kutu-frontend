import { Component, Input, OnInit } from '@angular/core';
import { AccessoryProduct } from 'src/app/order/order.model';


@Component({
  selector: 'app-accessory-content',
  styles: [`
      .grid {
          min-height: 100%;
          display: flex;
          flex-wrap: wrap;
          flex-direction: row;
      }

      .grid > div {
          display: flex;
          flex-basis: calc(33.33% - 14px);
          justify-content: center;
          flex-direction: column;
      }

      .grid > div:last-child {
          display: flex;
          margin-top: 0;
          flex-basis: calc(100% - 22px);
          justify-content: center;
          flex-direction: column;
      }

      .box {
          margin: 10px 0 5px 5px;
          font-size: 12px;
      }

      .box:hover {
          border: 2px inset rgba(27, 163, 30, 0.4);
      }

      button:focus {
          border: 2px inset rgba(27, 163, 30, 0.5);
      }
  `],
  template: `
      <ng-container *transloco="let t">
          <div class="grid">
              <button *ngFor="let code of product.properties.codes; let i=index;"
                      (click)="product.properties.code = code"
                      mat-stroked-button
                      color="primary"
                      class="box">{{code.toUpperCase()}} - {{product.properties.prices[i] | number | prefix: '$'}}</button>
          </div>
      </ng-container>
  `
})
export class AccessoryContentComponent implements OnInit {
  @Input() product: AccessoryProduct;


  constructor() { }


  ngOnInit(): void {
  }

}
