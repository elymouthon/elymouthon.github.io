import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const points = [
  { x: 92, y: 272, label: 'Data brute' },
  { x: 278, y: 232, label: 'Nettoyage' },
  { x: 464, y: 190, label: 'Modélisation' },
  { x: 650, y: 126, label: 'Insight' },
  { x: 836, y: 78, label: 'Impact' },
];

const linePath = 'M 92 272 C 155 262, 214 245, 278 232 S 402 205, 464 190 S 598 143, 650 126 S 780 90, 836 78';
const areaPath = `${linePath} L 836 310 L 92 310 Z`;

function ScrollChart() {
  const wrapperRef = useRef(null);
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const fillRef = useRef(null);
  const pointsRef = useRef([]);
  const labelsRef = useRef([]);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const section = sectionRef.current;
    const line = lineRef.current;
    const fill = fillRef.current;
    if (!wrapper || !section || !line || !fill) return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lineLength = line.getTotalLength();
    line.style.strokeDasharray = `${lineLength}`;
    line.style.strokeDashoffset = `${lineLength}`;

    if (prefersReducedMotion) {
      line.style.strokeDashoffset = '0';
      fill.style.opacity = '0.2';
      pointsRef.current.forEach((point) => { point.style.opacity = '1'; point.style.transform = 'scale(1)'; });
      labelsRef.current.forEach((label) => { label.style.opacity = '1'; label.style.transform = 'translateY(0)'; });
      return undefined;
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'center center',
          end: '+=1500',
          pin: wrapper,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(line, { strokeDashoffset: 0, duration: 0.72, ease: 'none' })
        .to(fill, { opacity: 0.2, duration: 0.28, ease: 'power1.out' }, '<0.18')
        .to(pointsRef.current, { opacity: 1, scale: 1, duration: 0.2, stagger: 0.08, ease: 'back.out(2)' }, '>-0.04')
        .to(labelsRef.current, { opacity: 1, y: 0, duration: 0.18, stagger: 0.08, ease: 'power2.out' }, '<0.04');
    }, section);

    return () => context.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="chart-pin-wrapper">
      <section ref={sectionRef} id="impact" className="os-window os-window--data" aria-labelledby="data-window-title">
        <div className="os-window__bar">
          <div className="os-window__lights" aria-hidden="true"><i /><i /><i /></div>
          <strong id="data-window-title">[02] Data_Visualisation.exe</strong>
          <span>IMPACT / 02</span>
        </div>
        <div className="data-window__body">
          <div className="data-window__intro">
            <div>
              <p className="os-kicker">[ FROM RAW TO USEFUL ]</p>
              <h2>Donner du relief<br /><em>à la donnée.</em></h2>
            </div>
            <p>Chaque étape clarifie le signal jusqu&apos;à faire émerger une décision lisible.</p>
          </div>
          <div className="data-chart">
            <svg viewBox="0 0 920 360" role="img" aria-labelledby="chart-title chart-description">
            <title id="chart-title">Progression de la donnée vers un insight</title>
            <desc id="chart-description">Une courbe ascendante en cinq étapes : donnée brute, nettoyage, modélisation, insight et impact.</desc>
            <defs>
              <linearGradient id="data-area-gradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#5F8C6D" stopOpacity=".42" />
                <stop offset="1" stopColor="#5F8C6D" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g className="data-chart__grid" aria-hidden="true">
              <line x1="92" y1="110" x2="836" y2="110" />
              <line x1="92" y1="190" x2="836" y2="190" />
              <line x1="92" y1="270" x2="836" y2="270" />
            </g>
            <g className="data-chart__axes" aria-hidden="true">
              <line x1="92" y1="35" x2="92" y2="310" />
              <line x1="92" y1="310" x2="836" y2="310" />
            </g>
            <path ref={fillRef} className="data-chart__fill" d={areaPath} />
            <path ref={lineRef} className="data-chart__line" d={linePath} />
            <g className="data-chart__points">
              {points.map((point, index) => (
                <g
                  key={point.label}
                  ref={(element) => { pointsRef.current[index] = element; }}
                  className="data-chart__point"
                  transform={`translate(${point.x} ${point.y}) scale(0)`}
                >
                  <circle r="6" />
                  <circle className="data-chart__point-core" r="2" />
                </g>
              ))}
            </g>
            <g className="data-chart__labels">
              {points.map((point, index) => (
                <text
                  key={point.label}
                  ref={(element) => { labelsRef.current[index] = element; }}
                  x={point.x}
                  y={point.y - 20}
                  textAnchor="middle"
                >
                  {point.label}
                </text>
              ))}
            </g>
            </svg>
            <div className="data-chart__legend"><span><i />signal détecté</span><span>SCROLL / 1500 PX</span></div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ScrollChart;
