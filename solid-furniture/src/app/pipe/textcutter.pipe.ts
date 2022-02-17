import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textcutter'
})
export class TextcutterPipe implements PipeTransform {

  transform(text: string | null, prefix: number): string | null {
    if (!prefix || prefix === 0) return text;
    if (typeof(text) != 'string') return text;
    if (String(text).length < prefix) return text;

    return `${String(text).slice(0, prefix).split(' ').slice(0,-1).join(' ')}...`;

  }

}
