/* ============================================
   Chemistry - Chemistry Particle System
   ============================================ */

// --- Chemistry Data ---
const CHEMISTRY_ENTITIES = [
  // Elements
  { name: 'Hydrogen', symbol: 'H', type: 'element' },
  { name: 'Helium', symbol: 'He', type: 'element' },
  { name: 'Lithium', symbol: 'Li', type: 'element' },
  { name: 'Carbon', symbol: 'C', type: 'element' },
  { name: 'Nitrogen', symbol: 'N', type: 'element' },
  { name: 'Oxygen', symbol: 'O', type: 'element' },
  { name: 'Fluorine', symbol: 'F', type: 'element' },
  { name: 'Neon', symbol: 'Ne', type: 'element' },
  { name: 'Sodium', symbol: 'Na', type: 'element' },
  { name: 'Magnesium', symbol: 'Mg', type: 'element' },
  { name: 'Aluminium', symbol: 'Al', type: 'element' },
  { name: 'Silicon', symbol: 'Si', type: 'element' },
  { name: 'Phosphorus', symbol: 'P', type: 'element' },
  { name: 'Sulfur', symbol: 'S', type: 'element' },
  { name: 'Chlorine', symbol: 'Cl', type: 'element' },
  { name: 'Argon', symbol: 'Ar', type: 'element' },
  { name: 'Potassium', symbol: 'K', type: 'element' },
  { name: 'Calcium', symbol: 'Ca', type: 'element' },
  { name: 'Iron', symbol: 'Fe', type: 'element' },
  { name: 'Copper', symbol: 'Cu', type: 'element' },
  { name: 'Zinc', symbol: 'Zn', type: 'element' },
  { name: 'Silver', symbol: 'Ag', type: 'element' },
  { name: 'Gold', symbol: 'Au', type: 'element' },
  { name: 'Platinum', symbol: 'Pt', type: 'element' },
  { name: 'Titanium', symbol: 'Ti', type: 'element' },
  { name: 'Chromium', symbol: 'Cr', type: 'element' },
  { name: 'Manganese', symbol: 'Mn', type: 'element' },
  { name: 'Cobalt', symbol: 'Co', type: 'element' },
  { name: 'Nickel', symbol: 'Ni', type: 'element' },
  { name: 'Bromine', symbol: 'Br', type: 'element' },
  { name: 'Iodine', symbol: 'I', type: 'element' },
  { name: 'Xenon', symbol: 'Xe', type: 'element' },
  { name: 'Barium', symbol: 'Ba', type: 'element' },
  { name: 'Lead', symbol: 'Pb', type: 'element' },
  { name: 'Mercury', symbol: 'Hg', type: 'element' },
  { name: 'Tin', symbol: 'Sn', type: 'element' },
  { name: 'Tungsten', symbol: 'W', type: 'element' },

  // Organic Compounds
  { name: 'Methane', symbol: 'CH₄', type: 'organic' },
  { name: 'Ethanol', symbol: 'C₂H₅OH', type: 'organic' },
  { name: 'Acetic Acid', symbol: 'CH₃COOH', type: 'organic' },
  { name: 'Glucose', symbol: 'C₆H₁₂O₆', type: 'organic' },
  { name: 'Benzene', symbol: 'C₆H₆', type: 'organic' },
  { name: 'Acetone', symbol: 'C₃H₆O', type: 'organic' },
  { name: 'Formaldehyde', symbol: 'HCHO', type: 'organic' },
  { name: 'Methanol', symbol: 'CH₃OH', type: 'organic' },
  { name: 'Ethylene', symbol: 'C₂H₄', type: 'organic' },
  { name: 'Propane', symbol: 'C₃H₈', type: 'organic' },
  { name: 'Butane', symbol: 'C₄H₁₀', type: 'organic' },
  { name: 'Toluene', symbol: 'C₇H₈', type: 'organic' },
  { name: 'Phenol', symbol: 'C₆H₅OH', type: 'organic' },
  { name: 'Glycerol', symbol: 'C₃H₈O₃', type: 'organic' },
  { name: 'Aspirin', symbol: 'C₉H₈O₄', type: 'organic' },
  { name: 'Caffeine', symbol: 'C₈H₁₀N₄O₂', type: 'organic' },
  { name: 'Sucrose', symbol: 'C₁₂H₂₂O₁₁', type: 'organic' },
  { name: 'Chloroform', symbol: 'CHCl₃', type: 'organic' },
  { name: 'Aniline', symbol: 'C₆H₅NH₂', type: 'organic' },
  { name: 'Naphthalene', symbol: 'C₁₀H₈', type: 'organic' },
  { name: 'Cyclohexane', symbol: 'C₆H₁₂', type: 'organic' },

  // Inorganic Compounds
  { name: 'Water', symbol: 'H₂O', type: 'inorganic' },
  { name: 'Sodium Chloride', symbol: 'NaCl', type: 'inorganic' },
  { name: 'Calcium Carbonate', symbol: 'CaCO₃', type: 'inorganic' },
  { name: 'Sodium Hydroxide', symbol: 'NaOH', type: 'inorganic' },
  { name: 'Potassium Permanganate', symbol: 'KMnO₄', type: 'inorganic' },
  { name: 'Hydrogen Peroxide', symbol: 'H₂O₂', type: 'inorganic' },
  { name: 'Sodium Bicarbonate', symbol: 'NaHCO₃', type: 'inorganic' },
  { name: 'Iron Oxide', symbol: 'Fe₂O₃', type: 'inorganic' },
  { name: 'Silicon Dioxide', symbol: 'SiO₂', type: 'inorganic' },
  { name: 'Copper Sulfate', symbol: 'CuSO₄', type: 'inorganic' },
  { name: 'Silver Nitrate', symbol: 'AgNO₃', type: 'inorganic' },
  { name: 'Potassium Dichromate', symbol: 'K₂Cr₂O₇', type: 'inorganic' },
  { name: 'Barium Sulfate', symbol: 'BaSO₄', type: 'inorganic' },
  { name: 'Zinc Oxide', symbol: 'ZnO', type: 'inorganic' },
  { name: 'Aluminium Oxide', symbol: 'Al₂O₃', type: 'inorganic' },

  // Acids & Bases
  { name: 'Hydrochloric Acid', symbol: 'HCl', type: 'acid_base' },
  { name: 'Sulfuric Acid', symbol: 'H₂SO₄', type: 'acid_base' },
  { name: 'Nitric Acid', symbol: 'HNO₃', type: 'acid_base' },
  { name: 'Phosphoric Acid', symbol: 'H₃PO₄', type: 'acid_base' },
  { name: 'Carbonic Acid', symbol: 'H₂CO₃', type: 'acid_base' },
  { name: 'Citric Acid', symbol: 'C₆H₈O₇', type: 'acid_base' },
  { name: 'Formic Acid', symbol: 'HCOOH', type: 'acid_base' },
  { name: 'Ammonia', symbol: 'NH₃', type: 'acid_base' },
  { name: 'Potassium Hydroxide', symbol: 'KOH', type: 'acid_base' },
  { name: 'Calcium Hydroxide', symbol: 'Ca(OH)₂', type: 'acid_base' },
  { name: 'Boric Acid', symbol: 'H₃BO₃', type: 'acid_base' },
  { name: 'Oxalic Acid', symbol: 'C₂H₂O₄', type: 'acid_base' },

  // Gases
  { name: 'Oxygen Gas', symbol: 'O₂', type: 'gas' },
  { name: 'Nitrogen Gas', symbol: 'N₂', type: 'gas' },
  { name: 'Carbon Dioxide', symbol: 'CO₂', type: 'gas' },
  { name: 'Carbon Monoxide', symbol: 'CO', type: 'gas' },
  { name: 'Hydrogen Gas', symbol: 'H₂', type: 'gas' },
  { name: 'Ozone', symbol: 'O₃', type: 'gas' },
  { name: 'Sulfur Dioxide', symbol: 'SO₂', type: 'gas' },
  { name: 'Nitrogen Dioxide', symbol: 'NO₂', type: 'gas' },
  { name: 'Chlorine Gas', symbol: 'Cl₂', type: 'gas' },
  { name: 'Methane Gas', symbol: 'CH₄', type: 'gas' },
  { name: 'Nitrous Oxide', symbol: 'N₂O', type: 'gas' },
  { name: 'Hydrogen Sulfide', symbol: 'H₂S', type: 'gas' },

  // Polymers
  { name: 'Polyethylene', symbol: 'PE', type: 'polymer' },
  { name: 'Polypropylene', symbol: 'PP', type: 'polymer' },
  { name: 'Polyvinyl Chloride', symbol: 'PVC', type: 'polymer' },
  { name: 'Polystyrene', symbol: 'PS', type: 'polymer' },
  { name: 'Nylon', symbol: 'PA', type: 'polymer' },
  { name: 'Teflon', symbol: 'PTFE', type: 'polymer' },
  { name: 'Polyester', symbol: 'PET', type: 'polymer' },
  { name: 'Kevlar', symbol: 'PPD-T', type: 'polymer' },
  { name: 'Silicone', symbol: 'PDMS', type: 'polymer' },
  { name: 'Natural Rubber', symbol: 'NR', type: 'polymer' },
  { name: 'Bakelite', symbol: 'PF', type: 'polymer' },
  { name: 'Cellulose', symbol: 'C₆H₁₀O₅', type: 'polymer' },

  // Biochemistry
  { name: 'DNA', symbol: 'DNA', type: 'biochem' },
  { name: 'RNA', symbol: 'RNA', type: 'biochem' },
  { name: 'ATP', symbol: 'C₁₀H₁₆N₅O₁₃P₃', type: 'biochem' },
  { name: 'Hemoglobin', symbol: 'Hb', type: 'biochem' },
  { name: 'Insulin', symbol: 'C₂₅₇H₃₈₃', type: 'biochem' },
  { name: 'Glycine', symbol: 'C₂H₅NO₂', type: 'biochem' },
  { name: 'Alanine', symbol: 'C₃H₇NO₂', type: 'biochem' },
  { name: 'Leucine', symbol: 'C₆H₁₃NO₂', type: 'biochem' },
  { name: 'Cholesterol', symbol: 'C₂₇H₄₆O', type: 'biochem' },
  { name: 'Serotonin', symbol: 'C₁₀H₁₂N₂O', type: 'biochem' },
  { name: 'Dopamine', symbol: 'C₈H₁₁NO₂', type: 'biochem' },
  { name: 'Adrenaline', symbol: 'C₉H₁₃NO₃', type: 'biochem' },
  { name: 'Keratin', symbol: 'Protein', type: 'biochem' },
  { name: 'Collagen', symbol: 'Protein', type: 'biochem' },

  // Nuclear Chemistry
  { name: 'Uranium-235', symbol: '²³⁵U', type: 'nuclear' },
  { name: 'Plutonium-239', symbol: '²³⁹Pu', type: 'nuclear' },
  { name: 'Radon', symbol: 'Rn', type: 'nuclear' },
  { name: 'Radium', symbol: 'Ra', type: 'nuclear' },
  { name: 'Thorium', symbol: 'Th', type: 'nuclear' },
  { name: 'Tritium', symbol: '³H', type: 'nuclear' },
  { name: 'Deuterium', symbol: '²H', type: 'nuclear' },
  { name: 'Polonium', symbol: 'Po', type: 'nuclear' },
  { name: 'Alpha Particle', symbol: '⁴He²⁺', type: 'nuclear' },
  { name: 'Beta Particle', symbol: 'β⁻', type: 'nuclear' },

  // Electrochemistry
  { name: 'Lithium Ion', symbol: 'Li⁺', type: 'electrochem' },
  { name: 'Sodium Ion', symbol: 'Na⁺', type: 'electrochem' },
  { name: 'Chloride Ion', symbol: 'Cl⁻', type: 'electrochem' },
  { name: 'Hydroxide Ion', symbol: 'OH⁻', type: 'electrochem' },
  { name: 'Sulfate Ion', symbol: 'SO₄²⁻', type: 'electrochem' },
  { name: 'Nitrate Ion', symbol: 'NO₃⁻', type: 'electrochem' },
  { name: 'Permanganate', symbol: 'MnO₄⁻', type: 'electrochem' },
  { name: 'Dichromate', symbol: 'Cr₂O₇²⁻', type: 'electrochem' },
  { name: 'Carbonate Ion', symbol: 'CO₃²⁻', type: 'electrochem' },
  { name: 'Phosphate Ion', symbol: 'PO₄³⁻', type: 'electrochem' },

  // Thermochemistry
  { name: 'Enthalpy', symbol: 'ΔH', type: 'thermo' },
  { name: 'Entropy', symbol: 'ΔS', type: 'thermo' },
  { name: 'Gibbs Energy', symbol: 'ΔG', type: 'thermo' },
  { name: 'Heat Capacity', symbol: 'Cₚ', type: 'thermo' },
  { name: 'Activation Energy', symbol: 'Eₐ', type: 'thermo' },
  { name: 'Exothermic', symbol: 'ΔH < 0', type: 'thermo' },
  { name: 'Endothermic', symbol: 'ΔH > 0', type: 'thermo' },
  { name: 'Hess\'s Law', symbol: 'ΣΔH', type: 'thermo' },
  { name: 'Calorimetry', symbol: 'q=mcΔT', type: 'thermo' },
  { name: 'Bond Energy', symbol: 'BE', type: 'thermo' },

  // Catalysts
  { name: 'Platinum Catalyst', symbol: 'Pt', type: 'catalyst' },
  { name: 'Palladium Catalyst', symbol: 'Pd', type: 'catalyst' },
  { name: 'Iron Catalyst', symbol: 'Fe', type: 'catalyst' },
  { name: 'Nickel Catalyst', symbol: 'Ni', type: 'catalyst' },
  { name: 'Vanadium Pentoxide', symbol: 'V₂O₅', type: 'catalyst' },
  { name: 'Manganese Dioxide', symbol: 'MnO₂', type: 'catalyst' },
  { name: 'Enzyme Catalase', symbol: 'CAT', type: 'catalyst' },
  { name: 'Enzyme Lipase', symbol: 'LIP', type: 'catalyst' },
  { name: 'Enzyme Amylase', symbol: 'AMY', type: 'catalyst' },
  { name: 'Zeolite', symbol: 'Zeolite', type: 'catalyst' },

  // Minerals & Crystals
  { name: 'Quartz', symbol: 'SiO₂', type: 'mineral' },
  { name: 'Diamond', symbol: 'C', type: 'mineral' },
  { name: 'Calcite', symbol: 'CaCO₃', type: 'mineral' },
  { name: 'Feldspar', symbol: 'KAlSi₃O₈', type: 'mineral' },
  { name: 'Mica', symbol: 'KAl₂Si₃AlO₁₀', type: 'mineral' },
  { name: 'Graphite', symbol: 'C', type: 'mineral' },
  { name: 'Corundum', symbol: 'Al₂O₃', type: 'mineral' },
  { name: 'Fluorite', symbol: 'CaF₂', type: 'mineral' },
  { name: 'Magnetite', symbol: 'Fe₃O₄', type: 'mineral' },
  { name: 'Pyrite', symbol: 'FeS₂', type: 'mineral' },
  { name: 'Galena', symbol: 'PbS', type: 'mineral' },
  { name: 'Topaz', symbol: 'Al₂SiO₄F₂', type: 'mineral' },
];

