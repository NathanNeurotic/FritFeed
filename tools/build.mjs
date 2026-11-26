import { readFileSync, existsSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const posts = JSON.parse(readFileSync(new URL('posts.json', root), 'utf8'));
const id = number => String(number).padStart(2, '0');
const escape = s => String(s).replace(/[&<>"']/g, c => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
})[c]);
const formatDate = new Intl.DateTimeFormat('en-US', {
  month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'
});
const seen = new Set();
if (!Array.isArray(posts) || !posts.length) throw Error('posts.json needs at least one post');
for (const p of posts) {
  if (!Number.isSafeInteger(p.number) || p.number < 1 || seen.has(p.number) ||
      !['title','caption','alt'].every(k => typeof p[k] === 'string' && p[k].trim()) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(p.date) || Number.isNaN(Date.parse(p.date)) ||
      new Date(p.date).toISOString().slice(0,10) !== p.date ||
      !Number.isInteger(p.width) || p.width < 1 || !Number.isInteger(p.height) || p.height < 1 ||
      !/^assets\/[\w-]+\.webp$/.test(p.image) || !existsSync(new URL(p.image, root))) {
    throw Error('Invalid or duplicate post: ' + JSON.stringify(p));
  }
  seen.add(p.number);
}
posts.sort((a,b) => b.number-a.number);

const cards = posts.map((p,i) => {
  const num = id(p.number);
  return `<article class="post" id="post-${num}" aria-labelledby="title-${num}">
      <header class="post-head">
        <img src="assets/frit.svg" width="34" height="34" alt="">
        <div><h2 id="title-${num}">${escape(p.title)}</h2><span class="byline">by Frit</span></div>
        <a class="post-no" href="#post-${num}" aria-label="Permalink to post ${num}">#${num}</a>
      </header>
      <img class="post-image" src="${p.image}" width="${p.width}" height="${p.height}" loading="${i ? 'lazy':'eager'}" ${i ? '':'fetchpriority="high"'} decoding="async" alt="${escape(p.alt)}">
      <div class="post-body">
        <p><strong>frit</strong> ${escape(p.caption)}</p>
        <time datetime="${escape(p.date)}">${formatDate.format(new Date(p.date))}</time>
      </div>
    </article>`;
}).join('\n');
const grid = posts.map(p => {
  const num = id(p.number);
  const thumb = `assets/${num}-thumb.webp`;
  const src = existsSync(new URL(thumb, root)) ? thumb : p.image;
  return `<li><a href="#post-${num}" aria-label="Jump to ${escape(p.title)}, post ${num}"><img src="${src}" width="160" height="160" loading="lazy" decoding="async" alt=""><span>${num}</span></a></li>`;
}).join('\n');
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#171714">
<meta name="description" content="The fictional photo diary of Frit, a palm-sized porcelain memory card with a habit of taking the scenic route.">
<meta property="og:title" content="Frit’s Field Notes">
<meta property="og:description" content="Small adventures from an easily distracted memory card.">
<meta property="og:type" content="website">
<link rel="icon" href="assets/frit.svg" type="image/svg+xml">
<link rel="stylesheet" href="style.css">
<title>Frit’s Field Notes</title>
</head>
<body id="top">
<a class="skip" href="#feed">Skip to posts</a>
<header class="topbar"><div class="topinner"><a href="#top" class="brand"><img src="assets/frit.svg" alt="" width="32" height="32"> FRIT<span> / FIELD NOTES</span></a>
<nav aria-label="Main"><a href="#feed">Feed</a><a href="#archive">Archive</a></nav></div></header>
<main class="layout">
  <aside class="profile" aria-labelledby="site-title">
    <div class="identity"><img src="assets/frit.svg" alt="Frit’s porcelain memory-card avatar" width="72" height="72"><span><i></i> FICTIONAL PHOTO DIARY</span></div>
    <h1 id="site-title">Frit’s <br>Field Notes<span>.</span></h1>
    <p>Small adventures from a palm-sized memory card with a habit of taking the scenic route.</p>
    <div class="profile-data"><span><b>${posts.length}</b> posts</span><span>NEWEST FIRST ↓</span></div>
  </aside>
  <section class="feed" id="feed" aria-label="Diary feed">
    <div class="section-label"><span>THE FEED</span><span>01–${id(posts[0].number)}</span></div>
    ${cards}
    <footer class="feed-end"><p>You’ve reached the first frame.</p><a href="#top">Back to the top ↑</a></footer>
  </section>
  <aside class="archive" id="archive" aria-labelledby="archive-heading">
    <h2 id="archive-heading" class="section-label">CONTACT SHEET</h2>
    <p>Pick a frame to jump to its post.</p>
    <ol>${grid}</ol>
    <p class="credit">Imagined adventures · AI-generated photography</p>
  </aside>
</main>
</body>
</html>
`;
writeFileSync(new URL('index.html', root), html);
console.log(`Built ${posts.length} posts.`);
