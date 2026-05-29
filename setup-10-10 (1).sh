#!/bin/bash
echo "═══════════════════════════════════════"
echo "  ADHD Reflect — Full Update"
echo "═══════════════════════════════════════"
mkdir -p src/components src/data src/pages/cards src/pages/guides functions/api
echo "  ✓ src/pages/index.astro"
cat > 'src/pages/index.astro' << 'ENDFILE'
---
import Base from '../layouts/Base.astro';
import AIRouter from '../components/AIRouter.jsx';
---
<Base title="ADHD Reflect" description="For ADHD parents raising ADHD kids. Work out what's happening before everyone escalates.">

  <!-- ─── Hero: AI Router ─── -->
  <section class="hero">
    <div class="hero-inner">
      <p class="hero-label">For ADHD parents raising ADHD kids</p>
      <h1 class="hero-title">What just <em>happened?</em></h1>
      <p class="hero-body">
        Describe the moment, however messy. We'll help you work out what's happening and what to do next.
      </p>
      <AIRouter client:load />
    </div>
  </section>

  <!-- ─── Quiz CTA ─── -->
  <section class="quiz-cta">
    <div class="quiz-cta-inner">
      <div class="quiz-cta-content">
        <h2>Keep seeing the same pattern?</h2>
        <p>Take a three-minute quiz to see how your ADHD tends to show up when parenting gets hard. Not a diagnosis. A way to notice what keeps happening.</p>
        <a href="/quiz" class="btn btn-primary">Find my pattern</a>
      </div>
    </div>
  </section>

  <!-- ─── What this is ─── -->
  <section class="what">
    <div class="what-inner">
      <div class="what-block">
        <span class="what-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="var(--blue)" stroke-width="1.5" fill="none"/><path d="M10 6v4l2.5 2.5" stroke="var(--blue)" stroke-width="1.5" stroke-linecap="round"/></svg>
        </span>
        <h3>For the moment you're in</h3>
        <p>Short, specific help for the hard bit. After you yell, when homework collapses, when bedtime turns feral, or when you check out and feel guilty.</p>
      </div>
      <div class="what-block">
        <span class="what-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2C5.6 2 2 5.6 2 10s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z" stroke="var(--sage-dark)" stroke-width="1.5" fill="none"/><path d="M7 10l2 2 4-4" stroke="var(--sage-dark)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
        <h3>Your pattern</h3>
        <p>Take the quiz to see which ADHD parenting loop keeps catching you. Not a diagnosis. A way to notice what keeps happening.</p>
      </div>
      <div class="what-block">
        <span class="what-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 15V5a2 2 0 012-2h8a2 2 0 012 2v10" stroke="var(--lavender)" stroke-width="1.5" fill="none"/><path d="M2 15h16" stroke="var(--lavender)" stroke-width="1.5" stroke-linecap="round"/></svg>
        </span>
        <h3>Built by someone in it</h3>
        <p>Made by an ADHD parent raising an ADHD-influenced kid. Not a clinic. Not a course. Not another pastel brand pretending chaos is a morning routine problem.</p>
      </div>
    </div>
  </section>

  <!-- ─── Who this is for ─── -->
  <section class="who">
    <div class="who-inner">
      <h2>This is for you if</h2>
      <div class="who-list">
        <p>You have ADHD (diagnosed or strongly suspect it) and you're raising a child whose brain works like yours.</p>
        <p>You've read the parenting books but they assume a level of consistency your brain doesn't offer.</p>
        <p>You need something for the bad Tuesday afternoon, not the calm Sunday morning when every parenting strategy looks achievable.</p>
      </div>
    </div>
  </section>


</Base>

<style>
  .hero { padding: var(--space-3xl) 0 var(--space-2xl); }
  .hero-inner { max-width: 640px; margin: 0 auto; padding: 0 var(--page-pad); }
  .hero-label {
    font-family: var(--mono); font-size: 10px; letter-spacing: 0.22em;
    text-transform: uppercase; color: var(--blue); margin-bottom: var(--space-md);
  }
  .hero-title {
    font-family: var(--serif); font-size: clamp(30px, 5vw, 44px); font-weight: 300;
    line-height: 1.15; color: var(--slate); margin-bottom: var(--space-md);
    font-variation-settings: 'opsz' 48;
  }
  .hero-title em { font-style: italic; color: var(--blue); }
  .hero-body {
    font-size: 18px; line-height: 1.6; color: var(--pewter);
    max-width: 480px; margin-bottom: var(--space-xl);
  }
  @media (max-width: 480px) { .hero { padding: var(--space-2xl) 0 var(--space-xl); } }

  .quiz-cta { padding: var(--space-2xl) 0; border-top: 1px solid var(--mist-border); }
  .quiz-cta-inner { max-width: 640px; margin: 0 auto; padding: 0 var(--page-pad); }
  .quiz-cta-content {
    background: white; border-radius: var(--radius-lg);
    border: 1px solid var(--mist-border); padding: var(--space-lg);
  }
  .quiz-cta-content h2 { font-size: 22px; margin-bottom: var(--space-sm); }
  .quiz-cta-content p {
    font-size: 16px; line-height: 1.6; color: var(--pewter);
    margin-bottom: var(--space-md); max-width: 480px;
  }

  .what { padding: var(--space-3xl) 0; border-top: 1px solid var(--mist-border); }
  .what-inner {
    max-width: var(--container-wide); margin: 0 auto; padding: 0 var(--page-pad);
    display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-xl);
  }
  .what-block h3 {
    font-family: var(--serif); font-size: 19px; font-weight: 400;
    margin-bottom: var(--space-sm); font-variation-settings: 'opsz' 24;
  }
  .what-block p { font-size: 15px; line-height: 1.6; color: var(--pewter); }
  .what-icon {
    display: flex; align-items: center; justify-content: center;
    width: 40px; height: 40px; border-radius: var(--radius-md);
    background: var(--mist); margin-bottom: var(--space-md);
  }
  @media (max-width: 640px) { .what-inner { grid-template-columns: 1fr; } }

  .who {
    padding: var(--space-3xl) 0; background: white;
    border-top: 1px solid var(--mist-border); border-bottom: 1px solid var(--mist-border);
  }
  .who-inner { max-width: var(--container-max); margin: 0 auto; padding: 0 var(--page-pad); }
  .who-inner h2 { margin-bottom: var(--space-lg); }
  .who-list { display: flex; flex-direction: column; gap: var(--space-md); }
  .who-list p {
    font-size: 17px; line-height: 1.6; color: var(--pewter);
    padding-left: var(--space-lg); border-left: 2px solid var(--sage);
  }

  .newsletter-input:focus { border-color: var(--blue); }
  .newsletter-btn { padding: 12px 24px; white-space: nowrap; }
  .newsletter-note { font-size: 13px; color: var(--pewter); opacity: 0.6; margin-top: var(--space-sm); }
  @media (max-width: 480px) {
    .newsletter-mock { flex-direction: column; }
    .newsletter-btn { width: 100%; }
  }
</style>

ENDFILE

echo "  ✓ src/components/AIRouter.jsx"
cat > 'src/components/AIRouter.jsx' << 'ENDFILE'
import { useState, useRef, useEffect } from 'react';

const PLACEHOLDERS = [
  "They refused homework. I snapped. Now I feel awful...",
  "Bedtime blew up again...",
  "I said the thing I promised I wouldn't say...",
  "They screamed. I yelled. Now I feel guilty...",
  "Morning was a disaster. Everyone's upset...",
  "I checked out and they noticed...",
  "Sibling fight. I froze. Nobody got what they needed...",
  "I lost it over something tiny and I know it...",
  "School drop-off was awful. They clung. I snapped...",
  "I forgot something that really mattered to them...",
];

const EXAMPLES = [
  "I yelled at my kid over homework",
  "Bedtime fell apart again",
  "I checked out on my phone",
  "They had a meltdown in public",
  "I feel guilty about this morning",
  "Sibling fight and I lost it",
];

export default function AIRouter() {
  const [input, setInput] = useState('');
  const [state, setState] = useState('idle');
  const [matches, setMatches] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [unmatchedNote, setUnmatchedNote] = useState('');
  const [listening, setListening] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const textareaRef = useRef(null);

  // Rotate placeholder text
  useEffect(() => {
    if (input || state !== 'idle') return;
    const timer = setInterval(() => {
      setPlaceholderIdx(i => (i + 1) % PLACEHOLDERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [input, state]);

  async function handleSubmit() {
    if (!input.trim() || input.trim().length < 3) return;
    setState('loading');
    setMatches([]);
    setErrorMsg('');

    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input.trim() }),
      });
      const data = await res.json();

      if (data.error) { setErrorMsg(data.error); setState('error'); return; }
      if (data.crisis) { setState('crisis'); return; }
      if (data.unmatched) { setUnmatchedNote(data.suggestion || ''); setState('unmatched'); return; }

      setMatches(data.matches || []);
      setState('result');
    } catch (e) {
      setErrorMsg('Could not reach the matching service. Try again.');
      setState('error');
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  }

  function handleExample(text) {
    setInput(text);
    textareaRef.current?.focus();
  }

  function handleVoice() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = 'en-AU';
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => { setInput(e.results[0][0].transcript); setListening(false); };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    setListening(true);
    rec.start();
  }

  function handleReset() {
    setInput('');
    setMatches([]);
    setState('idle');
    setErrorMsg('');
    setUnmatchedNote('');
    textareaRef.current?.focus();
  }

  const hasVoice = typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  const canSubmit = input.trim().length >= 3;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>

      {/* ─── INPUT STATE ─── */}
      {(state === 'idle' || state === 'error') && (
        <div>
          <div style={{
            background: 'white', borderRadius: 16,
            border: '1.5px solid rgba(31,42,55,0.08)',
            padding: 4, display: 'flex', flexDirection: 'column',
          }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={PLACEHOLDERS[placeholderIdx]}
              rows={3}
              style={{
                width: '100%', border: 'none', outline: 'none', resize: 'none',
                fontFamily: 'var(--sans)', fontSize: 17, lineHeight: 1.55,
                color: 'var(--slate)', padding: '16px 16px 8px',
                background: 'transparent', boxSizing: 'border-box',
              }}
            />
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', padding: '4px 8px 8px',
            }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {hasVoice && (
                  <button onClick={handleVoice}
                    style={{
                      background: listening ? 'var(--clay)' : 'var(--mist)',
                      border: 'none', borderRadius: '50%',
                      width: 40, height: 40, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.2s',
                    }}
                    aria-label={listening ? 'Listening...' : 'Speak'}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={listening ? 'white' : 'var(--pewter)'} strokeWidth="2" strokeLinecap="round">
                      <rect x="9" y="2" width="6" height="12" rx="3" />
                      <path d="M5 10a7 7 0 0014 0" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </button>
                )}
              </div>
              <button onClick={handleSubmit} disabled={!canSubmit}
                style={{
                  background: canSubmit ? 'var(--blue)' : 'rgba(31,42,55,0.08)',
                  color: canSubmit ? 'white' : 'var(--pewter)',
                  border: 'none', borderRadius: 100,
                  padding: '10px 24px', fontFamily: 'var(--sans)',
                  fontSize: 15, fontWeight: 600, cursor: canSubmit ? 'pointer' : 'default',
                  minHeight: 44, transition: 'all 0.2s',
                  opacity: canSubmit ? 1 : 0.5,
                }}>
                Help me sort this out
              </button>
            </div>
          </div>

          {/* Example pills */}
          {!input && (
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12,
            }}>
              {EXAMPLES.map((ex, i) => (
                <button key={i} onClick={() => handleExample(ex)}
                  style={{
                    appearance: 'none', border: '1px solid rgba(31,42,55,0.08)',
                    background: 'white', borderRadius: 100,
                    padding: '7px 14px', cursor: 'pointer',
                    fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--pewter)',
                    transition: 'border-color 0.15s, color 0.15s',
                    lineHeight: 1.3,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.color = 'var(--blue)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(31,42,55,0.08)'; e.currentTarget.style.color = 'var(--pewter)'; }}
                >{ex}</button>
              ))}
            </div>
          )}

          {state === 'error' && (
            <p style={{ fontSize: 14, color: 'var(--clay)', marginTop: 12 }}>{errorMsg}</p>
          )}

          <p style={{
            fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.08em',
            color: 'var(--pewter)', opacity: 0.5, marginTop: 12,
          }}>
            Not stored. Not logged.
          </p>
        </div>
      )}

      {/* ─── LOADING ─── */}
      {state === 'loading' && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            border: '3px solid var(--mist)', borderTopColor: 'var(--blue)',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ fontSize: 15, color: 'var(--pewter)' }}>Working it out...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* ─── CRISIS ─── */}
      {state === 'crisis' && (
        <div style={{
          background: 'white', borderRadius: 16,
          border: '1px solid rgba(201,123,106,0.3)', padding: 24,
        }}>
          <h3 style={{
            fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 400,
            color: 'var(--slate)', marginBottom: 12,
          }}>This sounds like it needs more than a guide right now.</h3>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--pewter)', marginBottom: 16 }}>
            If you or your child are unsafe, please reach out to crisis support.
          </p>
          <a href="/resources" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', borderRadius: 100,
            background: 'var(--blue)', color: 'white',
            textDecoration: 'none', fontFamily: 'var(--sans)',
            fontSize: 15, fontWeight: 600, minHeight: 44,
          }}>See support options</a>
          <button onClick={handleReset} style={{
            display: 'block', marginTop: 16, background: 'none',
            border: 'none', color: 'var(--pewter)', fontSize: 14,
            fontFamily: 'var(--sans)', cursor: 'pointer', padding: '8px 0',
          }}>&#8592; Try a different description</button>
        </div>
      )}

      {/* ─── RESULTS ─── */}
      {state === 'result' && matches.length > 0 && (
        <div>
          <p style={{
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--sage-dark)', marginBottom: 16,
          }}>
            {matches.length === 1 ? 'What fits' : `${matches.length} matches`}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {matches.map((match, i) => (
              <a key={match.id} href={`/cards/${match.id}`}
                style={{
                  background: 'white', borderRadius: 16,
                  border: i === 0 ? '1.5px solid var(--blue)' : '1px solid rgba(31,42,55,0.08)',
                  padding: 20, textDecoration: 'none', color: 'inherit',
                  display: 'block', transition: 'box-shadow 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 24px rgba(31,42,55,0.09)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
              >
                {i === 0 && (
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
                    textTransform: 'uppercase', color: 'var(--blue)',
                    display: 'block', marginBottom: 8,
                  }}>Best match</span>
                )}
                <h3 style={{
                  fontFamily: 'var(--serif)', fontSize: 19, fontWeight: 400,
                  lineHeight: 1.3, color: 'var(--slate)', margin: 0,
                  marginBottom: match.reason ? 8 : 0,
                }}>{match.title}</h3>
                {match.reason && (
                  <p style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--pewter)', margin: 0 }}>
                    {match.reason}
                  </p>
                )}
              </a>
            ))}
          </div>
          <button onClick={handleReset} style={{
            display: 'block', marginTop: 20, background: 'none',
            border: 'none', color: 'var(--pewter)', fontSize: 14,
            fontFamily: 'var(--sans)', cursor: 'pointer', padding: '8px 0',
          }}>&#8592; Describe something else</button>
        </div>
      )}

      {/* ─── UNMATCHED ─── */}
      {state === 'unmatched' && (
        <div style={{ background: 'var(--mist)', borderRadius: 16, padding: 24 }}>
          <h3 style={{
            fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 400,
            color: 'var(--slate)', marginBottom: 12,
          }}>Nothing for this one yet</h3>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--pewter)', marginBottom: 8 }}>
            We don't have a guide that matches what you described. We're still building.
          </p>
          {unmatchedNote && (
            <p style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--pewter)', opacity: 0.7 }}>{unmatchedNote}</p>
          )}
          <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
            <a href="/guides" style={{
              padding: '10px 20px', borderRadius: 100, background: 'var(--blue)', color: 'white',
              textDecoration: 'none', fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600,
              minHeight: 44, display: 'inline-flex', alignItems: 'center',
            }}>Browse guides</a>
            <button onClick={handleReset} style={{
              padding: '10px 20px', borderRadius: 100, background: 'transparent', color: 'var(--pewter)',
              border: '1.5px solid rgba(31,42,55,0.08)', fontFamily: 'var(--sans)',
              fontSize: 14, cursor: 'pointer', minHeight: 44,
            }}>Try again</button>
          </div>
        </div>
      )}
    </div>
  );
}

