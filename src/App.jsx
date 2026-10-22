import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas } from '@react-three/fiber';
import FoggyMountain from './components/canvas/FoggyMountain';

gsap.registerPlugin(ScrollTrigger);

const navigation = [
  ['ecosystem', 'Accueil'],
  ['about', 'À propos'],
  ['experience', 'Expérience'],
  ['projects', 'Projets'],
  ['review', 'Bilan'],
  ['contact', 'Contact'],
];

const copy = {
  fr: {
    role: 'Étudiant en BUT 3 Sciences des Données — Niort',
    intro: 'Je transforme la donnée brute en décisions lisibles, utiles et sensibles.',
    projects: 'Explorer mes projets',
    cv: 'Télécharger mon CV',
    about: 'À propos de moi',
    aboutText: "Je m'appelle Ely Mouthon. Curieux, rigoureux et attiré par les systèmes complexes, je conçois des analyses qui relient le code, les statistiques et les usages réels.",
    experience: 'Expérience',
    experienceText: 'Une pratique de la donnée ancrée dans le terrain : comprendre le besoin, structurer l’information et transmettre le signal.',
    projectsTitle: 'Projets sélectionnés',
    review: 'Prendre de la hauteur',
    reviewText: 'Mon parcours en BUT 3 est une ascension faite d’expériences concrètes, de modèles testés et de questions toujours plus précises.',
    contact: 'Ouvrir une fréquence',
    contactText: 'Un projet data, une question ou une envie de construire quelque chose de nouveau ?',
    send: 'Me contacter',
  },
  en: {
    role: 'Data Science student — Niort, France',
    intro: 'I turn raw data into decisions that are clear, useful and human.',
    projects: 'Explore my projects',
    cv: 'Download my CV',
    about: 'About me',
    aboutText: 'I am Ely Mouthon. Curious, rigorous and drawn to complex systems, I build analyses that connect code, statistics and real-world uses.',
    experience: 'Experience',
    experienceText: 'A field-driven approach to data: understand the need, structure the information and transmit the signal.',
    projectsTitle: 'Selected projects',
    review: 'Gain perspective',
    reviewText: 'My third-year journey is an ascent made of concrete experiments, tested models and increasingly precise questions.',
    contact: 'Open a frequency',
    contactText: 'A data project, a question or an idea worth building together?',
    send: 'Get in touch',
  },
};

