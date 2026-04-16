// ============================
// MUSIC PLAYER DATA
// ============================
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
});

// ============================
// MUSIC PLAYER
// ============================
function updateSongDisplay() {
  const song = playlist[currentTrack];
  document.getElementById("songName").textContent = song.name;
  document.getElementById("artistName").textContent = song.artist;
  document.getElementById("duration").textContent = formatTime(song.duration);
}

function updateTrackDisplay() {
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
}

function previousSong() {
  currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
  currentTime = 0;
  updateSongDisplay();
  updateTrackDisplay();
  updateProgress();
  triggerSparkles();
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
// SPARKLES
// ============================
function createInitialSparkles() {
  for (let i = 0; i < 15; i++) {
    setTimeout(() => createSparkle(), i * 200);
  }
}

function createSparkle() {
  const container = document.querySelector(".sparkles-container");
  if (!container) return;

  const sparkle = document.createElement("div");
  const emojis = ["✨", "💫", "⭐", "🌟", "💥", "🎆", "🎇", "🌈", "💖"];

  sparkle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  sparkle.className = "sparkle";
  sparkle.style.left = Math.random() * 100 + "%";
  sparkle.style.top = Math.random() * 100 + "%";
  sparkle.style.fontSize = 12 + Math.random() * 24 + "px";

  container.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 4000);
}

function triggerSparkles() {
  const container = document.querySelector(".sparkles-container");
  if (!container) return;

  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const sparkle = document.createElement("div");
      const emojis = ["✨", "💫", "⭐", "🌟", "💥", "🎆", "🎇", "🌈", "💖"];

      sparkle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      sparkle.className = "sparkle";
      sparkle.style.left = Math.random() * 100 + "%";
      sparkle.style.top = Math.random() * 100 + "%";
      sparkle.style.fontSize = 16 + Math.random() * 28 + "px";

      container.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 3500);
    }, i * 30);
  }
}

// ============================
// CHAOS BUTTONS
// ============================
function createRainbow() {
  document.body.style.transition = "0.6s";
  document.body.style.filter = "hue-rotate(160deg)";
  setTimeout(() => {
    document.body.style.filter = "hue-rotate(0deg)";
  }, 600);

  triggerSparkles();
}

function glitchEffect() {
  const container = document.querySelector(".container");
  if (!container) return;

  container.style.transition = "0.1s";
  container.style.transform = "translateX(8px) rotate(1deg)";

  setTimeout(() => {
    container.style.transform = "translateX(-8px) rotate(-1deg)";
  }, 120);

  setTimeout(() => {
    container.style.transform = "translateX(0px) rotate(0deg)";
  }, 250);

  triggerSparkles();
}

// ============================
// VISIT COUNTER
// ============================
function loadVisitCount() {
  let count = localStorage.getItem("visitCount") || 0;
  count = parseInt(count) + 1;
  localStorage.setItem("visitCount", count);
  document.getElementById("visitCount").textContent = count;
}

// ============================
// RATING SYSTEM
// ============================
function rateMe(rating) {
  const stars = document.querySelectorAll(".star");

  stars.forEach((star, index) => {
    if (index < rating) star.classList.add("active");
    else star.classList.remove("active");
  });

  triggerSparkles();
  alert("thankz 4 ur feedback! :O");
}

// ============================
// STICKERS SYSTEM (REAL WORKING)
// ============================
let draggedStickerType = null;

function startStickerDrag(e, stickerType) {
  draggedStickerType = stickerType;
  e.dataTransfer.setData("text/plain", stickerType);
  e.dataTransfer.effectAllowed = "copy";
}

// allow dragover on whole document
document.addEventListener("dragover", (e) => {
  e.preventDefault();
});

// drop anywhere on the page
document.addEventListener("drop", (e) => {
  e.preventDefault();

  // if user drops a real file (image)
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    const file = e.dataTransfer.files[0];

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function(ev) {
        createPlacedSticker(ev.target.result, e.clientX, e.clientY);
        triggerSparkles();
      };
      reader.readAsDataURL(file);
    }
    return;
  }

  // if user drops from your sticker grid
  const stickerType =
    e.dataTransfer.getData("text/plain") || draggedStickerType;

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
  };

  sticker.appendChild(img);
  sticker.appendChild(del);

  makeStickerDraggable(sticker);

  canvas.appendChild(sticker);
}

function makeStickerDraggable(sticker) {
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  sticker.addEventListener("mousedown", (e) => {
    isDragging = true;
    sticker.style.zIndex = 9999999;

    offsetX = e.clientX - sticker.offsetLeft;
    offsetY = e.clientY - sticker.offsetTop;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    sticker.style.left = e.clientX - offsetX + "px";
    sticker.style.top = e.clientY - offsetY + "px";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // mobile
  sticker.addEventListener("touchstart", (e) => {
    isDragging = true;
    sticker.style.zIndex = 9999999;

    const t = e.touches[0];
    offsetX = t.clientX - sticker.offsetLeft;
    offsetY = t.clientY - sticker.offsetTop;
  });

  document.addEventListener("touchmove", (e) => {
    if (!isDragging) return;

    const t = e.touches[0];
    sticker.style.left = t.clientX - offsetX + "px";
    sticker.style.top = t.clientY - offsetY + "px";
  });

  document.addEventListener("touchend", () => {
    isDragging = false;
  });
}

function clearAllStickers() {
  document.querySelectorAll(".placed-sticker").forEach((s) => s.remove());
  triggerSparkles();
}
