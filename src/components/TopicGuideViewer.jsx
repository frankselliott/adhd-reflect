import { useState } from 'react';

function renderMarkdown(md) {
  if (!md) return '';
  return md
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+?)\*/g, '<em>$1</em>')
    .split('\n\n')
    .map(block => {
      block = block.trim();
      if (!block) return '';
      return '<p>' + block.replace(/\n/g, '<br/>') + '</p>';
    })
    .join('');
}

const ink = '#191714', ink2 = '#6B6358', ink3 = '#A09589';

function Section({ label, accentColor, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderTop: '1px solid rgba(25,23,20,0.06)', marginTop: 8 }}>
      <button onClick={() => setOpen(!open)} style={{
        appearance: 'none', border: 0, background: 'transparent', width: '100%',
        padding: '18px 0', display: 'flex', alignItems: 'center', gap: 10,
        cursor: 'pointer', textAlign: 'left',
        fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 18, "wght" 480',
        fontSize: 17, color: open ? ink : ink2,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accentColor || ink3} strokeWidth="2" strokeLinecap="round"
          style={{ flexShrink: 0, transition: 'transform 300ms ease', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>
          <path d="M9 6l6 6-6 6"/>
        </svg>
        {label}
      </button>
      <div style={{
        overflow: 'hidden', maxHeight: open ? 5000 : 0, opacity: open ? 1 : 0,
        transition: 'max-height 500ms cubic-bezier(.4,0,.2,1), opacity 300ms ease',
      }}>
        <div style={{ paddingBottom: 24 }}>{children}</div>
      </div>
    </div>
  );
}

export default function TopicGuideViewer({ guide, relatedCardTitles }) {
  if (!guide) return null;

  const accent = '#4B6B4E';

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 96px' }}>
      {/* Header */}
      <div style={{ paddingTop: 40, marginBottom: 32 }}>
        <a href="/guides" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--mono)', fontSize: 12, color: ink3,
          textDecoration: 'none', marginBottom: 16,
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 6l-6 6 6 6"/></svg>
          all guides
        </a>

        <div style={{
          display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14,
        }}>
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
            textTransform: 'lowercase', color: accent,
            padding: '4px 10px', borderRadius: 100,
            background: 'rgba(75,107,78,0.08)',
          }}>{guide.topic}</span>
          {guide.patternTypes?.map(p => (
            <span key={p} style={{
              fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
              textTransform: 'lowercase', color: ink3,
              padding: '4px 10px', borderRadius: 100,
              border: '1px solid rgba(25,23,20,0.08)',
            }}>{p}</span>
          ))}
        </div>

        <h1 style={{
          fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 36, "wght" 380',
          fontSize: 'clamp(26px, 4vw, 36px)', lineHeight: 1.15,
          color: ink, marginBottom: 16,
        }}>{guide.title}</h1>

        {/* The thing you recognise */}
        <div style={{
          background: 'rgba(75,107,78,0.05)', borderRadius: 14, padding: '20px 22px',
          borderLeft: '3px solid ' + accent,
        }}>
          <p style={{
            fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 18, "wght" 420',
            fontSize: 17, lineHeight: 1.55, color: ink, margin: 0,
          }}>{guide.recognize}</p>
        </div>
      </div>

      {/* Main sections */}
      <Section label="What is happening in your brain" accentColor={accent} defaultOpen={true}>
        <div className="guide-prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(guide.brain) }} />
      </Section>

      <Section label="What is happening in your child's brain" accentColor="#3F6178">
        <div className="guide-prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(guide.kidBrain) }} />
      </Section>

      <Section label="The dual-ADHD dynamic" accentColor="#9B8BB4">
        <div className="guide-prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(guide.dualDynamic) }} />
      </Section>

      <Section label="What actually works" accentColor={accent} defaultOpen={true}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {guide.strategies?.map((s, i) => (
            <div key={i} style={{
              background: 'rgba(75,107,78,0.04)', borderRadius: 12, padding: '16px 18px',
              display: 'flex', gap: 14, alignItems: 'flex-start',
            }}>
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 600,
                color: accent, flexShrink: 0, marginTop: 2,
              }}>{i + 1}</span>
              <p style={{
                fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 16, "wght" 400',
                fontSize: 16, lineHeight: 1.6, color: ink2, margin: 0,
              }}>{s}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Scripts" accentColor="#B85038">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {guide.scripts?.map((sc, i) => (
            <div key={i} style={{
              background: 'rgba(25,23,20,0.03)', borderRadius: 12, padding: '16px 18px',
            }}>
              <div style={{
                fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
                textTransform: 'lowercase', color: ink3, marginBottom: 8,
              }}>{sc.situation}</div>
              <p style={{
                fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 18, "wght" 460',
                fontSize: 18, lineHeight: 1.45, color: ink, fontStyle: 'italic', margin: 0,
              }}>"{sc.say}"</p>
            </div>
          ))}
        </div>
      </Section>

      <Section label="What your partner needs to know" accentColor="#3F6178">
        <div style={{
          background: 'rgba(63,97,120,0.05)', borderRadius: 14, padding: '18px 20px',
        }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
            textTransform: 'lowercase', color: '#3F6178', marginBottom: 10,
          }}>share this section with your co-parent</div>
          <div className="guide-prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(guide.partner) }} />
        </div>
      </Section>

      <Section label="When to get more help" accentColor="#B85038">
        <div className="guide-prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(guide.moreHelp) }} />
      </Section>

      {/* Related cards */}
      {relatedCardTitles && relatedCardTitles.length > 0 && (
        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(25,23,20,0.06)' }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
            textTransform: 'lowercase', color: ink3, marginBottom: 14,
          }}>related in-the-moment cards</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {relatedCardTitles.map(c => (
              <a key={c.id} href={'/cards/' + c.id} style={{
                padding: '12px 16px', borderRadius: 10,
                border: '1px solid rgba(25,23,20,0.06)',
                textDecoration: 'none', display: 'block',
                fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 16, "wght" 400',
                fontSize: 15, lineHeight: 1.4, color: ink2,
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(25,23,20,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >{c.title}</a>
            ))}
          </div>
        </div>
      )}

      {/* Safety */}
      <p style={{
        fontSize: 12, lineHeight: 1.5, color: ink3, opacity: 0.5,
        marginTop: 40, paddingTop: 20, borderTop: '1px solid rgba(25,23,20,0.06)',
      }}>
        Not medical advice. <a href="/legal/safety" style={{ color: ink3 }}>Crisis support</a>
      </p>
    </div>
  );
}

