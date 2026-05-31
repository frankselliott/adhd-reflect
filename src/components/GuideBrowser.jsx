import { useState, useEffect } from 'react';
import { PATTERN_ICONS, PATTERN_COLORS } from './PatternIcons.jsx';

const TOPICS = [
  { key: 'all', label: 'All' },
  { key: 'nervous-system', label: 'Nervous system' },
  { key: 'executive-function', label: 'Executive function' },
  { key: 'emotional-regulation', label: 'Emotional regulation' },
  { key: 'dual-adhd', label: 'Dual ADHD' },
  { key: 'medication', label: 'Medication' },
  { key: 'sensory', label: 'Sensory' },
  { key: 'transitions', label: 'Transitions' },
  { key: 'sleep', label: 'Sleep' },
  { key: 'repair', label: 'Repair' },
  { key: 'relationships', label: 'Relationships' },
  { key: 'social', label: 'Social' },
  { key: 'school', label: 'School' },
  { key: 'identity', label: 'Identity' },
  { key: 'burnout', label: 'Burnout' },
  { key: 'communication', label: 'Communication' },
  { key: 'support', label: 'Getting help' },
];

const PERSPECTIVES = [
  { key: 'all', label: 'All' },
  { key: 'me', label: 'About me' },
  { key: 'kid', label: 'About my kid' },
  { key: 'partner', label: 'About my partner' },
];

const PATTERNS = [
  { key: 'all', label: 'All patterns' },
  { key: 'reactor', label: 'Reactor' },
  { key: 'juggler', label: 'Juggler' },
  { key: 'looper', label: 'Looper' },
  { key: 'spiraller', label: 'Spiraller' },
  { key: 'escaper', label: 'Escaper' },
];

const ink = '#191714', ink2 = '#6B6358', ink3 = '#A09589';
const accent = '#4B6B4E';

