import projectsData from '../../data/projects.json';

const projects = projectsData.projects.slice(0, 3);

function Nav() {
  return (
    <nav className="topbar" aria-label="Navigation principale">
      <a className="wordmark" href="#home" aria-label="Retour à l'accueil">
        <span>EM</span>
        <strong>ELY<span>.</span></strong>
      </a>
      <div className="nav-links">
        <a href="#about">À propos</a>
        <a href="#projects">Projets</a>
        <a href="#contact">Signal</a>
      </div>
      <p className="system-status"><i /> système en ligne / 2026</p>
    </nav>
  );
}

function Hero() {
  return (
    <section id="home" className="story-section hero-section" aria-labelledby="hero-title">
      <div className="section-index">00 / origine</div>
      <div className="hero-copy">
        <p className="eyebrow" data-reveal>profil / data &amp; modèles</p>
        <h1 id="hero-title" data-reveal>
          Nature is the
          <em>ultimate</em>
          algorithm.
        </h1>
        <p className="hero-intro" data-reveal>
          Je cartographie les reliefs cachés des données pour construire des
          modèles plus lisibles, plus utiles et plus humains.
        </p>
        <a className="outline-link" href="#about" data-reveal>
          Entrer dans l'écosystème <span>↓</span>
        </a>
      </div>
      <aside className="hero-coordinate" data-reveal>
        <span>LAT 46.32 / LONG -1.15</span>
        <strong>2,864 <small>m</small></strong>
        <span>altimétrie du signal</span>
      </aside>
      <p className="scroll-cue"><i /> faire défiler pour traverser</p>
    </section>
  );
}

function About() {
  const skills = ['Python', 'SQL', 'Machine Learning', 'Data Viz'];

  return (
    <section id="about" className="story-section about-section" aria-labelledby="about-title">
      <div className="section-index">01 / mycélium</div>
      <div className="section-heading">
        <p className="eyebrow" data-reveal>À propos / réseau vivant</p>
        <h2 id="about-title" data-reveal>Les idées poussent<br /><em>en réseau.</em></h2>
        <p data-reveal>
          Chaque signal devient une ramification. Je relie l'analyse statistique,
          le code et la narration visuelle pour révéler ce qui se cache sous la surface.
        </p>
      </div>
      <div className="skill-network" aria-label="Compétences principales">
        <span className="network-core">DATA<br />FIELD</span>
        {skills.map((skill, index) => (
          <span className={`skill-node skill-node--${index + 1}`} key={skill} data-reveal>
            <i />{skill}
          </span>
        ))}
        <span className="network-line network-line--one" />
        <span className="network-line network-line--two" />
        <span className="network-line network-line--three" />
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="story-section projects-section" aria-labelledby="projects-title">
      <div className="section-index">02 / monolithes</div>
      <div className="projects-header">
        <div>
          <p className="eyebrow" data-reveal>Projets / terrains d'expérimentation</p>
          <h2 id="projects-title" data-reveal>Des données qui<br /><em>prennent forme.</em></h2>
        </div>
        <p className="project-count" data-reveal><strong>03</strong> / archives sélectionnées</p>
      </div>
      <div className="project-grid">
        {projects.map((project, index) => (
          <article className="project-card" key={project.id} data-reveal>
            <div className="project-card__top">
              <span>0{index + 1} / 202{project.year}</span>
              <span>↗</span>
            </div>
            <h3>{project.title}</h3>
            <p>{project.details}</p>
            <footer>
              <span>{project.technologies.join(' / ')}</span>
              <strong>{['SQL', 'STAT', 'SPATIAL'][index]}</strong>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

function Altimetry() {
  return (
    <section id="altimetry" className="story-section altimetry-section" aria-labelledby="altimetry-title">
      <div className="section-index">03 / altitude</div>
      <div className="altimetry-copy">
        <p className="eyebrow" data-reveal>bilan / points de passage</p>
        <h2 id="altimetry-title" data-reveal>Prendre de la<br /><em>hauteur.</em></h2>
        <p data-reveal>
          Une année à transformer des terrains bruts en décisions claires.
          Le sommet n'est jamais un point fixe : c'est une nouvelle perspective.
        </p>
      </div>
      <ol className="milestones">
        <li data-reveal><span>01</span><strong>Construire</strong><small>Des bases robustes, de la donnée jusqu'au modèle.</small></li>
        <li data-reveal><span>02</span><strong>Comprendre</strong><small>Rendre les résultats lisibles pour chaque équipe.</small></li>
        <li data-reveal><span>03</span><strong>Transmettre</strong><small>Partager le raisonnement, pas seulement la réponse.</small></li>
      </ol>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="story-section contact-section" aria-labelledby="contact-title">
      <div className="section-index">04 / signal</div>
      <div className="contact-intro">
        <p className="eyebrow" data-reveal>Contact / fréquence ouverte</p>
        <h2 id="contact-title" data-reveal>On construit<br /><em>la suite ?</em></h2>
        <p data-reveal>Une question, un terrain à explorer ou une équipe à rejoindre.</p>
      </div>
      <form className="terminal-form" data-reveal onSubmit={(event) => event.preventDefault()}>
        <p><span>&gt;</span> transmission.init()</p>
        <label htmlFor="name">identité</label>
        <input id="name" name="name" type="text" placeholder="votre nom" required />
        <label htmlFor="email">coordonnée</label>
        <input id="email" name="email" type="email" placeholder="votre@email.com" required />
        <label htmlFor="message">message</label>
        <textarea id="message" name="message" rows="3" placeholder="décrire le signal..." required />
        <button type="submit">Envoyer le signal <span>↗</span></button>
      </form>
      <footer className="contact-footer">
        <a href="mailto:hello@elymouthon.fr">hello@elymouthon.fr</a>
        <span>© 2026 ELY MOUTHON / DATA PORTFOLIO</span>
      </footer>
    </section>
  );
}

export default function Overlay() {
  return (
    <div className="interface">
      <Nav />
      <div className="story">
        <Hero />
        <About />
        <Projects />
        <Altimetry />
        <Contact />
      </div>
    </div>
  );
}
