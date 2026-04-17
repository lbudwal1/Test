// Airline directory: brand color, service URLs, loyalty program
// color: hex for inline styles; bg/text Tailwind approximations kept minimal

export const AIRLINE_DATA = {
  PD: {
    name: 'Porter Airlines',
    iata: 'PD',
    color: '#0066CC',
    region: 'North America',
    hub: 'YTZ / YYZ',
    website: 'https://www.flyporter.com',
    services: {
      book:    'https://www.flyporter.com/en-ca/book-travel',
      checkIn: 'https://www.flyporter.com/en-ca/travel-information/check-in',
      manage:  'https://www.flyporter.com/en-ca/login',
      status:  'https://www.flyporter.com/en-ca/travel-information/flight-status',
      baggage: 'https://www.flyporter.com/en-ca/travel-information/baggage',
      loyalty: { name: 'VIPorter', url: 'https://www.flyporter.com/en-ca/about-porter/viporter' },
    },
    demoFlights: ['PD215', 'PD101', 'PD402', 'PD789', 'PD550'],
  },

  EK: {
    name: 'Emirates',
    iata: 'EK',
    color: '#CC0000',
    region: 'Middle East',
    hub: 'DXB',
    website: 'https://www.emirates.com',
    services: {
      book:    'https://www.emirates.com/english/book/',
      checkIn: 'https://www.emirates.com/english/manage/online-check-in/',
      manage:  'https://www.emirates.com/english/manage/',
      status:  'https://www.emirates.com/english/manage/flight-status/',
      baggage: 'https://www.emirates.com/english/before-you-fly/baggage/',
      loyalty: { name: 'Skywards', url: 'https://www.emirates.com/english/skywards/' },
    },
    demoFlights: ['EK203'],
  },

  AC: {
    name: 'Air Canada',
    iata: 'AC',
    color: '#CC0000',
    region: 'North America',
    hub: 'YYZ / YUL',
    website: 'https://www.aircanada.com',
    services: {
      book:    'https://www.aircanada.com/ca/en/aco/home/book.html',
      checkIn: 'https://www.aircanada.com/ca/en/aco/home/check-in.html',
      manage:  'https://www.aircanada.com/ca/en/aco/home/manage.html',
      status:  'https://www.aircanada.com/ca/en/aco/home/flight-status.html',
      baggage: 'https://www.aircanada.com/ca/en/aco/home/plan/baggage.html',
      loyalty: { name: 'Aeroplan', url: 'https://www.aircanada.com/ca/en/aco/home/aeroplan.html' },
    },
    demoFlights: ['AC123'],
  },

  BA: {
    name: 'British Airways',
    iata: 'BA',
    color: '#075AAA',
    region: 'Europe',
    hub: 'LHR',
    website: 'https://www.britishairways.com',
    services: {
      book:    'https://www.britishairways.com/en-gb/flights',
      checkIn: 'https://www.britishairways.com/en-gb/information/airport-information/online-check-in',
      manage:  'https://www.britishairways.com/en-gb/manage-my-booking',
      status:  'https://www.britishairways.com/en-gb/information/flight-status',
      baggage: 'https://www.britishairways.com/en-gb/information/baggage-essentials',
      loyalty: { name: 'Executive Club', url: 'https://www.britishairways.com/en-gb/executive-club' },
    },
    demoFlights: ['BA249'],
  },

  UA: {
    name: 'United Airlines',
    iata: 'UA',
    color: '#003580',
    region: 'North America',
    hub: 'ORD / EWR / IAH',
    website: 'https://www.united.com',
    services: {
      book:    'https://www.united.com/en/us/book-a-flight',
      checkIn: 'https://www.united.com/en/us/checkin',
      manage:  'https://www.united.com/en/us/mytrips',
      status:  'https://www.united.com/en/us/flight-status',
      baggage: 'https://www.united.com/en/us/fly/baggage.html',
      loyalty: { name: 'MileagePlus', url: 'https://www.united.com/en/us/fly/mileageplus.html' },
    },
    demoFlights: ['UA100'],
  },

  DL: {
    name: 'Delta Air Lines',
    iata: 'DL',
    color: '#C01933',
    region: 'North America',
    hub: 'ATL / JFK / LAX',
    website: 'https://www.delta.com',
    services: {
      book:    'https://www.delta.com/us/en/book-a-trip/overview',
      checkIn: 'https://www.delta.com/us/en/check-in/overview',
      manage:  'https://www.delta.com/us/en/my-trips/overview',
      status:  'https://www.delta.com/us/en/flight-search/search-by-flight',
      baggage: 'https://www.delta.com/us/en/baggage/overview',
      loyalty: { name: 'SkyMiles', url: 'https://www.delta.com/us/en/skymiles/overview' },
    },
    demoFlights: ['DL404'],
  },

  SQ: {
    name: 'Singapore Airlines',
    iata: 'SQ',
    color: '#1B3F6B',
    region: 'Asia Pacific',
    hub: 'SIN',
    website: 'https://www.singaporeair.com',
    services: {
      book:    'https://www.singaporeair.com/en_UK/us/plan-travel/book-a-flight/',
      checkIn: 'https://www.singaporeair.com/en_UK/us/travel-info/check-in/',
      manage:  'https://www.singaporeair.com/en_UK/us/travel-info/manage-booking/',
      status:  'https://www.singaporeair.com/en_UK/us/travel-info/flight-information/',
      baggage: 'https://www.singaporeair.com/en_UK/us/travel-info/baggage/',
      loyalty: { name: 'KrisFlyer', url: 'https://www.singaporeair.com/en_UK/us/ppsclub-krisflyer/krisflyer/' },
    },
    demoFlights: ['SQ22'],
  },

  QF: {
    name: 'Qantas',
    iata: 'QF',
    color: '#EE0000',
    region: 'Asia Pacific',
    hub: 'SYD / MEL',
    website: 'https://www.qantas.com',
    services: {
      book:    'https://www.qantas.com/au/en/book-a-trip/flights.html',
      checkIn: 'https://www.qantas.com/au/en/travel-info/check-in.html',
      manage:  'https://www.qantas.com/au/en/manage-booking/overview.html',
      status:  'https://www.qantas.com/au/en/travel-info/flight-status.html',
      baggage: 'https://www.qantas.com/au/en/travel-info/baggage.html',
      loyalty: { name: 'Frequent Flyer', url: 'https://www.qantas.com/au/en/frequent-flyer.html' },
    },
    demoFlights: ['QF7'],
  },

  TK: {
    name: 'Turkish Airlines',
    iata: 'TK',
    color: '#C8102E',
    region: 'Europe / Middle East',
    hub: 'IST',
    website: 'https://www.turkishairlines.com',
    services: {
      book:    'https://www.turkishairlines.com/en-int/flights/',
      checkIn: 'https://www.turkishairlines.com/en-int/flights/manage-booking/',
      manage:  'https://www.turkishairlines.com/en-int/flights/manage-booking/',
      status:  'https://www.turkishairlines.com/en-int/flights/flight-status/',
      baggage: 'https://www.turkishairlines.com/en-int/flights/baggage/',
      loyalty: { name: 'Miles&Smiles', url: 'https://www.turkishairlines.com/en-int/miles-and-smiles/' },
    },
    demoFlights: ['TK764'],
  },

  JQ: {
    name: 'Jetstar',
    iata: 'JQ',
    color: '#FF5F00',
    region: 'Asia Pacific',
    hub: 'SYD / MEL',
    website: 'https://www.jetstar.com',
    services: {
      book:    'https://www.jetstar.com/au/en/flights',
      checkIn: 'https://www.jetstar.com/au/en/check-in',
      manage:  'https://www.jetstar.com/au/en/manage-booking',
      status:  'https://www.jetstar.com/au/en/flight-information',
      baggage: 'https://www.jetstar.com/au/en/baggage',
      loyalty: { name: 'Qantas Frequent Flyer', url: 'https://www.jetstar.com/au/en/frequent-flyer' },
    },
    demoFlights: ['JQ7'],
  },

  LH: {
    name: 'Lufthansa',
    iata: 'LH',
    color: '#05164D',
    region: 'Europe',
    hub: 'FRA / MUC',
    website: 'https://www.lufthansa.com',
    services: {
      book:    'https://www.lufthansa.com/gb/en/book-flight',
      checkIn: 'https://www.lufthansa.com/gb/en/online-check-in',
      manage:  'https://www.lufthansa.com/gb/en/manage-booking',
      status:  'https://www.lufthansa.com/gb/en/flight-status',
      baggage: 'https://www.lufthansa.com/gb/en/baggage',
      loyalty: { name: 'Miles & More', url: 'https://www.lufthansa.com/gb/en/miles-and-more' },
    },
    demoFlights: ['LH716'],
  },

  WS: {
    name: 'WestJet',
    iata: 'WS',
    color: '#0063A3',
    region: 'North America',
    hub: 'YYC / YYZ',
    website: 'https://www.westjet.com',
    services: {
      book:    'https://www.westjet.com/en-ca/flights',
      checkIn: 'https://www.westjet.com/en-ca/check-in',
      manage:  'https://www.westjet.com/en-ca/manage-trips',
      status:  'https://www.westjet.com/en-ca/flight-status',
      baggage: 'https://www.westjet.com/en-ca/baggage',
      loyalty: { name: 'WestJet Rewards', url: 'https://www.westjet.com/en-ca/rewards' },
    },
    demoFlights: [],
  },
};

// Ordered list for the directory grid
export const AIRLINE_LIST = Object.values(AIRLINE_DATA);

export function getAirlineInfo(iataCode) {
  return AIRLINE_DATA[iataCode] || null;
}
