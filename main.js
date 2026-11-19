// Light editorial template: renders everything from data.js, GSAP motion on desktop, LITE mode on phones.
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const IMG = 'img/';
// Phones / touch: heavy scroll effects off (they stuttered on a real phone in the АРТ ТЮНИНГ demo)
const LITE = window.matchMedia('(max-width: 960px), (hover: none)').matches;
document.documentElement.classList.add('js');
if (LITE) document.documentElement.classList.add('lite');

/* ---------- texts & links from SITE ---------- */
const S = SITE;
const setText = (sel, v) => $$(sel).forEach((el) => (el.textContent = v));
$$('[data-logo]').forEach((el) => (el.innerHTML = S.logoHtml));
setText('[data-kind]', S.kind);
setText('[data-city]', S.city);
setText('[data-rating]', S.rating);
setText('[data-rating-count]', S.ratingCount);
setText('[data-review-count]', S.reviewCount);
setText('[data-hours]', HOURS_TEXT);
setText('[data-address]', S.city + ', ' + S.address);
setText('[data-address-short]', S.address);
setText('[data-near]', S.near);
const extLink = (a, url) => { if (!url) { a.remove(); return; } a.href = url; a.target = '_blank'; a.rel = 'noopener'; };
// no online booking -> booking buttons call the phone
$$('[data-booking]').forEach((a) => (S.booking && S.booking !== '#' ? extLink(a, S.booking) : (a.href = S.phoneHref)));
$$('[data-yandex]').forEach((a) => extLink(a, S.yandex));
$$('[data-wa]').forEach((a) => extLink(a, S.whatsapp));
$$('[data-tg]').forEach((a) => extLink(a, S.telegram));
$$('[data-vk]').forEach((a) => extLink(a, S.vk));
$$('[data-route]').forEach((a) => extLink(a, S.route));
$$('[data-phone]').forEach((a) => { a.href = S.phoneHref; a.textContent = S.phone; });
$$('[data-phone-icon]').forEach((a) => (a.href = S.phoneHref));
const paintStatus = () => { const s = openStatus(); $$('[data-status]').forEach((el) => { el.classList.toggle('is-open', s.open); $('b', el).textContent = s.text; }); };
paintStatus(); setInterval(paintStatus, 60000);

$('#badges').innerHTML = [
  S.award && `<span class="badge"><b>✦</b>${S.award}</span>`,
  `<span class="badge"><b>${S.rating}</b>рейтинг на Яндексе</span>`,
  `<span class="badge"><b>${S.reviewCount}</b>отзывов</span>`,
].filter(Boolean).join('');
$('#perks').innerHTML = PERKS.map((p) => `<li>${p}</li>`).join('');
if (S.promo) {
  const pr = $('#promo'); pr.hidden = false;
  $('.promo__pct', pr).textContent = S.promo.pct; $('b', pr).textContent = S.promo.title; $('p span', pr).textContent = S.promo.text;
}

/* ---------- services index ---------- */
$('#svcIndex').innerHTML = SERVICES.map((s, i) => `
  <li class="irow" data-reveal data-id="${s.id}" data-img="${IMG}${s.img}.webp">
    <span class="irow__n">${String(i + 1).padStart(2, '0')}</span>
    <h3>${s.t}<small>${s.d}</small></h3>
    <span class="irow__p"><small>от</small>${fmtPrice(minPrice(s.id))}</span>
    <span class="irow__go">→</span>
  </li>`).join('');

// floating photo that follows the cursor over the index (desktop only)
if (!LITE) {
  const peek = $('#peek'), pimg = $('img', peek);
  let tx = 0, ty = 0, x = 0, y = 0;
  $('#svcIndex').addEventListener('pointerover', (e) => { const r = e.target.closest('.irow'); if (r) { pimg.src = r.dataset.img; peek.classList.add('is-on'); } });
  $('#svcIndex').addEventListener('pointerleave', () => peek.classList.remove('is-on'));
  addEventListener('pointermove', (e) => { tx = e.clientX + 170; ty = e.clientY; }, { passive: true });
  (function loop() { x += (tx - x) * .14; y += (ty - y) * .14; peek.style.left = x + 'px'; peek.style.top = y + 'px'; requestAnimationFrame(loop); })();
}

