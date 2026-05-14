# TriviaWorld — Prototipo Interactivo

Prototipo navegable de la app de trivia de cultura general.
Diseño UX/UI completo, mockup en pantalla de teléfono y juego funcional en el navegador.

## 🚀 Cómo verlo

**Opción 1 — Abrir directo:**
Haz doble clic en `trivia-world/index.html` y se abrirá en tu navegador.

**Opción 2 — Servidor local (recomendado):**
```bash
cd trivia-world
python3 -m http.server 8080
# luego abrir http://localhost:8080
```

**Opción 3 — Despliegue web rápido (Vercel/Netlify):**
Sube la carpeta `trivia-world/` directamente. Cero configuración.

## 🎮 Qué puedes probar

- **Landing page** con hero, características, roadmap.
- **Mockup de teléfono** con 9 pantallas funcionales:
  - Inicio (reto del día, modos, actividad de amigos)
  - Jugar (todos los modos disponibles)
  - Categorías (12 categorías visuales)
  - Matchmaking (búsqueda de rival animada)
  - **Juego en vivo** (preguntas reales, timer, puntaje vs oponente, comodines)
  - Resultado (victoria/derrota con recompensas)
  - Perfil (nivel, liga, stats, logros)
  - Clasificación (ranking con podio)
  - Amigos y Salas multijugador

## 🎯 Probar el juego

1. Toca **Jugar ahora** en la tarjeta del reto del día, **o**
2. Pulsa el botón ▶ central en la barra inferior, **o**
3. Entra a "Práctica solitaria" y elige una categoría.

Verás:
- 7 preguntas reales en español
- Timer de 15 segundos con barra circular
- Marcador vs oponente IA simulado
- 4 comodines funcionales: 50:50, +10s, saltar, voto público

## 📦 Stack del prototipo

- **HTML + CSS + JavaScript** puros
- Sin dependencias, sin build, sin servidor
- Funciona offline una vez cargado

## 🔜 Próximo paso

Una vez aprobado el diseño, migrar a **Flutter** para builds nativas iOS + Android.
Estructura del proyecto productivo:

```
trivia-world/
├── mobile/         # Flutter app (Dart)
├── backend/        # NestJS + WebSockets
├── admin-panel/    # Next.js dashboard editorial
├── content/        # Banco de preguntas versionado
└── infra/          # Docker + Terraform
```
