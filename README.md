# Sitio web de Sellum — sellum.net

Sitio web institucional y landing page de conversión para **Sellum**, la plataforma
panameña de diplomas digitales verificables.

Está hecho con **HTML estático + CSS propio + JavaScript mínimo**. No necesita
instalar nada, no tiene "build", no depende de ninguna librería externa ni de
internet para verse: son archivos que cualquier servidor web puede publicar tal
cual. Eso lo hace muy fácil de desplegar y muy rápido de cargar.

---

## 1. Qué hay dentro

```
web/
  index.html            → Inicio (Home)
  producto.html         → Cómo funciona / el producto en detalle
  universidades.html    → Landing para universidades (antifraude/verificación)
  colegios.html         → Landing para colegios (modernidad/orgullo)
  seguridad.html        → Seguridad y estándares
  verificar.html        → Cómo cualquiera verifica un diploma por QR
  contacto.html         → Agendar demo (formulario)
  landing-demo.html     → Landing de conversión de una sola página
  assets/
    site.css            → Estilos (colores y tipografías de marca)
    site.js             → Menú móvil, validación del formulario, etc.
    sellum-logo-color.png
    sellum-logo-reverse.png
    sellum-logo-mono.png  → Versión monocromo navy para documentos
    sellum-badge-verificado.png
    favicon.svg         → Ícono de la pestaña del navegador
    og-image.png        → Imagen que se ve al compartir en redes/WhatsApp (1200×630)
  sitemap.xml           → Mapa del sitio para Google
  robots.txt            → Instrucciones para buscadores
  README.md             → Este archivo
```

---

## 2. Ver el sitio en su computadora (previsualizar)

**La forma más simple:** abra la carpeta `web/` y haga doble clic en `index.html`.
Se abre en su navegador. Con eso ve casi todo.

> Nota: el **formulario** y el **menú de celular** funcionan mejor con un servidor
> local. Si quiere verlo exactamente como en internet, use una de estas opciones:

- **Con la extensión "Live Server" de VS Code:** clic derecho en `index.html` →
  "Open with Live Server".
- **Con Python** (si lo tiene instalado), desde la carpeta `web/`:
  ```
  python -m http.server 8080
  ```
  Luego abra `http://localhost:8080` en su navegador.

---

## 3. Publicarlo en internet (elija UNA opción)

Las tres son gratuitas para un sitio como este. La **A (Netlify)** es la más fácil
y la que recomendamos, porque además maneja el formulario sin programar nada.

### Opción A — Netlify (recomendada, arrastrar y soltar)
1. Entre a **https://app.netlify.com** y cree una cuenta gratis.
2. En el panel, busque **"Add new site" → "Deploy manually"**.
3. **Arrastre la carpeta `web/` completa** a la zona que dice "Drag and drop".
4. En segundos tendrá una dirección tipo `https://algo-al-azar.netlify.app`.
5. Para usar **sellum.net**: en Netlify vaya a *Domain settings → Add custom domain*,
   escriba `sellum.net` y siga las instrucciones (le dirá qué cambiar donde compró
   el dominio). Netlify le da el certificado HTTPS automáticamente.

### Opción B — Vercel
1. Entre a **https://vercel.com** y cree una cuenta.
2. Puede subir la carpeta con su herramienta o conectar un repositorio de GitHub.
3. Como no hay "build", en la configuración deje el framework en **"Other"** y la
   carpeta de salida apuntando a `web/`.
4. Añada el dominio `sellum.net` en *Settings → Domains*.

### Opción C — GitHub Pages
1. Cree un repositorio en GitHub y suba el **contenido** de la carpeta `web/`
   (que `index.html` quede en la raíz del repositorio).
2. En *Settings → Pages*, elija la rama `main` y carpeta `/root`.
3. GitHub le dará una dirección pública. Para `sellum.net`, configure el dominio
   personalizado en esa misma pantalla.

---

## 4. Formulario de "Agendar demo" — ✅ conectado a Mautic

El formulario de `contacto.html` y `landing-demo.html` está conectado a un
**Mautic auto-hospedado** en el mismo servidor de EducaPanamá, en
`https://mkt.educapanama.net` (formulario "sellum", ID 1). Cada envío:

1. Va directo a Mautic (`action="https://mkt.educapanama.net/form/submit?formId=1"`,
   con los campos nombrados `mauticform[...]` tal como Mautic los espera).
2. Mautic crea/actualiza el contacto (Correo, Nombre, Institución, Cargo, Teléfono,
   Tipo de institución, Mensaje).
3. Mautic redirige al visitante a **`gracias.html`** (configurado en el formulario,
   pestaña *Details → Redirect URL/Message*).

Para ver los envíos: entre a `https://mkt.educapanama.net` → **Contacts**, o al
formulario → **Results**.

**Antes de publicar el sitio en `sellum.net` de verdad**, entre a Mautic → Components
→ Forms → "sellum" → pestaña **Details** → cambie el **Redirect URL/Message** de
`http://localhost:8091/gracias.html` a `https://sellum.net/gracias.html` (o el
dominio final que use).

Si en algún momento quiere agregar automatizaciones (correo de confirmación
automático, agregar el contacto a una campaña de seguimiento, etc.), eso se
configura dentro de Mautic → el formulario → pestaña **Actions**, sin tocar el
sitio web.

---

## 5. Campos por completar  `[COMPLETAR]`

| Marcador | Estado | Dónde aparece | Qué poner |
|---|---|---|---|
| `[COMPLETAR-WHATSAPP]` | ✅ Completado con `+507 6330-4392` (`wa.me/50763304392`) en todas las páginas. | — | — |
| `[COMPLETAR-ENDPOINT]` | ✅ Completado — conectado a Mautic (ver punto 4). | — | — |
| `[COMPLETAR-CALENDLY]` | ✅ Completado con `https://calendly.com/fernandocarlosrb/30min` en `contacto.html`. | — | — |

**Sugerencia de correo:** en el sitio usamos `hola@sellum.net`. Si prefiere otro
(por ejemplo `fer@sellum.net`), reemplácelo en todos los archivos. Confirme que esa
casilla exista y la revise alguien.

> Truco para reemplazar en todos los archivos a la vez: use "Buscar y reemplazar en
> todos los archivos" de su editor (en VS Code es `Ctrl+Shift+H`).

---

## 6. Después de publicar (recomendado)

- **Google Search Console** (https://search.google.com/search-console): agregue
  `sellum.net`, verifique la propiedad y envíe el `sitemap.xml`. Así Google lo
  encuentra más rápido.
- **Imagen para compartir:** el sitio trae `assets/og-image.png` (1200×630, el
  formato que WhatsApp y Facebook leen sin problema). Ya está referenciada en las
  metaetiquetas de todas las páginas; no hay que hacer nada.

---

## 7. Notas de marca y contenido

- Colores, tipografías (serif para titulares, sans para el cuerpo) y el sello
  "Verificado por Sellum" siguen el manual `marca/sellum-marca.html`.
- Todo el texto está en **español de Panamá**, con trato de **usted** en lo dirigido
  a instituciones.
- **No** se usan métricas de adopción inventadas. El único cliente mencionado es la
  **UNADP** (piloto). El ángulo del caso MEDUCA se presenta con datos y fuentes, sin
  oportunismo.

Cualquier ajuste de texto se hace directamente en los archivos `.html`
correspondientes; el diseño se controla desde `assets/site.css`.
