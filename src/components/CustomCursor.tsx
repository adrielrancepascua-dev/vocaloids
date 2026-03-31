"use client";
import { memo, useEffect, useMemo, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { vocaloidData } from '../config/vocaloidData';
import { useVibe } from '../contexts/VibeProvider';
import type { CharacterTheme } from '../constants/theme';

type CharacterColorMap = Record<CharacterTheme, string>;

const SPRING_CONFIG = {
  stiffness: 800,
  damping: 28,
  mass: 0.1,
};

const CURSOR_HIDE_POSITION = -120;

function resolveThemeByName(name: string): CharacterTheme {
  const normalized = name.toLowerCase();
  if (normalized.includes('miku')) {
    return 'miku';
  }

  if (normalized.includes('teto')) {
    return 'teto';
  }

  return 'neru';
}

function CustomCursorBase() {
  const { activeCharacter } = useVibe();
  const [isVisible, setIsVisible] = useState(false);
  const [isRecordHover, setIsRecordHover] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  const mouseX = useMotionValue(CURSOR_HIDE_POSITION);
  const mouseY = useMotionValue(CURSOR_HIDE_POSITION);
  const springX = useSpring(mouseX, SPRING_CONFIG);
  const springY = useSpring(mouseY, SPRING_CONFIG);

  const colorsByCharacter = useMemo<CharacterColorMap>(() => {
    const initial: CharacterColorMap = {
      miku: '#39C5BB',
      teto: '#C33149',
      neru: '#FFD700',
    };

    for (const character of vocaloidData) {
      initial[resolveThemeByName(character.name)] = character.colors.primary;
    }

    return initial;
  }, []);

  const activeColor = colorsByCharacter[activeCharacter];

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    const updatePointerMode = () => {
      setIsFinePointer(mediaQuery.matches);
    };

    updatePointerMode();
    mediaQuery.addEventListener('change', updatePointerMode);

    return () => {
      mediaQuery.removeEventListener('change', updatePointerMode);
    };
  }, []);

  useEffect(() => {
    if (!isFinePointer) {
      return;
    }

    const previousHtmlCursor = document.documentElement.style.cursor;
    const previousBodyCursor = document.body.style.cursor;

    document.documentElement.style.cursor = 'none';
    document.body.style.cursor = 'none';
    document.body.classList.add('hide-cursor');

    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
      setIsVisible(true);

      const targetElement = event.target as Element | null;
      const hoveringRecord = Boolean(targetElement?.closest('[data-cursor="record"]'));
      setIsRecordHover((previous) => {
        if (previous === hoveringRecord) {
          return previous;
        }

        return hoveringRecord;
      });
    };

    const handleMouseOutWindow = (event: MouseEvent) => {
      if (event.relatedTarget !== null) {
        return;
      }

      setIsVisible(false);
    };

    const handleWindowBlur = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseout', handleMouseOutWindow);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOutWindow);
      window.removeEventListener('blur', handleWindowBlur);
      document.documentElement.style.cursor = previousHtmlCursor;
      document.body.style.cursor = previousBodyCursor;
      document.body.classList.remove('hide-cursor');
    };
  }, [isFinePointer, mouseX, mouseY]);

  if (!isFinePointer) {
    return null;
  }

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        zIndex: 99999,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="relative flex items-center justify-center rounded-full"
        animate={{
          scale: isRecordHover ? 1.4 : 1,
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 24 }}
        style={{
          width: isRecordHover ? 48 : 28,
          height: isRecordHover ? 48 : 28,
          border: isRecordHover ? `2px solid transparent` : `2px solid ${activeColor}`,
          background: isRecordHover ? 'transparent' : 'rgba(8, 8, 8, 0.35)',
          boxShadow: isRecordHover ? 'none' : `0 0 20px ${activeColor}88`,
        }}
      >
        {isRecordHover ? (
          <motion.svg
            viewBox="0 0 48 48"
            className="absolute inset-0 w-full h-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            {/* Outer Record Grooves */}
            <circle cx="24" cy="24" r="23" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1" />
            <circle cx="24" cy="24" r="18" fill="none" stroke="#222" strokeWidth="0.5" />
            <circle cx="24" cy="24" r="14" fill="none" stroke="#222" strokeWidth="0.5" />
            
            {/* Inner Label colored by Character Theme */}
            <circle cx="24" cy="24" r="9" fill={activeColor} />
            
            {/* Record Hole */}
            <circle cx="24" cy="24" r="2" fill="#000" />
            
            {/* Shine effect */}
            <path d="M 4 24 A 20 20 0 0 1 10 10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 44 24 A 20 20 0 0 1 38 38" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeLinecap="round" />
          </motion.svg>
        ) : (
          <div
            className="absolute left-1/2 top-1/2 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ backgroundColor: activeColor }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

export const CustomCursor = memo(CustomCursorBase);

