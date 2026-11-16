// Synthesises three soft, short sound effects (no copyright issues). Run: node scripts/build-sfx.mjs
import { writeFileSync } from 'node:fs';
const SR = 22050;
function wav(notes) { // notes: [{f, start, dur, vol}]
  const total = Math.max(...notes.map((n) => n.start + n.dur)) + 0.05;
  const data = new Int16Array(Math.floor(total * SR));
  for (const n of notes) {
    const from = Math.floor(n.start * SR), len = Math.floor(n.dur * SR);
    for (let i = 0; i < len && from + i < data.length; i++) {
      const t = i / SR, env = Math.min(1, t / 0.01) * Math.exp(-4 * (i / len));
      const v = (Math.sin(2 * Math.PI * n.f * t) + 0.3 * Math.sin(4 * Math.PI * n.f * t)) * env * (n.vol ?? 0.4);
      data[from + i] = Math.max(-32767, Math.min(32767, data[from + i] + v * 32767 * 0.6));
    }
  }
  const b = Buffer.alloc(44 + data.length * 2);
  b.write('RIFF', 0); b.writeUInt32LE(36 + data.length * 2, 4); b.write('WAVEfmt ', 8); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(data.length * 2, 40);
  Buffer.from(data.buffer).copy(b, 44);
  return b;
}
writeFileSync('assets/sfx/tap.wav', wav([{ f: 660, start: 0, dur: 0.12, vol: 0.3 }]));
writeFileSync('assets/sfx/chime.wav', wav([{ f: 523, start: 0, dur: 0.25 }, { f: 659, start: 0.12, dur: 0.25 }, { f: 784, start: 0.24, dur: 0.4 }]));
writeFileSync('assets/sfx/soft.wav', wav([{ f: 440, start: 0, dur: 0.25, vol: 0.3 }, { f: 523, start: 0.15, dur: 0.3, vol: 0.3 }]));
