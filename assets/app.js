(() => {
  'use strict';
  const root = new URL('../', document.currentScript.src);
  const url = path => new URL(path, root).href;
  const D = window.RPO;
  const page = document.body.dataset.page;
  const $ = selector => document.querySelector(selector);
  const brand = `<span class="brand-mark" aria-hidden="true">R/</span><span class="brand-name">RETRO POKE<br>OFFLINE <span>2027</span></span>`;
  const navItems = [['home','TOP',''],['ranking','ランキング','ranking/'],['events','オフ会・結果','events/'],['guidelines','ガイドライン・ポイント','guidelines/']];
  $('#siteHeader').innerHTML = `<div class="sample-strip"><strong>DESIGN PREVIEW</strong>掲載中の開催日・大会結果・配点は、すべて架空のサンプルです。</div><header class="header"><div class="wrap header-inner"><a class="brand" href="${url('')}" aria-label="RETRO Poke OFFLINE 2027 トップ">${brand}</a><button class="menu-button" type="button" aria-expanded="false" aria-controls="mainNav">MENU <span aria-hidden="true">＋</span></button><nav id="mainNav" class="nav" aria-label="メインナビゲーション">${navItems.map(([id,label,path]) => `<a href="${url(path)}" ${page === id ? 'aria-current="page"' : ''}>${label}</a>`).join('')}</nav></div></header>`;
  $('#siteFooter').innerHTML = `<footer class="footer"><div class="wrap"><div class="footer-top"><a class="brand" href="${url('')}" aria-label="RETRO Poke OFFLINE 2027 トップ">${brand}</a><nav class="footer-links" aria-label="フッターナビゲーション"><a href="${url('#about')}">ABOUT US</a><a href="${url('#news')}">お知らせ</a><a href="${url('guidelines/')}">ガイドライン</a><a href="${url('#contact')}">お問い合わせ</a></nav></div><div class="footer-bottom"><p>有志によるコミュニティイベントのサンプルサイトです。<br>任天堂・クリーチャーズ・ゲームフリークおよび株式会社ポケモンの公式イベントではありません。</p><p>© 2027 RETRO Poke OFFLINE<br>DESIGN PROTOTYPE / SAMPLE DATA</p></div></div></footer>`;
  const menu = $('.menu-button');
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open)); $('#mainNav').classList.toggle('open', open);
    menu.innerHTML = `${open ? 'CLOSE' : 'MENU'} <span aria-hidden="true">${open ? '−' : '＋'}</span>`;
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { menu.click(); menu.focus(); } });
  $('#mainNav').addEventListener('click', event => { if (event.target.closest('a') && menu.getAttribute('aria-expanded') === 'true') menu.click(); });
  const tags = () => D.formats.map(f => `<span class="tag">${f.name}</span>`).join('');
  if (page === 'home') {
    $('#homeEvents').innerHTML = D.events.map(event => `<a class="event-row" href="${url(`events/?event=${event.id}`)}"><div class="event-date"><small>${event.date.slice(0,4)} / ${event.city}</small>${event.date.slice(5)}</div><div><h3>${event.name}</h3><div class="format-tags">${tags()}</div></div><div class="event-status">結果を見る<span class="visually-hidden">（${event.name}）</span></div></a>`).join('');
    $('#homeRanking').innerHTML = D.ranking().slice(0,3).map(player => `<div class="mini-rank"><span class="rank-number">${String(player.rank).padStart(2,'0')}</span><div><span class="mini-name">${player.name}</span><span class="mini-points">${player.points.toLocaleString()}<small>pt</small></span></div></div>`).join('');
  }
  function formatButtons(container, active, includeAll, handler) {
    container.innerHTML = [...(includeAll ? [{id:'all', name:'総合'}] : []), ...D.formats].map(f => `<button type="button" class="tab" data-format="${f.id}" aria-pressed="${active === f.id}">${f.name}</button>`).join('');
    container.querySelectorAll('button').forEach(button => button.addEventListener('click', () => handler(button.dataset.format)));
  }
  if (page === 'ranking') {
    let active = 'all', currentPage = 1;
    const pageSize = 10;
    const dialog = $('#playerDialog');
    const showPlayer = id => {
      const player = D.ranking(active).find(p => p.id === id);
      if (!player) return;
      $('#dialogTitle').textContent = `${player.name}のポイント内訳`;
      $('#dialogSummary').textContent = `${active === 'all' ? '総合' : D.formats.find(f => f.id === active).name} / 合計 ${player.points.toLocaleString()} pt / ${player.events}大会に参加`;
      $('#dialogBody').innerHTML = player.entries.map(entry => {
        const event = D.events.find(e => e.id === entry.eventId), format = D.formats.find(f => f.id === entry.formatId);
        return `<tr><td><a class="text-link" href="${url(`events/?event=${event.id}&format=${format.id}`)}">${event.name}</a></td><td>${format.name}</td><td class="num">${entry.rank}位</td><td class="num">${D.basePoints(entry.rank)} × ${D.scale(event.count).rate}</td><td class="num accent">${entry.points} pt</td></tr>`;
      }).join('');
      dialog.showModal(); document.body.classList.add('body-lock');
    };
    $('#closeDialog').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => document.body.classList.remove('body-lock'));
    dialog.addEventListener('click', event => { if (event.target === dialog) { const b = dialog.getBoundingClientRect(); if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) dialog.close(); } });
    function render() {
      formatButtons($('#rankingTabs'), active, true, value => { active = value; currentPage = 1; render(); });
      const all = D.ranking(active);
      const search = $('#playerSearch').value.trim().normalize('NFKC').toLocaleLowerCase('ja');
      const filtered = all.filter(p => p.name.normalize('NFKC').toLocaleLowerCase('ja').includes(search));
      const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
      currentPage = Math.min(currentPage, pages);
      const shown = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
      $('#rankingPlayerCount').textContent = all.length;
      $('#rankingFormatLabel').textContent = active === 'all' ? '総合ランキング（表示サンプル）' : D.formats.find(f => f.id === active).name;
      $('#rankingBody').innerHTML = shown.length ? shown.map(p => `<tr><td class="rank-cell ${p.rank <= 3 ? 'rank-top' : ''}">${String(p.rank).padStart(2,'0')}</td><td><button type="button" class="player-button" data-player="${p.id}" aria-label="${p.name}のポイント内訳"><span class="avatar" aria-hidden="true">${p.name.slice(0,1)}</span><span class="player-name">${p.name}</span></button></td><td class="num"><span class="points-cell">${p.points.toLocaleString()}<small>pt</small></span></td><td class="num">${p.events}<span class="muted"> 大会</span></td><td class="num">${p.wins}<span class="muted"> 回</span></td><td class="movement">${p.podiums}回</td></tr>`).join('') : '<tr><td colspan="6" class="empty">該当する参加者が見つかりません。検索語を変更してください。</td></tr>';
      $('#rankingBody').querySelectorAll('[data-player]').forEach(button => button.addEventListener('click', () => showPlayer(button.dataset.player)));
      $('#pageSummary').textContent = filtered.length ? `${filtered.length}名中 ${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filtered.length)}名を表示` : '0名を表示';
      const indices = [...new Set([1, currentPage - 1, currentPage, currentPage + 1, pages])].filter(p => p > 0 && p <= pages).sort((a,b) => a - b);
      let last = 0;
      $('#paginationButtons').innerHTML = `<button type="button" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''} aria-label="前のページ">前へ</button>` + indices.map(p => { const gap = p > last + 1 ? '<span aria-hidden="true" style="padding:8px">…</span>' : ''; last = p; return `${gap}<button type="button" data-page="${p}" ${p === currentPage ? 'aria-current="page"' : ''} aria-label="${p}ページ目">${p}</button>`; }).join('') + `<button type="button" data-page="${currentPage + 1}" ${currentPage === pages ? 'disabled' : ''} aria-label="次のページ">次へ</button>`;
      $('#paginationButtons').querySelectorAll('button').forEach(button => button.addEventListener('click', () => { currentPage = Number(button.dataset.page); render(); $('#rankingTable').scrollIntoView({block:'start',behavior:'auto'}); }));
    }
    $('#playerSearch').addEventListener('input', () => { currentPage = 1; render(); });
    render();
  }
  if (page === 'events') {
    const params = new URLSearchParams(location.search);
    let eventId = D.events.some(e => e.id === params.get('event')) ? params.get('event') : D.events[0].id;
    let formatId = D.formats.some(f => f.id === params.get('format')) ? params.get('format') : D.formats[0].id;
    $('#eventSelect').innerHTML = D.events.map(e => `<option value="${e.id}">${e.date}　${e.name}</option>`).join('');
    $('#eventSelect').value = eventId;
    const partyMarkup = party => party.map(name => `<span class="party-mon">${name}</span>`).join('');
    function render() {
      const event = D.events.find(e => e.id === eventId), format = D.formats.find(f => f.id === formatId);
      const entries = D.results.filter(r => r.eventId === eventId && r.formatId === formatId);
      document.title = `${event.name}｜RETRO Poke OFFLINE 2027`;
      $('#eventName').textContent = event.name;
      $('#eventNumber').textContent = event.edition;
      $('#eventDate').textContent = event.date;
      $('#eventPlace').textContent = event.place;
      $('#eventCount').textContent = `${event.count}名`;
      $('#eventScale').textContent = `${D.scale(event.count).name}クラス / ×${D.scale(event.count).rate}`;
      $('#eventHost').textContent = event.host;
      $('#eventIntro').textContent = `${event.city}で開催された予選オフ会を想定したサンプルです。4部門の順位・パーティ・KPを切り替えて確認できます。`;
      formatButtons($('#eventTabs'), formatId, false, value => { formatId = value; render(); });
      $('#eventPodium').innerHTML = entries.slice(0,2).map((entry, i) => `<article class="podium-card ${i ? 'runner' : ''}"><p class="podium-label">${i ? 'RUNNER-UP / 準優勝' : 'CHAMPION / 優勝'}</p><div class="podium-top"><h2 class="podium-name">${D.players.find(p => p.id === entry.playerId).name}</h2><p class="podium-points">${entry.points}<small>pt</small></p></div><p class="party-label">使用パーティ / 種族名（サンプル構成）</p><div class="party-list">${partyMarkup(entry.party)}</div></article>`).join('');
      $('#resultCount').textContent = `${format.name} / ${entries.length}名`;
      $('#eventResults').innerHTML = entries.map(entry => `<tr><td class="rank-cell ${entry.rank <= 3 ? 'rank-top' : ''}">${String(entry.rank).padStart(2,'0')}</td><td>${D.players.find(p => p.id === entry.playerId).name}</td><td class="num"><span class="points-cell">${entry.points}<small>pt</small></span></td></tr>`).join('');
      $('#kpCoverage').textContent = `${entries.length} / ${entries.length}名・収集率100%`;
      $('#kpRows').innerHTML = D.kp(eventId, formatId).map((row,i) => `<div class="kp-row"><span class="kp-rank">${String(i+1).padStart(2,'0')}</span><div>${row.name}<div class="kp-bar" aria-hidden="true"><span style="width:${row.percent.toFixed(1)}%"></span></div></div><div class="kp-count"><strong>${row.percent.toFixed(1)}%</strong>${row.count} / ${entries.length}名</div></div>`).join('');
      const next = new URL(location.href); next.searchParams.set('event', eventId); next.searchParams.set('format', formatId); history.replaceState(null,'',next);
    }
    $('#eventSelect').addEventListener('change', event => { eventId = event.target.value; render(); });
    render();
  }
  if (page === 'guidelines') {
    const count = $('#calcCount'), rank = $('#calcRank');
    const calculate = () => {
      const n = Number(count.value), r = Number(rank.value);
      count.setCustomValidity('');
      if (!Number.isInteger(n) || n < 2 || n > 512 || r > n) {
        $('#calcNumber').textContent = '—';
        $('#calcDetail').textContent = r > n ? '順位は参加人数以下にしてください。' : '参加人数を2〜512人の整数で入力してください。';
        count.setAttribute('aria-invalid','true'); return;
      }
      count.removeAttribute('aria-invalid');
      $('#calcNumber').textContent = D.points(r,n);
      $('#calcDetail').textContent = `基礎 ${D.basePoints(r)} pt × ${D.scale(n).rate}（${D.scale(n).name}クラス）／小数点以下切り捨て`;
    };
    count.addEventListener('input', calculate); rank.addEventListener('change', calculate); calculate();
  }
})();
