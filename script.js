// =======================
// CYBER SKITTLES SCRIPT
// =======================

// Playlist
const playlist = [
    { name: "buttercup", artist: "Jack Stauber", file: "buttercup.mp3" },
    { name: "resonance", artist: "HOME", file: "resonance.mp3" }
];

let currentTrack = 0;
let isPlaying = false;

// Real audio
const audio = new Audio();
audio.volume = 0.7;

// DOM ready
document.addEventListener("DOMContentLoaded", () => {
    initPlayer();
    loadVisitCount();
    createInitialSparkles();
    startCursorTrail();
    loadSavedStickers();
});

// =======================
// TOAST SYSTEM (NO ALERTS)
// =======================
function toast(msg) {
    const existing = document.querySelector(".toast");
    if (existing) existing.remove();

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

// =======================
// PLAYER
// =======================
function initPlayer() {
    loadSong(currentTrack);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", nextSong);

    document.getElementById("volumeSlider")?.addEventListener("input", (e) => {
        audio.volume = e.target.value / 100;
    });

    document.getElementById("progressSlider")?.addEventListener("input", (e) => {
        if (!audio.duration) return;
        const percent = e.target.value / 100;
        audio.currentTime = percent * audio.duration;
    });
}

function loadSong(index) {
    const song = playlist[index];
    audio.src = song.file;

    document.getElementById("songName").textContent = `${song.name}`;
    document.querySelector(".artist-name").textContent = song.artist;

    document.getElementById("currentTrack").textContent = `Track ${index + 1} of ${playlist.length}`;

    // reset UI
    document.getElementById("progressFill").style.width = "0%";
    document.getElementById("currentTime").textContent = "0:00";
    document.getElementById("duration").textContent = "0:00";

    audio.addEventListener("loadedmetadata", () => {
        document.getElementById("duration").textContent = formatTime(audio.duration);
    }, { once: true });
}

function togglePlay() {
    const playBtn = document.getElementById("playBtn");

    if (!isPlaying) {
        audio.play();
        isPlaying = true;
        playBtn.textContent = "⏸";
        toast("▶ now playing...");
        triggerSparkles();
    } else {
        audio.pause();
        isPlaying = false;
        playBtn.textContent = "▶";
        toast("⏸ paused");
    }
}

function nextSong() {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadSong(currentTrack);
    if (isPlaying) audio.play();
    triggerSparkles();
    toast("⏭ next track");
}

function previousSong() {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadSong(currentTrack);
    if (isPlaying) audio.play();
    triggerSparkles();
    toast("⏮ previous track");
}

function updateProgress() {
    if (!audio.duration) return;

    const percent = (audio.currentTime / audio.duration) * 100;
    document.getElementById("progressFill").style.width = percent + "%";
    document.getElementById("progressSlider").value = percent;

    document.getElementById("currentTime").textContent = formatTime(audio.currentTime);
}

function formatTime(seconds) {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// =======================
// SPARKLES
// =======================
function createInitialSparkles() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => createSparkle(), i * 180);
    }
}

function createSparkle(x = null, y = null) {
    const container = document.querySelector(".sparkles-container");
    const sparkle = document.createElement("div");

    const emojis = ["✨", "💫", "⭐", "🌟", "💥", "🎆", "🎇", "🛸", "⚡"];
    sparkle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    sparkle.className = "sparkle";

    sparkle.style.left = (x ?? Math.random() * window.innerWidth) + "px";
    sparkle.style.top = (y ?? Math.random() * window.innerHeight) + "px";
    sparkle.style.fontSize = (14 + Math.random() * 22) + "px";

    container.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 3200);
}

function triggerSparkles() {
    for (let i = 0; i < 40; i++) {
        setTimeout(() => createSparkle(), i * 25);
    }
}

// cursor trail
function startCursorTrail() {
    document.addEventListener("mousemove", (e) => {
        if (Math.random() < 0.35) {
            createSparkle(e.clientX, e.clientY);
        }
    });
}

// =======================
// BUTTONS
// =======================
function showMessage(msg) {
    toast(msg);
    triggerSparkles();
}

function createRainbow() {
    document.body.style.filter = "hue-rotate(0deg)";
    document.body.style.transition = "0.6s";

    let deg = 0;
    const interval = setInterval(() => {
        deg += 20;
        document.body.style.filter = `hue-rotate(${deg}deg)`;
        if (deg >= 360) {
            clearInterval(interval);
            setTimeout(() => {
                document.body.style.filter = "none";
            }, 300);
        }
    }, 40);

    toast("🌈 RAINBOW MODE ACTIVATED");
    triggerSparkles();
}

