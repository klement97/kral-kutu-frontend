import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderPageComponent } from 'src/app/order/components/order-page.component';
import { CheckoutComponent } from 'src/app/order/components/checkout.component';


const routes: Routes = [
  {path: '', component: OrderPageComponent, pathMatch: 'full'},
  {path: 'checkout', component: CheckoutComponent, pathMatch: 'full'}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule {}
