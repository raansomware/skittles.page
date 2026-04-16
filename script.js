// =======================
// SKITTLES OS - CYBER GUI
// =======================

const clickSound = new Audio("click.mp3");
clickSound.volume = 0.4;

function playClick() {
  try {
    clickSound.currentTime = 0;
    clickSound.play();
  } catch {}
}

// toast popup
function toast(msg) {
  const old = document.querySelector(".toast");
  if (old) old.remove();

  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);

  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transition = "0.4s";
  }, 1500);

  setTimeout(() => t.remove(), 2000);
}

// visits
function loadVisitCount() {
  let count = localStorage.getItem("visitCount") || 0;
  count = parseInt(count) + 1;
  localStorage.setItem("visitCount", count);
  document.getElementById("visitCount").textContent = count;
}

// sparkles
function createSparkle(x = null, y = null) {
  const container = document.querySelector(".sparkles-container");
  const sparkle = document.createElement("div");

  const emojis = ["✨", "💫", "⭐", "🌟", "⚡", "🛸", "💥", "🎇", "🎆"];
  sparkle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  sparkle.className = "sparkle";

  sparkle.style.left = (x ?? Math.random() * window.innerWidth) + "px";
  sparkle.style.top = (y ?? Math.random() * window.innerHeight) + "px";
  sparkle.style.fontSize = (14 + Math.random() * 22) + "px";

  container.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 3200);
}

function triggerSparkles() {
  for (let i = 0; i < 35; i++) {
    setTimeout(() => createSparkle(), i * 20);
  }
}

function startCursorTrail() {
  document.addEventListener("mousemove", (e) => {
    if (Math.random() < 0.35) createSparkle(e.clientX, e.clientY);
  });
}

// glitch
function glitch() {
  playClick();
  toast("🛸 glitch mode");
  triggerSparkles();

  document.body.style.transition = "0.1s";
  let ticks = 0;

  const interval = setInterval(() => {
    ticks++;
    document.body.style.filter = `hue-rotate(${Math.random() * 360}deg) contrast(1.3) saturate(1.4)`;
    if (ticks > 14) {
      clearInterval(interval);
      document.body.style.filter = "none";
      document.body.style.transition = "0.6s";
    }
  }, 80);
}

// rainbow
function createRainbow() {
  playClick();
  toast("🌈 rainbow mode activated");
  triggerSparkles();

  let deg = 0;
  const interval = setInterval(() => {
    deg += 25;
    document.body.style.filter = `hue-rotate(${deg}deg)`;
    if (deg >= 360) {
      clearInterval(interval);
      setTimeout(() => {
        document.body.style.filter = "none";
      }, 250);
    }
  }, 45);
}

// windows system
let zIndexCounter = 100;

function bringToFront(win) {
  zIndexCounter++;
  win.style.zIndex = zIndexCounter;
}

function openWindow(id) {
  playClick();
  const win = document.getElementById(id);
  win.classList.remove("hidden");
  bringToFront(win);
  toast("opened: " + id);
  saveWindows();
}

function closeWindow(id) {
  playClick();
  document.getElementById(id).classList.add("hidden");
  toast("closed");
  saveWindows();
}

function minimizeWindow(id) {
  playClick();
  document.getElementById(id).classList.add("hidden");
  toast("minimized");
  saveWindows();
}

function pinWindow(id) {
  playClick();
  const win = document.getElementById(id);
  win.classList.toggle("pinned");
  toast(win.classList.contains("pinned") ? "📌 pinned" : "unpinned");
  saveWindows();
}

