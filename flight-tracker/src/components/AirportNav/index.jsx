import { useState } from 'react';
import { MapPin, ChevronDown, ChevronUp, Navigation, Search } from 'lucide-react';
import { getAirportNav } from '../../data/airportNav.js';
import { getWaypoints } from '../../data/airportWaypoints.js';
import { getUI, getLangMeta } from '../../i18n/index.js';
import { renderStep, locName } from '../../i18n/navTemplates.js';
import AirportSign from './AirportSign.jsx';
import PointToPoint from './PointToPoint.jsx';

const DIRECTION_ARROW = { straight:'⬆️', left:'⬅️', right:'➡️', up:'🔼', down:'🔽', train:'🚆', follow:'👁️' };

const FLOW_LABELS = {
  'arrival-intl':      { icon:'🛬' },
  'arrival-domestic':  { icon:'🛬' },
  'departure-intl':    { icon:'🛫' },
  'departure-domestic':{ icon:'🛫' },
  'connection':        { icon:'🔄' },
};

function getStepInstruction(step, lang) {
  if (step.templateKey) {
    const params = {};
    for (const [k, v] of Object.entries(step.params || {})) {
      params[k] = v && locName(v, lang) !== v ? locName(v, lang) : v;
    }
    return renderStep(step.templateKey, params, lang);
  }
  return step.instruction_en;
}

