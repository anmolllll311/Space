const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
const world = document.getElementById('physics-world');

let width, height, stars = [];
const STAR_COUNT = 300;
const entities = [];

// Interaction config
const ATTRACTION_RADIUS = 90; 
const SPRING_STIFFNESS = 0.8;  
const SPRING_DAMPING = 0.15;   
const DEFAULT_FRICT = 1.0;     

// Interaction state
let mouseX = -1000;
let mouseY = -1000;
let lastTime = 0;

// Comet System
let activeComets = [];
let cometTimer = 0;
let nextCometInterval = 30000; // Fixed 30s interval

class FloatingEntity {
    constructor(type, x, y) {
        // Initial center spawn
        this.x = x;
        this.y = y;
        
        // The Big Bang: Slower, cinematic velocity
        const angle = Math.random() * Math.PI * 2;
        const speed = 150 + Math.random() * 250; 
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        this.type = type;
        this.radius = 50; 
        
        // Create actual DOM element
        this.el = document.createElement('div');
        this.el.className = 'entity';
        
        let content = '';
        if (type === 'atom') {
            this.radius = 55;
            content = this.generateOxygenAtom();
        } else if (type === 'tictactoe') {
            this.radius = 50; // Refined radius for stability
            content = this.generateSimpleTTTGrid();
        } else if (type === 'wikipedia') {
            this.radius = 50;
            content = this.generateWikipediaGlobe();
        } else if (type === 'piano') {
            this.radius = 45;
            content = this.generatePiano();
        } else if (type === 'imaginaire') {
            this.radius = 50;
            content = this.generateImaginaire();
        } else if (type === 'astronaut') {
            this.radius = 35; // Smaller hit box for the small astronaut
            content = this.generatePixelAstronaut();
        }
        
        // Wrap for CSS animation isolation
        this.el.innerHTML = `<div class="big-bang-visual">${content}</div>`;
        this.el.onclick = () => {
            const routes = {
                tictactoe: 'tictactoe/index.html',
                atom: 'Chem/index.html',
                wikipedia: 'InfiniteWiki/index.html',
                piano: 'Piano/index.html',
                imaginaire: 'coming-soon.html'
            };
            const target = routes[this.type] || 'coming-soon.html';
            document.body.style.transition = 'opacity 0.4s ease';
            document.body.style.opacity = '0';
            setTimeout(() => {
                window.location.href = target;
            }, 350);
        };
        
        // Immediate position set to avoid top-left flicker
        this.el.style.transform = `translate(${this.x - this.radius}px, ${this.y - this.radius}px)`;
        
        world.appendChild(this.el);
        this.birthTime = Date.now();
        this.isAttracted = false;
    }

    generateOxygenAtom() {
        let particles = '';
        const particleCount = 16;
        for (let i = 0; i < particleCount; i++) {
            const type = i < 8 ? 'proton' : 'neutron';
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 10;
            const tx = 12 + Math.cos(angle) * dist;
            const ty = 12 + Math.sin(angle) * dist;
            const z = Math.floor(Math.random() * 15);
            particles += `<div class="particle ${type}" style="top: ${ty}px; left: ${tx}px; z-index: ${z}"></div>`;
        }

        let electrons = '';
        electrons += `<div class="orbit orbit-inner"><div class="electron electron-inner" style="animation-delay: 0s"></div><div class="electron electron-inner" style="animation-delay: -2s"></div></div>`;
        electrons += `<div class="orbit orbit-mid">
            <div class="electron electron-mid" style="animation-delay: 0s"></div>
            <div class="electron electron-mid" style="animation-delay: -1.33s"></div>
            <div class="electron electron-mid" style="animation-delay: -2.66s"></div>
        </div>`;
        electrons += `<div class="orbit orbit-outer">
            <div class="electron electron-outer" style="animation-delay: -0.5s"></div>
            <div class="electron electron-outer" style="animation-delay: -1.83s"></div>
            <div class="electron electron-outer" style="animation-delay: -3.16s"></div>
        </div>`;

        return `<div class="pixel-atom"><div class="nucleus-cluster">${particles}</div>${electrons}</div>`;
    }

