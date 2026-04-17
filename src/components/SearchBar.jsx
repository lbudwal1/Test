import { useState } from 'react';
import { Search, Plane } from 'lucide-react';
import { useTheme } from '../theme.js';

export default function SearchBar({ onSearch, loading, lang, ui }) {
  const theme = useTheme();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const placeholder = ui?.searchPlaceholder || 'Flight number (e.g. EK203) or PNR…';
  const trackLabel = ui?.track || 'Track';
  const searchingLabel = ui?.searching || 'Searching…';

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) { setError('Enter a flight number or PNR code'); return; }
    setError('');
    onSearch(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative group">
        <div className={`absolute inset-0 bg-gradient-to-r ${theme.searchGlow} rounded-2xl blur-xl group-focus-within:blur-2xl transition-all duration-500`} />
        <div className={`relative flex items-center bg-white border ${theme.searchBorder} rounded-2xl shadow-sm overflow-hidden transition-all duration-300`}>
          <Plane className={`ml-5 ${theme.searchIcon} shrink-0 transition-colors duration-500`} size={20} />
          <input
            type="text"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(''); }}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-stone-900 placeholder-stone-400 px-4 py-4 text-base outline-none"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
          />
          <button
            type="submit"
            disabled={loading}
            className={`m-2 px-6 py-2.5 ${theme.searchBtn} text-white font-semibold rounded-xl transition-colors duration-300 flex items-center gap-2 shrink-0 shadow-sm`}
          >
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{searchingLabel}</>
              : <><Search size={16} />{trackLabel}</>
            }
          </button>
        </div>
      </div>
      {error && <p className="mt-2 text-red-500 text-sm text-center">{error}</p>}
      <p className="mt-3 text-stone-400 text-sm text-center">
        <button type="button" onClick={() => setValue('EK203')} className={`${theme.quickLink} underline underline-offset-2 transition-colors duration-300`}>EK203</button>
        {' · '}
        <button type="button" onClick={() => setValue('UA100')} className={`${theme.quickLink} underline underline-offset-2 transition-colors duration-300`}>UA100</button>
        {' · '}
        <button type="button" onClick={() => setValue('BA249')} className={`${theme.quickLink} underline underline-offset-2 transition-colors duration-300`}>BA249</button>
        {' · '}
        <button type="button" onClick={() => setValue('AC123')} className={`${theme.quickLink} underline underline-offset-2 transition-colors duration-300`}>AC123</button>
      </p>
    </form>
  );
}
