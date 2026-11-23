// Prefixes root-relative URLs in the built site with a sub-path, for hosts that serve it below the domain root
// (GitHub Pages serves this repo at /goofyfish). Dev and root-hosted builds don't need it.
// usage: node scripts/rebase-paths.mjs <outDir> <basePath>
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const out = process.argv[2] ?? 'build/client';
const base = (process.argv[3] ?? '').replace(/\/$/, '');
if (!base) {
  console.log('No base path given, nothing to rebase.');
  process.exit(0);
}

async function walk(dir) {
  const files = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    files.push(...(e.isDirectory() ? await walk(full) : [full]));
  }
  return files;
}

// href="/x", src='/x', data-src="/x" and CSS url(/x), but not protocol-relative //host or already-prefixed paths.
const skip = `(?!/)(?!${base.slice(1)}/)`;
const attr = new RegExp(`(\\s(?:href|src|data-src|srcset|action)=)(["'])/${skip}`, 'g');
const css = new RegExp(`(url\\(\\s*["']?)/${skip}`, 'g');

let changed = 0;
for (const file of await walk(out)) {
  const ext = extname(file);
  if (!['.html', '.css'].includes(ext)) {
    continue;
  }
  const src = await readFile(file, 'utf8');
  const next = src.replace(attr, `$1$2${base}/`).replace(css, `$1${base}/`);
  if (next !== src) {
    await writeFile(file, next);
    changed++;
  }
}
console.log(`Rebased root paths under ${base} in ${changed} files.`);