function makeWindowsInteractive() {
  document.querySelectorAll(".window").forEach(win => {
    const bar = win.querySelector(".titlebar");
    const resizer = win.querySelector(".resizer");

    win.addEventListener("mousedown", () => bringToFront(win));

    // drag
    let drag = false;
    let offsetX = 0;
    let offsetY = 0;

    bar.addEventListener("mousedown", (e) => {
      if (win.classList.contains("pinned")) return;
      drag = true;
      bringToFront(win);
      offsetX = e.clientX - win.offsetLeft;
      offsetY = e.clientY - win.offsetTop;
    });

    document.addEventListener("mousemove", (e) => {
      if (!drag) return;
      win.style.left = (e.clientX - offsetX) + "px";
      win.style.top = (e.clientY - offsetY) + "px";
    });

    document.addEventListener("mouseup", () => {
      if (!drag) return;
      drag = false;
      saveWindows();
    });

    // resize
    let resizing = false;
    let startW = 0;
    let startH = 0;
    let startX = 0;
    let startY = 0;

    resizer.addEventListener("mousedown", (e) => {
      resizing = true;
      bringToFront(win);
      startW = win.offsetWidth;
      startH = win.offsetHeight;
      startX = e.clientX;
      startY = e.clientY;
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (!resizing) return;
      win.style.width = (startW + (e.clientX - startX)) + "px";
      win.style.height = (startH + (e.clientY - startY)) + "px";
    });

    document.addEventListener("mouseup", () => {
      if (!resizing) return;
      resizing = false;
      saveWindows();
    });
  });
}

function saveWindows() {
  const windows = [];

  document.querySelectorAll(".window").forEach(win => {
    windows.push({
      id: win.id,
      left: win.style.left,
      top: win.style.top,
      width: win.style.width,
      height: win.style.height,
      hidden: win.classList.contains("hidden"),
      pinned: win.classList.contains("pinned"),
      z: win.style.zIndex
    });
  });

  localStorage.setItem("skittlesWindows", JSON.stringify(windows));
}

function loadWindows() {
  const data = localStorage.getItem("skittlesWindows");

  document.querySelectorAll(".window").forEach(win => {
    win.style.left = win.dataset.defaultX + "px";
    win.style.top = win.dataset.defaultY + "px";
  });

  if (!data) return;

  JSON.parse(data).forEach(saved => {
    const win = document.getElementById(saved.id);
    if (!win) return;

    if (saved.left) win.style.left = saved.left;
    if (saved.top) win.style.top = saved.top;
    if (saved.width) win.style.width = saved.width;
    if (saved.height) win.style.height = saved.height;
    if (saved.z) win.style.zIndex = saved.z;

    if (saved.hidden) win.classList.add("hidden");
    else win.classList.remove("hidden");

    if (saved.pinned) win.classList.add("pinned");
    else win.classList.remove("pinned");
  });
}

// stickers
let draggedStickerType = null;

function startStickerDrag(e, stickerType) {
  playClick();
  draggedStickerType = stickerType;
  e.dataTransfer.effectAllowed = "copy";
  e.dataTransfer.setData("text/plain", stickerType);
}

function allowDrop(e) {
  e.preventDefault();
}

function dropSticker(e) {
  e.preventDefault();
  const stickerType = e.dataTransfer.getData("text/plain") || draggedStickerType;
  if (!stickerType) return;

  const canvas = document.getElementById("stickerCanvas");
  const rect = canvas.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  createPlacedSticker(stickerType, x, y, true);
  toast("✨ sticker dropped");
  triggerSparkles();
}

function createPlacedSticker(stickerType, x, y, shouldSave = false, forcedSize = null) {
  const canvas = document.getElementById("stickerCanvas");
  const sticker = document.createElement("div");
  sticker.className = "placed-sticker";

  const size = forcedSize ?? (80 + Math.random() * 60);

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
    playClick();
    ev.stopPropagation();
    sticker.remove();
    saveStickers();
    toast("🗑 deleted");
  };

  sticker.appendChild(img);
  sticker.appendChild(del);

  makeStickerDraggable(sticker);
  canvas.appendChild(sticker);

  if (shouldSave) saveStickers();
}

function makeStickerDraggable(sticker) {
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  sticker.addEventListener("mousedown", (e) => {
    dragging = true;
    sticker.style.zIndex = 999999;
    offsetX = e.clientX - sticker.offsetLeft;
    offsetY = e.clientY - sticker.offsetTop;
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    sticker.style.left = (e.clientX - offsetX) + "px";
    sticker.style.top = (e.clientY - offsetY) + "px";
  });

  document.addEventListener("mouseup", () => {
    if (!dragging) return;
    dragging = false;
    saveStickers();
  });
}

