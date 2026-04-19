// ============================
// PLAYLIST REAL MP3
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
  loadVisitCount();
  createInitialSparkles();
  startCursorTrail();

  setupButtons();
  setupEnterScreen();
  setupSecretMode();
  setupPanicMode();

  setupMusicPlayer();
  setupGuestbook();
  setupAchievements();
  setupMootRequest();
  setupStamps();

  setupSkittlesBot();
  setupQuote();
  setupTabTitles();
  setupKonami();

  renderBadges();
});

// ============================
// ENTER BIOS SCREEN
// ============================

function setupEnterScreen() {
  const screen = document.getElementById("enterScreen");
  const bootLog = document.getElementById("bootLog");
  const enterText = document.getElementById("enterText");

  if (!screen || !bootLog || !enterText) return;

  const bootLines = [
    "booting skittlesOS v6.66...",
    "loading chaos modules...",
    "injecting glitter...",
    "connecting to nick.bot...",
    "checking thomas.png integrity...",
    "warning: vibes unstable",
    "system ready."
  ];

  let i = 0;

  function typeLine() {
    if (i >= bootLines.length) {
      unlockBadge("boot");
      return;
    }

    bootLog.textContent += bootLines[i] + "\n";
    i++;
    setTimeout(typeLine, 350);
  }

  typeLine();

  screen.addEventListener("click", () => {
    screen.classList.add("hidden");
  });
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
// BUTTONS
// ============================

function setupButtons() {
  document.getElementById("sparkleBtn")?.addEventListener("click", () => {
    triggerSparkles();
    toast("sparkles unleashed ✨");
  });

  document.getElementById("rainbowBtn")?.addEventListener("click", () => {
    createRainbow();
  });

  document.getElementById("glitchBtn")?.addEventListener("click", () => {
    glitchEffect();
  });
}

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
// SECRET MODE
// ============================

function setupSecretMode() {
  const banner = document.getElementById("secretBanner");
  if (!banner) return;

  banner.addEventListener("click", () => {
    document.body.classList.toggle("secret-mode");

    if (document.body.classList.contains("secret-mode")) {
      toast("SECRET MODE UNLOCKED 💀");
      unlockAchievement("secret");
      unlockBadge("konami");
    } else {
      toast("secret mode off");
    }
  });
}

// ============================
// PANIC MODE
// ============================

function setupPanicMode() {
  const btn = document.getElementById("panicBtn");
  const overlay = document.getElementById("panicOverlay");

  if (!btn || !overlay) return;

  btn.addEventListener("click", () => {
    overlay.classList.add("show");
    toast("panic mode.");
  });

  overlay.addEventListener("click", () => {
    overlay.classList.remove("show");
    toast("back to chaos");
  });
}

// ============================
// MUSIC PLAYER
// ============================

function setupMusicPlayer() {
  const audio = document.getElementById("audioPlayer");
  if (!audio) return;

  const volumeSlider = document.getElementById("volumeSlider");
  if (volumeSlider) {
    audio.volume = volumeSlider.value;
    volumeSlider.addEventListener("input", () => {
      audio.volume = volumeSlider.value;
    });
  }

  loadTrack(currentTrack);
  setupProgress(audio);
  setupVisualizer();
}

function loadTrack(index) {
  const audio = document.getElementById("audioPlayer");
  if (!audio) return;

  const song = playlist[index];
  audio.src = song.file;

  document.getElementById("songName").textContent = song.name;
  document.getElementById("artistName").textContent = song.artist;
  document.getElementById("trackText").textContent = `track ${index + 1} of ${playlist.length}`;

  audio.load();

  audio.onerror = () => {
    toast("MP3 missing 💀");
  };

  audio.onloadedmetadata = () => {
    document.getElementById("duration").textContent = formatTime(audio.duration);
  };
}

function togglePlay() {
  const audio = document.getElementById("audioPlayer");
  if (!audio) return;

  isPlaying = !isPlaying;
  document.getElementById("playBtn").textContent = isPlaying ? "⏸" : "▶";

  if (isPlaying) {
    audio.play().catch(() => toast("cant autoplay 😭 click again"));
  } else {
    audio.pause();
  }
}

function nextSong() {
  currentTrack = (currentTrack + 1) % playlist.length;
  loadTrack(currentTrack);
  triggerSparkles();
  toast("next song 🎵");

  if (isPlaying) {
    document.getElementById("audioPlayer").play();
  }
}

function previousSong() {
  currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
  loadTrack(currentTrack);
  triggerSparkles();
  toast("previous song 🎵");

  if (isPlaying) {
    document.getElementById("audioPlayer").play();
  }
}

function setupProgress(audio) {
  const slider = document.getElementById("progressSlider");
  const fill = document.getElementById("progressFill");
  const current = document.getElementById("currentTime");

  if (!slider || !fill || !current) return;

  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;

    const percent = (audio.currentTime / audio.duration) * 100;
    slider.value = percent;
    fill.style.width = percent + "%";
    current.textContent = formatTime(audio.currentTime);
  });

  slider.addEventListener("input", (e) => {
    if (!audio.duration) return;
    audio.currentTime = (e.target.value / 100) * audio.duration;
  });

  audio.addEventListener("ended", () => {
    nextSong();
  });
}

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// ============================
// VISUALIZER FAKE
// ============================

