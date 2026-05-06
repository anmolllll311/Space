// State
let isPlaying = false;
let intervalId = null;
let currentSettings = {
    rangeFrom: 'C2',
    rangeTo: 'C6',
    speed: 3, // seconds
    voiceIndex: 0,
    voiceRate: 5
};

const notesList = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
let activeNotes = [];

// DOM Elements
const noteDisplay = document.getElementById('note-text');
const playPauseBtn = document.getElementById('play-pause-btn');
const settingsToggle = document.getElementById('settings-toggle');
const settingsOverlay = document.getElementById('settings-overlay');
const saveSettingsBtn = document.getElementById('save-settings');
const voiceSelect = document.getElementById('voice-select');

// Speech Synthesis
let voices = [];
const synth = window.speechSynthesis;

function populateVoices() {
    const allVoices = synth.getVoices();
    
    // Filter for UK English strictly
    voices = allVoices.filter(v => 
        v.lang.toLowerCase().includes('en-gb') || v.lang.toLowerCase().includes('en_gb')
    );
    
    // Hard priority sort
    voices.sort((a, b) => {
        const getScore = (v) => {
            const name = v.name.toLowerCase();
            const lang = v.lang.toLowerCase();
            let score = 100;
            
            // Highest priority: Google UK voices
            if (name.includes('google') && lang.includes('gb')) score = 1;
            else if (name.includes('google')) score = 2;
            else if (name.includes('natural') && lang.includes('gb')) score = 3;
            else if (name.includes('natural')) score = 4;
            else if (lang.includes('gb')) score = 5;
            
            return score;
        };
        return getScore(a) - getScore(b);
    });

    const optionsContainer = document.getElementById('voice-options');
    const trigger = document.getElementById('voice-trigger');
    
    optionsContainer.innerHTML = voices
        .map((voice, i) => `
            <div class="custom-option" data-index="${i}">
                ${voice.name} ${voice.localService ? '' : '(Cloud)'}
            </div>
        `)
        .join('');

    // Select the best available UK/Google voice
    if (voices.length > 0) {
        selectVoice(0);
    }

    // Add listeners to new options
    document.querySelectorAll('.custom-option').forEach(opt => {
        opt.addEventListener('click', () => {
            selectVoice(parseInt(opt.dataset.index));
            optionsContainer.style.display = 'none';
        });
    });
}

function selectVoice(index) {
    currentSettings.voiceIndex = index;
    const trigger = document.getElementById('voice-trigger');
    const span = trigger.querySelector('span');
    if (voices[index] && span) {
        span.textContent = voices[index].name;
    }
    
    document.querySelectorAll('.custom-option').forEach((opt, i) => {
        opt.classList.toggle('selected', i === index);
    });
}

// Custom dropdown toggle
document.getElementById('voice-trigger').addEventListener('click', (e) => {
    e.stopPropagation();
    const options = document.getElementById('voice-options');
    options.style.display = options.style.display === 'block' ? 'none' : 'block';
});

// Close dropdown when clicking outside
document.addEventListener('click', () => {
    document.getElementById('voice-options').style.display = 'none';
});

if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices;
}

function speak(text) {
    if (synth.speaking) synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = voices[currentSettings.voiceIndex];
    utter.rate = currentSettings.voiceRate; 
    utter.pitch = 1.0;
    synth.speak(utter);
}

