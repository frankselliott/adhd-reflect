// SVG icons for each ADHD parenting pattern

export function ReactorIcon({ size = 48, color = '#B85038' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="24" stroke={color} strokeWidth="1.5" opacity="0.2"/>
      <circle cx="32" cy="32" r="16" stroke={color} strokeWidth="1.5" opacity="0.35"/>
      <circle cx="32" cy="32" r="8" fill={color} opacity="0.15"/>
      <path d="M32 14 L36 28 L32 24 L28 28 Z" fill={color} opacity="0.7"/>
      <path d="M32 50 L28 36 L32 40 L36 36 Z" fill={color} opacity="0.7"/>
      <path d="M14 32 L28 28 L24 32 L28 36 Z" fill={color} opacity="0.7"/>
      <path d="M50 32 L36 36 L40 32 L36 28 Z" fill={color} opacity="0.7"/>
    </svg>
  );
}

export function JugglerIcon({ size = 48, color = '#4A6FA5' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="20" cy="20" r="7" stroke={color} strokeWidth="1.5" opacity="0.4"/>
      <circle cx="44" cy="20" r="5" stroke={color} strokeWidth="1.5" opacity="0.3"/>
      <circle cx="32" cy="40" r="9" stroke={color} strokeWidth="1.5" opacity="0.5"/>
      <circle cx="48" cy="42" r="4" stroke={color} strokeWidth="1.5" opacity="0.25"/>
      <circle cx="14" cy="44" r="3" stroke={color} strokeWidth="1.5" opacity="0.2"/>
      <path d="M24 23 L28 36" stroke={color} strokeWidth="1" strokeDasharray="2 2" opacity="0.3"/>
      <path d="M40 24 L35 34" stroke={color} strokeWidth="1" strokeDasharray="2 2" opacity="0.3"/>
    </svg>
  );
}

export function LooperIcon({ size = 48, color = '#4B6B4E' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M32 16 C44 16 50 24 50 32 C50 40 44 48 32 48" stroke={color} strokeWidth="1.5" opacity="0.4" fill="none"/>
      <path d="M32 48 C20 48 14 40 14 32 C14 24 20 16 32 16" stroke={color} strokeWidth="1.5" opacity="0.4" fill="none" strokeDasharray="3 3"/>
      <path d="M32 22 C40 22 44 27 44 32 C44 37 40 42 32 42" stroke={color} strokeWidth="1.5" opacity="0.6" fill="none"/>
      <path d="M32 42 C24 42 20 37 20 32 C20 27 24 22 32 22" stroke={color} strokeWidth="1.5" opacity="0.6" fill="none" strokeDasharray="3 3"/>
      <polygon points="34,14 30,18 34,18" fill={color} opacity="0.6"/>
      <polygon points="30,50 34,46 30,46" fill={color} opacity="0.6"/>
    </svg>
  );
}

export function SpirallerIcon({ size = 48, color = '#9B8BB4' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M32 32 C32 28 36 24 40 24 C44 24 48 28 48 32 C48 40 40 48 32 48 C20 48 12 40 12 28 C12 16 24 8 36 8" 
        stroke={color} strokeWidth="1.5" fill="none" opacity="0.5"/>
      <circle cx="32" cy="32" r="3" fill={color} opacity="0.4"/>
      <circle cx="36" cy="8" r="2" fill={color} opacity="0.3"/>
    </svg>
  );
}

export function EscaperIcon({ size = 48, color = '#3F6178' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect x="16" y="16" width="32" height="32" rx="4" stroke={color} strokeWidth="1.5" opacity="0.3"/>
      <circle cx="32" cy="32" r="6" fill={color} opacity="0.15"/>
      <circle cx="32" cy="32" r="3" fill={color} opacity="0.3"/>
      <path d="M44 20 L56 8" stroke={color} strokeWidth="1.5" opacity="0.5" strokeLinecap="round"/>
      <path d="M52 8 L56 8 L56 12" stroke={color} strokeWidth="1.5" opacity="0.5" strokeLinecap="round"/>
    </svg>
  );
}

export const PATTERN_ICONS = {
  reactor: ReactorIcon,
  juggler: JugglerIcon,
  looper: LooperIcon,
  spiraller: SpirallerIcon,
  escaper: EscaperIcon,
};

export const PATTERN_COLORS = {
  reactor: '#B85038',
  juggler: '#4A6FA5',
  looper: '#4B6B4E',
  spiraller: '#9B8BB4',
  escaper: '#3F6178',
};

