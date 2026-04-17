// Alternate route finder for standby passengers.
// Generates realistic alternative routings when a flight is delayed/cancelled.

const HUBS = {
  // North America
  JFK: { city: 'New York', region: 'NA', airlines: ['AA', 'DL', 'B6', 'EK', 'BA', 'LH', 'AF'] },
  EWR: { city: 'Newark', region: 'NA', airlines: ['UA', 'EWR'] },
  YYZ: { city: 'Toronto', region: 'NA', airlines: ['AC', 'WS', 'UA', 'AA'] },
  YVR: { city: 'Vancouver', region: 'NA', airlines: ['AC', 'WS', 'CA'] },
  LAX: { city: 'Los Angeles', region: 'NA', airlines: ['AA', 'DL', 'UA', 'WN', 'AS'] },
  ORD: { city: 'Chicago', region: 'NA', airlines: ['AA', 'UA', 'WN'] },
  ATL: { city: 'Atlanta', region: 'NA', airlines: ['DL', 'WN'] },
  MIA: { city: 'Miami', region: 'NA', airlines: ['AA', 'LATAM'] },
  YHM: { city: 'Hamilton', region: 'NA', airlines: ['WS', 'AC'] },

  // Caribbean / Bahamas
  NAS: { city: 'Nassau', region: 'CAR', airlines: ['BA', 'AA', 'WS', 'AC', 'UA'] },
  MBJ: { city: 'Montego Bay', region: 'CAR', airlines: ['WS', 'AC', 'AA', 'DL'] },
  GGT: { city: 'George Town', region: 'CAR', airlines: ['AA', 'WS'] },
  FPO: { city: 'Freeport', region: 'CAR', airlines: ['AA', 'US'] },

  // Europe
  LHR: { city: 'London', region: 'EU', airlines: ['BA', 'VS', 'AA', 'UA', 'EK'] },
  CDG: { city: 'Paris', region: 'EU', airlines: ['AF', 'BA', 'LH', 'AA'] },
  AMS: { city: 'Amsterdam', region: 'EU', airlines: ['KL', 'EZY', 'BA'] },
  FRA: { city: 'Frankfurt', region: 'EU', airlines: ['LH', 'AB', 'UA'] },
  MAD: { city: 'Madrid', region: 'EU', airlines: ['IB', 'VY', 'BA'] },
  IST: { city: 'Istanbul', region: 'EU', airlines: ['TK', 'PC'] },

  // Middle East
  DXB: { city: 'Dubai', region: 'ME', airlines: ['EK', 'FZ'] },
  DOH: { city: 'Doha', region: 'ME', airlines: ['QR'] },
  AUH: { city: 'Abu Dhabi', region: 'ME', airlines: ['EY'] },

  // Asia
  SIN: { city: 'Singapore', region: 'AS', airlines: ['SQ', 'MI', 'TZ'] },
  HKG: { city: 'Hong Kong', region: 'AS', airlines: ['CX', 'KA', 'HX'] },
  NRT: { city: 'Tokyo', region: 'AS', airlines: ['NH', 'JL', 'JQ'] },
  ICN: { city: 'Seoul', region: 'AS', airlines: ['KE', 'OZ', 'LJ'] },
  BKK: { city: 'Bangkok', region: 'AS', airlines: ['TG', 'DD', 'WE'] },
};

const AIRLINES = {
  AA: 'American Airlines', AC: 'Air Canada', AF: 'Air France', AS: 'Alaska Airlines',
  BA: 'British Airways', B6: 'JetBlue', CA: 'Air China', CX: 'Cathay Pacific',
  DL: 'Delta Air Lines', EK: 'Emirates', EY: 'Etihad Airways', EZY: 'easyJet',
  FZ: 'flydubai', IB: 'Iberia', JL: 'Japan Airlines', JQ: 'Jetstar',
  KE: 'Korean Air', KL: 'KLM', LH: 'Lufthansa', LATAM: 'LATAM',
  MI: 'SilkAir', NH: 'ANA', OZ: 'Asiana', PC: 'Pegasus',
  QR: 'Qatar Airways', SQ: 'Singapore Airlines', TG: 'Thai Airways', TK: 'Turkish Airlines',
  UA: 'United Airlines', VS: 'Virgin Atlantic', VY: 'Vueling', WN: 'Southwest',
  WS: 'WestJet', YYZ: 'Air Transat',
};

