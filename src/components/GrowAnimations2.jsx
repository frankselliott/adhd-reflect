// GrowAnimations2.jsx — v2 with corrected layout
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
  const [replayKey, setReplayKey] = useState(0);
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
  const replay = () => { setTriggered(false); setReplayKey(k => k + 1); setTimeout(() => setTriggered(true), 50); };
  return [ref, triggered, replay, replayKey];
}

function ReplayButton2({ onClick }) {
  const [clicked, setClicked] = useState(false);
  return (
    <button onClick={() => { setClicked(true); onClick(); setTimeout(() => setClicked(false), 600); }}
      title="Replay" style={{
        position: 'absolute', top: '12px', right: '12px',
        width: '28px', height: '28px', borderRadius: '50%',
        background: 'rgba(31,42,55,0.05)', border: '1px solid rgba(31,42,55,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', padding: 0,
        transform: clicked ? 'rotate(360deg)' : 'rotate(0deg)',
        transition: 'transform 0.5s ease', color: '#56606E', fontSize: '12px',
      }}>↺</button>
  );
}

// ─── M1 — ADVICE GAP ───
export function AdviceGapAnimation() {
  const [ref, go, replay] = useScrollTrigger(0.35);
  return (
    <div ref={ref} className="anim-wrap" style={{ position: 'relative' }} aria-label="What parenting advice assumes vs your household">
      <ReplayButton2 onClick={replay} />
      <div className="anim-label-top">What the advice was built for — and what it missed</div>
      <svg viewBox="0 0 360 175" style={{ width: '100%', display: 'block' }}>
        {/* Left panel */}
        <g style={{ opacity: go ? 1 : 0, transform: go ? 'translateX(0)' : 'translateX(-14px)', transition: 'opacity 0.5s 0.3s, transform 0.5s 0.3s' }}>
          <rect x="15" y="25" width="148" height="130" rx="10" fill="white" stroke={B.pewterL} strokeWidth="1"/>
          <text x="89" y="17" textAnchor="middle" fontSize="11" fill={B.pewter} fontFamily="IBM Plex Mono, monospace">ADVICE ASSUMES</text>
          {[
            { y: 56,  icon: '😌', text: 'Regulated adult' },
            { y: 82,  icon: '📋', text: 'Working memory' },
            { y: 108, icon: '🔄', text: 'Consistency' },
            { y: 134, icon: '⏸', text: 'Can pause & choose' },
          ].map((item, i) => (
            <g key={i} style={{ opacity: go ? 1 : 0, transition: `opacity 0.4s ${0.5 + i * 0.15}s` }}>
              <text x="32" y={item.y} fontSize="14">{item.icon}</text>
              <text x="52" y={item.y + 1} fontSize="11" fill={B.pewter} fontFamily="Lexend, sans-serif">{item.text}</text>
            </g>
          ))}
        </g>
        {/* Right panel */}
        <g style={{ opacity: go ? 1 : 0, transform: go ? 'translateX(0)' : 'translateX(14px)', transition: 'opacity 0.5s 0.5s, transform 0.5s 0.5s' }}>
          <rect x="197" y="25" width="148" height="130" rx="10" fill={B.blueL} stroke={B.blue} strokeWidth="1" strokeOpacity="0.5"/>
          <text x="271" y="17" textAnchor="middle" fontSize="11" fill={B.blue} fontFamily="IBM Plex Mono, monospace">YOUR HOUSEHOLD</text>
          {[
            { y: 56,  icon: '⚡', text: 'Both dysregulate' },
            { y: 82,  icon: '🔓', text: 'WM unreliable' },
            { y: 108, icon: '↔️', text: 'Variable, not broken' },
            { y: 134, icon: '⏱', text: '30-sec window' },
          ].map((item, i) => (
            <g key={i} style={{ opacity: go ? 1 : 0, transition: `opacity 0.4s ${0.8 + i * 0.15}s` }}>
              <text x="213" y={item.y} fontSize="14">{item.icon}</text>
              <text x="234" y={item.y + 1} fontSize="11" fill={B.blue} fontFamily="Lexend, sans-serif">{item.text}</text>
            </g>
          ))}
        </g>
        {/* Gap */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 1.4s' }}>
          <line x1="165" y1="90" x2="195" y2="90" stroke={B.red} strokeWidth="1.5" strokeLinecap="round"/>
          <polygon points="192,86 198,90 192,94" fill={B.red}/>
          <text x="180" y="82" textAnchor="middle" fontSize="11" fill={B.red} fontFamily="IBM Plex Mono, monospace">gap</text>
        </g>
      </svg>
      <div className="anim-caption">The advice isn't wrong. It was built for a different household. This course is built for yours.</div>
    </div>
  );
}

// ─── M7 — INPUT VS CAPACITY ───
export function InputCapacityAnimation() {
  const [ref, go, replay] = useScrollTrigger(0.35);
  return (
    <div ref={ref} className="anim-wrap" style={{ position: 'relative' }} aria-label="More words, less received">
      <ReplayButton2 onClick={replay} />
      <div className="anim-label-top">More input — less received</div>
      <svg viewBox="0 0 360 170" style={{ width: '100%', display: 'block' }}>
        {/* Axes */}
        <line x1="45" y1="20" x2="45" y2="138" stroke={B.pewterL} strokeWidth="1.5"/>
        <line x1="45" y1="138" x2="335" y2="138" stroke={B.pewterL} strokeWidth="1.5"/>
        <text x="190" y="158" textAnchor="middle" fontSize="11" fill={B.pewter} fontFamily="IBM Plex Mono, monospace">sentences past the point</text>
        <text x="28" y="80" textAnchor="middle" fontSize="11" fill={B.pewter} fontFamily="IBM Plex Mono, monospace" transform="rotate(-90,28,80)">capacity</text>
        {/* Capacity curve */}
        <path d="M 50 38 C 85 38 115 45 148 72 C 178 96 210 122 268 135 C 295 138 318 138 330 138"
          fill="none" stroke={B.sageD} strokeWidth="2.5" strokeLinecap="round"
          style={{ strokeDasharray: 370, strokeDashoffset: go ? 0 : 370, transition: 'stroke-dashoffset 2s 0.4s ease-out' }}/>
        {/* Fill */}
        <path d="M 50 38 C 85 38 115 45 148 72 C 178 96 210 122 268 135 C 295 138 318 138 330 138 L 330 138 L 50 138 Z"
          fill={B.sageD} fillOpacity={go ? 0.07 : 0} style={{ transition: 'fill-opacity 0.4s 2.2s' }}/>
        {/* Input bar */}
        <rect x="50" y="136" width={go ? 280 : 0} height="4" rx="2" fill={B.red} fillOpacity="0.5"
          style={{ transition: 'width 2s 0.4s ease-out' }}/>
        {/* Annotations */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 1.4s' }}>
          <circle cx="100" cy="40" r="4" fill={B.sageD} fillOpacity="0.6"/>
          <text x="100" y="28" textAnchor="middle" fontSize="11" fill={B.sageD} fontFamily="IBM Plex Mono, monospace">sentence 1</text>
          <text x="100" y="18" textAnchor="middle" fontSize="11" fill={B.sageD} fontFamily="IBM Plex Mono, monospace" opacity="0.7">landing</text>
        </g>
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 1.8s' }}>
          <circle cx="190" cy="88" r="4" fill={B.apricot} fillOpacity="0.7"/>
          <text x="238" y="80" textAnchor="middle" fontSize="11" fill={B.apricot} fontFamily="IBM Plex Mono, monospace">sentence 3</text>
          <text x="238" y="68" textAnchor="middle" fontSize="11" fill={B.apricot} fontFamily="IBM Plex Mono, monospace" opacity="0.7">mostly noise</text>
        </g>
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 2.2s' }}>
          <circle cx="295" cy="137" r="4" fill={B.red}/>
          <text x="295" y="122" textAnchor="middle" fontSize="11" fill={B.red} fontFamily="IBM Plex Mono, monospace">sentence 7+</text>
          <text x="295" y="110" textAnchor="middle" fontSize="11" fill={B.red} fontFamily="IBM Plex Mono, monospace" opacity="0.7">zero received</text>
        </g>
      </svg>
      <div className="anim-caption">Every sentence past the third works against you. The lesson is real — the conditions to receive it don't exist yet.</div>
    </div>
  );
}

// ─── M8 — INVISIBLE STEPS ───
// Redesigned: two rows of pill chips (memory zone, chart zone) with clear spacing
export function InvisibleStepsAnimation() {
  const [ref, go, replay] = useScrollTrigger(0.35);
  const memoryItems = ['sports day', 'permission slip', 'who ate yet?', 'lunch decision'];
  const chartItems =  ['Get dressed', 'Breakfast', 'Brush teeth', 'Find bag'];
  return (
    <div ref={ref} className="anim-wrap" style={{ position: 'relative' }} aria-label="Visible vs invisible steps">
      <ReplayButton2 onClick={replay} />
      <div className="anim-label-top">The chart shows the visible steps. The invisible ones are in your head.</div>
      <svg viewBox="0 0 360 215" style={{ width: '100%', display: 'block' }}>
        {/* Memory zone */}
        <rect x="15" y="18" width="330" height="84" rx="8"
          fill={B.lavL} stroke={B.lavender} strokeWidth="0.8" strokeDasharray="5 3"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 0.2s' }}/>
        <text x="25" y="34" fontSize="11" fill={B.lavender} fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 0.2s' }}>
          WORKING MEMORY — invisible steps
        </text>
        {/* Memory chips — evenly spaced */}
        {memoryItems.map((item, i) => {
          const chipW = 74; const gap = 6;
          const totalW = memoryItems.length * chipW + (memoryItems.length - 1) * gap;
          const startX = (360 - totalW) / 2;
          const x = startX + i * (chipW + gap);
          return (
            <g key={i} style={{ opacity: go ? 1 : 0, transform: go ? 'translateY(0)' : 'translateY(-8px)', transition: `opacity 0.4s ${0.4 + i * 0.2}s, transform 0.4s ${0.4 + i * 0.2}s` }}>
              <rect x={x} y="44" width={chipW} height="22" rx="5" fill={B.lavL} stroke={B.lavender} strokeWidth="0.8"/>
              <text x={x + chipW/2} y="58" textAnchor="middle" fontSize="11" fill={B.lavender} fontFamily="IBM Plex Mono, monospace">{item}</text>
            </g>
          );
        })}
        {/* Drop arrows for items 1+2 */}
        {[1,2].map(i => {
          const chipW = 74; const gap = 6;
          const totalW = memoryItems.length * chipW + (memoryItems.length - 1) * gap;
          const startX = (360 - totalW) / 2;
          const cx = startX + i * (chipW + gap) + chipW/2;
          return (
            <g key={i}>
              <line x1={cx} y1="66" x2={cx} y2="148" stroke={B.red} strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.5"
                style={{ opacity: go ? 1 : 0, transition: `opacity 0.3s ${1.4 + i * 0.2}s` }}/>
              <text x={cx} y="162" textAnchor="middle" fontSize="12" fill={B.red} opacity="0.5"
                style={{ opacity: go ? 0.5 : 0, transition: `opacity 0.3s ${1.7 + i * 0.2}s` }}>✕</text>
              <text x={cx} y="173" textAnchor="middle" fontSize="11" fill={B.red} opacity="0.5" fontFamily="IBM Plex Mono, monospace"
                style={{ opacity: go ? 0.5 : 0, transition: `opacity 0.3s ${1.9 + i * 0.2}s` }}>dropped</text>
            </g>
          );
        })}
        {/* Chart zone */}
        <rect x="15" y="118" width="330" height="78" rx="8"
          fill="white" stroke={B.pewterL} strokeWidth="1"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 0.3s' }}/>
        <text x="25" y="134" fontSize="11" fill={B.pewter} fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 0.3s' }}>
          THE CHART — visible steps
        </text>
        {/* Chart chips */}
        {chartItems.map((item, i) => {
          const chipW = 74; const gap = 6;
          const totalW = chartItems.length * chipW + (chartItems.length - 1) * gap;
          const startX = (360 - totalW) / 2;
          const x = startX + i * (chipW + gap);
          return (
            <g key={i} style={{ opacity: go ? 1 : 0, transition: `opacity 0.3s ${0.5 + i * 0.15}s` }}>
              <rect x={x} y="142" width={chipW} height="22" rx="4" fill={B.blueL} stroke={B.blue} strokeWidth="0.6" strokeOpacity="0.5"/>
              <text x={x + chipW/2} y="156" textAnchor="middle" fontSize="11" fill={B.blue} fontFamily="Lexend, sans-serif">{item}</text>
            </g>
          );
        })}
        {/* Externalise arrow */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 2.4s' }}>
          <rect x="15" y="88" width="72" height="22" rx="5" fill={B.sageL} stroke={B.sageD} strokeWidth="0.8"/>
          <text x="51" y="102" textAnchor="middle" fontSize="11" fill={B.sageD} fontFamily="IBM Plex Mono, monospace">externalise</text>
          <line x1="51" y1="66" x2="51" y2="140" stroke={B.sageD} strokeWidth="1.5" strokeLinecap="round"/>
          <polygon points="47,137 51,143 55,137" fill={B.sageD}/>
        </g>
      </svg>
      <div className="anim-caption">Moving one invisible step onto the chart removes it from working memory permanently. The environment holds it instead of you.</div>
    </div>
  );
}

// ─── M10/M11 — OPEN LOOP ───
export function OpenLoopAnimation() {
  const [ref, go, replay] = useScrollTrigger(0.35);
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!go) return;
    setPhase(0);
    const timers = [
      setTimeout(() => setPhase(1), 700),
      setTimeout(() => setPhase(2), 1600),
      setTimeout(() => setPhase(3), 2800),
      setTimeout(() => setPhase(4), 4000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [go, replay]);
  return (
    <div ref={ref} className="anim-wrap" style={{ position: 'relative' }} aria-label="The argument loop and the clean exit">
      <ReplayButton2 onClick={() => { replay(); setPhase(0); }} />
      <div className="anim-label-top">The loop — and the exit that delivers the lesson</div>
      <svg viewBox="0 0 360 175" style={{ width: '100%', display: 'block' }}>
        <text x="120" y="18" textAnchor="middle" fontSize="11" fill={B.pewter} fontFamily="IBM Plex Mono, monospace">
          {phase === 0 ? 'starting' : phase === 1 ? 'loop begins' : phase === 2 ? 'still going...' : phase === 3 ? 'exit point' : '12 hours later'}
        </text>
        {/* Loop circle */}
        <circle cx="120" cy="90" r="56" fill="none"
          stroke={phase >= 1 && phase < 4 ? B.apricot : B.pewterL}
          strokeWidth={phase >= 2 ? 2.5 : 1.5} strokeDasharray={phase >= 1 ? '0' : '8 4'}
          style={{ transition: 'stroke 0.4s, stroke-width 0.3s' }}/>
        <text x="120" y="86" textAnchor="middle" fontSize="12" fill={B.slate} fontFamily="Lexend, sans-serif" fontWeight="500">argument</text>
        <text x="120" y="101" textAnchor="middle" fontSize="11" fill={phase >= 2 ? B.apricot : B.pewter} fontFamily="IBM Plex Mono, monospace"
          style={{ transition: 'fill 0.3s' }}>
          {phase < 2 ? 'running' : phase < 3 ? 'still cycling...' : 'stopped'}
        </text>
        {/* Discomfort note */}
        {phase >= 3 && (
          <text x="120" y="162" textAnchor="middle" fontSize="11" fill={B.pewter} fontFamily="IBM Plex Mono, monospace">
            open loop discomfort — real, survivable
          </text>
        )}
        {/* Exit arrow */}
        {phase >= 3 && (
          <g>
            <line x1="178" y1="90" x2="218" y2="90" stroke={B.sageD} strokeWidth="2" strokeLinecap="round"/>
            <polygon points="215,86 222,90 215,94" fill={B.sageD}/>
            <text x="200" y="80" textAnchor="middle" fontSize="11" fill={B.sageD} fontFamily="IBM Plex Mono, monospace">one sentence</text>
          </g>
        )}
        {/* 12 hours later box */}
        {phase >= 4 && (
          <g>
            <rect x="228" y="58" width="116" height="64" rx="8" fill={B.blueL} stroke={B.blue} strokeWidth="0.8"/>
            <text x="286" y="76" textAnchor="middle" fontSize="11" fill={B.blue} fontFamily="IBM Plex Mono, monospace">12 hours later</text>
            <line x1="242" y1="82" x2="330" y2="82" stroke="rgba(74,111,165,0.2)" strokeWidth="0.8"/>
            <text x="286" y="97" textAnchor="middle" fontSize="12" fill={B.slate} fontFamily="Lexend, sans-serif">lesson delivered</text>
            <text x="286" y="113" textAnchor="middle" fontSize="11" fill={B.sageD} fontFamily="IBM Plex Mono, monospace">✓ received</text>
          </g>
        )}
      </svg>
      <div className="anim-caption">Stopping the loop is not losing. It's choosing the delivery method where the lesson actually lands.</div>
    </div>
  );
}

// ─── M11 — LOOP EXIT ───
export function LoopExitAnimation() {
  const [ref, go, replay] = useScrollTrigger(0.35);
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!go) return;
    setPhase(0);
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1600),
      setTimeout(() => setPhase(3), 2800),
      setTimeout(() => setPhase(4), 4200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [go, replay]);
  return (
    <div ref={ref} className="anim-wrap" style={{ position: 'relative' }} aria-label="The stop-script and lesson delivered later">
      <ReplayButton2 onClick={() => { replay(); setPhase(0); }} />
      <div className="anim-label-top">The stop — and where the lesson actually lands</div>
      <svg viewBox="0 0 360 180" style={{ width: '100%', display: 'block' }}>
        {/* Loop */}
        <g style={{ opacity: phase >= 1 && phase < 3 ? 1 : 0, transition: 'opacity 0.4s' }}>
          <circle cx="80" cy="78" r="44" fill="none" stroke={B.apricot} strokeWidth="2" strokeDasharray="6 3"/>
          <text x="80" y="74" textAnchor="middle" fontSize="12" fill={B.slate} fontFamily="Lexend, sans-serif" fontWeight="500">argument</text>
          <text x="80" y="89" textAnchor="middle" fontSize="11" fill={B.pewter} fontFamily="IBM Plex Mono, monospace">running</text>
        </g>
        {/* Stop-script */}
        <g style={{ opacity: phase >= 2 ? 1 : 0, transition: 'opacity 0.5s' }}>
          <line x1="126" y1="78" x2="152" y2="78" stroke={B.sageD} strokeWidth="2" strokeLinecap="round"/>
          <polygon points="149,74 156,78 149,82" fill={B.sageD}/>
          <rect x="158" y="58" width="156" height="40" rx="8" fill={B.sageL} stroke={B.sageD} strokeWidth="1"/>
          <text x="236" y="74" textAnchor="middle" fontSize="12" fill={B.sageD} fontFamily="Lexend, sans-serif" fontWeight="500">stop-script said once</text>
          <text x="236" y="88" textAnchor="middle" fontSize="11" fill={B.sageD} fontFamily="IBM Plex Mono, monospace">then moved</text>
        </g>
        {/* Discomfort */}
        <g style={{ opacity: phase >= 3 ? 1 : 0, transition: 'opacity 0.4s' }}>
          <rect x="60" y="132" width="230" height="28" rx="6" fill={B.redL} stroke={B.red} strokeWidth="0.8" strokeDasharray="4 3"/>
          <text x="175" y="149" textAnchor="middle" fontSize="11" fill={B.red} fontFamily="Lexend, sans-serif">open loop discomfort — real, survivable</text>
        </g>
        {/* 12 hours later */}
        <g style={{ opacity: phase >= 4 ? 1 : 0, transition: 'opacity 0.5s' }}>
          <text x="236" y="115" textAnchor="middle" fontSize="11" fill={B.pewter} fontFamily="IBM Plex Mono, monospace">12 hours later</text>
          <rect x="158" y="120" width="156" height="36" rx="8" fill={B.blueL} stroke={B.blue} strokeWidth="1"/>
          <text x="236" y="136" textAnchor="middle" fontSize="12" fill={B.blue} fontFamily="Lexend, sans-serif" fontWeight="500">lesson delivered</text>
          <text x="236" y="149" textAnchor="middle" fontSize="11" fill={B.sageD} fontFamily="IBM Plex Mono, monospace">✓ received</text>
        </g>
      </svg>
      <div className="anim-caption">Stopping isn't losing. It's choosing the moment where the lesson can actually land.</div>
    </div>
  );
}

// ─── M12 — SPIRAL FORK ───
export function SpiralForkAnimation() {
  const [ref, go, replay] = useScrollTrigger(0.35);
  return (
    <div ref={ref} className="anim-wrap" style={{ position: 'relative' }} aria-label="Rumination vs accountability">
      <ReplayButton2 onClick={replay} />
      <div className="anim-label-top">Same incident. Two completely different directions.</div>
      <svg viewBox="0 0 360 195" style={{ width: '100%', display: 'block' }}>
        {/* Incident */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 0.2s' }}>
          <circle cx="180" cy="28" r="16" fill={B.redL} stroke={B.red} strokeWidth="1.5"/>
          <text x="180" y="24" textAnchor="middle" fontSize="11" fill={B.red} fontFamily="IBM Plex Mono, monospace">hard</text>
          <text x="180" y="36" textAnchor="middle" fontSize="11" fill={B.red} fontFamily="IBM Plex Mono, monospace">moment</text>
        </g>
        <line x1="180" y1="44" x2="180" y2="64" stroke={B.pewterL} strokeWidth="1.5"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.3s 0.5s' }}/>
        {/* Fork label */}
        <text x="180" y="78" textAnchor="middle" fontSize="11" fill={B.pewter} fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.3s 0.6s' }}>
          ↙ forward · inward ↘
        </text>
        {/* Left: accountability */}
        <path d="M 180 64 L 88 96" fill="none" stroke={B.sageD} strokeWidth="2" strokeLinecap="round"
          style={{ strokeDasharray: 105, strokeDashoffset: go ? 0 : 105, transition: 'stroke-dashoffset 0.6s 0.7s' }}/>
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 1.1s' }}>
          <rect x="22" y="96" width="132" height="22" rx="6" fill={B.sageL} stroke={B.sageD} strokeWidth="1"/>
          <text x="88" y="111" textAnchor="middle" fontSize="12" fill={B.sageD} fontFamily="Lexend, sans-serif" fontWeight="500">Accountability</text>
        </g>
        {[{ t:'what happened?', y:132 },{ t:'my part?', y:148 },{ t:'what now?', y:164 }].map((q,i) => (
          <g key={i} style={{ opacity: go ? 1 : 0, transition: `opacity 0.3s ${1.3 + i * 0.2}s` }}>
            <circle cx="32" cy={q.y-4} r="3" fill={B.sageD} fillOpacity="0.6"/>
            <text x="42" y={q.y} fontSize="11" fill={B.pewter} fontFamily="Lexend, sans-serif">{q.t}</text>
          </g>
        ))}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.5s 2.0s' }}>
          <rect x="22" y="130" width="132" height="18" rx="5" fill={B.sageD} fillOpacity="0.15" stroke={B.sageD} strokeWidth="0.8"/>
          <text x="88" y="142" textAnchor="middle" fontSize="11" fill={B.sageD} fontFamily="IBM Plex Mono, monospace">→ repair → move forward</text>
        </g>
        {/* Right: spiral */}
        <path d="M 180 64 L 272 96" fill="none" stroke={B.red} strokeWidth="2" strokeLinecap="round"
          style={{ strokeDasharray: 105, strokeDashoffset: go ? 0 : 105, transition: 'stroke-dashoffset 0.6s 0.9s' }}/>
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 1.3s' }}>
          <rect x="206" y="96" width="132" height="22" rx="6" fill={B.redL} stroke={B.red} strokeWidth="1"/>
          <text x="272" y="111" textAnchor="middle" fontSize="12" fill={B.red} fontFamily="Lexend, sans-serif" fontWeight="500">Spiral</text>
        </g>
        {go && (
          <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.5s 1.5s' }}>
            <path d="M 272 118 C 272 132 290 136 290 150 C 290 164 272 168 272 160 C 272 153 284 151 284 143 C 284 135 272 133 272 140"
              fill="none" stroke={B.red} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6"/>
            <text x="272" y="133" textAnchor="middle" fontSize="11" fill={B.red} fontFamily="IBM Plex Mono, monospace">what does this</text>
            <text x="272" y="145" textAnchor="middle" fontSize="11" fill={B.red} fontFamily="IBM Plex Mono, monospace">mean about me?</text>
            <text x="272" y="158" textAnchor="middle" fontSize="11" fill={B.red} fontFamily="IBM Plex Mono, monospace" opacity="0.6">no end point</text>
          </g>
        )}
      </svg>
      <div className="anim-caption">They feel similar. They go in opposite directions. Accountability has an end point. The spiral doesn't.</div>
    </div>
  );
}

// ─── M13 — REPAIR SPIRALLER ───
export function RepairSpirallerAnimation() {
  const [ref, go, replay] = useScrollTrigger(0.35);
  return (
    <div ref={ref} className="anim-wrap" style={{ position: 'relative' }} aria-label="Two-sentence repair vs extended overreach">
      <ReplayButton2 onClick={replay} />
      <div className="anim-label-top">Two sentences vs the version that asks for something back</div>
      <svg viewBox="0 0 360 195" style={{ width: '100%', display: 'block' }}>
        <line x1="180" y1="18" x2="180" y2="178" stroke={B.pewterL} strokeWidth="1" strokeDasharray="4 4"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 0.5s' }}/>
        {/* Left: repair */}
        <g style={{ opacity: go ? 1 : 0, transform: go ? 'translateX(0)' : 'translateX(-12px)', transition: 'opacity 0.5s 0.3s, transform 0.5s 0.3s' }}>
          <text x="88" y="14" textAnchor="middle" fontSize="11" fill={B.sageD} fontFamily="IBM Plex Mono, monospace">REPAIR</text>
          <rect x="10" y="20" width="158" height="148" rx="10" fill={B.sageL} stroke={B.sageD} strokeWidth="1"/>
          <rect x="20" y="34" width="138" height="22" rx="5" fill="white" stroke={B.sageD} strokeWidth="0.7"/>
          <text x="89" y="48" textAnchor="middle" fontSize="11" fill={B.sageD} fontFamily="IBM Plex Mono, monospace">sentence 1: names it</text>
          <rect x="20" y="62" width="138" height="22" rx="5" fill="white" stroke={B.sageD} strokeWidth="0.7"/>
          <text x="89" y="76" textAnchor="middle" fontSize="11" fill={B.sageD} fontFamily="IBM Plex Mono, monospace">sentence 2: next step</text>
          <line x1="89" y1="86" x2="89" y2="100" stroke={B.sageD} strokeWidth="1.5" strokeLinecap="round"/>
          <rect x="20" y="100" width="138" height="26" rx="6" fill={B.sageD} fillOpacity="0.2" stroke={B.sageD} strokeWidth="0.8"/>
          <text x="89" y="113" textAnchor="middle" fontSize="12" fill={B.sageD} fontFamily="Lexend, sans-serif" fontWeight="500">something ordinary</text>
          <text x="89" y="126" textAnchor="middle" fontSize="11" fill={B.sageD} fontFamily="IBM Plex Mono, monospace">then done</text>
          <rect x="20" y="148" width="138" height="14" rx="4" fill={B.sageD} fillOpacity="0.15"/>
          <text x="89" y="158" textAnchor="middle" fontSize="11" fill={B.sageD} fontFamily="IBM Plex Mono, monospace">child receives · closes</text>
        </g>
        {/* Right: overreach */}
        <g style={{ opacity: go ? 1 : 0, transform: go ? 'translateX(0)' : 'translateX(12px)', transition: 'opacity 0.5s 0.6s, transform 0.5s 0.6s' }}>
          <text x="272" y="14" textAnchor="middle" fontSize="11" fill={B.red} fontFamily="IBM Plex Mono, monospace">OVERREACH</text>
          <rect x="192" y="20" width="158" height="148" rx="10" fill={B.redL} stroke={B.red} strokeWidth="1" strokeOpacity="0.6"/>
          {['sentence 1','sentence 2','sentence 3','sentence 4...', '"are we okay?"'].map((s,i) => (
            <g key={i} style={{ opacity: go ? 1 : 0, transition: `opacity 0.3s ${0.8 + i * 0.25}s` }}>
              <rect x="202" y={34 + i * 24} width="138" height="19" rx="4"
                fill="white" stroke={B.red} strokeWidth="0.6"
                strokeOpacity={i < 3 ? 0.3 : 0.7} fillOpacity={i < 3 ? 1 : 0.9}/>
              <text x="271" y={46 + i * 24} textAnchor="middle" fontSize="11"
                fill={i < 4 ? B.pewter : B.red}
                fontFamily={i === 4 ? 'Lexend, sans-serif' : 'IBM Plex Mono, monospace'}
                fontWeight={i === 4 ? '500' : '400'}>{s}</text>
            </g>
          ))}
          <text x="271" y="178" textAnchor="middle" fontSize="11" fill={B.red} fontFamily="IBM Plex Mono, monospace" opacity="0.7">child manages parent's guilt</text>
        </g>
      </svg>
      <div className="anim-caption">The repair ends at two sentences. More than that stops being a repair and becomes a request.</div>
    </div>
  );
}

// ─── M16 — TWO VERSIONS ───
export function TwoVersionsAnimation() {
  const [ref, go, replay] = useScrollTrigger(0.35);
  return (
    <div ref={ref} className="anim-wrap" style={{ position: 'relative' }} aria-label="Two versions of the same moment">
      <ReplayButton2 onClick={replay} />
      <div className="anim-label-top">Same moment — two completely different views</div>
      <svg viewBox="0 0 360 190" style={{ width: '100%', display: 'block' }}>
        {/* Centre moment */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 0.3s' }}>
          <rect x="138" y="78" width="84" height="34" rx="6" fill={B.redL} stroke={B.red} strokeWidth="1"/>
          <text x="180" y="93" textAnchor="middle" fontSize="12" fill={B.red} fontFamily="IBM Plex Mono, monospace">the snap</text>
          <text x="180" y="105" textAnchor="middle" fontSize="11" fill={B.red} fontFamily="IBM Plex Mono, monospace" opacity="0.7">one moment</text>
        </g>
        {/* Left panel */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 0.2s' }}>
          <text x="62" y="16" textAnchor="middle" fontSize="11" fill={B.pewter} fontFamily="IBM Plex Mono, monospace">PARTNER SEES</text>
          <rect x="8" y="24" width="108" height="136" rx="8" fill="white" stroke={B.pewterL} strokeWidth="1"/>
        </g>
        {['the reaction','the snap','the small thing','the pattern'].map((item, i) => (
          <g key={i} style={{ opacity: go ? 1 : 0, transition: `opacity 0.3s ${0.5 + i * 0.2}s` }}>
            <rect x="16" y={36 + i * 28} width="92" height="20" rx="4" fill={B.mist} stroke={B.pewterL} strokeWidth="0.6"/>
            <text x="62" y={49 + i * 28} textAnchor="middle" fontSize="11" fill={B.pewter} fontFamily="Lexend, sans-serif">{item}</text>
          </g>
        ))}
        {/* Right panel */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 0.4s' }}>
          <text x="298" y="16" textAnchor="middle" fontSize="11" fill={B.blue} fontFamily="IBM Plex Mono, monospace">PARENT HELD</text>
          <rect x="244" y="24" width="108" height="136" rx="8" fill={B.blueL} stroke={B.blue} strokeWidth="0.8" strokeOpacity="0.5"/>
        </g>
        {['noise 4hrs','told them 3×','no food','meds worn off','work unresolved'].map((item, i) => (
          <g key={i} style={{ opacity: go ? 1 : 0, transition: `opacity 0.3s ${0.6 + i * 0.18}s` }}>
            <rect x="252" y={32 + i * 26} width="92" height="19" rx="4" fill={B.blueL} stroke={B.blue} strokeWidth="0.6" strokeOpacity="0.6"/>
            <text x="298" y={44 + i * 26} textAnchor="middle" fontSize="11" fill={B.blue} fontFamily="Lexend, sans-serif">{item}</text>
          </g>
        ))}
        {/* Arrows */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 1.4s' }}>
          <line x1="138" y1="95" x2="118" y2="95" stroke={B.pewterL} strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="222" y1="95" x2="244" y2="95" stroke={B.blue} strokeWidth="1.5" strokeLinecap="round"/>
        </g>
        <text x="180" y="178" textAnchor="middle" fontSize="11" fill={B.pewter} fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 1.8s' }}>
          both real · describing different things
        </text>
      </svg>
      <div className="anim-caption">They see the match. They don't see what was already burning. The goal isn't one correct version — it's understanding there were two.</div>
    </div>
  );
}

// ─── M20 — NOTCH UPSTREAM ───
export function NotchUpstreamAnimation() {
  const [ref, go, replay] = useScrollTrigger(0.35);
  const iterations = [
    { label: 'before course', interventionAt: 0.92, color: '#C97B6A' },
    { label: 'month 1',       interventionAt: 0.70, color: '#E8A87C' },
    { label: 'month 3',       interventionAt: 0.48, color: '#9B8BB4' },
    { label: 'month 6',       interventionAt: 0.28, color: '#7FA88E' },
  ];
  return (
    <div ref={ref} className="anim-wrap" style={{ position: 'relative' }} aria-label="Catching it earlier over time">
      <ReplayButton2 onClick={replay} />
      <div className="anim-label-top">The goal — one notch earlier each time</div>
      <svg viewBox="0 0 360 185" style={{ width: '100%', display: 'block' }}>
        {iterations.map((iter, i) => {
          const y = 28 + i * 36;
          const startX = 100; const endX = 340;
          const lineW = endX - startX;
          const interventionX = startX + iter.interventionAt * lineW;
          return (
            <g key={i} style={{ opacity: go ? 1 : 0, transition: `opacity 0.5s ${0.3 + i * 0.35}s` }}>
              <text x="90" y={y + 14} textAnchor="end" fontSize="11" fill={B.pewter} fontFamily="IBM Plex Mono, monospace">{iter.label}</text>
              <line x1={startX} y1={y + 10} x2={endX} y2={y + 10} stroke={B.mist} strokeWidth="2"/>
              <circle cx={endX} cy={y + 10} r="5" fill={B.redL} stroke="#C97B6A" strokeWidth="1.5"/>
              <line x1={startX} y1={y + 10} x2={interventionX} y2={y + 10}
                stroke={iter.color} strokeWidth="2.5" strokeLinecap="round"
                style={{ strokeDasharray: lineW, strokeDashoffset: go ? 0 : lineW, transition: `stroke-dashoffset 0.8s ${0.5 + i * 0.35}s ease-out` }}/>
              <circle cx={interventionX} cy={y + 10} r="5" fill={iter.color}
                style={{ opacity: go ? 1 : 0, transition: `opacity 0.3s ${1.0 + i * 0.35}s` }}/>
              {i === 0 && (
                <text x={endX + 6} y={y + 14} fontSize="11" fill="#C97B6A" fontFamily="IBM Plex Mono, monospace"
                  style={{ opacity: go ? 1 : 0, transition: 'opacity 0.3s 1.0s' }}>explosion</text>
              )}
            </g>
          );
        })}
        {/* Upstream arrow */}
        <g style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 1.8s' }}>
          <line x1="28" y1="32" x2="28" y2="150" stroke={B.pewterL} strokeWidth="1"/>
          <polygon points="24,147 28,153 32,147" fill={B.pewterL}/>
          <text x="16" y="95" textAnchor="middle" fontSize="11" fill={B.pewter} fontFamily="IBM Plex Mono, monospace" transform="rotate(-90,16,95)">earlier</text>
        </g>
        <text x="180" y="175" textAnchor="middle" fontSize="11" fill={B.pewter} fontFamily="IBM Plex Mono, monospace"
          style={{ opacity: go ? 1 : 0, transition: 'opacity 0.4s 2.2s' }}>
          not visible in one moment · visible in the relationship over time
        </text>
      </svg>
      <div className="anim-caption">Slightly earlier. Not perfectly. Not always. One notch upstream of where you were before.</div>
    </div>
  );
}