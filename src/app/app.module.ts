import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { preLoad, TranslocoRootModule } from './transloco-root.module';
import { NavigationModule } from 'src/app/navigation/navigation.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    HttpClientModule,
    TranslocoRootModule,
    NavigationModule,
    AppRoutingModule
  ],
  providers: [
    preLoad,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
