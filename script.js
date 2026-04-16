// Playlist data
const playlist = [
    { name: 'buttercup', artist: 'Jack Stauber', file: 'buttercup.mp3', duration: 180 },
    { name: 'resonance', artist: 'Home', file: 'resonance.mp3', duration: 240 }
];

let currentTrack = 0;
let isPlaying = false;
let currentTime = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializePlayer();
    loadVisitCount();
    createInitialSparkles();
});

// Initialize player
function initializePlayer() {
    updateSongDisplay();
    updateTrackDisplay();
}

// Update song display
function updateSongDisplay() {
    const song = playlist[currentTrack];
    document.getElementById('songName').textContent = song.name + ' - ' + song.artist + '!';
    document.getElementById('duration').textContent = formatTime(song.duration);
}

// Update track display
function updateTrackDisplay() {
    document.getElementById('currentTrack').textContent = `Track ${currentTrack + 1} of ${playlist.length}`;
}

// Toggle play
function togglePlay() {
    isPlaying = !isPlaying;
    const playBtn = document.getElementById('playBtn');
    playBtn.textContent = isPlaying ? '⏸' : '▶';
    
    if (isPlaying) {
        simulatePlayback();
    }
}

// Simulate playback
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

// Update progress
function updateProgress() {
    const song = playlist[currentTrack];
    const percent = (currentTime / song.duration) * 100;
    document.getElementById('progressFill').style.width = percent + '%';
    document.getElementById('progressSlider').value = percent;
    document.getElementById('currentTime').textContent = formatTime(currentTime);
}

// Format time
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Next song
function nextSong() {
    currentTrack = (currentTrack + 1) % playlist.length;
    currentTime = 0;
    updateSongDisplay();
    updateTrackDisplay();
    updateProgress();
    triggerSparkles();
}

// Previous song
function previousSong() {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    currentTime = 0;
    updateSongDisplay();
    updateTrackDisplay();
    updateProgress();
    triggerSparkles();
}

// Progress slider
document.getElementById('progressSlider')?.addEventListener('input', (e) => {
    const song = playlist[currentTrack];
    currentTime = (e.target.value / 100) * song.duration;
    updateProgress();
});

// Volume slider
document.getElementById('volumeSlider')?.addEventListener('input', (e) => {
    console.log('🔊 Volume:', e.target.value + '%');
});

// Create initial sparkles
function createInitialSparkles() {
    const container = document.querySelector('.sparkles-container');
    for (let i = 0; i < 15; i++) {
        setTimeout(() => createSparkle(), i * 200);
    }
}

// Create single sparkle
function createSparkle() {
    const container = document.querySelector('.sparkles-container');
    const sparkle = document.createElement('div');
    const emojis = ['✨', '💫', '⭐', '🌟', '💥', '🎆', '🎇'];
    
    sparkle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    sparkle.className = 'sparkle';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.fontSize = (12 + Math.random() * 24) + 'px';
    sparkle.style.animation = `sparkleFloat ${2 + Math.random() * 2}s ease-out forwards`;
    
    container.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 4000);
}

// Trigger sparkles on click
function triggerSparkles() {
    const container = document.querySelector('.sparkles-container');
    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            const emojis = ['✨', '💫', '⭐', '🌟', '💥', '🎆', '🎇', '🌈', '💖'];
            
            sparkle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            sparkle.className = 'sparkle';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.fontSize = (16 + Math.random() * 28) + 'px';
            sparkle.style.animation = `sparkleFloat ${1.5 + Math.random() * 2}s ease-out forwards`;
            
            container.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 3500);
        }, i * 30);
    }
}

// Show message
function showMessage(msg) {
    alert(msg);
    triggerSparkles();
}

