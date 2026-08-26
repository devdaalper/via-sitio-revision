import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  site: isGitHubPages ? 'https://devdaalper.github.io' : undefined,
  base: isGitHubPages ? '/via-sitio-revision' : '/',
  vite: {
    plugins: [tailwindcss()],
  },
});
