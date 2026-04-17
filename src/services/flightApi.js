// AviationStack: https://aviationstack.com/ — free tier 500 req/month
// OpenSky Network: https://opensky-network.org/ — free, no key needed
const AVIATION_STACK_KEY = import.meta.env.VITE_AVIATIONSTACK_KEY || '';
const AVIATION_BASE = 'https://api.aviationstack.com/v1';

// AeroDataBox is a good alternative with a RapidAPI free tier
const AERODATABOX_KEY = import.meta.env.VITE_AERODATABOX_KEY || '';
const RAPIDAPI_HOST = 'aerodatabox.p.rapidapi.com';

/**
 * Search flight by IATA flight number (e.g. "EK123", "UA456")
 * Uses AviationStack if key present, otherwise falls back to AeroDataBox.
 */
export async function searchByFlightNumber(flightNumber) {
  const normalized = flightNumber.replace(/\s+/g, '').toUpperCase();

  if (AVIATION_STACK_KEY) {
    return fetchAviationStack(normalized);
  }
  if (AERODATABOX_KEY) {
    return fetchAeroDataBox(normalized);
  }
  // Demo/mock mode when no API key is configured
  return getMockFlight(normalized);
}

async function fetchAviationStack(flightNumber) {
  const url = `${AVIATION_BASE}/flights?access_key=${AVIATION_STACK_KEY}&flight_iata=${flightNumber}&limit=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`AviationStack error: ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(json.error.message || 'API error');
  const data = json.data?.[0];
  if (!data) throw new Error('Flight not found');
  return normalizeAviationStack(data);
}

async function fetchAeroDataBox(flightNumber) {
  const today = new Date().toISOString().split('T')[0];
  const url = `https://aerodatabox.p.rapidapi.com/flights/number/${flightNumber}/${today}`;
  const res = await fetch(url, {
    headers: {
      'X-RapidAPI-Key': AERODATABOX_KEY,
      'X-RapidAPI-Host': RAPIDAPI_HOST,
    },
  });
  if (!res.ok) throw new Error(`AeroDataBox error: ${res.status}`);
  const json = await res.json();
  const data = Array.isArray(json) ? json[0] : json;
  if (!data) throw new Error('Flight not found');
  return normalizeAeroDataBox(data);
}

/**
 * Fetch live aircraft position from OpenSky Network (free, no key needed).
 * callsign is the ICAO callsign (usually airline ICAO + flight number).
 */
export async function getLivePosition(icao24OrCallsign) {
  try {
    const query = icao24OrCallsign.length === 6
      ? `icao24=${icao24OrCallsign.toLowerCase()}`
      : `callsign=${icao24OrCallsign.toUpperCase().padEnd(8)}`;
    const res = await fetch(`https://opensky-network.org/api/states/all?${query}`);
    if (!res.ok) return null;
    const json = await res.json();
    const state = json.states?.[0];
    if (!state) return null;
    return {
      icao24: state[0],
      callsign: state[1]?.trim(),
      longitude: state[5],
      latitude: state[6],
      altitude: state[7],       // meters
      velocity: state[9],       // m/s
      heading: state[10],
      onGround: state[8],
    };
  } catch {
    return null;
  }
}

// ─── Normalizers ────────────────────────────────────────────────────────────

function normalizeAviationStack(d) {
  const dep = d.departure || {};
  const arr = d.arrival || {};
  const aircraft = d.aircraft || {};
  const airline = d.airline || {};
  const flight = d.flight || {};

  return {
    flightNumber: flight.iata || flight.icao || '',
    callsign: flight.icao || '',
    airline: airline.name || '',
    airlineIata: airline.iata || '',
    status: mapStatus(d.flight_status),
    rawStatus: d.flight_status,
    aircraft: {
      iata: aircraft.iata || '',
      icao: aircraft.icao || '',
      registration: aircraft.registration || '',
      model: aircraft.iata || 'Unknown',
    },
    departure: {
      airport: dep.airport || '',
      iata: dep.iata || '',
      scheduled: dep.scheduled,
      estimated: dep.estimated,
      actual: dep.actual,
      delay: dep.delay || 0,
      terminal: dep.terminal || '',
      gate: dep.gate || '',
    },
    arrival: {
      airport: arr.airport || '',
      iata: arr.iata || '',
      scheduled: arr.scheduled,
      estimated: arr.estimated,
      actual: arr.actual,
      delay: arr.delay || 0,
      terminal: arr.terminal || '',
      gate: arr.gate || '',
    },
    position: null, // fetched separately from OpenSky
  };
}

