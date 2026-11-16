import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const rootDir = process.cwd();
const distDir = path.resolve(rootDir, 'dist');
const ssrDir = path.resolve(rootDir, 'dist-ssr');

function escapeAttr(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function replaceTag(html, regex, replacement) {
  if (!regex.test(html)) {
    throw new Error(`Expected pattern not found in template: ${regex}`);
  }
  return html.replace(regex, replacement);
}

async function prerender() {
  const templatePath = path.join(distDir, 'index.html');
  const template = fs.readFileSync(templatePath, 'utf-8');

  const serverEntryPath = pathToFileURL(path.join(ssrDir, 'entry-server.js')).href;
  const { render, ROUTES_SEO } = await import(serverEntryPath);

  for (const route of Object.values(ROUTES_SEO)) {
    const appHtml = render(route.path);
    const safeTitle = escapeHtml(route.title);
    const safeAttrTitle = escapeAttr(route.title);
    const safeAttrDesc = escapeAttr(route.description);
    const safeCanonical = escapeAttr(route.canonical);

    let pageHtml = template;
    pageHtml = replaceTag(pageHtml, /<title>[\s\S]*?<\/title>/, `<title>${safeTitle}</title>`);
    pageHtml = replaceTag(
      pageHtml,
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${safeAttrDesc}" />`,
    );
    pageHtml = replaceTag(
      pageHtml,
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
      `<link rel="canonical" href="${safeCanonical}" />`,
    );
    pageHtml = replaceTag(
      pageHtml,
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:title" content="${safeAttrTitle}" />`,
    );
    pageHtml = replaceTag(
      pageHtml,
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${safeAttrDesc}" />`,
    );
    pageHtml = replaceTag(
      pageHtml,
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:url" content="${safeCanonical}" />`,
    );
    pageHtml = replaceTag(
      pageHtml,
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
      `<meta name="twitter:title" content="${safeAttrTitle}" />`,
    );
    pageHtml = replaceTag(
      pageHtml,
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="twitter:description" content="${safeAttrDesc}" />`,
    );
    pageHtml = replaceTag(
      pageHtml,
      /<div id="root"><\/div>/,
      `<div id="root">${appHtml}</div>`,
    );

    const outPath =
      route.path === '/'
        ? path.join(distDir, 'index.html')
        : path.join(distDir, route.path.slice(1), 'index.html');

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, pageHtml, 'utf-8');
    console.log(`Prerendered ${route.path} -> ${path.relative(rootDir, outPath)}`);
  }

  fs.rmSync(ssrDir, { recursive: true, force: true });
}

prerender().catch((err) => {
  console.error(err);
  process.exit(1);
});