const CATEGORY_TEXT = {
  element: 'Elements',
  organic: 'Organic Chemistry',
  inorganic: 'Inorganic Chemistry',
  acid_base: 'Acids & Bases',
  gas: 'Gases',
  polymer: 'Polymers',
  biochem: 'Biochemistry',
  nuclear: 'Nuclear Chemistry',
  electrochem: 'Electrochemistry',
  thermo: 'Thermochemistry',
  catalyst: 'Catalysts',
  mineral: 'Minerals & Crystals',
};

const DOT_COLORS = {
  element: '#2d6a4f',
  organic: '#40916c',
  inorganic: '#1b4332',
  acid_base: '#2d6a4f',
  gas: '#1b4332',
  polymer: '#40916c',
  biochem: '#2d6a4f',
  nuclear: '#1b4332',
  electrochem: '#40916c',
  thermo: '#2d6a4f',
  catalyst: '#1b4332',
  mineral: '#40916c',
};

// --- Canvas Setup ---
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let W, H, cx, cy;
function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  cx = W / 2;
  cy = H / 2;
}
resize();
window.addEventListener('resize', resize);

// --- Dot Class ---
class ChemDot {
  constructor() {
    this.entity = CHEMISTRY_ENTITIES[Math.floor(Math.random() * CHEMISTRY_ENTITIES.length)];
    this.reset();
  }

