// ============================
// 1. CONFIGURACIÓN Y PLAYLIST
// ============================
const playlist = [
  { name: "buttercup", artist: "Jack Stauber", file: "buttercup.mp3" },
  { name: "resonance", artist: "Home", file: "resonance.mp3" }
];
let currentTrack = 0;
let isPlaying = false;

// ============================
// 2. INIT (ARRANQUE)
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
// 3. CHAT (SKITTLES)
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
    
    addNPCLine("skittles", data.reply || "*glitch* :3", true);
    triggerSparkles();

  } catch (error) {
    if (document.getElementById(loadingId)) document.getElementById(loadingId).remove();
    addNPCLine("skittles", `*reality folding* ${error.message}`, true);
  }
}

function addNPCLine(sender, msg, isSkittles = false) {
  const npcChat = document.getElementById("npcChat");
  if (!npcChat) return;
  const line = document.createElement("div");
  line.className = "npcLine";
  line.innerHTML = `<b class="${isSkittles ? 'skittles-label' : 'user-label'}">${sender}:</b> ${msg}`;
  npcChat.appendChild(line);
  npcChat.scrollTop = npcChat.scrollHeight;
}

function setupSkittlesBot() {
  const input = document.getElementById("npcInput");
  const send = document.getElementById("npcSend");
  if (!input || !send) return;
  send.onclick = () => {
    const m = input.value.trim();
    if (m) { addNPCLine("you", m); askSkittles(m); input.value = ""; }
  };
  input.onkeydown = (e) => { if (e.key === "Enter") send.click(); };
}

// ============================
// 4. INTERACCIONES Y BOTONES
// ============================
function rateMe(stars) {
  toast(`rated ${stars} stars! u_u`);
  triggerSparkles();
}

function setupGuestbook() {
  const btn = document.getElementById("guestSubmit");
  if (btn) btn.onclick = () => { toast("signed! ✨"); triggerSparkles(); };
}

function setupMootRequest() {
  const btn = document.getElementById("mootRequestBtn");
  if (btn) btn.onclick = () => { toast("request sent 💌"); triggerSparkles(); };
}

function setupButtons() {
  document.getElementById("sparkleBtn")?.addEventListener("click", triggerSparkles);
  document.getElementById("glitchBtn")?.addEventListener("click", glitchEffect);
}

// ============================
// 5. STICKERS Y DRAG
// ============================
function startStickerDrag(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
}

// ============================
// 6. EFECTOS VISUALES
// ============================
function createSparkle(x = null, y = null) {
  const container = document.querySelector(".sparkles-container") || document.body;
  const sparkle = document.createElement("div");
  sparkle.textContent = "✨";
  sparkle.className = "sparkle";
  sparkle.style.position = "fixed";
  sparkle.style.left = (x !== null ? x : Math.random() * window.innerWidth) + "px";
  sparkle.style.top = (y !== null ? y : Math.random() * window.innerHeight) + "px";
  sparkle.style.zIndex = "999999";
  container.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 2000);
}

function createInitialSparkles() {
  for (let i = 0; i < 15; i++) setTimeout(() => createSparkle(), i * 200);
}

function triggerSparkles() {
  for (let i = 0; i < 30; i++) setTimeout(() => createSparkle(), i * 50);
}

function startCursorTrail() {
  document.addEventListener("mousemove", (e) => {
    const trail = document.createElement("div");
    trail.textContent = "✨";
    trail.style.position = "fixed";
    trail.style.left = e.clientX + "px";
    trail.style.top = e.clientY + "px";
    trail.style.pointerEvents = "none";
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 600);
  });
}

function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2000);
}

function glitchEffect() {
  document.body.style.transform = "translateX(8px)";
  setTimeout(() => document.body.style.transform = "none", 100);
}

// ============================
// 7. OTROS (LLENADO)
// ============================
function renderBadges() { console.log("badges ready"); }
function setupAchievements() { console.log("achievements ready"); }
function loadVisitCount() {
  let count = (parseInt(localStorage.getItem("visitCount")) || 0) + 1;
  localStorage.setItem("visitCount", count);
  if (document.getElementById("visitCount")) document.getElementById("visitCount").textContent = count;
}
function setupEnterScreen() {
  const screen = document.getElementById("enterScreen");
  if (screen) screen.onclick = () => screen.classList.add("hidden");
}
function setupStamps() {
  document.querySelectorAll(".stamp").forEach(s => s.onclick = () => toast("collected!"));
}
function setupKonami() { /* Lógica de teclas */ }
function setupMusicPlayer() { /* Lógica MP3 */ }
function setupQuote() { /* Lógica frases */ }
function setupTabTitles() { /* Lógica tab */ }
function setupSecretMode() { /* Lógica secreta */ }
function setupPanicMode() { /* Lógica pánico */ }
function unlockBadge(id) { toast("UNLOCKED: " + id); }
