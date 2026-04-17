import { useState } from 'react';
import { ExternalLink, Plane, CreditCard, Settings, Package, Star, Radio, ChevronDown, ChevronUp, Globe } from 'lucide-react';
import { AIRLINE_LIST, getAirlineInfo } from '../data/airlinesData.js';

const SERVICE_DEFS = [
  { key: 'book',    icon: <Plane size={17} />,       label: 'Book a Flight',    desc: 'Search fares & book' },
  { key: 'checkIn', icon: <CreditCard size={17} />,  label: 'Check-In',         desc: 'Online check-in' },
  { key: 'manage',  icon: <Settings size={17} />,    label: 'Manage Booking',   desc: 'Change or view trips' },
  { key: 'status',  icon: <Radio size={17} />,       label: 'Flight Status',    desc: 'Live departures & arrivals' },
  { key: 'baggage', icon: <Package size={17} />,     label: 'Baggage',          desc: 'Allowances & fees' },
  { key: 'loyalty', icon: <Star size={17} />,        label: 'Rewards',          desc: 'Points & loyalty' },
];

function ServicesGrid({ airline }) {
  const { services, color, website, name } = airline;
  return (
    <div className="rounded-2xl overflow-hidden shadow-md">
      {/* Airline banner */}
      <div className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: color }}>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Plane size={16} className="text-white" />
            <span className="text-white font-bold text-sm tracking-tight">{name}</span>
          </div>
          <p className="text-white/70 text-xs">{airline.hub} · {airline.region}</p>
        </div>
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-white bg-white/20 hover:bg-white/30 border border-white/30 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
        >
          <Globe size={11} />
          Website
          <ExternalLink size={11} />
        </a>
      </div>

      {/* Service cards */}
      <div className="bg-white border-x border-b border-slate-100 rounded-b-2xl p-3 grid grid-cols-3 gap-2">
        {SERVICE_DEFS.map(({ key, icon, label, desc }) => {
          const href = key === 'loyalty' ? services.loyalty?.url : services[key];
          const displayLabel = key === 'loyalty' ? (services.loyalty?.name || 'Rewards') : label;
          if (!href) return null;
          return (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-slate-200 bg-white hover:shadow-md hover:scale-[1.02] transition-all duration-200 text-center group"
            >
              <span className="text-slate-500 group-hover:text-slate-700 transition-colors">{icon}</span>
              <span className="text-xs font-semibold text-slate-800 leading-tight">{displayLabel}</span>
              <span className="text-[10px] text-slate-400 leading-tight">{desc}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

function AirlineDirectoryCard({ airline, onSearch, isExpanded, onToggle }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
      >
        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: airline.color }} />
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{airline.name}</p>
          <p className="text-xs text-slate-400">{airline.iata} · {airline.hub}</p>
        </div>
        {isExpanded ? <ChevronUp size={14} className="text-slate-400 shrink-0" /> : <ChevronDown size={14} className="text-slate-400 shrink-0" />}
      </button>

      {isExpanded && (
        <div className="border-t border-slate-100 px-4 pb-3">
          {/* Quick service links */}
          <div className="grid grid-cols-3 gap-1.5 mt-3">
            {SERVICE_DEFS.map(({ key, icon, label }) => {
              const href = key === 'loyalty' ? airline.services.loyalty?.url : airline.services[key];
              const displayLabel = key === 'loyalty' ? (airline.services.loyalty?.name || 'Rewards') : label;
              if (!href) return null;
              return (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors"
                >
                  <span className="text-slate-500" style={{ fontSize: 14 }}>{icon}</span>
                  <span className="text-[10px] text-slate-600 font-medium leading-tight text-center">{displayLabel}</span>
                </a>
              );
            })}
          </div>

          {/* Demo flights */}
          {airline.demoFlights.length > 0 && (
            <div className="mt-3">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5">Track a flight</p>
              <div className="flex flex-wrap gap-1.5">
                {airline.demoFlights.map(code => (
                  <button
                    key={code}
                    onClick={() => onSearch(code)}
                    className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg border transition-colors"
                    style={{ color: airline.color, borderColor: airline.color + '40', backgroundColor: airline.color + '10' }}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AirlineHub({ flight, onSearch }) {
  const [expandedIata, setExpandedIata] = useState(null);
  const [filterRegion, setFilterRegion] = useState('All');

  // If a flight is loaded, show that airline's services
  if (flight?.airlineIata) {
    const airline = getAirlineInfo(flight.airlineIata);
    if (airline) {
      return (
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">Airline Services</p>
          <ServicesGrid airline={airline} />
        </div>
      );
    }
  }

  const regions = ['All', ...Array.from(new Set(AIRLINE_LIST.map(a => a.region)))];
  const filtered = filterRegion === 'All' ? AIRLINE_LIST : AIRLINE_LIST.filter(a => a.region === filterRegion);

  return (
    <div className="mb-4 space-y-3">
      {/* Directory header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Airline Services Directory</p>
        <span className="text-xs text-slate-400">{AIRLINE_LIST.length} airlines</span>
      </div>

      {/* Region filter */}
      <div className="flex gap-1.5 flex-wrap">
        {regions.map(r => (
          <button
            key={r}
            onClick={() => setFilterRegion(r)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              filterRegion === r
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Airline cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {filtered.map(airline => (
          <AirlineDirectoryCard
            key={airline.iata}
            airline={airline}
            onSearch={onSearch}
            isExpanded={expandedIata === airline.iata}
            onToggle={() => setExpandedIata(expandedIata === airline.iata ? null : airline.iata)}
          />
        ))}
      </div>
    </div>
  );
}
