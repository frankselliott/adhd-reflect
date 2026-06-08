import { useState, useEffect } from 'react';
import { MODULES, getNextSuggestion, MODULE_CONTENT } from '../data/growModules.js';

const BRAND = {
  blue: '#4A6FA5',
  sage: '#A8C3A0',
  sageDark: '#7FA88E',
  cloud: '#F7F5F0',
  slate: '#1F2A37',
  pewter: '#56606E',
  mist: '#EDEFEE',
  apricot: '#E8A87C',
  lavender: '#9B8BB4',
  clay: '#C97B6A',
};

const COMPLETION_COPY = [
  "That one's harder than it looks. You did it anyway.",
  "Worth sitting with.",
  "That reflection will be useful later. It's saved.",
  "Something in there is worth coming back to.",
  "That took more than it looked like it would.",
  "You just did the thing other people skip.",
  "Most parents never slow down for this.",
];

function RightNowCard({ module }) {
  return (
    <div style={{
      background: 'rgba(74,111,165,0.05)',
      border: '1px solid rgba(74,111,165,0.2)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px',
    }}>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '9px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: BRAND.blue,
        marginBottom: '12px',
      }}>
        Right now card · Module {module.rank}
      </div>
      <div style={{
        fontFamily: "'Fraunces', serif",
        fontSize: '17px',
        color: BRAND.slate,
        marginBottom: '12px',
        fontWeight: 400,
        fontVariationSettings: "'opsz' 20",
      }}>
        {module.rightNowTitle}
      </div>
      <div style={{
        fontFamily: "'Lexend', sans-serif",
        fontSize: '18px',
        color: BRAND.blue,
        fontWeight: 500,
        marginBottom: '12px',
        padding: '12px 16px',
        background: 'white',
        borderRadius: '8px',
        fontStyle: 'italic',
      }}>
        "{module.rightNowScript}"
      </div>
      <div style={{
        fontFamily: "'Lexend', sans-serif",
        fontSize: '13px',
        color: BRAND.pewter,
        lineHeight: 1.6,
        marginBottom: '12px',
      }}>
        {module.rightNowNote}
      </div>
      <button
        onClick={() => window.print()}
        style={{
          background: 'none',
          border: '1px solid rgba(74,111,165,0.3)',
          borderRadius: '6px',
          padding: '8px 14px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '10px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: BRAND.blue,
          cursor: 'pointer',
        }}
      >
        Print this card
      </button>
    </div>
  );
}

function CompletionAnimation({ copy, onDone }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 400); }, 3500);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(247,245,240,0.96)', zIndex: 200,
      opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease',
    }}>
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'rgba(168,195,160,0.2)', border: '2px solid #A8C3A0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
            <path d="M2 10L8 16L22 2" stroke="#7FA88E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{
          fontFamily: "'Fraunces', serif", fontSize: '22px',
          color: '#1F2A37', fontWeight: 300, fontVariationSettings: "'opsz' 28",
        }}>
          {copy}
        </div>
      </div>
    </div>
  );
}

export function GrowModule({ moduleId }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reflection, setReflection] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animCopy, setAnimCopy] = useState('');
  const [nextModule, setNextModule] = useState(null);

  const module = MODULES.find(m => m.id === moduleId);

  useEffect(() => {
    fetch('/api/grow/progress')
      .then(r => { if (!r.ok) { window.location.href = '/grow?auth=required'; return null; } return r.json(); })
      .then(data => {
        if (data) {
          setUserData(data);
          setCompleted(!!data.progress[moduleId]);
          if (data.reflections[moduleId]) setReflection(data.reflections[moduleId]);
          setNextModule(getNextSuggestion(Object.keys(data.progress), data.pattern));
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [moduleId]);

  const handleSubmit = async () => {
    if (!reflection.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/grow/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId, reflection: reflection.trim() }),
      });
      if (res.ok) {
        setCompleted(true);
        setAnimCopy(COMPLETION_COPY[Math.floor(Math.random() * COMPLETION_COPY.length)]);
        setShowAnimation(true);
      }
    } catch (e) { setSubmitting(false); }
  };


