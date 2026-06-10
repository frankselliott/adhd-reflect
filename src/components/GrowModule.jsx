import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  ContainerAnimation,
  ContainerAnimationParent,
  ContainerAnimationChild,
  NinetySecondAnimation,
  MaskingCostAnimation,
  AmplificationAnimation,
  SignalAnimation,
  RepairAnimation,
  CoRegulationAnimation,
} from './GrowAnimations.jsx';
import {
  AdviceGapAnimation,
  InputCapacityAnimation,
  InvisibleStepsAnimation,
  OpenLoopAnimation,
  LoopExitAnimation,
  SpiralForkAnimation,
  RepairSpirallerAnimation,
  TwoVersionsAnimation,
  NotchUpstreamAnimation,
} from './GrowAnimations2.jsx';
import { MODULES, getNextSuggestion, MODULE_CONTENT } from '../data/growModules.js';

const BRAND = {
  blue: '#4A6FA5',
  blueLight: 'rgba(74,111,165,0.08)',
  sage: '#A8C3A0',
  sageDark: '#7FA88E',
  sageLight: 'rgba(168,195,160,0.12)',
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

// ─── Styles injected once ───
const PROSE_STYLES = `
  .module-prose { margin-bottom: 32px; }
  .module-prose p { font-family: 'Lexend', sans-serif; font-size: 15px; color: #56606E; line-height: 1.75; margin-bottom: 16px; }
  .module-prose p strong { color: #1F2A37; font-weight: 500; }
  .module-prose p em { font-style: italic; color: #1F2A37; }
  .module-prose h3 { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 400; color: #1F2A37; line-height: 1.3; margin: 32px 0 12px; font-variation-settings: 'opsz' 20; }
  .module-prose ul { list-style: none; padding: 0; margin: 0 0 16px; display: flex; flex-direction: column; gap: 8px; }
  .module-prose ul li { font-family: 'Lexend', sans-serif; font-size: 15px; color: #56606E; line-height: 1.6; padding-left: 20px; position: relative; }
  .module-prose ul li::before { content: '—'; position: absolute; left: 0; color: rgba(31,42,55,0.3); }
  /* Experiment and ifthen boxes */
  .module-experiment { background: rgba(74,111,165,0.06); border: 1px solid rgba(74,111,165,0.2); border-radius: 12px; padding: 20px; margin: 28px 0; }
  .module-experiment-label { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: #4A6FA5; margin-bottom: 14px; font-weight: 500; }
  .module-experiment p { font-family: 'Lexend', sans-serif; font-size: 15px; color: #1F2A37; line-height: 1.7; margin-bottom: 10px; }
  .module-experiment p:last-child { margin-bottom: 0; }
  .module-experiment ul { list-style: none; padding: 0; margin: 8px 0 10px; display: flex; flex-direction: column; gap: 6px; }
  .module-experiment ul li { font-family: 'Lexend', sans-serif; font-size: 14px; color: #1F2A37; line-height: 1.6; padding-left: 18px; position: relative; }
  .module-experiment ul li::before { content: '·'; position: absolute; left: 4px; color: #4A6FA5; font-weight: bold; }
  .module-experiment strong { color: #1F2A37; font-weight: 500; }
  .module-experiment em { font-style: italic; }
  .module-ifthen { background: rgba(168,195,160,0.1); border: 1px solid rgba(168,195,160,0.35); border-radius: 12px; padding: 20px; margin: 28px 0; }
  .module-ifthen-label { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: #7FA88E; margin-bottom: 14px; font-weight: 500; }
  .module-ifthen p { font-family: 'Lexend', sans-serif; font-size: 15px; color: #1F2A37; line-height: 1.7; margin-bottom: 10px; }
  .module-ifthen p:last-child { margin-bottom: 0; }
  .module-ifthen strong { color: #1F2A37; font-weight: 500; }
  .module-ifthen em { font-style: italic; color: #4A6FA5; }
  .module-reentry { font-family: 'Lexend', sans-serif; font-size: 13px; color: #56606E; background: rgba(31,42,55,0.04); border-radius: 8px; padding: 14px 16px; margin-bottom: 24px; line-height: 1.6; }
  .module-reentry strong { color: #1F2A37; font-weight: 500; }
/* Animation component styles */
  .anim-wrap {
    margin: 32px 0;
    background: white;
    border-radius: 14px;
    border: 1px solid rgba(31,42,55,0.07);
    padding: 20px 16px 16px;
    box-shadow: 0 2px 12px rgba(31,42,55,0.05);
    overflow: hidden;
  }
  .anim-label-top {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #56606E;
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(31,42,55,0.06);
  }
  .anim-caption {
    font-family: 'Lexend', sans-serif;
    font-size: 13px;
    color: #56606E;
    line-height: 1.6;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(31,42,55,0.06);
    font-style: italic;
  }
/* ─ Text breaking elements ─ */
  
  /* Pull quote */
  .module-pullquote {
    font-family: 'Fraunces', serif;
    font-size: 20px;
    font-weight: 300;
    font-variation-settings: 'opsz' 24;
    color: #1F2A37;
    font-style: italic;
    line-height: 1.4;
    padding: 20px 24px;
    border-left: 3px solid #4A6FA5;
    background: rgba(74,111,165,0.04);
    border-radius: 0 10px 10px 0;
    margin: 28px 0;
  }
  .module-pullquote cite {
    display: block;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #56606E;
    margin-top: 10px;
    font-style: normal;
  }
  
  /* Stat callout */
  .module-stat {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px;
    background: white;
    border-radius: 12px;
    border: 1px solid rgba(31,42,55,0.07);
    margin: 24px 0;
    box-shadow: 0 1px 8px rgba(31,42,55,0.04);
  }
  .module-stat-number {
    font-family: 'Fraunces', serif;
    font-size: 48px;
    font-weight: 300;
    font-variation-settings: 'opsz' 52;
    color: #4A6FA5;
    line-height: 1;
    flex-shrink: 0;
    min-width: 80px;
    text-align: center;
  }
  .module-stat-body { flex: 1; min-width: 0; }
  .module-stat-label {
    font-family: 'Lexend', sans-serif;
    font-size: 15px;
    color: #1F2A37;
    font-weight: 500;
    line-height: 1.4;
    margin-bottom: 4px;
  }
  .module-stat-sub {
    font-family: 'Lexend', sans-serif;
    font-size: 13px;
    color: #56606E;
    line-height: 1.5;
  }
  
  /* Key insight */
  .module-insight {
    padding: 18px 20px;
    background: #1F2A37;
    border-radius: 10px;
    margin: 28px 0;
  }
  .module-insight p {
    font-family: 'Lexend', sans-serif !important;
    font-size: 15px !important;
    color: rgba(247,245,240,0.92) !important;
    line-height: 1.65 !important;
    margin: 0 !important;
  }
  .module-insight p strong {
    color: #A8C3A0 !important;
  }
  .module-insight-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 8px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(168,195,160,0.7);
    margin-bottom: 10px;
  }
  
  /* Section divider */
  .module-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 32px 0 24px;
  }
  .module-divider-line {
    flex: 1;
    height: 1px;
    background: rgba(31,42,55,0.07);
  }
  .module-divider-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(74,111,165,0.3);
    flex-shrink: 0;
  }
  
  /* Script block — styled quote for in-text scripts */
  .module-script {
    padding: 14px 18px;
    background: white;
    border: 1.5px solid rgba(74,111,165,0.25);
    border-radius: 8px;
    margin: 16px 0;
    font-family: 'Lexend', sans-serif;
    font-size: 16px;
    font-style: italic;
    color: #4A6FA5;
    line-height: 1.5;
    position: relative;
  }
  .module-script::before {
    content: '"';
    position: absolute;
    top: -10px;
    left: 12px;
    font-family: 'Fraunces', serif;
    font-size: 32px;
    color: rgba(74,111,165,0.3);
    font-variation-settings: 'opsz' 36;
    line-height: 1;
  }
  /* Interactive inputs inside boxes */
  .module-field { display: block; width: 100%; margin: 8px 0 14px; font-family: 'Lexend', sans-serif; font-size: 14px; color: #1F2A37; background: white; border: 1.5px solid rgba(74,111,165,0.25); border-radius: 8px; padding: 10px 12px; outline: none; line-height: 1.6; box-sizing: border-box; resize: vertical; transition: border-color 0.15s; }
  .module-field:focus { border-color: #4A6FA5; }
  .module-field::placeholder { color: rgba(86,96,110,0.5); font-style: italic; }
  .module-field-saved { border-color: rgba(168,195,160,0.6) !important; background: rgba(168,195,160,0.06) !important; }
  .module-copy-btn { display: inline-flex; align-items: center; gap: 6px; font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #4A6FA5; background: white; border: 1px solid rgba(74,111,165,0.25); border-radius: 6px; padding: 7px 12px; cursor: pointer; transition: all 0.15s; margin-top: 4px; }
  .module-copy-btn:hover { background: rgba(74,111,165,0.06); border-color: rgba(74,111,165,0.4); }
  .module-copy-btn.copied { color: #7FA88E; border-color: rgba(168,195,160,0.4); background: rgba(168,195,160,0.08); }
  /* M1 reflection display in M20 */
  .module-m1-reflection { background: rgba(155,139,180,0.08); border: 1px solid rgba(155,139,180,0.3); border-radius: 12px; padding: 20px; margin: 24px 0 28px; }
  .module-m1-label { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: #9B8BB4; margin-bottom: 12px; }
  .module-m1-text { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 300; font-variation-settings: 'opsz' 20; color: #1F2A37; line-height: 1.55; font-style: italic; }
`;

// ─── Interactive input that replaces ___ blanks ───
function InteractiveInput({ placeholder, id, value, onChange, multiline, rows = 2 }) {
  if (multiline) {
    return (
      <textarea
        className={`module-field ${value ? 'module-field-saved' : ''}`}
        placeholder={placeholder || 'Write here...'}
        value={value || ''}
        onChange={e => onChange(id, e.target.value)}
        rows={rows}
      />
    );
  }
  return (
    <input
      type="text"
      className={`module-field ${value ? 'module-field-saved' : ''}`}
      placeholder={placeholder || 'Write here...'}
      value={value || ''}
      onChange={e => onChange(id, e.target.value)}
    />
  );
}

// ─── Copy button ───
function CopyButton({ text, label = 'Copy this' }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className={`module-copy-btn ${copied ? 'copied' : ''}`}
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
    >
      {copied ? '✓ Copied' : `↗ ${label}`}
    </button>
  );
}

