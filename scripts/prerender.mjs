import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const rootDir = process.cwd();
const distDir = path.resolve(rootDir, 'dist');
const assetsDir = path.resolve(distDir, 'assets');
const ssrDir = path.resolve(rootDir, 'dist-ssr');

// Interactive states toggled via React state (not visible in initial static HTML)
const DYNAMIC_UI_CLASSES = [
  'bg-white/90',
  'backdrop-blur-md',
  'shadow-sm',
  'py-3',
  'text-gray-900',
  'text-gray-600',
  'text-blue-600',
  'text-blue-400',
  'font-semibold',
  'font-bold',
  'top-full',
  'bg-white',
  'shadow-xl',
  'border-t',
  'border-gray-100',
  'md:hidden',
  'px-5',
  'py-5',
  'space-y-3',
  'block',
  'py-1',
  'text-base',
  'font-medium',
  'hover:text-blue-600',
  'flex',
  'items-center',
  'justify-center',
  'gap-2',
  'bg-blue-600',
  'text-white',
  'py-3.5',
  'rounded-xl',
  'text-[15px]',
];

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

function extractClassesFromHtml(html) {
  const classes = new Set();
  const regex = /class="([^"]*)"/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    for (const token of match[1].split(/\s+/)) {
      if (token) classes.add(token);
    }
  }
  return classes;
}

