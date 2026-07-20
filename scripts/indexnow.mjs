#!/usr/bin/env node
/**
 * IndexNow: ping Bing (+ other participants) after deploy.
 * Key file must be live at https://travelnewsradar.com/{KEY}.txt
 *
 * Usage:
 *   node scripts/indexnow.mjs              # homepage + all articles + author
 *   node scripts/indexnow.mjs --changed    # only URLs from git-changed article files
 *   INDEXNOW_SKIP=1 …                      # no-op (local/debug)
 */
import { readdir } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_HOST = 'travelnewsradar.com';
const SITE_ORIGIN = `https://${SITE_HOST}`;
const KEY = '262d1179c128167ac82efda9f5704e69';
const KEY_LOCATION = `${SITE_ORIGIN}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT, 'src/content/articles');

function articleUrl(filename) {
  const slug = filename.replace(/\.md$/, '');
  return `${SITE_ORIGIN}/news/${slug}/`;
}

async function allArticleUrls() {
  const files = await readdir(ARTICLES_DIR);
  return files
    .filter(
      (f) =>
        f.endsWith('.md') &&
        !f.startsWith('_') &&
        !f.includes('_before'),
    )
    .map(articleUrl);
}

function changedArticleUrls() {
  try {
    const out = execSync(
      'git diff --name-only HEAD~1 HEAD -- src/content/articles/',
      { cwd: ROOT, encoding: 'utf8' },
    );
    return out
      .split('\n')
      .map((l) => l.trim())
      .filter(
        (l) =>
          l.endsWith('.md') &&
          !l.includes('_before') &&
          !path.basename(l).startsWith('_'),
      )
      .map((l) => articleUrl(path.basename(l)));
  } catch {
    return [];
  }
}

async function collectUrls(changedOnly) {
  const urls = new Set([
    `${SITE_ORIGIN}/`,
    `${SITE_ORIGIN}/author/kevin/`,
    `${SITE_ORIGIN}/rss.xml`,
    `${SITE_ORIGIN}/sitemap.xml`,
    `${SITE_ORIGIN}/sitemap-news.xml`,
  ]);

  if (changedOnly) {
    const changed = changedArticleUrls();
    for (const u of changed) urls.add(u);
    // Always refresh homepage when content changed; if nothing changed, still ping hub pages
    if (changed.length === 0) {
      for (const u of await allArticleUrls()) urls.add(u);
    }
  } else {
    for (const u of await allArticleUrls()) urls.add(u);
  }

  return [...urls];
}

async function submit(urlList) {
  const body = {
    host: SITE_HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });

  const text = await res.text().catch(() => '');
  return { status: res.status, text };
}

async function main() {
  if (process.env.INDEXNOW_SKIP === '1') {
    console.log('IndexNow: skipped (INDEXNOW_SKIP=1)');
    return;
  }

  const changedOnly = process.argv.includes('--changed');
  const urlList = await collectUrls(changedOnly);

  console.log(`IndexNow: submitting ${urlList.length} URL(s)…`);
  for (const u of urlList) console.log(`  ${u}`);

  try {
    const { status, text } = await submit(urlList);
    // 200 OK, 202 Accepted are success; 204 also seen
    if (status === 200 || status === 202 || status === 204) {
      console.log(`IndexNow: ok (${status})`);
      return;
    }
    console.warn(`IndexNow: unexpected status ${status} ${text}`.trim());
    // Do not fail deploy — search ping is best-effort
    process.exitCode = 0;
  } catch (err) {
    console.warn('IndexNow: request failed (deploy continues):', err.message);
    process.exitCode = 0;
  }
}

main();
