import { useState, useEffect } from 'react';
import { Plane, Clock, Users, AlertCircle, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { findAlternateRoutes } from '../services/alternateRoutes.js';
import { getUI, getLangMeta } from '../i18n/index.js';

function formatTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDuration(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m > 0 ? m + 'm' : ''}` : `${m}m`;
}

const AVAIL_CONFIG = {
  low:  { color: 'text-red-600',    bg: 'bg-red-50 border-red-200',    dot: 'bg-red-500' },
  med:  { color: 'text-amber-600',  bg: 'bg-amber-50 border-amber-200',  dot: 'bg-amber-500' },
  high: { color: 'text-green-600',  bg: 'bg-green-50 border-green-200', dot: 'bg-green-500' },
};

function RouteCard({ route, ui, isRTL }) {
  const [expanded, setExpanded] = useState(false);
  const avail = AVAIL_CONFIG[route.availability];

  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 shadow-sm ${route.isAlternateDest ? 'border-purple-200 bg-purple-50' : 'border-orange-100 bg-white/80'}`}>
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full text-left p-4 flex items-center gap-3"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Route type badge */}
        <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold border ${route.isAlternateDest ? 'bg-purple-100 text-purple-700 border-purple-300' : route.type === 'direct' ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-stone-100 text-stone-600 border-stone-300'}`}>
          {route.type === 'direct' ? ui.flightType.direct : route.stops.length > 0 ? `${ui.flightType.connecting} ${route.stops[0]?.iata}` : ui.flightType.direct}
        </span>

        {/* Airline + flight */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-900 font-semibold">{route.flightNumber}</span>
            <span className="text-slate-500 text-sm truncate">{route.airline}</span>
            {route.isAlternateDest && <span className="text-purple-600 text-xs font-medium">Alt. destination</span>}
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-sm text-slate-500">
            <span className="font-mono">{route.departure.iata}</span>
            <ArrowRight size={12} />
            <span className="font-mono">{route.arrival.iata}</span>
            <span>·</span>
            <span>{formatTime(route.departure.time)}</span>
            <span>→</span>
            <span>{formatTime(route.arrival.time)}</span>
          </div>
        </div>

        {/* Availability */}
        <div className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${avail.bg} ${avail.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${avail.dot}`} />
          {ui.seatAvail[route.availability]}
        </div>

        {/* Duration */}
        <div className="shrink-0 text-right">
          <div className="text-slate-900 text-sm font-medium">{formatDuration(route.durationMins)}</div>
          {expanded ? <ChevronUp size={14} className="text-slate-400 ml-auto" /> : <ChevronDown size={14} className="text-slate-400 ml-auto" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-orange-100 p-4 space-y-3 bg-amber-50/50" dir={isRTL ? 'rtl' : 'ltr'}>
          {route.stops.length > 0 && (
            <div className="space-y-2">
              {route.stops.map(stop => (
                <div key={stop.iata} className="bg-white border border-amber-200 rounded-lg p-3 text-sm shadow-sm">
                  <div className="flex items-center gap-2 text-amber-700 font-semibold mb-1">
                    <Clock size={12} />
                    Layover: {stop.iata} ({stop.city}) — {formatDuration(stop.layoverMins)}
                  </div>
                  <div className="text-slate-500 text-xs">
                    Arrive {formatTime(stop.arrivalTime)} → Depart {formatTime(stop.departureTime)} on {stop.connectingFlight} ({stop.connectingAirline})
                  </div>
                </div>
              ))}
            </div>
          )}

          {route.isAlternateDest && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm text-purple-700">
              💡 {route.notes}
            </div>
          )}

          <div className="flex items-center gap-3 text-sm">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${avail.bg} ${avail.color} text-xs font-semibold`}>
              <Users size={12} />
              {ui.seatAvail[route.availability]}
            </div>
            {route.standbyEligible && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 border border-green-300 text-green-700 text-xs font-semibold">
                ✓ Standby eligible — ask at airline desk
              </div>
            )}
          </div>

          {route.notes && !route.isAlternateDest && (
            <p className="text-slate-500 text-xs">{route.notes}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function StandbyPanel({ flight, lang }) {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const ui = getUI(lang);
  const meta = getLangMeta(lang);
  const isRTL = meta.rtl;

  const isActionable = ['delayed', 'cancelled', 'diverted'].includes(flight.status) ||
    (flight.departure?.delay || 0) > 60 || (flight.arrival?.delay || 0) > 60;

  useEffect(() => {
    if (!isActionable) { setLoading(false); return; }
    setTimeout(() => {
      const r = findAlternateRoutes(
        flight.departure?.iata,
        flight.arrival?.iata,
        flight.departure?.scheduled || flight.departure?.estimated
      );
      setRoutes(r);
      setLoading(false);
    }, 600);
  }, [flight.departure?.iata, flight.arrival?.iata, isActionable]);

  if (!isActionable) return null;

  return (
    <div className="space-y-3" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="p-2 bg-amber-100 border border-amber-300 rounded-xl shrink-0">
          <AlertCircle size={18} className="text-amber-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">{ui.standbyRoutes}</h3>
          <p className="text-slate-500 text-xs mt-0.5">{ui.standbyTitle}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 p-4 text-slate-500 text-sm">
          <span className="w-4 h-4 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          Searching alternate routes…
        </div>
      ) : routes.length === 0 ? (
        <p className="text-stone-500 text-sm p-4 bg-amber-50 rounded-xl border border-amber-100">{ui.noAlternates}</p>
      ) : (
        <div className="space-y-2">
          {routes.map(route => (
            <RouteCard key={route.id} route={route} ui={ui} isRTL={isRTL} />
          ))}
          <p className="text-slate-400 text-xs text-center pt-1">
            * Availability is estimated. Confirm with airline for confirmed booking or standby listing.
          </p>
        </div>
      )}
    </div>
  );
}
