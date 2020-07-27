import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageAltPipe } from 'src/app/common/image-alt.pipe';
import { PrefixPipe } from 'src/app/common/prefix.pipe';


@NgModule({
  declarations: [
    ImageAltPipe,
    PrefixPipe
  ],
  exports: [
    ImageAltPipe,
    PrefixPipe
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule {}
