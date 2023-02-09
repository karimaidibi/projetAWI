import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zone'
})
export class ZonePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
