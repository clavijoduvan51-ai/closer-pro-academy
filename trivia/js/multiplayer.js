/**
 * Capa de multijugador basada en PeerJS (WebRTC).
 *
 * Topología: anfitrión-cliente. El anfitrión hospeda la sala y propaga el
 * estado a los invitados. Cada sala tiene un código corto que se usa como
 * sufijo del peer ID del anfitrión, de manera que cualquiera que conozca el
 * código pueda conectarse sin servidor propio.
 *
 * Mensajes (tipo: type):
 *   join              -> cliente -> host  ({name})
 *   roster            -> host -> all      ({players})
 *   start             -> host -> all      ({questions, total})
 *   question          -> host -> all      ({index, question, deadline})
 *   answer            -> cliente -> host  ({index, optionIndex, time})
 *   reveal            -> host -> all      ({index, correct, scores})
 *   results           -> host -> all      ({ranking})
 *   leave             -> cliente -> host  ()
 *   chat              -> all              ({from, text})
 */

window.MP = (function () {
  const ROOM_PREFIX = "triviapro-room-";
  const PUBLIC_PREFIX = "triviapro-public-";

  let peer = null;
  let role = null; // 'host' | 'guest'
  let roomCode = null;
  let hostConn = null; // como cliente, conexión hacia el host
  const clients = new Map(); // como host: peerId -> { conn, name, score, id }
  let listeners = {}; // event -> [callback]
  let me = { id: null, name: "Invitado", score: 0 };

  function emit(event, payload) {
    (listeners[event] || []).forEach(fn => {
      try { fn(payload); } catch (e) { console.error(e); }
    });
  }

  function on(event, cb) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(cb);
  }

  function off(event) {
    delete listeners[event];
  }

  function generateCode() {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) code += alphabet[Math.floor(Math.random() * alphabet.length)];
    return code;
  }

  function makePeerId(code, isPublic) {
    return (isPublic ? PUBLIC_PREFIX : ROOM_PREFIX) + code;
  }

  function ensurePeer(peerId) {
    return new Promise((resolve, reject) => {
      if (peer && !peer.destroyed) {
        try { peer.destroy(); } catch (e) {}
      }
      peer = new Peer(peerId, { debug: 1 });
      peer.on("open", id => {
        me.id = id;
        resolve(peer);
      });
      peer.on("error", err => {
        reject(err);
      });
    });
  }

  /** Crea una sala como anfitrión. */
  async function hostRoom(name, opts = {}) {
    me.name = name || "Anfitrión";
    role = "host";
    const isPublic = !!opts.public;
    let attempts = 0;
    let lastErr = null;
    while (attempts < 5) {
      const code = opts.fixedCode || generateCode();
      const peerId = makePeerId(code, isPublic);
      try {
        await ensurePeer(peerId);
        roomCode = code;
        clients.clear();
        clients.set(peer.id, { conn: null, name: me.name, score: 0, id: peer.id, isHost: true });
        peer.on("connection", onIncomingConnection);
        emit("hosted", { code, isPublic });
        emit("roster", currentRoster());
        return code;
      } catch (err) {
        lastErr = err;
        // Si el peer ID está ocupado, generamos otro
        if (err && err.type === "unavailable-id") {
          attempts++;
          continue;
        }
        throw err;
      }
    }
    throw lastErr || new Error("No se pudo crear la sala");
  }

  function onIncomingConnection(conn) {
    conn.on("open", () => {
      // Esperamos al mensaje "join" para registrarlo con el nombre
      clients.set(conn.peer, { conn, name: "Jugador", score: 0, id: conn.peer, isHost: false });
      conn.on("data", data => handleHostMessage(conn, data));
      conn.on("close", () => {
        clients.delete(conn.peer);
        broadcast({ type: "roster", players: currentRoster() });
        emit("roster", currentRoster());
      });
    });
  }

  function handleHostMessage(conn, msg) {
    if (!msg || !msg.type) return;
    const cli = clients.get(conn.peer);
    switch (msg.type) {
      case "join":
        if (cli) cli.name = (msg.name || "Jugador").slice(0, 18);
        broadcast({ type: "roster", players: currentRoster() });
        emit("roster", currentRoster());
        break;
      case "answer":
        emit("answer-received", { from: conn.peer, ...msg });
        break;
      case "chat":
        broadcast({ type: "chat", from: cli ? cli.name : "?", text: (msg.text || "").slice(0, 200) });
        emit("chat", { from: cli ? cli.name : "?", text: msg.text });
        break;
      case "leave":
        clients.delete(conn.peer);
        broadcast({ type: "roster", players: currentRoster() });
        emit("roster", currentRoster());
        break;
    }
  }

  function currentRoster() {
    return Array.from(clients.values()).map(c => ({
      id: c.id, name: c.name, score: c.score, isHost: !!c.isHost,
    }));
  }

  function broadcast(msg) {
    clients.forEach(c => {
      if (c.conn && c.conn.open) c.conn.send(msg);
    });
  }

  function setScore(playerId, score) {
    const c = clients.get(playerId);
    if (c) c.score = score;
  }

  /** Une como cliente a una sala existente. */
  async function joinRoom(code, name, opts = {}) {
    me.name = name || "Jugador";
    role = "guest";
    roomCode = code;
    const isPublic = !!opts.public;
    const hostPeerId = makePeerId(code, isPublic);

    // ID local aleatorio
    await ensurePeer(undefined);

    return new Promise((resolve, reject) => {
      const conn = peer.connect(hostPeerId, { reliable: true });
      let timeout = setTimeout(() => {
        try { conn.close(); } catch (e) {}
        reject(new Error("No se pudo conectar a la sala."));
      }, 8000);

      conn.on("open", () => {
        clearTimeout(timeout);
        hostConn = conn;
        conn.send({ type: "join", name: me.name });
        conn.on("data", handleGuestMessage);
        conn.on("close", () => {
          emit("disconnected");
        });
        emit("joined", { code });
        resolve();
      });

      conn.on("error", err => {
        clearTimeout(timeout);
        reject(err);
      });
    });
  }

  function handleGuestMessage(msg) {
    if (!msg || !msg.type) return;
    emit(msg.type, msg);
  }

  function sendToHost(msg) {
    if (hostConn && hostConn.open) hostConn.send(msg);
  }

  function leave() {
    try {
      if (role === "guest") sendToHost({ type: "leave" });
      if (peer && !peer.destroyed) peer.destroy();
    } catch (e) {}
    peer = null;
    hostConn = null;
    clients.clear();
    role = null;
    roomCode = null;
  }

  function isHost() { return role === "host"; }
  function isGuest() { return role === "guest"; }

  return {
    on, off,
    hostRoom, joinRoom, leave,
    broadcast, sendToHost,
    currentRoster, setScore,
    isHost, isGuest,
    get role() { return role; },
    get code() { return roomCode; },
    get me() { return me; },
    PUBLIC_PREFIX, ROOM_PREFIX,
    makePeerId,
  };
})();
