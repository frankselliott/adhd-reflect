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



function GuideLink({ guide, accentColor }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem('adhd-reflect-saved-guides') || '[]');
      setSaved(list.some(g => g.id === guide.id));
    } catch(e) {}
  }, []);

  function toggleSave(e) {
    e.preventDefault();
    e.stopPropagation();
    try {
      let list = JSON.parse(localStorage.getItem('adhd-reflect-saved-guides') || '[]');
      if (saved) {
        list = list.filter(g => g.id !== guide.id);
      } else {
        list.push({ id: guide.id, title: guide.title, savedAt: Date.now() });
      }
      localStorage.setItem('adhd-reflect-saved-guides', JSON.stringify(list));
      setSaved(!saved);
    } catch(e) {}
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 0,
      background: 'rgba(75,107,78,0.05)', borderRadius: 12,
      border: '1px solid rgba(75,107,78,0.08)',
      overflow: 'hidden',
    }}>
      <a href={'/guides/' + guide.id} style={{
        flex: 1, display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '14px 16px', textDecoration: 'none', color: '#191714',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: accentColor, flexShrink: 0, marginTop: 8 }}/>
        <span style={{
          fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 16, "wght" 430',
          fontSize: 15, lineHeight: 1.45,
        }}>{guide.title}</span>
      </a>
      <button onClick={toggleSave} style={{
        appearance: 'none', border: 0, cursor: 'pointer',
        background: 'transparent', padding: '14px 14px',
        color: saved ? accentColor : '#A09589',
        transition: 'color 0.15s',
        flexShrink: 0,
      }} title={saved ? 'Remove from saved' : 'Save for later'}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? accentColor : 'none'} stroke={saved ? accentColor : 'currentColor'} strokeWidth="1.5">
          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
        </svg>
      </button>
    </div>
  );
}

function WrongMatchBanner({ currentId }) {
  const [matches, setMatches] = useState(null);
  const [query, setQuery] = useState('');
  const [showAlts, setShowAlts] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('adhd-reflect-matches');
      const storedQuery = sessionStorage.getItem('adhd-reflect-query');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0 && parsed[0].id === currentId) {
          setMatches(parsed);
          setQuery(storedQuery || '');
        }
      }
    } catch(e) {}
  }, []);

  if (!matches || matches.length === 0) return null;

  const alts = matches.filter(m => m.id !== currentId);

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '0 16px 20px', pointerEvents: 'none',
    }}>
      {/* Alt matches dropdown */}
      {showAlts && alts.length > 0 && (
        <div style={{
          background: 'white', borderRadius: 16, padding: 16,
          boxShadow: '0 -4px 24px rgba(0,0,0,0.12)',
          marginBottom: 8, width: '100%', maxWidth: 380, pointerEvents: 'auto',
        }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
            color: '#A09589', marginBottom: 10,
          }}>other matches</div>
          {alts.map(m => (
            <a key={m.id} href={'/cards/' + m.id}
              style={{
                display: 'block', padding: '10px 12px', borderRadius: 10,
                textDecoration: 'none', marginBottom: 4,
                fontFamily: 'var(--serif)', fontSize: 15, color: '#191714',
                background: 'rgba(25,23,20,0.03)',
              }}>{m.title}</a>
          ))}
          <a href="/" style={{
            display: 'block', padding: '10px 12px',
            textDecoration: 'none',
            fontFamily: 'var(--mono)', fontSize: 12, color: '#A09589',
          }}>&#8592; search again</a>
        </div>
      )}

      {/* Wrong match pill */}
      <button onClick={() => setShowAlts(!showAlts)}
        style={{
          pointerEvents: 'auto',
          appearance: 'none', border: 0, cursor: 'pointer',
          background: 'rgba(25,23,20,0.85)', color: '#F5EFE0',
          fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.04em',
          padding: '10px 20px', borderRadius: 100,
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}>
        {showAlts ? 'close' : 'not the right moment?'}
      </button>
    </div>
  );
}

export default function CardViewer({ cardId, cardType, title, parentNow, kidNow, content, brainProcess, activities, patternData, kidBrain, topicGuides }) {
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

                {/* Topic guides with save option */}
                {topicGuides && topicGuides.length > 0 && (
                  <div style={{ marginTop: 24 }}>
                    <div style={{
                      fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
                      textTransform: 'lowercase', color: currentTab.accent, marginBottom: 14,
                    }}>read when you are ready</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {topicGuides.map(g => (
                        <GuideLink key={g.id} guide={g} accentColor={currentTab.accent} />
                      ))}
                    </div>
                  </div>
                )}              </div>
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

                {/* Kid brain process */}
                {kidBrain && (
                  <div style={{ marginTop: 24 }}>
                    <div style={{
                      fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.24em',
                      textTransform: 'uppercase', color: currentTab.accent, marginBottom: 16,
                    }}>their adhd brain right now</div>
                    <BrainBlock label="their body" text={kidBrain.body} accentColor={currentTab.accent} />
                    <BrainBlock label="their brain" text={kidBrain.brain} accentColor={currentTab.accent} />
                    <BrainBlock label="what they need" text={kidBrain.need} accentColor={currentTab.accent} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div style={{
          padding: '12px 26px 40px', flexShrink: 0, textAlign: 'center',
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.08em', color: ink3,
        }}>
          not medical advice &middot; <a href="/legal/safety" style={{ color: ink3 }}>crisis support</a>
        </div>
      </div>
      <WrongMatchBanner currentId={cardId} />
    </>
  );
}

