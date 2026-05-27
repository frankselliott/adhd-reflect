import { useState, useRef, useEffect } from 'react';

/* ═══════════════════════════════════════════
   ADHD Reflect — Calming Card Viewer
   Design: adhd-parent-design.html prototype
   ═══════════════════════════════════════════ */

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
  now:  { label: 'right now',    bg: '#EEE8D8', accent: '#B85038', iconBg: 'rgba(184,80,56,0.08)' },
  why:  { label: 'understand it', bg: '#E4EBE3', accent: '#4B6B4E', iconBg: 'rgba(75,107,78,0.1)' },
  kid:  { label: 'your kid',     bg: '#E2E8EF', accent: '#3F6178', iconBg: 'rgba(63,97,120,0.1)' },
};

function TimerButton() {
  const [seconds, setSeconds] = useState(30);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => setSeconds(s => s - 1), 1000);
    }
    if (seconds === 0) { setRunning(false); setSeconds(30); }
    return () => clearInterval(intervalRef.current);
  }, [running, seconds]);

  const toggle = () => {
    if (running) { setRunning(false); setSeconds(30); }
    else setRunning(true);
  };

  const display = running
    ? `${String(Math.floor(seconds/60)).padStart(1,'0')}:${String(seconds%60).padStart(2,'0')}`
    : 'pause 0:30';

  return (
    <button onClick={toggle} style={{
      appearance: 'none', border: 0, cursor: 'pointer', flexShrink: 0,
      background: running ? '#B85038' : '#191714', color: '#F5EFE0',
      fontFamily: 'var(--mono)', fontSize: 15, letterSpacing: '0.04em',
      padding: '16px 26px', borderRadius: 999,
      animation: running ? 'timer-pulse 1.4s ease-in-out infinite' : 'none',
      transition: 'background 220ms ease',
    }}>
      {display}
    </button>
  );
}

