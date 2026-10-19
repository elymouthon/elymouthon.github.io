import Scene3D from './Scene3D.jsx';

export default function HeroSection() {
  return (
    <main className="hero">
      <Scene3D />

      <header className="hero__nav">
        <a className="hero__brand" href="#home" aria-label="Retour à l'accueil">
          <span>EM</span>
          <strong>ELY<span>.</span></strong>
        </a>
        <span className="hero__status">
          <i aria-hidden="true" />
          ECOSYSTEM ONLINE / 2026.10
        </span>
      </header>

      <div className="hero__coordinates" aria-hidden="true">
        <span>ECO_00 / ORIGIN</span>
        <span>LAT 46.32 / LONG -1.15 / ALT 286</span>
      </div>

      <section id="home" className="hero__content">
        <p className="eyebrow">Étudiant en Data <span>//</span> Explorateur de modèles</p>
        <h1>
          Nature is the
          <em>ultimate</em>
          algorithm.
        </h1>
        <p className="hero__lead">
          Je cherche la géologie cachée des données : les reliefs, les failles et
          les systèmes vivants qui donnent une forme au chaos.
        </p>
        <a className="hero__cta" href="#future">
          Traverser la brume
          <span aria-hidden="true">↓</span>
        </a>
      </section>

      <div className="hero__signal" aria-hidden="true">
        <span>TOPOGRAPHIC FIELD</span>
        <strong>2,864 M</strong>
        <small>elevation mapped</small>
      </div>

      <div className="hero__scroll-hint">
        <span className="hero__pulse" aria-hidden="true" />
        SCROLL TO DESCEND
        <b aria-hidden="true">↓</b>
      </div>

      <div id="future" className="hero__future-anchor" aria-hidden="true" />
    </main>
  );
}
