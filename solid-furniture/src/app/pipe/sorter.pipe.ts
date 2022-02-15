import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sorter'
})
export class SorterPipe implements PipeTransform {

  transform(value: any, key: string, sortDirection: string = 'A...Z'): any[] {
    if (!Array.isArray(value) || !key) return value;
    if (!['A...Z', 'Z...A'].includes(sortDirection)) return value;
    if (!sortDirection) sortDirection = 'A...Z';

    const direction = (sortDirection === 'A...Z') ? 1 : -1;

    return value.sort((a, b) => {
      if (typeof (a[key]) === 'number' && typeof (b[key]) === 'number') {
        return  direction * ( a[key] - b[key] );
      }
      const dataA = String(a[key]).toLowerCase();
      const dataB = String(b[key]).toLowerCase();
      return direction * dataA.localeCompare(dataB);
    });

  }

  /*  transform(value: any[], key: string, sortDirection: string = 'A...Z'): any[] {
      if (!Array.isArray(value) || !key) return value;
      if (!['A...Z', 'Z...A'].includes(sortDirection)) return value;
      if (!sortDirection) sortDirection = 'A...Z';

      const direction = (sortDirection === 'A...Z') ? 1 : -1;

      return value.sort((a, b) => {
        if (typeof (a[key]) === 'number' && typeof (b[key]) === 'number') {
          return  direction * ( a[key] - b[key] );
        }
        const dataA = String(a[key]).toLowerCase();
        const dataB = String(b[key]).toLowerCase();
        return direction * dataA.localeCompare(dataB);
      });

    }*/

    //ninja
  /*
    transform(
      items: [],
      direction: string,
      column: string,
      type: string | number
    ) {
      if (!items) return;
      let sortedItems = [];
      sortedItems =
        direction === 'asc'
          ? this.sortAscending(items, column, type)
          : this.sortDescending(items, column, type);
      return sortedItems;
    }

    sortAscending(items: any, column: any, type: any) {
      return [
        ...items.sort((a: any, b: any) => {
          if (type === 'string') {
            if (a[column].toUpperCase() < b[column].toUpperCase()) return -1;
            if (a[column].toUpperCase() > b[column].toUpperCase()) return 1;
            return 0;
          } else {
            return a[column] - b[column];
          }
        }),
      ];
    }

    sortDescending(items: any, column: any, type: any) {
      return [
        ...items.sort((a: any, b: any) => {
          if (type === 'string') {
            if (a[column].toUpperCase() > b[column].toUpperCase()) return -1;
            if (a[column].toUpperCase() < b[column].toUpperCase()) return 1;
            return 0;
          } else {
            return b[column] - a[column];
          }
        }),
      ];
    }*/

    //7-es
/*
    transform(list: any[], key: string, sortDirection: string = 'A...Z'): any[] {
    // console.log(`sortPIPE, key = ${key}, sortDirection = ${sortDirection}, list = ${JSON.stringify(list)}`)
      if (!Array.isArray(list) || !key) return list;
      if (!['A...Z', 'Z...A'].includes(sortDirection)) return list;
      if (!sortDirection) sortDirection = 'A...Z';

      const direction = (sortDirection === 'A...Z') ? 1 : -1;

      return list.sort((a, b) => {
        if (typeof (a[key]) === 'number' && typeof (b[key]) === 'number') {
          return  direction * ( a[key] - b[key] );
        }
        const dataA = String(a[key]).toLowerCase();
        const dataB = String(b[key]).toLowerCase();
        return direction * dataA.localeCompare(dataB);
      });
  }
*/

  //10-es
  /*
    transform(value: any[] | null, key: string, direction: number = 1): any[] | null {
    if (!Array.isArray(value) || !key) {
      return value;
    }

    return value.sort( (a, b) => {
      if (typeof a[key] === 'number' && typeof b[key] === 'number') {
        return (a[key] - b[key]) * direction;
      } else {
        return (
          ('' + a[key])
            .toLowerCase()
            .localeCompare(
              ('' + b[key]).toLowerCase()
            )
          ) * direction;
      }
    });
  }
  */

  //8-as
  /*
  transform(value: T[], key: string, desc: boolean = false): T[] {
    if (Array.isArray(value) !== true || typeof key !== "string") {
      return value;
    }

    return value.sort((a, b) => {
      let comparableA: any = a[key];
      let comparableB: any = b[key];

      if (typeof comparableA === 'boolean' && typeof comparableB === 'boolean') {
        // https://stackoverflow.com/a/66000126/4883952
        comparableA = comparableA ? 1 : 0;
        comparableB = comparableB ? 1 : 0;
      }
      // Hogyha fordított sorrend kell, akkor felcseréljük a paraméterek sorrendejét az összehasonlításnál
      if (desc) {
        [comparableA, comparableB] = [comparableB, comparableA];
      }

      if (typeof comparableA === 'number' && typeof comparableB === 'number') {
        return comparableA - comparableB;
      }
      return String(comparableA).toLocaleLowerCase().localeCompare(String(comparableB).toLocaleLowerCase());
    });
  }
  */

}
