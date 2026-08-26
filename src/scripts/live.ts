/**
 * Everything the page does after it loads.
 *
 *   1. nav scroll state
 *   2. scroll-reveal
 *   3. relative timestamps, re-ticked every minute
 *   4. repo search + language filter
 *   5. a live refetch of the GitHub API, so the page reflects the last few
 *      minutes rather than the last deploy
 *
 * Each block is independent and wrapped so one failure can't take out the
 * others — a portfolio that renders is worth more than one that is clever.
 */

import { relativeTime, langColor, eventGlyph, eventVerb } from '../lib/format';

const GITHUB_USER = 'Arnavvs';
const HIDDEN = new Set(['Arnavvs', 'register', 'abcdefgh', 'av910LLMp1']);

/* ============================================================ 1. nav state */

function initNav(): void {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (!nav) return;

  const sync = () => {
    if (window.scrollY > 12) nav.setAttribute('data-scrolled', '');
    else nav.removeAttribute('data-scrolled');
  };

  sync();
  window.addEventListener('scroll', sync, { passive: true });
}

/* ========================================================== 2. reveal */

function initReveal(): void {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  // No IntersectionObserver (or reduced motion) => just show everything.
  if (
    !('IntersectionObserver' in window) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    targets.forEach((t) => t.classList.add('is-visible'));
    return;
  }

  let revealed = 0;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        revealed += 1;
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  );

  targets.forEach((t) => io.observe(t));

  /**
   * Failsafe. Everything here starts at opacity 0, so if the observer never
   * fires the whole page renders blank — a far worse outcome than losing an
   * animation. On a healthy page the above-the-fold targets reveal within a
   * frame or two, so "nothing at all after 2s" is a reliable signal that
   * IntersectionObserver isn't working, and we just show everything.
   */
  window.setTimeout(() => {
    if (revealed > 0) return;
    targets.forEach((t) => t.classList.add('is-visible'));
  }, 2000);
}

/* ================================================== 3. relative timestamps */

/** Re-renders every [data-relative] so "2 minutes ago" doesn't go stale. */
function tickTimes(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-relative]').forEach((el) => {
    const iso = el.dataset.relative;
    if (!iso) return;
    const next = relativeTime(iso);
    if (next && el.textContent !== next) el.textContent = next;
  });
}

function initTimes(): void {
  tickTimes();
  window.setInterval(() => tickTimes(), 60_000);
}

/* ================================================== 3b. cycling hero role */

/**
 * Types the hero role in and out, cycling through site.roles.
 *
 * Uses setTimeout rather than requestAnimationFrame on purpose: rAF is
 * throttled to nothing in a backgrounded tab, which would freeze the caret
 * mid-word and leave a half-typed title on screen.
 */
function initRoleCycle(): void {
  const el = document.querySelector<HTMLElement>('[data-roles]');
  if (!el) return;

  let roles: string[] = [];
  try {
    roles = JSON.parse(el.dataset.roles ?? '[]');
  } catch {
    return;
  }
  if (roles.length < 2) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Hold the widest role's width so the rest of the line never reflows.
  const measure = document.createElement('span');
  measure.style.cssText =
    'position:absolute;visibility:hidden;white-space:pre;font:inherit;letter-spacing:inherit';
  el.appendChild(measure);
  let widest = 0;
  for (const role of roles) {
    measure.textContent = role;
    widest = Math.max(widest, measure.getBoundingClientRect().width);
  }
  measure.remove();
  if (widest) el.style.minWidth = `${Math.ceil(widest)}px`;

  let index = 0;
  // The first role is already on screen in full, so the cycle starts by
  // deleting it. Starting in typing mode instead would step chars past the
  // word's length and the "finished typing" check would never match.
  let chars = roles[0].length;
  let deleting = true;

  function tick(): void {
    const role = roles[index];
    chars = Math.max(0, Math.min(role.length, chars + (deleting ? -1 : 1)));
    el!.textContent = role.slice(0, chars);

    let delay = deleting ? 35 : 70;

    if (!deleting && chars >= role.length) {
      deleting = true;
      delay = 2200; // read-time pause on the complete word
    } else if (deleting && chars <= 0) {
      deleting = false;
      index = (index + 1) % roles.length;
      delay = 300;
    }

    window.setTimeout(tick, delay);
  }

  // Let the first (server-rendered) role sit long enough to be read.
  window.setTimeout(tick, 2600);
}

