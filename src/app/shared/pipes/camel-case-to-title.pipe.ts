import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelCaseToTitle',
})
export class CamelCaseToTitlePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capital letters.
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter.
  }
}
