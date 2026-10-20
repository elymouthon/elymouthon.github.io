import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Experience from './components/Experience.jsx';
import Overlay from './components/Overlay.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const rigRef = useRef({ progress: 0, energy: 0 });

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const sections = gsap.utils.toArray('.story-section');

      sections.forEach((section, index) => {
        const content = section.querySelectorAll('[data-reveal]');

        gsap.fromTo(
          content,
          { opacity: 0, y: 42 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 72%',
              toggleActions: 'play none none reverse',
            },
          },
        );

        ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          onEnter: () => {
            gsap.to(rigRef.current, {
              progress: index / (sections.length - 1),
              energy: 1,
              duration: 1.2,
              ease: 'power2.out',
              overwrite: true,
            });
          },
          onEnterBack: () => {
            gsap.to(rigRef.current, {
              progress: index / (sections.length - 1),
              energy: 1,
              duration: 1,
              ease: 'power2.out',
              overwrite: true,
            });
          },
          onLeave: () => {
            gsap.to(rigRef.current, { energy: 0, duration: 0.8 });
          },
          onLeaveBack: () => {
            gsap.to(rigRef.current, { energy: 0, duration: 0.8 });
          },
        });
      });

      gsap.to(rigRef.current, {
        progress: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.story',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
        },
      });
    });

    return () => context.revert();
  }, []);

  return (
    <main className="app-shell">
      <Experience rigRef={rigRef} />
      <Overlay />
    </main>
  );
}