/* ===================================================== 4. repo filtering */

function initRepoFilter(): void {
  const list = document.querySelector<HTMLElement>('[data-repo-list]');
  if (!list) return;

  const search = document.querySelector<HTMLInputElement>('[data-repo-search]');
  const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-repo-filter]')];
  const empty = document.querySelector<HTMLElement>('[data-repo-empty]');
  const count = document.querySelector<HTMLElement>('[data-repo-count]');

  let activeLang = 'all';
  let query = '';

  function apply(): void {
    const items = list!.querySelectorAll<HTMLElement>('[data-repo-item]');
    let shown = 0;

    items.forEach((item) => {
      const langOk = activeLang === 'all' || item.dataset.lang === activeLang;
      const textOk = !query || (item.dataset.search ?? '').includes(query);
      const visible = langOk && textOk;
      item.hidden = !visible;
      if (visible) shown += 1;
    });

    if (empty) empty.hidden = shown > 0;
    if (count) {
      count.textContent =
        shown === items.length ? `${items.length} repos` : `${shown} / ${items.length} repos`;
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      activeLang = btn.dataset.repoFilter ?? 'all';
      buttons.forEach((b) => b.classList.toggle('is-active', b === btn));
      apply();
    });
  });

  if (search) {
    let timer: number | undefined;
    search.addEventListener('input', () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        query = search.value.trim().toLowerCase();
        apply();
      }, 90);
    });
  }

  // Exposed so the live refresh can re-apply filters after inserting rows.
  (window as any).__applyRepoFilter = apply;
}

/* ======================================================= 5. live refresh */

interface LiveRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  archived: boolean;
  fork: boolean;
  pushed_at: string;
}

interface LiveEvent {
  type: string;
  repo: { name: string };
  payload?: {
    commits?: unknown[];
    size?: number;
    distinct_size?: number;
    action?: string;
  };
  created_at: string;
}

const CACHE_KEY = 'gh-live-v1';
const CACHE_TTL = 5 * 60 * 1000;

async function fetchLive(): Promise<{ repos: LiveRepo[]; events: LiveEvent[] } | null> {
  // Session cache keeps us well inside GitHub's 60-req/hr unauthenticated
  // budget when someone clicks around the site.
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (raw) {
      const cached = JSON.parse(raw);
      if (Date.now() - cached.at < CACHE_TTL) return cached.payload;
    }
  } catch {
    /* storage disabled — just fetch */
  }

  try {
    const [repoRes, eventRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`),
      fetch(`https://api.github.com/users/${GITHUB_USER}/events/public?per_page=30`),
    ]);

    if (!repoRes.ok) return null;

    const repos = (await repoRes.json()) as LiveRepo[];
    const events = eventRes.ok ? ((await eventRes.json()) as LiveEvent[]) : [];
    const payload = { repos, events };

    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), payload }));
    } catch {
      /* ignore */
    }

    return payload;
  } catch {
    return null;
  }
}

function markLive(isLive: boolean): void {
  const state = isLive ? 'live' : 'cached';

  document.querySelectorAll<HTMLElement>('[data-live-badge]').forEach((el) => {
    el.dataset.state = state;
    const label = el.querySelector('[data-live-label]');
    if (label) label.textContent = state;
  });

  document.querySelectorAll<HTMLElement>('[data-sync-status]').forEach((el) => {
    el.dataset.state = state;
    const label = el.querySelector('[data-sync-label]');
    if (label) {
      label.textContent = isLive ? 'synced just now' : 'serving cached snapshot';
    }
  });
}

