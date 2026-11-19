// Per-chapter title-slide scenes. Each returns SVG layers drawn on a 640x360
// canvas beneath the card's typography. Palettes shift by act so the slide set
// reads as one continuous film: sepia 1915 -> ember 1916-18 -> slate 1919-48
// -> ash 1948-2014.

export const palettes = {
  I: { sky: ['#3d2d18', '#150e08'], glow: '#eabf76', rim: '#f0d4a2', haze: '#4a3519' },
  II: { sky: ['#402017', '#150b07'], glow: '#e08a5c', rim: '#f4bd92', haze: '#4d2519' },
  III: { sky: ['#1e2e38', '#0a1116'], glow: '#aec4ce', rim: '#cfe2ea', haze: '#243640' },
  IV: { sky: ['#26292c', '#0e1013'], glow: '#d9c8a8', rim: '#e6dcc6', haze: '#32322e' },
};

// Silhouettes are a shade lighter than the ground so their mass reads, not just
// their rim light.
const ink = '#0b0705';

// deterministic jitter so a scene used twice is never identical
const r = (n, k) => ((n * 41 + k * 97) % 89) / 89;

const rim = (d, P, o = 0.55, w = 1.3) =>
  `<path d="${d}" fill="none" stroke="${P.rim}" stroke-opacity="${o}" stroke-width="${w}" stroke-linecap="round"/>`;

const solid = (d, fill = ink, o = 1) => `<path d="${d}" fill="${fill}" opacity="${o}"/>`;

const ground = (P, y = 252) =>
  `<path d="M0 ${y} H640 V360 H0 Z" fill="#050403"/>` +
  `<path d="M0 ${y} H640" stroke="${P.rim}" stroke-opacity="0.3"/>`;

/* ---------- individual scenes ---------- */

function table(c, P) {
  const lx = 188, ly = 92;
  return `
  ${ground(P, 272)}
  <g>${rim(`M${lx} 0 V${ly - 8}`, P, 0.45)}</g>
  <path d="M${lx - 30} ${ly + 24} L${lx + 32} ${ly + 24} L${lx + 78} 320 L${lx - 78} 320 Z" fill="${P.rim}" opacity="0.05"/>
  <ellipse cx="${lx}" cy="${ly}" rx="32" ry="8" fill="${ink}" stroke="${P.rim}" stroke-opacity="0.8"/>
  <path d="M${lx - 13} ${ly + 7} h26 l7 34 h-40 Z" fill="${ink}" stroke="${P.rim}" stroke-opacity="0.55"/>
  <ellipse cx="${lx}" cy="${ly + 45}" rx="10" ry="3.4" fill="${P.rim}" opacity="0.6"/>
  <!-- wall map -->
  <g>
    <rect x="404" y="104" width="196" height="108" fill="#0c0805" stroke="${P.rim}" stroke-opacity="0.55"/>
    ${rim('M416 178 C462 162 486 186 522 166 C548 152 572 158 588 146', P, 0.7, 1.5)}
    ${rim('M416 190 C462 176 488 198 524 180 C550 166 574 172 588 162', P, 0.32, 1)}
    <circle cx="486" cy="168" r="3" fill="${P.rim}" opacity="0.85"/>
    <circle cx="546" cy="158" r="2.6" fill="${P.rim}" opacity="0.6"/>
  </g>
  <!-- members behind the table -->
  <g fill="${ink}" stroke="${P.rim}" stroke-opacity="0.55" stroke-width="1.3">
    <path d="M212 292 c0 -32 18 -44 40 -44 s40 12 40 44 Z"/>
    <ellipse cx="252" cy="238" rx="19" ry="5"/>
    <path d="M320 292 c0 -30 18 -42 38 -42 s38 12 38 42 Z"/>
    <ellipse cx="358" cy="243" rx="18" ry="5"/>
    <path d="M430 292 c0 -26 15 -36 32 -36 s32 10 32 36 Z"/>
    <ellipse cx="462" cy="250" rx="15" ry="4"/>
  </g>
  ${rim('M214 284 c14 -22 36 -28 54 -18', P, 0.4)}
  ${rim('M322 284 c14 -20 34 -26 50 -16', P, 0.35)}
  <!-- table with the tracing paper -->
  <path d="M108 292 H596 L624 318 H80 Z" fill="#1a1108" stroke="${P.rim}" stroke-opacity="0.6"/>
  <path d="M80 318 V360 M624 318 V360" stroke="${P.rim}" stroke-opacity="0.35" stroke-width="2"/>
  <g fill="#1b1309" stroke="${P.rim}" stroke-opacity="0.6">
    <rect x="236" y="288" width="80" height="40" transform="rotate(-5 276 308)"/>
    <rect x="256" y="292" width="72" height="34" transform="rotate(4 292 309)"/>
    <rect x="470" y="296" width="64" height="30" transform="rotate(-3 502 311)"/>
  </g>`;
}

