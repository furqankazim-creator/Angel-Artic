// Downloads Microsoft Fluent 3D emoji (MIT licence) for every emoji the app uses, into assets/fluent/.
// Usage: node scripts/build-fluent.mjs   (needs internet the first time; the glyph index is cached)
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

const CACHE = 'scripts/fluent-glyphs.json';
const RAW = 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/';
const strip = (s) => [...s].filter((c) => c !== '️').join('');
const hex = (s) => [...strip(s)].map((c) => c.codePointAt(0).toString(16)).join('-');

async function pool(items, n, fn) {
  const out = []; let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); } }));
  return out;
}

// 1. glyph index: which folder holds which emoji, and where its 3D picture is
let index = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : null;
if (!index) {
  console.log('building the glyph index (once)...');
  const tree = (await (await fetch('https://api.github.com/repos/microsoft/fluentui-emoji/git/trees/main?recursive=1')).json()).tree.map((t) => t.path);
  const png = new Map(); // folder -> path of the default 3D png
  for (const p of tree) {
    const m = p.match(/^assets\/([^/]+)\/(?:Default\/)?3D\/[^/]+\.png$/);
    if (m && !png.has(m[1])) png.set(m[1], p);
    if (m && /\/Default\/3D\//.test(p)) png.set(m[1], p);
  }
  const metas = tree.filter((p) => /^assets\/[^/]+\/metadata\.json$/.test(p));
  index = {};
  await pool(metas, 24, async (p) => {
    try {
      const j = await (await fetch(RAW + encodeURI(p))).json();
      const folder = p.split('/')[1];
      if (j.glyph && png.has(folder)) index[hex(j.glyph)] = png.get(folder);
    } catch {}
  });
  writeFileSync(CACHE, JSON.stringify(index));
  console.log('index entries:', Object.keys(index).length);
}

// 2. every emoji the app uses
const files = ['src/data/sounds.ts', 'src/data/extras.ts', 'src/screens/Talk.tsx', 'src/data/talkBoards.ts', 'src/data/adventure.ts', 'src/data/curriculum.ts', 'src/data/levels.ts', 'src/data/scenes.ts', 'src/data/promo.ts', 'src/screens/AngelTalkPromo.tsx', 'src/art/AdventureMap.tsx'].filter(existsSync);
const src = files.map((f) => readFileSync(f, 'utf8')).join('\n');
const seg = new Intl.Segmenter('en', { granularity: 'grapheme' });
const used = new Set();
for (const { segment } of seg.segment(src)) if (/\p{Extended_Pictographic}/u.test(segment) || /^[0-9#*]️?⃣$/.test(segment)) used.add(segment);

mkdirSync('assets/fluent', { recursive: true });
const found = [], missing = [];
await pool([...used], 16, async (e) => {
  const h = hex(e), path = index[h];
  if (!path) { missing.push(e); return; }
  const out = `assets/fluent/${h}.png`;
  if (!existsSync(out)) {
    const r = await fetch(RAW + encodeURI(path));
    if (!r.ok) { missing.push(e); return; }
    writeFileSync(out, Buffer.from(await r.arrayBuffer()));
  }
  found.push(e);
});
console.log(`3D pictures: ${found.length} of ${used.size} emoji. Missing (these keep the flat picture): ${missing.join(' ') || 'none'}`);
writeFileSync('scripts/fluent-found.json', JSON.stringify(found.map((e) => [e, hex(e)])));
