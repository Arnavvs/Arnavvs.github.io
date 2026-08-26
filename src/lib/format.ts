/** Formatting helpers shared by build-time rendering and the runtime refresh. */

/** GitHub's own language colours, for the languages we actually use. */
export const LANG_COLORS: Record<string, string> = {
  Python: '#3572A5',
  'Jupyter Notebook': '#DA5B0B',
  TypeScript: '#3178C6',
  JavaScript: '#F1E05A',
  HTML: '#E34C26',
  CSS: '#563D7C',
  'C++': '#F34B7D',
  C: '#555555',
  Shell: '#89E051',
  Dockerfile: '#384D54',
  Batchfile: '#C1F12E',
  Procfile: '#A0A0A0',
  ABAP: '#E8274B',
  Go: '#00ADD8',
  Rust: '#DEA584',
  Java: '#B07219',
  SQL: '#E38C00',
};

export function langColor(lang: string | null | undefined): string {
  if (!lang) return '#5a7175';
  return LANG_COLORS[lang] ?? '#7d8f93';
}

/**
 * "3 hours ago", "2 days ago", "Aug 2025".
 * Switches to an absolute month once something is older than ~2 months, since
 * "417 days ago" tells you nothing useful.
 */
export function relativeTime(iso: string, now: number = Date.now()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';

  const secs = Math.floor((now - then) / 1000);
  if (secs < 45) return 'just now';

  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

  const days = Math.floor(hours / 24);
  if (days < 60) return `${days} day${days === 1 ? '' : 's'} ago`;

  return new Date(then).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

/** Machine-readable timestamp for <time datetime="…">. */
export function isoDate(iso: string): string {
  return iso.slice(0, 10);
}

/** GitHub event type -> a verb a human would use. */
export function eventVerb(type: string): string {
  switch (type) {
    case 'PushEvent':
      return 'pushed to';
    case 'CreateEvent':
      return 'created';
    case 'DeleteEvent':
      return 'cleaned up';
    case 'PublicEvent':
      return 'open-sourced';
    case 'WatchEvent':
      return 'starred';
    case 'ForkEvent':
      return 'forked';
    case 'PullRequestEvent':
      return 'opened a PR on';
    case 'IssuesEvent':
      return 'filed an issue on';
    case 'IssueCommentEvent':
      return 'commented on';
    case 'ReleaseEvent':
      return 'released';
    default:
      return 'worked on';
  }
}

/** A single glyph per event type — cheaper than icons, fits the terminal. */
export function eventGlyph(type: string): string {
  switch (type) {
    case 'PushEvent':
      return '↑';
    case 'CreateEvent':
      return '+';
    case 'DeleteEvent':
      return '−';
    case 'PublicEvent':
      return '◆';
    case 'WatchEvent':
      return '★';
    case 'ForkEvent':
      return '⑂';
    case 'PullRequestEvent':
      return '⇄';
    case 'ReleaseEvent':
      return '⬈';
    default:
      return '•';
  }
}

/**
 * Top N languages by byte share, as percentages.
 *
 * Anything that rounds to 0.0% is dropped rather than rendered as "0%" — a
 * zero-width bar segment with a label is worse than no entry at all.
 */
export function languageShare(
  languages: Record<string, number>,
  limit = 6,
): Array<{ name: string; pct: number; bytes: number }> {
  const total = Object.values(languages).reduce((a, b) => a + b, 0);
  if (!total) return [];

  return Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, bytes]) => ({
      name,
      bytes,
      pct: Math.round((bytes / total) * 1000) / 10,
    }))
    .filter((l) => l.pct >= 0.1);
}
