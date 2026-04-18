// ============================
// LEON KENNEDY CONSOLE EASTER EGG
// ============================
console.log("%cLEON KENNEDY WAS HERE.", "color: #00ff88; font-size: 20px; font-weight: 900; text-shadow: 0 0 10px #00ff88;");
console.log("%cprotecting nick from los illuminados 💀", "color: #ff1493; font-size: 14px; font-weight: 800;");

// ============================
// PLAYLIST (MP3 FILES REQUIRED)
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
});

// ============================
// ENTER SCREEN
// ============================
function setupEnterScreen() {
  const enterScreen = document.getElementById("enterScreen");
  if (!enterScreen) return;

  enterScreen.addEventListener("click", () => {
    enterScreen.classList.add("hidden");
    triggerSparkles();
  });
}

// ============================
// SECRET MODE (CLICK BANNER)
// ============================
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

// ============================
// BUTTON EVENTS
// ============================
function setupButtons() {
  document.getElementById("sparkleBtn")?.addEventListener("click", triggerSparkles);
  document.getElementById("rainbowBtn")?.addEventListener("click", createRainbow);
  document.getElementById("glitchBtn")?.addEventListener("click", glitchEffect);
  document.getElementById("panicBtn")?.addEventListener("click", panicMode);
}

// ============================
// AUDIO PLAYER SYSTEM (REAL)
// ============================
function setupAudioSystem() {
  const audio = document.getElementById("audioPlayer");
  const volume = document.getElementById("volumeSlider");

  if (!audio) return;

  audio.volume = 0.7;

  volume?.addEventListener("input", () => {
    audio.volume = volume.value;
  });

  audio.addEventListener("loadedmetadata", () => {
    document.getElementById("duration").textContent = formatTime(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    const progressFill = document.getElementById("progressFill");
    const progressSlider = document.getElementById("progressSlider");

    if (!audio.duration) return;

    const percent = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = percent + "%";
    progressSlider.value = percent;

    document.getElementById("currentTime").textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener("ended", () => {
    nextSong();
  });

  audio.addEventListener("error", () => {
    document.getElementById("songName").textContent = "MP3 missing";
    document.getElementById("artistName").textContent = "file not found 💀";
    toast("MP3 missing 💀");
  });

  document.getElementById("progressSlider")?.addEventListener("input", (e) => {
    if (!audio.duration) return;
    audio.currentTime = (e.target.value / 100) * audio.duration;
  });
}

// ============================
// MUSIC FUNCTIONS
// ============================
function updateSongDisplay() {
  const song = playlist[currentTrack];
  const audio = document.getElementById("audioPlayer");

  document.getElementById("songName").textContent = song.name;
  document.getElementById("artistName").textContent = song.artist;

  if (audio) {
    audio.src = song.file;
    audio.load();
  }
}

function updateTrackDisplay() {
  document.getElementById("trackText").textContent =
    `track ${currentTrack + 1} of ${playlist.length}`;
}

function togglePlay() {
  const audio = document.getElementById("audioPlayer");
  if (!audio) return;

  isPlaying = !isPlaying;

  if (isPlaying) {
    audio.play();
    document.getElementById("playBtn").textContent = "⏸";
    toast("playing 🎵");
  } else {
    audio.pause();
    document.getElementById("playBtn").textContent = "▶";
    toast("paused");
  }
}

function nextSong() {
  currentTrack = (currentTrack + 1) % playlist.length;
  updateSongDisplay();
  updateTrackDisplay();
  triggerSparkles();

  if (isPlaying) {
    document.getElementById("audioPlayer").play();
  }

  toast("next song 🎵");
}

function previousSong() {
  currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
  updateSongDisplay();
  updateTrackDisplay();
  triggerSparkles();

  if (isPlaying) {
    document.getElementById("audioPlayer").play();
  }

  toast("previous song 🎵");
}

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// ============================
// VISITS
// ============================
function loadVisitCount() {
  let count = localStorage.getItem("visitCount") || 0;
  count = parseInt(count) + 1;
  localStorage.setItem("visitCount", count);

  const el = document.getElementById("visitCount");
  if (el) el.textContent = count;
}

// ============================
// SPARKLES
// ============================
function createInitialSparkles() {
  for (let i = 0; i < 12; i++) {
    setTimeout(() => createSparkle(), i * 160);
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
  for (let i = 0; i < 35; i++) {
    setTimeout(() => {
      createSparkle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight
      );
    }, i * 25);
  }
}

// ============================
// CURSOR TRAIL
// ============================
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
    trail.style.textShadow =
      "0 0 10px rgba(0,234,255,0.8), 0 0 18px rgba(255,20,147,0.6)";

    document.body.appendChild(trail);

    setTimeout(() => {
      trail.style.transition = "0.6s";
      trail.style.opacity = "0";
      trail.style.transform = "translate(-50%, -80%) scale(0)";
    }, 10);

    setTimeout(() => trail.remove(), 650);
  });
}

