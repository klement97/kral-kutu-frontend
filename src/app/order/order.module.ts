import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { ProductPageComponent } from 'src/app/order/components/product-page/product-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoRootModule } from 'src/app/transloco-root.module';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { ProductDetailComponent } from 'src/app/order/components/product-page/product-detail.component';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CheckoutComponent } from 'src/app/order/components/checkout-page/checkout.component';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from 'src/app/common/shared.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CheckoutButtonComponent } from 'src/app/order/components/product-page/checkout-button.component';
import { PostCheckoutPageComponent } from 'src/app/order/components/checkout-page/post-checkout-page.component';
import { ProductCategoryTabsComponent } from 'src/app/order/components/product-page/product-category-tabs.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TableContentComponent } from 'src/app/order/components/product-page/table-content.component';
import { AccessoryContentComponent } from 'src/app/order/components/product-page/accessory-content.component';
import { OrderReviewTableComponent } from 'src/app/order/components/checkout-page/order-review-table.component';
import { LeatherSelectComponent } from 'src/app/order/components/checkout-page/leather-select.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { SelectButtonComponent } from 'src/app/order/components/checkout-page/select-button.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import {InvoiceComponent} from './components/checkout-page/invoice.component';


@NgModule({
  declarations: [
    ProductPageComponent,
    ProductDetailComponent,
    CheckoutComponent,
    CheckoutButtonComponent,
    PostCheckoutPageComponent,
    ProductCategoryTabsComponent,
    TableContentComponent,
    AccessoryContentComponent,
    OrderReviewTableComponent,
    LeatherSelectComponent,
    SelectButtonComponent,
    InvoiceComponent
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
    MatSelectModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatMenuModule,
    MatBadgeModule
  ]
})
export class OrderModule {}
