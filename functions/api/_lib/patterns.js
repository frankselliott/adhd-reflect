// Parenting-pattern keys and display names.
// Mirrors PATTERNS in src/components/Quiz.jsx. Duplicated here because the
// functions bundle (Cloudflare Workers) cannot import the React quiz component.
// Keep the two in sync if the quiz names ever change.
export const PATTERN_NAMES = {
  reactor: 'The Overloaded Reactor',
  juggler: 'The Chaos Juggler',
  looper: 'The Argument Looper',
  spiraller: 'The Shame Spiraller',
  escaper: 'The Shutdown Escaper',
};

export const VALID_PATTERNS = Object.keys(PATTERN_NAMES);
