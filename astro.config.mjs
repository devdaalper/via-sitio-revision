import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const githubBase = process.env.PUBLIC_BASE_PATH || '/via-sitio-revision';
const githubSite = process.env.PUBLIC_SITE_URL || 'https://devdaalper.github.io';

export default defineConfig({
  site: isGitHubPages ? githubSite : undefined,
  base: isGitHubPages ? githubBase : '/',
  vite: {
    plugins: [tailwindcss()],
  },
});
