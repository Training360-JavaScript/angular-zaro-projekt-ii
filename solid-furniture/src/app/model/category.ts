export class Category {

  [key: string]: any;
  id: number = 0;
  name: string = '';
  description: string = '';

  constructor(options?: Category) {
    if (!options) return;
    for (const key of Object.keys(options)) {
      this[key] = options[key];
    }
  }

}
