import { useState, useRef, useEffect } from 'react';
import BreathingExercise from './BreathingExercise.jsx';

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

const ink = '#191714';
const ink2 = '#6B6358';
const ink3 = '#A09589';

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
        transition: 'color 180ms ease',
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

function DeepBlock({ label, text, accentColor }) {
  return (
    <div style={{
      background: 'rgba(25,23,20,0.04)', borderRadius: 12, padding: '16px 18px', marginBottom: 10,
    }}>
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em',
        textTransform: 'lowercase', color: accentColor || ink3, marginBottom: 8,
      }}>
        {label}
      </div>
      <p style={{
        fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 16, "wght" 380',
        fontSize: 15, lineHeight: 1.6, color: ink2, margin: 0,
      }}
        dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#191714;font-variation-settings:\'opsz\' 16, \'wght\' 580">$1</strong>') }}
      />
    </div>
  );
}

export default function CardViewer({ cardId, cardType, title, parentNow, kidNow, content, relatedGuides, brainProcess }) {
  const isMoment = cardType === 'moment';
  const hasKid = isMoment && kidNow;

  const availableTabs = ['now'];
  if (isMoment) availableTabs.push('why');
  if (hasKid) availableTabs.push('kid');

  const [activeTab, setActiveTab] = useState('now');
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

  const mainContent = activeTab === 'now' ? (parentNow || content || '') :
                       activeTab === 'kid' ? (kidNow || '') : '';

  const typeLabel = { moment: 'moment', parent: 'parent', kid: 'kid' }[cardType];
  const brain = brainProcess || null;

  return (
    <>
      <style>{`
        @keyframes pulse-live { 0% { box-shadow: 0 0 0 0 rgba(75,107,78,0.6); } 60% { box-shadow: 0 0 0 7px rgba(75,107,78,0); } 100% { box-shadow: 0 0 0 0 rgba(75,107,78,0); } }
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
        background: currentTab.bg, borderRadius: typeof window !== 'undefined' && window.innerWidth >= 700 ? 32 : 0,
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
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.05em', color: ink3,
          }}>
            matched
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4B6B4E', animation: 'pulse-live 2.8s ease-out infinite' }}/>
          </div>
        </div>

        {/* Title */}
        <div style={{ padding: '16px 26px 0', flexShrink: 0 }}>
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
        {availableTabs.length > 1 && (
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
        )}

        {/* Panel */}
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <div key={activeTab} className="calming-panel" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>

            {activeTab === 'now' && (
              <div style={{ padding: '28px 26px 30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.24em',
                  textTransform: 'uppercase', color: currentTab.accent, marginBottom: 14,
                }}>what to do right now</div>

                <div className="calming-content" style={{ flex: 0 }}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(mainContent) }}
                />

                {/* Breathing exercise */}
                <BreathingExercise accentColor={currentTab.accent} />

                {/* What your brain just did */}
                {brain && (
                  <ExpandSection label="what your brain just did">
                    <DeepBlock label="your body" text={brain.body} accentColor={currentTab.accent} />
                    <DeepBlock label="your brain" text={brain.brain} accentColor={currentTab.accent} />
                    <DeepBlock label="what this did" text={brain.effect} accentColor={currentTab.accent} />
                  </ExpandSection>
                )}
              </div>
            )}

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
                  Understanding what happens when <strong style={{ color: currentTab.accent, fontVariationSettings: '"opsz" 28, "wght" 700' }}>this moment</strong> shows up.
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
                  }}>Read the full guide &#8594;</span>
                </a>

                {relatedGuides && relatedGuides.length > 1 && (
                  <ExpandSection label="related guides">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                      {relatedGuides.slice(1).map(g => (
                        <a key={g.id} href={'/guides/' + g.id} style={{
                          padding: '14px 0', borderBottom: '1px solid rgba(25,23,20,0.07)',
                          textDecoration: 'none', display: 'block',
                          fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 16, "wght" 380',
                          fontSize: 15, lineHeight: 1.45, color: ink2,
                        }}>{g.title}</a>
                      ))}
                    </div>
                  </ExpandSection>
                )}
              </div>
            )}

            {activeTab === 'kid' && (
              <div style={{ padding: '28px 26px 30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  width: 58, height: 58, borderRadius: 17,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: currentTab.iconBg, marginBottom: 26, flexShrink: 0,
                }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={currentTab.accent} strokeWidth="1.5" strokeLinecap="round">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  </svg>
                </div>
                <div style={{
                  fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 28, "wght" 460',
                  fontSize: 22, lineHeight: 1.34, letterSpacing: '-0.015em', color: ink, marginBottom: 20,
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

        {/* Footer */}
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

