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

