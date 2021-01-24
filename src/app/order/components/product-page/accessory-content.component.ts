import { Component, Input, OnInit } from '@angular/core';
import { AccessoryProduct } from 'src/app/order/order.model';


@Component({
  selector: 'app-accessory-content',
  styles: [`
      .code-input {
          display: flex;
          justify-content: center;
          align-items: center;
          padding-bottom: 10px;
      }

      .code-input label {
          font-size: 18px;
      }

      .quantity-input {
          width: unset;
          height: 40px;
      }
  `],
  template: `
      <ng-container *transloco="let t">
          <div class="code-input" (click)="$event.stopPropagation()">
              <label for="code">{{t('code')}}:</label>&nbsp;
              <input (input)="product.properties.code = code.value"
                     #code
                     type="text"
                     value=""
                     class="quantity-input"
                     placeholder="{{t('write code here')}}..."
                     id="code">
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
