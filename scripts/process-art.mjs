import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { PNG } from 'pngjs';

/**
 * Converts a jpg/png with white/neutral background into an isolated 512x512 PNG with alpha transparency.
 */
export function processArt(inputPath, wordName) {
  const tmpPng = `/tmp/${wordName}_temp.png`;
  // Convert to PNG with sips
  execSync(`sips -s format png "${inputPath}" --out "${tmpPng}"`, { stdio: 'ignore' });

  const rawData = fs.readFileSync(tmpPng);
  const png = PNG.sync.read(rawData);
  const w = png.width;
  const h = png.height;
  const visited = new Uint8Array(w * h);
  const queue = [];

  function isBackground(x, y) {
    const idx = (y * w + x) * 4;
    const r = png.data[idx];
    const g = png.data[idx + 1];
    const b = png.data[idx + 2];
    const diff = Math.max(r, g, b) - Math.min(r, g, b);
    return r > 230 && g > 230 && b > 230 && diff < 20;
  }

  // Enqueue outer border pixels
  for (let x = 0; x < w; x++) {
    if (isBackground(x, 0)) queue.push(x, 0);
    if (isBackground(x, h - 1)) queue.push(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    if (isBackground(0, y)) queue.push(0, y);
    if (isBackground(w - 1, y)) queue.push(w - 1, y);
  }

  let head = 0;
  while (head < queue.length) {
    const x = queue[head++];
    const y = queue[head++];
    const pidx = y * w + x;
    if (visited[pidx]) continue;
    visited[pidx] = 1;

    const idx = pidx * 4;
    png.data[idx + 3] = 0; // Make transparent

    const neighbors = [
      [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]
    ];
    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
        const nidx = ny * w + nx;
        if (!visited[nidx] && isBackground(nx, ny)) {
          queue.push(nx, ny);
        }
      }
    }
  }

  // Soft feathering on outer rim
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const pidx = y * w + x;
      if (!visited[pidx]) {
        const idx = pidx * 4;
        const r = png.data[idx];
        const g = png.data[idx + 1];
        const b = png.data[idx + 2];
        const lum = (r + g + b) / 3;
        let nearTrans = false;
        if (visited[(y-1)*w + x] || visited[(y+1)*w + x] || visited[y*w + x - 1] || visited[y*w + x + 1]) {
          nearTrans = true;
        }
        if (nearTrans && lum > 215) {
          const alpha = Math.max(0, Math.min(255, Math.round((240 - lum) / 25 * 255)));
          png.data[idx + 3] = alpha;
        }
      }
    }
  }

  // Find bounding box of non-transparent content
  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      if (png.data[idx + 3] > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Target 512x512
  const targetPath = path.join('assets/art', `${wordName}.png`);
  const outPng = PNG.sync.write(png);
  fs.writeFileSync(tmpPng, outPng);

  // Resize using sips to 512x512
  execSync(`sips -z 512 512 "${tmpPng}" --out "${targetPath}"`, { stdio: 'ignore' });
  try { fs.unlinkSync(tmpPng); } catch {}
  console.log(`Processed ${wordName} -> ${targetPath}`);
}

if (process.argv[2] && process.argv[3]) {
  processArt(process.argv[2], process.argv[3]);
}
