import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'creneau'
})
export class CreneauPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
