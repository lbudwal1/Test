// ─── Language definitions ────────────────────────────────────────────────────
export const LANGUAGES = [
  { code: 'en', name: 'English',    nativeName: 'English',     flag: '🇬🇧', rtl: false },
  { code: 'es', name: 'Spanish',    nativeName: 'Español',     flag: '🇪🇸', rtl: false },
  { code: 'fr', name: 'French',     nativeName: 'Français',    flag: '🇫🇷', rtl: false },
  { code: 'ar', name: 'Arabic',     nativeName: 'العربية',      flag: '🇸🇦', rtl: true  },
  { code: 'zh', name: 'Chinese',    nativeName: '中文',         flag: '🇨🇳', rtl: false },
  { code: 'hi', name: 'Hindi',      nativeName: 'हिन्दी',         flag: '🇮🇳', rtl: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português',   flag: '🇧🇷', rtl: false },
  { code: 'de', name: 'German',     nativeName: 'Deutsch',     flag: '🇩🇪', rtl: false },
  { code: 'ja', name: 'Japanese',   nativeName: '日本語',        flag: '🇯🇵', rtl: false },
  { code: 'ko', name: 'Korean',     nativeName: '한국어',        flag: '🇰🇷', rtl: false },
  { code: 'tr', name: 'Turkish',    nativeName: 'Türkçe',      flag: '🇹🇷', rtl: false },
  { code: 'ru', name: 'Russian',    nativeName: 'Русский',     flag: '🇷🇺', rtl: false },
];

export function detectLanguage() {
  const code = navigator.language?.split('-')[0] || 'en';
  return LANGUAGES.find(l => l.code === code)?.code || 'en';
}

export function getLangMeta(code) {
  return LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
}

// ─── Translations ─────────────────────────────────────────────────────────────
// Natural-language status messages. Each is a function receiving context data.
// ctx = { flightNumber, airline, delay, minsToArrival, minsToDep, arrivalAirport,
//          departureAirport, gate, terminal, altitudeFt, speedKts }

export const STATUS_MESSAGES = {
  en: {
    airborne_ontime: (c) =>
      `✈️ Great news! Your flight ${c.flightNumber} is cruising at ${c.altitudeFt ? c.altitudeFt.toLocaleString() + ' ft' : 'altitude'} and everything is running on time. ${c.minsToArrival > 0 ? `You should land at ${c.arrivalAirport} in about ${formatMins(c.minsToArrival, 'en')}.` : ''} Sit back and enjoy the flight!`,
    airborne_delayed: (c) =>
      `⚠️ Your flight ${c.flightNumber} is in the air but running about ${c.delay} minutes behind schedule. ${c.minsToArrival > 0 ? `You're now expected to arrive at ${c.arrivalAirport} in about ${formatMins(c.minsToArrival, 'en')}.` : ''} The crew is working hard to make up time where possible.`,
    airborne_landing_soon: (c) =>
      `🛬 Almost there! Your flight ${c.flightNumber} will be landing at ${c.arrivalAirport} in about ${formatMins(c.minsToArrival, 'en')}. Time to pack up your things, put your seat upright, and get ready to arrive!`,
    scheduled_far: (c) =>
      `🕐 Your flight ${c.flightNumber} from ${c.departureAirport} to ${c.arrivalAirport} is confirmed and scheduled. Departure is in ${formatMins(c.minsToDep, 'en')}. You have time to relax before heading to the gate.`,
    scheduled_soon: (c) =>
      `⏰ Time to make your way to the airport! Your flight ${c.flightNumber} departs in about ${formatMins(c.minsToDep, 'en')}. Check in early and proceed to ${c.gate ? `Gate ${c.gate}` : 'your gate'}.`,
    boarding: (c) =>
      `🚨 Boarding now! Your flight ${c.flightNumber} is boarding${c.gate ? ` at Gate ${c.gate}` : ''}. Please head there immediately — don't miss it!`,
    landed: (c) =>
      `🎉 You've landed! Flight ${c.flightNumber} has arrived at ${c.arrivalAirport}. ${c.delay > 0 ? `You're about ${c.delay} minutes behind schedule.` : `Right on time!`} Welcome — we hope you had a smooth flight.`,
    delayed_ground: (c) =>
      `⏳ Heads up — your flight ${c.flightNumber} is delayed by ${c.delay} minutes. ${c.delay < 60 ? "Not too bad — grab a coffee and stay near the gate." : c.delay < 120 ? "You have a bit of time. Explore the airport, eat something, and check back soon." : "This is a significant delay. Check in with the airline desk for the latest updates and options."}`,
    cancelled: (c) =>
      `❌ We're very sorry — flight ${c.flightNumber} has been cancelled. Please go to the ${c.airline} service desk or call the airline immediately to rebook on the next available flight. Don't panic — airlines are required by law to assist you.`,
    diverted: (c) =>
      `⚡ Your flight ${c.flightNumber} has been diverted and will land at a different airport than planned. The airline will arrange onward transportation. Please follow crew instructions and stay with your group.`,
    unknown: (c) =>
      `Your flight ${c.flightNumber} status is being updated. Check back shortly for the latest information.`,
  },

  es: {
    airborne_ontime: (c) =>
      `✈️ ¡Buenas noticias! Tu vuelo ${c.flightNumber} está volando ${c.altitudeFt ? `a ${Math.round(c.altitudeFt * 0.3048).toLocaleString()} metros de altitud` : 'en altitud de crucero'} y todo marcha a tiempo. ${c.minsToArrival > 0 ? `Llegarás a ${c.arrivalAirport} en aproximadamente ${formatMins(c.minsToArrival, 'es')}.` : ''} ¡Relájate y disfruta el vuelo!`,
    airborne_delayed: (c) =>
      `⚠️ Tu vuelo ${c.flightNumber} está en el aire pero lleva un retraso de ${c.delay} minutos. ${c.minsToArrival > 0 ? `Se estima que llegarás a ${c.arrivalAirport} en ${formatMins(c.minsToArrival, 'es')}.` : ''} La tripulación hace lo posible para recuperar tiempo.`,
    airborne_landing_soon: (c) =>
      `🛬 ¡Ya casi llegas! El vuelo ${c.flightNumber} aterrizará en ${c.arrivalAirport} en aproximadamente ${formatMins(c.minsToArrival, 'es')}. Es hora de recoger tus cosas, enderezar el asiento y prepararte para llegar.`,
    scheduled_far: (c) =>
      `🕐 Tu vuelo ${c.flightNumber} de ${c.departureAirport} a ${c.arrivalAirport} está confirmado. La salida es en ${formatMins(c.minsToDep, 'es')}. Tienes tiempo para relajarte antes de dirigirte a la puerta.`,
    scheduled_soon: (c) =>
      `⏰ ¡Es hora de ir al aeropuerto! Tu vuelo ${c.flightNumber} sale en ${formatMins(c.minsToDep, 'es')}. Haz el check-in y dirígete a ${c.gate ? `la Puerta ${c.gate}` : 'tu puerta de embarque'}.`,
    boarding: (c) =>
      `🚨 ¡Embarcando ahora! El vuelo ${c.flightNumber} está embarcando${c.gate ? ` en la Puerta ${c.gate}` : ''}. ¡Dirígete ahora mismo — no lo pierdas!`,
    landed: (c) =>
      `🎉 ¡Has aterrizado! El vuelo ${c.flightNumber} ha llegado a ${c.arrivalAirport}. ${c.delay > 0 ? `Con ${c.delay} minutos de retraso.` : '¡En horario!'} ¡Bienvenido — esperamos que hayas tenido un viaje agradable!`,
    delayed_ground: (c) =>
      `⏳ Aviso — tu vuelo ${c.flightNumber} tiene un retraso de ${c.delay} minutos. ${c.delay < 60 ? "No es mucho — toma un café y mantente cerca de la puerta." : c.delay < 120 ? "Tienes algo de tiempo. Explora el aeropuerto y vuelve pronto." : "Este es un retraso significativo. Consulta en el mostrador de la aerolínea para obtener más opciones."}`,
    cancelled: (c) =>
      `❌ Lo sentimos mucho — el vuelo ${c.flightNumber} ha sido cancelado. Ve al mostrador de servicio de ${c.airline} o llama a la aerolínea para reprogramar tu viaje. No entres en pánico — la aerolínea está obligada a ayudarte.`,
    diverted: (c) =>
      `⚡ Tu vuelo ${c.flightNumber} ha sido desviado a un aeropuerto diferente. La aerolínea organizará el transporte. Sigue las instrucciones de la tripulación.`,
    unknown: (c) =>
      `El estado del vuelo ${c.flightNumber} se está actualizando. Vuelve a verificar en breve.`,
  },

  fr: {
    airborne_ontime: (c) =>
      `✈️ Excellente nouvelle ! Votre vol ${c.flightNumber} vole ${c.altitudeFt ? `à ${Math.round(c.altitudeFt * 0.3048).toLocaleString()} mètres d'altitude` : 'en altitude de croisière'} et tout est à l'heure. ${c.minsToArrival > 0 ? `Vous devriez atterrir à ${c.arrivalAirport} dans environ ${formatMins(c.minsToArrival, 'fr')}.` : ''} Profitez du voyage !`,
    airborne_delayed: (c) =>
      `⚠️ Votre vol ${c.flightNumber} est en l'air mais accuse ${c.delay} minutes de retard. ${c.minsToArrival > 0 ? `Arrivée prévue à ${c.arrivalAirport} dans ${formatMins(c.minsToArrival, 'fr')}.` : ''} L'équipage fait de son mieux pour rattraper le retard.`,
    airborne_landing_soon: (c) =>
      `🛬 Vous approchez ! Votre vol ${c.flightNumber} atterrit à ${c.arrivalAirport} dans environ ${formatMins(c.minsToArrival, 'fr')}. Il est temps de rassembler vos affaires et de redresser votre siège.`,
    scheduled_far: (c) =>
      `🕐 Votre vol ${c.flightNumber} de ${c.departureAirport} vers ${c.arrivalAirport} est confirmé. Départ dans ${formatMins(c.minsToDep, 'fr')}. Vous avez le temps de vous détendre.`,
    scheduled_soon: (c) =>
      `⏰ Il est temps de vous rendre à l'aéroport ! Votre vol ${c.flightNumber} décolle dans ${formatMins(c.minsToDep, 'fr')}. Enregistrez-vous et rejoignez ${c.gate ? `la Porte ${c.gate}` : 'votre porte'}.`,
    boarding: (c) =>
      `🚨 Embarquement en cours ! Le vol ${c.flightNumber} embarque${c.gate ? ` à la Porte ${c.gate}` : ''}. Présentez-vous immédiatement !`,
    landed: (c) =>
      `🎉 Vous êtes arrivé(e) ! Le vol ${c.flightNumber} a atterri à ${c.arrivalAirport}. ${c.delay > 0 ? `Avec ${c.delay} minutes de retard.` : 'À l\'heure !'} Bienvenue !`,
    delayed_ground: (c) =>
      `⏳ Votre vol ${c.flightNumber} est retardé de ${c.delay} minutes. ${c.delay < 60 ? "Prenez un café et restez près de la porte." : c.delay < 120 ? "Profitez de l'aéroport et revenez bientôt." : "Retard important. Consultez le comptoir de la compagnie aérienne pour vos options."}`,
    cancelled: (c) =>
      `❌ Nous sommes désolés — le vol ${c.flightNumber} a été annulé. Rendez-vous au comptoir ${c.airline} ou appelez la compagnie pour rebooker. La loi oblige la compagnie à vous assister.`,
    diverted: (c) =>
      `⚡ Votre vol ${c.flightNumber} a été dérouté vers un autre aéroport. Suivez les instructions de l'équipage.`,
    unknown: (c) => `Le statut du vol ${c.flightNumber} est en cours de mise à jour.`,
  },

  ar: {
    airborne_ontime: (c) =>
      `✈️ أخبار رائعة! رحلتك ${c.flightNumber} تحلق ${c.altitudeFt ? `على ارتفاع ${Math.round(c.altitudeFt * 0.3048).toLocaleString()} متر` : 'على ارتفاع السياحة'} وكل شيء في موعده. ${c.minsToArrival > 0 ? `ستصل إلى ${c.arrivalAirport} في حوالي ${formatMins(c.minsToArrival, 'ar')}.` : ''} استرخِ واستمتع بالرحلة!`,
    airborne_delayed: (c) =>
      `⚠️ رحلتك ${c.flightNumber} في الجو لكنها متأخرة بمقدار ${c.delay} دقيقة. ${c.minsToArrival > 0 ? `الوصول المتوقع إلى ${c.arrivalAirport} خلال ${formatMins(c.minsToArrival, 'ar')}.` : ''} الطاقم يعمل على تعويض التأخير.`,
    airborne_landing_soon: (c) =>
      `🛬 اقتربت من وجهتك! ستهبط رحلتك ${c.flightNumber} في ${c.arrivalAirport} خلال ${formatMins(c.minsToArrival, 'ar')}. حان وقت ترتيب أغراضك.`,
    scheduled_far: (c) =>
      `🕐 رحلتك ${c.flightNumber} من ${c.departureAirport} إلى ${c.arrivalAirport} مؤكدة. الإقلاع بعد ${formatMins(c.minsToDep, 'ar')}. لديك وقت للاسترخاء.`,
    scheduled_soon: (c) =>
      `⏰ حان وقت التوجه للمطار! رحلتك ${c.flightNumber} تقلع بعد ${formatMins(c.minsToDep, 'ar')}. أكمل إجراءات السفر وتوجه إلى ${c.gate ? `البوابة ${c.gate}` : 'بوابتك'}.`,
    boarding: (c) =>
      `🚨 الصعود الآن! رحلة ${c.flightNumber} تصعد${c.gate ? ` من البوابة ${c.gate}` : ''}. توجه فوراً — لا تفوّت رحلتك!`,
    landed: (c) =>
      `🎉 وصلت! هبطت الرحلة ${c.flightNumber} في ${c.arrivalAirport}. ${c.delay > 0 ? `مع تأخير ${c.delay} دقيقة.` : 'في الموعد تماماً!'} مرحباً بك!`,
    delayed_ground: (c) =>
      `⏳ تنبيه — رحلتك ${c.flightNumber} متأخرة ${c.delay} دقيقة. ${c.delay < 60 ? 'ليس كثيراً — اشرب قهوة وابق قريباً من البوابة.' : c.delay < 120 ? 'لديك بعض الوقت. استكشف المطار وعد قريباً.' : 'تأخير كبير. راجع مكتب الخطوط الجوية للاطلاع على خياراتك.'}`,
    cancelled: (c) =>
      `❌ نأسف جداً — تم إلغاء الرحلة ${c.flightNumber}. توجه فوراً إلى مكتب خدمة ${c.airline} أو اتصل بالشركة لإعادة الحجز. القانون يُلزم الشركة بمساعدتك.`,
    diverted: (c) =>
      `⚡ تم تحويل رحلتك ${c.flightNumber} إلى مطار آخر. اتبع تعليمات الطاقم.`,
    unknown: (c) => `جاري تحديث معلومات الرحلة ${c.flightNumber}. تحقق مجدداً قريباً.`,
  },

  zh: {
    airborne_ontime: (c) =>
      `✈️ 好消息！您的航班 ${c.flightNumber} 正在${c.altitudeFt ? `${Math.round(c.altitudeFt * 0.3048).toLocaleString()}米` : '巡航'}高度飞行，一切准时。${c.minsToArrival > 0 ? `预计约${formatMins(c.minsToArrival, 'zh')}后抵达${c.arrivalAirport}。` : ''}请放松，享受飞行！`,
    airborne_delayed: (c) =>
      `⚠️ 您的航班 ${c.flightNumber} 已在空中，但延误约 ${c.delay} 分钟。${c.minsToArrival > 0 ? `预计${formatMins(c.minsToArrival, 'zh')}后抵达${c.arrivalAirport}。` : ''}机组人员正在努力补回时间。`,
    airborne_landing_soon: (c) =>
      `🛬 快到了！航班 ${c.flightNumber} 约${formatMins(c.minsToArrival, 'zh')}后在${c.arrivalAirport}降落。请收好行李，调直座椅！`,
    scheduled_far: (c) =>
      `🕐 您的航班 ${c.flightNumber} 从${c.departureAirport}飞往${c.arrivalAirport}已确认。还有${formatMins(c.minsToDep, 'zh')}出发，可以先休息。`,
    scheduled_soon: (c) =>
      `⏰ 该前往机场了！航班 ${c.flightNumber} 约${formatMins(c.minsToDep, 'zh')}后起飞。请办理值机并前往${c.gate ? `${c.gate}号登机口` : '登机口'}。`,
    boarding: (c) =>
      `🚨 正在登机！航班 ${c.flightNumber} 正在${c.gate ? `${c.gate}号登机口` : ''}登机。请立即前往，不要错过！`,
    landed: (c) =>
      `🎉 已着陆！航班 ${c.flightNumber} 已抵达${c.arrivalAirport}。${c.delay > 0 ? `延误了${c.delay}分钟。` : '准时到达！'}欢迎！`,
    delayed_ground: (c) =>
      `⏳ 注意——航班 ${c.flightNumber} 延误 ${c.delay} 分钟。${c.delay < 60 ? '时间不长，喝杯咖啡待在登机口附近。' : c.delay < 120 ? '有一些时间，可以逛逛机场，稍后回来。' : '延误较长，请到航空公司服务台了解您的选择。'}`,
    cancelled: (c) =>
      `❌ 非常抱歉——航班 ${c.flightNumber} 已取消。请立即前往 ${c.airline} 服务台或致电航空公司重新预订。航空公司有义务为您提供帮助。`,
    diverted: (c) =>
      `⚡ 您的航班 ${c.flightNumber} 已改飞其他机场。请遵循机组人员指示。`,
    unknown: (c) => `航班 ${c.flightNumber} 状态正在更新，请稍后再查。`,
  },

  hi: {
    airborne_ontime: (c) =>
      `✈️ बढ़िया खबर! आपकी फ्लाइट ${c.flightNumber} ${c.altitudeFt ? `${Math.round(c.altitudeFt * 0.3048).toLocaleString()} मीटर` : ''} की ऊंचाई पर उड़ रही है और समय पर है। ${c.minsToArrival > 0 ? `आप लगभग ${formatMins(c.minsToArrival, 'hi')} में ${c.arrivalAirport} पहुंचेंगे।` : ''} बैठिए और सफर का आनंद लीजिए!`,
    airborne_delayed: (c) =>
      `⚠️ आपकी फ्लाइट ${c.flightNumber} हवा में है लेकिन ${c.delay} मिनट की देरी से चल रही है। ${c.minsToArrival > 0 ? `अब आप लगभग ${formatMins(c.minsToArrival, 'hi')} में ${c.arrivalAirport} पहुंचेंगे।` : ''} क्रू समय बचाने की कोशिश कर रहा है।`,
    airborne_landing_soon: (c) =>
      `🛬 लगभग पहुंच गए! आपकी फ्लाइट ${c.flightNumber} लगभग ${formatMins(c.minsToArrival, 'hi')} में ${c.arrivalAirport} उतरेगी। अपना सामान समेटना शुरू कर दें।`,
    scheduled_far: (c) =>
      `🕐 आपकी फ्लाइट ${c.flightNumber} ${c.departureAirport} से ${c.arrivalAirport} के लिए कन्फर्म है। ${formatMins(c.minsToDep, 'hi')} में रवानगी होगी। आराम करें।`,
    scheduled_soon: (c) =>
      `⏰ एयरपोर्ट के लिए निकलने का समय! आपकी फ्लाइट ${c.flightNumber} ${formatMins(c.minsToDep, 'hi')} में उड़ेगी। ${c.gate ? `गेट ${c.gate}` : 'गेट'} पर जाएं।`,
    boarding: (c) =>
      `🚨 बोर्डिंग शुरू! फ्लाइट ${c.flightNumber}${c.gate ? ` गेट ${c.gate} पर` : ''} बोर्डिंग हो रही है। तुरंत पहुंचें!`,
    landed: (c) =>
      `🎉 लैंड हो गए! फ्लाइट ${c.flightNumber} ${c.arrivalAirport} पर पहुंच गई। ${c.delay > 0 ? `${c.delay} मिनट की देरी हुई।` : 'समय पर!'} स्वागत है!`,
    delayed_ground: (c) =>
      `⏳ सूचना — आपकी फ्लाइट ${c.flightNumber} में ${c.delay} मिनट की देरी है। ${c.delay < 60 ? 'ज्यादा नहीं — कॉफी पियें और गेट के पास रहें।' : c.delay < 120 ? 'थोड़ा समय है — एयरपोर्ट घूमें।' : 'लंबी देरी है। एयरलाइन काउंटर पर जाएं।'}`,
    cancelled: (c) =>
      `❌ बहुत खेद है — फ्लाइट ${c.flightNumber} रद्द हो गई है। ${c.airline} सर्विस डेस्क पर जाएं या एयरलाइन को कॉल करें। वे आपकी मदद करने के लिए बाध्य हैं।`,
    diverted: (c) =>
      `⚡ आपकी फ्लाइट ${c.flightNumber} को दूसरे एयरपोर्ट पर मोड़ा गया है। क्रू के निर्देशों का पालन करें।`,
    unknown: (c) => `फ्लाइट ${c.flightNumber} की स्थिति अपडेट हो रही है। थोड़ी देर बाद जांचें।`,
  },

  pt: {
    airborne_ontime: (c) =>
      `✈️ Ótimas notícias! Seu voo ${c.flightNumber} está voando${c.altitudeFt ? ` a ${Math.round(c.altitudeFt * 0.3048).toLocaleString()} metros de altitude` : ''} e tudo está no horário. ${c.minsToArrival > 0 ? `Você deve pousar em ${c.arrivalAirport} em cerca de ${formatMins(c.minsToArrival, 'pt')}.` : ''} Relaxe e aproveite o voo!`,
    airborne_delayed: (c) =>
      `⚠️ Seu voo ${c.flightNumber} está em voo, mas com ${c.delay} minutos de atraso. ${c.minsToArrival > 0 ? `Previsão de chegada em ${c.arrivalAirport} em ${formatMins(c.minsToArrival, 'pt')}.` : ''} A tripulação faz o possível para recuperar o tempo.`,
    airborne_landing_soon: (c) =>
      `🛬 Quase lá! O voo ${c.flightNumber} pousa em ${c.arrivalAirport} em cerca de ${formatMins(c.minsToArrival, 'pt')}. Hora de guardar suas coisas e endireitar o assento!`,
    scheduled_far: (c) =>
      `🕐 Seu voo ${c.flightNumber} de ${c.departureAirport} para ${c.arrivalAirport} está confirmado. A partida é em ${formatMins(c.minsToDep, 'pt')}. Aproveite para relaxar.`,
    scheduled_soon: (c) =>
      `⏰ Hora de ir para o aeroporto! Seu voo ${c.flightNumber} parte em ${formatMins(c.minsToDep, 'pt')}. Faça o check-in e vá para ${c.gate ? `o Portão ${c.gate}` : 'seu portão'}.`,
    boarding: (c) =>
      `🚨 Embarcando agora! O voo ${c.flightNumber} está embarcando${c.gate ? ` no Portão ${c.gate}` : ''}. Vá imediatamente — não perca!`,
    landed: (c) =>
      `🎉 Pousou! O voo ${c.flightNumber} chegou em ${c.arrivalAirport}. ${c.delay > 0 ? `Com ${c.delay} minutos de atraso.` : 'Pontual!'} Bem-vindo(a)!`,
    delayed_ground: (c) =>
      `⏳ Atenção — seu voo ${c.flightNumber} está atrasado ${c.delay} minutos. ${c.delay < 60 ? 'Tome um café e fique perto do portão.' : c.delay < 120 ? 'Você tem um tempo. Explore o aeroporto.' : 'Atraso significativo. Consulte o balcão da companhia para suas opções.'}`,
    cancelled: (c) =>
      `❌ Lamentamos muito — o voo ${c.flightNumber} foi cancelado. Vá ao balcão da ${c.airline} ou ligue para a companhia. Eles são obrigados a ajudá-lo(a).`,
    diverted: (c) =>
      `⚡ Seu voo ${c.flightNumber} foi desviado para outro aeroporto. Siga as instruções da tripulação.`,
    unknown: (c) => `O status do voo ${c.flightNumber} está sendo atualizado.`,
  },

  de: {
    airborne_ontime: (c) =>
      `✈️ Gute Nachrichten! Ihr Flug ${c.flightNumber} cruist${c.altitudeFt ? ` in ${Math.round(c.altitudeFt * 0.3048).toLocaleString()} Metern Höhe` : ''} und ist pünktlich. ${c.minsToArrival > 0 ? `Sie landen in ca. ${formatMins(c.minsToArrival, 'de')} in ${c.arrivalAirport}.` : ''} Entspannen Sie sich und genießen Sie den Flug!`,
    airborne_delayed: (c) =>
      `⚠️ Ihr Flug ${c.flightNumber} ist unterwegs, hat aber ${c.delay} Minuten Verspätung. ${c.minsToArrival > 0 ? `Ankunft in ${c.arrivalAirport} in ca. ${formatMins(c.minsToArrival, 'de')}.` : ''} Die Crew gibt ihr Bestes.`,
    airborne_landing_soon: (c) =>
      `🛬 Fast am Ziel! Flug ${c.flightNumber} landet in etwa ${formatMins(c.minsToArrival, 'de')} in ${c.arrivalAirport}. Zeit, Ihre Sachen zu packen!`,
    scheduled_far: (c) =>
      `🕐 Ihr Flug ${c.flightNumber} von ${c.departureAirport} nach ${c.arrivalAirport} ist bestätigt. Abflug in ${formatMins(c.minsToDep, 'de')}. Sie haben noch Zeit zum Entspannen.`,
    scheduled_soon: (c) =>
      `⏰ Zeit zum Aufbrechen! Flug ${c.flightNumber} startet in ${formatMins(c.minsToDep, 'de')}. Checken Sie ein und gehen Sie zu ${c.gate ? `Gate ${c.gate}` : 'Ihrem Gate'}.`,
    boarding: (c) =>
      `🚨 Boarding läuft! Flug ${c.flightNumber} boardet${c.gate ? ` an Gate ${c.gate}` : ''}. Bitte sofort begeben — nicht verpassen!`,
    landed: (c) =>
      `🎉 Gelandet! Flug ${c.flightNumber} ist in ${c.arrivalAirport} angekommen. ${c.delay > 0 ? `Mit ${c.delay} Minuten Verspätung.` : 'Pünktlich!'} Willkommen!`,
    delayed_ground: (c) =>
      `⏳ Achtung — Flug ${c.flightNumber} hat ${c.delay} Minuten Verspätung. ${c.delay < 60 ? 'Nicht lang — holen Sie einen Kaffee und bleiben Sie in der Nähe des Gates.' : c.delay < 120 ? 'Sie haben etwas Zeit. Erkunden Sie den Flughafen.' : 'Erhebliche Verspätung. Wenden Sie sich an den Airline-Schalter.'}`,
    cancelled: (c) =>
      `❌ Wir bedauern sehr — Flug ${c.flightNumber} wurde storniert. Gehen Sie sofort zum ${c.airline}-Schalter oder rufen Sie an. Airlines sind gesetzlich verpflichtet zu helfen.`,
    diverted: (c) =>
      `⚡ Ihr Flug ${c.flightNumber} wurde auf einen anderen Flughafen umgeleitet. Folgen Sie den Anweisungen der Crew.`,
    unknown: (c) => `Der Status von Flug ${c.flightNumber} wird aktualisiert.`,
  },

  ja: {
    airborne_ontime: (c) =>
      `✈️ 良いお知らせです！${c.flightNumber}便は${c.altitudeFt ? `${Math.round(c.altitudeFt * 0.3048).toLocaleString()}メートル` : ''}の高さを順調に飛行中で、定刻通りです。${c.minsToArrival > 0 ? `約${formatMins(c.minsToArrival, 'ja')}後に${c.arrivalAirport}に到着予定です。` : ''}ごゆっくりお楽しみください！`,
    airborne_delayed: (c) =>
      `⚠️ ${c.flightNumber}便は飛行中ですが、${c.delay}分遅れています。${c.minsToArrival > 0 ? `${c.arrivalAirport}には約${formatMins(c.minsToArrival, 'ja')}後に到着予定です。` : ''}乗務員が挽回に努めています。`,
    airborne_landing_soon: (c) =>
      `🛬 もうすぐ到着です！${c.flightNumber}便は約${formatMins(c.minsToArrival, 'ja')}後に${c.arrivalAirport}に着陸します。お荷物をまとめてください。`,
    scheduled_far: (c) =>
      `🕐 ${c.flightNumber}便（${c.departureAirport}→${c.arrivalAirport}）は確定しています。出発まで${formatMins(c.minsToDep, 'ja')}あります。ゆっくりお過ごしください。`,
    scheduled_soon: (c) =>
      `⏰ 空港へ向かう時間です！${c.flightNumber}便は${formatMins(c.minsToDep, 'ja')}後に出発します。${c.gate ? `${c.gate}番ゲート` : 'ゲート'}へお向かいください。`,
    boarding: (c) =>
      `🚨 搭乗開始！${c.flightNumber}便が${c.gate ? `${c.gate}番ゲートで` : ''}搭乗中です。今すぐお向かいください！`,
    landed: (c) =>
      `🎉 到着しました！${c.flightNumber}便が${c.arrivalAirport}に着陸しました。${c.delay > 0 ? `${c.delay}分遅れました。` : '定刻通りです！'}ようこそ！`,
    delayed_ground: (c) =>
      `⏳ お知らせ — ${c.flightNumber}便は${c.delay}分遅延しています。${c.delay < 60 ? 'ゲート付近でお待ちください。' : c.delay < 120 ? '少し時間があります。空港内をお楽しみください。' : '大幅な遅延です。航空会社のカウンターでご確認ください。'}`,
    cancelled: (c) =>
      `❌ 大変申し訳ございません — ${c.flightNumber}便は欠航となりました。すぐに${c.airline}のカウンターへお越しいただくか、お電話ください。`,
    diverted: (c) =>
      `⚡ ${c.flightNumber}便は別の空港に変更になりました。乗務員の指示に従ってください。`,
    unknown: (c) => `${c.flightNumber}便の状況を更新中です。`,
  },

  ko: {
    airborne_ontime: (c) =>
      `✈️ 좋은 소식이에요! ${c.flightNumber}편이 ${c.altitudeFt ? `${Math.round(c.altitudeFt * 0.3048).toLocaleString()}미터` : '순항 고도'}에서 정시 운항 중입니다. ${c.minsToArrival > 0 ? `약 ${formatMins(c.minsToArrival, 'ko')} 후 ${c.arrivalAirport}에 도착 예정입니다.` : ''} 편안하게 즐기세요!`,
    airborne_delayed: (c) =>
      `⚠️ ${c.flightNumber}편이 비행 중이나 ${c.delay}분 지연되고 있습니다. ${c.minsToArrival > 0 ? `${c.arrivalAirport} 도착 예상: ${formatMins(c.minsToArrival, 'ko')} 후.` : ''} 승무원이 최선을 다하고 있습니다.`,
    airborne_landing_soon: (c) =>
      `🛬 거의 다 왔어요! ${c.flightNumber}편이 약 ${formatMins(c.minsToArrival, 'ko')} 후 ${c.arrivalAirport}에 착륙합니다. 짐을 정리해 주세요!`,
    scheduled_far: (c) =>
      `🕐 ${c.flightNumber}편 (${c.departureAirport}→${c.arrivalAirport}) 확정되었습니다. ${formatMins(c.minsToDep, 'ko')} 후 출발 예정입니다. 여유롭게 쉬세요.`,
    scheduled_soon: (c) =>
      `⏰ 공항으로 출발할 시간입니다! ${c.flightNumber}편이 ${formatMins(c.minsToDep, 'ko')} 후 출발합니다. ${c.gate ? `${c.gate}번 탑승구` : '탑승구'}로 이동하세요.`,
    boarding: (c) =>
      `🚨 탑승 중! ${c.flightNumber}편이 ${c.gate ? `${c.gate}번 탑승구에서` : ''} 탑승 중입니다. 즉시 이동하세요!`,
    landed: (c) =>
      `🎉 도착했습니다! ${c.flightNumber}편이 ${c.arrivalAirport}에 착륙했습니다. ${c.delay > 0 ? `${c.delay}분 지연되었습니다.` : '정시 도착!'} 환영합니다!`,
    delayed_ground: (c) =>
      `⏳ 알림 — ${c.flightNumber}편이 ${c.delay}분 지연되었습니다. ${c.delay < 60 ? '탑승구 근처에서 대기하세요.' : c.delay < 120 ? '시간이 있으니 공항을 둘러보세요.' : '지연이 큽니다. 항공사 카운터에서 확인하세요.'}`,
    cancelled: (c) =>
      `❌ 죄송합니다 — ${c.flightNumber}편이 취소되었습니다. ${c.airline} 서비스 데스크로 즉시 가거나 항공사에 연락하세요.`,
    diverted: (c) =>
      `⚡ ${c.flightNumber}편이 다른 공항으로 변경되었습니다. 승무원 안내를 따라주세요.`,
    unknown: (c) => `${c.flightNumber}편 상태를 업데이트 중입니다.`,
  },

  tr: {
    airborne_ontime: (c) =>
      `✈️ Harika haber! ${c.flightNumber} sefer sayılı uçuşunuz zamanında seyahat ediyor. ${c.minsToArrival > 0 ? `${c.arrivalAirport}'a yaklaşık ${formatMins(c.minsToArrival, 'tr')} içinde ineceksiniz.` : ''} Keyfini çıkarın!`,
    airborne_delayed: (c) =>
      `⚠️ ${c.flightNumber} uçuşunuz havada ancak ${c.delay} dakika gecikmeli. ${c.minsToArrival > 0 ? `${c.arrivalAirport}'a tahmini varış: ${formatMins(c.minsToArrival, 'tr')} sonra.` : ''}`,
    airborne_landing_soon: (c) =>
      `🛬 Neredeyse geldik! ${c.flightNumber} uçuşunuz yaklaşık ${formatMins(c.minsToArrival, 'tr')} içinde ${c.arrivalAirport}'a inecek.`,
    scheduled_far: (c) =>
      `🕐 ${c.flightNumber} uçuşunuz onaylandı. Kalkış ${formatMins(c.minsToDep, 'tr')} sonra.`,
    scheduled_soon: (c) =>
      `⏰ Havalimanına gitme vakti! ${c.flightNumber} uçuşunuz ${formatMins(c.minsToDep, 'tr')} sonra kalkıyor. ${c.gate ? `${c.gate} numaralı kapıya` : 'kapınıza'} gidin.`,
    boarding: (c) =>
      `🚨 Biniş başladı! ${c.flightNumber}${c.gate ? ` ${c.gate}. kapıda` : ''} biniyor. Hemen gidin!`,
    landed: (c) =>
      `🎉 İndik! ${c.flightNumber} ${c.arrivalAirport}'a indi. ${c.delay > 0 ? `${c.delay} dakika gecikme ile.` : 'Zamanında!'} Hoş geldiniz!`,
    delayed_ground: (c) =>
      `⏳ Dikkat — ${c.flightNumber} uçuşunuz ${c.delay} dakika gecikiyor. ${c.delay < 60 ? 'Kapı yakınında bekleyin.' : 'Havalimanını keşfedin.'}`,
    cancelled: (c) =>
      `❌ Üzgünüz — ${c.flightNumber} uçuşu iptal edildi. ${c.airline} servis masasına gidin.`,
    diverted: (c) =>
      `⚡ ${c.flightNumber} uçuşunuz başka bir havalimanına yönlendirildi. Ekibin talimatlarını takip edin.`,
    unknown: (c) => `${c.flightNumber} durumu güncelleniyor.`,
  },

  ru: {
    airborne_ontime: (c) =>
      `✈️ Отличные новости! Рейс ${c.flightNumber} летит по расписанию. ${c.minsToArrival > 0 ? `Ожидаемое прибытие в ${c.arrivalAirport} через ${formatMins(c.minsToArrival, 'ru')}.` : ''} Приятного полёта!`,
    airborne_delayed: (c) =>
      `⚠️ Рейс ${c.flightNumber} в воздухе, но задерживается на ${c.delay} минут. ${c.minsToArrival > 0 ? `Прибытие в ${c.arrivalAirport} примерно через ${formatMins(c.minsToArrival, 'ru')}.` : ''}`,
    airborne_landing_soon: (c) =>
      `🛬 Скоро посадка! Рейс ${c.flightNumber} приземлится в ${c.arrivalAirport} через ${formatMins(c.minsToArrival, 'ru')}. Приготовьтесь!`,
    scheduled_far: (c) =>
      `🕐 Рейс ${c.flightNumber} из ${c.departureAirport} в ${c.arrivalAirport} подтверждён. Вылет через ${formatMins(c.minsToDep, 'ru')}.`,
    scheduled_soon: (c) =>
      `⏰ Пора в аэропорт! Рейс ${c.flightNumber} вылетает через ${formatMins(c.minsToDep, 'ru')}. Идите на ${c.gate ? `выход ${c.gate}` : 'ваш выход'}.`,
    boarding: (c) =>
      `🚨 Посадка! Рейс ${c.flightNumber} посадка${c.gate ? ` на выходе ${c.gate}` : ''}. Идите немедленно!`,
    landed: (c) =>
      `🎉 Приземлились! Рейс ${c.flightNumber} прибыл в ${c.arrivalAirport}. ${c.delay > 0 ? `Задержка ${c.delay} мин.` : 'Вовремя!'} Добро пожаловать!`,
    delayed_ground: (c) =>
      `⏳ Внимание — рейс ${c.flightNumber} задержан на ${c.delay} минут. ${c.delay < 60 ? 'Оставайтесь у выхода.' : 'Можно прогуляться по аэропорту.'}`,
    cancelled: (c) =>
      `❌ Очень сожалеем — рейс ${c.flightNumber} отменён. Обратитесь на стойку ${c.airline}.`,
    diverted: (c) =>
      `⚡ Рейс ${c.flightNumber} перенаправлен в другой аэропорт. Следуйте указаниям экипажа.`,
    unknown: (c) => `Статус рейса ${c.flightNumber} обновляется.`,
  },
};

// ─── UI label translations ────────────────────────────────────────────────────
export const UI = {
  en: { searchPlaceholder: 'Flight number (e.g. EK203) or booking code…', track: 'Track', searching: 'Searching…', airportNav: 'Airport Navigation', standbyRoutes: 'Standby / Alternate Routes', languageLabel: 'Language', noNavData: 'Detailed navigation not available for this airport yet.', step: 'Step', lookForSign: 'Look for this sign:', landmark: 'Landmark:', direction: { straight: 'Go straight ahead', left: 'Turn left', right: 'Turn right', up: 'Take escalator / stairs up', down: 'Take escalator / stairs down', train: 'Board the train / shuttle', follow: 'Follow the signs' }, standbyTitle: 'Your flight is delayed — here are alternate ways to reach your destination', altRoutesTitle: 'Explore other flight options for this route', noAlternates: 'No alternate routes found. Please check with the airline desk.', seatAvail: { low: 'Almost full', med: 'Limited seats', high: 'Seats available' }, flightType: { direct: 'Direct', connecting: 'Connecting via' } },
  es: { searchPlaceholder: 'Número de vuelo (ej. EK203) o código de reserva…', track: 'Rastrear', searching: 'Buscando…', airportNav: 'Navegación por el aeropuerto', standbyRoutes: 'Rutas alternativas / standby', languageLabel: 'Idioma', noNavData: 'Navegación detallada no disponible para este aeropuerto aún.', step: 'Paso', lookForSign: 'Busca este cartel:', landmark: 'Punto de referencia:', direction: { straight: 'Sigue recto', left: 'Gira a la izquierda', right: 'Gira a la derecha', up: 'Sube por la escalera mecánica', down: 'Baja por la escalera mecánica', train: 'Toma el tren / lanzadera', follow: 'Sigue los carteles' }, standbyTitle: 'Tu vuelo está retrasado — aquí hay rutas alternativas', altRoutesTitle: 'Explora otras opciones de vuelo para esta ruta', noAlternates: 'No se encontraron rutas alternativas. Consulta en el mostrador de la aerolínea.', seatAvail: { low: 'Casi lleno', med: 'Asientos limitados', high: 'Asientos disponibles' }, flightType: { direct: 'Directo', connecting: 'Con escala en' } },
  fr: { searchPlaceholder: 'Numéro de vol (ex. EK203) ou code de réservation…', track: 'Suivre', searching: 'Recherche…', airportNav: "Navigation à l'aéroport", standbyRoutes: 'Vols alternatifs / standby', languageLabel: 'Langue', noNavData: 'Navigation détaillée non disponible pour cet aéroport.', step: 'Étape', lookForSign: 'Cherchez ce panneau :', landmark: 'Repère :', direction: { straight: 'Allez tout droit', left: 'Tournez à gauche', right: 'Tournez à droite', up: "Prenez l'escalator montant", down: "Prenez l'escalator descendant", train: 'Prenez la navette / train', follow: 'Suivez les panneaux' }, standbyTitle: 'Votre vol est retardé — voici des alternatives', altRoutesTitle: 'Explorez d\'autres options de vol pour cette route', noAlternates: 'Aucune alternative trouvée. Contactez le comptoir de la compagnie.', seatAvail: { low: 'Presque complet', med: 'Places limitées', high: 'Places disponibles' }, flightType: { direct: 'Direct', connecting: 'Via' } },
  ar: { searchPlaceholder: 'رقم الرحلة (مثل EK203) أو رمز الحجز…', track: 'تتبع', searching: 'جارٍ البحث…', airportNav: 'التنقل في المطار', standbyRoutes: 'رحلات بديلة / قائمة الانتظار', languageLabel: 'اللغة', noNavData: 'التنقل التفصيلي غير متاح لهذا المطار حتى الآن.', step: 'خطوة', lookForSign: 'ابحث عن هذه اللافتة:', landmark: 'معلم بارز:', direction: { straight: 'امشِ مستقيماً', left: 'انعطف يساراً', right: 'انعطف يميناً', up: 'اصعد بالسلم الكهربائي', down: 'انزل بالسلم الكهربائي', train: 'اركب القطار / المكوك', follow: 'اتبع اللافتات' }, standbyTitle: 'رحلتك متأخرة — إليك طرقاً بديلة للوصول إلى وجهتك', altRoutesTitle: 'استعرض خيارات رحلات أخرى لهذا المسار', noAlternates: 'لم يتم العثور على رحلات بديلة. تواصل مع مكتب الخطوط الجوية.', seatAvail: { low: 'شبه ممتلئ', med: 'مقاعد محدودة', high: 'مقاعد متاحة' }, flightType: { direct: 'مباشر', connecting: 'عبر' } },
  zh: { searchPlaceholder: '航班号（如 EK203）或预订代码…', track: '追踪', searching: '搜索中…', airportNav: '机场导航', standbyRoutes: '候补/备选航班', languageLabel: '语言', noNavData: '该机场的详细导航暂不可用。', step: '步骤', lookForSign: '寻找此标志：', landmark: '地标：', direction: { straight: '直走', left: '左转', right: '右转', up: '乘扶梯上楼', down: '乘扶梯下楼', train: '乘坐摆渡车/列车', follow: '跟随指示牌' }, standbyTitle: '您的航班延误——以下是备选路线', altRoutesTitle: '探索此航线的其他航班选择', noAlternates: '未找到备选航班，请联系航空公司柜台。', seatAvail: { low: '几乎满员', med: '座位有限', high: '有座位' }, flightType: { direct: '直飞', connecting: '经由' } },
  hi: { searchPlaceholder: 'फ्लाइट नंबर (जैसे EK203) या बुकिंग कोड…', track: 'ट्रैक करें', searching: 'खोज रहे हैं…', airportNav: 'एयरपोर्ट नेविगेशन', standbyRoutes: 'वैकल्पिक मार्ग / स्टैंडबाय', languageLabel: 'भाषा', noNavData: 'इस एयरपोर्ट का विस्तृत नेविगेशन अभी उपलब्ध नहीं है।', step: 'कदम', lookForSign: 'यह साइन खोजें:', landmark: 'लैंडमार्क:', direction: { straight: 'सीधे आगे जाएं', left: 'बाईं ओर मुड़ें', right: 'दाईं ओर मुड़ें', up: 'एस्केलेटर से ऊपर जाएं', down: 'एस्केलेटर से नीचे जाएं', train: 'ट्रेन / शटल लें', follow: 'साइन बोर्ड का पालन करें' }, standbyTitle: 'आपकी फ्लाइट देर से है — वैकल्पिक मार्ग', altRoutesTitle: 'इस रूट के लिए अन्य फ्लाइट विकल्प देखें', noAlternates: 'कोई वैकल्पिक उड़ान नहीं मिली। एयरलाइन काउंटर पर जाएं।', seatAvail: { low: 'लगभग भरी', med: 'सीमित सीटें', high: 'सीटें उपलब्ध' }, flightType: { direct: 'डायरेक्ट', connecting: 'होकर' } },
  pt: { searchPlaceholder: 'Número do voo (ex. EK203) ou código de reserva…', track: 'Rastrear', searching: 'Buscando…', airportNav: 'Navegação no aeroporto', standbyRoutes: 'Voos alternativos / lista de espera', languageLabel: 'Idioma', noNavData: 'Navegação detalhada não disponível para este aeroporto.', step: 'Passo', lookForSign: 'Procure este painel:', landmark: 'Ponto de referência:', direction: { straight: 'Siga em frente', left: 'Vire à esquerda', right: 'Vire à direita', up: 'Suba pela escada rolante', down: 'Desça pela escada rolante', train: 'Pegue o trem / shuttle', follow: 'Siga as placas' }, standbyTitle: 'Seu voo está atrasado — aqui estão rotas alternativas', altRoutesTitle: 'Explore outras opções de voo para esta rota', noAlternates: 'Nenhuma alternativa encontrada. Consulte o balcão da companhia.', seatAvail: { low: 'Quase lotado', med: 'Assentos limitados', high: 'Assentos disponíveis' }, flightType: { direct: 'Direto', connecting: 'Via' } },
  de: { searchPlaceholder: 'Flugnummer (z.B. EK203) oder Buchungscode…', track: 'Verfolgen', searching: 'Suche…', airportNav: 'Flughafennavigation', standbyRoutes: 'Alternativflüge / Standby', languageLabel: 'Sprache', noNavData: 'Detaillierte Navigation für diesen Flughafen noch nicht verfügbar.', step: 'Schritt', lookForSign: 'Achten Sie auf dieses Schild:', landmark: 'Orientierungspunkt:', direction: { straight: 'Geradeaus gehen', left: 'Links abbiegen', right: 'Rechts abbiegen', up: 'Rolltreppe hoch', down: 'Rolltreppe runter', train: 'Zug / Shuttle nehmen', follow: 'Den Schildern folgen' }, standbyTitle: 'Ihr Flug ist verspätet — hier sind Alternativen', altRoutesTitle: 'Andere Flugoptionen für diese Strecke erkunden', noAlternates: 'Keine Alternativen gefunden. Wenden Sie sich an den Airline-Schalter.', seatAvail: { low: 'Fast ausgebucht', med: 'Begrenzte Plätze', high: 'Plätze verfügbar' }, flightType: { direct: 'Direkt', connecting: 'Via' } },
  ja: { searchPlaceholder: '便名（例：EK203）または予約コード…', track: '追跡', searching: '検索中…', airportNav: '空港ナビゲーション', standbyRoutes: '代替便 / スタンバイ', languageLabel: '言語', noNavData: 'この空港の詳細ナビは現在利用できません。', step: 'ステップ', lookForSign: 'このサインを探してください：', landmark: 'ランドマーク：', direction: { straight: 'まっすぐ進む', left: '左折する', right: '右折する', up: 'エスカレーターで上る', down: 'エスカレーターで下りる', train: 'シャトル/電車に乗る', follow: '案内板に従う' }, standbyTitle: 'フライトが遅延しています — 代替ルートはこちら', altRoutesTitle: 'このルートの他のフライトを探す', noAlternates: '代替便は見つかりませんでした。航空会社のカウンターへ。', seatAvail: { low: 'ほぼ満席', med: '残席わずか', high: '空席あり' }, flightType: { direct: '直行', connecting: '経由' } },
  ko: { searchPlaceholder: '항공편명 (예: EK203) 또는 예약 코드…', track: '추적', searching: '검색 중…', airportNav: '공항 내비게이션', standbyRoutes: '대기자 / 대체 항공편', languageLabel: '언어', noNavData: '이 공항의 상세 내비게이션은 아직 제공되지 않습니다.', step: '단계', lookForSign: '이 표지판을 찾으세요:', landmark: '랜드마크:', direction: { straight: '직진', left: '좌회전', right: '우회전', up: '에스컬레이터 위로', down: '에스컬레이터 아래로', train: '셔틀/열차 탑승', follow: '표지판 따라가기' }, standbyTitle: '항공편이 지연되었습니다 — 대체 경로', altRoutesTitle: '이 노선의 다른 항공편 옵션 탐색', noAlternates: '대체 항공편을 찾지 못했습니다. 항공사 카운터에 문의하세요.', seatAvail: { low: '거의 만석', med: '좌석 제한', high: '좌석 있음' }, flightType: { direct: '직항', connecting: '경유' } },
  tr: { searchPlaceholder: 'Uçuş numarası (örn. EK203) veya rezervasyon kodu…', track: 'Takip et', searching: 'Aranıyor…', airportNav: 'Havalimanı Navigasyonu', standbyRoutes: 'Alternatif Uçuşlar / Bekleme Listesi', languageLabel: 'Dil', noNavData: 'Bu havalimanı için ayrıntılı navigasyon henüz mevcut değil.', step: 'Adım', lookForSign: 'Bu tabelayı arayın:', landmark: 'Referans noktası:', direction: { straight: 'Düz gidin', left: 'Sola dönün', right: 'Sağa dönün', up: 'Yürüyen merdivenden çıkın', down: 'Yürüyen merdivenden inin', train: 'Trene / mekiğe binin', follow: 'Tabelaları takip edin' }, standbyTitle: 'Uçuşunuz gecikti — işte alternatif güzergahlar', altRoutesTitle: 'Bu rota için diğer uçuş seçeneklerini keşfedin', noAlternates: 'Alternatif uçuş bulunamadı. Havayolu masasına gidin.', seatAvail: { low: 'Neredeyse dolu', med: 'Sınırlı koltuk', high: 'Koltuk mevcut' }, flightType: { direct: 'Direkt', connecting: 'Aktarmalı' } },
  ru: { searchPlaceholder: 'Номер рейса (напр. EK203) или код бронирования…', track: 'Отследить', searching: 'Поиск…', airportNav: 'Навигация по аэропорту', standbyRoutes: 'Альтернативные рейсы / лист ожидания', languageLabel: 'Язык', noNavData: 'Детальная навигация для этого аэропорта пока недоступна.', step: 'Шаг', lookForSign: 'Ищите этот знак:', landmark: 'Ориентир:', direction: { straight: 'Идите прямо', left: 'Поверните налево', right: 'Поверните направо', up: 'Поднимитесь на эскалаторе', down: 'Спуститесь на эскалаторе', train: 'Сядьте на поезд / шаттл', follow: 'Следуйте указателям' }, standbyTitle: 'Ваш рейс задержан — вот альтернативные маршруты', altRoutesTitle: 'Изучите другие варианты рейсов по этому маршруту', noAlternates: 'Альтернативных рейсов не найдено. Обратитесь на стойку авиакомпании.', seatAvail: { low: 'Почти заполнен', med: 'Мало мест', high: 'Места есть' }, flightType: { direct: 'Прямой', connecting: 'Через' } },
};

export function getUI(lang) {
  return UI[lang] || UI.en;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatMins(mins, lang) {
  if (!mins || mins <= 0) return '';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const templates = {
    en: h > 0 ? `${h}h ${m > 0 ? m + 'm' : ''}` : `${m} minutes`,
    es: h > 0 ? `${h}h ${m > 0 ? m + ' min' : ''}` : `${m} minutos`,
    fr: h > 0 ? `${h}h${m > 0 ? m + 'min' : ''}` : `${m} minutes`,
    ar: h > 0 ? `${h} ساعة${m > 0 ? ' و' + m + ' دقيقة' : ''}` : `${m} دقيقة`,
    zh: h > 0 ? `${h}小时${m > 0 ? m + '分钟' : ''}` : `${m}分钟`,
    hi: h > 0 ? `${h} घंटे${m > 0 ? ' ' + m + ' मिनट' : ''}` : `${m} मिनट`,
    pt: h > 0 ? `${h}h${m > 0 ? m + 'min' : ''}` : `${m} minutos`,
    de: h > 0 ? `${h} Std.${m > 0 ? ' ' + m + ' Min.' : ''}` : `${m} Minuten`,
    ja: h > 0 ? `${h}時間${m > 0 ? m + '分' : ''}` : `${m}分`,
    ko: h > 0 ? `${h}시간${m > 0 ? ' ' + m + '분' : ''}` : `${m}분`,
    tr: h > 0 ? `${h} saat${m > 0 ? ' ' + m + ' dakika' : ''}` : `${m} dakika`,
    ru: h > 0 ? `${h} ч${m > 0 ? ' ' + m + ' мин' : ''}` : `${m} минут`,
  };
  return templates[lang] || templates.en;
}

export function getNaturalMessage(flight, lang = 'en') {
  const msgs = STATUS_MESSAGES[lang] || STATUS_MESSAGES.en;
  const delay = Math.max(flight.departure?.delay || 0, flight.arrival?.delay || 0);
  const scheduled = flight.arrival?.estimated || flight.arrival?.scheduled;
  const depSched = flight.departure?.estimated || flight.departure?.scheduled;

  const minsToArrival = scheduled ? Math.round((new Date(scheduled) - Date.now()) / 60000) : 0;
  const minsToDep = depSched ? Math.round((new Date(depSched) - Date.now()) / 60000) : 0;
  const altitudeFt = flight.position?.altitude ? Math.round(flight.position.altitude * 3.281) : null;
  const speedKts = flight.position?.velocity ? Math.round(flight.position.velocity * 1.944) : null;

  const ctx = {
    flightNumber: flight.flightNumber,
    airline: flight.airline,
    delay,
    minsToArrival: Math.max(0, minsToArrival),
    minsToDep: Math.max(0, minsToDep),
    arrivalAirport: flight.arrival?.airport || flight.arrival?.iata,
    departureAirport: flight.departure?.airport || flight.departure?.iata,
    gate: flight.departure?.gate || flight.arrival?.gate,
    terminal: flight.departure?.terminal,
    altitudeFt,
    speedKts,
  };

  const s = flight.status;
  if (s === 'airborne') {
    if (ctx.minsToArrival > 0 && ctx.minsToArrival <= 45) return msgs.airborne_landing_soon(ctx);
    if (delay > 10) return msgs.airborne_delayed(ctx);
    return msgs.airborne_ontime(ctx);
  }
  if (s === 'scheduled') {
    return ctx.minsToDep <= 90 ? msgs.scheduled_soon(ctx) : msgs.scheduled_far(ctx);
  }
  if (s === 'boarding') return msgs.boarding(ctx);
  if (s === 'landed') return msgs.landed(ctx);
  if (s === 'delayed') return msgs.delayed_ground(ctx);
  if (s === 'cancelled') return msgs.cancelled(ctx);
  if (s === 'diverted') return msgs.diverted(ctx);
  return msgs.unknown(ctx);
}
