// GrowAnimations.jsx — v2 with corrected layout
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
  const [replayKey, setReplayKey] = useState(0);
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
  const replay = () => { setTriggered(false); setReplayKey(k => k + 1); setTimeout(() => setTriggered(true), 50); };
  return [ref, triggered, replay, replayKey];
}

function ReplayButton({ onClick }) {
  const [clicked, setClicked] = useState(false);
  return (
    <button
      onClick={() => { setClicked(true); onClick(); setTimeout(() => setClicked(false), 600); }}
      title="Replay"
      style={{
        position: 'absolute', top: '12px', right: '12px',
        width: '28px', height: '28px', borderRadius: '50%',
        background: 'rgba(31,42,55,0.05)', border: '1px solid rgba(31,42,55,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', padding: 0,
        transform: clicked ? 'rotate(360deg)' : 'rotate(0deg)',
        transition: 'transform 0.5s ease', color: '#56606E', fontSize: '12px',
      }}
    >↺</button>
  );
}

// ─── CONTAINER PARENT (M6) ───
// Items centred in a wide container, shortened labels
export function ContainerAnimationParent() {
  const [ref, go, replay] = useScrollTrigger(0.4);
  const items = [
    { label: 'noise since 4pm',   delay: 0,   warm: false },
    { label: 'told them 3× already', delay: 0.6, warm: false },
    { label: 'work still unresolved', delay: 1.2, warm: false },
    { label: 'meds worn off',     delay: 1.8, warm: true },
    { label: "haven't eaten",     delay: 2.4, warm: true },
  ];
  return (
    <div ref={ref} className="anim-wrap" style={{ position: 'relative' }} aria-label="The stack fills before the spark">
      <ReplayButton onClick={replay} />
      <div className="anim-label-top">The stack fills before the spark lands</div>
      <svg viewBox="0 0 360 240" style={{ width: '100%', display: 'block' }}>
        {/* Container */}
        <rect x="80" y="55" width="200" height="145" rx="10" fill="white" stroke={B.pewterL} strokeWidth="1.5"/>
        <rect x="81" y="56" width="198" height="143" rx="9" fill={B.cloud}/>
        {/* Items stacking from bottom */}
        {items.map((item, i) => (
          <g key={i} style={{ opacity: go ? 1 : 0, transform: go ? 'translateY(0)' : 'translateY(10px)', transition: `opacity 0.4s ${item.delay + 0.3}s, transform 0.4s ${item.delay + 0.3}s` }}>
            <rect x="90" y={170 - i * 22} width="180" height="18" rx="4"
              fill={item.warm ? B.apricotL : B.blueL}
              stroke={item.warm ? B.apricot : B.blue}
              strokeWidth="0.8" strokeOpacity="0.6"/>
            <text x="180" y={182 - i * 22} textAnchor="middle" fontSize="11"
              fill={item.warm ? B.apricot : B.blue} fontFamily="IBM Plex Mono, monospace">
              {item.label}
            </text>
          </g>
        ))}
        {/* Overflow ripples */}
        {[0,1,2].map(i => (
          <ellipse key={i} cx="180" cy="57" rx={18 + i * 16} ry={5 + i * 2}
            fill="none" stroke={B.apricot} strokeWidth="1.2"
            style={{ opacity: go ? 0.6 - i * 0.18 : 0, transition: `opacity 0.4s ${3.5 + i * 0.2}s` }}/>
        ))}
        {/* Spark */}
        <g style={{ opacity: go ? 1 : 0, transform: go ? 'translate(0,0)' : 'translate(0,-16px)', transition: `opacity 0.2s 2.9s, transform 0.3s 2.9s` }}>
          <circle cx="180" cy="42" r="11" fill={B.red} opacity="0.12"/>
          <text x="180" y="46" textAnchor="middle" fontSize="14">☕</text>
        </g>
        <text x="180" y="35" textAnchor="middle" fontSize="11" fill={B.red} fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: `opacity 0.2s 2.9s` }}>
          the cup
        </text>
        <line x1="180" y1="53" x2="180" y2="57" stroke={B.red} strokeWidth="1.5" strokeLinecap="round"
          style={{ opacity: go ? 1 : 0, transition: `opacity 0.2s 3.0s` }}/>
        {/* Footer labels */}
        <text x="180" y="220" textAnchor="middle" fontSize="11" fill={B.pewter} fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: `opacity 0.3s 1.0s` }}>
          load accumulates → spark overflows the container
        </text>
      </svg>
      <div className="anim-caption">The spark didn't cause it. The full container caused it. The spark just broke the seal.</div>
    </div>
  );
}