// ============================
// TOAST
// ============================
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

// ============================
// BUTTON FUNCTIONS
// ============================
function createRainbow() {
  triggerSparkles();
  document.body.style.transition = "0.6s";
  document.body.style.filter = "hue-rotate(220deg) saturate(2)";

  setTimeout(() => {
    document.body.style.filter = "none";
  }, 650);

  toast("🌈 rainbow mode activated");
}

function glitchEffect() {
  triggerSparkles();

  const container = document.querySelector(".container");
  if (!container) return;

  container.style.transition = "0.08s";
  container.style.transform = "translateX(8px) skewX(3deg)";

  setTimeout(() => {
    container.style.transform = "translateX(-8px) skewX(-3deg)";
  }, 80);

  setTimeout(() => {
    container.style.transform = "translateX(5px) skewX(2deg)";
  }, 160);

  setTimeout(() => {
    container.style.transform = "translateX(0px) skewX(0deg)";
  }, 250);

  toast("⚡ glitch");
}

// ============================
// PANIC BUTTON
// ============================
function panicMode() {
  const audio = document.getElementById("audioPlayer");
  const overlay = document.getElementById("panicOverlay");

  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    isPlaying = false;
    document.getElementById("playBtn").textContent = "▶";
  }

  document.querySelectorAll(".placed-sticker").forEach(s => s.remove());
  document.querySelectorAll(".sparkle").forEach(s => s.remove());

  overlay.classList.add("show");

  overlay.onclick = () => {
    overlay.classList.remove("show");
  };

  toast("panic executed 💀");
}

// ============================
// RATING
// ============================
function rateMe(rating) {
  const stars = document.querySelectorAll(".star");

  stars.forEach((star, index) => {
    if (index < rating) star.classList.add("active");
    else star.classList.remove("active");
  });

  triggerSparkles();
  toast("thankz 4 rating!!");
}

// ============================
// STICKERS
// ============================
let draggedStickerType = null;

function startStickerDrag(e, stickerType) {
  draggedStickerType = stickerType;
  e.dataTransfer.setData("text/plain", stickerType);
  e.dataTransfer.effectAllowed = "copy";
}

document.addEventListener("dragover", (e) => {
  e.preventDefault();
});

document.addEventListener("drop", (e) => {
  e.preventDefault();

  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    const file = e.dataTransfer.files[0];
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      createPlacedSticker(reader.result, e.clientX, e.clientY);
      toast("custom sticker dropped!");
    };
    reader.readAsDataURL(file);
    return;
  }

  const stickerType = e.dataTransfer.getData("text/plain") || draggedStickerType;
  if (!stickerType) return;

  createPlacedSticker(stickerType, e.clientX, e.clientY);
});

function createPlacedSticker(src, x, y) {
  const canvas = document.getElementById("stickerCanvas");
  if (!canvas) return;

  const sticker = document.createElement("div");
  sticker.className = "placed-sticker";

  const size = 90;
  sticker.style.width = size + "px";
  sticker.style.height = size + "px";
  sticker.style.left = x - size / 2 + "px";
  sticker.style.top = y - size / 2 + "px";

  const img = document.createElement("img");
  img.src = src;
  img.draggable = false;

  sticker.appendChild(img);
  canvas.appendChild(sticker);

  makeStickerDraggable(sticker);
}

function makeStickerDraggable(sticker) {
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  sticker.addEventListener("mousedown", (e) => {
    dragging = true;
    sticker.style.zIndex = 999999999;
    offsetX = e.clientX - sticker.offsetLeft;
    offsetY = e.clientY - sticker.offsetTop;
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    sticker.style.left = e.clientX - offsetX + "px";
    sticker.style.top = e.clientY - offsetY + "px";
  });

  document.addEventListener("mouseup", () => {
    dragging = false;
  });
}

