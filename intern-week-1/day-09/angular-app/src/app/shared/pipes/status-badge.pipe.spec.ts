import { StatusBadgePipe } from './status-badge.pipe';

describe('StatusBadgePipe', () => {
  const pipe = new StatusBadgePipe();

  it('transforms operational, passed, resolved status values to title-cased labels', () => {
    expect(pipe.transform('operational')).toBe('Operational');
    expect(pipe.transform('passed')).toBe('Passed');
    expect(pipe.transform('resolved')).toBe('Resolved');
    expect(pipe.transform('open')).toBe('Open');
  });

  it('transforms snake_case values to spaced human-readable titles', () => {
    expect(pipe.transform('under_maintenance')).toBe('Under Maintenance');
    expect(pipe.transform('conditional_pass')).toBe('Conditional Pass');
    expect(pipe.transform('critical_failure')).toBe('Critical Failure');
    expect(pipe.transform('in_progress')).toBe('In Progress');
  });

  it('transforms failed, decommissioned, closed, and rejected statuses properly', () => {
    expect(pipe.transform('failed')).toBe('Failed');
    expect(pipe.transform('decommissioned')).toBe('Decommissioned');
    expect(pipe.transform('closed')).toBe('Closed');
    expect(pipe.transform('rejected')).toBe('Rejected');
  });

  it('returns Unknown for null, undefined, or empty values', () => {
    expect(pipe.transform('')).toBe('Unknown');
    expect(pipe.transform(null)).toBe('Unknown');
    expect(pipe.transform(undefined)).toBe('Unknown');
  });
});