  reset() {
    const angle = Math.random() * Math.PI * 2;
    const spawnRadius = 20 + Math.random() * 40;
    this.x = cx + Math.cos(angle) * spawnRadius;
    this.y = cy + Math.sin(angle) * spawnRadius;
    this.angle = angle;
    this.speed = 0.15 + Math.random() * 0.35;
    this.radius = 2.5 + Math.random() * 2.5;
    this.opacity = 0;
    this.fadeIn = true;
    this.maxOpacity = 0.5 + Math.random() * 0.4;
    this.entity = CHEMISTRY_ENTITIES[Math.floor(Math.random() * CHEMISTRY_ENTITIES.length)];
    this.driftSpeed = (Math.random() - 0.5) * 0.08;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.angle += this.driftSpeed * 0.01;

    if (this.fadeIn) {
      this.opacity += 0.008;
      if (this.opacity >= this.maxOpacity) {
        this.opacity = this.maxOpacity;
        this.fadeIn = false;
      }
    }

    const dist = Math.sqrt((this.x - cx) ** 2 + (this.y - cy) ** 2);
    const maxDist = Math.max(W, H) * 0.55;
    if (dist > maxDist * 0.75) {
      this.opacity -= 0.004;
    }

    if (this.opacity <= 0 || this.x < -50 || this.x > W + 50 || this.y < -50 || this.y > H + 50) {
      this.reset();
    }
  }

