import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const landscapes = {
  mountain: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=85',
  ocean: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=85',
  forest: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2400&q=85',
};

function CinematicBackground() {
  const backgroundRef = useRef(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to('.cinematic-mountain', { scale: 1.16, duration: 0.2, ease: 'power2.inOut' })
        .to('.cinematic-fog', { opacity: 1, duration: 0.1, ease: 'power2.in' }, 0.2)
        .to('.cinematic-mountain', { opacity: 0, duration: 0.12 }, 0.28)
        .to('.cinematic-ocean', { opacity: 1, scale: 1, duration: 0.14, ease: 'power2.out' }, 0.34)
        .to('.cinematic-fog', { opacity: 0, duration: 0.14, ease: 'power2.out' }, 0.42)
        .to('.cinematic-ocean', { scale: 1.08, duration: 0.22, ease: 'none' }, 0.45)
        .to('.cinematic-fog', { opacity: 1, duration: 0.1, ease: 'power2.in' }, 0.7)
        .to('.cinematic-ocean', { opacity: 0, duration: 0.12 }, 0.76)
        .to('.cinematic-forest', { opacity: 1, scale: 1, duration: 0.14, ease: 'power2.out' }, 0.8)
        .to('.cinematic-fog', { opacity: 0, duration: 0.14, ease: 'power2.out' }, 0.9)
        .to('.cinematic-forest', { scale: 1.08, duration: 0.1, ease: 'none' }, 0.9);
    }, backgroundRef);

    return () => context.revert();
  }, []);

  return (
    <div ref={backgroundRef} className="cinematic-background" aria-hidden="true">
      <div className="cinematic-media cinematic-mountain" style={{ backgroundImage: `url(${landscapes.mountain})` }} />
      <div className="cinematic-media cinematic-ocean" style={{ backgroundImage: `url(${landscapes.ocean})` }} />
      <div className="cinematic-media cinematic-forest" style={{ backgroundImage: `url(${landscapes.forest})` }} />
      <div className="cinematic-fog" />
      <div className="cinematic-vignette" />
      <div className="cinematic-grain" />
    </div>
  );
}

export default CinematicBackground;
