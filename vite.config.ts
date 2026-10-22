import autoAdapter from '@sveltejs/adapter-auto';
import vercelAdapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: process.env.VERCEL
				? vercelAdapter({
						runtime: 'nodejs22.x',
						images: {
							sizes: [640, 828, 1200, 1920],
							formats: ['image/avif', 'image/webp'],
							minimumCacheTTL: 300
						}
					})
				: autoAdapter()
		})
	]
});
