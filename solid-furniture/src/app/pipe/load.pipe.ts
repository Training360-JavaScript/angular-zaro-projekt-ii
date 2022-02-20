import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'load',
})
export class LoadPipe implements PipeTransform {
  transform(value: any, args: number): any {
    if (!Array.isArray(value) || !args) {
      return value;
    }
    return value.slice(0, args);
  }
}
