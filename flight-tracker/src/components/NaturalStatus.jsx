import { getNaturalMessage, getLangMeta } from '../i18n/index.js';
import { useTheme } from '../theme.js';

export default function NaturalStatus({ flight, lang }) {
  const theme = useTheme();
  const message = getNaturalMessage(flight, lang);
  const meta = getLangMeta(lang);
  const isRTL = meta.rtl;

  return (
    <div
      className={`bg-gradient-to-br ${theme.banner} rounded-2xl p-5 shadow-lg transition-all duration-700`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <span className={`text-xs font-semibold uppercase tracking-wider ${theme.bannerSub} transition-colors duration-700`}>
          🌐 {meta.nativeName}
        </span>
      </div>
      <p className={`text-base leading-relaxed text-white font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
        {message}
      </p>
    </div>
  );
}
