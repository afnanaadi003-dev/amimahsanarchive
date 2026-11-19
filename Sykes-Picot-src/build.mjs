import fs from 'node:fs';
import path from 'node:path';
import act1 from './act1.js';
import act2 from './act2.js';
import act3 from './act3.js';
import act4 from './act4.js';

const ROOT = process.cwd();
const chapters = [...act1, ...act2, ...act3, ...act4];
if (chapters.length !== 42) throw new Error('Expected 42 chapters, got ' + chapters.length);
chapters.forEach((c, i) => { if (c.n !== i + 1) throw new Error('Chapter numbering broken at ' + (i + 1)); });

const strip = html => html.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
const wordCount = html => strip(html).split(' ').filter(Boolean).length;
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const cast = [
  { name: 'Mark Sykes', slug: 'mark-sykes', role: 'British diplomat · 37', years: '1879–1919', chapter: 1,
    hat: 'none', beard: false, glasses: false, collar: 'tie',
    bio: 'Conservative MP, colonial negotiator, and the man who drew the line from Acre to Kirkuk. Sentimental, impatient, and cleverer than his own certainty.',
    want: 'To draw a settlement that will hold longer than he will.' },
  { name: 'François Georges-Picot', slug: 'francois-georges-picot', role: 'French diplomat · 43', years: '1870–1951', chapter: 2,
    hat: 'none', beard: false, glasses: false, collar: 'tie',
    bio: 'A lawyer turned colonial administrator who believes France has been in the Levant since the Crusades. Precise, cold, and entirely consistent.',
    want: 'To make the French claim look like a fact.' },
  { name: 'Edward Grey', slug: 'edward-grey', role: 'Foreign Secretary · 54', years: '1862–1933', chapter: 3,
    hat: 'none', beard: true, glasses: false, collar: 'tie',
    bio: 'The man who signs without a parliament. Believes secrecy is a kindness to the public and a courtesy to the future.',
    want: 'To keep the war alliance together at any cost.' },
  { name: 'Faisal ibn Hussein', slug: 'faisal', role: 'Arab leader · 31', years: '1885–1933', chapter: 5,
    hat: 'keffiyeh', beard: true, glasses: false, collar: 'robe',
    bio: 'The Sharif\'s son, a soldier and a diplomat who reads the British better than they read him.',
    want: 'One Arab country, promised to his father and divided on paper.' },
  { name: 'T.E. Lawrence', slug: 'te-lawrence', role: 'British officer · 28', years: '1888–1935', chapter: 7,
    hat: 'keffiyeh', beard: false, glasses: false, collar: 'uniform',
    bio: 'Liaison, archaeologist, self-mythologist. He carries the promises between Cairo and the desert and comes to believe in the people he is using.',
    want: 'To be on the right side of a war he helped make.' },
  { name: 'Gertrude Bell', slug: 'gertrude-bell', role: 'Arabist · 47', years: '1868–1926', chapter: 9,
    hat: 'bun', beard: false, glasses: false, collar: 'blouse',
    bio: 'Traveller, cartographer, and the only person in Cairo who has actually ridden the country she is dividing.',
    want: 'A map that names the wells, not just the borders.' },
  { name: 'Chaim Weizmann', slug: 'chaim-weizmann', role: 'Chemist · 41', years: '1874–1952', chapter: 15,
    hat: 'none', beard: true, glasses: true, collar: 'tie',
    bio: 'The inventor who trades acetone for a homeland, and knows exactly what he is trading.',
    want: 'A home where a Jew is not a guest.' },
  { name: 'Salim Haddad', slug: 'salim-haddad', role: 'Damascus merchant · 50', years: 'Fictional', chapter: 6,
    hat: 'tarboush', beard: true, glasses: true, collar: 'robe',
    bio: 'A map-seller and translator whose village is spelled three ways on the British tracing paper.',
    want: 'That the names on the map are the names of the people on the ground.' },
  { name: 'Nadia Haddad', slug: 'nadia-haddad', role: 'Teacher · 19', years: 'Fictional', chapter: 21,
    hat: 'bun', beard: false, glasses: false, collar: 'blouse',
    bio: 'Salim\'s daughter, who carries his notebook of villages from Damascus to Haifa and beyond.',
    want: 'To keep the names after the country is taken.' },
  { name: 'Lina Haddad', slug: 'lina-haddad', role: 'Historian · 40', years: 'Fictional', chapter: 42,
    hat: 'short', beard: false, glasses: true, collar: 'blouse',
    bio: 'Nadia\'s great-granddaughter, cataloguing the line a century after it was drawn.',
    want: 'To explain the map to people who were not in the room.' }
];

