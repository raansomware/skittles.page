// ============================
// LEON KENNEDY CONSOLE EASTER EGG
// ============================
console.log("%cLEON KENNEDY WAS HERE.", "color: #00ff88; font-size: 20px; font-weight: 900; text-shadow: 0 0 10px #00ff88;");
console.log("%cprotecting nick from los illuminados 💀", "color: #ff1493; font-size: 14px; font-weight: 800;");

// ============================
// PLAYLIST
// ============================
const playlist = [
  { name: "buttercup", artist: "Jack Stauber", file: "buttercup.mp3" },
  { name: "resonance", artist: "Home", file: "resonance.mp3" }
];

let currentTrack = 0;
let isPlaying = false;
let shimejiEl = null; // Estado global de Silly

// ============================
// INIT
// ============================
document.addEventListener("DOMContentLoaded", () => {
  updateSongDisplay();
  updateTrackDisplay();
  loadVisitCount();
  createInitialSparkles();
  startCursorTrail();
  setupCustomStickerUpload();
  setupEnterScreen();
  setupSecretMode();
  setupButtons();
  setupGuestbook();
  setupAchievements();
  setupAudioSystem();
  setupVisualizer();
  createTerminalUI(); // Aseguramos que se cree el terminal
});

// ============================
// SISTEMA SILLY (SHIMEJI) - NUEVO!
// ============================
function createShimeji() {
  if (shimejiEl) return;
  
  shimejiEl = document.createElement('div');
  shimejiEl.className = 'shimeji';
  document.body.appendChild(shimejiEl);

  // Animación de entrada
  setTimeout(() => {
    shimejiEl.style.bottom = '20px';
    triggerSparkles();
    toast("silly ha llegado! ✨");
    unlockAchievement("shimeji summoner");
  }, 100);

  startShimejiAI();
}

function startShimejiAI() {
  setInterval(() => {
    if (!shimejiEl) return;
    const action = Math.random();
    if (action < 0.7) {
      moveShimejiRandomly();
    } else {
      shimejiEl.classList.remove('walking');
    }
  }, 4000);
}

function moveShimejiRandomly() {
  if (!shimejiEl) return;
  const newLeft = Math.random() * (window.innerWidth - 80);
  const currentLeft = parseFloat(shimejiEl.style.left || 50);
  
  // Girar según dirección
  shimejiEl.style.transform = newLeft > currentLeft ? 'scaleX(1)' : 'scaleX(-1)';
  shimejiEl.classList.add('walking');
  shimejiEl.style.left = newLeft + 'px';
}

// ============================
// TERMINAL LOGIC - ACTUALIZADO!
// ============================
function runTerminalCommand(cmd) {
  const audio = document.getElementById("audioPlayer");

  if (cmd === "help") {
    terminalPrint("commands:");
    terminalPrint("play - start music");
    terminalPrint("panic - activate panic.exe");
    terminalPrint("summon - call silly.png");
    terminalPrint("scare - jump scare silly");
    terminalPrint("dismiss - remove silly");
    terminalPrint("leon - summon leon sticker");
    terminalPrint("clear - delete stickers");
    return;
  }

  // Comandos de Silly
  if (cmd === "summon") {
    terminalPrint("running silly.exe...");
    createShimeji();
    return;
  }

  if (cmd === "scare") {
    if (!shimejiEl) return terminalPrint("error: summon silly first");
    terminalPrint("BOO!");
    shimejiEl.style.transform += ' translateY(-50px) scale(1.4)';
    triggerSparkles();
    setTimeout(() => {
      if(shimejiEl) shimejiEl.style.transform = shimejiEl.style.transform.replace('translateY(-50px) scale(1.4)', '');
    }, 500);
    return;
  }

  if (cmd === "dismiss") {
    if (!shimejiEl) return terminalPrint("silly is not here.");
    terminalPrint("deleting silly.exe...");
    shimejiEl.style.bottom = "-100px";
    setTimeout(() => { shimejiEl.remove(); shimejiEl = null; }, 600);
    return;
  }

  // Comandos originales
  if (cmd === "play") {
    audio?.play();
    terminalPrint("playing music 🎵");
    return;
  }

  if (cmd === "panic") {
    terminalPrint("PANIC MODE ACTIVATED");
    panicMode();
    return;
  }

  if (cmd === "leon") {
    createPlacedSticker("leon.png", window.innerWidth/2, window.innerHeight/2);
    terminalPrint("leon deployed.");
    return;
  }

  if (cmd === "clear") {
    clearAllStickers();
    terminalPrint("canvas cleared.");
    return;
  }

  terminalPrint("command not found: " + cmd);
}