  draw(ctx) {
    const color = DOT_COLORS[this.entity.type];
    const dist = Math.sqrt((this.x - cx) ** 2 + (this.y - cy) ** 2);
    // Scale from 0.3x to 1.0x, reaching full size at 250px from center
    const scale = Math.min(1, 0.3 + (dist / 250) * 0.7);
    const drawRadius = this.radius * scale;

    ctx.beginPath();
    ctx.arc(this.x, this.y, drawRadius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = this.opacity;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// --- Create dots ---
const DOT_COUNT = 180;
let dots = [];
for (let i = 0; i < DOT_COUNT; i++) {
  const d = new ChemDot();
  const angle = Math.random() * Math.PI * 2;
  const r = Math.random() * Math.max(W, H) * 0.45;
  d.x = cx + Math.cos(angle) * r;
  d.y = cy + Math.sin(angle) * r;
  d.opacity = d.maxOpacity * Math.random();
  d.fadeIn = false;
  dots.push(d);
}

// --- Mouse State ---
let mouse = { x: -9999, y: -9999 };
let mouseOverUI = false;

document.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;

  // Check if mouse is over any interactive UI element
  const el = document.elementFromPoint(e.clientX, e.clientY);
  if (el) {
    mouseOverUI = !!el.closest('.search-bar-wrapper, .linear-toggle-container, button, a, input, form');
  } else {
    mouseOverUI = false;
  }
});
document.addEventListener('mouseleave', () => {
  mouse.x = -9999;
  mouse.y = -9999;
  mouseOverUI = false;
});

// --- Search Bar Integration ---
const searchTopic = document.getElementById('search-topic');

// --- Search Bar Category Cycler (independent of dots) ---
const allCategories = Object.values(CATEGORY_TEXT);
let currentCategory = 'Chemistry';
let categoryFading = false;
let lastCategoryIdx = -1;

function cycleCategory() {
  if (categoryFading) return;

  let nextIdx;
  do {
    nextIdx = Math.floor(Math.random() * allCategories.length);
  } while (nextIdx === lastCategoryIdx);

  lastCategoryIdx = nextIdx;
  const next = allCategories[nextIdx];

  if (next === currentCategory) return;

  categoryFading = true;
  searchTopic.classList.add('fade-out');
  setTimeout(() => {
    currentCategory = next;
    searchTopic.textContent = currentCategory;
    searchTopic.classList.remove('fade-out');
    searchTopic.classList.add('fade-in');
    setTimeout(() => {
      searchTopic.classList.remove('fade-in');
      categoryFading = false;
    }, 300);
  }, 300);
}

// --- Search Bar Typewriter Effect on Load ---
function typeWriter(element, text, speed, callback) {
  let i = 0;
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else if (callback) {
      callback();
    }
  }
  type();
}

