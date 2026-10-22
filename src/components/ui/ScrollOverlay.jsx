import { forwardRef } from 'react';

const sections = [
  { id: 'intro', label: '00' },
  { id: 'about', label: '01' },
  { id: 'projects', label: '02' },
  { id: 'review', label: '03' },
  { id: 'contact', label: '04' },
];

const ScrollOverlay = forwardRef(function ScrollOverlay(_, ref) {
  return (
    <div ref={ref} className="scroll-overlay">
      <header className="site-header">
        <a className="brand" href="#intro" aria-label="Retour à l'introduction">
          <span className="brand-mark">EM</span>
          <span className="brand-name">Ely Mouthon</span>
        </a>
        <nav className="section-nav" aria-label="Navigation principale">
          {sections.map(({ id, label }) => <a key={id} href={`#${id}`}>{label}</a>)}
        </nav>
        <a className="header-mail" href="mailto:hello@elymouthon.fr">hello@elymouthon.fr <span>↗</span></a>
      </header>

      <main>
        <section id="intro" className="story-section story-section--intro">
          <div className="story-content glass-panel">
            <p className="eyebrow">Portfolio / Data &amp; modèles</p>
            <h1>Nature is the <em>ultimate</em> algorithm.</h1>
            <p className="story-lead">Je transforme des données complexes en outils lisibles, utiles et capables d'aider les équipes à prendre de meilleures décisions.</p>
            <p className="mono-detail">Étudiant Data - Niort / France - 2026.</p>
          </div>
        </section>

        <section id="about" className="story-section story-section--about">
          <div className="story-content glass-panel">
            <p className="eyebrow">Le mycélium / une approche transversale</p>
            <h2>Relier les signaux pour comprendre.</h2>
            <p className="story-lead">Je m'intéresse à ce qui se passe entre la donnée brute et la décision. Mon travail mélange programmation, statistiques, visualisation et curiosité de terrain.</p>
            <ul className="signal-list">
              <li><span>01.</span><strong>Python</strong><small>Analyse / automatisation</small></li>
              <li><span>02.</span><strong>SQL</strong><small>Modélisation / requêtes</small></li>
              <li><span>03.</span><strong>Machine Learning</strong><small>Régression / prédiction</small></li>
              <li><span>04.</span><strong>Data Visualisation</strong><small>Power BI / R Shiny</small></li>
            </ul>
          </div>
        </section>

        <section id="projects" className="story-section story-section--projects">
          <div className="story-content glass-panel">
            <p className="eyebrow">Les monolithes / travaux sélectionnés</p>
            <h2>Donner une forme claire aux données.</h2>
            <div className="project-list">
              <article className="project-item">
                <span className="project-index">01</span>
                <div><h3>Coopérative de sel marin <small>(2024)</small></h3><p>Conception d'une base SQL pour gérer les entrées, traitements et ventes de gros sel et de fleur de sel.</p><span className="project-tools">Python / SQL - Data architecture</span></div>
              </article>
              <article className="project-item">
                <span className="project-index">02</span>
                <div><h3>Mesurer la pauvreté en France <small>(2025)</small></h3><p>Application interactive de suivi-évaluation à partir de données INSEE et d'une analyse multivariée.</p><span className="project-tools">R / R Shiny / INSEE - Data storytelling</span></div>
              </article>
              <article className="project-item">
                <span className="project-index">03</span>
                <div><h3>Implantation stratégique <small>(2025)</small></h3><p>Étude géographique pour identifier les zones à fort potentiel d'implantation de restaurants.</p><span className="project-tools">QGIS / Géospatial - Spatial analysis</span></div>
              </article>
            </div>
          </div>
        </section>

        <section id="review" className="story-section story-section--review">
          <div className="story-content glass-panel">
            <p className="eyebrow">L'altimétrie / points forts</p>
            <h2>Prendre de la hauteur.</h2>
            <p className="story-lead">Les projets m'ont appris à passer du problème flou à une réponse structurée, puis à la rendre compréhensible.</p>
            <ul className="signal-list strengths-list">
              <li><span>01.</span><strong>Construire</strong><small>Des bases de données solides et documentées</small></li>
              <li><span>02.</span><strong>Analyser</strong><small>Des modèles qui répondent à une vraie question</small></li>
              <li><span>03.</span><strong>Transmettre</strong><small>Des résultats lisibles pour tous les publics</small></li>
            </ul>
          </div>
        </section>

        <section id="contact" className="story-section story-section--contact">
          <div className="story-content glass-panel">
            <p className="eyebrow">Le signal / fréquence ouverte</p>
            <h2>Construisons la suite.</h2>
            <p className="story-lead">Une question, un projet data ou une équipe à rejoindre ? Écrivez-moi.</p>
            <a className="contact-link" href="mailto:hello@elymouthon.fr">hello@elymouthon.fr <span>↗</span></a>
          </div>
        </section>
      </main>
    </div>
  );
});

export default ScrollOverlay;
