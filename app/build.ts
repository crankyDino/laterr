import { rm, mkdir, cp } from 'fs/promises';
import { existsSync } from 'fs';

async function build() {
    console.log('🧹 Cleaning dist folder...');
    if (existsSync('./dist')) {
        await rm('./dist', { recursive: true });
    }
    await mkdir('./dist', { recursive: true });

    console.log('📦 Building TypeScript files...');
    const isProd = process.env.NODE_ENV === 'production'
    // Build content script
    await Bun.build({
        entrypoints: ['./scripts/content.ts'],
        outdir: './dist/scripts',
        target: 'browser',
        minify: isProd,
        sourcemap: isProd ? 'external' : 'inline',
        env: 'inline'
    });

    // Build background worker
    await Bun.build({
        entrypoints: [
            './scripts/workers/background.ts',
            './scripts/workers/auth.worker.ts',
            './scripts/services/auth.service.ts',
            './scripts/services/bookmarks.service.ts',
            './scripts/services/repo.service.ts',
            './scripts/handlers/form.handler.ts',
            './scripts/handlers/login.handler.ts'
        ],
        outdir: './dist/scripts/',
        target: 'browser',
        minify: isProd,
        sourcemap: isProd ? 'external' : 'inline',
        env: 'inline',
    });

    // Build popup
    await Bun.build({
        entrypoints: ['./pages/popup/popup.ts'],
        outdir: './dist/pages/popup',
        target: 'browser',
        minify: isProd,
        sourcemap: isProd ? 'external' : 'inline',
        env: 'inline'
    });

    // Build login
    await Bun.build({
        entrypoints: ['./pages/login/login.ts'],
        outdir: './dist/pages/login',
        target: 'browser',
        minify: isProd,
        sourcemap: isProd ? 'external' : 'inline',
        env: 'inline'
    });

    console.log('📋 Copying static files...');

    await cp('./manifest.json', './dist/manifest.json');

    await cp('./assets', './dist/assets', { recursive: true });

    await mkdir('./dist/pages/popup', { recursive: true });
    await mkdir('./dist/pages/login', { recursive: true });

    await cp('./pages/popup/popup.html', './dist/pages/popup/popup.html');
    await cp('./pages/popup/popup.css', './dist/pages/popup/popup.css');
    await cp('./pages/login/login.html', './dist/pages/login/login.html');
    await cp('./pages/login/login.css', './dist/pages/login/login.css');
    await cp('./pages/styles.css', './dist/pages/styles.css');

    console.log('✅ Build complete!');
}

build().catch(console.error);