import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas } from '@react-three/fiber';
import FoggyMountain from './components/canvas/FoggyMountain';
import Hero from './components/ui/Hero';

gsap.registerPlugin(ScrollTrigger);

const sections = [
  {
    id: 'about',
    index: '01',
    label: 'Le mycélium',
    title: 'Les racines savent déjà.',
    body: 'Python · SQL · Machine Learning · Visualisation',
  },
  {
    id: 'projects',
    index: '02',
    label: 'Les monolithes',
    title: 'Des données qui prennent forme.',
    body: 'Cas pratiques, systèmes et explorations en cours.',
  },
  {
    id: 'review',
    index: '03',
    label: "L'altimétrie",
    title: 'Chaque sommet commence par une mesure.',
    body: 'BUT 3 Sciences des Données · Parcours en ascension.',
  },
  {
    id: 'contact',
    index: '04',
    label: 'Le signal',
    title: 'Ouvrir une fréquence.',
    body: 'Un projet, une question, une nouvelle trace à suivre.',
  },
];

function App() {
  const mainRef = useRef(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.utils.toArray('.section-content').forEach((content) => {
        gsap.fromTo(
          content,
          { autoAlpha: 0, y: 32 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: content,
              start: 'top 78%',
              once: true,
            },
          },
        );
      });
    }, mainRef);

    return () => context.revert();
  }, []);

  return (
    <div className="site-shell">
      <div className="canvas-layer" aria-hidden="true">
        <Canvas camera={{ position: [0, 2.8, 8], fov: 55 }} dpr={[1, 2]}>
          <FoggyMountain />
        </Canvas>
      </div>

      <header className="site-header">
        <a className="brand" href="#ecosystem" aria-label="Retour à l'accueil">
          AF<span>/</span>03
        </a>
        <p className="header-status"><span /> Signal actif · 2026</p>
        <a className="header-link" href="#contact">Entrer en contact ↗</a>
      </header>

      <main ref={mainRef}>
        <section id="ecosystem" className="section hero-section">
          <Hero />
        </section>

        {sections.map((section) => (
          <section id={section.id} className="section placeholder-section" key={section.id}>
            <div className="section-index">{section.index} <span>/</span> {section.label}</div>
            <div className="section-content">
              <p className="eyebrow">Data wilderness / en préparation</p>
              <h2>{section.title}</h2>
              <p className="section-description">{section.body}</p>
              <span className="placeholder-line">— matière à venir —</span>
            </div>
          </section>
        ))}
      </main>

      <div className="scroll-progress" aria-hidden="true" />
    </div>
  );
}

export default App;
