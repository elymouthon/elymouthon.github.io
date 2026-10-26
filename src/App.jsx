import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import './styles/global.css';
import DesktopEntry from './components/ui/DesktopEntry';

gsap.registerPlugin(ScrollTrigger);

const navigation = [
  ['home', 'Home'],
  ['about', 'About'],
  ['work', 'Work'],
  ['contact', 'Contact'],
];

const projects = [
  {
    number: '01',
    title: 'Coopérative de sel marin',
    type: 'SQL / Architecture',
    image:
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=85',
    alt: 'Paysage côtier abstrait',
    className: 'project-card--wide',
  },
  {
    number: '02',
    title: 'Mesurer la pauvreté en France',
    type: 'R Shiny / INSEE',
    image:
      'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=85',
    alt: 'Architecture géométrique baignée de lumière',
    className: 'project-card--tall',
  },
  {
    number: '03',
    title: 'Implantation stratégique',
    type: 'QGIS / Spatial analysis',
    image:
      'https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=1600&q=85',
    alt: 'Forêt vue depuis le sol',
    className: 'project-card--landscape',
  },
];

function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const loaderRef = useRef(null);

  useEffect(() => {
    let frame;
    const startedAt = performance.now();
    const tick = (now) => {
      const elapsed = now - startedAt;
      const nextProgress = Math.min(100, Math.round((elapsed / 1450) * 100));
      setProgress(nextProgress);
      if (nextProgress < 100) frame = requestAnimationFrame(tick);
      else {
        gsap.to(loaderRef.current, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 1.15,
          ease: 'power4.inOut',
          delay: 0.25,
          onComplete,
        });
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div ref={loaderRef} className="preloader" aria-label="Chargement de l'expérience">
      <div className="preloader__top">
        <span>[00]</span>
        <span>EM / Portfolio 2026</span>
      </div>
      <div className="preloader__message">
        <p>Experience is loading...</p>
        <strong>{String(progress).padStart(3, '0')}%</strong>
      </div>
      <div className="preloader__line"><span style={{ transform: `scaleX(${progress / 100})` }} /></div>
    </div>
  );
}

function App() {
  const mainRef = useRef(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, syncTouch: false });
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    const frame = requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  useLayoutEffect(() => {
    if (isLoading) return undefined;
    const context = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.hero__eyebrow, .hero__title-line, .hero__intro, .hero__meta', {
          y: 80,
          opacity: 0,
          duration: 1.2,
          stagger: 0.08,
          ease: 'power4.out',
          delay: 0.1,
        });
        gsap.utils.toArray('.reveal').forEach((element) => {
          gsap.from(element, {
            y: 55,
            opacity: 0,
            filter: 'blur(12px)',
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 82%', once: true },
          });
        });
        gsap.utils.toArray('.project-image img').forEach((image) => {
          gsap.fromTo(image, { scale: 1.2 }, {
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: image, start: 'top bottom', end: 'bottom top', scrub: true },
          });
        });
        gsap.to('.hero__orb', {
          yPercent: 24,
          rotate: 18,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to('.hero__side-note', {
          yPercent: -80,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
        });
      });
      return () => mm.revert();
    }, mainRef);
    return () => context.revert();
  }, [isLoading]);

  return (
    <>
      {!hasEntered && <DesktopEntry onEnter={() => setHasEntered(true)} />}
      {hasEntered && isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      {hasEntered && (
        <div ref={mainRef} className="site-shell site-shell--entered">
        <header className="site-header">
          <a className="brand" href="#home" data-cursor>
            <span className="brand__mark">EM</span>
            <span>Ely Mouthon</span>
          </a>
          <nav className="site-nav" aria-label="Navigation principale">
            {navigation.map(([id, label], index) => (
              <a key={id} href={`#${id}`} data-cursor>
                <span>[{String(index + 1).padStart(2, '0')}]</span> {label}
              </a>
            ))}
          </nav>
          <span className="header-status"><i /> Available for meaningful data</span>
        </header>

        <main>
          <section id="home" className="hero">
            <div className="hero__topline">
              <span>[00] Portfolio — Data &amp; sens</span>
              <span>France / 2026</span>
            </div>
            <div className="hero__layout">
              <div className="hero__content">
                <p className="hero__eyebrow">Étudiant en BUT 3 Sciences des Données <span>↳</span></p>
                <h1 className="hero__title">
                  <span className="hero__title-line">Nature is</span>
                  <span className="hero__title-line hero__title-line--indent">the ultimate</span>
                  <span className="hero__title-line">algorithm.</span>
                </h1>
                <p className="hero__intro">Je transforme des données brutes en outils lisibles, utiles et capables d&apos;aider les équipes à prendre de meilleures décisions.</p>
                <div className="hero__meta">
                  <span>Scroll to explore</span>
                  <span className="hero__arrow">↓</span>
                </div>
              </div>
              <div className="hero__visual" aria-hidden="true">
                <div className="hero__orb" />
                <div className="hero__grid" />
                <p className="hero__side-note">[ observation / 01 ]<br />the signal is already there</p>
              </div>
            </div>
          </section>

          <section id="about" className="about section">
            <div className="section-label reveal"><span>[02]</span><span>About / Le concept</span><span>↘</span></div>
            <div className="about__statement reveal">[ chaos <em>→</em> clarity ]</div>
            <div className="about__grid">
              <p className="about__copy reveal">Je m&apos;intéresse à ce qui se passe entre la donnée brute et la décision. Mon travail mélange programmation, statistiques et curiosité de terrain.</p>
              <div className="skills reveal">
                <div className="skills__head"><span>Core practice</span><span>04 items</span></div>
                {['Python', 'SQL', 'Machine Learning', 'Data Viz'].map((skill, index) => (
                  <div className="skill" key={skill} data-cursor>
                    <span>0{index + 1}</span><strong>{skill}</strong><i>↗</i>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="work" className="work section">
            <div className="section-label reveal"><span>[03]</span><span>Selected work / Projets</span><span>↘</span></div>
            <div className="work__intro reveal">
              <h2>Des systèmes<br /><em>qui font sens.</em></h2>
              <p>Chaque projet commence par une question précise. La réponse prend ensuite la forme d&apos;un modèle, d&apos;une carte ou d&apos;un outil que l&apos;on a envie d&apos;utiliser.</p>
            </div>
            <div className="project-grid">
              {projects.map((project) => (
                <article className={`project-card reveal ${project.className}`} key={project.number} data-cursor>
                  <div className="project-image"><img src={project.image} alt={project.alt} loading="lazy" /></div>
                  <div className="project-card__info">
                    <span>[{project.number}]</span><span>{project.type}</span>
                    <h3>{project.title}</h3><i>↗</i>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="contact" className="contact section">
            <div className="section-label reveal"><span>[04]</span><span>Contact / Let&apos;s talk</span><span>↘</span></div>
            <div className="contact__body">
              <h2 className="reveal">Let&apos;s build <em>↪</em><br />something meaningful.</h2>
              <a className="contact__mail reveal" href="mailto:hello@elymouthon.fr" data-cursor>hello@elymouthon.fr <span>↗</span></a>
            </div>
            <footer><span>© 2026 Ely Mouthon</span><span>Built with curiosity / France</span><a href="#home" data-cursor>Back to top ↑</a></footer>
          </section>
        </main>
        </div>
      )}
    </>
  );
}

export default App;
