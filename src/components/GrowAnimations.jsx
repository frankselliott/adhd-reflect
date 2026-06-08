// GrowAnimations.jsx
// Six animated SVG components for Both of You course modules
// All use IntersectionObserver for scroll-trigger
// Brand palette: blue #4A6FA5, sage #A8C3A0, slate #1F2A37, pewter #56606E,
//               apricot #E8A87C, lavender #9B8BB4, cloud #F7F5F0

import { useState, useEffect, useRef } from 'react';

const B = {
  blue:     '#4A6FA5',
  blueL:    'rgba(74,111,165,0.12)',
  sage:     '#A8C3A0',
  sageD:    '#7FA88E',
  sageL:    'rgba(168,195,160,0.2)',
  slate:    '#1F2A37',
  pewter:   '#56606E',
  pewterL:  'rgba(86,96,110,0.3)',
  mist:     '#EDEFEE',
  apricot:  '#E8A87C',
  apricotL: 'rgba(232,168,124,0.2)',
  lavender: '#9B8BB4',
  cloud:    '#F7F5F0',
  red:      '#C97B6A',
};

function useScrollTrigger(threshold = 0.3) {
  const ref = useRef(null);
  const [triggered, setTriggered] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, triggered];
}

// ─────────────────────────────────────────
// 1. THE CONTAINER — M2, M6
// A container fills with load items, then a spark lands and overflows
// ─────────────────────────────────────────
export function ContainerAnimation() {
  const [ref, go] = useScrollTrigger(0.4);
  const items = [
    { label: 'noise since 4pm', delay: 0 },
    { label: 'instruction × 3', delay: 0.6 },
    { label: 'work unresolved', delay: 1.2 },
    { label: 'medication worn off', delay: 1.8 },
    { label: 'haven\'t eaten', delay: 2.4 },
  ];
  return (
    <div ref={ref} className="anim-wrap" aria-label="The stack that fills before the spark">
      <div className="anim-label-top">The stack fills before the spark lands</div>
      <svg viewBox="0 0 320 220" style={{ width: '100%', display: 'block' }}>
        {/* Container outline */}
        <rect x="80" y="60" width="160" height="130" rx="8"
          fill="white" stroke={B.pewterL} strokeWidth="1.5"/>
        {/* Fill level — animates up */}
        <rect x="81" y="61" width="158" height="128" rx="7" fill={B.cloud}/>

        {/* Load items filling from bottom */}
        {items.map((item, i) => (
          <g key={i} style={{
            opacity: go ? 1 : 0,
            transform: go ? 'translateY(0)' : 'translateY(12px)',
            transition: `opacity 0.4s ${item.delay + 0.3}s, transform 0.4s ${item.delay + 0.3}s`,
          }}>
            <rect
              x="90" y={155 - i * 20} width="140" height="16" rx="4"
              fill={i < 3 ? B.blueL : B.apricotL}
              stroke={i < 3 ? B.blue : B.apricot}
              strokeWidth="0.8"
              strokeOpacity="0.5"
            />
            <text x="160" y={166 - i * 20}
              textAnchor="middle" fontSize="8.5"
              fill={i < 3 ? B.blue : B.apricot}
              fontFamily="IBM Plex Mono, monospace"
              letterSpacing="0.04em">
              {item.label}
            </text>
          </g>
        ))}

        {/* Overflow flash */}
        <g style={{
          opacity: go ? 1 : 0,
          transition: `opacity 0.3s ${3.4}s`,
        }}>
          {/* Overflow ripples */}
          {[0, 1, 2].map(i => (
            <ellipse key={i} cx="160" cy="62" rx={20 + i * 18} ry={6 + i * 3}
              fill="none"
              stroke={B.apricot}
              strokeWidth="1.2"
              strokeOpacity={go ? 0 : 0}
              style={{
                opacity: go ? 0.6 - i * 0.18 : 0,
                transition: `opacity 0.4s ${3.5 + i * 0.2}s`,
              }}
            />
          ))}
        </g>

        {/* Spark — the trigger */}
        <g style={{
          opacity: go ? 1 : 0,
          transform: go ? 'translate(0,0)' : 'translate(0,-20px)',
          transition: `opacity 0.2s ${2.9}s, transform 0.3s ${2.9}s`,
        }}>
          <circle cx="160" cy="50" r="10" fill={B.red} opacity="0.15"/>
          <text x="160" y="54" textAnchor="middle" fontSize="12">☕</text>
          <text x="160" y="45" textAnchor="middle" fontSize="7.5"
            fill={B.red} fontFamily="IBM Plex Mono, monospace" letterSpacing="0.06em">
            the cup
          </text>
        </g>

        {/* Arrow down */}
        <line x1="160" y1="58" x2="160" y2="65"
          stroke={B.red} strokeWidth="1.5" strokeLinecap="round"
          style={{ opacity: go ? 1 : 0, transition: `opacity 0.2s ${3.0}s` }}
        />

        {/* Labels */}
        <text x="70" y="200" textAnchor="middle" fontSize="9"
          fill={B.pewter} fontFamily="IBM Plex Mono, monospace" letterSpacing="0.06em">
          LOAD
        </text>
        <text x="250" y="200" textAnchor="middle" fontSize="9"
          fill={B.red} fontFamily="IBM Plex Mono, monospace" letterSpacing="0.06em">
          SPARK
        </text>
        <line x1="80" y1="193" x2="80" y2="185"
          stroke={B.pewterL} strokeWidth="1" strokeLinecap="round"/>
        <line x1="240" y1="193" x2="240" y2="185"
          stroke={B.pewterL} strokeWidth="1" strokeLinecap="round"/>
      </svg>
      <div className="anim-caption">The spark didn't cause it. The full container caused it. The spark just broke the seal.</div>
    </div>
  );
}

