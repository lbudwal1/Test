import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom airplane icon that rotates with heading
function createPlaneIcon(heading = 0) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
    <g transform="translate(20,20) rotate(${heading - 90})">
      <path d="M0,-14 L3,-6 L12,-6 L12,-3 L3,-3 L3,5 L7,8 L7,11 L0,9 L-7,11 L-7,8 L-3,5 L-3,-3 L-12,-3 L-12,-6 L-3,-6 Z"
        fill="#f97316" stroke="#431407" stroke-width="1"/>
    </g>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
}

function createAirportIcon(type) {
  const color = type === 'dep' ? '#34d399' : '#f87171';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20">
    <circle cx="10" cy="10" r="8" fill="${color}" stroke="#0f172a" stroke-width="2"/>
    <circle cx="10" cy="10" r="3" fill="#0f172a"/>
  </svg>`;
  return L.divIcon({ html: svg, className: '', iconSize: [20, 20], iconAnchor: [10, 10] });
}

function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 1) {
      const bounds = L.latLngBounds(positions.map(([lat, lng]) => L.latLng(lat, lng)));
      map.fitBounds(bounds, { padding: [60, 60] });
    } else if (positions.length === 1) {
      map.setView(positions[0], 6);
    }
  }, [map, positions]);
  return null;
}

export default function FlightMap({ flight }) {
  const position = flight.position;
  const dep = flight.departure;
  const arr = flight.arrival;

  // Build coordinate set for fitting bounds
  const positions = [];
  if (position?.latitude && position?.longitude) {
    positions.push([position.latitude, position.longitude]);
  }

  const depCoords = getAirportCoords(dep.iata);
  const arrCoords = getAirportCoords(arr.iata);
  if (depCoords) positions.push(depCoords);
  if (arrCoords) positions.push(arrCoords);

  const center = positions[0] || [20, 0];

  const routeLine = [];
  if (depCoords) routeLine.push(depCoords);
  if (position?.latitude && position?.longitude) routeLine.push([position.latitude, position.longitude]);
  if (arrCoords) routeLine.push(arrCoords);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <MapContainer
        center={center}
        zoom={4}
        style={{ height: '100%', width: '100%', background: '#0f172a' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* Route line */}
        {routeLine.length > 1 && (
          <>
            <Polyline
              positions={routeLine}
              pathOptions={{ color: '#334155', weight: 2, dashArray: '6 6', opacity: 0.6 }}
            />
            {position && depCoords && (
              <Polyline
                positions={[depCoords, [position.latitude, position.longitude]]}
                pathOptions={{ color: '#f97316', weight: 2.5, opacity: 0.9 }}
              />
            )}
          </>
        )}

        {/* Departure airport */}
        {depCoords && (
          <Marker position={depCoords} icon={createAirportIcon('dep')}>
            <Popup className="dark-popup">
              <div className="text-slate-900 font-semibold">{dep.iata}</div>
              <div className="text-slate-600 text-xs">{dep.airport}</div>
            </Popup>
          </Marker>
        )}

        {/* Arrival airport */}
        {arrCoords && (
          <Marker position={arrCoords} icon={createAirportIcon('arr')}>
            <Popup>
              <div className="font-semibold">{arr.iata}</div>
              <div className="text-xs text-slate-600">{arr.airport}</div>
            </Popup>
          </Marker>
        )}

        {/* Aircraft position */}
        {position?.latitude && position?.longitude && (
          <Marker
            position={[position.latitude, position.longitude]}
            icon={createPlaneIcon(position.heading || 0)}
          >
            <Popup>
              <div className="font-semibold">{flight.flightNumber}</div>
              <div className="text-xs text-slate-600">
                Alt: {Math.round((position.altitude || 0) * 3.281)} ft<br />
                Speed: {Math.round((position.velocity || 0) * 1.944)} kts<br />
                Heading: {Math.round(position.heading || 0)}°
              </div>
            </Popup>
          </Marker>
        )}

        <FitBounds positions={positions} />
      </MapContainer>

      {/* Map overlay info */}
      {position && !position.onGround && (
        <div className="absolute bottom-4 left-4 bg-orange-900/80 backdrop-blur-sm border border-orange-700/50 rounded-xl px-3 py-2 text-xs text-orange-100 z-[1000]">
          <div className="flex items-center gap-3">
            <span>Alt: <strong className="text-white">{Math.round((position.altitude || 0) * 3.281).toLocaleString()} ft</strong></span>
            <span>·</span>
            <span>Speed: <strong className="text-white">{Math.round((position.velocity || 0) * 1.944)} kts</strong></span>
            <span>·</span>
            <span>Hdg: <strong className="text-white">{Math.round(position.heading || 0)}°</strong></span>
          </div>
        </div>
      )}

      {!position && (
        <div className="absolute inset-0 flex items-center justify-center bg-amber-900/40 backdrop-blur-sm z-[1000]">
          <div className="text-center text-amber-100">
            <div className="text-3xl mb-2">✈</div>
            <div className="text-sm">Live position not available</div>
            <div className="text-xs text-slate-500 mt-1">OpenSky Network may not have data for this flight</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Approximate coordinates for major airports (subset for demo)
const AIRPORT_COORDS = {
  JFK: [40.6413, -73.7781], LAX: [33.9425, -118.4081], ORD: [41.9742, -87.9073],
  DFW: [32.8998, -97.0403], DEN: [39.8561, -104.6737], SFO: [37.6213, -122.379],
  SEA: [47.4502, -122.3088], LAS: [36.0840, -115.1537], MCO: [28.4312, -81.3081],
  EWR: [40.6895, -74.1745], MIA: [25.7959, -80.2870], ATL: [33.6407, -84.4277],
  BOS: [42.3656, -71.0096], IAH: [29.9902, -95.3368], PHX: [33.4373, -112.0078],
  LHR: [51.4700, -0.4543],  CDG: [49.0097, 2.5479],   AMS: [52.3086, 4.7639],
  FRA: [50.0379, 8.5622],   DXB: [25.2532, 55.3657],  SIN: [1.3644, 103.9915],
  HKG: [22.3080, 113.9185], NRT: [35.7720, 140.3929],  ICN: [37.4602, 126.4407],
  SYD: [-33.9399, 151.1753],MEX: [19.4363, -99.0721],  GRU: [-23.4356, -46.4731],
  YYZ: [43.6772, -79.6306], YVR: [49.1967, -123.1815], AUH: [24.4330, 54.6511],
  DOH: [25.2609, 51.6138],  IST: [41.2753, 28.7519],   MAD: [40.4983, -3.5676],
  BCN: [41.2974, 2.0833],   FCO: [41.8003, 12.2389],   MUC: [48.3537, 11.7750],
  ZRH: [47.4647, 8.5492],   VIE: [48.1103, 16.5697],   CPH: [55.6180, 12.6561],
  BKK: [13.6900, 100.7501], KUL: [2.7456, 101.7099],   DEL: [28.5562, 77.1000],
  BOM: [19.0896, 72.8656],  PEK: [40.0801, 116.5846],  PVG: [31.1443, 121.8083],
  LAM: [51.8742, -0.3680],  ORY: [48.7233, 2.3794],
};

function getAirportCoords(iata) {
  return AIRPORT_COORDS[iata] || null;
}
