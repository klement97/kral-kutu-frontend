import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'prefix'
})
export class PrefixPipe implements PipeTransform {

  transform(value: any, ...args: string[]): string {
    return args[0] + value.toString();
  }

}