function tents(c, P) {
  const n = c.n;
  const moonX = 470 + r(n, 1) * 60, moonY = 78;
  return `
  ${ground(P, 258)}
  <circle cx="${moonX}" cy="${moonY}" r="16" fill="${P.rim}" opacity="0.75"/>
  <circle cx="${moonX + 7}" cy="${moonY - 4}" r="15" fill="${P.sky[0]}"/>
  <g fill="${P.rim}" opacity="0.5">
    <circle cx="${moonX + 110}" cy="52" r="1.4"/><circle cx="${moonX + 140}" cy="96" r="1"/>
    <circle cx="${moonX - 90}" cy="40" r="1.1"/><circle cx="${moonX + 60}" cy="122" r="0.9"/>
  </g>
  <path d="M0 262 C120 232 200 250 300 258 C420 266 520 244 640 254 V360 H0 Z" fill="#0a0705"/>
  <path d="M0 274 C150 256 250 272 360 276 C470 280 560 262 640 268" fill="none" stroke="${P.rim}" stroke-opacity="0.16"/>
  <!-- tents -->
  <g fill="${ink}" stroke="${P.rim}" stroke-opacity="0.72">
    <path d="M196 286 L258 214 L320 286 Z"/>
    <path d="M258 214 L258 286" stroke-opacity="0.3"/>
    <path d="M290 286 L336 232 L382 286 Z"/>
    <path d="M126 288 L166 246 L206 288 Z"/>
  </g>
  ${rim('M196 286 L258 214', P, 0.6)}
  ${rim('M320 286 L258 214', P, 0.25)}
  <!-- poles and guy ropes -->
  <g stroke="${P.rim}" stroke-opacity="0.28">
    <path d="M258 214 V198"/><path d="M336 232 V218"/><path d="M166 246 V234"/>
    <path d="M258 198 L226 288 M258 198 L292 288 M336 218 L310 288 M336 218 L364 288"/>
  </g>
  <!-- distant caravan -->
  <g fill="${ink}" opacity="0.85">
    <path d="M452 262 c4 -8 12 -10 14 -2 c6 -2 8 4 4 8 h-18 Z"/>
    <path d="M486 264 c5 -9 14 -11 16 -2 c7 -2 9 4 5 9 h-21 Z"/>
    <path d="M520 262 c4 -8 12 -10 14 -2 c6 -2 8 4 4 8 h-18 Z"/>
  </g>`;
}

function river(c, P) {
  return `
  ${ground(P, 244)}
  <rect x="0" y="244" width="640" height="116" fill="#080b0e"/>
  <path d="M0 250 H640" stroke="${P.rim}" stroke-opacity="0.18"/>
  <g stroke="${P.rim}" stroke-opacity="0.14">
    <path d="M120 266 h90 M320 280 h120 M170 296 h70 M420 302 h100 M60 312 h120"/>
  </g>
  <!-- quai facade -->
  <g fill="${ink}" stroke="${P.rim}" stroke-opacity="0.45">
    <path d="M356 244 V150 h84 v-16 h96 v110 Z"/>
    <path d="M356 150 l14 -14 h70 v14"/>
    <path d="M470 134 l16 -16 h50 v16"/>
  </g>
  <g fill="${P.rim}" opacity="0.45">
    <rect x="374" y="170" width="10" height="16"/><rect x="396" y="170" width="10" height="16"/>
    <rect x="418" y="170" width="10" height="16"/><rect x="456" y="156" width="10" height="16"/>
    <rect x="482" y="156" width="10" height="16"/><rect x="508" y="156" width="10" height="16"/>
  </g>
  <!-- bridge -->
  <g fill="none" stroke="${P.rim}" stroke-opacity="0.55" stroke-width="1.6">
    <path d="M0 244 C60 206 148 206 208 244"/>
    <path d="M208 244 C268 216 336 216 396 244"/>
    <path d="M0 232 H420"/>
  </g>
  ${ground(P, 244).replace('M0 244 H640', 'M0 244 H200')}
  <!-- lamp post -->
  <g stroke="${P.rim}" stroke-opacity="0.6" stroke-width="1.3" fill="none">
    <path d="M264 244 V176 M264 176 C264 166 276 162 284 168"/>
    <path d="M284 168 h14"/>
  </g>
  <circle cx="302" cy="172" r="5" fill="${P.rim}" opacity="0.85"/>
  <circle cx="302" cy="172" r="22" fill="${P.rim}" opacity="0.08"/>
  <path d="M302 178 L268 244 H340 Z" fill="${P.rim}" opacity="0.05"/>`;
}