function NavStep({ step, index, total, lang, ui, isRTL }) {
  const isLast = index === total - 1;
  const instruction = getStepInstruction(step, lang);
  const signKey = ui?.lookForSign || 'Look for this sign:';

  return (
    <div className={`relative flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
      {/* Timeline dot + line */}
      <div className="flex flex-col items-center shrink-0">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm z-10 border-2 ${isLast ? 'bg-green-100 border-green-400 text-green-700' : 'bg-blue-100 border-blue-400 text-blue-700'}`}>
          {isLast ? '✓' : index + 1}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-blue-100 mt-1 mb-1" />}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-6 min-w-0 ${isRTL ? 'text-right' : ''}`}>
        {/* Direction indicator */}
        <div className={`flex items-center gap-2 mb-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-xl">{step.icon}</span>
          <span className="text-xl">{DIRECTION_ARROW[step.direction] || '⬆️'}</span>
          <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-full uppercase tracking-wide font-medium">
            {ui?.direction?.[step.direction] || step.direction}
          </span>
        </div>

        {/* Main instruction in user's language */}
        <p className="text-slate-800 text-sm leading-relaxed font-semibold mb-3">{instruction}</p>

        {/* Landmark */}
        {step.landmark && (
          <div className={`flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
            <span className="text-2xl shrink-0">{step.landmark.emoji}</span>
            <div>
              <p className="text-amber-700 font-semibold text-xs uppercase tracking-wide mb-0.5">
                {ui?.landmark || 'Landmark:'}
              </p>
              <p className="text-amber-800 font-medium text-sm">{step.landmark.name}</p>
              <p className="text-amber-700/80 text-xs mt-0.5">{step.landmark.desc}</p>
            </div>
          </div>
        )}

        {/* Sign to look for */}
        {step.sign && (
          <div className="space-y-1.5">
            <p className="text-slate-500 text-xs uppercase tracking-wide font-semibold">{signKey}</p>
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
                step.sign.type === 'security' ? 'directional' :
                step.sign.type === 'gates' ? 'gates' :
                step.sign.type === 'gate' ? 'gate' :
                'directional'
              }
              text={step.sign.text}
              subtext={step.sign.subtext}
            />
            <p className="text-slate-400 text-xs italic">
              {lang === 'ar' ? 'تطابق شكل اللافتة ولونها — حتى لو لم تتمكن من قراءتها' :
               lang === 'zh' ? '匹配标志的颜色和形状——即使看不懂文字' :
               lang === 'hi' ? 'साइन का रंग और आकार मिलाएं — भले ही पढ़ न सकें' :
               lang === 'ja' ? '読めなくても色と形で標識を見つけてください' :
               lang === 'ko' ? '읽지 못해도 색과 모양으로 표지판을 찾으세요' :
               lang === 'es' ? 'Identifica el cartel por color y forma aunque no puedas leerlo' :
               lang === 'fr' ? 'Identifiez le panneau par couleur et forme même sans le lire' :
               lang === 'de' ? 'Erkenne das Schild an Farbe und Form, auch ohne lesen zu können' :
               lang === 'pt' ? 'Identifique a placa pela cor e forma mesmo sem conseguir ler' :
               lang === 'tr' ? 'Okuyamasanız da renk ve şekliyle tabelayı tanıyın' :
               lang === 'ru' ? 'Опознайте знак по цвету и форме, даже не читая текст' :
               'Match this sign by color and shape — even if you can\'t read the text'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AirportNav({ flight, lang }) {
  const depIata = flight.departure?.iata;
  const arrIata = flight.arrival?.iata;
  const ui      = getUI(lang);
  const meta    = getLangMeta(lang);
  const isRTL   = meta.rtl;

  const [showNav, setShowNav]       = useState(false);
  const [activeTab, setActiveTab]   = useState('flow');
  const [activeAirport, setActiveAirport] = useState('arrival');
  const [activeFlow, setActiveFlow] = useState(null);

  const airportIata = activeAirport === 'arrival' ? arrIata : depIata;
  const navData     = getAirportNav(airportIata);
  const wpData      = getWaypoints(airportIata);
  const flows       = navData?.flows || {};
  const flowKeys    = Object.keys(flows);
  const selFlowKey  = activeFlow || flowKeys[0];
  const selFlow     = flows[selFlowKey];

  const hasNav    = !!navData;
  const hasP2P    = !!wpData;
  const hasEither = hasNav || hasP2P;

  if (!hasEither) {
    return (
      <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Navigation size={16} className="text-slate-400" />
          <span className="text-sm font-semibold text-slate-500">{ui.airportNav}</span>
        </div>
        <p className="text-slate-400 text-sm">{ui.noNavData}</p>
      </div>
    );
  }

  const tab = {
    flow: { en:'Step-by-Step Guide', es:'Guía Paso a Paso', fr:'Guide étape par étape', ar:'دليل خطوة بخطوة', zh:'步骤指南', hi:'चरण-दर-चरण गाइड', pt:'Guia Passo a Passo', de:'Schritt-für-Schritt', ja:'ステップガイド', ko:'단계별 가이드', tr:'Adım Adım Rehber', ru:'Пошаговый гид' },
    p2p:  { en:'Custom Navigation', es:'Navegación Personalizada', fr:'Navigation personnalisée', ar:'ملاحة مخصصة', zh:'自定义导航', hi:'कस्टम नेविगेशन', pt:'Navegação Personalizada', de:'Individuelle Navigation', ja:'カスタムナビ', ko:'맞춤 길안내', tr:'Özel Navigasyon', ru:'Личная навигация' },
  };
  const L = (obj) => obj[lang] || obj.en;

  return (
    <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header toggle */}
      <button
        onClick={() => setShowNav(n => !n)}
        className="w-full flex items-center justify-between gap-3 p-5 hover:bg-blue-50/60 transition-colors"
      >
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="p-2 bg-blue-100 border border-blue-200 rounded-xl shrink-0">
            <Navigation size={18} className="text-blue-600" />
          </div>
          <div className={isRTL ? 'text-right' : ''}>
            <p className="font-semibold text-slate-900 text-sm">{ui.airportNav}</p>
            <p className="text-slate-500 text-xs mt-0.5">
              {navData?.name || airportIata} · {L(tab.flow)} & {L(tab.p2p)}
            </p>
          </div>
        </div>
        {showNav ? <ChevronUp size={18} className="text-slate-400 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
      </button>

      {showNav && (
        <div className="border-t border-blue-100">
          {/* Airport picker */}
          <div className="flex border-b border-blue-100">
            {[
              { key:'departure', label:`🛫 ${depIata}`, iata:depIata },
              { key:'arrival',   label:`🛬 ${arrIata}`, iata:arrIata },
            ].map(opt => (getAirportNav(opt.iata) || getWaypoints(opt.iata)) && (
              <button
                key={opt.key}
                onClick={() => { setActiveAirport(opt.key); setActiveFlow(null); }}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${activeAirport === opt.key ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Airport info bar */}
          {navData && (
            <div className="px-5 py-3 border-b border-blue-100 bg-blue-50">
              <div className={`flex items-center gap-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                <MapPin size={13} className="text-blue-500 shrink-0" />
                <span className="text-slate-900 font-semibold text-sm">{navData.name}</span>
                <span className="text-slate-500 text-xs">· {navData.city}, {navData.country}</span>
                <span className="text-slate-400 text-xs">· T: {navData.terminals.join(', ')}</span>
              </div>
            </div>
          )}

          {/* Feature tabs */}
          <div className="flex border-b border-blue-100 bg-slate-50">
            <button onClick={() => setActiveTab('flow')} className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors ${activeTab === 'flow' ? 'text-blue-700 bg-white border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-700'}`}>
              <Navigation size={13} /> {L(tab.flow)}
            </button>
            {hasP2P && (
              <button onClick={() => setActiveTab('p2p')} className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors ${activeTab === 'p2p' ? 'text-blue-700 bg-white border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-700'}`}>
                <Search size={13} /> {L(tab.p2p)}
              </button>
            )}
          </div>

          {/* ── TAB: Step-by-step flow ──────────────────────────────────── */}
          {activeTab === 'flow' && navData && (
            <>
              {/* Flow selector */}
              <div className="p-4 border-b border-blue-100 bg-slate-50">
                <div className="flex gap-2 flex-wrap">
                  {flowKeys.map(key => {
                    const meta2 = FLOW_LABELS[key] || { icon:'📍' };
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveFlow(key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${selFlowKey === key ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'}`}
                      >
                        {meta2.icon} {flows[key].label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selFlow && (
                <div className="p-5">
                  {selFlow.steps.map((step, i) => (
                    <NavStep
                      key={step.id || i}
                      step={step}
                      index={i}
                      total={selFlow.steps.length}
                      lang={lang}
                      ui={ui}
                      isRTL={isRTL}
                    />
                  ))}
                  {/* Completion */}
                  <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-9 h-9 rounded-full bg-green-100 border-2 border-green-400 flex items-center justify-center text-green-700 text-lg shrink-0">✓</div>
                    <div className={`pt-1 ${isRTL ? 'text-right' : ''}`}>
                      <p className="text-green-700 font-semibold text-sm">
                        {lang === 'ar' ? 'لقد وصلت!' : lang === 'zh' ? '到达!' : lang === 'hi' ? 'आप पहुंच गए!' : lang === 'ja' ? '到着！' : lang === 'ko' ? '도착!' : lang === 'es' ? '¡Has llegado!' : lang === 'fr' ? 'Vous êtes arrivé(e) !' : lang === 'de' ? 'Angekommen!' : lang === 'pt' ? 'Chegou!' : lang === 'tr' ? 'Ulaştınız!' : lang === 'ru' ? 'Вы добрались!' : "You've arrived!"}
                      </p>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {lang === 'ar' ? 'إذا كنت ضائعاً، ابحث عن مكتب الاستعلامات (ℹ️) أو اطلب المساعدة من أي موظف بالزي الرسمي.' :
                         lang === 'zh' ? '如果迷路，请找问询处（ℹ️）或向穿制服的工作人员求助。' :
                         lang === 'hi' ? 'अगर रास्ता न मिले तो जानकारी डेस्क (ℹ️) खोजें या यूनिफॉर्म वाले कर्मचारी से मदद मांगें।' :
                         lang === 'ja' ? '迷ったら、案内カウンター（ℹ️）を探すか、制服のスタッフに声をかけてください。' :
                         lang === 'ko' ? '길을 잃으셨다면 안내 데스크（ℹ️）를 찾거나 유니폼을 입은 직원에게 도움을 요청하세요.' :
                         lang === 'es' ? 'Si te pierdes, busca el mostrador de información (ℹ️) o pide ayuda a cualquier empleado en uniforme.' :
                         lang === 'fr' ? 'Si vous êtes perdu(e), cherchez le bureau d\'information (ℹ️) ou demandez à un employé en uniforme.' :
                         lang === 'de' ? 'Falls Sie sich verirren, suchen Sie den Informationsschalter (ℹ️) oder fragen Sie einen Mitarbeiter in Uniform.' :
                         lang === 'pt' ? 'Se se perder, procure o balcão de informações (ℹ️) ou peça ajuda a um funcionário uniformizado.' :
                         lang === 'tr' ? 'Kaybolursanız bilgi masası (ℹ️) arayın ya da üniformalı personelden yardım isteyin.' :
                         lang === 'ru' ? 'Если заблудились, найдите стойку информации (ℹ️) или обратитесь к сотруднику в форме.' :
                         'If lost, look for the information desk (ℹ️) or ask any airport staff in a uniform.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── TAB: Point-to-point ─────────────────────────────────────── */}
          {activeTab === 'p2p' && (
            <div className="p-5">
              {hasP2P ? (
                <PointToPoint airportIata={airportIata} lang={lang} />
              ) : (
                <p className="text-slate-400 text-sm text-center py-4">{ui.noNavData}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
