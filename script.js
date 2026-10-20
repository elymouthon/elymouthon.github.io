import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const menuButton = document.querySelector('.menu-button');
const siteNav = document.querySelector('.site-nav');
const contactForm = document.querySelector('#contact-form');
const canvas = document.querySelector('#mist-canvas');
const webglCanvas = document.querySelector('#webgl-canvas');
const context = canvas?.getContext('2d', { alpha: true });
const pointer = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
const motes = [];
let webglScene;
let webglCamera;
let webglRenderer;
let webglParticles;
let webglAnimationFrame;
let width = 0;
let height = 0;
let pixelRatio = 1;

menuButton?.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

siteNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = contactForm.querySelector('.form-status');
  status.textContent = '> signal reçu. Merci pour votre message.';
  contactForm.reset();
});

function resizeCanvas() {
  if (!canvas || !context) return;

  pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function createMotes() {
  const amount = Math.min(100, Math.max(42, Math.round(width / 14)));
  motes.length = 0;

  for (let index = 0; index < amount; index += 1) {
    motes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.4 + 0.4,
      speed: Math.random() * 0.22 + 0.04,
      drift: Math.random() * Math.PI * 2,
      alpha: Math.random() * 0.3 + 0.08,
    });
  }
}

function drawMist(time) {
  if (!context) return;

  pointer.x += (pointer.targetX - pointer.x) * 0.035;
  pointer.y += (pointer.targetY - pointer.y) * 0.035;
  context.clearRect(0, 0, width, height);
  context.globalCompositeOperation = 'screen';

  motes.forEach((mote) => {
    mote.y -= mote.speed;
    mote.x += Math.sin(time * 0.00035 + mote.drift) * 0.18;

    if (mote.y < -20) {
      mote.y = height + 20;
      mote.x = Math.random() * width;
    }

    function initWebGL() {
      if (!webglCanvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      try {
        webglScene = new THREE.Scene();
        webglScene.fog = new THREE.FogExp2(0x04120d, 0.055);
        webglCamera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 100);
        webglCamera.position.z = 8;
        webglRenderer = new THREE.WebGLRenderer({ canvas: webglCanvas, alpha: true, antialias: true });
        webglRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
        webglRenderer.setSize(window.innerWidth, window.innerHeight);

        const positions = new Float32Array(720 * 3);
        const colors = new Float32Array(720 * 3);
        const color = new THREE.Color();

        for (let index = 0; index < 720; index += 1) {
          const distance = Math.random() * 12 - 4;
          positions[index * 3] = (Math.random() - 0.5) * 15;
          positions[index * 3 + 1] = (Math.random() - 0.5) * 9;
          positions[index * 3 + 2] = distance;
          color.setHSL(0.39 + Math.random() * 0.05, 0.55, 0.18 + Math.random() * 0.2);
          colors[index * 3] = color.r;
          colors[index * 3 + 1] = color.g;
          colors[index * 3 + 2] = color.b;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        const material = new THREE.PointsMaterial({
          size: 0.075,
          transparent: true,
          opacity: 0.72,
          vertexColors: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        webglParticles = new THREE.Points(geometry, material);
        webglScene.add(webglParticles);

        const animateWebGL = (time) => {
          if (!webglRenderer || !webglScene || !webglCamera || !webglParticles) return;
          webglParticles.rotation.y = pointer.x * 0.22 + time * 0.000025;
          webglParticles.rotation.x = pointer.y * 0.1;
          webglParticles.position.x += (pointer.x - 0.5) * 0.002;
          webglParticles.position.y += (0.5 - pointer.y) * 0.0015;
          webglRenderer.render(webglScene, webglCamera);
          webglAnimationFrame = requestAnimationFrame(animateWebGL);
        };

        webglAnimationFrame = requestAnimationFrame(animateWebGL);
      } catch (error) {
        webglCanvas.hidden = true;
        console.warn('WebGL mist layer unavailable; using the Canvas fallback.', error);
      }
    }

    function resizeWebGL() {
      if (!webglRenderer || !webglCamera) return;
      webglCamera.aspect = window.innerWidth / window.innerHeight;
      webglCamera.updateProjectionMatrix();
      webglRenderer.setSize(window.innerWidth, window.innerHeight);
    }

    const offsetX = (pointer.x - 0.5) * (mote.y / height) * -46;
    const offsetY = (pointer.y - 0.5) * 24;
    const glow = context.createRadialGradient(
      mote.x + offsetX,
      mote.y + offsetY,
      0,
      mote.x + offsetX,
      mote.y + offsetY,
      mote.radius * 8,
    );

    glow.addColorStop(0, `rgba(50, 150, 103, ${mote.alpha})`);
    glow.addColorStop(1, 'rgba(5, 32, 21, 0)');
    context.fillStyle = glow;
    context.beginPath();
    context.arc(mote.x + offsetX, mote.y + offsetY, mote.radius * 8, 0, Math.PI * 2);
    context.fill();
  });

  requestAnimationFrame(drawMist);
}

function splitText(element) {
  const original = element.innerHTML;
  const fragment = document.createDocumentFragment();
  const wrapper = document.createElement('span');
  wrapper.className = 'split-line';
  wrapper.innerHTML = original.replace(
    /([^<]+)|(<em>.*?<\/em>)/g,
    (match) => {
      if (match.startsWith('<em>')) {
        return `<em>${[...match.replace(/<\/?em>/g, '')]
          .map((letter) => `<span class="split-letter">${letter === ' ' ? '&nbsp;' : letter}</span>`)
          .join('')}</em>`;
      }

      return [...match]
        .map((letter) => `<span class="split-letter">${letter === ' ' ? '&nbsp;' : letter}</span>`)
        .join('');
    },
  );
  fragment.appendChild(wrapper);
  element.replaceChildren(fragment);
}

function initScrollTransitions() {
  document.querySelectorAll('[data-split]').forEach(splitText);

  gsap.utils.toArray('.section-shell').forEach((section, index) => {
    const letters = section.querySelectorAll('.split-letter');
    const supportingText = section.querySelectorAll('.eyebrow, .hero-summary, .section-introduction > p:last-child, .project-card, .skills-panel, .timeline, .contact-form, .button-link, .email-link');

    gsap.fromTo(
      letters,
      { yPercent: 115, opacity: 0, rotateX: -55 },
      {
        yPercent: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.15,
        stagger: 0.025,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 76%',
          toggleActions: 'play none none reverse',
        },
      },
    );

    gsap.fromTo(
      supportingText,
      { y: 30, opacity: 0, filter: 'blur(12px)' },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1,
        stagger: 0.08,
        ease: 'power3.out',
        delay: index === 0 ? 0.25 : 0.1,
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      },
    );

    gsap.to(section, {
      '--section-blur': '11px',
      '--section-skew': index % 2 ? '-1.5deg' : '1.5deg',
      '--section-scale': 0.88,
      opacity: 0.18,
      yPercent: -10,
      rotateX: index % 2 ? 3 : -3,
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end: 'bottom 45%',
      onEnter: () => section.classList.add('is-active'),
      onEnterBack: () => section.classList.add('is-active'),
      onLeave: () => section.classList.remove('is-active'),
      onLeaveBack: () => section.classList.remove('is-active'),
    });
  });

  gsap.to('.mountain-backdrop', {
    scale: 1.12,
    yPercent: 7,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
    },
  });
}

window.addEventListener('pointermove', (event) => {
  pointer.targetX = event.clientX / window.innerWidth;
  pointer.targetY = event.clientY / window.innerHeight;
}, { passive: true });

window.addEventListener('resize', () => {
  resizeCanvas();
  resizeWebGL();
  createMotes();
  ScrollTrigger.refresh();
}, { passive: true });

resizeCanvas();
createMotes();
requestAnimationFrame(drawMist);
initWebGL();
initScrollTransitions();
