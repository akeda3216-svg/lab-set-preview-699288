/* 第二ビジネス研究所サイト 共通JS。JSが動かなくても本文・金額は全部読める作り。 */
(function () {
  var d = document.documentElement;
  d.classList.remove('no-js'); d.classList.add('js');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* メニュー（スマホ） */
  var btn = document.querySelector('.menu-btn'), nav = document.querySelector('.hd .nav');
  if (btn && nav) {
    var label = btn.querySelector('span');
    btn.addEventListener('click', function () {
      var o = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', o ? 'true' : 'false');
      label.textContent = o ? 'CLOSE' : 'MENU';
    });
  }

  /* 出現 */
  var rv = [].slice.call(document.querySelectorAll('.rv'));
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .1 });
    rv.forEach(function (el) { io.observe(el); });
    setTimeout(function () { rv.forEach(function (el) { el.classList.add('in'); }); }, 3000);
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  /* 見積もりシミュレーター */
  var sim = document.getElementById('sim');
  if (sim) {
    var P = { 1: 44670, 2: 53460, 3: 62250, 4: 71040, 5: 79830 };
    var FIT = {
      1: '個人事業・名刺代わり。会社名と対応エリア、連絡先。',
      2: 'トップ＋できる作業と対応地域。',
      3: '営業HPの最小構成（トップ・作業と地域・会社情報）。',
      4: '営業HP＋施工例と報告のしかた。',
      5: '営業HP 3ページ＋採用HP 2ページのセット。このサイトと同じ5ページ。'
    };
    var out = sim.querySelector('[data-out]'), fit = sim.querySelector('[data-fit]'), bs = sim.querySelectorAll('button');
    var set = function (n) {
      out.innerHTML = P[n].toLocaleString('ja-JP') + '<small>円（税込）</small>';
      fit.textContent = n + 'ページ：' + FIT[n];
      [].forEach.call(bs, function (b) { b.setAttribute('aria-pressed', b.dataset.n == n ? 'true' : 'false'); });
    };
    [].forEach.call(bs, function (b) { b.addEventListener('click', function () { set(+b.dataset.n); }); });
    set(5);
  }

  /* トップへ入る前の一動作（約4秒・SKIPあり）：ページが増えるたび金額が決まる */
  var kv = document.querySelector('.kv');
  if (!kv) return;
  var pgs = kv.querySelectorAll('.pg'), yen = kv.querySelector('.yen b');
  var showFinal = function () {
    [].forEach.call(pgs, function (p) { p.classList.add('on'); });
    yen.textContent = '79,830';
  };
  var intro = document.getElementById('intro');
  var seen = false;
  try { seen = sessionStorage.getItem('lab_intro') === '1'; } catch (e) {}
  if (!intro || seen || reduce) { if (intro) intro.remove(); showFinal(); kv.classList.add('ready'); return; }
  kv.classList.add('pre');

  var beats = intro.querySelectorAll('.beat');
  var at = [0, 1800, 4200, 5600, 7100]; /* 各カットの開始(ms)。1:1.8秒 2:2.4秒 3:1.4秒 4:1.5秒 5:1.9秒 */
  var timers = [], done = false;
  var finish = function () {
    if (done) return; done = true;
    timers.forEach(clearTimeout);
    try { sessionStorage.setItem('lab_intro', '1'); } catch (e) {}
    intro.classList.add('out');
    showFinal();
    kv.classList.remove('pre'); kv.classList.add('ready');
    setTimeout(function () { if (intro.parentNode) intro.remove(); }, 900);
  };
  at.forEach(function (ms, i) {
    timers.push(setTimeout(function () {
      [].forEach.call(beats, function (b) { b.classList.remove('on'); });
      beats[i].classList.add('on');
      if (i === 1) setTimeout(function () { beats[1].classList.add('go'); }, 60);
    }, ms));
  });
  timers.push(setTimeout(finish, 9000));
  intro.querySelector('.skip').addEventListener('click', finish);
})();