export const ContainerAnimation = ContainerAnimationParent;

// ─── CONTAINER CHILD (M3) ───
export function ContainerAnimationChild() {
  const [ref, go, replay] = useScrollTrigger(0.4);
  const items = [
    { label: 'sitting still',     delay: 0,   warm: false },
    { label: 'impulse control',   delay: 0.6, warm: false },
    { label: 'social navigation', delay: 1.2, warm: false },
    { label: 'masking fidgets',   delay: 1.8, warm: true },
    { label: 'following rules',   delay: 2.4, warm: true },
  ];
  return (
    <div ref={ref} className="anim-wrap" style={{ position: 'relative' }} aria-label="What fills a child's container at school">
      <ReplayButton onClick={replay} />
      <div className="anim-label-top">What fills their container during a school day</div>
      <svg viewBox="0 0 360 240" style={{ width: '100%', display: 'block' }}>
        <rect x="80" y="55" width="200" height="145" rx="10" fill="white" stroke={B.pewterL} strokeWidth="1.5"/>
        <rect x="81" y="56" width="198" height="143" rx="9" fill={B.cloud}/>
        {items.map((item, i) => (
          <g key={i} style={{ opacity: go ? 1 : 0, transform: go ? 'translateY(0)' : 'translateY(10px)', transition: `opacity 0.4s ${item.delay + 0.3}s, transform 0.4s ${item.delay + 0.3}s` }}>
            <rect x="90" y={170 - i * 22} width="180" height="18" rx="4"
              fill={item.warm ? B.apricotL : B.blueL}
              stroke={item.warm ? B.apricot : B.blue}
              strokeWidth="0.8" strokeOpacity="0.6"/>
            <text x="180" y={182 - i * 22} textAnchor="middle" fontSize="11"
              fill={item.warm ? B.apricot : B.blue} fontFamily="IBM Plex Mono, monospace">
              {item.label}
            </text>
          </g>
        ))}
        {[0,1,2].map(i => (
          <ellipse key={i} cx="180" cy="57" rx={18 + i * 16} ry={5 + i * 2}
            fill="none" stroke={B.apricot} strokeWidth="1.2"
            style={{ opacity: go ? 0.6 - i * 0.18 : 0, transition: `opacity 0.4s ${3.5 + i * 0.2}s` }}/>
        ))}
        <g style={{ opacity: go ? 1 : 0, transform: go ? 'translate(0,0)' : 'translate(0,-16px)', transition: `opacity 0.2s 2.9s, transform 0.3s 2.9s` }}>
          <text x="180" y="46" textAnchor="middle" fontSize="16">🏠</text>
        </g>
        <text x="180" y="35" textAnchor="middle" fontSize="11" fill={B.red} fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: `opacity 0.2s 2.9s` }}>
          home
        </text>
        <text x="180" y="220" textAnchor="middle" fontSize="11" fill={B.pewter} fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: `opacity 0.3s 1.0s` }}>
          6 hours of effort → arrives home already full
        </text>
      </svg>
      <div className="anim-caption">They didn't decide to fall apart. Their container was already full. Home is where it was safe to overflow.</div>
    </div>
  );
}