ENDFILE

echo "  ✓ src/components/BreathingExercise.jsx"
cat > 'src/components/BreathingExercise.jsx' << 'ENDFILE'
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

ENDFILE

echo "  ✓ src/components/Activities.jsx"
cat > 'src/components/Activities.jsx' << 'ENDFILE'
import { useState, useEffect, useRef } from 'react';

/* ═══════════════════════════════════════════
   ADHD Reflect — In-the-Moment Activities
   Bespoke to the situation, not generic wellness
   ═══════════════════════════════════════════ */

// ─── 5-4-3-2-1 Grounding ───
export function GroundingExercise({ accentColor = '#4B6B4E' }) {
  const senses = [
    { count: 5, sense: 'see', prompt: 'Name five things you can see right now.' },
    { count: 4, sense: 'touch', prompt: 'Name four things you can physically feel.' },
    { count: 3, sense: 'hear', prompt: 'Name three things you can hear.' },
    { count: 2, sense: 'smell', prompt: 'Name two things you can smell.' },
    { count: 1, sense: 'taste', prompt: 'Name one thing you can taste.' },
  ];
  const [step, setStep] = useState(-1);
  const active = step >= 0 && step < senses.length;
  const done = step >= senses.length;
  const current = senses[step] || null;

  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      {/* Visual circles */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
        {senses.map((s, i) => (
          <div key={i} style={{
            width: 12 + s.count * 4, height: 12 + s.count * 4,
            borderRadius: '50%', transition: 'all 0.4s ease',
            background: i < step ? accentColor : i === step ? accentColor : 'transparent',
            border: `1.5px solid ${accentColor}`,
            opacity: i <= step ? 1 : 0.2,
          }} />
        ))}
      </div>

      {active && current && (
        <div style={{ animation: 'panel-in 300ms ease both' }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 32, fontWeight: 500,
            color: accentColor, marginBottom: 8,
          }}>{current.count}</div>
          <p style={{
            fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 18, "wght" 400',
            fontSize: 17, lineHeight: 1.5, color: '#6B6358', marginBottom: 16, maxWidth: 260, margin: '0 auto 16px',
          }}>{current.prompt}</p>
        </div>
      )}

      {done && (
        <p style={{
          fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 18, "wght" 400',
          fontSize: 17, color: accentColor,
        }}>You're here. You're present.</p>
      )}

      <button onClick={() => setStep(s => done ? -1 : s + 1)}
        style={{
          appearance: 'none', border: 0, cursor: 'pointer', marginTop: 8,
          background: active ? 'rgba(25,23,20,0.06)' : accentColor,
          color: active ? '#6B6358' : '#F5EFE0',
          fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.06em',
          padding: '11px 24px', borderRadius: 999,
        }}>
        {done ? 'again' : active ? 'next' : 'ground yourself'}
      </button>

      {!active && !done && (
        <p style={{
          fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 14, "wght" 340',
          fontSize: 12, color: '#A09589', marginTop: 10, maxWidth: 200, margin: '10px auto 0',
          lineHeight: 1.5,
        }}>5-4-3-2-1. Pulls your nervous system back into the room.</p>
      )}
    </div>
  );
}

// ─── Scale It (1-10) ───
export function ScaleExercise({ accentColor = '#B85038', prompt = 'How bad is this, really?' }) {
  const [value, setValue] = useState(null);
  const responses = {
    low: "Lower than it felt thirty seconds ago. That's your prefrontal cortex coming back online.",
    mid: "Real, but manageable. Your brain made it feel bigger than this. You can work with this number.",
    high: "High. That's honest. Sometimes it really is that bad. But naming it is the first step down.",
  };
  const level = value === null ? null : value <= 3 ? 'low' : value <= 6 ? 'mid' : 'high';

  return (
    <div style={{ padding: '20px 0' }}>
      <p style={{
        fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 16, "wght" 420',
        fontSize: 16, color: '#191714', marginBottom: 16, textAlign: 'center',
      }}>{prompt}</p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
        {[1,2,3,4,5,6,7,8,9,10].map(n => (
          <button key={n} onClick={() => setValue(n)}
            style={{
              width: 32, height: 32, borderRadius: 8,
              border: value === n ? `2px solid ${accentColor}` : '1.5px solid rgba(25,23,20,0.1)',
              background: value === n ? accentColor : 'transparent',
              color: value === n ? '#F5EFE0' : '#A09589',
              fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.15s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{n}</button>
        ))}
      </div>

      {level && (
        <p style={{
          fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 16, "wght" 380',
          fontSize: 15, lineHeight: 1.6, color: '#6B6358', marginTop: 16,
          textAlign: 'center', maxWidth: 280, margin: '16px auto 0',
          animation: 'panel-in 300ms ease both',
        }}>{responses[level]}</p>
      )}
    </div>
  );
}

// ─── Perspective Shift ───
export function PerspectiveShift({ accentColor = '#3F6178' }) {
  const prompts = [
    "What would you say to a friend who just told you this happened?",
    "Will this matter in a week?",
    "What does your child need from you in the next sixty seconds? Just that.",
    "What would the version of you with a full night's sleep do right now?",
    "Is this about what just happened, or about everything that happened before it?",
  ];
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);

  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: `${accentColor}12`, margin: '0 auto 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/>
        </svg>
      </div>

      {revealed ? (
        <div style={{ animation: 'panel-in 300ms ease both' }}>
          <p style={{
            fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 20, "wght" 440',
            fontSize: 18, lineHeight: 1.45, color: '#191714',
            maxWidth: 280, margin: '0 auto 16px',
          }}>{prompts[idx]}</p>
          <button onClick={() => { setIdx((idx + 1) % prompts.length); setRevealed(false); }}
            style={{
              appearance: 'none', border: 0, cursor: 'pointer',
              background: 'rgba(25,23,20,0.06)', color: '#6B6358',
              fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.06em',
              padding: '9px 20px', borderRadius: 999,
            }}>another</button>
        </div>
      ) : (
        <button onClick={() => setRevealed(true)}
          style={{
            appearance: 'none', border: 0, cursor: 'pointer',
            background: accentColor, color: '#F5EFE0',
            fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.06em',
            padding: '11px 24px', borderRadius: 999,
          }}>shift perspective</button>
      )}

      {!revealed && (
        <p style={{
          fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 14, "wght" 340',
          fontSize: 12, color: '#A09589', marginTop: 10,
          lineHeight: 1.5,
        }}>One question to step outside the moment.</p>
      )}
    </div>
  );
}

// ─── Repair Script ───
export function RepairScript({ accentColor = '#4B6B4E', scripts }) {
  const defaultScripts = [
    { line1: "I lost it and I shouldn't have.", line2: "I'm going to work on pausing before I get to that point." },
    { line1: "That wasn't fair on you.", line2: "You deserved better from me in that moment." },
    { line1: "I said something I didn't mean.", line2: "What I should have said was nothing at all." },
  ];
  const allScripts = scripts || defaultScripts;
  const [idx, setIdx] = useState(0);
  const script = allScripts[idx];

  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{
        background: 'rgba(25,23,20,0.04)', borderRadius: 14, padding: '20px 22px',
      }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
          textTransform: 'lowercase', color: accentColor, marginBottom: 14,
        }}>two-sentence repair</div>
        <p style={{
          fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 20, "wght" 460',
          fontSize: 19, lineHeight: 1.4, color: '#191714', fontStyle: 'italic', margin: 0,
        }}>
          "{script.line1}"
        </p>
        <p style={{
          fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 20, "wght" 460',
          fontSize: 19, lineHeight: 1.4, color: '#191714', fontStyle: 'italic',
          margin: '8px 0 0',
        }}>
          "{script.line2}"
        </p>
      </div>
      {allScripts.length > 1 && (
        <button onClick={() => setIdx((idx + 1) % allScripts.length)}
          style={{
            appearance: 'none', border: 0, cursor: 'pointer', marginTop: 12,
            background: 'none', color: '#A09589',
            fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.06em',
          }}>another script &#8594;</button>
      )}
      <p style={{
        fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 14, "wght" 340',
        fontSize: 12, color: '#A09589', marginTop: 8, lineHeight: 1.5,
      }}>Say it when both of you are calm. Not now. Later. Two sentences, then return to normal.</p>
    </div>
  );
}

