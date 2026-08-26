/**
 * A small shell that runs against the site's own data.
 *
 * Not a real terminal and not pretending to be — it's a fast way for someone
 * who thinks in commands to get at the same information the page shows, plus a
 * reward for anyone curious enough to press Ctrl+K.
 */

import { relativeTime } from '../lib/format';

interface TermRepo {
  name: string;
  title: string;
  blurb: string;
  lang: string | null;
  url: string;
  pushed: string;
}

interface TermData {
  user: string;
  role: string;
  location: string;
  email: string;
  links: Record<string, string>;
  available: string | null;
  langs: Array<{ name: string; pct: number }>;
  repoCount: number;
  joined: string;
  repos: TermRepo[];
}

type Line = { text: string; cls?: string; html?: boolean };

const HELP: Array<[string, string]> = [
  ['help', 'this list'],
  ['whoami', 'who you are talking to'],
  ['ls', 'list every project'],
  ['cat <project>', 'read a project write-up'],
  ['open <project>', 'open a project on GitHub'],
  ['stats', 'languages and repo counts'],
  ['skills', 'what I work with'],
  ['contact', 'how to reach me'],
  ['resume', 'download the CV'],
  ['neofetch', 'the obligatory system readout'],
  ['clear', 'wipe the screen'],
  ['exit', 'close this window'],
];

