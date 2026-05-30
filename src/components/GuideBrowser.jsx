import { useState } from 'react';

const TOPICS = [
  { key: 'all', label: 'All guides' },
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

  const filtered = guides.filter(g => {
    if (topicFilter !== 'all' && g.topic !== topicFilter) return false;
    if (patternFilter !== 'all' && !g.patternTypes?.includes(patternFilter)) return false;
    return true;
  });

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>

      {/* Pattern filter */}
      <div style={{ marginBottom: 12 }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
          textTransform: 'lowercase', color: ink3, marginBottom: 8,
        }}>by pattern</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {PATTERNS.map(p => (
            <button key={p.key} onClick={() => setPatternFilter(p.key)}
              style={{
                appearance: 'none', cursor: 'pointer',
                padding: '6px 14px', borderRadius: 100,
                border: patternFilter === p.key ? '1.5px solid ' + accent : '1.5px solid rgba(25,23,20,0.08)',
                background: patternFilter === p.key ? accent + '10' : 'transparent',
                color: patternFilter === p.key ? accent : ink3,
                fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.04em',
                transition: 'all 0.15s',
              }}>{p.label}</button>
          ))}
        </div>
      </div>

      {/* Topic filter */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
          textTransform: 'lowercase', color: ink3, marginBottom: 8,
        }}>by topic</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {TOPICS.filter(t => t.key === 'all' || guides.some(g => g.topic === t.key)).map(t => (
            <button key={t.key} onClick={() => setTopicFilter(t.key)}
              style={{
                appearance: 'none', cursor: 'pointer',
                padding: '6px 14px', borderRadius: 100,
                border: topicFilter === t.key ? '1.5px solid #3F6178' : '1.5px solid rgba(25,23,20,0.08)',
                background: topicFilter === t.key ? 'rgba(63,97,120,0.08)' : 'transparent',
                color: topicFilter === t.key ? '#3F6178' : ink3,
                fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.04em',
                transition: 'all 0.15s',
              }}>{t.label}</button>
          ))}
        </div>
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
        {filtered.map(g => (
          <a key={g.id} href={'/guides/' + g.id}
            style={{
              background: 'white', borderRadius: 16,
              border: '1px solid rgba(25,23,20,0.06)',
              padding: '20px 22px', textDecoration: 'none', color: 'inherit',
              display: 'block', transition: 'box-shadow 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(25,23,20,0.07)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
          >
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.14em',
                textTransform: 'lowercase', color: accent,
                padding: '3px 8px', borderRadius: 100,
                background: 'rgba(75,107,78,0.08)',
              }}>{g.topic}</span>
              {g.patternTypes?.map(p => (
                <span key={p} style={{
                  fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.14em',
                  textTransform: 'lowercase', color: ink3,
                  padding: '3px 8px', borderRadius: 100,
                  border: '1px solid rgba(25,23,20,0.06)',
                }}>{p}</span>
              ))}
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
        ))}
      </div>
    </div>
  );
}