// ─── Room Reset ───
export function RoomReset({ accentColor = '#B85038' }) {
  const actions = [
    "Turn off one source of noise.",
    "Open or close a window.",
    "Move to a different room.",
    "Turn a light on or off.",
    "Put one thing away.",
    "Sit down if you're standing. Stand up if you're sitting.",
  ];
  const [action, setAction] = useState(null);

  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      {action ? (
        <div style={{ animation: 'panel-in 300ms ease both' }}>
          <p style={{
            fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 20, "wght" 440',
            fontSize: 18, lineHeight: 1.4, color: '#191714',
            maxWidth: 260, margin: '0 auto 16px',
          }}>{action}</p>
          <p style={{
            fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 14, "wght" 360',
            fontSize: 14, color: '#6B6358', maxWidth: 240, margin: '0 auto 16px',
          }}>One change to the environment before you address the behaviour.</p>
          <button onClick={() => setAction(actions[Math.floor(Math.random() * actions.length)])}
            style={{
              appearance: 'none', border: 0, cursor: 'pointer',
              background: 'rgba(25,23,20,0.06)', color: '#6B6358',
              fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.06em',
              padding: '9px 20px', borderRadius: 999,
            }}>different one</button>
        </div>
      ) : (
        <>
          <button onClick={() => setAction(actions[Math.floor(Math.random() * actions.length)])}
            style={{
              appearance: 'none', border: 0, cursor: 'pointer',
              background: accentColor, color: '#F5EFE0',
              fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.06em',
              padding: '11px 24px', borderRadius: 999,
            }}>reset the room</button>
          <p style={{
            fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 14, "wght" 340',
            fontSize: 12, color: '#A09589', marginTop: 10, lineHeight: 1.5,
            maxWidth: 220, margin: '10px auto 0',
          }}>Lower the input before you correct the behaviour.</p>
        </>
      )}
    </div>
  );
}

// ─── Name the Pattern ───
export function NameThePattern({ accentColor = '#9B8BB4', patternName, patternDescription }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      {revealed ? (
        <div style={{ animation: 'panel-in 300ms ease both' }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
            textTransform: 'lowercase', color: accentColor, marginBottom: 10,
          }}>you're in</div>
          <p style={{
            fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 24, "wght" 500',
            fontSize: 22, color: '#191714', marginBottom: 8,
          }}>{patternName || 'a pattern you know'}</p>
          <p style={{
            fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 16, "wght" 380',
            fontSize: 15, lineHeight: 1.55, color: '#6B6358',
            maxWidth: 280, margin: '0 auto',
          }}>{patternDescription || 'Naming the pattern is the first step out of it. You can see it now. That changes what happens next.'}</p>
        </div>
      ) : (
        <>
          <button onClick={() => setRevealed(true)}
            style={{
              appearance: 'none', border: 0, cursor: 'pointer',
              background: accentColor, color: '#F5EFE0',
              fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.06em',
              padding: '11px 24px', borderRadius: 999,
            }}>name the pattern</button>
          <p style={{
            fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 14, "wght" 340',
            fontSize: 12, color: '#A09589', marginTop: 10, lineHeight: 1.5,
            maxWidth: 220, margin: '10px auto 0',
          }}>Seeing the loop is the first step out of it.</p>
        </>
      )}
    </div>
  );
}

ENDFILE

echo "  ✓ src/data/brainProcess.js"
cat > 'src/data/brainProcess.js' << 'ENDFILE'
// ADHD Reflect — Brain Process Explanations
// What your nervous system just did — for every card
// Grounded in the Scientific Research Bible