// ─────────────────────────────────────────
// 2. THE 90-SECOND WINDOW — M2
// Timeline showing stress peak, natural descent, feeding vs not feeding
// ─────────────────────────────────────────
export function NinetySecondAnimation() {
  const [ref, go] = useScrollTrigger(0.4);
  return (
    <div ref={ref} className="anim-wrap" aria-label="The 90-second neurochemical window">
      <div className="anim-label-top">The 90-second window</div>
      <svg viewBox="0 0 320 160" style={{ width: '100%', display: 'block' }}>

        {/* Baseline */}
        <line x1="30" y1="130" x2="290" y2="130"
          stroke={B.mist} strokeWidth="1"/>

        {/* Peak curve — stress response */}
        <path d="M 30 130 C 60 130 70 30 110 25 C 140 22 155 22 175 35 C 200 55 220 100 290 125"
          fill="none" stroke={B.red} strokeWidth="2.5" strokeLinecap="round"
          style={{
            strokeDasharray: 400,
            strokeDashoffset: go ? 0 : 400,
            transition: `stroke-dashoffset 2.5s 0.3s ease-out`,
          }}
        />

        {/* Fill under curve */}
        <path d="M 30 130 C 60 130 70 30 110 25 C 140 22 155 22 175 35 C 200 55 220 100 290 125 L 290 130 Z"
          fill={B.red} fillOpacity={go ? 0.08 : 0}
          style={{ transition: `fill-opacity 0.5s 2.5s` }}
        />

        {/* 90 second marker */}
        <line x1="175" y1="30" x2="175" y2="130"
          stroke={B.sageD} strokeWidth="1.2" strokeDasharray="4 3"
          style={{ opacity: go ? 1 : 0, transition: `opacity 0.4s 2.0s` }}
        />
        <text x="178" y="50" fontSize="8.5" fill={B.sageD}
          fontFamily="IBM Plex Mono, monospace">
          ~90 sec
        </text>
        <text x="178" y="60" fontSize="8" fill={B.sageD}
          fontFamily="IBM Plex Mono, monospace" opacity="0.7">
          peak
        </text>

        {/* "Keep feeding it" arrow — stay in it */}
        <g style={{ opacity: go ? 1 : 0, transition: `opacity 0.4s 2.8s` }}>
          <path d="M 175 35 C 200 20 240 15 270 40"
            fill="none" stroke={B.red} strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round"/>
          <text x="218" y="20" fontSize="8" fill={B.red}
            fontFamily="IBM Plex Mono, monospace">
            keep going
          </text>
          <text x="225" y="29" fontSize="7.5" fill={B.red}
            fontFamily="IBM Plex Mono, monospace" opacity="0.7">
            stays high
          </text>
        </g>

        {/* "Stop feeding it" — natural descent */}
        <g style={{ opacity: go ? 1 : 0, transition: `opacity 0.4s 3.2s` }}>
          <text x="200" y="105" fontSize="8" fill={B.sageD}
            fontFamily="IBM Plex Mono, monospace">
            step away
          </text>
          <text x="200" y="114" fontSize="7.5" fill={B.sageD}
            fontFamily="IBM Plex Mono, monospace" opacity="0.7">
            descends
          </text>
        </g>

        {/* Axis labels */}
        <text x="30" y="145" fontSize="8" fill={B.pewter}
          fontFamily="IBM Plex Mono, monospace">trigger</text>
        <text x="265" y="145" fontSize="8" fill={B.pewter}
          fontFamily="IBM Plex Mono, monospace">time</text>

        {/* Y axis label */}
        <text x="15" y="80" fontSize="8" fill={B.pewter}
          fontFamily="IBM Plex Mono, monospace"
          transform="rotate(-90, 15, 80)">intensity</text>
      </svg>
      <div className="anim-caption">You're not in a character crisis. You're in a window. Windows close on their own if you stop feeding them.</div>
    </div>
  );
}

