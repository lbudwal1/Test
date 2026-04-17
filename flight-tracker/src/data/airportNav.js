// Airport navigation data. Each airport has arrival and departure flows.
// Each step has: id, type, instructionKey (mapped via i18n direction keys),
// instruction_en (base English text), landmark (optional), sign (optional sign config),
// direction, icon

export const AIRPORTS = {
  YYZ: {
    name: 'Toronto Pearson International',
    city: 'Toronto',
    country: 'Canada',
    terminals: ['1', '3'],
    flows: {
      'arrival-intl': {
        label: 'International Arrival',
        steps: [
          { id: 1, icon: '✈️', instruction_en: 'Deplane and follow the yellow floor markers', direction: 'straight', sign: { type: 'directional', text: 'ARRIVALS →', color: 'blue' }, landmark: null },
          { id: 2, icon: '🛂', instruction_en: 'Follow signs to Canada Border Services Agency (CBSA). Blue lanes for Canadian/US citizens, all others use red lanes.', direction: 'straight', sign: { type: 'government', text: 'CANADA BORDER SERVICES AGENCY', subtext: 'DOUANES ET PROTECTION DES FRONTIÈRES', color: 'green' }, landmark: { name: 'Border Services Booths', emoji: '🛂', desc: 'Government officers in green booths' } },
          { id: 3, icon: '🧳', instruction_en: 'After immigration, follow signs to Baggage Claim. Check the screens for your flight\'s carousel number.', direction: 'straight', sign: { type: 'baggage', text: 'BAGGAGE CLAIM', subtext: 'RÉCLAMATION DES BAGAGES', color: 'black-yellow' }, landmark: { name: 'Baggage Carousels', emoji: '🧳', desc: 'Large moving conveyor belts with luggage' } },
          { id: 4, icon: '🏛️', instruction_en: 'Proceed to CBSA Customs Declaration. Hand the officer your declaration card (filled on the plane).', direction: 'straight', sign: { type: 'government', text: 'CUSTOMS / DOUANES', color: 'green' }, landmark: null },
          { id: 5, icon: '🚪', instruction_en: 'Exit through the sliding glass doors into the Arrivals Hall. You\'ll see people waiting and Ground Transportation signs.', direction: 'straight', sign: { type: 'exit', text: 'EXIT / SORTIE', color: 'green' }, landmark: { name: 'Tim Hortons', emoji: '☕', desc: 'Red and brown coffee shop — turn left after exiting customs' } },
          { id: 6, icon: '🚌', instruction_en: 'For ground transportation (taxi, UP Express train, bus), follow signs down to Level 1.', direction: 'down', sign: { type: 'directional', text: 'GROUND TRANSPORTATION ↓', subtext: 'UP EXPRESS TRAIN | TAXIS | BUSES', color: 'blue' }, landmark: { name: 'UP Express Train', emoji: '🚇', desc: 'Blue and white train to downtown Toronto — look for the blue "UP" logo' } },
        ]
      },
      'arrival-domestic': {
        label: 'Domestic Arrival',
        steps: [
          { id: 1, icon: '✈️', instruction_en: 'Deplane and follow the signs to Arrivals', direction: 'straight', sign: { type: 'directional', text: 'ARRIVALS →', color: 'blue' }, landmark: null },
          { id: 2, icon: '🧳', instruction_en: 'Head to Baggage Claim. Check the overhead screens for your carousel number.', direction: 'straight', sign: { type: 'baggage', text: 'BAGGAGE CLAIM', subtext: 'RÉCLAMATION DES BAGAGES', color: 'black-yellow' }, landmark: { name: 'Baggage Carousels', emoji: '🧳', desc: 'Moving conveyor belts, carousel number shown on screens' } },
          { id: 3, icon: '🚪', instruction_en: 'Exit to the Arrivals Hall. Look for your pickup or ground transportation.', direction: 'straight', sign: { type: 'exit', text: 'EXIT / SORTIE', color: 'green' }, landmark: { name: 'Tim Hortons', emoji: '☕', desc: 'Look for Tim Hortons — you\'re in the Arrivals Hall' } },
        ]
      },
      'departure-intl': {
        label: 'International Departure',
        steps: [
          { id: 1, icon: '🏢', instruction_en: 'Enter the terminal and find your airline\'s check-in counters. They are organized by airline name — look for the screens showing check-in rows.', direction: 'straight', sign: { type: 'directional', text: 'CHECK-IN / ENREGISTREMENT →', color: 'blue' }, landmark: { name: 'Check-in Counters', emoji: '🏷️', desc: 'Rows of counters with airline logos above them' } },
          { id: 2, icon: '🔒', instruction_en: 'After check-in, proceed to the Security Screening area. Remove shoes, belt, and electronics. Place in grey bins.', direction: 'straight', sign: { type: 'security', text: 'SECURITY / SÛRETÉ →', color: 'blue' }, landmark: { name: 'Security Checkpoint', emoji: '🔒', desc: 'X-ray machines and body scanners — queue forms here' } },
          { id: 3, icon: '🛂', instruction_en: 'For international flights, proceed through Customs/Passport Control after security.', direction: 'straight', sign: { type: 'government', text: 'PASSPORT CONTROL →', color: 'green' }, landmark: null },
          { id: 4, icon: '🏪', instruction_en: 'You are now in the Duty-Free / shopping area. Gates are ahead. Check your boarding pass for your gate letter and number (A, B, C, D, E, or F).', direction: 'straight', sign: { type: 'gates', text: 'GATES A B C D E F →', color: 'blue' }, landmark: { name: 'Duty-Free Shops', emoji: '🛍️', desc: 'Large retail stores selling perfume, alcohol, chocolate' } },
          { id: 5, icon: '🚶', instruction_en: 'Walk or take the moving walkway to your gate. Check the gate screens — they show the flight and boarding time.', direction: 'straight', sign: { type: 'gate', text: 'GATE ← B22', color: 'blue' }, landmark: { name: 'Moving Walkways', emoji: '🚶', desc: 'Flat conveyor belts on the floor — step on to move faster' } },
          { id: 6, icon: '✈️', instruction_en: 'At your gate, scan your boarding pass at the kiosk. Wait until your row or group is called.', direction: 'straight', sign: { type: 'info', text: 'BOARDING / EMBARQUEMENT', color: 'white' }, landmark: null },
        ]
      },
      'connection': {
        label: 'Connecting Flight',
        steps: [
          { id: 1, icon: '✈️', instruction_en: 'After landing, do NOT go to baggage claim. Follow the yellow "Connections" signs.', direction: 'straight', sign: { type: 'directional', text: 'CONNECTIONS / CORRESPONDANCES →', color: 'blue' }, landmark: null },
          { id: 2, icon: '🔒', instruction_en: 'Go through the Security Re-screening checkpoint (even as a connecting passenger).', direction: 'straight', sign: { type: 'security', text: 'CONNECTIONS SECURITY →', color: 'blue' }, landmark: null },
          { id: 3, icon: '🚆', instruction_en: 'If your connection is in Terminal 3, take the free LINK Train. Follow the "Terminal 3" signs.', direction: 'straight', sign: { type: 'train', text: 'LINK TRAIN → TERMINAL 3', color: 'red' }, landmark: { name: 'LINK Train Platform', emoji: '🚆', desc: 'Red and white train connecting Terminal 1 and Terminal 3' } },
          { id: 4, icon: '🚶', instruction_en: 'Proceed to your connecting gate. Gates are listed on the departure screens.', direction: 'straight', sign: { type: 'gates', text: 'GATES →', color: 'blue' }, landmark: null },
        ]
      }
    }
  },

  JFK: {
    name: 'John F. Kennedy International',
    city: 'New York',
    country: 'USA',
    terminals: ['1', '2', '4', '5', '7', '8'],
    flows: {
      'arrival-intl': {
        label: 'International Arrival',
        steps: [
          { id: 1, icon: '✈️', instruction_en: 'Deplane and follow the signs. JFK is large — stay calm and follow the orange and white signs.', direction: 'straight', sign: { type: 'directional', text: 'ARRIVALS →', color: 'blue' }, landmark: null },
          { id: 2, icon: '🛂', instruction_en: 'Proceed to US Customs & Border Protection. US citizens/Green Card use the automated kiosks (APC machines). Others join the queue.', direction: 'straight', sign: { type: 'government', text: 'U.S. CUSTOMS & BORDER PROTECTION', color: 'blue' }, landmark: { name: 'APC Kiosks', emoji: '💻', desc: 'Tall white touch-screen machines for US citizens and eligible visitors' } },
          { id: 3, icon: '🧳', instruction_en: 'Collect your baggage at the carousel shown on the screens. Then hand your declaration to the officer at the exit.', direction: 'straight', sign: { type: 'baggage', text: 'BAGGAGE CLAIM', color: 'black-yellow' }, landmark: null },
          { id: 4, icon: '🚌', instruction_en: 'Take the AirTrain (free between terminals, paid to subway). Follow AirTrain signs to the station.', direction: 'straight', sign: { type: 'train', text: 'AIRTRAIN JFK →', color: 'blue' }, landmark: { name: 'AirTrain Station', emoji: '🚇', desc: 'Yellow AirTrain — connects all terminals and Jamaica/Howard Beach subway stations' } },
        ]
      },
      'departure-intl': {
        label: 'International Departure',
        steps: [
          { id: 1, icon: '🚇', instruction_en: 'Take the AirTrain from any terminal or subway station to your terminal.', direction: 'straight', sign: { type: 'train', text: 'AIRTRAIN JFK →', color: 'blue' }, landmark: { name: 'AirTrain', emoji: '🚇', desc: 'Yellow automated rail — free between terminals' } },
          { id: 2, icon: '🏢', instruction_en: 'Check in at your airline counter. Have your passport and booking ready.', direction: 'straight', sign: { type: 'directional', text: 'CHECK-IN →', color: 'blue' }, landmark: null },
          { id: 3, icon: '🔒', instruction_en: 'Go through TSA Security. Remove shoes, belt, laptop, and liquids. PreCheck lanes are faster if you have the sticker.', direction: 'straight', sign: { type: 'security', text: 'TSA SECURITY CHECKPOINT →', color: 'blue' }, landmark: { name: 'TSA Security', emoji: '🔒', desc: 'Blue and white TSA uniforms. PreCheck lane is on the left (look for a small airplane symbol)' } },
          { id: 4, icon: '🚶', instruction_en: 'Proceed to your gate. Terminal maps are posted throughout — look for your gate letter.', direction: 'straight', sign: { type: 'gates', text: 'GATES →', color: 'blue' }, landmark: null },
        ]
      }
    }
  },

  LHR: {
    name: 'London Heathrow',
    city: 'London',
    country: 'United Kingdom',
    terminals: ['2', '3', '4', '5'],
    flows: {
      'arrival-intl': {
        label: 'International Arrival',
        steps: [
          { id: 1, icon: '✈️', instruction_en: 'Deplane and follow the purple Heathrow signs.', direction: 'straight', sign: { type: 'directional', text: 'ARRIVALS →', color: 'purple' }, landmark: null },
          { id: 2, icon: '🛂', instruction_en: 'Proceed to UK Border Control. UK/EU passport holders use the eGates (automatic). Others join the queue.', direction: 'straight', sign: { type: 'government', text: 'UK BORDER FORCE / PASSPORT CONTROL', color: 'purple' }, landmark: { name: 'eGates', emoji: '🔄', desc: 'Automated gate machines — scan your biometric passport and look at the camera' } },
          { id: 3, icon: '🧳', instruction_en: 'Collect your baggage. Check the screens for your flight\'s belt number.', direction: 'straight', sign: { type: 'baggage', text: 'BAGGAGE RECLAIM →', color: 'black-yellow' }, landmark: null },
          { id: 4, icon: '🏛️', instruction_en: 'Proceed through Customs: Green (Nothing to Declare) or Red (Goods to Declare). If unsure, use Red.', direction: 'straight', sign: { type: 'customs', text: 'NOTHING TO DECLARE / GREEN CHANNEL', color: 'green' }, landmark: { name: 'Customs Channels', emoji: '🟢', desc: 'Green channel on left, Red on right — choose based on what you\'re carrying' } },
          { id: 5, icon: '🚇', instruction_en: 'Take the London Underground (Tube) or the Elizabeth line from the airport to central London.', direction: 'down', sign: { type: 'train', text: 'LONDON UNDERGROUND ↓', color: 'red' }, landmark: { name: 'Underground / Elizabeth Line', emoji: '🚇', desc: 'Red circle with horizontal blue bar — Heathrow Express is white, Elizabeth line is purple' } },
        ]
      },
      'departure-intl': {
        label: 'Departure',
        steps: [
          { id: 1, icon: '🏢', instruction_en: 'Find your terminal (2, 3, 4, or 5) using your boarding pass. Each is a separate building.', direction: 'straight', sign: { type: 'directional', text: 'TERMINAL 5 →', color: 'purple' }, landmark: null },
          { id: 2, icon: '🔒', instruction_en: 'Check in and proceed to Security. Remove liquids (100ml max, in a clear bag), laptops, and belts.', direction: 'straight', sign: { type: 'security', text: 'SECURITY →', color: 'purple' }, landmark: null },
          { id: 3, icon: '🛍️', instruction_en: 'After security, you enter the World Duty Free shopping area. Walk through to reach the departure gates.', direction: 'straight', sign: { type: 'gates', text: 'DEPARTURE GATES →', color: 'purple' }, landmark: { name: 'World Duty Free', emoji: '🛍️', desc: 'Large blue and purple duty-free stores — gates are beyond this area' } },
          { id: 4, icon: '🚌', instruction_en: 'Some gates (remote stands) require a bus. Follow the "Bus Gate" signs if yours is a bus gate.', direction: 'straight', sign: { type: 'directional', text: 'BUS GATES / REMOTE STANDS →', color: 'purple' }, landmark: null },
        ]
      }
    }
  },

  DXB: {
    name: 'Dubai International',
    city: 'Dubai',
    country: 'UAE',
    terminals: ['1', '2', '3'],
    flows: {
      'arrival-intl': {
        label: 'International Arrival',
        steps: [
          { id: 1, icon: '✈️', instruction_en: 'Deplane and follow the English/Arabic signs (both are always shown at DXB).', direction: 'straight', sign: { type: 'directional', text: 'ARRIVALS / الوصول →', color: 'blue' }, landmark: null },
          { id: 2, icon: '🛂', instruction_en: 'Proceed to Immigration. UAE residents use the eGates. Visitors join the queue. Fingerprinting is required for all first-time visitors.', direction: 'straight', sign: { type: 'government', text: 'IMMIGRATION / الجوازات →', color: 'green' }, landmark: { name: 'Immigration Counters', emoji: '🛂', desc: 'White booths with officers in light-blue UAE uniform' } },
          { id: 3, icon: '🧳', instruction_en: 'Collect your baggage. Screens show flight numbers and belt numbers.', direction: 'straight', sign: { type: 'baggage', text: 'BAGGAGE CLAIM / استلام الأمتعة →', color: 'black-yellow' }, landmark: null },
          { id: 4, icon: '🏛️', instruction_en: 'Pass through Customs. Green channel if nothing to declare. Red if you have goods above the limit.', direction: 'straight', sign: { type: 'customs', text: 'GREEN CHANNEL / القناة الخضراء', color: 'green' }, landmark: null },
          { id: 5, icon: '🚇', instruction_en: 'Take the Dubai Metro (Red Line) to the city. Metro entrance is in the basement of Terminal 1 and 3.', direction: 'down', sign: { type: 'train', text: 'DUBAI METRO ↓', color: 'red' }, landmark: { name: 'Dubai Metro', emoji: '🚇', desc: 'Red logo "M" sign — driverless automated trains, buy a Nol card before boarding' } },
        ]
      },
      'departure-intl': {
        label: 'Departure',
        steps: [
          { id: 1, icon: '🏢', instruction_en: 'Dubai has 3 terminals. Check your boarding pass — Emirates uses Terminal 3, others use Terminal 1 or 2.', direction: 'straight', sign: { type: 'directional', text: 'TERMINAL 3 / الصالة 3 →', color: 'blue' }, landmark: null },
          { id: 2, icon: '🔒', instruction_en: 'Check in then proceed to Security and Departure Immigration.', direction: 'straight', sign: { type: 'security', text: 'SECURITY / الأمن →', color: 'blue' }, landmark: null },
          { id: 3, icon: '🛍️', instruction_en: 'Dubai Duty Free is after immigration — one of the largest in the world. Gates are beyond.', direction: 'straight', sign: { type: 'gates', text: 'DEPARTURE GATES / بوابات المغادرة →', color: 'blue' }, landmark: { name: 'Dubai Duty Free', emoji: '🛍️', desc: 'Gold and navy signs — massive shopping area before gates' } },
          { id: 4, icon: '🚶', instruction_en: 'DXB is very large. Allow extra time to walk to remote gates. Moving walkways help.', direction: 'straight', sign: { type: 'gate', text: 'GATE A5 / بوابة A5 →', color: 'blue' }, landmark: null },
        ]
      }
    }
  },

  LAX: {
    name: 'Los Angeles International',
    city: 'Los Angeles',
    country: 'USA',
    terminals: ['1', '2', '3', '4', '5', '6', '7', '8', 'TBIT'],
    flows: {
      'arrival-intl': {
        label: 'International Arrival',
        steps: [
          { id: 1, icon: '✈️', instruction_en: 'International flights arrive at the Tom Bradley International Terminal (TBIT).', direction: 'straight', sign: { type: 'directional', text: 'ARRIVALS →', color: 'blue' }, landmark: null },
          { id: 2, icon: '🛂', instruction_en: 'Follow signs to US Customs & Border Protection. Use APC kiosks if eligible (US Citizens, Global Entry, VWP countries).', direction: 'straight', sign: { type: 'government', text: 'U.S. CUSTOMS & BORDER PROTECTION →', color: 'blue' }, landmark: { name: 'APC Kiosk Machines', emoji: '💻', desc: 'White touch-screen machines near the CBP area' } },
          { id: 3, icon: '🧳', instruction_en: 'Baggage Claim is below on Level 1. Take the stairs or elevator.', direction: 'down', sign: { type: 'baggage', text: 'BAGGAGE CLAIM ↓', color: 'black-yellow' }, landmark: null },
          { id: 4, icon: '🚌', instruction_en: 'Ground Transportation is outside Level 1. Look for the Fly Away Bus or wait for your ride-share in the designated area.', direction: 'straight', sign: { type: 'directional', text: 'GROUND TRANSPORTATION →', color: 'blue' }, landmark: { name: 'Ride-Share Area', emoji: '🚗', desc: 'Designated zones for Uber/Lyft with a large "P" parking structure marker' } },
        ]
      },
      'departure-intl': {
        label: 'Departure',
        steps: [
          { id: 1, icon: '🏢', instruction_en: 'Enter the Tom Bradley International Terminal (TBIT) or your specific terminal.', direction: 'straight', sign: { type: 'directional', text: 'DEPARTURE LEVELS →', color: 'blue' }, landmark: null },
          { id: 2, icon: '🏷️', instruction_en: 'Check in on the Departures Level (Level 3). Find your airline\'s counters.', direction: 'up', sign: { type: 'directional', text: 'DEPARTURES / CHECK-IN ↑', color: 'blue' }, landmark: null },
          { id: 3, icon: '🔒', instruction_en: 'Security screening via TSA. PreCheck lanes are faster (look for ✓ symbol).', direction: 'straight', sign: { type: 'security', text: 'TSA SECURITY CHECKPOINT →', color: 'blue' }, landmark: null },
          { id: 4, icon: '🚶', instruction_en: 'Proceed to your gate. LAX gates are labeled numerically. Check departure boards.', direction: 'straight', sign: { type: 'gates', text: 'GATES 100-200 →', color: 'blue' }, landmark: null },
        ]
      }
    }
  },

  SIN: {
    name: 'Singapore Changi Airport',
    city: 'Singapore',
    country: 'Singapore',
    terminals: ['1', '2', '3', '4'],
    flows: {
      'arrival-intl': {
        label: 'International Arrival',
        steps: [
          { id: 1, icon: '✈️', instruction_en: 'Changi is world-famous for ease of navigation. Follow the clear green Arrivals signs.', direction: 'straight', sign: { type: 'directional', text: 'ARRIVALS →', color: 'green' }, landmark: { name: 'Jewel Changi', emoji: '🌿', desc: 'The stunning glass dome with waterfall — visible from most areas' } },
          { id: 2, icon: '🛂', instruction_en: 'Automated Immigration gates (ICA) for Singapore citizens. Visitors queue at manual counters.', direction: 'straight', sign: { type: 'government', text: 'IMMIGRATION →', color: 'green' }, landmark: null },
          { id: 3, icon: '🧳', instruction_en: 'Baggage Claim is just after immigration. Changi is very efficient — bags arrive quickly.', direction: 'straight', sign: { type: 'baggage', text: 'BAGGAGE CLAIM →', color: 'black-yellow' }, landmark: null },
          { id: 4, icon: '🚇', instruction_en: 'Take the MRT (Mass Rapid Transit) to the city. Station is in the basement, accessible from all terminals.', direction: 'down', sign: { type: 'train', text: 'MRT TRAIN ↓', color: 'red' }, landmark: { name: 'MRT Station', emoji: '🚇', desc: 'Red circle logo — trains run to City Hall and Tanah Merah' } },
        ]
      },
      'departure-intl': {
        label: 'Departure',
        steps: [
          { id: 1, icon: '🏢', instruction_en: 'Check your terminal number on your boarding pass (T1, T2, T3, or T4).', direction: 'straight', sign: { type: 'directional', text: 'DEPARTURE CHECK-IN →', color: 'green' }, landmark: null },
          { id: 2, icon: '🔒', instruction_en: 'After check-in and security, explore Changi\'s famous attractions — cinema, rooftop pool, butterfly garden.', direction: 'straight', sign: { type: 'security', text: 'SECURITY / IMMIGRATION →', color: 'green' }, landmark: { name: 'Butterfly Garden', emoji: '🦋', desc: 'Famous butterfly garden in Terminal 3 — near security' } },
          { id: 3, icon: '🚶', instruction_en: 'Proceed to your gate. Terminals are connected by the Skytrain.', direction: 'straight', sign: { type: 'train', text: 'SKYTRAIN →', color: 'green' }, landmark: null },
        ]
      }
    }
  },

  CDG: {
    name: 'Charles de Gaulle Airport',
    city: 'Paris',
    country: 'France',
    terminals: ['1', '2A', '2B', '2C', '2D', '2E', '2F', '3'],
    flows: {
      'arrival-intl': {
        label: 'International Arrival',
        steps: [
          { id: 1, icon: '✈️', instruction_en: 'CDG is large and split. Follow signs matching your terminal (check your boarding pass).', direction: 'straight', sign: { type: 'directional', text: 'ARRIVÉES / ARRIVALS →', color: 'blue' }, landmark: null },
          { id: 2, icon: '🛂', instruction_en: 'EU/Schengen passport holders use the dedicated fast lane. Others use the queue.', direction: 'straight', sign: { type: 'government', text: 'POLICE AUX FRONTIÈRES / BORDER POLICE →', color: 'blue' }, landmark: null },
          { id: 3, icon: '🧳', instruction_en: 'Baggage Claim (Livraison des Bagages). Check screens for carousel number.', direction: 'straight', sign: { type: 'baggage', text: 'LIVRAISON DES BAGAGES / BAGGAGE CLAIM →', color: 'black-yellow' }, landmark: null },
          { id: 4, icon: '🚇', instruction_en: 'Take the RER B train to Paris (about 30 min to Gare du Nord). Or take the CDG Taxi from Zone pick-up.', direction: 'down', sign: { type: 'train', text: 'RER B → PARIS ↓', color: 'blue' }, landmark: { name: 'RER B Station', emoji: '🚇', desc: 'Blue "RER" signs — double-decker trains to Paris city centre' } },
        ]
      },
      'departure-intl': {
        label: 'Departure',
        steps: [
          { id: 1, icon: '🏢', instruction_en: 'CDG has many sub-terminals (2A–2F, T1, T3). Check your boarding pass carefully.', direction: 'straight', sign: { type: 'directional', text: 'HALL 2E DÉPARTS / DEPARTURES →', color: 'blue' }, landmark: null },
          { id: 2, icon: '🔒', instruction_en: 'Check in then go through Police des Frontières (Border Police) and then Security.', direction: 'straight', sign: { type: 'security', text: 'CONTRÔLE DE SÉCURITÉ →', color: 'blue' }, landmark: null },
          { id: 3, icon: '🛍️', instruction_en: 'Duty-free and shops are available after passport control. Gates are further ahead.', direction: 'straight', sign: { type: 'gates', text: 'PORTES D\'EMBARQUEMENT / GATES →', color: 'blue' }, landmark: null },
        ]
      }
    }
  },

  AMS: {
    name: 'Amsterdam Schiphol Airport',
    city: 'Amsterdam',
    country: 'Netherlands',
    terminals: ['1'], // Single main terminal
    flows: {
      'arrival-intl': {
        label: 'International Arrival',
        steps: [
          { id: 1, icon: '✈️', instruction_en: 'Schiphol is one terminal. Follow yellow signs everywhere — very clear navigation.', direction: 'straight', sign: { type: 'directional', text: 'ARRIVALS →', color: 'yellow-black' }, landmark: null },
          { id: 2, icon: '🛂', instruction_en: 'Passport control is split: EU/EEA lane (left) and non-EU lane (right).', direction: 'straight', sign: { type: 'government', text: 'PASSPORT CONTROL →', color: 'blue' }, landmark: null },
          { id: 3, icon: '🧳', instruction_en: 'Baggage reclaim. Check the screens for your belt number. KLM Crown Lounge is nearby if you need to rest.', direction: 'straight', sign: { type: 'baggage', text: 'BAGGAGE RECLAIM →', color: 'black-yellow' }, landmark: { name: 'KLM Crown Lounge', emoji: '💙', desc: 'Blue KLM logo — landmark near baggage hall' } },
          { id: 4, icon: '🚇', instruction_en: 'Take the train directly from Schiphol Plaza below to Amsterdam Central or other Dutch cities.', direction: 'down', sign: { type: 'train', text: 'TRAINS TO AMSTERDAM / NS STATION ↓', color: 'yellow-black' }, landmark: { name: 'Schiphol Plaza', emoji: '🏬', desc: 'Large shopping area — walk through it to reach the train station below' } },
        ]
      },
      'departure-intl': {
        label: 'Departure',
        steps: [
          { id: 1, icon: '🏢', instruction_en: 'Check in at the Departures hall. Follow yellow signs marked "Departure" or "D" with your pier number (B, C, D, E, F, G, H, M).', direction: 'straight', sign: { type: 'directional', text: 'DEPARTURES →', color: 'yellow-black' }, landmark: null },
          { id: 2, icon: '🔒', instruction_en: 'After check-in, go through Security and then passport control. For non-EU flights, you\'ll need your boarding pass and passport.', direction: 'straight', sign: { type: 'security', text: 'SECURITY →', color: 'yellow-black' }, landmark: null },
          { id: 3, icon: '🛍️', instruction_en: 'After passport control, you\'re in the Departure Lounge. Gates are in Piers B–M.', direction: 'straight', sign: { type: 'gates', text: 'GATE D87 →', color: 'yellow-black' }, landmark: { name: 'Dutch Cheese Shop', emoji: '🧀', desc: 'Famous for Dutch cheese wheels at the entrance — great landmark before gates' } },
        ]
      }
    }
  },

  NRT: {
    name: 'Narita International Airport',
    city: 'Tokyo',
    country: 'Japan',
    terminals: ['1', '2', '3'],
    flows: {
      'arrival-intl': {
        label: 'International Arrival',
        steps: [
          { id: 1, icon: '✈️', instruction_en: 'Follow signs in English and Japanese. Japan airports are very orderly — queue properly.', direction: 'straight', sign: { type: 'directional', text: 'ARRIVALS / 到着 →', color: 'green' }, landmark: null },
          { id: 2, icon: '🛂', instruction_en: 'Proceed to Immigration. Fill out the arrival card on the plane. Fingerprinting required for all non-Japanese visitors.', direction: 'straight', sign: { type: 'government', text: 'IMMIGRATION / 入国審査 →', color: 'green' }, landmark: null },
          { id: 3, icon: '🧳', instruction_en: 'Collect baggage, then proceed to Customs (green channel if nothing to declare).', direction: 'straight', sign: { type: 'baggage', text: 'BAGGAGE CLAIM / 手荷物受取 →', color: 'black-yellow' }, landmark: null },
          { id: 4, icon: '🚇', instruction_en: 'Take Narita Express (N\'EX) to Tokyo Station, or the Limousine Bus to hotels.', direction: 'down', sign: { type: 'train', text: "NARITA EXPRESS N'EX ↓", color: 'green' }, landmark: { name: "N'EX Train", emoji: '🚄', desc: 'White and red trains — tickets from vending machines or JR office' } },
        ]
      },
      'departure-intl': {
        label: 'Departure',
        steps: [
          { id: 1, icon: '🏢', instruction_en: 'Check in at your airline counter. Self-check-in kiosks are available for many airlines.', direction: 'straight', sign: { type: 'directional', text: 'CHECK-IN / チェックイン →', color: 'green' }, landmark: null },
          { id: 2, icon: '🔒', instruction_en: 'Proceed to Security (手荷物検査). Remove shoes, liquids, and electronics. Japan security is thorough.', direction: 'straight', sign: { type: 'security', text: 'SECURITY / 手荷物検査 →', color: 'green' }, landmark: null },
          { id: 3, icon: '🏛️', instruction_en: 'Proceed to Departure Immigration (出国審査). Have your passport ready.', direction: 'straight', sign: { type: 'government', text: 'DEPARTURE IMMIGRATION / 出国審査 →', color: 'green' }, landmark: null },
          { id: 4, icon: '🛍️', instruction_en: 'Duty-free shops and restaurants are after immigration. Gates are in the satellite buildings.', direction: 'straight', sign: { type: 'gates', text: 'GATES / 搭乗口 →', color: 'green' }, landmark: { name: 'Convenience Store', emoji: '🏪', desc: '7-Eleven or Lawson — convenient last-minute shopping and food before gates' } },
        ]
      }
    }
  },

  ORD: {
    name: "O'Hare International Airport",
    city: 'Chicago',
    country: 'USA',
    terminals: ['1', '2', '3', '5'],
    flows: {
      'arrival-intl': {
        label: 'International Arrival',
        steps: [
          { id: 1, icon: '✈️', instruction_en: 'International arrivals land in Terminal 5. Follow the blue and white ORD signs.', direction: 'straight', sign: { type: 'directional', text: 'ARRIVALS →', color: 'blue' }, landmark: null },
          { id: 2, icon: '🛂', instruction_en: 'US Customs and Border Protection checkpoint. APC kiosks for US citizens and eligible visitors.', direction: 'straight', sign: { type: 'government', text: 'U.S. CUSTOMS & BORDER PROTECTION →', color: 'blue' }, landmark: null },
          { id: 3, icon: '🧳', instruction_en: 'Baggage Claim in Terminal 5. Check screens for carousel number.', direction: 'straight', sign: { type: 'baggage', text: 'BAGGAGE CLAIM →', color: 'black-yellow' }, landmark: null },
          { id: 4, icon: '🚇', instruction_en: 'Take the CTA Blue Line train to downtown Chicago (about 45 min). Or take a taxi/rideshare.', direction: 'straight', sign: { type: 'train', text: 'CTA BLUE LINE →', color: 'blue' }, landmark: { name: 'CTA Blue Line Station', emoji: '🚇', desc: 'Blue and white Chicago Transit Authority signs — underground level' } },
        ]
      },
      'departure-intl': {
        label: 'Departure',
        steps: [
          { id: 1, icon: '🏢', instruction_en: 'International flights depart from Terminal 5. Other terminals for domestic.', direction: 'straight', sign: { type: 'directional', text: 'TERMINAL 5 DEPARTURES →', color: 'blue' }, landmark: null },
          { id: 2, icon: '🔒', instruction_en: 'TSA Security checkpoint. PreCheck lane available.', direction: 'straight', sign: { type: 'security', text: 'TSA SECURITY →', color: 'blue' }, landmark: null },
          { id: 3, icon: '🚇', instruction_en: 'Transfer between terminals via the Airport Transit System (ATS) — the elevated people mover.', direction: 'straight', sign: { type: 'train', text: 'AIRPORT TRANSIT SYSTEM (ATS) →', color: 'orange' }, landmark: { name: 'ATS Train', emoji: '🚇', desc: 'Orange and white automated train connecting all terminals — free to ride' } },
        ]
      }
    }
  },
};

export function getAirportNav(iata) {
  return AIRPORTS[iata] || null;
}

export function getAvailableAirports() {
  return Object.entries(AIRPORTS).map(([iata, data]) => ({
    iata,
    name: data.name,
    city: data.city,
    country: data.country,
  }));
}
