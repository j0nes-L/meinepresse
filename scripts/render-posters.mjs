// Rendert für jedes 3D-Modell ein Standbild (transparenter Hintergrund) mit exakt den Viewer-Einstellungen.
// Es wird im 3D-Viewport angezeigt, bis das interaktive Modell geladen ist – dadurch zeigt der Viewport
// immer nur das Modell, nie ein Foto. Nach Änderungen an Modellen oder Kamera neu ausführen:
//   npm run build && npm run posters
// Benötigt ein lokal installiertes Chrome (Pfad über CHROME_PATH überschreibbar).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { extname, join } from 'node:path';
import { chromium } from 'playwright-core';

const SLUGS = ['standard', 'rustic', 'pro'];
const SIZE = 1200;
const PORT = 4399;
const OUT = 'src/assets/renders';

const chromePath =
  process.env.CHROME_PATH ||
  [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
  ].find(existsSync);
if (!chromePath) throw new Error('Chrome nicht gefunden – CHROME_PATH setzen.');

if (!existsSync('dist/index.html')) throw new Error('Erst „npm run build“ ausführen.');

// Minimaler Static-Server für dist/ (inkl. sauberer URLs wie /pressen/standard)
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.glb': 'model/gltf-binary', '.woff2': 'font/woff2', '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' };
const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  for (const file of [path, `${path}.html`, join(path, 'index.html')]) {
    try {
      const body = await readFile(join('dist', file));
      res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
      return res.end(body);
    } catch {}
  }
  res.writeHead(404).end();
}).listen(PORT, '127.0.0.1');
const base = `http://127.0.0.1:${PORT}`;

const browser = await chromium.launch({ executablePath: chromePath, args: ['--use-gl=angle', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
mkdirSync(OUT, { recursive: true });

try {
  for (const slug of SLUGS) {
    await page.goto(`${base}/pressen/${slug}`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.querySelector('model-viewer')?.loaded, null, { timeout: 60000 });

    const dataUrl = await page.evaluate(async (size) => {
      const live = document.querySelector('model-viewer');
      const box = document.createElement('div');
      box.style.cssText = `position:fixed;left:0;top:0;width:${size}px;height:${size}px;z-index:9999`;
      const mv = document.createElement('model-viewer');
      for (const { name, value } of live.attributes) {
        if (!/^(auto-rotate|ar|ar-modes|class|style|poster)/.test(name)) mv.setAttribute(name, value);
      }
      mv.style.cssText = 'width:100%;height:100%;background:transparent';
      box.append(mv);
      document.body.append(box);
      await new Promise((r) => mv.addEventListener('load', r, { once: true }));
      mv.jumpCameraToGoal();
      for (let i = 0; i < 10; i++) await new Promise((r) => requestAnimationFrame(r));
      const blob = await mv.toBlob({ mimeType: 'image/png' });
      return await new Promise((r) => {
        const fr = new FileReader();
        fr.onload = () => r(fr.result);
        fr.readAsDataURL(blob);
      });
    }, SIZE);

    writeFileSync(`${OUT}/press-${slug}.png`, Buffer.from(dataUrl.split(',')[1], 'base64'));
    console.log(`✓ ${OUT}/press-${slug}.png`);
  }
} finally {
  await browser.close();
  server.close();
}
