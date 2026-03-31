import { memo, useState, useEffect } from 'react';
import type { MouseEvent } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import type { Vocaloid } from '../config/vocaloidData';

interface CharacterHeroProps {
  characterData: Vocaloid;
  alignment: 'left' | 'right';
  onClick?: () => void;
}

function CharacterHeroBase({ characterData, alignment, onClick }: CharacterHeroProps) {
  const [triggerGlitch, setTriggerGlitch] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  
  // Glitch animation triggers every 20 seconds
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setTriggerGlitch(true);
      setTimeout(() => setTriggerGlitch(false), 150);
    }, 20000);
    
    return () => clearInterval(glitchInterval);
  }, []);
  
  // Spotlight logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };
  
  const maskImage = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, black 20%, transparent 80%)`
  );

  const handleClick = () => {
    setIsPulsing(true);
    setTimeout(() => {
      setIsPulsing(false);
      onClick?.();
    }, 400); // 400ms pulse
  };

  const nameParts = characterData.name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

  return (
    <div
      className={`flex items-center justify-center w-full mx-auto h-full gap-8 md:gap-16 flex-col md:flex-row ${
        alignment === 'right' ? 'md:flex-row-reverse' : ''
      }`}
    >
      {/* Interactive Image Container */}
      <div
        className="relative flex-1 cursor-pointer group flex justify-center items-center h-[50%] md:h-full w-full"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        <motion.div
          animate={{
            y: [-15, 15],
            scale: isPulsing ? [1, 1.2, 1] : 1
          }}
          transition={{
            y: {
              duration: 3,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut'
            },
            scale: {
              duration: 0.4
            }
          }}
          whileHover={{ scale: 1.05 }}
          className="relative w-[75vw] h-[45vh] md:w-[480px] md:h-[700px] max-w-[380px] md:max-w-none rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl bg-zinc-800/30"
          style={{
            boxShadow: `0 0 80px ${characterData.colors.primary}30`
          }}
        >
          {/* Spotlight overlay effect */}
          <motion.div
            className="absolute inset-0 z-20 pointer-events-none opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hidden md:block"
            style={{
              background: `${characterData.colors.primary}60`,
              WebkitMaskImage: maskImage,
              maskImage: maskImage
            }}
          />

          <img
            src={characterData.baseImage}
            alt={`${characterData.name}`}
            className={`w-full h-full object-center relative z-10 transition-transform duration-700 group-hover:scale-105 pointer-events-none object-contain ${
              characterData.name.includes("Teto") ? "scale-90" : "scale-[0.85]"
            }`}
            draggable="false"
          />
        </motion.div>
      </div>

      {/* Typography */}
      <div className="flex-1 flex flex-col justify-center translate-y-0 md:translate-y-[-5%] px-4 sm:px-8 md:px-12 text-center md:text-left mt-2 md:mt-0 w-full items-center md:items-start">
        <div className="relative inline-block text-left">
          <motion.h2
            className="text-[64px] sm:text-[90px] md:text-[160px] font-black uppercase tracking-tighter leading-[0.85] font-inter-tight relative z-10"
            style={{ color: characterData.colors.primary }}
            initial={{ opacity: 0, x: alignment === 'left' ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {firstName}
            <br />
            <span 
              className="text-transparent" 
              style={{ WebkitTextStroke: `3px ${characterData.colors.primary}` }}
            >
              {lastName}
            </span>
          </motion.h2>
          
          {/* RGB Split Glitch Layers */}
          {triggerGlitch && (
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
                <span style={{ WebkitTextStroke: `3px #FF0000` }}>
                  {lastName}
                </span>
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
                <span style={{ WebkitTextStroke: `3px #0000FF` }}>
                  {lastName}
                </span>
              </motion.div>
            </>
          )}
        </div>

        {/* Tagline / Subtitle */}
        <motion.p
          className="mt-4 md:mt-8 text-lg sm:text-2xl md:text-3xl font-medium tracking-[0.3em] uppercase text-white/70"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {characterData.tagline}
        </motion.p>
      </div>
    </div>
  );
}

export const CharacterHero = memo(CharacterHeroBase, (prev, next) => {
  return prev.characterData.name === next.characterData.name && prev.alignment === next.alignment;
});