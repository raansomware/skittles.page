// ============================
// PLAYLIST REAL MP3
// ============================
const playlist = [
  { name: "buttercup", artist: "Jack Stauber", file: "buttercup.mp3" },
  { name: "resonance", artist: "Home", file: "resonance.mp3" }
];

let currentTrack = 0;
let isPlaying = false;

// ============================
// INIT
// ============================
document.addEventListener("DOMContentLoaded", () => {
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
// ENTER BIOS SCREEN
// ============================
function setupEnterScreen() {
  const screen = document.getElementById("enterScreen");
  const bootLog = document.getElementById("bootLog");
  if (!screen || !bootLog) return;

  const bootLines = [
    "booting skittlesOS v6.66...",
    "loading chaos modules...",
    "injecting glitter...",
    "connecting to nick.bot...",
    "checking thomas.png integrity...",
    "warning: vibes unstable",
    "system ready."
  ];

  let i = 0;
  function typeLine() {
    if (i >= bootLines.length) {
      unlockBadge("boot");
      return;
    }
    bootLog.textContent += bootLines[i] + "\n";
    i++;
    setTimeout(typeLine, 350);
  }
  typeLine();

  screen.addEventListener("click", () => {
    screen.classList.add("hidden");
  });
}

// ============================
// SKITTLES BOT - FIXED & CAÓTICO
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

    // LÍNEA CORREGIDA AQUÍ:
    const response = await fetch('/api/chat', {
      method: 'POST',
      mode: 'cors',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ message: text.trim() })
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        throw new Error("vibe check failed: server sent html instead of glitter");
    }

    const data = await response.json();
    document.getElementById(loadingId)?.remove();
    
    addNPCLine("skittles", data.reply || "*stares blankly* :3", true);
    triggerSparkles();

  } catch (error) {
    if (document.getElementById(loadingId)) {
        document.getElementById(loadingId).remove();
    }
    console.error("DEBUG ERROR:", error);
    addNPCLine("skittles", `*glitches* error: ${error.message} >_<`, true);
  }
}

// ============================
// VISITS & EFFECTS
// ============================
function loadVisitCount() {
  let count = localStorage.getItem("visitCount") || 0;
  count = parseInt(count) + 1;
  localStorage.setItem("visitCount", count);
  const el = document.getElementById("visitCount");
  if (el) el.textContent = count;
}

function createInitialSparkles() {
  for (let i = 0; i < 15; i++) {
    setTimeout(() => createSparkle(), i * 200);
  }
}

function createSparkle(x = null, y = null) {
  const container = document.querySelector(".sparkles-container");
  if (!container) return;
  const sparkle = document.createElement("div");
  const emojis = ["✨", "💫", "⭐", "🌟", "💥", "🎆", "🎇", "💖", "🌈"];
  sparkle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  sparkle.className = "sparkle";
  sparkle.style.left = (x !== null ? x : Math.random() * window.innerWidth) + "px";
  sparkle.style.top = (y !== null ? y : Math.random() * window.innerHeight) + "px";
  sparkle.style.fontSize = 12 + Math.random() * 24 + "px";
  container.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 3500);
}

function triggerSparkles() {
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      createSparkle(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
    }, i * 30);
  }
}

function startCursorTrail() {
  document.addEventListener("mousemove", (e) => {
    const trail = document.createElement("div");
    const emojis = ["✦", "✧", "★", "☆", "✺", "✹", "✷", "✵"];
    trail.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    trail.style.position = "fixed";
    trail.style.left = e.clientX + "px";
    trail.style.top = e.clientY + "px";
    trail.style.transform = "translate(-50%, -50%)";
    trail.style.pointerEvents = "none";
    trail.style.zIndex = "99999999";
    trail.style.fontSize = (12 + Math.random() * 16) + "px";
    trail.style.color = "white";
    trail.style.textShadow = "0 0 10px rgba(0,234,255,0.8), 0 0 18px rgba(255,20,147,0.6)";
    document.body.appendChild(trail);
    setTimeout(() => {
      trail.style.transition = "0.6s";
      trail.style.opacity = "0";
      trail.style.transform = "translate(-50%, -80%) scale(0)";
    }, 10);
    setTimeout(() => trail.remove(), 650);
  });
}

function toast(msg) {
  const old = document.querySelector(".toast");
  if (old) old.remove();
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => {
    t.style.transition = "0.4s";
    t.style.opacity = "0";
    t.style.transform = "translateX(-50%) translateY(15px)";
  }, 1400);
  setTimeout(() => t.remove(), 1900);
}

