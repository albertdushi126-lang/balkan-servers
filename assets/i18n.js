/* BALKAN-SERVERS website i18n — AUTO translator (EN / AL / RU / TR / SR / BG).
   Translates EVERY visible text node + placeholders on the page against a shared
   dictionary (assets/i18n-dict.js, window.BALKAN_I18N_DICT = {D, H}), keyed by the
   ORIGINAL English string. Works on every page that loads this file (no per-element
   tagging needed) and re-translates dynamically-rendered content via MutationObserver.
   Drop a <span id="langPicker"></span> in the nav for the flag dropdown. */
(function () {
  var LANGS = [
    { c: "en", cc: "gb", n: "English" },
    { c: "al", cc: "al", n: "Shqip" },
    { c: "ru", cc: "ru", n: "Русский" },
    { c: "tr", cc: "tr", n: "Türkçe" },
    { c: "sr", cc: "rs", n: "Srpski" },
    { c: "bg", cc: "bg", n: "Български" }
  ];
  var flag = function (cc, h) { return "https://flagcdn.com/h" + (h || 20) + "/" + cc + ".png"; };

  function dictD() { return (window.BALKAN_I18N_DICT && window.BALKAN_I18N_DICT.D) || {}; }
  function dictH() { return (window.BALKAN_I18N_DICT && window.BALKAN_I18N_DICT.H) || {}; }
  function getLang() { try { return localStorage.getItem("balkanLang") || "en"; } catch (e) { return "en"; } }

  function tr(src, lang) {
    var e = dictD()[src];
    if (!e) return null;
    return (lang === "en") ? src : (e[lang] || src);
  }

  /* ---- machine-translation fallback ---------------------------------------
     Anything NOT found in the curated dict is auto-translated via Google's
     auto-detect endpoint (handles mixed languages) and cached in localStorage.
     Result: EVERY word on EVERY page shows in the chosen language — user posts,
     chat, and anything added later — with zero manual dictionary upkeep.
     Opt a node out with class="no-mt" or [data-no-mt] (brand, usernames…). */
  var MT = {}; try { MT = JSON.parse(localStorage.getItem("balkanMT") || "{}"); } catch (e) {}
  var MTQ = [], MTIN = {}, MTACT = 0, MTMAX = 6;
  function mtISO(l) { return l === "al" ? "sq" : l; }
  function mtSave() { try { localStorage.setItem("balkanMT", JSON.stringify(MT)); } catch (e) {} }
  function mtTranslatable(s) { return /[A-Za-zА-Яа-яЁёÇçĞğİıŞşÖöÜü]/.test(s) && s.replace(/[^A-Za-zА-Яа-яЁё]/g, "").length >= 2; }
  function mtPump() {
    while (MTACT < MTMAX && MTQ.length) {
      var job = MTQ.shift(); MTACT++;
      (function (jb) {
        fetch(jb.u).then(function (r) { return r.json(); }).then(function (j) {
          if (j && j[0]) {   // valid response — cache it
            var out = j[0].map(function (s) { return (s && s[0]) ? s[0] : ""; }).join("") || jb.src;
            MT[jb.key] = out; mtSave(); jb.fin(out);
          } else { jb.fin(jb.src); }   // error/empty — don't poison the cache, retry next time
        }).catch(function () { jb.fin(jb.src); }).then(function () { MTACT--; mtPump(); });
      })(job);
    }
  }
  function mtGet(src, lang, cb) {
    var key = lang + "" + src;
    if (MT[key] != null) { cb(MT[key]); return; }
    if (MTIN[key]) { MTIN[key].push(cb); return; }
    MTIN[key] = [cb];
    MTQ.push({ key: key, src: src, u: "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=" + mtISO(lang) + "&dt=t&q=" + encodeURIComponent(src),
      fin: function (out) { var cbs = MTIN[key] || []; delete MTIN[key]; cbs.forEach(function (f) { try { f(out); } catch (e) {} }); } });
    mtPump();
  }

  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, NOSCRIPT: 1, CODE: 1 };
  // elements whose text is a PROPER NOUN (usernames, zombie / knife / weapon names) —
  // never translate these. Add class="no-mt" (or [data-no-mt]) to protect anything new.
  var NOMT = "[data-no-mt],.no-mt,.who,.mem-name,.pc-name,.au,.nick,.nm>b,.cab-id>h2,.find-row>b,.find-picked,.gv,.lb .tag,#grid .card>h3,.detail-info>h1,.whead>h2,.vip-feature .info>h2,#mName,.cls .info>h3,.kn>h4";
  function setTN(tn, v) { tn.nodeValue = tn.__raw.replace(tn.__en, v); }
  function translateTextNode(tn, lang) {
    var p = tn.parentNode; if (!p || SKIP[p.nodeName]) return;
    if (p.closest && (p.closest("[data-i18n-html]") || p.closest(NOMT))) return;
    if (tn.__raw === undefined) { tn.__raw = tn.nodeValue || ""; tn.__en = tn.__raw.trim(); }
    var src = tn.__en; if (!src) return;
    if (lang === "en") { setTN(tn, src); return; }
    var v = tr(src, lang);
    if (v != null) { setTN(tn, v); return; }            // curated dict
    if (!mtTranslatable(src)) return;                    // skip numbers / symbols
    mtGet(src, lang, function (out) { if (getLang() === lang) setTN(tn, out); });  // machine fallback
  }
  function translateAttrs(el, lang) {
    if (el.closest && el.closest(NOMT)) return;
    ["placeholder", "title"].forEach(function (a) {
      if (!el.getAttribute || !el.hasAttribute(a)) return;
      var key = "i18n_" + a;
      if (el.dataset[key] === undefined) el.dataset[key] = (el.getAttribute(a) || "").trim();
      var src = el.dataset[key]; if (!src) return;
      if (lang === "en") { el.setAttribute(a, src); return; }
      var v = tr(src, lang);
      if (v != null) { el.setAttribute(a, v); return; }
      if (!mtTranslatable(src)) return;
      mtGet(src, lang, function (out) { if (getLang() === lang) el.setAttribute(a, out); });
    });
  }
  function translateHtml(el, lang) {
    var k = el.getAttribute("data-i18n-html"); var e = dictH()[k]; if (!e) return;
    el.innerHTML = (lang === "en") ? (e.en || "") : (e[lang] || e.en || "");
  }
  function walk(root, lang) {
    if (root.nodeType === 3) { translateTextNode(root, lang); return; }
    if (root.nodeType !== 1) return;
    if (SKIP[root.nodeName]) return;
    // text nodes
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    var nodes = [], n; while ((n = w.nextNode())) nodes.push(n);
    nodes.forEach(function (tn) { translateTextNode(tn, lang); });
    // attributes
    if (root.matches && (root.hasAttribute("placeholder") || root.hasAttribute("title"))) translateAttrs(root, lang);
    if (root.querySelectorAll) root.querySelectorAll("[placeholder],[title]").forEach(function (el) { translateAttrs(el, lang); });
    // innerHTML specials
    if (root.matches && root.matches("[data-i18n-html]")) translateHtml(root, lang);
    if (root.querySelectorAll) root.querySelectorAll("[data-i18n-html]").forEach(function (el) { translateHtml(el, lang); });
  }

  var observer = null;
  function apply(lang) {
    var d = lang || getLang();
    try { walk(document.body, d); } catch (e) {}
    try { document.documentElement.lang = d; } catch (e) {}
    document.dispatchEvent(new CustomEvent("balkan-lang", { detail: d }));
  }
  function startObserver() {
    if (observer || !window.MutationObserver) return;
    observer = new MutationObserver(function (muts) {
      var lang = getLang(); if (lang === "en") return;
      muts.forEach(function (m) {
        m.addedNodes && m.addedNodes.forEach(function (node) {
          try { walk(node, lang); } catch (e) {}
        });
      });
    });
    try { observer.observe(document.body, { childList: true, subtree: true }); } catch (e) {}
  }

  function setLang(code) { try { localStorage.setItem("balkanLang", code); } catch (e) {} apply(code); renderPicker(); }

  function renderPicker() {
    var cur = getLang(), curL = LANGS.filter(function (l) { return l.c === cur; })[0] || LANGS[0];
    document.querySelectorAll("#langPicker").forEach(function (box) {
      box.classList.add("lang");
      box.innerHTML =
        '<button class="lang-btn" type="button" title="Language"><img class="fl" src="' + flag(curL.cc) + '" alt="' + curL.c + '"><span class="ca">▾</span></button>' +
        '<div class="lang-menu">' + LANGS.map(function (l) {
          return '<button type="button" data-l="' + l.c + '" class="' + (l.c === cur ? "on" : "") + '"><img class="fl" src="' + flag(l.cc) + '" alt=""> ' + l.n + (l.c === cur ? ' <i class="fa-solid fa-check" style="margin-left:auto"></i>' : "") + "</button>";
        }).join("") + "</div>";
      var btn = box.querySelector(".lang-btn"), menu = box.querySelector(".lang-menu");
      btn.addEventListener("click", function (e) { e.stopPropagation(); menu.classList.toggle("open"); });
      menu.querySelectorAll("button").forEach(function (b) { b.addEventListener("click", function () { setLang(b.getAttribute("data-l")); }); });
    });
  }

  function injectCSS() {
    if (document.getElementById("i18nCss")) return;
    var s = document.createElement("style"); s.id = "i18nCss";
    s.textContent =
      ".lang{position:relative;display:inline-block}" +
      ".lang-btn{display:inline-flex;align-items:center;gap:6px;background:var(--panel2,#1a1e28);border:1px solid var(--line2,rgba(255,255,255,.14));color:var(--txt,#eef0f3);border-radius:9px;padding:8px 9px;cursor:pointer;line-height:0;transition:.15s}" +
      ".lang-btn:hover{border-color:var(--gold,#e8b54a)}" +
      ".lang-btn .fl{width:22px;height:16px;object-fit:cover;border-radius:3px;display:block}" +
      ".lang-btn .ca{font-size:9px;line-height:1;color:var(--dim,#9aa0ac)}" +
      ".lang-menu{position:absolute;top:calc(100% + 8px);right:0;background:var(--panel,#13161e);border:1px solid var(--line2,rgba(255,255,255,.14));border-radius:11px;padding:6px;min-width:168px;display:none;z-index:300;box-shadow:0 16px 38px rgba(0,0,0,.55)}" +
      ".lang-menu.open{display:block}" +
      ".lang-menu button{display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:none;border:0;color:var(--txt,#eef0f3);padding:9px 10px;border-radius:8px;cursor:pointer;font-size:13.5px;font-family:'Inter',sans-serif}" +
      ".lang-menu button:hover{background:var(--panel2,#1a1e28)}" +
      ".lang-menu button.on{color:var(--gold,#e8b54a)}" +
      ".lang-menu button .fl{width:22px;height:16px;object-fit:cover;border-radius:3px}";
    document.head.appendChild(s);
  }

  document.addEventListener("click", function () {
    document.querySelectorAll(".lang-menu.open").forEach(function (m) { m.classList.remove("open"); });
  });

  window.BalkanI18n = { apply: apply, setLang: setLang, getLang: getLang, tr: function (k) { return tr(k, getLang()) || k; }, LANGS: LANGS };

  document.addEventListener("DOMContentLoaded", function () {
    injectCSS(); renderPicker();
    if (getLang() !== "en") apply(getLang());
    startObserver();
  });
})();
