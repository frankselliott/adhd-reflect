import { useState, useEffect, useRef } from 'react';

/* ═══════════════════════════════════════════
   ADHD Reflect — Breathing Exercise
   Box breathing (4-4-4-4) with geometric animation
   Evidence-based for nervous system regulation
   ═══════════════════════════════════════════ */

const PHASES = [
  { label: 'breathe in',  duration: 4, scale: 1.0,  opacity: 1.0  },
  { label: 'hold',        duration: 4, scale: 1.0,  opacity: 0.85 },
  { label: 'breathe out', duration: 4, scale: 0.65, opacity: 0.6  },
  { label: 'hold',        duration: 4, scale: 0.65, opacity: 0.5  },
];

const TOTAL_CYCLE = PHASES.reduce((sum, p) => sum + p.duration, 0);

export default function BreathingExercise({ accentColor = '#4A6FA5', onComplete }) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [cycles, setCycles] = useState(0);
  const frameRef = useRef(null);
  const startRef = useRef(null);
  const totalCycles = 3; // 3 full cycles = 48 seconds

  useEffect(() => {
    if (!running) {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      return;
    }

    startRef.current = performance.now();

    function tick(now) {
      const t = (now - startRef.current) / 1000;
      setElapsed(t);

      const currentCycle = Math.floor(t / TOTAL_CYCLE);
      if (currentCycle >= totalCycles) {
        setRunning(false);
        setCycles(totalCycles);
        if (onComplete) onComplete();
        return;
      }
      setCycles(currentCycle);
      frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [running]);

  // Current phase calculation
  const cycleTime = elapsed % TOTAL_CYCLE;
  let phaseTime = 0;
  let currentPhase = PHASES[0];
  let phaseElapsed = 0;
  for (const phase of PHASES) {
    if (cycleTime < phaseTime + phase.duration) {
      currentPhase = phase;
      phaseElapsed = cycleTime - phaseTime;
      break;
    }
    phaseTime += phase.duration;
  }

  // Interpolate scale and opacity
  const phaseIdx = PHASES.indexOf(currentPhase);
  const nextPhase = PHASES[(phaseIdx + 1) % PHASES.length];
  const progress = phaseElapsed / currentPhase.duration;
  const eased = 0.5 - 0.5 * Math.cos(progress * Math.PI); // smooth ease

  const scale = running
    ? currentPhase.scale + (nextPhase.scale - currentPhase.scale) * eased
    : 0.65;

  const opacity = running
    ? currentPhase.opacity + (nextPhase.opacity - currentPhase.opacity) * eased
    : 0.5;

  const done = cycles >= totalCycles && !running && elapsed > 0;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '28px 0 20px',
    }}>
      {/* Breathing circle */}
      <div style={{
        position: 'relative', width: 140, height: 140,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
      }}>
        {/* Outer ring */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: `1.5px solid ${accentColor}`,
          opacity: 0.15,
        }} />

        {/* Animated circle */}
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: accentColor, opacity: opacity * 0.12,
          transform: `scale(${scale})`,
          transition: running ? 'none' : 'transform 0.6s ease, opacity 0.6s ease',
        }} />

        {/* Inner dot */}
        <div style={{
          position: 'absolute',
          width: 8, height: 8, borderRadius: '50%',
          background: accentColor, opacity: opacity,
          transform: `scale(${0.8 + scale * 0.4})`,
          transition: running ? 'none' : 'all 0.6s ease',
        }} />

        {/* Phase progress ring */}
        {running && (
          <svg style={{ position: 'absolute', inset: -2 }} width="144" height="144" viewBox="0 0 144 144">
            <circle cx="72" cy="72" r="69" fill="none" stroke={accentColor} strokeWidth="1.5"
              strokeDasharray={`${2 * Math.PI * 69}`}
              strokeDashoffset={`${2 * Math.PI * 69 * (1 - (cycleTime / TOTAL_CYCLE))}`}
              strokeLinecap="round" opacity="0.3"
              style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'none' }}
            />
          </svg>
        )}
      </div>

      {/* Label */}
      <div style={{
        fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 300,
        fontVariationSettings: '"opsz" 20, "wght" 380',
        color: running ? accentColor : '#A09589',
        letterSpacing: '-0.01em',
        minHeight: 28,
        transition: 'color 0.3s ease',
      }}>
        {done ? 'well done' : running ? currentPhase.label : 'ready when you are'}
      </div>

      {/* Cycle count */}
      {running && (
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em',
          color: '#A09589', marginTop: 6,
        }}>
          {cycles + 1} of {totalCycles}
        </div>
      )}

      {/* Button */}
      <button
        onClick={() => {
          if (running) { setRunning(false); setElapsed(0); setCycles(0); }
          else { setElapsed(0); setCycles(0); setRunning(true); }
        }}
        style={{
          marginTop: 16, appearance: 'none', border: 0, cursor: 'pointer',
          background: running ? 'rgba(25,23,20,0.06)' : accentColor,
          color: running ? '#6B6358' : '#F5EFE0',
          fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.06em',
          padding: '11px 24px', borderRadius: 999,
          transition: 'all 0.25s ease',
        }}
      >
        {done ? 'again' : running ? 'stop' : 'breathe'}
      </button>

      {/* Micro-explanation */}
      {!running && !done && (
        <p style={{
          fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 14, "wght" 340',
          fontSize: 12, color: '#A09589', marginTop: 10, textAlign: 'center',
          lineHeight: 1.5, maxWidth: 220,
        }}>
          Box breathing. Four seconds in, hold, out, hold. Resets your nervous system in under a minute.
        </p>
      )}
    </div>
  );
}