// ============================
// FUNCIONES ORIGINALES (MANTENIDAS)
// ============================

function setupEnterScreen() {
  const enterScreen = document.getElementById("enterScreen");
  if (!enterScreen) return;
  enterScreen.addEventListener("click", () => {
    enterScreen.classList.add("hidden");
    triggerSparkles();
  });
}

function setupSecretMode() {
  const banner = document.getElementById("secretBanner");
  if (!banner) return;
  banner.addEventListener("click", () => {
    document.body.classList.toggle("secret-mode");
    unlockAchievement("secret mode entered");
    toast("🔥 secret mode");
    triggerSparkles();
  });
}

function setupButtons() {
  document.getElementById("sparkleBtn")?.addEventListener("click", triggerSparkles);
  document.getElementById("rainbowBtn")?.addEventListener("click", createRainbow);
  document.getElementById("glitchBtn")?.addEventListener("click", glitchEffect);
  document.getElementById("panicBtn")?.addEventListener("click", panicMode);
}

function setupAudioSystem() {
  const audio = document.getElementById("audioPlayer");
  const volume = document.getElementById("volumeSlider");
  if (!audio) return;
  audio.volume = 0.7;
  volume?.addEventListener("input", () => { audio.volume = volume.value; });
  audio.addEventListener("loadedmetadata", () => {
    document.getElementById("duration").textContent = formatTime(audio.duration);
  });
  audio.addEventListener("timeupdate", () => {
    const progressFill = document.getElementById("progressFill");
    const progressSlider = document.getElementById("progressSlider");
    if (!audio.duration) return;
    const percent = (audio.currentTime / audio.duration) * 100;
    if(progressFill) progressFill.style.width = percent + "%";
    if(progressSlider) progressSlider.value = percent;
    document.getElementById("currentTime").textContent = formatTime(audio.currentTime);
  });
  audio.addEventListener("ended", () => { nextSong(); });
  document.getElementById("progressSlider")?.addEventListener("input", (e) => {
    if (!audio.duration) return;
    audio.currentTime = (e.target.value / 100) * audio.duration;
  });
}

function updateSongDisplay() {
  const song = playlist[currentTrack];
  const audio = document.getElementById("audioPlayer");
  const sn = document.getElementById("songName");
  const an = document.getElementById("artistName");
  if(sn) sn.textContent = song.name;
  if(an) an.textContent = song.artist;
  if (audio) { audio.src = song.file; audio.load(); }
}

function updateTrackDisplay() {
  const tt = document.getElementById("trackText");
  if(tt) tt.textContent = `track ${currentTrack + 1} of ${playlist.length}`;
}

function togglePlay() {
  const audio = document.getElementById("audioPlayer");
  if (!audio) return;
  isPlaying = !isPlaying;
  const btn = document.getElementById("playBtn");
  if (isPlaying) {
    audio.play();
    if(btn) btn.textContent = "⏸";
    toast("playing 🎵");
  } else {
    audio.pause();
    if(btn) btn.textContent = "▶";
    toast("paused");
  }
}

function nextSong() {
  currentTrack = (currentTrack + 1) % playlist.length;
  updateSongDisplay();
  updateTrackDisplay();
  triggerSparkles();
  if (isPlaying) document.getElementById("audioPlayer").play();
  toast("next song 🎵");
}

