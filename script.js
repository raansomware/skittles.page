// ============================
// CONFIGURACIÓN Y PLAYLIST
// ============================
const playlist = [
  { name: "buttercup", artist: "Jack Stauber", file: "buttercup.mp3" },
  { name: "resonance", artist: "Home", file: "resonance.mp3" }
];
let currentTrack = 0;
let isPlaying = false;

// ============================
// INIT (ARRANQUE DEL SISTEMA)
// ============================
document.addEventListener("DOMContentLoaded", () => {
  console.log("skittlesOS v6.66 online");
  loadVisitCount();
  createInitialSparkles();
  startCursorTrail();
  setupButtons();
  setupEnterScreen();
  setupSecretMode();
  setupPanicMode();
  setupMusicPlayer();
  setupGuestbook();
  setupAchievements();
  setupMootRequest();
  setupStamps();
  setupSkittlesBot();
  setupQuote();
  setupTabTitles();
  setupKonami();
  renderBadges();
});

// ============================
// SKITTLES BOT (CHAT)
// ============================
async function askSkittles(text) {
  if (!text || text.trim() === "") return;
  const npcChat = document.getElementById("npcChat");
  const loadingId = "loading-" + Date.now();
  
  try {
    const loadingLine = document.createElement("div");
    loadingLine.id = loadingId;
    loadingLine.className = "npcLine";
    loadingLine.innerHTML = `<b class="skittles-label">skittles:</b> ...`;
    npcChat.appendChild(loadingLine);
    npcChat.scrollTop = npcChat.scrollHeight;

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text.trim() })
    });

    const data = await response.json();
    document.getElementById(loadingId)?.remove();
    
    addNPCLine("skittles", data.reply || "*stares blankly* :3", true);
    triggerSparkles();

  } catch (error) {
    if (document.getElementById(loadingId)) document.getElementById(loadingId).remove();
    console.error("Chat Error:", error);
    addNPCLine("skittles", `*glitches* error: ${error.message} >_<`, true);
  }
}

function addNPCLine(sender, msg, isSkittles = false) {
  const npcChat = document.getElementById("npcChat");
  if (!npcChat) return;
  const line = document.createElement("div");
  line.className = "npcLine";
  const labelClass = isSkittles ? 'skittles-label' : 'user-label';
  line.innerHTML = `<b class="${labelClass}">${sender}:</b> ${msg}`;
  npcChat.appendChild(line);
  npcChat.scrollTop = npcChat.scrollHeight;
}

function setupSkittlesBot() {
  const input = document.getElementById("npcInput");
  const send = document.getElementById("npcSend");
  if (!input || !send) return;

  send.onclick = () => {
    const m = input.value.trim();
    if (m) {
      addNPCLine("you", m);
      askSkittles(m);
      input.value = "";
    }
  };
  input.onkeydown = (e) => { if (e.key === "Enter") send.click(); };
}

// ============================
// SISTEMAS DE INTERACCIÓN
// ============================
function setupGuestbook() {
  const btn = document.getElementById("guestSubmit");
  if (btn) {
    btn.onclick = () => {
      toast("signed!! (glitter saved) ✨");
      triggerSparkles();
    };
  }
}

function setupMootRequest() {
  const btn = document.getElementById("mootRequestBtn");
  if (btn) {
    btn.onclick = () => {
      toast("request sent 💌");
      triggerSparkles();
    };
  }
}

function rateMe(stars) {
  toast(`rated ${stars} stars! skittles likes u u_u`);
  triggerSparkles();
}

// ============================
// STICKERS (DRAG & DROP)
// ============================
function startStickerDrag(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
}

// ============================
// EFECTOS VISUALES
// ============================
function createSparkle(x = null, y = null) {
  const container = document.querySelector(".sparkles-container") || document.body;
  const sparkle = document.createElement("div");
  const emojis = ["✨", "💫", "⭐", "🌟", "💖", "🌈"];
  sparkle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  sparkle.className = "sparkle";
  sparkle.style.position = "fixed";
  sparkle.style.left = (x !== null ? x : Math.random() * window.innerWidth) + "px";
  sparkle.style.top = (y !== null ? y : Math.random() * window.innerHeight) + "px";
  sparkle.style.pointerEvents = "none";
  sparkle.style.zIndex = "999999";
  container.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 2000);
}

function triggerSparkles() {
  for (let i = 0; i < 30; i++) {
    setTimeout(() => createSparkle(), i * 50);
  }
}

function toast(msg) {
  const old = document.querySelector(".toast");
  if (old) old.remove();
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = "0"; }, 1500);
  setTimeout(() => { t.remove(); }, 2000);
}

function glitchEffect() {
  const container = document.querySelector(".container");
  if (!container) return;
  container.style.transform = "translateX(8px) skewX(3deg)";
  setTimeout(() => { container.style.transform = "none"; }, 100);
  toast("⚡ glitch");
}

// ============================
// LOGROS Y BADGES
// ============================
function renderBadges() { console.log("badges loaded"); }
function setupAchievements() { console.log("achievements online"); }
function unlockBadge(id) { toast("UNLOCKED: " + id); triggerSparkles(); }

// ============================
// UTILIDADES (CONTEO, TÍTULOS, ETC)
// ============================
function loadVisitCount() {
  let count = localStorage.getItem("visitCount") || 0;
  count = parseInt(count) + 1;
  localStorage.setItem("visitCount", count);
  const el = document.getElementById("visitCount");
  if (el) el.textContent = count;
}

function setupEnterScreen() {
  const screen = document.getElementById("enterScreen");
  if (!screen) return;
  screen.onclick = () => screen.classList.add("hidden");
}

function setupButtons() {
  document.getElementById("sparkleBtn")?.addEventListener("click", triggerSparkles);
  document.getElementById("glitchBtn")?.addEventListener("click", glitchEffect);
}

function setupQuote() {
  const quotes = ["the glitter is inside the walls", "do not trust thomas.png", "i am pixels"];
  const el = document.getElementById("quoteText");
  if (el) el.textContent = quotes[Math.floor(Math.random() * quotes.length)];
}

function setupTabTitles() {
  setInterval(() => { document.title = "skittles.lol fan"; }, 2000);
}

function setupMusicPlayer() { /* Tu lógica de música aquí */ }
function startCursorTrail() { /* Tu lógica de cursor aquí */ }
function setupSecretMode() { /* Tu lógica secreta aquí */ }
function setupPanicMode() { /* Tu lógica de pánico aquí */ }
function setupStamps() { /* Tu lógica de stamps aquí */ }
function setupKonami() { /* Tu lógica Konami aquí */ }
