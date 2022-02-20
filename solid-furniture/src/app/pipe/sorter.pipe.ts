import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sorter',
})
export class SorterPipe implements PipeTransform {
  transform(value: any, key: string, sortDirection: string = 'A...Z'): any[] {
    if (!Array.isArray(value) || !key) return value;
    if (!['A...Z', 'Z...A'].includes(sortDirection)) return value;
    if (!sortDirection) sortDirection = 'A...Z';

    const direction = sortDirection === 'A...Z' ? 1 : -1;

    if (key === 'category name') key = 'catID';

    if (key === 'address') {
      return [...value].sort((a, b) => {
        const dataA = String(a.address.country).toLowerCase();
        const dataB = String(b.address.country).toLowerCase();
        return direction * dataA.localeCompare(dataB);
      });
    }

    return [...value].sort((a, b) => {
      if (typeof a[key] === 'number' && typeof b[key] === 'number') {
        return direction * (a[key] - b[key]);
      }
      const dataA = String(a[key]).toLowerCase();
      const dataB = String(b[key]).toLowerCase();
      return direction * dataA.localeCompare(dataB);
    });
  }
}
