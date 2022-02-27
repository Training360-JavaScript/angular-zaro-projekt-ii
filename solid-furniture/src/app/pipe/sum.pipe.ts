import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sum',
})
export class SumPipe implements PipeTransform {
  transform(arr: any[], key: any): number {
    return arr.reduce((prev, val) => prev + val[key], 0);
  }
}
