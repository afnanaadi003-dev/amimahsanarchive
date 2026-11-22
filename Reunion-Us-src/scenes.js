// Scene illustrations for Reunion Us chapter slides.
// Each chapter maps to one of a handful of cinematic archetypes drawn in SVG.

const PALETTES = {
  rain: { sky: ['#0d1a1c', '#050a0b'], glow: '#8fb8a8', rim: '#a9cbc2' },
  warm: { sky: ['#1b1710', '#070605'], glow: '#e0b06a', rim: '#d9bd8a' },
  night: { sky: ['#0a1418', '#04080a'], glow: '#7fa9b8', rim: '#9fc4c9' },
  dawn: { sky: ['#2a2420', '#0a0d0d'], glow: '#e3a878', rim: '#e6c39a' },
  green: { sky: ['#101a14', '#040805'], glow: '#8fb89a', rim: '#a9cbb2' }
};

const rainLines = (n) => {
  let out = '';
  for (let i = 0; i < 42; i++) {
    const x = ((i * 97 + n * 31) % 720) - 40;
    const y = ((i * 53 + n * 17) % 360) - 20;
    out += `<path d="M${x} ${y} l-9 24" />`;
  }
  return `<g stroke="#bfe0dd" stroke-opacity="0.22" stroke-width="1">${out}</g>`;
};

const hills = (P, y = 250) => `
  <path d="M0 ${y + 40} C90 ${y - 30} 150 ${y - 10} 230 ${y + 12} C320 ${y + 36} 380 ${y - 34} 470 ${y - 6} C550 ${y + 18} 610 ${y - 18} 700 ${y + 8} L700 360 L0 360 Z" fill="#0a1211" opacity="0.95"/>
  <path d="M0 ${y + 78} C120 ${y + 28} 210 ${y + 66} 300 ${y + 48} C400 ${y + 28} 500 ${y + 64} 700 ${y + 40} L700 360 L0 360 Z" fill="#060b0a"/>`;

const moon = (P) => `<circle cx="470" cy="92" r="26" fill="${P.rim}" opacity="0.14"/>
  <circle cx="470" cy="92" r="26" fill="none" stroke="${P.rim}" stroke-opacity="0.35"/>`;

const water = (P, y = 268) => {
  const lines = [];
  for (let i = 0; i < 16; i++) {
    const yy = y + 8 + i * 6;
    const w = 340 - i * 12;
    lines.push(`<path d="M420 ${yy} h${w}" stroke="${P.rim}" stroke-opacity="${0.16 - i * 0.008}" stroke-width="1"/>`);
  }
  return `<rect x="0" y="${y}" width="640" height="${360 - y}" fill="#061012" opacity="0.9"/>${lines.join('')}`;
};

