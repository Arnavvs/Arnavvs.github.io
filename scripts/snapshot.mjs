/**
 * Regenerates src/data/github-snapshot.json — the offline fallback the build
 * uses when the GitHub API is unreachable or rate-limited.
 *
 *   npm run snapshot
 *
 * Commit the result. It is also what renders if someone clones this repo and
 * builds it with no network.
 */
import { writeFile } from 'node:fs/promises';
import { fetchGitHubData } from '../src/lib/github.ts';

let data;
try {
  data = await fetchGitHubData();
} catch (err) {
  const msg = String(err.message ?? err);
  console.error(`\nCould not refresh the snapshot: ${msg}\n`);
  if (msg.includes('403') || msg.toLowerCase().includes('rate limit')) {
    console.error(
      'That is GitHub\'s unauthenticated rate limit (60 requests/hour/IP).\n' +
        'Either wait for it to reset, or run with a token:\n\n' +
        '    GITHUB_TOKEN=ghp_xxx npm run snapshot\n',
    );
  }
  console.error('The existing snapshot has been left untouched.');
  process.exit(1);
}

data.live = false;
const out = new URL('../src/data/github-snapshot.json', import.meta.url);
await writeFile(out, JSON.stringify(data, null, 2) + '\n');
console.log(
  `snapshot written: ${data.repos.length} repos, ${data.events.length} events, ` +
    `${Object.keys(data.languages).length} languages`,
);