window.addEventListener('DOMContentLoaded', () => {
  const prefixEl = document.getElementById('search-prefix');
  const topicEl = document.getElementById('search-topic');
  
  setTimeout(() => {
    typeWriter(prefixEl, "I want to learn about ", 40, () => {
      typeWriter(topicEl, "Chemistry", 50, () => {
        // Start the infinite category cycling 3 seconds after typing is complete
        setTimeout(() => {
          setInterval(cycleCategory, 3000);
        }, 3000);
      });
    });
  }, 500); 
});

// --- Label DOM Pool with smooth fade ---
const CONNECTION_RADIUS = 160;
const MAX_CONNECTIONS = 6;
const labelContainer = document.getElementById('floating-labels');
const LABEL_POOL_SIZE = 15; // extra slots so fading-out labels don't block new ones

const labelPool = [];
for (let i = 0; i < LABEL_POOL_SIZE; i++) {
  const el = document.createElement('div');
  el.className = 'chem-label';
  el.style.position = 'fixed';
  el.style.pointerEvents = 'none';
  el.style.zIndex = '8';
  el.innerHTML = '<span class="chem-label-symbol"></span><span class="chem-label-name"></span>';
  labelContainer.appendChild(el);
  labelPool.push({
    el,
    dotIdx: -1,
    currentOpacity: 0,
    targetX: 0,
    targetY: 0,
    currentX: -200,
    currentY: -200
  });
}

