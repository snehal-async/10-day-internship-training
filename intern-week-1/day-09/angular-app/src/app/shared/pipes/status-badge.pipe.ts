import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusBadge',
  standalone: true
})
export class StatusBadgePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return 'Unknown';

    switch (value.toLowerCase()) {
      case 'operational':
        return 'Operational';
      case 'under_maintenance':
        return 'Under Maintenance';
      case 'decommissioned':
        return 'Decommissioned';
      case 'closed':
        return 'Closed';
      case 'passed':
        return 'Passed';
      case 'conditional_pass':
        return 'Conditional Pass';
      case 'failed':
        return 'Failed';
      case 'critical_failure':
        return 'Critical Failure';
      case 'in_progress':
        return 'In Progress';
      case 'resolved':
        return 'Resolved';
      case 'open':
        return 'Open';
      case 'rejected':
        return 'Rejected';
      default:
        return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  }
}
