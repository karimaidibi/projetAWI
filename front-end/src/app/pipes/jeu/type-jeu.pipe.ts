import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeJeu'
})
export class TypeJeuPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