function cardSvg(c) {
  const n = String(c.n).padStart(2, '0');
  const act = c.act.toUpperCase();
  const title = c.title.replace(/&/g, '&amp;');
  const words = title.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > 17 && line) { lines.push(line); line = w; }
    else line = (line + ' ' + w).trim();
  }
  if (line) lines.push(line);
  const titleSvg = lines.map((l, i) =>
    `<text x="48" y="${214 + i * 40}" font-family="Georgia,'Times New Roman',serif" font-size="34" font-weight="700" fill="#efe3cb" letter-spacing="1">${esc(l)}</text>`
  ).join('\n  ');
  const markerX = 90 + ((c.n * 47) % 460);
  const markerY = 96 + ((c.n * 29) % 26);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360" role="img" aria-labelledby="t d">
  <title id="t">Chapter ${c.n} — ${title}</title>
  <desc id="d">Title slide for chapter ${c.n} of Sykes–Picot, ${c.act}.</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#171008"/><stop offset="0.55" stop-color="#0e0a06"/><stop offset="1" stop-color="#060403"/>
    </linearGradient>
    <radialGradient id="glow" cx="${18 + (c.n * 7) % 64}%" cy="${24 + (c.n * 11) % 50}%" r="62%">
      <stop offset="0" stop-color="#d8b26a" stop-opacity="0.16"/><stop offset="1" stop-color="#d8b26a" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grain" width="5" height="5" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="0.5" fill="#ffffff" opacity="0.035"/>
    </pattern>
  </defs>
  <rect width="640" height="360" fill="url(#bg)"/>
  <rect width="640" height="360" fill="url(#glow)"/>
  <rect width="640" height="360" fill="url(#grain)"/>

  <g stroke="#5a4526" stroke-width="1" opacity="0.55">
    <path d="M0 96 H640" stroke-dasharray="2 7"/>
    <path d="M0 300 H640" stroke-dasharray="2 7"/>
    <path d="M48 0 V24 M48 40 V56" stroke-dasharray="2 5"/>
  </g>

  <g fill="none" stroke="#a4442f" stroke-width="1.4" opacity="0.55">
    <path d="M-10 ${markerY + 62} L150 ${markerY + 34} L330 ${markerY + 66} L500 ${markerY + 20} L650 ${markerY + 44}"/>
    <path d="M-10 ${markerY + 70} L150 ${markerY + 42} L330 ${markerY + 74} L500 ${markerY + 28} L650 ${markerY + 52}" stroke-dasharray="3 6"/>
  </g>
  <circle cx="${markerX}" cy="${markerY + 42}" r="3.4" fill="#d8b26a"/>
  <circle cx="${markerX}" cy="${markerY + 42}" r="9" fill="none" stroke="#d8b26a" stroke-opacity="0.35"/>

  <text x="48" y="88" font-family="'JetBrains Mono',Consolas,monospace" font-size="10" fill="#d8b26a" letter-spacing="5">${act} · ${esc(c.place.split(' · ')[1] || '')}</text>
  <text x="592" y="88" text-anchor="end" font-family="'JetBrains Mono',Consolas,monospace" font-size="10" fill="#8d7a58" letter-spacing="3">${n} / 42</text>

  <text x="44" y="150" font-family="'JetBrains Mono',Consolas,monospace" font-size="82" font-weight="700" fill="#d8b26a" opacity="0.22" letter-spacing="-3">${n}</text>

  ${titleSvg}

  <text x="48" y="316" font-family="'JetBrains Mono',Consolas,monospace" font-size="9.5" fill="#c9b18a" opacity="0.8" letter-spacing="2.6">${esc(c.place)}</text>

  <g stroke="#d8b26a" stroke-opacity="0.5" stroke-width="1">
    <path d="M48 32 h28 M48 32 v10"/>
    <path d="M592 328 h-28 M592 328 v-10"/>
  </g>
