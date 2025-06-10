#!/usr/bin/env node
import { build } from 'vite';
import { build as esbuild } from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildForVercel() {
  console.log('🔨 Building frontend with Vite...');
  
  // Build frontend
  await build({
    root: resolve(__dirname),
    build: {
      outDir: 'dist/public',
      emptyOutDir: true
    }
  });
  
  console.log('✅ Frontend build complete');
  
  console.log('🔨 Building API for Vercel...');
  
  // Build API for Vercel Functions
  await esbuild({
    entryPoints: ['api/index.ts'],
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'node18',
    outdir: 'dist',
    external: [
      'ws',
      'bufferutil', 
      'utf-8-validate',
      '@neondatabase/serverless',
      'pg-native'
    ],
    banner: {
      js: `
        import { createRequire } from 'module';
        const require = createRequire(import.meta.url);
        const __filename = new URL(import.meta.url).pathname;
        const __dirname = new URL('.', import.meta.url).pathname;
      `
    },
    define: {
      'process.env.NODE_ENV': '"production"'
    },
    minify: false,
    sourcemap: false
  });
  
  console.log('✅ API build complete');
  console.log('🚀 Ready for Vercel deployment!');
}

buildForVercel().catch(console.error);