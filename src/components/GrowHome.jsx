import { useState, useEffect } from 'react';
import { MODULES, PATTERN_SUGGESTIONS, getNextSuggestion } from '../data/growModules.js';

const BRAND = {
  blue: '#4A6FA5',
  sage: '#A8C3A0',
  cloud: '#F7F5F0',
  slate: '#1F2A37',
  pewter: '#56606E',
  mist: '#EDEFEE',
  apricot: '#E8A87C',
  lavender: '#9B8BB4',
};

const LAYER_LABELS = {
  foundation: 'Foundation — start here',
  pattern: 'Your pattern',
  household: 'The wider household',
};

const LAYER_ORDER = ['foundation', 'pattern', 'household'];

function KitchenScene({ completedCount }) {
  const pct = Math.min(completedCount / 20, 1);
  const warmth = Math.round(pct * 30);
  const bgColor = `hsl(40, ${20 + warmth}%, ${93 - warmth * 0.3}%)`;
  
  const elements = [
    { at: 1, type: 'plant' },
    { at: 3, type: 'chair2' },
    { at: 5, type: 'mug' },
    { at: 7, type: 'drawing' },
    { at: 9, type: 'book' },
    { at: 11, type: 'coat' },
    { at: 13, type: 'shoes' },
    { at: 15, type: 'mug2' },
    { at: 17, type: 'plant2' },
    { at: 20, type: 'warmlight' },
  ];

  const visible = elements.filter(e => completedCount >= e.at);

  return (
    <div style={{
      background: bgColor,
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '32px',
      transition: 'background 1s ease',
      border: '1px solid rgba(31,42,55,0.06)',
    }}>
      <svg viewBox="0 0 400 180" style={{ width: '100%', display: 'block' }}>
        {/* Floor */}
        <rect x="0" y="140" width="400" height="40" fill="rgba(31,42,55,0.05)" rx="2"/>
        {/* Table */}
        <rect x="120" y="100" width="160" height="8" fill="rgba(31,42,55,0.15)" rx="2"/>
        <rect x="130" y="108" width="8" height="32" fill="rgba(31,42,55,0.1)" rx="1"/>
        <rect x="262" y="108" width="8" height="32" fill="rgba(31,42,55,0.1)" rx="1"/>
        {/* Chair 1 */}
        <rect x="80" y="110" width="40" height="6" fill="rgba(74,111,165,0.2)" rx="2"/>
        <rect x="85" y="116" width="6" height="24" fill="rgba(74,111,165,0.15)" rx="1"/>
        <rect x="109" y="116" width="6" height="24" fill="rgba(74,111,165,0.15)" rx="1"/>
        {/* Window */}
        <rect x="300" y="20" width="80" height="90" fill={`rgba(74,111,165,${0.08 + pct * 0.12})`} rx="4"/>
        <line x1="340" y1="20" x2="340" y2="110" stroke="rgba(31,42,55,0.1)" strokeWidth="1"/>
        <line x1="300" y1="65" x2="380" y2="65" stroke="rgba(31,42,55,0.1)" strokeWidth="1"/>

        {/* Progressive elements */}
        {visible.find(e => e.type === 'plant') && (
          <g>
            <rect x="30" y="100" width="12" height="16" fill="rgba(168,195,160,0.4)" rx="2"/>
            <ellipse cx="36" cy="98" rx="10" ry="12" fill="rgba(168,195,160,0.6)"/>
          </g>
        )}
        {visible.find(e => e.type === 'chair2') && (
          <g>
            <rect x="280" y="110" width="40" height="6" fill="rgba(74,111,165,0.2)" rx="2"/>
            <rect x="285" y="116" width="6" height="24" fill="rgba(74,111,165,0.15)" rx="1"/>
            <rect x="309" y="116" width="6" height="24" fill="rgba(74,111,165,0.15)" rx="1"/>
          </g>
        )}
        {visible.find(e => e.type === 'mug') && (
          <g>
            <rect x="185" y="88" width="14" height="12" fill="rgba(232,168,124,0.5)" rx="2"/>
            <path d="M199 91 Q204 91 204 94 Q204 97 199 97" stroke="rgba(232,168,124,0.5)" strokeWidth="2" fill="none"/>
          </g>
        )}
        {visible.find(e => e.type === 'drawing') && (
          <g>
            <rect x="10" y="40" width="36" height="28" fill="rgba(155,139,180,0.2)" rx="2"/>
            <rect x="13" y="43" width="30" height="22" fill="white" opacity="0.7" rx="1"/>
            <circle cx="22" cy="52" r="4" fill="rgba(232,168,124,0.4)"/>
            <line x1="18" y1="60" x2="36" y2="60" stroke="rgba(74,111,165,0.3)" strokeWidth="1.5"/>
            <line x1="18" y1="56" x2="32" y2="56" stroke="rgba(74,111,165,0.3)" strokeWidth="1"/>
          </g>
        )}
        {visible.find(e => e.type === 'book') && (
          <rect x="145" y="88" width="24" height="12" fill="rgba(155,139,180,0.4)" rx="1"/>
        )}
        {visible.find(e => e.type === 'warmlight') && (
          <ellipse cx="340" cy="65" rx="30" ry="20" fill={`rgba(232,168,124,${pct * 0.15})`}/>
        )}
      </svg>

      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '11px',
        letterSpacing: '0.12em',
        color: BRAND.pewter,
        textAlign: 'center',
        marginTop: '8px',
      }}>
        {completedCount === 0 && 'Your household. At the start.'}
        {completedCount > 0 && completedCount < 10 && `${completedCount} of 20 modules done. Something is shifting.`}
        {completedCount >= 10 && completedCount < 20 && `${completedCount} of 20. More than halfway.`}
        {completedCount === 20 && 'All 20 modules. This is what it looks like now.'}
      </div>
    </div>
  );
}

