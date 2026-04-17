// ============================
// PLAYLIST
// ============================
alert("SCRIPT LOADED");

const playlist = [
  { name: "buttercup", artist: "Jack Stauber", duration: 180 },
  { name: "resonance", artist: "Home", duration: 240 }
];

let currentTrack = 0;
let isPlaying = false;
let currentTime = 0;

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
});

// ============================
// MUSIC
// ============================
function updateSongDisplay() {
  const song = playlist[currentTrack];
  document.getElementById("songName").textContent = song.name;
  document.getElementById("artistName").textContent = song.artist;
  document.getElementById("duration").textContent = formatTime(song.duration);
}

function updateTrackDisplay() {
  document.getElementById("trackText").textContent =
    `track ${currentTrack + 1} of ${playlist.length}`;
}

function togglePlay() {
  isPlaying = !isPlaying;
  document.getElementById("playBtn").textContent = isPlaying ? "⏸" : "▶";

  if (isPlaying) simulatePlayback();
}

function simulatePlayback() {
  if (!isPlaying) return;

  const song = playlist[currentTrack];
  currentTime += 0.05;

  if (currentTime >= song.duration) {
    nextSong();
    return;
  }

  updateProgress();
  setTimeout(simulatePlayback, 50);
}

function updateProgress() {
  const song = playlist[currentTrack];
  const percent = (currentTime / song.duration) * 100;

  document.getElementById("progressFill").style.width = percent + "%";
  document.getElementById("progressSlider").value = percent;
  document.getElementById("currentTime").textContent = formatTime(currentTime);
}

function nextSong() {
  currentTrack = (currentTrack + 1) % playlist.length;
  currentTime = 0;
  updateSongDisplay();
  updateTrackDisplay();
  updateProgress();
  triggerSparkles();
  toast("next song 🎵");
}

function previousSong() {
  currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
  currentTime = 0;
  updateSongDisplay();
  updateTrackDisplay();
  updateProgress();
  triggerSparkles();
  toast("previous song 🎵");
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

document.getElementById("progressSlider")?.addEventListener("input", (e) => {
  const song = playlist[currentTrack];
  currentTime = (e.target.value / 100) * song.duration;
  updateProgress();
});

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
      createSparkle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight
      );
    }, i * 30);
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

  // drop custom file image anywhere
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    const file = e.dataTransfer.files[0];

    if (!file.type.startsWith("image/")) {
      toast("not an image 😭");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      createPlacedSticker(reader.result, e.clientX, e.clientY);
      triggerSparkles();
      toast("custom sticker dropped!!");
    };

    reader.readAsDataURL(file);
    return;
  }

  // drop from palette
  const stickerType = e.dataTransfer.getData("text/plain") || draggedStickerType;
  if (!stickerType) return;

  createPlacedSticker(stickerType, e.clientX, e.clientY);
  triggerSparkles();
});

function createPlacedSticker(src, x, y) {
  const canvas = document.getElementById("stickerCanvas");
  if (!canvas) return;

  const sticker = document.createElement("div");
  sticker.className = "placed-sticker";

  const size = 80 + Math.random() * 50;
  sticker.style.width = size + "px";
  sticker.style.height = size + "px";
  sticker.style.left = x - size / 2 + "px";
  sticker.style.top = y - size / 2 + "px";

  const img = document.createElement("img");
  img.src = src;
  img.draggable = false;

  const del = document.createElement("button");
  del.className = "sticker-delete-btn";
  del.textContent = "✕";
  del.onclick = (ev) => {
    ev.stopPropagation();
    sticker.remove();
    triggerSparkles();
  };

  sticker.appendChild(img);
  sticker.appendChild(del);

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
  document.querySelectorAll(".placed-sticker").forEach((s) => s.remove();
  triggerSparkles();
  toast("stickers cleared");
}

// ============================
// CUSTOM STICKER UPLOAD BUTTON
// ============================
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
