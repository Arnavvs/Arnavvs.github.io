/**
 * Wordle, scored against the solvers from the Qwen_wordle_sft project.
 *
 * The point isn't the game — it's the benchmark underneath it. When you finish,
 * your guess count is placed next to the classical solver (3.44), the distilled
 * 0.5B model (3.76) and the frequency baseline (3.79), which makes those numbers
 * mean something to a reader who would otherwise skim past them.
 */

import { WORDS, WORD_SET, DICTIONARY_URL } from '../data/words';

const ROWS = 6;
const COLS = 5;

/** Benchmarks from the project README. Keep in sync if the numbers change. */
const BENCHMARKS = [
  { name: 'classical solver', score: 3.4431, kind: 'best' },
  { name: 'distilled 0.5B model', score: 3.7642, kind: 'model' },
  { name: 'frequency baseline', score: 3.7927, kind: 'base' },
  { name: 'random baseline', score: 4.0203, kind: 'base' },
] as const;

type Mark = 'hit' | 'near' | 'miss';

/**
 * Standard Wordle marking, which is subtler than it looks: a letter only earns
 * "near" if an unmatched copy of it remains in the answer. Exact matches are
 * consumed first, otherwise "geese" against "eaten" would show both e's as
 * present when the answer holds only two.
 */
function mark(guess: string, answer: string): Mark[] {
  const marks: Mark[] = Array(COLS).fill('miss');
  const remaining: Record<string, number> = {};

  for (let i = 0; i < COLS; i += 1) {
    if (guess[i] === answer[i]) marks[i] = 'hit';
    else remaining[answer[i]] = (remaining[answer[i]] ?? 0) + 1;
  }

  for (let i = 0; i < COLS; i += 1) {
    if (marks[i] === 'hit') continue;
    const ch = guess[i];
    if ((remaining[ch] ?? 0) > 0) {
      marks[i] = 'near';
      remaining[ch] -= 1;
    }
  }

  return marks;
}

/** Deterministic word-of-the-day, so two people comparing scores share a puzzle. */
function wordForToday(): string {
  const epoch = Date.UTC(2026, 0, 1);
  const today = new Date();
  const days = Math.floor(
    (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - epoch) / 86_400_000,
  );
  // Modulo can go negative for dates before the epoch; normalise first.
  const index = ((days % WORDS.length) + WORDS.length) % WORDS.length;
  return WORDS[index];
}

/**
 * Words the player may guess. Starts as the (small) answer pool so the game is
 * usable immediately, then widens to the full ~14.8k dictionary once it loads.
 */
let guessable: ReadonlySet<string> = WORD_SET;

async function loadDictionary(): Promise<void> {
  try {
    // BASE_URL keeps this correct when the site is served from a subpath.
    const url = `${import.meta.env.BASE_URL}${DICTIONARY_URL}`.replace(/\/{2,}/g, '/');
    const res = await fetch(url);
    if (!res.ok) return;
    const words = (await res.text()).split(/\s+/).filter(Boolean);
    if (words.length) guessable = new Set(words);
  } catch {
    // Offline or blocked — the answer pool alone remains playable.
  }
}

