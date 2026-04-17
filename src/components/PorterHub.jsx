import { ExternalLink, Plane, CreditCard, Settings, Package, Star, Radio } from 'lucide-react';

const BASE = 'https://www.flyporter.com';

const SERVICES = [
  {
    icon: <Plane size={20} />,
    label: 'Book a Flight',
    desc: 'Search fares & book',
    href: `${BASE}/en-ca/book-travel`,
    color: 'bg-blue-600 text-white',
    border: 'border-blue-600',
  },
  {
    icon: <CreditCard size={20} />,
    label: 'Check-In',
    desc: 'Online check-in',
    href: `${BASE}/en-ca/travel-information/check-in`,
    color: 'bg-white text-blue-700',
    border: 'border-blue-200',
  },
  {
    icon: <Settings size={20} />,
    label: 'Manage Booking',
    desc: 'Change or view trips',
    href: `${BASE}/en-ca/login`,
    color: 'bg-white text-blue-700',
    border: 'border-blue-200',
  },
  {
    icon: <Radio size={20} />,
    label: 'Flight Status',
    desc: 'Live departures & arrivals',
    href: `${BASE}/en-ca/travel-information/flight-status`,
    color: 'bg-white text-blue-700',
    border: 'border-blue-200',
  },
  {
    icon: <Package size={20} />,
    label: 'Baggage',
    desc: 'Allowances & fees',
    href: `${BASE}/en-ca/travel-information/baggage`,
    color: 'bg-white text-blue-700',
    border: 'border-blue-200',
  },
  {
    icon: <Star size={20} />,
    label: 'VIPorter',
    desc: 'Rewards & points',
    href: `${BASE}/en-ca/about-porter/viporter`,
    color: 'bg-white text-blue-700',
    border: 'border-blue-200',
  },
];

const PORTER_FLIGHTS = ['PD101', 'PD215', 'PD402', 'PD550', 'PD789'];

export default function PorterHub({ onSearch }) {
  return (
    <div className="space-y-4 mb-6">
      {/* Porter brand banner */}
      <div className="rounded-2xl overflow-hidden shadow-md">
        <div className="bg-blue-600 px-5 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Plane size={18} className="text-white" />
              <span className="text-white font-bold text-base tracking-tight">Porter Airlines</span>
            </div>
            <p className="text-blue-100 text-xs">Fly well. The Porter way.</p>
          </div>
          <a
            href="https://www.flyporter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-white bg-white/20 hover:bg-white/30 border border-white/30 px-3 py-1.5 rounded-lg transition-colors"
          >
            flyporter.com
            <ExternalLink size={12} />
          </a>
        </div>

        {/* Service grid */}
        <div className="bg-white border-x border-b border-blue-100 rounded-b-2xl p-3 grid grid-cols-3 gap-2">
          {SERVICES.map(s => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border ${s.border} ${s.color} hover:shadow-sm hover:scale-[1.02] transition-all duration-200 text-center`}
            >
              {s.icon}
              <span className="text-xs font-semibold leading-tight">{s.label}</span>
              <span className={`text-[10px] leading-tight ${s.color.includes('text-white') ? 'text-blue-100' : 'text-slate-400'}`}>{s.desc}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Porter quick-track strip */}
      <div className="bg-white/80 border border-blue-100 rounded-2xl px-4 py-3 shadow-sm">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Track a Porter flight</p>
        <div className="flex flex-wrap gap-2">
          {PORTER_FLIGHTS.map(code => (
            <button
              key={code}
              onClick={() => onSearch(code)}
              className="font-mono text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1 rounded-lg transition-colors"
            >
              {code}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
