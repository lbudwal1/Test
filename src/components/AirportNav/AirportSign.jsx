// Renders a realistic-looking airport wayfinding sign.
// Non-English speakers can match what they see at the airport to these visuals.

const SIGN_STYLES = {
  directional: { bg: '#003580', text: '#FFFFFF', accent: '#FFFFFF' },
  security:    { bg: '#003580', text: '#FFFFFF', accent: '#FFFFFF' },
  gates:       { bg: '#1a3a6b', text: '#FFFFFF', accent: '#7dd3fc' },
  gate:        { bg: '#003580', text: '#FFFFFF', accent: '#FFFFFF' },
  baggage:     { bg: '#1a1a1a', text: '#FFD700', accent: '#FFD700' },
  customs:     { bg: '#1b5e20', text: '#FFFFFF', accent: '#a5d6a7' },
  exit:        { bg: '#1b5e20', text: '#FFFFFF', accent: '#FFFFFF' },
  government:  { bg: '#1b4332', text: '#FFFFFF', accent: '#86efac' },
  train:       { bg: '#b45309', text: '#FFFFFF', accent: '#fcd34d' },
  info:        { bg: '#FFFFFF', text: '#000000', accent: '#003580', border: true },
  'yellow-black': { bg: '#f59e0b', text: '#000000', accent: '#000000' },
  purple:      { bg: '#581c87', text: '#FFFFFF', accent: '#e9d5ff' },
  red:         { bg: '#7f1d1d', text: '#FFFFFF', accent: '#fca5a5' },
  green:       { bg: '#14532d', text: '#FFFFFF', accent: '#86efac' },
};

function ArrowIcon({ dir, color }) {
  const paths = {
    '→': 'M5 12h14m-4-4 4 4-4 4',
    '←': 'M19 12H5m4 4-4-4 4-4',
    '↑': 'M12 19V5m-4 4 4-4 4 4',
    '↓': 'M12 5v14m4-4-4 4-4-4',
  };
  const path = paths[dir];
  if (!path) return null;
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

function extractArrow(text) {
  const match = text.match(/(→|←|↑|↓)/);
  return match ? match[0] : null;
}

function cleanText(text) {
  return text.replace(/(→|←|↑|↓)/g, '').trim();
}

export default function AirportSign({ type = 'directional', text, subtext }) {
  const style = SIGN_STYLES[type] || SIGN_STYLES.directional;
  const arrow = extractArrow(text);
  const mainText = cleanText(text);

  return (
    <div
      className="inline-flex flex-col items-stretch rounded-lg overflow-hidden shadow-lg max-w-full select-none"
      style={{
        border: style.border ? `2px solid ${style.accent}` : `2px solid rgba(255,255,255,0.1)`,
        minWidth: '180px',
      }}
    >
      {/* Main sign face */}
      <div
        className="flex items-center justify-between gap-2 px-4 py-2.5"
        style={{ background: style.bg }}
      >
        <span
          className="text-sm font-bold tracking-wide leading-tight uppercase"
          style={{ color: style.text, letterSpacing: '0.05em' }}
        >
          {mainText}
        </span>
        {arrow && (
          <span className="shrink-0">
            <ArrowIcon dir={arrow} color={style.accent} />
          </span>
        )}
      </div>

      {/* Subtext (bilingual line) */}
      {subtext && (
        <div
          className="px-4 py-1.5"
          style={{ background: `${style.bg}cc` }}
        >
          <span
            className="text-xs tracking-wide"
            style={{ color: `${style.text}bb`, fontStyle: 'italic' }}
          >
            {subtext}
          </span>
        </div>
      )}
    </div>
  );
}
