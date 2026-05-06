// ============================================
// Molecule View Logic (Dedicated Page)
// ============================================

(function () {
  if (typeof THREE === 'undefined') return;

  // -- Sidebar Toggle --
  const panel = document.getElementById('mol-side-panel');
  const handle = document.getElementById('mol-panel-handle');
  const handleIcon = document.getElementById('handle-icon');

  handle.addEventListener('click', () => {
    panel.classList.toggle('open');
  });

  // -- Element Data --
  const EL = {
    H: { name: 'Hydrogen', color: '#FFFFFF', r: 0.53, mass: 1.008, group: 'Nonmetal', desc: 'Lightest element; most abundant in the universe.' },
    He: { name: 'Helium', color: '#D9FFFF', r: 0.31, mass: 4.003, group: 'Noble Gas', desc: 'Does not form chemical bonds.' },
    Li: { name: 'Lithium', color: '#CC80FF', r: 1.67, mass: 6.941, group: 'Alkali Metal', desc: 'Lightest metal.' },
    B: { name: 'Boron', color: '#FFB5B5', r: 0.87, mass: 10.81, group: 'Metalloid', desc: 'Used in borosilicate glass.' },
    C: { name: 'Carbon', color: '#404040', r: 0.77, mass: 12.011, group: 'Nonmetal', desc: 'Backbone of all organic chemistry. Forms 4 bonds.' },
    N: { name: 'Nitrogen', color: '#3050F8', r: 0.75, mass: 14.007, group: 'Nonmetal', desc: '78% of Earth\'s atmosphere.' },
    O: { name: 'Oxygen', color: '#FF0D0D', r: 0.73, mass: 15.999, group: 'Nonmetal', desc: 'Essential for respiration and combustion.' },
    F: { name: 'Fluorine', color: '#90E050', r: 0.64, mass: 18.998, group: 'Halogen', desc: 'Most electronegative element.' },
    Na: { name: 'Sodium', color: '#AB5CF2', r: 1.90, mass: 22.990, group: 'Alkali Metal', desc: 'Highly reactive with water.' },
    Mg: { name: 'Magnesium', color: '#8AFF00', r: 1.45, mass: 24.305, group: 'Alkaline Earth', desc: 'Central atom in chlorophyll.' },
    Al: { name: 'Aluminum', color: '#BFA6A6', r: 1.18, mass: 26.982, group: 'Post-transition', desc: 'Lightweight and corrosion-resistant.' },
    Si: { name: 'Silicon', color: '#F0C8A0', r: 1.11, mass: 28.085, group: 'Metalloid', desc: 'Basis of semiconductor technology.' },
    P: { name: 'Phosphorus', color: '#FF8000', r: 1.06, mass: 30.974, group: 'Nonmetal', desc: 'Critical for DNA/RNA backbone and ATP.' },
    S: { name: 'Sulfur', color: '#FFFF30', r: 1.02, mass: 32.060, group: 'Nonmetal', desc: 'Found in proteins (disulfide bonds).' },
    Cl: { name: 'Chlorine', color: '#1FF01F', r: 0.99, mass: 35.450, group: 'Halogen', desc: 'Used in water disinfection.' },
    K: { name: 'Potassium', color: '#8F40D4', r: 2.43, mass: 39.098, group: 'Alkali Metal', desc: 'Critical for heart function.' },
    Ca: { name: 'Calcium', color: '#3DFF00', r: 1.94, mass: 40.078, group: 'Alkaline Earth', desc: 'Builds bones and teeth.' },
    Fe: { name: 'Iron', color: '#E06633', r: 1.56, mass: 55.845, group: 'Transition', desc: 'Central atom of hemoglobin.' },
    Cu: { name: 'Copper', color: '#C88033', r: 1.28, mass: 63.546, group: 'Transition', desc: 'Excellent electrical conductor.' },
    Zn: { name: 'Zinc', color: '#7D80B0', r: 1.22, mass: 65.380, group: 'Transition', desc: 'Essential for immune function.' },
    Br: { name: 'Bromine', color: '#A62929', r: 1.14, mass: 79.904, group: 'Halogen', desc: 'Liquid at room temperature.' },
    Se: { name: 'Selenium', color: '#FFA100', r: 1.03, mass: 78.971, group: 'Nonmetal', desc: 'Antioxidant trace element.' },
    I: { name: 'Iodine', color: '#940094', r: 1.33, mass: 126.90, group: 'Halogen', desc: 'Essential for thyroid hormones.' },
    default: { name: 'Element', color: '#BBBBBB', r: 0.80, mass: 0, group: 'Unknown', desc: 'Details not available.' }
  };
  function elInfo(sym) { return EL[sym] || { ...EL.default, name: sym }; }

  const AN2SYM = {
    1:'H',2:'He',3:'Li',4:'Be',5:'B',6:'C',7:'N',8:'O',9:'F',10:'Ne',
    11:'Na',12:'Mg',13:'Al',14:'Si',15:'P',16:'S',17:'Cl',18:'Ar',
    19:'K',20:'Ca',21:'Sc',22:'Ti',23:'V',24:'Cr',25:'Mn',26:'Fe',
    27:'Co',28:'Ni',29:'Cu',30:'Zn',33:'As',34:'Se',35:'Br',36:'Kr',
    37:'Rb',38:'Sr',39:'Y',53:'I',56:'Ba',80:'Hg',82:'Pb',83:'Bi'
  };
  function atomicNum2sym(n) { return AN2SYM[n] || ('X' + n); }

  // -- Three.js Setup --
  const canvas3d = document.getElementById('three-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas: canvas3d, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
  camera.position.set(0, 0, 16);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dl1 = new THREE.DirectionalLight(0xffffff, 0.85); dl1.position.set(8, 12, 8); scene.add(dl1);
  const dl2 = new THREE.DirectionalLight(0xffffff, 0.3); dl2.position.set(-6, -6, -6); scene.add(dl2);

  const molGroup = new THREE.Group();
  scene.add(molGroup);
  let atomMeshes = [], hoveredMesh = null;

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  // -- Controls --
  let isDrag = false, isRightDrag = false;
  let prevX = 0, prevY = 0, velX = 0, velY = 0;
  let zoom = 16, autoRot = true;
  let idleTimer = null;

  function resetIdleTimer() {
    autoRot = false;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { autoRot = true; }, 10000);
  }

  canvas3d.addEventListener('contextmenu', e => e.preventDefault());
  canvas3d.addEventListener('mousedown', e => {
    resetIdleTimer();
    if (e.button === 2) isRightDrag = true;
    else { isDrag = true; velX = velY = 0; }
    prevX = e.clientX; prevY = e.clientY;
  });
  window.addEventListener('mouseup', () => { isDrag = false; isRightDrag = false; });
  canvas3d.addEventListener('mouseleave', () => hideTooltip());

  canvas3d.addEventListener('mousemove', e => {
    if (isDrag) {
      resetIdleTimer();
      velY = (e.clientX - prevX) * 0.006; velX = (e.clientY - prevY) * 0.006;
      molGroup.rotation.y += velY; molGroup.rotation.x += velX;
      prevX = e.clientX; prevY = e.clientY; hideTooltip();
    } else if (isRightDrag) {
      resetIdleTimer();
      molGroup.position.x += (e.clientX - prevX) * 0.01;
      molGroup.position.y -= (e.clientY - prevY) * 0.01;
      prevX = e.clientX; prevY = e.clientY;
    } else {
      doHover(e);
    }
  });

  canvas3d.addEventListener('wheel', e => {
    resetIdleTimer();
    zoom = Math.max(2, Math.min(80, zoom + e.deltaY * 0.025));
    camera.position.z = zoom;
  });

  canvas3d.addEventListener('click', e => {
    resetIdleTimer();
    doClick(e);
  });

  const rc = new THREE.Raycaster(), mPos = new THREE.Vector2();
  function setMouse(e) { 
    mPos.x = (e.clientX / window.innerWidth) * 2 - 1; 
    mPos.y = -(e.clientY / window.innerHeight) * 2 + 1; 
  }

  function doHover(e) {
    if (!atomMeshes.length) return;
    setMouse(e); rc.setFromCamera(mPos, camera);
    const hits = rc.intersectObjects(atomMeshes);
    if (hits.length) {
      const m = hits[0].object;
      if (hoveredMesh !== m) { if (hoveredMesh) hoveredMesh.material.emissiveIntensity = 0.08; hoveredMesh = m; m.material.emissiveIntensity = 0.55; canvas3d.style.cursor = 'pointer'; }
      showTooltip(e, m.userData.sym);
    } else {
      if (hoveredMesh) { hoveredMesh.material.emissiveIntensity = 0.08; hoveredMesh = null; }
      canvas3d.style.cursor = 'default'; hideTooltip();
    }
  }

  function doClick(e) {
    if (!atomMeshes.length) return;
    setMouse(e); rc.setFromCamera(mPos, camera);
    const hits = rc.intersectObjects(atomMeshes);
    if (hits.length) showAtomCard(hits[0].object.userData.sym);
  }

  const tooltip = document.getElementById('atom-tooltip');
  function showTooltip(e, sym) {
    const info = elInfo(sym);
    document.getElementById('tt-sym').textContent = sym;
    document.getElementById('tt-nm').textContent = info.name;
    tooltip.style.display = 'block';
    let x = e.clientX + 14, y = e.clientY - 8;
    if (x + 185 > window.innerWidth) x = e.clientX - 190;
    tooltip.style.left = x + 'px'; tooltip.style.top = y + 'px';
  }
  function hideTooltip() { tooltip.style.display = 'none'; }

  function showAtomCard(sym) {
    const info = elInfo(sym);
    if (!panel.classList.contains('open')) panel.classList.add('open');
    const card = document.getElementById('atom-card');
    card.style.display = 'block';
    
    card.innerHTML = `
      <div style="display:flex; align-items:flex-start; margin-bottom:1.5rem">
        <div class="ac-sym">${sym}</div>
        <div style="flex:1">
          <div class="ac-name">${info.name}</div>
          <div style="display:flex; gap:1rem; font-size:1rem; color:rgba(255,255,255,0.4);">
             <span>${info.group}</span>
             <span>•</span>
             <span>${info.mass} u</span>
          </div>
        </div>
        <div style="width:1rem; height:1rem; border-radius:50%; background:${info.color}; box-shadow:0 0 10px ${info.color};"></div>
      </div>
      <div class="ac-desc">${info.desc}</div>
      <div style="margin-top:1.5rem; display:grid; grid-template-columns:1fr 1fr; gap:0.8rem;">
         <div style="background:rgba(255,255,255,0.03); padding:0.8rem; border-radius:0.8rem; border:1px solid rgba(255,255,255,0.05)">
            <div style="font-size:0.75rem; text-transform:uppercase; color:rgba(255,255,255,0.3); margin-bottom:0.2rem">Radius</div>
            <div style="font-size:1.1rem; color:#ABC4B0">${info.r} Å</div>
         </div>
         <div style="background:rgba(255,255,255,0.03); padding:0.8rem; border-radius:0.8rem; border:1px solid rgba(255,255,255,0.05)">
            <div style="font-size:0.75rem; text-transform:uppercase; color:rgba(255,255,255,0.3); margin-bottom:0.2rem">Mass</div>
            <div style="font-size:1.1rem; color:#ABC4B0">${info.mass}</div>
         </div>
      </div>
    `;
  }

  function animate() {
    requestAnimationFrame(animate);
    if (autoRot && !isDrag && molGroup.children.length > 0) molGroup.rotation.y += 0.003;
    if (!isDrag) { velX *= 0.92; velY *= 0.92; molGroup.rotation.x += velX; molGroup.rotation.y += velY; }
    renderer.render(scene, camera);
  }
  animate();

  function buildMolecule(atoms, bonds) {
    while (molGroup.children.length) {
      const c = molGroup.children[0];
      c.geometry?.dispose(); c.material?.dispose();
      molGroup.remove(c);
    }
    atomMeshes = []; hoveredMesh = null;
    if (!atoms.length) return;

    let cx = 0, cy = 0, cz = 0;
    atoms.forEach(a => { cx += a.x; cy += a.y; cz += a.z; });
    cx /= atoms.length; cy /= atoms.length; cz /= atoms.length;

    let maxD = 0;
    atoms.forEach(a => { const d = Math.sqrt((a.x - cx) ** 2 + (a.y - cy) ** 2 + (a.z - cz) ** 2); if (d > maxD) maxD = d; });
    const scale = maxD > 0.5 ? 5.5 / maxD : 1.8;

    atoms.forEach((atom, i) => {
      const info = elInfo(atom.sym);
      const r = Math.max(0.18, info.r * 0.42 * scale * 0.38);
      const geo = new THREE.SphereGeometry(r, 30, 30);
      const mat = new THREE.MeshPhongMaterial({
        color: new THREE.Color(info.color),
        emissive: new THREE.Color(info.color),
        emissiveIntensity: 0.08,
        shininess: 95, specular: new THREE.Color(0xffffff)
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set((atom.x - cx) * scale, (atom.y - cy) * scale, (atom.z - cz) * scale);
      mesh.userData = { sym: atom.sym, index: i };
      molGroup.add(mesh); atomMeshes.push(mesh);
    });

    bonds.forEach(bond => {
      const a1 = atoms[bond.a], a2 = atoms[bond.b];
      if (!a1 || !a2) return;
      const p1 = new THREE.Vector3((a1.x - cx) * scale, (a1.y - cy) * scale, (a1.z - cz) * scale);
      const p2 = new THREE.Vector3((a2.x - cx) * scale, (a2.y - cy) * scale, (a2.z - cz) * scale);
      const dir = new THREE.Vector3().subVectors(p2, p1);
      const len = dir.length();
      if (len < 0.05) return;
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      dir.normalize();
      const order = Math.min(bond.order || 1, 3);
      const offsets = order === 1 ? [0] : order === 2 ? [-0.075, 0.075] : [-0.115, 0, 0.115];
      offsets.forEach(off => {
        const cr = 0.036 * scale * 0.52;
        const geo = new THREE.CylinderGeometry(cr, cr, len, 10);
        const mat = new THREE.MeshPhongMaterial({ color: 0x4B6B54, emissive: 0x1A281E, emissiveIntensity: 0.3, shininess: 20 }); // Adjusted bond color to match #ABC4B0 theme
        const cyl = new THREE.Mesh(geo, mat);
        cyl.position.copy(mid);
        cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        if (off !== 0) { const perp = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0.001)).normalize(); cyl.position.addScaledVector(perp, off * scale); }
        molGroup.add(cyl);
      });
    });

    zoom = Math.max(6, maxD * scale * 2.5 + 4);
    camera.position.z = zoom;
    molGroup.position.set(0, 0, 0);
    molGroup.rotation.set(0.3, 0.5, 0);
    autoRot = true;
  }

  // -- Data Fetching --
  const BASE = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';
  async function fetchMolecule(name) {
    const loadText = document.getElementById('loading-text');
    loadText.textContent = 'Looking up compound…';
    const cidRes = await fetch(`${BASE}/compound/name/${encodeURIComponent(name)}/cids/JSON`);
    if (!cidRes.ok) throw new Error(`Compound "${name}" not found.`);
    const cidJson = await cidRes.json();
    const cid = cidJson.IdentifierList.CID[0];

    loadText.textContent = 'Downloading 3D coordinates…';
    let conformerData = null;
    try {
      const r3d = await fetch(`${BASE}/compound/cid/${cid}/JSON?record_type=3d`);
      if (r3d.ok) conformerData = await r3d.json();
    } catch (e) { }

    if (!conformerData) {
      loadText.textContent = 'Using 2D layout…';
      const r2d = await fetch(`${BASE}/compound/cid/${cid}/JSON`);
      if (!r2d.ok) throw new Error('Structure data failed.');
      conformerData = await r2d.json();
    }

    loadText.textContent = 'Fetching properties…';
    const propFields = 'MolecularFormula,MolecularWeight,IUPACName';
    const propRes = await fetch(`${BASE}/compound/cid/${cid}/property/${propFields}/JSON`);
    const props = propRes.ok ? (await propRes.json()).PropertyTable.Properties[0] : {};

    const cpd = conformerData.PC_Compounds[0];
    const atomSection = cpd.atoms;
    const coordSection = cpd.coords?.[0];
    const bondSection = cpd.bonds;

    const atomSymbols = atomSection.element.map(n => atomicNum2sym(n));
    let xs = [], ys = [], zs = [];
    if (coordSection) {
      if (coordSection.conformers?.[0]) {
        xs = coordSection.conformers[0].x || [];
        ys = coordSection.conformers[0].y || [];
        zs = coordSection.conformers[0].z || new Array(xs.length).fill(0);
      } else {
        xs = coordSection.x || []; ys = coordSection.y || [];
        zs = coordSection.z || new Array(xs.length).fill(0);
      }
    }
    const atoms = atomSymbols.map((sym, i) => ({ sym, x: xs[i] || 0, y: ys[i] || 0, z: zs[i] || 0 }));

    const bonds = [];
    if (bondSection) {
      for (let i = 0; i < bondSection.aid1.length; i++) {
        bonds.push({ a: bondSection.aid1[i] - 1, b: bondSection.aid2[i] - 1, order: bondSection.order[i] });
      }
    }

    return { cid, atoms, bonds, props, name };
  }

  function updatePanel(molData) {
    const { atoms, props, name } = molData;
    document.getElementById('mol-content').style.display = 'block';
    document.getElementById('atom-card').style.display = 'none';

    const comp = {};
    atoms.forEach(a => { comp[a.sym] = (comp[a.sym] || 0) + 1; });
    const chipsHtml = Object.entries(comp).map(([sym, cnt]) => {
      const info = elInfo(sym);
      return `<span class="atom-chip"><span class="atom-dot" style="background:${info.color}"></span>${sym}: ${cnt}</span>`;
    }).join('');

    const weight = props.MolecularWeight ? parseFloat(props.MolecularWeight).toFixed(2) : '—';
    const atomCount = atoms.length;

    document.getElementById('mol-main').innerHTML = `
      <div class="mol-name">${name.charAt(0).toUpperCase() + name.slice(1)}</div>
      <div class="mol-formula">${props.MolecularFormula || '—'}</div>
      
      <div class="quick-stats">
        <div class="stat-card">
          <div class="stat-label">Weight</div>
          <div class="stat-value">${weight}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Atoms</div>
          <div class="stat-value">${atomCount}</div>
        </div>
      </div>

      <div class="info-block iupac-block" onclick="this.classList.toggle('expanded');">
        <div class="iupac-header">
          <div class="info-label">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg>
             IUPAC Name
          </div>
          <div class="toggle-indicator">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>
        <div class="info-value iupac-content">${props.IUPACName || name}</div>
      </div>

      <div class="info-block">
        <div class="info-label">
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
           Composition
        </div>
        <div class="info-value" style="display:flex;flex-wrap:wrap; gap: 0.5rem; margin-top:0.5rem">${chipsHtml}</div>
      </div>
      
      <div class="info-block">
        <div class="info-label">
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
           PubChem CID
        </div>
        <div class="info-value">
          ${molData.cid ? `<a href="https://pubchem.ncbi.nlm.nih.gov/compound/${molData.cid}" target="_blank" style="color: #ABC4B0; text-decoration: none; border-bottom: 1px solid rgba(171, 196, 176, 0.4); transition: all 0.2s;">${molData.cid}</a>` : '—'}
        </div>
      </div>
    `;
  }

  function startMoleculeSearch(val) {
    document.getElementById('mol-search-input').value = val;
    document.getElementById('mol-loading').classList.add('show');
    panel.classList.remove('open'); // Hide panel while searching
    
    fetchMolecule(val).then(data => {
      buildMolecule(data.atoms, data.bonds);
      updatePanel(data);
      document.getElementById('mol-loading').classList.remove('show');
      setTimeout(() => panel.classList.add('open'), 100); // Slide open when ready
    }).catch(e => {
      document.getElementById('mol-loading').classList.remove('show');
      const err = document.getElementById('error-msg');
      err.textContent = e.message;
      err.style.display = 'block';
      setTimeout(() => err.style.display = 'none', 5000);
    });
  }

  // --- Parse URL and Initial Load ---
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q');

  const searchForm = document.getElementById('mol-search-form');
  const searchInput = document.getElementById('mol-search-input');
  const submitBtn = document.getElementById('mol-search-submit');
  const clearBtn = document.getElementById('mol-search-clear');
  const placeholder = document.getElementById('search-placeholder');

  // Activate the search bar immediately
  searchForm.classList.add('active');
  // Submit button starts hidden, will slide in on text
  submitBtn.classList.remove('visible');

  // Show the placeholder text like the main page does
  if (placeholder) placeholder.style.display = 'none';

  // Pre-fill with the searched query
  if (query) {
    searchInput.value = query;
    startMoleculeSearch(query);
  } else {
    startMoleculeSearch('water');
  }

  const factToggle = document.getElementById('fact-mode-toggle');
  const factCard = document.getElementById('fact-card');
  const factTitle = document.getElementById('fact-title');
  const factBody = document.getElementById('fact-body');

  const moleculeFacts = {
    'water': 'Water is the only substance on Earth that naturally occurs in all three physical states: solid, liquid, and gas.',
    'caffeine': 'Caffeine is technically a natural pesticide; it paralyzes and kills certain insects feeding on the plants.',
    'aspirin': 'The active ingredient in Aspirin (salicylic acid) was originally found in willow tree bark.',
    'ethanol': 'Alcohol is produced naturally by some fruits when they ferment, and even butterflies have been known to get "drunk" on fermented fruit!',
    'methane': 'Methane is a much more potent greenhouse gas than carbon dioxide, trapping 25 times more heat in the atmosphere.',
    'glucose': 'Your brain uses about 20% of the glucose (sugar) in your body as its primary energy source.',
    'ammonia': 'Ammonia was the first complex molecule found in interstellar space back in 1968.'
  };

  function updateFact(molName) {
    const cleanName = molName.toLowerCase();
    factTitle.textContent = `Did you know? (${molName})`;
    factBody.textContent = moleculeFacts[cleanName] || `The molecule "${molName}" is composed of atoms held together by chemical bonds, forming a unique geometric structure that defines its properties.`;
  }

  if (factToggle) {
    factToggle.addEventListener('click', () => {
      const isFactMode = document.body.classList.toggle('fact-mode');
      const currentMol = searchInput.value || 'this molecule';
      
      if (isFactMode) {
        updateFact(currentMol);
        factToggle.querySelector('.linear-text').textContent = 'Back to View';
      } else {
        factToggle.querySelector('.linear-text').textContent = 'Show Fact';
      }
    });
  }

  // --- Shared SVG Constants (matching script.js) ---
  const DOTS_SVG = '<svg class="btn-icon" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 -6.5 17 17"><path d="M1.70996 3.39844c-.31901 0-.60547-.07487-.859374-.22461-.253906-.14974-.458984-.35156-.615234-.60547-.1562504-.26042-.23437544-.55013-.23437544-.86914 0-.3125.07812504-.5957.23437544-.849611C.391602.589193.59668.384115.850586.234375 1.10449.078125 1.39095 0 1.70996 0c.30599 0 .58919.078125.84961.234375.26042.14974.4655.354818.61523.615234.15625.253911.23438.537111.23438.849611 0 .31901-.07813.60872-.23438.86914-.14973.25391-.35481.45573-.61523.60547-.26042.14974-.54362.22461-.84961.22461Zm6.74805 0c-.31901 0-.60873-.07487-.86914-.22461-.25391-.14974-.45899-.35156-.61524-.60547-.14974-.26042-.22461-.55013-.22461-.86914 0-.3125.0748-.5957.22461-.849611.15625-.260416.36133-.465494.61524-.615234C7.84928.078125 8.139 0 8.45801 0c.30599 0 .58919.078125.84961.234375.26041.14974.46549.354818.61523.615234.15625.253911.23435.537111.23435.849611 0 .31901-.0781.60872-.23435.86914-.14974.25391-.35482.45573-.61523.60547-.26042.14974-.54362.22461-.84961.22461Zm6.74809 0c-.3191 0-.6088-.07487-.8692-.22461-.2539-.14974-.459-.35156-.6152-.60547-.1498-.26042-.2246-.55013-.2246-.86914 0-.3125.0748-.5957.2246-.849611.1562-.260416.3613-.465494.6152-.615234C14.5973.078125 14.887 0 15.2061 0c.3059 0 .5891.078125.8496.234375.2604.14974.4655.354818.6152.615234.1562.253911.2344.537111.2344.849611 0 .31901-.0782.60872-.2344.86914-.1497.25391-.3548.45573-.6152.60547-.2605.14974-.5437.22461-.8496.22461Z" fill="currentColor"></path></svg>';
  const X_SVG = '<svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // --- Search Bar State & UI ---
  // If we start with a query in the URL, we consider it "searched" already.
  const urlParams = new URLSearchParams(window.location.search);
  let isSearched = urlParams.has('q');

  function updateSearchUI() {
    const hasText = searchInput.value.trim().length > 0;
    
    // Hide arrow if we just searched OR if there's no text to search for.
    if (isSearched || !hasText) {
      submitBtn.classList.remove('visible');
    } else {
      submitBtn.classList.add('visible');
    }
    
    // Cross is permanent on this page as per request
    clearBtn.innerHTML = X_SVG;
  }

  function triggerSearch() {
    const val = searchInput.value.trim();
    if (val) {
      isSearched = true;
      updateSearchUI();
      const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?q=' + encodeURIComponent(val);
      window.history.pushState({ path: newUrl }, '', newUrl);
      startMoleculeSearch(val);
    }
  }

  // Initial call
  updateSearchUI();

  // --- Search Bar Intercept ---
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    triggerSearch();
  });

  // Wire up submit button click
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    triggerSearch();
  });

  function updateSearchUI() {
    // If we have just searched, hide the arrow. 
    // If we are typing or just cleared, show the arrow.
    if (isSearched) {
      submitBtn.classList.remove('visible');
    } else {
      submitBtn.classList.add('visible');
    }
    
    // Cross is permanent on this page as per request
    clearBtn.innerHTML = X_SVG;
  }

  searchInput.addEventListener('input', () => {
    if (isSearched) {
      isSearched = false;
    }
    updateSearchUI();
  });
  
  // Memory for "undo clear"
  let lastTypedText = '';

  // Clear button logic
  clearBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (searchInput.value.trim().length > 0) {
      // First click: Save what was typed and clear it
      lastTypedText = searchInput.value;
      searchInput.value = '';
      isSearched = false;
      updateSearchUI();
      searchInput.focus(); // Keep cursor for new typing
    } else if (lastTypedText) {
      // Second click (if empty): Restore the last typed text
      searchInput.value = lastTypedText;
      isSearched = false;
      updateSearchUI();
      searchInput.blur(); // Remove cursor after restoring
    }
  });

  // Call initially to set correct state
  updateSearchUI();

})();
