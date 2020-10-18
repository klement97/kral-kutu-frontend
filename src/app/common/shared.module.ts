import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageAltPipe } from 'src/app/common/image-alt.pipe';
import { PrefixPipe } from 'src/app/common/prefix.pipe';
import { IfNotNullPipe } from './if-not-null.pipe';


@NgModule({
  declarations: [
    ImageAltPipe,
    PrefixPipe,
    IfNotNullPipe
  ],
  exports: [
    ImageAltPipe,
    PrefixPipe,
    IfNotNullPipe
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule {}