function extractAboveFoldHtml(routePath, appHtml) {
  const headerMatch = appHtml.match(/<header[\s\S]*?<\/header>/);
  const headerHtml = headerMatch ? headerMatch[0] : '';

  const floatingBtnMatch = appHtml.match(/<div class="fixed bottom-6 right-6[\s\S]*?<\/div>/);
  const floatingBtnHtml = floatingBtnMatch ? floatingBtnMatch[0] : '';

  if (routePath === '/') {
    const heroMatch = appHtml.match(/<main>[\s\S]*?(<section[\s\S]*?<\/section>)/);
    const heroHtml = heroMatch ? heroMatch[1] : '';
    return `<div class="font-sans text-gray-900 bg-white selection:bg-blue-100 selection:text-blue-600 overflow-x-hidden">${headerHtml}${heroHtml}${floatingBtnHtml}</div>`;
  }

  const mainMatch = appHtml.match(/<main[^>]*>[\s\S]*?<\/main>/);
  const mainHtml = mainMatch ? mainMatch[0] : '';
  return `<div class="font-sans text-gray-900 bg-white selection:bg-blue-100 selection:text-blue-600 overflow-x-hidden">${headerHtml}${mainHtml}${floatingBtnHtml}</div>`;
}

// Brace-balanced CSS parser
function parseCssNodes(css) {
  const nodes = [];
  let i = 0;
  const len = css.length;

  function skipWhitespaceAndComments() {
    while (i < len) {
      if (/\s/.test(css[i])) {
        i++;
      } else if (css[i] === '/' && css[i + 1] === '*') {
        const end = css.indexOf('*/', i + 2);
        if (end === -1) {
          i = len;
          return;
        }
        i = end + 2;
      } else {
        break;
      }
    }
  }

  while (i < len) {
    skipWhitespaceAndComments();
    if (i >= len) break;

    const start = i;
    let inString = null;
    let foundChar = null;

    while (i < len) {
      const ch = css[i];
      if (inString) {
        if (ch === '\\') {
          i += 2;
          continue;
        }
        if (ch === inString) inString = null;
        i++;
      } else if (ch === '"' || ch === "'") {
        inString = ch;
        i++;
      } else if (ch === '/' && css[i + 1] === '*') {
        const end = css.indexOf('*/', i + 2);
        if (end === -1) {
          i = len;
          break;
        }
        i = end + 2;
      } else if (ch === '{' || ch === ';') {
        foundChar = ch;
        break;
      } else {
        i++;
      }
    }

    const prelude = css.slice(start, i).trim();
    if (foundChar === ';') {
      i++;
      if (prelude) {
        nodes.push({ type: 'statement', text: `${prelude};` });
      }
    } else if (foundChar === '{') {
      i++;
      const bodyStart = i;
      let depth = 1;
      inString = null;
      while (i < len && depth > 0) {
        const ch = css[i];
        if (inString) {
          if (ch === '\\') {
            i += 2;
            continue;
          }
          if (ch === inString) inString = null;
          i++;
        } else if (ch === '"' || ch === "'") {
          inString = ch;
          i++;
        } else if (ch === '/' && css[i + 1] === '*') {
          const end = css.indexOf('*/', i + 2);
          if (end === -1) {
            i = len;
            break;
          }
          i = end + 2;
        } else if (ch === '{') {
          depth++;
          i++;
        } else if (ch === '}') {
          depth--;
          if (depth === 0) break;
          i++;
        } else {
          i++;
        }
      }
      const body = css.slice(bodyStart, i);
      if (i < len && css[i] === '}') i++;
      nodes.push({ type: 'block', prelude, body });
    } else {
      break;
    }
  }

  return nodes;
}

function splitTopLevelSelectors(prelude) {
  const parts = [];
  let start = 0;
  let parenDepth = 0;
  let bracketDepth = 0;
  let inString = null;

  for (let i = 0; i < prelude.length; i++) {
    const ch = prelude[i];
    if (ch === '\\') {
      i++;
      continue;
    }
    if (inString) {
      if (ch === inString) inString = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inString = ch;
    } else if (ch === '(') {
      parenDepth++;
    } else if (ch === ')' && parenDepth > 0) {
      parenDepth--;
    } else if (ch === '[') {
      bracketDepth++;
    } else if (ch === ']' && bracketDepth > 0) {
      bracketDepth--;
    } else if (ch === ',' && parenDepth === 0 && bracketDepth === 0) {
      parts.push(prelude.slice(start, i).trim());
      start = i + 1;
    }
  }
  const last = prelude.slice(start).trim();
  if (last) parts.push(last);
  return parts;
}

function extractClassTokensFromSelector(selector) {
  const tokens = [];
  let i = 0;
  const len = selector.length;

  while (i < len) {
    if (selector[i] === '\\') {
      i += 2;
      continue;
    }
    if (selector[i] === '[') {
      // Skip attribute selector contents
      i++;
      while (i < len && selector[i] !== ']') {
        if (selector[i] === '\\') i += 2;
        else i++;
      }
      i++;
      continue;
    }
    if (selector[i] === '.') {
      // Check if preceded by a digit (e.g. 0.5) - not a class selector
      if (i > 0 && /\d/.test(selector[i - 1])) {
        i++;
        continue;
      }
      i++;
      let token = '';
      while (i < len) {
        const ch = selector[i];
        if (ch === '\\' && i + 1 < len) {
          token += selector[i + 1];
          i += 2;
        } else if (/[a-zA-Z0-9_-]/.test(ch)) {
          token += ch;
          i++;
        } else {
          break;
        }
      }
      if (token) tokens.push(token);
      continue;
    }
    i++;
  }

  return tokens;
}

function ruleMatchesClassSet(prelude, classSet) {
  const selectors = splitTopLevelSelectors(prelude);
  for (const sel of selectors) {
    const tokens = extractClassTokensFromSelector(sel);
    if (tokens.length === 0) return true;
    if (tokens.every((t) => classSet.has(t))) {
      return true;
    }
  }
  return false;
}

function filterCssNodes(body, classSet) {
  const nodes = parseCssNodes(body);
  let out = '';

  for (const node of nodes) {
    if (node.type === 'statement') {
      out += node.text;
    } else if (node.prelude.startsWith('@media') || node.prelude.startsWith('@supports')) {
      const inner = filterCssNodes(node.body, classSet);
      if (inner) {
        out += `${node.prelude}{${inner}}`;
      }
    } else if (ruleMatchesClassSet(node.prelude, classSet)) {
      out += `${node.prelude}{${node.body}}`;
    }
  }

  return out;
}

function collectUsedTwVars(cssText) {
  const vars = new Set();
  const regex = /--tw-[a-zA-Z0-9-]+/g;
  let match;
  while ((match = regex.exec(cssText)) !== null) {
    vars.add(match[0]);
  }
  return vars;
}

function filterPropertiesLayer(propertiesBody, usedTwVars) {
  const nodes = parseCssNodes(propertiesBody);
  let out = '';
  for (const node of nodes) {
    if (node.type === 'block' && node.prelude.startsWith('@supports')) {
      const innerNodes = parseCssNodes(node.body);
      let innerOut = '';
      for (const inner of innerNodes) {
        if (inner.type === 'block') {
          const decls = inner.body
            .split(';')
            .map((d) => d.trim())
            .filter(Boolean)
            .filter((d) => {
              const prop = d.split(':')[0]?.trim();
              return !prop?.startsWith('--tw-') || usedTwVars.has(prop);
            });
          if (decls.length > 0) {
            innerOut += `${inner.prelude}{${decls.join(';')}}`;
          }
        }
      }
      if (innerOut) {
        out += `${node.prelude}{${innerOut}}`;
      }
    } else if (node.type === 'block') {
      out += `${node.prelude}{${node.body}}`;
    }
  }
  return out;
}

function filterThemeLayer(themeBody, referencedCss) {
  const usedThemeVars = new Set();
  const varCallRegex = /var\((--[a-zA-Z0-9-]+)\)/g;
  let match;
  while ((match = varCallRegex.exec(referencedCss)) !== null) {
    usedThemeVars.add(match[1]);
  }
  // Always retain default font-family tokens & variables referenced inside theme itself
  usedThemeVars.add('--font-sans');
  usedThemeVars.add('--font-mono');
  usedThemeVars.add('--default-font-family');
  usedThemeVars.add('--default-mono-font-family');

  // Resolve transitive references inside @layer theme
  const themeNodes = parseCssNodes(themeBody);
  let changed = true;
  while (changed) {
    changed = false;
    for (const node of themeNodes) {
      if (node.type !== 'block') continue;
      for (const decl of node.body.split(';')) {
        const colonIdx = decl.indexOf(':');
        if (colonIdx === -1) continue;
        const prop = decl.slice(0, colonIdx).trim();
        const val = decl.slice(colonIdx + 1);
        if (usedThemeVars.has(prop)) {
          let m;
          const innerRegex = /var\((--[a-zA-Z0-9-]+)\)/g;
          while ((m = innerRegex.exec(val)) !== null) {
            if (!usedThemeVars.has(m[1])) {
              usedThemeVars.add(m[1]);
              changed = true;
            }
          }
        }
      }
    }
  }

  let out = '';
  for (const node of themeNodes) {
    if (node.type !== 'block') continue;
    const kept = node.body
      .split(';')
      .map((d) => d.trim())
      .filter(Boolean)
      .filter((d) => {
        const prop = d.slice(0, d.indexOf(':')).trim();
        return usedThemeVars.has(prop);
      });
    if (kept.length > 0) {
      out += `${node.prelude}{${kept.join(';')}}`;
    }
  }
  return out;
}

async function prerender() {
  const templatePath = path.join(distDir, 'index.html');
  const template = fs.readFileSync(templatePath, 'utf-8');

  // Locate Vite's bundled CSS file
  const cssLinkMatch = template.match(
    /<link\s+rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/,
  );
  if (!cssLinkMatch) {
    throw new Error('Could not find Vite stylesheet link in dist/index.html');
  }
  const origCssRelPath = cssLinkMatch[1];
  const origCssAbsPath = path.join(distDir, origCssRelPath.replace(/^\//, ''));
  const fullCss = fs.readFileSync(origCssAbsPath, 'utf-8');

  const serverEntryPath = pathToFileURL(path.join(ssrDir, 'entry-server.js')).href;
  const { render, ROUTES_SEO } = await import(serverEntryPath);

  // 1. Render all routes first to collect site-wide used classes
  const renderedRoutes = [];
  const siteUsedClasses = new Set(DYNAMIC_UI_CLASSES);

  for (const route of Object.values(ROUTES_SEO)) {
    const appHtml = render(route.path);
    const routeAllClasses = extractClassesFromHtml(appHtml);
    for (const cls of routeAllClasses) {
      siteUsedClasses.add(cls);
    }
    const aboveFoldHtml = extractAboveFoldHtml(route.path, appHtml);
    const criticalClasses = extractClassesFromHtml(aboveFoldHtml);
    for (const cls of DYNAMIC_UI_CLASSES) {
      criticalClasses.add(cls);
    }
    renderedRoutes.push({ route, appHtml, criticalClasses });
  }

  // 2. Parse CSS layers and remove unused CSS
  const topNodes = parseCssNodes(fullCss);
  let propertiesBody = '';
  let themeBody = '';
  let baseBody = '';
  let utilitiesBody = '';
  const propertyRules = [];
  const keyframeRules = [];

  for (const node of topNodes) {
    if (node.type !== 'block') continue;
    if (node.prelude === '@layer properties') {
      propertiesBody = node.body;
    } else if (node.prelude === '@layer theme') {
      themeBody = node.body;
    } else if (node.prelude === '@layer base') {
      baseBody = node.body;
    } else if (node.prelude === '@layer utilities') {
      utilitiesBody = node.body;
    } else if (node.prelude.startsWith('@property ')) {
      propertyRules.push(node);
    } else if (node.prelude.startsWith('@keyframes ')) {
      keyframeRules.push(node);
    }
  }

  const siteUsedUtilitiesBody = filterCssNodes(utilitiesBody, siteUsedClasses);
  const usedTwVars = collectUsedTwVars(`${baseBody}${siteUsedUtilitiesBody}`);
  const trimmedPropertiesBody = filterPropertiesLayer(propertiesBody, usedTwVars);
  const trimmedThemeBody = filterThemeLayer(themeBody, `${baseBody}${siteUsedUtilitiesBody}`);
  const trimmedPropertyRulesCss = propertyRules
    .filter((node) => usedTwVars.has(node.prelude.replace('@property', '').trim()))
    .map((node) => `${node.prelude}{${node.body}}`)
    .join('');
  const keyframesCss = keyframeRules
    .map((node) => `${node.prelude}{${node.body}}`)
    .join('');

  // 3. Emit single cacheable non-critical deferred CSS bundle (site-wide utilities + keyframes)
  const deferredCss = `@layer utilities{${siteUsedUtilitiesBody}}${keyframesCss}`;
  const deferredHash = crypto.createHash('sha256').update(deferredCss).digest('hex').slice(0, 8);
  const deferredCssName = `deferred-${deferredHash}.css`;
  const deferredCssHref = `/assets/${deferredCssName}`;
  fs.writeFileSync(path.join(assetsDir, deferredCssName), deferredCss, 'utf-8');

  // Remove original render-blocking CSS bundle
  fs.unlinkSync(origCssAbsPath);

  console.log(
    `CSS optimized: original=${fullCss.length}B -> deferred=${deferredCss.length}B (removed ${fullCss.length - (trimmedPropertiesBody.length + trimmedThemeBody.length + baseBody.length + deferredCss.length + trimmedPropertyRulesCss.length)}B unused)`,
  );

  // 4. Write pre-rendered HTML per route with inline Critical CSS + deferred non-critical CSS
  for (const { route, appHtml, criticalClasses } of renderedRoutes) {
    const criticalUtilitiesBody = filterCssNodes(utilitiesBody, criticalClasses);
    const criticalCss =
      `@layer properties,theme,base,components,utilities;` +
      (trimmedPropertiesBody ? `@layer properties{${trimmedPropertiesBody}}` : '') +
      (trimmedThemeBody ? `@layer theme{${trimmedThemeBody}}` : '') +
      (baseBody ? `@layer base{${baseBody}}` : '') +
      (criticalUtilitiesBody ? `@layer utilities{${criticalUtilitiesBody}}` : '') +
      trimmedPropertyRulesCss +
      keyframesCss;

    const cssInjection =
      `<style data-critical="true">${criticalCss}</style>` +
      `<link rel="preload" as="style" href="${deferredCssHref}" />` +
      `<link rel="stylesheet" href="${deferredCssHref}" media="print" onload="this.media='all'" />` +
      `<noscript><link rel="stylesheet" href="${deferredCssHref}" /></noscript>`;

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
      /<link\s+rel="stylesheet"[^>]*href="\/assets\/[^"]+\.css"[^>]*>/,
      cssInjection,
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
    console.log(
      `Prerendered ${route.path} -> ${path.relative(rootDir, outPath)} (critical CSS: ${criticalCss.length}B)`,
    );
  }

  fs.rmSync(ssrDir, { recursive: true, force: true });
}

prerender().catch((err) => {
  console.error(err);
  process.exit(1);
});
