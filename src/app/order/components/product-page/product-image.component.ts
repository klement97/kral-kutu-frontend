import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from 'src/app/order/order.model';


@Component({
  selector: 'app-product-image',
  template: `
      <div class="image">
          <img class="image" [src]="product.image" [alt]="product.image | imageAlt">
      </div>
  `,
  styles: [`
      .image {
          max-height: 75vh;
      }

      @media only screen and (max-width: 700px) {
          .image {
              max-height: 70vh;
          }
      }

      @media only screen and (max-width: 500px) {
          .image {
              max-height: 60vh;
          }
      }
  `]
})
export class ProductImageComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ProductImageComponent>,
    @Inject(MAT_DIALOG_DATA) public product: Product
  ) { }


  ngOnInit(): void {
  }


  close() {
    this.dialogRef.close();
  }

}
