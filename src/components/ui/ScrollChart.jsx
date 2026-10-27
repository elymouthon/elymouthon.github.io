import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const marketPoints = [
  286, 274, 281, 257, 264, 246, 254, 265, 238, 247, 225, 232, 214,
  229, 201, 188, 208, 178, 191, 170, 182, 198, 164, 151, 160, 138,
  149, 124, 134, 116, 128, 104, 119, 93, 107, 86, 98, 112, 78, 91,
  69, 82, 61, 76, 52, 65, 45, 56, 38, 48, 34,
].map((y, index) => ({ x: 72 + index * 15.52, y }));

const points = [
  { ...marketPoints[0], label: 'OPEN' },
  { ...marketPoints[12], label: 'VOLATILITY' },
  { ...marketPoints[24], label: 'SIGNAL' },
  { ...marketPoints[36], label: 'BREAKOUT' },
];

const linePath = marketPoints.map(({ x, y }, index) => `${index === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
const finalPoint = marketPoints[marketPoints.length - 1];
const areaPath = `${linePath} L ${finalPoint.x} 310 L ${marketPoints[0].x} 310 Z`;

function ScrollChart() {
  const wrapperRef = useRef(null);
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const fillRef = useRef(null);
  const pointsRef = useRef([]);
  const labelsRef = useRef([]);
  const finalPointRef = useRef(null);
  const finalLabelRef = useRef(null);

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
      if (finalPointRef.current) {
        finalPointRef.current.style.opacity = '1';
        finalPointRef.current.style.transform = 'scale(1)';
      }
      if (finalLabelRef.current) {
        finalLabelRef.current.style.opacity = '1';
        finalLabelRef.current.style.transform = 'translateY(0)';
      }
      return undefined;
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'center center',
          end: '+=3000',
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
        .to(labelsRef.current, { opacity: 1, y: 0, duration: 0.18, stagger: 0.08, ease: 'power2.out' }, '<0.04')
        .to(finalPointRef.current, { opacity: 1, scale: 1, duration: 0.16, ease: 'back.out(2)' }, '>-0.02')
        .to(finalLabelRef.current, { opacity: 1, y: 0, duration: 0.16, ease: 'power2.out' }, '<0.04');
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
              {[70, 150, 230, 310, 390, 470, 550, 630, 710, 790, 848].map((x) => <line key={`vertical-${x}`} x1={x} y1="35" x2={x} y2="310" />)}
              {[70, 110, 150, 190, 230, 270, 310].map((y) => <line key={`horizontal-${y}`} x1="72" y1={y} x2="848" y2={y} />)}
            </g>
            <g className="data-chart__axes" aria-hidden="true">
              <line x1="72" y1="35" x2="72" y2="310" />
              <line x1="72" y1="310" x2="848" y2="310" />
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
            <g
              ref={finalPointRef}
              className="data-chart__final-point"
              transform={`translate(${finalPoint.x} ${finalPoint.y}) scale(0)`}
            >
              <circle r="8" />
              <circle className="data-chart__point-core" r="3" />
            </g>
            <text
              ref={finalLabelRef}
              className="data-chart__final-label"
              x={finalPoint.x - 12}
              y={finalPoint.y - 20}
              textAnchor="end"
            >
              MAX_VALUE / INSIGHT_REACHED
            </text>
            </svg>
            <div className="data-chart__legend"><span><i />signal détecté</span><span>SCROLL / 3000 PX</span></div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ScrollChart;
