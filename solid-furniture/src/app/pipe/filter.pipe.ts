import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  // transform(value: unknown, ...args: unknown[]): unknown {
  //   return null;
  // }

  transform(value: any[] | null, phrase: string = '', key: string = ''): any[] | null {
    if (!Array.isArray(value) || !phrase) {
      return value;
    }

    phrase = phrase.toLowerCase();

    if (!key) {
      return value.filter(
        item => Object.values(item).join('').toLowerCase().includes(phrase)
      );
    }

    return value.filter(item => {
      const data = String(item[key]).toLowerCase();
      return data.includes(String(phrase));
    });
  }

}