function normalizeAeroDataBox(d) {
  const dep = d.departure || {};
  const arr = d.arrival || {};

  return {
    flightNumber: d.number || '',
    callsign: d.callSign || '',
    airline: d.airline?.name || '',
    airlineIata: d.airline?.iata || '',
    status: mapAeroStatus(d.status),
    rawStatus: d.status,
    aircraft: {
      iata: d.aircraft?.model || '',
      icao: '',
      registration: d.aircraft?.reg || '',
      model: d.aircraft?.model || 'Unknown',
    },
    departure: {
      airport: dep.airport?.name || '',
      iata: dep.airport?.iata || '',
      scheduled: dep.scheduledTimeUtc,
      estimated: dep.revisedTimeUtc || dep.scheduledTimeUtc,
      actual: dep.actualTimeUtc,
      delay: dep.delay || 0,
      terminal: dep.terminal || '',
      gate: dep.gate || '',
    },
    arrival: {
      airport: arr.airport?.name || '',
      iata: arr.airport?.iata || '',
      scheduled: arr.scheduledTimeUtc,
      estimated: arr.revisedTimeUtc || arr.scheduledTimeUtc,
      actual: arr.actualTimeUtc,
      delay: arr.delay || 0,
      terminal: arr.terminal || '',
      gate: arr.gate || '',
    },
    position: null,
  };
}

function mapStatus(s) {
  const m = {
    scheduled: 'scheduled',
    active: 'airborne',
    landed: 'landed',
    cancelled: 'cancelled',
    diverted: 'diverted',
    incident: 'incident',
  };
  return m[s] || 'unknown';
}

function mapAeroStatus(s) {
  const m = {
    Unknown: 'unknown',
    Expected: 'scheduled',
    EnRoute: 'airborne',
    CheckIn: 'scheduled',
    Boarding: 'boarding',
    GateClosed: 'boarding',
    Departed: 'airborne',
    Delayed: 'delayed',
    Approaching: 'airborne',
    Landed: 'landed',
    Arrived: 'landed',
    Cancelled: 'cancelled',
    Diverted: 'diverted',
  };
  return m[s] || 'unknown';
}

// ─── Mock data for demo when no API key is configured ───────────────────────

