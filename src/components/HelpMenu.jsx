import { useState } from 'react';
import { HelpCircle, X, Search, Globe, Map, Plane, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

const DEMO_FLIGHTS = [
  { code: 'PD215', route: 'YTZ → YOW', status: 'airborne',   label: 'Porter · Airborne' },
  { code: 'PD101', route: 'YTZ → YUL', status: 'scheduled',  label: 'Porter · Scheduled' },
  { code: 'PD402', route: 'YTZ → EWR', status: 'delayed',    label: 'Porter · Delayed 75 min' },
  { code: 'PD789', route: 'YYZ → YHZ', status: 'boarding',   label: 'Porter · Boarding' },
  { code: 'PD550', route: 'YTZ → BOS', status: 'landed',     label: 'Porter · Landed' },
  { code: 'EK203', route: 'JFK → DXB', status: 'airborne',   label: 'Emirates · Airborne' },
  { code: 'BA249', route: 'LHR → CDG', status: 'boarding',   label: 'British Airways · Boarding' },
  { code: 'AC123', route: 'YYZ → NAS', status: 'delayed',    label: 'Air Canada · Delayed' },
  { code: 'DL404', route: 'ATL → CDG', status: 'cancelled',  label: 'Delta · Cancelled' },
  { code: 'SQ22',  route: 'JFK → SIN', status: 'airborne',   label: 'Singapore Airlines' },
];

const STATUS_COLORS = {
  airborne:  'bg-sky-100 text-sky-700',
  boarding:  'bg-violet-100 text-violet-700',
  delayed:   'bg-amber-100 text-amber-700',
  cancelled: 'bg-rose-100 text-rose-700',
  scheduled: 'bg-slate-100 text-slate-600',
  landed:    'bg-green-100 text-green-700',
};

const FEATURES = [
  { icon: <Search size={16} />, title: 'Flight Search', desc: 'Enter any IATA flight number (e.g. EK203) to get live status, gate, and delay info.' },
  { icon: <Globe size={16} />, title: '12 Languages', desc: 'Status messages and UI are available in English, Spanish, French, Arabic, Chinese, Hindi, Portuguese, German, Japanese, Korean, Turkish, and Russian.' },
  { icon: <Map size={16} />, title: 'Airport Navigation', desc: 'Step-by-step visual guide to navigate terminals — gates, lounges, customs, and more.' },
  { icon: <Plane size={16} />, title: 'Alternative Routes', desc: 'See other flight options for any route — direct, connecting, and nearby destinations.' },
  { icon: <AlertCircle size={16} />, title: 'Standby Panel', desc: 'Delayed or cancelled? The standby panel surfaces rebooking options with seat availability estimates.' },
];

export default function HelpMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-xl bg-white/70 border border-slate-200 hover:bg-white hover:shadow-sm transition-all duration-200 text-slate-500 hover:text-slate-700"
        aria-label="Help"
      >
        <HelpCircle size={18} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

          {/* Panel */}
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-2">
                <HelpCircle size={18} className="text-sky-500" />
                <h2 className="font-semibold text-slate-900">Help & Guide</h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-5 py-4 space-y-6">

              {/* Getting started */}
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Getting Started</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Type any flight number and press <strong>Track</strong>. Works with any airline — shows live status, position map, gate info, alternative routes, and that airline's service links (booking, check-in, baggage, loyalty).
                </p>
              </section>

              {/* Demo flights */}
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Demo Flights to Try</h3>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_FLIGHTS.map(f => (
                    <div key={f.code} className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                      <span className="font-mono font-bold text-slate-800 text-sm w-12 shrink-0">{f.code}</span>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500 truncate">{f.route}</p>
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${STATUS_COLORS[f.status]}`}>{f.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Features */}
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Features</h3>
                <div className="space-y-3">
                  {FEATURES.map(feat => (
                    <div key={feat.title} className="flex gap-3">
                      <div className="p-1.5 bg-sky-50 border border-sky-100 rounded-lg text-sky-600 shrink-0 h-fit">
                        {feat.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{feat.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Status guide */}
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Status Guide</h3>
                <div className="space-y-2">
                  {[
                    { icon: <Plane size={13} />, color: 'text-sky-600 bg-sky-50 border-sky-100',       label: 'Airborne',   desc: 'Flight is currently in the air.' },
                    { icon: <CheckCircle size={13} />, color: 'text-violet-600 bg-violet-50 border-violet-100', label: 'Boarding',   desc: 'Gate is open — head there now.' },
                    { icon: <Clock size={13} />, color: 'text-slate-600 bg-slate-50 border-slate-100',  label: 'Scheduled',  desc: 'On time, departure upcoming.' },
                    { icon: <AlertCircle size={13} />, color: 'text-amber-600 bg-amber-50 border-amber-100',  label: 'Delayed',    desc: 'Departure pushed back. Check standby panel.' },
                    { icon: <XCircle size={13} />, color: 'text-rose-600 bg-rose-50 border-rose-100',    label: 'Cancelled',  desc: 'Flight cancelled. See alternate routes.' },
                    { icon: <CheckCircle size={13} />, color: 'text-green-600 bg-green-50 border-green-100',  label: 'Landed',     desc: 'Flight has arrived at destination.' },
                  ].map(s => (
                    <div key={s.label} className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg border ${s.color} shrink-0`}>{s.icon}</div>
                      <div className="flex items-baseline gap-2 min-w-0">
                        <span className="text-sm font-semibold text-slate-800 shrink-0">{s.label}</span>
                        <span className="text-xs text-slate-500 truncate">{s.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