// ─────────────────────────────────────────
// 3. THE MASKING COST — M2
// Resource bar depletes through the day, empty at home
// ─────────────────────────────────────────
export function MaskingCostAnimation() {
  const [ref, go] = useScrollTrigger(0.4);
  const moments = [
    { time: 'Morning', label: 'getting ready', cost: 12, icon: '🌅' },
    { time: 'Commute', label: 'performing normal', cost: 18, icon: '🚌' },
    { time: 'Work', label: 'masking all day', cost: 45, icon: '💼' },
    { time: 'Meeting', label: 'focus & filter', cost: 15, icon: '📋' },
    { time: 'Home', label: 'child needs co-regulation', cost: 0, icon: '🏠' },
  ];
  let cumulative = 100;
  return (
    <div ref={ref} className="anim-wrap" aria-label="The masking cost across a day">
      <div className="anim-label-top">Where the resource goes</div>
      <svg viewBox="0 0 320 200" style={{ width: '100%', display: 'block' }}>

        {/* Track */}
        <rect x="30" y="90" width="260" height="16" rx="8"
          fill={B.mist} stroke={B.pewterL} strokeWidth="0.8"/>

        {/* Full bar label */}
        <text x="30" y="84" fontSize="8" fill={B.pewter}
          fontFamily="IBM Plex Mono, monospace">
          REGULATION RESOURCE
        </text>

        {/* Animated depletion */}
        {(() => {
          const segments = [];
          let x = 30;
          const colors = [B.sageD, B.sageD, B.blue, B.apricot];
          moments.slice(0, -1).forEach((m, i) => {
            const w = (m.cost / 100) * 260;
            const prevX = x;
            segments.push(
              <g key={i}>
                <rect x={prevX} y="90" width={w} height="16" rx={i === 0 ? 8 : 0}
                  fill={colors[i % colors.length]}
                  fillOpacity={go ? 0.7 : 0}
                  style={{ transition: `fill-opacity 0.5s ${i * 0.4 + 0.5}s` }}
                />
              </g>
            );
            x += w;
          });
          return segments;
        })()}

        {/* Home marker — the point of emptiness */}
        <line x1="290" y1="82" x2="290" y2="112"
          stroke={B.red} strokeWidth="1.5"
          style={{ opacity: go ? 1 : 0, transition: `opacity 0.3s 2.5s` }}
        />
        <text x="293" y="92" fontSize="7.5" fill={B.red}
          fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: `opacity 0.3s 2.8s` }}>
          home
        </text>
        <text x="293" y="102" fontSize="7.5" fill={B.red}
          fontFamily="IBM Plex Mono, monospace" opacity="0.7"
          style={{ opacity: go ? 0.7 : 0, transition: `opacity 0.3s 3.0s` }}>
          empty
        </text>

        {/* Icons along the bottom */}
        {moments.map((m, i) => {
          const xPos = 30 + (i / (moments.length - 1)) * 248;
          return (
            <g key={i} style={{ opacity: go ? 1 : 0, transition: `opacity 0.3s ${i * 0.35 + 0.4}s` }}>
              <text x={xPos} y="135" textAnchor="middle" fontSize="14">{m.icon}</text>
              <text x={xPos} y="148" textAnchor="middle" fontSize="7.5"
                fill={B.pewter} fontFamily="IBM Plex Mono, monospace">{m.time}</text>
              <text x={xPos} y="158" textAnchor="middle" fontSize="6.5"
                fill={B.pewter} fontFamily="IBM Plex Mono, monospace" opacity="0.6">
                {m.label}
              </text>
            </g>
          );
        })}

        {/* Empty label */}
        <g style={{ opacity: go ? 1 : 0, transition: `opacity 0.4s 2.5s` }}>
          <rect x="255" y="90" width="35" height="16" rx="0 8 8 0"
            fill={B.mist} stroke={B.pewterL} strokeWidth="0.5"
          />
          <text x="272" y="101" textAnchor="middle" fontSize="7.5"
            fill={B.pewter} fontFamily="IBM Plex Mono, monospace">empty</text>
        </g>
      </svg>
      <div className="anim-caption">Home is where the mask drops — exactly when your child needs the resource you just spent all day.</div>
    </div>
  );
}