    generateSimpleTTTGrid() {
        return `
            <div class="pixel-ttt-grid">
                <div class="ttt-line ttt-v1"></div>
                <div class="ttt-line ttt-v2"></div>
                <div class="ttt-line ttt-h1"></div>
                <div class="ttt-line ttt-h2"></div>
                <div class="pixel-marker x" style="top:5px; left:5px;"></div>
                <div class="pixel-marker o" style="top:25px; left:25px;"></div>
                <div class="pixel-marker x" style="top:45px; left:45px;"></div>
            </div>`;
    }

    generateWikipediaGlobe() {
        const glyphs = ['W', 'Ω', '維', 'И', '7'];
        let charDivs = '';
        glyphs.forEach(g => charDivs += `<div class="wiki-char">${g}</div>`);
        
        return `
            <div class="pixel-wiki-globe">
                <div class="wiki-texture-layer"></div>
                <div class="wiki-glyph-layer">
                    ${charDivs}
                    ${charDivs}
                </div>
                <div class="wiki-shading"></div>
            </div>`;
    }

    generatePiano() {
        return `
            <div class="pixel-piano">
                <div class="piano-body"></div>
                <div class="white-key"></div>
                <div class="white-key"><div class="black-key"></div></div>
                <div class="white-key"><div class="black-key"></div></div>
                <div class="white-key"></div>
                <div class="white-key"><div class="black-key"></div></div>
                <div class="white-key"><div class="black-key"></div></div>
                <div class="white-key"><div class="black-key"></div></div>
                <div class="white-key"></div>
            </div>`;
    }

    generateImaginaire() {
        return `
            <div class="imaginaire-logo">
                <div class="rotating-question">
                    <div class="q-face front">?</div>
                </div>
            </div>`;
    }

    generatePixelAstronaut() {
        return `
            <div class="pixel-astronaut">
                <div class="astro-body"></div>
            </div>`;
    }

    update(dt, target) {
        if (target) {
            const dx = target.x - this.x;
            const dy = target.y - this.y;
            this.vx += dx * SPRING_STIFFNESS;
            this.vy += dy * SPRING_STIFFNESS;
            this.vx *= (1 - SPRING_DAMPING);
            this.vy *= (1 - SPRING_DAMPING);
            this.isAttracted = true;
        } else {
            this.vx *= DEFAULT_FRICT;
            this.vy *= DEFAULT_FRICT;
            this.isAttracted = false;
        }

        this.x += this.vx * dt;
        this.y += this.vy * dt;

        if (this.x - this.radius < 0) { this.vx = Math.abs(this.vx); this.x = this.radius; }
        else if (this.x + this.radius > width) { this.vx = -Math.abs(this.vx); this.x = width - this.radius; }

        if (this.y - this.radius < 0) { this.vy = Math.abs(this.vy); this.y = this.radius; }
        else if (this.y + this.radius > height) { this.vy = -Math.abs(this.vy); this.y = height - this.radius; }

        this.el.style.transform = `translate(${this.x - this.radius}px, ${this.y - this.radius}px)`;
    }
}

function resolveCollision(e1, e2) {
    const dx = e1.x - e2.x;
    const dy = e1.y - e2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0 || distance < 0.1) return;
    
    if (distance < e1.radius + e2.radius) {
        const nx = dx / distance;
        const ny = dy / distance;
        const rvx = e1.vx - e2.vx;
        const rvy = e1.vy - e2.vy;
        const velAlongNormal = rvx * nx + rvy * ny;
        if (velAlongNormal > 0) return;
        const impulse = -(1 + 0.5) * velAlongNormal;
        const impulseX = impulse * nx;
        const impulseY = impulse * ny;
        e1.vx += impulseX / 2;
        e1.vy += impulseY / 2;
        e2.vx -= impulseX / 2;
        e2.vy -= impulseY / 2;
        const overlap = e1.radius + e2.radius - distance;
        e1.x += nx * overlap / 2;
        e1.y += ny * overlap / 2;
        e2.x -= nx * overlap / 2;
        e2.y -= ny * overlap / 2;
    }
}