/* ---------- gallery ---------- */
const cols = $$('.col');
GALLERY.forEach(([f, c], i) => cols[i % 3].insertAdjacentHTML('beforeend', `<figure><img src="${IMG}${f}.webp" alt="${c} — работа ${S.name}" loading="lazy"><figcaption>${c}</figcaption></figure>`));

/* ---------- masters ---------- */
if (MASTERS.length) {
  $('#mastersGrid').innerHTML = MASTERS.map((m) => `
    <article class="master" data-reveal>
      <div class="master__ph">${m.img ? `<img src="${IMG}${m.img}.webp" alt="${m.role} ${m.name}" loading="lazy">` : `<span class="letter">${m.name[0]}</span>`}</div>
      <small>${m.role}</small><h3>${m.name}</h3><p>${m.note}</p>
    </article>`).join('');
} else $('#masters').remove();

/* ---------- prices accordion ---------- */
const plural = (n, one, few, many) => (n % 10 === 1 && n % 100 !== 11 ? one : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? few : many);
$('#acc').innerHTML = PRICES.map((c, i) => `
  <div class="acc__item${i ? '' : ' is-open'}" id="acc-${c.id}">
    <button class="acc__btn" aria-expanded="${!i}"><span>${c.name}</span><small>${c.items.length} ${plural(c.items.length, 'позиция', 'позиции', 'позиций')}</small><em>+</em></button>
    <div class="acc__panel"><div class="acc__inner">
      ${c.items.map(([t, p, from]) => `<div class="acc__row"><span>${t}</span><b>${from ? 'от ' : ''}${fmtPrice(p)}</b></div>`).join('')}
    </div></div>
  </div>`).join('');
