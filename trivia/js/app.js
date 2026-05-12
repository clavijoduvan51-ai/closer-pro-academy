/**
 * Trivia Pro - lógica principal.
 *
 * Soporta:
 *   - Modo un jugador
 *   - Salas privadas (anfitrión + invitados con código)
 *   - Sala pública (anfitrión con código fijo, cualquiera puede unirse)
 *
 * Persistencia local: nombre del jugador, ajustes y estadísticas en localStorage.
 */

const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

const QUESTION_TIME_MS = 15000;
const REVEAL_TIME_MS = 2500;

const state = {
  screen: "screen-home",
  player: { name: "Invitado", id: cryptoRandomId() },
  settings: { sound: "on" },
  game: null, // {questions, index, scores, mode, ...}
  timers: { question: null, reveal: null, countdown: null },
};

function cryptoRandomId() {
  return Math.random().toString(36).slice(2, 10);
}

/** Identificador del jugador para el sistema de puntajes activo. */
function myId() {
  if (MP.isHost() || MP.isGuest()) return MP.me.id || state.player.id;
  return state.player.id;
}

/* ============================================================
 * Persistencia
 * ============================================================ */
function loadProfile() {
  try {
    const raw = localStorage.getItem("triviapro.profile");
    if (raw) {
      const data = JSON.parse(raw);
      if (data.name) state.player.name = data.name;
      if (data.id) state.player.id = data.id;
      if (data.settings) state.settings = { ...state.settings, ...data.settings };
    }
  } catch (e) {}
}
function saveProfile() {
  localStorage.setItem("triviapro.profile", JSON.stringify({
    name: state.player.name, id: state.player.id, settings: state.settings,
  }));
}
function loadStats() {
  try { return JSON.parse(localStorage.getItem("triviapro.stats")) || { games: 0, correct: 0, best: 0, streak: 0 }; }
  catch (e) { return { games: 0, correct: 0, best: 0, streak: 0 }; }
}
function saveStats(s) {
  localStorage.setItem("triviapro.stats", JSON.stringify(s));
}

/* ============================================================
 * Pantallas
 * ============================================================ */
function goTo(id) {
  $$(".screen").forEach(s => s.classList.remove("active"));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add("active");
    state.screen = id;
    window.scrollTo({ top: 0, behavior: "instant" });
  }
}

function toast(text, ms = 2200) {
  const el = $("#toast");
  el.textContent = text;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), ms);
}

/* ============================================================
 * Inicialización UI
 * ============================================================ */
function initCategories() {
  const cats = window.TRIVIA_CATEGORIES;
  ["solo-category", "room-category"].forEach(sel => {
    const el = document.getElementById(sel);
    el.innerHTML = cats.map(c => `<option value="${c.id}">${c.nombre}</option>`).join("");
  });
}

function renderPlayerChip() {
  $("#player-name-label").textContent = state.player.name;
  $("#player-avatar").textContent = (state.player.name[0] || "?").toUpperCase();
}

function bindNavigation() {
  $$("[data-go]").forEach(b => b.addEventListener("click", () => goTo(b.dataset.go)));
  $$("[data-back]").forEach(b => b.addEventListener("click", () => goTo("screen-home")));
  $("#btn-edit-name").addEventListener("click", askName);
}

function askName() {
  const newName = prompt("¿Cómo te llamas? (máx 18 caracteres)", state.player.name);
  if (newName && newName.trim()) {
    state.player.name = newName.trim().slice(0, 18);
    saveProfile();
    renderPlayerChip();
    toast("¡Nombre guardado!");
  }
}

/* ============================================================
 * Modo un jugador
 * ============================================================ */
function bindSolo() {
  $("#btn-start-solo").addEventListener("click", () => {
    const cat = $("#solo-category").value;
    const dif = $("#solo-difficulty").value;
    const count = parseInt($("#solo-count").value, 10);
    const questions = pickQuestions({ category: cat, difficulty: dif, count });
    if (!questions.length) {
      toast("No hay preguntas con esos filtros");
      return;
    }
    startGame({ mode: "solo", questions });
  });
}

