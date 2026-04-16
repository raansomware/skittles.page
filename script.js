// playlist
const playlist = [
  { name: "buttercup", artist: "Jack Stauber", duration: 208 },
  { name: "resonance", artist: "Home", duration: 240 }
];

let currentTrack = 0;
let isPlaying = false;
let currentTime = 0;

// stickers
let draggedStickerType = null;

/* IMPORTANT FIX:
prevents browser from trying to drop an image/file */
document.addEventListener("dragover", (e) => e.preventDefault());
document.addEventListener("drop", (e) => e.preventDefault());

// init
document.addEventListener("DOMContentLoaded", () => {
  updateSongDisplay();
  updateTrackText();
  loadVisitCount();
  createInitialSparkles();

  document.getElementById("progressSlider").addEventListener("input", (e) => {
    const song = playlist[currentTrack];
    currentTime = (e.target.value / 100) * song.duration;
    updateProgress();
  });

  document.getElementById("volumeSlider").addEventListener("input", (e) => {
    console.log("volume:", e.target.value);
  });
});

// visits
function loadVisitCount() {
  let count = localStorage.getItem("visitCount") || 0;
  count = parseInt(count) + 1;
  localStorage.setItem("visitCount", count);
  document.getElementById("visitCount").textContent = count;
}

// song display
function updateSongDisplay() {
  const song = playlist[currentTrack];
  document.getElementById("songName").textContent = song.name;
  document.getElementById("artistName").textContent = song.artist;
  document.getElementById("duration").textContent = formatTime(song.duration);
}

function updateTrackText() {
  document.getElementById("trackText").textContent =
    `track ${currentTrack + 1} of ${playlist.length}`;
}

// play toggle
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

// progress
function updateProgress() {
  const song = playlist[currentTrack];
  const percent = (currentTime / song.duration) * 100;

  document.getElementById("progressFill").style.width = percent + "%";
  document.getElementById("progressSlider").value = percent;
  document.getElementById("currentTime").textContent = formatTime(currentTime);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// next / prev
function nextSong() {
  currentTrack = (currentTrack + 1) % playlist.length;
  currentTime = 0;
  updateSongDisplay();
  updateTrackText();
  updateProgress();
  triggerSparkles();
}

function previousSong() {
  currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
  currentTime = 0;
  updateSongDisplay();
  updateTrackText();
  updateProgress();
  triggerSparkles();
}

// rating
function rateMe(rating) {
  const stars = document.querySelectorAll(".star");
  stars.forEach((star, index) => {
    if (index < rating) star.classList.add("active");
    else star.classList.remove("active");
  });

  toast("thankz 4 ur feedback!!");
  triggerSparkles();
}

// sparkles
function createInitialSparkles() {
  for (let i = 0; i < 18; i++) {
    setTimeout(() => createSparkle(), i * 180);
  }
}

function createSparkle() {
  const container = document.querySelector(".sparkles-container");
  const sparkle = document.createElement("div");

  const emojis = ["✨", "💫", "⭐", "🌟", "💥", "🎆", "🎇", "💖"];
  sparkle.textContent = emojis[Math.floor(Math.random() * emojis.length)];

  sparkle.className = "sparkle";
  sparkle.style.left = Math.random() * 100 + "%";
  sparkle.style.top = Math.random() * 100 + "%";
  sparkle.style.fontSize = (12 + Math.random() * 26) + "px";
  sparkle.style.animation = `sparkleFloat ${2 + Math.random() * 2}s ease-out forwards`;

  container.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 4000);
}

function triggerSparkles() {
  for (let i = 0; i < 50; i++) {
    setTimeout(createSparkle, i * 25);
  }
}

// rainbow mode
function createRainbow() {
  document.body.style.animation = "rainbowFlash 0.6s";
  setTimeout(() => (document.body.style.animation = ""), 650);
  triggerSparkles();
  toast("🌈 RAINBOW MODE ACTIVATED");
}

// glitch
function glitchEffect() {
  const c = document.querySelector(".container");
  c.style.animation = "glitch 0.25s infinite";
  triggerSparkles();
  toast("⚡ GLITCHED");

  setTimeout(() => {
    c.style.animation = "";
  }, 900);
}

// inject animations
const style = document.createElement("style");
style.textContent = `
@keyframes rainbowFlash {
  0%,100% { filter: hue-rotate(0deg); }
  20% { filter: hue-rotate(60deg); }
  40% { filter: hue-rotate(120deg); }
  60% { filter: hue-rotate(180deg); }
  80% { filter: hue-rotate(300deg); }
}
@keyframes glitch {
  0% { transform: translate(0,0); }
  25% { transform: translate(4px,-2px); }
  50% { transform: translate(-4px,3px); }
  75% { transform: translate(2px,2px); }
  100% { transform: translate(0,0); }
}
`;
document.head.appendChild(style);

// toast
function toast(text) {
  const old = document.querySelector(".toast");
  if (old) old.remove();

  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = text;
  document.body.appendChild(t);

  setTimeout(() => t.remove(), 1800);
}

// sticker drag from palette
function startStickerDrag(e, stickerType) {
  draggedStickerType = stickerType;
  e.dataTransfer.setData("text/plain", stickerType);
}

// allow drop
function allowDrop(e) {
  e.preventDefault();
}

// drop sticker on screen
function dropSticker(e) {
  e.preventDefault();
  const stickerType = e.dataTransfer.getData("text/plain") || draggedStickerType;
  if (!stickerType) return;

  createPlacedSticker(stickerType, e.clientX, e.clientY);
  triggerSparkles();
}

// create sticker widget
function createPlacedSticker(stickerType, x, y) {
  const canvas = document.getElementById("stickerCanvas");

  const sticker = document.createElement("div");
  sticker.className = "placed-sticker";

  const size = 80 + Math.random() * 50;
  sticker.style.width = size + "px";
  sticker.style.height = size + "px";
  sticker.style.left = (x - size / 2) + "px";
  sticker.style.top = (y - size / 2) + "px";

  const img = document.createElement("img");
  img.src = stickerType;

  const del = document.createElement("button");
  del.className = "sticker-delete-btn";
  del.textContent = "✕";
  del.onclick = (ev) => {
    ev.stopPropagation();
    sticker.remove();
  };

  sticker.appendChild(img);
  sticker.appendChild(del);
  canvas.appendChild(sticker);

  makeStickerDraggable(sticker);
}

// drag sticker around
function makeStickerDraggable(sticker) {
  let offsetX = 0;
  let offsetY = 0;
  let dragging = false;

  sticker.addEventListener("mousedown", (e) => {
    dragging = true;
    offsetX = e.clientX - sticker.offsetLeft;
    offsetY = e.clientY - sticker.offsetTop;
    sticker.style.zIndex = 99999999;
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    sticker.style.left = (e.clientX - offsetX) + "px";
    sticker.style.top = (e.clientY - offsetY) + "px";
  });

  document.addEventListener("mouseup", () => {
    dragging = false;
  });
}

// clear stickers
function clearAllStickers() {
  if (!confirm("clear all stickers?")) return;
  document.querySelectorAll(".placed-sticker").forEach(s => s.remove());
  triggerSparkles();
}
