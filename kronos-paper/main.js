(function () {
  "use strict";

  var data = window.__BRAND__ || {};
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
     Mounts — idempotent, fill only if empty
  --------------------------------------------------------------- */
  function mountFooterYear() {
    var el = $("[data-year]");
    if (el) el.textContent = data.year || new Date().getFullYear();
  }

  function mountNav() {
    var target = $("[data-nav-links]");
    if (!target || target.children.length > 0 || !data.nav) return;
    target.innerHTML = data.nav.map(function (item) {
      return '<a href="' + escHTML(item.href) + '">' + escHTML(item.label) + "</a>";
    }).join("");
  }

  function mountMobileNav() {
    var target = $("[data-mobile-nav-links]");
    if (!target || target.children.length > 0 || !data.nav) return;
    target.innerHTML = data.nav.map(function (item) {
      return "<li><a href=\"" + escHTML(item.href) + "\">" + escHTML(item.label) + "</a></li>";
    }).join("");
  }

  function mountHeroStats() {
    var target = $("[data-hero-stats]");
    if (!target || target.children.length > 0 || !data.stats) return;
    target.innerHTML = data.stats.map(function (s) {
      return (
        '<div class="hero-stat">' +
        '<div class="num"><span data-count-to="' + s.value + '">0</span><span class="suf">' + escHTML(s.suffix) + "</span></div>" +
        '<div class="label">' + escHTML(s.label) + "</div>" +
        "</div>"
      );
    }).join("");
  }

  function mountProductCards() {
    var target = $("[data-showcase]");
    if (!target || target.children.length > 0 || !data.products) return;
    target.innerHTML = data.products.map(function (p) {
      return (
        '<article class="product-card has-tilt" data-app="' + escHTML(p.app) + '">' +
        '<div class="product-visual">' + productIcon(p.app) + "</div>" +
        "<div>" +
        '<span class="tag">' + escHTML(p.width) + " × Ø" + escHTML(p.diam) + "</span>" +
        "<h4 style=\"margin-top:.7rem\">" + escHTML(p.line) + "</h4>" +
        "</div>" +
        '<p class="product-use">' + escHTML(p.use) + "</p>" +
        '<div class="product-tags">' +
        '<span class="tag">Núcleo ' + escHTML(p.core) + "</span>" +
        '<span class="tag">' + escHTML(p.gsm) + "</span>" +
        "</div>" +
        "</article>"
      );
    }).join("");
  }

  function productIcon(app) {
    var color = "var(--steel)";
    if (app === "pos") color = "var(--accent)";
    if (app === "datafono") color = "var(--steel)";
    return (
      '<svg viewBox="0 0 64 64" fill="none" aria-hidden="true">' +
      '<circle cx="32" cy="32" r="20" stroke="' + color + '" stroke-width="2" opacity="0.35"/>' +
      '<circle cx="32" cy="32" r="12" stroke="' + color + '" stroke-width="2" opacity="0.6"/>' +
      '<circle cx="32" cy="32" r="5" fill="' + color + '"/>' +
      "</svg>"
    );
  }

  function mountSpecsTable() {
    var target = $("[data-specs-table]");
    if (!target || target.children.length > 0 || !data.products) return;
    var appLabel = { pos: "POS / Fiscal", datafono: "Datáfono", oficina: "Oficina" };
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
    if (!target || target.children.length > 0 || !data.quality) return;
    var icons = [
      '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 3 6v6c0 5 4 9 9 10 5-1 9-5 9-10V6l-9-4z"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v4H4zM4 12h10v8H4zM17 12h3v4h-3z"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-4.5 7-11V5l-7-3-7 3v6c0 6.5 7 11 7 11z"/></svg>',
    ];
    target.innerHTML = data.quality.map(function (q, i) {
      return (
        '<div class="card quality-card" data-reveal>' +
        '<div class="quality-icon">' + (icons[i] || icons[0]) + "</div>" +
        "<h3>" + escHTML(q.title) + "</h3>" +
        "<p>" + escHTML(q.body) + "</p>" +
        "</div>"
      );
    }).join("");
  }

  function mountTestimonials() {
    var target = $("[data-testimonials]");
    if (!target || target.children.length > 0 || !data.testimonials) return;
    target.innerHTML = data.testimonials.map(function (t) {
      return (
        '<div class="card testi-card" data-reveal>' +
        '<p class="testi-quote">' + escHTML(t.quote) + "</p>" +
        '<div class="testi-author"><strong>' + escHTML(t.author) + "</strong>" + escHTML(t.role) + "</div>" +
        "</div>"
      );
    }).join("");
  }

  function mountCoverage() {
    var target = $("[data-coverage]");
    if (!target || target.children.length > 0 || !data.coverage) return;
    target.innerHTML = data.coverage.map(function (c) {
      return (
        '<div>' +
        '<div class="coverage-num"><span data-count-to="' + c.value + '">0</span><span class="suf">' + escHTML(c.suffix) + "</span></div>" +
        '<div class="coverage-label">' + escHTML(c.label) + "</div>" +
        "</div>"
      );
    }).join("");
  }

  function mountContact() {
    var el = $("[data-contact]");
    if (!el || !data.contact) return;
    if (el.dataset.mounted) return;
    el.dataset.mounted = "1";
    el.innerHTML =
      '<li><a href="mailto:' + escHTML(data.contact.email) + '">' + escHTML(data.contact.email) + "</a></li>" +
      '<li><a href="tel:' + escHTML(data.contact.phone.replace(/\s|\(|\)/g, "")) + '">' + escHTML(data.contact.phone) + "</a></li>" +
      "<li>" + escHTML(data.contact.address) + "</li>";
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
     Reveal on scroll
  --------------------------------------------------------------- */
  function initReveals() {
    var els = $$("[data-reveal]");
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-revealed");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -2% 0px" });
    els.forEach(function (el) { io.observe(el); });

    setTimeout(function () {
      $$("[data-reveal]:not(.is-revealed)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-revealed");
      });
    }, 6000);
  }

  /* ---------------------------------------------------------------
     Count-up numbers
  --------------------------------------------------------------- */
  function initCountUp() {
    var els = $$("[data-count-to]");
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        animateCount(e.target);
      });
    }, { threshold: 0.05 });
    els.forEach(function (el) { io.observe(el); });

    setTimeout(function () {
      els.forEach(function (el) {
        if (el.textContent === "0" && el.getBoundingClientRect().top < window.innerHeight) animateCount(el);
      });
    }, 6000);

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
        btn.setAttribute("aria-label", nowPaused ? "Reproducir demo" : "Pausar demo");
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
        submitBtn.textContent = "Enviando…";
      }
      setTimeout(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.label || "Solicitar cotización";
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
    safe(setupSmoothScroll, "setupSmoothScroll");
    safe(initScrollProgress, "initScrollProgress");
    safe(initReveals, "initReveals");
    safe(initCountUp, "initCountUp");
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
