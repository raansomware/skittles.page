// Playlist data with more songs
const playlist = [
    { name: 'happy pills!', artist: 'Weyes Blood', duration: 225 },
    { name: 'electric feel', artist: 'MGMT', duration: 252 },
    { name: 'dreaming', artist: 'Lizzo', duration: 208 },
    { name: 'rainbow', artist: 'Kehlani', duration: 235 },
    { name: 'good as hell', artist: 'Lizzo', duration: 214 }
];

let currentTrack = 0;
let isPlaying = false;
let currentTime = 0;

// Text to type
const textToType = "skittle nick!";

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    typeTextOnce();
    initializePlayer();
    loadVisitCount();
    createInitialSparkles();
});

// Typing effect - only once, then stays
function typeTextOnce() {
    const element = document.getElementById('typingText');
    let index = 0;
    
    function type() {
        if (index < textToType.length) {
            element.textContent += textToType.charAt(index);
            index++;
            setTimeout(type, 100); // Speed of typing
        }
    }
    
    type();
}

// Initialize player
function initializePlayer() {
    updateSongDisplay();
    updateTrackDisplay();
}

// Update song display
function updateSongDisplay() {
    const song = playlist[currentTrack];
    document.getElementById('songName').textContent = song.name;
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
