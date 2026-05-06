// ============================================
// Arc Reactor Prototype - Simplified (Tube Only)
// ============================================

(function () {
  if (typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 8);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Brighter ambient for "room" feel
  scene.add(ambientLight);

  // Ceiling light (Directional)
  const ceilingLight = new THREE.DirectionalLight(0xffffff, 0.8);
  ceilingLight.position.set(0, 5, 5);
  scene.add(ceilingLight);

  // Soft fill lights for the "room"
  const fillLight1 = new THREE.PointLight(0xffffff, 0.5, 20);
  fillLight1.position.set(5, -2, 5);
  scene.add(fillLight1);

  const fillLight2 = new THREE.PointLight(0xffffff, 0.3, 20);
  fillLight2.position.set(-5, 0, 5);
  scene.add(fillLight2);

  // Main internal cyan core light
  const coreLight = new THREE.PointLight(0x00f2ff, 4, 10);
  coreLight.position.set(0, 0, 0.5);
  scene.add(coreLight);

  // Rim lighting to highlight the metallic edges
  const rimLight1 = new THREE.PointLight(0xffffff, 1.5, 10);
  rimLight1.position.set(5, 5, 2);
  scene.add(rimLight1);

  const rimLight2 = new THREE.PointLight(0xffffff, 1, 10);
  rimLight2.position.set(-5, -3, 3);
  scene.add(rimLight2);

  // Back light for depth definition
  const backLight = new THREE.PointLight(0x00f2ff, 1.5, 8);
  backLight.position.set(0, 0, -2);
  scene.add(backLight);

  const reactorGroup = new THREE.Group();
  scene.add(reactorGroup);

  // -- Simple Cylindrical Housing --
  const material = new THREE.MeshStandardMaterial({ 
    color: 0x333333, 
    roughness: 0.2, 
    metalness: 0.8 
  });

  // Outer ring
  const ringGeo = new THREE.TorusGeometry(1.5, 0.08, 16, 100);
  const ring = new THREE.Mesh(ringGeo, material);
  reactorGroup.add(ring);

  // The hollow tube (cylinder)
  const cylinderGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.6, 64, 1, true);
  const cylinder = new THREE.Mesh(cylinderGeo, material);
  cylinder.rotation.x = Math.PI / 2;
  reactorGroup.add(cylinder);

  // Inner back ring
  const backRingGeo = new THREE.TorusGeometry(1.4, 0.03, 16, 100);
  const backRing = new THREE.Mesh(backRingGeo, material);
  backRing.position.z = -0.3;
  reactorGroup.add(backRing);

  // Add a grid for context
  const gridHelper = new THREE.GridHelper(10, 10, 0x4B6B54, 0x1A281E);
  gridHelper.position.y = -2;
  gridHelper.rotation.x = Math.PI / 8;
  scene.add(gridHelper);

  // Basic cyan glow for the interior
  const glowMat = new THREE.MeshBasicMaterial({ 
    color: 0x00f2ff,
    transparent: true,
    opacity: 0.2
  });
  const glowCylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(1.38, 1.38, 0.5, 64, 1, true),
    glowMat
  );
  glowCylinder.rotation.x = Math.PI / 2;
  reactorGroup.add(glowCylinder);

  // -- The Inner Glass Chamber --
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x00f2ff,
    metalness: 0.2,
    roughness: 0.05,
    transparent: true,
    opacity: 0.4,
    transmission: 0.9, // Makes it look more like glass
    thickness: 0.5,
  });
  const glassGeo = new THREE.CylinderGeometry(1.35, 1.35, 0.1, 64);
  const glassDisk = new THREE.Mesh(glassGeo, glassMat);
  glassDisk.rotation.x = Math.PI / 2;
  glassDisk.position.z = 0.1; // Slightly forward in the tube
  reactorGroup.add(glassDisk);

  // -- The Glowing Hollow Triangle --
  const outerSide = 0.7;
  const innerSide = 0.5; // Controls the "width" of the triangle frame

  const createTriangleShape = (s) => {
    const shape = new THREE.Shape();
    shape.moveTo(0, s);
    shape.lineTo(s * Math.cos(Math.PI/6 + 2*Math.PI/3), s * Math.sin(Math.PI/6 + 2*Math.PI/3));
    shape.lineTo(s * Math.cos(Math.PI/6 + 4*Math.PI/3), s * Math.sin(Math.PI/6 + 4*Math.PI/3));
    shape.closePath();
    return shape;
  };

  const triangleShape = createTriangleShape(outerSide);
  const holePath = createTriangleShape(innerSide);
  triangleShape.holes.push(holePath);

  const triangleGeo = new THREE.ShapeGeometry(triangleShape);
  const triangleCoreMat = new THREE.MeshBasicMaterial({ 
    color: 0xffffff,
    side: THREE.DoubleSide
  });
  const triangleCore = new THREE.Mesh(triangleGeo, triangleCoreMat);
  triangleCore.position.z = 0.16;
  reactorGroup.add(triangleCore);

  // Blue Glow for the Frame
  const triangleBorderGeo = new THREE.EdgesGeometry(triangleGeo);
  const triangleBorderMat = new THREE.LineBasicMaterial({ color: 0x00f2ff, linewidth: 2 });
  const triangleBorder = new THREE.LineSegments(triangleBorderGeo, triangleBorderMat);
  triangleBorder.position.z = 0.17;
  reactorGroup.add(triangleBorder);

  // Add a stronger light inside the hollow triangle
  const triLight = new THREE.PointLight(0xffffff, 3, 5);
  triLight.position.set(0, 0, 0.2);
  scene.add(triLight);

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) / 200;
    mouseY = (e.clientY - window.innerHeight / 2) / 200;
  });

  function animate() {
    requestAnimationFrame(animate);
    
    // Smooth mouse tilt
    reactorGroup.rotation.x += (mouseY - reactorGroup.rotation.x) * 0.05;
    reactorGroup.rotation.y += (mouseX - reactorGroup.rotation.y) * 0.05;

    renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
})();
