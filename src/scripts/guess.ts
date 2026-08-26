/**
 * "Guess the language" — a snippet appears, you pick which language it is.
 *
 * Deliberately short: five rounds, four options, instant feedback with the
 * actual giveaway explained. It is a palate cleanser next to the Wordle, not
 * something anyone should be stuck in.
 */

import { SNIPPETS, type Snippet } from '../data/snippets';

const ROUNDS = 5;

/** Fisher-Yates. Copies first so the imported SNIPPETS array is left alone. */
function shuffled<T>(input: readonly T[]): T[] {
  const out = [...input];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c,
  );
}

export function bootGuess(): void {
  const root = document.querySelector<HTMLElement>('[data-guess]');
  if (!root) return;

  const codeEl = root.querySelector<HTMLElement>('[data-guess-code]')!;
  const optionsEl = root.querySelector<HTMLElement>('[data-guess-options]')!;
  const progressEl = root.querySelector<HTMLElement>('[data-guess-progress]')!;
  const feedbackEl = root.querySelector<HTMLElement>('[data-guess-feedback]')!;
  const resetBtn = root.querySelector<HTMLButtonElement>('[data-guess-reset]')!;

  let deck: Snippet[] = [];
  let round = 0;
  let score = 0;
  let locked = false;

  function renderRound(): void {
    const snippet = deck[round];
    locked = false;

    codeEl.innerHTML = `<pre class="guess__pre"><code>${escapeHtml(snippet.code)}</code></pre>`;
    progressEl.textContent = `${round + 1} / ${ROUNDS}  ·  score ${score}`;
    feedbackEl.hidden = true;
    feedbackEl.innerHTML = '';

    optionsEl.innerHTML = shuffled(snippet.options)
      .map(
        (opt) =>
          `<button type="button" class="guess__option mono" data-option="${escapeHtml(opt)}">${escapeHtml(opt)}</button>`,
      )
      .join('');
  }

  function finish(): void {
    codeEl.innerHTML = '';
    optionsEl.innerHTML = '';
    progressEl.textContent = `${ROUNDS} / ${ROUNDS}`;

    const verdict =
      score === ROUNDS
        ? 'Perfect run.'
        : score >= ROUNDS - 1
          ? 'Close to perfect.'
          : score >= ROUNDS / 2
            ? 'Not bad.'
            : 'The syntax tells are subtler than they look.';

    feedbackEl.hidden = false;
    feedbackEl.innerHTML = `
      <p class="guess__final mono"><b>${score} / ${ROUNDS}</b> — ${verdict}</p>`;
    resetBtn.hidden = false;
    resetBtn.textContent = 'play again →';
  }

  function answer(choice: string): void {
    if (locked) return;
    locked = true;

    const snippet = deck[round];
    const correct = choice === snippet.answer;
    if (correct) score += 1;

    optionsEl.querySelectorAll<HTMLElement>('[data-option]').forEach((btn) => {
      const value = btn.dataset.option!;
      if (value === snippet.answer) btn.dataset.state = 'right';
      else if (value === choice) btn.dataset.state = 'wrong';
      else btn.dataset.state = 'dim';
    });

    feedbackEl.hidden = false;
    feedbackEl.innerHTML = `
      <p class="guess__verdict mono" data-correct="${correct}">
        ${correct ? '✓ correct' : `✗ it was <b>${escapeHtml(snippet.answer)}</b>`}
      </p>
      <p class="guess__tell">${escapeHtml(snippet.tell)}</p>`;

    progressEl.textContent = `${round + 1} / ${ROUNDS}  ·  score ${score}`;

    window.setTimeout(() => {
      round += 1;
      if (round >= ROUNDS) finish();
      else renderRound();
    }, 1900);
  }

  function start(): void {
    deck = shuffled(SNIPPETS).slice(0, ROUNDS);
    round = 0;
    score = 0;
    resetBtn.hidden = true;
    renderRound();
  }

  optionsEl.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-option]');
    if (btn) answer(btn.dataset.option!);
  });

  resetBtn.addEventListener('click', start);

  start();
}
