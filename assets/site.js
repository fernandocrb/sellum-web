/* Sellum — JS mínimo (vanilla). Sin dependencias. */
(function () {
  "use strict";

  /* --- Menú móvil --- */
  var toggle = document.querySelector(".nav__toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* --- Año dinámico en footer --- */
  var y = document.querySelectorAll("[data-year]");
  y.forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* --- Marcar sticky en móvil --- */
  if (document.querySelector(".sticky-cta")) {
    document.body.classList.add("has-sticky");
  }

  /* --- Validación y envío del formulario de demo --- */
  var form = document.getElementById("demo-form");
  if (!form) return;

  var fields = form.querySelectorAll("[data-required]");

  function validateField(field) {
    var wrap = field.closest(".field");
    var val = (field.value || "").trim();
    var ok = val.length > 0;
    if (ok && field.type === "email") {
      ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    }
    if (ok && field.dataset.min) {
      ok = val.length >= parseInt(field.dataset.min, 10);
    }
    if (wrap) wrap.classList.toggle("invalid", !ok);
    return ok;
  }

  fields.forEach(function (f) {
    f.addEventListener("blur", function () { validateField(f); });
    f.addEventListener("input", function () {
      var wrap = f.closest(".field");
      if (wrap && wrap.classList.contains("invalid")) validateField(f);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var allOk = true;
    fields.forEach(function (f) {
      if (!validateField(f)) allOk = false;
    });
    if (!allOk) {
      var firstBad = form.querySelector(".field.invalid input, .field.invalid textarea, .field.invalid select");
      if (firstBad) firstBad.focus();
      return;
    }

    var action = form.getAttribute("action") || "";
    var isPlaceholder = action.indexOf("COMPLETAR") !== -1 || action === "" || action === "#";
    if (isPlaceholder) {
      form.classList.add("sent");
      var ok = form.querySelector(".form-success");
      if (ok) ok.setAttribute("tabindex", "-1"), ok.focus();
      window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 100, behavior: "smooth" });
      return;
    }

    // Mautic no manda cabeceras CORS, así que no podemos leer su respuesta
    // desde JS (fetch con mode "cors" fallaría). Con "no-cors" el envío sí
    // llega a Mautic igual, solo no vemos la respuesta — así que llevamos
    // nosotros mismos al visitante a la página de gracias.
    var submitBtn = form.querySelector("button[type=submit]");
    if (submitBtn) submitBtn.disabled = true;
    fetch(action, { method: "POST", mode: "no-cors", body: new FormData(form) })
      .catch(function () {})
      .then(function () {
        window.location.href = "gracias.html";
      });
  });
})();
