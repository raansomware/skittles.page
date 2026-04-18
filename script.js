// ============================
// PLAYLIST (REAL MP3)
// ============================
const playlist = [
  { name: "buttercup", artist: "Jack Stauber", file: "buttercup.mp3" },
  { name: "resonance", artist: "Home", file: "resonance.mp3" }
];

let currentTrack = 0;
let isPlaying = false;
let draggedStickerType = null;

// achievement counters
let sparkleClicks = parseInt(localStorage.getItem("sparkleClicks") || "0");
let rainbowClicks = parseInt(localStorage.getItem("rainbowClicks") || "0");
let glitchClicks = parseInt(localStorage.getItem("glitchClicks") || "0");

// achievements data
const achievements = {
  sparkle10: { name: "sparkle addict", desc: "click sparkles 10 times", unlocked: false },
  rainbow5: { name: "rainbow demon", desc: "use rainbow mode 5 times", unlocked: false },
  glitch5: { name: "glitch gremlin", desc: "use glitch 5 times", unlocked: false },
  guestbook: { name: "guestbook signer", desc: "sign the guestbook", unlocked: false },
  secret: { name: "secret mode", desc: "clicked thomas banner", unlocked: false }
};

// ============================
// INIT
// ============================
document.addEventListener("DOMContentLoaded", () => {
  setupEnterScreen();
  setupButtons();
  setupMusic();
  setupStickers();
  setupCustomStickerUpload();
  loadVisitCount();
  createInitialSparkles();

  loadGuestbook();
  loadAchievements();
  setupAchievementTracking();

  setupSecretBanner();
});

// ============================
// CLICK TO ENTER
// ============================
function setupEnterScreen() {
  const enterScreen = document.getElementById("enterScreen");
  if (!enterScreen) return;

  enterScreen.addEventListener("click", () => {
    enterScreen.classList.add("fadeOut");
    setTimeout(() => enterScreen.remove(), 650);
  });
}

// ============================
// SECRET MODE (BANNER CLICK)
// ============================
function setupSecretBanner() {
  const banner = document.getElementById("secretBanner");
  if (!banner) return;

  banner.addEventListener("click", () => {
    document.body.classList.toggle("secretMode");

    if (document.body.classList.contains("secretMode")) {
      toast("🩸 SECRET MODE ENABLED");
      unlockAchievement("secret");
    } else {
      toast("secret mode off");
    }

    triggerSparkles();
  });
}

// ============================
// BUTTONS
// ============================
function setupButtons() {
  document.getElementById("sparkleBtn")?.addEventListener("click", () => {
    triggerSparkles();
    toast("✨ sparkles");
  });

  document.getElementById("rainbowBtn")?.addEventListener("click", () => {
    createRainbow();
  });

  document.getElementById("glitchBtn")?.addEventListener("click", () => {
    glitchEffect();
  });
}

// ============================
// MUSIC PLAYER REAL
// ============================
function setupMusic() {
  const audio = document.getElementById("audioPlayer");
  if (!audio) return;

  audio.volume = 0.7;

  loadTrack();

  document.getElementById("volumeSlider")?.addEventListener("input", (e) => {
    audio.volume = parseFloat(e.target.value);
  });

  document.getElementById("progressSlider")?.addEventListener("input", (e) => {
    if (!audio.duration) return;
    audio.currentTime = (parseFloat(e.target.value) / 100) * audio.duration;
  });

  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;

    const percent = (audio.currentTime / audio.duration) * 100;
    document.getElementById("progressFill").style.width = percent + "%";
    document.getElementById("progressSlider").value = percent;

    document.getElementById("currentTime").textContent = formatTime(audio.currentTime);
    document.getElementById("duration").textContent = formatTime(audio.duration);
  });

  audio.addEventListener("ended", () => {
    nextSong();
  });

  audio.addEventListener("error", () => {
    document.getElementById("songName").textContent = "MP3 missing";
    document.getElementById("artistName").textContent = "file not found 💀";

    document.getElementById("duration").textContent = "0:00";
    document.getElementById("currentTime").textContent = "0:00";

    document.getElementById("progressFill").style.width = "0%";
    document.getElementById("progressSlider").value = 0;

    toast("❌ MP3 missing (check filename)");
  });
}

function loadTrack() {
  const audio = document.getElementById("audioPlayer");
  const song = playlist[currentTrack];

  document.getElementById("songName").textContent = song.name;
  document.getElementById("artistName").textContent = song.artist;
  document.getElementById("trackText").textContent =
    `track ${currentTrack + 1} of ${playlist.length}`;

  audio.src = song.file;
}

function togglePlay() {
  const audio = document.getElementById("audioPlayer");
  if (!audio) return;

  isPlaying = !isPlaying;

  document.getElementById("playBtn").textContent = isPlaying ? "⏸" : "▶";

  if (isPlaying) {
    audio.play();
    toast("▶ playing");
  } else {
    audio.pause();
    toast("⏸ paused");
  }
}

function nextSong() {
  const audio = document.getElementById("audioPlayer");

  currentTrack = (currentTrack + 1) % playlist.length;
  loadTrack();

  if (isPlaying) audio.play();

  triggerSparkles();
  toast("next song 🎵");
}