export default function GuideBrowser({ guides }) {
  const [topicFilter, setTopicFilter] = useState('all');
  const [patternFilter, setPatternFilter] = useState('all');
  const [perspectiveFilter, setPerspectiveFilter] = useState('all');
  const [myPattern, setMyPattern] = useState(null);

  // Load quiz result from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('adhd-reflect-quiz-result');
      if (stored) {
        const data = JSON.parse(stored);
        setMyPattern(data.primary);
        // Auto-set pattern filter to user's pattern
        if (data.primary) setPatternFilter(data.primary);
      }
    } catch(e) {}
  }, []);

  const filtered = guides.filter(g => {
    if (topicFilter !== 'all' && g.topic !== topicFilter) return false;
    if (patternFilter !== 'all' && !g.patternTypes?.includes(patternFilter)) return false;
    if (perspectiveFilter !== 'all' && !g.perspectives?.includes(perspectiveFilter)) return false;
    return true;
  });

  function FilterPills({ items, active, onSelect, colors }) {
    return (
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {items.filter(t => t.key === 'all' || guides.some(g =>
          t.key === 'all' ? true :
          items === TOPICS ? g.topic === t.key :
          items === PATTERNS ? g.patternTypes?.includes(t.key) :
          g.perspectives?.includes(t.key)
        )).map(t => {
          const isActive = active === t.key;
          const color = colors?.[t.key] || (isActive ? accent : ink3);
          return (
            <button key={t.key} onClick={() => onSelect(t.key)}
              style={{
                appearance: 'none', cursor: 'pointer',
                padding: '6px 14px', borderRadius: 100,
                border: isActive ? '1.5px solid ' + color : '1.5px solid rgba(25,23,20,0.08)',
                background: isActive ? color + '12' : 'transparent',
                color: isActive ? color : ink3,
                fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.04em',
                transition: 'all 0.15s',
              }}>{t.label}{t.key === myPattern ? ' ★' : ''}</button>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>

      {/* My pattern banner */}
      {myPattern && (
        <div style={{
          background: PATTERN_COLORS[myPattern] + '08',
          border: '1px solid ' + PATTERN_COLORS[myPattern] + '20',
          borderRadius: 14, padding: '14px 18px', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          {(() => {
            const Icon = PATTERN_ICONS[myPattern];
            return Icon ? <Icon size={32} color={PATTERN_COLORS[myPattern]} /> : null;
          })()}
          <div>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em',
              color: PATTERN_COLORS[myPattern], textTransform: 'lowercase',
            }}>your pattern</div>
            <div style={{
              fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 16, "wght" 460',
              fontSize: 16, color: ink,
            }}>The {myPattern.charAt(0).toUpperCase() + myPattern.slice(1)}</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button onClick={() => setPatternFilter(patternFilter === myPattern ? 'all' : myPattern)}
              style={{
                appearance: 'none', border: 0, cursor: 'pointer',
                background: PATTERN_COLORS[myPattern], color: 'white',
                fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.04em',
                padding: '7px 14px', borderRadius: 100,
              }}>{patternFilter === myPattern ? 'show all' : 'show mine'}</button>
          </div>
        </div>
      )}

      {/* Perspective filter */}
      <div style={{ marginBottom: 14 }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
          textTransform: 'lowercase', color: ink3, marginBottom: 8,
        }}>who is this about</div>
        <FilterPills items={PERSPECTIVES} active={perspectiveFilter} onSelect={setPerspectiveFilter} />
      </div>

      {/* Pattern filter */}
      <div style={{ marginBottom: 14 }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
          textTransform: 'lowercase', color: ink3, marginBottom: 8,
        }}>by pattern</div>
        <FilterPills items={PATTERNS} active={patternFilter} onSelect={setPatternFilter} colors={PATTERN_COLORS} />
      </div>

      {/* Topic filter */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
          textTransform: 'lowercase', color: ink3, marginBottom: 8,
        }}>by topic</div>
        <FilterPills items={TOPICS} active={topicFilter} onSelect={setTopicFilter} />
      </div>

      {/* Count */}
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.08em',
        color: ink3, marginBottom: 16,
      }}>
        {filtered.length} guide{filtered.length !== 1 ? 's' : ''}
      </div>

      {/* Guide list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 80 }}>
        {filtered.map(g => {
          const isMyPattern = myPattern && g.patternTypes?.includes(myPattern);
          return (
            <a key={g.id} href={'/guides/' + g.id}
              style={{
                background: 'white', borderRadius: 16,
                border: isMyPattern ? '1.5px solid ' + PATTERN_COLORS[myPattern] + '30' : '1px solid rgba(25,23,20,0.06)',
                padding: '20px 22px', textDecoration: 'none', color: 'inherit',
                display: 'block', transition: 'box-shadow 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(25,23,20,0.07)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                {g.perspectives?.map(p => (
                  <span key={p} style={{
                    fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.12em',
                    textTransform: 'lowercase',
                    color: p === 'me' ? '#B85038' : p === 'kid' ? '#4B6B4E' : '#3F6178',
                    padding: '3px 8px', borderRadius: 100,
                    background: p === 'me' ? 'rgba(184,80,56,0.06)' : p === 'kid' ? 'rgba(75,107,78,0.06)' : 'rgba(63,97,120,0.06)',
                  }}>{p === 'me' ? 'about me' : p === 'kid' ? 'about my kid' : 'about my partner'}</span>
                ))}
                {isMyPattern && (
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.12em',
                    color: PATTERN_COLORS[myPattern],
                    padding: '3px 8px', borderRadius: 100,
                    background: PATTERN_COLORS[myPattern] + '10',
                  }}>for you</span>
                )}
              </div>
              <h3 style={{
                fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 20, "wght" 440',
                fontSize: 19, lineHeight: 1.3, color: ink, margin: 0, marginBottom: 8,
              }}>{g.title}</h3>
              <p style={{
                fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 16, "wght" 380',
                fontSize: 15, lineHeight: 1.5, color: ink2, margin: 0,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>{g.recognize}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
}

