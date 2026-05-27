import { useState } from 'react';

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

export default function CardViewer({ cardId, cardType, title, parentNow, kidNow, content, relatedGuides }) {
  const isMoment = cardType === 'moment';
  
  const tabs = [];
  const tabContent = {};
  
  if (isMoment && parentNow) {
    tabs.push({ key: 'you', label: 'Right now', accent: '#4A6FA5' });
    if (kidNow) tabs.push({ key: 'kid', label: 'Your kid', accent: '#9B8BB4' });
    tabContent.you = parentNow;
    tabContent.kid = kidNow || '';
  } else if (content) {
    tabs.push({ key: 'you', label: 'Right now', accent: '#4A6FA5' });
    tabContent.you = content;
  }
  
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || 'you');
  const typeColor = { moment: '#4A6FA5', parent: '#9B8BB4', kid: '#A8C3A0' }[cardType];
  const typeLabel = { moment: 'Moment', parent: 'Parent', kid: 'Kid' }[cardType];

  // Split guides: primary (first) and related (rest)
  const primaryGuide = relatedGuides?.[0] || null;
  const otherGuides = relatedGuides?.slice(1) || [];

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px 64px' }}>
      {/* Header */}
      <div style={{ paddingTop: 40, marginBottom: 24 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: typeColor, marginBottom: 16,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: typeColor }} />
          {typeLabel}
        </span>
        <h1 style={{
          fontFamily: 'var(--serif)', fontSize: 'clamp(22px, 4vw, 32px)',
          fontWeight: 300, lineHeight: 1.2, color: 'var(--slate)',
          fontVariationSettings: '"opsz" 36',
        }}>
          {title}
        </h1>
      </div>

      {/* Tabs */}
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

      {/* Content */}
      <div className="card-content"
        style={{
          background: 'rgba(74,111,165,0.03)', borderRadius: 14,
          padding: 'clamp(18px, 4vw, 28px)', border: '1px solid rgba(74,111,165,0.06)',
        }}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(tabContent[activeTab] || '') }}
      />

      {/* Related guides */}
      {relatedGuides && relatedGuides.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <p style={{
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: '#7FA88E', marginBottom: 12,
          }}>
            Guides to read when you're ready
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {relatedGuides.map((guide, i) => (
              <a key={guide.id} href={'/guides/' + guide.id}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', background: i === 0 ? 'white' : 'transparent',
                  borderRadius: 10,
                  border: i === 0 ? '1px solid rgba(127,168,142,0.15)' : '1px solid rgba(31,42,55,0.04)',
                  textDecoration: 'none', color: 'var(--slate)',
                  fontFamily: 'var(--sans)', fontSize: 14, lineHeight: 1.4,
                  transition: 'background 0.15s',
                }}
              >
                <span style={{ fontWeight: i === 0 ? 500 : 400, color: i === 0 ? 'var(--slate)' : 'var(--pewter)' }}>
                  {guide.title}
                </span>
                <span style={{ color: 'var(--pewter)', fontSize: 14, flexShrink: 0, marginLeft: 8 }}>→</span>
              </a>
            ))}
          </div>
        </div>
      )}

      <p style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--pewter)', opacity: 0.4, marginTop: 24 }}>
        Not medical advice. <a href="/legal/safety" style={{ color: 'var(--pewter)' }}>Crisis support</a>
      </p>
    </div>
  );
}

