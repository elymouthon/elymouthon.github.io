function Hero() {
  return (
    <div className="hero-content">
      <div className="hero-meta">
        <span>Lat. 46°19&apos;N</span>
        <span>Long. 00°28&apos;W</span>
      </div>
      <div className="hero-heading">
        <p className="eyebrow">01 — L&apos;écosystème</p>
        <h1>
          Nature is the
          <em>ultimate</em>
          algorithm.
        </h1>
        <p className="hero-subtitle">&gt; Étudiant en BUT 3 Sciences des Données_.</p>
      </div>
      <a className="scroll-cue" href="#about">
        <span className="scroll-cue-mark">↓</span>
        <span>Descendre dans la forêt</span>
      </a>
    </div>
  );
}

export default Hero;
