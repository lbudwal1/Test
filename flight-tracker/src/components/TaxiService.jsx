import { useState } from 'react';
import { Car, ChevronDown, ChevronUp, Clock, DollarSign, MapPin, Smartphone } from 'lucide-react';

// Per-airport taxi/transport data
const AIRPORT_TAXI_DATA = {
  // North America
  JFK: { city: 'Manhattan', distanceMi: 15, taxiFare: '$52–70', taxiTime: '35–60 min', rideshare: '$45–65', shuttleFare: '$19–25', tip: 'Flat-rate yellow cab to/from Manhattan is $52+tolls. Rideshare pickup is in designated app zones on the lower level.' },
  LAX: { city: 'Downtown LA', distanceMi: 17, taxiFare: '$45–60', taxiTime: '30–60 min', rideshare: '$30–55', shuttleFare: '$16–22', tip: 'Rideshare (Uber/Lyft) pickup is at LAX-it lot — take the free shuttle from baggage claim.' },
  ORD: { city: 'Downtown Chicago', distanceMi: 18, taxiFare: '$40–55', taxiTime: '30–50 min', rideshare: '$30–50', shuttleFare: '$32', tip: 'Blue Line CTA train runs 24/7 for $2.50. Taxi stand is outside baggage claim on the lower level.' },
  DFW: { city: 'Downtown Dallas', distanceMi: 19, taxiFare: '$50–70', taxiTime: '25–40 min', rideshare: '$35–55', shuttleFare: '$20', tip: 'Orange Line train (TEXRail) connects to Fort Worth. Rideshare pickup on lower level, Terminal E.' },
  LHR: { city: 'Central London', distanceMi: 15, taxiFare: '£55–85', taxiTime: '45–75 min', rideshare: '£40–70', shuttleFare: '£25', tip: 'The Heathrow Express train reaches Paddington in 15 min for £25. Black cabs are metered — expect more in peak hours.' },
  CDG: { city: 'Paris Centre', distanceMi: 16, taxiFare: '€53–65', taxiTime: '30–60 min', rideshare: '€45–60', shuttleFare: '€12', tip: 'Fixed-rate taxis: €53 to Right Bank, €58 to Left Bank. RER B train runs every 10–15 min for €11.80.' },
  DXB: { city: 'Dubai Downtown', distanceMi: 9, taxiFare: 'AED 50–90', taxiTime: '20–40 min', rideshare: 'AED 45–80', shuttleFare: 'AED 5', tip: 'Dubai Metro Red Line connects directly to the airport. Taxis are metered and widely available curbside.' },
  SIN: { city: 'Marina Bay', distanceMi: 12, taxiFare: 'S$20–40', taxiTime: '25–40 min', rideshare: 'S$18–35', shuttleFare: 'S$9', tip: 'MRT train is the cheapest option at S$2.50. Peak hour surcharges apply to taxis (50% extra 6–9 AM / 6–12 PM).' },
  NRT: { city: 'Tokyo', distanceMi: 37, taxiFare: '¥20,000–30,000', taxiTime: '60–90 min', rideshare: 'N/A', shuttleFare: '¥3,000', tip: 'Narita Express (N\'EX) train recommended at ¥3,070. Rideshare apps have limited availability in Japan. Taxis are very expensive.' },
  SYD: { city: 'Sydney CBD', distanceMi: 6, taxiFare: 'A$45–55', taxiTime: '20–35 min', rideshare: 'A$35–50', shuttleFare: 'A$19', tip: 'Train (T8 Airport line) reaches Central in 13 min for A$19 — cheapest option. Taxis from Domestic T2/T3 have lower fares.' },
  YYZ: { city: 'Downtown Toronto', distanceMi: 16, taxiFare: 'C$55–75', taxiTime: '30–60 min', rideshare: 'C$35–55', shuttleFare: 'C$12.35', tip: 'UP Express train reaches Union Station in 25 min for C$12.35. Rideshare pickup is on Level 1 of the Parking Garage.' },
  GRU: { city: 'São Paulo Centre', distanceMi: 17, taxiFare: 'R$90–130', taxiTime: '40–80 min', rideshare: 'R$60–100', shuttleFare: 'R$45', tip: 'CPTM Line 13 Jade train runs to Luz for R$4.30. Prefer radio taxis booked inside the terminal over street hailing.' },
  MEX: { city: 'Mexico City Centre', distanceMi: 8, taxiFare: 'MX$300–400', taxiTime: '20–45 min', rideshare: 'MX$200–350', shuttleFare: 'MX$80', tip: 'Use authorised taxi booths inside the airport — never accept rides from touts. Metro Line 5 is very cheap at MX$5.' },
  ATL: { city: 'Downtown Atlanta', distanceMi: 10, taxiFare: '$30–45', taxiTime: '20–35 min', rideshare: '$22–38', shuttleFare: '$2.50', tip: 'MARTA Gold/Red lines connect directly for $2.50. Rideshare pickup is at the Ground Transportation Center.' },
  MIA: { city: 'Downtown Miami', distanceMi: 7, taxiFare: '$28–40', taxiTime: '15–30 min', rideshare: '$22–35', shuttleFare: '$2.65', tip: 'MIA Mover connects free to Rental Car Center and Metrorail. Metered taxis queue at curbside arrivals.' },
  BOS: { city: 'Downtown Boston', distanceMi: 3, taxiFare: '$25–40', taxiTime: '15–30 min', rideshare: '$20–35', shuttleFare: '$2.40', tip: 'Silver Line SL1 bus is free from Terminal E (international). Short cab ride — request metered fare.' },
  // Europe
  AMS: { city: 'Amsterdam Centre', distanceMi: 11, taxiFare: '€40–55', taxiTime: '25–40 min', rideshare: '€35–50', shuttleFare: '€4.40', tip: 'Direct train to Amsterdam Centraal every 10 min for €4.40 — fastest option. Taxis from stand outside Arrivals 2/3.' },
  FRA: { city: 'Frankfurt Centre', distanceMi: 7, taxiFare: '€25–40', taxiTime: '20–35 min', rideshare: '€22–38', shuttleFare: '€4.90', tip: 'S-Bahn S8/S9 reaches Frankfurt Hbf in 11 min for €4.90. Taxi stand is directly outside Terminal 1.' },
  MAD: { city: 'Madrid Centre', distanceMi: 9, taxiFare: '€30–40', taxiTime: '20–35 min', rideshare: '€25–38', shuttleFare: '€5', tip: 'Fixed taxi fare to/from the city centre is €30. Metro Line 8 costs €5 (includes airport supplement).' },
  // Middle East / Asia
  DOH: { city: 'Doha City', distanceMi: 23, taxiFare: 'QR 100–150', taxiTime: '25–40 min', rideshare: 'QR 80–130', shuttleFare: 'QR 10', tip: 'Karwa taxis are metered and reliable. Uber is available. Doha Metro Gold Line connects to several city stops for QR3.' },
  ICN: { city: 'Seoul', distanceMi: 31, taxiFare: '₩65,000–85,000', taxiTime: '60–90 min', rideshare: '₩55,000–75,000', shuttleFare: '₩17,000', tip: 'AREX Express train reaches Seoul Station in 43 min for ₩9,500. Deluxe (black) taxis are metered at premium rates.' },
  BKK: { city: 'Bangkok Centre', distanceMi: 18, taxiFare: '฿350–500', taxiTime: '35–60 min', rideshare: '฿300–450', shuttleFare: '฿45', tip: 'Suvarnabhumi Airport Rail Link takes 30 min to Phaya Thai for ฿45. Metered taxis add ฿50 airport surcharge.' },
  DEL: { city: 'New Delhi', distanceMi: 10, taxiFare: '₹400–600', taxiTime: '30–50 min', rideshare: '₹300–500', shuttleFare: '₹60', tip: 'Delhi Metro Yellow Line connects T3 directly for ₹60. Use pre-paid taxi booths in the arrivals hall — avoid tout drivers.' },
};