let visInterval = null;

function setupVisualizer() {
  const visualizer = document.getElementById("visualizer");
  if (!visualizer) return;

  visualizer.innerHTML = "";

  for (let i = 0; i < 18; i++) {
    const bar = document.createElement("div");
    bar.className = "visBar";
    visualizer.appendChild(bar);
  }

  if (visInterval) clearInterval(visInterval);

  visInterval = setInterval(() => {
    document.querySelectorAll(".visBar").forEach((bar) => {
      bar.style.height = (10 + Math.random() * 45) + "px";
    });
  }, 120);
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
  unlockAchievement("rating");
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

// custom upload
document.getElementById("customStickerInput")?.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) return;

  const reader = new FileReader();
  reader.onload = () => {
    createPlacedSticker(reader.result, window.innerWidth / 2, window.innerHeight / 2);
    triggerSparkles();
    toast("custom sticker added!! 💖");
  };
  reader.readAsDataURL(file);
});

// ============================
// GUESTBOOK
// ============================

function setupGuestbook() {
  const btn = document.getElementById("guestSubmit");
  const list = document.getElementById("guestbookList");

  if (!btn || !list) return;

  const saved = JSON.parse(localStorage.getItem("guestbook") || "[]");

  function render() {
    list.innerHTML = "";
    saved.slice(-15).reverse().forEach((g) => {
      const div = document.createElement("div");
      div.className = "guestEntry";
      div.innerHTML = `<span>${g.name}</span>: ${g.msg}`;
      list.appendChild(div);
    });
  }

  render();

  btn.addEventListener("click", () => {
    const name = document.getElementById("guestName").value.trim();
    const msg = document.getElementById("guestMsg").value.trim();

    if (!name || !msg) {
      toast("fill both 😭");
      return;
    }

    saved.push({ name, msg });
    localStorage.setItem("guestbook", JSON.stringify(saved));

    document.getElementById("guestName").value = "";
    document.getElementById("guestMsg").value = "";

    toast("signed!!");
    triggerSparkles();
    unlockAchievement("guestbook");
    render();
  });
}

// ============================
// ACHIEVEMENTS
// ============================

const achievements = [
  { id: "secret", name: "entered secret mode 😈" },
  { id: "rating", name: "rated the page ⭐" },
  { id: "guestbook", name: "signed guestbook ✍️" },
  { id: "moot", name: "requested moots 💌" },
  { id: "stamps", name: "collected all stamps 📌" },
  { id: "konami", name: "konami code gamer 🎮" }
];

let unlockedAchievements = JSON.parse(localStorage.getItem("unlockedAchievements") || "[]");

