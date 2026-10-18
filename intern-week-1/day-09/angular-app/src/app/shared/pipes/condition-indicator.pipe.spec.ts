import { ConditionIndicatorPipe } from './condition-indicator.pipe';

describe('ConditionIndicatorPipe', () => {
  const pipe = new ConditionIndicatorPipe();

  it('transforms condition ratings to descriptive text by default', () => {
    expect(pipe.transform('excellent')).toBe('Excellent Condition');
    expect(pipe.transform('good')).toBe('Good Condition');
    expect(pipe.transform('fair')).toBe('Fair Condition (Monitoring)');
    expect(pipe.transform('poor')).toBe('Poor Condition (Action Needed)');
    expect(pipe.transform('critical')).toBe('Critical Hazard Level');
  });

  it('transforms condition ratings to CSS badge classes when format is class', () => {
    expect(pipe.transform('excellent', 'class')).toBe('badge-success');
    expect(pipe.transform('good', 'class')).toBe('badge-info');
    expect(pipe.transform('fair', 'class')).toBe('badge-warning');
    expect(pipe.transform('poor', 'class')).toBe('badge-orange');
    expect(pipe.transform('critical', 'class')).toBe('badge-danger');
    expect(pipe.transform('other', 'class')).toBe('badge-secondary');
  });

  it('transforms condition ratings to visual status emojis when format is icon', () => {
    expect(pipe.transform('excellent', 'icon')).toBe('🟢');
    expect(pipe.transform('critical', 'icon')).toBe('🔴');
    expect(pipe.transform('unknown', 'icon')).toBe('⚪');
  });

  it('handles null, undefined or empty input gracefully with Unrated', () => {
    expect(pipe.transform('')).toBe('Unrated');
    expect(pipe.transform(null)).toBe('Unrated');
    expect(pipe.transform(undefined)).toBe('Unrated');
  });
});
