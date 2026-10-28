import { fileURLToPath } from 'node:url';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vite';

const runbook = fileURLToPath(new URL('./apps/kb/lib/layouts/runbook.svelte', import.meta.url));

export default defineConfig({
  plugins: [
    sveltekit({
      files: { src: 'apps/kb', routes: 'apps/kb/routes', appTemplate: 'apps/kb/app.html' },
      adapter: adapter({ fallback: undefined }),
      extensions: ['.svelte', '.svx'],
      preprocess: [mdsvex({ extensions: ['.svx'], layout: { runbook } })],
      prerender: { entries: ['*'], handleHttpError: 'warn' },
    }),
  ],
});