function unlockAchievement(id) {
  if (!unlockedAchievements.includes(id)) {
    unlockedAchievements.push(id);
    localStorage.setItem("unlockedAchievements", JSON.stringify(unlockedAchievements));
    renderAchievements();
    toast("achievement unlocked!!");
  }
}

function setupAchievements() {
  renderAchievements();
}

function renderAchievements() {
  const list = document.getElementById("achievementsList");
  if (!list) return;

  list.innerHTML = "";

  achievements.forEach((a) => {
    const div = document.createElement("div");
    div.className = "achievement";

    if (!unlockedAchievements.includes(a.id)) {
      div.classList.add("locked");
      div.textContent = "??? locked";
    } else {
      div.textContent = a.name;
    }

    list.appendChild(div);
  });
}

// ============================
// MOOT REQUEST
// ============================

function setupMootRequest() {
  const btn = document.getElementById("mootRequestBtn");
  const countEl = document.getElementById("mootCount");
  if (!btn || !countEl) return;

  let count = parseInt(localStorage.getItem("mootRequests") || "0");
  countEl.textContent = count;

  btn.addEventListener("click", () => {
    count++;
    localStorage.setItem("mootRequests", count);
    countEl.textContent = count;

    toast("request sent 💌");
    triggerSparkles();
    unlockAchievement("moot");
  });
}

// ============================
// STAMPS
// ============================

function setupStamps() {
  const stamps = document.querySelectorAll(".stamp");
  const counter = document.getElementById("stampCount");

  let collected = JSON.parse(localStorage.getItem("collectedStamps") || "[]");

  function updateCount() {
    if (counter) counter.textContent = collected.length;
  }

  stamps.forEach((stamp) => {
    const id = stamp.dataset.stamp;

    if (collected.includes(id)) {
      stamp.classList.add("collected");
    }

    stamp.addEventListener("click", () => {
      if (!collected.includes(id)) {
        collected.push(id);
        localStorage.setItem("collectedStamps", JSON.stringify(collected));
        stamp.classList.add("collected");
        toast("stamp collected!");
        triggerSparkles();
        updateCount();

        if (collected.length >= 4) {
          unlockAchievement("stamps");
        }
      }
    });
  });

  updateCount();
}

// ============================
// QUOTE
// ============================

function setupQuote() {
  const quotes = [
    "i am literally just pixels",
    "ur vibes are suspicious",
    "if u see this u owe me a moot request",
    "do not trust thomas.png",
    "the glitter is inside the walls",
    "leon kennedy is protecting this page",
    "this site is 90% chaos 10% sleep deprivation",
    "warning: excessive cuteness detected",
    "nick.bot is online and unstable"
  ];

  const quoteText = document.getElementById("quoteText");
  if (!quoteText) return;

  quoteText.textContent = quotes[Math.floor(Math.random() * quotes.length)];
}

// ============================
// TAB TITLE CHANGER
// ============================

function setupTabTitles() {
  const titles = [
    "skittles.lol fan",
    "nick is watching",
    "come back rn",
    "error.exe",
    "moot request pending",
    "leon is here",
    "do not refresh",
    "glitter injection"
  ];

  let titleIndex = 0;

  setInterval(() => {
    document.title = titles[titleIndex % titles.length];
    titleIndex++;
  }, 2000);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      document.title = "COME BACK.";
    } else {
      document.title = "welcome back loser ♡";
    }
  });
}

// ============================
// FAKE IP GRABBER
// ============================

function fakeIPGrab() {
  toast("logging ip...");
  setTimeout(() => {
    toast("IP: 127.0.0.1 (jk)");
    unlockBadge("ip");
  }, 900);
}

window.fakeIPGrab = fakeIPGrab;

// ============================
// KONAMI CODE
// ============================

