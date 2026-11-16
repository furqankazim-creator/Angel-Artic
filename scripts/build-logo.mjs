// Builds the Angel Artic logo set (v3, emblem style).
// Usage: RESVG=/path/to/@resvg/resvg-js node scripts/build-logo.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
const { Resvg } = await import(process.env.RESVG ?? '@resvg/resvg-js');
const FONT = 'node_modules/@expo-google-fonts/nunito/800ExtraBold/Nunito_800ExtraBold.ttf';
const FONT2 = 'node_modules/@expo-google-fonts/nunito/700Bold/Nunito_700Bold.ttf';

const defs = (id) => `
<defs>
  <linearGradient id="bg${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6C5CE7"/><stop offset=".5" stop-color="#B655D0"/><stop offset="1" stop-color="#FF6B7A"/></linearGradient>
  <radialGradient id="glow${id}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  <linearGradient id="gold${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE48A"/><stop offset="1" stop-color="#FFB41F"/></linearGradient>
  <linearGradient id="bar${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7B6CF0"/><stop offset="1" stop-color="#FF6B7A"/></linearGradient>
  <linearGradient id="bubble${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#F1ECFF"/></linearGradient>
  <filter id="sh${id}" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#2A1760" flood-opacity=".30"/></filter>
</defs>`;

// A sleek wing blade pointing along +x, tapering to a soft tip.
const blade = 'M0 0 C60 -64 230 -92 348 -34 C366 -24 364 -4 346 6 C232 52 84 44 0 0Z';

function mark(id, mono = false) {
  const wing = (op) => [
    { t: 'translate(392 606) rotate(6) scale(-0.78 0.9)', o: op * 0.6 },
    { t: 'translate(392 580) rotate(26) scale(-0.9 0.96)', o: op * 0.78 },
    { t: 'translate(392 554) rotate(46) scale(-0.98 1)', o: op * 0.92 },
    { t: 'translate(392 528) rotate(66) scale(-0.9 0.96)', o: op },
  ].map((w) => `<path d="${blade}" transform="${w.t}" fill="#fff" fill-opacity="${w.o}"/>`).join('');
  const bars = [[-110, 80], [-55, 170], [0, 240], [55, 150], [110, 90]]
    .map(([dx, h]) => `<rect x="${512 + dx - 21}" y="${530 - h / 2}" width="42" height="${h}" rx="21" fill="url(#bar${id})"/>`).join('');
  return `
  <g ${mono ? '' : `filter="url(#sh${id})"`}>
    ${wing(1)}<g transform="translate(1024 0) scale(-1 1)">${wing(1)}</g>
    <ellipse cx="512" cy="530" rx="222" ry="202" fill="${mono ? '#fff' : `url(#bubble${id})`}"/>
    <path d="M408 672 L350 782 L510 730Z" fill="${mono ? '#fff' : '#F2EDFF'}" stroke="${mono ? '#fff' : '#F2EDFF'}" stroke-width="14" stroke-linejoin="round"/>
  </g>
  ${mono ? '' : bars}
  <g ${mono ? '' : `filter="url(#sh${id})"`}><ellipse cx="512" cy="290" rx="118" ry="32" fill="none" stroke="${mono ? '#fff' : `url(#gold${id})`}" stroke-width="24"/></g>`;
}

const bgRect = (id, w = 1024) => `<rect width="${w}" height="${w}" fill="url(#bg${id})"/><circle cx="${w / 2}" cy="${w * 0.46}" r="${w * 0.46}" fill="url(#glow${id})"/>`;
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">${defs('a')}${bgRect('a')}<g transform="translate(-46 -20) scale(1.09)">${mark('a')}</g></svg>`;
const wrapMark = (inner, scale) => `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">${defs('m')}<g transform="translate(${512 - 512 * scale} ${512 - 500 * scale}) scale(${scale})">${inner}</g></svg>`;

const render = (svg, w, file) => writeFileSync(file, new Resvg(svg, { fitTo: { mode: 'width', value: w }, font: { fontFiles: [FONT, FONT2], loadSystemFonts: false, defaultFontFamily: 'Nunito' } }).render().asPng());

mkdirSync('assets/brand', { recursive: true }); mkdirSync('store/brand', { recursive: true });
writeFileSync('assets/brand/icon.svg', svgIcon);
render(svgIcon, 1024, 'assets/icon.png');
render(svgIcon, 96, 'assets/favicon.png');
writeFileSync('assets/brand/mark.svg', wrapMark(mark('m'), 0.95));
render(wrapMark(mark('m'), 0.8), 1024, 'assets/splash-icon.png');
render(wrapMark(mark('m'), 0.95), 1024, 'store/brand/logo-mark.png');
render(wrapMark(mark('m'), 0.62), 1024, 'assets/android-icon-foreground.png');
render(wrapMark(mark('m', true), 0.62), 1024, 'assets/android-icon-monochrome.png');
render(`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">${defs('b')}${bgRect('b')}</svg>`, 1024, 'assets/android-icon-background.png');

const lockup = `<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="720" viewBox="0 0 2000 720">${defs('h')}
<rect width="2000" height="720" fill="#FFFFFF"/>
<clipPath id="clipH"><rect width="1024" height="1024" rx="230"/></clipPath>
<g transform="translate(50 50) scale(.62)"><g clip-path="url(#clipH)">${bgRect('h')}<g transform="translate(-46 -20) scale(1.09)">${mark('h')}</g></g></g>
<text x="760" y="352" font-family="Nunito" font-weight="800" font-size="196" fill="#2D2A4A" letter-spacing="-4">Angel <tspan fill="#6C5CE7">Artic</tspan></text>
<rect x="768" y="400" width="120" height="8" rx="4" fill="#FF6B6B"/>
<text x="768" y="486" font-family="Nunito" font-weight="700" font-size="52" fill="#2D2A4A" letter-spacing="10">SPEAK  ·  PLAY  ·  SHINE</text>
<text x="768" y="562" font-family="Nunito" font-weight="700" font-size="42" fill="#7A7799">Gentle speech sound practice for children</text></svg>`;
writeFileSync('assets/brand/logo-horizontal.svg', lockup);
render(lockup, 2000, 'store/brand/logo-horizontal.png');
console.log('logo set written');