function resize() {
    const oldWidth = width;
    const oldHeight = height;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    if (stars.length === 0) {
        createStars();
    } else {
        stars.forEach(star => {
            star.x = (star.x / oldWidth) * width;
            star.y = (star.y / oldHeight) * height;
        });
        const targetCount = Math.floor((width * height) / 4000);
        while (stars.length < targetCount) {
            addStar(Math.random() * width, Math.random() * height);
        }
    }
}

function addStar(x, y) {
    const speed = 0.05 + Math.random() * 0.15;
    stars.push({
        x: x, y: y, size: Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.05 + Math.random() * 0.1,
        vx: -speed * 20, vy: (Math.random() - 0.5) * 2,
        color: Math.random() > 0.8 ? '#a9cce3' : Math.random() > 0.9 ? '#f9e79f' : '#ffffff'
    });
}

function createStars() {
    const targetCount = Math.floor((width * height) / 4000);
    for (let i = 0; i < targetCount; i++) addStar(Math.random() * width, Math.random() * height);
}

function init() {
    resize();
    if (width === 0) width = window.innerWidth || 1920;
    if (height === 0) height = window.innerHeight || 1080;
    createStars();
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Spawn with microscopic offset to prevent NaN (Division by Zero)
    entities.push(new FloatingEntity('atom', centerX - 0.5, centerY - 0.5));
    entities.push(new FloatingEntity('tictactoe', centerX + 0.5, centerY - 0.5));
    entities.push(new FloatingEntity('wikipedia', centerX - 0.5, centerY + 0.5));
    entities.push(new FloatingEntity('piano', centerX + 0.5, centerY + 0.5));
    entities.push(new FloatingEntity('imaginaire', centerX, centerY - 80));
    
    requestAnimationFrame(animate);
}

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animate(time) {
    if (!lastTime) {
        lastTime = time;
        requestAnimationFrame(animate);
        return;
    }
    let dt = (time - lastTime) / 1000;
    dt = Math.min(dt, 0.1); // Cap dt to prevent "teleporting" through walls
    ctx.clearRect(0, 0, width, height);
    
    const grad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width);
    grad.addColorStop(0, '#050510');
    grad.addColorStop(1, '#000000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    stars.forEach(star => {
        star.phase += star.twinkleSpeed * dt * 5;
        const opacity = 0.2 + (Math.sin(star.phase) + 1) * 0.4;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${hexToRgb(star.color)}, ${opacity})`;
        ctx.fill();
        star.x += star.vx * dt;
        star.y += star.vy * dt;
        const buffer = 50;
        if (star.x < -buffer) star.x = width + buffer;
        if (star.x > width + buffer) star.x = -buffer;
        if (star.y < -buffer) star.y = height + buffer;
        if (star.y > height + buffer) star.y = -buffer;
    });

    // --- COMET UPDATE & DRAW ---
    cometTimer += dt * 1000;
    if (cometTimer >= nextCometInterval) {
        triggerCometEvent();
        cometTimer = 0;
    }

    activeComets.forEach((comet, index) => {
        comet.x += comet.vx * dt;
        comet.y += comet.vy * dt;
        
        // Extended Tail History (40 frames)
        comet.trail.push({x: comet.x, y: comet.y});
        if (comet.trail.length > 40) comet.trail.shift();
        
        // Render Tapered, Layered Trail - SUBTLE
        comet.trail.forEach((pos, i) => {
            const ratio = i / comet.trail.length;
            const size = comet.size * ratio * 1.2;
            const alpha = ratio * 0.2; // Halved alpha
            
            // Tail Layer 1: Blue Glow (Very soft)
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, size * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 100, 255, ${alpha * 0.15})`;
            ctx.fill();

            // Tail Layer 2: Core Streak (Soft White)
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(224, 248, 207, ${alpha})`;
            ctx.fill();
        });

        // Render Layered Head (Subtle Glow)
        const flicker = Math.sin(Date.now() * 0.01) * 1;
        
        // 1. Outer Aura (Very faint)
        ctx.beginPath();
        ctx.arc(comet.x, comet.y, comet.size * 4 + flicker, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 50, 255, 0.05)`;
        ctx.fill();

        // 2. Inner Glow
        ctx.beginPath();
        ctx.arc(comet.x, comet.y, comet.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 242, 255, 0.15)`;
        ctx.fill();

        // 3. Muted Core
        ctx.beginPath();
        ctx.arc(comet.x, comet.y, comet.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'rgba(0, 242, 255, 0.3)';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Cleanup
        if (comet.x < -100 || comet.x > width + 100 || comet.y < -100 || comet.y > height + 100) {
            activeComets.splice(index, 1);
        }
    });

    let closestEntity = null;
    let minDist = ATTRACTION_RADIUS;
    const now = Date.now();
    entities.forEach(e => {
        // Only allow attraction after 1.5s the Big Bang
        if (now - e.birthTime < 1500) return;
        
        const d = Math.sqrt((mouseX - e.x) ** 2 + (mouseY - e.y) ** 2);
        if (d < minDist) { minDist = d; closestEntity = e; }
    });

    for (let i = 0; i < entities.length; i++) {
        for (let j = i + 1; j < entities.length; j++) {
            resolveCollision(entities[i], entities[j]);
        }
    }
    entities.forEach(e => {
        const isTarget = (e === closestEntity);
        e.update(dt, isTarget ? { x: mouseX, y: mouseY } : null);
    });

    // Update Custom Astronaut Cursor
    const cursor = document.getElementById('astronaut-cursor');
    if (cursor) {
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-16px, -24px)`;
    }

    lastTime = time;
    requestAnimationFrame(animate);
}

