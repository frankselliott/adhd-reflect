import { useState } from 'react';
import { CARDS, CARD_TYPES } from '../data/cards.js';

const typeFilters = [
  { key: 'all', label: 'All cards' },
  { key: 'moment', label: 'Moment', color: '#4A6FA5' },
  { key: 'parent', label: 'Parent', color: '#9B8BB4' },
  { key: 'kid', label: 'Kid', color: '#A8C3A0' },
];

export default function CardBrowser() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? CARDS : CARDS.filter(c => c.type === filter);

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {typeFilters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 100,
              border: filter === f.key ? '1.5px solid var(--slate)' : '1.5px solid rgba(31,42,55,0.08)',
              background: filter === f.key ? 'var(--slate)' : 'white',
              color: filter === f.key ? 'white' : 'var(--pewter)',
              fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.18s', whiteSpace: 'nowrap',
            }}
          >
            {f.color && (
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: f.color, display: 'inline-block' }} />
            )}
            {f.label}
          </button>
        ))}
      </div>

      {/* Count */}
      <p style={{
        fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.12em',
        color: 'var(--pewter)', opacity: 0.7, marginBottom: 20,
      }}>
        {filtered.length} card{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Card grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16, paddingBottom: 80,
      }}>
        {filtered.map(card => (
          <div
            key={card.id}
            style={{
              background: 'white', borderRadius: 16,
              border: '1px solid rgba(31,42,55,0.08)',
              padding: 24, display: 'flex', flexDirection: 'column', gap: 10,
              transition: 'box-shadow 0.2s, transform 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 24px rgba(31,42,55,0.09)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
          >
            {/* Type badge */}
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: CARD_TYPES[card.type].color,
              alignSelf: 'flex-start',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: CARD_TYPES[card.type].color }} />
              {CARD_TYPES[card.type].label}
            </span>

            {/* Title */}
            <h3 style={{
              fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 400,
              lineHeight: 1.35, color: 'var(--slate)', margin: 0,
              fontVariationSettings: '"opsz" 24',
            }}>
              {card.title}
            </h3>

            {/* Category */}
            <span style={{
              fontSize: 13, color: 'var(--pewter)', opacity: 0.6,
              textTransform: 'capitalize',
            }}>
              {card.category.replace(/-/g, ' ')}
            </span>

            {/* Coming soon indicator */}
            <span style={{
              fontSize: 12, color: 'var(--pewter)', opacity: 0.4,
              fontFamily: 'var(--mono)', letterSpacing: '0.08em',
              marginTop: 'auto', paddingTop: 4,
            }}>
              Coming soon
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
