// Additional GrowAnimations — Part 2
// M1, M7, M8, M10/M11, M12, M16, M20

import { useState, useEffect, useRef } from 'react';

const B = {
  blue:     '#4A6FA5',
  blueL:    'rgba(74,111,165,0.1)',
  blueM:    'rgba(74,111,165,0.2)',
  sage:     '#A8C3A0',
  sageD:    '#7FA88E',
  sageL:    'rgba(168,195,160,0.15)',
  slate:    '#1F2A37',
  pewter:   '#56606E',
  pewterL:  'rgba(86,96,110,0.25)',
  mist:     '#EDEFEE',
  apricot:  '#E8A87C',
  apricotL: 'rgba(232,168,124,0.15)',
  lavender: '#9B8BB4',
  lavL:     'rgba(155,139,180,0.15)',
  cloud:    '#F7F5F0',
  red:      '#C97B6A',
  redL:     'rgba(201,123,106,0.12)',
};

function useScrollTrigger(threshold = 0.35) {
  const ref = useRef(null);
  const [triggered, setTriggered] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTriggered(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, triggered];
}

// ─────────────────────────────────────────
// M1 — THE ADVICE GAP
// Two columns: what the advice assumes vs what this household is
// ─────────────────────────────────────────
export function AdviceGapAnimation() {
  const [ref, go] = useScrollTrigger(0.35);
  return (
    <div ref={ref} className="anim-wrap" aria-label="What parenting advice assumes vs your household">
      <div className="anim-label-top">What the advice was built for — and what it missed</div>
      <svg viewBox="0 0 320 170" style={{ width: '100%', display: 'block' }}>

        {/* Left column — what advice assumes */}
        <g style={{ opacity: go ? 1 : 0, transform: go ? 'translateX(0)' : 'translateX(-16px)', transition: 'opacity 0.5s 0.3s, transform 0.5s 0.3s' }}>
          <rect x="20" y="30" width="120" height="120" rx="10"
            fill="white" stroke={B.pewterL} strokeWidth="1"/>
          <text x="80" y="22" textAnchor="middle" fontSize="8" fill={B.pewter}
            fontFamily="IBM Plex Mono, monospace" letterSpacing="0.1em">THE ADVICE ASSUMES</text>
          {[
            { y: 55, icon: '😌', text: 'Regulated adult' },
            { y: 82, icon: '📋', text: 'Working memory' },
            { y: 109, icon: '🔄', text: 'Consistency' },
            { y: 136, icon: '⏸', text: 'Can pause & choose' },
          ].map((item, i) => (
            <g key={i} style={{ opacity: go ? 1 : 0, transition: `opacity 0.4s ${0.5 + i * 0.15}s` }}>
              <text x="38" y={item.y} fontSize="14">{item.icon}</text>
              <text x="58" y={item.y + 1} fontSize="9.5" fill={B.pewter}
                fontFamily="Lexend, sans-serif">{item.text}</text>
            </g>
          ))}
        </g>

        {/* Right column — your household */}
        <g style={{ opacity: go ? 1 : 0, transform: go ? 'translateX(0)' : 'translateX(16px)', transition: 'opacity 0.5s 0.5s, transform 0.5s 0.5s' }}>
          <rect x="180" y="30" width="120" height="120" rx="10"
            fill={B.blueL} stroke={B.blue} strokeWidth="1" strokeOpacity="0.5"/>
          <text x="240" y="22" textAnchor="middle" fontSize="8" fill={B.blue}
            fontFamily="IBM Plex Mono, monospace" letterSpacing="0.1em">YOUR HOUSEHOLD</text>
          {[
            { y: 55, icon: '⚡', text: 'Both dysregulate' },
            { y: 82, icon: '🔓', text: 'WM unreliable' },
            { y: 109, icon: '↔️', text: 'Variable, not broken' },
            { y: 136, icon: '⏱', text: '30-sec window' },
          ].map((item, i) => (
            <g key={i} style={{ opacity: go ? 1 : 0, transition: `opacity 0.4s ${0.8 + i * 0.15}s` }}>
              <text x="196" y={item.y} fontSize="14">{item.icon}</text>
              <text x="218" y={item.y + 1} fontSize="9.5" fill={B.blue}
                fontFamily="Lexend, sans-serif">{item.text}</text>
            </g>
          ))}
        </g>

        {/* Gap arrow */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 1.5s' }}>
          <line x1="143" y1="90" x2="177" y2="90"
            stroke={B.red} strokeWidth="1.5" strokeLinecap="round"/>
          <polygon points="174,86 180,90 174,94" fill={B.red}/>
          <text x="160" y="83" textAnchor="middle" fontSize="7.5"
            fill={B.red} fontFamily="IBM Plex Mono, monospace">gap</text>
        </g>
      </svg>
      <div className="anim-caption">The advice isn't wrong. It was built for a different household. This course is built for yours.</div>
    </div>
  );
}

// ─────────────────────────────────────────
// M7 — INPUT VS CAPACITY
// As input increases, capacity to receive drops to zero
// ─────────────────────────────────────────
export function InputCapacityAnimation() {
  const [ref, go] = useScrollTrigger(0.35);
  return (
    <div ref={ref} className="anim-wrap" aria-label="More words, less received">
      <div className="anim-label-top">More input — less received</div>
      <svg viewBox="0 0 320 160" style={{ width: '100%', display: 'block' }}>

        {/* Axes */}
        <line x1="40" y1="20" x2="40" y2="130" stroke={B.pewterL} strokeWidth="1.5"/>
        <line x1="40" y1="130" x2="290" y2="130" stroke={B.pewterL} strokeWidth="1.5"/>

        {/* Y-axis label */}
        <text x="12" y="75" fontSize="8" fill={B.pewter}
          fontFamily="IBM Plex Mono, monospace"
          transform="rotate(-90, 12, 75)">capacity</text>

        {/* X-axis label */}
        <text x="165" y="148" textAnchor="middle" fontSize="8" fill={B.pewter}
          fontFamily="IBM Plex Mono, monospace">sentences past the point</text>

        {/* Capacity curve — drops to zero */}
        <path d="M 45 35 C 80 35 110 40 140 65 C 170 90 200 115 240 127 C 260 130 275 130 285 130"
          fill="none" stroke={B.sageD} strokeWidth="2.5" strokeLinecap="round"
          style={{
            strokeDasharray: 350,
            strokeDashoffset: go ? 0 : 350,
            transition: 'stroke-dashoffset 2s 0.4s ease-out',
          }}
        />

        {/* Input bar — grows */}
        <rect x="45" y="128" width={go ? 240 : 0} height="4" rx="2"
          fill={B.red} fillOpacity="0.6"
          style={{ transition: 'width 2s 0.4s ease-out' }}
        />

        {/* Fill under capacity curve */}
        <path d="M 45 35 C 80 35 110 40 140 65 C 170 90 200 115 240 127 C 260 130 275 130 285 130 L 285 130 L 45 130 Z"
          fill={B.sageD} fillOpacity={go ? 0.08 : 0}
          style={{ transition: 'fill-opacity 0.5s 2.2s' }}
        />

        {/* Key points */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 1.5s' }}>
          <circle cx="100" cy="38" r="4" fill={B.sageD} fillOpacity="0.6"/>
          <line x1="100" y1="42" x2="100" y2="55"
            stroke={B.sageD} strokeWidth="1" strokeDasharray="3 2"/>
          <text x="100" y="64" textAnchor="middle" fontSize="7.5"
            fill={B.sageD} fontFamily="IBM Plex Mono, monospace">sentence 1</text>
          <text x="100" y="73" textAnchor="middle" fontSize="7"
            fill={B.sageD} fontFamily="IBM Plex Mono, monospace" opacity="0.7">still landing</text>
        </g>

        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 1.9s' }}>
          <circle cx="175" cy="85" r="4" fill={B.apricot} fillOpacity="0.7"/>
          <line x1="175" y1="89" x2="175" y2="100"
            stroke={B.apricot} strokeWidth="1" strokeDasharray="3 2"/>
          <text x="175" y="109" textAnchor="middle" fontSize="7.5"
            fill={B.apricot} fontFamily="IBM Plex Mono, monospace">sentence 3</text>
          <text x="175" y="118" textAnchor="middle" fontSize="7"
            fill={B.apricot} fontFamily="IBM Plex Mono, monospace" opacity="0.7">mostly noise</text>
        </g>

        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 2.3s' }}>
          <circle cx="255" cy="129" r="4" fill={B.red}/>
          <text x="255" y="120" textAnchor="middle" fontSize="7.5"
            fill={B.red} fontFamily="IBM Plex Mono, monospace">sentence 7+</text>
          <text x="255" y="110" textAnchor="middle" fontSize="7"
            fill={B.red} fontFamily="IBM Plex Mono, monospace" opacity="0.7">zero received</text>
        </g>

        {/* Input label */}
        <text x="168" y="126" textAnchor="middle" fontSize="7.5"
          fill={B.red} fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.3s 2.1s' }}>
          ← input volume growing →
        </text>
      </svg>
      <div className="anim-caption">Every sentence past the third works against you. The lesson is still real — the conditions to receive it don't exist yet.</div>
    </div>
  );
}

// ─────────────────────────────────────────
// M8 — VISIBLE VS INVISIBLE STEPS
// The chart (visible) vs the invisible steps above it dropping
// ─────────────────────────────────────────
export function InvisibleStepsAnimation() {
  const [ref, go] = useScrollTrigger(0.35);
  const visibleSteps = ['Get dressed', 'Eat breakfast', 'Brush teeth', 'Find bag'];
  const invisibleSteps = [
    { text: 'sports day reminder', x: 65, y: 45, dropTo: 175 },
    { text: 'permission slip', x: 130, y: 35, dropTo: 175 },
    { text: 'who ate yet?', x: 195, y: 55, dropTo: 175 },
    { text: 'lunch decision', x: 248, y: 42, dropTo: 175 },
  ];
  return (
    <div ref={ref} className="anim-wrap" aria-label="Visible vs invisible steps in a routine">
      <div className="anim-label-top">The chart shows the visible steps. The invisible ones are in your head.</div>
      <svg viewBox="0 0 320 210" style={{ width: '100%', display: 'block' }}>

        {/* Working memory zone — top */}
        <rect x="20" y="20" width="280" height="80" rx="8"
          fill={B.lavL} stroke={B.lavender} strokeWidth="0.8" strokeDasharray="5 3"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 0.2s' }}
        />
        <text x="30" y="36" fontSize="8" fill={B.lavender}
          fontFamily="IBM Plex Mono, monospace" letterSpacing="0.1em"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 0.2s' }}>
          WORKING MEMORY (invisible steps)
        </text>

        {/* Invisible steps in memory */}
        {invisibleSteps.map((step, i) => (
          <g key={i} style={{
            opacity: go ? 1 : 0,
            transform: go ? 'translateY(0)' : 'translateY(-10px)',
            transition: `opacity 0.4s ${0.4 + i * 0.2}s, transform 0.4s ${0.4 + i * 0.2}s`,
          }}>
            <rect x={step.x - 30} y={step.y} width="62" height="18" rx="4"
              fill={B.lavL} stroke={B.lavender} strokeWidth="0.8"/>
            <text x={step.x + 1} y={step.y + 12} textAnchor="middle" fontSize="7.5"
              fill={B.lavender} fontFamily="IBM Plex Mono, monospace">{step.text}</text>
          </g>
        ))}

        {/* Dropping arrows — memory dropping steps */}
        {[1, 2].map(i => (
          <line key={i}
            x1={invisibleSteps[i].x + 1} y1={invisibleSteps[i].y + 18}
            x2={invisibleSteps[i].x + 1} y2={150}
            stroke={B.red} strokeWidth="1" strokeDasharray="3 2"
            strokeOpacity="0.5"
            style={{ opacity: go ? 1 : 0, transition: `opacity 0.3s ${1.5 + i * 0.2}s` }}
          />
        ))}

        {/* Dropped (faded) indicators */}
        {[1, 2].map(i => (
          <g key={i} style={{ opacity: go ? 1 : 0, transition: `opacity 0.3s ${1.8 + i * 0.2}s` }}>
            <text x={invisibleSteps[i].x + 1} y={158} textAnchor="middle"
              fontSize="10" fill={B.red} opacity="0.5">✕</text>
            <text x={invisibleSteps[i].x + 1} y={168} textAnchor="middle"
              fontSize="7" fill={B.red} opacity="0.5"
              fontFamily="IBM Plex Mono, monospace">dropped</text>
          </g>
        ))}

        {/* The chart — fridge */}
        <rect x="20" y="115" width="280" height="80" rx="8"
          fill="white" stroke={B.pewterL} strokeWidth="1"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 0.3s' }}
        />
        <text x="30" y="131" fontSize="8" fill={B.pewter}
          fontFamily="IBM Plex Mono, monospace" letterSpacing="0.1em"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 0.3s' }}>
          THE CHART (visible steps)
        </text>
        {visibleSteps.map((step, i) => (
          <g key={i} style={{ opacity: go ? 1 : 0, transition: `opacity 0.3s ${0.5 + i * 0.15}s` }}>
            <rect x={30 + i * 66} y="140" width="58" height="20" rx="4"
              fill={B.blueL} stroke={B.blue} strokeWidth="0.6" strokeOpacity="0.5"/>
            <text x={30 + i * 66 + 29} y="153" textAnchor="middle" fontSize="8"
              fill={B.blue} fontFamily="Lexend, sans-serif">{step}</text>
          </g>
        ))}

        {/* Arrow down from externalise */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 2.5s' }}>
          <line x1="65" y1="63" x2="65" y2="138"
            stroke={B.sageD} strokeWidth="1.5" strokeLinecap="round"/>
          <polygon points="61,135 65,141 69,135" fill={B.sageD}/>
          <rect x="3" y="88" width="55" height="20" rx="4" fill={B.sageL} stroke={B.sageD} strokeWidth="0.8"/>
          <text x="30" y="101" textAnchor="middle" fontSize="7.5"
            fill={B.sageD} fontFamily="IBM Plex Mono, monospace">externalise</text>
        </g>
      </svg>
      <div className="anim-caption">Moving one invisible step onto the chart removes it from working memory permanently. The environment holds it instead of you.</div>
    </div>
  );
}

// ─────────────────────────────────────────
// M10/M11 — THE OPEN LOOP
// Loop cycling, discomfort, clean exit, lesson delivered later
// ─────────────────────────────────────────
export function OpenLoopAnimation() {
  const [ref, go] = useScrollTrigger(0.35);
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!go) return;
    const timers = [
      setTimeout(() => setPhase(1), 700),
      setTimeout(() => setPhase(2), 1600),
      setTimeout(() => setPhase(3), 2800),
      setTimeout(() => setPhase(4), 4000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [go]);

  return (
    <div ref={ref} className="anim-wrap" aria-label="The argument loop and the clean exit">
      <div className="anim-label-top">The loop — and the exit that delivers the lesson</div>
      <svg viewBox="0 0 320 170" style={{ width: '100%', display: 'block' }}>

        {/* Loop circle */}
        <circle cx="120" cy="90" r="52"
          fill="none"
          stroke={phase >= 1 && phase < 4 ? B.apricot : B.pewterL}
          strokeWidth={phase >= 2 ? 2.5 : 1.5}
          strokeDasharray={phase >= 1 ? '0' : '8 4'}
          style={{ transition: 'stroke 0.4s, stroke-width 0.3s' }}
        />

        {/* Spinning arrow on loop */}
        {phase >= 1 && phase < 4 && (
          <g>
            <animateTransform attributeName="transform" type="rotate"
              values="0 120 90; 360 120 90" dur="2.5s" repeatCount="indefinite"/>
            <circle cx="120" cy="38" r="5" fill={B.apricot}/>
          </g>
        )}

        {/* Loop labels */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 0.5s' }}>
          <text x="120" y="80" textAnchor="middle" fontSize="9"
            fill={B.slate} fontFamily="Lexend, sans-serif" fontWeight="500">argument</text>
          <text x="120" y="94" textAnchor="middle" fontSize="8"
            fill={B.pewter} fontFamily="IBM Plex Mono, monospace">keeps cycling</text>
          <text x="120" y="108" textAnchor="middle" fontSize="8"
            fill={phase >= 2 ? B.apricot : B.pewter}
            fontFamily="IBM Plex Mono, monospace"
            style={{ transition: 'fill 0.3s' }}>
            {phase < 2 ? 'loop running' : phase < 3 ? 'still going...' : 'exit point'}
          </text>
        </g>

        {/* Exit arrow */}
        {phase >= 3 && (
          <g style={{ opacity: phase >= 3 ? 1 : 0, transition: 'opacity 0.5s' }}>
            <line x1="170" y1="90" x2="210" y2="90"
              stroke={B.sageD} strokeWidth="2" strokeLinecap="round"/>
            <polygon points="207,86 214,90 207,94" fill={B.sageD}/>
            <text x="192" y="83" textAnchor="middle" fontSize="8"
              fill={B.sageD} fontFamily="IBM Plex Mono, monospace">one sentence</text>
            <text x="192" y="79" textAnchor="middle" fontSize="7"
              fill={B.sageD} fontFamily="IBM Plex Mono, monospace" opacity="0.7">then move</text>
          </g>
        )}

        {/* 12 hours later — lesson delivered */}
        {phase >= 4 && (
          <g style={{ opacity: 1, transition: 'opacity 0.5s' }}>
            <rect x="218" y="58" width="88" height="64" rx="8"
              fill={B.blueL} stroke={B.blue} strokeWidth="0.8"/>
            <text x="262" y="76" textAnchor="middle" fontSize="7.5"
              fill={B.blue} fontFamily="IBM Plex Mono, monospace">12 hours later</text>
            <line x1="235" y1="82" x2="289" y2="82"
              stroke={B.blueM} strokeWidth="0.8"/>
            <text x="262" y="94" textAnchor="middle" fontSize="8"
              fill={B.slate} fontFamily="Lexend, sans-serif">lesson</text>
            <text x="262" y="106" textAnchor="middle" fontSize="8"
              fill={B.slate} fontFamily="Lexend, sans-serif">delivered</text>
            <text x="262" y="115" textAnchor="middle" fontSize="7.5"
              fill={B.sageD} fontFamily="IBM Plex Mono, monospace">✓ lands</text>
          </g>
        )}

        {/* Discomfort label */}
        {phase >= 3 && (
          <text x="120" y="155" textAnchor="middle" fontSize="8"
            fill={B.pewter} fontFamily="IBM Plex Mono, monospace"
            style={{ opacity: 1, transition: 'opacity 0.4s' }}>
            open loop discomfort is real — it's also survivable
          </text>
        )}
      </svg>
      <div className="anim-caption">Stopping the loop is not losing. It's choosing the delivery method where the lesson actually lands.</div>
    </div>
  );
}

// ─────────────────────────────────────────
// M12 — SPIRAL VS ACCOUNTABILITY FORK
// Same incident, two paths: accountability (forward) vs spiral (deeper)
// ─────────────────────────────────────────
export function SpiralForkAnimation() {
  const [ref, go] = useScrollTrigger(0.35);
  return (
    <div ref={ref} className="anim-wrap" aria-label="Rumination vs accountability — two paths from the same moment">
      <div className="anim-label-top">Same incident. Two completely different directions.</div>
      <svg viewBox="0 0 320 190" style={{ width: '100%', display: 'block' }}>

        {/* Incident point */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 0.2s' }}>
          <circle cx="160" cy="30" r="14" fill={B.redL} stroke={B.red} strokeWidth="1.5"/>
          <text x="160" y="27" textAnchor="middle" fontSize="8"
            fill={B.red} fontFamily="IBM Plex Mono, monospace">hard</text>
          <text x="160" y="38" textAnchor="middle" fontSize="8"
            fill={B.red} fontFamily="IBM Plex Mono, monospace">moment</text>
        </g>

        {/* Fork line down */}
        <line x1="160" y1="44" x2="160" y2="65"
          stroke={B.pewterL} strokeWidth="1.5"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.3s 0.5s' }}
        />

        {/* Left branch — accountability */}
        <path d="M 160 65 L 80 95"
          fill="none" stroke={B.sageD} strokeWidth="2" strokeLinecap="round"
          style={{
            strokeDasharray: 100,
            strokeDashoffset: go ? 0 : 100,
            transition: 'stroke-dashoffset 0.6s 0.7s',
          }}
        />

        {/* Accountability path — forward */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 1.1s' }}>
          <rect x="22" y="95" width="115" height="22" rx="6"
            fill={B.sageL} stroke={B.sageD} strokeWidth="1"/>
          <text x="79" y="109" textAnchor="middle" fontSize="9"
            fill={B.sageD} fontFamily="Lexend, sans-serif" fontWeight="500">Accountability</text>
        </g>

        {/* Accountability questions */}
        {[
          { text: 'what happened?', y: 135 },
          { text: 'what was my part?', y: 149 },
          { text: 'what do I do now?', y: 163 },
        ].map((q, i) => (
          <g key={i} style={{ opacity: go ? 1 : 0, transition: `opacity 0.3s ${1.3 + i * 0.2}s` }}>
            <circle cx="30" cy={q.y - 4} r="3" fill={B.sageD} fillOpacity="0.6"/>
            <text x="40" y={q.y} fontSize="8.5" fill={B.pewter}
              fontFamily="Lexend, sans-serif">{q.text}</text>
          </g>
        ))}

        {/* Repair outcome */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.5s 2.0s' }}>
          <line x1="79" y1="117" x2="79" y2="127"
            stroke={B.sageD} strokeWidth="1.5" strokeLinecap="round"/>
          <rect x="30" y="127" width="98" height="18" rx="5"
            fill={B.sageD} fillOpacity="0.15" stroke={B.sageD} strokeWidth="0.8"/>
          <text x="79" y="139" textAnchor="middle" fontSize="8"
            fill={B.sageD} fontFamily="IBM Plex Mono, monospace">→ repair → move forward</text>
        </g>

        {/* Right branch — spiral */}
        <path d="M 160 65 L 240 95"
          fill="none" stroke={B.red} strokeWidth="2" strokeLinecap="round"
          style={{
            strokeDasharray: 100,
            strokeDashoffset: go ? 0 : 100,
            transition: 'stroke-dashoffset 0.6s 0.9s',
          }}
        />

        {/* Spiral path */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 1.3s' }}>
          <rect x="182" y="95" width="115" height="22" rx="6"
            fill={B.redL} stroke={B.red} strokeWidth="1"/>
          <text x="239" y="109" textAnchor="middle" fontSize="9"
            fill={B.red} fontFamily="Lexend, sans-serif" fontWeight="500">Spiral</text>
        </g>

        {/* Spiral — the inward loop */}
        {go && (
          <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.5s 1.5s' }}>
            <path d="M 239 117 C 239 130 255 135 255 148 C 255 161 239 165 239 158 C 239 151 249 149 249 141 C 249 133 239 131 239 138"
              fill="none" stroke={B.red} strokeWidth="1.5" strokeLinecap="round"
              strokeOpacity="0.6"/>
            <text x="239" y="132" textAnchor="middle" fontSize="8"
              fill={B.red} fontFamily="IBM Plex Mono, monospace">what does this</text>
            <text x="239" y="142" textAnchor="middle" fontSize="8"
              fill={B.red} fontFamily="IBM Plex Mono, monospace">mean about me?</text>
            <text x="239" y="155" textAnchor="middle" fontSize="7.5"
              fill={B.red} fontFamily="IBM Plex Mono, monospace" opacity="0.6">no end point</text>
          </g>
        )}

        {/* Fork label */}
        <text x="160" y="80" textAnchor="middle" fontSize="8"
          fill={B.pewter} fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.3s 0.6s' }}>
          ↙ moves forward · circles inward ↘
        </text>
      </svg>
      <div className="anim-caption">They feel similar. They go in opposite directions. Accountability has an end point. The spiral doesn't.</div>
    </div>
  );
}

// ─────────────────────────────────────────
// M16 — TWO VERSIONS, SAME MOMENT
// Split screen: parent sees / partner sees
// ─────────────────────────────────────────
export function TwoVersionsAnimation() {
  const [ref, go] = useScrollTrigger(0.35);
  const partnerSees = ['the reaction', 'the snap', 'the small thing', 'the pattern'];
  const parentManaged = ['noise 4hrs', 'instruction ×3', 'no food', 'meds worn off', 'work unresolved'];
  return (
    <div ref={ref} className="anim-wrap" aria-label="Two versions of the same moment">
      <div className="anim-label-top">Same moment — two completely different views</div>
      <svg viewBox="0 0 320 185" style={{ width: '100%', display: 'block' }}>

        {/* Moment in middle */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 0.3s' }}>
          <rect x="128" y="78" width="64" height="32" rx="6"
            fill={B.redL} stroke={B.red} strokeWidth="1"/>
          <text x="160" y="92" textAnchor="middle" fontSize="8.5"
            fill={B.red} fontFamily="IBM Plex Mono, monospace">the snap</text>
          <text x="160" y="103" textAnchor="middle" fontSize="7.5"
            fill={B.red} fontFamily="IBM Plex Mono, monospace" opacity="0.7">one moment</text>
        </g>

        {/* Left — what partner sees */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 0.2s' }}>
          <text x="58" y="22" textAnchor="middle" fontSize="8"
            fill={B.pewter} fontFamily="IBM Plex Mono, monospace" letterSpacing="0.08em">PARTNER SEES</text>
          <rect x="10" y="30" width="96" height="130" rx="8"
            fill="white" stroke={B.pewterL} strokeWidth="1"/>
        </g>
        {partnerSees.map((item, i) => (
          <g key={i} style={{ opacity: go ? 1 : 0, transition: `opacity 0.3s ${0.5 + i * 0.2}s` }}>
            <rect x="20" y={42 + i * 27} width="76" height="20" rx="4"
              fill={B.mist} stroke={B.pewterL} strokeWidth="0.6"/>
            <text x="58" y={55 + i * 27} textAnchor="middle" fontSize="8.5"
              fill={B.pewter} fontFamily="Lexend, sans-serif">{item}</text>
          </g>
        ))}

        {/* Right — what parent was managing */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 0.4s' }}>
          <text x="262" y="22" textAnchor="middle" fontSize="8"
            fill={B.blue} fontFamily="IBM Plex Mono, monospace" letterSpacing="0.08em">PARENT HELD</text>
          <rect x="214" y="30" width="96" height="130" rx="8"
            fill={B.blueL} stroke={B.blue} strokeWidth="0.8" strokeOpacity="0.5"/>
        </g>
        {parentManaged.map((item, i) => (
          <g key={i} style={{ opacity: go ? 1 : 0, transition: `opacity 0.3s ${0.6 + i * 0.18}s` }}>
            <rect x="222" y={38 + i * 24} width="80" height="18" rx="4"
              fill={B.blueL} stroke={B.blue} strokeWidth="0.6" strokeOpacity="0.6"/>
            <text x="262" y={50 + i * 24} textAnchor="middle" fontSize="8"
              fill={B.blue} fontFamily="Lexend, sans-serif">{item}</text>
          </g>
        ))}

        {/* Arrows from moment to each side */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 1.4s' }}>
          <line x1="128" y1="94" x2="106" y2="94"
            stroke={B.pewterL} strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="192" y1="94" x2="214" y2="94"
            stroke={B.blue} strokeWidth="1.5" strokeLinecap="round"/>
        </g>

        {/* Both valid label */}
        <text x="160" y="175" textAnchor="middle" fontSize="8"
          fill={B.pewter} fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 1.8s' }}>
          both accounts are real · they describe different things
        </text>
      </svg>
      <div className="anim-caption">They see the match. They don't see what was already burning. The goal isn't one correct version — it's understanding there were two.</div>
    </div>
  );
}

// ─────────────────────────────────────────
// M20 — ONE NOTCH UPSTREAM
// Same moment on timeline, intervention moving earlier each time
// ─────────────────────────────────────────
export function NotchUpstreamAnimation() {
  const [ref, go] = useScrollTrigger(0.35);
  const iterations = [
    { label: 'before this course', interventionAt: 0.92, color: B.red },
    { label: 'month 1', interventionAt: 0.70, color: B.apricot },
    { label: 'month 3', interventionAt: 0.48, color: B.lavender },
    { label: 'month 6', interventionAt: 0.28, color: B.sageD },
  ];
  return (
    <div ref={ref} className="anim-wrap" aria-label="Catching it slightly earlier over time">
      <div className="anim-label-top">The goal — one notch earlier each time</div>
      <svg viewBox="0 0 320 185" style={{ width: '100%', display: 'block' }}>

        {iterations.map((iter, i) => {
          const y = 30 + i * 36;
          const lineW = 240;
          const startX = 60;
          const endX = startX + lineW;
          const interventionX = startX + iter.interventionAt * lineW;
          return (
            <g key={i} style={{ opacity: go ? 1 : 0, transition: `opacity 0.5s ${0.3 + i * 0.35}s` }}>
              {/* Timeline */}
              <line x1={startX} y1={y + 12} x2={endX} y2={y + 12}
                stroke={B.mist} strokeWidth="2"/>

              {/* Explosion point — always at end */}
              <circle cx={endX} cy={y + 12} r="5"
                fill={B.redL} stroke={B.red} strokeWidth="1.5"/>

              {/* Filled line up to intervention */}
              <line x1={startX} y1={y + 12} x2={interventionX} y2={y + 12}
                stroke={iter.color} strokeWidth="2.5" strokeLinecap="round"
                style={{
                  strokeDasharray: lineW,
                  strokeDashoffset: go ? 0 : lineW,
                  transition: `stroke-dashoffset 0.8s ${0.5 + i * 0.35}s ease-out`,
                }}
              />

              {/* Intervention marker */}
              <circle cx={interventionX} cy={y + 12} r="5"
                fill={iter.color}
                style={{ opacity: go ? 1 : 0, transition: `opacity 0.3s ${1.1 + i * 0.35}s` }}
              />

              {/* Labels */}
              <text x={startX - 8} y={y + 16} textAnchor="end" fontSize="8"
                fill={B.pewter} fontFamily="IBM Plex Mono, monospace">{iter.label}</text>
              {i === 0 && (
                <text x={endX + 6} y={y + 16} fontSize="8"
                  fill={B.red} fontFamily="IBM Plex Mono, monospace"
                  style={{ opacity: go ? 1 : 0, transition: 'opacity 0.3s 1.0s' }}>
                  explosion
                </text>
              )}
              {i === iterations.length - 1 && (
                <text x={interventionX - 2} y={y - 2} textAnchor="middle" fontSize="7.5"
                  fill={iter.color} fontFamily="IBM Plex Mono, monospace"
                  style={{ opacity: go ? 1 : 0, transition: 'opacity 0.3s 2.1s' }}>
                  ↑ caught here
                </text>
              )}
            </g>
          );
        })}

        {/* Arrow showing progress direction */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 1.8s' }}>
          <line x1="30" y1="35" x2="30" y2="155"
            stroke={B.pewterL} strokeWidth="1"/>
          <polygon points="26,152 30,158 34,152" fill={B.pewterL}/>
          <text x="16" y="98" textAnchor="middle" fontSize="7.5"
            fill={B.pewter} fontFamily="IBM Plex Mono, monospace"
            transform="rotate(-90, 16, 98)">upstream</text>
        </g>

        {/* Bottom note */}
        <text x="160" y="178" textAnchor="middle" fontSize="8"
          fill={B.pewter} fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 2.2s' }}>
          not visible in any single moment · visible in the relationship over time
        </text>
      </svg>
      <div className="anim-caption">Slightly earlier. Not perfectly. Not always. One notch upstream of where you were before — that's the whole goal.</div>
    </div>
  );
}