const articleTitle = document.getElementById('article-title');
const articleExtract = document.getElementById('article-extract');
const randomBtn = document.getElementById('random-btn');
const shareBtn = document.getElementById('share-btn');
const historyTrail = document.getElementById('history-trail');
const loader = document.getElementById('loader');
const countDisplay = document.getElementById('count');
const currentDateEl = document.getElementById('current-date');
const targetPageNameEl = document.getElementById('target-page-name');
const winBox = document.getElementById('win-box');
const challengeBtn = document.getElementById('challenge-btn');
const timerEl = document.getElementById('timer');
const timerDisplay = document.getElementById('timer-display');

let history = [];
let clickCount = 0;
let targetPage = "";
let currentTitle = "";
let timeLeft = 150;
let timerInterval = null;
let isChallengeMode = false;

// Set current date for the newspaper header
function setPaperDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateEl.innerText = now.toLocaleDateString('en-US', options).toUpperCase();
}

// --- Wiki Game Logic ---

const CORE_TARGETS = [
    "Earth", "United States", "History of the World", "Internet", "Albert Einstein",
    "Rome", "Ancient Egypt", "Coffee", "World War II", "Cinema", "Music", "London",
    "Pizza", "William Shakespeare", "Mount Everest", "Amazon River", "Basketball",
    "Video game", "Mars", "Moon", "Leonardo da Vinci", "Japan", "India", "France",
    "Computer", "Smartphone", "Dinosaurs", "Star Wars", "The Beatles", "Michael Jackson",
    "Great Wall of China", "Eiffel Tower", "Statue of Liberty", "Olympic Games",
    "Democracy", "Capitalism", "Evolution", "Chemistry", "Physics", "Mathematics",
    "Google", "Amazon (company)", "Coca-Cola", "McDonald's", "Disney", "Netflix",
    "Bitcoin", "Tesla (company)", "Elon Musk", "Steve Jobs", "Bill Gates", "Queen (band)",
    "Harry Potter", "The Lord of the Rings", "Marvel Cinematic Universe", "Batman",
    "Superman", "Spider-Man", "Mickey Mouse", "Super Mario", "Grand Theft Auto",
    "Minecraft", "Fortnite", "Facebook", "Instagram", "Twitter", "YouTube", "TikTok",
    "Artificial intelligence", "Global warming", "COVID-19 pandemic", "Black hole",
    "Quantum mechanics", "Relativity", "Big Bang", "Renaissance", "French Revolution",
    "Industrial Revolution", "Cold War", "Great Depression", "Viking", "Samurai",
    "Ninja", "Piracy", "Mythology", "Philosophy", "Psychology", "Sociology", "Economics",
    "Biology", "Medicine", "Architecture", "Photography", "Fashion", "Sports",
    "Soccer", "Tennis", "Boxing", "Formula One", "Cricket", "Golf", "Swimming",
    "Cycling", "Chess", "Poker", "Board game", "Card game", "Puzzle"
];

async function startNewMission() {
    showLoader(true);
    clickCount = 0;
    countDisplay.innerText = "0";
    history = [];
    isChallengeMode = false;
    stopTimer();
    timerDisplay.classList.add('hidden');
    randomBtn.innerText = "REFRESH";
    randomBtn.title = "Refresh Mission";
    winBox.classList.add('hidden');
    
    try {
        // 1. Get a well-known target page from our curated list
        targetPage = CORE_TARGETS[Math.floor(Math.random() * CORE_TARGETS.length)];
        targetPageNameEl.innerText = targetPage;

        // 2. Get a random starting page
        const startRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&list=random&rnnamespace=0&rnlimit=1&origin=*`);
        const startData = await startRes.json();
        const startTitle = startData.query.random[0].title;
        
        await fetchFullWikiPage(startTitle);
    } catch (error) {
        console.error(error);
        articleTitle.innerText = "Error Starting Mission";
    } finally {
        showLoader(false);
    }
}

const LEGENDARY_TARGETS = [
    "Philosophy", "Earth", "World War II", "Albert Einstein", 
    "Ancient Egypt", "Coffee", "Internet", "Leonardo da Vinci",
    "Pizza", "William Shakespeare", "SpaceX", "Dinosaurs"
];

async function startChallenge() {
    isChallengeMode = true;
    showLoader(true);
    clickCount = 0;
    countDisplay.innerText = "0";
    history = [];
    winBox.classList.add('hidden');
    
    // UI Swaps
    randomBtn.innerText = "RANDOM";
    randomBtn.title = "Switch to Random Mode";
    timerDisplay.classList.remove('hidden');
    startTimer(150);

    try {
        // 1. Pick a legendary target
        targetPage = LEGENDARY_TARGETS[Math.floor(Math.random() * LEGENDARY_TARGETS.length)];
        targetPageNameEl.innerText = targetPage;

        // 2. Get a random starting page (the hard part)
        const startRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&list=random&rnnamespace=0&rnlimit=1&origin=*`);
        const startData = await startRes.json();
        const startTitle = startData.query.random[0].title;
        
        await fetchFullWikiPage(startTitle);
        articleTitle.innerHTML = `<span style="color: var(--accent)">CHALLENGE:</span> ${startTitle}`;
    } catch (error) {
        console.error(error);
        articleTitle.innerText = "Error Starting Challenge";
    } finally {
        showLoader(false);
    }
}