// ─────────────────────────────────────────
// 4. THE AMPLIFICATION LOOP — M4
// Two nervous systems feeding each other, then breaking with distance
// ─────────────────────────────────────────
export function AmplificationAnimation() {
  const [ref, go] = useScrollTrigger(0.4);
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!go) return;
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 1800),
      setTimeout(() => setPhase(3), 2800),
      setTimeout(() => setPhase(4), 4000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [go]);

  return (
    <div ref={ref} className="anim-wrap" aria-label="The amplification loop between two nervous systems">
      <div className="anim-label-top">The amplification loop</div>
      <svg viewBox="0 0 320 180" style={{ width: '100%', display: 'block' }}>

        {/* Parent circle */}
        <circle cx="90" cy="90" r={phase >= 2 ? 38 : 28}
          fill={phase >= 1 ? B.apricotL : B.blueL}
          stroke={phase >= 2 ? B.red : B.blue}
          strokeWidth={phase >= 2 ? 2 : 1.5}
          style={{ transition: 'all 0.6s ease' }}
        />
        <text x="90" y="87" textAnchor="middle" fontSize="9"
          fill={B.slate} fontFamily="Lexend, sans-serif" fontWeight="500">
          Parent
        </text>
        <text x="90" y="99" textAnchor="middle" fontSize="8"
          fill={phase >= 2 ? B.red : B.pewter}
          fontFamily="IBM Plex Mono, monospace"
          style={{ transition: 'color 0.3s' }}>
          {phase === 0 ? 'calm' : phase === 1 ? 'rising' : phase < 4 ? 'dysreg.' : 'stepping down'}
        </text>

        {/* Child circle */}
        <circle cx="230" cy="90" r={phase >= 1 ? 38 : 28}
          fill={phase >= 1 ? B.apricotL : B.sageL}
          stroke={phase >= 1 ? B.red : B.sageD}
          strokeWidth={phase >= 1 ? 2 : 1.5}
          style={{ transition: 'all 0.6s ease' }}
        />
        <text x="230" y="87" textAnchor="middle" fontSize="9"
          fill={B.slate} fontFamily="Lexend, sans-serif" fontWeight="500">
          Child
        </text>
        <text x="230" y="99" textAnchor="middle" fontSize="8"
          fill={phase >= 1 ? B.red : B.sageD}
          fontFamily="IBM Plex Mono, monospace"
          style={{ transition: 'color 0.3s' }}>
          {phase === 0 ? 'meltdown' : phase < 4 ? 'escalating' : 'settling'}
        </text>

        {/* Arrows between — feeding each other */}
        {phase >= 1 && phase < 4 && (
          <>
            <path d="M 125 80 C 155 65 165 65 195 80"
              fill="none" stroke={B.red} strokeWidth="1.5"
              strokeDasharray={phase >= 2 ? '0' : '4 3'}
              style={{ opacity: 0.7 }}
            >
              <animate attributeName="stroke-dashoffset" values="20;0" dur="1s" repeatCount="indefinite"/>
            </path>
            <path d="M 195 100 C 165 115 155 115 125 100"
              fill="none" stroke={B.red} strokeWidth="1.5"
              strokeDasharray="4 3"
              style={{ opacity: 0.7 }}
            >
              <animate attributeName="stroke-dashoffset" values="0;20" dur="1s" repeatCount="indefinite"/>
            </path>
            <text x="160" y="60" textAnchor="middle" fontSize="7.5"
              fill={B.red} fontFamily="IBM Plex Mono, monospace">amplifying</text>
          </>
        )}

        {/* Break — distance */}
        {phase >= 4 && (
          <>
            <line x1="160" y1="50" x2="160" y2="130"
              stroke={B.sageD} strokeWidth="1.5" strokeDasharray="5 3"
              style={{ opacity: 0.7 }}
            />
            <text x="160" y="145" textAnchor="middle" fontSize="8"
              fill={B.sageD} fontFamily="IBM Plex Mono, monospace">distance</text>
            <text x="160" y="155" textAnchor="middle" fontSize="7.5"
              fill={B.sageD} fontFamily="IBM Plex Mono, monospace" opacity="0.7">breaks the loop</text>
          </>
        )}

        {/* Phase label */}
        <text x="160" y="20" textAnchor="middle" fontSize="8"
          fill={B.pewter} fontFamily="IBM Plex Mono, monospace">
          {phase === 0 ? 'starting state' :
           phase === 1 ? 'contagion begins' :
           phase === 2 ? 'both dysregulated' :
           phase === 3 ? 'amplification loop' :
           '60 seconds apart'}
        </text>
      </svg>
      <div className="anim-caption">Two reactive nervous systems in proximity amplify each other. Distance is not abandonment — it breaks the loop.</div>
    </div>
  );
}

