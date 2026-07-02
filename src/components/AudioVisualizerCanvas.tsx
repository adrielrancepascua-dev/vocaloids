"use client";
import { useEffect, useRef, memo } from 'react';
import type { CharacterTheme } from '../constants/theme';
import { getEffectsForTheme } from '../config/characterEffects';

export interface AudioVisualizerCanvasProps {
  analyserNode: AnalyserNode | null;
  theme: CharacterTheme;
  color: string;
  isLowEnd?: boolean;
}

const AudioVisualizerCanvasBase = ({
  analyserNode,
  theme,
  color,
  isLowEnd = false,
}: AudioVisualizerCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const particlesRef = useRef<Array<{
    x: number; y: number; vx: number; vy: number;
    baseX: number; baseY: number; radius: number; color: string;
  }>>([]);

  const fx = getEffectsForTheme(theme);
  const mode = fx.visualizerMode;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let currentDpr = 1;

    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      currentDpr = dpr;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (mode === 'particles') {
        const p: typeof particlesRef.current = [];
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const count = isLowEnd ? fx.particleCount.low : fx.particleCount.high;
        for (let i = 0; i < count; i++) {
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
            color: `rgba(220, 38, 38, ${Math.random() * 0.5 + 0.3})`,
          });
        }
        particlesRef.current = p;
      }
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const bufferLength = analyserNode ? analyserNode.frequencyBinCount : 0;
    const dataArray = analyserNode ? new Uint8Array(bufferLength) : new Uint8Array(128);

    const renderLoop = () => {
      if (!ctx || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      ctx.clearRect(0, 0, width, height);

      if (analyserNode && bufferLength > 0) {
        analyserNode.getByteFrequencyData(dataArray);
      }

      if (mode === 'bezier') {
        const midStart = Math.floor(bufferLength * 0.2);
        const midEnd = Math.floor(bufferLength * 0.6);
        const midLength = midEnd - midStart;
        const midSliceWidth = width / midLength;

        for (let layer = 0; layer < 3; layer++) {
          ctx.beginPath();
          let x = 0;
          for (let i = midStart; i < midEnd; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * height) / 2 + layer * 20;
            if (i === midStart) ctx.moveTo(x, y);
            else {
              const xc = (x + x + midSliceWidth) / 2;
              const yc = (y + y) / 2;
              ctx.quadraticCurveTo(x, y, xc, yc);
            }
            x += midSliceWidth;
          }
          const rgb = hexToRgb(color);
          ctx.strokeStyle = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.8 - layer * 0.2})` : color;
          ctx.lineWidth = 3 - layer;
          ctx.stroke();
        }
      } else if (mode === 'particles') {
        let bassSum = 0;
        for (let i = 0; i < 10; i++) bassSum += dataArray[i] || 0;
        const bassAvg = bassSum / 10;
        const isKick = bassAvg > 210;
        const centerX = width / 2;
        const centerY = height / 2;

        particlesRef.current.forEach((p) => {
          if (isKick) {
            const angle = Math.atan2(p.y - centerY, p.x - centerX);
            const force = (bassAvg / 255) * 15;
            p.vx += Math.cos(angle) * force * Math.random();
            p.vy += Math.sin(angle) * force * Math.random();
          }
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.85;
          p.vy *= 0.85;
          p.vx += (p.baseX - p.x) * 0.05;
          p.vy += (p.baseY - p.y) * 0.05;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * (1 + bassAvg / 255), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        });

        const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, bassAvg);
        coreGradient.addColorStop(0, 'rgba(220, 38, 38, 0.8)');
        coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, bassAvg, 0, Math.PI * 2);
        ctx.fill();
      } else if (mode === 'spectrum') {
        let trebleSum = 0;
        const trebleStart = Math.floor(bufferLength * 0.7);
        for (let i = trebleStart; i < bufferLength; i++) trebleSum += dataArray[i] || 0;
        const trebleAvg = trebleSum / (bufferLength - trebleStart);
        const isClipping = trebleAvg > 100;

        ctx.save();
        if (isClipping) ctx.translate((Math.random() * 20) - 10, 0);

        const barWidth = 15;
        const gap = 4;
        const totalBars = Math.floor(width / (barWidth + gap));
        const step = Math.max(1, Math.floor(bufferLength / totalBars));

        for (let i = 0; i < totalBars; i++) {
          let chunkSum = 0;
          for (let j = 0; j < step; j++) chunkSum += dataArray[i * step + j] || 0;
          const chunkAvg = chunkSum / step;
          const barHeight = (chunkAvg / 255) * height * 0.8;
          const x = i * (barWidth + gap);
          const segments = Math.floor(barHeight / 10);
          for (let s = 0; s < segments; s++) {
            const g = 215 - s * 5;
            ctx.fillStyle = `rgba(255, ${g}, 0, 0.8)`;
            ctx.fillRect(x, height - s * 12 - 10, barWidth, 8);
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
  }, [analyserNode, theme, color, isLowEnd, mode, fx.particleCount.high, fx.particleCount.low]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen opacity-40 z-[1]"
      aria-hidden="true"
    />
  );
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
}

export const AudioVisualizerCanvas = memo(AudioVisualizerCanvasBase, (prev, next) => {
  return prev.theme === next.theme && prev.analyserNode === next.analyserNode && prev.isLowEnd === next.isLowEnd;
});
