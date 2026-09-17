import { priorityTint, statusTint, timeAgo } from './ticket.model';

describe('ticket model helpers', () => {
  it('maps status and priority to the reference tints', () => {
    expect(statusTint('Open')).toBe('blue');
    expect(statusTint('Pending')).toBe('amber');
    expect(statusTint('Closed')).toBe('neutral');

    expect(priorityTint('High')).toBe('red');
    expect(priorityTint('Medium')).toBe('amber');
    expect(priorityTint('Low')).toBe('neutral');
  });

  describe('timeAgo', () => {
    const now = new Date('2026-09-15T12:00:00Z').getTime();
    const ago = (ms: number) => new Date(now - ms).toISOString();
    const MINUTE = 60_000;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;

    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(now);
    });
    afterEach(() => vi.useRealTimers());

    it('walks through the buckets the reference column shows', () => {
      expect(timeAgo(ago(10_000))).toBe('Just now');
      expect(timeAgo(ago(5 * MINUTE))).toBe('5 min ago');
      expect(timeAgo(ago(1 * HOUR))).toBe('1 hour ago');
      expect(timeAgo(ago(3 * HOUR))).toBe('3 hours ago');
      expect(timeAgo(ago(1 * DAY))).toBe('Yesterday');
      expect(timeAgo(ago(6 * DAY))).toBe('6 days ago');
    });

    it('falls back to a date after a month', () => {
      expect(timeAgo(ago(45 * DAY))).toBe(new Date(now - 45 * DAY).toLocaleDateString());
    });

    it('never goes negative for a timestamp slightly in the future (clock skew)', () => {
      expect(timeAgo(new Date(now + 30_000).toISOString())).toBe('Just now');
    });
  });
});
