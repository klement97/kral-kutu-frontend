import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderPageComponent } from './order-page/order-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TranslocoRootModule } from 'src/app/transloco-root.module';


@NgModule({
  declarations: [OrderPageComponent],
  imports: [
    CommonModule,
    OrderRoutingModule,
    ReactiveFormsModule,
    PaginatorModule,
    CardModule,
    ButtonModule,
    TranslocoRootModule
  ]
})
export class OrderModule {}