function pickQuestions({ category, difficulty, count }) {
  let pool = window.TRIVIA_QUESTIONS.slice();
  if (category && category !== "mixto") pool = pool.filter(q => q.categoria === category);
  if (difficulty && difficulty !== "mixto") pool = pool.filter(q => q.dificultad === difficulty);
  // baraja
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count).map(q => prepareQuestion(q));
}

function prepareQuestion(q) {
  // Baraja opciones manteniendo la correcta
  const indices = q.opciones.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return {
    categoria: q.categoria,
    dificultad: q.dificultad,
    pregunta: q.pregunta,
    opciones: indices.map(i => q.opciones[i]),
    correcta: indices.indexOf(q.correcta),
  };
}

/* ============================================================
 * Motor de juego
 * ============================================================ */
function startGame({ mode, questions }) {
  state.game = {
    mode, questions,
    index: 0,
    scores: {},
    answersForCurrent: {},
    started: Date.now(),
    streak: 0, maxStreak: 0,
    correctCount: 0,
  };

  if (mode === "host") {
    MP.currentRoster().forEach(p => {
      state.game.scores[p.id] = { name: p.name, score: 0 };
    });
    MP.broadcast({ type: "start", total: questions.length });
  } else {
    state.game.scores[state.player.id] = { name: state.player.name, score: 0 };
  }

  goTo("screen-game");
  showQuestion();
}

function showQuestion() {
  const g = state.game;
  const q = g.questions[g.index];
  $("#q-index").textContent = g.index + 1;
  $("#q-total").textContent = g.questions.length;
  $("#q-category").textContent = labelForCategory(q.categoria) + " · " + q.dificultad;
  $("#q-text").textContent = q.pregunta;
  $("#q-status").textContent = "";
  $("#my-score").textContent = (g.scores[myId()]?.score || 0);

  const optsEl = $("#options");
  optsEl.innerHTML = "";
  q.opciones.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = text;
    btn.addEventListener("click", () => onAnswer(i, btn));
    optsEl.appendChild(btn);
  });

  // Para host/solo: enviar pregunta a clientes
  if (g.mode === "host") {
    MP.broadcast({
      type: "question",
      index: g.index,
      question: q,
      total: g.questions.length,
      deadline: Date.now() + QUESTION_TIME_MS,
    });
    g.answersForCurrent = {};
  }

  // Temporizador
  const deadline = Date.now() + QUESTION_TIME_MS;
  clearAllTimers();
  state.timers.countdown = setInterval(() => {
    const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    $("#timer").textContent = left;
    if (left <= 5) $("#timer").classList.add("danger");
    else $("#timer").classList.remove("danger");
  }, 200);

  state.timers.question = setTimeout(() => {
    if (g.mode === "solo") {
      revealAnswer(null);
    } else if (g.mode === "host") {
      hostFinishQuestion();
    } else if (g.mode === "guest") {
      // El host decidirá; mostramos "tiempo!" hasta que llegue reveal
      lockOptions();
      $("#q-status").textContent = "¡Tiempo! Esperando a otros…";
    }
  }, QUESTION_TIME_MS);
}

function labelForCategory(id) {
  const c = window.TRIVIA_CATEGORIES.find(c => c.id === id);
  return c ? c.nombre : id;
}

function clearAllTimers() {
  ["question", "reveal", "countdown"].forEach(k => {
    if (state.timers[k]) {
      clearTimeout(state.timers[k]);
      clearInterval(state.timers[k]);
      state.timers[k] = null;
    }
  });
}

function lockOptions() {
  $$(".option").forEach(b => b.classList.add("disabled"));
}

