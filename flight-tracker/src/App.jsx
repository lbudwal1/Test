import { useState, useCallback } from 'react';
import { Plane } from 'lucide-react';
import SearchBar from './components/SearchBar';
import FlightCard from './components/FlightCard';
import LanguageSelector from './components/LanguageSelector';
import { searchByFlightNumber, getLivePosition } from './services/flightApi';
import { detectLanguage, getUI, getLangMeta } from './i18n/index.js';

export default function App() {
  const [lang, setLang] = useState(detectLanguage);
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [installPrompt, setInstallPrompt] = useState(null);

  const ui = getUI(lang);
  const meta = getLangMeta(lang);
  const isRTL = meta.rtl;

  useState(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    });
  });

  const handleSearch = useCallback(async (query) => {
    setLoading(true);
    setError('');
    setFlight(null);
    try {
      const result = await searchByFlightNumber(query);
      if (result.callsign && !result._isMock) {
        const pos = await getLivePosition(result.callsign);
        if (pos) result.position = pos;
      }
      setFlight(result);
    } catch (err) {
      setError(err.message || 'Could not find flight. Check the number and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setInstallPrompt(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 text-slate-900" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Soft background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-200/30 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-sky-200/20 blur-3xl rounded-full" />
        <div className="absolute top-1/3 left-0 w-[300px] h-[200px] bg-indigo-100/20 blur-2xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <header className="mb-8">
          <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
                <Plane className="text-white" size={22} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight leading-none text-slate-900">FlightTrack</h1>
                <p className="text-slate-500 text-xs mt-0.5">Live · Multilingual · Navigate</p>
              </div>
            </div>
            <LanguageSelector lang={lang} onChange={setLang} />
          </div>

          {/* Search */}
          <SearchBar onSearch={handleSearch} loading={loading} lang={lang} ui={ui} />
        </header>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm text-center" dir={isRTL ? 'rtl' : 'ltr'}>
            {error}
          </div>
        )}

        {/* Result */}
        {flight && <FlightCard flight={flight} lang={lang} onClear={() => setFlight(null)} />}

        {/* Empty state */}
        {!flight && !loading && !error && (
          <div className="text-center py-20" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="text-6xl mb-6 opacity-30">✈️</div>
            <p className="text-lg font-medium text-slate-500">
              {lang === 'ar' ? 'ابحث عن أي رحلة' : lang === 'zh' ? '搜索任何航班' : lang === 'hi' ? 'कोई भी फ्लाइट खोजें' : lang === 'ja' ? '便を検索する' : lang === 'ko' ? '항공편 검색' : 'Search for any flight'}
            </p>
            <p className="text-sm text-slate-400 mt-2">EK203 · UA100 · BA249 · AC123</p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-left">
              {[
                { icon: '🌍', title: '12 Languages', desc: 'Status in your native language' },
                { icon: '🗺️', title: 'Airport Navigation', desc: 'Sign-by-sign visual guide' },
                { icon: '✈️', title: 'Standby Routes', desc: 'Alternate flights if delayed' },
              ].map(f => (
                <div key={f.title} className="bg-white border border-blue-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <p className="text-slate-800 text-sm font-semibold">{f.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PWA install banner */}
      {installPrompt && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-blue-100 p-4 flex items-center justify-between gap-4 z-50 shadow-lg">
          <p className="text-sm text-slate-700">Install FlightTrack for offline access</p>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => setInstallPrompt(null)} className="px-3 py-1.5 text-slate-400 text-sm hover:text-slate-600">Later</button>
            <button onClick={handleInstall} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg">Install</button>
          </div>
        </div>
      )}
    </div>
  );
}
