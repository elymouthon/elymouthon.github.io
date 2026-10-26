import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Lenis from 'lenis';

import './styles/global.css';
import DesktopEntry from './components/ui/DesktopEntry';

const projects = [
  {
    number: '01',
    name: 'cooperative_sel',
    extension: '.sql',
    title: 'Coopérative de sel marin',
    description: 'Structurer les données d’une coopérative pour rendre les décisions opérationnelles plus lisibles.',
    stack: 'SQL / Architecture',
    icon: 'folder',
  },
  {
    number: '02',
    name: 'mesurer_pauvrete',
    extension: '.shiny',
    title: 'Mesurer la pauvreté en France',
    description: 'Une interface interactive pour explorer les indicateurs territoriaux de l’INSEE.',
    stack: 'R Shiny / INSEE',
    icon: 'file',
  },
  {
    number: '03',
    name: 'implantation',
    extension: '.qgis',
    title: 'Implantation stratégique',
    description: 'Croiser le terrain et les données spatiales pour identifier les meilleurs emplacements.',
    stack: 'QGIS / Spatial analysis',
    icon: 'folder',
  },
];

function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const loaderRef = useRef(null);

  useEffect(() => {
    let frame;
    const startedAt = performance.now();
    const tick = (now) => {
      const nextProgress = Math.min(100, Math.round(((now - startedAt) / 1200) * 100));
      setProgress(nextProgress);
      if (nextProgress < 100) frame = requestAnimationFrame(tick);
      else gsap.to(loaderRef.current, { clipPath: 'inset(0 0 100% 0)', duration: .9, delay: .2, ease: 'power4.inOut', onComplete });
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onComplete]);

  return (
    <div ref={loaderRef} className="preloader" aria-label="Chargement de l'expérience">
      <div className="preloader__top"><span>[00]</span><span>EM / DATA OS</span></div>
      <div className="preloader__message"><p>Booting Ely OS...</p><strong>{String(progress).padStart(3, '0')}%</strong></div>
      <div className="preloader__line"><span style={{ transform: `scaleX(${progress / 100})` }} /></div>
    </div>
  );
}

function WindowBar({ title, meta }) {
  return (
    <div className="os-window__bar">
      <div className="os-window__lights" aria-hidden="true"><i /><i /><i /></div>
      <strong>{title}</strong>
      <span>{meta}</span>
    </div>
  );
}

function AvatarPlaceholder() {
  return (
    <div className="avatar-placeholder" aria-label="Emplacement photo de profil">
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <circle cx="40" cy="29" r="13" />
        <path d="M16 68c2-13 11-21 24-21s22 8 24 21" />
      </svg>
      <span>PHOTO / À VENIR</span>
    </div>
  );
}

function ProjectIcon({ type }) {
  if (type === 'file') {
    return <svg className="project-icon project-icon--file" viewBox="0 0 80 96" aria-hidden="true"><path d="M12 4h38l18 18v70H12V4Z" /><path d="M50 4v20h18M23 45h34M23 57h34M23 69h21" /></svg>;
  }
  return <svg className="project-icon" viewBox="0 0 96 76" aria-hidden="true"><path className="project-icon__back" d="M7 16.5A7.5 7.5 0 0 1 14.5 9H39l9 9h33.5a7.5 7.5 0 0 1 7.5 7.5v4H7v-13Z" /><path className="project-icon__front" d="M5 27.5h86l-5.7 38.2A7.5 7.5 0 0 1 77.9 72H18.1a7.5 7.5 0 0 1-7.4-6.3L5 27.5Z" /></svg>;
}

function ProjectItem({ project }) {
  return (
    <article className="project-item os-reveal">
      <div className="project-item__head"><span>[{project.number}]</span><span>EXECUTABLE</span></div>
      <div className="project-item__body">
        <ProjectIcon type={project.icon} />
        <div className="project-item__name">{project.name}<em>{project.extension}</em></div>
      </div>
      <div className="project-quick-look">
        <span className="quick-look__label">QUICK LOOK / {project.number}</span>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <strong>{project.stack}</strong>
      </div>
    </article>
  );
}