// --- Connection Line Canvas (overlay) ---
const lineCanvas = document.createElement('canvas');
lineCanvas.id = 'line-canvas';
lineCanvas.style.cssText = 'position:fixed;inset:0;z-index:4;pointer-events:none;';
document.body.appendChild(lineCanvas);
const lineCtx = lineCanvas.getContext('2d');

function resizeLineCanvas() {
  lineCanvas.width = window.innerWidth;
  lineCanvas.height = window.innerHeight;
}
resizeLineCanvas();
window.addEventListener('resize', resizeLineCanvas);

// --- Animation Loop ---
function animate() {
  requestAnimationFrame(animate);

  ctx.clearRect(0, 0, W, H);

  for (const dot of dots) {
    dot.update();
    dot.draw(ctx);
  }

  // Find nearest dots to cursor (skip if mouse is over UI)
  const connected = [];
  if (mouse.x > 0 && mouse.y > 0 && !mouseOverUI) {
    const withDist = dots.map((d, idx) => ({
      dot: d,
      idx: idx,
      dist: Math.sqrt((d.x - mouse.x) ** 2 + (d.y - mouse.y) ** 2)
    }))
    .filter(d => d.dist < CONNECTION_RADIUS && d.dot.opacity > 0.15)
    .sort((a, b) => a.dist - b.dist)
    .slice(0, MAX_CONNECTIONS);

    for (const wd of withDist) {
      connected.push({ dot: wd.dot, idx: wd.idx });
    }
  }

  // Draw connection lines — black matte
  lineCtx.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
  if (connected.length > 0) {
    for (const { dot } of connected) {
      const dist = Math.sqrt((dot.x - mouse.x) ** 2 + (dot.y - mouse.y) ** 2);
      const alpha = Math.max(0, 1 - dist / CONNECTION_RADIUS) * 0.7;

      lineCtx.beginPath();
      lineCtx.moveTo(mouse.x, mouse.y);
      lineCtx.lineTo(dot.x, dot.y);
      lineCtx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
      lineCtx.lineWidth = 1.2;
      lineCtx.stroke();
    }

    // cursor dot — black matte
    lineCtx.beginPath();
    lineCtx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
    lineCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    lineCtx.fill();
  }

  // Update labels — track by dot index so fade out works properly
  const FADE_IN_TIME = 0.1;
  const FADE_OUT_TIME = 1.0;
  const dt = 1 / 60;

  const connectedIdxSet = new Set(connected.map(c => c.idx));

  // Mark existing labels: if their dot is still connected, keep fading in; otherwise fade out
  for (const label of labelPool) {
    if (label.dotIdx !== -1 && connectedIdxSet.has(label.dotIdx)) {
      // Still connected — update position and fade in
      const dot = dots[label.dotIdx];
      label.targetX = dot.x + 14;
      label.targetY = dot.y - 20;
      label.currentX += (label.targetX - label.currentX) * 0.15;
      label.currentY += (label.targetY - label.currentY) * 0.15;
      label.currentOpacity = Math.min(1, label.currentOpacity + dt / FADE_IN_TIME);
      label.el.querySelector('.chem-label-symbol').textContent = dot.entity.symbol;
      label.el.querySelector('.chem-label-name').textContent = dot.entity.name;
      label.el.setAttribute('data-type', dot.entity.type);
      connectedIdxSet.delete(label.dotIdx); // claimed
    } else if (label.dotIdx !== -1) {
      // Disconnected — fade out, keep old position/text
      label.currentOpacity = Math.max(0, label.currentOpacity - dt / FADE_OUT_TIME);
      if (label.currentOpacity <= 0) {
        label.dotIdx = -1; // free the slot
      }
    }
  }

  // Assign remaining new connections to free label slots
  for (const { idx } of connected) {
    if (!connectedIdxSet.has(idx)) continue; // already claimed
    // Find a free slot
    const freeLabel = labelPool.find(l => l.dotIdx === -1);
    if (!freeLabel) break;

    const dot = dots[idx];
    freeLabel.dotIdx = idx;
    freeLabel.currentOpacity = 0;
    freeLabel.targetX = dot.x + 14;
    freeLabel.targetY = dot.y - 20;
    freeLabel.currentX = freeLabel.targetX;
    freeLabel.currentY = freeLabel.targetY;
    freeLabel.el.querySelector('.chem-label-symbol').textContent = dot.entity.symbol;
    freeLabel.el.querySelector('.chem-label-name').textContent = dot.entity.name;
    freeLabel.el.setAttribute('data-type', dot.entity.type);
  }

  // Apply opacity and position
  for (const label of labelPool) {
    label.el.style.opacity = label.currentOpacity;
    label.el.style.left = label.currentX + 'px';
    label.el.style.top = label.currentY + 'px';
  }

}