function triggerCometEvent() {
    const chance = Math.random();
    if (chance < 0.3) { // 30% Fragmented Giant
        const main = spawnComet(3);
        // Add 3-4 small fragments trailing the main one
        for (let i = 0; i < 4; i++) {
            const ox = (Math.random() - 0.5) * 40;
            const oy = (Math.random() - 0.5) * 40;
            setTimeout(() => spawnComet(0.8, main.vx, main.vy, main.x + ox, main.y + oy), i * 100);
        }
    } else if (chance < 0.7) { // 40% Lone Mid
        spawnComet(1.8);
    } else { // 30% Lone Small
        spawnComet(0.8);
    }
}

function spawnComet(sizeOverride, vxO, vyO, xO, yO) {
    const side = Math.random() > 0.5 ? 'top' : 'right';
    let x, y, vx, vy;
    
    if (xO !== undefined) {
        x = xO; y = yO; vx = vxO; vy = vyO;
    } else if (side === 'top') {
        x = Math.random() * width;
        y = -50;
        vx = -100 - Math.random() * 150;
        vy = 100 + Math.random() * 150;
    } else {
        x = width + 50;
        y = Math.random() * height;
        vx = -250 - Math.random() * 250;
        vy = (Math.random() - 0.5) * 200;
    }

    const comet = {
        x: x, y: y, vx: vx, vy: vy,
        size: sizeOverride || (1.5 + Math.random() * 2),
        trail: [],
        color: '#ffffff'
    };
    activeComets.push(comet);
    return comet;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '224, 248, 207';
}

window.addEventListener('resize', resize);
init();