function Portfolio() {
  const shellRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, syncTouch: false });
    let frame;
    const raf = (time) => { lenis.raf(time); frame = requestAnimationFrame(raf); };
    frame = requestAnimationFrame(raf);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: .12 });
    shellRef.current?.querySelectorAll('.os-reveal').forEach((element) => observer.observe(element));
    return () => { cancelAnimationFrame(frame); lenis.destroy(); observer.disconnect(); };
  }, []);

  return (
    <div ref={shellRef} className="site-shell site-shell--entered os-shell">
      <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
      <header className="os-menubar">
        <a className="os-brand" href="#home"><span>EM</span><strong>Ely OS</strong></a>
        <nav aria-label="Navigation principale">
          <a href="#about">Mycélium</a><a href="#work">Projets</a><a href="#contact">Contact</a>
        </nav>
        <div className="os-system-status"><i /> SYSTEM ONLINE <span>10:26</span></div>
      </header>

      <main className="os-main">
        <section id="home" className="os-home os-reveal">
          <div className="os-home__copy">
            <p className="os-kicker"><span className="status-dot" /> DATA PORTFOLIO / 2026</p>
            <h1>Data,<br /><em>with meaning.</em></h1>
            <p className="os-lead">Je transforme des données brutes en outils lisibles, utiles et capables d’aider les équipes à prendre de meilleures décisions.</p>
            <a className="os-button" href="#work">Explorer les projets <span>↗</span></a>
          </div>
          <div className="os-home__widget">
            <div className="signal-widget">
              <span className="widget-label">LIVE SIGNAL / 01</span>
              <div className="signal-widget__graph"><i /><i /><i /><i /><i /><i /><i /><i /></div>
              <strong>Clarity index <em>87.4%</em></strong>
              <small>the signal is already there</small>
            </div>
            <div className="system-widget"><span>PROCESSING</span><strong>RAW → USEFUL</strong><i /></div>
          </div>
        </section>

        <section id="about" className="os-window os-window--about os-reveal">
          <WindowBar title="Le_Mycélium" meta="ABOUT / 02" />
          <div className="about-window__body">
            <AvatarPlaceholder />
            <div className="about-window__copy"><p className="os-kicker">[ ABOUT / L’ÉCOSYSTÈME ]</p><h2>Entre la donnée<br /><em>et la décision.</em></h2><p>Je m’intéresse à ce qui se passe entre la donnée brute et la décision. Mon travail mélange programmation, statistiques et curiosité de terrain.</p></div>
            <div className="about-window__stats"><div><strong>03</strong><span>années à observer</span></div><div><strong>04</strong><span>outils maîtrisés</span></div><div><strong>∞</strong><span>questions à explorer</span></div></div>
          </div>
          <div className="skill-dock">{['Python', 'SQL', 'Machine Learning', 'Data Viz'].map((skill, index) => <span key={skill}><i>0{index + 1}</i>{skill}</span>)}</div>
        </section>

        <section id="work" className="os-window os-window--projects os-reveal">
          <WindowBar title="Projects" meta="WORK / 03" />
          <div className="projects-window__intro"><div><p className="os-kicker">[ SELECTED FILES ]</p><h2>Des systèmes<br /><em>qui font sens.</em></h2></div><p>Chaque projet commence par une question précise. Ouvrez un fichier pour afficher son aperçu.</p></div>
          <div className="project-grid">{projects.map((project) => <ProjectItem key={project.number} project={project} />)}</div>
        </section>

        <section id="contact" className="os-window os-window--contact os-reveal">
          <WindowBar title="Contact.app" meta="CONTACT / 04" />
          <div className="contact-window__body"><div><p className="os-kicker">[ OPEN CHANNEL ]</p><h2>Construisons<br /><em>quelque chose.</em></h2></div><a className="os-button os-button--large" href="mailto:hello@elymouthon.fr">hello@elymouthon.fr <span>↗</span></a></div>
        </section>
      </main>
      <footer className="os-footer"><span>© 2026 ELY MOUTHON / DATA OS</span><span>BUILT WITH CURIOSITY / FRANCE</span><a href="#home">BACK TO TOP ↑</a></footer>
    </div>
  );
}

function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  return <>{!hasEntered && <DesktopEntry onEnter={() => setHasEntered(true)} />}{hasEntered && isLoading && <Preloader onComplete={() => setIsLoading(false)} />}{hasEntered && !isLoading && <Portfolio />}</>;
}

export default App;