function onAnswer(optionIndex, btnEl) {
  const g = state.game;
  if (!g) return;
  if (btnEl.classList.contains("disabled")) return;
  const elapsed = QUESTION_TIME_MS - (parseInt($("#timer").textContent, 10) * 1000);

  lockOptions();
  btnEl.classList.add("selected");

  if (g.mode === "solo") {
    revealAnswer(optionIndex);
  } else if (g.mode === "host") {
    g.answersForCurrent[myId()] = { optionIndex, time: elapsed };
    $("#q-status").textContent = "Respuesta enviada. Esperando…";
    maybeHostFinishEarly();
  } else if (g.mode === "guest") {
    g.myChoice = optionIndex;
    MP.sendToHost({ type: "answer", index: g.index, optionIndex, time: elapsed });
    $("#q-status").textContent = "Respuesta enviada. Esperando…";
  }
}

/* ---------- modo solo ---------- */
function revealAnswer(myChoice) {
  clearAllTimers();
  const g = state.game;
  const q = g.questions[g.index];
  const opts = $$(".option");
  opts.forEach((b, i) => {
    b.classList.add("disabled");
    if (i === q.correcta) b.classList.add("correct");
    else if (i === myChoice) b.classList.add("wrong");
  });
  if (myChoice === q.correcta) {
    const left = Math.max(0, parseInt($("#timer").textContent, 10));
    const points = 500 + left * 50;
    g.scores[myId()].score += points;
    g.correctCount++;
    g.streak++;
    g.maxStreak = Math.max(g.maxStreak, g.streak);
    $("#my-score").textContent = g.scores[myId()].score;
    $("#q-status").textContent = `¡Correcto! +${points}`;
  } else {
    g.streak = 0;
    $("#q-status").textContent = myChoice === null ? "¡Se acabó el tiempo!" : "Incorrecto";
  }
  state.timers.reveal = setTimeout(() => {
    nextQuestionOrFinish();
  }, REVEAL_TIME_MS);
}

function nextQuestionOrFinish() {
  const g = state.game;
  g.index++;
  if (g.index >= g.questions.length) {
    finishGame();
  } else {
    showQuestion();
  }
}

function finishGame() {
  const g = state.game;
  clearAllTimers();
  // Estadísticas locales
  const stats = loadStats();
  stats.games++;
  stats.correct += g.correctCount;
  stats.best = Math.max(stats.best, g.scores[myId()]?.score || 0);
  stats.streak = Math.max(stats.streak, g.maxStreak);
  saveStats(stats);

  if (g.mode === "host") {
    const ranking = buildRanking();
    MP.broadcast({ type: "results", ranking });
    renderResults(ranking);
  } else {
    const meKey = myId();
    const ranking = Object.entries(g.scores)
      .map(([id, p]) => ({ id, name: p.name, score: p.score }))
      .sort((a, b) => b.score - a.score)
      .map((p, i) => ({ pos: i + 1, name: p.name, score: p.score, isMe: p.id === meKey }));
    renderResults(ranking);
  }
  goTo("screen-results");
}