// Create rainbow effect
function createRainbow() {
    const container = document.querySelector('.container');
    container.style.animation = 'rainbowFlash 0.6s';
    setTimeout(() => {
        container.style.animation = 'slideIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }, 600);
    triggerSparkles();
    showMessage('🌈 RAINBOW MODE ACTIVATED! 🌈');
}

// Click link
function clickLink(platform) {
    showMessage(`Opening ${platform}! 🚀`);
}

// Visit counter
function loadVisitCount() {
    let count = localStorage.getItem('visitCount') || 0;
    count = parseInt(count) + 1;
    localStorage.setItem('visitCount', count);
    document.getElementById('visitCount').textContent = count;
}

// Rainbow flash animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbowFlash {
        0%, 100% { filter: hue-rotate(0deg); }
        20% { filter: hue-rotate(60deg); }
        40% { filter: hue-rotate(120deg); }
        60% { filter: hue-rotate(180deg); }
        80% { filter: hue-rotate(300deg); }
    }
`;
document.head.appendChild(style);

// Sticker functionality
let draggedStickerType = null;
let currentDraggedSticker = null;

// Start dragging sticker from palette
function startStickerDrag(e, stickerType) {
    draggedStickerType = stickerType;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', stickerType);
}

// Allow drop on canvas
function allowDrop(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const canvas = document.querySelector('.sticker-canvas');
    canvas.classList.add('active');
}

// Drop sticker on canvas
function dropSticker(e) {
    e.preventDefault();
    const canvas = document.querySelector('.sticker-canvas');
    canvas.classList.remove('active');
    
    const stickerType = e.dataTransfer.getData('text/plain') || draggedStickerType;
    
    if (!stickerType) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    createPlacedSticker(stickerType, x, y);
    triggerSparkles();
}

// Create placed sticker
function createPlacedSticker(stickerType, x, y) {
    const sticker = document.createElement('div');
    sticker.className = 'placed-sticker';
    
    const size = 80 + Math.random() * 40;
    sticker.style.width = size + 'px';
    sticker.style.height = size + 'px';
    sticker.style.left = (x - size / 2) + 'px';
    sticker.style.top = (y - size / 2) + 'px';
    
    const img = document.createElement('img');
    img.src = stickerType;
    img.alt = 'sticker';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'sticker-delete-btn';
    deleteBtn.textContent = '✕';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        sticker.remove();
    };
    
    sticker.appendChild(img);
    sticker.appendChild(deleteBtn);
    
    makeStickerDraggable(sticker);
    
    document.querySelector('.sticker-canvas').appendChild(sticker);
}

// Make sticker draggable on canvas
function makeStickerDraggable(sticker) {
    let offsetX = 0;
    let offsetY = 0;
    let isDown = false;
    
    sticker.addEventListener('mousedown', (e) => {
        isDown = true;
        offsetX = e.clientX - sticker.offsetLeft;
        offsetY = e.clientY - sticker.offsetTop;
        sticker.style.zIndex = 30;
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        
        sticker.style.left = (e.clientX - offsetX) + 'px';
        sticker.style.top = (e.clientY - offsetY) + 'px';
    });
    
    document.addEventListener('mouseup', () => {
        isDown = false;
        sticker.style.zIndex = 25;
    });
    
    sticker.addEventListener('touchstart', (e) => {
        isDown = true;
        const touch = e.touches[0];
        offsetX = touch.clientX - sticker.offsetLeft;
        offsetY = touch.clientY - sticker.offsetTop;
        sticker.style.zIndex = 30;
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        
        const touch = e.touches[0];
        sticker.style.left = (touch.clientX - offsetX) + 'px';
        sticker.style.top = (touch.clientY - offsetY) + 'px';
    });
    
    document.addEventListener('touchend', () => {
        isDown = false;
        sticker.style.zIndex = 25;
    });
}

// Toggle palette visibility
let paletteVisible = true;

function togglePalette() {
    const palette = document.querySelector('.sticker-palette');
    const toggleBtn = document.querySelector('.toggle-palette-btn');
    
    paletteVisible = !paletteVisible;
    
    if (paletteVisible) {
        palette.classList.remove('hidden');
        toggleBtn.classList.add('hidden');
    } else {
        palette.classList.add('hidden');
        toggleBtn.classList.remove('hidden');
    }
}

// Clear all stickers
function clearAllStickers() {
    if (confirm('Are you sure you want to clear all stickers?')) {
        document.querySelectorAll('.placed-sticker').forEach(sticker => sticker.remove());
        triggerSparkles();
    }
}

// Rating system
function rateMe(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
    
    showMessage('thankz 4 ur feedback! :O');
    triggerSparkles();
}