</svg>
`;
}

function portraitSvg(p, i) {
  const initials = p.name.split(' ').filter(w => /^[A-Z]/.test(w)).map(w => w[0]).join('').slice(0, 2);
  const hatch = [];
  for (let k = -7; k < 17; k++) hatch.push(`<path d="M${k * 40} 520 L${k * 40 + 280} 20" />`);

  const head = `<path d="M200 126 C241 126 263 157 263 200 C263 241 247 269 226 281 L226 299 C226 313 239 321 256 327 C322 345 359 395 367 500 H33 C41 395 78 345 144 327 C161 321 174 313 174 299 L174 281 C153 269 137 241 137 200 C137 157 159 126 200 126 Z" fill="#150e07" stroke="#d8b26a" stroke-opacity="0.45" stroke-width="1.3"/>`;

  let hair = '';
  if (p.hat === 'none') hair = `<path d="M138 186 C133 143 161 118 200 117 C239 116 267 143 262 186 C251 164 230 152 202 152 C174 152 151 164 138 186 Z" fill="#0a0704" stroke="#d8b26a" stroke-opacity="0.45"/>`;
  if (p.hat === 'short') hair = `<path d="M136 190 C132 143 164 113 200 113 C238 113 268 143 264 192 C255 168 236 158 216 156 C194 154 170 160 153 173 C145 179 139 184 136 190 Z" fill="#0a0704" stroke="#d8b26a" stroke-opacity="0.5"/>`;
  if (p.hat === 'bun') hair = `<circle cx="139" cy="198" r="29" fill="#0a0704" stroke="#d8b26a" stroke-opacity="0.45"/>
    <path d="M135 196 C129 143 160 113 200 113 C240 113 271 143 265 196 C254 168 232 154 202 154 C172 154 146 168 135 196 Z" fill="#0a0704" stroke="#d8b26a" stroke-opacity="0.45"/>`;
  if (p.hat === 'tarboush') hair = `<path d="M176 132 L174 84 C174 75 181 71 200 71 C219 71 226 75 226 84 L224 132 Z" fill="#0a0704" stroke="#d8b26a" stroke-opacity="0.55"/>
    <ellipse cx="200" cy="73" rx="26" ry="7" fill="#0a0704" stroke="#d8b26a" stroke-opacity="0.55"/>
    <path d="M184 76 C174 84 166 96 164 110" stroke="#d8b26a" stroke-opacity="0.5" fill="none"/>
    <circle cx="163" cy="112" r="3" fill="#d8b26a" opacity="0.55"/>`;
  if (p.hat === 'keffiyeh') hair = `<path d="M122 208 C116 137 153 100 200 100 C247 100 284 137 278 208 L302 332 L261 309 L251 248 C245 209 238 188 200 188 C162 188 155 209 149 248 L139 309 L98 332 Z" fill="#0a0704" stroke="#d8b26a" stroke-opacity="0.5"/>
    <path d="M126 150 C159 127 241 127 274 150" stroke="#0a0704" stroke-width="16" fill="none"/>
    <path d="M126 150 C159 127 241 127 274 150" stroke="#d8b26a" stroke-opacity="0.45" fill="none"/>
    <path d="M128 164 C160 143 240 143 272 164" stroke="#d8b26a" stroke-opacity="0.28" fill="none"/>`;

  const beard = p.beard ? `<path d="M155 224 C155 279 174 312 200 312 C226 312 245 279 245 224 C241 262 224 278 200 278 C176 278 159 262 155 224 Z" fill="#0a0704" stroke="#d8b26a" stroke-opacity="0.35"/>
    <path d="M182 252 C190 258 210 258 218 252" stroke="#d8b26a" stroke-opacity="0.4" fill="none"/>` : '';

  const moustache = ['mark-sykes', 'francois-georges-picot'].includes(p.slug)
    ? `<path d="M179 235 q21 -8 42 0 q-10 6 -21 6 q-11 0 -21 -6 Z" fill="#170f06"/>` : '';

  const glasses = p.glasses ? `<g stroke="#d8b26a" stroke-opacity="0.6" fill="none" stroke-width="1.6">
    <circle cx="177" cy="202" r="15"/><circle cx="223" cy="202" r="15"/>
    <path d="M192 200 q8 -4 16 0"/><path d="M162 198 L146 192"/><path d="M238 198 L254 192"/>
  </g>` : '';

  let collar = '';
  if (p.collar === 'tie') collar = `<path d="M200 330 L158 356 L173 380 L200 361 L227 380 L242 356 Z" fill="#2a2115" stroke="#d8b26a" stroke-opacity="0.45"/>
    <path d="M200 361 L192 430 L200 447 L208 430 Z" fill="#0a0704" stroke="#d8b26a" stroke-opacity="0.5"/>
    <path d="M158 356 L120 500 M242 356 L280 500" stroke="#d8b26a" stroke-opacity="0.25" fill="none"/>`;
  if (p.collar === 'uniform') collar = `<path d="M200 330 L156 348 L169 392 L200 362 L231 392 L244 348 Z" fill="#0a0704" stroke="#d8b26a" stroke-opacity="0.55"/>
    <path d="M169 392 L140 500 M231 392 L260 500" stroke="#d8b26a" stroke-opacity="0.35" fill="none"/>
    <path d="M100 380 L146 362 M300 380 L254 362" stroke="#d8b26a" stroke-opacity="0.4"/>
    <path d="M200 372 V452" stroke="#d8b26a" stroke-opacity="0.2" stroke-dasharray="3 5"/>
    <circle cx="200" cy="400" r="3" fill="#d8b26a" opacity="0.55"/><circle cx="200" cy="428" r="3" fill="#d8b26a" opacity="0.55"/>`;
  if (p.collar === 'robe') collar = `<path d="M200 336 L154 350 L182 430 L200 404 L218 430 L246 350 Z" fill="#0a0704" stroke="#d8b26a" stroke-opacity="0.5"/>
    <path d="M154 350 L108 500 M246 350 L292 500" stroke="#d8b26a" stroke-opacity="0.3" fill="none"/>
    <path d="M164 378 L188 408 L200 392 L212 408 L236 378" stroke="#d8b26a" stroke-opacity="0.45" fill="none" stroke-dasharray="2 4"/>`;
  if (p.collar === 'blouse') collar = `<path d="M200 338 C181 338 168 349 166 364 C181 379 219 379 234 364 C232 349 219 338 200 338 Z" fill="#1a1309" stroke="#d8b26a" stroke-opacity="0.5"/>
    <path d="M166 364 C144 404 136 452 134 500 M234 364 C256 404 264 452 266 500" stroke="#d8b26a" stroke-opacity="0.28" fill="none"/>
    <circle cx="200" cy="398" r="2.4" fill="#d8b26a" opacity="0.6"/><circle cx="200" cy="426" r="2.4" fill="#d8b26a" opacity="0.6"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500" role="img" aria-labelledby="t${i}">
  <title id="t${i}">${esc(p.name)} — portrait</title>
  <defs>
    <linearGradient id="pbg${i}" x1="0" y1="0" x2="0.8" y2="1">
      <stop offset="0" stop-color="#46331b"/><stop offset="0.55" stop-color="#241a0f"/><stop offset="1" stop-color="#0b0805"/>
    </linearGradient>
    <radialGradient id="pglow${i}" cx="50%" cy="34%" r="46%">
      <stop offset="0" stop-color="#e2c184" stop-opacity="0.26"/><stop offset="1" stop-color="#d8b26a" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="face${i}" cx="46%" cy="40%" r="62%">
      <stop offset="0" stop-color="#4a3418"/><stop offset="0.7" stop-color="#2c1e10"/><stop offset="1" stop-color="#1b120a"/>
    </radialGradient>
    <pattern id="pgrain${i}" width="4" height="4" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="0.45" fill="#fff" opacity="0.05"/>
    </pattern>
  </defs>
  <rect width="400" height="500" fill="url(#pbg${i})"/>
  <rect width="400" height="500" fill="url(#pglow${i})"/>
  <g stroke="#d8b26a" stroke-width="1" opacity="0.08">${hatch.join('')}</g>
  <text x="16" y="452" font-family="Georgia,serif" font-size="150" font-weight="700" fill="#d8b26a" opacity="0.05">${esc(initials)}</text>
  <g transform="translate(0,42) scale(0.86)" transform-origin="200 250">
  ${head}
  <ellipse cx="200" cy="207" rx="52" ry="64" fill="url(#face${i})"/>
  ${hair}
  <g stroke="#d8b26a" stroke-opacity="0.55" stroke-width="1.6" fill="none">
    <path d="M165 188 q11 -6 23 -1"/><path d="M212 187 q11 -5 23 1"/>
    <ellipse cx="176" cy="202" rx="9" ry="4.5"/><ellipse cx="224" cy="202" rx="9" ry="4.5"/>
    <circle cx="176" cy="202" r="1.8" fill="#d8b26a" stroke="none"/><circle cx="224" cy="202" r="1.8" fill="#d8b26a" stroke="none"/>
    <path d="M200 205 v22 q0 4 -5 6"/>
    <path d="M186 255 q14 4 28 0"/>
    <path d="M171 271 q13 12 29 12"/>
    <path d="M146 212 q-7 18 1 32"/><path d="M254 212 q7 18 -1 32"/>
  </g>
  <g stroke="#d8b26a" stroke-opacity="0.16" fill="none">
    <path d="M162 216 q4 26 16 40"/><path d="M156 232 q4 18 14 30"/>
    <path d="M238 216 q-4 26 -16 40"/><path d="M244 232 q-4 18 -14 30"/>
  </g>
  ${moustache}
  ${beard}
  ${glasses}
  ${collar}
  </g>
  <rect width="400" height="500" fill="url(#pgrain${i})"/>
  <g stroke="#d8b26a" stroke-opacity="0.35" fill="none">
    <path d="M16 16 h26 M16 16 v26"/><path d="M384 16 h-26 M384 16 v26"/>
    <path d="M16 484 h26 M16 484 v-26"/><path d="M384 484 h-26 M384 484 v-26"/>
  </g>
  <rect x="0" y="458" width="400" height="42" fill="#080502" opacity="0.78"/>
  <g font-family="'JetBrains Mono',Consolas,monospace" font-size="8.5" fill="#a8926c" letter-spacing="2">
    <text x="20" y="482">${esc(p.name.toUpperCase())}</text>
    <text x="380" y="482" text-anchor="end">${esc(p.years)}</text>
  </g>