// Module prose styles injected via global style tag
if (typeof document !== 'undefined' && !document.getElementById('module-prose-styles')) {
  const style = document.createElement('style');
  style.id = 'module-prose-styles';
  style.textContent = `
    .module-prose { margin-bottom: 32px; }
    .module-prose p { font-family: 'Lexend', sans-serif; font-size: 15px; color: #56606E; line-height: 1.75; margin-bottom: 16px; }
    .module-prose p strong { color: #1F2A37; font-weight: 500; }
    .module-prose p em { font-style: italic; color: #1F2A37; }
    .module-prose h3 { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 400; color: #1F2A37; line-height: 1.3; margin: 32px 0 12px; font-variation-settings: 'opsz' 20; }
    .module-prose ul { list-style: none; padding: 0; margin: 0 0 16px; display: flex; flex-direction: column; gap: 8px; }
    .module-prose ul li { font-family: 'Lexend', sans-serif; font-size: 15px; color: #56606E; line-height: 1.6; padding-left: 20px; position: relative; }
    .module-prose ul li::before { content: '—'; position: absolute; left: 0; color: rgba(31,42,55,0.3); }
  `;
  document.head.appendChild(style);
}

  if (!module) return (
    <div style={{ padding: '64px 24px', textAlign: 'center', fontFamily: "'Lexend', sans-serif", color: '#56606E' }}>
      Module not found. <a href="/grow/home" style={{ color: '#4A6FA5' }}>Back to your program</a>
    </div>
  );

  if (loading) return (
    <div style={{ padding: '64px 24px', textAlign: 'center', fontFamily: "'Lexend', sans-serif", color: '#56606E' }}>
      Loading...
    </div>
  );

  return (
    <>
      {showAnimation && <CompletionAnimation copy={animCopy} onDone={() => setShowAnimation(false)} />}
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px 80px' }}>

        <div style={{ marginBottom: '32px' }}>
          <a href="/grow/home" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', letterSpacing: '0.12em', color: BRAND.pewter, textDecoration: 'none' }}>
            ← Your program
          </a>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: BRAND.blue, marginBottom: '12px' }}>
            Module {module.rank} · {module.layer.charAt(0).toUpperCase() + module.layer.slice(1)}{completed ? ' · Complete' : ''}
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 300, color: BRAND.slate, lineHeight: 1.2, fontVariationSettings: "'opsz' 36", marginBottom: '8px' }}>
            {module.title}
          </h1>
          <p style={{ fontFamily: "'Lexend', sans-serif", fontSize: '16px', color: BRAND.pewter, lineHeight: 1.5 }}>
            {module.tagline}
          </p>
        </div>

        <div className="module-prose" dangerouslySetInnerHTML={{ __html: MODULE_CONTENT[module.id] || '' }} />

        <RightNowCard module={module} />

        <div style={{ marginBottom: '32px', padding: '16px 20px', background: 'white', borderRadius: '12px', border: '1px solid rgba(31,42,55,0.08)' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: BRAND.pewter, marginBottom: '10px' }}>
            One card from the library
          </div>
          <a href={`/cards/${module.cardLink.id}`} style={{ fontFamily: "'Lexend', sans-serif", fontSize: '15px', color: BRAND.blue, textDecoration: 'none' }}>
            {module.cardLink.label} →
          </a>
        </div>

        <div style={{ marginBottom: '32px', padding: '20px', background: 'rgba(168,195,160,0.1)', borderRadius: '12px', border: '1px solid rgba(168,195,160,0.3)' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: BRAND.sageDark, marginBottom: '10px' }}>
            This module's practice
          </div>
          <p style={{ fontFamily: "'Lexend', sans-serif", fontSize: '15px', color: BRAND.slate, lineHeight: 1.6 }}>
            {module.practicePrompt}
          </p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: BRAND.lavender, marginBottom: '12px' }}>
            Your reflection — completes this module
          </div>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: '18px', color: BRAND.slate, fontWeight: 300, fontVariationSettings: "'opsz' 20", lineHeight: 1.5, marginBottom: '16px', fontStyle: 'italic' }}>
            {module.reflectionPrompt}
          </p>
          <textarea
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            disabled={completed}
            placeholder="One sentence is enough. Saved privately. Not graded."
            rows={4}
            style={{
              width: '100%', padding: '16px',
              fontFamily: "'Lexend', sans-serif", fontSize: '15px', color: BRAND.slate,
              background: completed ? BRAND.mist : 'white',
              border: '1.5px solid rgba(31,42,55,0.15)', borderRadius: '10px',
              resize: 'vertical', outline: 'none', lineHeight: 1.6,
              boxSizing: 'border-box', marginBottom: '12px',
            }}
          />
          {!completed && (
            <button
              onClick={handleSubmit}
              disabled={!reflection.trim() || submitting}
              style={{
                display: 'block', width: '100%', padding: '16px',
                background: reflection.trim() ? BRAND.blue : 'rgba(31,42,55,0.1)',
                color: reflection.trim() ? 'white' : BRAND.pewter,
                fontFamily: "'Lexend', sans-serif", fontSize: '15px', fontWeight: 500,
                border: 'none', borderRadius: '10px',
                cursor: reflection.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              {submitting ? 'Saving...' : 'Save this reflection and complete the module'}
            </button>
          )}
          {completed && (
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: BRAND.sageDark, letterSpacing: '0.08em', textAlign: 'center', padding: '8px' }}>
              ✓ Module complete · Reflection saved
            </div>
          )}
        </div>

        {completed && nextModule && nextModule.id !== moduleId && (
          <div style={{ padding: '20px', background: 'white', borderRadius: '12px', border: '1px solid rgba(31,42,55,0.08)', textAlign: 'center' }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: BRAND.pewter, marginBottom: '12px' }}>Next up</div>
            <a href={`/grow/module/${nextModule.id}`} style={{ display: 'block', fontFamily: "'Lexend', sans-serif", fontSize: '16px', color: BRAND.blue, textDecoration: 'none', marginBottom: '12px', lineHeight: 1.4 }}>
              {nextModule.title}
            </a>
            <a href="/grow/home" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: BRAND.pewter, textDecoration: 'none', letterSpacing: '0.08em' }}>
              or back to all modules
            </a>
          </div>
        )}
      </div>
    </>
  );
}