function clearAllStickers() {
  document.querySelectorAll(".placed-sticker").forEach((s) => s.remove());
  triggerSparkles();
  toast("stickers cleared");
}

function setupCustomStickerUpload() {
  const input = document.getElementById("customStickerInput");
  if (!input) return;

  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast("only images 😭");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      createPlacedSticker(reader.result, window.innerWidth / 2, window.innerHeight / 2);
      triggerSparkles();
      toast("custom sticker added!! 💖");
    };

    reader.readAsDataURL(file);
  });
}

// ============================
// GUESTBOOK (LOCALSTORAGE)
// ============================
function setupGuestbook() {
  const submit = document.getElementById("guestSubmit");
  const list = document.getElementById("guestbookList");

  if (!submit || !list) return;

  loadGuestbook();

  submit.addEventListener("click", () => {
    const name = document.getElementById("guestName").value.trim();
    const msg = document.getElementById("guestMsg").value.trim();

    if (!name || !msg) {
      toast("fill both 😭");
      return;
    }

    const entry = { name, msg, time: Date.now() };

    let entries = JSON.parse(localStorage.getItem("guestbookEntries") || "[]");
    entries.unshift(entry);

    if (entries.length > 12) entries.pop();

    localStorage.setItem("guestbookEntries", JSON.stringify(entries));

    document.getElementById("guestName").value = "";
    document.getElementById("guestMsg").value = "";

    loadGuestbook();
    toast("signed 💖");
    triggerSparkles();
  });
}

function loadGuestbook() {
  const list = document.getElementById("guestbookList");
  if (!list) return;

  let entries = JSON.parse(localStorage.getItem("guestbookEntries") || "[]");

  list.innerHTML = "";

  entries.forEach((e) => {
    const div = document.createElement("div");
    div.className = "guestEntry";
    div.innerHTML = `<span>${escapeHTML(e.name)}</span>: ${escapeHTML(e.msg)}`;
    list.appendChild(div);
  });
}

function escapeHTML(text) {
  return text.replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

// ============================
// ACHIEVEMENTS (LOCALSTORAGE)
// ============================
let achievements = [
  { name: "visited page", key: "visit" },
  { name: "secret mode entered", key: "secret" }
];

function setupAchievements() {
  achievements.forEach(a => {
    if (a.key === "visit") unlockAchievement(a.name);
  });

  renderAchievements();
}

function unlockAchievement(name) {
  let unlocked = JSON.parse(localStorage.getItem("unlockedAchievements") || "[]");

  if (!unlocked.includes(name)) {
    unlocked.push(name);
    localStorage.setItem("achievementsUnlocked", JSON.stringify(unlocked));
    toast("achievement unlocked: " + name);
    renderAchievements();
  }
}

function renderAchievements() {
  const list = document.getElementById("achievementsList");
  if (!list) return;

  const unlocked = JSON.parse(localStorage.getItem("achievementsUnlocked") || "[]");
  list.innerHTML = "";

  achievements.forEach((a) => {
    const div = document.createElement("div");
    div.className = "achievement";

    if (!unlocked.includes(a.name)) {
      div.classList.add("locked");
      div.textContent = "??? locked achievement";
    } else {
      div.textContent = "🏆 " + a.name;
    }

    list.appendChild(div);
  });
}

// ============================
// VISUALIZER (REAL)
// ============================
let audioContext;
let analyser;
let sourceNode;
let bars = [];

function setupVisualizer() {
  const audio = document.getElementById("audioPlayer");
  const vis = document.getElementById("visualizer");

  if (!audio || !vis) return;

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

      sourceNode = audioContext.createMediaElementSource(audio);
      sourceNode.connect(analyser);
      analyser.connect(audioContext.destination);
    }

    animateBars();
  });
}

function animateBars() {
  if (!analyser) return;

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  analyser.getByteFrequencyData(dataArray);

  for (let i = 0; i < bars.length; i++) {
    const val = dataArray[i] || 0;
    bars[i].style.height = Math.max(6, val / 2) + "px";
  }

  requestAnimationFrame(animateBars);
}