function startTimer(seconds) {
    stopTimer();
    timeLeft = seconds;
    timerEl.innerText = timeLeft;
    timerEl.classList.remove('warning');
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.innerText = timeLeft;
        
        if (timeLeft <= 30) {
            timerEl.classList.add('warning');
        }
        
        if (timeLeft <= 0) {
            stopTimer();
            handleTimeUp();
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
}

function handleTimeUp() {
    articleTitle.innerText = "TIME EXPIRED";
    articleExtract.innerHTML = `
        <div class="sidebar-box" style="border: 3px solid var(--accent); padding: 2rem; text-align: center; background: white;">
            <h2 style="color: var(--accent); margin-bottom: 1rem;">MISSION FAILED</h2>
            <p>The archives have closed. You were too slow to reach <b>${targetPage}</b>.</p>
            <button onclick="startChallenge()" style="margin-top: 1.5rem; background: var(--accent); color: white; border: none; padding: 10px 20px; cursor: pointer; font-family: 'Playfair Display', serif; font-weight: 900;">TRY AGAIN</button>
        </div>
    `;
    articleExtract.style.pointerEvents = 'none';
}

async function fetchFullWikiPage(title) {
    if (!title) return;
    showLoader(true);
    currentTitle = title;
    
    try {
        // Fetch full HTML content from Wikipedia REST API
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(title)}`);
        if (!response.ok) throw new Error("Page not found");
        const html = await response.text();

        displayFullPage(title, html);
        addToHistory(title);
        if (isChallengeMode) {
            checkWinCondition(title);
        } else {
            // In normal mode, checking win is optional but good
            checkWinCondition(title);
        }
    } catch (error) {
        articleTitle.innerText = "Article Not Found";
        articleExtract.innerHTML = `<p>The page <b>${title}</b> could not be retrieved from the archives.</p>`;
    } finally {
        showLoader(false);
    }
}

function displayFullPage(title, html) {
    articleTitle.innerText = title;
    
    // Inject HTML and sanitize/process links
    articleExtract.innerHTML = html;
    
    // Process all internal links
    const links = articleExtract.querySelectorAll('a');
    links.forEach(link => {
        const href = link.getAttribute('href');
        
        // Wikipedia internal links in REST API look like "./Title" or "/wiki/Title"
        if (href && (href.startsWith('./') || href.startsWith('/wiki/'))) {
            let rawTitle = href.replace(/^\.\//, '').replace(/^\/wiki\//, '').split('#')[0].split('?')[0];
            const linkTitle = decodeURIComponent(rawTitle.replace(/_/g, ' ')).trim();
            
            // Ignore non-article links, root/index paths, and special namespaces
            const isInvalid = !linkTitle || 
                              linkTitle.toLowerCase() === 'index.html' || 
                              /^(file|special|help|wikipedia|talk|category|portal|template):/i.test(linkTitle);

            if (!isInvalid) {
                link.onclick = (e) => {
                    e.preventDefault();
                    clickCount++;
                    countDisplay.innerText = clickCount;
                    fetchFullWikiPage(linkTitle);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                };
            } else {
                link.style.pointerEvents = 'none';
                link.style.opacity = '0.5';
            }
        } else {
            // Remove external links or make them non-functional to keep user in the game
            link.style.pointerEvents = 'none';
            link.style.opacity = '0.5';
        }
    });
}

function checkWinCondition(title) {
    // Basic normalization for comparison
    if (title.toLowerCase().trim() === targetPage.toLowerCase().trim()) {
        stopTimer();
        winBox.classList.remove('hidden');
        articleExtract.style.pointerEvents = 'none'; // Disable clicking after win
        // Create a celebratory effect or alert
    }
}

function addToHistory(title) {
    if (history[history.length - 1] === title) return;
    history.push(title);
    if (history.length > 20) history.shift();
    renderHistory();
}

function renderHistory() {
    historyTrail.innerHTML = '';
    history.forEach((title, index) => {
        const item = document.createElement('div');
        item.className = 'history-item' + (index === history.length - 1 ? ' current' : '');
        item.innerText = title;
        historyTrail.appendChild(item);
    });
}

function showLoader(show) {
    if (show) {
        loader.classList.remove('hidden');
        articleExtract.classList.add('hidden');
    } else {
        loader.classList.add('hidden');
        articleExtract.classList.remove('hidden');
    }
}

randomBtn.addEventListener('click', startNewMission);
challengeBtn.addEventListener('click', startChallenge);

shareBtn.addEventListener('click', () => {
    const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(currentTitle)}`;
    navigator.clipboard.writeText(url).then(() => {
        const originalText = shareBtn.innerText;
        shareBtn.innerText = "COPIED!";
        setTimeout(() => shareBtn.innerText = originalText, 2000);
    });
});

// Initialization
setPaperDate();
startNewMission();
