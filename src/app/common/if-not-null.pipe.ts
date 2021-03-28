import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'ifNotNull'
})
export class IfNotNullPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    const properties: string = args[0];
    const prefix = args[1] || '';
    const suffix = args[2] || '';

    let property = null;
    try {
      for (const prop of properties.split('.')) {
        property = value[prop];
        value = property;
      }
    } catch {
      return '--';
    }

    return property ? prefix + property + suffix : '--';
  }

}