export function bootGame(): void {
  const root = document.querySelector<HTMLElement>('[data-game]');
  if (!root) return;

  const boardEl = root.querySelector<HTMLElement>('[data-game-board]')!;
  const keysEl = root.querySelector<HTMLElement>('[data-game-keys]')!;
  const msgEl = root.querySelector<HTMLElement>('[data-game-msg]')!;
  const resultEl = root.querySelector<HTMLElement>('[data-game-result]')!;
  const resetBtn = root.querySelector<HTMLButtonElement>('[data-game-reset]')!;

  let answer = wordForToday();
  let guesses: string[] = [];
  let current = '';
  let over = false;
  /** Best mark seen per letter, so the keyboard never downgrades a hit. */
  let keyState: Record<string, Mark> = {};

  /* ------------------------------------------------------------------ view */

  function render(): void {
    const rows = boardEl.querySelectorAll<HTMLElement>('.game__row');

    rows.forEach((row, r) => {
      const cells = row.querySelectorAll<HTMLElement>('.game__cell');
      const guess = guesses[r];

      cells.forEach((cell, c) => {
        if (guess) {
          cell.textContent = guess[c].toUpperCase();
          cell.dataset.mark = mark(guess, answer)[c];
          cell.style.transitionDelay = `${c * 70}ms`;
        } else if (r === guesses.length) {
          cell.textContent = (current[c] ?? '').toUpperCase();
          delete cell.dataset.mark;
          cell.dataset.filled = current[c] ? 'yes' : 'no';
          cell.style.transitionDelay = '0ms';
        } else {
          cell.textContent = '';
          delete cell.dataset.mark;
          cell.dataset.filled = 'no';
        }
      });
    });

    keysEl.querySelectorAll<HTMLElement>('[data-key]').forEach((key) => {
      const state = keyState[key.dataset.key ?? ''];
      if (state) key.dataset.mark = state;
      else delete key.dataset.mark;
    });
  }

  function say(text: string, tone: 'info' | 'error' = 'info'): void {
    msgEl.textContent = text;
    msgEl.dataset.tone = tone;
    if (text) {
      window.setTimeout(() => {
        if (msgEl.textContent === text) msgEl.textContent = '';
      }, 2200);
    }
  }

  function shakeCurrentRow(): void {
    const row = boardEl.querySelector<HTMLElement>(`[data-row="${guesses.length}"]`);
    if (!row) return;
    row.classList.remove('is-invalid');
    // Force a reflow so the animation restarts on repeated bad guesses.
    void row.offsetWidth;
    row.classList.add('is-invalid');
  }

  /* --------------------------------------------------------------- results */

  function showResult(won: boolean): void {
    const used = guesses.length;
    const rows = BENCHMARKS.map((b) => {
      const youBeat = won && used < b.score;
      return `
        <li class="game__bench" data-beat="${youBeat}">
          <span class="game__bench-name">${b.name}</span>
          <span class="game__bench-score mono">${b.score.toFixed(2)}</span>
          <span class="game__bench-verdict mono">${
            !won ? '—' : youBeat ? 'you win' : 'holds'
          }</span>
        </li>`;
    }).join('');

    resultEl.innerHTML = `
      <p class="game__verdict mono" data-won="${won}">
        ${
          won
            ? `solved in <b>${used}</b> guess${used === 1 ? '' : 'es'}`
            : `out of guesses — it was <b>${answer.toUpperCase()}</b>`
        }
      </p>
      <p class="game__bench-head mono">how that compares, on the held-out set</p>
      <ul class="game__benches">${rows}</ul>
      <p class="game__footnote mono">
        One game is not a benchmark — those averages are over 246 held-out games.
        The full write-up is in
        <a href="https://github.com/Arnavvs/Qwen_wordle_sft" target="_blank" rel="noopener">Qwen_wordle_sft</a>.
      </p>`;
    resultEl.hidden = false;
    resetBtn.hidden = false;
  }

  /* ----------------------------------------------------------------- input */

  function submit(): void {
    if (current.length < COLS) {
      say(`${COLS} letters needed`, 'error');
      shakeCurrentRow();
      return;
    }

    if (!guessable.has(current)) {
      say(`"${current}" is not in the word list`, 'error');
      shakeCurrentRow();
      return;
    }

    const marks = mark(current, answer);
    marks.forEach((m, i) => {
      const ch = current[i];
      const prev = keyState[ch];
      // Only ever upgrade: miss -> near -> hit.
      if (prev === 'hit') return;
      if (prev === 'near' && m === 'miss') return;
      keyState[ch] = m;
    });

    guesses.push(current);
    const won = current === answer;
    current = '';
    render();

    if (won || guesses.length === ROWS) {
      over = true;
      // Let the tile flip finish before the result panel lands on top of it.
      window.setTimeout(() => showResult(won), 620);
    }
  }

  function type(ch: string): void {
    if (over || current.length >= COLS) return;
    current += ch;
    render();
  }

  function backspace(): void {
    if (over || !current) return;
    current = current.slice(0, -1);
    render();
  }

  function reset(newWord: boolean): void {
    answer = newWord ? WORDS[Math.floor(Math.random() * WORDS.length)] : wordForToday();
    guesses = [];
    current = '';
    over = false;
    keyState = {};
    resultEl.hidden = true;
    resultEl.innerHTML = '';
    resetBtn.hidden = true;
    msgEl.textContent = '';
    render();
  }

  /* ------------------------------------------------------------- listeners */

  keysEl.addEventListener('click', (e) => {
    const key = (e.target as HTMLElement).closest<HTMLElement>('[data-key]');
    if (!key) return;
    const value = key.dataset.key!;
    if (value === 'enter') submit();
    else if (value === 'back') backspace();
    else type(value);
  });

  resetBtn.addEventListener('click', () => reset(true));

  document.addEventListener('keydown', (e) => {
    // Only claim the keyboard while the game is on screen and nothing else
    // (the Ctrl+K terminal, the repo search) is taking input.
    const terminalOpen = !document.querySelector<HTMLElement>('[data-terminal]')?.hidden;
    const typingElsewhere =
      document.activeElement instanceof HTMLInputElement ||
      document.activeElement instanceof HTMLTextAreaElement;
    if (terminalOpen || typingElsewhere) return;

    const visible = root.getBoundingClientRect();
    const onScreen = visible.top < window.innerHeight && visible.bottom > 0;
    if (!onScreen) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      backspace();
    } else if (/^[a-zA-Z]$/.test(e.key)) {
      type(e.key.toLowerCase());
    }
  });

  render();
  void loadDictionary();
}
