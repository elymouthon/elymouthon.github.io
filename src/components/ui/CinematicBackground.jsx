import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// These are deliberately external placeholders: replace them with your licensed
// footage without changing the timeline or the component contract.
const footage = {
  mountain: {
    src: 'https://cdn.coverr.co/videos/coverr-aerial-view-of-snowy-mountains-1572/1080p.mp4',
    poster: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2400&q=85',
  },
  ocean: {
    src: 'https://cdn.coverr.co/videos/coverr-waves-in-the-ocean-1573/1080p.mp4',
    poster: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=2400&q=85',
  },
  forest: {
    src: 'https://cdn.coverr.co/videos/coverr-aerial-view-of-a-forest-1574/1080p.mp4',
    poster: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=2400&q=85',
  },
};

const rainDrops = Array.from({ length: 56 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 101}%`,
  delay: `${(index % 14) * -0.17}s`,
  duration: `${0.72 + (index % 7) * 0.08}s`,
  length: `${18 + (index % 5) * 7}px`,
}));

function CinematicBackground() {
  const backgroundRef = useRef(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      // One normalized timeline lets the page's total scroll position drive
      // the three acts, independent of the number of sections in the markup.
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.4,
          invalidateOnRefresh: true,
        },
      });

      timeline
        // ACT I — the drone retreats from the peaks and disappears into cloud.
        .to('.cinematic-mountain', { scale: 1, duration: 0.2, ease: 'power2.inOut' })
        .to('.cinematic-fog', { opacity: 1, duration: 0.12, ease: 'power2.in' }, 0.18)
        .to('.cinematic-mountain', { opacity: 0, duration: 0.1 }, 0.28)
        // ACT II — fog lifts onto a zenithal, stormy ocean.
        .to('.cinematic-ocean', { opacity: 1, scale: 1, duration: 0.13, ease: 'power2.out' }, 0.34)
        .to('.cinematic-rain', { opacity: 1, duration: 0.1, ease: 'power2.out' }, 0.4)
        .to('.cinematic-fog', { opacity: 0, duration: 0.14, ease: 'power2.out' }, 0.42)
        .to('.cinematic-ocean', { scale: 1.08, duration: 0.22, ease: 'none' }, 0.45)
        // ACT III — another whiteout, then a dark conifer canopy.
        .to('.cinematic-fog', { opacity: 1, duration: 0.1, ease: 'power2.in' }, 0.68)
        .to('.cinematic-rain, .cinematic-ocean', { opacity: 0, duration: 0.1 }, 0.75)
        .to('.cinematic-forest', { opacity: 1, scale: 1, duration: 0.14, ease: 'power2.out' }, 0.79)
        .to('.cinematic-fog', { opacity: 0, duration: 0.14, ease: 'power2.out' }, 0.89)
        .to('.cinematic-forest', { scale: 1.08, duration: 0.11, ease: 'none' }, 0.9);
    }, backgroundRef);

    return () => context.revert();
  }, []);

  return (
    <div ref={backgroundRef} className="cinematic-background" aria-hidden="true">
      <video className="cinematic-video cinematic-mountain" autoPlay loop muted playsInline poster={footage.mountain.poster}>
        <source src={footage.mountain.src} type="video/mp4" />
      </video>
      <video className="cinematic-video cinematic-ocean" autoPlay loop muted playsInline poster={footage.ocean.poster}>
        <source src={footage.ocean.src} type="video/mp4" />
      </video>
      <video className="cinematic-video cinematic-forest" autoPlay loop muted playsInline poster={footage.forest.poster}>
        <source src={footage.forest.src} type="video/mp4" />
      </video>

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