function previousSong() {
  currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
  updateSongDisplay();
  updateTrackDisplay();
  triggerSparkles();
  if (isPlaying) document.getElementById("audioPlayer").play();
  toast("previous song 🎵");
}

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function loadVisitCount() {
  let count = localStorage.getItem("visitCount") || 0;
  count = parseInt(count) + 1;
  localStorage.setItem("visitCount", count);
  const el = document.getElementById("visitCount");
  if (el) el.textContent = count;
}

function createSparkle(x = null, y = null) {
  const container = document.querySelector(".sparkles-container");
  if (!container) return;
  const sparkle = document.createElement("div");
  const emojis = ["✨", "💫", "⭐", "🌟", "💥", "💖", "🌈"];
  sparkle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  sparkle.className = "sparkle";
  sparkle.style.left = (x !== null ? x : Math.random() * window.innerWidth) + "px";
  sparkle.style.top = (y !== null ? y : Math.random() * window.innerHeight) + "px";
  sparkle.style.fontSize = 12 + Math.random() * 24 + "px";
  container.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 3500);
}

function triggerSparkles() {
  for (let i = 0; i < 35; i++) {
    setTimeout(() => {
      createSparkle(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
    }, i * 25);
  }
}

function startCursorTrail() {
  document.addEventListener("mousemove", (e) => {
    const trail = document.createElement("div");
    const emojis = ["✦", "✧", "★", "☆"];
    trail.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    trail.className = "cursor-trail-item"; // Usamos clase para manejarlo en CSS
    trail.style.position = "fixed";
    trail.style.left = e.clientX + "px";
    trail.style.top = e.clientY + "px";
    trail.style.pointerEvents = "none";
    trail.style.zIndex = "99999999";
    trail.style.color = "white";
    document.body.appendChild(trail);
    setTimeout(() => {
      trail.style.transition = "0.6s";
      trail.style.opacity = "0";
      trail.style.transform = "translateY(-20px) scale(0)";
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

function createRainbow() {
  triggerSparkles();
  document.body.style.filter = "hue-rotate(220deg) saturate(2)";
  setTimeout(() => { document.body.style.filter = "none"; }, 650);
  toast("🌈 rainbow mode");
}

function glitchEffect() {
  const container = document.querySelector(".container");
  if (!container) return;
  container.style.transform = "translateX(8px) skewX(3deg)";
  setTimeout(() => { container.style.transform = "translateX(0px)"; }, 200);
  toast("⚡ glitch");
}

function panicMode() {
  const audio = document.getElementById("audioPlayer");
  const overlay = document.getElementById("panicOverlay");
  if (audio) { audio.pause(); isPlaying = false; }
  document.querySelectorAll(".placed-sticker").forEach(s => s.remove());
  if(overlay) overlay.classList.add("show");
  toast("panic executed 💀");
}

function createPlacedSticker(src, x, y) {
  const canvas = document.getElementById("stickerCanvas");
  if (!canvas) return;
  const sticker = document.createElement("div");
  sticker.className = "placed-sticker";
  sticker.style.width = "90px";
  sticker.style.height = "90px";
  sticker.style.left = x - 45 + "px";
  sticker.style.top = y - 45 + "px";
  const img = document.createElement("img");
  img.src = src;
  sticker.appendChild(img);
  canvas.appendChild(sticker);
  makeStickerDraggable(sticker);
}

function makeStickerDraggable(sticker) {
  let dragging = false;
  sticker.addEventListener("mousedown", (e) => {
    dragging = true;
    let offsetX = e.clientX - sticker.offsetLeft;
    let offsetY = e.clientY - sticker.offsetTop;
    const move = (e) => {
      if (!dragging) return;
      sticker.style.left = e.clientX - offsetX + "px";
      sticker.style.top = e.clientY - offsetY + "px";
    };
    const up = () => { dragging = false; document.removeEventListener("mousemove", move); };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });
}

function clearAllStickers() {
  document.querySelectorAll(".placed-sticker").forEach((s) => s.remove());
  toast("stickers cleared");
}

function setupGuestbook() {
  const submit = document.getElementById("guestSubmit");
  if (!submit) return;
  loadGuestbook();
  submit.addEventListener("click", () => {
    const name = document.getElementById("guestName").value;
    const msg = document.getElementById("guestMsg").value;
    if (!name || !msg) return toast("fill both 😭");
    let entries = JSON.parse(localStorage.getItem("guestbookEntries") || "[]");
    entries.unshift({ name, msg });
    localStorage.setItem("guestbookEntries", JSON.stringify(entries.slice(0, 12)));
    loadGuestbook();
    toast("signed 💖");
  });
}

function loadGuestbook() {
  const list = document.getElementById("guestbookList");
  if (!list) return;
  let entries = JSON.parse(localStorage.getItem("guestbookEntries") || "[]");
  list.innerHTML = entries.map(e => `<div class="guestEntry"><span>${e.name}</span>: ${e.msg}</div>`).join("");
}

function setupAchievements() {
  unlockAchievement("visited page");
  renderAchievements();
}

function unlockAchievement(name) {
  let unlocked = JSON.parse(localStorage.getItem("achievementsUnlocked") || "[]");
  if (!unlocked.includes(name)) {
    unlocked.push(name);
    localStorage.setItem("achievementsUnlocked", JSON.stringify(unlocked));
    toast("🏆 " + name);
    renderAchievements();
  }
}

function renderAchievements() {
  const list = document.getElementById("achievementsList");
  if (!list) return;
  let unlocked = JSON.parse(localStorage.getItem("achievementsUnlocked") || "[]");
  let all = ["visited page", "secret mode entered", "shimeji summoner"];
  list.innerHTML = all.map(a => `<div class="achievement ${unlocked.includes(a) ? '' : 'locked'}">${unlocked.includes(a) ? '🏆 ' + a : '??? locked'}</div>`).join("");
}

function setupVisualizer() {
  const audio = document.getElementById("audioPlayer");
  const vis = document.getElementById("visualizer");
  if (!audio || !vis) return;
  let bars = [];
  for (let i = 0; i < 28; i++) {
    const bar = document.createElement("div");
    bar.className = "visBar";
    vis.appendChild(bar);
    bars.push(bar);
  }
  audio.addEventListener("play", () => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      const source = audioContext.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
    }
    const animate = () => {
      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
      bars.forEach((bar, i) => { bar.style.height = (data[i] / 2 || 5) + "px"; });
      requestAnimationFrame(animate);
    };
    animate();
  });
}

function createTerminalUI() {
  if (document.getElementById("miniTerminal")) return;
  const term = document.createElement("div");
  term.id = "miniTerminal";
  term.innerHTML = `<div class="terminalHeader">terminal.exe</div><div class="terminalLog" id="terminalLog"></div><input class="terminalInput" id="terminalInput" placeholder="type help...">`;
  document.body.appendChild(term);
  const input = term.querySelector("input");
  terminalPrint("welcome to skittles.lol. type 'help'");
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const cmd = input.value.toLowerCase().trim();
      input.value = "";
      terminalPrint("> " + cmd);
      runTerminalCommand(cmd);
    }
  });
}

function terminalPrint(msg) {
  const log = document.getElementById("terminalLog");
  if (log) {
    log.innerHTML += `<div class="terminalLine">${msg}</div>`;
    log.scrollTop = log.scrollHeight;
  }
}

// STAMPS
const stamps = document.querySelectorAll(".stamp");
let collected = JSON.parse(localStorage.getItem("collectedStamps") || "[]");
stamps.forEach(s => {
  if(collected.includes(s.dataset.stamp)) s.classList.add("collected");
  s.addEventListener("click", () => {
    if(!collected.includes(s.dataset.stamp)) {
      collected.push(s.dataset.stamp);
      localStorage.setItem("collectedStamps", JSON.stringify(collected));
      s.classList.add("collected");
      toast("stamp collected ✨");
    }
  });
});
