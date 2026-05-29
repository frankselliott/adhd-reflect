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

