/* Consentimiento de cookies — Ley 81 de protección de datos personales (Panamá).
 *
 * Regla: ninguna herramienta de seguimiento se carga hasta que el visitante
 * acepta. Hoy eso es Google Tag Manager (que a su vez carga Google Analytics).
 * Si el visitante rechaza, o si todavía no ha decidido, el sitio funciona
 * igual pero no se le rastrea.
 *
 * La decisión se guarda en localStorage bajo "sellum-cookies" con el valor
 * "aceptadas" o "rechazadas", y se puede cambiar desde /privacidad.
 *
 * IMPORTANTE: cualquier herramienta de medición nueva (píxel de Meta, Google
 * Ads, seguimiento de Mautic) tiene que entrar por aquí, no como script suelto
 * en el HTML. Sellum le vende cumplimiento a sus clientes; sería incoherente
 * bloquear solo las cookies de Google.
 */
(function () {
  "use strict";

  var CLAVE = "sellum-cookies";
  var GTM_ID = "GTM-M3J6WDVQ";

  function decision() {
    try {
      return window.localStorage.getItem(CLAVE);
    } catch (e) {
      // Modo incógnito o almacenamiento bloqueado: tratamos como "sin decidir"
      // y no rastreamos.
      return null;
    }
  }

  function guardar(valor) {
    try {
      window.localStorage.setItem(CLAVE, valor);
    } catch (e) {
      /* si no se puede guardar, el aviso reaparecerá en la próxima visita */
    }
  }

  // --- Carga de las herramientas de medición (solo con consentimiento) ---

  var yaCargado = false;

  function cargarMedicion() {
    if (yaCargado) return;
    yaCargado = true;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var gtm = document.createElement("script");
    gtm.async = true;
    gtm.src = "https://www.googletagmanager.com/gtm.js?id=" + GTM_ID;
    document.head.appendChild(gtm);
  }

  // Si el visitante rechaza (o cambia de opinión después de haber aceptado),
  // no basta con dejar de cargar los scripts: hay que borrar las cookies que
  // ya se hubieran creado. Google usa _ga/_gid/_gat.
  function borrarCookiesDeSeguimiento() {
    var dominios = ["", location.hostname, "." + location.hostname];
    document.cookie.split(";").forEach(function (cookie) {
      var nombre = cookie.split("=")[0].trim();
      if (!/^(_ga|_gid|_gat)/.test(nombre)) return;
      dominios.forEach(function (dominio) {
        document.cookie =
          nombre + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" +
          (dominio ? "; domain=" + dominio : "");
      });
    });
  }

  // --- El aviso ---

  function cerrarAviso() {
    var aviso = document.getElementById("aviso-cookies");
    if (aviso) aviso.remove();
  }

  function mostrarAviso() {
    var aviso = document.createElement("div");
    aviso.id = "aviso-cookies";
    aviso.className = "aviso-cookies";
    aviso.setAttribute("role", "dialog");
    aviso.setAttribute("aria-label", "Aviso de cookies");
    aviso.innerHTML =
      '<p>Usamos cookies para medir cuánta gente visita el sitio y de dónde llega. ' +
      'No se activan hasta que las acepte. ' +
      '<a href="/privacidad">Más información</a></p>' +
      '<div class="aviso-cookies-botones">' +
      '<button type="button" class="btn btn--ghost" data-cookies="rechazadas">Rechazar</button>' +
      '<button type="button" class="btn btn--gold" data-cookies="aceptadas">Aceptar</button>' +
      "</div>";

    aviso.addEventListener("click", function (e) {
      var boton = e.target.closest("[data-cookies]");
      if (!boton) return;
      var valor = boton.getAttribute("data-cookies");
      guardar(valor);
      cerrarAviso();
      if (valor === "aceptadas") {
        cargarMedicion();
      } else {
        borrarCookiesDeSeguimiento();
      }
    });

    document.body.appendChild(aviso);
  }

  // --- Arranque ---

  if (decision() === "aceptadas") {
    cargarMedicion();
  } else if (decision() === null) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", mostrarAviso);
    } else {
      mostrarAviso();
    }
  }

  // Permite cambiar la decisión desde /privacidad (enlace con id "cambiar-cookies").
  document.addEventListener("DOMContentLoaded", function () {
    var enlace = document.getElementById("cambiar-cookies");
    if (!enlace) return;
    enlace.addEventListener("click", function (e) {
      e.preventDefault();
      try {
        window.localStorage.removeItem(CLAVE);
      } catch (err) {
        /* nada que hacer */
      }
      cerrarAviso();
      mostrarAviso();
    });
  });
})();
