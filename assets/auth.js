/* BALKAN-SERVERS shared auth — sign up / sign in (email + password), used by every page. */
(function () {
  const API = "https://balkan-backend.onrender.com";
  // 👉 PASTE your Google OAuth "Web application" Client ID here to turn on Google sign-in.
  //    Leave it "" and the Google buttons stay disabled ("soon").
  const GOOGLE_CLIENT_ID = "802869586598-pinp7bkcp0h6ourh27mf54ovppcmdt9a.apps.googleusercontent.com";
  const KEY = "balkanAuth";
  const validSteam = (s) => /^STEAM_[0-5]:[01]:\d+$/i.test((s || "").trim());
  const validEmail = (s) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test((s || "").trim());

  // ---- token store ----
  function get() { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; } }
  function set(a) { localStorage.setItem(KEY, JSON.stringify(a)); updateUI(); }
  function clear() { localStorage.removeItem(KEY); updateUI(); document.dispatchEvent(new Event("balkan-auth")); }
  function token() { const a = get(); return a && a.token; }
  function isIn() { return !!token(); }

  // ---- API ----
  async function api(path, opts) {
    opts = opts || {};
    const headers = Object.assign({ "Content-Type": "application/json" }, opts.headers || {});
    const t = token(); if (t) headers.Authorization = "Bearer " + t;
    // The free Render backend sleeps after ~15 min idle; the first request can
    // take ~30-50s or fail transiently while it boots — so retry once before giving up.
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const r = await fetch(API + path, { method: opts.method || "GET", headers, body: opts.body ? JSON.stringify(opts.body) : undefined });
        let d = null; try { d = await r.json(); } catch (e) {}
        return { ok: r.ok, status: r.status, data: d };
      } catch (e) {
        if (attempt === 0) { await new Promise(function (res) { setTimeout(res, 2500); }); continue; }
        return { ok: false, status: 0, data: null };
      }
    }
  }
  async function me() { return api("/api/me"); }

  // Wake the sleeping backend as early as possible so that by the time the user
  // clicks Sign up / Sign in it is already awake (no cold-start wait). Fire-and-forget.
  var warmed = false;
  function warmup() { if (warmed) return; warmed = true; try { fetch(API + "/api/top", { method: "GET" }).catch(function () {}); } catch (e) {} }

  // ---- Google sign-in (Google Identity Services) ----
  function googleEnabled() { return !!GOOGLE_CLIENT_ID; }
  function loadGIS(cb) {
    if (window.google && google.accounts && google.accounts.id) return cb();
    var s = document.getElementById("gisScript");
    if (s) { var t = setInterval(function () { if (window.google && google.accounts && google.accounts.id) { clearInterval(t); cb(); } }, 120); return; }
    s = document.createElement("script"); s.id = "gisScript"; s.src = "https://accounts.google.com/gsi/client"; s.async = true; s.defer = true;
    s.onload = cb; document.head.appendChild(s);
  }
  async function _google(resp) {
    if (!resp || !resp.credential) return;
    var ei = document.getElementById("baInErr"), eu = document.getElementById("baUpErr");
    if (ei) ei.textContent = "Signing in with Google…"; if (eu) eu.textContent = "Signing in with Google…";
    const r = await api("/api/google", { method: "POST", body: { credential: resp.credential } });
    if (r.ok && r.data && r.data.token) { set({ token: r.data.token }); close(); afterAuth(); return; }
    const m = (r.data && r.data.error) || (r.status === 0 ? "Server is waking up — please try again." : "Google sign-in failed.");
    if (ei) ei.textContent = m; if (eu) eu.textContent = m;
  }
  function renderGBtn(id) {
    var el = document.getElementById(id);
    if (el && window.google && google.accounts && google.accounts.id) {
      el.innerHTML = "";
      try { google.accounts.id.renderButton(el, { theme: "filled_black", size: "large", width: 360, text: "continue_with", shape: "pill" }); } catch (e) {}
    }
  }
  function initGoogle() {
    loadGIS(function () {
      try { google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: _google }); renderGBtn("baGoogleIn"); renderGBtn("baGoogleUp"); } catch (e) {}
    });
  }
  function paintGoogle() {
    if (googleEnabled()) { initGoogle(); return; }
    // not configured yet -> keep a disabled "soon" button, hide the "or" dividers
    ["baGoogleIn", "baGoogleUp"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.innerHTML = '<button class="ba-google" disabled><i class="fa-brands fa-google"></i> Continue with Google (soon)</button>';
    });
  }

  // ---- modal (injected once) ----
  function injectModal() {
    if (document.getElementById("balkanAuthModal")) return;
    const css = document.createElement("style");
    css.textContent = `
      #balkanAuthModal{position:fixed;inset:0;z-index:9000;background:rgba(0,0,0,.74);backdrop-filter:blur(4px);display:none;align-items:center;justify-content:center;padding:18px}
      #balkanAuthModal.open{display:flex}
      #balkanAuthModal .ba-sheet{background:var(--panel,#12151b);border:1px solid var(--line2,rgba(255,255,255,.15));border-radius:16px;width:100%;max-width:440px;padding:26px;position:relative;font-family:'Inter',sans-serif;color:var(--txt,#eef0f3)}
      #balkanAuthModal .ba-x{position:absolute;top:14px;right:16px;background:none;border:0;color:var(--dim,#9aa0ac);font-size:20px;cursor:pointer}
      #balkanAuthModal .ba-tabs{display:flex;gap:8px;margin-bottom:18px}
      #balkanAuthModal .ba-tab{flex:1;text-align:center;padding:10px;border-radius:9px;cursor:pointer;font-family:'Oswald',sans-serif;letter-spacing:1px;text-transform:uppercase;font-size:14px;background:var(--bg2,#0c0e12);border:1px solid var(--line,rgba(255,255,255,.08));color:var(--dim,#9aa0ac)}
      #balkanAuthModal .ba-tab.on{background:var(--gold,#e8b54a);color:#241a02;border-color:var(--gold,#e8b54a)}
      #balkanAuthModal .ba-f{margin-bottom:11px}
      #balkanAuthModal .ba-f label{display:block;font-size:12.5px;color:var(--dim,#9aa0ac);margin-bottom:5px}
      #balkanAuthModal .ba-f input{width:100%;padding:11px 13px;border-radius:9px;background:var(--bg2,#0c0e12);border:1px solid var(--line2,rgba(255,255,255,.15));color:var(--txt,#eef0f3);font-size:14px;outline:none;font-family:'Inter',sans-serif}
      #balkanAuthModal .ba-f input:focus{border-color:var(--gold,#e8b54a)}
      #balkanAuthModal .ba-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      #balkanAuthModal .ba-btn{width:100%;justify-content:center;display:inline-flex;align-items:center;gap:8px;font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:1px;font-size:15px;padding:13px;border-radius:9px;border:0;cursor:pointer;background:var(--gold,#e8b54a);color:#241a02;margin-top:6px}
      #balkanAuthModal .ba-err{color:var(--red,#e3342f);font-size:13px;margin-top:9px;min-height:18px}
      #balkanAuthModal h3{font-family:'Oswald',sans-serif;text-transform:uppercase;font-size:22px;margin-bottom:4px}
      #balkanAuthModal .ba-sub{color:var(--dim,#9aa0ac);font-size:13px;margin-bottom:16px}
      #balkanAuthModal .ba-soon{margin-top:12px;text-align:center;font-size:12px;color:var(--dim,#9aa0ac)}
      #balkanAuthModal .ba-google{width:100%;justify-content:center;display:inline-flex;align-items:center;gap:9px;padding:11px;border-radius:9px;border:1px solid var(--line2,rgba(255,255,255,.15));background:#fff;color:#111;font-weight:600;font-size:14px;margin-bottom:14px;opacity:.5;cursor:not-allowed}
      #balkanAuthModal .ba-gwrap{display:flex;justify-content:center;min-height:42px;margin-bottom:14px}
      #balkanAuthModal .ba-or{display:flex;align-items:center;gap:10px;color:var(--dim,#9aa0ac);font-size:11px;letter-spacing:1px;text-transform:uppercase;margin:0 0 14px}
      #balkanAuthModal .ba-or::before,#balkanAuthModal .ba-or::after{content:"";flex:1;height:1px;background:var(--line2,rgba(255,255,255,.15))}
    `;
    document.head.appendChild(css);
    const m = document.createElement("div");
    m.id = "balkanAuthModal";
    m.innerHTML = `<div class="ba-sheet">
      <button class="ba-x" onclick="BalkanAuth.close()">&times;</button>
      <div class="ba-tabs"><div class="ba-tab on" id="baTabIn" onclick="BalkanAuth._tab('in')">Sign in</div><div class="ba-tab" id="baTabUp" onclick="BalkanAuth._tab('up')">Sign up</div></div>
      <div id="baPaneIn">
        <h3>Welcome back</h3><div class="ba-sub">Sign in to apply, suggest, chat & enter giveaways.</div>
        <div class="ba-gwrap" id="baGoogleIn"></div><div class="ba-or" id="baOrIn">or with email</div>
        <div class="ba-f"><label>Email</label><input id="baInEmail" type="email" placeholder="you@email.com" autocomplete="email"></div>
        <div class="ba-f"><label>Password</label><input id="baInPw" type="password" placeholder="••••••••" autocomplete="current-password"></div>
        <button class="ba-btn" onclick="BalkanAuth._login()"><i class="fa-solid fa-right-to-bracket"></i> Sign in</button>
        <div class="ba-err" id="baInErr"></div>
      </div>
      <div id="baPaneUp" style="display:none">
        <h3>Create account</h3><div class="ba-sub">Quick — like signing up anywhere.</div>
        <div class="ba-gwrap" id="baGoogleUp"></div><div class="ba-or" id="baOrUp">or with email</div>
        <div class="ba-row"><div class="ba-f"><label>Name</label><input id="baUpName" placeholder="Your name"></div><div class="ba-f"><label>Age</label><input id="baUpAge" type="number" placeholder="18"></div></div>
        <div class="ba-f"><label>Email</label><input id="baUpEmail" type="email" placeholder="you@email.com"></div>
        <div class="ba-f"><label>In-game nick</label><input id="baUpNick" placeholder="the nick you use in CS"></div>
        <div class="ba-f"><label>SteamID <span style="opacity:.6">(optional — to show your stats)</span></label><input id="baUpSid" placeholder="STEAM_0:1:1234567"></div>
        <div class="ba-f"><label>Password</label><input id="baUpPw" type="password" placeholder="min 6 characters"></div>
        <button class="ba-btn" onclick="BalkanAuth._register()"><i class="fa-solid fa-user-plus"></i> Create account</button>
        <div class="ba-err" id="baUpErr"></div>
      </div>
    </div>`;
    document.body.appendChild(m);
    m.addEventListener("click", (e) => { if (e.target === m) close(); });
    paintGoogle();
  }

  function open(tab) { injectModal(); document.getElementById("balkanAuthModal").classList.add("open"); _tab(tab || "in"); }
  function close() { const m = document.getElementById("balkanAuthModal"); if (m) m.classList.remove("open"); }
  function _tab(t) {
    document.getElementById("baPaneIn").style.display = t === "in" ? "block" : "none";
    document.getElementById("baPaneUp").style.display = t === "up" ? "block" : "none";
    document.getElementById("baTabIn").classList.toggle("on", t === "in");
    document.getElementById("baTabUp").classList.toggle("on", t === "up");
    // re-render the now-visible Google button (renderButton needs a visible box for full width)
    if (googleEnabled()) renderGBtn(t === "in" ? "baGoogleIn" : "baGoogleUp");
  }

  async function _login() {
    const email = val("baInEmail"), pw = document.getElementById("baInPw").value;
    const err = document.getElementById("baInErr"); err.textContent = "";
    if (!validEmail(email)) return (err.textContent = "Enter a valid email.");
    if (!pw) return (err.textContent = "Enter your password.");
    err.textContent = "Signing in… (first time can take ~30s while the server wakes up)";
    const r = await api("/api/login", { method: "POST", body: { email, password: pw } });
    if (!r.ok) return (err.textContent = (r.data && r.data.error) || (r.status === 0 ? "Server is waking up — please try again in a few seconds." : r.status === 404 ? "Accounts are launching very soon — check back shortly!" : "Sign in failed."));
    set({ token: r.data.token }); close(); afterAuth();
  }
  async function _register() {
    const body = { name: val("baUpName"), age: val("baUpAge"), email: val("baUpEmail"), nick: val("baUpNick"), steamid: val("baUpSid"), password: document.getElementById("baUpPw").value };
    const err = document.getElementById("baUpErr"); err.textContent = "";
    if (!body.name) return (err.textContent = "Enter your name.");
    if (!validEmail(body.email)) return (err.textContent = "Enter a valid email.");
    if (!body.nick) return (err.textContent = "Enter your in-game nick.");
    if ((body.password || "").length < 6) return (err.textContent = "Password too short (min 6).");
    if (body.steamid && !validSteam(body.steamid)) return (err.textContent = "Invalid SteamID (or leave it empty).");
    err.textContent = "Creating account… (first time can take ~30s while the server wakes up)";
    const r = await api("/api/register", { method: "POST", body });
    if (!r.ok) return (err.textContent = (r.data && r.data.error) || (r.status === 0 ? "Server is waking up — please try again in a few seconds." : r.status === 404 ? "Accounts are launching very soon — check back shortly!" : "Could not create account."));
    set({ token: r.data.token }); close(); afterAuth();
  }
  function val(id) { return (document.getElementById(id).value || "").trim(); }

  function afterAuth() {
    document.dispatchEvent(new Event("balkan-auth"));
    if (typeof window.onBalkanAuth === "function") window.onBalkanAuth();
  }

  // ---- nav UI: fills any element with id="balkanAuthUI" ----
  async function updateUI() {
    const box = document.getElementById("balkanAuthUI");
    if (!box) return;
    if (isIn()) {
      const a = get();
      box.innerHTML = `<a class="btn btn-ghost" href="players.html#me"><i class="fa-solid fa-user"></i> ${a.nick || "My account"}</a>
        <button class="btn btn-ghost" onclick="BalkanAuth.logout()">Logout</button>`;
      // resolve nick + role lazily (role used for owner-only UI; authoritative badges always come from server payloads)
      if (!a.nick || a.role === undefined) { const r = await me(); if (r.ok && r.data.profile) { a.nick = r.data.profile.nick || r.data.profile.name; a.role = r.data.role || ''; localStorage.setItem(KEY, JSON.stringify(a)); updateUI(); document.dispatchEvent(new Event("balkan-auth")); } }
    } else {
      box.innerHTML = `<button class="btn btn-gold" onclick="BalkanAuth.open('up')"><i class="fa-solid fa-user-plus"></i> Sign up</button>
        <button class="btn btn-ghost" onclick="BalkanAuth.open('in')">Sign in</button>`;
    }
  }

  // require login before running fn; otherwise open the modal
  function require(fn) { if (isIn()) { fn && fn(); return true; } open("in"); return false; }

  // cached role for owner-only UI (server payloads remain authoritative for badges shown to others)
  function role() { const a = get(); return (a && a.role) || ""; }
  function isOwner() { return role() === "OWNER"; }

  // presence heartbeat (works signed in or out; server uses softAuth)
  function beat() { try { api("/api/heartbeat", { method: "POST", body: {} }); } catch (e) {} }

  window.BalkanAuth = { API, open, close, logout: clear, isIn, get, token, me, api, require, updateUI, role, isOwner, _tab, _login, _register };
  document.addEventListener("DOMContentLoaded", function () {
    injectModal(); updateUI(); warmup();
    beat(); setInterval(function () { if (document.visibilityState === "visible") beat(); }, 45000);
  });
  document.addEventListener("visibilitychange", function () { if (!document.hidden) beat(); });
})();