function setupButtons() {
  document.getElementById("sparkleBtn")?.addEventListener("click", () => {
    triggerSparkles();
    toast("sparkles unleashed ✨");
  });
  document.getElementById("rainbowBtn")?.addEventListener("click", () => {
    triggerSparkles();
    document.body.style.transition = "0.6s";
    document.body.style.filter = "hue-rotate(220deg) saturate(2)";
    setTimeout(() => { document.body.style.filter = "none"; }, 650);
    toast("🌈 rainbow mode");
  });
  document.getElementById("glitchBtn")?.addEventListener("click", () => {
    glitchEffect();
  });
}

function glitchEffect() {
  const container = document.querySelector(".container");
  if (!container) return;
  container.style.transition = "0.08s";
  container.style.transform = "translateX(8px) skewX(3deg)";
  setTimeout(() => { container.style.transform = "translateX(-8px) skewX(-3deg)"; }, 80);
  setTimeout(() => { container.style.transform = "translateX(0px) skewX(0deg)"; }, 250);
  toast("⚡ glitch");
}

// ============================
// MUSIC PLAYER
// ============================
function setupMusicPlayer() {
  const audio = document.getElementById("audioPlayer");
  if (!audio) return;
  const volumeSlider = document.getElementById("volumeSlider");
  if (volumeSlider) {
    audio.volume = volumeSlider.value;
    volumeSlider.addEventListener("input", () => { audio.volume = volumeSlider.value; });
  }
  loadTrack(currentTrack);
  setupProgress(audio);
  setupVisualizer();
}

function loadTrack(index) {
  const audio = document.getElementById("audioPlayer");
  const song = playlist[index];
  if (!audio || !song) return;
  audio.src = song.file;
  document.getElementById("songName").textContent = song.name;
  document.getElementById("artistName").textContent = song.artist;
  audio.load();
}

function togglePlay() {
  const audio = document.getElementById("audioPlayer");
  if (!audio) return;
  isPlaying = !isPlaying;
  document.getElementById("playBtn").textContent = isPlaying ? "⏸" : "▶";
  isPlaying ? audio.play() : audio.pause();
}

function setupProgress(audio) {
  const slider = document.getElementById("progressSlider");
  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    slider.value = (audio.currentTime / audio.duration) * 100;
  });
  slider.addEventListener("input", (e) => {
    audio.currentTime = (e.target.value / 100) * audio.duration;
  });
}

function setupVisualizer() {
  const visualizer = document.getElementById("visualizer");
  if (!visualizer) return;
  visualizer.innerHTML = "";
  for (let i = 0; i < 18; i++) {
    const bar = document.createElement("div");
    bar.className = "visBar";
    visualizer.appendChild(bar);
  }
  setInterval(() => {
    document.querySelectorAll(".visBar").forEach(bar => {
      bar.style.height = (10 + Math.random() * 45) + "px";
    });
  }, 120);
}

// ============================
// MODES & OTHERS
// ============================
function setupSecretMode() {
  document.getElementById("secretBanner")?.addEventListener("click", () => {
    document.body.classList.toggle("secret-mode");
    toast(document.body.classList.contains("secret-mode") ? "SECRET MODE UNLOCKED 💀" : "secret mode off");
  });
}

function setupPanicMode() {
  const btn = document.getElementById("panicBtn");
  const overlay = document.getElementById("panicOverlay");
  btn?.addEventListener("click", () => overlay?.classList.add("show"));
  overlay?.addEventListener("click", () => overlay?.classList.remove("show"));
}

function setupGuestbook() {
  const btn = document.getElementById("guestSubmit");
  btn?.addEventListener("click", () => {
    toast("signed!! (local only for now)");
    triggerSparkles();
  });
}

function setupAchievements() {}

function setupMootRequest() {
  document.getElementById("mootRequestBtn")?.addEventListener("click", () => {
    toast("request sent 💌");
    triggerSparkles();
  });
}

function setupStamps() {
  document.querySelectorAll(".stamp").forEach(s => {
    s.onclick = () => { s.classList.add("collected"); toast("collected!"); };
  });
}

function setupQuote() {
  const quotes = ["the glitter is inside the walls", "do not trust thomas.png", "i am pixels"];
  const el = document.getElementById("quoteText");
  if (el) el.textContent = quotes[Math.floor(Math.random() * quotes.length)];
}

function setupTabTitles() {
  setInterval(() => { document.title = "skittles.lol fan"; }, 2000);
}

function setupKonami() {
  let input = "";
  document.addEventListener("keydown", (e) => {
    input += e.key;
    if (input.includes("ArrowUpArrowUp")) { toast("cheat active!"); input = ""; }
  });
}

function renderBadges() {}
function unlockBadge(id) {}