function ModuleCard({ module, completed, isSuggested, isNext }) {
  return (
    <a
      href={`/grow/module/${module.id}`}
      style={{
        display: 'block',
        padding: '16px 20px',
        background: completed ? 'rgba(168,195,160,0.12)' : 'white',
        borderRadius: '12px',
        border: `1px solid ${completed ? 'rgba(168,195,160,0.4)' : 'rgba(31,42,55,0.08)'}`,
        textDecoration: 'none',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        position: 'relative',
        outline: isNext ? `2px solid ${BRAND.blue}` : 'none',
        outlineOffset: '2px',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(31,42,55,0.08)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          border: `1.5px solid ${completed ? BRAND.sage : 'rgba(31,42,55,0.2)'}`,
          background: completed ? BRAND.sage : 'transparent',
          flexShrink: 0,
          marginTop: '1px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {completed && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'Lexend', sans-serif",
            fontSize: '14px',
            color: completed ? BRAND.pewter : BRAND.slate,
            lineHeight: 1.4,
            marginBottom: '2px',
          }}>
            {module.title}
          </div>
          <div style={{
            fontFamily: "'Lexend', sans-serif",
            fontSize: '12px',
            color: BRAND.pewter,
            opacity: 0.8,
          }}>
            {module.tagline}
          </div>
        </div>
        {isNext && (
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '9px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: BRAND.blue,
            background: 'rgba(74,111,165,0.08)',
            padding: '3px 8px',
            borderRadius: '4px',
            flexShrink: 0,
          }}>
            Next
          </div>
        )}
      </div>
    </a>
  );
}