export const BRAIN_PROCESS = {
  k01: {
    body: "The frustration of replacing, searching, and managing lost items creates a chronic, grinding stress. It feels like you're always cleaning up the same mess.",
    brain: "Object permanence is weaker in ADHD. Items that leave your child's line of sight genuinely stop existing in their working memory. They're not careless or disrespectful of their things. Their brain stops tracking objects that aren't visible.",
    effect: "External systems reduce the load on working memory. Labels, hooks at eye level, transparent containers, designated spots. The goal is making the right place obvious enough that it doesn't require remembering.",
  },
  k02: {
    body: "The same thing, forgotten again. Lunch box, homework, PE kit. It feels deliberate but it's not.",
    brain: "ADHD working memory holds fewer items for shorter durations. Your child isn't forgetting because they don't care. The instruction entered working memory and dropped out before it could be acted on. The gap between hearing and doing is where ADHD lives.",
    effect: "Checklists at the door, not in their head. Visual cues at the point of action. The best system is the one that doesn't rely on remembering.",
  },
  k03: {
    body: "The meltdown looks disproportionate. It's a sock seam, a food texture, a noise. But their distress is real and intense.",
    brain: "ADHD frequently co-occurs with sensory processing differences. Inputs that are filtered out by a neurotypical nervous system arrive at full intensity in your child's brain. The sock seam isn't a small thing to them. It's the loudest signal in their nervous system right now.",
    effect: "Validating the sensory experience, even when you can't feel it yourself, reduces the escalation. 'I can see that really bothers you' is more regulating than 'It's just a sock.' Remove the input where possible rather than asking them to tolerate it.",
  },
  k04: {
    body: "Mealtimes are a battleground. The food refusal feels personal, wasteful, or worrying. Your own frustration builds with each rejected plate.",
    brain: "ADHD sensory sensitivity extends to taste, texture, temperature, and smell. Food aversions are neurological, not behavioural. The child isn't being fussy. Their nervous system is rejecting inputs that register as genuinely unpleasant or overwhelming.",
    effect: "Pressure to eat increases the aversion. Repeated low-pressure exposure to new foods works better than forcing. One safe food on every plate. No commentary on what they didn't eat. The goal is a neutral relationship with food, not a varied diet by Thursday.",
  },
  k05: {
    body: "They're moving, fidgeting, tipping the chair, leaving the table. It's disruptive and exhausting and it happens every single meal.",
    brain: "The ADHD nervous system requires more sensory input to maintain optimal arousal. Sitting still is the opposite of what their body needs. The fidgeting isn't defiance. It's their nervous system generating the stimulation it requires to function.",
    effect: "Movement helps them regulate, not the opposite. A wobble cushion, standing at the table, or a fidget tool can satisfy the movement need without the chair-tipping. Shorter meals with permission to move afterward work better than longer meals with forced stillness.",
  },
  k06: {
    body: "The running, climbing, roughhousing. It's physically exhausting to supervise and socially nerve-wracking in public. You can see the judgment.",
    brain: "ADHD hyperactivity is driven by dopamine-seeking. The motor cortex is under-stimulated and the child is self-medicating through movement. The impulse to run, jump, or climb arrives before the executive function system can assess whether it's appropriate.",
    effect: "Channelled movement is safer than suppressed movement. Suppression doesn't reduce the drive. It builds pressure until it releases in a less controlled way. Designate spaces and times where the movement is welcome.",
  },
  k07: {
    body: "The reaction to a small criticism or perceived failure is enormous. Tears, shutdown, sometimes rage. It looks like they can't handle anything going wrong.",
    brain: "ADHD emotional regulation is one of the most consistently impaired functions. Perceived failure triggers not just disappointment but a rejection sensitivity response. They feel exposed as not good enough, which is a deeper wound than the actual failure.",
    effect: "By age 12, a child with ADHD may have received 20,000 more negative messages than their peers. Their sensitivity to failure isn't personality. It's accumulated experience. Your response to their failure matters more than the failure itself.",
  },
  k08: {
    body: "The morning refusal. The tears at drop-off. The stomach aches that are real but have no medical cause. School has become a source of dread.",
    brain: "School demands sustained attention, social navigation, impulse suppression, and executive function for six hours. For an ADHD child, this is like running a marathon every day in a body built for sprints. The refusal isn't laziness. It's their nervous system anticipating a day of unsustainable demand.",
    effect: "Work with the school to identify and reduce the specific stressors. Mornings where the child has some agency over the routine produce less refusal. And name what's real: 'School is hard for your brain. That doesn't mean you can't do it. It means it costs you more.'",
  },
  k09: {
    body: "They said something inappropriate, hurtful, or embarrassing. In front of people. Again. Your cringe is immediate.",
    brain: "ADHD verbal impulsivity means thoughts become words before the social filter can assess them. Your child isn't being rude. The gap between the thought and the speech is too short for the social processing system to intervene.",
    effect: "They often know it was wrong immediately after. The shame of the social error is usually worse than anything you could add. A brief, private debrief later: 'What happened there?' lets them process without public humiliation.",
  },
  k10: {
    body: "They lied. About homework, about what happened, about something small or something big. The breach of trust is sharp.",
    brain: "ADHD children lie more frequently than neurotypical peers, but the mechanism is different. It's often impulsive, avoidant lying: the truth has a consequence that feels overwhelming, and the lie is the path of least immediate resistance. The prefrontal cortex didn't weigh the long-term cost of dishonesty against the short-term relief of avoidance.",
    effect: "Reducing the emotional cost of truth-telling reduces the lying. 'I can handle the truth better than a lie' matters. Making honesty safe matters more than punishing dishonesty.",
  },
  m01: {
    body: "Cortisol is elevated. Your nervous system has been in low-grade alarm since the alarm clock went off. Each repeated instruction adds another spike.",
    brain: "The ADHD prefrontal cortex is weakest in the first 30 minutes of waking. Executive function, impulse control, and emotional regulation are all running below baseline. Medication hasn't kicked in yet.",
    effect: "Each repeated instruction registers as threat in your child's amygdala. They're not ignoring you. Their initiation system genuinely can't fire yet.",
  },
  m02: {
    body: "Your frustration has shifted your nervous system into fight mode. The heat you feel is adrenaline, not anger. Your body is responding to the impasse as though it's a threat.",
    brain: "The ADHD brain has weaker brakes between feeling and action. Frustration built, the brakes didn't hold. Your child's prefrontal cortex, needed for homework, is offline. Your raised voice activated their amygdala and made starting neurologically harder, not easier.",
    effect: "Threat activates the amygdala and shuts down the prefrontal cortex. They're not being defiant. They're flooded. Body-doubling, your calm presence nearby, is often enough to restart an ADHD brain.",
  },
  m03: {
    body: "Your mask just dropped. All day you held it together at work. The social performance drained your regulatory reserves. You're running on empty.",
    brain: "Your child held it together at school too. Their nervous system was suppressing impulses and managing social demands for six hours. When they walk in the door, the suppression releases. Both of you are decompressing at the same time, in the same room.",
    effect: "Two depleted nervous systems in proximity will amplify each other. This collision is structural, not personal. It happens because both ADHD brains spent all day masking.",
  },
  m04: {
    body: "You're exhausted. Your regulatory capacity is at its lowest point of the day. The patience you had at 8am is genuinely gone, not because you're failing but because regulation is a depletable resource.",
    brain: "ADHD sleep is dysregulated. Later sleep onset, more restless sleep, harder to wake. Your child's brain is resisting the transition because transitions require executive function, which is weakest when tired.",
    effect: "Bedtime battles escalate because both nervous systems are operating at minimum capacity. Shorter routines, fewer words, and physical proximity work better than instructions at this hour.",
  },
  m05: {
    body: "You're trapped in an enclosed space with a dysregulated child. Your nervous system is registering this as confinement with a threat. The urge to make it stop is overwhelming.",
    brain: "Sensory input in a car is inescapable. Noise, movement, confinement. The ADHD sensory processing system can't filter any of it out. Your child may be overstimulated. You definitely are.",
    effect: "Pulling over is not defeat. It's the only way to remove the confinement variable. Thirty seconds of silence with the engine off resets more than twenty minutes of verbal management.",
  },
  m06: {
    body: "Your body is in threat mode and your social anxiety system is firing simultaneously. You're managing your child's dysregulation AND the perceived judgment of strangers. That's a double load.",
    brain: "ADHD brains have heightened rejection sensitivity. The perceived judgment of onlookers activates the same neural circuits as actual criticism. You're fighting a real neurological response, not just embarrassment.",
    effect: "The audience changes your response. You're more likely to be harsh, more likely to cave, less likely to do what actually works. Move to a quieter space first. Reduce the audience before you address the behaviour.",
  },
  m07: {
    body: "Your nervous system just joined theirs. Limbic resonance means one dysregulated nervous system entrains the nearby one. You didn't decide to lose it. You were entrained.",
    brain: "The ADHD amygdala fires faster and stronger than neurotypical. The prefrontal cortex, which should provide the pause between feeling and action, is the exact region most impaired by ADHD. The runway between trigger and reaction is neurologically shorter.",
    effect: "Two reactive nervous systems in the same room will always amplify each other. This is the central operating problem of dual-ADHD households and the most underserved by existing advice.",
  },
  m08: {
    body: "Adrenaline is sustaining the argument. Your body has committed to the conflict and stepping away feels physically uncomfortable, like leaving a sentence unfinished.",
    brain: "ADHD brains have a strong drive for cognitive closure. An unresolved argument creates a neurological itch that demands resolution. The impulsivity that keeps you engaging is the same mechanism that makes it hard to leave a conversation mid-thought.",
    effect: "Your child has the same drive. Two ADHD brains seeking closure in an argument will never find it inside the argument. The resolution has to come later, when both systems are regulated.",
  },
  m09: {
    body: "The size of the trigger doesn't match the size of your reaction, and you know it. That mismatch is itself distressing, which adds another layer.",
    brain: "ADHD emotional responses arrive at full intensity with no dimmer switch. The tiny trigger was the last input in a sequence of accumulated load. Your prefrontal cortex couldn't moderate the response because it was already at capacity.",
    effect: "The small thing was never the real trigger. It was the visible surface of invisible accumulated load. The reaction makes sense when you see the full picture.",
  },
  m10: {
    body: "Repeated non-compliance builds a specific kind of frustration. Each repetition increases your arousal. By the fourth ask, your nervous system is primed to escalate.",
    brain: "Your child's working memory may have genuinely lost the instruction between hearing it and acting on it. ADHD working memory holds fewer items and for a shorter duration. They heard you. They couldn't hold it.",
    effect: "Physical proximity and one instruction at a time. Walk to them, make eye contact, give one step. This bypasses the working memory gap.",
  },
  m11: {
    body: "Interrupting hyperfocus feels like pulling someone out of deep sleep. The transition is neurologically jarring for both of you.",
    brain: "Hyperfocus is not a choice. The ADHD default mode network and task-positive network are anti-correlated. When one is locked on, switching off requires significant executive function that may not be available.",
    effect: "Layered warnings work better than sudden interruption. Two minutes, one minute, time's up. Each cue gives the brain a chance to begin the transition internally.",
  },
  m12: {
    body: "Sibling conflict activates a primal protective response. Your nervous system is processing multiple distress signals simultaneously.",
    brain: "Both children may have ADHD-related impulse control difficulties. The conflict escalated because neither child has reliable brakes. You're managing two dysregulated systems with your own dysregulated system.",
    effect: "Separate first, talk later. Physical distance between the siblings is the most reliable immediate intervention. Discussion of fairness comes after regulation, not during.",
  },
  m13: {
    body: "Seeing your child hurt another child triggers a visceral alarm response. The urgency to intervene physically is real and strong.",
    brain: "Physical aggression in ADHD children is usually impulsive, not planned. The prefrontal cortex, which should inhibit the action between the impulse and the hit, didn't fire fast enough.",
    effect: "They need physical separation and calm. They do not need a lecture about why hitting is wrong. They know. Their brakes failed. The repair and the lesson come after regulation.",
  },
  m14: {
    body: "The contrast is confusing and often shameful. If they can hold it together at school, you wonder why they can't at home.",
    brain: "School performance uses the ADHD hyperfocus-under-pressure mechanism. The novelty, social demand, and structure of school provide external regulation. Home has none of that scaffolding. The collapse at home is the cost of performing at school.",
    effect: "This is not a reflection of your parenting. It's a reflection of how much energy your child spent regulating at school. They decompress where they feel safe, which is with you.",
  },
  m15: {
    body: "Your stomach dropped. You can feel the words sitting in the room. The damage is done and your body knows it.",
    brain: "ADHD impulsivity applies to speech as well as action. The words left your mouth before your prefrontal cortex could filter them. This is the verbal equivalent of acting before thinking.",
    effect: "The repair matters more than the mistake. A clean, brief acknowledgment when both of you are calm. Not an extended apology. Not a promise you might not keep. Two sentences and a return to normal.",
  },
  m16: {
    body: "You can feel yourself explaining and you can't stop. The words keep coming even as you watch the child's face close off.",
    brain: "ADHD brains have a strong justice sensitivity and need for cognitive closure. The pull to explain is neurological. Walking away from an unresolved explanation feels almost physically painful.",
    effect: "They stopped hearing you after the first ten seconds. Everything after that was for you, not them. One sentence, then stop. The lesson lands tomorrow, not tonight.",
  },
  m17: {
    body: "The hypocrisy hits your body like shame. You recognise yourself in what you're criticising.",
    brain: "Pattern recognition is strong in ADHD. Seeing your own traits in your child and punishing them for it creates a specific kind of cognitive dissonance that's deeply uncomfortable.",
    effect: "This recognition is actually valuable. It means you understand the mechanism. You can use that understanding to respond with empathy instead of correction.",
  },
  m18: {
    body: "The frustration of replacing, searching, and managing lost items creates a chronic low-level stress that builds over weeks.",
    brain: "Object permanence is weaker in ADHD. Items not in direct line of sight genuinely stop existing in working memory. Your child isn't careless. Their brain stops tracking things that aren't visible.",
    effect: "External systems beat internal reminders. Labels, designated spots, transparent containers. Reduce the demand on working memory instead of asking for more of it.",
  },
  m19: {
    body: "Their emotional reaction to losing is disproportionate. The crying, the rage, the accusation of cheating. Your patience is being tested by what looks like a tantrum over nothing.",
    brain: "ADHD emotional regulation is one of the most consistently impaired functions. Losing triggers not just disappointment but a rejection sensitivity response. They feel exposed as not good enough, which is a much deeper wound than losing a game.",
    effect: "The lesson about sportsmanship is real and worth teaching. It's just not teachable inside the storm. Wait until both systems are calm. Then it lands in two minutes.",
  },
  m20: {
    body: "You're physically present but neurologically elsewhere. The phone provides predictable, controlled, low-demand input that your overwhelmed nervous system finds more manageable than the chaos of family life.",
    brain: "Withdrawal is a form of self-protection. When sensory and emotional load exceeds threshold, the ADHD nervous system sometimes defaults to disengagement rather than escalation.",
    effect: "Your child's nervous system is highly attuned to your availability. When you're present but gone, they may escalate to bring you back. That's not manipulation. That's attachment.",
  },
  p01: {
    body: "The shame is sitting in your chest. Your nervous system is still activated from the incident but now it's turned inward. The rumination feels like accountability but it's consuming the energy you need for repair.",
    brain: "ADHD is linked to heightened rejection sensitivity and a longer emotional hangover. Emotions take longer to return to baseline. The shame spiral isn't self-indulgence. It's your nervous system staying activated long after the event.",
    effect: "The energy going into the spiral is energy not going into the repair. The repair is what actually changes the relationship. Two sentences, delivered when calm.",
  },
  p02: {
    body: "Your chest is tight with recognition. You can feel the echo of your own childhood in what you just did. The body remembers the pattern even when the mind tries to break it.",
    brain: "Parenting behaviour is partly learned through mirror neurons and implicit memory. The scripts your parents used are stored in procedural memory, which fires automatically under stress. Your prefrontal cortex, which would choose a different response, goes offline exactly when you need it most.",
    effect: "Recognising the pattern is the first step out of it. The fact that you noticed means your reflective brain is working. The script ran, but you caught it. That awareness is neurologically meaningful.",
  },
  p03: {
    body: "The warmth you're pouring out right now isn't just love. It's your nervous system trying to undo what just happened. The urgency to fix it is as strong as the impulse that caused it.",
    brain: "After an emotional dysregulation event, ADHD brains often swing to the opposite extreme. The guilt activates a repair drive that's disproportionate to what the child actually needs. You're not just reconnecting. You're asking them to reassure you.",
    effect: "Your child needs a brief, calm acknowledgment, not an emotional flood in the other direction. The over-correction can be confusing for them. They don't know which version of you to trust.",
  },
  p04: {
    body: "You reacted before you could coordinate with your partner. The words were out before you processed that they'd already set a boundary.",
    brain: "ADHD impulsivity applies to disagreement too. Your brain registered something that felt wrong in your partner's approach and responded before the executive function system could weigh the context. The impulse to correct felt more urgent than the need for a united front.",
    effect: "Your child just learned the boundary has a gap. Two adults disagreeing in front of a child about rules gives the child a negotiation opportunity that undermines both of you. Discuss it privately, then present one position.",
  },
  p05: {
    body: "The pressure of your child's distress was more than your nervous system could hold. Giving in felt like relief. The boundary felt less important than stopping the noise.",
    brain: "ADHD brains are more sensitive to immediate emotional pressure than to abstract future consequences. The distress in front of you is neurologically louder than the principle behind the boundary. Caving isn't weakness. It's your brain prioritising the immediate signal.",
    effect: "The child's nervous system just learned that sustained pressure works. This makes the next boundary harder to hold. The repair is re-establishing the boundary later, calmly, not punishing yourself for dropping it.",
  },
  p06: {
    body: "The anger landed on the wrong person. Your partner got what was meant for the situation, or the child, or the day. Your body couldn't hold the frustration any longer and it went sideways.",
    brain: "Emotional dysregulation in ADHD doesn't always hit the source. The prefrontal cortex, which should direct the response accurately, is impaired. The emotion finds the nearest available outlet, which is often the safest relationship in the room.",
    effect: "Your partner absorbs frustration that wasn't theirs. Over time, this erodes the co-parenting relationship. A brief acknowledgment after, 'That wasn't about you. I'm sorry,' prevents the resentment from compounding.",
  },
  p07: {
    body: "The anger arrived hot and fast. The interaction with the teacher or parent triggered your rejection sensitivity. It felt personal before your brain could assess whether it was.",
    brain: "ADHD rejection sensitivity means perceived criticism activates the amygdala at threat level. A teacher's concern about your child can register as an attack on your parenting. The defensive response is neurological, not rational.",
    effect: "The relationship with the school or other parent just took damage that will need repair. A follow-up email or conversation when regulated can recover most of it. They probably weren't attacking you.",
  },
  p08: {
    body: "Something from a previous incident surfaced mid-argument. The old frustration piggybacked on the current one and made everything bigger.",
    brain: "ADHD working memory is unreliable for daily logistics but emotionally significant memories are stored differently. Unresolved emotional incidents stay accessible and get triggered by similar situations. Your brain is pattern-matching across time, not staying in the present.",
    effect: "Your child is now defending against two things: what happened today and whatever you brought with you from last week. They can only process one. Stay in the current moment.",
  },
  p09: {
    body: "The day's stress came home with you. Work, commute, accumulated frustration. Your nervous system arrived at the front door already at capacity. Your child provided the final input that tipped it over.",
    brain: "Regulatory capacity is a depletable resource. The prefrontal cortex has been working all day to manage impulses, social situations, and focus. By evening, there's less capacity available. The reaction to your child is the size of the whole day, not the size of what they did.",
    effect: "Your child received a response that was disproportionate to their behaviour. They don't know about your day. They just know you lost it over something small. Name it: 'I had a hard day and I took it out on you. That wasn't fair.'",
  },
  p10: {
    body: "You've gone quiet. Not as a choice but as a default. Your nervous system has reduced engagement to protect itself from further overload.",
    brain: "When load exceeds threshold, some ADHD nervous systems default to shutdown rather than escalation. The opposite of the reactor pattern, driven by the same mechanism: the regulatory system is overwhelmed.",
    effect: "The shutdown prevents escalation in the short term. What it doesn't do is provide the connection or co-regulation your child needs. A small re-entry signal breaks the pattern.",
  },
  p11: {
    body: "You left the room. Not as a regulated choice but as an escape. The distance between you and the situation feels necessary but the guilt of leaving is already building.",
    brain: "Withdrawal under load is a nervous system protection response. The ADHD brain that defaults to shutdown rather than escalation is avoiding further damage, but it's not providing the connection or repair the situation needs.",
    effect: "Your child experienced your absence as either punishment or abandonment, depending on their attachment style. A brief signal before you leave, 'I need a minute, I'm coming back,' prevents the absence from doing more harm than the presence would have.",
  },
  p12: {
    body: "You saw it happen and chose not to engage. Not from a strategic parenting decision but because intervening felt like more than you could handle right now.",
    brain: "The ADHD executive function system sometimes triages by avoidance. When the cost of engaging feels higher than the cost of ignoring, the brain selects the path with less immediate demand. This isn't laziness. It's a depleted regulatory system choosing self-preservation.",
    effect: "Your child may have needed you in that moment. The gap between what they needed and what you could provide is not a moral failure. It's a capacity issue. Address it when you have the capacity, even if that's tomorrow.",
  },
  p13: {
    body: "You felt the boundary slip and let it go. Enforcing it would have required energy you don't have right now. The path of least resistance won.",
    brain: "Consistent boundary enforcement requires sustained executive function. Each boundary is a decision that depletes the same prefrontal cortex resources used for everything else. By the end of the day, the system doesn't have enough left to hold the line.",
    effect: "Inconsistency is confusing for children, especially ADHD children who need predictable environments to regulate. The fix isn't more willpower. It's fewer boundaries, held more consistently. Pick three that matter and let the rest go deliberately.",
  },
  p14: {
    body: "The guilt is specific and sharp. You forgot something that genuinely mattered to your child. Not because you didn't care. Because it fell out of working memory before you could act.",
    brain: "ADHD working memory holds fewer items for shorter durations. Parenting has an enormous invisible overhead of dates, commitments, routines, consequences. Most of them live in working memory, which is exactly where ADHD is weakest.",
    effect: "One external anchor for one thing is more reliable than promising to remember. Write it where you'll see it. Not on your phone. Physically visible in the space where you'll need it.",
  },
  p15: {
    body: "The form is lost. The date was missed. The appointment forgotten. The familiar sinking feeling of a system that failed again.",
    brain: "ADHD working memory holds fewer items for shorter durations. Paper-based tasks are especially vulnerable because they require remembering something that has no digital reminder, no notification, no prompt. The task exists only in working memory, which is exactly where ADHD is weakest.",
    effect: "External systems beat internal intentions. The fix isn't trying harder to remember. It's reducing the number of things that depend on memory. One photo of the form. One calendar entry made immediately. One physical location for papers.",
  },
  p16: {
    body: "You started helping your child and then you were somewhere else. On your phone, on a thought, on another task. The half-finished help sits between you.",
    brain: "ADHD attention is interest-driven, not importance-driven. The task of helping your child lost the novelty signal partway through, and your attention followed the next interesting input. This isn't a choice. It's the dopamine system selecting for novelty over sustained effort.",
    effect: "Your child experienced being abandoned mid-help. They know you started. They watched you drift. The impact isn't the unfinished task. It's the message: you weren't interesting enough to hold my attention. Name what happened. 'I got distracted. Let me come back to this properly.'",
  },
  p17: {
    body: "The weight of the promise you can't keep is sitting in your stomach. You know the disappointment that's coming and you're dreading it more than they'll experience it.",
    brain: "ADHD brains overcommit because the future feels abstract and the desire to please is immediate. The promise was made by a version of you that didn't account for the executive function cost of following through. The gap between intention and capacity is the core ADHD experience.",
    effect: "Your child learns to expect disappointment. Over time, this erodes trust in your promises. The repair: make fewer promises. Say 'I'd like to' instead of 'I will.' And when you do cancel, acknowledge the impact directly.",
  },
  p18: {
    body: "The medication wore off and the shift was physical. You can feel the regulation leaving your body. The person at work and the person at home are operating on different neurochemistry.",
    brain: "Stimulant medication increases dopamine and norepinephrine availability in the prefrontal cortex. When it wears off, regulatory capacity drops measurably. The rebound period can produce irritability that exceeds the unmedicated baseline. This is pharmacological, not personal.",
    effect: "Your family gets the worst version of your day because of medication timing, not because of how you feel about them. Talk to your prescriber about extended-release options or afternoon boosters if the rebound consistently damages home life.",
  },
  p19: {
    body: "You told your child too much. About your stress, your struggles, your feelings about them or the situation. The relief of sharing was immediate. The regret follows.",
    brain: "ADHD impulsivity includes verbal impulsivity. The filter between thought and speech is thinner. The emotional intensity of the moment made the sharing feel necessary. The executive function that would have assessed 'is this appropriate for a child' was offline.",
    effect: "Your child is now holding something that belongs to you, not them. Children who carry their parent's emotional weight develop anxiety. The repair: 'I told you something that's my problem, not yours. You don't need to worry about it. I'll handle it.'",
  },
  p20: {
    body: "You used your child's ADHD to explain something that was actually about yours. The excuse felt accurate in the moment. The dishonesty is uncomfortable now.",
    brain: "Attribution errors are common in ADHD families. When parent and child share traits, it's easy to project your own executive function failure onto the child's diagnosis. The child's ADHD becomes a convenient explanation for household chaos that your own ADHD contributed to.",
    effect: "Your child absorbs blame that isn't entirely theirs. This distorts their self-concept around their diagnosis. Separate what's yours from what's theirs. Both of you have ADHD. Both of you contribute to the dynamic.",
  },
  p21: {
    body: "Both children needed you at the same time and your system froze. Not a choice to do nothing. A genuine inability to process two competing demands simultaneously.",
    brain: "ADHD executive function is especially impaired under divided-attention conditions. Task-switching between two urgent demands exceeds the available cognitive bandwidth. The freeze is a processing bottleneck, not indifference.",
    effect: "One or both children experienced you as unavailable during a moment of need. The triage: address physical safety first, emotional needs second. You cannot split. Pick one, address it, then move to the other. Name the constraint out loud: 'I can only help one person at a time. I'm coming to you next.'",
  },
};

