// Playlist data
const playlist = [
    { name: 'happy pills!', artist: 'Weyes Blood', duration: '3:45' },
    { name: 'electric feel', artist: 'MGMT', duration: '4:12' },
    { name: 'dreaming', artist: 'Lizzo', duration: '3:28' },
    { name: 'rainbow', artist: 'Kehlani', duration: '3:55' },
    { name: 'good as hell', artist: 'Lizzo', duration: '3:34' }
];

let currentTrack = 0;
let isPlaying = false;
let currentTime = 0;
let duration = 225; // 3:45 in seconds

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializePlayer();
    loadVisitCount();
    createSparkles();
});

// Initialize player
function initializePlayer() {
    updateSongDisplay();
    updateTrackDisplay();
}

// Update song display
function updateSongDisplay() {
    const song = playlist[currentTrack];
    document.getElementById('songName').textContent = song.name;
    document.getElementById('duration').textContent = song.duration;
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
        playBtn.style.animation = 'pulse 1s ease-in-out infinite';
    } else {
        playBtn.style.animation = 'none';
    }
}

// Simulate playback
function simulatePlayback() {
    if (!isPlaying) return;
    
    currentTime += 0.1;
    if (currentTime >= duration) {
        nextSong();
    }
    
    updateProgress();
    setTimeout(simulatePlayback, 100);
}

// Update progress
function updateProgress() {
    const percent = (currentTime / duration) * 100;
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
    currentTime = (e.target.value / 100) * duration;
    updateProgress();
});

// Volume slider
document.getElementById('volumeSlider')?.addEventListener('input', (e) => {
    console.log('Volume:', e.target.value + '%');
});

// Create sparkles
function createSparkles() {
    const container = document.querySelector('.sparkles-container');
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.textContent = ['✨', '💫', '⭐', '🌟', '💥'][Math.floor(Math.random() * 5)];
            sparkle.className = 'sparkle';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.fontSize = (10 + Math.random() * 20) + 'px';
            sparkle.style.animation = `sparkleFloat ${2 + Math.random() * 2}s ease-out forwards`;
            container.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 4000);
        }, i * 100);
    }
}

// Trigger sparkles on click
function triggerSparkles() {
    const container = document.querySelector('.sparkles-container');
    for (let i = 0; i < 30; i++) {
        const sparkle = document.createElement('div');
        sparkle.textContent = ['✨', '💫', '⭐', '🌟', '💥'][Math.floor(Math.random() * 5)];
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.fontSize = (15 + Math.random() * 25) + 'px';
        sparkle.style.animation = `sparkleFloat ${1.5 + Math.random() * 2}s ease-out forwards`;
        container.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 3500);
    }
}

// Show message
function showMessage(msg) {
    alert(msg);
    triggerSparkles();
}

// Create rainbow
function createRainbow() {
    document.body.style.animation = 'rainbowFlash 0.5s';
    setTimeout(() => {
        document.body.style.animation = 'none';
    }, 500);
    triggerSparkles();
}

// Click link
function clickLink(platform) {
    showMessage(`You opened ${platform}! 🎉`);
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
        0% { filter: hue-rotate(0deg); }
        50% { filter: hue-rotate(360deg); }
        100% { filter: hue-rotate(0deg); }
    }
`;
document.head.appendChild(style);