function ExpandSection({ label, children, accentColor }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(!open)} style={{
        appearance: 'none', border: 0, borderTop: '1px solid rgba(25,23,20,0.08)',
        background: 'transparent', width: '100%', padding: '17px 0',
        display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left',
        fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.09em',
        textTransform: 'lowercase', color: open ? '#6B6358' : '#A09589',
        transition: 'color 180ms ease',
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          style={{ flexShrink: 0, transition: 'transform 300ms ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
        {label}
      </button>
      <div style={{
        overflow: 'hidden', maxHeight: open ? 900 : 0, opacity: open ? 1 : 0,
        transition: 'max-height 420ms cubic-bezier(.4,0,.2,1), opacity 280ms ease',
      }}>
        <div style={{ paddingBottom: 36 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function CardViewer({ cardId, cardType, title, parentNow, kidNow, content, relatedGuides }) {
  const isMoment = cardType === 'moment';
  const hasKid = isMoment && kidNow;

  const availableTabs = ['now'];
  if (isMoment) availableTabs.push('why');
  if (hasKid) availableTabs.push('kid');

  const [activeTab, setActiveTab] = useState('now');
  const tabsRef = useRef(null);
  const [barStyle, setBarStyle] = useState({});
  const currentTab = TABS[activeTab];
  const ink = '#191714';
  const ink2 = '#6B6358';
  const ink3 = '#A09589';

  // Animated tab bar
  useEffect(() => {
    if (!tabsRef.current) return;
    const btns = tabsRef.current.querySelectorAll('[data-tab]');
    const idx = availableTabs.indexOf(activeTab);
    if (btns[idx]) {
      const btn = btns[idx];
      const container = tabsRef.current;
      setBarStyle({
        transform: `translateX(${btn.offsetLeft - container.offsetLeft}px)`,
        width: `${btn.offsetWidth}px`,
        background: currentTab.accent,
      });
    }
  }, [activeTab]);

  const mainContent = activeTab === 'now' ? (parentNow || content || '') :
                       activeTab === 'kid' ? (kidNow || '') :
                       ''; // why tab gets the guide link

  const typeLabel = { moment: 'moment', parent: 'parent', kid: 'kid' }[cardType];

  return (
    <>
      <style>{`
        @keyframes timer-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.78; } }
        @keyframes pulse-live {
          0%  { box-shadow: 0 0 0 0 rgba(75,107,78,0.6); }
          60% { box-shadow: 0 0 0 7px rgba(75,107,78,0); }
          100%{ box-shadow: 0 0 0 0 rgba(75,107,78,0); }
        }
        @keyframes panel-in { from { opacity: 0; } to { opacity: 1; } }
        .calming-shell { transition: background 360ms ease; }
        .calming-panel { animation: panel-in 260ms ease both; }
        .calming-content p { font-variation-settings: "opsz" 16, "wght" 380; font-size: 16px; line-height: 1.68; color: ${ink2}; letter-spacing: -0.005em; margin-bottom: 14px; }
        .calming-content p:last-child { margin-bottom: 0; }
        .calming-content strong { font-variation-settings: "opsz" 16, "wght" 580; color: ${ink}; }
        .calming-content hr { border: none; border-top: 1px solid rgba(25,23,20,0.07); margin: 20px 0; }
      `}</style>

      <div className="calming-shell" style={{
        width: '100%', maxWidth: 430, margin: '0 auto',
        minHeight: '80dvh', display: 'flex', flexDirection: 'column',
        background: currentTab.bg, borderRadius: window.innerWidth >= 700 ? 32 : 0,
        overflow: 'hidden',
      }}>

        {/* Chrome bar */}
        <div style={{
          padding: '22px 26px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <a href="/" style={{
            fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.07em',
            color: ink2, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 6l-6 6 6 6"/></svg>
            back
          </a>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.05em', color: ink3,
          }}>
            matched
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: '#4B6B4E',
              animation: 'pulse-live 2.8s ease-out infinite',
            }}/>
          </div>
        </div>

        {/* Title */}
        <div style={{ padding: '16px 26px 0', flexShrink: 0 }}>
          <div style={{
            fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 18, "wght" 440',
            fontSize: 18, letterSpacing: '-0.01em', color: ink, lineHeight: 1.2,
          }}>
            {title}
          </div>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em',
            color: ink3, textTransform: 'lowercase', marginTop: 3,
          }}>
            {typeLabel} · {cardId}
          </div>
        </div>

        {/* Tabs */}
        {availableTabs.length > 1 && (
          <div ref={tabsRef} style={{
            padding: '16px 26px 0', display: 'grid',
            gridTemplateColumns: `repeat(${availableTabs.length}, 1fr)`,
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
                }}
              >
                {TABS[key].label}
              </button>
            ))}
            <span style={{
              position: 'absolute', bottom: -1, height: 2.5, borderRadius: 2,
              transition: 'transform 300ms cubic-bezier(.3,.8,.3,1), width 300ms cubic-bezier(.3,.8,.3,1), background 300ms ease',
              ...barStyle,
            }}/>
          </div>
        )}

        {/* Panel content */}
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <div key={activeTab} className="calming-panel" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>

            {/* RIGHT NOW panel */}
            {activeTab === 'now' && (
              <div style={{ padding: '28px 26px 30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.24em',
                  textTransform: 'uppercase', color: currentTab.accent, marginBottom: 14,
                }}>
                  what to do right now
                </div>
                <div className="calming-content" style={{ flex: 1 }}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(mainContent) }}
                />
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: 16, marginTop: 24,
                }}>
                  <div style={{
                    fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 14, "wght" 360',
                    fontSize: 13, lineHeight: 1.45, color: ink3, maxWidth: '50%',
                  }}>
                    Take thirty seconds before you do anything else.
                  </div>
                  <TimerButton />
                </div>
              </div>
            )}

            {/* WHY / UNDERSTAND panel */}
            {activeTab === 'why' && (
              <div style={{ padding: '28px 26px 30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  width: 58, height: 58, borderRadius: 17,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: currentTab.iconBg, marginBottom: 26, flexShrink: 0,
                }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={currentTab.accent} strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                  </svg>
                </div>
                <div style={{
                  fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 28, "wght" 460',
                  fontSize: 22, lineHeight: 1.34, letterSpacing: '-0.015em', color: ink, marginBottom: 16,
                }}>
                  Understanding what's happening when <strong style={{ color: currentTab.accent, fontVariationSettings: '"opsz" 28, "wght" 700' }}>this moment</strong> shows up.
                </div>
                <div style={{
                  fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 16, "wght" 360',
                  fontSize: 16, lineHeight: 1.65, color: ink2,
                }}>
                  This moment has a guide with the neuroscience behind it and practical strategies for next time.
                </div>
                <a href={'/guides/' + cardId} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 13,
                  background: currentTab.iconBg, borderRadius: 14, padding: '17px 18px', marginTop: 26,
                  textDecoration: 'none', color: ink,
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: currentTab.accent, flexShrink: 0, marginTop: 7 }}/>
                  <span style={{
                    fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 16, "wght" 450',
                    fontSize: 16, lineHeight: 1.45, letterSpacing: '-0.01em',
                  }}>
                    Read the full guide →
                  </span>
                </a>

                {/* Related guides */}
                {relatedGuides && relatedGuides.length > 1 && (
                  <ExpandSection label="related guides" accentColor={currentTab.accent}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                      {relatedGuides.slice(1).map(g => (
                        <a key={g.id} href={'/guides/' + g.id} style={{
                          padding: '14px 0', borderBottom: '1px solid rgba(25,23,20,0.07)',
                          textDecoration: 'none', display: 'block',
                          fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 16, "wght" 380',
                          fontSize: 15, lineHeight: 1.45, color: ink2,
                        }}>
                          {g.title}
                        </a>
                      ))}
                    </div>
                  </ExpandSection>
                )}
              </div>
            )}

            {/* YOUR KID panel */}
            {activeTab === 'kid' && (
              <div style={{ padding: '28px 26px 30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  width: 58, height: 58, borderRadius: 17,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: currentTab.iconBg, marginBottom: 26, flexShrink: 0,
                }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={currentTab.accent} strokeWidth="1.5" strokeLinecap="round">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
                  </svg>
                </div>
                <div style={{
                  fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 28, "wght" 460',
                  fontSize: 22, lineHeight: 1.34, letterSpacing: '-0.015em', color: ink, marginBottom: 16,
                }}>
                  What your <strong style={{ color: currentTab.accent, fontVariationSettings: '"opsz" 28, "wght" 700' }}>kid</strong> is experiencing right now.
                </div>
                <div className="calming-content" style={{ flex: 1 }}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(kidNow || '') }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer safety */}
        <div style={{
          padding: '12px 26px 20px', flexShrink: 0, textAlign: 'center',
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.08em', color: ink3,
        }}>
          not medical advice · <a href="/legal/safety" style={{ color: ink3 }}>crisis support</a>
        </div>
      </div>
    </>
  );
}

