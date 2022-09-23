import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from "svelte-preprocess";
import pluginRewriteAll from 'vite-plugin-rewrite-all';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      preprocess: sveltePreprocess(),
  }),
    pluginRewriteAll(),
  ],
  server: {
		port: 4000,
	}
})