export const DEFAULT_BRAIN = {
  body: "Your nervous system is activated. Cortisol and adrenaline are influencing how you think and react right now. This is physiology, not a character flaw.",
  brain: "The ADHD prefrontal cortex provides less reliable braking between feeling and action. The gap between trigger and response is neurologically shorter than in a neurotypical brain.",
  effect: "What happened makes sense when you understand how your brain is wired. The reaction isn\'t the problem to solve. The conditions that led to it are.",
};
ENDFILE

echo "  ✓ src/data/activities.js"
cat > 'src/data/activities.js' << 'ENDFILE'
// ADHD Reflect — Activity Mappings
// Which activities match which cards

// Activity types: breathing, grounding, scale, perspective, repair, room-reset, name-pattern
export const CARD_ACTIVITIES = {
  // Moment cards
  m01: ['room-reset', 'breathing', 'scale'],         // Morning battle
  m02: ['breathing', 'perspective', 'room-reset'],     // Homework
  m03: ['breathing', 'grounding', 'scale'],            // After-school collision
  m04: ['breathing', 'room-reset', 'scale'],           // Bedtime
  m05: ['breathing', 'grounding', 'scale'],            // Car journey
  m06: ['breathing', 'grounding', 'perspective'],      // Public meltdown
  m07: ['breathing', 'room-reset', 'name-pattern'],    // Meltdown triggers yours
  m08: ['breathing', 'room-reset', 'name-pattern'],    // Escalation won't stop
  m09: ['scale', 'perspective', 'breathing'],           // Loses it over tiny
  m10: ['room-reset', 'perspective', 'breathing'],      // Won't follow instructions
  m11: ['scale', 'perspective', 'grounding'],           // Hyperfocused won't stop
  m12: ['room-reset', 'breathing', 'scale'],            // Sibling conflict
  m13: ['room-reset', 'breathing', 'grounding'],        // Physical with sibling
  m14: ['grounding', 'perspective', 'scale'],           // Fine at school
  m15: ['repair', 'breathing', 'perspective'],          // Said the damaging thing
  m16: ['breathing', 'name-pattern', 'perspective'],    // Lectured
  m17: ['perspective', 'name-pattern', 'breathing'],    // Too hard for something you do
  m18: ['perspective', 'scale', 'grounding'],           // Keep losing things
  m19: ['scale', 'perspective', 'grounding'],           // Can't handle losing
  m20: ['grounding', 'name-pattern', 'repair'],         // Phone checked out

  // Parent cards
  p01: ['perspective', 'repair', 'breathing'],          // Shame spiral
  p02: ['name-pattern', 'perspective', 'repair'],       // Repeating parents
  p03: ['perspective', 'scale', 'repair'],              // Overcorrecting
  p04: ['breathing', 'perspective', 'repair'],          // Contradicting partner
  p05: ['name-pattern', 'perspective', 'scale'],        // Caving boundary
  p06: ['breathing', 'repair', 'perspective'],          // Snapping partner
  p07: ['breathing', 'perspective', 'repair'],          // Temper at teacher
  p08: ['name-pattern', 'perspective', 'grounding'],    // Dragging old
  p09: ['scale', 'perspective', 'repair'],              // Day's frustration
  p10: ['grounding', 'breathing', 'repair'],            // Shutdown
  p11: ['repair', 'grounding', 'breathing'],            // Leaving
  p12: ['name-pattern', 'grounding', 'perspective'],    // Pretending didn't see
  p13: ['name-pattern', 'scale', 'perspective'],        // Letting go
  p14: ['perspective', 'repair', 'scale'],              // Forgot mattered
  p15: ['perspective', 'grounding', 'scale'],           // Lost paperwork
  p16: ['name-pattern', 'grounding', 'repair'],         // Distracted helping
  p17: ['repair', 'perspective', 'scale'],              // Cancelled promised
  p18: ['grounding', 'scale', 'perspective'],           // Medication timing
  p19: ['perspective', 'repair', 'breathing'],          // Oversharing
  p20: ['name-pattern', 'perspective', 'scale'],        // Kid's ADHD as cover
  p21: ['breathing', 'room-reset', 'grounding'],        // Freezing both kids

  // Kid cards
  k01: ['perspective', 'scale', 'grounding'],           // Losing things
  k02: ['perspective', 'scale', 'grounding'],           // Forgetting things
  k03: ['breathing', 'room-reset', 'grounding'],        // Sensory meltdowns
  k04: ['perspective', 'scale', 'breathing'],            // Won't eat
  k05: ['perspective', 'scale', 'breathing'],            // Can't sit still
  k06: ['room-reset', 'breathing', 'scale'],             // Impulsive physical
  k07: ['perspective', 'repair', 'scale'],               // Failure sensitivity
  k08: ['perspective', 'grounding', 'breathing'],        // School refusal
  k09: ['perspective', 'repair', 'breathing'],           // Wrong thing wrong time
  k10: ['perspective', 'scale', 'name-pattern'],         // Lying
};

// Pattern names for the name-pattern activity
export const PATTERN_NAMES = {
  m07: { name: 'The Reactor Loop', desc: 'Your nervous system joined theirs. Limbic resonance. You know this one.' },
  m08: { name: 'The Closure Trap', desc: 'Both brains need resolution. The argument format can never provide it.' },
  m16: { name: 'The Lecture Loop', desc: 'You needed them to understand. They stopped hearing after ten seconds.' },
  m17: { name: 'The Mirror', desc: 'You see yourself in what you are criticising. That recognition is the way out.' },
  m20: { name: 'The Withdrawal', desc: 'You checked out because checking back in felt like more than you had.' },
  p01: { name: 'The Shame Spiral', desc: 'Rumination that feels like accountability but consumes the energy you need for repair.' },
  p02: { name: 'The Inheritance', desc: 'Your parents\' scripts firing on autopilot. You caught it. That is the break in the cycle.' },
  p05: { name: 'The Cave', desc: 'Immediate pressure beat the abstract principle. Your brain chose the louder signal.' },
  p08: { name: 'The Archive', desc: 'Old emotional data surfacing uninvited. Your brain pattern-matched across time.' },
  p10: { name: 'The Shutdown', desc: 'Nervous system protection. Disengagement as a survival response, not a choice.' },
  p12: { name: 'The Blind Spot', desc: 'Avoidance disguised as not noticing. Your brain triaged by ignoring.' },
  p13: { name: 'The Let-Go', desc: 'Boundary enforcement costs executive function. You ran out.' },
  p16: { name: 'The Drift', desc: 'Attention followed novelty away from your child. Not a choice. A dopamine redirect.' },
  p20: { name: 'The Cover', desc: 'Your ADHD hiding behind theirs. Both are real. Both need separating.' },
  k10: { name: 'The Escape Route', desc: 'Truth had a consequence that felt overwhelming. The lie was the path of least resistance.' },
};

ENDFILE

echo "  ✓ src/components/CardViewer.jsx"
cat > 'src/components/CardViewer.jsx' << 'ENDFILE'
import { useState, useRef, useEffect } from 'react';
import BreathingExercise from './BreathingExercise.jsx';
import { GroundingExercise, ScaleExercise, PerspectiveShift, RepairScript, RoomReset, NameThePattern } from './Activities.jsx';