/** Builds a row for a repo that appeared on GitHub after the last deploy. */
function buildRepoRow(repo: LiveRepo): HTMLLIElement {
  const li = document.createElement('li');
  li.className = 'repo';
  li.setAttribute('data-repo-item', '');
  li.dataset.lang = repo.language ?? '';
  li.dataset.search = `${repo.name} ${repo.description ?? ''}`.toLowerCase();
  li.classList.add('is-visible');

  const blurb = repo.description
    ? `<span class="repo__blurb">${escapeHtml(repo.description)}</span>`
    : '';
  const stars =
    repo.stargazers_count > 0 ? `<span class="repo__stars">★ ${repo.stargazers_count}</span>` : '';

  li.innerHTML = `
    <a class="repo__link" href="${repo.html_url}" target="_blank" rel="noopener">
      <span class="repo__lang"><span class="dot" style="--dot:${langColor(repo.language)}"></span></span>
      <span class="repo__main">
        <span class="repo__name-row">
          <span class="repo__name mono">${escapeHtml(repo.name)}</span>
          <span class="repo__badge mono">new</span>
        </span>
        ${blurb}
      </span>
      <span class="repo__meta mono">
        ${repo.language ? `<span class="repo__meta-lang">${escapeHtml(repo.language)}</span>` : ''}
        ${stars}
        <span class="repo__time" data-relative="${repo.pushed_at}">${relativeTime(repo.pushed_at)}</span>
      </span>
    </a>`;

  return li;
}

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c,
  );
}

function syncRepos(repos: LiveRepo[]): void {
  const list = document.querySelector<HTMLElement>('[data-repo-list]');
  if (!list) return;

  const visible = repos
    .filter((r) => !r.fork && !HIDDEN.has(r.name))
    .sort((a, b) => b.pushed_at.localeCompare(a.pushed_at));

  const existing = new Map<string, HTMLElement>();
  list.querySelectorAll<HTMLElement>('[data-repo-item]').forEach((el) => {
    const name = el.querySelector('.repo__name')?.textContent?.trim();
    if (name) existing.set(name, el);
  });

  for (const repo of visible) {
    const row = existing.get(repo.name);

    if (!row) {
      // Brand new repo — it goes in immediately, in pushed order.
      list.appendChild(buildRepoRow(repo));
      continue;
    }

    const time = row.querySelector<HTMLElement>('[data-relative]');
    if (time) {
      time.dataset.relative = repo.pushed_at;
      time.textContent = relativeTime(repo.pushed_at);
    }

    const stars = row.querySelector<HTMLElement>('.repo__stars');
    if (repo.stargazers_count > 0) {
      if (stars) stars.textContent = `★ ${repo.stargazers_count}`;
      else {
        const el = document.createElement('span');
        el.className = 'repo__stars';
        el.textContent = `★ ${repo.stargazers_count}`;
        row.querySelector('.repo__meta')?.insertBefore(el, time);
      }
    } else if (stars) {
      stars.remove();
    }
  }

  // Re-order to match GitHub's current pushed ordering.
  const order = new Map(visible.map((r, i) => [r.name, i]));
  [...list.querySelectorAll<HTMLElement>('[data-repo-item]')]
    .sort((a, b) => {
      const an = a.querySelector('.repo__name')?.textContent?.trim() ?? '';
      const bn = b.querySelector('.repo__name')?.textContent?.trim() ?? '';
      return (order.get(an) ?? 999) - (order.get(bn) ?? 999);
    })
    .forEach((el) => list.appendChild(el));

  // Featured cards carry their own star counters.
  document.querySelectorAll<HTMLElement>('[data-repo-stars]').forEach((el) => {
    const repo = visible.find((r) => r.name === el.dataset.repoStars);
    if (repo) el.textContent = `★ ${repo.stargazers_count}`;
  });

  const count = document.querySelector<HTMLElement>('[data-repo-count]');
  if (count && !count.textContent?.includes('/')) count.textContent = `${visible.length} repos`;

  const reposStat = document.querySelector<HTMLElement>('[data-stat="repos"]');
  if (reposStat) reposStat.textContent = String(visible.length);

  const pushStat = document.querySelector<HTMLElement>('[data-stat="push"]');
  if (pushStat && visible[0]) {
    pushStat.dataset.relative = visible[0].pushed_at;
    pushStat.textContent = relativeTime(visible[0].pushed_at);
  }

  (window as any).__applyRepoFilter?.();
}

