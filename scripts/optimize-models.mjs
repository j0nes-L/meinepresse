// Komprimiert die Quell-GLBs (models-src/) für das Web nach public/models/
// Meshopt-Geometrie + WebP-Texturen, max. 1024 px. Aufruf: npm run models
import { execFileSync } from 'node:child_process';
import { readdirSync, mkdirSync } from 'node:fs';

mkdirSync('public/models', { recursive: true });
for (const file of readdirSync('models-src').filter((f) => f.endsWith('.glb'))) {
  execFileSync(
    'npx',
    ['gltf-transform', 'optimize', `models-src/${file}`, `public/models/${file}`,
     '--compress', 'meshopt', '--texture-compress', 'webp', '--texture-size', '1024'],
    { stdio: 'inherit', shell: process.platform === 'win32' },
  );
}
