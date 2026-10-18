import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'conditionIndicator',
  standalone: true
})
export class ConditionIndicatorPipe implements PipeTransform {
  transform(rating: string | null | undefined, format: 'text' | 'class' | 'icon' = 'text'): string {
    const r = (rating || '').toLowerCase();

    if (format === 'class') {
      switch (r) {
        case 'excellent': return 'badge-success';
        case 'good': return 'badge-info';
        case 'fair': return 'badge-warning';
        case 'poor': return 'badge-orange';
        case 'critical': return 'badge-danger';
        default: return 'badge-secondary';
      }
    }

    if (format === 'icon') {
      switch (r) {
        case 'excellent': return '🟢';
        case 'good': return '🔵';
        case 'fair': return '🟡';
        case 'poor': return '🟠';
        case 'critical': return '🔴';
        default: return '⚪';
      }
    }

    switch (r) {
      case 'excellent': return 'Excellent Condition';
      case 'good': return 'Good Condition';
      case 'fair': return 'Fair Condition (Monitoring)';
      case 'poor': return 'Poor Condition (Action Needed)';
      case 'critical': return 'Critical Hazard Level';
      default: return 'Unrated';
    }
  }
}
