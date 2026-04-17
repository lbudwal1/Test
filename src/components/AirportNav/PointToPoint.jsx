import { useState, useRef, useCallback, useEffect } from 'react';
import { Search, ArrowRight, MapPin, Navigation, X, Compass, ChevronRight, ChevronLeft, CheckCircle, Radio } from 'lucide-react';
import { getSuggestions, getRoute, translateSteps, getNearestWaypoint } from '../../services/wayfinding.js';
import { getUI, getLangMeta } from '../../i18n/index.js';
import AirportSign from './AirportSign.jsx';

const DIRECTION_ARROW = { straight:'⬆️', left:'⬅️', right:'➡️', up:'🔼', down:'🔽', train:'🚆', follow:'👁️' };

// Large animated direction arrow for live navigation
function BigArrow({ direction }) {
  const config = {
    straight: { rotate: 0,   bg: 'bg-sky-500/20',   border: 'border-sky-500/50',   text: 'text-sky-300',   symbol: '↑' },
    right:    { rotate: 90,  bg: 'bg-amber-500/20',  border: 'border-amber-500/50', text: 'text-amber-300', symbol: '↑' },
    left:     { rotate: -90, bg: 'bg-amber-500/20',  border: 'border-amber-500/50', text: 'text-amber-300', symbol: '↑' },
    up:       { rotate: 0,   bg: 'bg-green-500/20',  border: 'border-green-500/50', text: 'text-green-300', symbol: '↑' },
    down:     { rotate: 180, bg: 'bg-green-500/20',  border: 'border-green-500/50', text: 'text-green-300', symbol: '↑' },
    train:    { rotate: 0,   bg: 'bg-purple-500/20', border: 'border-purple-500/50',text: 'text-purple-300',symbol: '⬛' },
  };
  const c = config[direction] || config.straight;

  return (
    <div className={`relative mx-auto w-36 h-36 rounded-full ${c.bg} border-2 ${c.border} flex items-center justify-center`}
         style={{ animation: 'pulse 2s ease-in-out infinite' }}>
      {/* Outer ring pulse */}
      <div className={`absolute inset-0 rounded-full ${c.bg} animate-ping opacity-30`} />
      {/* Arrow SVG */}
      <svg
        width="72" height="72" viewBox="0 0 72 72"
        style={{ transform: `rotate(${c.rotate}deg)`, transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        {direction === 'train' ? (
          <text x="36" y="48" textAnchor="middle" fontSize="40">🚆</text>
        ) : (
          <path
            d="M36 8 L56 52 L36 40 L16 52 Z"
            className={c.text}
            fill="currentColor"
          />
        )}
      </svg>
    </div>
  );
}

// Direction label in native language
const DIR_LABELS = {
  straight: { en:'Go Straight',  es:'Sigue Recto',     fr:'Tout Droit',    ar:'استمر رُهواً',   zh:'直走',    hi:'सीधे जाएं',   pt:'Em Frente',   de:'Geradeaus',      ja:'まっすぐ',    ko:'직진',          tr:'Düz Git',    ru:'Прямо' },
  right:    { en:'Turn Right',   es:'Gira Derecha',    fr:'Tournez Droite',ar:'انعطف يميناً', zh:'右转',    hi:'दाईं मुड़ें',  pt:'Vire Direita', de:'Rechts Abbiegen',ja:'右に曲がる',  ko:'오른쪽 돌아가',   tr:'Sağa Dön',   ru:'Направо' },
  left:     { en:'Turn Left',    es:'Gira Izquierda',  fr:'Tournez Gauche',ar:'انعطف يساراً',zh:'左转',    hi:'बाईं मुड़ें',   pt:'Vire Esquerda',de:'Links Abbiegen', ja:'左に曲がる',  ko:'왼쪽으로 돌아가', tr:'Sola Dön',   ru:'Налево' },
  up:       { en:'Go Up',        es:'Sube',            fr:'Montez',        ar:'اصعد',         zh:'往上',    hi:'ऊपर जाएं',   pt:'Suba',         de:'Nach Oben',      ja:'上へ',        ko:'위로 올라가',    tr:'Yukarı Çık', ru:'Вверх' },
  down:     { en:'Go Down',      es:'Baja',            fr:'Descendez',     ar:'انزل',         zh:'往下',    hi:'नीचे जाएं',  pt:'Desça',        de:'Nach Unten',     ja:'下へ',        ko:'아래로 내려가',  tr:'Aşağı İn',   ru:'Вниз' },
  train:    { en:'Take Train',   es:'Toma el Tren',    fr:'Prendre Tram',  ar:'اركب القطار',  zh:'乘列车',   hi:'ट्रेन लें',   pt:'Pegue o Trem', de:'Zug nehmen',     ja:'電車に乗る',   ko:'기차 타세요',    tr:'Trene Bin',  ru:'На поезд' },
};

const LIVE_STRINGS = {
  title:       { en:'Live Navigation',   es:'Navegación en Vivo',    fr:'Navigation en Direct', ar:'الملاحة المباشرة',  zh:'实时导航',  hi:'लाइव नेविगेशन', pt:'Navegação ao Vivo', de:'Live-Navigation', ja:'ライブナビ', ko:'실시간 안내', tr:'Canlı Navigasyon', ru:'Живая навигация' },
  step_of:     { en:'Step',     es:'Paso',   fr:'Étape', ar:'خطوة', zh:'步骤', hi:'चरण', pt:'Passo', de:'Schritt', ja:'ステップ', ko:'단계', tr:'Adım', ru:'Шаг' },
  of:          { en:'of',       es:'de',     fr:'sur',   ar:'من',   zh:'/',   hi:'/',   pt:'de',    de:'von',     ja:'/',        ko:'/',   tr:'/',    ru:'из' },
  next:        { en:'Next Step →',       es:'Siguiente →',       fr:'Suivant →',       ar:'التالي →',         zh:'下一步 →',  hi:'अगला →',   pt:'Próximo →', de:'Weiter →',       ja:'次へ →',    ko:'다음 →',  tr:'Sonraki →', ru:'Дальше →' },
  prev:        { en:'← Previous',       es:'← Anterior',        fr:'← Précédent',     ar:'← السابق',         zh:'← 上一步', hi:'← पिछला',  pt:'← Anterior', de:'← Zurück',      ja:'← 前へ',    ko:'← 이전',  tr:'← Önceki', ru:'← Назад' },
  arrived:     { en:"You've Arrived! 🎉", es:'¡Has Llegado! 🎉',  fr:'Vous y Êtes ! 🎉',ar:'لقد وصلت! 🎉',    zh:'到达了！🎉', hi:'आप पहुंचे! 🎉', pt:'Chegou! 🎉', de:'Angekommen! 🎉', ja:'到着！ 🎉', ko:'도착! 🎉', tr:'Ulaştınız! 🎉', ru:'Прибыли! 🎉' },
  gps_on:      { en:'📍 GPS Active',     es:'📍 GPS Activo',     fr:'📍 GPS Actif',     ar:'📍 GPS نشط',       zh:'📍 GPS已开', hi:'📍 GPS चालू', pt:'📍 GPS Ativo', de:'📍 GPS Aktiv',   ja:'📍 GPS有効', ko:'📍 GPS켜짐', tr:'📍 GPS Açık', ru:'📍 GPS включён' },
  gps_off:     { en:'Enable GPS',        es:'Activar GPS',       fr:'Activer GPS',      ar:'تفعيل GPS',        zh:'开启GPS',  hi:'GPS चालू करें', pt:'Ativar GPS', de:'GPS aktivieren', ja:'GPS有効化', ko:'GPS켜기',  tr:'GPS Aç',   ru:'Вкл GPS' },
  nearest:     { en:'Nearest location:', es:'Más cercano:',      fr:'Plus proche:',     ar:'الأقرب إليك:',     zh:'最近位置:',  hi:'सबसे पास:', pt:'Mais próximo:', de:'Nächstgelegener:', ja:'最寄り地点:', ko:'가까운 곳:', tr:'En yakın:', ru:'Ближайшее:' },
  m_away:      { en:'m away',            es:'m de distancia',    fr:'m de vous',        ar:'م بعيداً',          zh:'米外',     hi:'मीटर दूर',  pt:'m de distância', de:'m entfernt',    ja:'m先',     ko:'m 거리',   tr:'m uzakta', ru:'м от вас' },
  gps_acc:     { en:'accuracy ±',        es:'precisión ±',       fr:'précision ±',      ar:'دقة ±',            zh:'精度 ±',   hi:'सटीकता ±',  pt:'precisão ±',    de:'Genauigkeit ±', ja:'精度 ±',   ko:'정확도 ±', tr:'doğruluk ±', ru:'точность ±' },
  landmark_lbl:{ en:'🔶 LANDMARK — Look for this!', es:'🔶 REFERENCIA — ¡Búscala!', fr:'🔶 REPÈRE — Cherchez-le !', ar:'🔶 المعلم — ابحث عنه!', zh:'🔶 地标 — 找这个！', hi:'🔶 लैंडमार्क — ध्यान दें!', pt:'🔶 PONTO DE REFERÊNCIA', de:'🔶 ORIENTIERUNGSPUNKT', ja:'🔶 ランドマーク — これを探して！', ko:'🔶 랜드마크 — 찾으세요!', tr:'🔶 REFERANS — Bunu Bulun!', ru:'🔶 ОРИЕНТИР — Ищите это!' },
  sign_lbl:    { en:'Match this sign:', es:'Busca este cartel:', fr:'Cherchez ce panneau:', ar:'ابحث عن هذه اللافتة:', zh:'寻找此标志:', hi:'यह साइन खोजें:', pt:'Procure esta placa:', de:'Schild suchen:', ja:'このサインを探して:', ko:'이 표지판 찾기:', tr:'Bu tabelayı bulun:', ru:'Найдите этот знак:' },
  exit_live:   { en:'Exit Navigation',  es:'Salir',              fr:'Quitter',          ar:'خروج',             zh:'退出',     hi:'बाहर निकलें', pt:'Sair', de:'Beenden',      ja:'ナビ終了', ko:'종료',     tr:'Çıkış',   ru:'Выйти' },
  start_live:  { en:'🧭 Start Live Navigation', es:'🧭 Navegación en Vivo', fr:'🧭 Navigation en Direct', ar:'🧭 ابدأ الملاحة المباشرة', zh:'🧭 开始实时导航', hi:'🧭 लाइव नेविगेशन शुरू करें', pt:'🧭 Iniciar Navegação', de:'🧭 Live-Navigation starten', ja:'🧭 ナビ開始', ko:'🧭 실시간 길안내 시작', tr:'🧭 Canlı Navigasyonu Başlat', ru:'🧭 Начать навигацию' },
};

const L = (obj, lang) => obj[lang] || obj.en;

// ─── Live Navigation Panel ─────────────────────────────────────────────────────
function LiveNav({ steps, fromNode, toNode, airportIata, lang, isRTL, onExit }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [gpsEnabled, setGpsEnabled]   = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState(null);
  const [nearest, setNearest]         = useState(null);
  const watchRef = useRef(null);

  const step    = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast  = currentStep === steps.length - 1;

  function startGPS() {
    if (!navigator.geolocation) return;
    setGpsEnabled(true);
    watchRef.current = navigator.geolocation.watchPosition(
      pos => {
        setGpsAccuracy(Math.round(pos.coords.accuracy));
        const n = getNearestWaypoint(airportIata, pos.coords.latitude, pos.coords.longitude);
        setNearest(n);
      },
      () => setGpsEnabled(false),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );
  }

  function stopGPS() {
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
    setGpsEnabled(false);
    setNearest(null);
    setGpsAccuracy(null);
  }

  useEffect(() => () => { if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current); }, []);

  // Direction color scheme (light-theme)
  const dirColor = {
    straight: 'blue',
    right:    'amber',
    left:     'amber',
    up:       'green',
    down:     'green',
    train:    'purple',
    follow:   'blue',
  };
  const c = dirColor[step?.direction] || 'blue';
  const colorMap = {
    blue:   { bg:'bg-blue-50',   text:'text-blue-700',   border:'border-blue-300',   btn:'bg-blue-600 text-white hover:bg-blue-700'   },
    amber:  { bg:'bg-amber-50',  text:'text-amber-700',  border:'border-amber-300',  btn:'bg-amber-500 text-white hover:bg-amber-600'  },
    green:  { bg:'bg-green-50',  text:'text-green-700',  border:'border-green-300',  btn:'bg-green-600 text-white hover:bg-green-700'  },
    purple: { bg:'bg-purple-50', text:'text-purple-700', border:'border-purple-300', btn:'bg-purple-600 text-white hover:bg-purple-700' },
  };
  const col = colorMap[c];

  return (
    <div className="flex flex-col gap-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass size={16} className="text-blue-600" />
          <span className="text-slate-900 font-bold text-sm">{L(LIVE_STRINGS.title, lang)}</span>
          <span className="text-slate-500 text-xs">
            {L(LIVE_STRINGS.step_of, lang)} {currentStep + 1} {L(LIVE_STRINGS.of, lang)} {steps.length}
          </span>
        </div>
        <button
          onClick={onExit}
          className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
        >
          {L(LIVE_STRINGS.exit_live, lang)}
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Main direction panel */}
      {!isLast ? (
        <div className={`rounded-2xl border ${col.border} ${col.bg} p-5 flex flex-col items-center gap-4 shadow-sm`}>
          <BigArrow direction={step?.direction || 'straight'} />
          <div className={`text-2xl font-black tracking-wide ${col.text}`}>
            {L(DIR_LABELS[step?.direction] || DIR_LABELS.straight, lang)}
          </div>
          <p className="text-slate-800 text-base leading-relaxed text-center font-semibold px-2">
            {step?.instruction}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-green-300 bg-green-50 p-6 flex flex-col items-center gap-3 shadow-sm">
          <CheckCircle size={48} className="text-green-600" />
          <p className="text-green-700 text-xl font-black text-center">{L(LIVE_STRINGS.arrived, lang)}</p>
          <p className="text-green-600/80 text-sm text-center font-medium">{toNode?.label}</p>
        </div>
      )}

      {/* Landmark callout */}
      {step?.landmark && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 shadow-sm">
          <p className="text-amber-700 text-xs font-black uppercase tracking-widest mb-2">
            {L(LIVE_STRINGS.landmark_lbl, lang)}
          </p>
          <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-3xl shrink-0">{step.landmark.emoji}</span>
            <div className={isRTL ? 'text-right' : ''}>
              <p className="text-amber-900 font-bold text-base">{step.landmark.name}</p>
              <p className="text-amber-800/80 text-sm mt-1 leading-relaxed">{step.landmark.desc}</p>
            </div>
          </div>
        </div>
      )}

      {/* Airport sign */}
      {step?.sign && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">
            {L(LIVE_STRINGS.sign_lbl, lang)}
          </p>
          <AirportSign
            type={
              step.sign.color === 'black-yellow' ? 'baggage' :
              step.sign.color === 'green' ? 'customs' :
              step.sign.color === 'purple' ? 'purple' :
              step.sign.color === 'red' ? 'red' :
              step.sign.type === 'government' ? 'government' :
              step.sign.type === 'train' ? 'train' :
              step.sign.type === 'exit' ? 'exit' :
              step.sign.type === 'baggage' ? 'baggage' :
              step.sign.type === 'gates' ? 'gates' :
              step.sign.type === 'gate' ? 'gate' :
              'directional'
            }
            text={step.sign.text}
            subtext={step.sign.subtext}
          />
          <p className="text-slate-400 text-xs italic">
            {lang === 'ar' ? 'تطابق شكل اللافتة ولونها' : lang === 'zh' ? '匹配标志颜色和形状' : lang === 'hi' ? 'रंग और आकार मिलाएं' : lang === 'ja' ? '色と形で探してください' : lang === 'ko' ? '색상과 모양으로 찾으세요' : lang === 'es' ? 'Identifica por color y forma' : lang === 'fr' ? 'Identifiez par couleur et forme' : lang === 'de' ? 'An Farbe und Form erkennen' : lang === 'pt' ? 'Identifique pela cor e forma' : lang === 'tr' ? 'Renk ve şekille eşleştir' : lang === 'ru' ? 'По цвету и форме' : 'Match by color and shape — even if you can\'t read the text'}
          </p>
        </div>
      )}

      {/* GPS status bar */}
      <div className="flex items-center justify-between gap-3 bg-slate-50 rounded-xl px-3 py-2 border border-slate-200">
        <div className="flex items-center gap-2 min-w-0">
          {gpsEnabled ? (
            <>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
              <span className="text-green-700 text-xs font-medium">{L(LIVE_STRINGS.gps_on, lang)}</span>
              {gpsAccuracy && <span className="text-slate-400 text-xs">({L(LIVE_STRINGS.gps_acc, lang)}{gpsAccuracy}m)</span>}
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
              <span className="text-slate-400 text-xs">GPS off</span>
            </>
          )}
          {nearest && (
            <span className="text-slate-500 text-xs ml-1 truncate">
              · {nearest.node.icon} {nearest.node.name_en} ({nearest.distanceMeters}{L(LIVE_STRINGS.m_away, lang)})
            </span>
          )}
        </div>
        <button
          onClick={gpsEnabled ? stopGPS : startGPS}
          className={`shrink-0 text-xs px-2 py-1 rounded-lg transition-colors font-medium ${gpsEnabled ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300' : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'}`}
        >
          {gpsEnabled ? '⏹ Stop' : '▶ GPS'}
        </button>
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
          disabled={isFirst}
          className="flex-1 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-sm"
        >
          <ChevronLeft size={16} />
          {L(LIVE_STRINGS.prev, lang)}
        </button>
        {!isLast && (
          <button
            onClick={() => setCurrentStep(s => Math.min(steps.length - 1, s + 1))}
            className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm ${col.btn}`}
          >
            {L(LIVE_STRINGS.next, lang)}
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* Next step preview */}
      {!isLast && currentStep + 1 < steps.length && (
        <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 opacity-70">
          <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">
            {lang === 'ar' ? 'الخطوة التالية:' : lang === 'zh' ? '下一步:' : lang === 'hi' ? 'अगला:' : lang === 'ja' ? '次のステップ:' : lang === 'ko' ? '다음 단계:' : lang === 'es' ? 'Siguiente:' : lang === 'fr' ? 'Prochaine étape:' : lang === 'de' ? 'Nächster Schritt:' : lang === 'pt' ? 'Próximo:' : lang === 'tr' ? 'Sonraki:' : lang === 'ru' ? 'Следующий шаг:' : 'Next:'}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-base">{DIRECTION_ARROW[steps[currentStep + 1]?.direction] || '⬆️'}</span>
            <p className="text-slate-600 text-xs leading-relaxed">{steps[currentStep + 1]?.instruction}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Location search input ─────────────────────────────────────────────────────
function LocationInput({ label, icon: Icon, value, onChange, onSelect, suggestions, placeholder, isRTL, onClear }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setOpen(suggestions.length > 0 && value.length >= 2);
  }, [suggestions, value]);

  return (
    <div ref={ref} className="relative flex-1 min-w-0">
      <label className="block text-xs text-slate-500 mb-1.5 font-medium uppercase tracking-wide">{label}</label>
      <div className={`flex items-center bg-white border border-slate-300 rounded-xl focus-within:border-blue-400 focus-within:shadow-sm transition-all ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Icon size={14} className="shrink-0 text-blue-400 mx-3" />
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-slate-900 placeholder-slate-400 py-3 text-sm outline-none min-w-0"
          autoComplete="off"
          spellCheck={false}
        />
        {value && (
          <button onClick={() => { onChange(''); onClear?.(); }} className="px-3 text-slate-400 hover:text-slate-600">
            <X size={12} />
          </button>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-blue-100 rounded-xl shadow-xl z-50 overflow-hidden">
          {suggestions.map(s => (
            <button
              key={s.id}
              onMouseDown={(e) => { e.preventDefault(); onSelect(s); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 text-left transition-colors"
            >
              <span className="text-lg shrink-0">{s.icon}</span>
              <div className="min-w-0">
                <p className="text-slate-900 text-sm font-medium truncate">{s.label}</p>
                {s.sublabel !== s.label && <p className="text-slate-500 text-xs truncate">{s.sublabel}</p>}
              </div>
              <span className="ml-auto shrink-0 text-slate-400 text-xs bg-slate-100 px-2 py-0.5 rounded-full">{s.zone}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Individual route step card (list view) ────────────────────────────────────
function RouteStep({ step, index, isLast, lang, isRTL }) {
  return (
    <div className={`relative flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
      <div className="flex flex-col items-center shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 border-2 ${isLast ? 'bg-green-100 border-green-400 text-green-700' : 'bg-blue-100 border-blue-400 text-blue-700'}`}>
          {isLast ? '✓' : index + 1}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-blue-100 mt-1 mb-1" />}
      </div>

      <div className={`flex-1 pb-5 min-w-0 ${isRTL ? 'text-right' : ''}`}>
        <div className={`flex items-center gap-2 mb-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-xl">{step.icon || '🚶'}</span>
          <span className="text-lg">{DIRECTION_ARROW[step.direction] || '⬆️'}</span>
        </div>

        <p className="text-slate-800 text-sm leading-relaxed font-semibold mb-2">{step.instruction}</p>

        {step.landmark && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">
            <span className="text-xl shrink-0">{step.landmark.emoji}</span>
            <div className={isRTL ? 'text-right' : ''}>
              <p className="text-amber-700 text-xs font-semibold uppercase tracking-wide">{step.landmark.name}</p>
              <p className="text-amber-700/80 text-xs mt-0.5">{step.landmark.desc}</p>
            </div>
          </div>
        )}

        {step.sign && (
          <div className="space-y-1.5">
            <p className="text-slate-500 text-xs uppercase tracking-wide font-semibold">
              {lang === 'ar' ? 'ابحث عن هذه اللافتة:' : lang === 'zh' ? '寻找此标志：' : lang === 'hi' ? 'यह साइन खोजें:' : lang === 'ja' ? 'このサインを探して:' : lang === 'ko' ? '이 표지판을 찾으세요:' : lang === 'es' ? 'Busca este cartel:' : lang === 'fr' ? 'Cherchez ce panneau:' : lang === 'de' ? 'Schild suchen:' : lang === 'pt' ? 'Procure esta placa:' : lang === 'tr' ? 'Bu tabelayı arayın:' : lang === 'ru' ? 'Ищите этот знак:' : 'Look for this sign:'}
            </p>
            <AirportSign
              type={
                step.sign.color === 'black-yellow' ? 'baggage' :
                step.sign.color === 'green' ? 'customs' :
                step.sign.color === 'purple' ? 'purple' :
                step.sign.color === 'red' ? 'red' :
                step.sign.type === 'government' ? 'government' :
                step.sign.type === 'train' ? 'train' :
                step.sign.type === 'exit' ? 'exit' :
                step.sign.type === 'baggage' ? 'baggage' :
                step.sign.type === 'gates' ? 'gates' :
                step.sign.type === 'gate' ? 'gate' :
                'directional'
              }
              text={step.sign.text}
              subtext={step.sign.subtext}
            />
            <p className="text-slate-400 text-xs italic">
              {lang === 'ar' ? 'تطابق شكل اللافتة ولونها حتى لو لم تستطع قراءتها' : lang === 'zh' ? '匹配标志的形状和颜色，即使您看不懂文字' : lang === 'hi' ? 'साइन का रंग और आकार मिलाएं, भले ही आप अक्षर न पढ़ सकें' : lang === 'ja' ? '文字が読めなくても、色と形で標識を認識してください' : lang === 'ko' ? '글자를 읽지 못해도 색상과 모양으로 표지판을 찾으세요' : lang === 'es' ? 'Identifica el cartel por color y forma aunque no puedas leerlo' : lang === 'fr' ? 'Identifiez le panneau par sa couleur et sa forme même si vous ne pouvez pas le lire' : lang === 'de' ? 'Erkenne das Schild an Farbe und Form, auch wenn du es nicht lesen kannst' : lang === 'pt' ? 'Identifique a placa pela cor e forma mesmo que não consiga ler' : lang === 'tr' ? 'Okuyamasanız da renk ve şekliyle tabelayı tanıyın' : lang === 'ru' ? 'Опознайте знак по цвету и форме, даже если не можете прочитать' : 'Match this sign by color and shape — even if you can\'t read the text'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main PointToPoint component ───────────────────────────────────────────────
export default function PointToPoint({ airportIata, lang }) {
  const [fromText, setFromText] = useState('');
  const [toText, setToText]     = useState('');
  const [fromNode, setFromNode] = useState(null);
  const [toNode, setToNode]     = useState(null);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions]     = useState([]);
  const [route, setRoute]       = useState(null);
  const [error, setError]       = useState('');
  const [searched, setSearched] = useState(false);
  const [liveNav, setLiveNav]   = useState(false);

  const meta  = getLangMeta(lang);
  const isRTL = meta.rtl;

  const debounceFrom = useRef(null);
  const debounceTo   = useRef(null);

  function onFromChange(v) {
    setFromText(v); setFromNode(null); setRoute(null); setError(''); setSearched(false); setLiveNav(false);
    clearTimeout(debounceFrom.current);
    debounceFrom.current = setTimeout(() => {
      setFromSuggestions(v.length >= 2 ? getSuggestions(airportIata, v, lang) : []);
    }, 200);
  }

  function onToChange(v) {
    setToText(v); setToNode(null); setRoute(null); setError(''); setSearched(false); setLiveNav(false);
    clearTimeout(debounceTo.current);
    debounceTo.current = setTimeout(() => {
      setToSuggestions(v.length >= 2 ? getSuggestions(airportIata, v, lang) : []);
    }, 200);
  }

  function onFromSelect(s) { setFromNode(s); setFromText(s.label); setFromSuggestions([]); }
  function onToSelect(s)   { setToNode(s);   setToText(s.label);   setToSuggestions([]); }

  function handleSearch() {
    setRoute(null); setError(''); setSearched(true); setLiveNav(false);
    if (!fromNode || !toNode) {
      setError(lang === 'ar' ? 'يرجى اختيار كلا الموقعين من القائمة' : lang === 'zh' ? '请从列表中选择两个位置' : lang === 'hi' ? 'कृपया दोनों स्थान सूची से चुनें' : lang === 'es' ? 'Por favor selecciona ambos lugares de la lista de sugerencias' : lang === 'fr' ? 'Veuillez sélectionner les deux endroits dans la liste' : 'Please select both locations from the suggestion list');
      return;
    }
    if (fromNode.id === toNode.id) {
      setError(lang === 'ar' ? 'الموقعان متطابقان!' : lang === 'zh' ? '两个位置相同！' : lang === 'hi' ? 'दोनों स्थान एक ही हैं!' : 'Start and destination are the same!');
      return;
    }
    const steps = getRoute(airportIata, fromNode.id, toNode.id);
    if (!steps || steps.length === 0) {
      setError(lang === 'ar' ? 'لم يتم العثور على مسار. جرّب مواقع مختلفة.' : lang === 'zh' ? '未找到路线。请尝试其他位置。' : lang === 'hi' ? 'कोई मार्ग नहीं मिला। अलग स्थान आज़माएं।' : lang === 'es' ? 'No se encontró ruta. Intenta con ubicaciones diferentes.' : lang === 'fr' ? 'Aucun itinéraire trouvé. Essayez des endroits différents.' : 'No route found between these two locations. Try different locations.');
      return;
    }
    setRoute(translateSteps(steps, lang));
  }

  function swap() {
    const tmpText = fromText; setFromText(toText); setToText(tmpText);
    const tmpNode = fromNode; setFromNode(toNode); setToNode(tmpNode);
    setRoute(null); setError(''); setSearched(false); setLiveNav(false);
  }

  const labels = {
    from: { en:'I am at…', es:'Estoy en…', fr:'Je suis à…', ar:'أنا عند…', zh:'我在…', hi:'मैं यहां हूं…', pt:'Estou em…', de:'Ich bin bei…', ja:'私はここにいます…', ko:'나는 지금…에 있습니다', tr:'Şu an burdayım…', ru:'Я нахожусь у…' },
    to:   { en:'I want to go to…', es:'Quiero ir a…', fr:'Je veux aller à…', ar:'أريد الذهاب إلى…', zh:'我想去…', hi:'मैं जाना चाहता हूं…', pt:'Quero ir para…', de:'Ich möchte zu…', ja:'行きたい場所…', ko:'가고 싶은 곳…', tr:'Gitmek istiyorum…', ru:'Хочу попасть в…' },
    btn:  { en:'Get Directions', es:'Obtener Indicaciones', fr:'Itinéraire', ar:'احصل على الاتجاهات', zh:'获取路线', hi:'रास्ता पाएं', pt:'Obter Rota', de:'Route abrufen', ja:'ルート案内', ko:'길 안내 받기', tr:'Yol Tarifi Al', ru:'Маршрут' },
    placeholder_from: { en:'Gate D42, Tim Hortons, Security…', es:'Puerta D42, Tim Hortons, Seguridad…', fr:'Porte D42, Starbucks, Sécurité…', ar:'بوابة D42، كافيه، الأمن…', zh:'D42登机口、星巴克、安检…', hi:'गेट D42, Tim Hortons, सुरक्षा…', pt:'Portão D42, Starbucks, Segurança…', de:'Gate D42, Starbucks, Sicherheit…', ja:'D42ゲート、スタバ、手荷物検査…', ko:'D42 게이트, 스타벅스, 보안검색…', tr:'D42 kapısı, Starbucks, Güvenlik…', ru:'Выход D42, Starbucks, Безопасность…' },
    placeholder_to:   { en:'Gate E68, Immigration, Baggage Claim…', es:'Puerta E68, Inmigración, Equipaje…', fr:'Porte E68, Immigration, Bagages…', ar:'بوابة E68، الهجرة، استلام الأمتعة…', zh:'E68登机口、入境处、行李领取…', hi:'गेट E68, आव्रजन, सामान दावा…', pt:'Portão E68, Imigração, Bagagem…', de:'Gate E68, Einreisekontrolle, Gepäck…', ja:'E68ゲート、入国審査、手荷物受取…', ko:'E68 게이트, 출입국 심사, 수하물…', tr:'E68 kapısı, Göçmenlik, Bagaj…', ru:'Выход E68, Паспортный контроль, Багаж…' },
  };

  return (
    <div className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Only show search form when not in live nav mode */}
      {!liveNav && (
        <>
          {/* Search inputs */}
          <div className={`flex items-end gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <LocationInput
              label={L(labels.from, lang)}
              icon={MapPin}
              value={fromText}
              onChange={onFromChange}
              onSelect={onFromSelect}
              suggestions={fromSuggestions}
              placeholder={L(labels.placeholder_from, lang)}
              isRTL={isRTL}
              onClear={() => setFromNode(null)}
            />
            <button
              onClick={swap}
              className="shrink-0 mb-0.5 w-9 h-9 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors shadow-sm"
              title="Swap"
            >
              <ArrowRight size={14} className={isRTL ? 'rotate-180' : ''} />
            </button>
            <LocationInput
              label={L(labels.to, lang)}
              icon={Navigation}
              value={toText}
              onChange={onToChange}
              onSelect={onToSelect}
              suggestions={toSuggestions}
              placeholder={L(labels.placeholder_to, lang)}
              isRTL={isRTL}
              onClear={() => setToNode(null)}
            />
          </div>

          <button
            onClick={handleSearch}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Navigation size={16} />
            {L(labels.btn, lang)}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm text-center">
              {error}
            </div>
          )}
        </>
      )}

      {/* Route results */}
      {route && route.length > 0 && !liveNav && (
        <div className="mt-2 space-y-0 bg-white rounded-2xl p-4 border border-blue-100 shadow-sm">
          {/* Route summary + live nav button */}
          <div className={`flex items-center gap-2 mb-4 pb-4 border-b border-blue-100 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-slate-500 text-sm">{fromNode?.icon} <strong className="text-slate-900">{fromNode?.label}</strong></span>
            <ArrowRight size={14} className="text-blue-500 shrink-0" />
            <span className="text-slate-500 text-sm">{toNode?.icon} <strong className="text-slate-900">{toNode?.label}</strong></span>
            <span className="ml-auto shrink-0 text-slate-400 text-xs">{route.length} {lang === 'ar' ? 'خطوات' : lang === 'zh' ? '步' : lang === 'hi' ? 'कदम' : lang === 'ja' ? 'ステップ' : lang === 'ko' ? '단계' : lang === 'es' ? 'pasos' : lang === 'fr' ? 'étapes' : lang === 'de' ? 'Schritte' : lang === 'pt' ? 'passos' : lang === 'tr' ? 'adım' : lang === 'ru' ? 'шагов' : 'steps'}</span>
          </div>

          {/* Start live nav button */}
          <button
            onClick={() => setLiveNav(true)}
            className="w-full mb-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-200"
          >
            <Compass size={18} />
            {L(LIVE_STRINGS.start_live, lang)}
          </button>

          {/* Step list */}
          {route.map((step, i) => (
            <RouteStep key={i} step={step} index={i} isLast={i === route.length - 1} lang={lang} isRTL={isRTL} />
          ))}

          <div className={`mt-4 pt-4 border-t border-blue-100 text-xs text-slate-400 ${isRTL ? 'text-right' : ''}`}>
            {lang === 'ar' ? '💡 إذا كنت لا تزال غير متأكد، اطلب المساعدة من أي موظف يرتدي زي المطار' : lang === 'zh' ? '💡 如果还不确定，请向任何穿机场制服的工作人员寻求帮助' : lang === 'hi' ? '💡 अगर फिर भी समझ न आए, तो एयरपोर्ट यूनिफॉर्म वाले किसी भी कर्मचारी से मदद लें' : lang === 'es' ? '💡 Si aún tienes dudas, pide ayuda a cualquier empleado con uniforme del aeropuerto' : lang === 'fr' ? '💡 Si vous avez encore des doutes, demandez l\'aide de tout employé en uniforme' : lang === 'de' ? '💡 Falls Sie noch unsicher sind, bitten Sie einen Mitarbeiter in Uniform um Hilfe' : lang === 'pt' ? '💡 Se ainda tiver dúvidas, peça ajuda a qualquer funcionário uniformizado' : lang === 'ja' ? '💡 まだわからない場合は、空港制服を着たスタッフに声をかけてください' : lang === 'ko' ? '💡 여전히 모르겠다면 공항 유니폼을 입은 직원에게 도움을 요청하세요' : lang === 'tr' ? '💡 Hâlâ emin değilseniz, üniformalı bir havalimanı çalışanından yardım isteyin' : lang === 'ru' ? '💡 Если всё ещё не уверены, обратитесь к сотруднику в форме аэропорта' : '💡 Still unsure? Ask any airport staff member in a uniform — they are always happy to help'}
          </div>
        </div>
      )}

      {/* Live navigation view */}
      {liveNav && route && (
        <div className="bg-white rounded-2xl p-4 border border-blue-200 shadow-sm">
          <LiveNav
            steps={route}
            fromNode={fromNode}
            toNode={toNode}
            airportIata={airportIata}
            lang={lang}
            isRTL={isRTL}
            onExit={() => setLiveNav(false)}
          />
        </div>
      )}

      {searched && route === null && !error && (
        <div className="text-center text-slate-500 text-sm py-4">
          {lang === 'ar' ? 'لم يتم العثور على مسار' : lang === 'zh' ? '未找到路线' : lang === 'hi' ? 'कोई मार्ग नहीं मिला' : 'No route found'}
        </div>
      )}
    </div>
  );
}
