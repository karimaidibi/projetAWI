import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jeu'
})
export class JeuPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
