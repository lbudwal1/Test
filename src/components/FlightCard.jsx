import { Plane, Clock, Building2, Tag, Navigation } from 'lucide-react';
import StatusBadge from './StatusBadge';
import FlightMap from './FlightMap';
import NaturalStatus from './NaturalStatus';
import StandbyPanel from './StandbyPanel';
import AirportNav from './AirportNav/index.jsx';
import TaxiService from './TaxiService';
import { useTheme } from '../theme.js';

function formatTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

function TimeBlock({ label, scheduled, estimated, actual, delay }) {
  const display = actual || estimated || scheduled;
  const isDelayed = delay > 0;
  const isActual = !!actual;

  return (
    <div className="flex flex-col items-center">
      <p className="text-stone-500 text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold tabular-nums ${isDelayed && !isActual ? 'text-orange-600' : 'text-stone-900'}`}>
        {formatTime(display)}
      </p>
      {isDelayed && !isActual && scheduled && (
        <p className="text-stone-400 text-xs line-through">{formatTime(scheduled)}</p>
      )}
      <p className="text-stone-400 text-xs mt-0.5">{formatDate(display)}</p>
    </div>
  );
}

function InfoPill({ icon: Icon, label, value }) {
  const theme = useTheme();
  if (!value) return null;
  return (
    <div className={`flex items-start gap-2.5 bg-white/80 border ${theme.pillBorder} rounded-xl px-4 py-3 shadow-sm transition-colors duration-500`}>
      <Icon size={16} className={`${theme.pillIcon} mt-0.5 shrink-0 transition-colors duration-500`} />
      <div>
        <p className="text-stone-500 text-xs">{label}</p>
        <p className="text-stone-900 text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

export default function FlightCard({ flight, lang, onClear }) {
  const theme = useTheme();
  const progress = calcProgress(flight);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Natural language status */}
      <NaturalStatus flight={flight} lang={lang} />

      {/* Flight header card */}
      <div className={`bg-white/80 border ${theme.cardBorder} rounded-2xl p-5 shadow-sm transition-colors duration-500`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl font-bold text-stone-900 tracking-tight">{flight.flightNumber}</span>
              {flight._isMock && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 border border-amber-300 rounded-full text-xs font-semibold">DEMO</span>
              )}
            </div>
            <p className="text-stone-500 text-sm">{flight.airline}</p>
            <div className="mt-3">
              <StatusBadge status={flight.status} delay={Math.max(flight.departure.delay || 0, flight.arrival.delay || 0)} size="lg" />
            </div>
          </div>
          <button onClick={onClear} className="text-stone-400 hover:text-stone-600 text-sm transition-colors p-1" aria-label="Clear">✕</button>
        </div>

        {/* Route */}
        <div className="mt-6 flex items-center gap-4">
          <div className="flex-1 text-center">
            <p className="text-4xl font-bold text-stone-900 tracking-wider">{flight.departure.iata}</p>
            <p className="text-stone-500 text-sm mt-1 truncate">{flight.departure.airport}</p>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full flex items-center gap-1">
              <div className={`h-px flex-1 ${theme.routeLine} transition-colors duration-500`} />
              <Plane size={18} className={`${theme.planeIcon} transition-colors duration-500`} />
              <div className={`h-px flex-1 ${theme.routeLine} transition-colors duration-500`} />
            </div>
            {progress !== null && (
              <div className={`w-full ${theme.progressBg} rounded-full h-1.5 transition-colors duration-500`}>
                <div className={`h-1.5 rounded-full ${theme.progressFill} transition-all duration-1000`} style={{ width: `${progress}%` }} />
              </div>
            )}
            <p className="text-stone-400 text-xs">{flight.aircraft.model}</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-4xl font-bold text-stone-900 tracking-wider">{flight.arrival.iata}</p>
            <p className="text-stone-500 text-sm mt-1 truncate">{flight.arrival.airport}</p>
          </div>
        </div>

        {/* Times */}
        <div className="mt-6 grid grid-cols-2 gap-8">
          <TimeBlock label="Departure" scheduled={flight.departure.scheduled} estimated={flight.departure.estimated} actual={flight.departure.actual} delay={flight.departure.delay || 0} />
          <TimeBlock label="Arrival" scheduled={flight.arrival.scheduled} estimated={flight.arrival.estimated} actual={flight.arrival.actual} delay={flight.arrival.delay || 0} />
        </div>
      </div>

      {/* Map */}
      <div className={`h-72 rounded-2xl overflow-hidden border ${theme.cardBorder} shadow-sm transition-colors duration-500`}>
        <FlightMap flight={flight} />
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <InfoPill icon={Tag} label="Aircraft" value={flight.aircraft.model || flight.aircraft.iata} />
        <InfoPill icon={Tag} label="Registration" value={flight.aircraft.registration} />
        <InfoPill icon={Navigation} label="Callsign" value={flight.callsign} />
        <InfoPill icon={Building2} label="Dep. Terminal" value={flight.departure.terminal ? `Terminal ${flight.departure.terminal}` : null} />
        <InfoPill icon={Building2} label="Dep. Gate" value={flight.departure.gate ? `Gate ${flight.departure.gate}` : null} />
        <InfoPill icon={Building2} label="Arr. Terminal" value={flight.arrival.terminal ? `Terminal ${flight.arrival.terminal}` : null} />
      </div>

      {/* Airport visual navigation */}
      <AirportNav flight={flight} lang={lang} />

      {/* Taxi & ground transport */}
      <TaxiService flight={flight} />

      {/* Standby alternate routes */}
      <div className={`bg-white/80 border ${theme.cardBorder} rounded-2xl p-5 shadow-sm transition-colors duration-500`}>
        <StandbyPanel flight={flight} lang={lang} />
      </div>

      {flight._isMock && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
          <strong>Demo mode:</strong> Add your API key to <code className="bg-amber-100 px-1 rounded">.env</code> for real flight data.
          Get a free key at <a href="https://aviationstack.com" target="_blank" rel="noreferrer" className="underline">aviationstack.com</a>.
        </div>
      )}
    </div>
  );
}

function calcProgress(flight) {
  const dep = flight.departure.actual || flight.departure.estimated || flight.departure.scheduled;
  const arr = flight.arrival.estimated || flight.arrival.scheduled;
  if (!dep || !arr) return null;
  const depTime = new Date(dep).getTime();
  const arrTime = new Date(arr).getTime();
  const now = Date.now();
  if (now <= depTime) return 0;
  if (now >= arrTime) return 100;
  return Math.round(((now - depTime) / (arrTime - depTime)) * 100);
}