function renderMarkdown(md) {
  if (!md) return '';
  return md
    .replace(/^---$/gm, '<hr/>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+?)\*/g, '<em>$1</em>')
    .split('\n\n')
    .map(block => {
      block = block.trim();
      if (!block) return '';
      if (block.startsWith('<hr')) return block;
      return '<p>' + block.replace(/\n/g, '<br/>') + '</p>';
    })
    .join('');
}

const TABS = {
  now:  { label: 'right now',     bg: '#EEE8D8', accent: '#B85038' },
  why:  { label: 'understand it', bg: '#E4EBE3', accent: '#4B6B4E' },
  kid:  { label: 'your kid',      bg: '#E2E8EF', accent: '#3F6178' },
};

const ink = '#191714', ink2 = '#6B6358', ink3 = '#A09589';

// Card imagery - abstract SVG patterns matched to card themes
function CardImagery({ cardType, accentColor }) {
  const patterns = {
    moment: (
      <svg width="100%" height="80" viewBox="0 0 400 80" preserveAspectRatio="none">
        <defs>
          <linearGradient id="grd" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={accentColor} stopOpacity="0.06"/>
            <stop offset="0.5" stopColor={accentColor} stopOpacity="0.12"/>
            <stop offset="1" stopColor={accentColor} stopOpacity="0.03"/>
          </linearGradient>
        </defs>
        <path d="M0,60 Q100,20 200,45 Q300,70 400,30 L400,80 L0,80Z" fill="url(#grd)"/>
        <circle cx="320" cy="25" r="3" fill={accentColor} opacity="0.15"/>
        <circle cx="80" cy="35" r="2" fill={accentColor} opacity="0.1"/>
        <circle cx="200" cy="20" r="4" fill={accentColor} opacity="0.08"/>
      </svg>
    ),
    parent: (
      <svg width="100%" height="80" viewBox="0 0 400 80" preserveAspectRatio="none">
        <defs>
          <linearGradient id="grd2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9B8BB4" stopOpacity="0.08"/>
            <stop offset="1" stopColor="#9B8BB4" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <rect width="400" height="80" fill="url(#grd2)"/>
        <line x1="40" y1="60" x2="360" y2="60" stroke="#9B8BB4" strokeWidth="0.5" opacity="0.15"/>
        <circle cx="200" cy="35" r="20" fill="none" stroke="#9B8BB4" strokeWidth="0.5" opacity="0.12"/>
        <circle cx="200" cy="35" r="10" fill="none" stroke="#9B8BB4" strokeWidth="0.5" opacity="0.08"/>
      </svg>
    ),
    kid: (
      <svg width="100%" height="80" viewBox="0 0 400 80" preserveAspectRatio="none">
        <defs>
          <linearGradient id="grd3" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#A8C3A0" stopOpacity="0.06"/>
            <stop offset="1" stopColor="#A8C3A0" stopOpacity="0.12"/>
          </linearGradient>
        </defs>
        <rect width="400" height="80" fill="url(#grd3)" rx="0"/>
        <path d="M0,65 Q50,55 100,62 Q150,69 200,60 Q250,51 300,58 Q350,65 400,55" fill="none" stroke="#A8C3A0" strokeWidth="1" opacity="0.15"/>
      </svg>
    ),
  };
  return <div style={{ marginBottom: -8, opacity: 0.9 }}>{patterns[cardType] || patterns.moment}</div>;
}

function ActivityRenderer({ type, accentColor, patternData }) {
  switch (type) {
    case 'breathing': return <BreathingExercise accentColor={accentColor} />;
    case 'grounding': return <GroundingExercise accentColor={accentColor} />;
    case 'scale': return <ScaleExercise accentColor={accentColor} />;
    case 'perspective': return <PerspectiveShift accentColor={accentColor} />;
    case 'repair': return <RepairScript accentColor={accentColor} />;
    case 'room-reset': return <RoomReset accentColor={accentColor} />;
    case 'name-pattern': return <NameThePattern accentColor={accentColor} patternName={patternData?.name} patternDescription={patternData?.desc} />;
    default: return null;
  }
}

const ACTIVITY_LABELS = {
  'breathing': 'breathe', 'grounding': 'ground', 'scale': 'scale it',
  'perspective': 'shift', 'repair': 'repair', 'room-reset': 'reset',
  'name-pattern': 'name it',
};

function BrainBlock({ label, text, accentColor }) {
  return (
    <div style={{
      background: 'rgba(25,23,20,0.045)', borderRadius: 14, padding: '18px 20px', marginBottom: 12,
    }}>
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
        textTransform: 'lowercase', color: accentColor, marginBottom: 10,
      }}>{label}</div>
      <p style={{
        fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 16, "wght" 400',
        fontSize: 16, lineHeight: 1.65, color: ink2, margin: 0,
      }}>{text}</p>
    </div>
  );
}

