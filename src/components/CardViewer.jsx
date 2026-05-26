import { useState } from 'react';

// Simple markdown-to-HTML for card content
function renderMarkdown(md) {
  if (!md) return '';
  let html = md
    // Horizontal rules
    .replace(/^---$/gm, '<hr/>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*([^*]+?)\*/g, '<em>$1</em>')
    // H4 (subset headings in content)
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    // H3 subset
    .replace(/^\*\*(.+?)\*\*$/gm, '<p class="cv-subhead"><strong>$1</strong></p>')
    // Paragraphs
    .split('\n\n')
    .map(block => {
      block = block.trim();
      if (!block) return '';
      if (block.startsWith('<h') || block.startsWith('<hr') || block.startsWith('<p class="cv-subhead"')) return block;
      return `<p>${block.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('');
  return html;
}

// Parse moment card tab into Right Now and Understand It sections
function parseTabSections(content) {
  if (!content) return { rightNow: '', understand: '' };
  
  const parts = content.split(/\*\*UNDERSTAND IT\*\*/);
  let rightNow = parts[0] || '';
  let understand = parts[1] || '';
  
  // Clean up RIGHT NOW header
  rightNow = rightNow.replace(/\*\*RIGHT NOW\*\*/, '').trim();
  // Remove leading ---
  rightNow = rightNow.replace(/^---\s*/, '').trim();
  understand = understand.replace(/^---\s*/, '').trim();
  
  return { rightNow, understand };
}

// Parse parent-only/kid-only single content
function parseSingleContent(content) {
  if (!content) return { rightNow: '', understand: '' };
  
  // Remove title line if present
  let cleaned = content.replace(/^## .+$/m, '').trim();
  cleaned = cleaned.replace(/^---\s*/, '').trim();
  
  // Check if it has RIGHT NOW / UNDERSTAND IT structure
  if (cleaned.includes('**UNDERSTAND IT**')) {
    const parts = cleaned.split(/\*\*UNDERSTAND IT\*\*/);
    let rightNow = parts[0].replace(/\*\*RIGHT NOW\*\*/, '').trim().replace(/^---\s*/, '').trim();
    let understand = parts[1] ? parts[1].replace(/^---\s*/, '').trim() : '';
    return { rightNow, understand };
  }
  
  // No sections, just content
  return { rightNow: '', understand: cleaned };
}

const COLORS = {
  now: { bg: 'rgba(74,111,165,0.04)', accent: '#4A6FA5', label: 'Right now' },
  why: { bg: 'rgba(168,195,160,0.06)', accent: '#7FA88E', label: 'Understand it' },
  kid: { bg: 'rgba(155,139,180,0.05)', accent: '#9B8BB4', label: 'Your kid' },
};

export default function CardViewer({ cardId, cardType, title, category, parentTab, kidTab, content }) {
  const isMoment = cardType === 'moment';
  
  // Determine available tabs
  let tabs = [];
  let tabContent = {};
  
  if (isMoment && parentTab) {
    const parentSections = parseTabSections(parentTab);
    const kidSections = kidTab ? parseTabSections(kidTab) : { rightNow: '', understand: '' };
    
    tabs = [
      { key: 'now', ...COLORS.now },
      { key: 'why', ...COLORS.why },
      { key: 'kid', ...COLORS.kid },
    ];
    tabContent = {
      now: parentSections.rightNow,
      why: parentSections.understand,
      kid: kidSections.rightNow + (kidSections.understand ? '\n\n---\n\n' + kidSections.understand : ''),
    };
  } else if (content) {
    const sections = parseSingleContent(content);
    if (sections.rightNow) {
      tabs = [
        { key: 'now', ...COLORS.now },
        { key: 'why', ...COLORS.why },
      ];
      tabContent = {
        now: sections.rightNow,
        why: sections.understand,
      };
    } else {
      tabs = [{ key: 'why', ...COLORS.why, label: 'Read' }];
      tabContent = { why: sections.understand };
    }
  }
  
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || 'now');
  const currentTab = tabs.find(t => t.key === activeTab) || tabs[0];
  
  const typeLabel = { moment: 'Moment guide', parent: 'Parent guide', kid: 'Kid guide' }[cardType];
  const typeColor = { moment: '#4A6FA5', parent: '#9B8BB4', kid: '#A8C3A0' }[cardType];
  
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px 96px' }}>
      {/* Header */}
      <div style={{ paddingTop: 48, marginBottom: 32 }}>
        <a href="/cards" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--pewter)',
          textDecoration: 'none', marginBottom: 16,
        }}>
          ← All guides
        </a>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: typeColor, marginBottom: 12,
          marginLeft: 16,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: typeColor }} />
          {typeLabel}
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontSize: 'clamp(24px, 4vw, 36px)',
          fontWeight: 300, lineHeight: 1.2, color: 'var(--slate)',
          fontVariationSettings: '"opsz" 40',
        }}>
          {title}
        </h1>
      </div>
      
      {/* Tabs */}
      {tabs.length > 1 && (
        <div style={{
          display: 'flex', gap: 4, marginBottom: 24,
          background: 'rgba(31,42,55,0.04)', borderRadius: 12, padding: 4,
        }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1, padding: '10px 16px', borderRadius: 10,
                border: 'none', cursor: 'pointer',
                fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500,
                background: activeTab === tab.key ? 'white' : 'transparent',
                color: activeTab === tab.key ? tab.accent : 'var(--pewter)',
                boxShadow: activeTab === tab.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s ease',
                minHeight: 44,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
      
      {/* Content */}
      <div
        className="cv-content"
        style={{
          background: currentTab?.bg || 'white',
          borderRadius: 16, padding: 'clamp(20px, 4vw, 32px)',
          border: '1px solid rgba(31,42,55,0.06)',
          transition: 'background 0.3s ease',
        }}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(tabContent[activeTab] || '') }}
      />
      
      {/* Safety note */}
      <p style={{
        fontSize: 13, lineHeight: 1.55, color: 'var(--pewter)', opacity: 0.5,
        marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(31,42,55,0.06)',
      }}>
        This is not medical advice. If you or your child are in crisis, <a href="/legal/safety" style={{ color: 'var(--pewter)' }}>find support here</a>.
      </p>
    </div>
  );
}