function openAcc(id) {
  $$('.acc__item').forEach((it) => { const on = it.id === 'acc-' + id && !it.classList.contains('is-open'); it.classList.toggle('is-open', on); $('.acc__btn', it).setAttribute('aria-expanded', on); });
  setTimeout(() => window.ScrollTrigger && ScrollTrigger.refresh(), 600);
}
$('#acc').addEventListener('click', (e) => { const b = e.target.closest('.acc__btn'); if (b) openAcc(b.parentElement.id.slice(4)); });
$('#svcIndex').addEventListener('click', (e) => {
  const r = e.target.closest('.irow'); if (!r) return;
  const it = $('#acc-' + r.dataset.id); if (!it) return;
  if (!it.classList.contains('is-open')) openAcc(r.dataset.id);
  setTimeout(() => it.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
});

/* ---------- reviews marquee ---------- */
const card = (r) => `<article class="rcard"><p>«${r.t}»</p><cite><span class="st">★★★★★</span><b>${r.a}</b> · Яндекс Карты</cite></article>`;
const half = Math.ceil(REVIEWS.length / 2);
[[REVIEWS.slice(0, half), '#rrow1'], [REVIEWS.slice(half), '#rrow2']].forEach(([arr, sel]) => {
  const html = arr.map(card).join('');
  $('.rrow__track', $(sel)).innerHTML = html + html; // doubled for a seamless loop
});

/* ---------- header & mobile menu ---------- */
const hdr = $('#hdr');
addEventListener('scroll', () => hdr.classList.toggle('is-solid', scrollY > 40), { passive: true });
const burger = $('#burger'), mnav = $('#mnav');
burger.onclick = () => { const o = !mnav.classList.contains('is-open'); mnav.classList.toggle('is-open', o); burger.setAttribute('aria-expanded', o); };
$$('a', mnav).forEach((a) => (a.onclick = () => { mnav.classList.remove('is-open'); burger.setAttribute('aria-expanded', false); }));

/* ---------- manifesto words ---------- */
const man = $('#manifesto');
man.innerHTML = man.innerHTML.split(/(\s+)/).map((w) => (w.trim() ? `<span class="w">${w}</span>` : w)).join('');

/* ---------- motion ---------- */
let introDone = false; // guard: intro must run once (load + safety timer)
function intro() {
  if (introDone) return; introDone = true;
  if (!window.gsap) { $('#curtain').remove(); return; }
  const tl = gsap.timeline();
  tl.from('.curtain__word', { opacity: 0, y: 30, duration: .8, ease: 'power3.out' })
    .to('.curtain__word', { opacity: 0, y: -20, duration: .5, ease: 'power2.in' }, '+=.35')
    .to('#curtain', { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' })
    .set('#curtain', { display: 'none' })
    .from('.hero__title .row > span', { yPercent: 105, duration: 1.2, stagger: .1, ease: 'expo.out' }, '-=.55')
    .from('#heroArch', { clipPath: 'inset(100% 0 0 0 round 999px 999px 18px 18px)', duration: 1.3, ease: 'expo.inOut' }, '-=1.3')
    .from('#heroArch img', { scale: 1.4, duration: 1.8, ease: 'expo.out' }, '<')
    .from('.arch--side', { opacity: 0, y: 80, duration: 1.1, stagger: .12, ease: 'power3.out' }, '-=1.4')
    .from('.hero__kicker, .hero__meta, .hdr', { opacity: 0, duration: .9, stagger: .08 }, '-=1');
}
addEventListener('load', () => setTimeout(intro, 150));
setTimeout(intro, 3500); // safety if some image hangs

if (window.gsap) {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  // split only after fonts are ready, otherwise lines are measured with the fallback font
  document.fonts.ready.then(() => {
    $$('.split').forEach((h) => {
      const s = SplitText.create(h, { type: 'lines', mask: 'lines' });
      gsap.from(s.lines, { yPercent: 105, duration: 1.1, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 86%' } });
    });
    ScrollTrigger.refresh();
  });
  ScrollTrigger.batch('[data-reveal]', { start: 'top 90%', onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, stagger: .08, ease: 'power3.out', overwrite: true }) });
  gsap.to('#manifesto .w', { opacity: 1, stagger: .05, ease: 'none', scrollTrigger: { trigger: '#manifesto', start: 'top 80%', end: 'bottom 45%', scrub: true } });

  if (!LITE) {
    // hero: the arch grows to full screen, title splits apart
    const htl = gsap.timeline({ scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom bottom', scrub: .8 } });
    htl.to('#heroArch', { width: '100vw', height: '100vh', borderRadius: 0, ease: 'power2.inOut', duration: 1 }, 0)
      .to('#heroArch img', { scale: 1.02, ease: 'none', duration: 1 }, 0)
      .to('.row--1', { xPercent: -60, opacity: 0, duration: .7 }, 0)
      .to('.row--3', { xPercent: 60, opacity: 0, duration: .7 }, 0)
      .to('.row--2', { scale: .6, opacity: 0, duration: .5 }, 0)
      .to('.arch--l', { y: 300, opacity: 0, duration: .6 }, 0)
      .to('.arch--r', { y: -300, opacity: 0, duration: .6 }, 0)
      .to('.hero__kicker, .hero__meta', { opacity: 0, duration: .3 }, 0)
      .to('.arch__cap', { opacity: 1, y: -10, duration: .3 }, .7);
    $$('.col').forEach((c) => gsap.to(c, { yPercent: +c.dataset.speed * 100, ease: 'none', scrollTrigger: { trigger: '#gallery', start: 'top bottom', end: 'bottom top', scrub: true } }));
    gsap.to('.studio__img img', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.studio', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.studio__strip figure', { y: 80, opacity: 0, duration: 1.1, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.studio__strip', start: 'top 85%' } });
    gsap.from('.ftr__word', { yPercent: 50, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.ftr', start: 'top 85%' } });
  }
  addEventListener('load', () => ScrollTrigger.refresh());
}
