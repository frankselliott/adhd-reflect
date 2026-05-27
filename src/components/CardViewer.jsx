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

export default function CardViewer({ cardId, cardType, title, parentNow, kidNow, content }) {
  const isMoment = cardType === 'moment';
  
  const tabs = [];
  const tabContent = {};
  
  if (isMoment && parentNow) {
    tabs.push({ key: 'you', label: 'Right now', accent: '#4A6FA5' });
    if (kidNow) {
      tabs.push({ key: 'kid', label: 'Your kid', accent: '#9B8BB4' });
    }
    tabContent.you = parentNow;
    tabContent.kid = kidNow || '';
  } else if (content) {
    tabs.push({ key: 'you', label: 'Right now', accent: '#4A6FA5' });
    tabContent.you = content;
  }
  
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || 'you');
  const typeColor = { moment: '#4A6FA5', parent: '#9B8BB4', kid: '#A8C3A0' }[cardType];
  const typeLabel = { moment: 'Moment', parent: 'Parent', kid: 'Kid' }[cardType];

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px 64px' }}>
      <div style={{ paddingTop: 40, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: typeColor,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: typeColor }} />
            {typeLabel}
          </span>
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontSize: 'clamp(22px, 4vw, 32px)',
          fontWeight: 300, lineHeight: 1.2, color: 'var(--slate)',
          fontVariationSettings: '"opsz" 36', marginBottom: 0,
        }}>
          {title}
        </h1>
      </div>

      {tabs.length > 1 && (
        <div style={{
          display: 'flex', gap: 4, marginBottom: 20,
          background: 'rgba(31,42,55,0.04)', borderRadius: 10, padding: 3,
        }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1, padding: '9px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500,
                background: activeTab === tab.key ? 'white' : 'transparent',
                color: activeTab === tab.key ? tab.accent : 'var(--pewter)',
                boxShadow: activeTab === tab.key ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease', minHeight: 40,
              }}
            >{tab.label}</button>
          ))}
        </div>
      )}

      <div className="card-content"
        style={{
          background: 'rgba(74,111,165,0.03)', borderRadius: 14,
          padding: 'clamp(18px, 4vw, 28px)', border: '1px solid rgba(74,111,165,0.06)',
        }}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(tabContent[activeTab] || '') }}
      />

      <a href={`/guides/${cardId}`}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 16, padding: '14px 18px', background: 'white', borderRadius: 12,
          border: '1px solid rgba(31,42,55,0.06)', textDecoration: 'none', color: 'var(--slate)',
          fontFamily: 'var(--sans)', fontSize: 15, transition: 'border-color 0.2s',
        }}
      >
        <span>
          <span style={{ fontWeight: 500 }}>Understand why this happens</span><br/>
          <span style={{ fontSize: 13, color: 'var(--pewter)' }}>Read the full guide</span>
        </span>
        <span style={{ color: 'var(--pewter)', fontSize: 18 }}>→</span>
      </a>

      <p style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--pewter)', opacity: 0.4, marginTop: 24 }}>
        Not medical advice. <a href="/legal/safety" style={{ color: 'var(--pewter)' }}>Crisis support</a>
      </p>
    </div>
  );
}

