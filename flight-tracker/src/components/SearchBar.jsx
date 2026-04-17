import { useState } from 'react';
import { Search, Plane } from 'lucide-react';

export default function SearchBar({ onSearch, loading, lang, ui }) {
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
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-sky-400/20 rounded-2xl blur-xl group-focus-within:blur-2xl transition-all duration-300" />
        <div className="relative flex items-center bg-white border border-blue-200 rounded-2xl shadow-sm overflow-hidden focus-within:border-blue-400 focus-within:shadow-md transition-all duration-200">
          <Plane className="ml-5 text-blue-400 shrink-0" size={20} />
          <input
            type="text"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(''); }}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-slate-900 placeholder-slate-400 px-4 py-4 text-base outline-none"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
          />
          <button
            type="submit"
            disabled={loading}
            className="m-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center gap-2 shrink-0 shadow-sm"
          >
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{searchingLabel}</>
              : <><Search size={16} />{trackLabel}</>
            }
          </button>
        </div>
      </div>
      {error && <p className="mt-2 text-red-500 text-sm text-center">{error}</p>}
      <p className="mt-3 text-slate-400 text-sm text-center">
        <button type="button" onClick={() => setValue('EK203')} className="text-blue-600 hover:text-blue-800 underline underline-offset-2">EK203</button>
        {' · '}
        <button type="button" onClick={() => setValue('UA100')} className="text-blue-600 hover:text-blue-800 underline underline-offset-2">UA100</button>
        {' · '}
        <button type="button" onClick={() => setValue('BA249')} className="text-blue-600 hover:text-blue-800 underline underline-offset-2">BA249</button>
        {' · '}
        <button type="button" onClick={() => setValue('AC123')} className="text-blue-600 hover:text-blue-800 underline underline-offset-2">AC123</button>
      </p>
    </form>
  );
}
