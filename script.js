import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const canvas = document.querySelector('#data-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(54, innerWidth / innerHeight, .1, 100);
camera.position.set(0, 2.3, 7.5);
camera.lookAt(0, 0, -3);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);

const terrain = new THREE.Group();
const points = [];
const columns = 90;
const rows = 58;
const width = 14;
const depth = 18;
const position = new Float32Array(columns * rows * 3);
const origin = new Float32Array(position.length);
const heightAt = (x, z) => {
  const ridge = Math.max(0, 1 - Math.abs(x) / 5.5);
  const peak = Math.exp(-((x * x) / 5 + ((z + 5) * (z + 5)) / 16));
  const secondary = Math.exp(-(((x - 3.5) * (x - 3.5)) / 3 + ((z + 1) * (z + 1)) / 10));
  return ridge * (peak * 3.8 + secondary * 2.2) + Math.sin(x * 2.2 + z * .55) * .14;
};
for (let z = 0; z < rows; z++) {
  for (let x = 0; x < columns; x++) {
    const i = (z * columns + x) * 3;
    const px = (x / (columns - 1) - .5) * width;
    const pz = (z / (rows - 1) - .5) * depth;
    position[i] = px;
    position[i + 1] = heightAt(px, pz) - 1.9;
    position[i + 2] = pz - 2;
    origin.set(position.slice(i, i + 3), i);
    points.push({ x: px, z: pz, base: position[i + 1] });
  }
}
const terrainGeometry = new THREE.BufferGeometry();
terrainGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
const terrainMaterial = new THREE.PointsMaterial({
  color: 0x8cff78, size: .035, transparent: true, opacity: .62,
  blending: THREE.AdditiveBlending, depthWrite: false
});
terrain.add(new THREE.Points(terrainGeometry, terrainMaterial));

const lines = [];
for (let z = 0; z < rows; z += 3) {
  const line = [];
  for (let x = 0; x < columns; x += 2) line.push(new THREE.Vector3(position[(z * columns + x) * 3], position[(z * columns + x) * 3 + 1], position[(z * columns + x) * 3 + 2]));
  const curve = new THREE.Line(new THREE.BufferGeometry().setFromPoints(line), new THREE.LineBasicMaterial({ color: 0x245f43, transparent: true, opacity: .24 }));
  lines.push(curve);
  terrain.add(curve);
}
scene.add(terrain);

const fog = new THREE.FogExp2(0x030806, .045);
scene.fog = fog;
const pointer = new THREE.Vector2(99, 99);
const target = new THREE.Vector2();
let scrollDepth = 0;
addEventListener('pointermove', event => {
  pointer.x = event.clientX / innerWidth * 2 - 1;
  pointer.y = -(event.clientY / innerHeight * 2 - 1);
  const orb = document.querySelector('.cursor-orb');
  if (orb) { orb.style.left = `${event.clientX}px`; orb.style.top = `${event.clientY}px`; }
}, { passive: true });
addEventListener('scroll', () => { scrollDepth = scrollY / Math.max(1, document.body.scrollHeight - innerHeight); }, { passive: true });

function animate() {
  target.lerp(pointer, .045);
  const array = terrainGeometry.attributes.position.array;
  const windX = target.x * 2.8;
  const windZ = -target.y * 3;
  points.forEach((point, index) => {
    const i = index * 3;
    const dx = point.x - windX;
    const dz = point.z - windZ;
    const distance = Math.sqrt(dx * dx + dz * dz);
    const ripple = distance < 2.8 ? Math.sin(distance * 4 - performance.now() * .006) * (2.8 - distance) * .045 : 0;
    array[i + 1] = origin[i + 1] + ripple;
  });
  terrainGeometry.attributes.position.needsUpdate = true;
  terrain.rotation.y += .00035;
  terrain.rotation.x = -.12 + target.y * .035;
  terrain.position.z = scrollDepth * 2.6;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

const topbar = document.querySelector('.topbar');
addEventListener('scroll', () => topbar.classList.toggle('scrolled', scrollY > 30), { passive: true });
const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
toggle?.addEventListener('click', () => {
  const open = links.classList.toggle('active');
  toggle.setAttribute('aria-expanded', String(open));
});
links?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => links.classList.remove('active')));

const glyphs = '01/<>[]{}#@$%&';
document.querySelectorAll('.terminal-form input, .terminal-form textarea').forEach(field => {
  field.addEventListener('input', () => {
    const stableValue = field.value;
    const caret = field.selectionStart;
    field.value = Array.from(stableValue, () => glyphs[Math.floor(Math.random() * glyphs.length)]).join('');
    setTimeout(() => {
      field.value = stableValue;
      field.setSelectionRange(caret, caret);
    }, 90);
  });
});

document.querySelector('.terminal-form')?.addEventListener('submit', () => {
  document.body.classList.add('signal-sent');
  setTimeout(() => document.body.classList.remove('signal-sent'), 1300);
});

const value = document.querySelector('#metric-value');
const label = document.querySelector('#metric-label');
document.querySelectorAll('.chart-points button').forEach(point => {
  const update = () => { value.textContent = point.dataset.value; label.textContent = `/ ${point.dataset.label}`; };
  point.addEventListener('mouseenter', update);
  point.addEventListener('focus', update);
});
