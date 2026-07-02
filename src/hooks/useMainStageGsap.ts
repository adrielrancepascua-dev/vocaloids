"use client";
import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

type SectionSelectors = {
  hero: string;
  heroContent: string;
  heroTitle: string;
  tabs: string;
  scene3d: string;
};

export function useMainStageGsap(
  containerRef: RefObject<HTMLDivElement | null>,
  sectionCount: number,
  enabled: boolean,
) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled || reducedMotion) return;

    const ctx = gsap.context(() => {
      for (let i = 0; i < sectionCount; i++) {
        const section = container.querySelector(`#character-${i}`);
        if (!section) continue;

        const hero = section.querySelector('[data-gsap="hero"]') as HTMLElement | null;
        const heroContent = section.querySelector('[data-gsap="hero-content"]') as HTMLElement | null;
        const heroTitle = section.querySelector('[data-gsap="hero-title"]') as HTMLElement | null;
        const tabs = section.querySelector('[data-gsap="tabs"]') as HTMLElement | null;
        const scene3d = section.querySelector('[data-gsap="scene3d"]') as HTMLElement | null;

        if (hero && heroContent) {
          gsap.fromTo(
            heroContent,
            { y: 60, opacity: 0.4 },
            {
              y: 0,
              opacity: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: hero,
                scroller: container,
                start: 'top 80%',
                end: 'top 20%',
                scrub: 0.6,
              },
            },
          );
        }

        if (hero && heroTitle) {
          gsap.to(heroTitle, {
            y: -80,
            scale: 0.92,
            opacity: 0.35,
            ease: 'none',
            scrollTrigger: {
              trigger: hero,
              scroller: container,
              start: 'top top',
              end: 'bottom top',
              scrub: 1.2,
            },
          });
        }

        if (hero && scene3d) {
          gsap.to(scene3d, {
            scale: 1.15,
            opacity: 0.35,
            ease: 'none',
            scrollTrigger: {
              trigger: hero,
              scroller: container,
              start: 'top top',
              end: 'bottom top',
              scrub: 1,
            },
          });
        }

        if (tabs) {
          gsap.fromTo(
            tabs,
            { y: 120, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: tabs,
                scroller: container,
                start: 'top 95%',
                end: 'top 55%',
                scrub: 0.8,
              },
            },
          );
        }
      }
    }, container);

    return () => ctx.revert();
  }, [containerRef, sectionCount, enabled, reducedMotion]);
}

export type { SectionSelectors };
