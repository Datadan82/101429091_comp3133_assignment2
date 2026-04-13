import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'salary' })
export class SalaryPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) return '—';
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 0
    }).format(value);
  }
}