function mapSheet(c, P) {
  const n = c.n;
  const dy = r(n, 2) * 14;
  return `
  ${ground(P, 300)}
  <g transform="rotate(-3 400 180)">
    <rect x="256" y="58" width="330" height="204" fill="#141008" stroke="${P.rim}" stroke-opacity="0.55"/>
    <g stroke="${P.rim}" stroke-opacity="0.14">
      ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M256 ${86 + i * 30} H586"/>`).join('')}
      ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<path d="M${286 + i * 40} 58 V262"/>`).join('')}
    </g>
    <path d="M282 226 C330 200 360 214 402 186 C446 158 480 170 548 130" fill="none" stroke="#a4442f" stroke-opacity="0.85" stroke-width="1.7"/>
    <path d="M282 240 C332 216 366 228 408 202 C452 176 486 186 552 148" fill="none" stroke="#a4442f" stroke-opacity="0.4" stroke-width="1.1" stroke-dasharray="4 5"/>
    <g fill="none" stroke="${P.rim}" stroke-opacity="0.3">
      <path d="M300 120 C340 108 372 126 410 116"/>
      <path d="M300 140 C342 130 374 146 412 136"/>
      <path d="M440 96 C480 88 512 100 552 92"/>
    </g>
    <g fill="${P.rim}">
      <circle cx="352" cy="196" r="2.8"/><circle cx="430" cy="168" r="2.4" opacity="0.75"/>
      <circle cx="492" cy="140" r="2.4" opacity="0.75"/><circle cx="318" cy="214" r="2" opacity="0.5"/>
    </g>
    <g fill="none" stroke="${P.rim}" stroke-opacity="0.5">
      <circle cx="430" cy="168" r="10"/><path d="M430 154 v-8 M430 182 v8 M416 168 h-8 M444 168 h8"/>
    </g>
    <!-- hatching in the divided zone -->
    <g stroke="${P.rim}" stroke-opacity="0.12">
      ${[0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M${470 + i * 8} 96 L${420 + i * 8} 150"/>`).join('')}
    </g>
    <path d="M256 58 h330 v204 h-330 Z" fill="none" stroke="${P.rim}" stroke-opacity="0.2"/>
  </g>`;
}

function flags(c, P) {
  const poles = [[300, 128], [400, 104], [500, 140]];
  const cloth = [
    'M0 0 h56 v34 h-56 Z',
    'M0 0 h56 v34 h-56 Z',
    'M0 0 h56 v34 h-56 Z',
  ];
  const marks = [
    `<path d="M0 12 h56 M28 0 v34 M14 0 l14 34 M42 0 l-14 34" stroke="#8d7a58" stroke-opacity="0.8" fill="none"/>`,
    `<rect x="0" y="0" width="18" height="34" fill="#7e3a2c" opacity="0.7"/><rect x="36" y="0" width="20" height="34" fill="#8d7a58" opacity="0.6"/>`,
    `<rect x="0" y="0" width="56" height="11" fill="#1b2a22" opacity="0.9"/><rect x="0" y="11" width="56" height="11" fill="#8d7a58" opacity="0.6"/>`,
  ];
  return `
  ${ground(P, 286)}
  <!-- broken rooftops behind the poles -->
  <g fill="#0a0705" stroke="${P.rim}" stroke-opacity="0.45">
    <path d="M0 286 V244 h44 v-14 h30 v14 h52 v-22 h40 v22 h36 V286 Z"/>
    <path d="M470 286 V238 h34 v-16 h38 v16 h30 v-12 h32 v12 h36 V286 Z"/>
  </g>
  <g fill="${P.rim}" opacity="0.18">
    <rect x="16" y="254" width="8" height="10"/><rect x="34" y="254" width="8" height="10"/>
    <rect x="486" y="250" width="8" height="10"/><rect x="512" y="250" width="8" height="10"/>
  </g>
  ${poles.map(([x, y], i) => `
    <g>
      <path d="M${x} 286 V${y}" stroke="${P.rim}" stroke-opacity="0.6" stroke-width="1.4"/>
      <path d="${cloth[i]}" transform="translate(${x} ${y})" fill="${ink}" stroke="${P.rim}" stroke-opacity="0.4"/>
      <g transform="translate(${x} ${y})">${marks[i]}</g>
      <ellipse cx="${x}" cy="288" rx="26" ry="4" fill="${ink}" stroke="${P.rim}" stroke-opacity="0.2"/>
    </g>`).join('')}
  ${rim('M300 286 c10 -10 30 -12 40 0', P, 0.2)}`;
}

function desk(c, P) {
  const n = c.n;
  return `
  ${ground(P, 262)}
  <!-- shelf with rolled maps -->
  <g stroke="${P.rim}" stroke-opacity="0.4" fill="none">
    <path d="M420 96 H604 M420 148 H604"/>
  </g>
  <g fill="${ink}" stroke="${P.rim}" stroke-opacity="0.5">
    ${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${432 + i * 24}" y="${96 - 34 - (i % 3) * 4}" width="15" height="${34 + (i % 3) * 4}"/>`).join('')}
    ${[0, 1, 2].map(i => `<rect x="${446 + i * 40}" y="${148 - 40}" width="26" height="40" transform="rotate(${i * 2 - 2} ${459 + i * 40} 128)"/>`).join('')}
  </g>
  <!-- desk -->
  <path d="M212 ${n % 2 ? 264 : 268} H612 L588 300 H236 Z" fill="#120d07" stroke="${P.rim}" stroke-opacity="0.45"/>
  <path d="M236 300 V360 M588 300 V360" stroke="${P.rim}" stroke-opacity="0.25"/>
  <!-- lamp glow -->
  <path d="M330 0 V120" stroke="${P.rim}" stroke-opacity="0.35"/>
  <path d="M300 128 h60 l-16 -20 h-28 Z" fill="${ink}" stroke="${P.rim}" stroke-opacity="0.7"/>
  <path d="M300 128 L262 268 H404 L360 128 Z" fill="${P.rim}" opacity="0.06"/>
  <ellipse cx="332" cy="130" rx="10" ry="4" fill="${P.rim}" opacity="0.8"/>
  <!-- papers + compass -->
  <g fill="#1b1309" stroke="${P.rim}" stroke-opacity="0.45">
    <rect x="404" y="250" width="88" height="42" transform="rotate(-5 448 271)"/>
    <rect x="490" y="256" width="70" height="34" transform="rotate(6 525 273)"/>
  </g>
  <g fill="none" stroke="${P.rim}" stroke-opacity="0.65">
    <circle cx="300" cy="274" r="17"/><circle cx="300" cy="274" r="2"/>
    <path d="M300 258 l5 14 -5 -3 -5 3 Z" fill="${P.rim}" stroke="none" opacity="0.8"/>
  </g>
  <!-- ink pot and pen -->
  <path d="M376 272 h22 l-3 18 h-16 Z" fill="${ink}" stroke="${P.rim}" stroke-opacity="0.6"/>
  <path d="M388 268 L410 236" stroke="${P.rim}" stroke-opacity="0.7"/>
  <path d="M410 236 l7 -7 -1 9 Z" fill="${P.rim}" opacity="0.7"/>`;
}

function lab(c, P) {
  return `
  ${ground(P, 292)}
  <g stroke="${P.rim}" stroke-opacity="0.35" fill="none">
    <path d="M380 96 H604 M380 156 H604"/>
  </g>
  <g fill="${ink}" stroke="${P.rim}" stroke-opacity="0.5">
    ${[0, 1, 2, 3, 4].map(i => `<rect x="${392 + i * 28}" y="${96 - 26}" width="16" height="26"/>`).join('')}
    ${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${434 + i * 26}" y="${156 - 30 - (i % 2) * 6}" width="14" height="${30 + (i % 2) * 6}"/>`).join('')}
  </g>
  <!-- bench -->
  <rect x="228" y="292" width="392" height="12" fill="#120d07" stroke="${P.rim}" stroke-opacity="0.4"/>
  <path d="M250 304 V360 M596 304 V360" stroke="${P.rim}" stroke-opacity="0.2"/>
  <!-- retort stand + flask -->
  <g stroke="${P.rim}" stroke-opacity="0.6" fill="none">
    <path d="M396 292 V186 M372 292 h48"/>
    <path d="M396 200 h40"/>
  </g>
  <path d="M436 200 c0 10 -14 12 -14 24 c0 14 12 24 26 24 s26 -10 26 -24 c0 -12 -14 -14 -14 -24 Z" fill="${ink}" stroke="${P.rim}" stroke-opacity="0.85"/>
  <path d="M426 240 c6 -4 14 -4 20 0 c8 5 16 4 20 0 v8 c-10 6 -30 6 -40 0 Z" fill="${P.rim}" opacity="0.45"/>
  <path d="M432 192 h60" stroke="${P.rim}" stroke-opacity="0.4" stroke-dasharray="3 4"/>
  <!-- benzene ring -->
  <g fill="none" stroke="${P.rim}" stroke-opacity="0.55" transform="translate(512 190)">
    <path d="M0 -26 L23 -13 L23 13 L0 26 L-23 13 L-23 -13 Z"/>
    <circle r="13"/>
    <path d="M0 -26 V-42 M23 -13 L38 -21"/>
  </g>
  <!-- test tubes -->
  <g fill="${ink}" stroke="${P.rim}" stroke-opacity="0.7">
    <rect x="512" y="252" width="10" height="40" rx="5"/>
    <rect x="530" y="244" width="10" height="48" rx="5"/>
    <rect x="548" y="258" width="10" height="34" rx="5"/>
  </g>
  <g fill="${P.rim}" opacity="0.45">
    <rect x="512" y="274" width="10" height="18" rx="5"/>
    <rect x="530" y="268" width="10" height="24" rx="5"/>
    <rect x="548" y="278" width="10" height="14" rx="5"/>
  </g>
  <g fill="none" stroke="${P.rim}" stroke-opacity="0.3">
    <path d="M352 168 c-8 -10 6 -14 0 -24 c-6 -10 8 -12 2 -22"/>
    <path d="M362 172 c-7 -9 5 -13 0 -21"/>
  </g>`;
}

function seal(c, P) {
  const n = c.n;
  return `
  ${ground(P, 300)}
  <!-- candle -->
  <g>
    <rect x="470" y="196" width="18" height="104" fill="#171008" stroke="${P.rim}" stroke-opacity="0.5"/>
    <path d="M479 190 c12 -12 0 -22 0 -34 c-2 12 -14 22 0 34 Z" fill="${P.rim}" opacity="0.85"/>
    <circle cx="479" cy="176" r="34" fill="${P.rim}" opacity="0.1"/>
    <ellipse cx="479" cy="300" rx="24" ry="5" fill="${ink}" stroke="${P.rim}" stroke-opacity="0.35"/>
  </g>
  <!-- envelope -->
  <g transform="rotate(${n % 2 ? -4 : 3} 300 268)">
    <rect x="176" y="204" width="240" height="140" fill="#160f07" stroke="${P.rim}" stroke-opacity="0.55"/>
    <path d="M176 204 L296 282 L416 204" fill="none" stroke="${P.rim}" stroke-opacity="0.5"/>
    <circle cx="296" cy="286" r="21" fill="#5c1f16" stroke="${P.rim}" stroke-opacity="0.5"/>
    <circle cx="296" cy="286" r="14" fill="none" stroke="${P.rim}" stroke-opacity="0.35"/>
    <path d="M296 277 l4 6 7 1 -5 5 1 7 -7 -4 -7 4 1 -7 -5 -5 7 -1 Z" fill="${P.rim}" opacity="0.75"/>
  </g>
  <!-- pen on the table -->
  <path d="M430 292 L520 258" stroke="${P.rim}" stroke-opacity="0.5" stroke-width="2"/>
  <path d="M520 258 l10 -4 -4 10 Z" fill="${P.rim}" opacity="0.6"/>`;
}

function camp(c, P) {
  return `
  ${ground(P, 248)}
  <circle cx="486" cy="108" r="24" fill="${P.rim}" opacity="0.45"/>
  <circle cx="486" cy="108" r="40" fill="none" stroke="${P.rim}" stroke-opacity="0.2"/>
  <path d="M0 252 C120 234 200 242 300 246 C420 252 520 234 640 246 V360 H0 Z" fill="#0b0704"/>
  <path d="M0 262 C140 244 240 254 350 258 C460 262 552 246 640 252" fill="none" stroke="${P.rim}" stroke-opacity="0.22"/>
  <!-- distant fort -->
  <g fill="${ink}" stroke="${P.rim}" stroke-opacity="0.5">
    <path d="M74 248 V202 h56 v46 Z"/>
    <path d="M74 202 l9 -9 h10 l6 9 M101 202 l9 -9 h11 l8 9"/>
    <path d="M130 248 v-26 h28 v26"/>
  </g>
  <!-- camp: three tents, largest nearest -->
  <g fill="${ink}" stroke="${P.rim}" stroke-opacity="0.8" stroke-width="1.5" stroke-linejoin="round">
    <path d="M282 300 L360 214 L438 300 Z"/>
    <path d="M222 292 L268 240 L314 292 Z"/>
    <path d="M460 296 L492 258 L524 296 Z"/>
  </g>
  <g stroke="${P.rim}" stroke-opacity="0.35">
    <path d="M360 214 V196 M360 196 L318 300 M360 196 L402 300"/>
    <path d="M360 214 V300" stroke-opacity="0.22"/>
  </g>
  <!-- banner -->
  <path d="M548 262 V180" stroke="${P.rim}" stroke-opacity="0.7" stroke-width="1.8"/>
  <path d="M548 182 h48 v24 h-48 Z" fill="#5c1f16" stroke="${P.rim}" stroke-opacity="0.55"/>
  <path d="M560 188 h24 M560 196 h16" stroke="${P.rim}" stroke-opacity="0.4"/>`;
}

function paper(c, P) {
  const n = c.n;
  return `
  ${ground(P, 300)}
  <g transform="rotate(${n % 2 ? 2 : -3} 400 190)">
    <rect x="286" y="48" width="268" height="230" fill="#171008" stroke="${P.rim}" stroke-opacity="0.5"/>
    <path d="M286 84 H554" stroke="${P.rim}" stroke-opacity="0.5"/>
    <text x="300" y="76" font-family="Georgia,serif" font-size="13" fill="${P.rim}" opacity="0.75" letter-spacing="4">THE TIMES</text>
    <g fill="none" stroke="${P.rim}" stroke-opacity="0.35">
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<path d="M300 ${104 + i * 18} h100"/>`).join('')}
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<path d="M418 ${104 + i * 18} h104"/>`).join('')}
    </g>
    <rect x="300" y="200" width="146" height="52" fill="none" stroke="${P.rim}" stroke-opacity="0.25"/>
    <g stroke="${P.rim}" stroke-opacity="0.18">
      <path d="M306 214 h130 M306 226 h130 M306 238 h96"/>
    </g>
    <circle cx="506" cy="216" r="30" fill="none" stroke="#a4442f" stroke-opacity="0.65" stroke-width="1.6"/>
    <text x="506" y="212" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="7.5" fill="#a4442f" letter-spacing="2">SECRET</text>
    <path d="M482 220 h48" stroke="#a4442f" stroke-opacity="0.6"/>
  </g>`;
}

function hall(c, P) {
  return `
  ${ground(P, 300)}
  <!-- arched windows -->
  <g fill="#0a0d10" stroke="${P.rim}" stroke-opacity="0.55">
    <path d="M372 300 V164 a36 36 0 0 1 72 0 v136 Z"/>
    <path d="M470 300 V164 a36 36 0 0 1 72 0 v136 Z"/>
  </g>
  <g stroke="${P.rim}" stroke-opacity="0.32">
    <path d="M408 300 V128 M372 214 H444 M372 256 H444 M372 164 H444"/>
    <path d="M506 300 V128 M470 214 H542 M470 256 H542 M470 164 H542"/>
  </g>
  <!-- chandelier -->
  <g stroke="${P.rim}" stroke-opacity="0.55" fill="none">
    <path d="M196 0 V58"/><path d="M150 62 H242"/>
  </g>
  <g fill="${P.rim}" opacity="0.85">
    ${[150, 180, 212, 242].map(x => `<circle cx="${x}" cy="64" r="3.2"/>`).join('')}
  </g>
  <circle cx="196" cy="70" r="78" fill="${P.rim}" opacity="0.07"/>
  <!-- long table -->
  <path d="M186 300 C270 274 456 274 596 300 L634 344 H148 Z" fill="#100c06" stroke="${P.rim}" stroke-opacity="0.4"/>
  <path d="M148 344 V360 M634 344 V360" stroke="${P.rim}" stroke-opacity="0.2"/>
  <!-- delegates -->
  <g fill="${ink}" stroke="${P.rim}" stroke-opacity="0.55" stroke-width="1.3">
    ${[0, 1, 2, 3, 4, 5, 6].map(i => {
      const x = 206 + i * 64, y = 300 - Math.abs(i - 3) * 4;
      return `<circle cx="${x}" cy="${y - 38}" r="15"/><path d="M${x - 26} ${y + 2} c0 -24 12 -38 26 -38 s26 14 26 38 Z"/>`;
    }).join('')}
  </g>
  ${rim('M188 296 c46 -24 96 -28 138 -14', P, 0.35)}
  ${rim('M430 282 c52 -16 108 -12 148 8', P, 0.28)}`;
}

function war(c, P) {
  return `
  ${ground(P, 302)}
  <!-- ruined skyline -->
  <g fill="#0a0806" stroke="${P.rim}" stroke-opacity="0.5">
    <path d="M0 302 V210 h46 l7 -16 9 16 h32 v-30 h44 v30 h30 v92 Z"/>
    <path d="M180 302 V232 h38 l9 -14 9 14 h34 v-22 h28 v92 Z"/>
    <path d="M472 302 V216 h38 v-24 h46 v24 h32 v86 Z"/>
  </g>
  <g stroke="${P.rim}" stroke-opacity="0.22">
    <path d="M0 250 H640 M0 274 H640"/>
  </g>
  <!-- smoke -->
  <g fill="none" stroke="${P.rim}" stroke-opacity="0.16" stroke-width="1.4">
    <path d="M232 206 c-14 -18 12 -26 -2 -44 c-12 -16 10 -22 2 -38"/>
    <path d="M210 210 c-10 -16 10 -22 0 -38 c-8 -14 8 -18 2 -30"/>
    <path d="M508 172 c-12 -16 10 -24 -2 -40 c-10 -14 8 -18 2 -30"/>
  </g>
  <!-- searchlight -->
  <path d="M420 302 L392 92 H462 Z" fill="${P.rim}" opacity="0.06"/>
  <path d="M420 302 L426 92" stroke="${P.rim}" stroke-opacity="0.18"/>
  <!-- tank -->
  <g fill="${ink}" stroke="${P.rim}" stroke-opacity="0.8" stroke-width="1.5" stroke-linejoin="round">
    <path d="M276 300 h132 l-12 -24 h-108 Z"/>
    <path d="M300 276 c0 -16 12 -26 30 -26 h34 c18 0 30 10 30 26 Z"/>
    <path d="M394 254 L470 246" fill="none"/>
  </g>
  <path d="M276 300 h132" stroke="${P.rim}" stroke-opacity="0.5"/>
  <g fill="${P.rim}" opacity="0.45">
    <circle cx="304" cy="302" r="10"/><circle cx="342" cy="302" r="10"/><circle cx="380" cy="302" r="10"/>
  </g>
  <!-- barbed wire -->
  <g stroke="${P.rim}" stroke-opacity="0.5" fill="none">
    <path d="M0 332 C80 316 160 344 240 330 S400 342 480 328 S600 342 640 332"/>
    <path d="M40 332 l-9 -11 M40 332 l9 -11 M120 328 l-9 -11 M120 328 l9 -11 M200 336 l-9 -11 M200 336 l9 -11 M280 332 l-9 -11 M280 332 l9 -11"/>
  </g>`;
}

function industry(c, P) {
  return `
  ${ground(P, 296)}
  <!-- derrick -->
  <g stroke="${P.rim}" stroke-opacity="0.6" fill="none" stroke-width="1.2">
    <path d="M300 296 L338 96 L376 296"/>
    <path d="M318 200 h40 M310 240 h56 M326 160 h24 M334 120 h12"/>
    <path d="M300 296 L376 200 M376 296 L338 200 M338 96 L318 200 M338 96 L358 200 M318 200 L310 240 M358 200 L366 240 M310 240 L306 270 M366 240 L370 270"/>
  </g>
  <path d="M338 96 L420 168" stroke="${P.rim}" stroke-opacity="0.3"/>
  <!-- flare -->
  <path d="M412 176 c14 -8 6 -22 16 -34 c2 14 16 16 8 34 c-6 12 -18 12 -24 0 Z" fill="${P.rim}" opacity="0.7"/>
  <circle cx="414" cy="170" r="26" fill="${P.rim}" opacity="0.1"/>
  <!-- storage tanks -->
  <g fill="${ink}" stroke="${P.rim}" stroke-opacity="0.45">
    <path d="M470 296 v-42 a28 12 0 0 1 56 0 v42 Z"/>
    <path d="M540 296 v-30 a22 10 0 0 1 44 0 v30 Z"/>
  </g>
  <path d="M498 242 h-14 v40" stroke="${P.rim}" stroke-opacity="0.5"/>
  <!-- pipeline -->
  <g stroke="${P.rim}" stroke-opacity="0.5" fill="none" stroke-width="2">
    <path d="M0 286 H290"/><path d="M0 298 H290"/>
  </g>
  <path d="M120 286 v10 M200 286 v10 M80 286 v10" stroke="${P.rim}" stroke-opacity="0.35"/>
  ${rim('M470 258 a28 12 0 0 1 56 0', P, 0.5)}`;
}

function city(c, P) {
  const n = c.n;
  return `
  ${ground(P, 292)}
  <g fill="${ink}" stroke="${P.rim}" stroke-opacity="0.4">
    <path d="M0 292 V232 h40 v-24 h34 v84 Z"/>
    <path d="M96 292 V210 h38 l4 -18 4 18 h32 v82 Z"/>
    <path d="M372 292 V244 h44 v-30 h30 v78 Z"/>
    <path d="M470 292 V214 h40 v-26 h34 v26 h36 v78 Z"/>
  </g>
  <g fill="${P.rim}" opacity="0.4">
    ${[0, 1, 2, 3].map(i => `<rect x="${14 + i * 12}" y="238" width="7" height="10"/>`).join('')}
    ${[0, 1, 2].map(i => `<rect x="${486 + i * 14}" y="226" width="8" height="12"/>`).join('')}
    ${[0, 1].map(i => `<rect x="${390 + i * 14}" y="256" width="8" height="12"/>`).join('')}
  </g>
  <!-- minaret -->
  <g stroke="${P.rim}" stroke-opacity="0.55" fill="none">
    <path d="M232 292 V176 h16 v116"/>
    <path d="M236 176 c4 -14 8 -14 12 0"/>
    <path d="M228 190 h24 M228 210 h24"/>
  </g>
  <!-- radio mast -->
  <g stroke="${P.rim}" stroke-opacity="0.5" fill="none">
    <path d="M320 292 V120 M320 120 l-12 24 M320 120 l12 24 M312 158 h16 M314 186 h12"/>
  </g>
  <g fill="none" stroke="${P.rim}" stroke-opacity="0.3">
    <path d="M296 118 a26 26 0 0 1 0 -22" transform="rotate(180 320 106)"/>
    <path d="M344 118 a26 26 0 0 0 0 -22"/>
  </g>
  <!-- smoke plumes -->
  <g fill="${P.rim}" opacity="0.08">
    <ellipse cx="430" cy="150" rx="56" ry="24"/>
    <ellipse cx="480" cy="112" rx="40" ry="18"/>
  </g>
  <g stroke="${P.rim}" stroke-opacity="0.2">
    <path d="M0 276 H640"/>
  </g>`;
}

function boat(c, P) {
  const n = c.n;
  const bx = 300 + r(n, 4) * 40;
  return `
  <rect x="0" y="222" width="640" height="138" fill="#070a0e"/>
  <path d="M0 222 H640" stroke="${P.rim}" stroke-opacity="0.35"/>
  <circle cx="500" cy="104" r="24" fill="${P.rim}" opacity="0.55"/>
  <circle cx="508" cy="98" r="22" fill="${P.sky[1]}" opacity="0.92"/>
  <path d="M500 124 L518 222 H482 Z" fill="${P.rim}" opacity="0.05"/>
  <g stroke="${P.rim}" stroke-opacity="0.18">
    <path d="M400 244 h80 M440 262 h60 M360 284 h70 M470 296 h90 M320 312 h60"/>
  </g>
  <!-- boat -->
  <g stroke="${P.rim}" stroke-opacity="0.85" fill="${ink}" stroke-width="1.5" stroke-linejoin="round">
    <path d="M${bx - 96} 274 h192 l-28 34 h-136 Z"/>
    <path d="M${bx - 44} 274 V212 h88 v62"/>
    <path d="M${bx - 44} 236 h88"/>
  </g>
  <g fill="${ink}" stroke="${P.rim}" stroke-opacity="0.6">
    <circle cx="${bx - 62}" cy="252" r="8"/>
    <path d="M${bx - 76} 274 c0 -14 6 -22 14 -22 s14 8 14 22 Z"/>
    <circle cx="${bx + 4}" cy="256" r="7"/>
    <path d="M${bx - 8} 274 c0 -12 6 -18 12 -18 s12 6 12 18 Z"/>
    <circle cx="${bx + 56}" cy="260" r="6"/>
  </g>
  <path d="M${bx - 96} 308 c24 8 48 -2 72 0 c26 2 52 8 78 0" fill="none" stroke="${P.rim}" stroke-opacity="0.4"/>
  <path d="M${bx - 70} 328 c30 9 60 -5 90 0 c24 3 46 5 66 -2" fill="none" stroke="${P.rim}" stroke-opacity="0.2"/>`;
}

function archive(c, P) {
  return `
  ${ground(P, 300)}
  <!-- archive shelves -->
  <g stroke="${P.rim}" stroke-opacity="0.55" fill="none" stroke-width="2.5">
    <path d="M356 44 H636 M356 100 H636 M356 156 H636 M356 212 H636 M356 268 H636"/>
  </g>
  <g stroke="${P.rim}" stroke-opacity="0.3" fill="none">
    <path d="M356 44 V300 M636 44 V300"/>
  </g>
  <g fill="${ink}" stroke="${P.rim}" stroke-opacity="0.45">
    ${[0, 1, 2, 3, 4].map(row => [0, 1, 2, 3, 4, 5, 6, 7, 8].map(col => {
      const h = 26 + ((row * 5 + col * 3) % 4) * 5;
      const w = 12 + ((row + col) % 3) * 3;
      return `<rect x="${364 + col * 30}" y="${44 + row * 56 + 50 - h}" width="${w}" height="${h}"/>`;
    }).join('')).join('')}
  </g>
  <!-- table with the original map -->
  <path d="M0 296 H320 L350 344 H-30 Z" fill="#160f08" stroke="${P.rim}" stroke-opacity="0.4"/>
  <g transform="rotate(-4 150 312)">
    <rect x="40" y="270" width="230" height="82" fill="#241a0f" stroke="${P.rim}" stroke-opacity="0.65"/>
    <path d="M56 334 C104 308 128 322 166 298 C204 274 232 288 258 274" fill="none" stroke="#b04a33" stroke-opacity="0.85" stroke-width="1.8"/>
    <g stroke="${P.rim}" stroke-opacity="0.18"><path d="M40 292 H270 M40 310 H270 M40 328 H270"/></g>
    <circle cx="118" cy="316" r="3" fill="${P.rim}" opacity="0.8"/>
    <circle cx="206" cy="292" r="2.6" fill="${P.rim}" opacity="0.6"/>
  </g>
  <!-- lamp -->
  <g stroke="${P.rim}" stroke-opacity="0.5" fill="none">
    <path d="M248 0 V150"/><path d="M214 158 h68"/>
  </g>
  <path d="M214 158 h68 l-14 -16 h-40 Z" fill="${ink}" stroke="${P.rim}" stroke-opacity="0.65"/>
  <path d="M214 158 L150 300 H318 L282 158 Z" fill="${P.rim}" opacity="0.06"/>
  <g fill="${P.rim}" opacity="0.55">
    <circle cx="248" cy="160" r="4"/>
  </g>`;
}

const SCENES = { table, tents, river, map: mapSheet, flags, desk, lab, seal, camp, paper, hall, war, industry, city, boat, archive };

const CHOICE = {
  1: 'table', 2: 'tents', 3: 'river', 4: 'map', 5: 'map', 6: 'flags',
  7: 'desk', 8: 'lab', 9: 'desk', 10: 'seal', 11: 'seal', 12: 'seal',
  13: 'camp', 14: 'camp', 15: 'paper', 16: 'paper', 17: 'paper', 18: 'paper',
  19: 'desk', 20: 'hall', 21: 'hall', 22: 'hall', 23: 'hall', 24: 'war',
  25: 'tents', 26: 'map', 27: 'flags', 28: 'industry', 29: 'map', 30: 'war',
  31: 'map', 32: 'boat', 33: 'war', 34: 'city', 35: 'war', 36: 'industry',
  37: 'city', 38: 'war', 39: 'map', 40: 'flags', 41: 'boat', 42: 'archive',
};

const NO_MIRROR = new Set(['paper', 'archive', 'desk', 'seal']);

// Which repeat is this chapter's scene? Used to vary reused artwork.
const occurrence = {};
{
  const counts = {};
  for (const n of Object.keys(CHOICE).map(Number).sort((a, b) => a - b)) {
    const k = CHOICE[n];
    occurrence[n] = counts[k] || 0;
    counts[k] = occurrence[n] + 1;
  }
}

export function sceneFor(c) {
  const key = CHOICE[c.n] || 'map';
  const P = palettes[c.act] || palettes.I;
  let svg = SCENES[key](c, P);
  const i = occurrence[c.n] || 0;
  let tf = '';
  if (!NO_MIRROR.has(key) && i % 2 === 1) tf += 'translate(640 0) scale(-1 1) ';
  if (i >= 2) tf += 'translate(320 180) scale(1.08) translate(-320 -180)';
  if (tf.trim()) svg = `<g transform="${tf.trim()}">${svg}</g>`;
  return { key, palette: P, svg };
}
