const fs = require('fs');
const path = require('path');

const PER_PAGE = 5;
const PARTS = {
  1: [
    { from: 1, to: 10, name: 'Part One — The Word' },
    { from: 11, to: 20, name: 'Part Two — The Summer' },
    { from: 21, to: 30, name: 'Part Three — The Screening' },
  ],
  2: [
    { from: 1, to: 10, name: 'Part One — The Aisle' },
    { from: 11, to: 20, name: 'Part Two — Night Market' },
    { from: 21, to: 30, name: 'Part Three — The Aisle Again' },
  ],
};

const decode = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&mdash;/g, '—').replace(/&[a-z]+;/g, ' ');
const words = (s) => decode(s).split(/\s+/).filter(Boolean).length;
const pad = (n) => String(n).padStart(2, '0');

const CONFIGS = [
  {
    n: 1,
    file: 'src',
    out: 'series-01.html',
    poster: 'poster.svg',
    title: 'Coochie',
    tagline: 'Put the whole messy, awkward truth on the marquee.',
    kicker: 'Series One of Twenty-Four',
    logline: 'Two nineteen-year-olds, one borrowed camera, eleven unpaid crew, and a word that makes adults look at the tablecloth. One summer, thirty chapters, sixty hot dogs.',
    metaTitle: 'Coochie — Series 1 · A Film by Amim Ahsan',
    metaDesc: 'Coochie — series one of twenty-four. Two teenagers make a film about the word that was used on them; thirty chapters, a full shooting script, paginated, with a screening mode.',
    synopsis: [
      'Maya is nineteen and has decided that this summer she is not going to whisper around the edges. Leo is nineteen and has a job at a hardware store and a cousin who owns a camera he is afraid of. Between them they have sixty-one dollars, one garage, and a title nobody in the family will say at dinner.',
      'The film they make is twelve minutes long. Getting to those twelve minutes takes thirty chapters: casting the cul-de-sac, sixty-three takes for a single line, a party scene shot in a garage with eleven people pretending to be forty, a noise complaint at one in the morning, and a screening in a church basement where twenty-seven people sit in forty chairs.',
      'PULL:Shock is a marketing plan, not a script. The question is what\'s in the second act.',
      'Series one is about the first one: the thing you make badly, in public, with people you love, before you have any idea whether you are any good. The remaining twenty-three series are already on the shelf.',
    ],
    setting: 'One suburban summer',
    genre: 'Coming of age · filmmaking',
    cast: [
      ['Maya', 'nineteen, the director', 'Writes everything down. Believes a title is an argument you win in a quiet room.'],
      ['Leo', 'nineteen, the camera', 'Can catch a tennis ball eleven years running. Knows where the light is.'],
      ['Ruth', 'Maya\'s mother', 'Counts everything and calls it a habit, not a criticism. Pays for the hot dogs.'],
      ['Jo', 'Maya\'s grandmother', 'Eighty-two. Painted over a word forty years ago; it came back through the paint.'],
      ['Deshawn', 'seventeen, the crier', 'Can cry on cue. Asked for his real name in the credits.'],
      ['Priya', 'the rival', 'Film camp, ring light, a lighthouse. Reviews honestly and expects the same.'],
      ['Sam', 'the hardware man', 'Thirty years of screws and one good piece of advice per shift.'],
      ['Mr. Halloran', 'the teacher', 'Hands out a festival form and thirty dollars he will never see again.'],
      ['Terrance', 'eleven, the crew', 'Whistles through his teeth. Invites his whole class. Eats last.'],
      ['Dale', 'the uncle', 'Asks what the film is called, and then wishes he hadn\'t.'],
      ['Andre', 'the cousin', 'Owns the camera and is afraid of it. Three rules, one of them unspoken.'],
      ['The neighbour', 'the complaint', 'Calls the police at one in the morning and gets the best line in the chapter.'],
    ],
    synSub: 'Series one · summer',
    castHead: 'Cast of the Summer',
    castSub: 'Twelve who are in it',
  },
  {
    n: 2,
    file: 'src/s2',
    out: 'series-02.html',
    poster: 'poster-02.svg',
    title: 'The Light Is Here',
    tagline: 'Knowing where the light is does not pay the rent.',
    kicker: 'Series Two of Twenty-Four',
    logline: 'Leo is twenty, works the floor at Kessler Hardware, and can light a room out of its own stock. Then a real film crew comes to town and finds out how cheap he is.',
    metaTitle: 'The Light Is Here — Series 2 · A Film by Amim Ahsan',
    metaDesc: 'The Light Is Here — series two of Coochie. A hardware-store clerk who knows where the light is joins a real crew for one autumn; thirty chapters, paginated, with a screening mode.',
    synopsis: [
      'Leo knows where the light is. He has known since he was nine, the way some people know which way is north. At Kessler Hardware he sells it by the bulb: sixty-watt, seventy-five, a daylight LED that lies about the sky.',
      'Then a production called NIGHT MARKET rolls into town for eleven weeks with a generator, a permit problem, and a gaffer named Dutch who has three days to find someone who can source a hundred practicals locally. Leo is nineteen dollars an hour and already knows the stock.',
      'PULL:The work is standing in a field at two in the morning, holding a diffusion frame in the rain, and being right about where the light should be.',
      'What follows is thirty chapters of nearly no glamour: cable runs, colour temperature, a ladder that slides, a union letter, a store going quiet, and a boy being asked whether he is a hobby or a professional — by the two people who need him most, in the same week.',
    ],
    setting: 'One autumn · a small town and a film crew in it',
    genre: 'Working life · filmmaking',
    cast: [
      ['Leo', 'twenty, the clerk', 'Knows where the light is. Sell it to him or don\'t; he\'ll build it.'],
      ['Sam Kessler', 'sixty-three, the owner', 'Forty years of drawers. Talks about the store in the past tense and hates himself for it.'],
      ['Dutch', 'fifty-six, the gaffer', 'Runs a crew like a ferry captain. Has never once raised her voice and never once been ignored.'],
      ['Ade', 'twenty-four, the best boy', 'Has paid his dues and would like the invoice acknowledged.'],
      ['Cat', 'thirty-two, the DP', 'Exacting, kind in small doses, allergic to a bulb that isn\'t on the sheet.'],
      ['Mona', 'Leo\'s mother', 'Night nurse. Measures everything in shifts and in what it costs.'],
      ['Terrance', 'eleven, the regular', 'Hangs around the lighting aisle after school. Asks the good question.'],
      ['Ravi', 'the producer', 'Two hundred thousand and a prayer. Says "favour" the way other people say "invoice".'],
      ['Jo', 'the actress', 'Sixty-one, playing a market trader. Does her own crying and resents being asked twice.'],
      ['Mr. Petrosky', 'the neighbour', 'Called the police on a film once. Would like to be asked this time.'],
      ['Nadia', 'the union rep', 'Explains the card like a doctor explaining a diagnosis: kindly, and without hope.'],
      ['The store', 'the other lead', 'Aisle nine, four hundred bulbs, and a back room nobody has swept since 1994.'],
    ],
    synSub: 'Series two · autumn',
    castHead: 'Cast of the Autumn',
    castSub: 'Twelve who are in it',
  },
];