// ─── Reminder button ───
function ReminderButton({ moduleTitle }) {
  const [set, setSet] = useState(false);
  const handleReminder = async () => {
    // Try browser notifications first
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        // Set reminder for 4 hours from now
        const delay = 4 * 60 * 60 * 1000;
        setTimeout(() => {
          new Notification('Both of You — reminder', {
            body: `Time to try the practice from: ${moduleTitle}`,
            icon: '/icon-192.png',
          });
        }, delay);
        setSet(true);
        return;
      }
    }
    // Fallback: just mark it
    setSet(true);
  };
  return (
    <button
      onClick={handleReminder}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px',
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: set ? BRAND.sageDark : BRAND.pewter,
        background: set ? BRAND.sageLight : 'white',
        border: `1px solid ${set ? 'rgba(168,195,160,0.4)' : 'rgba(31,42,55,0.12)'}`,
        borderRadius: '6px', padding: '7px 12px', cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {set ? '✓ Reminder set for tonight' : '⏰ Remind me to try this tonight'}
    </button>
  );
}

// ─── Rich card links section ───
function CardLinks({ module }) {
  const cards = module.extraCards || (module.cardLink ? [{ ...module.cardLink, note: '' }] : []);
  if (!cards.length) return null;
  return (
    <div style={{
      marginBottom: '32px', padding: '20px',
      background: 'white', borderRadius: '12px',
      border: '1px solid rgba(31,42,55,0.08)',
    }}>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px',
        letterSpacing: '0.16em', textTransform: 'uppercase',
        color: BRAND.pewter, marginBottom: '14px',
      }}>
        Cards from the library for this module
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {cards.map((card, i) => (
          <a
            key={card.id}
            href={`/cards/${card.id}`}
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div style={{
              padding: '12px 14px', borderRadius: '8px',
              background: i === 0 ? BRAND.blueLight : 'rgba(31,42,55,0.02)',
              border: `1px solid ${i === 0 ? 'rgba(74,111,165,0.2)' : 'rgba(31,42,55,0.06)'}`,
              transition: 'background 0.15s',
            }}>
              <div style={{
                fontFamily: "'Lexend', sans-serif", fontSize: '14px',
                color: BRAND.blue, fontWeight: 500, marginBottom: card.note ? '4px' : 0,
              }}>
                {i === 0 && <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: BRAND.blue, marginRight: '8px' }}>Start here →</span>}
                {card.label}
              </div>
              {card.note && (
                <div style={{ fontFamily: "'Lexend', sans-serif", fontSize: '12px', color: BRAND.pewter }}>
                  {card.note}
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Right now card ───
function RightNowCard({ module }) {
  return (
    <div style={{
      background: BRAND.blueLight, border: '1px solid rgba(74,111,165,0.2)',
      borderRadius: '12px', padding: '20px', marginBottom: '24px',
    }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: BRAND.blue, marginBottom: '12px' }}>
        Right now card · Module {module.rank}
      </div>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: '17px', color: BRAND.slate, marginBottom: '12px', fontWeight: 400, fontVariationSettings: "'opsz' 20" }}>
        {module.rightNowTitle}
      </div>
      <div style={{ fontFamily: "'Lexend', sans-serif", fontSize: '18px', color: BRAND.blue, fontWeight: 500, marginBottom: '12px', padding: '12px 16px', background: 'white', borderRadius: '8px', fontStyle: 'italic' }}>
        "{module.rightNowScript}"
      </div>
      <div style={{ fontFamily: "'Lexend', sans-serif", fontSize: '13px', color: BRAND.pewter, lineHeight: 1.6, marginBottom: '14px' }}>
        {module.rightNowNote}
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <CopyButton text={`${module.rightNowTitle}\n\n"${module.rightNowScript}"\n\n${module.rightNowNote}`} label="Copy card text" />
        <button onClick={() => window.print()} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: BRAND.pewter, background: 'white', border: '1px solid rgba(31,42,55,0.12)', borderRadius: '6px', padding: '7px 12px', cursor: 'pointer' }}>
          🖨 Print
        </button>
      </div>
    </div>
  );
}

