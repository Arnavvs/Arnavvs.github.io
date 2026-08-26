// @ts-check
import { defineConfig } from 'astro/config';

// If you deploy to GitHub Pages at https://Arnavvs.github.io (a user site),
// `base` must stay '/'. If you deploy to a project repo instead, e.g.
// https://Arnavvs.github.io/portfolio, set base: '/portfolio'.
export default defineConfig({
  site: 'https://arnavvs.github.io',
  base: '/',
  build: { inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
});
