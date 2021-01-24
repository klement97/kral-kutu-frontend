import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageAltPipe } from 'src/app/common/image-alt.pipe';
import { PrefixPipe } from 'src/app/common/prefix.pipe';
import { IfNotNullPipe } from './if-not-null.pipe';
import { ContentLoaderComponent } from 'src/app/navigation/components/content-loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NoResultsComponent } from 'src/app/navigation/components/no-results.component';
import { TranslocoModule } from '@ngneat/transloco';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    ImageAltPipe,
    PrefixPipe,
    IfNotNullPipe,
    ContentLoaderComponent,
    NoResultsComponent
  ],
  exports: [
    ImageAltPipe,
    PrefixPipe,
    IfNotNullPipe,
    ContentLoaderComponent,
    NoResultsComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    TranslocoModule,
    MatDividerModule,
    MatIconModule
  ]
})
export class SharedModule {}
