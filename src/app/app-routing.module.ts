import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavigationComponent } from 'src/app/navigation/components/navigation.component';
import { NotFoundComponent } from 'src/app/navigation/components/not-found.component';


const routes: Routes = [
  {path: '', component: NavigationComponent, pathMatch: 'full'},
  {
    path: 'order',
    loadChildren: () => import('src/app/order/order.module').then(m => m.OrderModule)
  },

  {path: 'not-found', component: NotFoundComponent, pathMatch: 'full'},
  {path: '**', redirectTo: 'not-found'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