</svg>
`;
}

function posterSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="900" viewBox="0 0 640 900" role="img" aria-labelledby="pt pd">
  <title id="pt">Sykes–Picot — a screenplay in 42 chapters</title>
  <desc id="pd">Poster: an ink-drawn map of the Levant divided by a single ochre line.</desc>
  <defs>
    <linearGradient id="pbg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1a1208"/><stop offset="0.5" stop-color="#0d0905"/><stop offset="1" stop-color="#050302"/>
    </linearGradient>
    <radialGradient id="pglow" cx="50%" cy="34%" r="70%">
      <stop offset="0" stop-color="#d8b26a" stop-opacity="0.18"/><stop offset="1" stop-color="#d8b26a" stop-opacity="0"/>
    </radialGradient>
    <pattern id="pgrain" width="5" height="5" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="0.5" fill="#fff" opacity="0.04"/>
    </pattern>
  </defs>
  <rect width="640" height="900" fill="url(#pbg)"/>
  <rect width="640" height="900" fill="url(#pglow)"/>
  <rect width="640" height="900" fill="url(#pgrain)"/>

  <g fill="none" stroke="#6b5330" stroke-width="1" opacity="0.6">
    <path d="M40 40 h40 M40 40 v40"/><path d="M600 40 h-40 M600 40 v40"/>
    <path d="M40 860 h40 M40 860 v-40"/><path d="M600 860 h-40 M600 860 v-40"/>
  </g>

  <text x="320" y="120" text-anchor="middle" font-family="'JetBrains Mono',Consolas,monospace" font-size="11" fill="#d8b26a" letter-spacing="7">MASS-Q-RADE · AN ORIGINAL SCREENPLAY</text>
  <text x="320" y="198" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-size="62" font-weight="700" fill="#efe3cb" letter-spacing="3">SYKES–PICOT</text>
  <text x="320" y="238" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="19" fill="#c9b18a">A line drawn in 1916, still being lived in.</text>

  <g fill="none" stroke="#8d6f3d" stroke-width="1.1" opacity="0.7">
    <path d="M80 320 q40 -26 90 -10 t110 6 t120 -18 t90 10 t70 -6"/>
    <path d="M80 344 q50 22 100 4 t110 8 t120 -12 t90 6 t60 -4" stroke-dasharray="3 7"/>
    <path d="M70 470 q60 -40 120 -14 t110 10 t120 -26 t110 12"/>
    <path d="M70 498 q40 30 110 12 t110 -6 t120 18 t80 -8" stroke-dasharray="3 7"/>
  </g>

  <g fill="none" stroke="#a4442f" stroke-width="2" opacity="0.9">
    <path d="M120 430 L250 388 L360 430 L470 366 L560 400"/>
  </g>
  <circle cx="360" cy="430" r="4" fill="#d8b26a"/>
  <circle cx="360" cy="430" r="12" fill="none" stroke="#d8b26a" stroke-opacity="0.4"/>

  <circle cx="320" cy="560" r="86" fill="none" stroke="#8d6f3d" stroke-opacity="0.5"/>
  <circle cx="320" cy="560" r="62" fill="none" stroke="#8d6f3d" stroke-opacity="0.35" stroke-dasharray="2 6"/>
  <text x="320" y="548" text-anchor="middle" font-family="'JetBrains Mono',Consolas,monospace" font-size="34" fill="#d8b26a" letter-spacing="2">1916</text>
  <text x="320" y="578" text-anchor="middle" font-family="'JetBrains Mono',Consolas,monospace" font-size="9" fill="#a8926c" letter-spacing="4">SECRET</text>

  <text x="320" y="742" text-anchor="middle" font-family="'JetBrains Mono',Consolas,monospace" font-size="10" fill="#c9b18a" letter-spacing="5">42 CHAPTERS · 4 ACTS · 100 YEARS</text>
  <path d="M220 770 H420" stroke="#5a4526"/>
  <text x="320" y="806" text-anchor="middle" font-family="Georgia,serif" font-size="14" fill="#9a8666">Mark Sykes · François Georges-Picot</text>
  <text x="320" y="828" text-anchor="middle" font-family="Georgia,serif" font-size="14" fill="#9a8666">and everyone who had to live on the line</text>
</svg>
`;
}

const totalWords = chapters.reduce((s, c) => s + wordCount(c.html), 0);
const chaptersJson = chapters.map(c => ({ n: c.n, title: c.title, act: c.act, place: c.place, words: wordCount(c.html), html: c.html.trim() }));

const castCards = cast.map(p => `
        <article class="cast">
            <img class="cast-portrait" src="Sykes-Picot-Cast/${p.slug}.svg" alt="Portrait of ${esc(p.name)}" loading="lazy">
            <div class="flex items-start justify-between gap-2 mt-3">
                <h3 class="font-cinzel text-sm text-slate-100">${esc(p.name)}</h3>
                <button onclick="jump(${p.chapter})" class="mono text-[9px] uppercase tracking-widest text-amber-400/80 hover:text-amber-300" title="Chapter ${p.chapter}: ${esc(p.bio.slice(0, 40))}…">ch ${p.chapter}</button>
            </div>
            <p class="mono text-[9px] uppercase tracking-[.2em] text-[#a4442f] mt-1">${esc(p.role)} &middot; ${esc(p.years)}</p>
            <p class="text-[13px] text-slate-400 leading-relaxed mt-2">${esc(p.bio)}</p>
            <p class="text-[12px] text-slate-300 mt-2"><span class="mono text-[9px] uppercase tracking-widest text-slate-500">Wants</span> ${esc(p.want)}</p>
        </article>`).join('');

