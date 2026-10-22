import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const footage = {
  mountain: {
    src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=85',
  },
  ocean: {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=85',
  },
  forest: {
    src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2400&q=85',
  },
};

const rainDrops = Array.from({ length: 56 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 101}%`,
  delay: `${(index % 14) * -0.17}s`,
  duration: `${0.72 + (index % 7) * 0.08}s`,
  length: `${18 + (index % 5) * 7}px`,
}));

function CinematicBackground({ scrollTarget }) {
  const backgroundRef = useRef(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      // One normalized timeline lets the page's total scroll position drive
      // the three acts, independent of the number of sections in the markup.
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: scrollTarget?.current || document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.4,
          invalidateOnRefresh: true,
        },
      });

      timeline
        // ACT I — the drone retreats from the peaks and disappears into cloud.
        .to('.cinematic-mountain', { scale: 4, opacity: 0, duration: 0.2, ease: 'power3.in' })
        .to('.cinematic-fog', { opacity: 1, duration: 0.12, ease: 'power2.in' }, 0.18)
        // ACT II — fog lifts onto a zenithal, stormy ocean.
        .to('.cinematic-ocean', { opacity: 1, scale: 1, duration: 0.13, ease: 'power2.out' }, 0.34)
        .to('.cinematic-rain', { opacity: 1, duration: 0.1, ease: 'power2.out' }, 0.4)
        .to('.cinematic-fog', { opacity: 0, duration: 0.14, ease: 'power2.out' }, 0.42)
        .to('.cinematic-ocean', { scale: 4, opacity: 0, duration: 0.22, ease: 'power3.in' }, 0.45)
        // ACT III — another whiteout, then a dark conifer canopy.
        .to('.cinematic-fog', { opacity: 1, duration: 0.1, ease: 'power2.in' }, 0.68)
        .to('.cinematic-rain', { opacity: 0, duration: 0.1 }, 0.75)
        .to('.cinematic-forest', { opacity: 1, scale: 1, duration: 0.14, ease: 'power2.out' }, 0.79)
        .to('.cinematic-fog', { opacity: 0, duration: 0.14, ease: 'power2.out' }, 0.89)
        .to('.cinematic-forest', { scale: 1.08, duration: 0.11, ease: 'none' }, 0.9);
    }, backgroundRef);

    return () => context.revert();
  }, []);

  return (
    <div ref={backgroundRef} className="cinematic-background" aria-hidden="true">
      <img className="cinematic-video cinematic-mountain" src={footage.mountain.src} alt="" />
      <img className="cinematic-video cinematic-ocean" src={footage.ocean.src} alt="" />
      <img className="cinematic-video cinematic-forest" src={footage.forest.src} alt="" />

      <div className="cinematic-rain">
        {rainDrops.map(({ id, left, delay, duration, length }) => (
          <i key={id} style={{ left, '--rain-delay': delay, '--rain-duration': duration, '--rain-length': length }} />
        ))}
      </div>
      <div className="cinematic-fog" />
      <div className="cinematic-vignette" />
      <div className="cinematic-grain" />
    </div>
  );
}

export default CinematicBackground;
