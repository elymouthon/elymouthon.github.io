import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const canvas = document.querySelector('#mist-canvas');
const context = canvas?.getContext('2d');
const pointer = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
const motes = [];
let width = 0;
let height = 0;
let ratio = 1;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resizeMist() {
  if (!canvas || !context) return;
  ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  motes.length = 0;
  const count = Math.min(145, Math.max(65, Math.round(width / 9)));
  for (let index = 0; index < count; index += 1) {
    motes.push({ x: Math.random() * width, y: Math.random() * height, size: Math.random() * 2.8 + 0.5, speed: Math.random() * 0.22 + 0.04, phase: Math.random() * Math.PI * 2, alpha: Math.random() * 0.23 + 0.04 });
  }
}

function renderMist(time) {
  if (!context) return;
  pointer.x += (pointer.targetX - pointer.x) * 0.035;
  pointer.y += (pointer.targetY - pointer.y) * 0.035;
  context.clearRect(0, 0, width, height);
  context.globalCompositeOperation = 'screen';
  motes.forEach((mote) => {
    mote.y -= mote.speed;
    mote.x += Math.sin(time * 0.00035 + mote.phase) * 0.16;
    if (mote.y < -30) { mote.y = height + 30; mote.x = Math.random() * width; }
    const shiftX = (pointer.x - 0.5) * (mote.y / height) * -52;
    const shiftY = (pointer.y - 0.5) * 28;
    const x = mote.x + shiftX;
    const y = mote.y + shiftY;
    const glow = context.createRadialGradient(x, y, 0, x, y, mote.size * 10);
    glow.addColorStop(0, `rgba(67, 177, 117, ${mote.alpha})`);
    glow.addColorStop(1, 'rgba(5, 33, 20, 0)');
    context.fillStyle = glow;
    context.beginPath();
    context.arc(x, y, mote.size * 10, 0, Math.PI * 2);
    context.fill();
  });
  requestAnimationFrame(renderMist);
}

function splitText(element) {
  const text = element.innerHTML;
  element.innerHTML = text.replace(/(<em>.*?<\/em>|[^<]+)/g, (part) => {
    if (part.startsWith('<em>')) {
      return `<em>${[...part.replace(/<\/?em>/g, '')].map((letter) => `<span class="split-letter">${letter === ' ' ? '&nbsp;' : letter}</span>`).join('')}</em>`;
    }
    return [...part].map((letter) => `<span class="split-letter">${letter === ' ' ? '&nbsp;' : letter}</span>`).join('');
  });
}

function initScrollExperience() {
  document.querySelectorAll('[data-split]').forEach(splitText);
  document.querySelectorAll('.scene').forEach((scene, index) => {
    const letters = scene.querySelectorAll('.split-letter');
    gsap.fromTo(letters, { yPercent: 120, opacity: 0, rotateX: -70 }, {
      yPercent: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.025, ease: 'power4.out',
      scrollTrigger: { trigger: scene, start: 'top 72%', toggleActions: 'play none none reverse' },
    });
    gsap.fromTo(scene.querySelectorAll('.reveal-up'), { y: 38, opacity: 0, filter: 'blur(14px)' }, {
      y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.05, stagger: 0.1, ease: 'power3.out',
      delay: index === 0 ? 0.3 : 0.1, scrollTrigger: { trigger: scene, start: 'top 68%', toggleActions: 'play none none reverse' },
    });
    gsap.to(scene, {
      '--scene-blur': '12px', '--scene-scale': 0.9, opacity: 0.18, yPercent: -8, rotateX: index % 2 ? 2 : -2,
      scrollTrigger: { trigger: scene, start: 'top top', end: 'bottom top', scrub: 1 },
    });
  });
  gsap.to('.progress-line span', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.2 } });
  gsap.to('.mountain-backdrop', { scale: 1.12, yPercent: 5, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1.5 } });
}

document.querySelector('.menu-button')?.addEventListener('click', (event) => {
  const button = event.currentTarget;
  const isOpen = document.querySelector('.site-nav')?.classList.toggle('is-open');
  button.setAttribute('aria-expanded', String(isOpen));
});
document.querySelectorAll('.site-nav a').forEach((link) => link.addEventListener('click', () => {
  document.querySelector('.site-nav')?.classList.remove('is-open');
  document.querySelector('.menu-button')?.setAttribute('aria-expanded', 'false');
}));
document.querySelector('#contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  form.querySelector('.form-status').textContent = '> signal reçu. Merci pour votre message.';
  form.reset();
});
window.addEventListener('pointermove', (event) => { pointer.targetX = event.clientX / window.innerWidth; pointer.targetY = event.clientY / window.innerHeight; }, { passive: true });
window.addEventListener('resize', () => { resizeMist(); ScrollTrigger.refresh(); }, { passive: true });

resizeMist();
if (reduceMotion) document.documentElement.classList.add('reduce-motion');
requestAnimationFrame(renderMist);
initScrollExperience();
