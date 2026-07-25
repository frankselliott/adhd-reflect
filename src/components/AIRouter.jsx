import { useState, useRef, useEffect } from 'react';

const PLACEHOLDERS = [
  "They refused homework. I snapped. Now I feel awful...",
  "Bedtime blew up again...",
  "I said the thing I promised I wouldn't say...",
  "They screamed. I yelled. Now I feel guilty...",
  "Morning was a disaster. Everyone's upset...",
  "I checked out and they noticed...",
  "Sibling fight. I froze. Nobody got what they needed...",
  "I lost it over something tiny and I know it...",
  "School drop-off was awful. They clung. I snapped...",
  "I forgot something that really mattered to them...",
];

const EXAMPLES = [
  "I yelled at my kid over homework",
  "Bedtime fell apart again",
  "I checked out on my phone",
  "They had a meltdown in public",
  "I feel guilty about this morning",
  "Sibling fight and I lost it",
];

export default function AIRouter() {
  const [input, setInput] = useState('');
  const [state, setState] = useState('idle');

  // Prevent loop on back-navigation, and honour the ?q= prefill from the
  // WebSite SearchAction so a search landing actually runs the assistant.
  useEffect(() => {
    if (sessionStorage.getItem('adhd-reflect-navigated')) {
      sessionStorage.removeItem('adhd-reflect-navigated');
      setInput('');
      setState('idle');
      return;
    }
    const q = new URLSearchParams(window.location.search).get('q');
    if (q && q.trim().length >= 3) {
      setInput(q);
      handleSubmit(q);
    }
  }, []);
  const [matches, setMatches] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [unmatchedNote, setUnmatchedNote] = useState('');
  const [listening, setListening] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const textareaRef = useRef(null);

  // Rotate placeholder text
  useEffect(() => {
    if (input || state !== 'idle') return;
    const timer = setInterval(() => {
      setPlaceholderIdx(i => (i + 1) % PLACEHOLDERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [input, state]);


const CRISIS_LINES = {
  US: [
    { number: '988', label: 'Suicide & Crisis Lifeline', desc: 'Call or text, 24/7', href: 'tel:988' },
    { number: '911', label: 'Emergency services', desc: 'If anyone is in immediate danger', href: 'tel:911' },
    { number: 'TEXT', label: 'Crisis Text Line', desc: 'Text HELLO to 741741', href: 'sms:741741&body=HELLO' },
  ],
  AU: [
    { number: '000', label: 'Emergency services', desc: 'Police, fire, ambulance', href: 'tel:000' },
    { number: '13 11 14', label: 'Lifeline Australia', desc: '24/7 crisis support', href: 'tel:131114' },
    { number: '1800 55 1800', label: 'Kids Helpline', desc: 'For children and young people', href: 'tel:1800551800' },
  ],
  GB: [
    { number: '999', label: 'Emergency services', desc: 'Police, fire, ambulance', href: 'tel:999' },
    { number: '116 123', label: 'Samaritans', desc: '24/7, free to call', href: 'tel:116123' },
    { number: '0800 1111', label: 'Childline', desc: 'For children and young people', href: 'tel:08001111' },
  ],
  CA: [
    { number: '988', label: 'Suicide Crisis Helpline', desc: 'Call or text, 24/7', href: 'tel:988' },
    { number: '911', label: 'Emergency services', desc: 'If anyone is in immediate danger', href: 'tel:911' },
    { number: 'TEXT', label: 'Crisis Text Line', desc: 'Text CONNECT to 686868', href: 'sms:686868&body=CONNECT' },
  ],
  NZ: [
    { number: '111', label: 'Emergency services', desc: 'Police, fire, ambulance', href: 'tel:111' },
    { number: '1737', label: 'Need to Talk?', desc: 'Call or text, 24/7', href: 'tel:1737' },
  ],
  IE: [
    { number: '999', label: 'Emergency services', desc: 'Police, fire, ambulance', href: 'tel:999' },
    { number: '116 123', label: 'Samaritans Ireland', desc: '24/7, free to call', href: 'tel:116123' },
    { number: '1800 66 66 66', label: 'Childline Ireland', desc: 'For children and young people', href: 'tel:1800666666' },
  ],
};

function detectCountry() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.startsWith('Australia')) return 'AU';
    if (tz.startsWith('Europe/London') || tz.startsWith('Europe/Belfast')) return 'GB';
    if (tz.startsWith('America/Toronto') || tz.startsWith('America/Vancouver') || tz.startsWith('America/Edmonton') || tz.startsWith('America/Winnipeg') || tz.startsWith('America/Halifax') || tz.startsWith('America/St_Johns')) return 'CA';
    if (tz.startsWith('Pacific/Auckland')) return 'NZ';
    if (tz.startsWith('Europe/Dublin')) return 'IE';
    if (tz.startsWith('America/')) return 'US';
    if (tz.startsWith('US/')) return 'US';
  } catch(e) {}
  return 'US';
}

function CrisisNumbers() {
  const country = detectCountry();
  const lines = CRISIS_LINES[country] || CRISIS_LINES.US;

  const linkStyle = {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '14px 18px', borderRadius: 12,
    background: 'rgba(201,123,106,0.06)', border: '1px solid rgba(201,123,106,0.15)',
    textDecoration: 'none', color: 'var(--slate)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
      {lines.map((line, i) => (
        <a key={i} href={line.href} style={linkStyle}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: line.number.length > 4 ? 13 : 18, fontWeight: 600, color: '#C97B6A', minWidth: 52 }}>{line.number}</span>
          <span>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 600, display: 'block' }}>{line.label}</span>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--pewter)' }}>{line.desc}</span>
          </span>
        </a>
      ))}
      <a href="/resources" style={{
        fontFamily: 'var(--mono)', fontSize: 12, color: '#A09589',
        textDecoration: 'none', textAlign: 'center', padding: '8px 0',
      }}>support in other countries &#8594;</a>
    </div>
  );
}

  // Client-side crisis keyword check
  const CRISIS_WORDS = [
    'kill myself', 'kill my', 'want to die', 'suicid', 'self harm', 'self-harm',
    'hurt myself', 'hurt my child', 'hurt my kid', 'hit my child', 'hit my kid',
    'shook my', 'shaking my', 'harm my', 'abuse', 'abusing',
    'not safe', 'unsafe', 'can\'t go on', 'end it', 'no point',
    'punch my', 'choke', 'suffocate', 'drown',
  ];

  function isCrisisInput(text) {
    const lower = text.toLowerCase();
    return CRISIS_WORDS.some(w => lower.includes(w));
  }

  async function handleSubmit(rawText) {
    // Accept an explicit string (used by the ?q= prefill); otherwise use the
    // input state. onClick/onKeyDown pass an event, which falls back to input.
    const text = typeof rawText === 'string' ? rawText : input;
    if (!text.trim() || text.trim().length < 3) return;

    // Immediate client-side crisis check
    if (isCrisisInput(text)) {
      setState('crisis');
      return;
    }

    setState('loading');
    setMatches([]);
    setErrorMsg('');

    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      });
      const data = await res.json();

      if (data.error) { setErrorMsg(data.error); setState('error'); return; }
      if (data.crisis) { setState('crisis'); return; }
      if (data.unmatched) { setUnmatchedNote(data.suggestion || ''); setState('unmatched'); return; }

      const matches = data.matches || [];
      setMatches(matches);
      
      // Auto-navigate to best match if confident
      if (matches.length >= 1) {
        // Store all matches in sessionStorage for "wrong match" flow
        try { sessionStorage.setItem('adhd-reflect-matches', JSON.stringify(matches)); } catch(e) {}
        try { sessionStorage.setItem('adhd-reflect-query', text.trim()); } catch(e) {}
        // Navigate to best match
        sessionStorage.setItem('adhd-reflect-navigated', 'true');
        window.location.replace('/cards/' + matches[0].id);
        return;
      }
      setState('result');
    } catch (e) {
      setErrorMsg('Could not reach the matching service. Try again.');
      setState('error');
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  }

  function handleExample(text) {
    setInput(text);
    textareaRef.current?.focus();
  }

  function handleVoice() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = 'en-US';
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => { setInput(e.results[0][0].transcript); setListening(false); };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    setListening(true);
    rec.start();
  }

  function handleReset() {
    setInput('');
    setMatches([]);
    setState('idle');
    setErrorMsg('');
    setUnmatchedNote('');
    textareaRef.current?.focus();
  }

  const hasVoice = typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  const canSubmit = input.trim().length >= 3;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>

      {/* ─── INPUT STATE ─── */}
      {(state === 'idle' || state === 'error') && (
        <div>
          <div style={{
            background: 'white', borderRadius: 16,
            border: '1.5px solid rgba(31,42,55,0.08)',
            padding: 4, display: 'flex', flexDirection: 'column',
          }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={PLACEHOLDERS[placeholderIdx]}
              rows={3}
              style={{
                width: '100%', border: 'none', outline: 'none', resize: 'none',
                fontFamily: 'var(--sans)', fontSize: 17, lineHeight: 1.55,
                color: 'var(--slate)', padding: '16px 16px 8px',
                background: 'transparent', boxSizing: 'border-box',
              }}
            />
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', padding: '4px 8px 8px',
            }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {hasVoice && (
                  <button onClick={handleVoice}
                    style={{
                      background: listening ? 'var(--clay)' : 'var(--mist)',
                      border: 'none', borderRadius: '50%',
                      width: 40, height: 40, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.2s',
                    }}
                    aria-label={listening ? 'Listening...' : 'Speak'}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={listening ? 'white' : 'var(--pewter)'} strokeWidth="2" strokeLinecap="round">
                      <rect x="9" y="2" width="6" height="12" rx="3" />
                      <path d="M5 10a7 7 0 0014 0" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </button>
                )}
              </div>
              <button onClick={handleSubmit} disabled={!canSubmit}
                style={{
                  background: canSubmit ? 'var(--blue)' : 'rgba(31,42,55,0.08)',
                  color: canSubmit ? 'white' : 'var(--pewter)',
                  border: 'none', borderRadius: 100,
                  padding: '10px 24px', fontFamily: 'var(--sans)',
                  fontSize: 15, fontWeight: 600, cursor: canSubmit ? 'pointer' : 'default',
                  minHeight: 44, transition: 'all 0.2s',
                  opacity: canSubmit ? 1 : 0.5,
                }}>
                Help me sort this out
              </button>
            </div>
          </div>

          {/* Example pills */}
          {!input && (
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12,
            }}>
              {EXAMPLES.map((ex, i) => (
                <button key={i} onClick={() => handleExample(ex)}
                  style={{
                    appearance: 'none', border: '1px solid rgba(31,42,55,0.08)',
                    background: 'white', borderRadius: 100,
                    padding: '7px 14px', cursor: 'pointer',
                    fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--pewter)',
                    transition: 'border-color 0.15s, color 0.15s',
                    lineHeight: 1.3,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.color = 'var(--blue)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(31,42,55,0.08)'; e.currentTarget.style.color = 'var(--pewter)'; }}
                >{ex}</button>
              ))}
            </div>
          )}

          {state === 'error' && (
            <p style={{ fontSize: 14, color: 'var(--clay)', marginTop: 12 }}>{errorMsg}</p>
          )}

          <p style={{
            fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.08em',
            color: 'var(--pewter)', opacity: 0.5, marginTop: 12,
          }}>
            Not stored. Not logged.
          </p>
        </div>
      )}

      {/* ─── LOADING ─── */}
      {state === 'loading' && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            border: '3px solid var(--mist)', borderTopColor: 'var(--blue)',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ fontSize: 15, color: 'var(--pewter)' }}>Finding what fits...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* ─── CRISIS ─── */}
      {state === 'crisis' && (
        <div style={{
          background: 'white', borderRadius: 16,
          border: '2px solid rgba(201,123,106,0.4)', padding: 28,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'rgba(201,123,106,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C97B6A" strokeWidth="2" strokeLinecap="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <h3 style={{
            fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 400,
            color: 'var(--slate)', marginBottom: 10, lineHeight: 1.3,
          }}>This sounds like it needs more than a card right now.</h3>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--pewter)', marginBottom: 20 }}>
            If you or your child are in danger, please reach out now. You do not have to handle this alone.
          </p>

          <CrisisNumbers />

          <a href="/resources" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', borderRadius: 100,
            background: 'var(--blue)', color: 'white',
            textDecoration: 'none', fontFamily: 'var(--sans)',
            fontSize: 15, fontWeight: 600, minHeight: 44,
          }}>More support options</a>
          <button onClick={handleReset} style={{
            display: 'block', marginTop: 16, background: 'none',
            border: 'none', color: 'var(--pewter)', fontSize: 14,
            fontFamily: 'var(--sans)', cursor: 'pointer', padding: '8px 0',
          }}>&#8592; Try a different description</button>
        </div>
      )}

      {/* ─── RESULTS ─── */}
      {state === 'result' && matches.length > 0 && (
        <div>
          <p style={{
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--sage-dark)', marginBottom: 16,
          }}>
            {matches.length === 1 ? 'What fits' : `${matches.length} matches`}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {matches.map((match, i) => (
              <a key={match.id} href={`/cards/${match.id}`}
                style={{
                  background: 'white', borderRadius: 16,
                  border: i === 0 ? '1.5px solid var(--blue)' : '1px solid rgba(31,42,55,0.08)',
                  padding: 20, textDecoration: 'none', color: 'inherit',
                  display: 'block', transition: 'box-shadow 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 24px rgba(31,42,55,0.09)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
              >
                {i === 0 && (
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
                    textTransform: 'uppercase', color: 'var(--blue)',
                    display: 'block', marginBottom: 8,
                  }}>Best match</span>
                )}
                <h3 style={{
                  fontFamily: 'var(--serif)', fontSize: 19, fontWeight: 400,
                  lineHeight: 1.3, color: 'var(--slate)', margin: 0,
                  marginBottom: match.reason ? 8 : 0,
                }}>{match.title}</h3>
                {match.reason && (
                  <p style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--pewter)', margin: 0 }}>
                    {match.reason}
                  </p>
                )}
              </a>
            ))}
          </div>
          <button onClick={handleReset} style={{
            display: 'block', marginTop: 20, background: 'none',
            border: 'none', color: 'var(--pewter)', fontSize: 14,
            fontFamily: 'var(--sans)', cursor: 'pointer', padding: '8px 0',
          }}>&#8592; Describe something else</button>
        </div>
      )}

      {/* ─── UNMATCHED ─── */}
      {state === 'unmatched' && (
        <div style={{ background: 'var(--mist)', borderRadius: 16, padding: 24 }}>
          <h3 style={{
            fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 400,
            color: 'var(--slate)', marginBottom: 12,
          }}>Nothing for this one yet</h3>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--pewter)', marginBottom: 8 }}>
            We don't have a guide that matches what you described. We're still building.
          </p>
          {unmatchedNote && (
            <p style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--pewter)', opacity: 0.7 }}>{unmatchedNote}</p>
          )}
          <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
            <a href="/guides" style={{
              padding: '10px 20px', borderRadius: 100, background: 'var(--blue)', color: 'white',
              textDecoration: 'none', fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600,
              minHeight: 44, display: 'inline-flex', alignItems: 'center',
            }}>Browse guides</a>
            <button onClick={handleReset} style={{
              padding: '10px 20px', borderRadius: 100, background: 'transparent', color: 'var(--pewter)',
              border: '1.5px solid rgba(31,42,55,0.08)', fontFamily: 'var(--sans)',
              fontSize: 14, cursor: 'pointer', minHeight: 44,
            }}>Try again</button>
          </div>
        </div>
      )}
    </div>
  );
}