function saveStickers() {
  const stickers = [];
  document.querySelectorAll(".placed-sticker").forEach(s => {
    const img = s.querySelector("img");
    stickers.push({
      src: img.src.split("/").pop(),
      left: s.style.left,
      top: s.style.top,
      width: s.style.width,
      height: s.style.height
    });
  });

  localStorage.setItem("skittlesStickers", JSON.stringify(stickers));
}

function loadStickers() {
  const data = localStorage.getItem("skittlesStickers");
  if (!data) return;

  JSON.parse(data).forEach(s => {
    createPlacedSticker(s.src, parseFloat(s.left), parseFloat(s.top), false, parseFloat(s.width));
  });
}

function clearAllStickers() {
  playClick();
  if (!confirm("clear all stickers?")) return;

  document.querySelectorAll(".placed-sticker").forEach(s => s.remove());
  localStorage.removeItem("skittlesStickers");
  toast("🧼 cleared");
  triggerSparkles();
}

// rating
function rateMe(rating) {
  playClick();
  document.querySelectorAll(".star").forEach((star, i) => {
    if (i < rating) star.classList.add("active");
    else star.classList.remove("active");
  });

  toast("💛 thankz 4 rating!!");
  triggerSparkles();
}

// music player real
const playlist = [
  { name: "buttercup", artist: "Jack Stauber", file: "buttercup.mp3" },
  { name: "resonance", artist: "HOME", file: "resonance.mp3" }
];

let currentTrack = 0;
let isPlaying = false;

const audio = new Audio();
audio.volume = 0.7;

function loadSong(index) {
  const song = playlist[index];
  audio.src = song.file;

  document.getElementById("songName").textContent = song.name;
  document.getElementById("artistName").textContent = song.artist;
  document.getElementById("currentTrack").textContent = `Track ${index + 1} of ${playlist.length}`;

  document.getElementById("progressFill").style.width = "0%";
  document.getElementById("currentTime").textContent = "0:00";
  document.getElementById("duration").textContent = "0:00";

  audio.addEventListener("loadedmetadata", () => {
    document.getElementById("duration").textContent = formatTime(audio.duration);
  }, { once: true });
}

function togglePlay() {
  playClick();
  const btn = document.getElementById("playBtn");

  if (!isPlaying) {
    audio.play();
    isPlaying = true;
    btn.textContent = "⏸";
    toast("▶ playing");
  } else {
    audio.pause();
    isPlaying = false;
    btn.textContent = "▶";
    toast("⏸ paused");
  }
}

function nextSong() {
  playClick();
  currentTrack = (currentTrack + 1) % playlist.length;
  loadSong(currentTrack);
  if (isPlaying) audio.play();
  triggerSparkles();
  toast("⏭ next track");
}

function previousSong() {
  playClick();
  currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
  loadSong(currentTrack);
  if (isPlaying) audio.play();
  triggerSparkles();
  toast("⏮ previous track");
}

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;

  const percent = (audio.currentTime / audio.duration) * 100;
  document.getElementById("progressFill").style.width = percent + "%";
  document.getElementById("progressSlider").value = percent;

  document.getElementById("currentTime").textContent = formatTime(audio.currentTime);
});

audio.addEventListener("ended", () => nextSong());

function formatTime(seconds) {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// init
document.addEventListener("DOMContentLoaded", () => {
  loadVisitCount();
  startCursorTrail();

  loadWindows();
  makeWindowsInteractive();

  loadStickers();

  loadSong(currentTrack);

  document.getElementById("volumeSlider")?.addEventListener("input", (e) => {
    audio.volume = e.target.value / 100;
  });

  document.getElementById("progressSlider")?.addEventListener("input", (e) => {
    if (!audio.duration) return;
    audio.currentTime = (e.target.value / 100) * audio.duration;
  });

  toast("👾 welcome to skittles OS");
  triggerSparkles();
});
