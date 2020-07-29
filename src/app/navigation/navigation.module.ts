import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from 'src/app/navigation/cart.component';
import { HeaderComponent } from 'src/app/navigation/header.component';
import { NavigationComponent } from 'src/app/navigation/navigation.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoRootModule } from 'src/app/transloco-root.module';
import { MatButtonModule } from '@angular/material/button';
import { NotFoundComponent } from 'src/app/navigation/not-found.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    CartComponent,
    HeaderComponent,
    NavigationComponent,
    NotFoundComponent
  ],
  exports: [
    HeaderComponent,
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    TranslocoRootModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule
  ]
})
export class NavigationModule {}