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
let stickerData = []; // saved stickers list

// prevent browser image drop
document.addEventListener("dragover", (e) => e.preventDefault());
document.addEventListener("drop", (e) => e.preventDefault());

document.addEventListener("DOMContentLoaded", () => {
  updateSongDisplay();
  updateTrackText();
  loadVisitCount();
  createInitialSparkles();

  loadSavedStickers();
  loadCustomStickerPalette();

  // music sliders
  document.getElementById("progressSlider").addEventListener("input", (e) => {
    const song = playlist[currentTrack];
    currentTime = (e.target.value / 100) * song.duration;
    updateProgress();
  });

  document.getElementById("volumeSlider").addEventListener("input", (e) => {
    console.log("volume:", e.target.value);
  });

  // upload custom sticker
  document.getElementById("stickerUpload").addEventListener("change", handleStickerUpload);
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

/* ==========================
   STICKERS SYSTEM (REAL)
========================== */

// drag from palette
function startStickerDrag(e, stickerType) {
  draggedStickerType = stickerType;
  e.dataTransfer.setData("text/plain", stickerType);
}

// allow drop
function allowDrop(e) {
  e.preventDefault();
  document.getElementById("stickerCanvas").style.pointerEvents = "auto";
}

// drop sticker
function dropSticker(e) {
  e.preventDefault();

  const canvas = document.getElementById("stickerCanvas");
  canvas.style.pointerEvents = "none";

  const stickerType = e.dataTransfer.getData("text/plain") || draggedStickerType;
  if (!stickerType) return;

  createPlacedSticker(stickerType, e.clientX, e.clientY, true);
  triggerSparkles();
}

// create sticker widget
function createPlacedSticker(stickerType, x, y, save = false, id = null, size = null) {
  const canvas = document.getElementById("stickerCanvas");

  const sticker = document.createElement("div");
  sticker.className = "placed-sticker";

  const stickerId = id || crypto.randomUUID();
  sticker.dataset.id = stickerId;

  const finalSize = size || (80 + Math.random() * 50);

  sticker.style.width = finalSize + "px";
  sticker.style.height = finalSize + "px";
  sticker.style.left = (x - finalSize / 2) + "px";
  sticker.style.top = (y - finalSize / 2) + "px";

  const img = document.createElement("img");
  img.src = stickerType;

  const del = document.createElement("button");
  del.className = "sticker-delete-btn";
  del.textContent = "✕";
  del.onclick = (ev) => {
    ev.stopPropagation();
    deleteSticker(stickerId);
    sticker.remove();
  };

  sticker.appendChild(img);
  sticker.appendChild(del);
  canvas.appendChild(sticker);

  makeStickerDraggable(sticker);

  if (save) {
    stickerData.push({
      id: stickerId,
      src: stickerType,
      x: parseFloat(sticker.style.left),
      y: parseFloat(sticker.style.top),
      size: finalSize
    });

    saveStickerData();
  }
}

// make draggable + save movement
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
    if (!dragging) return;
    dragging = false;
    sticker.style.zIndex = 9999999;

    updateStickerPosition(sticker);
  });
}

// update position after drag
function updateStickerPosition(sticker) {
  const id = sticker.dataset.id;
  const found = stickerData.find(s => s.id === id);
  if (!found) return;

  found.x = parseFloat(sticker.style.left);
  found.y = parseFloat(sticker.style.top);

  saveStickerData();
}

// delete one sticker
function deleteSticker(id) {
  stickerData = stickerData.filter(s => s.id !== id);
  saveStickerData();
}

// save stickers
function saveStickerData() {
  localStorage.setItem("placedStickers", JSON.stringify(stickerData));
}

// load stickers
function loadSavedStickers() {
  const saved = localStorage.getItem("placedStickers");
  if (!saved) return;

  stickerData = JSON.parse(saved);

  stickerData.forEach(s => {
    createPlacedSticker(s.src, s.x, s.y, false, s.id, s.size);
  });
}

// clear all
function clearAllStickers() {
  if (!confirm("clear all stickers?")) return;

  stickerData = [];
  saveStickerData();

  document.querySelectorAll(".placed-sticker").forEach(s => s.remove());
  triggerSparkles();
}

/* ==========================
   CUSTOM UPLOAD STICKERS
========================== */

function handleStickerUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    const imgData = event.target.result;

    saveCustomSticker(imgData);
    addStickerToPalette(imgData);

    toast("sticker added!!");
    triggerSparkles();
  };

  reader.readAsDataURL(file);
}

function saveCustomSticker(imgData) {
  let custom = JSON.parse(localStorage.getItem("customStickers") || "[]");
  custom.push(imgData);
  localStorage.setItem("customStickers", JSON.stringify(custom));
}

function loadCustomStickerPalette() {
  let custom = JSON.parse(localStorage.getItem("customStickers") || "[]");
  custom.forEach(src => addStickerToPalette(src));
}

function addStickerToPalette(src) {
  const grid = document.getElementById("stickerGrid");

  const tool = document.createElement("div");
  tool.className = "stickerTool";
  tool.draggable = true;

  tool.addEventListener("dragstart", (e) => {
    startStickerDrag(e, src);
  });

  const img = document.createElement("img");
  img.src = src;

  tool.appendChild(img);
  grid.appendChild(tool);
}
