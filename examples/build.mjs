import { execSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Builds each MFE, then assembles a flat dist/ (index.html + the three
// widget bundles side by side) so this folder deploys as its own static
// site instead of relying on the other apps' dist/ output at runtime.

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');

const apps = [
  { dir: 'flight-search-mfe', file: 'flight-search-widget.js' },
  { dir: 'login-mfe', file: 'login-widget.js' },
  { dir: 'feedback-mfe', file: 'feedback-widget.js' },
];

for (const app of apps) {
  const appDir = join(repoRoot, app.dir);
  execSync('npm install', { cwd: appDir, stdio: 'inherit' });
  execSync('npm run build', { cwd: appDir, stdio: 'inherit' });
}

const distDir = join(here, 'dist');
rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir);

for (const app of apps) {
  cpSync(join(repoRoot, app.dir, 'dist', app.file), join(distDir, app.file));
}

let html = readFileSync(join(here, 'combined-demo.html'), 'utf8');
for (const app of apps) {
  html = html.replaceAll(`../${app.dir}/dist/${app.file}`, `./${app.file}`);
}
writeFileSync(join(distDir, 'index.html'), html);