// Routes database: origin → [destinations with airline codes]
const DIRECT_ROUTES = {
  YYZ: ['NAS', 'MBJ', 'FPO', 'LAX', 'JFK', 'LHR', 'CDG', 'AMS', 'FRA', 'DXB', 'ORD', 'ATL', 'MIA', 'YVR', 'ICN', 'NRT', 'SIN'],
  JFK: ['NAS', 'MBJ', 'LAX', 'LHR', 'CDG', 'AMS', 'FRA', 'DXB', 'DOH', 'IST', 'ORD', 'ATL', 'MIA', 'YYZ', 'ICN', 'NRT'],
  MIA: ['NAS', 'MBJ', 'FPO', 'GGT', 'JFK', 'LAX', 'LHR', 'ORD', 'ATL', 'YYZ'],
  LAX: ['NAS', 'JFK', 'LHR', 'NRT', 'SIN', 'HKG', 'ICN', 'YYZ', 'ORD', 'ATL', 'MIA'],
  LHR: ['NAS', 'JFK', 'LAX', 'YYZ', 'DXB', 'DOH', 'SIN', 'HKG', 'NRT', 'ORD', 'ATL', 'MIA', 'CDG', 'AMS', 'FRA'],
  DXB: ['JFK', 'LHR', 'CDG', 'AMS', 'FRA', 'NRT', 'SIN', 'HKG', 'ICN', 'BKK', 'YYZ'],
  NAS: ['YYZ', 'JFK', 'MIA', 'LHR', 'FPO'],
  MBJ: ['YYZ', 'JFK', 'MIA', 'ATL', 'ORD'],
  ORD: ['JFK', 'LHR', 'YYZ', 'LAX', 'MIA', 'ATL', 'NRT'],
  ATL: ['JFK', 'LHR', 'CDG', 'YYZ', 'LAX', 'MIA', 'ORD', 'MBJ', 'NAS'],
};

// Seat availability tiers (simulated, based on route + time-of-day heuristics)
function estimateAvailability(origin, dest, hopCount) {
  const seed = (origin.charCodeAt(0) + dest.charCodeAt(0) + hopCount) % 3;
  const hour = new Date().getHours();
  const isPeak = (hour >= 7 && hour <= 10) || (hour >= 16 && hour <= 20);
  const adjusted = isPeak ? (seed + 1) % 3 : seed;
  return ['low', 'med', 'high'][adjusted];
}

function generateFlightNumber(airline) {
  const num = 100 + Math.floor(Math.random() * 899);
  return `${airline}${num}`;
}

function addMinutes(isoStr, mins) {
  if (!isoStr) return null;
  return new Date(new Date(isoStr).getTime() + mins * 60000).toISOString();
}

function randomDurationMins(origin, dest) {
  // Very rough distance-based duration
  const durations = {
    'YYZ-NAS': 210, 'JFK-NAS': 185, 'MIA-NAS': 55, 'LHR-NAS': 490,
    'YYZ-MBJ': 220, 'JFK-MBJ': 195, 'MIA-MBJ': 80, 'ATL-MBJ': 120,
    'JFK-LHR': 420, 'JFK-CDG': 450, 'YYZ-LHR': 450, 'LAX-NRT': 680,
    'DXB-LHR': 420, 'DXB-JFK': 840,
  };
  const key = `${origin}-${dest}`;
  const reverseKey = `${dest}-${origin}`;
  return durations[key] || durations[reverseKey] || 180 + Math.floor(Math.random() * 300);
}

