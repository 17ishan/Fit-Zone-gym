// Copies the frontend-users production build (../frontend-users/dist) into ./www,
// which is this Capacitor project's webDir. Run after building frontend-users and
// before `cap sync`. Cross-platform (uses Node's fs APIs, no shell-specific copy).
import { cp, rm, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, '..'); // app/
const src = path.resolve(projectRoot, '..', 'frontend-users', 'dist');
const dest = path.resolve(projectRoot, 'www');

if (!existsSync(src)) {
  console.error(
    `\n[copy-web] Source build not found:\n  ${src}\n` +
      `Build the user frontend first (e.g. \`npm run build:web\` here, or \`npm run build\` in frontend-users).\n`
  );
  process.exit(1);
}

await rm(dest, { recursive: true, force: true });
await mkdir(dest, { recursive: true });
await cp(src, dest, { recursive: true });
console.log(`[copy-web] Copied:\n  ${src}\n  -> ${dest}`);
