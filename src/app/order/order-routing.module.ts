import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductPageComponent } from 'src/app/order/components/product-page/product-page.component';
import { CheckoutComponent } from 'src/app/order/components/checkout-page/checkout.component';
import { PostCheckoutPageComponent } from 'src/app/order/components/checkout-page/post-checkout-page.component';

// prefixed by /order
const routes: Routes = [
  {path: '', component: ProductPageComponent, pathMatch: 'full'},
  {path: 'checkout', component: CheckoutComponent, pathMatch: 'full'},
  {path: 'post-checkout/:order_id', component: PostCheckoutPageComponent, pathMatch: 'full'}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule {}
