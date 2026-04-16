// playlist
const playlist = [
  { name: "buttercup", artist: "Jack Stauber", duration: 180 },
  { name: "resonance", artist: "Home", duration: 240 }
];

let currentTrack = 0;
let isPlaying = false;
let currentTime = 0;

// sticker drag
let draggedStickerType = null;

// on load
document.addEventListener("DOMContentLoaded", () => {
  updateSongDisplay();
  updateTrackText();
  loadVisitCount();
  createInitialSparkles();
  startCursorTrail();
});

// ======================= MUSIC PLAYER =======================

function updateSongDisplay() {
  const song = playlist[currentTrack];
  document.getElementById("songName").textContent = song.name;
  document.getElementById("artistName").textContent = song.artist;
  document.getElementById("duration").textContent = formatTime(song.duration);
}

function updateTrackText() {
  document.getElementById("trackText").textContent = `track ${currentTrack + 1} of ${playlist.length}`;
}

function togglePlay() {
  isPlaying = !isPlaying;
  document.getElementById("playBtn").textContent = isPlaying ? "⏸" : "▶";
  if (isPlaying) simulatePlayback();
}

function simulatePlayback() {
  if (!isPlaying) return;

  const song = playlist[currentTrack];
  currentTime += 0.1;

  if (currentTime >= song.duration) {
    nextSong();
    return;
  }

  updateProgress();
  setTimeout(simulatePlayback, 100);
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

document.getElementById("progressSlider")?.addEventListener("input", (e) => {
  const song = playlist[currentTrack];
  currentTime = (e.target.value / 100) * song.duration;
  updateProgress();
});

// ======================= VISIT COUNT =======================

function loadVisitCount() {
  let count = localStorage.getItem("visitCount") || 0;
  count = parseInt(count) + 1;
  localStorage.setItem("visitCount", count);
  document.getElementById("visitCount").textContent = count;
}

// ======================= SPARKLES =======================

function createInitialSparkles() {
  for (let i = 0; i < 15; i++) {
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
  sparkle.style.fontSize = 14 + Math.random() * 26 + "px";

  container.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 3000);
}

function triggerSparkles() {
  for (let i = 0; i < 35; i++) {
    setTimeout(() => createSparkle(), i * 25);
  }
}

// ======================= RAINBOW =======================

function createRainbow() {
  document.body.style.transition = "0.2s";
  document.body.style.filter = "hue-rotate(180deg)";
  triggerSparkles();

  setTimeout(() => {
    document.body.style.filter = "hue-rotate(0deg)";
  }, 500);
}

// ======================= GLITCH =======================

function glitchEffect() {
  const container = document.querySelector(".container");

  container.style.transition = "0.05s";
  container.style.transform = "translateX(-4px) skewX(2deg)";
  container.style.filter = "contrast(160%) saturate(200%)";

  triggerSparkles();

  setTimeout(() => {
    container.style.transform = "translateX(4px) skewX(-2deg)";
  }, 80);

  setTimeout(() => {
    container.style.transform = "none";
    container.style.filter = "none";
  }, 160);
}

// ======================= TOAST =======================

function showMessage(msg) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = msg;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 1600);
}

// ======================= RATING =======================

function rateMe(rating) {
  const stars = document.querySelectorAll(".star");

  stars.forEach((star, index) => {
    if (index < rating) star.classList.add("active");
    else star.classList.remove("active");
  });

  triggerSparkles();
  showMessage("thankz 4 ur feedback! :O");
}

// ======================= STICKERS =======================

function startStickerDrag(e, stickerType) {
  draggedStickerType = stickerType;
  e.dataTransfer.setData("text/plain", stickerType);
}

function allowDrop(e) {
  e.preventDefault();
}

function dropSticker(e) {
  e.preventDefault();

  const stickerType = e.dataTransfer.getData("text/plain") || draggedStickerType;
  if (!stickerType) return;

  createPlacedSticker(stickerType, e.clientX, e.clientY);
  triggerSparkles();
}

function createPlacedSticker(stickerType, x, y) {
  const canvas = document.getElementById("stickerCanvas");

  const sticker = document.createElement("div");
  sticker.className = "placed-sticker";

  const size = 80 + Math.random() * 50;
  sticker.style.width = size + "px";
  sticker.style.height = size + "px";
  sticker.style.left = x - size / 2 + "px";
  sticker.style.top = y - size / 2 + "px";

  const img = document.createElement("img");
  img.src = stickerType;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "sticker-delete-btn";
  deleteBtn.textContent = "✕";
  deleteBtn.onclick = () => sticker.remove();

  sticker.appendChild(img);
  sticker.appendChild(deleteBtn);
  canvas.appendChild(sticker);

  makeStickerDraggable(sticker);
}

function makeStickerDraggable(sticker) {
  let offsetX = 0;
  let offsetY = 0;
  let isDown = false;

  sticker.addEventListener("mousedown", (e) => {
    isDown = true;
    offsetX = e.clientX - sticker.offsetLeft;
    offsetY = e.clientY - sticker.offsetTop;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    sticker.style.left = e.clientX - offsetX + "px";
    sticker.style.top = e.clientY - offsetY + "px";
  });

  document.addEventListener("mouseup", () => {
    isDown = false;
  });
}

function clearAllStickers() {
  if (!confirm("clear all stickers??")) return;
  document.querySelectorAll(".placed-sticker").forEach(s => s.remove());
  triggerSparkles();
}

// ======================= CUSTOM STICKERS =======================

document.getElementById("customStickerInput")?.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    const imgData = reader.result;
    createPlacedSticker(imgData, window.innerWidth / 2, window.innerHeight / 2);
    triggerSparkles();
    showMessage("custom sticker added!! 💖");
  };

  reader.readAsDataURL(file);
});

// ======================= CURSOR TRAIL =======================

function startCursorTrail() {
  document.addEventListener("mousemove", (e) => {
    const dot = document.createElement("div");
    dot.className = "trail-dot";
    dot.style.left = e.clientX + "px";
    dot.style.top = e.clientY + "px";

    document.body.appendChild(dot);

    setTimeout(() => {
      dot.remove();
    }, 350);
  });
}

// ======================= UTILS =======================

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