const DEFAULT_DATA = {
  city: 'City Centre',
  distanceMi: null,
  taxiFare: 'Varies',
  taxiTime: '20–60 min',
  rideshare: 'Check app',
  shuttleFare: 'Varies',
  tip: 'Look for official taxi ranks outside baggage claim. Avoid unlicensed drivers approaching you inside the terminal.',
};

const TRANSPORT_OPTIONS = [
  { key: 'taxi',     icon: '🚕', label: 'Metered Taxi',     fareKey: 'taxiFare',    desc: 'Official rank outside arrivals' },
  { key: 'rideshare',icon: '📱', label: 'Rideshare App',    fareKey: 'rideshare',   desc: 'Uber · Lyft · Bolt · Careem' },
  { key: 'shuttle',  icon: '🚌', label: 'Airport Shuttle',  fareKey: 'shuttleFare', desc: 'Shared bus / rail connection' },
];

export default function TaxiService({ flight }) {
  const [open, setOpen] = useState(false);
  const iata = flight?.arrival?.iata;
  const airport = flight?.arrival?.airport || 'Arrival Airport';
  const data = AIRPORT_TAXI_DATA[iata] || DEFAULT_DATA;

  return (
    <div className="bg-white/80 border border-orange-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Header toggle */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 hover:bg-orange-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 border border-amber-200 rounded-xl shrink-0">
            <Car size={18} className="text-amber-600" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-stone-900 text-sm">Airport Taxi &amp; Transport</p>
            <p className="text-stone-400 text-xs mt-0.5">{iata} · Ground transport from {airport}</p>
          </div>
        </div>
        {open
          ? <ChevronUp size={18} className="text-stone-400 shrink-0" />
          : <ChevronDown size={18} className="text-stone-400 shrink-0" />
        }
      </button>

      {open && (
        <div className="border-t border-orange-100 px-5 py-4 space-y-4">
          {/* Destination info bar */}
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 text-sm text-amber-800">
            <MapPin size={14} className="text-amber-500 shrink-0" />
            <span>To <strong>{data.city}</strong></span>
            {data.distanceMi && (
              <>
                <span className="text-amber-300">·</span>
                <span>{data.distanceMi} mi from terminal</span>
              </>
            )}
            <Clock size={13} className="text-amber-500 shrink-0 ml-auto" />
            <span>{data.taxiTime}</span>
          </div>

          {/* Transport option cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TRANSPORT_OPTIONS.map(opt => (
              <div key={opt.key} className="bg-white border border-orange-100 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{opt.icon}</span>
                  <span className="font-semibold text-stone-800 text-sm">{opt.label}</span>
                </div>
                <p className="text-stone-500 text-xs mb-3">{opt.desc}</p>
                <div className="flex items-center gap-1.5 text-orange-600 font-bold text-sm">
                  <DollarSign size={13} className="shrink-0" />
                  {data[opt.fareKey]}
                </div>
              </div>
            ))}
          </div>

          {/* Local tip */}
          <div className="flex items-start gap-3 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
            <span className="text-lg shrink-0">💡</span>
            <p className="text-stone-700 text-xs leading-relaxed">{data.tip}</p>
          </div>

          {/* Rideshare app quick links */}
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Smartphone size={12} />
              Rideshare Apps
            </p>
            <div className="flex flex-wrap gap-2">
              {['Uber', 'Lyft', 'Bolt', 'Careem', 'Grab'].map(app => (
                <span key={app} className="px-3 py-1 bg-white border border-orange-100 rounded-full text-xs text-stone-600 font-medium shadow-sm">
                  {app}
                </span>
              ))}
            </div>
          </div>

          <p className="text-stone-400 text-xs text-center pt-1">
            * Fares are estimates. Always confirm the rate before boarding.
          </p>

          {/* Uber CTA */}
          <a
            href="https://www.uber.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-3 bg-black hover:bg-neutral-800 transition-colors rounded-2xl px-5 py-4 shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚗</span>
              <div>
                <p className="text-white font-bold text-sm">Book with Uber</p>
                <p className="text-neutral-400 text-xs mt-0.5">Request a ride from {airport}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-white text-black text-xs font-bold px-4 py-2 rounded-xl shrink-0">
              Open Uber →
            </div>
          </a>
        </div>
      )}
    </div>
  );
}