export function findAlternateRoutes(origin, destination, scheduledDeparture) {
  const routes = [];
  const depTime = scheduledDeparture ? new Date(scheduledDeparture) : new Date();

  // 1. Direct alternatives (same O-D pair, different airline)
  const directHubs = HUBS[origin];
  const destHub = HUBS[destination];
  if (directHubs && destHub) {
    const sharedAirlines = directHubs.airlines.filter(a => destHub.airlines.includes(a));
    sharedAirlines.slice(0, 2).forEach((airline, i) => {
      const depDelay = 30 + i * 45; // stagger by 30/75 min
      const duration = randomDurationMins(origin, destination);
      routes.push({
        id: `direct-${i}`,
        type: 'direct',
        airline: AIRLINES[airline] || airline,
        airlineCode: airline,
        flightNumber: generateFlightNumber(airline),
        departure: { iata: origin, time: addMinutes(depTime.toISOString(), depDelay) },
        arrival: { iata: destination, time: addMinutes(depTime.toISOString(), depDelay + duration) },
        stops: [],
        durationMins: duration,
        availability: estimateAvailability(origin, destination, 0),
        standbyEligible: Math.random() > 0.4,
        notes: i === 0 ? 'Next available direct flight' : 'Alternative direct option',
      });
    });
  }

  // 2. One-stop connecting routes
  const originRoutes = DIRECT_ROUTES[origin] || [];
  const destRoutes = DIRECT_ROUTES[destination] || [];
  const commonHubs = originRoutes.filter(h => destRoutes.includes(h) && h !== origin && h !== destination);

  commonHubs.slice(0, 3).forEach((hub, i) => {
    const hubData = HUBS[hub];
    if (!hubData) return;
    const leg1Airlines = (HUBS[origin]?.airlines || []).filter(a => hubData.airlines.includes(a));
    const leg2Airlines = (hubData.airlines || []).filter(a => (HUBS[destination]?.airlines || []).includes(a));
    const airline1 = leg1Airlines[0] || 'UA';
    const airline2 = leg2Airlines[0] || 'UA';

    const leg1Dep = addMinutes(depTime.toISOString(), 90 + i * 60);
    const leg1Dur = randomDurationMins(origin, hub);
    const leg1Arr = addMinutes(leg1Dep, leg1Dur);
    const layover = 90 + Math.floor(Math.random() * 60); // 90-150 min layover
    const leg2Dep = addMinutes(leg1Arr, layover);
    const leg2Dur = randomDurationMins(hub, destination);
    const leg2Arr = addMinutes(leg2Dep, leg2Dur);
    const totalDur = leg1Dur + layover + leg2Dur;

    routes.push({
      id: `connect-${hub}-${i}`,
      type: 'connecting',
      airline: AIRLINES[airline1] || airline1,
      airlineCode: airline1,
      flightNumber: generateFlightNumber(airline1),
      departure: { iata: origin, time: leg1Dep },
      arrival: { iata: destination, time: leg2Arr },
      stops: [{
        iata: hub,
        city: hubData.city,
        arrivalTime: leg1Arr,
        departureTime: leg2Dep,
        layoverMins: layover,
        connectingFlight: generateFlightNumber(airline2),
        connectingAirline: AIRLINES[airline2] || airline2,
      }],
      durationMins: totalDur,
      availability: estimateAvailability(origin, destination, 1),
      standbyEligible: Math.random() > 0.5,
      notes: `Via ${hubData.city} — ${Math.round(layover / 60 * 10) / 10}h layover`,
    });
  });

  // 3. Nearby alternative destination (if Caribbean island — suggest neighbouring islands)
  const caribbeanAlt = getNearbyDestinations(destination);
  caribbeanAlt.forEach((altDest, i) => {
    if (DIRECT_ROUTES[origin]?.includes(altDest)) {
      const dur = randomDurationMins(origin, altDest);
      const dep = addMinutes(depTime.toISOString(), 60 + i * 90);
      routes.push({
        id: `alt-dest-${altDest}`,
        type: 'alternate-destination',
        airline: AIRLINES['WS'] || 'WestJet',
        airlineCode: 'WS',
        flightNumber: generateFlightNumber('WS'),
        departure: { iata: origin, time: dep },
        arrival: { iata: altDest, time: addMinutes(dep, dur) },
        stops: [],
        durationMins: dur,
        availability: estimateAvailability(origin, altDest, 0),
        standbyEligible: true,
        notes: `Nearby destination — ${getAirportCity(altDest)} — you can reach ${getAirportCity(destination)} from there`,
        isAlternateDest: true,
        originalDest: destination,
      });
    }
  });

  return routes.sort((a, b) => new Date(a.departure.time) - new Date(b.departure.time)).slice(0, 6);
}

function getNearbyDestinations(iata) {
  const nearby = {
    NAS: ['FPO', 'GGT', 'MBJ'],
    MBJ: ['NAS', 'GGT'],
    FPO: ['NAS', 'MBJ'],
    GGT: ['NAS', 'FPO'],
  };
  return nearby[iata] || [];
}

function getAirportCity(iata) {
  return HUBS[iata]?.city || iata;
}
