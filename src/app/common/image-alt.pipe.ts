import {Pipe, PipeTransform} from '@angular/core';


@Pipe({
  name: 'imageAlt'
})
export class ImageAltPipe implements PipeTransform {

  transform(value: string): string {
    const imageName: string = value ? value.split('/').pop().split('.')[0] : '';
    return `italgold leather ${imageName}`;
  }

}
