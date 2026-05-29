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

  async function handleSubmit() {
    if (!input.trim() || input.trim().length < 3) return;
    setState('loading');
    setMatches([]);
    setErrorMsg('');

    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input.trim() }),
      });
      const data = await res.json();

      if (data.error) { setErrorMsg(data.error); setState('error'); return; }
      if (data.crisis) { setState('crisis'); return; }
      if (data.unmatched) { setUnmatchedNote(data.suggestion || ''); setState('unmatched'); return; }

      setMatches(data.matches || []);
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
    rec.lang = 'en-AU';
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
          <p style={{ fontSize: 15, color: 'var(--pewter)' }}>Working it out...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* ─── CRISIS ─── */}
      {state === 'crisis' && (
        <div style={{
          background: 'white', borderRadius: 16,
          border: '1px solid rgba(201,123,106,0.3)', padding: 24,
        }}>
          <h3 style={{
            fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 400,
            color: 'var(--slate)', marginBottom: 12,
          }}>This sounds like it needs more than a guide right now.</h3>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--pewter)', marginBottom: 16 }}>
            If you or your child are unsafe, please reach out to crisis support.
          </p>
          <a href="/resources" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', borderRadius: 100,
            background: 'var(--blue)', color: 'white',
            textDecoration: 'none', fontFamily: 'var(--sans)',
            fontSize: 15, fontWeight: 600, minHeight: 44,
          }}>See support options</a>
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