function clickLink(platform) {
    toast(`opening ${platform}...`);
    triggerSparkles();
}

// =======================
// VISIT COUNTER
// =======================
function loadVisitCount() {
    let count = localStorage.getItem("visitCount") || 0;
    count = parseInt(count) + 1;
    localStorage.setItem("visitCount", count);
    document.getElementById("visitCount").textContent = count;
}

// =======================
// STICKERS (SAVING SYSTEM)
// =======================
let draggedStickerType = null;

function startStickerDrag(e, stickerType) {
    draggedStickerType = stickerType;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", stickerType);
}

function allowDrop(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
}

function dropSticker(e) {
    e.preventDefault();
    const stickerType = e.dataTransfer.getData("text/plain") || draggedStickerType;
    if (!stickerType) return;

    const x = e.clientX;
    const y = e.clientY;

    createPlacedSticker(stickerType, x, y, true);
    triggerSparkles();
    toast("✨ sticker placed");
}

function createPlacedSticker(stickerType, x, y, shouldSave = false, forcedSize = null) {
    const canvas = document.querySelector(".sticker-canvas");
    const sticker = document.createElement("div");
    sticker.className = "placed-sticker";

    const size = forcedSize ?? (80 + Math.random() * 40);

    sticker.style.width = size + "px";
    sticker.style.height = size + "px";
    sticker.style.left = (x - size / 2) + "px";
    sticker.style.top = (y - size / 2) + "px";

    const img = document.createElement("img");
    img.src = stickerType;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "sticker-delete-btn";
    deleteBtn.textContent = "✕";

    deleteBtn.onclick = (ev) => {
        ev.stopPropagation();
        sticker.remove();
        saveStickers();
        toast("🗑 removed");
    };

    sticker.appendChild(img);
    sticker.appendChild(deleteBtn);

    makeStickerDraggable(sticker);
    canvas.appendChild(sticker);

    if (shouldSave) saveStickers();
}

function makeStickerDraggable(sticker) {
    let offsetX = 0;
    let offsetY = 0;
    let dragging = false;

    sticker.addEventListener("mousedown", (e) => {
        dragging = true;
        offsetX = e.clientX - sticker.offsetLeft;
        offsetY = e.clientY - sticker.offsetTop;
        sticker.style.zIndex = 999;
    });

    document.addEventListener("mousemove", (e) => {
        if (!dragging) return;
        sticker.style.left = (e.clientX - offsetX) + "px";
        sticker.style.top = (e.clientY - offsetY) + "px";
    });

    document.addEventListener("mouseup", () => {
        if (!dragging) return;
        dragging = false;
        sticker.style.zIndex = 55;
        saveStickers();
    });
}

function saveStickers() {
    const stickers = [];
    document.querySelectorAll(".placed-sticker").forEach((sticker) => {
        const img = sticker.querySelector("img");
        stickers.push({
            src: img.src.split("/").pop(),
            left: sticker.style.left,
            top: sticker.style.top,
            width: sticker.style.width,
            height: sticker.style.height
        });
    });

    localStorage.setItem("savedStickers", JSON.stringify(stickers));
}

function loadSavedStickers() {
    const data = localStorage.getItem("savedStickers");
    if (!data) return;

    const stickers = JSON.parse(data);
    stickers.forEach((s) => {
        createPlacedSticker(s.src, parseFloat(s.left), parseFloat(s.top), false, parseFloat(s.width));
    });
}

function clearAllStickers() {
    if (!confirm("clear all stickers??")) return;

    document.querySelectorAll(".placed-sticker").forEach((sticker) => sticker.remove());
    localStorage.removeItem("savedStickers");
    triggerSparkles();
    toast("🧼 cleared");
}

// =======================
// PALETTE
// =======================
let paletteVisible = true;

function togglePalette() {
    const palette = document.querySelector(".sticker-palette");
    const toggleBtn = document.querySelector(".toggle-palette-btn");

    paletteVisible = !paletteVisible;

    if (paletteVisible) {
        palette.classList.remove("hidden");
        toggleBtn.classList.add("hidden");
    } else {
        palette.classList.add("hidden");
        toggleBtn.classList.remove("hidden");
    }
}

// =======================
// RATING
// =======================
function rateMe(rating) {
    const stars = document.querySelectorAll(".star");
    stars.forEach((star, index) => {
        if (index < rating) star.classList.add("active");
        else star.classList.remove("active");
    });

    toast("💛 thankz 4 rating!!");
    triggerSparkles();
}