// Logic
function parseNote(noteStr) {
    const regex = /^([A-G]#?)(\d)$/;
    const match = noteStr.match(regex);
    if (!match) return null;
    return {
        name: match[1],
        octave: parseInt(match[2]),
        index: notesList.indexOf(match[1])
    };
}

function generateNotePool() {
    const from = parseNote(currentSettings.rangeFrom);
    const to = parseNote(currentSettings.rangeTo);
    
    if (!from || !to) return ['C3', 'D3', 'E3', 'G3', 'A3']; // Fallback

    const pool = [];
    for (let o = from.octave; o <= to.octave; o++) {
        for (let i = 0; i < 12; i++) {
            if (o === from.octave && i < from.index) continue;
            if (o === to.octave && i > to.index) continue;
            pool.push(`${notesList[i]}${o}`);
        }
    }
    return pool;
}

let hasStarted = false;
let sessionNoteCount = 0;

function updateNoteCountDisplay() {
    const counter = document.getElementById('note-count');
    if (counter) counter.textContent = sessionNoteCount;
}

function showNextNote() {
    if (activeNotes.length === 0) activeNotes = generateNotePool();
    const randomIndex = Math.floor(Math.random() * activeNotes.length);
    const note = activeNotes[randomIndex];
    
    const display = document.getElementById('note-text');
    
    // Add visual feedback
    display.style.opacity = '0';
    display.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        display.textContent = note;
        display.style.opacity = '1';
        display.style.transform = 'translateY(0)';
        speak(note.replace('#', ' sharp'));
        
        sessionNoteCount++;
        updateNoteCountDisplay();
    }, 100);
}

function togglePractice() {
    isPlaying = !isPlaying;
    
    if (isPlaying) {
        if (!hasStarted) {
            sessionNoteCount = 0;
            updateNoteCountDisplay();
        }
        hasStarted = true;
        playPauseBtn.textContent = 'Pause Session';
        playPauseBtn.style.background = 'var(--accent)';
        playPauseBtn.style.color = 'var(--ink)';
        showNextNote();
        intervalId = setInterval(showNextNote, currentSettings.speed * 1000);
    } else {
        // If we've already started before, use "Resume"
        playPauseBtn.textContent = hasStarted ? 'Resume Session' : 'Start Session';
        playPauseBtn.style.background = 'transparent';
        playPauseBtn.style.color = 'var(--paper)';
        clearInterval(intervalId);
    }
}

// Events
playPauseBtn.addEventListener('click', togglePractice);

settingsToggle.addEventListener('click', () => {
    settingsOverlay.style.display = 'flex';
});

document.getElementById('close-settings-x').addEventListener('click', () => {
    settingsOverlay.style.display = 'none';
});

// Scroll to change speed logic
const speedInput = document.getElementById('speed');
speedInput.addEventListener('wheel', (e) => {
    e.preventDefault();
    const step = 0.5;
    let currentValue = parseFloat(speedInput.value);
    
    if (e.deltaY < 0) {
        // Scroll up - increase
        speedInput.value = (currentValue + step).toFixed(1);
    } else {
        // Scroll down - decrease
        if (currentValue > 0.5) {
            speedInput.value = (currentValue - step).toFixed(1);
        }
    }
});

// Scroll for voice rate
const voiceRateInput = document.getElementById('voice-rate');
voiceRateInput.addEventListener('wheel', (e) => {
    e.preventDefault();
    const step = 0.5;
    let currentValue = parseFloat(voiceRateInput.value);
    if (e.deltaY < 0) {
        voiceRateInput.value = Math.min(10, currentValue + step).toFixed(1);
    } else {
        if (currentValue > 0.5) {
            voiceRateInput.value = Math.max(0.5, currentValue - step).toFixed(1);
        }
    }
});

saveSettingsBtn.addEventListener('click', () => {
    currentSettings.rangeFrom = document.getElementById('range-from').value.toUpperCase();
    currentSettings.rangeTo = document.getElementById('range-to').value.toUpperCase();
    currentSettings.speed = parseFloat(document.getElementById('speed').value);
    currentSettings.voiceRate = parseFloat(document.getElementById('voice-rate').value);
    
    activeNotes = generateNotePool();
    
    if (isPlaying) {
        clearInterval(intervalId);
        intervalId = setInterval(showNextNote, currentSettings.speed * 1000);
    }
    
    settingsOverlay.style.display = 'none';
});

// Initial load
populateVoices();
activeNotes = generateNotePool();