export function bootTerminal(): void {
  const root = document.querySelector<HTMLElement>('[data-terminal]');
  const dataEl = document.querySelector<HTMLScriptElement>('[data-terminal-data]');
  if (!root || !dataEl) return;

  let data: TermData;
  try {
    data = JSON.parse(dataEl.textContent ?? '{}') as TermData;
  } catch {
    return;
  }

  const out = root.querySelector<HTMLElement>('[data-terminal-out]')!;
  const form = root.querySelector<HTMLFormElement>('[data-terminal-form]')!;
  const input = root.querySelector<HTMLInputElement>('[data-terminal-input]')!;
  const screen = root.querySelector<HTMLElement>('[data-terminal-screen]')!;

  const history: string[] = [];
  let historyIndex = -1;
  let booted = false;
  /** Restored on close so focus doesn't jump to the top of the page. */
  let lastFocused: HTMLElement | null = null;

  /* ---------------------------------------------------------------- output */

  function write(lines: Line[]): void {
    for (const line of lines) {
      const el = document.createElement('div');
      el.className = `l ${line.cls ?? ''}`.trim();
      if (line.html) el.innerHTML = line.text;
      else el.textContent = line.text;
      out.appendChild(el);
    }
    // Reading scrollHeight forces layout, so this lands correctly without
    // waiting for a frame — which matters, since rAF is throttled to nothing
    // in a backgrounded tab.
    screen.scrollTop = screen.scrollHeight;
  }

  const blank = (): Line => ({ text: ' ' });

  function escapeHtml(s: string): string {
    return s.replace(
      /[&<>"']/g,
      (c) =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c,
    );
  }

  /* -------------------------------------------------------------- commands */

  function findRepo(query: string): TermRepo | undefined {
    const q = query.toLowerCase().replace(/[-_\s]/g, '');
    return (
      data.repos.find((r) => r.name.toLowerCase() === query.toLowerCase()) ??
      data.repos.find((r) => r.name.toLowerCase().replace(/[-_\s]/g, '') === q) ??
      data.repos.find((r) => r.name.toLowerCase().replace(/[-_\s]/g, '').includes(q))
    );
  }

  function cmdHelp(): Line[] {
    return [
      { text: 'available commands', cls: 'l--head' },
      ...HELP.map(
        ([cmd, desc]): Line => ({
          html: true,
          text: `  <span class="k">${cmd.padEnd(16)}</span><span class="l--dim">${desc}</span>`,
        }),
      ),
      blank(),
      { text: '  tab completes · ↑/↓ walks history · esc closes', cls: 'l--dim' },
    ];
  }

  function cmdWhoami(): Line[] {
    return [
      { html: true, text: `<span class="k">${data.user}</span> — ${data.role}` },
      { text: data.location, cls: 'l--dim' },
      blank(),
      ...(data.available
        ? [{ html: true, text: `<span class="c">●</span> ${data.available}` } as Line, blank()]
        : []),
      { text: `${data.repoCount} public repositories · on GitHub since ${data.joined}`, cls: 'l--dim' },
      { text: "type 'ls' to see the work, or 'contact' to get in touch.", cls: 'l--dim' },
    ];
  }

  function cmdLs(): Line[] {
    const width = Math.max(...data.repos.map((r) => r.name.length));
    return [
      { text: `total ${data.repos.length}`, cls: 'l--dim' },
      ...data.repos.map(
        (r): Line => ({
          html: true,
          text:
            `  <span class="k">${escapeHtml(r.name.padEnd(width))}</span>  ` +
            `<span class="a">${escapeHtml((r.lang ?? '—').padEnd(17))}</span>` +
            `<span class="l--dim">${r.pushed ? relativeTime(r.pushed) : 'live'}</span>`,
        }),
      ),
      blank(),
      { text: "  cat <name> for the write-up.", cls: 'l--dim' },
    ];
  }

  function cmdCat(arg: string): Line[] {
    if (!arg) return [{ text: 'cat: missing operand — try `cat agentwall`', cls: 'l--err' }];

    const repo = findRepo(arg);
    if (!repo) {
      return [
        { text: `cat: ${arg}: no such project`, cls: 'l--err' },
        { text: "run 'ls' to see what exists.", cls: 'l--dim' },
      ];
    }

    return [
      { html: true, text: `<span class="k">── ${escapeHtml(repo.title)}</span>` },
      blank(),
      { text: repo.blurb || 'No write-up yet.' },
      blank(),
      {
        html: true,
        text:
          `<span class="l--dim">language </span>${escapeHtml(repo.lang ?? 'mixed')}` +
          `<span class="l--dim">   updated </span>${repo.pushed ? relativeTime(repo.pushed) : 'live site'}`,
      },
      {
        html: true,
        text: `<a href="${repo.url}" target="_blank" rel="noopener">${escapeHtml(repo.url)}</a>`,
      },
    ];
  }

  function cmdOpen(arg: string): Line[] {
    const repo = arg ? findRepo(arg) : undefined;
    if (!repo) return [{ text: `open: ${arg || '<project>'}: not found`, cls: 'l--err' }];
    window.open(repo.url, '_blank', 'noopener');
    return [{ text: `opening ${repo.name}…`, cls: 'l--ok' }];
  }

  function cmdStats(): Line[] {
    const barWidth = 28;
    return [
      { text: 'language distribution', cls: 'l--head' },
      ...data.langs.map((l): Line => {
        const filled = Math.max(1, Math.round((l.pct / 100) * barWidth));
        return {
          html: true,
          text:
            `  <span class="a">${escapeHtml(l.name.padEnd(18))}</span>` +
            `<span class="k">${'█'.repeat(filled)}</span>` +
            `<span class="l--dim">${'░'.repeat(barWidth - filled)}  ${l.pct}%</span>`,
        };
      }),
      blank(),
      { text: `  ${data.repoCount} public repos · active since ${data.joined}`, cls: 'l--dim' },
    ];
  }

  function cmdSkills(): Line[] {
    const groups = document.querySelectorAll<HTMLElement>('.skills__group');
    if (!groups.length) return [{ text: 'skills: nothing on the page to read', cls: 'l--err' }];

    const lines: Line[] = [];
    groups.forEach((g) => {
      const title = g.querySelector('.skills__title')?.textContent?.trim() ?? '';
      const items = [...g.querySelectorAll('.skills__item')].map((i) =>
        (i.textContent ?? '').replace('▸', '').trim(),
      );
      lines.push({ text: title.toLowerCase(), cls: 'l--head' });
      lines.push({ text: `  ${items.join(' · ')}` });
    });
    return lines;
  }

  function cmdContact(): Line[] {
    const rows: Array<[string, string]> = [['email', data.email]];
    if (data.links.github) rows.push(['github', data.links.github]);
    if (data.links.linkedin) rows.push(['linkedin', data.links.linkedin]);

    return [
      { text: 'reach me at', cls: 'l--head' },
      ...rows.map(
        ([k, v]): Line => ({
          html: true,
          text:
            `  <span class="l--dim">${k.padEnd(10)}</span>` +
            (v.startsWith('http')
              ? `<a href="${v}" target="_blank" rel="noopener">${escapeHtml(v)}</a>`
              : `<a href="mailto:${v}">${escapeHtml(v)}</a>`),
        }),
      ),
    ];
  }

  function cmdResume(): Line[] {
    if (!data.links.resume) {
      return [{ text: 'resume: not published yet — email me for a copy.', cls: 'l--err' }];
    }
    window.open(data.links.resume, '_blank', 'noopener');
    return [{ text: 'opening résumé…', cls: 'l--ok' }];
  }

  function cmdNeofetch(): Line[] {
    const art = [
      '    ▄▄▄▄▄▄▄▄▄▄▄  ',
      '  ▄█████████████▄',
      ' ███▀  ▄▄▄▄▄  ▀███',
      '███   ███████   ██',
      '███   ▀▀▀▀▀▀▀   ██',
      ' ███▄  ▀▀▀▀▀  ▄███',
      '  ▀█████████████▀ ',
      '    ▀▀▀▀▀▀▀▀▀▀▀   ',
    ];
    const info = [
      `${data.user.toLowerCase().replace(/\s+/g, '')}@portfolio`,
      '─────────────────────',
      `role     ${data.role}`,
      `location ${data.location}`,
      `repos    ${data.repoCount}`,
      `top lang ${data.langs[0]?.name ?? '—'} (${data.langs[0]?.pct ?? 0}%)`,
      `since    ${data.joined}`,
      `shell    portfolio.sh`,
      `status   ${data.available ? 'open to work' : 'heads down'}`,
    ];

    const rows = Math.max(art.length, info.length);
    return Array.from({ length: rows }, (_, i) => ({
      html: true,
      text:
        `<span class="k">${escapeHtml(art[i] ?? ' '.repeat(18))}</span>  ` +
        `<span class="${i === 0 ? 'c' : 'l--dim'}">${escapeHtml(info[i] ?? '')}</span>`,
    }));
  }

  function run(raw: string): void {
    const line = raw.trim();
    write([
      {
        html: true,
        cls: 'l--echo',
        text: `<span class="k">arnav@portfolio</span><span class="l--dim">:~$</span> ${escapeHtml(line)}`,
      },
    ]);

    if (!line) return;
    history.unshift(line);
    historyIndex = -1;

    const [cmd, ...rest] = line.split(/\s+/);
    const arg = rest.join(' ');

    switch (cmd.toLowerCase()) {
      case 'help':
      case '?':
        return write(cmdHelp());
      case 'whoami':
      case 'about':
        return write(cmdWhoami());
      case 'ls':
      case 'dir':
      case 'projects':
        return write(cmdLs());
      case 'cat':
      case 'less':
      case 'read':
        return write(cmdCat(arg));
      case 'open':
      case 'gh':
        return write(cmdOpen(arg));
      case 'stats':
      case 'tokei':
        return write(cmdStats());
      case 'skills':
        return write(cmdSkills());
      case 'contact':
      case 'email':
      case 'mail':
        return write(cmdContact());
      case 'resume':
      case 'cv':
        return write(cmdResume());
      case 'neofetch':
      case 'fetch':
        return write(cmdNeofetch());
      case 'echo':
        return write([{ text: arg }]);
      case 'date':
        return write([{ text: new Date().toString(), cls: 'l--dim' }]);
      case 'clear':
      case 'cls':
        out.innerHTML = '';
        return;
      case 'exit':
      case 'quit':
      case 'q':
        close();
        return;
      case 'sudo':
        return write([
          { text: `${data.user} is not in the sudoers file.`, cls: 'l--err' },
          { text: 'This incident will be reported.', cls: 'l--dim' },
        ]);
      case 'rm':
        return write([
          { text: 'rm: nice try.', cls: 'l--err' },
          { text: 'Everything here is regenerated from GitHub on every load anyway.', cls: 'l--dim' },
        ]);
      default:
        return write([
          { html: true, text: `<span class="l--err">${escapeHtml(cmd)}: command not found</span>` },
          { text: "type 'help' for the list.", cls: 'l--dim' },
        ]);
    }
  }

  /* ------------------------------------------------------------- open/close */

  function open(): void {
    lastFocused = document.activeElement as HTMLElement | null;
    root!.hidden = false;
    document.body.style.overflow = 'hidden';

    if (!booted) {
      booted = true;
      write([
        { html: true, text: `<span class="k">portfolio.sh</span> — interactive resume shell` },
        { text: `${data.user} · ${data.role}`, cls: 'l--dim' },
        blank(),
        { html: true, text: `type <span class="k">help</span> to begin, or <span class="k">ls</span> to jump straight to the work.` },
      ]);
    }

    // Focus synchronously. Deferring this to requestAnimationFrame looks
    // safer but is worse: rAF callbacks don't run while the tab isn't
    // compositing, so the caret would never arrive.
    input.focus();
  }

  function close(): void {
    root!.hidden = true;
    document.body.style.overflow = '';
    lastFocused?.focus();
  }

  /* -------------------------------------------------------------- listeners */

  document.querySelectorAll('[data-terminal-open]').forEach((btn) => {
    btn.addEventListener('click', open);
  });

  root.querySelectorAll('[data-terminal-close]').forEach((btn) => {
    btn.addEventListener('click', close);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    run(input.value);
    input.value = '';
  });

  // Clicking anywhere in the screen should put the caret back in the input,
  // like a real terminal — but not when the user is selecting text.
  screen.addEventListener('mouseup', () => {
    if (!window.getSelection()?.toString()) input.focus();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      // Implicit form submission (Enter in a single-input form) proved
      // unreliable here even with an explicit submit button, so drive it
      // ourselves. requestSubmit() still routes through the submit handler,
      // keeping one execution path for Enter and for the button.
      e.preventDefault();
      form.requestSubmit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) input.value = history[++historyIndex] ?? '';
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) input.value = history[--historyIndex] ?? '';
      else {
        historyIndex = -1;
        input.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const value = input.value;
      const parts = value.split(/\s+/);

      if (parts.length <= 1) {
        const match = HELP.map(([c]) => c.split(' ')[0]).find((c) => c.startsWith(parts[0] ?? ''));
        if (match) input.value = match + ' ';
      } else {
        const match = data.repos.find((r) =>
          r.name.toLowerCase().startsWith((parts[1] ?? '').toLowerCase()),
        );
        if (match) input.value = `${parts[0]} ${match.name}`;
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      out.innerHTML = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    const isOpen = !root.hidden;

    if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      isOpen ? close() : open();
      return;
    }

    if (e.key === 'Escape' && isOpen) {
      e.preventDefault();
      close();
    }
  });
}
