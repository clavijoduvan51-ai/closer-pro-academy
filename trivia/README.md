# 🎮 Trivia Pro – Cultura General Online

Aplicación de trivia de cultura general en español, **multijugador online** vía WebRTC (PeerJS) y empaquetable como **PWA** para Android (Play Store) y como app de escritorio para Windows / macOS / Linux.

> Funciona en móvil y PC. Sin servidor propio (el emparejamiento usa el broker público de PeerJS).

---

## ✨ Características

- 🧠 **Modo un jugador** con categorías y dificultad.
- 👥 **Salas privadas** con código de 6 caracteres para jugar con amigos.
- 🌎 **Sala pública** (matchmaking automático cada 5 minutos).
- 📊 Estadísticas locales (partidas, aciertos, mejor puntaje, racha).
- 📱 Diseño responsive (móvil + PC).
- ⚡ PWA instalable y con soporte offline.
- 🌐 Multijugador peer-to-peer **sin backend** (WebRTC).

---

## 🚀 Probar en local

Como es una web estática, basta servirla con cualquier HTTP server:

```bash
# desde la carpeta raíz del repo
python3 -m http.server 8080
# luego abre http://localhost:8080/trivia/
```

> ⚠️ El service worker y `getUserMedia/WebRTC` requieren `https://` o `localhost`. Si la pruebas en un dominio público, asegúrate de usar HTTPS.

---

## 🕹️ Cómo se juega

1. **Inicio** → elige tu nombre.
2. **Crear sala**: obtienes un código (ej. `AB12CD`). Compártelo con tus amigos.
3. **Unirme a sala**: introduce el código que te pasaron y entra al lobby.
4. **Sala pública**: el botón "Búsqueda rápida" usa un código rotativo de 5 min: si alguien ya hospeda en ese tramo, te unes; si no, te conviertes en anfitrión.
5. El anfitrión pulsa **Iniciar partida** cuando todos están dentro.
6. Cada pregunta dura **15 segundos** y suma más puntos cuanto más rápido respondes.

---

## 📂 Estructura

```
trivia/
├── index.html              # UI principal
├── manifest.webmanifest    # Metadatos PWA
├── sw.js                   # Service worker (offline)
├── css/styles.css          # Estilos
├── icons/                  # Íconos 192/512
└── js/
    ├── app.js              # Lógica del juego
    ├── questions.js        # Banco de preguntas (es-ES)
    └── multiplayer.js      # Capa WebRTC con PeerJS
```

---

## 📦 Publicar en Google Play Store

Hay dos rutas recomendadas:

### Opción A — TWA (Trusted Web Activity) con **Bubblewrap**

Ideal porque es la vía oficial de Google para que una **PWA** se publique en Play Store.

1. Despliega la carpeta `trivia/` a un host **HTTPS** público (GitHub Pages, Netlify, Vercel, Cloudflare Pages…).
2. Instala Bubblewrap:
   ```bash
   npm install -g @bubblewrap/cli
   ```
3. Inicializa el proyecto Android:
   ```bash
   bubblewrap init --manifest=https://TU-DOMINIO/trivia/manifest.webmanifest
   ```
4. Genera el `.aab`:
   ```bash
   bubblewrap build
   ```
5. Sube `app-release-bundle.aab` a [Google Play Console](https://play.google.com/console).
6. Asocia tu dominio con la app usando [Digital Asset Links](https://developers.google.com/digital-asset-links) (Bubblewrap te genera el `assetlinks.json`; súbelo a `https://TU-DOMINIO/.well-known/assetlinks.json`).

### Opción B — **PWABuilder** (sin tocar Android Studio)

1. Despliega la PWA en HTTPS.
2. Entra a https://www.pwabuilder.com y pega tu URL.
3. Descarga el paquete **Android (AAB)**.
4. Súbelo a Play Console igual que en la opción A.

### Opción C — **Capacitor** (si más adelante quieres añadir APIs nativas)

```bash
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Trivia Pro" "com.tuempresa.triviapro" --web-dir=trivia
npx cap add android
npx cap copy
npx cap open android
```

Luego compila desde Android Studio.

---

## 🖥️ App de escritorio (PC)

Para empaquetar para Windows/macOS/Linux puedes usar **Tauri** o **Electron**:

```bash
# Tauri (más ligero)
npm create tauri-app@latest
# selecciona "vanilla" y apunta el frontend a la carpeta trivia/
```

O simplemente publica como sitio web — al ser PWA, Chrome / Edge permiten "Instalar" la app desde la barra de URL.

---

## 🔧 Personalización

- **Agregar preguntas**: edita `js/questions.js`. Cada item tiene `categoria`, `dificultad`, `pregunta`, `opciones` (4) y `correcta` (índice).
- **Tiempo por pregunta**: cambia `QUESTION_TIME_MS` en `js/app.js`.
- **Tema**: variables CSS en `:root` dentro de `css/styles.css`.

---

## ⚠️ Notas técnicas

- PeerJS usa por defecto el broker público de PeerServer. Si esperas mucho tráfico, monta el tuyo con [peerjs-server](https://github.com/peers/peerjs-server) y pásalo al constructor `new Peer(id, { host, port, secure })`.
- El emparejamiento de "Sala pública" agrupa jugadores por bloques de 5 minutos. Para emparejamiento real con cola y filtros, necesitarás un servicio propio.
- El multijugador es **estrella alrededor del anfitrión**: si el host se va, la sala se cierra.

---

## 📜 Licencia

MIT.
