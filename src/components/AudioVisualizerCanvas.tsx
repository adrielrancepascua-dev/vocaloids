"use client";
import { useEffect, useRef, memo } from 'react';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

export interface AudioVisualizerCanvasProps {
  analyserNode: AnalyserNode | null;
  activeCharacterName: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  radius: number;
  color: string;
}

const AudioVisualizerCanvasBase = ({
  analyserNode,
  activeCharacterName,
}: AudioVisualizerCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  // Character flags
  const isMiku = activeCharacterName.toLowerCase().includes('miku');
  const isTeto = activeCharacterName.toLowerCase().includes('teto');
  const isNeru = activeCharacterName.toLowerCase().includes('neru');
  const { isLowEnd } = usePerformanceMonitor();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-DPI scaling
    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);
      
      // Re-initialize particles for Teto on resize
      if (isTeto) {
        initParticles(rect.width, rect.height);
      }
    };

    const initParticles = (width: number, height: number) => {
      const p: Particle[] = [];
      const centerX = width / 2;
      const centerY = height / 2;
      
      const tetoParticleCount = isLowEnd ? 40 : 150;
      for (let i = 0; i < tetoParticleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 50 + 20;
        p.push({
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          baseX: centerX + Math.cos(angle) * radius,
          baseY: centerY + Math.sin(angle) * radius,
          vx: 0,
          vy: 0,
          radius: Math.random() * 3 + 1,
          color: `rgba(220, 38, 38, ${Math.random() * 0.5 + 0.3})` // Red shades for Teto
        });
      }
      particlesRef.current = p;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Audio data arrays
    const bufferLength = analyserNode ? analyserNode.frequencyBinCount : 0;
    const dataArray = analyserNode ? new Uint8Array(bufferLength) : new Uint8Array(0);

    const renderLoop = () => {
      if (!ctx || !canvas) return;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      if (analyserNode && bufferLength > 0) {
        analyserNode.getByteFrequencyData(dataArray);
      } else {
        // Fallback fake data if no audio node is connected
        for (let i = 0; i < dataArray.length; i++) {
          dataArray[i] = dataArray[i] > 5 ? dataArray[i] * 0.9 : 0;
        }
      }

      // ----------------------------------------------------------------
      // MIKU: Sleek, fluid Bezier curves (Oscilloscope style)
      // ----------------------------------------------------------------
      if (isMiku) {
        ctx.beginPath();
        // Removed sliceWidth as it's no longer used
        let x = 0;

        // Focus on mid-tones (e.g., bins between 20% and 60% of frequency array)
        const midStart = Math.floor(bufferLength * 0.2);
        const midEnd = Math.floor(bufferLength * 0.6);
        const midLength = midEnd - midStart;
        const midSliceWidth = width / midLength;

        // Draw multiple overlapping curves with different opacities
        for (let layer = 0; layer < 3; layer++) {
          ctx.beginPath();
          x = 0;
          
          for (let i = midStart; i < midEnd; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * height) / 2 + (layer * 20);

            if (i === midStart) {
              ctx.moveTo(x, y);
            } else {
              // Smooth bezier curve approximations
              const xc = (x + x + midSliceWidth) / 2;
              const yc = (y + y) / 2;
              ctx.quadraticCurveTo(x, y, xc, yc);
            }
            x += midSliceWidth;
          }
          
          ctx.strokeStyle = `rgba(57, 197, 187, ${0.8 - (layer * 0.2)})`; // Miku Teal
          ctx.lineWidth = 3 - layer;
          ctx.stroke();
        }
      }

      // ----------------------------------------------------------------
      // TETO: Aggressive, center-out particle burst for bass hits
      // ----------------------------------------------------------------
      else if (isTeto) {
        // Calculate bass average (first 10 bins roughly)
        let bassSum = 0;
        for (let i = 0; i < 10; i++) {
          bassSum += dataArray[i] || 0;
        }
        const bassAvg = bassSum / 10;
        const isKick = bassAvg > 210; // Threshold for a bass hit

        const centerX = width / 2;
        const centerY = height / 2;

        particlesRef.current.forEach((p) => {
          // If kick drum hits, add violent velocity outward
          if (isKick) {
            const angle = Math.atan2(p.y - centerY, p.x - centerX);
            const force = (bassAvg / 255) * 15; // Explosive force
            p.vx += Math.cos(angle) * force * Math.random();
            p.vy += Math.sin(angle) * force * Math.random();
          }

          // Apply velocity
          p.x += p.vx;
          p.y += p.vy;

          // Friction to slow them down
          p.vx *= 0.85;
          p.vy *= 0.85;

          // Spring force to pull them back to their base positions
          const dxBase = p.baseX - p.x;
          const dyBase = p.baseY - p.y;
          p.vx += dxBase * 0.05;
          p.vy += dyBase * 0.05;

          // Draw particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * (1 + bassAvg / 255), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        });
        
        // Central glow core
        const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, bassAvg);
        coreGradient.addColorStop(0, 'rgba(220, 38, 38, 0.8)');
        coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, bassAvg, 0, Math.PI * 2);
        ctx.fill();
      }

      // ----------------------------------------------------------------
      // NERU: Retro 90s Blocky Spectrum + Terminal Glitch on Treble
      // ----------------------------------------------------------------
      else if (isNeru) {
        // Calculate treble average (high frequencies)
        let trebleSum = 0;
        const trebleStart = Math.floor(bufferLength * 0.7);
        for (let i = trebleStart; i < bufferLength; i++) {
          trebleSum += dataArray[i] || 0;
        }
        const trebleAvg = trebleSum / (bufferLength - trebleStart);
        const isClipping = trebleAvg > 100;

        ctx.save();

        // Apply Glitch rule: random X offset
        if (isClipping) {
          const glitchX = (Math.random() * 20) - 10;
          ctx.translate(glitchX, 0);
        }

        const barWidth = 15;
        const gap = 4;
        const totalBars = Math.floor(width / (barWidth + gap));
        const step = Math.floor(bufferLength / totalBars);

        for (let i = 0; i < totalBars; i++) {
          // Average the chunk of frequencies for this bar
          let chunkSum = 0;
          for (let j = 0; j < step; j++) {
            chunkSum += dataArray[(i * step) + j] || 0;
          }
          const chunkAvg = chunkSum / step;
          const barHeight = (chunkAvg / 255) * height * 0.8;

          const x = i * (barWidth + gap);

          // Draw blocky equalizer (broken into stacked squares)
          const segments = Math.floor(barHeight / 10);
          for(let s = 0; s < segments; s++) {
            // Yellow / Orange gradient
            const r = 255;
            const g = 215 - (s * 5); // Shifts to orange at top
            ctx.fillStyle = `rgba(${r}, ${g}, 0, 0.8)`;
            
            // Draw individual blocks, slightly spaced
            ctx.fillRect(x, height - (s * 12) - 10, barWidth, 8);
          }
        }

        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [analyserNode, activeCharacterName, isMiku, isTeto, isNeru]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen opacity-50 z-0"
      aria-hidden="true"
    />
  );
};

export const AudioVisualizerCanvas = memo(AudioVisualizerCanvasBase, (prev, next) => {
  return prev.activeCharacterName === next.activeCharacterName && prev.analyserNode === next.analyserNode;
});