function getMockFlight(flightNumber) {
  const now = new Date();
  const dep = new Date(now.getTime() - 2 * 3600000);
  const arr = new Date(now.getTime() + 1.5 * 3600000);
  const delayedArr = new Date(arr.getTime() + 95 * 60000); // 95 min delay

  // Different scenarios keyed by common demo flight numbers
  const mockFlights = {
    // ── Porter Airlines flights ──────────────────────────────────────────────
    // Airborne: YTZ → YOW
    PD215: {
      flightNumber: 'PD215', callsign: 'POE215',
      airline: 'Porter Airlines', airlineIata: 'PD',
      status: 'airborne', rawStatus: 'active',
      aircraft: { iata: 'E295', icao: 'E295', registration: 'C-GKQB', model: 'Embraer E195-E2' },
      departure: { airport: 'Billy Bishop Toronto City Airport', iata: 'YTZ', scheduled: new Date(now.getTime() - 45 * 60000).toISOString(), estimated: new Date(now.getTime() - 45 * 60000).toISOString(), actual: new Date(now.getTime() - 45 * 60000).toISOString(), delay: 0, terminal: 'Main', gate: '7' },
      arrival: { airport: 'Ottawa Macdonald–Cartier International', iata: 'YOW', scheduled: new Date(now.getTime() + 35 * 60000).toISOString(), estimated: new Date(now.getTime() + 35 * 60000).toISOString(), actual: null, delay: 0, terminal: 'D', gate: 'D12' },
      position: { latitude: 44.1, longitude: -76.5, altitude: 7620, velocity: 220, heading: 55, onGround: false },
    },

    // Scheduled: YTZ → YUL
    PD101: {
      flightNumber: 'PD101', callsign: 'POE101',
      airline: 'Porter Airlines', airlineIata: 'PD',
      status: 'scheduled', rawStatus: 'scheduled',
      aircraft: { iata: 'E295', icao: 'E295', registration: 'C-GKQF', model: 'Embraer E195-E2' },
      departure: { airport: 'Billy Bishop Toronto City Airport', iata: 'YTZ', scheduled: new Date(now.getTime() + 2 * 3600000).toISOString(), estimated: new Date(now.getTime() + 2 * 3600000).toISOString(), actual: null, delay: 0, terminal: 'Main', gate: '3' },
      arrival: { airport: 'Montréal–Trudeau International Airport', iata: 'YUL', scheduled: new Date(now.getTime() + 3.5 * 3600000).toISOString(), estimated: new Date(now.getTime() + 3.5 * 3600000).toISOString(), actual: null, delay: 0, terminal: 'D', gate: 'D31' },
      position: null,
    },

    // Delayed: YTZ → EWR
    PD402: {
      flightNumber: 'PD402', callsign: 'POE402',
      airline: 'Porter Airlines', airlineIata: 'PD',
      status: 'delayed', rawStatus: 'delayed',
      aircraft: { iata: 'E295', icao: 'E295', registration: 'C-GKQM', model: 'Embraer E195-E2' },
      departure: { airport: 'Billy Bishop Toronto City Airport', iata: 'YTZ', scheduled: new Date(now.getTime() + 30 * 60000).toISOString(), estimated: new Date(now.getTime() + 105 * 60000).toISOString(), actual: null, delay: 75, terminal: 'Main', gate: '5' },
      arrival: { airport: 'Newark Liberty International', iata: 'EWR', scheduled: new Date(now.getTime() + 2 * 3600000).toISOString(), estimated: new Date(now.getTime() + 3.25 * 3600000).toISOString(), actual: null, delay: 75, terminal: 'C', gate: 'C74' },
      position: null,
    },

    // Boarding: YYZ → YHZ
    PD789: {
      flightNumber: 'PD789', callsign: 'POE789',
      airline: 'Porter Airlines', airlineIata: 'PD',
      status: 'boarding', rawStatus: 'boarding',
      aircraft: { iata: 'E295', icao: 'E295', registration: 'C-GKQD', model: 'Embraer E195-E2' },
      departure: { airport: 'Toronto Pearson International', iata: 'YYZ', scheduled: new Date(now.getTime() + 25 * 60000).toISOString(), estimated: new Date(now.getTime() + 25 * 60000).toISOString(), actual: null, delay: 0, terminal: '1', gate: 'D15' },
      arrival: { airport: 'Halifax Stanfield International', iata: 'YHZ', scheduled: new Date(now.getTime() + 2.5 * 3600000).toISOString(), estimated: new Date(now.getTime() + 2.5 * 3600000).toISOString(), actual: null, delay: 0, terminal: 'Main', gate: '22' },
      position: null,
    },

    // Landed: YTZ → BOS
    PD550: {
      flightNumber: 'PD550', callsign: 'POE550',
      airline: 'Porter Airlines', airlineIata: 'PD',
      status: 'landed', rawStatus: 'landed',
      aircraft: { iata: 'E295', icao: 'E295', registration: 'C-GKQP', model: 'Embraer E195-E2' },
      departure: { airport: 'Billy Bishop Toronto City Airport', iata: 'YTZ', scheduled: new Date(now.getTime() - 3 * 3600000).toISOString(), estimated: new Date(now.getTime() - 3 * 3600000).toISOString(), actual: new Date(now.getTime() - 3 * 3600000).toISOString(), delay: 0, terminal: 'Main', gate: '9' },
      arrival: { airport: 'Boston Logan International', iata: 'BOS', scheduled: new Date(now.getTime() - 45 * 60000).toISOString(), estimated: new Date(now.getTime() - 45 * 60000).toISOString(), actual: new Date(now.getTime() - 40 * 60000).toISOString(), delay: 0, terminal: 'B', gate: 'B24' },
      position: { latitude: 42.36, longitude: -71.01, altitude: 0, velocity: 0, heading: 0, onGround: true },
    },

    // ── Other airlines ───────────────────────────────────────────────────────
    // Airborne, on time: JFK → LAX
    EK203: {
      flightNumber: 'EK203', callsign: 'EK203',
      airline: 'Emirates', airlineIata: 'EK',
      status: 'airborne', rawStatus: 'active',
      aircraft: { iata: 'A388', icao: 'A388', registration: 'A6-EDC', model: 'Airbus A380-800' },
      departure: { airport: 'John F. Kennedy International', iata: 'JFK', scheduled: dep.toISOString(), estimated: dep.toISOString(), actual: dep.toISOString(), delay: 0, terminal: '4', gate: 'B22' },
      arrival: { airport: 'Dubai International', iata: 'DXB', scheduled: arr.toISOString(), estimated: arr.toISOString(), actual: null, delay: 0, terminal: '3', gate: 'C14' },
      position: { latitude: 48.5, longitude: 25.2, altitude: 11582, velocity: 258, heading: 55, onGround: false },
    },

    // Delayed (standby panel activates): YYZ → NAS
    AC123: {
      flightNumber: 'AC123', callsign: 'AC123',
      airline: 'Air Canada', airlineIata: 'AC',
      status: 'delayed', rawStatus: 'delayed',
      aircraft: { iata: 'B789', icao: 'B789', registration: 'C-FGDT', model: 'Boeing 787-9 Dreamliner' },
      departure: { airport: 'Toronto Pearson International', iata: 'YYZ', scheduled: new Date(now.getTime() + 30 * 60000).toISOString(), estimated: new Date(now.getTime() + 125 * 60000).toISOString(), actual: null, delay: 95, terminal: '1', gate: 'D42' },
      arrival: { airport: 'Lynden Pindling International', iata: 'NAS', scheduled: arr.toISOString(), estimated: delayedArr.toISOString(), actual: null, delay: 95, terminal: '1', gate: 'A8' },
      position: null,
    },

    // Boarding: LHR → CDG
    BA249: {
      flightNumber: 'BA249', callsign: 'BAW249',
      airline: 'British Airways', airlineIata: 'BA',
      status: 'boarding', rawStatus: 'boarding',
      aircraft: { iata: 'A320', icao: 'A320', registration: 'G-EUXA', model: 'Airbus A320' },
      departure: { airport: 'London Heathrow', iata: 'LHR', scheduled: new Date(now.getTime() + 20 * 60000).toISOString(), estimated: new Date(now.getTime() + 20 * 60000).toISOString(), actual: null, delay: 0, terminal: '5', gate: 'C25' },
      arrival: { airport: 'Charles de Gaulle Airport', iata: 'CDG', scheduled: new Date(now.getTime() + 90 * 60000).toISOString(), estimated: new Date(now.getTime() + 90 * 60000).toISOString(), actual: null, delay: 0, terminal: '2E', gate: 'K31' },
      position: null,
    },

    // Airborne, generic (JFK → LAX)
    UA100: {
      flightNumber: 'UA100', callsign: 'UAL100',
      airline: 'United Airlines', airlineIata: 'UA',
      status: 'airborne', rawStatus: 'active',
      aircraft: { iata: 'B77W', icao: 'B77W', registration: 'N57855', model: 'Boeing 777-300ER' },
      departure: { airport: 'John F. Kennedy International', iata: 'JFK', scheduled: dep.toISOString(), estimated: dep.toISOString(), actual: dep.toISOString(), delay: 0, terminal: '7', gate: 'C18' },
      arrival: { airport: 'Los Angeles International', iata: 'LAX', scheduled: arr.toISOString(), estimated: arr.toISOString(), actual: null, delay: 0, terminal: 'TBIT', gate: '155' },
      position: { latitude: 39.2, longitude: -100.4, altitude: 10972, velocity: 250, heading: 270, onGround: false },
    },

    // Cancelled: ATL → CDG
    DL404: {
      flightNumber: 'DL404', callsign: 'DAL404',
      airline: 'Delta Air Lines', airlineIata: 'DL',
      status: 'cancelled', rawStatus: 'cancelled',
      aircraft: { iata: 'A359', icao: 'A359', registration: 'N501DN', model: 'Airbus A350-900' },
      departure: { airport: 'Hartsfield-Jackson Atlanta International', iata: 'ATL', scheduled: new Date(now.getTime() + 45 * 60000).toISOString(), estimated: null, actual: null, delay: 0, terminal: 'F', gate: 'F12' },
      arrival: { airport: 'Charles de Gaulle Airport', iata: 'CDG', scheduled: new Date(now.getTime() + 10 * 3600000).toISOString(), estimated: null, actual: null, delay: 0, terminal: '2E', gate: 'K44' },
      position: null,
    },

    // Airborne, long-haul (JFK → SIN)
    SQ22: {
      flightNumber: 'SQ22', callsign: 'SIA22',
      airline: 'Singapore Airlines', airlineIata: 'SQ',
      status: 'airborne', rawStatus: 'active',
      aircraft: { iata: 'A35K', icao: 'A35K', registration: '9V-SGA', model: 'Airbus A350-900ULR' },
      departure: { airport: 'John F. Kennedy International', iata: 'JFK', scheduled: new Date(now.getTime() - 5 * 3600000).toISOString(), estimated: new Date(now.getTime() - 5 * 3600000).toISOString(), actual: new Date(now.getTime() - 5 * 3600000).toISOString(), delay: 0, terminal: '4', gate: 'B41' },
      arrival: { airport: 'Singapore Changi Airport', iata: 'SIN', scheduled: new Date(now.getTime() + 13 * 3600000).toISOString(), estimated: new Date(now.getTime() + 13 * 3600000).toISOString(), actual: null, delay: 0, terminal: '3', gate: 'D32' },
      position: { latitude: 40.1, longitude: 60.5, altitude: 12497, velocity: 261, heading: 65, onGround: false },
    },

    // Scheduled (future): LHR → SYD
    QF7: {
      flightNumber: 'QF7', callsign: 'QFA7',
      airline: 'Qantas', airlineIata: 'QF',
      status: 'scheduled', rawStatus: 'scheduled',
      aircraft: { iata: 'A388', icao: 'A388', registration: 'VH-OQA', model: 'Airbus A380-800' },
      departure: { airport: 'London Heathrow', iata: 'LHR', scheduled: new Date(now.getTime() + 3 * 3600000).toISOString(), estimated: new Date(now.getTime() + 3 * 3600000).toISOString(), actual: null, delay: 0, terminal: '3', gate: 'G28' },
      arrival: { airport: 'Sydney Kingsford Smith International', iata: 'SYD', scheduled: new Date(now.getTime() + 25 * 3600000).toISOString(), estimated: new Date(now.getTime() + 25 * 3600000).toISOString(), actual: null, delay: 0, terminal: '1', gate: '1' },
      position: null,
    },

    // Delayed 45 min: IST → DXB
    TK764: {
      flightNumber: 'TK764', callsign: 'THY764',
      airline: 'Turkish Airlines', airlineIata: 'TK',
      status: 'delayed', rawStatus: 'delayed',
      aircraft: { iata: 'B77W', icao: 'B77W', registration: 'TC-LJA', model: 'Boeing 777-300ER' },
      departure: { airport: 'Istanbul Airport', iata: 'IST', scheduled: new Date(now.getTime() + 10 * 60000).toISOString(), estimated: new Date(now.getTime() + 55 * 60000).toISOString(), actual: null, delay: 45, terminal: 'D', gate: 'D28' },
      arrival: { airport: 'Dubai International', iata: 'DXB', scheduled: new Date(now.getTime() + 3.5 * 3600000).toISOString(), estimated: new Date(now.getTime() + 4.25 * 3600000).toISOString(), actual: null, delay: 45, terminal: '3', gate: 'C10' },
      position: null,
    },

    // Landed on time: SYD → SIN
    JQ7: {
      flightNumber: 'JQ7', callsign: 'JST7',
      airline: 'Jetstar Airways', airlineIata: 'JQ',
      status: 'landed', rawStatus: 'landed',
      aircraft: { iata: 'A320', icao: 'A320', registration: 'VH-VFX', model: 'Airbus A320' },
      departure: { airport: 'Sydney Kingsford Smith International', iata: 'SYD', scheduled: new Date(now.getTime() - 8 * 3600000).toISOString(), estimated: new Date(now.getTime() - 8 * 3600000).toISOString(), actual: new Date(now.getTime() - 8 * 3600000).toISOString(), delay: 0, terminal: '2', gate: '52' },
      arrival: { airport: 'Singapore Changi Airport', iata: 'SIN', scheduled: new Date(now.getTime() - 1 * 3600000).toISOString(), estimated: new Date(now.getTime() - 1 * 3600000).toISOString(), actual: new Date(now.getTime() - 55 * 60000).toISOString(), delay: 0, terminal: '1', gate: 'A14' },
      position: { latitude: 1.36, longitude: 103.99, altitude: 0, velocity: 0, heading: 0, onGround: true },
    },

    // Airborne, on time: FRA → NRT
    LH716: {
      flightNumber: 'LH716', callsign: 'DLH716',
      airline: 'Lufthansa', airlineIata: 'LH',
      status: 'airborne', rawStatus: 'active',
      aircraft: { iata: 'B748', icao: 'B748', registration: 'D-ABYO', model: 'Boeing 747-8' },
      departure: { airport: 'Frankfurt Airport', iata: 'FRA', scheduled: new Date(now.getTime() - 3 * 3600000).toISOString(), estimated: new Date(now.getTime() - 3 * 3600000).toISOString(), actual: new Date(now.getTime() - 3 * 3600000).toISOString(), delay: 0, terminal: '1', gate: 'Z59' },
      arrival: { airport: 'Tokyo Narita International', iata: 'NRT', scheduled: new Date(now.getTime() + 9 * 3600000).toISOString(), estimated: new Date(now.getTime() + 9 * 3600000).toISOString(), actual: null, delay: 0, terminal: '1', gate: '68' },
      position: { latitude: 55.8, longitude: 80.3, altitude: 11278, velocity: 255, heading: 75, onGround: false },
    },
  };

  const flight = mockFlights[flightNumber] || {
    flightNumber, callsign: flightNumber,
    airline: 'Demo Airlines', airlineIata: 'DA',
    status: 'airborne', rawStatus: 'active',
    aircraft: { iata: 'B738', icao: 'B738', registration: 'N12345', model: 'Boeing 737-800' },
    departure: { airport: 'Toronto Pearson International', iata: 'YYZ', scheduled: dep.toISOString(), estimated: dep.toISOString(), actual: dep.toISOString(), delay: 0, terminal: '1', gate: 'D22' },
    arrival: { airport: 'London Heathrow', iata: 'LHR', scheduled: arr.toISOString(), estimated: arr.toISOString(), actual: null, delay: 0, terminal: '2', gate: 'B14' },
    position: { latitude: 52.0, longitude: -30.0, altitude: 11280, velocity: 245, heading: 85, onGround: false },
  };

  return Promise.resolve({ ...flight, _isMock: true });
}
