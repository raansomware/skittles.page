// ============================
// LEON KENNEDY CONSOLE EASTER EGG
// ============================
console.log("%cLEON KENNEDY WAS HERE.", "color: #00ff88; font-size: 20px; font-weight: 900; text-shadow: 0 0 10px #00ff88;");
console.log("%cprotecting nick from los illuminados 💀", "color: #ff1493; font-size: 14px; font-weight: 800;");

// ============================
// PLAYLIST & STATE
// ============================
const playlist = [
  { name: "buttercup", artist: "Jack Stauber", file: "buttercup.mp3" },
  { name: "resonance", artist: "Home", file: "resonance.mp3" }
];
let currentTrack = 0;
let isPlaying = false;
let shimejiEl = null; // Estado del Shimeji

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
  setupEnterScreen();
  setupSecretMode();
  setupButtons();
  setupGuestbook();
  setupAchievements();
  setupAudioSystem();
  setupVisualizer();
  createTerminalUI(); // Aseguramos que inicie
});

// --- SISTEMA SHIMEJI (SILLY.PNG) ---
function createShimeji() {
  if (shimejiEl) return;
  shimejiEl = document.createElement('div');
  shimejiEl.className = 'shimeji';
  document.body.appendChild(shimejiEl);

  setTimeout(() => {
    shimejiEl.style.bottom = '20px';
    triggerSparkles();
    toast("silly ha llegado! ✨");
    unlockAchievement("shimeji summoner");
  }, 100);

  startShimejiAI();
}

function startShimejiAI() {
  setInterval(() => {
    if (!shimejiEl) return;
    const action = Math.random();
    if (action < 0.7) {
      moveShimejiRandomly();
    } else {
      shimejiEl.classList.remove('walking');
    }
  }, 4000);
}

function moveShimejiRandomly() {
  if (!shimejiEl) return;
  const newLeft = Math.random() * (window.innerWidth - 80);
  // Girar según dirección
  shimejiEl.style.transform = newLeft > parseFloat(shimejiEl.style.left || 50) ? 'scaleX(1)' : 'scaleX(-1)';
  shimejiEl.classList.add('walking');
  shimejiEl.style.left = newLeft + 'px';
}

// --- TERMINAL COMANDOS ACTUALIZADOS ---
function runTerminalCommand(cmd) {
  const audio = document.getElementById("audioPlayer");

  if (cmd === "help") {
    terminalPrint("commands:");
    terminalPrint("play - start music");
    terminalPrint("panic - activate panic.exe");
    terminalPrint("summon - call silly (shimeji)");
    terminalPrint("scare - jump scare silly");
    terminalPrint("dismiss - remove silly");
    terminalPrint("leon - summon leon sticker");
    terminalPrint("clear - delete stickers");
    return;
  }

  // Comandos de Shimeji
  if (cmd === "summon") {
    terminalPrint("running silly.exe...");
    createShimeji();
    return;
  }

  if (cmd === "scare") {
    if (!shimejiEl) return terminalPrint("summon silly first!");
    terminalPrint("BOO!");
    shimejiEl.style.transform += ' translateY(-40px) scale(1.3)';
    triggerSparkles();
    setTimeout(() => {
        if(shimejiEl) shimejiEl.style.transform = shimejiEl.style.transform.replace('translateY(-40px) scale(1.3)', '');
    }, 500);
    return;
  }

  if (cmd === "dismiss") {
    if (!shimejiEl) return terminalPrint("shimeji not active.");
    terminalPrint("goodbye silly...");
    shimejiEl.style.bottom = "-100px";
    setTimeout(() => { shimejiEl.remove(); shimejiEl = null; }, 600);
    return;
  }

  // Comandos originales mantenidos
  if (cmd === "play") {
    audio?.play();
    terminalPrint("playing music 🎵");
    return;
  }

  if (cmd === "panic") {
    panicMode();
    return;
  }

  if (cmd === "leon") {
    createPlacedSticker("leon.png", window.innerWidth/2, window.innerHeight/2);
    terminalPrint("leon deployed.");
    return;
  }

  terminalPrint("unknown command. try: help");
}

// ... (El resto de tus funciones como triggerSparkles, setupAudioSystem, etc. se mantienen igual)
