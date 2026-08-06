/* Econolik · панель прогресса «Мои результаты» (Теория · Тесты · Термины · Игры).
   Работает для гостя (localStorage) и для ученика по коду. Самодостаточно, без сборки.
   Локализация: язык берётся из URL (/kz/…, /en/…), по умолчанию RU. */
(function () {
  var KEY = 'econ_progress';
  var N = 26; // всего тем в курсе

  function lang() { var m = (location.pathname || '').match(/^\/(kz|en)(\/|$)/); return m ? m[1] : 'ru'; }

  // Категории со званиями (шуточные уровни: 0% / >0 / ≥40 / ≥70 / 100) и подписи-подсказки — на 3 языка
  var CATS = {
    ru: [
      { k: 'Теория', full: '📖 Теория', labels: ['👻 Ни разу не открывал', '🦥 Листал по диагонали', '🐢 Читает, но не спеша', '📖 Книгочей', '🎓 Магистр теории'], tip: function (n) { return 'Прочитано тем: ' + n + ' из ' + N; } },
      { k: 'Тесты', full: '⚡ Тесты-блицы', labels: ['🙈 Тест? Не слышал', '🎲 Угадывал методом тыка', '📝 Сдаёт кое-как', '⭐ Твёрдый отличник', '🏆 Непобедимый'], tip: function (n) { return 'Пройдено тестов: ' + n + ' из ' + N; } },
      { k: 'Термины', full: '🃏 Термины', labels: ['🤷 Слова незнакомые', '🔤 Изучает алфавит', '💬 Уже разбирается', '📚 Терминолог', '🗣️ Живой словарь'], tip: function (n) { return 'Сыграно в термины: ' + n; } },
      { k: 'Игры', full: '🎮 Игры', labels: ['🛋️ Диванный экономист', '🎯 Попробовал на вкус', '🕹️ Подсел на игру', '🎮 Геймер', '💰 Коктейльный магнат'], tip: function (n) { return 'Сыграно партий: ' + n; } }
    ],
    kz: [
      { k: 'Теория', full: '📖 Теория', labels: ['👻 Бір рет те ашпаған', '🦥 Жүгіртіп шыққан', '🐢 Асықпай оқиды', '📖 Кітапқұмар', '🎓 Теория магистрі'], tip: function (n) { return 'Оқылған тақырып: ' + n + ' / ' + N; } },
      { k: 'Тесттер', full: '⚡ Блиц-тесттер', labels: ['🙈 Тест? Естімеппін', '🎲 Соқыр болжаумен', '📝 Әйтеуір тапсырады', '⭐ Мықты озат', '🏆 Жеңілмейтін'], tip: function (n) { return 'Өткен тест: ' + n + ' / ' + N; } },
      { k: 'Терминдер', full: '🃏 Терминдер', labels: ['🤷 Сөздер бейтаныс', '🔤 Әліпби үйренуде', '💬 Түсіне бастады', '📚 Терминолог', '🗣️ Тірі сөздік'], tip: function (n) { return 'Терминдер ойыны: ' + n; } },
      { k: 'Ойындар', full: '🎮 Ойындар', labels: ['🛋️ Диван экономисі', '🎯 Дәмін татып көрді', '🕹️ Ойынға түсіп кетті', '🎮 Геймер', '💰 Коктейль магнаты'], tip: function (n) { return 'Ойналған партия: ' + n; } }
    ],
    en: [
      { k: 'Theory', full: '📖 Theory', labels: ['👻 Never opened it', '🦥 Skimmed diagonally', '🐢 Reads, but slowly', '📖 Bookworm', '🎓 Theory master'], tip: function (n) { return 'Topics read: ' + n + ' of ' + N; } },
      { k: 'Quizzes', full: '⚡ Quizzes', labels: ['🙈 A test? Never heard', '🎲 Pure guesswork', '📝 Scrapes a pass', '⭐ Solid A-student', '🏆 Unbeatable'], tip: function (n) { return 'Quizzes done: ' + n + ' of ' + N; } },
      { k: 'Terms', full: '🃏 Terms', labels: ['🤷 Words are strangers', '🔤 Learning the alphabet', '💬 Getting the hang of it', '📚 Terminologist', '🗣️ Walking dictionary'], tip: function (n) { return 'Terms games played: ' + n; } },
      { k: 'Games', full: '🎮 Games', labels: ['🛋️ Armchair economist', '🎯 Had a taste', '🕹️ Hooked on the game', '🎮 Gamer', '💰 Cocktail tycoon'], tip: function (n) { return 'Games played: ' + n; } }
    ]
  };
  var UI = {
    ru: { chipTitle: 'Мои результаты', profile: '⭐ Мой профиль', close: 'Закрыть', sub: 'Учителю видны только результаты, пройденные под личным кодом.', codeLbl: 'Код:', resultsSeen: 'результаты видит учитель', more: 'Подробная расшифровка →', reset: 'Сбросить прогресс', confirm: 'Сбросить весь сохранённый прогресс в этом браузере?', logout: 'Выйти', byCode: 'вход по коду', guest: 'Гость · прогресс хранится в этом браузере', cabinet: 'Открыть кабинет →', teacherRole: 'вы вошли как учитель' },
    kz: { chipTitle: 'Менің нәтижелерім', profile: '⭐ Менің профилім', close: 'Жабу', sub: 'Мұғалім тек жеке кодпен өтілген нәтижелерді көреді.', codeLbl: 'Код:', resultsSeen: 'нәтижені мұғалім көреді', more: 'Толық талдау →', reset: 'Прогресті тазалау', confirm: 'Осы браузердегі барлық сақталған прогрессті тазалау керек пе?', logout: 'Шығу', byCode: 'код арқылы кіру', guest: 'Қонақ · прогресс осы браузерде сақталады', cabinet: 'Кабинетті ашу →', teacherRole: 'мұғалім ретінде кірдіңіз' },
    en: { chipTitle: 'My results', profile: '⭐ My profile', close: 'Close', sub: 'The teacher sees only results completed while signed in with a code.', codeLbl: 'Code:', resultsSeen: 'the teacher sees the results', more: 'Full breakdown →', reset: 'Reset progress', confirm: 'Reset all saved progress in this browser?', logout: 'Sign out', byCode: 'signed in with a code', guest: 'Guest · progress is kept in this browser', cabinet: 'Open dashboard →', teacherRole: 'signed in as a teacher' }
  };
  function cats() { return CATS[lang()] || CATS.ru; }
  function ui() { return UI[lang()] || UI.ru; }

  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } }
  function shape(p) { p = p || {}; return { read: p.read || [], scores: p.scores || {}, terms: p.terms || 0, termsBy: p.termsBy || {}, games: p.games || 0 }; }
  function get() { return shape(load()); }
  function put(p) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {} render(); }

  var API = {
    markTheory: function (slug) { var p = get(); if (slug && p.read.indexOf(slug) < 0) { p.read.push(slug); put(p); } else { render(); } },
    markQuiz: function (slug, score, total) { try { window.trackEvent && window.trackEvent('QUIZ_PASSED'); } catch (e) {} var p = get(); if (slug) { p.scores[slug] = { s: score, t: total, at: Date.now() }; put(p); } },
    markTerms: function (slug, mistakes, secs) {
      try { window.trackEvent && window.trackEvent('TERMS_PLAYED'); } catch (e) {}
      var p = get(); p.terms = (p.terms || 0) + 1;
      if (slug) {
        p.termsBy = p.termsBy || {};
        var prev = p.termsBy[slug], cur = { mistakes: mistakes || 0, secs: secs || 0, at: Date.now() };
        if (!prev || cur.mistakes < prev.mistakes || (cur.mistakes === prev.mistakes && cur.secs < prev.secs)) p.termsBy[slug] = cur;
      }
      put(p);
    },
    markGame: function () { try { window.trackEvent && window.trackEvent('GAME_PLAYED'); } catch (e) {} var p = get(); p.games = (p.games || 0) + 1; put(p); },
    reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} render(); },
    refresh: function () { render(); },
    get: get,
    total: function () { return N; },
    // 4 категории со званием и цветом — для страницы расшифровки (язык — из URL)
    segments: function () { var p = get(); return segs(p).map(function (x) { return { k: x.k, full: x.full, pct: x.pct, tip: x.tip, rank: rankLabel(x.pct, x.labels), color: rankColor(x.pct) }; }); }
  };
  window.EconProgress = API;
  // «вошёл» = вход по коду ИЛИ сохранение в браузере — в обоих случаях показываем панель
  function optedIn() { try { return !!localStorage.getItem('econ_student') || localStorage.getItem('econ_saved_browser') === '1'; } catch (e) { return false; } }
  // данные вошедшего ученика (вход по личному коду) — {name, code, …} или null
  function studentInfo() { try { return JSON.parse(localStorage.getItem('econ_student') || 'null'); } catch (e) { return null; } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function studentLogout() { try { localStorage.removeItem('econ_student'); } catch (e) {} }
  // данные вошедшего учителя — читаем сессию Supabase Auth из localStorage (sb-<ref>-auth-token)
  function teacherTokenKeys() { var out = []; try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && /^sb-.*-auth-token$/.test(k)) out.push(k); } } catch (e) {} return out; }
  function teacherInfo() {
    var keys = teacherTokenKeys();
    for (var i = 0; i < keys.length; i++) {
      try {
        var v = JSON.parse(localStorage.getItem(keys[i]) || 'null');
        // сессия жива дольше access-токена (refresh) → не гейтим по expires_at, наличие user достаточно;
        // истинную проверку делает гейт кабинета (currentTeacher/getSession), чип — только индикатор
        var u = v && (v.user || (v.currentSession && v.currentSession.user));
        if (u) return { name: (u.user_metadata && u.user_metadata.name) || u.email || 'Teacher' };
      } catch (e) {}
    }
    return null;
  }
  function teacherLogout() { teacherTokenKeys().forEach(function (k) { try { localStorage.removeItem(k); } catch (e) {} }); }

  function color(pct) { return pct >= 100 ? '#1E9E6A' : pct >= 50 ? '#D8902A' : '#8497ab'; }
  function hasAny(p) { return p.read.length > 0 || Object.keys(p.scores).length > 0 || p.terms > 0 || p.games > 0; }
  function rankLabel(pct, labels) { if (pct >= 100) return labels[4]; if (pct >= 70) return labels[3]; if (pct >= 40) return labels[2]; if (pct > 0) return labels[1]; return labels[0]; }
  function rankColor(pct) { return pct >= 100 ? '#1E9E6A' : pct >= 70 ? '#4caf50' : pct >= 40 ? '#D8902A' : pct > 0 ? '#ef6c00' : '#e05a5a'; }
  function segs(p) {
    var C = cats();
    var counts = [p.read.length, Object.keys(p.scores).length, p.terms, p.games];
    var pcts = [
      Math.round(p.read.length / N * 100),
      Math.round(Object.keys(p.scores).length / N * 100),
      Math.min(100, Math.round(p.terms / 5 * 100)),
      Math.min(100, Math.round(p.games / 5 * 100))
    ];
    return C.map(function (c, i) { return { k: c.k, full: c.full, pct: pcts[i], tip: c.tip(counts[i]), labels: c.labels }; });
  }

  var chip;
  function render() {
    var p = get();
    var slot = document.getElementById('econSlot');
    var tea = teacherInfo(), stu = tea ? null : studentInfo();
    // чип показываем: учитель ИЛИ ученик по коду ИЛИ гость с сохранением; и только если в шапке есть слот
    if ((!tea && !optedIn()) || !slot) { if (chip && chip.parentNode) chip.parentNode.removeChild(chip); chip = null; return; }
    if (!chip) {
      chip = document.createElement('button');
      chip.id = 'econChip';
      chip.type = 'button';
    }
    chip.onclick = tea ? openTeacherMenu : openSummary;
    // на главной прячем кнопку «Войти», когда уже вошли (учитель или ученик)
    var lb = document.getElementById('loginBtn'); if (lb) lb.style.display = (tea || stu) ? 'none' : '';
    chip.title = tea ? (tea.name + ' · ' + ui().teacherRole) : (stu ? (stu.name + ' · ' + ui().byCode) : ui().chipTitle);
    chip.style.cssText = 'display:inline-flex;align-items:center;gap:6px;background:var(--surface,#fff);border:1px solid var(--line,#D3DCE4);border-radius:11px;padding:5px 10px;cursor:pointer;font-family:var(--body,system-ui,sans-serif);line-height:1;';
    if (chip.parentNode !== slot) slot.appendChild(chip);
    if (tea) {
      // учитель: только имя, без полосок прогресса (прогресс — ученический)
      chip.innerHTML = '<span style="font-size:.85rem">👩‍🏫</span><b style="font-size:.8rem;max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(tea.name) + '</b>';
      return;
    }
    var lead = stu
      ? '<span style="font-size:.85rem">🎓</span><b style="font-size:.8rem;max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(stu.name) + '</b>'
      : '<span style="font-size:.85rem">⭐</span>';
    chip.innerHTML = lead + segs(p).map(function (x) {
      return '<span title="' + x.k + ': ' + x.pct + '%" style="display:inline-block;width:20px;height:5px;background:var(--line,#D3DCE4);border-radius:3px;overflow:hidden;vertical-align:middle"><i style="display:block;height:5px;width:' + x.pct + '%;background:' + color(x.pct) + '"></i></span>';
    }).join('');
  }

  // Меню учителя (клик по чипу «👩‍🏫 …» на публичных страницах): кабинет + выход
  function openTeacherMenu() {
    var tea = teacherInfo(); if (!tea) return;
    var t = ui();
    var pfx = (location.pathname.match(/^\/(kz|en)\//) || [])[1];
    var b = pfx ? '/' + pfx : '';
    var ov = document.getElementById('econSumOverlay');
    if (!ov) {
      ov = document.createElement('div');
      ov.id = 'econSumOverlay';
      ov.style.cssText = 'position:fixed;inset:0;background:rgba(8,14,26,.55);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;';
      ov.addEventListener('click', function (e) { if (e.target === ov) ov.remove(); });
      (document.body || document.documentElement).appendChild(ov);
    }
    ov.innerHTML = '<div style="background:var(--surface,#fff);color:var(--ink,#15263B);border:1px solid var(--line,#D3DCE4);border-radius:18px;max-width:400px;width:100%;padding:22px;font-family:var(--body,system-ui,sans-serif)">'
      + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:14px"><span style="font-size:1.1rem">👩‍🏫</span><b style="font-family:var(--display,sans-serif);font-size:1.05rem">' + esc(tea.name) + '</b>'
      + '<button id="econSumX" aria-label="' + t.close + '" style="margin-left:auto;background:none;border:none;font-size:1.1rem;cursor:pointer;color:var(--muted,#6B7A8C)">✕</button></div>'
      + '<div style="color:var(--muted,#6B7A8C);font-size:.82rem;margin:0 0 16px">' + t.teacherRole + '</div>'
      + '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">'
      + '<a id="econTeaCab" href="' + b + '/teacher" style="background:var(--gold,#D8902A);color:#241402;border:none;border-radius:9px;padding:9px 16px;cursor:pointer;font-family:inherit;font-weight:600;font-size:.85rem;text-decoration:none">' + t.cabinet + '</a>'
      + '<button id="econTeaOut" style="margin-left:auto;background:none;border:1px solid var(--line,#D3DCE4);border-radius:9px;padding:8px 14px;cursor:pointer;color:var(--ink,#15263B);font-family:inherit;font-weight:600;font-size:.85rem">' + t.logout + '</button></div>'
      + '</div>';
    document.getElementById('econSumX').addEventListener('click', function () { ov.remove(); });
    document.getElementById('econTeaOut').addEventListener('click', function () { teacherLogout(); location.href = b + '/'; });
  }

  function openSummary() {
    var p = get();
    var t = ui();
    var stu = studentInfo();
    var ov = document.getElementById('econSumOverlay');
    if (!ov) {
      ov = document.createElement('div');
      ov.id = 'econSumOverlay';
      ov.style.cssText = 'position:fixed;inset:0;background:rgba(8,14,26,.55);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;';
      ov.addEventListener('click', function (e) { if (e.target === ov) ov.remove(); });
      (document.body || document.documentElement).appendChild(ov);
    }
    ov.innerHTML = '<div style="background:var(--surface,#fff);color:var(--ink,#15263B);border:1px solid var(--line,#D3DCE4);border-radius:18px;max-width:560px;width:100%;padding:22px;font-family:var(--body,system-ui,sans-serif)">'
      + '<div style="display:flex;align-items:center;margin-bottom:14px"><b style="font-family:var(--display,sans-serif);font-size:1.2rem">' + t.profile + '</b>'
      + '<button id="econSumX" aria-label="' + t.close + '" style="margin-left:auto;background:none;border:none;font-size:1.1rem;cursor:pointer;color:var(--muted,#6B7A8C)">✕</button></div>'
      + (stu
          ? '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;background:var(--surface-2,#F3F6F9);border:1px solid var(--line,#D3DCE4);border-radius:10px;padding:9px 12px;margin:0 0 14px;font-size:.9rem"><span>🎓</span><b>' + esc(stu.name) + '</b><span style="color:var(--muted,#6B7A8C);font-size:.8rem">' + t.codeLbl + ' ' + esc(stu.code || '') + ' · ' + t.resultsSeen + '</span></div>'
          : '<div style="color:var(--muted,#6B7A8C);font-size:.82rem;margin:0 0 12px">' + t.guest + '</div>')
      + (stu ? '' : '<p style="color:var(--muted,#6B7A8C);font-size:.84rem;margin:0 0 16px;line-height:1.5">' + t.sub + '</p>')
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'
      + segs(p).map(function (x) {
        var col = rankColor(x.pct), rank = rankLabel(x.pct, x.labels);
        return '<div style="border:1px solid var(--line,#D3DCE4);border-radius:12px;padding:12px 14px">'
          + '<div style="font-family:var(--mono,monospace);font-size:.62rem;text-transform:uppercase;letter-spacing:.04em;color:var(--muted,#6B7A8C);margin-bottom:5px">' + x.full + '</div>'
          + '<div style="font-weight:700;font-size:.95rem;color:' + col + ';margin-bottom:8px;line-height:1.25">' + rank + '</div>'
          + '<div style="height:6px;background:var(--line,#D3DCE4);border-radius:3px;overflow:hidden"><div style="height:6px;width:' + x.pct + '%;background:' + col + ';border-radius:3px"></div></div>'
          + '<div style="font-size:.7rem;color:var(--muted,#6B7A8C);margin-top:5px">' + x.pct + '% · ' + x.tip + '</div>'
          + '</div>';
      }).join('')
      + '</div>'
      + '<div style="margin-top:16px;border-top:1px solid var(--line,#D3DCE4);padding-top:14px;display:flex;gap:10px;flex-wrap:wrap;align-items:center">'
      + '<button id="econSumMore" style="background:var(--gold,#D8902A);color:#241402;border:none;border-radius:9px;padding:9px 16px;cursor:pointer;font-family:inherit;font-weight:600;font-size:.85rem">' + t.more + '</button>'
      + '<button id="econSumReset" style="background:none;border:1px solid var(--line,#D3DCE4);border-radius:9px;padding:8px 14px;cursor:pointer;color:var(--ink,#15263B);font-family:inherit;font-size:.85rem">' + t.reset + '</button>'
      + (stu ? '<button id="econSumLogout" style="margin-left:auto;background:none;border:1px solid var(--line,#D3DCE4);border-radius:9px;padding:8px 14px;cursor:pointer;color:var(--ink,#15263B);font-family:inherit;font-weight:600;font-size:.85rem">' + t.logout + '</button>' : '')
      + '</div>'
      + '</div>';
    document.getElementById('econSumMore').addEventListener('click', function () { var m = location.pathname.match(/^\/(kz|en)\//); location.href = (m ? '/' + m[1] : '') + '/progress'; });
    document.getElementById('econSumX').addEventListener('click', function () { ov.remove(); });
    document.getElementById('econSumReset').addEventListener('click', function () {
      if (confirm(t.confirm)) { API.reset(); ov.remove(); }
    });
    var lo = document.getElementById('econSumLogout');
    if (lo) lo.addEventListener('click', function () { studentLogout(); var m = location.pathname.match(/^\/(kz|en)\//); location.href = (m ? '/' + m[1] : '') + '/'; });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
