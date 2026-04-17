import { useState, useCallback } from 'react';
import { Plane } from 'lucide-react';
import SearchBar from './components/SearchBar';
import FlightCard from './components/FlightCard';
import LanguageSelector from './components/LanguageSelector';
import { searchByFlightNumber, getLivePosition } from './services/flightApi';
import { detectLanguage, getUI, getLangMeta } from './i18n/index.js';
import { ThemeContext, THEMES } from './theme.js';

export default function App() {
  const [lang, setLang] = useState(detectLanguage);
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [installPrompt, setInstallPrompt] = useState(null);

  const ui = getUI(lang);
  const meta = getLangMeta(lang);
  const isRTL = meta.rtl;

  // Derive theme from flight status
  const theme = THEMES[flight?.status] || THEMES.default;

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
    <ThemeContext.Provider value={theme}>
      <div className={`min-h-screen bg-gradient-to-br ${theme.bg} text-stone-900 transition-colors duration-700`} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Dynamic background blobs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] ${theme.blob1} blur-3xl rounded-full transition-colors duration-700`} />
          <div className={`absolute bottom-0 right-0 w-[400px] h-[300px] ${theme.blob2} blur-3xl rounded-full transition-colors duration-700`} />
          <div className={`absolute top-1/3 left-0 w-[300px] h-[200px] ${theme.blob3} blur-2xl rounded-full transition-colors duration-700`} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 pb-24">
          {/* Header */}
          <header className="mb-8">
            <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`p-2.5 ${theme.logoBg} rounded-xl shadow-lg ${theme.logoShadow} transition-colors duration-700`}>
                  <Plane className="text-white" size={22} />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight leading-none text-stone-900">FlightTrack</h1>
                  <p className={`${theme.accent} text-xs mt-0.5 transition-colors duration-700`}>Live · Multilingual · Navigate</p>
                </div>
              </div>
              <LanguageSelector lang={lang} onChange={setLang} />
            </div>

            {/* Search */}
            <SearchBar onSearch={handleSearch} loading={loading} lang={lang} ui={ui} />
          </header>

          {/* Error */}
          {error && (
            <div className="mb-6 bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-600 text-sm text-center" dir={isRTL ? 'rtl' : 'ltr'}>
              {error}
            </div>
          )}

          {/* Result */}
          {flight && <FlightCard flight={flight} lang={lang} onClear={() => setFlight(null)} />}

          {/* Empty state */}
          {!flight && !loading && !error && (
            <div className="text-center py-20" dir={isRTL ? 'rtl' : 'ltr'}>
              <div className="text-6xl mb-6 opacity-30">✈️</div>
              <p className={`text-lg font-medium ${theme.accent} transition-colors duration-700`}>
                {lang === 'ar' ? 'ابحث عن أي رحلة' : lang === 'zh' ? '搜索任何航班' : lang === 'hi' ? 'कोई भी फ्लाइट खोजें' : lang === 'ja' ? '便を検索する' : lang === 'ko' ? '항공편 검색' : 'Search for any flight'}
              </p>
              <p className={`text-sm ${theme.accent} opacity-70 mt-2`}>EK203 · UA100 · BA249 · AC123</p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-left">
                {[
                  { icon: '🌐', title: '12 Languages', desc: 'Status in your native language' },
                  { icon: '🗺️', title: 'Airport Navigation', desc: 'Sign-by-sign visual guide' },
                  { icon: '✈️', title: 'Standby Routes', desc: 'Alternate flights if delayed' },
                ].map(f => (
                  <div key={f.title} className={`bg-white/80 border ${theme.cardBorder} rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300`}>
                    <div className="text-2xl mb-2">{f.icon}</div>
                    <p className="text-stone-800 text-sm font-semibold">{f.title}</p>
                    <p className="text-stone-500 text-xs mt-0.5">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PWA install banner */}
        {installPrompt && (
          <div className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t ${theme.cardBorder} p-4 flex items-center justify-between gap-4 z-50 shadow-lg`}>
            <p className="text-sm text-stone-700">Install FlightTrack for offline access</p>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setInstallPrompt(null)} className="px-3 py-1.5 text-stone-400 text-sm hover:text-stone-600">Later</button>
              <button onClick={handleInstall} className={`px-4 py-1.5 ${theme.pwaBtn} text-white text-sm font-semibold rounded-lg transition-colors duration-300`}>Install</button>
            </div>
          </div>
        )}
      </div>
    </ThemeContext.Provider>
  );
}