function eventDetail(e: LiveEvent): string | null {
  if (e.type === 'PushEvent') {
    // Mirrors normalizeEvent in lib/github.ts — see the note there.
    const n = Math.max(
      e.payload?.size ?? 0,
      e.payload?.distinct_size ?? 0,
      e.payload?.commits?.length ?? 0,
    );
    return n > 0 ? `${n} commit${n === 1 ? '' : 's'}` : null;
  }
  return e.payload?.action ?? null;
}

function syncActivity(events: LiveEvent[]): void {
  const clean = events
    .map((e) => ({
      type: e.type,
      repo: String(e.repo?.name ?? '').replace(`${GITHUB_USER}/`, ''),
      created_at: e.created_at,
      detail: eventDetail(e),
    }))
    .filter((e) => e.repo && !HIDDEN.has(e.repo))
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  if (!clean.length) return;

  const list = document.querySelector<HTMLElement>('[data-activity-list]');
  if (list) {
    list.innerHTML = clean
      .slice(0, 8)
      .map(
        (e) => `
      <li class="act__item">
        <span class="act__rail" aria-hidden="true"><span class="act__glyph">${eventGlyph(e.type)}</span></span>
        <div class="act__body">
          <p class="act__text">
            ${eventVerb(e.type)}
            <a class="act__repo mono link-underline" href="https://github.com/${GITHUB_USER}/${encodeURIComponent(e.repo)}" target="_blank" rel="noopener">${escapeHtml(e.repo)}</a>
            ${e.detail ? `<span class="act__detail mono"> · ${escapeHtml(e.detail)}</span>` : ''}
          </p>
          <time class="act__time mono" datetime="${e.created_at.slice(0, 10)}" data-relative="${e.created_at}">${relativeTime(e.created_at)}</time>
        </div>
      </li>`,
      )
      .join('');
  }

  const hero = document.querySelector<HTMLElement>('[data-hero-events]');
  if (hero) {
    hero.innerHTML = clean
      .slice(0, 4)
      .map(
        (e) => `
      <li class="term__event">
        <span class="term__glyph">${eventGlyph(e.type)}</span>
        <span class="term__event-text">${eventVerb(e.type)} <b>${escapeHtml(e.repo)}</b>${e.detail ? `<i> · ${escapeHtml(e.detail)}</i>` : ''}</span>
        <span class="term__event-time" data-relative="${e.created_at}">${relativeTime(e.created_at)}</span>
      </li>`,
      )
      .join('');
  }

  const status = document.querySelector<HTMLElement>('[data-activity-status]');
  if (status) status.textContent = 'live';
}

async function initLiveData(): Promise<void> {
  const payload = await fetchLive();

  if (!payload) {
    // Rate-limited or offline. The build-time data is already on screen and
    // stays there; we only correct the badge so it doesn't overclaim.
    markLive(false);
    const status = document.querySelector<HTMLElement>('[data-activity-status]');
    if (status) status.textContent = 'cached';
    return;
  }

  try {
    syncRepos(payload.repos);
    syncActivity(payload.events);
    markLive(true);
  } catch {
    markLive(false);
  }
}

/* ================================================================== boot */

function boot(): void {
  const safely = (fn: () => void) => {
    try {
      fn();
    } catch (err) {
      console.warn('[portfolio]', err);
    }
  };

  safely(initNav);
  safely(initReveal);
  safely(initTimes);
  safely(initRoleCycle);
  safely(initRepoFilter);
  void initLiveData();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