const cardsGrid = chapters.map(c => `
        <button class="card" onclick="jump(${c.n})" aria-label="Chapter ${c.n}: ${esc(c.title)}">
            <img src="Sykes-Picot-Cards/ch${String(c.n).padStart(2, '0')}.svg" alt="" loading="lazy">
            <span class="card-meta"><b>${String(c.n).padStart(2, '0')}</b><span>${esc(c.title)}</span></span>
        </button>`).join('');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SYKES–PICOT — A Screenplay in 42 Chapters | Mass-Q-Rade</title>
    <meta name="description" content="Sykes–Picot — a 42-chapter screenplay. Two diplomats draw a line across the Ottoman Empire in 1916; four generations of one family live on it.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;700&family=Crimson+Pro:ital@0;1&display=swap" rel="stylesheet">
    <style>
        :root { --ink:#0b0907; --panel:#141009; --line:#2a2115; --sand:#d8b26a; --red:#a4442f; --bone:#efe3cb; }
        body { background-color: var(--ink); color:#e6dccb; font-family:'Inter',sans-serif; }
        .mono { font-family:'JetBrains Mono', monospace; }
        .font-cinzel { font-family:'Cinzel', serif; letter-spacing:.08em; }
        .glass { background: linear-gradient(180deg,#151009,#0b0805); box-shadow:0 25px 60px -25px #000, 0 0 0 1px #2a2115; }
        ::-webkit-scrollbar { width:8px; height:8px; }
        ::-webkit-scrollbar-track { background:#0b0907; }
        ::-webkit-scrollbar-thumb { background:#2a2115; border-radius:4px; }
        ::-webkit-scrollbar-thumb:hover { background:#d8b26a; }
        .no-scrollbar::-webkit-scrollbar { display:none; }
        .no-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
        .script { font-family:'Crimson Pro', Georgia, serif; font-size:1.12rem; line-height:1.8; }
        .script p { margin:0 0 1.05rem; color:#e2d6c1; }
        .script .scene { margin:1.9rem 0 .9rem; font-family:'JetBrains Mono',monospace; font-size:.74rem;
            letter-spacing:.18em; text-transform:uppercase; color:var(--sand); }
        .script .scene:first-child { margin-top:0; }
        .script .say { margin:.85rem 0 0; }
        .script .say b { display:block; font-family:'JetBrains Mono',monospace; font-size:.7rem; letter-spacing:.16em;
            text-transform:uppercase; color:#d9805f; font-weight:400; }
        .script .trans { text-align:right; margin:1.6rem 0; font-family:'JetBrains Mono',monospace; font-size:.7rem;
            letter-spacing:.24em; text-transform:uppercase; color:#9a8666; }
        .script em { color:#f0e6d2; }
        .card { position:relative; border-radius:.6rem; overflow:hidden; border:1px solid #2a2115; background:#0b0805;
            transition:transform .25s, border-color .25s, box-shadow .25s; text-align:left; }
        .card:hover { transform:translateY(-3px); border-color:#d8b26a88; box-shadow:0 18px 40px -22px #000; }
        .card img { width:100%; height:auto; display:block; }
        .card-meta { display:flex; align-items:baseline; gap:.5rem; padding:.5rem .7rem .6rem; }
        .card-meta b { font-family:'JetBrains Mono',monospace; font-size:.62rem; color:var(--sand); letter-spacing:.1em; }
        .card-meta span { font-family:'JetBrains Mono',monospace; font-size:.58rem; letter-spacing:.12em; text-transform:uppercase;
            color:#8d7a58; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .cast { border:1px solid #2a2115; background:#0b0805; border-radius:.75rem; padding:.85rem; }
        .cast-portrait { display:block; width:100%; height:auto; border-radius:.5rem; border:1px solid #3a2d1a; }
        .synopsis p { font-family:'Crimson Pro', Georgia, serif; font-size:1.08rem; line-height:1.85; color:#d9cdb8; margin-bottom:1rem; }
        .fade-in { animation:fade .4s ease both; }
        @keyframes fade { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:none;} }
        .beat { background:#141009; border:1px solid #2a2115; border-radius:.75rem; padding:.9rem 1rem; }
        section[id] { scroll-margin-top: 5.5rem; }
        .slide { border:1px solid #3a2d1a; border-radius:.75rem; overflow:hidden; margin-bottom:1.8rem; }
        .slide img { display:block; width:100%; height:auto; }
    </style>
</head>
<body class="min-h-screen flex flex-col">

    <header class="sticky top-0 z-40 bg-[#0b0907]/92 backdrop-blur-md border-b border-[#2a2115]">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
            <a href="index.html" class="mono text-[11px] sm:text-sm tracking-[.28em] uppercase text-[#d8b26a]">MASS<span class="text-stone-600">-Q-</span>RADE</a>
            <nav class="hidden md:flex items-center gap-6 mono text-[10px] uppercase tracking-[.22em] text-stone-400">
                <a href="#book" class="hover:text-[#d8b26a] transition">The Script</a>
                <a href="#cast" class="hover:text-[#d8b26a] transition">Cast</a>
                <a href="#synopsis" class="hover:text-[#d8b26a] transition">Synopsis</a>
                <a href="#cards" class="hover:text-[#d8b26a] transition">42 Cards</a>
                <a href="#read" class="hover:text-[#d8b26a] transition">Read</a>
            </nav>
            <div class="flex items-center gap-2">
                <a href="Sykes-Picot%20Agreement%20-%20Screenplay.md" download class="px-3 py-2 rounded-lg border border-[#2a2115] hover:border-[#d8b26a]/60 text-[10px] mono uppercase tracking-widest text-stone-300 transition">.md</a>
                <a href="Sykes-Picot%20Agreement%20-%20Synopsis.md" download class="hidden sm:inline-block px-3 py-2 rounded-lg border border-[#2a2115] hover:border-[#d8b26a]/60 text-[10px] mono uppercase tracking-widest text-stone-300 transition">Synopsis</a>
                <a href="index.html" class="px-3 py-2 rounded-lg bg-[#d8b26a] hover:bg-[#e4c07a] text-black font-bold text-[10px] mono uppercase tracking-widest transition">Library</a>
            </div>
        </div>
    </header>

    <main class="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6">

        <section id="book" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-12 border-b border-[#1a1409]">
            <div class="lg:col-span-4 mx-auto w-full max-w-[300px]">
                <div class="rounded-xl overflow-hidden border border-[#4a3a20] shadow-2xl">
                    <img src="Mass-Q-Rade-Book-Covers/sykes-picot-poster.svg" alt="Sykes–Picot poster — an ink map divided by a single ochre line" class="w-full h-auto block">
                </div>
                <p class="mono text-[9px] uppercase tracking-[.25em] text-stone-500 text-center mt-3">A screenplay in 42 chapters</p>
            </div>
            <div class="lg:col-span-8 space-y-4">
                <p class="mono text-[10px] uppercase tracking-[.35em] text-[#d8b26a]/80">Mass-Q-Rade &middot; Historical Screenplay</p>
                <h1 class="font-cinzel text-3xl sm:text-5xl font-bold text-stone-50 leading-tight">SYKES–PICOT</h1>
                <p class="mono text-[11px] uppercase tracking-[.22em] text-[#c46a4f]">The line &middot; 1916 &middot; Four generations</p>
                <p class="text-stone-300 text-sm sm:text-base leading-relaxed font-light max-w-2xl">
                    In a small room in London, two diplomats divide an empire that is not theirs. What follows is not the history of a treaty but of the people who grew up inside it &mdash; a Damascus merchant, his daughter, her granddaughter, and the line they cannot stop explaining.
                </p>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 max-w-xl">
                    <div class="beat"><div class="mono text-[9px] uppercase text-stone-500">Chapters</div><div class="text-lg font-bold text-[#d8b26a]">42</div></div>
                    <div class="beat"><div class="mono text-[9px] uppercase text-stone-500">Acts</div><div class="text-lg font-bold text-[#d8b26a]">4</div></div>
                    <div class="beat"><div class="mono text-[9px] uppercase text-stone-500">Words</div><div class="text-lg font-bold text-[#d8b26a]">${totalWords.toLocaleString('en-US')}</div></div>
                    <div class="beat"><div class="mono text-[9px] uppercase text-stone-500">Years</div><div class="text-lg font-bold text-[#d8b26a]">1915–now</div></div>
                </div>
                <div class="flex flex-wrap gap-3 pt-1">
                    <button onclick="jump(1)" class="px-6 py-3 rounded-lg bg-[#d8b26a] hover:bg-[#e4c07a] text-black font-bold text-xs uppercase tracking-widest transition">Begin reading</button>
                    <a href="#cards" class="px-6 py-3 rounded-lg border border-[#2a2115] hover:border-[#d8b26a]/60 text-stone-200 text-xs uppercase tracking-widest transition">The 42 slides</a>
                </div>
            </div>
        </section>

        <section id="cast" class="py-12 border-b border-[#1a1409]">
            <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
                <div>
                    <p class="mono text-[10px] uppercase tracking-[.35em] text-[#d8b26a]/80">Dramatis Personae</p>
                    <h2 class="font-cinzel text-2xl sm:text-3xl text-stone-100 mt-1">Two Diplomats and a Family</h2>
                </div>
                <p class="text-xs text-stone-400 max-w-md">Click a chapter number to jump to where they arrive. Three characters are fictional; the rest are not.</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">${castCards}
            </div>
        </section>

        <section id="synopsis" class="py-12 border-b border-[#1a1409]">
            <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
                <div>
                    <p class="mono text-[10px] uppercase tracking-[.35em] text-[#d8b26a]/80">One Page</p>
                    <h2 class="font-cinzel text-2xl sm:text-3xl text-stone-100 mt-1">Synopsis</h2>
                </div>
                <a href="Sykes-Picot%20Agreement%20-%20Synopsis.md" download class="mono text-[10px] uppercase tracking-widest text-[#d8b26a]/80 hover:text-[#d8b26a] transition">Download one page &darr;</a>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div class="lg:col-span-4">
                    <div class="beat h-auto self-start">
                        <p class="mono text-[9px] uppercase tracking-[.3em] text-[#a4442f] mb-2">Logline</p>
                        <p class="font-cinzel text-base sm:text-lg leading-relaxed text-stone-100">When two diplomats secretly divide the Middle East in 1916, a Damascus map-seller and the four generations after him must live inside a border drawn by strangers &mdash; and decide whether to erase it, escape it, or finally explain it.</p>
                    </div>
                </div>
                <div class="lg:col-span-8 synopsis">
                    <p>December 1915. The war is deadlocked, the Ottoman Empire is coming apart, and the powers that will inherit it are already arguing over the pieces. Sir Mark Sykes, a rumpled Conservative MP with a gift for drawing lines, and François Georges-Picot, a French lawyer who believes the Levant belongs to France by history, meet in a small room in London. Neither is an expert on the country he is dividing. They agree on a map, initial a memorandum on 3 January 1916, and sign on 16 May &mdash; in secret, without consulting a single person who lives there.</p>
                    <p>Below them, in Damascus, Salim Haddad sells maps for a living. Hired to translate a British tracing sheet, he finds his own village spelled three different ways and divided between two colours. He writes the names down in a notebook and gives it to his daughter Nadia, who carries it to Haifa, and whose life is shaped by every promise that follows: the Arab Revolt, the Balfour Declaration, the leak in Petrograd, the peace conference, San Remo, the mandate, Maysalun, the Cairo Conference, the borders of 1948.</p>
                    <p>The century that follows is not a history of the treaty but of the people inside it. Coups in Damascus and Baghdad inherit the line and call it a revolution. Oil makes it valuable. Wars make it permanent. Nadia's granddaughter Lina grows up under sanctions, leaves for Berlin, and watches the line declared dead by a bulldozer in 2014 while knowing it is still the ground everyone stands on. On a ferry in the Aegean she meets a boy carrying a school atlas in a plastic bag &mdash; the only thing he saved.</p>
                    <p>In the last chapter, in a Berlin archive, Lina opens the original map with white gloves beside her great-grandmother's notebook. The archivist tells her it is only paper. She has spent her life learning that it is never only paper. She asks to catalogue the names.</p>
                </div>
            </div>
        </section>

        <section id="cards" class="py-12 border-b border-[#1a1409]">
            <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
                <div>
                    <p class="mono text-[10px] uppercase tracking-[.35em] text-[#d8b26a]/80">The Slides</p>
                    <h2 class="font-cinzel text-2xl sm:text-3xl text-stone-100 mt-1">Forty-Two Title Cards</h2>
                </div>
                <p class="text-xs text-stone-400 max-w-md">One slide per chapter. Click to read.</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">${cardsGrid}
            </div>
        </section>

        <section id="read" class="py-12">
            <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
                <div>
                    <p class="mono text-[10px] uppercase tracking-[.35em] text-[#d8b26a]/80">The Script</p>
                    <h2 class="font-cinzel text-2xl sm:text-3xl text-stone-100 mt-1">Read it</h2>
                </div>
                <div class="flex items-center gap-2 bg-[#0b0805] border border-[#2a2115] rounded-xl p-1.5">
                    <button id="mode-slide" onclick="setMode('slide')" class="px-3 py-2 rounded-lg mono text-[10px] uppercase tracking-widest bg-[#d8b26a] text-black font-bold transition">One chapter</button>
                    <button id="mode-full" onclick="setMode('full')" class="px-3 py-2 rounded-lg mono text-[10px] uppercase tracking-widest text-stone-400 hover:text-white transition">Full script</button>
                </div>
            </div>

            <div class="flex items-center justify-between gap-3 mb-3">
                <span id="chapter-label" class="mono text-[10px] uppercase tracking-[.25em] text-stone-400">Chapter 1 of 42</span>
                <span id="progress-text" class="mono text-[10px] uppercase tracking-[.25em] text-[#d8b26a]/80">0% read</span>
            </div>
            <div class="h-1 w-full bg-[#1a1409] rounded-full overflow-hidden mb-5">
                <div id="progress-bar" class="h-full bg-gradient-to-r from-[#a4442f] to-[#d8b26a] transition-all duration-500" style="width:0%"></div>
            </div>

            <div id="chapter-pills" class="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-5 sm:flex-wrap sm:overflow-visible"></div>
            <div id="book-stage" class="glass rounded-2xl p-6 sm:p-10"></div>

            <div class="flex items-center justify-between gap-3 mt-5">
                <button id="prev-btn" onclick="changeChapter(-1)" class="px-4 py-3 rounded-lg border border-[#2a2115] hover:border-[#d8b26a]/60 disabled:opacity-40 text-stone-200 mono text-[10px] uppercase tracking-widest transition">Previous</button>
                <button onclick="markRead()" class="px-4 py-3 rounded-lg bg-[#1a1409] border border-[#5a4526]/60 hover:border-[#d8b26a]/70 text-[#e4c07a] mono text-[10px] uppercase tracking-widest transition">Mark chapter read</button>
                <button id="next-btn" onclick="changeChapter(1)" class="px-4 py-3 rounded-lg bg-[#d8b26a] hover:bg-[#e4c07a] disabled:opacity-40 text-black font-bold mono text-[10px] uppercase tracking-widest transition">Next</button>
            </div>
        </section>
    </main>

    <footer class="border-t border-[#1a1409] py-8">
        <div class="max-w-6xl mx-auto px-4 text-center space-y-2">
            <p class="mono text-[11px] tracking-[.25em] uppercase text-stone-400">Mass-Q-Rade &middot; Sykes–Picot</p>
            <p class="text-xs text-stone-500">A historical screenplay by Amim Ahsan. Salim, Nadia and Lina Haddad are fictional; the events around them are not.</p>
            <div class="flex justify-center gap-5 mono text-[10px] uppercase tracking-widest text-stone-500">
                <a href="index.html" class="hover:text-[#d8b26a] transition">Library</a>
                <a href="index.html#books" class="hover:text-[#d8b26a] transition">All books</a>
                <a href="Sykes-Picot%20Agreement%20-%20Screenplay.md" download class="hover:text-[#d8b26a] transition">Source .md</a>
            </div>
        </div>
    </footer>

    <div id="toast" class="fixed bottom-5 right-5 z-50 transform translate-y-20 opacity-0 transition-all duration-300 pointer-events-none">
        <div class="bg-[#151009] border border-[#d8b26a]/50 text-[#efe3cb] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
            <span class="w-2 h-2 rounded-full bg-[#d8b26a]"></span><span id="toast-message" class="text-xs">Saved</span>
        </div>
    </div>

    <script>
    const CHAPTERS = ${JSON.stringify(chaptersJson)};
    const ACTS = [
        { until: 10, name: 'Act I' },
        { until: 20, name: 'Act II' },
        { until: 32, name: 'Act III' },
        { until: 42, name: 'Act IV' }
    ];
    const actOf = n => (ACTS.find(a => n <= a.until) || ACTS[3]).name;

    const stage = document.getElementById('book-stage');
    const pills = document.getElementById('chapter-pills');
    const label = document.getElementById('chapter-label');
    const bar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    let current = 1;
    let mode = 'slide';
    let readSet = new Set();
    try { readSet = new Set(JSON.parse(localStorage.getItem('sp-read') || '[]')); } catch (e) {}

    function renderPills() {
        pills.innerHTML = CHAPTERS.map(c =>
            '<button onclick="jump(' + c.n + ')" title="' + c.title.replace(/"/g, '&quot;') + '" class="shrink-0 w-9 h-9 rounded-lg mono text-[11px] border transition ' +
            (c.n === current ? 'bg-[#d8b26a] text-black border-[#d8b26a] font-bold' :
                readSet.has(c.n) ? 'bg-[#1a1409] text-[#d8b26a] border-[#5a4526]/60' : 'bg-[#0b0805] text-stone-500 border-[#2a2115] hover:border-[#d8b26a]/50') +
            '">' + c.n + '</button>'
        ).join('');
    }

    function chapterHtml(c) {
        return '<div class="fade-in">' +
            '<div class="flex items-center justify-between gap-3 mb-3">' +
                '<p class="mono text-[9px] uppercase tracking-[.3em] text-[#a4442f]">' + c.act + ' &middot; Chapter ' + c.n + '</p>' +
                '<p class="mono text-[9px] uppercase tracking-[.2em] text-stone-500">' + c.words + ' words</p>' +
            '</div>' +
            (mode === 'slide'
                ? '<div class="slide"><img src="Sykes-Picot-Cards/ch' + String(c.n).padStart(2, '0') + '.svg" alt="Title slide for chapter ' + c.n + ': ' + c.title + '"></div>'
                : '<h3 class="font-cinzel text-xl sm:text-2xl text-stone-100 mb-1">' + c.title + '</h3>' +
                  '<p class="mono text-[9px] uppercase tracking-[.2em] text-stone-500 mb-6">' + c.place + '</p>') +
            '<div class="script">' + c.html + '</div></div>';
    }

    function render(scroll) {
        if (mode === 'full') {
            stage.innerHTML = '<div class="fade-in space-y-10">' + CHAPTERS.map(chapterHtml).join('') + '</div>';
            label.textContent = 'Full script \\u00b7 ' + CHAPTERS.length + ' chapters';
        } else {
            const c = CHAPTERS.find(x => x.n === current);
            stage.innerHTML = chapterHtml(c);
            label.textContent = 'Chapter ' + current + ' of ' + CHAPTERS.length;
        }
        document.getElementById('prev-btn').disabled = mode === 'full' || current === 1;
        document.getElementById('next-btn').disabled = mode === 'full' || current === CHAPTERS.length;
        renderPills();
        updateProgress();
        if (scroll) stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function jump(n) {
        current = Math.min(CHAPTERS.length, Math.max(1, n));
        if (mode === 'full') { mode = 'slide'; setModeButtons(); }
        render(true);
    }

    function changeChapter(d) { jump(current + d); }

    function setModeButtons() {
        document.getElementById('mode-slide').className = 'px-3 py-2 rounded-lg mono text-[10px] uppercase tracking-widest transition ' +
            (mode === 'slide' ? 'bg-[#d8b26a] text-black font-bold' : 'text-stone-400 hover:text-white');
        document.getElementById('mode-full').className = 'px-3 py-2 rounded-lg mono text-[10px] uppercase tracking-widest transition ' +
            (mode === 'full' ? 'bg-[#d8b26a] text-black font-bold' : 'text-stone-400 hover:text-white');
    }

    function setMode(m) { mode = m; setModeButtons(); render(); }

    function markRead() {
        readSet.add(current);
        try { localStorage.setItem('sp-read', JSON.stringify([...readSet])); } catch (e) {}
        toast('Chapter ' + current + ' marked read');
        renderPills();
        updateProgress();
    }

    function updateProgress() {
        const pct = Math.round(readSet.size / CHAPTERS.length * 100);
        bar.style.width = pct + '%';
        progressText.textContent = pct + '% read';
    }

    let toastTimer;
    function toast(msg) {
        const el = document.getElementById('toast');
        document.getElementById('toast-message').textContent = msg;
        el.classList.remove('translate-y-20', 'opacity-0');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => el.classList.add('translate-y-20', 'opacity-0'), 2200);
    }

    setModeButtons();
    render(false);
    </script>
</body>
</html>
`;

fs.mkdirSync(path.join(ROOT, 'Sykes-Picot-Cards'), { recursive: true });
chapters.forEach(c => {
  fs.writeFileSync(path.join(ROOT, 'Sykes-Picot-Cards', `ch${String(c.n).padStart(2, '0')}.svg`), cardSvg(c));
});
fs.mkdirSync(path.join(ROOT, 'Sykes-Picot-Cast'), { recursive: true });
cast.forEach((p, i) => {
  fs.writeFileSync(path.join(ROOT, 'Sykes-Picot-Cast', `${p.slug}.svg`), portraitSvg(p, i));
});
fs.writeFileSync(path.join(ROOT, 'Mass-Q-Rade-Book-Covers', 'sykes-picot-poster.svg'), posterSvg());
fs.writeFileSync(path.join(ROOT, 'Sykes-Picot Agreement.html'), html);

let md = `# SYKES–PICOT\n\n*A historical screenplay in 42 chapters.*\n\nIn a small room in London, two diplomats divide an empire that is not theirs. What follows is not the history of a treaty but of the people who grew up inside it — a Damascus merchant, his daughter, her granddaughter, and the line they cannot stop explaining.\n\nSalim, Nadia and Lina Haddad are fictional. The events around them are not.\n\n---\n\n`;
for (const c of chapters) {
  md += `## CHAPTER ${String(c.n).padStart(2, '0')} — ${c.title}\n\n*${c.act} · ${c.place}*\n\n`;
  const body = c.html
    .replace(/<div class="scene">([\s\S]*?)<\/div>/g, '\n**$1**\n')
    .replace(/<div class="say"><b>([\s\S]*?)<\/b><\/div>/g, '\n**$1**\n')
    .replace(/<div class="trans">([\s\S]*?)<\/div>/g, '\n*$1*\n')
    .replace(/<\/p>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&mdash;/g, '—').replace(/&middot;/g, '·')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  md += body + '\n\n---\n\n';
}
md += `*Mass-Q-Rade · Sykes–Picot · A screenplay by Amim Ahsan.*\n`;
fs.writeFileSync(path.join(ROOT, 'Sykes-Picot Agreement - Screenplay.md'), md);

const synopsisMd = `# SYKES–PICOT

### A historical screenplay in 42 chapters

**Logline**

When two diplomats secretly divide the Middle East in 1916, a Damascus map-seller and the four generations after him must live inside a border drawn by strangers — and decide whether to erase it, escape it, or finally explain it.

---

## Synopsis

December 1915. The war is deadlocked, the Ottoman Empire is coming apart, and the powers that will inherit it are already arguing over the pieces. Sir Mark Sykes, a rumpled Conservative MP with a gift for drawing lines, and François Georges-Picot, a French lawyer who believes the Levant belongs to France by history, meet in a small room in London. Neither is an expert on the country he is dividing. They agree on a map, initial a memorandum on 3 January 1916, and sign on 16 May — in secret, without consulting a single person who lives there.

Below them, in Damascus, Salim Haddad sells maps for a living. Hired to translate a British tracing sheet, he finds his own village spelled three different ways and divided between two colours. He writes the names down in a notebook and gives it to his daughter Nadia, who carries it to Haifa, and whose life is shaped by every promise that follows: the Arab Revolt, the Balfour Declaration, the leak in Petrograd, the peace conference, San Remo, the mandate, Maysalun, the Cairo Conference, the borders of 1948.

The century that follows is not a history of the treaty but of the people inside it. Coups in Damascus and Baghdad inherit the line and call it a revolution. Oil makes it valuable. Wars make it permanent. Nadia's granddaughter Lina grows up under sanctions, leaves for Berlin, and watches the line declared dead by a bulldozer in 2014 while knowing it is still the ground everyone stands on. On a ferry in the Aegean she meets a boy carrying a school atlas in a plastic bag — the only thing he saved.

In the last chapter, in a Berlin archive, Lina opens the original map with white gloves beside her great-grandmother's notebook. The archivist tells her it is only paper. She has spent her life learning that it is never only paper. She asks to catalogue the names.

---

*42 chapters · 4 acts · 1915 to the present · Mass-Q-Rade*\n`;
fs.writeFileSync(path.join(ROOT, 'Sykes-Picot Agreement - Synopsis.md'), synopsisMd);

console.log('chapters', chapters.length, 'words', totalWords, 'cards + portraits written');