// ─────────────────────────────────────────
// 5. THE SIGNAL — M6
// Body silhouette, heat rising from chest before explosion
// ─────────────────────────────────────────
export function SignalAnimation() {
  const [ref, go] = useScrollTrigger(0.4);
  return (
    <div ref={ref} className="anim-wrap" aria-label="The physical signal before the explosion">
      <div className="anim-label-top">The signal arrives before the reaction</div>
      <svg viewBox="0 0 320 200" style={{ width: '100%', display: 'block' }}>

        {/* Body silhouette */}
        <g transform="translate(130, 20)">
          {/* Head */}
          <ellipse cx="30" cy="18" rx="14" ry="16"
            fill={B.slate} fillOpacity="0.12" stroke={B.pewterL} strokeWidth="1"/>
          {/* Torso */}
          <rect x="14" y="34" width="32" height="52" rx="8"
            fill={B.slate} fillOpacity="0.1" stroke={B.pewterL} strokeWidth="1"/>
          {/* Arms */}
          <rect x="1" y="36" width="12" height="36" rx="6"
            fill={B.slate} fillOpacity="0.08" stroke={B.pewterL} strokeWidth="0.8"/>
          <rect x="47" y="36" width="12" height="36" rx="6"
            fill={B.slate} fillOpacity="0.08" stroke={B.pewterL} strokeWidth="0.8"/>
          {/* Legs */}
          <rect x="14" y="85" width="12" height="40" rx="6"
            fill={B.slate} fillOpacity="0.08" stroke={B.pewterL} strokeWidth="0.8"/>
          <rect x="34" y="85" width="12" height="40" rx="6"
            fill={B.slate} fillOpacity="0.08" stroke={B.pewterL} strokeWidth="0.8"/>

          {/* Chest heat — the signal */}
          {[0, 1, 2, 3].map(i => (
            <ellipse key={i}
              cx="30" cy={58 - i * 8}
              rx={8 + i * 4} ry={5 + i * 3}
              fill={B.apricot}
              fillOpacity={go ? Math.max(0, 0.5 - i * 0.1) : 0}
              style={{ transition: `fill-opacity 0.4s ${i * 0.25 + 0.5}s ease` }}
            />
          ))}

          {/* Jaw tighten indicator */}
          <path d="M 20 28 Q 30 33 40 28"
            fill="none"
            stroke={go ? B.red : B.pewterL}
            strokeWidth={go ? 2 : 1}
            style={{ transition: 'stroke 0.3s 1.5s, stroke-width 0.3s 1.5s' }}
          />

          {/* Shoulder rise */}
          <path d="M 8 36 Q 30 28 52 36"
            fill="none"
            stroke={go ? B.apricot : B.pewterL}
            strokeWidth={go ? 2 : 1}
            style={{ transition: 'stroke 0.3s 1.8s, stroke-width 0.3s 1.8s' }}
          />
        </g>

        {/* Labels with arrows */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 1.0s' }}>
          <line x1="110" y1="78" x2="136" y2="75"
            stroke={B.apricot} strokeWidth="1" strokeLinecap="round"/>
          <text x="60" y="80" textAnchor="middle" fontSize="9"
            fill={B.apricot} fontFamily="IBM Plex Mono, monospace">heat rising</text>
          <text x="60" y="90" textAnchor="middle" fontSize="8"
            fill={B.apricot} fontFamily="IBM Plex Mono, monospace" opacity="0.7">in chest</text>
        </g>

        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 1.5s' }}>
          <line x1="120" y1="56" x2="142" y2="52"
            stroke={B.red} strokeWidth="1" strokeLinecap="round"/>
          <text x="70" y="56" textAnchor="middle" fontSize="9"
            fill={B.red} fontFamily="IBM Plex Mono, monospace">jaw tightens</text>
        </g>

        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 1.8s' }}>
          <line x1="210" y1="56" x2="190" y2="52"
            stroke={B.red} strokeWidth="1" strokeLinecap="round"/>
          <text x="255" y="56" textAnchor="middle" fontSize="9"
            fill={B.red} fontFamily="IBM Plex Mono, monospace">shoulders up</text>
        </g>

        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 2.5s' }}>
          <rect x="95" y="145" width="130" height="26" rx="6"
            fill={B.blueL} stroke={B.blue} strokeWidth="0.8"/>
          <text x="160" y="156" textAnchor="middle" fontSize="9"
            fill={B.blue} fontFamily="IBM Plex Mono, monospace">
            30 seconds before the explosion
          </text>
          <text x="160" y="167" textAnchor="middle" fontSize="8.5"
            fill={B.blue} fontFamily="Lexend, sans-serif">
            This is your intervention window
          </text>
        </g>

      </svg>
      <div className="anim-caption">The signal is consistent. Once you know what yours feels like, you have a window that didn't exist before.</div>
    </div>
  );
}

// ─────────────────────────────────────────
// 6. THE REPAIR — M5, M13
// A crack in a line, then two sentences closing it, return to normal
// ─────────────────────────────────────────
export function RepairAnimation() {
  const [ref, go] = useScrollTrigger(0.4);
  return (
    <div ref={ref} className="anim-wrap" aria-label="What repair looks like">
      <div className="anim-label-top">What repair actually is</div>
      <svg viewBox="0 0 320 140" style={{ width: '100%', display: 'block' }}>

        {/* Timeline line — before rupture */}
        <line x1="20" y1="70" x2="110" y2="70"
          stroke={B.sageD} strokeWidth="2.5" strokeLinecap="round"
          style={{
            strokeDasharray: 90,
            strokeDashoffset: go ? 0 : 90,
            transition: 'stroke-dashoffset 0.6s 0.2s ease-out',
          }}
        />

        {/* Rupture — jagged break */}
        <polyline points="110,70 122,45 135,95 148,45 160,70"
          fill="none" stroke={B.red} strokeWidth="2.5" strokeLinejoin="round"
          style={{
            strokeDasharray: 120,
            strokeDashoffset: go ? 0 : 120,
            transition: 'stroke-dashoffset 0.6s 0.7s ease-out',
          }}
        />

        {/* Gap */}
        <line x1="160" y1="70" x2="200" y2="70"
          stroke={B.pewterL} strokeWidth="2" strokeLinecap="round" strokeDasharray="4 3"
          style={{
            opacity: go ? 1 : 0,
            transition: 'opacity 0.3s 1.2s',
          }}
        />

        {/* Two repair sentences */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.5s 1.8s' }}>
          <rect x="162" y="48" width="115" height="16" rx="4"
            fill={B.blueL} stroke={B.blue} strokeWidth="0.8"/>
          <text x="220" y="59" textAnchor="middle" fontSize="7.5"
            fill={B.blue} fontFamily="IBM Plex Mono, monospace">
            "I [did the thing]."
          </text>
        </g>

        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.5s 2.4s' }}>
          <rect x="162" y="68" width="115" height="16" rx="4"
            fill={B.sageL} stroke={B.sageD} strokeWidth="0.8"/>
          <text x="220" y="79" textAnchor="middle" fontSize="7.5"
            fill={B.sageD} fontFamily="IBM Plex Mono, monospace">
            "I'm going to work on ___."
          </text>
        </g>

        {/* Reconnection line after repair */}
        <line x1="278" y1="70" x2="305" y2="70"
          stroke={B.sageD} strokeWidth="2.5" strokeLinecap="round"
          style={{
            strokeDasharray: 30,
            strokeDashoffset: go ? 0 : 30,
            transition: 'stroke-dashoffset 0.4s 3.2s ease-out',
          }}
        />

        {/* Labels below timeline */}
        <text x="65" y="95" textAnchor="middle" fontSize="8"
          fill={B.pewter} fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.3s 0.5s' }}>
          before
        </text>
        <text x="135" y="115" textAnchor="middle" fontSize="8"
          fill={B.red} fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.3s 1.0s' }}>
          rupture
        </text>
        <text x="292" y="95" textAnchor="middle" fontSize="8"
          fill={B.sageD} fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.3s 3.5s' }}>
          after
        </text>

        {/* Two sentences label */}
        <text x="220" y="100" textAnchor="middle" fontSize="8"
          fill={B.blue} fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.3s 2.0s' }}>
          two sentences
        </text>
        <text x="220" y="110" textAnchor="middle" fontSize="8"
          fill={B.blue} fontFamily="IBM Plex Mono, monospace" opacity="0.6"
          style={{ opacity: go ? 0.6 : 0, transition: 'opacity 0.3s 2.2s' }}>
          when both of you are calm
        </text>
      </svg>
      <div className="anim-caption">The repair doesn't need to be large. Two sentences, unconditional, when both of you are calm. Then something ordinary.</div>
    </div>
  );
}

// ─────────────────────────────────────────
// 7. CO-REGULATION SYNC — M4, M1
// Brain waves syncing and desyncing
// ─────────────────────────────────────────
export function CoRegulationAnimation() {
  const [ref, go] = useScrollTrigger(0.4);
  return (
    <div ref={ref} className="anim-wrap" aria-label="How co-regulation works — and why it breaks">
      <div className="anim-label-top">Why co-regulation breaks under stress</div>
      <svg viewBox="0 0 320 160" style={{ width: '100%', display: 'block' }}>

        {/* Parent wave — calm */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.3s 0.3s' }}>
          <text x="32" y="55" fontSize="8" fill={B.pewter}
            fontFamily="IBM Plex Mono, monospace">Parent</text>
          <path d="M 30 70 Q 52 50 74 70 Q 96 90 118 70 Q 140 50 162 70 Q 184 90 206 70 Q 228 50 250 70 Q 272 90 294 70"
            fill="none" stroke={B.blue} strokeWidth="2"
            style={{
              strokeDasharray: 320,
              strokeDashoffset: go ? 0 : 320,
              transition: 'stroke-dashoffset 1.5s 0.5s ease-out',
            }}
          />
        </g>

        {/* Child wave — dysregulated, larger amplitude */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.3s 0.8s' }}>
          <text x="32" y="115" fontSize="8" fill={B.pewter}
            fontFamily="IBM Plex Mono, monospace">Child</text>
          <path d="M 30 120 Q 52 80 74 120 Q 96 160 118 120 Q 140 80 162 120 Q 184 160 206 120 Q 228 80 250 120 Q 272 160 294 120"
            fill="none" stroke={B.apricot} strokeWidth="2"
            style={{
              strokeDasharray: 400,
              strokeDashoffset: go ? 0 : 400,
              transition: 'stroke-dashoffset 1.5s 1.0s ease-out',
            }}
          />
        </g>

        {/* Sync zone overlay */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 2.5s' }}>
          <rect x="30" y="48" width="80" height="82" rx="4"
            fill={B.sageD} fillOpacity="0.06"
            stroke={B.sageD} strokeWidth="0.8" strokeDasharray="4 3"/>
          <text x="70" y="140" textAnchor="middle" fontSize="7.5"
            fill={B.sageD} fontFamily="IBM Plex Mono, monospace">calm parent</text>
          <text x="70" y="150" textAnchor="middle" fontSize="7"
            fill={B.sageD} fontFamily="IBM Plex Mono, monospace" opacity="0.7">can sync</text>
        </g>

        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 3.0s' }}>
          <rect x="180" y="48" width="130" height="100" rx="4"
            fill={B.red} fillOpacity="0.04"
            stroke={B.red} strokeWidth="0.8" strokeDasharray="4 3"/>
          <text x="245" y="155" textAnchor="middle" fontSize="7.5"
            fill={B.red} fontFamily="IBM Plex Mono, monospace">stressed parent</text>
          <text x="245" y="165" textAnchor="middle" fontSize="7"
            fill={B.red} fontFamily="IBM Plex Mono, monospace" opacity="0.7">sync breaks</text>
        </g>

        {/* Research note */}
        <text x="160" y="20" textAnchor="middle" fontSize="7.5"
          fill={B.pewter} fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.3s 3.5s' }}>
          Azhari et al. — measured simultaneously in two brains
        </text>
      </svg>
      <div className="anim-caption">When you're stressed, the mechanism that would help your child regulate goes offline. Measured in two brains at the same time.</div>
    </div>
  );
}