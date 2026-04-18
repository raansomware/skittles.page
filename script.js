
```js
// ============================
// PLAYLIST (REAL MP3 PLAYER)
// ============================
const playlist = [
  { name: "buttercup", artist: "Jack Stauber", file: "buttercup.mp3" },
  { name: "resonance", artist: "Home", file: "resonance.mp3" }
];

let currentTrack = 0;
let isPlaying = false;

const audio = document.getElementById("audioPlayer");

// ============================
// INIT
// ============================
document.addEventListener("DOMContentLoaded", () => {
  console.log("SCRIPT LOADED ✅");

  loadSong(currentTrack);
  loadVisitCount();
  createInitialSparkles();
  startCursorTrail();
  setupCustomStickerUpload();

  // buttons
  document.getElementById("sparkleBtn")?.addEventListener("click", triggerSparkles);
  document.getElementById("rainbowBtn")?.addEventListener("click", createRainbow);
  document.getElementById("glitchBtn")?.addEventListener("click", glitchEffect);

  // click to enter screen
  const enterScreen = document.getElementById("enterScreen");
  if (enterScreen) {
    enterScreen.addEventListener("click", () => {
      enterScreen.classList.add("fadeOut");

      setTimeout(() => {
        enterScreen.remove();
        toast("welcome 😈");
        triggerSparkles();
      }, 650);
    });
  }

  // volume slider
  document.getElementById("volumeSlider")?.addEventListener("input", (e) => {
    audio.volume = e.target.value;
  });

  // progress slider
  document.getElementById("progressSlider")?.addEventListener("input", (e) => {
    const percent = e.target.value;
    audio.currentTime = (percent / 100) * audio.duration;
  });

  // update progress live
  audio.addEventListener("timeupdate", updateProgress);

  // auto next song
  audio.addEventListener("ended", () => {
    nextSong();
  });
});

// ============================
// LOAD SONG
// ============================
function loadSong(index) {
  const song = playlist[index];

  audio.src = song.file;

  document.getElementById("songName").textContent = song.name;
  document.getElementById("artistName").textContent = song.artist;
  document.getElementById("trackText").textContent =
    `track ${index + 1} of ${playlist.length}`;

  audio.addEventListener("loadedmetadata", () => {
    document.getElementById("duration").textContent = formatTime(audio.duration);
  });

  updateProgress();
}

// ============================
// MUSIC CONTROLS
// ============================
function togglePlay() {
  if (!audio.src) loadSong(currentTrack);

  if (audio.paused) {
    audio.play();
    isPlaying = true;
    document.getElementById("playBtn").textContent = "⏸";
    toast("playing 🎵");
  } else {
    audio.pause();
    isPlaying = false;
    document.getElementById("playBtn").textContent = "▶";
    toast("paused ⏸");
  }

  triggerSparkles();
}

function nextSong() {
  currentTrack = (currentTrack + 1) % playlist.length;
  loadSong(currentTrack);
  audio.play();
  document.getElementById("playBtn").textContent = "⏸";
  toast("next song 🎶");
  triggerSparkles();
}

function previousSong() {
  currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
  loadSong(currentTrack);
  audio.play();
  document.getElementById("playBtn").textContent = "⏸";
  toast("previous song 🎶");
  triggerSparkles();
}

// ============================
// PROGRESS BAR
// ============================
function updateProgress() {
  if (!audio.duration) return;

  const percent = (audio.currentTime / audio.duration) * 100;

  document.getElementById("progressFill").style.width = percent + "%";
  document.getElementById("progressSlider").value = percent;

  document.getElementById("currentTime").textContent = formatTime(audio.currentTime);
}

// ============================
// FORMAT TIME
// ============================
function formatTime(seconds) {
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
// BUTTON EFFECTS
// ============================
function createRainbow() {
  triggerSparkles();
  document.body.style.transition = "0.6s";
  document.body.style.filter = "hue-rotate(220deg) saturate(2)";

  setTimeout(() => {
    document.body.style.filter = "none";
  }, 650);

  toast("🌈 rainbow mode");
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

  // drop file image
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    const file = e.dataTransfer.files[0];

    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      createPlacedSticker(reader.result, e.clientX, e.clientY);
      triggerSparkles();
      toast("custom sticker added!! 💖");
    };
    reader.readAsDataURL(file);
    return;
  }

  // drop palette sticker
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

  const size = 90;
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
  del.onclick = () => sticker.remove();

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
  document.querySelectorAll(".placed-sticker").forEach((s) => s.remove());
  triggerSparkles();
  toast("stickers cleared");
}

// upload custom sticker
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
```

---
