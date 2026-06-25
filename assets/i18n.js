/* BALKAN-SERVERS website i18n — language switcher (EN / AL / RU / TR / SR / BG).
   Tag elements with data-i18n="key" (textContent), data-i18n-html="key" (innerHTML),
   or data-i18n-ph="key" (placeholder). Drop a <span id="langPicker"></span> in the nav.
   Real flag images via flagcdn (emoji flags don't render on Windows). */
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

  var T = {
    en: {
      home:"Home", servers:"Servers", store:"Store", privileges:"Privileges", stats:"Stats", classes:"Classes", news:"News",
      play:"Play", connect:"Connect", connectNow:"Connect now", search:"Search…",
      hero_k:"PRIVILEGE STORE", hero_t:'GET <span class="gold">MORE</span><br>POWER',
      hero_d:"Buy VIP, custom knives, zombie classes & money packs. Stand out on the server and unlock unique abilities and commands.",
      gotostore:"Go to store",
      srv_t:"Play on our servers", online:"Online",
      season_k:"This season", season_t:"Stats",
      buy_t:"Latest purchases", buy_s:"support the project ♥",
      lnews_t:"Latest news", all:"all",
      chat_t:"Community chat", chat_write:"Write a message…", chat_signin:"Sign in to chat…",
      top_p:"Top players", top_d:"Top donators",
      chg_k:"Changelog", chg_t:"What's new", chg_m:"Added · Fixed · Coming soon",
      gw_k:"Free loot", gw_t:"Giveaways", gw_m:"Enter via Discord",
      sug_k:"Your voice", sug_t:"Suggestions", sug_ft:"Suggest something",
      sug_fd:"Got an idea for the server? Send it — it lands in our Discord and the community votes.",
      sug_nl:"Your name / nick", sug_tl:"Your suggestion", sug_send:"Send suggestion",
      ap_k:"Join the team", ap_t:"Apply for Admin / Staff",
      ap_d:"Want to help moderate BALKAN-SERVERS? Fill this in — applications go straight to the staff team on Discord.",
      ap_name:"In-game name", ap_age:"Age", ap_steam:"SteamID", ap_disc:"Discord tag", ap_hours:"Hours/day you can play",
      ap_lang:"Languages", ap_exp:"Past admin experience", ap_why:"Why should we pick you?", ap_submit:"Submit application",
      cta_t:'Become <span class="gold">VIP</span>',
      cta_d:"The TERROR ETA model, the Hammer knife, random armor every round, reserved slot & more. From €3.",
      cta_b:"Open the Store",
      disc_t:"Join the community",
      disc_d:"News, giveaways, support & events — all on Discord. Apply for staff, report players, suggest features.",
      disc_b:"Join Discord", foot_secure:"Secure checkout"
    },
    al: {
      home:"Ballina", servers:"Serverat", store:"Dyqani", privileges:"Privilegjet", stats:"Statistika", classes:"Klasat", news:"Lajme",
      play:"Luaj", connect:"Lidhu", connectNow:"Lidhu tani", search:"Kërko…",
      hero_k:"DYQANI I PRIVILEGJEVE", hero_t:'MERR MË <span class="gold">SHUMË</span><br>FUQI',
      hero_d:"Blej VIP, thika speciale, klasa zombie & pako parash. Veçohu në server dhe zhblloko aftësi e komanda unike.",
      gotostore:"Shko te dyqani",
      srv_t:"Luaj në serverat tanë", online:"Online",
      season_k:"Këtë sezon", season_t:"Statistika",
      buy_t:"Blerjet e fundit", buy_s:"mbështet projektin ♥",
      lnews_t:"Lajmet e fundit", all:"të gjitha",
      chat_t:"Chat-i i komunitetit", chat_write:"Shkruaj një mesazh…", chat_signin:"Hyr për të shkruar…",
      top_p:"Lojtarët top", top_d:"Donatorët top",
      chg_k:"Ndryshimet", chg_t:"Çfarë ka të re", chg_m:"Shtuar · Rregulluar · Së shpejti",
      gw_k:"Dhurata falas", gw_t:"Shpërndarje", gw_m:"Merr pjesë përmes Discord",
      sug_k:"Zëri yt", sug_t:"Sugjerime", sug_ft:"Sugjero diçka",
      sug_fd:"Ke një ide për serverin? Dërgoje — shkon te Discord-i ynë dhe komuniteti voton.",
      sug_nl:"Emri / nick-u yt", sug_tl:"Sugjerimi yt", sug_send:"Dërgo sugjerimin",
      ap_k:"Bashkohu ekipit", ap_t:"Apliko për Admin / Staf",
      ap_d:"Dëshiron të ndihmosh me moderimin e BALKAN-SERVERS? Plotësoje këtë — aplikimet shkojnë direkt te stafi në Discord.",
      ap_name:"Emri në lojë", ap_age:"Mosha", ap_steam:"SteamID", ap_disc:"Tag-u i Discord", ap_hours:"Orë/ditë që mund të luash",
      ap_lang:"Gjuhët", ap_exp:"Përvojë e mëparshme si admin", ap_why:"Pse duhet të të zgjedhim?", ap_submit:"Dërgo aplikimin",
      cta_t:'Bëhu <span class="gold">VIP</span>',
      cta_d:"Modeli TERROR ETA, thika Hammer, armor random çdo raund, slot i rezervuar & më shumë. Nga €3.",
      cta_b:"Hap dyqanin",
      disc_t:"Bashkohu komunitetit",
      disc_d:"Lajme, dhurata, mbështetje & evente — gjithçka në Discord. Apliko për staf, raporto lojtarë, sugjero veçori.",
      disc_b:"Bashkohu në Discord", foot_secure:"Pagesë e sigurt"
    },
    ru: {
      home:"Главная", servers:"Серверы", store:"Магазин", privileges:"Привилегии", stats:"Статистика", classes:"Классы", news:"Новости",
      play:"Играть", connect:"Подключиться", connectNow:"Подключиться", search:"Поиск…",
      hero_k:"МАГАЗИН ПРИВИЛЕГИЙ", hero_t:'ПОЛУЧИ <span class="gold">БОЛЬШЕ</span><br>СИЛЫ',
      hero_d:"Покупай VIP, особые ножи, классы зомби и наборы денег. Выделяйся на сервере и открывай уникальные способности и команды.",
      gotostore:"В магазин",
      srv_t:"Играй на наших серверах", online:"Онлайн",
      season_k:"В этом сезоне", season_t:"Статистика",
      buy_t:"Последние покупки", buy_s:"поддержи проект ♥",
      lnews_t:"Последние новости", all:"все",
      chat_t:"Чат сообщества", chat_write:"Напишите сообщение…", chat_signin:"Войдите, чтобы писать…",
      top_p:"Топ игроков", top_d:"Топ донатеров",
      chg_k:"Изменения", chg_t:"Что нового", chg_m:"Добавлено · Исправлено · Скоро",
      gw_k:"Бесплатные награды", gw_t:"Розыгрыши", gw_m:"Участвуй через Discord",
      sug_k:"Твой голос", sug_t:"Предложения", sug_ft:"Предложи что-нибудь",
      sug_fd:"Есть идея для сервера? Отправь — она попадёт в наш Discord, и сообщество проголосует.",
      sug_nl:"Твоё имя / ник", sug_tl:"Твоё предложение", sug_send:"Отправить предложение",
      ap_k:"Присоединяйся к команде", ap_t:"Заявка в Админы / Стафф",
      ap_d:"Хочешь помочь модерировать BALKAN-SERVERS? Заполни это — заявки идут прямо команде в Discord.",
      ap_name:"Ник в игре", ap_age:"Возраст", ap_steam:"SteamID", ap_disc:"Discord-тег", ap_hours:"Часов в день можешь играть",
      ap_lang:"Языки", ap_exp:"Прошлый опыт админа", ap_why:"Почему мы должны выбрать тебя?", ap_submit:"Отправить заявку",
      cta_t:'Стань <span class="gold">VIP</span>',
      cta_d:"Модель TERROR ETA, нож Hammer, случайная броня каждый раунд, зарезервированный слот и больше. От €3.",
      cta_b:"Открыть магазин",
      disc_t:"Присоединяйся к сообществу",
      disc_d:"Новости, розыгрыши, поддержка и события — всё в Discord. Подавай заявки в стафф, жалуйся на игроков, предлагай идеи.",
      disc_b:"Зайти в Discord", foot_secure:"Безопасная оплата"
    },
    tr: {
      home:"Ana Sayfa", servers:"Sunucular", store:"Mağaza", privileges:"Ayrıcalıklar", stats:"İstatistik", classes:"Sınıflar", news:"Haberler",
      play:"Oyna", connect:"Bağlan", connectNow:"Şimdi bağlan", search:"Ara…",
      hero_k:"AYRICALIK MAĞAZASI", hero_t:'DAHA <span class="gold">FAZLA</span><br>GÜÇ AL',
      hero_d:"VIP, özel bıçaklar, zombi sınıfları ve para paketleri satın al. Sunucuda öne çık, benzersiz yetenekler ve komutlar aç.",
      gotostore:"Mağazaya git",
      srv_t:"Sunucularımızda oyna", online:"Çevrimiçi",
      season_k:"Bu sezon", season_t:"İstatistik",
      buy_t:"Son satın alımlar", buy_s:"projeyi destekle ♥",
      lnews_t:"Son haberler", all:"tümü",
      chat_t:"Topluluk sohbeti", chat_write:"Bir mesaj yaz…", chat_signin:"Sohbet için giriş yap…",
      top_p:"En iyi oyuncular", top_d:"En iyi bağışçılar",
      chg_k:"Değişiklikler", chg_t:"Yenilikler", chg_m:"Eklendi · Düzeltildi · Yakında",
      gw_k:"Bedava ödül", gw_t:"Çekilişler", gw_m:"Discord üzerinden katıl",
      sug_k:"Senin sesin", sug_t:"Öneriler", sug_ft:"Bir şey öner",
      sug_fd:"Sunucu için bir fikrin mi var? Gönder — Discord'umuza düşer ve topluluk oy verir.",
      sug_nl:"Adın / takma adın", sug_tl:"Önerin", sug_send:"Öneriyi gönder",
      ap_k:"Ekibe katıl", ap_t:"Admin / Yetkili başvurusu",
      ap_d:"BALKAN-SERVERS'i yönetmeye yardım etmek ister misin? Bunu doldur — başvurular doğrudan Discord'daki ekibe gider.",
      ap_name:"Oyun içi ad", ap_age:"Yaş", ap_steam:"SteamID", ap_disc:"Discord etiketi", ap_hours:"Günde kaç saat oynarsın",
      ap_lang:"Diller", ap_exp:"Geçmiş admin deneyimi", ap_why:"Seni neden seçelim?", ap_submit:"Başvuruyu gönder",
      cta_t:'<span class="gold">VIP</span> ol',
      cta_d:"TERROR ETA modeli, Hammer bıçağı, her raunt rastgele zırh, rezerve slot ve daha fazlası. €3'ten.",
      cta_b:"Mağazayı aç",
      disc_t:"Topluluğa katıl",
      disc_d:"Haberler, çekilişler, destek ve etkinlikler — hepsi Discord'da. Yetkili başvur, oyuncu bildir, özellik öner.",
      disc_b:"Discord'a katıl", foot_secure:"Güvenli ödeme"
    },
    sr: {
      home:"Početna", servers:"Serveri", store:"Prodavnica", privileges:"Privilegije", stats:"Statistika", classes:"Klase", news:"Vesti",
      play:"Igraj", connect:"Poveži se", connectNow:"Poveži se", search:"Pretraga…",
      hero_k:"PRODAVNICA PRIVILEGIJA", hero_t:'DOBIJ <span class="gold">VIŠE</span><br>MOĆI',
      hero_d:"Kupi VIP, posebne noževe, zombi klase i pakete novca. Istakni se na serveru i otključaj jedinstvene sposobnosti i komande.",
      gotostore:"Idi u prodavnicu",
      srv_t:"Igraj na našim serverima", online:"Onlajn",
      season_k:"Ove sezone", season_t:"Statistika",
      buy_t:"Poslednje kupovine", buy_s:"podrži projekat ♥",
      lnews_t:"Najnovije vesti", all:"sve",
      chat_t:"Čet zajednice", chat_write:"Napiši poruku…", chat_signin:"Prijavi se za čet…",
      top_p:"Najbolji igrači", top_d:"Najbolji donatori",
      chg_k:"Izmene", chg_t:"Šta je novo", chg_m:"Dodato · Popravljeno · Uskoro",
      gw_k:"Besplatan plen", gw_t:"Nagradne igre", gw_m:"Učestvuj preko Discorda",
      sug_k:"Tvoj glas", sug_t:"Predlozi", sug_ft:"Predloži nešto",
      sug_fd:"Imaš ideju za server? Pošalji je — stiže na naš Discord i zajednica glasa.",
      sug_nl:"Tvoje ime / nadimak", sug_tl:"Tvoj predlog", sug_send:"Pošalji predlog",
      ap_k:"Pridruži se timu", ap_t:"Prijava za Admina / Staf",
      ap_d:"Želiš da pomogneš u moderaciji BALKAN-SERVERS? Popuni ovo — prijave idu direktno timu na Discordu.",
      ap_name:"Ime u igri", ap_age:"Godine", ap_steam:"SteamID", ap_disc:"Discord oznaka", ap_hours:"Sati/dan koliko možeš da igraš",
      ap_lang:"Jezici", ap_exp:"Prethodno admin iskustvo", ap_why:"Zašto da izaberemo tebe?", ap_submit:"Pošalji prijavu",
      cta_t:'Postani <span class="gold">VIP</span>',
      cta_d:"TERROR ETA model, Hammer nož, nasumičan oklop svake runde, rezervisan slot i još. Od €3.",
      cta_b:"Otvori prodavnicu",
      disc_t:"Pridruži se zajednici",
      disc_d:"Vesti, nagradne igre, podrška i događaji — sve na Discordu. Prijavi se za staf, prijavi igrače, predloži funkcije.",
      disc_b:"Pridruži se Discordu", foot_secure:"Bezbedno plaćanje"
    },
    bg: {
      home:"Начало", servers:"Сървъри", store:"Магазин", privileges:"Привилегии", stats:"Статистика", classes:"Класове", news:"Новини",
      play:"Играй", connect:"Свържи се", connectNow:"Свържи се сега", search:"Търсене…",
      hero_k:"МАГАЗИН ЗА ПРИВИЛЕГИИ", hero_t:'ВЗЕМИ <span class="gold">ПОВЕЧЕ</span><br>СИЛА',
      hero_d:"Купи VIP, специални ножове, зомби класове и пакети пари. Открои се на сървъра и отключи уникални умения и команди.",
      gotostore:"Към магазина",
      srv_t:"Играй на нашите сървъри", online:"Онлайн",
      season_k:"Този сезон", season_t:"Статистика",
      buy_t:"Последни покупки", buy_s:"подкрепи проекта ♥",
      lnews_t:"Последни новини", all:"всички",
      chat_t:"Чат на общността", chat_write:"Напиши съобщение…", chat_signin:"Влез, за да пишеш…",
      top_p:"Топ играчи", top_d:"Топ дарители",
      chg_k:"Промени", chg_t:"Какво ново", chg_m:"Добавено · Поправено · Скоро",
      gw_k:"Безплатни награди", gw_t:"Томболи", gw_m:"Включи се през Discord",
      sug_k:"Твоят глас", sug_t:"Предложения", sug_ft:"Предложи нещо",
      sug_fd:"Имаш идея за сървъра? Изпрати я — отива в нашия Discord и общността гласува.",
      sug_nl:"Твоето име / ник", sug_tl:"Твоето предложение", sug_send:"Изпрати предложение",
      ap_k:"Присъедини се към екипа", ap_t:"Кандидатствай за Админ / Стаф",
      ap_d:"Искаш да помогнеш с модерирането на BALKAN-SERVERS? Попълни това — заявките отиват директно при екипа в Discord.",
      ap_name:"Име в играта", ap_age:"Възраст", ap_steam:"SteamID", ap_disc:"Discord таг", ap_hours:"Часове/ден, в които можеш да играеш",
      ap_lang:"Езици", ap_exp:"Предишен админ опит", ap_why:"Защо да изберем теб?", ap_submit:"Изпрати заявката",
      cta_t:'Стани <span class="gold">VIP</span>',
      cta_d:"Моделът TERROR ETA, ножът Hammer, случайна броня всеки рунд, резервиран слот и още. От €3.",
      cta_b:"Отвори магазина",
      disc_t:"Присъедини се към общността",
      disc_d:"Новини, томболи, поддръжка и събития — всичко в Discord. Кандидатствай за стаф, докладвай играчи, предлагай функции.",
      disc_b:"Влез в Discord", foot_secure:"Сигурно плащане"
    }
  };

  function getLang() { try { return localStorage.getItem("balkanLang") || "en"; } catch (e) { return "en"; } }
  function dict(code) { return T[code] || T.en; }
  function tr(code, k) { var d = dict(code); return (d[k] != null) ? d[k] : T.en[k]; }

  function apply(code) {
    var d = code || getLang();
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = tr(d, el.getAttribute("data-i18n")); if (v != null) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var v = tr(d, el.getAttribute("data-i18n-html")); if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      var v = tr(d, el.getAttribute("data-i18n-ph")); if (v != null) el.setAttribute("placeholder", v);
    });
    try { document.documentElement.lang = d; } catch (e) {}
    document.dispatchEvent(new CustomEvent("balkan-lang", { detail: d }));
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

  window.BalkanI18n = { apply: apply, setLang: setLang, getLang: getLang, tr: function (k) { return tr(getLang(), k); }, LANGS: LANGS };

  document.addEventListener("DOMContentLoaded", function () { injectCSS(); renderPicker(); apply(getLang()); });
})();
