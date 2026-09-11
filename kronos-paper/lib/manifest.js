(function () {
  "use strict";

  window.__BRAND__ = {
    name: "Kronos Paper",
    legal: "Kronos Paper S.A.",
    tagline: "Papel técnico de precisión para el ecosistema de punto de venta",
    year: new Date().getFullYear(),

    nav: [
      { label: "Aplicaciones", href: "#aplicaciones" },
      { label: "Catálogo", href: "#catalogo" },
      { label: "Especificaciones", href: "#especificaciones" },
      { label: "Calidad", href: "#calidad" },
      { label: "Contacto", href: "#contacto" },
    ],

    stats: [
      { value: 340, suffix: "", label: "toneladas de papel al mes" },
      { value: 1200, suffix: "+", label: "comercios abastecidos" },
      { value: 8, suffix: "", label: "líneas de rollo en catálogo" },
      { value: 24, suffix: "h", label: "despacho desde bodega" },
    ],

    applications: [
      {
        id: "pos",
        kicker: "01 · Punto de venta",
        name: "Impresoras fiscales y TPV",
        summary:
          "El rollo que soporta el ritmo de una caja: corte limpio, imagen térmica estable y compatibilidad certificada con los motores de impresión más usados en retail.",
        specs: [
          { k: "Ancho", v: "57 / 80 mm" },
          { k: "Núcleo", v: "12 · 25.4 mm" },
          { k: "Diámetro externo", v: "40 – 80 mm" },
          { k: "Gramaje", v: "48 – 55 g/m²" },
          { k: "Compatibilidad", v: "Epson TM-T88, Bixolon, Star, Hasar" },
        ],
      },
      {
        id: "datafono",
        kicker: "02 · Pago con tarjeta",
        name: "Datáfonos y terminales de pago",
        summary:
          "Núcleo reducido y diámetro compacto para terminales inalámbricos: menos peso en el bolsillo del vendedor, misma nitidez en el comprobante.",
        specs: [
          { k: "Ancho", v: "57 mm" },
          { k: "Núcleo", v: "8 mm" },
          { k: "Diámetro externo", v: "25 – 40 mm" },
          { k: "Gramaje", v: "44 g/m²" },
          { k: "Compatibilidad", v: "Ingenico Move, PAX A920, Verifone e355" },
        ],
      },
      {
        id: "oficina",
        kicker: "03 · Equipos de oficina",
        name: "Fax, calculadoras y básculas",
        summary:
          "Tres máquinas, tres formatos de rollo distintos: papel térmico ancho para fax, bond bicapa para sumadoras y ticket calibrado para el peso exacto en báscula.",
        specs: [
          { k: "Fax", v: "216 mm · núcleo 12 mm" },
          { k: "Calculadora", v: "57 mm bond · núcleo 11.5 mm" },
          { k: "Báscula", v: "58 mm térmico · núcleo 12 mm" },
          { k: "Gramaje", v: "50 – 60 g/m²" },
          { k: "Compatibilidad", v: "Panasonic, Casio, Toledo, CAS, Dibal" },
        ],
      },
    ],

    products: [
      { id: "kp-8080f", line: "Térmico Fiscal 80×80", app: "pos", width: "80 mm", diam: "80 mm", core: "12 / 25.4 mm", gsm: "55 g/m²", length: "≈ 60 m", use: "Impresoras fiscales, cajas registradoras, supermercados" },
      { id: "kp-5760t", line: "Térmico TPV 57×60", app: "pos", width: "57 mm", diam: "60 mm", core: "12 mm", gsm: "48 g/m²", length: "≈ 45 m", use: "TPV de restauración, farmacias, retail" },
      { id: "kp-5740f", line: "Térmico Fiscal 57×40", app: "pos", width: "57 mm", diam: "40 mm", core: "12 mm", gsm: "48 g/m²", length: "≈ 25 m", use: "Impresoras fiscales compactas, kioscos" },
      { id: "kp-5740d", line: "Datáfono 57×40 núcleo 8", app: "datafono", width: "57 mm", diam: "40 mm", core: "8 mm", gsm: "44 g/m²", length: "≈ 18 m", use: "Terminales de pago inalámbricos" },
      { id: "kp-5725d", line: "Datáfono 57×25 mini", app: "datafono", width: "57 mm", diam: "25 mm", core: "8 mm", gsm: "44 g/m²", length: "≈ 8 m", use: "Terminales portátiles de bajo volumen" },
      { id: "kp-216fax", line: "Fax térmico 216×30", app: "oficina", width: "216 mm", diam: "90 mm", core: "12 mm", gsm: "60 g/m²", length: "30 m", use: "Fax de oficina, equipos multifunción" },
      { id: "kp-57bond", line: "Calculadora bond 57", app: "oficina", width: "57 mm", diam: "60 mm", core: "11.5 mm", gsm: "52 g/m²", length: "≈ 20 m", use: "Sumadoras y calculadoras impresoras" },
      { id: "kp-58bas", line: "Báscula térmica 58×40", app: "oficina", width: "58 mm", diam: "40 mm", core: "12 mm", gsm: "50 g/m²", length: "≈ 22 m", use: "Básculas comerciales con impresión de peso" },
    ],

    quality: [
      { title: "Libre de BPA y BPS", body: "Recubrimiento térmico certificado sin bisfenol, seguro para manipulación diaria en comercio y alimentación." },
      { title: "Producción trazable", body: "Cada bobina madre queda registrada por lote — de la planta al rollo que llega a tu caja." },
      { title: "Papel de origen responsable", body: "Fibra proveniente de proveedores con cadena de custodia certificada y programas de reforestación." },
    ],

    testimonials: [
      { quote: "Cambiamos a Kronos hace dos años y dejamos de tener cortes de impresión a mitad de ticket. El rollo rinde lo que dice la ficha.", author: "Gerencia de operaciones", role: "Cadena de supermercados regional" },
      { quote: "El diámetro reducido para datáfono nos resolvió un problema real: los terminales inalámbricos ya no se traban al cerrar la tapa.", author: "Jefatura de sistemas de pago", role: "Procesador de pagos" },
      { quote: "Un solo proveedor para fiscal, datáfono y báscula simplificó la compra. Antes coordinábamos con tres.", author: "Compras corporativas", role: "Franquicia de comida rápida" },
    ],

    coverage: [
      { value: 24, suffix: "–48h", label: "entrega en zona metropolitana" },
      { value: 15, suffix: "", label: "años operando líneas fiscales" },
      { value: 50, suffix: "+", label: "unidades, pedido mínimo" },
    ],

    contact: {
      email: "ventas@kronospaper.com",
      phone: "+1 (555) 010-4477",
      address: "Parque Industrial Norte, Nave 12",
    },
  };
})();