animate();

(function () {
  const searchPlaceholder = document.getElementById('search-placeholder');
  const searchForm = document.getElementById('search-form');
  const searchInput = searchForm.querySelector('input');
  const menuBtn = document.querySelector('.search-menu-btn');
  const submitBtn = document.getElementById('search-submit-btn');
  const wrapper = document.querySelector('.search-bar-wrapper');

  let isMenuOpen = false;
  const DOTS_SVG = '<svg class="btn-icon" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 -6.5 17 17"><path d="M1.70996 3.39844c-.31901 0-.60547-.07487-.859374-.22461-.253906-.14974-.458984-.35156-.615234-.60547-.1562504-.26042-.23437544-.55013-.23437544-.86914 0-.3125.07812504-.5957.23437544-.849611C.391602.589193.59668.384115.850586.234375 1.10449.078125 1.39095 0 1.70996 0c.30599 0 .58919.078125.84961.234375.26042.14974.4655.354818.61523.615234.15625.253911.23438.537111.23438.849611 0 .31901-.07813.60872-.23438.86914-.14973.25391-.35481.45573-.61523.60547-.26042.14974-.54362.22461-.84961.22461Zm6.74805 0c-.31901 0-.60873-.07487-.86914-.22461-.25391-.14974-.45899-.35156-.61524-.60547-.14974-.26042-.22461-.55013-.22461-.86914 0-.3125.07487-.5957.22461-.849611.15625-.260416.36133-.465494.61524-.615234C7.84928.078125 8.139 0 8.45801 0c.30599 0 .58919.078125.84961.234375.26041.14974.46549.354818.61523.615234.15625.253911.23435.537111.23435.849611 0 .31901-.0781.60872-.23435.86914-.14974.25391-.35482.45573-.61523.60547-.26042.14974-.54362.22461-.84961.22461Zm6.74809 0c-.3191 0-.6088-.07487-.8692-.22461-.2539-.14974-.459-.35156-.6152-.60547-.1498-.26042-.2246-.55013-.2246-.86914 0-.3125.0748-.5957.2246-.849611.1562-.260416.3613-.465494.6152-.615234C14.5973.078125 14.887 0 15.2061 0c.3059 0 .5891.078125.8496.234375.2604.14974.4655.354818.6152.615234.1562.253911.2344.537111.2344.849611 0 .31901-.0782.60872-.2344.86914-.1497.25391-.3548.45573-.6152.60547-.2605.14974-.5437.22461-.8496.22461Z" fill="currentColor"></path></svg>';
  const X_SVG = '<svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function updateIcons() {
    const hasText = searchInput.value.length > 0;
    
    // Toggle arrow button
    if (hasText) {
      submitBtn.classList.add('visible');
    } else {
      submitBtn.classList.remove('visible');
    }

    // Toggle menu icon (priority to X if text exists or menu open)
    if (hasText || isMenuOpen) {
      menuBtn.innerHTML = X_SVG;
    } else {
      menuBtn.innerHTML = DOTS_SVG;
    }
  }

  searchPlaceholder.addEventListener('click', () => {
    searchPlaceholder.style.opacity = '0';
    searchForm.classList.add('active');
    searchInput.focus();
  });

  searchInput.addEventListener('input', updateIcons);

  searchInput.addEventListener('blur', () => {
    if (!searchInput.value) {
      searchPlaceholder.style.opacity = '1';
      searchForm.classList.remove('active');
      updateIcons();
    }
  });

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    
    if (searchInput.value.length > 0) {
      // Clear function
      searchInput.value = '';
      if (document.activeElement !== searchInput) {
        searchPlaceholder.style.opacity = '1';
        searchForm.classList.remove('active');
      }
      updateIcons();
    } else {
      // Toggle menu function
      isMenuOpen = !isMenuOpen;
      wrapper.classList.toggle('expanded', isMenuOpen);
      updateIcons();
    }
  });

  document.addEventListener('click', (e) => {
    if (isMenuOpen && !wrapper.contains(e.target)) {
      isMenuOpen = false;
      wrapper.classList.remove('expanded');
      updateIcons();
    }
  });

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `molecule.html?q=${encodeURIComponent(query)}`;
    }
  });

  // Wire up the external submit button (Arrow)
  submitBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `molecule.html?q=${encodeURIComponent(query)}`;
    }
  });
})();

// --- Random Cool Fact Button ---
(function () {
  const factBtn = document.querySelector('.linear-toggle');
  const factText = factBtn ? factBtn.querySelector('.linear-text') : null;
  const wrapper = document.querySelector('.search-bar-wrapper');

  if (!factBtn || !factText) return;

  factBtn.addEventListener('click', () => {
    const isFactMode = document.body.classList.toggle('fact-mode');
    
    if (isFactMode) {
      factText.textContent = 'Back';
      if (wrapper.classList.contains('expanded')) {
        wrapper.classList.remove('expanded');
      }
    } else {
      factText.textContent = 'Random fact';
    }
  });
})();