// ─── 90-SECOND WINDOW (M2) ───
export function NinetySecondAnimation() {
  const [ref, go, replay] = useScrollTrigger(0.4);
  return (
    <div ref={ref} className="anim-wrap" style={{ position: 'relative' }} aria-label="The 90-second neurochemical window">
      <ReplayButton onClick={replay} />
      <div className="anim-label-top">The 90-second window</div>
      <svg viewBox="0 0 360 185" style={{ width: '100%', display: 'block' }}>
        {/* Axes */}
        <line x1="40" y1="20" x2="40" y2="148" stroke={B.pewterL} strokeWidth="1.5"/>
        <line x1="40" y1="148" x2="320" y2="148" stroke={B.pewterL} strokeWidth="1.5"/>
        {/* Axis labels */}
        <text x="180" y="165" textAnchor="middle" fontSize="11" fill={B.pewter} fontFamily="IBM Plex Mono, monospace">time →</text>
        <text x="25" y="85" textAnchor="middle" fontSize="11" fill={B.pewter} fontFamily="IBM Plex Mono, monospace"
          transform="rotate(-90,25,85)">intensity</text>
        {/* Peak curve */}
        <path d="M 50 148 C 70 148 80 35 115 28 C 140 23 160 23 185 38 C 210 60 230 110 310 143"
          fill="none" stroke={B.red} strokeWidth="2.5" strokeLinecap="round"
          style={{ strokeDasharray: 420, strokeDashoffset: go ? 0 : 420, transition: 'stroke-dashoffset 2.2s 0.3s ease-out' }}/>
        {/* Fill */}
        <path d="M 50 148 C 70 148 80 35 115 28 C 140 23 160 23 185 38 C 210 60 230 110 310 143 L 310 148 Z"
          fill={B.red} fillOpacity={go ? 0.07 : 0} style={{ transition: 'fill-opacity 0.5s 2.3s' }}/>
        {/* 90s marker */}
        <line x1="185" y1="30" x2="185" y2="148" stroke={B.sageD} strokeWidth="1.2" strokeDasharray="5 3"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 1.8s' }}/>
        <text x="185" y="22" textAnchor="middle" fontSize="11" fill={B.sageD} fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 1.8s' }}>~90 sec peak</text>
        {/* Keep feeding */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 2.5s' }}>
          <path d="M 185 38 C 215 20 260 18 290 42" fill="none" stroke={B.red} strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round"/>
          <text x="260" y="15" textAnchor="middle" fontSize="11" fill={B.red} fontFamily="IBM Plex Mono, monospace">stay in it</text>
          <text x="260" y="27" textAnchor="middle" fontSize="11" fill={B.red} fontFamily="IBM Plex Mono, monospace" opacity="0.7">stays high</text>
        </g>
        {/* Step away */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 2.8s' }}>
          <text x="250" y="118" textAnchor="middle" fontSize="11" fill={B.sageD} fontFamily="IBM Plex Mono, monospace">step away</text>
          <text x="250" y="130" textAnchor="middle" fontSize="11" fill={B.sageD} fontFamily="IBM Plex Mono, monospace" opacity="0.7">descends</text>
        </g>
        {/* Start label */}
        <text x="50" y="163" textAnchor="middle" fontSize="11" fill={B.pewter} fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.3s 0.5s' }}>trigger</text>
      </svg>
      <div className="anim-caption">You're not in a character crisis. You're in a window. Windows close on their own if you stop feeding them.</div>
    </div>
  );
}

// ─── MASKING COST (M2) ───
export function MaskingCostAnimation() {
  const [ref, go, replay] = useScrollTrigger(0.4);
  const moments = [
    { time: 'Morning', icon: '🌅', cost: 10 },
    { time: 'Commute', icon: '🚌', cost: 18 },
    { time: 'Work',    icon: '💼', cost: 45 },
    { time: 'Meeting', icon: '📋', cost: 17 },
    { time: 'Home',    icon: '🏠', cost: 0  },
  ];
  const colors = ['#7FA88E','#7FA88E','#4A6FA5','#E8A87C'];
  let cumX = 50;
  const total = 260;
  return (
    <div ref={ref} className="anim-wrap" style={{ position: 'relative' }} aria-label="Where regulation resource goes across the day">
      <ReplayButton onClick={replay} />
      <div className="anim-label-top">Where the regulation resource goes</div>
      <svg viewBox="0 0 360 175" style={{ width: '100%', display: 'block' }}>
        {/* Track */}
        <text x="180" y="24" textAnchor="middle" fontSize="11" fill={B.pewter} fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.3s 0.2s' }}>
          REGULATION RESOURCE
        </text>
        <rect x="50" y="32" width={total} height="20" rx="10" fill={B.mist} stroke={B.pewterL} strokeWidth="0.8"/>
        {/* Segments */}
        {moments.slice(0,-1).map((m, i) => {
          const w = Math.round((m.cost / 90) * total);
          const x = cumX;
          cumX += w;
          return (
            <rect key={i} x={x} y="32" width={w} height="20"
              rx={i === 0 ? 10 : 0}
              fill={colors[i % colors.length]} fillOpacity={go ? 0.7 : 0}
              style={{ transition: `fill-opacity 0.5s ${i * 0.4 + 0.5}s` }}/>
          );
        })}
        {/* Empty marker */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 2.3s' }}>
          <line x1="310" y1="28" x2="310" y2="56" stroke={B.red} strokeWidth="1.5"/>
          <text x="310" y="20" textAnchor="middle" fontSize="11" fill={B.red} fontFamily="IBM Plex Mono, monospace">empty</text>
        </g>
        {/* Icons + labels */}
        {moments.map((m, i) => {
          const xPos = 50 + Math.round((i / (moments.length - 1)) * total);
          return (
            <g key={i} style={{ opacity: go ? 1 : 0, transition: `opacity 0.3s ${i * 0.35 + 0.4}s` }}>
              <text x={xPos} y="80" textAnchor="middle" fontSize="16">{m.icon}</text>
              <text x={xPos} y="96" textAnchor="middle" fontSize="11" fill={B.pewter} fontFamily="IBM Plex Mono, monospace">{m.time}</text>
            </g>
          );
        })}
        {/* Bottom note */}
        <text x="180" y="125" textAnchor="middle" fontSize="11" fill={B.pewter} fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.3s 2.5s' }}>
          mask drops at home, exactly when they need you most
        </text>
      </svg>
      <div className="anim-caption">Home is where the mask drops, exactly when your child needs the resource you spent all day.</div>
    </div>
  );
}

// ─── AMPLIFICATION LOOP (M4) ───
export function AmplificationAnimation() {
  const [ref, go, replay] = useScrollTrigger(0.4);
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!go) return;
    setPhase(0);
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 1800),
      setTimeout(() => setPhase(3), 2800),
      setTimeout(() => setPhase(4), 4000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [go, replay]);
  return (
    <div ref={ref} className="anim-wrap" style={{ position: 'relative' }} aria-label="The amplification loop">
      <ReplayButton onClick={replay} />
      <div className="anim-label-top">The amplification loop</div>
      <svg viewBox="0 0 360 190" style={{ width: '100%', display: 'block' }}>
        {/* Phase label */}
        <text x="180" y="22" textAnchor="middle" fontSize="11" fill={B.pewter} fontFamily="IBM Plex Mono, monospace">
          {phase === 0 ? 'starting state' : phase === 1 ? 'contagion begins' : phase === 2 ? 'both dysregulated' : phase === 3 ? 'amplification loop' : '60 seconds apart'}
        </text>
        {/* Parent */}
        <circle cx="95" cy="100" r={phase >= 2 ? 42 : 30}
          fill={phase >= 1 ? B.apricotL : B.blueL}
          stroke={phase >= 2 ? B.red : B.blue} strokeWidth={phase >= 2 ? 2 : 1.5}
          style={{ transition: 'all 0.6s ease' }}/>
        <text x="95" y="96" textAnchor="middle" fontSize="12" fill={B.slate} fontFamily="Lexend, sans-serif" fontWeight="500">Parent</text>
        <text x="95" y="111" textAnchor="middle" fontSize="11" fill={phase >= 2 ? B.red : B.pewter} fontFamily="IBM Plex Mono, monospace" style={{ transition: 'fill 0.3s' }}>
          {phase === 0 ? 'calm' : phase === 1 ? 'rising' : phase < 4 ? 'dysreg.' : 'settling'}
        </text>
        {/* Child */}
        <circle cx="265" cy="100" r={phase >= 1 ? 42 : 30}
          fill={phase >= 1 ? B.apricotL : B.sageL}
          stroke={phase >= 1 ? B.red : B.sageD} strokeWidth={phase >= 1 ? 2 : 1.5}
          style={{ transition: 'all 0.6s ease' }}/>
        <text x="265" y="96" textAnchor="middle" fontSize="12" fill={B.slate} fontFamily="Lexend, sans-serif" fontWeight="500">Child</text>
        <text x="265" y="111" textAnchor="middle" fontSize="11" fill={phase >= 1 ? B.red : B.sageD} fontFamily="IBM Plex Mono, monospace" style={{ transition: 'fill 0.3s' }}>
          {phase === 0 ? 'meltdown' : phase < 4 ? 'escalating' : 'settling'}
        </text>
        {/* Arrows */}
        {phase >= 1 && phase < 4 && (
          <>
            <path d="M 138 88 C 168 72 192 72 222 88" fill="none" stroke={B.red} strokeWidth="1.5" strokeDasharray="4 3" style={{ opacity: 0.7 }}>
              <animate attributeName="stroke-dashoffset" values="20;0" dur="1s" repeatCount="indefinite"/>
            </path>
            <path d="M 222 112 C 192 128 168 128 138 112" fill="none" stroke={B.red} strokeWidth="1.5" strokeDasharray="4 3" style={{ opacity: 0.7 }}>
              <animate attributeName="stroke-dashoffset" values="0;20" dur="1s" repeatCount="indefinite"/>
            </path>
            <text x="180" y="68" textAnchor="middle" fontSize="11" fill={B.red} fontFamily="IBM Plex Mono, monospace">amplifying</text>
          </>
        )}
        {/* Distance */}
        {phase >= 4 && (
          <>
            <line x1="180" y1="52" x2="180" y2="148" stroke={B.sageD} strokeWidth="1.5" strokeDasharray="5 3" opacity="0.7"/>
            <text x="180" y="162" textAnchor="middle" fontSize="11" fill={B.sageD} fontFamily="IBM Plex Mono, monospace">distance breaks the loop</text>
          </>
        )}
      </svg>
      <div className="anim-caption">Two reactive nervous systems in proximity amplify each other. Distance is not abandonment. It breaks the loop.</div>
    </div>
  );
}

// ─── SIGNAL (M6) ───
export function SignalAnimation() {
  const [ref, go, replay] = useScrollTrigger(0.4);
  return (
    <div ref={ref} className="anim-wrap" style={{ position: 'relative' }} aria-label="The physical signal before the explosion">
      <ReplayButton onClick={replay} />
      <div className="anim-label-top">The signal arrives before the reaction</div>
      <svg viewBox="0 0 360 220" style={{ width: '100%', display: 'block' }}>
        {/* Body — centred at 180 */}
        <g transform="translate(152, 20)">
          <ellipse cx="28" cy="18" rx="14" ry="16" fill={B.slate} fillOpacity="0.12" stroke={B.pewterL} strokeWidth="1"/>
          <rect x="14" y="34" width="28" height="50" rx="8" fill={B.slate} fillOpacity="0.1" stroke={B.pewterL} strokeWidth="1"/>
          <rect x="1" y="36" width="12" height="34" rx="6" fill={B.slate} fillOpacity="0.08" stroke={B.pewterL} strokeWidth="0.8"/>
          <rect x="43" y="36" width="12" height="34" rx="6" fill={B.slate} fillOpacity="0.08" stroke={B.pewterL} strokeWidth="0.8"/>
          <rect x="14" y="83" width="11" height="38" rx="6" fill={B.slate} fillOpacity="0.08" stroke={B.pewterL} strokeWidth="0.8"/>
          <rect x="31" y="83" width="11" height="38" rx="6" fill={B.slate} fillOpacity="0.08" stroke={B.pewterL} strokeWidth="0.8"/>
          {/* Chest heat */}
          {[0,1,2,3].map(i => (
            <ellipse key={i} cx="28" cy={56 - i * 8} rx={7 + i * 4} ry={4 + i * 2}
              fill={B.apricot} fillOpacity={go ? Math.max(0, 0.5 - i * 0.1) : 0}
              style={{ transition: `fill-opacity 0.4s ${i * 0.25 + 0.5}s` }}/>
          ))}
          {/* Jaw */}
          <path d="M 18 27 Q 28 32 38 27" fill="none"
            stroke={go ? B.red : B.pewterL} strokeWidth={go ? 2 : 1}
            style={{ transition: 'stroke 0.3s 1.5s, stroke-width 0.3s 1.5s' }}/>
          {/* Shoulders */}
          <path d="M 6 36 Q 28 27 50 36" fill="none"
            stroke={go ? B.apricot : B.pewterL} strokeWidth={go ? 2 : 1}
            style={{ transition: 'stroke 0.3s 1.8s, stroke-width 0.3s 1.8s' }}/>
        </g>
        {/* Left labels — heat */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 1.0s' }}>
          <line x1="140" y1="88" x2="158" y2="82" stroke={B.apricot} strokeWidth="1" strokeLinecap="round"/>
          <text x="90" y="84" textAnchor="middle" fontSize="12" fill={B.apricot} fontFamily="IBM Plex Mono, monospace">heat rising</text>
        </g>
        {/* Left — jaw */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 1.5s' }}>
          <line x1="140" y1="62" x2="158" y2="58" stroke={B.red} strokeWidth="1" strokeLinecap="round"/>
          <text x="88" y="58" textAnchor="middle" fontSize="12" fill={B.red} fontFamily="IBM Plex Mono, monospace">jaw tightens</text>
        </g>
        {/* Right — shoulders */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 1.8s' }}>
          <line x1="220" y1="58" x2="202" y2="54" stroke={B.red} strokeWidth="1" strokeLinecap="round"/>
          <text x="272" y="58" textAnchor="middle" fontSize="12" fill={B.red} fontFamily="IBM Plex Mono, monospace">shoulders up</text>
        </g>
        {/* Window callout */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 2.5s' }}>
          <rect x="80" y="158" width="200" height="36" rx="8" fill={B.blueL} stroke={B.blue} strokeWidth="0.8"/>
          <text x="180" y="173" textAnchor="middle" fontSize="12" fill={B.blue} fontFamily="IBM Plex Mono, monospace">30 seconds before the explosion</text>
          <text x="180" y="186" textAnchor="middle" fontSize="12" fill={B.slate} fontFamily="Lexend, sans-serif">This is your intervention window</text>
        </g>
      </svg>
      <div className="anim-caption">The signal is consistent. Once you know what yours feels like, you have a window that didn't exist before.</div>
    </div>
  );
}

// ─── REPAIR (M5) ───
export function RepairAnimation() {
  const [ref, go, replay] = useScrollTrigger(0.4);
  return (
    <div ref={ref} className="anim-wrap" style={{ position: 'relative' }} aria-label="What repair looks like">
      <ReplayButton onClick={replay} />
      <div className="anim-label-top">What repair actually is</div>
      <svg viewBox="0 0 360 155" style={{ width: '100%', display: 'block' }}>
        {/* Before line */}
        <line x1="25" y1="75" x2="110" y2="75" stroke={B.sageD} strokeWidth="2.5" strokeLinecap="round"
          style={{ strokeDasharray: 90, strokeDashoffset: go ? 0 : 90, transition: 'stroke-dashoffset 0.6s 0.2s ease-out' }}/>
        {/* Rupture */}
        <polyline points="110,75 122,48 136,102 150,48 162,75"
          fill="none" stroke={B.red} strokeWidth="2.5" strokeLinejoin="round"
          style={{ strokeDasharray: 130, strokeDashoffset: go ? 0 : 130, transition: 'stroke-dashoffset 0.7s 0.7s ease-out' }}/>
        {/* Gap */}
        <line x1="162" y1="75" x2="198" y2="75" stroke={B.pewterL} strokeWidth="2" strokeDasharray="4 3"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.3s 1.3s' }}/>
        {/* Two sentences */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.5s 1.8s' }}>
          <rect x="198" y="52" width="132" height="18" rx="4" fill={B.blueL} stroke={B.blue} strokeWidth="0.8"/>
          <text x="264" y="64" textAnchor="middle" fontSize="11" fill={B.blue} fontFamily="IBM Plex Mono, monospace">sentence 1: names it</text>
        </g>
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.5s 2.3s' }}>
          <rect x="198" y="74" width="132" height="18" rx="4" fill={B.sageL} stroke={B.sageD} strokeWidth="0.8"/>
          <text x="264" y="86" textAnchor="middle" fontSize="11" fill={B.sageD} fontFamily="IBM Plex Mono, monospace">sentence 2: next step</text>
        </g>
        {/* After line */}
        <line x1="330" y1="75" x2="350" y2="75" stroke={B.sageD} strokeWidth="2.5" strokeLinecap="round"
          style={{ strokeDasharray: 22, strokeDashoffset: go ? 0 : 22, transition: 'stroke-dashoffset 0.4s 3.0s ease-out' }}/>
        {/* Labels */}
        <text x="68" y="100" textAnchor="middle" fontSize="11" fill={B.pewter} fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.3s 0.5s' }}>before</text>
        <text x="136" y="120" textAnchor="middle" fontSize="11" fill={B.red} fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.3s 1.0s' }}>rupture</text>
        <text x="264" y="110" textAnchor="middle" fontSize="11" fill={B.blue} fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.3s 2.0s' }}>two sentences · when calm</text>
        <text x="344" y="100" textAnchor="middle" fontSize="11" fill={B.sageD} fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.3s 3.2s' }}>after</text>
      </svg>
      <div className="anim-caption">Two sentences, unconditional, when both of you are calm. Then something ordinary.</div>
    </div>
  );
}

// ─── CO-REGULATION (M4) ───
export function CoRegulationAnimation() {
  const [ref, go, replay] = useScrollTrigger(0.4);
  return (
    <div ref={ref} className="anim-wrap" style={{ position: 'relative' }} aria-label="Co-regulation breaking under stress">
      <ReplayButton onClick={replay} />
      <div className="anim-label-top">Why co-regulation breaks under stress</div>
      <svg viewBox="0 0 360 170" style={{ width: '100%', display: 'block' }}>
        {/* Parent label */}
        <text x="60" y="28" textAnchor="middle" fontSize="11" fill={B.pewter} fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.3s 0.3s' }}>Parent</text>
        {/* Parent wave — calm */}
        <path d="M 30 72 Q 50 52 70 72 Q 90 92 110 72 Q 130 52 150 72 Q 170 92 190 72 Q 210 52 230 72 Q 250 92 270 72 Q 290 52 310 72 Q 330 92 345 72"
          fill="none" stroke={B.blue} strokeWidth="2"
          style={{ strokeDasharray: 370, strokeDashoffset: go ? 0 : 370, transition: 'stroke-dashoffset 1.5s 0.4s ease-out' }}/>
        {/* Child label */}
        <text x="60" y="118" textAnchor="middle" fontSize="11" fill={B.pewter} fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.3s 0.8s' }}>Child</text>
        {/* Child wave — bigger amplitude */}
        <path d="M 30 118 Q 50 82 70 118 Q 90 154 110 118 Q 130 82 150 118 Q 170 154 190 118 Q 210 82 230 118 Q 250 154 270 118 Q 290 82 310 118 Q 330 154 345 118"
          fill="none" stroke={B.apricot} strokeWidth="2"
          style={{ strokeDasharray: 430, strokeDashoffset: go ? 0 : 430, transition: 'stroke-dashoffset 1.5s 0.9s ease-out' }}/>
        {/* Sync zone */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 2.3s' }}>
          <rect x="30" y="46" width="90" height="96" rx="4" fill={B.sageD} fillOpacity="0.06" stroke={B.sageD} strokeWidth="0.8" strokeDasharray="4 3"/>
          <text x="75" y="152" textAnchor="middle" fontSize="11" fill={B.sageD} fontFamily="IBM Plex Mono, monospace">calm → can sync</text>
        </g>
        {/* No sync zone */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 2.8s' }}>
          <rect x="200" y="46" width="145" height="96" rx="4" fill={B.red} fillOpacity="0.04" stroke={B.red} strokeWidth="0.8" strokeDasharray="4 3"/>
          <text x="272" y="152" textAnchor="middle" fontSize="11" fill={B.red} fontFamily="IBM Plex Mono, monospace">stressed → sync breaks</text>
        </g>
        <text x="180" y="20" textAnchor="middle" fontSize="11" fill={B.pewter} fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.3s 3.2s' }}>
          measured simultaneously in two brains (Azhari et al.)
        </text>
      </svg>
      <div className="anim-caption">When you're stressed, the mechanism that would help your child regulate goes offline. Not weakened. Offline.</div>
    </div>
  );
}