function renderResults(ranking) {
  const el = $("#ranking");
  el.innerHTML = "";
  ranking.forEach(r => {
    const li = document.createElement("li");
    if (r.isMe) li.classList.add("me");
    li.innerHTML = `<span class="pos">${r.pos}</span><span>${escapeHtml(r.name)}</span><span class="score">${r.score}</span>`;
    el.appendChild(li);
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ============================================================
 * Multijugador - flujos
 * ============================================================ */
function bindMultiplayer() {
  // Crear sala privada
  $("#btn-create-room").addEventListener("click", async () => {
    const opts = {
      category: $("#room-category").value,
      difficulty: $("#room-difficulty").value,
      count: parseInt($("#room-count").value, 10),
    };
    try {
      const code = await MP.hostRoom(state.player.name);
      state.roomConfig = opts;
      enterLobby({ asHost: true, code });
    } catch (err) {
      console.error(err);
      toast("No se pudo crear la sala: " + (err.message || err.type || "error"));
    }
  });

  // Unirse con código
  $("#btn-join-room").addEventListener("click", async () => {
    const code = $("#join-code").value.trim().toUpperCase();
    if (!code || code.length < 4) { toast("Código inválido"); return; }
    try {
      await MP.joinRoom(code, state.player.name);
      enterLobby({ asHost: false, code });
    } catch (err) {
      toast("No se pudo entrar: " + (err.message || "código incorrecto"));
    }
  });

  // Sala pública: intenta unirse a un código rotativo basado en la hora,
  // si no hay anfitrión, se convierte en uno.
  $("#btn-public-quick").addEventListener("click", async () => {
    $("#public-status").textContent = "Buscando sala pública…";
    const code = computePublicCode();
    try {
      await MP.joinRoom(code, state.player.name, { public: true });
      enterLobby({ asHost: false, code });
    } catch (e) {
      $("#public-status").textContent = "No había sala, creando una…";
      try {
        const fixed = await MP.hostRoom(state.player.name, { fixedCode: code, public: true });
        state.roomConfig = { category: "mixto", difficulty: "mixto", count: 10 };
        enterLobby({ asHost: true, code: fixed });
      } catch (err) {
        toast("No se pudo abrir sala pública: " + (err.message || err.type || ""));
      }
    }
  });

  // Lobby - copiar código
  $("#btn-copy-code").addEventListener("click", () => {
    const code = $("#lobby-code").textContent;
    navigator.clipboard?.writeText(code);
    toast("Código copiado");
  });

  // Lobby - iniciar (solo host)
  $("#btn-start-game").addEventListener("click", () => {
    if (!MP.isHost()) return;
    const cfg = state.roomConfig || { category: "mixto", difficulty: "mixto", count: 10 };
    const questions = pickQuestions(cfg);
    if (!questions.length) { toast("Sin preguntas para esos filtros"); return; }
    startGame({ mode: "host", questions });
  });

  // Lobby - salir
  $("#btn-leave-room").addEventListener("click", () => {
    MP.leave();
    goTo("screen-home");
  });

  // Resultados
  $("#btn-replay").addEventListener("click", () => {
    if (MP.isHost()) {
      goTo("screen-lobby");
    } else if (MP.isGuest()) {
      goTo("screen-lobby");
    } else {
      goTo("screen-solo");
    }
  });
  $("#btn-home").addEventListener("click", () => {
    if (MP.isHost() || MP.isGuest()) MP.leave();
    goTo("screen-home");
  });

  // ---------- Listeners de MP ----------
  // Como host: respuestas recibidas
  MP.on("answer-received", ({ from, index, optionIndex, time }) => {
    if (!state.game || state.game.mode !== "host") return;
    if (index !== state.game.index) return;
    state.game.answersForCurrent[from] = { optionIndex, time };
    maybeHostFinishEarly();
  });

  // Como host: cambios de roster
  MP.on("roster", players => {
    renderLobby(players);
  });
  MP.on("hosted", () => {
    renderLobby(MP.currentRoster());
  });

  // Como guest: roster recibido del host
  MP.on("roster", () => {});

  // Como guest: inicia partida
  MP.on("start", ({ total }) => {
    state.game = {
      mode: "guest",
      questions: [], // se reciben de a una
      index: 0,
      scores: {},
      total,
      streak: 0, maxStreak: 0, correctCount: 0,
    };
    goTo("screen-game");
    $("#q-total").textContent = total;
    $("#q-text").textContent = "Esperando primera pregunta…";
    $("#options").innerHTML = "";
  });

  // Como guest: nueva pregunta
  MP.on("question", ({ index, question, total, deadline }) => {
    const g = state.game;
    if (!g) return;
    g.index = index;
    g.questions[index] = question;
    g.total = total;
    renderGuestQuestion(question, index, total, deadline);
  });

  // Como guest: revelación
  MP.on("reveal", ({ index, correct, scores }) => {
    const g = state.game;
    const myChoice = g ? g.myChoice : -1;
    const opts = $$(".option");
    opts.forEach((b, i) => {
      b.classList.add("disabled");
      if (i === correct) b.classList.add("correct");
      else if (i === myChoice) b.classList.add("wrong");
    });
    if (g && myChoice === correct) {
      g.correctCount = (g.correctCount || 0) + 1;
      g.streak = (g.streak || 0) + 1;
      g.maxStreak = Math.max(g.maxStreak || 0, g.streak);
    } else if (g) {
      g.streak = 0;
    }
    if (g) g.myChoice = -1;
    const myEntry = scores && scores[myId()];
    if (myEntry) $("#my-score").textContent = myEntry.score || 0;
  });

  // Como guest: resultados finales
  MP.on("results", ({ ranking }) => {
    const withMe = ranking.map(r => ({ ...r, isMe: r.name === state.player.name }));
    renderResults(withMe);
    goTo("screen-results");
  });

  MP.on("disconnected", () => {
    toast("Te desconectaste del anfitrión");
    goTo("screen-home");
  });
}

function enterLobby({ asHost, code }) {
  $("#lobby-code").textContent = code;
  $("#lobby-role").textContent = asHost ? "Eres el anfitrión." : "Te uniste como invitado.";
  $("#host-controls").classList.toggle("hidden", !asHost);
  $("#guest-info").classList.toggle("hidden", asHost);
  goTo("screen-lobby");
}

function renderLobby(players) {
  const ul = $("#player-list");
  ul.innerHTML = "";
  players.forEach(p => {
    const li = document.createElement("li");
    const initial = (p.name[0] || "?").toUpperCase();
    li.innerHTML = `<span class="avatar">${escapeHtml(initial)}</span>
                    <strong>${escapeHtml(p.name)}</strong>
                    ${p.isHost ? '<span class="muted small">(anfitrión)</span>' : ''}`;
    ul.appendChild(li);
  });
}

function renderGuestQuestion(q, index, total, deadline) {
  $("#q-index").textContent = index + 1;
  $("#q-total").textContent = total;
  $("#q-category").textContent = labelForCategory(q.categoria) + " · " + q.dificultad;
  $("#q-text").textContent = q.pregunta;
  $("#q-status").textContent = "";

  const optsEl = $("#options");
  optsEl.innerHTML = "";
  q.opciones.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = text;
    btn.addEventListener("click", () => onAnswer(i, btn));
    optsEl.appendChild(btn);
  });

  clearAllTimers();
  state.timers.countdown = setInterval(() => {
    const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    $("#timer").textContent = left;
    $("#timer").classList.toggle("danger", left <= 5);
    if (left === 0) clearInterval(state.timers.countdown);
  }, 200);
}

/* ============================================================
 * Lógica del host para puntuar
 * ============================================================ */
function maybeHostFinishEarly() {
  const g = state.game;
  if (!g || g.mode !== "host") return;
  const total = MP.currentRoster().length;
  const received = Object.keys(g.answersForCurrent).length;
  if (received >= total) hostFinishQuestion();
}

function hostFinishQuestion() {
  const g = state.game;
  if (!g || g.mode !== "host") return;
  clearAllTimers();
  const q = g.questions[g.index];

  // Puntuar
  const meKey = myId();
  Object.entries(g.answersForCurrent).forEach(([playerId, ans]) => {
    if (ans.optionIndex === q.correcta) {
      const remaining = Math.max(0, QUESTION_TIME_MS - ans.time);
      const points = 500 + Math.round((remaining / 1000) * 50);
      if (!g.scores[playerId]) g.scores[playerId] = { name: nameOf(playerId), score: 0 };
      g.scores[playerId].score += points;
      if (playerId === meKey) {
        g.correctCount++;
        g.streak++;
        g.maxStreak = Math.max(g.maxStreak, g.streak);
      }
    } else if (playerId === meKey) {
      g.streak = 0;
    }
    MP.setScore(playerId, g.scores[playerId]?.score || 0);
  });

  // Mostrar correcta localmente
  const opts = $$(".option");
  opts.forEach((b, i) => {
    b.classList.add("disabled");
    if (i === q.correcta) b.classList.add("correct");
  });
  $("#q-status").textContent = "Resultados…";
  $("#my-score").textContent = g.scores[meKey]?.score || 0;

  // Cada invitado conoce localmente lo que respondió; basta con broadcast.
  MP.broadcast({ type: "reveal", index: g.index, correct: q.correcta, scores: g.scores });

  state.timers.reveal = setTimeout(() => {
    g.index++;
    if (g.index >= g.questions.length) finishGame();
    else showQuestion();
  }, REVEAL_TIME_MS);
}

function nameOf(playerId) {
  const p = MP.currentRoster().find(p => p.id === playerId);
  return p ? p.name : "Jugador";
}

function buildRanking() {
  const g = state.game;
  const meKey = myId();
  const arr = Object.entries(g.scores).map(([id, p]) => ({
    id, name: p.name, score: p.score,
  })).sort((a, b) => b.score - a.score)
    .map((p, i) => ({ pos: i + 1, name: p.name, score: p.score, isMe: p.id === meKey }));
  return arr;
}

/* ============================================================
 * Sala pública (matchmaking simple)
 * ============================================================ */
function computePublicCode() {
  // Bucket de 5 minutos: todos los que pulsen en el mismo tramo coinciden.
  const bucket = Math.floor(Date.now() / (5 * 60 * 1000));
  const seed = bucket.toString(36).toUpperCase().padStart(4, "0").slice(-4);
  return "PUB" + seed.padStart(4, "0").slice(0, 4);
  // Ej: PUBX9K2
}

/* ============================================================
 * Estadísticas
 * ============================================================ */
function bindStats() {
  $("#btn-reset-stats").addEventListener("click", () => {
    if (confirm("¿Borrar todas tus estadísticas?")) {
      saveStats({ games: 0, correct: 0, best: 0, streak: 0 });
      refreshStats();
      toast("Estadísticas borradas");
    }
  });
}
function refreshStats() {
  const s = loadStats();
  $("#stat-games").textContent = s.games;
  $("#stat-correct").textContent = s.correct;
  $("#stat-best").textContent = s.best;
  $("#stat-streak").textContent = s.streak;
}

/* ============================================================
 * Ajustes
 * ============================================================ */
function bindSettings() {
  $("#btn-save-settings").addEventListener("click", () => {
    const name = $("#set-name").value.trim().slice(0, 18);
    const sound = $("#set-sound").value;
    if (name) state.player.name = name;
    state.settings.sound = sound;
    saveProfile();
    renderPlayerChip();
    toast("Ajustes guardados");
    goTo("screen-home");
  });
}

function refreshSettingsForm() {
  $("#set-name").value = state.player.name === "Invitado" ? "" : state.player.name;
  $("#set-sound").value = state.settings.sound;
}

/* ============================================================
 * Boot
 * ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  initCategories();
  renderPlayerChip();
  bindNavigation();
  bindSolo();
  bindMultiplayer();
  bindStats();
  bindSettings();

  // Refrescos al entrar a pantallas concretas
  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-go]");
    if (!btn) return;
    const target = btn.dataset.go;
    if (target === "screen-stats") refreshStats();
    if (target === "screen-settings") refreshSettingsForm();
  });

  if (state.player.name === "Invitado") {
    // Sugerir al primer ingreso un nombre
    setTimeout(() => {
      if (state.player.name === "Invitado") askName();
    }, 400);
  }
});
