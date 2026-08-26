/**
 * GitHub data layer.
 *
 * Runs at BUILD time so the deployed HTML already contains real data (fast
 * first paint, works with JS off, good for SEO). The browser then re-fetches
 * the same endpoints on load and patches the DOM, so the page stays current
 * between deploys — see src/scripts/live.ts.
 *
 * Every network call degrades gracefully: if GitHub is down or the
 * unauthenticated rate limit (60/hr/IP) is exhausted, we fall back to the
 * committed snapshot in src/data/github-snapshot.json and the build succeeds.
 */

export const GITHUB_USER = 'Arnavvs';

/** Repos that exist for plumbing reasons and shouldn't appear as work. */
export const HIDDEN_REPOS = new Set([
  'Arnavvs', // GitHub profile config repo
  'register', // fork of is-a.dev
  'abcdefgh',
  'av910LLMp1',
]);

export interface Repo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  size: number;
  topics: string[];
  fork: boolean;
  archived: boolean;
  pushed_at: string;
  created_at: string;
}

export interface UserProfile {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  created_at: string;
}

export interface ActivityEvent {
  type: string;
  repo: string;
  created_at: string;
  /** Commit count for PushEvent, action verb for issues/PRs, else null. */
  detail: string | null;
}

export interface GitHubData {
  user: UserProfile;
  repos: Repo[];
  events: ActivityEvent[];
  /** Language name -> total bytes across all non-hidden repos. */
  languages: Record<string, number>;
  fetchedAt: string;
  /** False when we served the committed snapshot instead of live data. */
  live: boolean;
}

const API = 'https://api.github.com';

function headers(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'arnavvs-portfolio-build',
  };
  // Optional. Raises the rate limit from 60/hr to 5000/hr — set it in CI.
  const token = process.env.GITHUB_TOKEN;
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { headers: headers() });
  if (!res.ok) {
    throw new Error(`GitHub ${path} -> ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

function normalizeRepo(r: any): Repo {
  return {
    name: r.name,
    description: r.description ?? null,
    html_url: r.html_url,
    homepage: r.homepage || null,
    language: r.language ?? null,
    stargazers_count: r.stargazers_count ?? 0,
    forks_count: r.forks_count ?? 0,
    size: r.size ?? 0,
    topics: r.topics ?? [],
    fork: Boolean(r.fork),
    archived: Boolean(r.archived),
    pushed_at: r.pushed_at,
    created_at: r.created_at,
  };
}

function normalizeEvent(e: any): ActivityEvent {
  let detail: string | null = null;
  if (e.type === 'PushEvent') {
    // These three disagree often enough to be worth taking the max: `size` is
    // 0 on force-pushes, and `commits` is capped at 20 and sometimes empty.
    const n = Math.max(
      e.payload?.size ?? 0,
      e.payload?.distinct_size ?? 0,
      e.payload?.commits?.length ?? 0,
    );
    // "0 commits" is noise, not information.
    detail = n > 0 ? `${n} commit${n === 1 ? '' : 's'}` : null;
  } else if (e.payload?.action) {
    detail = e.payload.action;
  }
  return {
    type: e.type,
    repo: String(e.repo?.name ?? '').replace(`${GITHUB_USER}/`, ''),
    created_at: e.created_at,
    detail,
  };
}

/**
 * Byte counts per language, summed across repos.
 *
 * A repo whose /languages call fails is SKIPPED, not estimated. Substituting
 * `repo.size` looks like a graceful fallback but is not comparable data —
 * repo.size counts every file in the repo (notebooks' embedded outputs,
 * checkpoints, assets), so mixing it with real byte counts silently rewrites
 * the chart. An incomplete-but-honest chart beats a complete-but-wrong one.
 *
 * If too many calls fail the whole aggregate is untrustworthy, so we throw and
 * let the caller fall back to the snapshot, which is at least self-consistent.
 */
async function fetchLanguages(repos: Repo[]): Promise<Record<string, number>> {
  const totals: Record<string, number> = {};
  const queue = [...repos];
  const CONCURRENCY = 6;
  let failed = 0;

  async function worker() {
    while (queue.length) {
      const repo = queue.shift();
      if (!repo) return;
      try {
        const langs = await api<Record<string, number>>(
          `/repos/${GITHUB_USER}/${repo.name}/languages`,
        );
        for (const [lang, bytes] of Object.entries(langs)) {
          totals[lang] = (totals[lang] ?? 0) + bytes;
        }
      } catch {
        failed += 1;
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  if (failed > repos.length / 4) {
    throw new Error(
      `language stats unreliable: ${failed}/${repos.length} repos failed ` +
        `(set GITHUB_TOKEN to raise the rate limit)`,
    );
  }
  if (failed > 0) {
    console.warn(`[github] language stats: skipped ${failed} repo(s) that failed to fetch`);
  }

  return totals;
}

/** Live fetch. Throws if the core profile/repo calls fail. */
export async function fetchGitHubData(): Promise<GitHubData> {
  const [rawUser, rawRepos] = await Promise.all([
    api<any>(`/users/${GITHUB_USER}`),
    api<any[]>(`/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`),
  ]);

  const repos = rawRepos
    .map(normalizeRepo)
    .filter((r) => !r.fork && !HIDDEN_REPOS.has(r.name))
    .sort((a, b) => b.pushed_at.localeCompare(a.pushed_at));

  // Activity is a nice-to-have; never fail the build over it.
  let events: ActivityEvent[] = [];
  try {
    const rawEvents = await api<any[]>(
      `/users/${GITHUB_USER}/events/public?per_page=30`,
    );
    events = rawEvents
      .map(normalizeEvent)
      .filter((e) => e.repo && !HIDDEN_REPOS.has(e.repo))
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 12);
  } catch {
    events = [];
  }

  const languages = await fetchLanguages(repos);

  return {
    user: {
      login: rawUser.login,
      name: rawUser.name ?? null,
      bio: rawUser.bio ?? null,
      avatar_url: rawUser.avatar_url,
      html_url: rawUser.html_url,
      public_repos: rawUser.public_repos ?? repos.length,
      followers: rawUser.followers ?? 0,
      created_at: rawUser.created_at,
    },
    repos,
    events,
    languages,
    fetchedAt: new Date().toISOString(),
    live: true,
  };
}

/**
 * What pages call. Tries the network, falls back to the committed snapshot.
 * Result is memoized so N components don't trigger N builds' worth of calls.
 */
let cached: Promise<GitHubData> | null = null;

export function getGitHubData(): Promise<GitHubData> {
  if (cached) return cached;
  cached = (async () => {
    try {
      const data = await fetchGitHubData();
      console.log(
        `[github] live data: ${data.repos.length} repos, ${data.events.length} events`,
      );
      return data;
    } catch (err) {
      console.warn(
        `[github] live fetch failed (${(err as Error).message}) — using committed snapshot`,
      );
      const snapshot = (await import('../data/github-snapshot.json')).default;
      return { ...(snapshot as unknown as GitHubData), live: false };
    }
  })();
  return cached;
}