const filmHeadSrc = fs.readFileSync('../Baharam.html', 'utf8');

function makeHead(cfg) {
  let head = filmHeadSrc.slice(0, filmHeadSrc.indexOf('</head>'));
  head = head.replace(/<title>[\s\S]*?<\/title>/, `<title>${cfg.metaTitle}</title>`);
  head = head.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${cfg.metaDesc}">`);
  head = head.replace('</style>', `
/* pagination */
.chapter-page{display:none}
.chapter-page.active{display:block}
.pager{display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;
  padding:22px clamp(16px,4vw,40px);border-top:1px solid var(--line);border-bottom:1px solid var(--line);margin:22px 0}
.pager-nums{display:flex;gap:6px;flex-wrap:wrap}
.pgbtn{min-width:34px;height:34px;border-radius:999px;border:1px solid var(--line);background:transparent;
  color:var(--ink-soft);font-family:var(--mono);font-size:.72rem;cursor:pointer;transition:.2s}
.pgbtn:hover{border-color:var(--gold);color:var(--gold)}
.pgbtn.on{background:var(--gold);border-color:var(--gold);color:#16120b;font-weight:600}
.pager-note{font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted)}
.pager-note b{color:var(--ink);font-weight:500}
.pager[data-edge="start"] [data-pg="prev"],.pager[data-edge="end"] [data-pg="next"]{opacity:.4}
.chapter-page .chapter{border-top:0}
</style>`);
  return head;
}

