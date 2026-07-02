"use client";
import { memo, useState, useEffect } from 'react';
import type { MouseEvent } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import type { Vocaloid } from '../config/vocaloidData';
import { getEffectsForTheme } from '../config/characterEffects';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface CharacterHeroProps {
  characterData: Vocaloid;
  alignment: 'left' | 'right';
  onClick?: () => void;
}

function CharacterHeroBase({ characterData, alignment, onClick }: CharacterHeroProps) {
  const fx = getEffectsForTheme(characterData.theme);
  const reducedMotion = useReducedMotion();
  const [triggerGlitch, setTriggerGlitch] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [tetoJitter, setTetoJitter] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const glitchInterval = setInterval(() => {
      setTriggerGlitch(true);
      setTimeout(() => setTriggerGlitch(false), fx.glitchDurationMs);
    }, fx.glitchIntervalMs);
    return () => clearInterval(glitchInterval);
  }, [fx.glitchDurationMs, fx.glitchIntervalMs, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || fx.heroTreatment !== 'industrial-glitch') return;
    const jitterInterval = setInterval(() => {
      setTetoJitter((Math.random() - 0.5) * 6);
    }, 80);
    return () => clearInterval(jitterInterval);
  }, [fx.heroTreatment, reducedMotion]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const maskImage = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, black 20%, transparent 80%)`,
  );

  const handleClick = () => {
    setIsPulsing(true);
    setTimeout(() => {
      setIsPulsing(false);
      onClick?.();
    }, 400);
  };

  const nameParts = characterData.name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
  const primary = characterData.colors.primary;

  const imageFilter =
    fx.heroTreatment === 'neon-cutout'
      ? `drop-shadow(0 0 24px ${primary}) drop-shadow(0 0 48px ${primary}88)`
      : fx.heroTreatment === 'low-battery'
        ? 'contrast(1.1) saturate(0.85)'
        : undefined;

  return (
    <div
      data-gsap="hero-content"
      className={`relative z-10 flex items-center justify-center w-full mx-auto h-full gap-8 md:gap-16 flex-col md:flex-row ${
        alignment === 'right' ? 'md:flex-row-reverse' : ''
      }`}
    >
      {/* CRT scanlines + designation watermark */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.07]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.15) 2px, rgba(255,255,255,0.15) 4px)`,
        }}
        aria-hidden
      />
      <span
        className="pointer-events-none absolute top-[8%] left-[4%] text-[18vw] md:text-[14vw] font-black font-inter-tight opacity-[0.04] select-none"
        style={{ color: primary }}
        aria-hidden
      >
        {fx.designationWatermark}
      </span>

      <div
        className="relative flex-1 cursor-pointer group flex justify-center items-center h-[50%] md:h-full w-full"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        style={fx.heroTreatment === 'industrial-glitch' ? { transform: `translateX(${tetoJitter}px)` } : undefined}
      >
        <motion.div
          animate={
            reducedMotion
              ? { scale: isPulsing ? [1, 1.2, 1] : 1 }
              : { y: [-15, 15], scale: isPulsing ? [1, 1.2, 1] : 1 }
          }
          transition={{
            y: { duration: 3, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
            scale: { duration: 0.4 },
          }}
          whileHover={reducedMotion ? {} : { scale: 1.05 }}
          className="relative w-[75vw] h-[45vh] md:w-[480px] md:h-[700px] max-w-[380px] md:max-w-none rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl bg-zinc-800/30"
          style={{ boxShadow: `0 0 80px ${primary}30` }}
        >
          {fx.heroTreatment === 'industrial-glitch' && (
            <div
              className="absolute inset-0 z-30 pointer-events-none opacity-40 mix-blend-overlay"
              style={{
                backgroundImage: `repeating-linear-gradient(-45deg, #000 0px, #000 8px, ${primary} 8px, ${primary} 16px, #FFD700 16px, #FFD700 24px)`,
              }}
              aria-hidden
            />
          )}

          {fx.heroTreatment === 'low-battery' && (
            <>
              <div className="absolute top-3 right-3 z-30 px-2 py-1 bg-black/80 border border-yellow-500/50 rounded text-[10px] font-mono text-yellow-400 tracking-widest animate-pulse">
                LOW BATTERY 4%
              </div>
              <svg className="absolute inset-0 z-25 w-full h-full pointer-events-none opacity-30" aria-hidden>
                <filter id={`neru-static-${characterData.theme}`}>
                  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
                  <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect width="100%" height="100%" filter={`url(#neru-static-${characterData.theme})`} opacity="0.35" />
              </svg>
            </>
          )}

          {fx.heroTreatment === 'neon-cutout' && (
            <motion.div
              className="absolute inset-0 z-20 pointer-events-none opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hidden md:block"
              style={{
                background: `${primary}60`,
                WebkitMaskImage: maskImage,
                maskImage: maskImage,
              }}
            />
          )}

          <img
            src={characterData.baseImage}
            alt={characterData.name}
            className="w-full h-full object-center relative z-10 transition-transform duration-700 group-hover:scale-105 pointer-events-none object-contain"
            style={{
              transform: `scale(${fx.heroImageScale})`,
              filter: imageFilter,
            }}
            draggable={false}
          />
        </motion.div>
      </div>

      <div
        data-gsap="hero-title"
        className="flex-1 flex flex-col justify-center translate-y-0 md:translate-y-[-5%] px-4 sm:px-8 md:px-12 text-center md:text-left mt-2 md:mt-0 w-full items-center md:items-start"
      >
        <div className="relative inline-block text-left">
          <motion.h2
            className="text-[64px] sm:text-[90px] md:text-[160px] font-black uppercase tracking-tighter leading-[0.85] font-inter-tight relative z-10"
            style={{ color: primary }}
            initial={reducedMotion ? false : { opacity: 0, x: alignment === 'left' ? 50 : -50 }}
            whileInView={reducedMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {firstName}
            <br />
            <span className="text-transparent" style={{ WebkitTextStroke: `3px ${primary}` }}>
              {lastName}
            </span>
          </motion.h2>

          {triggerGlitch && !reducedMotion && (
            <>
              <motion.div
                className="absolute top-0 left-0 text-[64px] sm:text-[90px] md:text-[160px] font-black uppercase tracking-tighter leading-[0.85] font-inter-tight"
                style={{ color: '#FF0000', opacity: 0.8, zIndex: 11 }}
                initial={{ x: -4, y: -4 }}
                animate={{ x: 0, y: 0 }}
                transition={{ duration: 0.05 }}
              >
                {firstName}
                <br />
                <span style={{ WebkitTextStroke: '3px #FF0000' }}>{lastName}</span>
              </motion.div>
              <motion.div
                className="absolute top-0 left-0 text-[64px] sm:text-[90px] md:text-[160px] font-black uppercase tracking-tighter leading-[0.85] font-inter-tight"
                style={{ color: '#0000FF', opacity: 0.8, zIndex: 12 }}
                initial={{ x: 4, y: 4 }}
                animate={{ x: 0, y: 0 }}
                transition={{ duration: 0.05 }}
              >
                {firstName}
                <br />
                <span style={{ WebkitTextStroke: '3px #0000FF' }}>{lastName}</span>
              </motion.div>
            </>
          )}
        </div>

        <motion.p
          className="mt-4 md:mt-8 text-lg sm:text-2xl md:text-3xl font-medium tracking-[0.3em] uppercase text-white/70"
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          {characterData.tagline}
        </motion.p>
        <p className="mt-3 text-xs uppercase tracking-[0.25em] text-white/40 font-mono hidden md:block">
          {characterData.designation} · {characterData.system}
        </p>
      </div>
    </div>
  );
}

export const CharacterHero = memo(CharacterHeroBase, (prev, next) => {
  return prev.characterData.name === next.characterData.name && prev.alignment === next.alignment;
});