function ExpandSection({ label, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(!open)} style={{
        appearance: 'none', border: 0, borderTop: '1px solid rgba(25,23,20,0.08)',
        background: 'transparent', width: '100%', padding: '17px 0',
        display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left',
        fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.09em',
        textTransform: 'lowercase', color: open ? ink2 : ink3,
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          style={{ flexShrink: 0, transition: 'transform 300ms ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
        {label}
      </button>
      <div style={{
        overflow: 'hidden', maxHeight: open ? 1200 : 0, opacity: open ? 1 : 0,
        transition: 'max-height 420ms cubic-bezier(.4,0,.2,1), opacity 280ms ease',
      }}>
        <div style={{ paddingBottom: 24 }}>{children}</div>
      </div>
    </div>
  );
}

export default function CardViewer({ cardId, cardType, title, parentNow, kidNow, content, relatedGuides, brainProcess, activities, patternData }) {
  const isMoment = cardType === 'moment';
  const hasKid = isMoment && kidNow;
  const brain = brainProcess || null;
  const cardActivities = activities || ['breathing'];

  const availableTabs = ['now', 'why'];
  if (hasKid) availableTabs.push('kid');

  const [activeTab, setActiveTab] = useState('now');
  const [activeActivity, setActiveActivity] = useState(0);
  const tabsRef = useRef(null);
  const [barStyle, setBarStyle] = useState({});
  const currentTab = TABS[activeTab];

  useEffect(() => {
    if (!tabsRef.current) return;
    const btns = tabsRef.current.querySelectorAll('[data-tab]');
    const idx = availableTabs.indexOf(activeTab);
    if (btns[idx]) {
      const btn = btns[idx];
      const container = tabsRef.current;
      setBarStyle({
        transform: 'translateX(' + (btn.offsetLeft - container.offsetLeft) + 'px)',
        width: btn.offsetWidth + 'px',
        background: currentTab.accent,
      });
    }
  }, [activeTab]);

  const mainContent = parentNow || content || '';
  const typeLabel = { moment: 'moment', parent: 'parent', kid: 'kid' }[cardType];

  return (
    <>
      <style>{`
        @keyframes pulse-live { 0% { box-shadow: 0 0 0 0 rgba(75,107,78,0.6); } 60% { box-shadow: 0 0 0 7px rgba(75,107,78,0); } 100% { box-shadow: 0 0 0 0 rgba(75,107,78,0); } }
        @keyframes panel-in { from { opacity: 0; } to { opacity: 1; } }
        .calming-shell { transition: background 360ms ease; }
        .calming-panel { animation: panel-in 260ms ease both; }
        .calming-content p { font-variation-settings: "opsz" 16, "wght" 380; font-size: 16px; line-height: 1.68; color: ${ink2}; margin-bottom: 14px; }
        .calming-content p:last-child { margin-bottom: 0; }
        .calming-content strong { font-variation-settings: "opsz" 16, "wght" 580; color: ${ink}; }
        .calming-content hr { border: none; border-top: 1px solid rgba(25,23,20,0.07); margin: 20px 0; }
      `}</style>

      <div className="calming-shell" style={{
        width: '100%', maxWidth: 430, margin: '0 auto',
        minHeight: '80dvh', display: 'flex', flexDirection: 'column',
        background: currentTab.bg,
        borderRadius: typeof window !== 'undefined' && window.innerWidth >= 700 ? 32 : 0,
        overflow: 'hidden',
      }}>
        {/* Chrome */}
        <div style={{ padding: '22px 26px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <a href="/" style={{
            fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.07em',
            color: ink2, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 6l-6 6 6 6"/></svg>
            back
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.05em', color: ink3 }}>
            matched
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4B6B4E', animation: 'pulse-live 2.8s ease-out infinite' }}/>
          </div>
        </div>

        {/* Imagery */}
        <CardImagery cardType={cardType} accentColor={currentTab.accent} />

        {/* Title */}
        <div style={{ padding: '0 26px', flexShrink: 0 }}>
          <div style={{
            fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 18, "wght" 440',
            fontSize: 18, letterSpacing: '-0.01em', color: ink, lineHeight: 1.2,
          }}>{title}</div>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em',
            color: ink3, textTransform: 'lowercase', marginTop: 3,
          }}>{typeLabel}</div>
        </div>

        {/* Tabs */}
        <div ref={tabsRef} style={{
          padding: '16px 26px 0', display: 'grid',
          gridTemplateColumns: 'repeat(' + availableTabs.length + ', 1fr)',
          borderBottom: '1px solid rgba(25,23,20,0.12)', position: 'relative', flexShrink: 0,
        }}>
          {availableTabs.map(key => (
            <button key={key} data-tab={key} onClick={() => setActiveTab(key)}
              style={{
                appearance: 'none', border: 0, background: 'transparent',
                fontFamily: 'var(--serif)', fontSize: 15, letterSpacing: '-0.01em',
                fontVariationSettings: activeTab === key ? '"opsz" 14, "wght" 600' : '"opsz" 14, "wght" 360',
                color: activeTab === key ? ink : ink3,
                padding: '0 0 13px', cursor: 'pointer', textAlign: 'left',
                transition: 'color 200ms ease',
              }}>{TABS[key].label}</button>
          ))}
          <span style={{
            position: 'absolute', bottom: -1, height: 2.5, borderRadius: 2,
            transition: 'transform 300ms cubic-bezier(.3,.8,.3,1), width 300ms cubic-bezier(.3,.8,.3,1), background 300ms ease',
            ...barStyle,
          }}/>
        </div>

        {/* Panel */}
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <div key={activeTab} className="calming-panel" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>

            {/* RIGHT NOW */}
            {activeTab === 'now' && (
              <div style={{ padding: '28px 26px 30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.24em',
                  textTransform: 'uppercase', color: currentTab.accent, marginBottom: 14,
                }}>what to do right now</div>

                <div className="calming-content" style={{ flex: 0 }}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(mainContent) }}
                />

                {/* Activity selector */}
                <div style={{
                  borderTop: '1px solid rgba(25,23,20,0.08)',
                  marginTop: 20, paddingTop: 20,
                }}>
                  <div style={{
                    fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
                    textTransform: 'lowercase', color: ink3, marginBottom: 12,
                  }}>try this</div>

                  {/* Activity pills */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                    {cardActivities.map((act, i) => (
                      <button key={act} onClick={() => setActiveActivity(i)}
                        style={{
                          appearance: 'none', cursor: 'pointer',
                          padding: '7px 14px', borderRadius: 100,
                          border: activeActivity === i ? '1.5px solid ' + currentTab.accent : '1.5px solid rgba(25,23,20,0.08)',
                          background: activeActivity === i ? currentTab.accent + '12' : 'transparent',
                          color: activeActivity === i ? currentTab.accent : ink3,
                          fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.06em',
                          transition: 'all 0.15s ease',
                        }}>{ACTIVITY_LABELS[act] || act}</button>
                    ))}
                  </div>

                  {/* Active activity */}
                  <div key={cardActivities[activeActivity]}>
                    <ActivityRenderer
                      type={cardActivities[activeActivity]}
                      accentColor={currentTab.accent}
                      patternData={patternData}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* UNDERSTAND IT */}
            {activeTab === 'why' && (
              <div style={{ padding: '28px 26px 30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.24em',
                  textTransform: 'uppercase', color: currentTab.accent, marginBottom: 20,
                }}>what your brain just did</div>

                {brain && (
                  <>
                    <BrainBlock label="your body" text={brain.body} accentColor={currentTab.accent} />
                    <BrainBlock label="your brain" text={brain.brain} accentColor={currentTab.accent} />
                    <BrainBlock label="what this did" text={brain.effect} accentColor={currentTab.accent} />
                  </>
                )}

                <a href={'/guides/' + cardId} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 13,
                  background: 'rgba(75,107,78,0.08)', borderRadius: 14, padding: '17px 18px',
                  marginTop: 20, textDecoration: 'none', color: ink,
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: currentTab.accent, flexShrink: 0, marginTop: 7 }}/>
                  <span>
                    <span style={{ fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 16, "wght" 480', fontSize: 15, display: 'block', color: ink }}>Go deeper</span>
                    <span style={{ fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 14, "wght" 360', fontSize: 13, color: ink3 }}>Full guide with strategies for next time</span>
                  </span>
                </a>

                {relatedGuides && relatedGuides.length > 1 && (
                  <ExpandSection label="related guides">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {relatedGuides.slice(1).map(g => (
                        <a key={g.id} href={'/guides/' + g.id} style={{
                          padding: '14px 0', borderBottom: '1px solid rgba(25,23,20,0.07)',
                          textDecoration: 'none', fontFamily: 'var(--serif)',
                          fontVariationSettings: '"opsz" 16, "wght" 380',
                          fontSize: 15, lineHeight: 1.45, color: ink2,
                        }}>{g.title}</a>
                      ))}
                    </div>
                  </ExpandSection>
                )}
              </div>
            )}

            {/* YOUR KID */}
            {activeTab === 'kid' && (
              <div style={{ padding: '28px 26px 30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  width: 58, height: 58, borderRadius: 17,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(63,97,120,0.1)', marginBottom: 26,
                }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={currentTab.accent} strokeWidth="1.5" strokeLinecap="round">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  </svg>
                </div>
                <div style={{
                  fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 28, "wght" 460',
                  fontSize: 22, lineHeight: 1.34, color: ink, marginBottom: 20,
                }}>
                  What your <strong style={{ color: currentTab.accent, fontVariationSettings: '"opsz" 28, "wght" 700' }}>kid</strong> is experiencing right now.
                </div>
                <div className="calming-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(kidNow || '') }} />
              </div>
            )}
          </div>
        </div>

        <div style={{
          padding: '12px 26px 20px', flexShrink: 0, textAlign: 'center',
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.08em', color: ink3,
        }}>
          not medical advice &middot; <a href="/legal/safety" style={{ color: ink3 }}>crisis support</a>
        </div>
      </div>
    </>
  );
}

ENDFILE

echo "  ✓ src/pages/cards/[id].astro"
cat > 'src/pages/cards/[id].astro' << 'ENDFILE'
---
import Base from '../../layouts/Base.astro';
import { CARDS } from '../../data/cards.js';
import { CARD_RIGHT_NOW } from '../../data/cardRightNow.js';
import { CARD_TO_GUIDES } from '../../data/mappings.js';
import { BRAIN_PROCESS, DEFAULT_BRAIN } from '../../data/brainProcess.js';
import { CARD_ACTIVITIES, PATTERN_NAMES } from '../../data/activities.js';

export function getStaticPaths() {
  return CARDS.map(card => ({
    params: { id: card.id },
    props: { card },
  }));
}

const { card } = Astro.props;
const content = CARD_RIGHT_NOW[card.id] || {};
const brain = BRAIN_PROCESS[card.id] || DEFAULT_BRAIN;
const activities = CARD_ACTIVITIES[card.id] || ['breathing'];
const patternData = PATTERN_NAMES[card.id] || null;

const guideIds = CARD_TO_GUIDES[card.id] || [card.id];
const cardsMap = Object.fromEntries(CARDS.map(c => [c.id, c]));
const relatedGuides = guideIds.filter(id => cardsMap[id]).map(id => ({ id, title: cardsMap[id].title }));
---
<Base title={card.title} description={`ADHD Reflect: ${card.title}`}>

  <div id="card-viewer-root"
    data-card-id={card.id}
    data-card-type={card.type}
    data-card-title={card.title}
  ></div>

  <script id="pn-data" type="application/json" set:html={JSON.stringify(content.parentNow || '')} />
  <script id="kn-data" type="application/json" set:html={JSON.stringify(content.kidNow || '')} />
  <script id="cn-data" type="application/json" set:html={JSON.stringify(content.content || '')} />
  <script id="rg-data" type="application/json" set:html={JSON.stringify(relatedGuides)} />
  <script id="bp-data" type="application/json" set:html={JSON.stringify(brain)} />
  <script id="ac-data" type="application/json" set:html={JSON.stringify(activities)} />
  <script id="pd-data" type="application/json" set:html={JSON.stringify(patternData)} />

  <script>
    import { createElement } from 'react';
    import { createRoot } from 'react-dom/client';
    import CardViewer from '../../components/CardViewer.jsx';

    const el = document.getElementById('card-viewer-root');
    const parentNow = JSON.parse(document.getElementById('pn-data').textContent);
    const kidNow = JSON.parse(document.getElementById('kn-data').textContent);
    const content = JSON.parse(document.getElementById('cn-data').textContent);
    const relatedGuides = JSON.parse(document.getElementById('rg-data').textContent);
    const brainProcess = JSON.parse(document.getElementById('bp-data').textContent);
    const activities = JSON.parse(document.getElementById('ac-data').textContent);
    const patternData = JSON.parse(document.getElementById('pd-data').textContent);

    const root = createRoot(el);
    root.render(createElement(CardViewer, {
      cardId: el.dataset.cardId,
      cardType: el.dataset.cardType,
      title: el.dataset.cardTitle,
      parentNow, kidNow, content, relatedGuides, brainProcess, activities, patternData,
    }));
  </script>

</Base>

ENDFILE

echo "  ✓ src/components/GuideViewer.jsx"
cat > 'src/components/GuideViewer.jsx' << 'ENDFILE'
import { useState } from 'react';

function renderMarkdown(md) {
  if (!md) return '';
  let html = md
    .replace(/^---$/gm, '<hr/>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+?)\*/g, '<em>$1</em>')
    .split('\n\n')
    .map(block => {
      block = block.trim();
      if (!block) return '';
      if (block.startsWith('<hr')) return block;
      return `<p>${block.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('');
  return html;
}

export default function GuideViewer({ cardId, cardType, title, parentGuide, kidGuide, content }) {
  const isMoment = cardType === 'moment';
  
  const tabs = [];
  const tabContent = {};
  
  if (isMoment && parentGuide) {
    tabs.push({ key: 'parent', label: 'What you need to know', accent: '#7FA88E' });
    if (kidGuide) {
      tabs.push({ key: 'kid', label: "What your kid is experiencing", accent: '#9B8BB4' });
    }
    tabContent.parent = parentGuide;
    tabContent.kid = kidGuide || '';
  } else if (content) {
    tabs.push({ key: 'parent', label: 'Guide', accent: '#7FA88E' });
    tabContent.parent = content;
  }
  
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || 'parent');
  const typeColor = { moment: '#4A6FA5', parent: '#9B8BB4', kid: '#A8C3A0' }[cardType];
  const typeLabel = { moment: 'Guide', parent: 'Guide', kid: 'Guide' }[cardType];

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 96px' }}>
      {/* Header */}
      <div style={{ paddingTop: 40, marginBottom: 24 }}>
        <a href={`/cards/${cardId}`} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--blue)',
          textDecoration: 'none', marginBottom: 16,
        }}>
          ← Back to the moment
        </a>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: '#7FA88E',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7FA88E' }} />
            {typeLabel}
          </span>
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontSize: 'clamp(24px, 4vw, 34px)',
          fontWeight: 300, lineHeight: 1.2, color: 'var(--slate)',
          fontVariationSettings: '"opsz" 40', marginBottom: 0,
        }}>
          {title}
        </h1>
      </div>

      {/* Tabs */}
      {tabs.length > 1 && (
        <div style={{
          display: 'flex', gap: 4, marginBottom: 24,
          background: 'rgba(31,42,55,0.04)', borderRadius: 10, padding: 3,
        }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1, padding: '9px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500,
                background: activeTab === tab.key ? 'white' : 'transparent',
                color: activeTab === tab.key ? tab.accent : 'var(--pewter)',
                boxShadow: activeTab === tab.key ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease', minHeight: 40,
              }}
            >{tab.label}</button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="guide-content"
        style={{ lineHeight: 1.7 }}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(tabContent[activeTab] || '') }}
      />

      {/* Back to card */}
      <a href={`/cards/${cardId}`}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 32, padding: '14px 18px', background: 'rgba(74,111,165,0.04)', borderRadius: 12,
          border: '1px solid rgba(74,111,165,0.08)', textDecoration: 'none', color: 'var(--slate)',
          fontFamily: 'var(--sans)', fontSize: 15,
        }}
      >
        <span>
          <span style={{ fontWeight: 500 }}>Back to the moment</span><br/>
          <span style={{ fontSize: 13, color: 'var(--pewter)' }}>See the "right now" version</span>
        </span>
        <span style={{ color: 'var(--blue)', fontSize: 18 }}>←</span>
      </a>

      {/* Support CTA */}
      <div style={{
        marginTop: 24, padding: 18, background: 'var(--mist)', borderRadius: 12,
        fontSize: 14, lineHeight: 1.6, color: 'var(--pewter)',
      }}>
        If this pattern keeps happening, <a href="/resources" style={{ color: 'var(--blue)' }}>support options</a> may help.
      </div>

      <p style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--pewter)', opacity: 0.4, marginTop: 24 }}>
        Not medical advice. <a href="/legal/safety" style={{ color: 'var(--pewter)' }}>Crisis support</a>
      </p>
    </div>
  );
}

ENDFILE

echo "  ✓ src/pages/guides/[id].astro"
cat > 'src/pages/guides/[id].astro' << 'ENDFILE'
---
import Base from '../../layouts/Base.astro';
import { CARDS } from '../../data/cards.js';
import { GUIDE_CONTENT } from '../../data/guideContent.js';

export function getStaticPaths() {
  return CARDS.map(card => ({
    params: { id: card.id },
    props: { card },
  }));
}

const { card } = Astro.props;
const content = GUIDE_CONTENT[card.id] || {};
---
<Base title={`${card.title} — Guide`} description={`Understand why this happens: ${card.title}`}>

  <div id="guide-viewer-root"
    data-card-id={card.id}
    data-card-type={card.type}
    data-card-title={card.title}
  ></div>

  <script id="pg-data" type="application/json" set:html={JSON.stringify(content.parentGuide || '')} />
  <script id="kg-data" type="application/json" set:html={JSON.stringify(content.kidGuide || '')} />
  <script id="gc-data" type="application/json" set:html={JSON.stringify(content.content || '')} />

  <script>
    import { createElement } from 'react';
    import { createRoot } from 'react-dom/client';
    import GuideViewer from '../../components/GuideViewer.jsx';

    const el = document.getElementById('guide-viewer-root');
    const parentGuide = JSON.parse(document.getElementById('pg-data').textContent);
    const kidGuide = JSON.parse(document.getElementById('kg-data').textContent);
    const guideContent = JSON.parse(document.getElementById('gc-data').textContent);

    const root = createRoot(el);
    root.render(createElement(GuideViewer, {
      cardId: el.dataset.cardId,
      cardType: el.dataset.cardType,
      title: el.dataset.cardTitle,
      parentGuide,
      kidGuide,
      content: guideContent,
    }));
  </script>

</Base>

<style is:global>
  .guide-content p {
    font-size: 17px; line-height: 1.7; color: #6B6358; margin-bottom: 18px; max-width: 60ch;
  }
  .guide-content p:last-child { margin-bottom: 0; }
  .guide-content strong { color: #191714; font-weight: 600; }
  .guide-content em { font-style: italic; color: #191714; }
  .guide-content hr { border: none; border-top: 1px solid rgba(25,23,20,0.08); margin: 28px 0; }
</style>

ENDFILE

echo "  ✓ src/pages/guides/index.astro"
cat > 'src/pages/guides/index.astro' << 'ENDFILE'
---
import Base from '../../layouts/Base.astro';
import CardBrowser from '../../components/CardBrowser.jsx';
---
<Base title="Guides" description="Research-backed guides for understanding ADHD parenting patterns." current="guides">

  <section class="guides-hero">
    <div class="guides-hero-inner">
      <p class="guides-label">Guide library</p>
      <h1 class="guides-title">Understand what's <em>happening</em></h1>
      <p class="guides-body">Research-backed guides for when you have the space to go deeper. Understand why these moments keep happening and what you can do differently next time.</p>
    </div>
  </section>

  <div id="guide-browser-root"></div>

  <script>
    import { createElement } from 'react';
    import { createRoot } from 'react-dom/client';
    import CardBrowser from '../../components/CardBrowser.jsx';

    const root = createRoot(document.getElementById('guide-browser-root'));
    root.render(createElement(CardBrowser, { linkPrefix: '/guides/' }));
  </script>

</Base>

<style>
  .guides-hero { padding: 64px 0 32px; }
  .guides-hero-inner { max-width: 960px; margin: 0 auto; padding: 0 24px; }
  .guides-label {
    font-family: var(--mono); font-size: 10px; letter-spacing: 0.22em;
    text-transform: uppercase; color: var(--sage-dark); margin-bottom: 12px;
  }
  .guides-title {
    font-family: var(--serif); font-size: clamp(28px, 4vw, 40px); font-weight: 300;
    line-height: 1.15; color: var(--slate); margin-bottom: 16px; font-variation-settings: 'opsz' 48;
  }
  .guides-title em { font-style: italic; color: var(--sage-dark); }
  .guides-body { font-size: 17px; line-height: 1.6; color: var(--pewter); max-width: 520px; }
</style>

ENDFILE

echo "  ✓ src/components/CardBrowser.jsx"
cat > 'src/components/CardBrowser.jsx' << 'ENDFILE'
import { useState } from 'react';
import { CARDS, CARD_TYPES } from '../data/cards.js';

const typeFilters = [
  { key: 'all', label: 'All guides' },
  { key: 'moment', label: 'Moment', color: '#4A6FA5' },
  { key: 'parent', label: 'Parent', color: '#9B8BB4' },
  { key: 'kid', label: 'Kid', color: '#A8C3A0' },
];

export default function CardBrowser({ linkPrefix = '/guides/' }) {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? CARDS : CARDS.filter(c => c.type === filter);

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {typeFilters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 100,
              border: filter === f.key ? '1.5px solid var(--slate)' : '1.5px solid rgba(31,42,55,0.08)',
              background: filter === f.key ? 'var(--slate)' : 'white',
              color: filter === f.key ? 'white' : 'var(--pewter)',
              fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.18s', whiteSpace: 'nowrap',
            }}
          >
            {f.color && (
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: f.color, display: 'inline-block' }} />
            )}
            {f.label}
          </button>
        ))}
      </div>

      {/* Count */}
      <p style={{
        fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.12em',
        color: 'var(--pewter)', opacity: 0.7, marginBottom: 20,
      }}>
        {filtered.length} guide{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Card grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16, paddingBottom: 80,
      }}>
        {filtered.map(card => (
          <a
            key={card.id}
            href={`${linkPrefix}${card.id}`}
            style={{
              background: 'white', borderRadius: 16,
              border: '1px solid rgba(31,42,55,0.08)',
              padding: 24, display: 'flex', flexDirection: 'column', gap: 10,
              transition: 'box-shadow 0.2s, transform 0.2s',
              cursor: 'pointer', textDecoration: 'none', color: 'inherit',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 24px rgba(31,42,55,0.09)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
          >
            {/* Type badge */}
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: CARD_TYPES[card.type].color,
              alignSelf: 'flex-start',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: CARD_TYPES[card.type].color }} />
              {CARD_TYPES[card.type].label}
            </span>

            {/* Title */}
            <h3 style={{
              fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 400,
              lineHeight: 1.35, color: 'var(--slate)', margin: 0,
              fontVariationSettings: '"opsz" 24',
            }}>
              {card.title}
            </h3>

            {/* Category */}
            <span style={{
              fontSize: 13, color: 'var(--pewter)', opacity: 0.6,
              textTransform: 'capitalize',
            }}>
              {card.category.replace(/-/g, ' ')}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

ENDFILE

echo "  ✓ src/components/Nav.astro"
cat > 'src/components/Nav.astro' << 'ENDFILE'
---
import Logo from './Logo.astro';

interface Props {
  current?: string;
}
const { current = '' } = Astro.props;
---
<nav class="nav">
  <div class="nav-inner">
    <Logo />
    <ul class="nav-links" role="list">
      <li><a href="/guides" class:list={[{ active: current === 'guides' }]}>Guides</a></li>
      <li><a href="/resources" class:list={[{ active: current === 'resources' }]}>Resources</a></li>
      <li><a href="/about" class:list={[{ active: current === 'about' }]}>About</a></li>
    </ul>
    <button class="nav-mobile-btn" aria-label="Menu" aria-expanded="false">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.5">
        <line x1="3" y1="7" x2="19" y2="7"/>
        <line x1="3" y1="15" x2="19" y2="15"/>
      </svg>
    </button>
  </div>
</nav>

<!-- Mobile menu overlay -->
<div class="nav-mobile-menu" aria-hidden="true">
  <div class="nav-mobile-menu-inner">
    <a href="/guides">Guides</a>
    <a href="/resources">Resources</a>
    <a href="/about">About</a>
  </div>
</div>

<style>
  .nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(247,245,240,0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--mist-border);
  }
  .nav-inner {
    max-width: var(--container-wide);
    margin: 0 auto;
    padding: 14px var(--page-pad);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .nav-links {
    display: flex;
    gap: 32px;
    list-style: none;
  }
  .nav-links a {
    font-family: var(--sans);
    font-size: 14px;
    font-weight: 400;
    color: var(--pewter);
    text-decoration: none;
    transition: color var(--duration-fast) ease;
  }
  .nav-links a:hover,
  .nav-links a.active {
    color: var(--slate);
  }
  .nav-mobile-btn {
    display: none;
    background: none;
    border: none;
    color: var(--slate);
    cursor: pointer;
    padding: 8px;
    min-height: 44px;
    min-width: 44px;
    align-items: center;
    justify-content: center;
  }

  /* Mobile menu overlay */
  .nav-mobile-menu {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 99;
    background: rgba(247,245,240,0.97);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
  .nav-mobile-menu[aria-hidden="false"] {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .nav-mobile-menu-inner {
    display: flex;
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }
  .nav-mobile-menu-inner a {
    font-family: var(--serif);
    font-size: 28px;
    font-weight: 300;
    color: var(--slate);
    text-decoration: none;
    font-variation-settings: 'opsz' 36;
  }

  @media (max-width: 640px) {
    .nav-links { display: none; }
    .nav-mobile-btn { display: flex; }
  }
</style>

<script>
  const btn = document.querySelector('.nav-mobile-btn');
  const menu = document.querySelector('.nav-mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      const open = menu.getAttribute('aria-hidden') === 'false';
      menu.setAttribute('aria-hidden', open ? 'true' : 'false');
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.setAttribute('aria-hidden', 'true');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }
</script>

ENDFILE

echo "  ✓ functions/api/match.js"
cat > 'functions/api/match.js' << 'ENDFILE'
// ADHD Reflect — AI Router
// Cloudflare Pages Function
// Matches parent input to the right card via Claude Haiku

const CARD_LIST = `
MOMENT CARDS:
m01: The morning getting ready battle
m02: The homework explosion
m03: The after-school collision — their decompression meets your mask drop
m04: The bedtime battle
m05: The car journey meltdown
m06: The public meltdown
m07: When their meltdown triggers yours
m08: When the escalation won't stop and neither of you can
m09: When they lose it over something tiny
m10: When they won't follow instructions or seem to be ignoring you
m11: When they're hyperfocused and won't stop
m12: When sibling conflict explodes
m13: When they get physical with their sibling
m14: Fine at school, falling apart at home
m15: When you said the thing that caused real damage
m16: When you lectured instead of stopping
m17: When you were too hard on your kid for something you do yourself
m18: When they keep losing or forgetting things
m19: When they can't handle losing
m20: When you checked your phone and they acted out to get you back

PARENT-ONLY CARDS:
p01: The shame spiral after losing it
p02: Repeating your own parents' behaviour
p03: Overcorrecting with affection right after losing it
p04: Contradicting your partner in front of the kids
p05: Caving on a boundary your partner just set
p06: Snapping at your partner when it was really about your kid
p07: Losing your temper at a teacher or another parent
p08: Dragging something old into a new moment
p09: Taking the day's frustration out on your kid
p10: Shutting down and going cold
p11: Leaving when you should have stayed
p12: Pretending you didn't see what happened
p13: Letting something go you knew you shouldn't
p14: Forgetting something that genuinely mattered to your kid
p15: Losing the paperwork, the date, the appointment
p16: Starting to help and getting distracted before you finished
p17: Cancelling something you'd promised because you got overwhelmed
p18: Medication timing making home worse than work
p19: Oversharing your own problems with your child
p20: Using your kid's ADHD as cover for your own
p21: Freezing when both kids needed you at the same time

KID-ONLY CARDS:
k01: Losing things constantly
k02: Forgetting things constantly
k03: Sensory meltdowns — food, clothes, noise, touch
k04: Won't eat most things
k05: Can't sit still at dinner
k06: Impulsive physical behaviour — running, climbing, roughhousing
k07: Falling apart over perceived failure or criticism
k08: School refusal or school anxiety
k09: Saying the wrong thing at the wrong moment
k10: Lying
`.trim();

const SYSTEM_PROMPT = `You are a routing assistant for ADHD Reflect, a resource for ADHD parents raising ADHD kids.

Your ONLY job is to match a parent's description of what just happened at home to one of the pre-written cards listed below. You do NOT generate advice. You do NOT counsel. You route.

CARDS:
${CARD_LIST}

CRISIS DETECTION:
Before matching, check if the input describes:
- Intent to harm self or child
- Active abuse
- Suicidal ideation
- Immediate danger

If you detect any of these, respond ONLY with:
{"crisis": true, "message": "This sounds like it needs more than a card right now."}

MATCHING RULES:
1. ALWAYS return at least one match. Every parenting struggle connects to something in this list.
2. Match to 1-3 cards that best fit the description
3. The primary match should be the single best card
4. Think broadly: if someone describes feeling guilty, that could be shame spiral (p01). If they mention their partner, check partner cards (p04-p07). If they describe forgetting, check executive function cards (p14-p17). If they describe their child's behaviour, check kid cards (k01-k10).
5. When the description is vague or general, match to the most common patterns: m07 (meltdown triggers yours), p01 (shame spiral), m08 (escalation), m10 (won't follow instructions)
6. Only return unmatched if the input is completely unrelated to parenting (e.g. asking about the weather)
7. If the parent describes something emotional but nonspecific ("I feel terrible", "bad day"), match to the emotional cards: p01 (shame), p09 (frustration on kid), p10 (shutdown)

RESPONSE FORMAT (JSON only, no other text):
{
  "crisis": false,
  "matches": [
    {"id": "m01", "title": "The morning getting ready battle", "reason": "One sentence explaining the match"}
  ]
}

If the input is completely unrelated to parenting or ADHD:
{
  "crisis": false,
  "matches": [],
  "unmatched": true,
  "suggestion": "Brief note on why this didn't match"
}

This should almost never happen. If someone is on this site typing something, they're almost certainly describing a parenting moment. Find the closest match.

Respond ONLY with valid JSON. No preamble, no explanation, no markdown.`;

export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const body = await request.json();
    const userInput = body.text?.trim();

    if (!userInput || userInput.length < 3) {
      return new Response(JSON.stringify({ error: 'Please describe what happened.' }), { status: 400, headers });
    }

    if (userInput.length > 1000) {
      return new Response(JSON.stringify({ error: 'Please keep it shorter.' }), { status: 400, headers });
    }

    const apiKey = env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Service not configured.' }), { status: 500, headers });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: userInput }
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Claude API error:', err);
      return new Response(JSON.stringify({ error: 'Matching service temporarily unavailable.' }), { status: 502, headers });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    // Parse JSON response from Claude
    let result;
    try {
      result = JSON.parse(text.replace(/```json|```/g, '').trim());
    } catch (e) {
      console.error('Failed to parse Claude response:', text);
      return new Response(JSON.stringify({ error: 'Could not process the match.' }), { status: 500, headers });
    }

    return new Response(JSON.stringify(result), { status: 200, headers });

  } catch (e) {
    console.error('Router error:', e);
    return new Response(JSON.stringify({ error: 'Something went wrong.' }), { status: 500, headers });
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

ENDFILE

echo ""
echo "All 14 files installed. Push to deploy."