function build(cfg) {
  const parts = PARTS[cfg.n];
  const partFor = (n) => parts.find((p) => n >= p.from && n <= p.to).name;

  const files = fs.readdirSync(cfg.file).filter((f) => /^ch\d+-\d+\.txt$/.test(f)).sort();
  let raws = [];
  for (const f of files) raws = raws.concat(fs.readFileSync(path.join(cfg.file, f), 'utf8').split('===CH==='));
  raws = raws.map((r) => r.trim()).filter(Boolean);

  const chapters = raws.map((raw, i) => {
    const n = i + 1;
    const [head, ...rest] = raw.split('@@SLATE');
    const [slatePart, scenePart] = rest.join('@@SLATE').split('@@SCENES');
    const title = head.match(/TITLE:\s*(.+)/)[1].trim();
    const min = head.match(/MIN:\s*(\d+)/)[1];
    const rows = slatePart.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
      const k = l.indexOf('::');
      return `  <div class="slate-row"><span class="slate-k">${l.slice(0, k).trim()}</span><span class="slate-v">${l.slice(k + 2).trim()}</span></div>`;
    }).join('\n');
    const scenes = scenePart.trim();
    return { n, title: title.toUpperCase(), min, rows, scenes, scenesCount: (scenes.match(/<div class="scene">/g) || []).length, w: words(scenes) };
  });
  if (chapters.length !== 30) throw new Error(cfg.n + ': expected 30 chapters, got ' + chapters.length);

  const totalWords = chapters.reduce((a, c) => a + c.w, 0);
  const totalScenes = chapters.reduce((a, c) => a + c.scenesCount, 0);

  const chapterHtml = (c) => `<section class="chapter" id="ch-${c.n}" data-n="${c.n}">
  <header class="chapter-head">
    <p class="ch-eyebrow">${partFor(c.n)}</p>
    <div class="ch-title-row">
      <span class="ch-num">${c.n}</span>
      <h2>${c.title}</h2>
    </div>
    <p class="ch-meta">${c.scenesCount} scenes · ${c.w.toLocaleString('en-US')} words · ≈${c.min} min</p>
    <div class="slate">
${c.rows}
</div>
  </header>
  <div class="scenes">${c.scenes}
  </div>
</section>`;

  const pages = [];
  for (let i = 0; i < chapters.length; i += PER_PAGE) pages.push(chapters.slice(i, i + PER_PAGE));

  const pageBlocks = pages.map((group, i) => `<div class="chapter-page${i === 0 ? ' active' : ''}" data-page="${i + 1}">
${group.map(chapterHtml).join('\n')}
</div>`).join('\n');

  const pager = (cls) => `<nav class="pager ${cls}" aria-label="Script pages">
  <button class="tbtn" data-pg="prev" disabled>← Previous</button>
  <div class="pager-nums">${pages.map((_, i) => `<button class="pgbtn${i === 0 ? ' on' : ''}" data-pg="${i + 1}">${i + 1}</button>`).join('')}</div>
  <button class="tbtn" data-pg="next">Next →</button>
  <span class="pager-note">Page <b class="pgnow">1</b> of ${pages.length}</span>
</nav>`;

  const chipIndex = parts.map((p, i) => {
    const chips = chapters.filter((c) => c.n >= p.from && c.n <= p.to).map((c) =>
      `<button class="chip" data-chapter="${c.n}"><span class="chip-n">${pad(c.n)}</span><span class="chip-t">${c.title}</span></button>`).join('\n');
    return `  <div class="part-group" id="part-${['one', 'two', 'three'][i]}">
    <h3 class="part-head"><span>${p.name.split(' — ')[0]}</span> ${p.name.split(' — ')[1]}</h3>
    <div class="chips">${chips}</div>
  </div>`;
  }).join('\n');

  const cast = cfg.cast.map(([n, r, d]) => `<article class="cast-card"><h4>${n}</h4><p class="cast-role">${r}</p><p class="cast-note">${d}</p></article>`).join('\n');
  const prose = cfg.synopsis.map((p) => p.startsWith('PULL:')
    ? `<p class="pull">${p.slice(5)}</p>`
    : `<p>${p}</p>`).join('\n      ');

  const body = `<div class="progress-line" id="progressLine"></div>
<header class="topbar">
  <a class="brand" href="index.html"><b>COOCHIE</b><span>24 Series</span></a>
  <div class="top-actions">
    <a class="tlink" href="#chapters">Chapters</a>
    <a class="tlink" href="#script">Script</a>
    <a class="tlink" href="index.html">All Series</a>
    <button class="btn btn-gold" data-watch="1">▶ Watch</button>
  </div>
</header>

<header class="hero">
  <div class="poster-wrap">
    <img class="poster" src="${cfg.poster}" alt="${cfg.title} poster">
  </div>
  <div class="hero-copy">
    <p class="kicker">${cfg.kicker}</p>
    <h1 class="film-title">${cfg.title}</h1>
    <p class="tagline">${cfg.tagline}</p>
    <p class="logline">${cfg.logline}</p>
    <p class="byline">Written &amp; directed by <b>Amim Ahsan</b></p>
    <div class="hero-cta">
      <button class="btn btn-gold" data-watch="1">▶ Watch the series</button>
      <a class="btn btn-ghost" href="#script">Read the screenplay</a>
    </div>
    <div class="fact-row">
      <div class="fact"><b>30</b><span>Chapters</span></div>
      <div class="fact"><b>${totalScenes}</b><span>Scenes</span></div>
      <div class="fact"><b>${totalWords.toLocaleString('en-US')}</b><span>Words</span></div>
      <div class="fact"><b>${pages.length}</b><span>Pages</span></div>
    </div>
  </div>
</header>

<section class="block" id="about">
  <div class="sec-head"><h2>Synopsis</h2><p>${cfg.synSub}</p></div>
  <div class="two-col">
    <div class="prose">
      ${prose}
    </div>
    <div>
      <ul class="spec">
        <li><span>Format</span><span>Series · 30 chapters minimum</span></li>
        <li><span>Genre</span><span>${cfg.genre}</span></li>
        <li><span>Setting</span><span>${cfg.setting}</span></li>
        <li><span>Language</span><span>English</span></li>
        <li><span>Screenplay</span><span>${totalWords.toLocaleString('en-US')} words · ${totalScenes} scenes</span></li>
        <li><span>Pagination</span><span>${pages.length} pages · ${PER_PAGE} chapters per page</span></li>
        <li><span>Slate</span><span>Camera, roll, costume and environment noted per chapter</span></li>
      </ul>
    </div>
  </div>
</section>

<section class="block" id="cast">
  <div class="sec-head"><h2>${cfg.castHead}</h2><p>${cfg.castSub}</p></div>
  <div class="cast-grid">
${cast}
  </div>
</section>

<section class="block" id="chapters">
  <div class="sec-head"><h2>Thirty Chapters</h2><p>Three parts · five chapters a page</p></div>
${chipIndex}
</section>

<section class="block" id="script">
  <div class="sec-head"><h2>Shooting Script</h2><p>Full screenplay · INT. / EXT.</p></div>
  <div class="script-wrap">
${pager('pager-top')}
${pageBlocks}
${pager('pager-bottom')}
  </div>
</section>`;

  const tail = `<footer class="foot">
  <p>${cfg.title} · series ${cfg.n} of twenty-four · a film by Amim Ahsan</p>
  <p><button class="tbtn" data-watch="1">▶ Watch from the beginning</button> &nbsp; <a class="tbtn" href="index.html">All 24 series</a></p>
</footer>

<button class="fab" data-watch="1">▶ Watch</button>

<div class="cine" id="cine" aria-hidden="true">
  <div class="cine-top">
    <div class="ct-left"><span class="cine-dot"></span><span id="cineSlate">${cfg.title}</span></div>
    <div style="display:flex;align-items:center;gap:14px">
      <span id="cinePart">Part One</span>
      <button class="cine-close" id="cineClose" aria-label="Close screening">✕</button>
    </div>
  </div>
  <div class="cine-stage" id="cineStage"></div>
  <div class="cine-bottom">
    <div class="cine-bar"><i id="cineFill"></i></div>
    <div class="cine-controls">
      <button class="cbtn" id="cPrev">← Prev</button>
      <button class="cbtn cbtn-main" id="cPlay">❚❚ Pause</button>
      <button class="cbtn" id="cNext">Next →</button>
      <button class="cbtn" id="cSpeed">1×</button>
      <span class="cine-count" id="cineCount">1 / 1</span>
    </div>
  </div>
</div>

<script>
const CINE = CINEDATA;
const esc = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const $ = (id) => document.getElementById(id);
const cine = $('cine'), stage = $('cineStage'), fill = $('cineFill');
const playBtn = $('cPlay'), countEl = $('cineCount'), slateEl = $('cineSlate'), partEl = $('cinePart');
const speedBtn = $('cSpeed');
const SPEEDS = [1, 1.5, 2, 0.6];
let speedIdx = 0, idx = 0, playing = true, elapsed = 0, rafId = null, last = 0;
const CH_COUNT = CINE.filter((b) => b.k === 'slate').length;

function beatDelay(i){ const w = CINE[i].words || 26; return Math.max(1400, Math.min(26000, w * 330)) / SPEEDS[speedIdx]; }
function render(i){
  const b = CINE[i];
  let html = '';
  if (b.k === 'slate'){
    const notes = Object.keys(b.notes || {}).map((k) => '<div class="sc-note"><b>' + k + '</b><span>' + esc(b.notes[k]) + '</span></div>').join('');
    html = '<div class="slate-card"><p class="sc-part">' + esc(b.part) + '</p><span class="sc-num">Chapter ' + String(b.n).padStart(2,'0') + ' of ' + CH_COUNT + '</span><h2>' + esc(b.title) + '</h2>' + (notes ? '<div class="sc-notes">' + notes + '</div>' : '') + '</div>';
    slateEl.textContent = 'Chapter ' + String(b.n).padStart(2,'0');
    partEl.textContent = b.part;
  } else {
    html = '<h4 class="slug">' + esc(b.slug) + '</h4>' + b.html;
    slateEl.textContent = 'Chapter ' + String(b.n).padStart(2,'0');
  }
  stage.innerHTML = '<div class="beat">' + html + '</div>';
  stage.scrollTop = 0;
  countEl.textContent = (i + 1) + ' / ' + CINE.length;
  elapsed = 0; fill.style.width = '0%';
}
function tick(ts){
  if (!playing) return;
  if (!last) last = ts;
  elapsed += ts - last; last = ts;
  const d = beatDelay(idx);
  fill.style.width = Math.min(100, (elapsed / d) * 100) + '%';
  if (elapsed >= d){
    if (idx < CINE.length - 1){ idx++; render(idx); }
    else { playing = false; playBtn.textContent = '↻ Replay'; fill.style.width = '100%'; return; }
  }
  rafId = requestAnimationFrame(tick);
}
function play(){ if (idx >= CINE.length - 1 && !playing){ idx = 0; render(0); } playing = true; playBtn.textContent = '❚❚ Pause'; last = 0; cancelAnimationFrame(rafId); rafId = requestAnimationFrame(tick); }
function pause(){ playing = false; playBtn.textContent = '▶ Play'; cancelAnimationFrame(rafId); }
function openCine(fromCh){
  let start = 0;
  if (fromCh && fromCh > 1){ start = CINE.findIndex((b) => b.k === 'slate' && b.n === fromCh); if (start < 0) start = 0; }
  idx = start;
  cine.classList.add('open'); cine.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
  render(idx); play();
}
function closeCine(){ pause(); cine.classList.remove('open'); cine.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; }

document.querySelectorAll('[data-watch]').forEach((el) => el.addEventListener('click', () => openCine(Number(el.getAttribute('data-watch')) || 1)));
$('cineClose').addEventListener('click', closeCine);
$('cPrev').addEventListener('click', () => { if (idx > 0){ idx--; render(idx); if (playing) play(); } });
$('cNext').addEventListener('click', () => { if (idx < CINE.length - 1){ idx++; render(idx); if (playing) play(); } });
playBtn.addEventListener('click', () => { playing ? pause() : play(); });
speedBtn.addEventListener('click', () => { speedIdx = (speedIdx + 1) % SPEEDS.length; speedBtn.textContent = SPEEDS[speedIdx] + '×'; if (playing){ last = 0; cancelAnimationFrame(rafId); rafId = requestAnimationFrame(tick); } });
document.addEventListener('keydown', (e) => {
  if (!cine.classList.contains('open')) return;
  if (e.key === 'Escape') closeCine();
  else if (e.key === ' '){ e.preventDefault(); playing ? pause() : play(); }
  else if (e.key === 'ArrowRight' && idx < CINE.length - 1){ idx++; render(idx); if (playing) play(); }
  else if (e.key === 'ArrowLeft' && idx > 0){ idx--; render(idx); if (playing) play(); }
});

/* pagination */
const PAGES = document.querySelectorAll('.chapter-page');
let cur = 1;
function goPage(p, scroll){
  p = Math.max(1, Math.min(PAGES.length, p));
  cur = p;
  PAGES.forEach((el) => el.classList.toggle('active', Number(el.dataset.page) === p));
  document.querySelectorAll('.pgbtn').forEach((b) => b.classList.toggle('on', Number(b.dataset.pg) === p));
  document.querySelectorAll('.pgnow').forEach((b) => b.textContent = p);
  document.querySelectorAll('[data-pg="prev"]').forEach((b) => b.disabled = p === 1);
  document.querySelectorAll('[data-pg="next"]').forEach((b) => b.disabled = p === PAGES.length);
  if (history.replaceState) history.replaceState(null, '', '#page-' + p);
  if (scroll) document.getElementById('script').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
document.querySelectorAll('[data-pg]').forEach((btn) => btn.addEventListener('click', () => {
  const v = btn.dataset.pg;
  if (v === 'prev') goPage(cur - 1, true);
  else if (v === 'next') goPage(cur + 1, true);
  else goPage(Number(v), true);
}));
document.querySelectorAll('[data-chapter]').forEach((btn) => btn.addEventListener('click', () => {
  const n = Number(btn.dataset.chapter);
  goPage(Math.ceil(n / ${PER_PAGE}), false);
  const el = document.getElementById('ch-' + n);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}));
const m = location.hash.match(/^#page-(\\d+)$/);
if (m) goPage(Number(m[1]), false);

const prog = $('progressLine');
const onScroll = () => {
  const h = document.documentElement;
  prog.style.width = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight) * 100) + '%';
};
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();
window.COOCHIE = { goPage: goPage };
</script>
</body>
</html>`;

  const cine = [];
  for (const c of chapters) {
    cine.push({ k: 'slate', n: c.n, title: c.title, part: partFor(c.n), notes: {}, words: 0 });
    for (const raw of c.scenes.split('<div class="scene">').slice(1)) {
      const chunk = raw.replace(/<\/div>\s*$/, '');
      const slug = decode((chunk.match(/<h4 class="slug">([\s\S]*?)<\/h4>/) || [, ''])[1]).replace(/\s+/g, ' ').trim();
      const inner = chunk.replace(/<h4 class="slug">[\s\S]*?<\/h4>/, '').trim();
      cine.push({ k: 'scene', n: c.n, slug, html: inner, words: words(inner) });
    }
  }
  for (const b of cine.filter((x) => x.k === 'slate')) {
    const c = chapters[b.n - 1];
    const noteRe = /<span class="slate-k">([^<]+)<\/span><span class="slate-v">([\s\S]*?)<\/span><\/div>/g;
    let r; b.notes = {};
    while ((r = noteRe.exec(c.rows)) !== null) b.notes[r[1].toUpperCase()] = decode(r[2]).replace(/\s+/g, ' ').trim();
  }

  const html = makeHead(cfg) + '</head>\n<body>\n' + body + '\n\n' + tail.replace('CINEDATA', JSON.stringify(cine));
  fs.writeFileSync(cfg.out, html);
  console.log(cfg.out + ':', chapters.length, 'chapters,', pages.length, 'pages,', totalScenes, 'scenes,', totalWords, 'words,', cine.length, 'beats');
  if (html.includes('CINEDATA') || html.includes('{{')) console.log('LEFTOVER PLACEHOLDER in ' + cfg.out);
}

CONFIGS.forEach(build);
