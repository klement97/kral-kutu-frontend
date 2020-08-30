import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderPageComponent } from 'src/app/order/components/order-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoRootModule } from 'src/app/transloco-root.module';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { ProductDetailComponent } from 'src/app/order/components/product-detail.component';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CheckoutComponent } from './components/checkout.component';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [OrderPageComponent, ProductDetailComponent, CheckoutComponent],
  imports: [
    CommonModule,
    OrderRoutingModule,
    ReactiveFormsModule,
    TranslocoRootModule,
    MatCardModule,
    MatGridListModule,
    MatButtonModule,
    MatBottomSheetModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule
  ]
})
export class OrderModule {}
