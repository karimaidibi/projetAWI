import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nomJeu'
})
export class NomJeuPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
