import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'interestFormat'
})
export class InterestFormatPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;
    return value
      .toLowerCase()
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

}
