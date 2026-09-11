/* Kronos Paper — main.js
   Vanilla JS, IIFE pattern (no ES modules — safe for file:// and any static host).
   Handles: i18n toggle, sticky header, mobile nav, reveal-on-scroll,
   card tilt, cart (localStorage), WhatsApp / email order links. */
(function () {
  "use strict";

  var brand = window.__BRAND__ || {};
  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); };
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  function safe(fn, name) { try { fn(); } catch (e) { console.warn("[" + name + "]", e); } }
  function escHTML(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* -----------------------------------------------------------
     1. i18n dictionary
     ----------------------------------------------------------- */
  var DICT = {
    es: {
      "brand.tagline": "Etiquetas y Papel Térmico",
      "nav.products": "Productos",
      "nav.sizes": "Medidas",
      "nav.location": "Ubicación",
      "nav.contact": "Contacto",
      "ui.whatsapp": "Escribir por WhatsApp",
      "ui.add_to_cart": "Agregar al pedido",
      "ui.added": "¡Agregado!",
      "hero.kicker": "Fabricación y conversión propia",
      "hero.title1": "Rollos térmicos",
      "hero.title2": "y etiquetas a su medida",
      "hero.sub": "Fabricamos y convertimos papel térmico para balanzas, punto de venta y máquinas fiscales, con la calidad de impresión que su negocio necesita.",
      "hero.cta.products": "Ver productos",
      "hero.cta.whatsapp": "Cotizar por WhatsApp",
      "hero.location": "Mariche, Caracas — delivery a toda el área metropolitana",
      "marquee.fiscal": "80 x 60 mm — Máquinas fiscales",
      "marquee.fiscal65": "80 x 65 mm — Máquinas fiscales",
      "marquee.pos": "57 x 40 mm — Punto de venta",
      "marquee.balanza": "57 x 40 mm — Etiquetas para balanza",
      "marquee.custom": "Medidas especiales bajo pedido",
      "value.1.title": "Fabricación y conversión propia",
      "value.1.desc": "Convertimos bobinas a la medida exacta que necesita su equipo.",
      "value.2.title": "Delivery en toda Caracas",
      "value.2.desc": "Despachamos desde Mariche hacia toda el área metropolitana.",
      "value.3.title": "Adhesivo y corte de calidad",
      "value.3.desc": "Sin atascos, sin polvo, con corte limpio en cada rollo.",
      "value.4.title": "Medidas especiales",
      "value.4.desc": "Convertimos formatos a solicitud, fuera del catálogo estándar.",
      "products.kicker": "Catálogo",
      "products.title": "Rollos y etiquetas para cada equipo",
      "products.sub": "Seleccione la cantidad de rollos y agréguelos a su pedido. Le confirmamos precio y disponibilidad por WhatsApp o correo.",
      "product.balanza.cat": "Etiquetas",
      "product.balanza.name": "Etiquetas Térmicas para Balanzas",
      "product.balanza.desc": "Etiqueta térmica troquelada para balanzas comerciales. Troquelado exacto y adhesivo estable que evitan atascos al pesar e imprimir precio y código de barras.",
      "product.balanza.b1": "Troquelado exacto",
      "product.balanza.b2": "Adhesivo estable",
      "product.balanza.b3": "Arranque sin atascos",
      "product.pos.cat": "Rollos POS",
      "product.pos.name": "Rollos para Punto de Venta",
      "product.pos.desc": "Rollo térmico de alta sensibilidad para impresoras de punto de venta. Sin polvo y con corte limpio, ideal para recibos y tickets de caja.",
      "product.pos.b1": "Alta sensibilidad térmica",
      "product.pos.b2": "Sin polvo",
      "product.pos.b3": "Corte limpio",
      "product.fiscal60.cat": "Máquinas fiscales",
      "product.fiscal60.name": "Rollos para Máquinas Fiscales",
      "product.fiscal60.desc": "Papel térmico y bond para máquinas fiscales. Impresión nítida de facturas y reportes Z, sin manchas ni desvanecimiento.",
      "product.fiscal60.b1": "Papel térmico y bond",
      "product.fiscal60.b2": "Impresión nítida",
      "product.fiscal60.b3": "Ideal para reportes Z",
      "product.fiscal65.cat": "Máquinas fiscales",
      "product.fiscal65.name": "Rollos para Máquinas Fiscales",
      "product.fiscal65.desc": "Misma calidad de impresión que nuestro rollo 80x60 mm, en la medida alternativa 80x65 mm para las máquinas fiscales que la requieran.",
      "product.fiscal65.b3": "Medida alternativa 80x65",
      "product.custom.badge": "Bajo pedido",
      "product.custom.cat": "Servicio de conversión",
      "product.custom.name": "Medidas Especiales",
      "product.custom.desc": "¿Su equipo usa una medida distinta? Convertimos rollos térmicos y etiquetas en formatos especiales bajo pedido.",
      "product.custom.note": "Cuéntenos el ancho, diámetro y tipo de papel que necesita y le enviamos una cotización.",
      "product.custom.cta": "Consultar medida especial",
      "sizes.kicker": "Especificaciones",
      "sizes.title": "Medidas disponibles",
      "sizes.sub": "Estas son nuestras medidas estándar en inventario. También convertimos medidas especiales bajo pedido.",
      "sizes.group.fiscal": "Máquinas fiscales",
      "sizes.group.pos": "Punto de venta",
      "sizes.group.balanza": "Etiquetas para balanza",
      "sizes.note": "¿Necesita otra medida? También convertimos formatos especiales a la medida exacta de su equipo bajo pedido.",
      "location.kicker": "Dónde estamos",
      "location.title": "Ubicados en Mariche, delivery a toda Caracas",
      "location.sub": "Despachamos pedidos desde Mariche hacia toda el área metropolitana de Caracas.",
      "location.address.title": "Dirección",
      "location.address.value": "Mariche, Municipio Sucre, Caracas, Venezuela",
      "location.delivery.title": "Delivery",
      "location.delivery.value": "Entregas en toda el área metropolitana de Caracas",
      "location.whatsapp.title": "WhatsApp",
      "location.email.title": "Correo",
      "location.cta.whatsapp": "Escribir por WhatsApp",
      "location.cta.email": "Enviar correo",
      "cta.title": "¿Listo para hacer su pedido?",
      "cta.sub": "Agregue sus productos al carrito o escríbanos directamente. Le respondemos con precio y disponibilidad.",
      "cta.whatsapp": "Cotizar por WhatsApp",
      "cta.cart": "Ver mi carrito",
      "footer.tagline": "Fabricación y conversión de rollos térmicos y etiquetas, ubicados en Mariche, Caracas.",
      "footer.nav.title": "Navegación",
      "footer.contact.title": "Contacto",
      "footer.sizes.title": "Medidas",
      "footer.rights": "Todos los derechos reservados.",
      "footer.credit": "Rollos térmicos y etiquetas — Mariche, Caracas, Venezuela.",
      "cart.title": "Mi pedido",
      "cart.empty.title": "Tu carrito está vacío",
      "cart.empty.sub": "Agregue productos desde el catálogo para armar su pedido.",
      "cart.summary_label": "Total en el pedido",
      "cart.units": "rollos",
      "cart.send_whatsapp": "Enviar pedido por WhatsApp",
      "cart.send_email": "Enviar pedido por correo",
      "cart.clear": "Vaciar carrito",
      "cart.remove": "Quitar",
      "ui.view_size_demo": "Ver medida animada",
      "sizeDemo.replay": "Reproducir de nuevo",
      "sizeDemo.close": "Cerrar",
      "sizeDemo.hint_roll": "Así se mide el ancho del papel y el diámetro del rollo.",
      "sizeDemo.hint_label": "Así se mide el ancho y el alto de cada etiqueta."
    },
    en: {
      "brand.tagline": "Labels & Thermal Paper",
      "nav.products": "Products",
      "nav.sizes": "Sizes",
      "nav.location": "Location",
      "nav.contact": "Contact",
      "ui.whatsapp": "Message us on WhatsApp",
      "ui.add_to_cart": "Add to order",
      "ui.added": "Added!",
      "hero.kicker": "In-house manufacturing & converting",
      "hero.title1": "Thermal rolls",
      "hero.title2": "and labels, made to fit",
      "hero.sub": "We manufacture and convert thermal paper for scales, point-of-sale systems and fiscal printers, with the print quality your business needs.",
      "hero.cta.products": "View products",
      "hero.cta.whatsapp": "Get a quote on WhatsApp",
      "hero.location": "Mariche, Caracas — delivery across the metro area",
      "marquee.fiscal": "80 x 60 mm — Fiscal printers",
      "marquee.fiscal65": "80 x 65 mm — Fiscal printers",
      "marquee.pos": "57 x 40 mm — Point of sale",
      "marquee.balanza": "57 x 40 mm — Scale labels",
      "marquee.custom": "Special sizes on request",
      "value.1.title": "In-house manufacturing & converting",
      "value.1.desc": "We convert jumbo rolls to the exact size your equipment needs.",
      "value.2.title": "Delivery across Caracas",
      "value.2.desc": "We dispatch from Mariche to the whole metropolitan area.",
      "value.3.title": "Reliable adhesive & clean cut",
      "value.3.desc": "No jams, no dust, with a clean cut on every roll.",
      "value.4.title": "Special sizes",
      "value.4.desc": "We convert custom formats on request, outside our standard catalog.",
      "products.kicker": "Catalog",
      "products.title": "Rolls and labels for every machine",
      "products.sub": "Pick the number of rolls and add them to your order. We'll confirm price and availability by WhatsApp or email.",
      "product.balanza.cat": "Labels",
      "product.balanza.name": "Thermal Labels for Scales",
      "product.balanza.desc": "Die-cut thermal label for commercial scales. Precise die-cutting and stable adhesive prevent jams while weighing and printing price and barcode.",
      "product.balanza.b1": "Precise die-cut",
      "product.balanza.b2": "Stable adhesive",
      "product.balanza.b3": "Jam-free feed",
      "product.pos.cat": "POS rolls",
      "product.pos.name": "Point-of-Sale Rolls",
      "product.pos.desc": "High-sensitivity thermal roll for point-of-sale printers. Dust-free with a clean cut, ideal for receipts and register tickets.",
      "product.pos.b1": "High thermal sensitivity",
      "product.pos.b2": "Dust-free",
      "product.pos.b3": "Clean cut",
      "product.fiscal60.cat": "Fiscal printers",
      "product.fiscal60.name": "Fiscal Printer Rolls",
      "product.fiscal60.desc": "Thermal and bond paper for fiscal printers. Crisp printing of invoices and Z reports, without smudging or fading.",
      "product.fiscal60.b1": "Thermal and bond paper",
      "product.fiscal60.b2": "Crisp printing",
      "product.fiscal60.b3": "Ideal for Z reports",
      "product.fiscal65.cat": "Fiscal printers",
      "product.fiscal65.name": "Fiscal Printer Rolls",
      "product.fiscal65.desc": "Same print quality as our 80x60 mm roll, in the alternate 80x65 mm size for fiscal printers that require it.",
      "product.fiscal65.b3": "Alternate 80x65 size",
      "product.custom.badge": "On request",
      "product.custom.cat": "Conversion service",
      "product.custom.name": "Special Sizes",
      "product.custom.desc": "Does your equipment use a different size? We convert thermal rolls and labels into special formats on request.",
      "product.custom.note": "Tell us the width, diameter and paper type you need and we'll send you a quote.",
      "product.custom.cta": "Ask about a special size",
      "sizes.kicker": "Specifications",
      "sizes.title": "Available sizes",
      "sizes.sub": "These are our standard in-stock sizes. We also convert special sizes on request.",
      "sizes.group.fiscal": "Fiscal printers",
      "sizes.group.pos": "Point of sale",
      "sizes.group.balanza": "Scale labels",
      "sizes.note": "Need another size? We also convert special formats to the exact size your equipment requires, on request.",
      "location.kicker": "Where we are",
      "location.title": "Based in Mariche, delivery across Caracas",
      "location.sub": "We dispatch orders from Mariche to the whole Caracas metropolitan area.",
      "location.address.title": "Address",
      "location.address.value": "Mariche, Sucre Municipality, Caracas, Venezuela",
      "location.delivery.title": "Delivery",
      "location.delivery.value": "Deliveries across the Caracas metropolitan area",
      "location.whatsapp.title": "WhatsApp",
      "location.email.title": "Email",
      "location.cta.whatsapp": "Message us on WhatsApp",
      "location.cta.email": "Send an email",
      "cta.title": "Ready to place your order?",
      "cta.sub": "Add your products to the cart or write to us directly. We'll reply with price and availability.",
      "cta.whatsapp": "Get a quote on WhatsApp",
      "cta.cart": "View my cart",
      "footer.tagline": "Manufacturing and converting thermal rolls and labels, based in Mariche, Caracas.",
      "footer.nav.title": "Navigation",
      "footer.contact.title": "Contact",
      "footer.sizes.title": "Sizes",
      "footer.rights": "All rights reserved.",
      "footer.credit": "Thermal rolls and labels — Mariche, Caracas, Venezuela.",
      "cart.title": "My order",
      "cart.empty.title": "Your cart is empty",
      "cart.empty.sub": "Add products from the catalog to build your order.",
      "cart.summary_label": "Total in this order",
      "cart.units": "rolls",
      "cart.send_whatsapp": "Send order via WhatsApp",
      "cart.send_email": "Send order via email",
      "cart.clear": "Clear cart",
      "cart.remove": "Remove",
      "ui.view_size_demo": "See size animation",
      "sizeDemo.replay": "Replay",
      "sizeDemo.close": "Close",
      "sizeDemo.hint_roll": "This is how paper width and roll diameter are measured.",
      "sizeDemo.hint_label": "This is how each label's width and height are measured."
    }
  };

  var PRODUCTS = {
    "balanza-57x40": { size: "57 x 40 mm", name: { es: DICT.es["product.balanza.name"], en: DICT.en["product.balanza.name"] } },
    "pos-57x40": { size: "57 x 40 mm", name: { es: DICT.es["product.pos.name"], en: DICT.en["product.pos.name"] } },
    "fiscal-80x60": { size: "80 x 60 mm", name: { es: DICT.es["product.fiscal60.name"], en: DICT.en["product.fiscal60.name"] } },
    "fiscal-80x65": { size: "80 x 65 mm", name: { es: DICT.es["product.fiscal65.name"], en: DICT.en["product.fiscal65.name"] } }
  };

  var SIZE_DEMOS = {
    "balanza-57x40": { kind: "label", width: 57, height: 40 },
    "pos-57x40": { kind: "roll", width: 57, diameter: 40 },
    "fiscal-80x60": { kind: "roll", width: 80, diameter: 60 },
    "fiscal-80x65": { kind: "roll", width: 80, diameter: 65 }
  };

  var LANG_KEY = "kronos_lang";
  var CART_KEY = "kronos_cart";
  var currentLang = "es";

  function t(key) {
    var d = DICT[currentLang] || DICT.es;
    return d[key] != null ? d[key] : (DICT.es[key] || key);
  }

  function applyLanguage(lang) {
    currentLang = (lang === "en") ? "en" : "es";
    document.documentElement.setAttribute("lang", currentLang);
    $$("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var val = t(key);
      if (val != null) el.textContent = val;
    });
    var toggle = $("[data-lang-toggle]");
    if (toggle) {
      toggle.setAttribute("data-lang", currentLang);
      $$("[data-lang-btn]", toggle).forEach(function (btn) {
        btn.classList.toggle("is-active", btn.getAttribute("data-lang-btn") === currentLang);
      });
    }
    document.title = currentLang === "en"
      ? "Kronos Paper — Thermal rolls and labels in Caracas"
      : "Kronos Paper — Rollos térmicos y etiquetas en Caracas";
    try { localStorage.setItem(LANG_KEY, currentLang); } catch (e) {}
    renderCart();
    updateWhatsAppLinks();
    if (typeof currentDemoId !== "undefined" && currentDemoId) renderSizeDemo(currentDemoId);
  }

  function initLanguage() {
    var toggle = $("[data-lang-toggle]");
    if (!toggle) return;
    var saved = "es";
    try { saved = localStorage.getItem(LANG_KEY) || "es"; } catch (e) {}
    $$("[data-lang-btn]", toggle).forEach(function (btn) {
      btn.addEventListener("click", function () { applyLanguage(btn.getAttribute("data-lang-btn")); });
    });
    applyLanguage(saved);
  }

  /* -----------------------------------------------------------
     2. Header / mobile nav
     ----------------------------------------------------------- */
  function initHeader() {
    var header = $("[data-header]");
    if (!header) return;
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initMobileNav() {
    var toggle = $("[data-menu-toggle]");
    var panel = $("[data-mobile-nav]");
    if (!toggle || !panel) return;
    function close() {
      panel.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
    toggle.addEventListener("click", function () {
      var open = panel.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("a", panel).forEach(function (a) { a.addEventListener("click", close); });
  }

  /* -----------------------------------------------------------
     3. Reveal on scroll
     ----------------------------------------------------------- */
  function initReveals() {
    var items = $$(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -2% 0px" });
    items.forEach(function (el) { io.observe(el); });

    setTimeout(function () {
      items.forEach(function (el) {
        if (!el.classList.contains("is-visible") && el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("is-visible");
        }
      });
    }, 6000);
  }

  /* -----------------------------------------------------------
     4. Product card tilt (subtle, pointer-fine only)
     ----------------------------------------------------------- */
  function initTilt() {
    if (!fineHover) return;
    $$(".product-card").forEach(function (card) {
      var raf = null;
      card.addEventListener("mousemove", function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = "perspective(900px) rotateX(" + (py * -4) + "deg) rotateY(" + (px * 4) + "deg) translateY(-3px)";
          raf = null;
        });
      });
      card.addEventListener("mouseout", function (e) {
        if (!card.contains(e.relatedTarget)) card.style.transform = "";
      });
    });
  }

  /* -----------------------------------------------------------
     5. Magnetic primary buttons
     ----------------------------------------------------------- */
  function initMagnetic() {
    if (!fineHover) return;
    $$(".btn-primary, .btn-whatsapp").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var mx = (e.clientX - r.left - r.width / 2) * 0.18;
        var my = (e.clientY - r.top - r.height / 2) * 0.28;
        btn.style.transform = "translate(" + mx + "px," + my + "px)";
      });
      btn.addEventListener("mouseout", function (e) {
        if (!btn.contains(e.relatedTarget)) btn.style.transform = "";
      });
    });
  }

  /* -----------------------------------------------------------
     6. Cart
     ----------------------------------------------------------- */
  var cart = {}; // { id: qty }

  function loadCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      cart = raw ? JSON.parse(raw) : {};
    } catch (e) { cart = {}; }
  }
  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
  }
  function cartTotalQty() {
    var total = 0;
    Object.keys(cart).forEach(function (id) { total += cart[id]; });
    return total;
  }
  function cartCount() {
    return Object.keys(cart).length;
  }

  function renderCartBadge() {
    var badge = $("[data-cart-count]");
    if (!badge) return;
    var n = cartTotalQty();
    badge.textContent = n;
    badge.classList.toggle("is-visible", n > 0);
  }

  function renderCart() {
    renderCartBadge();
    var body = $("[data-cart-items]");
    var empty = $("[data-cart-empty]");
    var foot = $("[data-cart-foot]");
    if (!body || !empty || !foot) return;

    var ids = Object.keys(cart).filter(function (id) { return cart[id] > 0 && PRODUCTS[id]; });

    if (!ids.length) {
      body.innerHTML = "";
      empty.style.display = "";
      foot.hidden = true;
      return;
    }
    empty.style.display = "none";
    foot.hidden = false;

    body.innerHTML = ids.map(function (id) {
      var p = PRODUCTS[id];
      var qty = cart[id];
      var cardIcon = document.querySelector('[data-product-card][data-id="' + id + '"] .product-icon');
      var iconHTML = cardIcon ? cardIcon.innerHTML : "";
      return (
        '<div class="cart-item" data-cart-item="' + id + '">' +
          '<div class="product-icon">' + iconHTML + "</div>" +
          '<div class="cart-item-info">' +
            "<h4>" + escHTML(p.name[currentLang] || p.name.es) + "</h4>" +
            '<span class="size-badge">' + escHTML(p.size) + "</span>" +
            '<div class="cart-item-foot">' +
              '<div class="qty-stepper" data-qty-stepper>' +
                '<button type="button" data-cart-qty-minus aria-label="Restar">−</button>' +
                '<input type="number" min="1" max="999" value="' + qty + '" data-cart-qty-input aria-label="Cantidad" />' +
                '<button type="button" data-cart-qty-plus aria-label="Sumar">+</button>' +
              "</div>" +
              '<button type="button" class="cart-remove" data-cart-remove>' +
                '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
                "<span>" + t("cart.remove") + "</span>" +
              "</button>" +
            "</div>" +
          "</div>" +
        "</div>"
      );
    }).join("");

    $$("[data-cart-item]", body).forEach(function (row) {
      var id = row.getAttribute("data-cart-item");
      var input = $("[data-cart-qty-input]", row);
      $("[data-cart-qty-minus]", row).addEventListener("click", function () { setCartQty(id, Math.max(1, cart[id] - 1)); });
      $("[data-cart-qty-plus]", row).addEventListener("click", function () { setCartQty(id, Math.min(999, cart[id] + 1)); });
      input.addEventListener("change", function () {
        var v = Math.max(1, Math.min(999, parseInt(input.value, 10) || 1));
        setCartQty(id, v);
      });
      $("[data-cart-remove]", row).addEventListener("click", function () { removeFromCart(id); });
    });

    var totalEl = $("[data-cart-total-qty]");
    if (totalEl) totalEl.textContent = cartTotalQty();
    updateWhatsAppLinks();
  }

  function addToCart(id, qty) {
    if (!PRODUCTS[id]) return;
    cart[id] = (cart[id] || 0) + qty;
    if (cart[id] > 999) cart[id] = 999;
    saveCart();
    renderCart();
    openCart();
  }
  function setCartQty(id, qty) {
    cart[id] = qty;
    saveCart();
    renderCart();
  }
  function removeFromCart(id) {
    delete cart[id];
    saveCart();
    renderCart();
  }
  function clearCart() {
    cart = {};
    saveCart();
    renderCart();
  }

  function openCart() {
    var drawer = $("[data-cart-drawer]");
    var backdrop = $("[data-cart-backdrop]");
    if (!drawer || !backdrop) return;
    drawer.classList.add("is-open");
    backdrop.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    var drawer = $("[data-cart-drawer]");
    var backdrop = $("[data-cart-backdrop]");
    if (!drawer || !backdrop) return;
    drawer.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function initCartUI() {
    $$("[data-cart-open]").forEach(function (btn) { btn.addEventListener("click", openCart); });
    var closeBtn = $("[data-cart-close]");
    if (closeBtn) closeBtn.addEventListener("click", closeCart);
    var backdrop = $("[data-cart-backdrop]");
    if (backdrop) backdrop.addEventListener("click", closeCart);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeCart(); });
    var clearBtn = $("[data-cart-clear]");
    if (clearBtn) clearBtn.addEventListener("click", clearCart);
  }

  function initProductCards() {
    $$("[data-product-card]").forEach(function (card) {
      var id = card.getAttribute("data-id");
      var input = $("[data-qty-input]", card);
      $("[data-qty-minus]", card).addEventListener("click", function () {
        input.value = Math.max(1, (parseInt(input.value, 10) || 1) - 1);
      });
      $("[data-qty-plus]", card).addEventListener("click", function () {
        input.value = Math.min(999, (parseInt(input.value, 10) || 1) + 1);
      });
      input.addEventListener("change", function () {
        input.value = Math.max(1, Math.min(999, parseInt(input.value, 10) || 1));
      });
      var addBtn = $("[data-add-to-cart]", card);
      addBtn.addEventListener("click", function () {
        var qty = Math.max(1, parseInt(input.value, 10) || 1);
        addToCart(id, qty);
        input.value = 1;
        var label = $("span", addBtn);
        var original = label.textContent;
        label.textContent = t("ui.added");
        addBtn.setAttribute("disabled", "disabled");
        setTimeout(function () {
          label.textContent = t("ui.add_to_cart");
          addBtn.removeAttribute("disabled");
        }, 1100);
      });
    });
  }

  /* -----------------------------------------------------------
     7. WhatsApp / email order messages
     ----------------------------------------------------------- */
  /* -----------------------------------------------------------
     6b. Size demo (animated roll / label diagram)
     ----------------------------------------------------------- */
  var currentDemoId = null;

  function buildRollDiagram(width, dia) {
    var rectLeft = 70, rectRight = 230;
    var circleCx = 70, circleCy = 95, circleR = 55;
    var wLen = rectRight - rectLeft;
    var dLen = 125 - 15;
    return (
      '<svg viewBox="0 0 260 210" fill="none" aria-hidden="true">' +
        '<rect class="demo-in" style="animation-delay:.05s" x="' + rectLeft + '" y="40" width="' + (rectRight - rectLeft) + '" height="110" rx="6" fill="#fff" stroke="#0f2a3f" stroke-width="4"/>' +
        '<line class="demo-in" style="animation-delay:.15s" x1="82" y1="46" x2="82" y2="144" stroke="#c7d2da" stroke-width="2"/>' +
        '<line class="demo-in" style="animation-delay:.2s" x1="92" y1="46" x2="92" y2="144" stroke="#c7d2da" stroke-width="2"/>' +
        '<circle class="demo-in" style="animation-delay:0s" cx="' + circleCx + '" cy="' + circleCy + '" r="' + circleR + '" fill="#fff" stroke="#0f2a3f" stroke-width="4"/>' +
        '<circle class="demo-in" style="animation-delay:.1s" cx="' + circleCx + '" cy="' + circleCy + '" r="22" fill="none" stroke="#0f2a3f" stroke-width="4"/>' +
        '<circle class="demo-in" style="animation-delay:.2s" cx="' + circleCx + '" cy="' + circleCy + '" r="6" fill="#0f2a3f"/>' +
        '<line class="demo-draw" style="animation-delay:.6s;stroke-dasharray:' + wLen + ';stroke-dashoffset:' + wLen + '" x1="' + rectLeft + '" y1="22" x2="' + rectRight + '" y2="22" stroke="#f2a93b" stroke-width="3" stroke-linecap="round"/>' +
        '<line class="demo-in" style="animation-delay:.6s" x1="' + rectLeft + '" y1="16" x2="' + rectLeft + '" y2="28" stroke="#f2a93b" stroke-width="3" stroke-linecap="round"/>' +
        '<line class="demo-in" style="animation-delay:1.05s" x1="' + rectRight + '" y1="16" x2="' + rectRight + '" y2="28" stroke="#f2a93b" stroke-width="3" stroke-linecap="round"/>' +
        '<text class="demo-in" style="animation-delay:1.1s" x="' + ((rectLeft + rectRight) / 2) + '" y="12" text-anchor="middle" font-family="Sora, sans-serif" font-weight="800" font-size="15" fill="#0f2a3f">' + width + ' mm</text>' +
        '<line class="demo-draw" style="animation-delay:1.2s;stroke-dasharray:' + dLen + ';stroke-dashoffset:' + dLen + '" x1="15" y1="172" x2="125" y2="172" stroke="#f2a93b" stroke-width="3" stroke-linecap="round"/>' +
        '<line class="demo-in" style="animation-delay:1.2s" x1="15" y1="166" x2="15" y2="178" stroke="#f2a93b" stroke-width="3" stroke-linecap="round"/>' +
        '<line class="demo-in" style="animation-delay:1.65s" x1="125" y1="166" x2="125" y2="178" stroke="#f2a93b" stroke-width="3" stroke-linecap="round"/>' +
        '<text class="demo-in" style="animation-delay:1.7s" x="70" y="196" text-anchor="middle" font-family="Sora, sans-serif" font-weight="800" font-size="15" fill="#0f2a3f">&#8960; ' + dia + ' mm</text>' +
      '</svg>'
    );
  }

  function buildLabelDiagram(width, height) {
    var rx1 = 40, ry1 = 40, rw = 140, rh = 100;
    var rx2 = rx1 + rw, ry2 = ry1 + rh;
    var wLen = rw, hLen = rh;
    return (
      '<svg viewBox="0 0 270 210" fill="none" aria-hidden="true">' +
        '<rect class="demo-in" style="animation-delay:0s" x="' + rx1 + '" y="' + ry1 + '" width="' + rw + '" height="' + rh + '" rx="10" fill="#fff" stroke="#0f2a3f" stroke-width="4"/>' +
        '<rect class="demo-in" style="animation-delay:.15s" x="' + (rx1 + 16) + '" y="' + (ry1 + 16) + '" width="4" height="28" fill="#0f2a3f"/>' +
        '<rect class="demo-in" style="animation-delay:.18s" x="' + (rx1 + 24) + '" y="' + (ry1 + 16) + '" width="7" height="28" fill="#0f2a3f"/>' +
        '<rect class="demo-in" style="animation-delay:.21s" x="' + (rx1 + 35) + '" y="' + (ry1 + 16) + '" width="4" height="28" fill="#0f2a3f"/>' +
        '<rect class="demo-in" style="animation-delay:.24s" x="' + (rx1 + 43) + '" y="' + (ry1 + 16) + '" width="9" height="28" fill="#0f2a3f"/>' +
        '<rect class="demo-in" style="animation-delay:.27s" x="' + (rx1 + 56) + '" y="' + (ry1 + 16) + '" width="4" height="28" fill="#0f2a3f"/>' +
        '<line class="demo-in" style="animation-delay:.35s" x1="' + (rx1 + 16) + '" y1="' + (ry1 + 58) + '" x2="' + (rx2 - 16) + '" y2="' + (ry1 + 58) + '" stroke="#8a99a6" stroke-width="4" stroke-linecap="round"/>' +
        '<line class="demo-in" style="animation-delay:.4s" x1="' + (rx1 + 16) + '" y1="' + (ry1 + 72) + '" x2="' + (rx2 - 40) + '" y2="' + (ry1 + 72) + '" stroke="#8a99a6" stroke-width="4" stroke-linecap="round"/>' +
        '<line class="demo-draw" style="animation-delay:.6s;stroke-dasharray:' + wLen + ';stroke-dashoffset:' + wLen + '" x1="' + rx1 + '" y1="22" x2="' + rx2 + '" y2="22" stroke="#f2a93b" stroke-width="3" stroke-linecap="round"/>' +
        '<line class="demo-in" style="animation-delay:.6s" x1="' + rx1 + '" y1="16" x2="' + rx1 + '" y2="28" stroke="#f2a93b" stroke-width="3" stroke-linecap="round"/>' +
        '<line class="demo-in" style="animation-delay:1.05s" x1="' + rx2 + '" y1="16" x2="' + rx2 + '" y2="28" stroke="#f2a93b" stroke-width="3" stroke-linecap="round"/>' +
        '<text class="demo-in" style="animation-delay:1.1s" x="' + ((rx1 + rx2) / 2) + '" y="12" text-anchor="middle" font-family="Sora, sans-serif" font-weight="800" font-size="15" fill="#0f2a3f">' + width + ' mm</text>' +
        '<line class="demo-draw" style="animation-delay:1.2s;stroke-dasharray:' + hLen + ';stroke-dashoffset:' + hLen + '" x1="200" y1="' + ry1 + '" x2="200" y2="' + ry2 + '" stroke="#f2a93b" stroke-width="3" stroke-linecap="round"/>' +
        '<line class="demo-in" style="animation-delay:1.2s" x1="194" y1="' + ry1 + '" x2="206" y2="' + ry1 + '" stroke="#f2a93b" stroke-width="3" stroke-linecap="round"/>' +
        '<line class="demo-in" style="animation-delay:1.65s" x1="194" y1="' + ry2 + '" x2="206" y2="' + ry2 + '" stroke="#f2a93b" stroke-width="3" stroke-linecap="round"/>' +
        '<text class="demo-in" style="animation-delay:1.7s" x="214" y="' + ((ry1 + ry2) / 2 + 5) + '" text-anchor="start" font-family="Sora, sans-serif" font-weight="800" font-size="15" fill="#0f2a3f">' + height + ' mm</text>' +
      '</svg>'
    );
  }

  function renderSizeDemo(id) {
    var demo = SIZE_DEMOS[id];
    var product = PRODUCTS[id];
    if (!demo || !product) return;
    var stage = $("[data-size-demo-stage]");
    var title = $("[data-size-demo-title]");
    var eyebrow = $("[data-size-demo-eyebrow]");
    var hint = $("[data-size-demo-hint]");
    if (!stage || !title || !eyebrow || !hint) return;
    title.textContent = product.name[currentLang] || product.name.es;
    eyebrow.textContent = product.size;
    stage.innerHTML = demo.kind === "label"
      ? buildLabelDiagram(demo.width, demo.height)
      : buildRollDiagram(demo.width, demo.diameter);
    hint.textContent = t(demo.kind === "label" ? "sizeDemo.hint_label" : "sizeDemo.hint_roll");
  }

  function openSizeDemo(id) {
    if (!SIZE_DEMOS[id]) return;
    currentDemoId = id;
    renderSizeDemo(id);
    var modal = $("[data-size-demo-modal]");
    var backdrop = $("[data-demo-backdrop]");
    if (!modal || !backdrop) return;
    modal.classList.add("is-open");
    backdrop.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeSizeDemo() {
    var modal = $("[data-size-demo-modal]");
    var backdrop = $("[data-demo-backdrop]");
    if (!modal || !backdrop) return;
    modal.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function initSizeDemo() {
    $$("[data-size-demo-open]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var card = btn.closest("[data-product-card]");
        var id = card ? card.getAttribute("data-id") : null;
        if (id) openSizeDemo(id);
      });
    });
    var closeBtn = $("[data-demo-close]");
    if (closeBtn) closeBtn.addEventListener("click", closeSizeDemo);
    var backdrop = $("[data-demo-backdrop]");
    if (backdrop) backdrop.addEventListener("click", closeSizeDemo);
    var replayBtn = $("[data-demo-replay]");
    if (replayBtn) replayBtn.addEventListener("click", function () {
      if (currentDemoId) renderSizeDemo(currentDemoId);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeSizeDemo();
    });
  }

  function buildOrderLines() {
    return Object.keys(cart).filter(function (id) { return cart[id] > 0 && PRODUCTS[id]; }).map(function (id) {
      var p = PRODUCTS[id];
      var qty = cart[id];
      var name = p.name[currentLang] || p.name.es;
      return "• " + name + " (" + p.size + ") x" + qty + " " + t("cart.units");
    });
  }

  function whatsappHref(text) {
    var num = (brand.whatsapp || "").replace(/[^0-9]/g, "");
    return "https://wa.me/" + num + "?text=" + encodeURIComponent(text);
  }

  function genericWhatsappText() {
    return currentLang === "en"
      ? "Hello Kronos Paper, I'd like to get information about your thermal rolls and labels."
      : "Hola Kronos Paper, quisiera información sobre sus rollos térmicos y etiquetas.";
  }

  function customSizeWhatsappText() {
    return currentLang === "en"
      ? "Hello Kronos Paper, I need a special roll/label size for my equipment. Could you help me with a custom conversion?"
      : "Hola Kronos Paper, necesito una medida especial de rollo/etiqueta para mi equipo. ¿Podrían ayudarme con una conversión a la medida?";
  }

  function cartWhatsappText() {
    var lines = buildOrderLines();
    var greeting = currentLang === "en" ? "Hello Kronos Paper, I'd like to request a quote for:" : "Hola Kronos Paper, quisiera cotizar el siguiente pedido:";
    var closing = currentLang === "en" ? "Could you confirm price and availability? Thank you!" : "¿Podrían confirmarme precio y disponibilidad? ¡Gracias!";
    return greeting + "\n\n" + lines.join("\n") + "\n\n" + closing;
  }

  function cartEmailHref() {
    var lines = buildOrderLines();
    var subject = currentLang === "en" ? "Order request — Kronos Paper" : "Solicitud de pedido — Kronos Paper";
    var greeting = currentLang === "en" ? "Hello Kronos Paper, I'd like to request a quote for:" : "Hola Kronos Paper, quisiera cotizar el siguiente pedido:";
    var closing = currentLang === "en" ? "Could you confirm price and availability? Thank you!" : "¿Podrían confirmarme precio y disponibilidad? ¡Gracias!";
    var body = greeting + "\n\n" + lines.join("\n") + "\n\n" + closing;
    return "mailto:" + (brand.email || "kronospaper@gmail.com") + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  function updateWhatsAppLinks() {
    $$("[data-whatsapp-generic]").forEach(function (a) { a.setAttribute("href", whatsappHref(genericWhatsappText())); });
    $$("[data-whatsapp-custom]").forEach(function (a) { a.setAttribute("href", whatsappHref(customSizeWhatsappText())); });
    var sendWa = $("[data-cart-send-whatsapp]");
    if (sendWa) {
      var hasItems = cartCount() > 0;
      sendWa.setAttribute("href", hasItems ? whatsappHref(cartWhatsappText()) : whatsappHref(genericWhatsappText()));
    }
    var sendEmail = $("[data-cart-send-email]");
    if (sendEmail) {
      var hasItems2 = cartCount() > 0;
      sendEmail.setAttribute("href", hasItems2 ? cartEmailHref() : ("mailto:" + (brand.email || "kronospaper@gmail.com")));
    }
  }

  /* -----------------------------------------------------------
     8. Footer year
     ----------------------------------------------------------- */
  function initYear() {
    var el = $("[data-year]");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* -----------------------------------------------------------
     Boot
     ----------------------------------------------------------- */
  function boot() {
    loadCart();
    safe(initHeader, "initHeader");
    safe(initMobileNav, "initMobileNav");
    safe(initProductCards, "initProductCards");
    safe(initCartUI, "initCartUI");
    safe(initSizeDemo, "initSizeDemo");
    safe(initLanguage, "initLanguage"); // also triggers first renderCart + link update
    safe(initReveals, "initReveals");
    safe(initTilt, "initTilt");
    safe(initMagnetic, "initMagnetic");
    safe(initYear, "initYear");
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
