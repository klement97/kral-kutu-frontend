import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';


@Component({
  selector: 'app-product-detail',
  template: `
      <p>
          product-detail works!
      </p>
      <p>
          {{data.product.code}}
      </p>
  `,
  styles: []
})
export class ProductDetailComponent implements OnInit {

  constructor(
    private bottomSheetRef: MatBottomSheetRef<ProductDetailComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

}
