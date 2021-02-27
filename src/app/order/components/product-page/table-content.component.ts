import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TableProduct } from 'src/app/order/order.model';


@Component({
  selector: 'app-table-content',
  styles: [`
      .content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 15px;
      }

      .dimensions {
          display: flex;
          justify-content: center;
          align-items: flex-start;
      }

      .size {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          perspective: 800px;
      }

      .size > img {
          width: 20px;
      }

      .length-dimension {
          padding: 0 7px;
          margin: 0 7px;
          border-left: 1px solid rgb(230, 230, 230);
          border-right: 1px solid rgb(230, 230, 230);
      }

      .length-dimension > img {
          width: 27px;
          transform: rotateX(60deg) rotateZ(13deg);
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
      <div class="content">
          <h4>{{product.properties.code.toUpperCase()}}</h4>
          <div class="dimensions" *ngIf="product.properties as props">
              <!-- Width Input -->
              <div class="size" (click)="width.focus()">
                  <input type="number" class="quantity-input" [value]="props.width | number" #width
                         (input)="props.width = width.value">
                  <img src="../../../../assets/images/width-arrow.svg" [alt]="'width-icon' | imageAlt">
                  <span class="metric-hint">(cm)</span>
              </div>
              <!-- Length Input -->
              <div class="size length-dimension" (click)="length.focus()">
                  <input type="number" class="quantity-input" [value]="props.length | number" #length
                         (input)="props.length = length.value">
                  <img src="../../../../assets/images/depth-arrow.svg" [alt]="'length-icon' | imageAlt">
                  <span class="metric-hint">(cm)</span>
              </div>
              <!-- Height Input -->
              <div class="size" (click)="height.focus()">
                  <input type="number" class="quantity-input" [value]="props.height | number" #height
                         (input)="props.height = height.value">
                  <img src="../../../../assets/images/height-arrow.svg" [alt]="'height-icon' | imageAlt">
                  <span class="metric-hint">(cm)</span>
              </div>
          </div>
      </div>
  `,
})
export class TableContentComponent implements OnInit {
  @Input() product: TableProduct;


  constructor() { }


  ngOnInit(): void {
  }

}