function setupKonami() {
  const konami = [
    "ArrowUp","ArrowUp",
    "ArrowDown","ArrowDown",
    "ArrowLeft","ArrowRight",
    "ArrowLeft","ArrowRight",
    "b","a"
  ];

  let konamiIndex = 0;

  document.addEventListener("keydown", (e) => {
    if (e.key === konami[konamiIndex]) {
      konamiIndex++;

      if (konamiIndex === konami.length) {
        toast("KONAMI UNLOCKED 💀");
        unlockAchievement("konami");
        unlockBadge("konami");
        triggerSparkles();
        glitchEffect();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });
}

// ============================
// BADGES
// ============================

const allBadges = [
  { id: "ip", label: "IP logged 😈" },
  { id: "konami", label: "konami unlocked 🎮" },
  { id: "npc", label: "nick.bot approved 🤖" },
  { id: "boot", label: "booted skittlesOS 💻" }
];

let unlockedBadges = JSON.parse(localStorage.getItem("unlockedBadges") || "[]");

function unlockBadge(id) {
  if (!unlockedBadges.includes(id)) {
    unlockedBadges.push(id);
    localStorage.setItem("unlockedBadges", JSON.stringify(unlockedBadges));
    renderBadges();
    toast("badge unlocked!!");
  }
}

function renderBadges() {
  const list = document.getElementById("badgesList");
  if (!list) return;

  list.innerHTML = "";

  allBadges.forEach((b) => {
    const div = document.createElement("div");
    div.className = "badgeItem";
    div.textContent = b.label;

    if (unlockedBadges.includes(b.id)) {
      div.classList.add("unlocked");
    }

    list.appendChild(div);
  });
}

// ============================
// SKITTLES BOT - NETLIFY FIXED
// ============================
async function askSkittles(text) {
  if (!text || text.trim() === "") return;
  const npcChat = document.getElementById("npcChat");
  const loadingId = "loading-" + Date.now();
  
  try {
    const loadingLine = document.createElement("div");
    loadingLine.id = loadingId;
    loadingLine.className = "npcLine";
    loadingLine.innerHTML = `<b class="skittles-label">skittles:</b> ...`;
    npcChat.appendChild(loadingLine);
    npcChat.scrollTop = npcChat.scrollHeight;

    // IMPORTANTE: URL relativa para que el redireccionamiento de Netlify funcione
const response = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text.trim() })
    });

    const data = await response.json();
    document.getElementById(loadingId)?.remove();

    // Buscamos la respuesta en el formato que configuramos en la función de Netlify
    const finalMsg = data.reply || "*stares blankly*";
    
    addNPCLine("skittles", finalMsg, true);
    triggerSparkles();

  } catch (error) {
    document.getElementById(loadingId)?.remove();
    console.error("Bot error:", error);
    addNPCLine("skittles", "*glitches* sorry thomas, my brain is candy floss rn", true);
  }
}

function addNPCLine(sender, msg, isSkittles = false) {
  const npcChat = document.getElementById("npcChat");
  if (!npcChat) return;
  const line = document.createElement("div");
  line.className = "npcLine";
  const labelClass = isSkittles ? 'skittles-label' : 'user-label';
  line.innerHTML = `<b class="${labelClass}">${sender}:</b> ${msg}`;
  npcChat.appendChild(line);
  npcChat.scrollTop = npcChat.scrollHeight;
}

function setupSkittlesBot() {
  const input = document.getElementById("npcInput");
  const send = document.getElementById("npcSend");
  if (!input || !send) return;

  send.onclick = () => {
    const m = input.value.trim();
    if (m) {
      addNPCLine("you", m);
      askSkittles(m);
      input.value = "";
    }
  };
  input.onkeydown = (e) => { if (e.key === "Enter") send.click(); };
}

// ============================
// OTROS (STUBS)
// ============================
function setupSecretMode() {} 
function setupPanicMode() {}
function setupGuestbook() {}
function setupAchievements() {}
function setupMootRequest() {}
function setupStamps() {}
function setupQuote() {}
function setupTabTitles() {}
function setupKonami() {}
function renderBadges() {}
function unlockBadge(id) {}
