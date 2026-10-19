import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const canvas = document.querySelector('#data-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, .1, 100);
camera.position.z = 8;
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);

const count = 4200;
const positions = new Float32Array(count * 3);
const base = new Float32Array(count * 3);
for (let i = 0; i < count; i++) {
  const i3 = i * 3;
  const radius = 2.2 + Math.random() * 4.2;
  const angle = Math.random() * Math.PI * 2;
  const spread = (Math.random() - .5) * 3;
  base[i3] = Math.cos(angle) * radius + spread;
  base[i3 + 1] = Math.sin(angle) * radius * .55 + (Math.random() - .5) * 2;
  base[i3 + 2] = (Math.random() - .5) * 5;
  positions[i3] = base[i3]; positions[i3 + 1] = base[i3 + 1]; positions[i3 + 2] = base[i3 + 2];
}
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const material = new THREE.PointsMaterial({ color: 0xd7ff4f, size: .026, transparent: true, opacity: .8, blending: THREE.AdditiveBlending });
const particles = new THREE.Points(geometry, material);
scene.add(particles);

const pointer = new THREE.Vector2(99, 99);
const target = new THREE.Vector2();
addEventListener('pointermove', event => {
  pointer.x = (event.clientX / innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / innerHeight) * 2 + 1;
  const orb = document.querySelector('.cursor-orb');
  if (orb) { orb.style.left = `${event.clientX}px`; orb.style.top = `${event.clientY}px`; }
}, { passive: true });
function animate() {
  target.lerp(pointer, .06);
  const array = geometry.attributes.position.array;
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const dx = base[i3] - target.x * 4;
    const dy = base[i3 + 1] + target.y * 3;
    const distance = Math.max(.5, Math.sqrt(dx * dx + dy * dy));
    const force = distance < 2.2 ? (2.2 - distance) * .055 : 0;
    array[i3] += (base[i3] + (dx / distance) * force - array[i3]) * .04;
    array[i3 + 1] += (base[i3 + 1] + (dy / distance) * force - array[i3 + 1]) * .04;
    array[i3 + 2] += (base[i3 + 2] - array[i3 + 2]) * .025;
  }
  geometry.attributes.position.needsUpdate = true;
  particles.rotation.y += .0007;
  particles.rotation.x = target.y * .03;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });

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

const value = document.querySelector('#metric-value');
const label = document.querySelector('#metric-label');
document.querySelectorAll('.chart-points button').forEach(point => {
  const update = () => { value.textContent = point.dataset.value; label.textContent = `/ ${point.dataset.label}`; };
  point.addEventListener('mouseenter', update);
  point.addEventListener('focus', update);
});