function previousSong() {
  const audio = document.getElementById("audioPlayer");

  currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
  loadTrack();

  if (isPlaying) audio.play();

  triggerSparkles();
  toast("previous song 🎵");
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
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

  const emojisNormal = ["✨", "💫", "⭐", "🌟", "💥", "🎆", "🎇", "💖", "🌈"];
  const emojisSecret = ["🩸", "🔥", "☠️", "🖤", "💀", "🔪"];

  const emojis = document.body.classList.contains("secretMode")
    ? emojisSecret
    : emojisNormal;

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
// RAINBOW + GLITCH
// ============================
function createRainbow() {
  triggerSparkles();

  if (document.body.classList.contains("secretMode")) {
    toast("🩸 no rainbow in secret mode");
    return;
  }

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
function setupStickers() {
  document.addEventListener("dragover", (e) => e.preventDefault());

  document.addEventListener("drop", (e) => {
    e.preventDefault();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = () => {
        createPlacedSticker(reader.result, e.clientX, e.clientY);
      };
      reader.readAsDataURL(file);
      return;
    }

    const stickerType = e.dataTransfer.getData("text/plain") || draggedStickerType;
    if (!stickerType) return;

    createPlacedSticker(stickerType, e.clientX, e.clientY);
  });
}

function startStickerDrag(e, stickerType) {
  draggedStickerType = stickerType;
  e.dataTransfer.setData("text/plain", stickerType);
  e.dataTransfer.effectAllowed = "copy";
}

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

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "sticker-delete-btn";
  deleteBtn.textContent = "✕";

  deleteBtn.onclick = (ev) => {
    ev.stopPropagation();
    sticker.remove();
    toast("sticker deleted");
  };

  sticker.appendChild(img);
  sticker.appendChild(deleteBtn);
  canvas.appendChild(sticker);

  makeStickerDraggable(sticker);

  triggerSparkles();
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

// ============================
// CUSTOM STICKER UPLOAD
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
      toast("custom sticker added!! 💖");
    };

    reader.readAsDataURL(file);
  });
}

// ============================
// GUESTBOOK
// ============================
function loadGuestbook() {
  const list = document.getElementById("guestbookList");
  if (!list) return;

  list.innerHTML = "";

  const entries = JSON.parse(localStorage.getItem("guestbookEntries") || "[]");

  entries.reverse().forEach((entry) => {
    const div = document.createElement("div");
    div.className = "guestEntry";

    div.innerHTML = `
      <div class="guestTop">
        <span>${entry.name}</span>
        <span>${entry.date}</span>
      </div>
      <div class="guestMsg">${entry.msg}</div>
    `;

    list.appendChild(div);
  });

  document.getElementById("guestSubmit")?.addEventListener("click", () => {
    const name = document.getElementById("guestName").value.trim();
    const msg = document.getElementById("guestMsg").value.trim();

    if (!name || !msg) {
      toast("fill name + message 😭");
      return;
    }

    addGuestbookEntry(name, msg);

    document.getElementById("guestName").value = "";
    document.getElementById("guestMsg").value = "";
  });
}

function addGuestbookEntry(name, msg) {
  const entries = JSON.parse(localStorage.getItem("guestbookEntries") || "[]");

  entries.push({
    name,
    msg,
    date: new Date().toLocaleDateString()
  });

  localStorage.setItem("guestbookEntries", JSON.stringify(entries));
  loadGuestbook();

  triggerSparkles();
  toast("signed guestbook 💖");

  unlockAchievement("guestbook");
}

// ============================
// ACHIEVEMENTS
// ============================
function loadAchievements() {
  const saved = JSON.parse(localStorage.getItem("achievementsUnlocked") || "{}");

  for (const key in achievements) {
    if (saved[key]) achievements[key].unlocked = true;
  }

  renderAchievements();
}

function renderAchievements() {
  const box = document.getElementById("achievementsList");
  if (!box) return;

  box.innerHTML = "";

  for (const key in achievements) {
    const ach = achievements[key];

    const div = document.createElement("div");
    div.className = "achievement" + (ach.unlocked ? "" : " locked");

    div.innerHTML = `
      <div>
        ${ach.name}<br>
        <span>${ach.desc}</span>
      </div>
      <div>${ach.unlocked ? "✅" : "🔒"}</div>
    `;

    box.appendChild(div);
  }
}

function unlockAchievement(key) {
  if (!achievements[key]) return;
  if (achievements[key].unlocked) return;

  achievements[key].unlocked = true;

  const saved = JSON.parse(localStorage.getItem("achievementsUnlocked") || "{}");
  saved[key] = true;
  localStorage.setItem("achievementsUnlocked", JSON.stringify(saved));

  renderAchievements();
  toast("🏆 achievement unlocked: " + achievements[key].name);
  triggerSparkles();
}

function setupAchievementTracking() {
  document.getElementById("sparkleBtn")?.addEventListener("click", () => {
    sparkleClicks++;
    localStorage.setItem("sparkleClicks", sparkleClicks);

    if (sparkleClicks >= 10) unlockAchievement("sparkle10");
  });

  document.getElementById("rainbowBtn")?.addEventListener("click", () => {
    rainbowClicks++;
    localStorage.setItem("rainbowClicks", rainbowClicks);

    if (rainbowClicks >= 5) unlockAchievement("rainbow5");
  });

  document.getElementById("glitchBtn")?.addEventListener("click", () => {
    glitchClicks++;
    localStorage.setItem("glitchClicks", glitchClicks);

    if (glitchClicks >= 5) unlockAchievement("glitch5");
  });
}
