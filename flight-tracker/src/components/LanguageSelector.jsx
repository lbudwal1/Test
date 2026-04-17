import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { LANGUAGES } from '../i18n/index.js';
import { useTheme } from '../theme.js';

export default function LanguageSelector({ lang, onChange }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 px-3 py-2 bg-white/80 border ${theme.langBtn} rounded-xl text-sm text-stone-700 transition-colors duration-300 shadow-sm`}
      >
        <Globe size={14} className={`${theme.langIcon} transition-colors duration-300`} />
        <span>{current.flag} {current.nativeName}</span>
        <ChevronDown size={12} className={`transition-transform text-stone-400 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className={`absolute right-0 top-full mt-2 w-52 bg-white border ${theme.langDrop} rounded-xl shadow-xl z-50 overflow-hidden`}>
          <div className="max-h-72 overflow-y-auto">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => { onChange(l.code); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${l.code === lang ? theme.langActive + ' font-semibold' : 'text-stone-700 ' + theme.langHover}`}
              >
                <span className="text-base">{l.flag}</span>
                <span>{l.nativeName}</span>
                <span className="ml-auto text-stone-400 text-xs">{l.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
