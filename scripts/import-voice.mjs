// Swaps the computer voice for a real person's recordings.
// Usage: node scripts/import-voice.mjs /path/to/folder-of-recordings
// Files must be named like the script: pig.wav, pig__slow.wav, i_want.wav ... (wav, mp3, m4a, aiff, flac).
// Each file is converted to a small mono m4a and replaces the matching clip. Then run: node scripts/build-assets.mjs
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, parse } from 'node:path';

const dir = process.argv[2];
if (!dir || !existsSync(dir)) { console.error('Give the folder with the recordings:  node scripts/import-voice.mjs /path/to/folder'); process.exit(1); }
const known = new Set(readFileSync('store/briefs/voice-script.csv', 'utf8').split('\n').slice(1).map((l) => l.match(/^"([^"]+)\.m4a"/)?.[1]).filter(Boolean));
const humanFile = 'assets/voice/HUMAN.txt';
const human = new Set(existsSync(humanFile) ? readFileSync(humanFile, 'utf8').split('\n').filter(Boolean) : []);
const hasFfmpeg = (() => { try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); return true; } catch { return false; } })();
mkdirSync('assets/voice', { recursive: true });

let done = 0; const unknown = [];
for (const f of readdirSync(dir)) {
  const { name, ext } = parse(f);
  if (!/\.(wav|mp3|m4a|aif|aiff|flac)$/i.test(ext)) continue;
  const key = name.toLowerCase().replace(/[^a-z0-9_]+/g, '_');
  if (!known.has(key)) { unknown.push(f); continue; }
  const out = join('assets/voice', `${key}.m4a`);
  if (hasFfmpeg) execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', join(dir, f), '-ac', '1', '-ar', '44100', '-af', 'loudnorm=I=-18:TP=-2', '-c:a', 'aac', '-b:a', '64k', out]);
  else execFileSync('afconvert', ['-f', 'm4af', '-d', 'aac', '-b', '64000', '-c', '1', join(dir, f), out]);
  human.add(key); done++;
}
writeFileSync(humanFile, [...human].sort().join('\n') + '\n');
console.log(`imported ${done} recordings. Real voice now covers ${human.size} of ${known.size} clips (${Math.round((human.size / known.size) * 100)}%).`);
if (unknown.length) console.log(`skipped ${unknown.length} files whose names match no clip, for example: ${unknown.slice(0, 5).join(', ')}`);
console.log(hasFfmpeg ? 'Volume was levelled with ffmpeg.' : 'Tip: install ffmpeg (brew install ffmpeg) to level the volume of all clips.');
console.log('Next: node scripts/build-assets.mjs   (rebuilds the voice list; clips you imported are kept)');