export function sceneFor(c) {
  const P = PALETTES[c.palette] || PALETTES.rain;
  let art = '';

  if (c.scene === 'road') {
    art = `
      ${moon(P)}
      ${hills(P, 246)}
      <path d="M470 360 C430 316 500 300 520 268 C540 238 505 218 512 196" fill="none" stroke="#0b0805" stroke-width="34" stroke-linecap="round"/>
      <path d="M470 360 C430 316 500 300 520 268 C540 238 505 218 512 196" fill="none" stroke="${P.rim}" stroke-opacity="0.35" stroke-width="1.4" stroke-dasharray="10 14"/>
      <g stroke="#9fc4c9" stroke-opacity="0.5" stroke-width="2">
        <path d="M508 196 v-58"/><path d="M490 210 l36 -40"/><path d="M528 210 l-36 -40"/>
      </g>
      <g fill="#070c0b">
        <path d="M0 360 L0 300 L38 270 L74 300 L74 360 Z"/><path d="M640 360 L640 286 L600 258 L566 286 L566 360 Z"/>
      </g>
      ${rainLines(c.n)}`;
  } else if (c.scene === 'gate') {
    art = `
      ${moon(P)}
      ${hills(P, 268)}
      <g fill="#080d0c" stroke="${P.rim}" stroke-opacity="0.3">
        <path d="M400 360 L400 190 Q400 150 440 150 Q480 150 480 190 L480 360 Z" stroke-width="1.2"/>
        <path d="M400 300 L480 300"/><path d="M400 236 L480 236"/>
      </g>
      <g stroke="#0a1210" stroke-width="7"><path d="M414 360 V200"/><path d="M466 360 V200"/></g>
      <g stroke="${P.rim}" stroke-opacity="0.45" stroke-width="2">
        <path d="M440 150 v-26"/><path d="M431 136 h18"/>
      </g>
      <g fill="#07100d"><ellipse cx="352" cy="286" rx="58" ry="74"/><ellipse cx="548" cy="300" rx="46" ry="58"/><rect x="346" y="300" width="12" height="60"/><rect x="542" y="316" width="10" height="44"/></g>
      ${rainLines(c.n)}`;
  } else if (c.scene === 'hall') {
    art = `
      <g fill="#0b1110">
        <rect x="330" y="40" width="270" height="230" rx="4"/>
        <rect x="344" y="54" width="242" height="202" fill="#08100f" stroke="${P.rim}" stroke-opacity="0.25"/>
      </g>
      <g stroke="${P.rim}" stroke-opacity="0.22">
        <path d="M465 54 V256"/><path d="M344 150 H586"/>
      </g>
      ${rainLines(c.n)}
      <g fill="#0a0f0e">
        <rect x="300" y="292" width="330" height="12" rx="3"/>
        <rect x="318" y="304" width="10" height="56"/><rect x="590" y="304" width="10" height="56"/>
      </g>
      <g fill="#111614"><rect x="336" y="252" width="34" height="8" rx="2"/><rect x="400" y="252" width="34" height="8" rx="2"/><rect x="464" y="252" width="34" height="8" rx="2"/><rect x="528" y="252" width="34" height="8" rx="2"/></g>
      <g stroke="${P.rim}" stroke-opacity="0.3" stroke-width="1.4">
        <path d="M560 60 v70"/><path d="M520 62 l80 0"/><path d="M560 62 v-10"/>
      </g>
      <circle cx="560" cy="132" r="4" fill="${P.glow}" opacity="0.7"/>`;
  } else if (c.scene === 'storm') {
    art = `
      <g stroke="${P.rim}" stroke-opacity="0.6" fill="none" stroke-width="2">
        <path d="M472 44 L442 116 L470 116 L438 196"/>
      </g>
      <g fill="#070d0c">
        <path d="M0 360 V264 L60 240 L108 268 V360 Z"/>
        <path d="M330 360 V218 L374 196 L416 218 V360 Z"/>
        <path d="M450 360 V246 L500 222 L552 246 V360 Z"/>
      </g>
      <g stroke="${P.rim}" stroke-opacity="0.28"><path d="M356 228 h36 M356 260 h36 M356 292 h36"/></g>
      ${hills(P, 300)}
      ${rainLines(c.n)}`;
  } else if (c.scene === 'dorm') {
    art = `
      <g fill="#090f0e">
        <rect x="360" y="96" width="220" height="48" rx="3"/>
        <rect x="360" y="200" width="220" height="48" rx="3"/>
        <rect x="360" y="152" width="6" height="110"/>
        <rect x="574" y="152" width="6" height="110"/>
      </g>
      <g stroke="${P.rim}" stroke-opacity="0.28">
        <path d="M360 120 h220 M360 224 h220"/><path d="M380 96 v48 M420 96 v48 M500 96 v48 M540 96 v48"/>
      </g>
      <g fill="#141a17"><rect x="374" y="82" width="52" height="14" rx="5"/><rect x="514" y="186" width="52" height="14" rx="5"/></g>
      <g>
        <rect x="600" y="30" width="40" height="300" fill="#0a1110" stroke="${P.rim}" stroke-opacity="0.2"/>
        <path d="M620 30 V330" stroke="${P.rim}" stroke-opacity="0.18"/>
      </g>
      ${rainLines(c.n)}`;
  } else if (c.scene === 'library') {
    art = `
      <g fill="#0b100e">
        <rect x="360" y="40" width="250" height="290" rx="3"/>
      </g>
      <g stroke="${P.rim}" stroke-opacity="0.28">
        <path d="M360 96 h250 M360 152 h250 M360 208 h250 M360 264 h250"/>
        <path d="M430 40 v290 M500 40 v290 M570 40 v290"/>
      </g>
      <g fill="${P.rim}" opacity="0.18">
        ${[0,1,2,3,4,5,6,7].map(i => `<rect x="${368 + (i % 3) * 66}" y="${54 + Math.floor(i / 3) * 56}" width="${10 + (i % 3) * 4}" height="36"/>`).join('')}
      </g>
      <g>
        <path d="M340 300 h64 l-10 -22 h-44 Z" fill="#070c0a"/>
        <path d="M356 278 v-28" stroke="${P.rim}" stroke-opacity="0.5" stroke-width="2"/>
        <path d="M340 250 h32 l-16 -16 Z" fill="${P.glow}" opacity="0.4"/>
        <ellipse cx="356" cy="238" rx="30" ry="18" fill="${P.glow}" opacity="0.12"/>
      </g>`;
  } else if (c.scene === 'water') {
    art = `
      <rect x="0" y="0" width="640" height="360" fill="#061012"/>
      <g fill="${P.rim}" opacity="0.08">
        <path d="M420 0 L360 360 L470 360 L500 0 Z"/>
        <path d="M520 0 L500 360 L580 360 L560 0 Z"/>
      </g>
      <g>
        <path d="M0 70 H640" stroke="${P.rim}" stroke-opacity="0.22"/>
        <path d="M0 86 q40 -8 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0" fill="none" stroke="${P.rim}" stroke-opacity="0.18"/>
      </g>
      <g stroke="${P.rim}" stroke-opacity="0.35" fill="none" stroke-width="1.4">
        <path d="M432 214 q14 -10 28 0 q6 22 -14 34 q-20 -12 -14 -34 Z"/>
        <path d="M446 248 v40"/>
        <path d="M446 288 q-18 4 -22 22 M446 288 q18 4 22 22"/>
      </g>
      <g fill="none" stroke="${P.rim}" stroke-opacity="0.4">
        <circle cx="390" cy="180" r="5"/><circle cx="404" cy="150" r="3"/><circle cx="500" cy="196" r="4"/><circle cx="516" cy="240" r="3"/><circle cx="470" cy="124" r="3.5"/>
      </g>
      <g stroke="${P.rim}" stroke-opacity="0.2" stroke-width="1">
        <path d="M300 300 h300 M330 318 h250 M360 336 h190"/>
      </g>`;
  } else if (c.scene === 'dawn') {
    art = `
      <circle cx="500" cy="150" r="42" fill="${P.glow}" opacity="0.22"/>
      <circle cx="500" cy="150" r="42" fill="none" stroke="${P.glow}" stroke-opacity="0.5"/>
      ${hills(P, 240)}
      ${water(P, 258)}
      <path d="M470 258 h54 l-8 12 h-38 Z" fill="#060a09" stroke="${P.rim}" stroke-opacity="0.4"/>
      <g stroke="${P.rim}" stroke-opacity="0.4"><path d="M484 258 v-24"/><path d="M486 236 l26 -12"/></g>
      <g stroke="${P.rim}" stroke-opacity="0.35" fill="none">
        <path d="M420 96 q10 -8 20 0 q10 -8 20 0"/><path d="M452 72 q7 -6 14 0 q7 -6 14 0"/>
      </g>`;
  } else if (c.scene === 'room') {
    art = `
      <g>
        <rect x="380" y="50" width="210" height="170" fill="#08100f" stroke="${P.rim}" stroke-opacity="0.25"/>
        <path d="M485 50 V220 M380 135 H590" stroke="${P.rim}" stroke-opacity="0.2"/>
      </g>
      ${rainLines(c.n)}
      <g>
        <rect x="330" y="252" width="270" height="10" rx="3" fill="#0a0f0e"/>
        <rect x="340" y="262" width="8" height="60" fill="#0a0f0e"/>
        <rect x="582" y="262" width="8" height="60" fill="#0a0f0e"/>
      </g>
      <g>
        <rect x="430" y="210" width="70" height="44" rx="4" fill="#0b0f0d" stroke="${P.rim}" stroke-opacity="0.3"/>
        <path d="M438 236 h54 M438 244 h38" stroke="${P.rim}" stroke-opacity="0.3"/>
        <circle cx="500" cy="200" r="5" fill="${P.glow}" opacity="0.7"/>
        <ellipse cx="500" cy="204" rx="56" ry="26" fill="${P.glow}" opacity="0.1"/>
      </g>`;
  }

  return { svg: art, palette: P };
}