// ─── Completion animation ───
function CompletionAnimation({ copy, onDone }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 400); }, 3500);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(247,245,240,0.96)', zIndex: 200, opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease' }}>
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(168,195,160,0.2)', border: '2px solid #A8C3A0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
            <path d="M2 10L8 16L22 2" stroke="#7FA88E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', color: '#1F2A37', fontWeight: 300, fontVariationSettings: "'opsz' 28" }}>
          {copy}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───
export function GrowModule({ moduleId }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reflection, setReflection] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animCopy, setAnimCopy] = useState('');
  const [nextModule, setNextModule] = useState(null);
  // Saved field values for experiments and if-thens
  const [fieldValues, setFieldValues] = useState({});
  const saveTimerRef = useRef(null);

  const module = MODULES.find(m => m.id === moduleId);

  // Inject styles once
  useEffect(() => {
    if (!document.getElementById('module-prose-styles')) {
      const style = document.createElement('style');
      style.id = 'module-prose-styles';
      style.textContent = PROSE_STYLES;
      document.head.appendChild(style);
    }
  }, []);

  // Load progress — with localStorage token fallback for cookie loss (Safari ITP etc.)
  useEffect(() => {
    fetch('/api/grow/progress')
      .then(r => {
        if (r.status === 401) {
          // Cookie may have been cleared — try localStorage token
          let stored = null;
          try { stored = localStorage.getItem('grow_token'); } catch(e) {}
          if (stored) {
            // Re-set the cookie by hitting access endpoint, then reload
            window.location.href = '/grow/access?token=' + stored + '&next=' + encodeURIComponent(window.location.pathname);
            return null;
          }
          window.location.href = '/grow?auth=required';
          return null;
        }
        if (!r.ok) { window.location.href = '/grow?auth=required'; return null; }
        return r.json();
      })
      .then(data => {
        if (data) {
          setUserData(data);
          setCompleted(!!data.progress[moduleId]);
          if (data.reflections[moduleId]) setReflection(data.reflections[moduleId]);
          // Load saved field values
          const savedFields = {};
          if (data.experiments?.[moduleId]) Object.assign(savedFields, data.experiments[moduleId]);
          if (data.ifthens?.[moduleId]) Object.assign(savedFields, data.ifthens[moduleId]);
          setFieldValues(savedFields);
          setNextModule(getNextSuggestion(Object.keys(data.progress), data.pattern));
          setLoading(false);
          // M20: surface M1 reflection
          if (moduleId === 'm20' && data.reflections?.m1) {
            setTimeout(() => {
              const el = document.getElementById('m1-text');
              if (el) el.innerHTML = `"${data.reflections.m1}"`;
            }, 100);
          }
        }
      })
      .catch(() => setLoading(false));
  }, [moduleId]);

  // Auto-save field values (debounced)
  const handleFieldChange = useCallback((fieldId, value) => {
    setFieldValues(prev => {
      const next = { ...prev, [fieldId]: value };
      // Debounced save
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        const experimentFields = {};
        const ifthenFields = {};
        Object.entries(next).forEach(([k, v]) => {
          if (k.startsWith('exp_')) experimentFields[k] = v;
          else ifthenFields[k] = v;
        });
        fetch('/api/grow/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            moduleId,
            experimentData: Object.keys(experimentFields).length ? experimentFields : undefined,
            ifthenData: Object.keys(ifthenFields).length ? ifthenFields : undefined,
          }),
        }).catch(() => {});
      }, 1500);
      return next;
    });
  }, [moduleId]);

  // Process HTML to replace ___ with actual inputs
  const processContent = useCallback((html) => {
    if (!html) return '';
    let fieldCount = 0;

    // Extract outerHTML of a div with a given class, handling nested divs
    function replaceBoxes(src, className, prefix) {
      const openTag = `<div class="${className}">`;
      let result = '';
      let i = 0;
      while (i < src.length) {
        const start = src.indexOf(openTag, i);
        if (start === -1) { result += src.slice(i); break; }
        result += src.slice(i, start);
        // Walk forward counting div depth to find the matching close
        let depth = 0;
        let j = start;
        while (j < src.length) {
          const nextOpen = src.indexOf('<div', j + 1);
          const nextClose = src.indexOf('</div>', j);
          if (nextClose === -1) { j = src.length; break; }
          if (nextOpen !== -1 && nextOpen < nextClose) {
            depth++;
            j = nextOpen;
          } else {
            if (depth === 0) {
              j = nextClose + 6; // past </div>
              break;
            }
            depth--;
            j = nextClose + 6;
          }
        }
        let inner = src.slice(start + openTag.length, j - 6);
        inner = inner.replace(/_______________/g, () => {
          fieldCount++;
          const fieldId = `${prefix}_${moduleId}_${fieldCount}`;
          const val = (fieldValues[fieldId] || '').replace(/"/g, '&quot;');
          return `<input type="text" class="module-field${val ? ' module-field-saved' : ''}" data-field-id="${fieldId}" placeholder="Write here..." value="${val}" />`;
        });
        result += `<div class="${className}">${inner}</div>`;
        i = j;
      }
      return result;
    }

    html = replaceBoxes(html, 'module-experiment', 'exp');
    html = replaceBoxes(html, 'module-ifthen', 'ift');

    return html;
  }, [moduleId, fieldValues]);

  // Handle input events from rendered HTML
  useEffect(() => {
    const handleInput = (e) => {
      if (e.target.matches('.module-field[data-field-id]')) {
        handleFieldChange(e.target.dataset.fieldId, e.target.value);
      }
    };
    document.addEventListener('input', handleInput);
    return () => document.removeEventListener('input', handleInput);
  }, [handleFieldChange]);

  // Split content into html/animation segments — must be before early returns (hooks rules)
  const contentSegments = useMemo(() => {
    if (!module) return [];
    const html = processContent(MODULE_CONTENT[module.id] || '');
    const parts = html.split(/(<div data-animation="[^"]+"><\/div>)/g);
    return parts.map(part => {
      const match = part.match(/^<div data-animation="([^"]+)"><\/div>$/);
      if (match) return { type: 'animation', name: match[1] };
      return { type: 'html', content: part };
    }).filter(s => s.type === 'animation' || s.content?.trim());
  }, [module?.id, processContent]);

  const handleSubmit = async () => {
    if (!reflection.trim() || submitting) return;
    setSubmitting(true);
    try {
      // Collect all field values for final save
      const experimentFields = {};
      const ifthenFields = {};
      Object.entries(fieldValues).forEach(([k, v]) => {
        if (k.startsWith('exp_')) experimentFields[k] = v;
        else ifthenFields[k] = v;
      });

      const res = await fetch('/api/grow/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId,
          reflection: reflection.trim(),
          experimentData: Object.keys(experimentFields).length ? experimentFields : undefined,
          ifthenData: Object.keys(ifthenFields).length ? ifthenFields : undefined,
        }),
      });
      if (res.ok) {
        setCompleted(true);
        setAnimCopy(COMPLETION_COPY[Math.floor(Math.random() * COMPLETION_COPY.length)]);
        setShowAnimation(true);
        setTimeout(() => { window.location.href = '/grow/home'; }, 4200);
      }
    } catch (e) { setSubmitting(false); }
  };

  if (!module) return (
    <div style={{ padding: '64px 24px', textAlign: 'center', fontFamily: "'Lexend', sans-serif", color: BRAND.pewter }}>
      Module not found. <a href="/grow/home" style={{ color: BRAND.blue }}>Back to your program</a>
    </div>
  );

  if (loading) return (
    <div style={{ padding: '64px 24px', textAlign: 'center', fontFamily: "'Lexend', sans-serif", color: BRAND.pewter }}>
      Loading...
    </div>
  );

  return (
    <>
      {showAnimation && <CompletionAnimation copy={animCopy} onDone={() => setShowAnimation(false)} />}
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Back */}
        <div style={{ marginBottom: '32px' }}>
          <a href="/grow/home" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', letterSpacing: '0.12em', color: BRAND.pewter, textDecoration: 'none' }}>
            ← Your program
          </a>
        </div>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: BRAND.blue }}>
              Module {module.rank} · {module.layer.charAt(0).toUpperCase() + module.layer.slice(1)}{completed ? ' · Complete ✓' : ''}
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: BRAND.pewter, letterSpacing: '0.08em' }}>
              {userData ? Object.keys(userData.progress || {}).length : 0} / 20
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ height: '3px', background: 'rgba(31,42,55,0.07)', borderRadius: '2px', marginBottom: '20px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              background: BRAND.blue,
              borderRadius: '2px',
              width: `${Math.round(((userData ? Object.keys(userData.progress || {}).length : 0) / 20) * 100)}%`,
              transition: 'width 0.6s ease',
            }} />
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 300, color: BRAND.slate, lineHeight: 1.2, fontVariationSettings: "'opsz' 36", marginBottom: '8px' }}>
            {module.title}
          </h1>
          <p style={{ fontFamily: "'Lexend', sans-serif", fontSize: '16px', color: BRAND.pewter, lineHeight: 1.5 }}>
            {module.tagline}
          </p>
        </div>

        {/* Module content — inline animations via segment renderer */}
        <div className="module-prose">
          {contentSegments.map((seg, i) => {
            if (seg.type === 'html') {
              return <div key={i} dangerouslySetInnerHTML={{ __html: seg.content }} />;
            }
            const AnimComponent = {
              ContainerAnimationParent: ContainerAnimationParent,
              ContainerAnimationChild: ContainerAnimationChild,
              NinetySecondAnimation: NinetySecondAnimation,
              MaskingCostAnimation: MaskingCostAnimation,
              AmplificationAnimation: AmplificationAnimation,
              CoRegulationAnimation: CoRegulationAnimation,
              RepairAnimation: RepairAnimation,
              RepairSpirallerAnimation: RepairSpirallerAnimation,
              SignalAnimation: SignalAnimation,
              AdviceGapAnimation: AdviceGapAnimation,
              InputCapacityAnimation: InputCapacityAnimation,
              InvisibleStepsAnimation: InvisibleStepsAnimation,
              OpenLoopAnimation: OpenLoopAnimation,
              LoopExitAnimation: LoopExitAnimation,
              SpiralForkAnimation: SpiralForkAnimation,
              TwoVersionsAnimation: TwoVersionsAnimation,
              NotchUpstreamAnimation: NotchUpstreamAnimation,
            }[seg.name];
            return AnimComponent ? <AnimComponent key={i} /> : null;
          })}
        </div>

        {/* Card links */}
        <CardLinks module={module} />

        {/* Right now card */}
        <RightNowCard module={module} />

        {/* Practice prompt */}
        <div style={{ marginBottom: '32px', padding: '20px', background: BRAND.sageLight, borderRadius: '12px', border: '1px solid rgba(168,195,160,0.3)' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: BRAND.sageDark, marginBottom: '10px' }}>
            This week's practice
          </div>
          <p style={{ fontFamily: "'Lexend', sans-serif", fontSize: '15px', color: BRAND.slate, lineHeight: 1.6, marginBottom: '12px' }}>
            {module.practicePrompt}
          </p>
          <ReminderButton moduleTitle={module.title} />
        </div>

        {/* Reflection */}
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
            style={{ width: '100%', padding: '16px', fontFamily: "'Lexend', sans-serif", fontSize: '15px', color: BRAND.slate, background: completed ? BRAND.mist : 'white', border: '1.5px solid rgba(31,42,55,0.15)', borderRadius: '10px', resize: 'vertical', outline: 'none', lineHeight: 1.6, boxSizing: 'border-box', marginBottom: '12px' }}
          />
          {!completed ? (
            <button
              onClick={handleSubmit}
              disabled={!reflection.trim() || submitting}
              style={{ display: 'block', width: '100%', padding: '16px', background: reflection.trim() ? BRAND.blue : 'rgba(31,42,55,0.1)', color: reflection.trim() ? 'white' : BRAND.pewter, fontFamily: "'Lexend', sans-serif", fontSize: '15px', fontWeight: 500, border: 'none', borderRadius: '10px', cursor: reflection.trim() ? 'pointer' : 'not-allowed' }}
            >
              {submitting ? 'Saving...' : 'Save this reflection and complete the module'}
            </button>
          ) : (
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: BRAND.sageDark, letterSpacing: '0.08em', textAlign: 'center', padding: '8px' }}>
              ✓ Module complete · Reflection saved
            </div>
          )}
        </div>

        {/* Next module */}
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