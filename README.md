# Portfolio

A static portfolio site that keeps itself up to date from the GitHub API.

Push a new repo and it appears here on the next page load. No CMS, no database,
no backend.

```bash
npm install
npm run dev      # http://localhost:4321
```

---

## How the "live" part works

Project data is fetched **twice**, on purpose:

| When | What happens | Why |
| --- | --- | --- |
| **Build time** (`npm run build`) | `src/lib/github.ts` hits the GitHub API and bakes the results into the HTML | Fast first paint, works with JS disabled, crawlable by search engines |
| **Page load** (`src/scripts/live.ts`) | The browser refetches the same endpoints and patches the DOM in place | The page reflects the last few minutes, not the last deploy |

If the runtime fetch is rate-limited or offline, the build-time data simply
stays on screen and the badge in the hero flips from `live` to `cached`. Nothing
breaks, nothing goes blank.

There's a third layer of safety underneath both: `src/data/github-snapshot.json`.
If the API is unreachable *at build time*, the build falls back to that committed
snapshot rather than failing. Refresh it whenever you like:

```bash
npm run snapshot
```

### About the rate limit

Unauthenticated GitHub API calls are capped at **60/hour per IP**. That's plenty
for visitors (results are cached in `sessionStorage` for 5 minutes), but you can
exhaust it locally if you rebuild repeatedly. Two fixes:

- **Locally:** export a personal access token (no scopes needed) before building —
  `GITHUB_TOKEN=ghp_xxx npm run build`
- **In CI:** already handled. The included workflow passes the automatic
  `secrets.GITHUB_TOKEN`.

---

## Editing your content

Almost everything you'll want to change lives in two files.

### `src/data/site.ts` — who you are

Name, role, tagline, location, email, links, the About paragraphs, your skills,
and your work history. Start here.

Notes on a few fields:

- `role` / `roles` — `role` is the single title used for the page `<title>`, OG
  tags and structured data. `roles` is the list the hero types through; put the
  same value first so the first thing a visitor reads matches the tab.
- `availableForWork` — drives the green pulsing "open to work" pill in the hero.
  Set it to `false` when you're not looking.
- `links.resume` — points at `public/resume.pdf`. Replace that file whenever your
  CV changes; the filename is what the site links to. Set the field to `''` to
  hide the résumé links entirely.
- `experience[].projects` — each role holds a list of *workstreams*, so two
  distinct projects under one employer render as two labelled blocks rather than
  one undifferentiated pile of bullets.
- `experience[].confidential` — set `true` to render an NDA badge on a role whose
  specifics you're withholding.

### `src/data/projects.ts` — what your work means

GitHub gives us repo names, languages, stars and dates for free. It can't tell
anyone *why a project matters*. That's what this file adds.

- `FEATURED` — the repos that lead the page, in order.
- `OVERRIDES` — per-repo title, blurb, tech chips, and a headline `metric`.
  Keyed by exact repo name. **Optional** — a repo with no entry still shows up,
  using its GitHub description.
- `EXTERNAL_PROJECTS` — work with no public repo behind it (client sites,
  closed-source builds). These render in the same grid.

Adding a repo to GitHub requires **no change here at all**. Only add an entry
when you want to say more than the GitHub description does.

### Hiding a repo

Some repos are plumbing, not portfolio. Add the name to `HIDDEN_REPOS` in
`src/lib/github.ts` — and to the matching `HIDDEN` set at the top of
`src/scripts/live.ts`, so the runtime refresh doesn't add it back.

---

## The game

Section 07 is Wordle, scored against the solvers from `Qwen_wordle_sft`. When you
finish, your guess count is placed next to the classical solver (3.44), the
distilled 0.5B model (3.76) and the two baselines — which is the point: it turns
four numbers a reader would skim past into something they just felt.

- `src/data/words.ts` holds the **answer pool** — ~490 common words, embedded so
  the game is playable the moment the script runs.
- `public/words.txt` holds the **guess dictionary** — 14,855 five-letter words,
  fetched lazily so it costs nothing on page load. Guessing is validated against
  this, which is why ordinary words like SPELL work. (An earlier hand-curated
  list kept rejecting them; don't go back to that.)
- The word of the day is derived from the date, so two people comparing scores are
  playing the same puzzle. "Play a random word" reshuffles for replays.
- Benchmarks live in `BENCHMARKS` at the top of `src/scripts/game.ts`. If the
  project's numbers change, change them there.

The board and keyboard are rendered in `Game.astro`, not by the script — Astro
scopes component CSS to elements that exist at build time, so JS-created nodes
would come out completely unstyled.

## The terminal

Press <kbd>Ctrl</kbd>+<kbd>K</kbd> (or click `>_` in the nav) for an interactive
shell that runs against the site's own data: `ls`, `cat <project>`, `stats`,
`whoami`, `neofetch`, `open <project>`. Tab completes, ↑/↓ walks history.

Commands live in `src/scripts/terminal.ts`. Adding one means a `case` in the
`switch` and a row in the `HELP` array.

---

## Deploying

### GitHub Pages (what the included workflow does)

1. Push this to a repo. For the URL `arnavvs.github.io`, the repo **must** be
   named `Arnavvs.github.io`.
2. Repo → **Settings → Pages → Source → GitHub Actions**.
3. Push to `main`. `.github/workflows/deploy.yml` builds and publishes.

The workflow also rebuilds **every Monday at 06:00 UTC**, so the baked-in data
stays fresh even if you don't push. Delete the `schedule:` block if you'd rather
it didn't.

**Deploying to a project repo instead** (e.g. `github.com/Arnavvs/portfolio`,
served at `arnavvs.github.io/portfolio`)? Set `base: '/portfolio'` in
`astro.config.mjs` — otherwise every asset path breaks.

### Anywhere else

`npm run build` emits a plain static site to `dist/`. Netlify, Vercel, Cloudflare
Pages, or any static host will serve it as-is. Build command `npm run build`,
publish directory `dist`.

---

## Layout

```
src/
├── data/
│   ├── site.ts               ← you: name, bio, experience, skills, education
│   ├── words.ts              ← answer pool (guess dictionary: public/words.txt)
│   ├── projects.ts           ← curation: titles, blurbs, metrics
│   └── github-snapshot.json  ← offline fallback (regenerate: npm run snapshot)
├── lib/
│   ├── github.ts             ← build-time fetch + fallback logic
│   └── format.ts             ← relative times, language colours, %s
├── scripts/
│   ├── live.ts               ← runtime refresh, filtering, reveal, timestamps
│   ├── terminal.ts           ← the Ctrl+K shell
│   └── game.ts               ← Wordle + solver benchmarks
├── components/               ← one .astro file per section
└── styles/global.css         ← design tokens; every colour starts here
```

Restyling is mostly the `:root` block in `global.css` — around fifteen custom
properties that everything else derives from.