function App() {
  const [language, setLanguage] = useState('fr');
  const [activeSection, setActiveSection] = useState('ecosystem');
  const mainRef = useRef(null);
  const text = copy[language];

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.from('.hero-reveal', {
        y: 42,
        autoAlpha: 0,
        filter: 'blur(10px)',
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
      });

      gsap.utils.toArray('.reveal').forEach((element) => {
        gsap.fromTo(element, { y: 40, autoAlpha: 0, filter: 'blur(10px)' }, {
          y: 0,
          autoAlpha: 1,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 84%', once: true },
        });
      });

      gsap.fromTo('.skill-row',
        { y: 24, autoAlpha: 0, filter: 'blur(6px)' },
        {
          y: 0,
          autoAlpha: 1,
          filter: 'blur(0px)',
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.skill-card', start: 'top 84%', once: true },
        },
      );

      gsap.utils.toArray('.project-card').forEach((card) => {
        const rotateX = gsap.quickTo(card, 'rotationX', { duration: 0.45, ease: 'power3.out' });
        const rotateY = gsap.quickTo(card, 'rotationY', { duration: 0.45, ease: 'power3.out' });
        const moveX = gsap.quickTo(card, 'x', { duration: 0.45, ease: 'power3.out' });
        const moveY = gsap.quickTo(card, 'y', { duration: 0.45, ease: 'power3.out' });

        const handleMove = (event) => {
          const bounds = card.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width - 0.5;
          const y = (event.clientY - bounds.top) / bounds.height - 0.5;
          rotateX(y * -4);
          rotateY(x * 4);
          moveX(x * 5);
          moveY(y * 5 - 4);
        };
        const handleLeave = () => {
          rotateX(0);
          rotateY(0);
          moveX(0);
          moveY(0);
        };

        card.addEventListener('mousemove', handleMove);
        card.addEventListener('mouseleave', handleLeave);
        context.add(() => {
          card.removeEventListener('mousemove', handleMove);
          card.removeEventListener('mouseleave', handleLeave);
        });
      });

      gsap.utils.toArray('.button').forEach((button) => {
        const moveX = gsap.quickTo(button, 'x', { duration: 0.35, ease: 'power3.out' });
        const moveY = gsap.quickTo(button, 'y', { duration: 0.35, ease: 'power3.out' });
        const handleMove = (event) => {
          const bounds = button.getBoundingClientRect();
          moveX(((event.clientX - bounds.left) / bounds.width - 0.5) * 6);
          moveY(((event.clientY - bounds.top) / bounds.height - 0.5) * 5);
        };
        const handleLeave = () => {
          moveX(0);
          moveY(0);
        };

        button.addEventListener('mousemove', handleMove);
        button.addEventListener('mouseleave', handleLeave);
        context.add(() => {
          button.removeEventListener('mousemove', handleMove);
          button.removeEventListener('mouseleave', handleLeave);
        });
      });

      navigation.forEach(([id]) => {
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => self.isActive && setActiveSection(id),
        });
      });
    }, mainRef);

    return () => context.revert();
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty('--scroll-progress', `${(window.scrollY / scrollable) * 100}%`);
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => {
      window.removeEventListener('scroll', updateProgress);
    };
  }, []);

  return (
    <div className="site-shell">
      <div className="bg-canvas" aria-hidden="true">
        <span className="blob blob--one" />
        <span className="blob blob--two" />
        <span className="blob blob--three" />
        <svg className="contour-lines" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <path d="M-40 160C240 60 480 270 790 170s450-30 700 90" />
          <path d="M-40 350c300-80 520 130 820 40s430-40 700 75" />
          <path d="M-40 570c270-70 550 120 870 30s390-25 650 65" />
          <path d="M240-30c100 260-60 480 130 780" />
          <path d="M1190-30c-50 240 100 470 0 800" />
        </svg>
        <div className="grain" />
      </div>
      <div className="canvas-layer" aria-hidden="true"><Canvas camera={{ position: [0, 2.8, 8], fov: 55 }} dpr={[1, 1.5]}><FoggyMountain /></Canvas></div>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="noise-overlay" aria-hidden="true" />

      <header className="site-header">
        <nav className="dock" aria-label="Navigation principale">
          {navigation.map(([id, label]) => <a key={id} className={`dock-link ${activeSection === id ? 'is-active' : ''}`} href={`#${id}`}>{label}</a>)}
        </nav>
        <div className="header-actions">
          <button className="language-toggle" type="button" onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')} aria-label="Changer de langue">
            <strong className={language === 'fr' ? 'is-selected' : ''}>FR</strong><i>/</i><strong className={language === 'en' ? 'is-selected' : ''}>EN</strong>
          </button>
          <a className="button button--dark" href="#contact">{text.send} <span>↗</span></a>
        </div>
      </header>

      <main ref={mainRef}>
        <section id="ecosystem" className="hero section">
          <div className="hero-copy">
            <p className="eyebrow hero-reveal"><span className="status-dot" />{text.role}</p>
            <p className="hero-kicker hero-reveal">DATA / DESIGN / CURIOSITY</p>
            <h1 className="hero-title hero-reveal">Ely<br /><em>Mouthon</em></h1>
            <p className="hero-lead hero-reveal">{text.intro}</p>
            <div className="hero-actions hero-reveal"><a className="button button--dark button--large" href="#projects">{text.projects} <span>→</span></a><a className="button button--outline button--large" href="#contact">{text.cv}</a></div>
            <p className="hero-note hero-reveal"><span className="hero-note-pulse" />Bouge la souris · le relief réagit <span>↗</span></p>
          </div>
          <div className="hero-orbit" aria-hidden="true"><div className="orbit-ring orbit-ring--outer" /><div className="orbit-ring orbit-ring--inner" /><div className="orbit-grid" /><div className="orbit-core"><span>DATA LAB</span><strong>03</strong><small>explorer</small></div><span className="orbit-label orbit-label--top">signal / 01</span><span className="orbit-label orbit-label--bottom">46°19′N · 0°28′W</span><span className="orbit-label orbit-label--side">scroll to observe</span></div>
        </section>

        <section id="about" className="section content-section">
          <div className="section-heading"><span className="section-index">01</span><h2 className="section-title reveal">{text.about}</h2></div>
          <div className="about-grid"><p className="large-copy reveal">{text.aboutText}</p><div className="skill-card reveal"><p className="card-label">Stack / 04</p>{['Python & SQL', 'Statistiques', 'Machine Learning', 'Datavisualisation'].map((skill, index) => <div className="skill-row" key={skill}><span>0{index + 1}</span><strong>{skill}</strong><i>↗</i></div>)}</div></div>
        </section>

        <section id="experience" className="section content-section">
          <div className="section-heading"><span className="section-index">02</span><h2 className="section-title reveal">{text.experience}</h2></div>
          <div className="experience-card reveal"><div><p className="card-label">2024 — 2027 / Niort</p><h3>Construire dans la donnée</h3></div><p>{text.experienceText}</p><span className="card-arrow">↗</span><div className="experience-scan" aria-hidden="true"><span /><span /><span /><span /></div></div>
        </section>

        <section id="projects" className="section content-section">
          <div className="section-heading"><span className="section-index">03</span><h2 className="section-title reveal">{text.projectsTitle}</h2></div>
          <div className="project-list">{[['01', 'Analyse exploratoire', 'Python · Pandas · Seaborn'], ['02', 'Système de recommandation', 'SQL · Modélisation · ML'], ['03', 'Territoires en données', 'R · Cartographie · Dataviz']].map(([number, title, tools]) => <article className="project-card reveal" key={number}><span className="project-number">{number}</span><div><p>{tools}</p><h3>{title}</h3></div><span className="card-arrow">↗</span></article>)}</div>
        </section>

        <section id="review" className="section content-section review-section">
          <div className="section-heading"><span className="section-index">04</span><h2 className="section-title reveal">{text.review}</h2></div>
          <div className="review-layout"><p className="large-copy reveal">{text.reviewText}</p><div className="quote-card reveal"><span>“</span><p>Un bon modèle ne parle pas plus fort. Il écoute mieux.</p><small>— carnet de terrain, 2026</small></div></div>
        </section>

        <section id="contact" className="section content-section contact-section">
          <div className="section-heading"><span className="section-index">05</span><h2 className="section-title reveal">{text.contact}</h2></div>
          <div className="contact-card reveal"><p>{text.contactText}</p><a className="button button--dark button--large" href="mailto:hello@elymouthon.fr">hello@elymouthon.fr <span>↗</span></a></div>
          <footer><span>© 2026 Ely Mouthon</span><span>Made with intent / France</span></footer>
        </section>
      </main>
    </div>
  );
}

export default App;
