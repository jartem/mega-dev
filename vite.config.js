import { fileURLToPath } from 'node:url';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vite';

const runbook = fileURLToPath(new URL('./src/lib/layouts/runbook.svelte', import.meta.url));

export default defineConfig({
  plugins: [
    sveltekit({
      adapter: adapter({ pages: 'docs', assets: 'docs', fallback: undefined }),
      paths: { base: process.env.BASE_PATH ?? '' },
      extensions: ['.svelte', '.svx'],
      preprocess: [mdsvex({ extensions: ['.svx'], layout: { runbook } })],
      prerender: { entries: ['*'], handleHttpError: 'warn' },
    }),
  ],
});
