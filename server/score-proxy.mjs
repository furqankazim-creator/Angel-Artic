// Tiny scoring proxy: keeps the Azure key off the phone and converts any recording (Android m4a/3gp/aac) to 16 kHz WAV.
// Run:  AZURE_KEY=... AZURE_REGION=eastus APP_TOKEN=pick-a-long-secret node server/score-proxy.mjs
// Needs Node 18+ and ffmpeg on the PATH. No npm packages. Nothing is stored: audio is processed in memory/temp and deleted.
import http from 'node:http';
import { spawn } from 'node:child_process';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const { AZURE_KEY, AZURE_REGION, APP_TOKEN, PORT = '8787' } = process.env;
if (!AZURE_KEY || !AZURE_REGION || !APP_TOKEN) { console.error('Set AZURE_KEY, AZURE_REGION and APP_TOKEN.'); process.exit(1); }
const MAX_BYTES = 2_000_000; // ~60 s of audio, far more than a word needs
const hits = new Map(); // ip -> [timestamps] simple rate limit
const limited = (ip) => { const now = Date.now(); const a = (hits.get(ip) ?? []).filter((t) => now - t < 60_000); a.push(now); hits.set(ip, a); return a.length > 30; };

const toWav = (input, output) => new Promise((resolve, reject) => {
  const p = spawn('ffmpeg', ['-y', '-i', input, '-ar', '16000', '-ac', '1', '-c:a', 'pcm_s16le', output], { stdio: 'ignore' });
  p.on('error', reject); p.on('exit', (c) => (c === 0 ? resolve() : reject(new Error('ffmpeg ' + c))));
});
const isWav = (b) => b.length > 12 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WAVE';

http.createServer(async (req, res) => {
  const send = (code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); };
  try {
    if (req.method === 'GET' && req.url === '/health') return send(200, { ok: true });
    const url = new URL(req.url, 'http://x');
    if (req.method !== 'POST' || url.pathname !== '/score') return send(404, { error: 'not found' });
    if (req.headers.authorization !== `Bearer ${APP_TOKEN}`) return send(401, { error: 'unauthorized' });
    if (limited(req.socket.remoteAddress ?? '')) return send(429, { error: 'slow down' });
    const word = (url.searchParams.get('word') ?? '').toLowerCase();
    if (!/^[a-z' ]{1,40}$/.test(word)) return send(400, { error: 'bad word' });
    const chunks = []; let size = 0;
    for await (const c of req) { size += c.length; if (size > MAX_BYTES) return send(413, { error: 'too large' }); chunks.push(c); }
    let audio = Buffer.concat(chunks);
    if (!audio.length) return send(400, { error: 'empty' });
    if (!isWav(audio)) {
      const dir = await mkdtemp(join(tmpdir(), 'aa-'));
      try { await writeFile(join(dir, 'in'), audio); await toWav(join(dir, 'in'), join(dir, 'out.wav')); audio = await readFile(join(dir, 'out.wav')); }
      finally { await rm(dir, { recursive: true, force: true }); }
    }
    const assessment = { ReferenceText: word, GradingSystem: 'HundredMark', Granularity: 'Phoneme', Dimension: 'Comprehensive', EnableMiscue: true };
    const r = await fetch(`https://${AZURE_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US&format=detailed`, {
      method: 'POST',
      headers: { 'Ocp-Apim-Subscription-Key': AZURE_KEY, 'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000',
        'Pronunciation-Assessment': Buffer.from(JSON.stringify(assessment)).toString('base64'), Accept: 'application/json' },
      body: audio,
    });
    if (!r.ok) return send(502, { error: 'azure ' + r.status });
    res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(await r.text()); // the app maps the Azure JSON itself
  } catch (e) { send(500, { error: 'failed' }); }
}).listen(Number(PORT), () => console.log('score proxy on :' + PORT));
