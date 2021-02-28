import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'dimensions'
})
export class DimensionsPipe implements PipeTransform {

  transform(product: { width, height, length }): string {
    if (!(product.width && product.length && product.height)) {
      return '';
    }

    return `${product.width} x ${product.length} x ${product.height}`;
  }

}
