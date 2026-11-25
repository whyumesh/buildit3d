// Runs after `vite build` + the SSR build (see package.json). Puts the rendered page and the
// JSON-LD structured data into dist/public/index.html, and writes sitemap.xml with today's date.
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const out = resolve("dist/public");
const server = await import(pathToFileURL(resolve("dist/server/entry-server.js")).href);

let html = readFileSync(`${out}/index.html`, "utf8");
const app = server.render();
if (!html.includes('<div id="root"></div>')) throw new Error("root div not found in index.html");
html = html.replace('<div id="root"></div>', `<div id="root">${app}</div>`);
const ld = server.jsonLd().map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\u003c")}</script>`).join("\n    ");
html = html.replace("</head>", `    ${ld}\n  </head>`);
writeFileSync(`${out}/index.html`, html);

const today = new Date().toISOString().slice(0, 10);
writeFileSync(`${out}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${server.SITE}/</loc><lastmod>${today}</lastmod></url>
</urlset>
`);
rmSync(resolve("dist/server"), { recursive: true, force: true });
console.log(`prerendered ${Math.round(app.length / 1024)} KB of HTML, ${server.jsonLd().length} JSON-LD blocks, sitemap.xml`);
