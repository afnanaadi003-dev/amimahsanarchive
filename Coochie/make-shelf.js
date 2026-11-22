const fs = require('fs');
const SERIES = require('./src/series');

const cards = SERIES.map((s) => {
  const live = s.n === 1;
  const href = live ? 'series-01.html' : null;
  const body = `
    <span class="sn">${String(s.n).padStart(2, '0')}</span>
    <h3>${s.title}</h3>
    <p class="log">${s.logline}</p>
    <p class="meta"><span>${s.chapters} chapters</span><span>${live ? 'Written' : 'In development'}</span></p>
    ${live
      ? `<a class="go" href="${href}">Read series one <span>→</span></a>`
      : `<span class="soon">Not yet written</span>`}`;
  return live
    ? `<article class="card live">${body}</article>`
    : `<article class="card">${body}</article>`;
}).join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Coochie — Twenty-Four Series</title>
<meta name="description" content="Coochie: a film project in twenty-four series, thirty or more chapters each, by Amim Ahsan. Series one is written.">
<style>
:root{--bg:#0a0a0c;--ink:#f2ead9;--soft:#c9bfae;--muted:#8c8477;--gold:#c8a15a;--line:rgba(200,161,90,.18)}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font-family:Inter,system-ui,-apple-system,Segoe UI,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}
.wrap{max-width:1180px;margin:0 auto;padding:clamp(28px,6vw,72px) clamp(18px,4vw,44px)}
.kicker{font-size:.62rem;letter-spacing:.38em;text-transform:uppercase;color:var(--gold);margin:0 0 18px}
h1{font-family:Georgia,'Times New Roman',serif;font-style:italic;font-weight:400;font-size:clamp(3rem,9vw,5.6rem);line-height:.95;margin:0}
.lede{max-width:60ch;color:var(--soft);line-height:1.75;margin:22px 0 0;font-size:1rem}
.stats{display:flex;gap:28px;flex-wrap:wrap;margin:34px 0 0;padding-top:24px;border-top:1px solid var(--line)}
.stats div{font-size:.6rem;letter-spacing:.22em;text-transform:uppercase;color:var(--muted)}
.stats b{display:block;font-family:Georgia,serif;font-size:1.6rem;color:var(--ink);font-weight:400;letter-spacing:0;margin-bottom:4px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1px;background:var(--line);border:1px solid var(--line);margin-top:52px}
.card{background:#0b0b0e;padding:26px 24px 24px;position:relative;display:flex;flex-direction:column;min-height:250px}
.card.live{background:linear-gradient(160deg,#15110b,#0b0b0e 60%)}
.sn{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.68rem;letter-spacing:.18em;color:var(--gold);opacity:.75}
.card h3{font-family:Georgia,serif;font-size:1.28rem;font-weight:400;letter-spacing:.06em;margin:12px 0 10px;line-height:1.2}
.log{color:var(--soft);font-size:.86rem;line-height:1.65;margin:0 0 18px;flex:1}
.meta{display:flex;gap:14px;flex-wrap:wrap;font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);margin:0 0 14px}
.go{display:inline-flex;align-items:center;gap:10px;align-self:flex-start;background:var(--gold);color:#16120b;text-decoration:none;
  font-size:.62rem;letter-spacing:.2em;text-transform:uppercase;font-weight:700;padding:11px 16px;border-radius:999px}
.go:hover{background:#dcb672}
.soon{font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:#6c655a}
footer{border-top:1px solid var(--line);margin-top:56px;padding-top:22px;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;
  font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted)}
footer a{color:var(--soft);text-decoration:none}
footer a:hover{color:var(--gold)}
@media (max-width:680px){.grid{grid-template-columns:1fr}.stats{gap:18px}}
</style>
</head>
<body>
<div class="wrap">
  <p class="kicker">Coochie · a film project</p>
  <h1>Twenty-Four Series</h1>
  <p class="lede">A word, a borrowed camera, and twenty-four summers of people making things badly in public until they get good.
    Every series carries thirty chapters or more; the count goes up when a story needs the room.</p>
  <div class="stats">
    <div><b>24</b>Series</div>
    <div><b>720+</b>Chapters minimum</div>
    <div><b>1</b>Written so far</div>
    <div><b>30</b>Chapters in series one</div>
  </div>

  <div class="grid">
${cards}
  </div>

  <footer>
    <span>Coochie · written &amp; directed by Amim Ahsan</span>
    <a href="../index.html">Back to the archive</a>
  </footer>
</div>
</body>
</html>`;
fs.writeFileSync('index.html', html);
console.log('shelf written:', SERIES.length, 'series');
