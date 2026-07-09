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
    var allOk = true;
    fields.forEach(function (f) {
      if (!validateField(f)) allOk = false;
    });

    if (!allOk) {
      e.preventDefault();
      var firstBad = form.querySelector(".field.invalid input, .field.invalid textarea, .field.invalid select");
      if (firstBad) firstBad.focus();
      return;
    }

    // Si NO hay endpoint real configurado, mostramos el éxito en la misma página.
    // Cuando conectes Netlify Forms o Formspree, quita este bloque o deja que el
    // action haga el POST real (ver README, sección "Conectar el formulario").
    var action = form.getAttribute("action") || "";
    var isPlaceholder = action.indexOf("COMPLETAR") !== -1 || action === "" || action === "#";
    if (isPlaceholder) {
      e.preventDefault();
      form.classList.add("sent");
      var ok = form.querySelector(".form-success");
      if (ok) ok.setAttribute("tabindex", "-1"), ok.focus();
      window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 100, behavior: "smooth" });
    }
    // Si hay endpoint real, dejamos que el navegador haga el POST normalmente.
  });
})();