export function GrowHome() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/grow/progress')
      .then(r => {
        if (!r.ok) {
          window.location.href = '/grow?auth=required';
          return null;
        }
        return r.json();
      })
      .then(data => {
        if (data) {
          setUserData(data);
          setLoading(false);
        }
      })
      .catch(() => {
        setError('Could not load your progress. Try refreshing.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '64px 24px', textAlign: 'center', fontFamily: "'Lexend', sans-serif", color: BRAND.pewter }}>
        Loading your program...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '64px 24px', textAlign: 'center', fontFamily: "'Lexend', sans-serif", color: BRAND.pewter }}>
        {error}
      </div>
    );
  }

  const { pattern, progress = {}, completedCount = 0 } = userData;
  const completedIds = Object.keys(progress);
  const nextModule = getNextSuggestion(completedIds, pattern);
  const suggestions = PATTERN_SUGGESTIONS[pattern] || PATTERN_SUGGESTIONS.reactor;
  const foundationDone = ['m1','m2','m3','m4','m5'].every(id => completedIds.includes(id));
  const showMidCheckin = completedCount >= 10 && !userData.midCourseCheckin;

  const modulesByLayer = LAYER_ORDER.reduce((acc, layer) => {
    acc[layer] = MODULES.filter(m => m.layer === layer);
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px 80px' }}>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '10px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: BRAND.blue,
          marginBottom: '8px',
        }}>
          Both of You
        </div>
        <h1 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: '28px',
          fontWeight: 300,
          color: BRAND.slate,
          marginBottom: '8px',
          fontVariationSettings: "'opsz' 36",
        }}>
          {completedCount === 0 ? 'Your program starts here.' : 'Welcome back.'}
        </h1>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '12px',
          color: BRAND.pewter,
        }}>
          {completedCount} of 20 modules done
          {pattern && ` · ${pattern.charAt(0).toUpperCase() + pattern.slice(1)} pattern`}
        </div>
      </div>

      {/* Kitchen scene */}
      <KitchenScene completedCount={completedCount} />

      {/* Mid-course check-in prompt */}
      {showMidCheckin && (
        <a href="/grow/checkin" style={{
          display: 'block',
          padding: '20px',
          background: 'rgba(74,111,165,0.06)',
          borderRadius: '12px',
          border: `2px solid ${BRAND.blue}`,
          textDecoration: 'none',
          marginBottom: '32px',
          textAlign: 'center',
        }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: '18px', color: BRAND.slate, marginBottom: '4px', fontWeight: 300 }}>
            Halfway. Three questions.
          </div>
          <div style={{ fontFamily: "'Lexend', sans-serif", fontSize: '13px', color: BRAND.pewter }}>
            Ten modules done. Before you continue, take a moment.
          </div>
        </a>
      )}

      {/* Next suggestion */}
      {nextModule && !showMidCheckin && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: BRAND.pewter,
            marginBottom: '12px',
          }}>
            {foundationDone ? 'Suggested next' : 'Start here'}
          </div>
          <ModuleCard
            module={nextModule}
            completed={completedIds.includes(nextModule.id)}
            isSuggested={true}
            isNext={true}
          />
        </div>
      )}

      {/* Module layers */}
      {LAYER_ORDER.map(layer => (
        <div key={layer} style={{ marginBottom: '40px' }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: BRAND.pewter,
            marginBottom: '12px',
          }}>
            {LAYER_LABELS[layer]}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {modulesByLayer[layer].map(module => (
              <ModuleCard
                key={module.id}
                module={module}
                completed={completedIds.includes(module.id)}
                isSuggested={suggestions.includes(module.id)}
                isNext={false}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Completion */}
      {completedCount === 20 && (
        <a href="/grow/summary" style={{
          display: 'block',
          padding: '32px',
          background: `linear-gradient(135deg, rgba(74,111,165,0.08), rgba(168,195,160,0.1))`,
          borderRadius: '16px',
          border: `1px solid rgba(74,111,165,0.2)`,
          textDecoration: 'none',
          textAlign: 'center',
          marginTop: '8px',
        }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: '24px', color: BRAND.slate, marginBottom: '8px', fontWeight: 300 }}>
            All 20 modules done.
          </div>
          <div style={{ fontFamily: "'Lexend', sans-serif", fontSize: '14px', color: BRAND.pewter, marginBottom: '16px' }}>
            Your summary card is ready.
          </div>
          <div style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: BRAND.blue,
            color: 'white',
            borderRadius: '100px',
            fontFamily: "'Lexend', sans-serif",
            fontSize: '14px',
          }}>
            View your summary card
          </div>
        </a>
      )}

      {/* Script Library link */}
      <div style={{ marginTop: '16px', paddingTop: '20px', borderTop: '1px solid rgba(31,42,55,0.07)', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <a href="/grow/scripts" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4A6FA5', textDecoration: 'none' }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="1" width="11" height="11" rx="2" stroke="#4A6FA5" strokeWidth="1.2"/><path d="M3.5 4.5h6M3.5 6.5h4" stroke="#4A6FA5" strokeWidth="1.2" strokeLinecap="round"/></svg>
          Script library
        </a>
        <span style={{ color: 'rgba(86,96,110,0.3)', fontSize: '10px' }}>·</span>
        <a href="/both-of-you-script-library.pdf" download style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7FA88E', textDecoration: 'none' }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v6M6.5 8l-2-2M6.5 8l2-2" stroke="#7FA88E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M1.5 10h10" stroke="#7FA88E" strokeWidth="1.2" strokeLinecap="round"/></svg>
          Download PDF
        </a>
      </div>
    </div>
  );
}