import { getNaturalMessage, getLangMeta } from '../i18n/index.js';

export default function NaturalStatus({ flight, lang }) {
  const message = getNaturalMessage(flight, lang);
  const meta = getLangMeta(lang);
  const isRTL = meta.rtl;

  return (
    <div
      className="bg-gradient-to-br from-blue-600 to-blue-700 border border-blue-500/30 rounded-2xl p-5 shadow-lg shadow-blue-200/50"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
          🌐 {meta.nativeName}
        </span>
      </div>
      <p className={`text-base leading-relaxed text-white font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
        {message}
      </p>
    </div>
  );
}
