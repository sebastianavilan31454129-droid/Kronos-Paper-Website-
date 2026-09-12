(function () {
  "use strict";

  var data = window.__BRAND__ || {};
  var i18n = window.__I18N__ || { es: {}, en: {} };
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;

  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); };
  var escHTML = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "] failed:", e); }
  }

  /* ---------------------------------------------------------------
     Language
  --------------------------------------------------------------- */
  var LANG_KEY = "kronos_lang";
  var currentLang = "es";
  try { currentLang = localStorage.getItem(LANG_KEY) || "es"; } catch (_e) {}
  if (currentLang !== "es" && currentLang !== "en") currentLang = "es";

  function tr(key) {
    var dict = i18n[currentLang] || i18n.es || {};
    return Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : (i18n.es && i18n.es[key]) || key;
  }
  function tf(field) {
    if (field && typeof field === "object") return field[currentLang] || field.es || "";
    return field == null ? "" : field;
  }

  function applyStaticText() {
    document.documentElement.setAttribute("lang", currentLang);
    document.title = tr("meta_title");
    var metaDesc = $('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", tr("meta_desc"));

    $$("[data-i18n]").forEach(function (el) { el.textContent = tr(el.getAttribute("data-i18n")); });
    $$("[data-i18n-html]").forEach(function (el) { el.innerHTML = tr(el.getAttribute("data-i18n-html")); });
    $$("[data-i18n-placeholder]").forEach(function (el) { el.setAttribute("placeholder", tr(el.getAttribute("data-i18n-placeholder"))); });
    $$("[data-i18n-aria]").forEach(function (el) { el.setAttribute("aria-label", tr(el.getAttribute("data-i18n-aria"))); });

    $$("[data-lang-btn]").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-lang-btn") === currentLang);
    });
  }

  function setLang(lang) {
    if (lang !== "es" && lang !== "en") return;
    currentLang = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch (_e) {}
    applyStaticText();
    remountTranslatable();
    renderCart();
  }

  function initLangToggle() {
    $$("[data-lang-btn]").forEach(function (btn) {
      btn.addEventListener("click", function () { setLang(btn.getAttribute("data-lang-btn")); });
    });
  }

  /* ---------------------------------------------------------------
     Mounts — idempotent, fill only if empty; language-aware
  --------------------------------------------------------------- */
  function emptyEl(el) { while (el.firstChild) el.removeChild(el.firstChild); }

  function mountFooterYear() {
    var el = $("[data-year]");
    if (el) el.textContent = data.year || new Date().getFullYear();
  }

  function mountNav() {
    var target = $("[data-nav-links]");
    if (!target || !data.nav) return;
    emptyEl(target);
    target.innerHTML = data.nav.map(function (item) {
      return '<a href="' + escHTML(item.href) + '">' + escHTML(tf(item.label)) + "</a>";
    }).join("");
  }

  function mountMobileNav() {
    var target = $("[data-mobile-nav-links]");
    if (!target || !data.nav) return;
    emptyEl(target);
    target.innerHTML = data.nav.map(function (item) {
      return "<li><a href=\"" + escHTML(item.href) + "\">" + escHTML(tf(item.label)) + "</a></li>";
    }).join("");
  }

  function mountHeroStats() {
    var target = $("[data-hero-stats]");
    if (!target || !data.stats) return;
    emptyEl(target);
    target.innerHTML = data.stats.map(function (s) {
      return (
        '<div class="hero-stat">' +
        '<div class="num"><span data-count-to="' + s.value + '">0</span><span class="suf">' + escHTML(s.suffix) + "</span></div>" +
        '<div class="label">' + escHTML(tf(s.label)) + "</div>" +
        "</div>"
      );
    }).join("");
    initCountUp(target);
  }

  function rollIcon(color) {
    color = color || "currentColor";
    return (
      '<svg viewBox="0 0 64 64" fill="none" aria-hidden="true">' +
      '<circle cx="32" cy="32" r="24" fill="' + color + '" opacity=".14"/>' +
      '<circle cx="32" cy="32" r="24" stroke="' + color + '" stroke-width="2.4"/>' +
      '<circle cx="32" cy="32" r="14" stroke="' + color + '" stroke-width="2.4"/>' +
      '<circle cx="32" cy="32" r="14" fill="' + color + '" opacity=".1"/>' +
      '<circle cx="32" cy="32" r="5.5" fill="' + color + '"/>' +
      "</svg>"
    );
  }

  function mountProductCards() {
    var target = $("[data-showcase]");
    if (!target || !data.products) return;
    emptyEl(target);
    var appColor = { pos: "var(--accent)", datafono: "var(--steel)", oficina: "var(--spark)" };
    target.innerHTML = data.products.map(function (p) {
      return (
        '<article class="product-card has-tilt" data-app="' + escHTML(p.app) + '">' +
        '<div class="product-visual">' + rollIcon(appColor[p.app] || "var(--accent)") + "</div>" +
        "<div>" +
        '<span class="tag">' + escHTML(p.width) + " × Ø" + escHTML(p.diam) + "</span>" +
        "<h4 style=\"margin-top:.7rem\">" + escHTML(p.line) + "</h4>" +
        "</div>" +
        '<p class="product-use">' + escHTML(tf(p.use)) + "</p>" +
        '<div class="product-tags">' +
        '<span class="tag">' + tr("app_pos_k_nucleo") + " " + escHTML(p.core) + "</span>" +
        '<span class="tag">' + escHTML(p.gsm) + "</span>" +
        "</div>" +
        '<button class="add-cart-btn" type="button" data-add-cart="' + escHTML(p.id) + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>' +
        '<span data-add-cart-label>' + tr("add_to_cart") + "</span>" +
        "</button>" +
        "</article>"
      );
    }).join("");
    bindAddToCart(target);
  }

  function mountSpecsTable() {
    var target = $("[data-specs-table]");
    if (!target || !data.products) return;
    emptyEl(target);
    var appLabel = { pos: tr("specs_app_pos"), datafono: tr("specs_app_datafono"), oficina: tr("specs_app_oficina") };
    target.innerHTML = data.products.map(function (p) {
      return (
        "<tr>" +
        "<td>" + escHTML(p.line) + "</td>" +
        '<td><span class="app-pill">' + escHTML(appLabel[p.app] || p.app) + "</span></td>" +
        "<td>" + escHTML(p.width) + "</td>" +
        "<td>" + escHTML(p.diam) + "</td>" +
        "<td>" + escHTML(p.core) + "</td>" +
        "<td>" + escHTML(p.gsm) + "</td>" +
        "<td>" + escHTML(p.length) + "</td>" +
        "</tr>"
      );
    }).join("");
  }

  function mountQuality() {
    var target = $("[data-quality]");
    if (!target || !data.quality) return;
    emptyEl(target);
    var icons = [
      '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 3 6v6c0 5 4 9 9 10 5-1 9-5 9-10V6l-9-4z"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v4H4zM4 12h10v8H4zM17 12h3v4h-3z"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-4.5 7-11V5l-7-3-7 3v6c0 6.5 7 11 7 11z"/></svg>',
    ];
    target.innerHTML = data.quality.map(function (q, i) {
      return (
        '<div class="card quality-card" data-reveal>' +
        '<div class="quality-icon">' + (icons[i] || icons[0]) + "</div>" +
        "<h3>" + escHTML(tf(q.title)) + "</h3>" +
        "<p>" + escHTML(tf(q.body)) + "</p>" +
        "</div>"
      );
    }).join("");
    initReveals(target);
  }

  function mountTestimonials() {
    var target = $("[data-testimonials]");
    if (!target || !data.testimonials) return;
    emptyEl(target);
    target.innerHTML = data.testimonials.map(function (t) {
      return (
        '<div class="card testi-card" data-reveal>' +
        '<p class="testi-quote">' + escHTML(tf(t.quote)) + "</p>" +
        '<div class="testi-author"><strong>' + escHTML(tf(t.author)) + "</strong>" + escHTML(tf(t.role)) + "</div>" +
        "</div>"
      );
    }).join("");
    initReveals(target);
  }

  function mountCoverage() {
    var target = $("[data-coverage]");
    if (!target || !data.coverage) return;
    emptyEl(target);
    target.innerHTML = data.coverage.map(function (c) {
      return (
        '<div>' +
        '<div class="coverage-num"><span data-count-to="' + c.value + '">0</span><span class="suf">' + escHTML(c.suffix) + "</span></div>" +
        '<div class="coverage-label">' + escHTML(tf(c.label)) + "</div>" +
        "</div>"
      );
    }).join("");
    initCountUp(target);
  }

  function mountContact() {
    var lists = $$("[data-contact]");
    if (!lists.length || !data.contact) return;
    var html =
      '<li><a href="mailto:' + escHTML(data.contact.email) + '">' + escHTML(data.contact.email) + "</a></li>" +
      '<li><a href="' + escHTML(data.contact.whatsappHref) + '" target="_blank" rel="noopener">' + escHTML(data.contact.whatsappDisplay) + "</a></li>" +
      "<li>" + escHTML(tf(data.contact.address)) + "</li>";
    lists.forEach(function (el) { el.innerHTML = html; });

    var socialRows = $$("[data-social]");
    var socialHtml =
      '<a class="icon-btn" href="' + escHTML(data.contact.whatsappHref) + '" target="_blank" rel="noopener" aria-label="' + escHTML(tr("social_whatsapp")) + '">' +
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1s-.7.9-.9 1.1c-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.5-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.3 0-.5s-.7-1.7-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2.1 3.2 5 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3z"/><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg></a>' +
      '<a class="icon-btn" href="mailto:' + escHTML(data.contact.email) + '" aria-label="' + escHTML(tr("social_email")) + '">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg></a>' +
      '<a class="icon-btn" href="' + escHTML(data.contact.tiktokHref) + '" target="_blank" rel="noopener" aria-label="' + escHTML(tr("social_tiktok")) + '">' +
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.8c-.7-.7-1.1-1.7-1.1-2.8h-3v13.1c0 1.3-1 2.3-2.3 2.3-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3c.3 0 .5 0 .8.1V10.7c-.3 0-.5-.1-.8-.1-3 0-5.4 2.4-5.4 5.4S7.2 21.4 10.2 21.4s5.4-2.4 5.4-5.4V9.2c1.1.8 2.5 1.3 4 1.3V7.5c-1.1 0-2.1-.4-3-1.7z"/></svg></a>' +
      '<a class="icon-btn" href="' + escHTML(data.contact.youtubeHref) + '" target="_blank" rel="noopener" aria-label="' + escHTML(tr("social_youtube")) + '">' +
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.6-.5-5.2c-.3-1-1.1-1.8-2.1-2C18.5 4.3 12 4.3 12 4.3s-6.5 0-8.4.5c-1 .2-1.8 1-2.1 2C1 8.4 1 12 1 12s0 3.6.5 5.2c.3 1 1.1 1.7 2.1 2 1.9.5 8.4.5 8.4.5s6.5 0 8.4-.5c1-.3 1.8-1 2.1-2 .5-1.6.5-5.2.5-5.2zM9.7 15.3V8.7l6 3.3-6 3.3z"/></svg></a>';
    socialRows.forEach(function (el) { el.innerHTML = socialHtml; });

    var wa = $("[data-whatsapp-float]");
    if (wa) wa.setAttribute("href", data.contact.whatsappHref);
  }

  function remountTranslatable() {
    safe(mountNav, "mountNav");
    safe(mountMobileNav, "mountMobileNav");
    safe(mountHeroStats, "mountHeroStats");
    safe(mountProductCards, "mountProductCards");
    safe(mountSpecsTable, "mountSpecsTable");
    safe(mountQuality, "mountQuality");
    safe(mountTestimonials, "mountTestimonials");
    safe(mountCoverage, "mountCoverage");
    safe(mountContact, "mountContact");
  }

  /* ---------------------------------------------------------------
     Cart — client-side quote cart (localStorage), no payment
  --------------------------------------------------------------- */
  var CART_KEY = "kronos_cart";
  var cart = [];
  try { cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch (_e) { cart = []; }
  if (!Array.isArray(cart)) cart = [];

  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (_e) {}
  }
  function findProduct(id) {
    return (data.products || []).filter(function (p) { return p.id === id; })[0];
  }
  function addToCart(id) {
    var existing = cart.filter(function (i) { return i.id === id; })[0];
    if (existing) existing.qty += 1;
    else cart.push({ id: id, qty: 1 });
    saveCart();
    renderCart();
  }
  function changeQty(id, delta) {
    var item = cart.filter(function (i) { return i.id === id; })[0];
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(function (i) { return i.id !== id; });
    saveCart();
    renderCart();
  }
  function removeFromCart(id) {
    cart = cart.filter(function (i) { return i.id !== id; });
    saveCart();
    renderCart();
  }
  function cartCount() {
    return cart.reduce(function (sum, i) { return sum + i.qty; }, 0);
  }

  function bindAddToCart(scope) {
    $$("[data-add-cart]", scope).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-add-cart");
        addToCart(id);
        btn.classList.add("is-added");
        var label = $("[data-add-cart-label]", btn);
        var prevText = label ? label.textContent : "";
        if (label) label.textContent = tr("added_to_cart");
        setTimeout(function () {
          btn.classList.remove("is-added");
          if (label) label.textContent = tr("add_to_cart");
        }, 1200);
      });
    });
  }

  function renderCart() {
    var badge = $("[data-cart-count]");
    var count = cartCount();
    if (badge) {
      badge.textContent = count;
      badge.classList.toggle("is-shown", count > 0);
    }

    var itemsWrap = $("[data-cart-items]");
    var summary = $("[data-cart-summary]");
    if (!itemsWrap) return;

    if (!cart.length) {
      itemsWrap.innerHTML = '<p class="cart-empty">' + tr("cart_empty") + "</p>";
    } else {
      itemsWrap.innerHTML = cart.map(function (item) {
        var p = findProduct(item.id);
        if (!p) return "";
        return (
          '<div class="cart-item" data-cart-item="' + escHTML(item.id) + '">' +
          '<div class="cart-item-visual">' + rollIcon("var(--accent)") + "</div>" +
          "<div>" +
          '<div class="cart-item-name">' + escHTML(p.line) + "</div>" +
          '<div class="cart-item-meta">' + escHTML(p.width) + " × Ø" + escHTML(p.diam) + " · " + tr("app_pos_k_nucleo") + " " + escHTML(p.core) + "</div>" +
          "</div>" +
          '<div class="cart-item-actions">' +
          '<div class="cart-qty">' +
          '<button type="button" data-qty-minus="' + escHTML(item.id) + '" aria-label="-1">−</button>' +
          "<span>" + item.qty + "</span>" +
          '<button type="button" data-qty-plus="' + escHTML(item.id) + '" aria-label="+1">+</button>' +
          "</div>" +
          '<button type="button" class="cart-remove" data-cart-remove="' + escHTML(item.id) + '">' + tr("cart_remove") + "</button>" +
          "</div>" +
          "</div>"
        );
      }).join("");
    }

    if (summary) {
      summary.innerHTML = '<span>' + count + ' ' + tr("cart_items_count") + '</span><strong>' + cart.length + '</strong>';
    }

    $$("[data-qty-plus]", itemsWrap).forEach(function (b) { b.onclick = function () { changeQty(b.getAttribute("data-qty-plus"), 1); }; });
    $$("[data-qty-minus]", itemsWrap).forEach(function (b) { b.onclick = function () { changeQty(b.getAttribute("data-qty-minus"), -1); }; });
    $$("[data-cart-remove]", itemsWrap).forEach(function (b) { b.onclick = function () { removeFromCart(b.getAttribute("data-cart-remove")); }; });
  }

  function initCart() {
    var toggle = $("[data-cart-toggle]");
    var drawer = $("[data-cart-drawer]");
    var overlay = $("[data-cart-overlay]");
    var closeBtn = $("[data-cart-close]");
    var goQuote = $("[data-cart-go-quote]");

    function open() {
      if (drawer) drawer.classList.add("is-open");
      if (overlay) overlay.classList.add("is-open");
    }
    function close() {
      if (drawer) drawer.classList.remove("is-open");
      if (overlay) overlay.classList.remove("is-open");
    }
    if (toggle) toggle.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (overlay) overlay.addEventListener("click", close);
    if (goQuote) {
      goQuote.addEventListener("click", function () {
        var msg = $("#f-msg");
        if (msg && cart.length) {
          var lines = cart.map(function (item) {
            var p = findProduct(item.id);
            return p ? item.qty + "x " + p.line : "";
          }).filter(Boolean);
          msg.value = lines.join(", ");
        }
        close();
        var target = document.getElementById("contacto");
        if (target) target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      });
    }
    renderCart();
  }

  /* ---------------------------------------------------------------
     Splash
  --------------------------------------------------------------- */
  function initSplash() {
    var splash = $("[data-splash]");
    if (!splash) return;
    var hide = function () { splash.classList.add("is-out"); };
    if (document.readyState === "complete") setTimeout(hide, 500);
    else window.addEventListener("load", function () { setTimeout(hide, 350); });
    setTimeout(hide, 2600);
  }

  /* ---------------------------------------------------------------
     Nav
  --------------------------------------------------------------- */
  function initNav() {
    var nav = $("[data-nav]");
    if (!nav) return;
    var onScroll = function () {
      nav.classList.toggle("is-solid", window.scrollY > 12);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var burger = $("[data-burger]");
    var menu = $("[data-mobile-menu]");
    if (burger && menu) {
      burger.addEventListener("click", function () {
        menu.classList.toggle("is-open");
      });
      $$("a", menu).forEach(function (a) {
        a.addEventListener("click", function () { menu.classList.remove("is-open"); });
      });
    }
  }

  /* ---------------------------------------------------------------
     Smooth anchor scroll (native)
  --------------------------------------------------------------- */
  function setupSmoothScroll() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var navOffset = 76;
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - navOffset,
        behavior: reduced ? "auto" : "smooth",
      });
    });
  }

  /* ---------------------------------------------------------------
     Scroll progress
  --------------------------------------------------------------- */
  function initScrollProgress() {
    var bar = $("[data-scroll-progress]");
    if (!bar) return;
    var raf = null;
    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = "scaleX(" + pct + ")";
      raf = null;
    }
    window.addEventListener("scroll", function () { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
    update();
  }

  /* ---------------------------------------------------------------
     Reveal on scroll — can be called on a subtree after re-mount
  --------------------------------------------------------------- */
  var revealObserver = null;
  function getRevealObserver() {
    if (revealObserver) return revealObserver;
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-revealed");
          revealObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -2% 0px" });
    return revealObserver;
  }
  function initReveals(scope) {
    var els = $$("[data-reveal]", scope);
    if (!els.length) return;
    var io = getRevealObserver();
    els.forEach(function (el) { if (!el.classList.contains("is-revealed")) io.observe(el); });

    setTimeout(function () {
      $$("[data-reveal]:not(.is-revealed)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-revealed");
      });
    }, 6000);
  }

  /* ---------------------------------------------------------------
     Count-up numbers
  --------------------------------------------------------------- */
  var countObserver = null;
  function getCountObserver() {
    if (countObserver) return countObserver;
    countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        countObserver.unobserve(e.target);
        animateCount(e.target);
      });
    }, { threshold: 0.05 });
    return countObserver;
  }
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count-to"), 10) || 0;
    var duration = reduced ? 0 : 1400;
    if (duration === 0) { el.textContent = target; return; }
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  function initCountUp(scope) {
    var els = $$("[data-count-to]", scope);
    if (!els.length) return;
    var io = getCountObserver();
    els.forEach(function (el) { io.observe(el); });

    setTimeout(function () {
      els.forEach(function (el) {
        if (el.textContent === "0" && el.getBoundingClientRect().top < window.innerHeight) animateCount(el);
      });
    }, 6000);
  }

  /* ---------------------------------------------------------------
     Machine scenes — activate CSS animations while in view
  --------------------------------------------------------------- */
  function initMachineScenes() {
    var scenes = $$("[data-scene]");
    if (!scenes.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        e.target.classList.toggle("is-active", e.isIntersecting);
      });
    }, { threshold: 0.05 });
    scenes.forEach(function (el) { io.observe(el); });

    setTimeout(function () {
      scenes.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-active");
      });
    }, 6000);
  }

  /* ---------------------------------------------------------------
     Video-demo chrome — manual play/pause toggle
  --------------------------------------------------------------- */
  function initVideoDemos() {
    var demos = $$(".video-demo");
    if (!demos.length) return;
    demos.forEach(function (demo) {
      var btn = $("[data-video-toggle]", demo);
      if (!btn) return;
      btn.addEventListener("click", function () {
        var nowPaused = demo.classList.toggle("is-paused");
        btn.setAttribute("aria-label", tr(nowPaused ? "video_play" : "video_pause"));
      });
    });
  }

  /* ---------------------------------------------------------------
     Tilt on cards
  --------------------------------------------------------------- */
  function initTilt() {
    if (!fineHover) return;
    document.addEventListener("mouseover", function (e) {
      var card = e.target.closest && e.target.closest(".has-tilt");
      if (!card || card.dataset.tiltBound) return;
      card.dataset.tiltBound = "1";
      bindTilt(card);
    });

    function bindTilt(card) {
      var MAX = 6, tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        tx = -py * MAX; ty = px * MAX;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      card.addEventListener("mouseout", function (ev) {
        if (card.contains(ev.relatedTarget)) return;
        tx = 0; ty = 0;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      function loop() {
        cx += (tx - cx) * 0.15; cy += (ty - cy) * 0.15;
        card.style.setProperty("--rx", cx.toFixed(2) + "deg");
        card.style.setProperty("--ry", cy.toFixed(2) + "deg");
        raf = (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) ? requestAnimationFrame(loop) : null;
      }
    }
  }

  /* ---------------------------------------------------------------
     GSAP: hero parallax + pinned horizontal showcase
  --------------------------------------------------------------- */
  function initHeroParallax() {
    if (!window.gsap || !window.ScrollTrigger || reduced) return;
    var mesh = $(".hero-mesh");
    if (!mesh) return;
    gsap.to(mesh, {
      yPercent: 12, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
  }

  function initShowcasePinned() {
    if (!window.gsap || !window.ScrollTrigger) return;
    var sec = $(".showcase");
    var track = $("[data-showcase]");
    if (!sec || !track) return;

    var setup = function () {
      ScrollTrigger.getAll().forEach(function (s) { if (s.vars.id === "showcase-pin") s.kill(); });
      var isDesktop = window.innerWidth >= 1024;
      sec.classList.toggle("is-pinned", isDesktop);
      gsap.set(track, { x: 0 });
      if (!isDesktop) return;
      var trackRect = track.getBoundingClientRect();
      var distance = track.scrollWidth - window.innerWidth + trackRect.left + 16;
      if (distance <= 0) return;

      gsap.to(track, {
        x: function () { return -distance; }, ease: "none",
        scrollTrigger: {
          id: "showcase-pin",
          trigger: sec, start: "top top+=72",
          end: function () { return "+=" + (distance + window.innerHeight * 0.4); },
          pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1,
        },
      });
    };

    setup();
    var to;
    window.addEventListener("resize", function () {
      clearTimeout(to);
      to = setTimeout(function () { ScrollTrigger.refresh(); setup(); }, 250);
    });
  }

  /* ---------------------------------------------------------------
     Form — simulated realistic submit
  --------------------------------------------------------------- */
  function initForm() {
    var form = $("[data-quote-form]");
    if (!form) return;
    var success = $("[data-form-success]");
    var submitBtn = $("[data-form-submit]");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.label = submitBtn.textContent;
        submitBtn.textContent = tr("form_sending");
      }
      setTimeout(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.label || tr("btn_quote");
        }
        if (success) success.classList.add("is-shown");
        form.reset();
      }, 900);
    });

    var closeBtn = success && $("[data-form-success-close]", success);
    if (closeBtn) {
      closeBtn.addEventListener("click", function () { success.classList.remove("is-shown"); });
    }
  }

  /* ---------------------------------------------------------------
     Boot
  --------------------------------------------------------------- */
  function boot() {
    safe(applyStaticText, "applyStaticText");
    safe(mountFooterYear, "mountFooterYear");
    safe(mountNav, "mountNav");
    safe(mountMobileNav, "mountMobileNav");
    safe(mountHeroStats, "mountHeroStats");
    safe(mountProductCards, "mountProductCards");
    safe(mountSpecsTable, "mountSpecsTable");
    safe(mountQuality, "mountQuality");
    safe(mountTestimonials, "mountTestimonials");
    safe(mountCoverage, "mountCoverage");
    safe(mountContact, "mountContact");

    safe(initSplash, "initSplash");
    safe(initNav, "initNav");
    safe(initLangToggle, "initLangToggle");
    safe(initCart, "initCart");
    safe(setupSmoothScroll, "setupSmoothScroll");
    safe(initScrollProgress, "initScrollProgress");
    safe(function () { initReveals(document); }, "initReveals");
    safe(function () { initCountUp(document); }, "initCountUp");
    safe(initMachineScenes, "initMachineScenes");
    safe(initVideoDemos, "initVideoDemos");
    safe(initTilt, "initTilt");
    safe(initForm, "initForm");

    if (window.gsap && window.ScrollTrigger) {
      try { gsap.registerPlugin(ScrollTrigger); } catch (_e) {}
      safe(initHeroParallax, "initHeroParallax");
      safe(initShowcasePinned, "initShowcasePinned");
    }

    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
