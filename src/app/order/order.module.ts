import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { ProductPageComponent } from 'src/app/order/components/product-page.component';
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
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from 'src/app/common/shared.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CheckoutButtonComponent } from 'src/app/order/components/checkout-button.component';
import { PostCheckoutPageComponent } from 'src/app/order/components/post-checkout-page.component';
import { ProductCategoryTabsComponent } from 'src/app/order/components/product-category-tabs.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    ProductPageComponent,
    ProductDetailComponent,
    CheckoutComponent,
    CheckoutButtonComponent,
    PostCheckoutPageComponent,
    ProductCategoryTabsComponent
  ],
  imports: [
    SharedModule,
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
    MatListModule,
    MatTableModule,
    MatSnackBarModule,
    MatTabsModule,
    MatSelectModule
  ]
})
export class OrderModule {}
