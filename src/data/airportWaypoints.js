// ─── Airport waypoint graph ───────────────────────────────────────────────────
// Each waypoint has: id, nameKey (→ LOC_NAMES), name_en (fallback), aliases[], icon, zone, terminal
// Routes connect waypoints with ordered step arrays.
// Step: { templateKey, params{}, direction, icon, sign?, landmark? }

export const WAYPOINTS = {

  // ── YYZ (Toronto Pearson) Terminal 1 ────────────────────────────────────────
  YYZ: {
    nodes: [
      { id:'yyz_intl_gate_area',   nameKey:null, name_en:'International Gates (D / E / F)',    aliases:['gate d','gate e','gate f','international gate','d gates','e gates','f gates','gate area'],        icon:'🛫', zone:'gates',         terminal:'1', lat:43.6804, lng:-79.6215 },
      { id:'yyz_gate_d',           nameKey:null, name_en:'Gates D (D1–D77)',                   aliases:['gate d','d1','d2','d3','d10','d20','d30','d42','d50','d77','gate d area'],                       icon:'🚪', zone:'gates_d',       terminal:'1', lat:43.6806, lng:-79.6232 },
      { id:'yyz_gate_e',           nameKey:null, name_en:'Gates E (E1–E74)',                   aliases:['gate e','e1','e10','e20','e30','e40','e50','e60','e68','e74','gate e area'],                     icon:'🚪', zone:'gates_e',       terminal:'1', lat:43.6802, lng:-79.6205 },
      { id:'yyz_gate_f',           nameKey:null, name_en:'Gates F (F71–F87)',                  aliases:['gate f','f71','f72','f80','f87','gate f area'],                                                   icon:'🚪', zone:'gates_f',       terminal:'1', lat:43.6798, lng:-79.6193 },
      { id:'yyz_security_a',       nameKey:'security', name_en:'Security Checkpoint (D & E)',  aliases:['security','screening','tsa','cbsa security','pre-board screening'],                              icon:'🔒', zone:'security',      terminal:'1', lat:43.6807, lng:-79.6220 },
      { id:'yyz_security_b',       nameKey:'security', name_en:'Security Checkpoint (F gates)',aliases:['security f','f security'],                                                                        icon:'🔒', zone:'security_f',    terminal:'1', lat:43.6800, lng:-79.6198 },
      { id:'yyz_checkin',          nameKey:'check_in', name_en:'Check-in Counters (Level 3)',  aliases:['check in','check-in','airline counter','ticket counter','departure level'],                       icon:'🏷️', zone:'check_in',      terminal:'1', lat:43.6813, lng:-79.6224 },
      { id:'yyz_immigration',      nameKey:'immigration', name_en:'CBSA Immigration',          aliases:['immigration','border','cbsa','passport control','border services','customs border'],              icon:'🛂', zone:'immigration',    terminal:'1', lat:43.6794, lng:-79.6226 },
      { id:'yyz_customs',          nameKey:'customs', name_en:'Customs Declaration',           aliases:['customs','declaration','duty','customs hall','declare'],                                          icon:'🏛️', zone:'customs',        terminal:'1', lat:43.6790, lng:-79.6221 },
      { id:'yyz_baggage_claim',    nameKey:'baggage_claim', name_en:'Baggage Claim',           aliases:['baggage','luggage','bags','carousel','suitcase','claim'],                                        icon:'🧳', zone:'baggage',        terminal:'1', lat:43.6792, lng:-79.6223 },
      { id:'yyz_arrivals_hall',    nameKey:'arrivals_hall', name_en:'Arrivals Hall (Level 1)', aliases:['arrivals hall','arrivals','exit','meeting point','pick up','pickup','level 1 exit'],              icon:'🚪', zone:'arrivals_hall',  terminal:'1', lat:43.6788, lng:-79.6218 },
      { id:'yyz_tim_security',     nameKey:'tim_hortons', name_en:'Tim Hortons (near Security)',aliases:['tim horton','tim hortons','tim','coffee','coffee shop security','tim near security'],            icon:'☕', zone:'pre_security',   terminal:'1', lat:43.6809, lng:-79.6221 },
      { id:'yyz_tim_arrivals',     nameKey:'tim_hortons', name_en:'Tim Hortons (Arrivals Hall)',aliases:['tim hortons arrivals','tim arrivals','coffee arrivals'],                                          icon:'☕', zone:'arrivals_hall',  terminal:'1', lat:43.6787, lng:-79.6216 },
      { id:'yyz_starbucks',        nameKey:'starbucks',  name_en:'Starbucks (post-security)',  aliases:['starbucks','latte','coffee gate area','green coffee'],                                            icon:'☕', zone:'gates',         terminal:'1', lat:43.6805, lng:-79.6211 },
      { id:'yyz_urban_eatery',     nameKey:'food_court', name_en:'The Urban Eatery (Food Court)',aliases:['urban eatery','food court','restaurant','food','eat','dining','food area'],                    icon:'🍽️', zone:'gates',         terminal:'1', lat:43.6804, lng:-79.6213 },
      { id:'yyz_duty_free',        nameKey:'duty_free',  name_en:'Duty Free Shops',            aliases:['duty free','duty-free','tax free','shopping','shop','liquor shop'],                              icon:'🛍️', zone:'gates',         terminal:'1', lat:43.6803, lng:-79.6209 },
      { id:'yyz_link_train',       nameKey:'link_train', name_en:'LINK Train (to Terminal 3)', aliases:['link train','link','terminal 3','t3 train','train terminal 3','link station'],                   icon:'🚆', zone:'ground',         terminal:'1', lat:43.6779, lng:-79.6215 },
      { id:'yyz_up_express',       nameKey:'up_express', name_en:'UP Express Train (downtown)',aliases:['up express','up train','downtown toronto','union station','city train','toronto train'],          icon:'🚇', zone:'ground',         terminal:'1', lat:43.6778, lng:-79.6230 },
      { id:'yyz_ground_transport', nameKey:'ground_transport', name_en:'Ground Transportation (Level 1)',aliases:['ground transport','taxi','bus','shuttle','rideshare','uber','lyft','car','cab'],        icon:'🚌', zone:'ground',         terminal:'1', lat:43.6777, lng:-79.6220 },
      { id:'yyz_info_desk',        nameKey:'information_desk', name_en:'Information Desk',     aliases:['information','info','help','info desk','information desk','lost'],                               icon:'ℹ️', zone:'general',        terminal:'1', lat:43.6811, lng:-79.6219 },
      { id:'yyz_t3_checkin',       nameKey:'check_in', name_en:'Terminal 3 Check-in',          aliases:['terminal 3','t3','terminal three','air transat','sunwing','t3 check-in'],                        icon:'🏢', zone:'check_in',      terminal:'3', lat:43.6752, lng:-79.6300 },
    ],

    routes: [
      // ── Arrivals flow ──────────────────────────────────────────────────────
      {
        from: 'yyz_intl_gate_area', to: 'yyz_immigration',
        steps: [
          { templateKey:'follow_signs',     params:{ dest:'Immigration / CBSA' },            direction:'straight', icon:'🚶', sign:{ type:'directional', text:'IMMIGRATION / CBSA →' } },
          { templateKey:'walk_long',        params:{},                                        direction:'straight', icon:'🚶', landmark:{ name:'Moving Walkways', emoji:'🚶', desc:'Flat floor conveyor belts — step on to travel faster' } },
          { templateKey:'take_escalator_down', params:{},                                    direction:'down',    icon:'🔽', sign:{ type:'directional', text:'ARRIVALS / IMMIGRATION ↓' } },
          { templateKey:'queue_at',         params:{ fac:'CBSA Immigration' },               direction:'straight', icon:'🛂', sign:{ type:'government', text:'CANADA BORDER SERVICES AGENCY', subtext:'CBSA — Blue lanes: Canadians/US. Red: all others' }, landmark:{ name:'Immigration Booths', emoji:'🛂', desc:'Officers in green/navy uniform at booths — blue lane for Canadian/US passport, red lane for all others' } },
          { templateKey:'fingerprint_scan', params:{},                                        direction:'straight', icon:'👆' },
          { templateKey:'have_passport_ready', params:{},                                     direction:'straight', icon:'📘' },
        ]
      },
      {
        from: 'yyz_immigration', to: 'yyz_baggage_claim',
        steps: [
          { templateKey:'follow_signs',     params:{ dest:'Baggage Claim' },                 direction:'straight', icon:'🚶', sign:{ type:'baggage', text:'BAGGAGE CLAIM →', subtext:'RÉCLAMATION DES BAGAGES' } },
          { templateKey:'collect_bags',     params:{ c:null },                               direction:'straight', icon:'🧳', landmark:{ name:'Baggage Carousel Screens', emoji:'🖥️', desc:'Overhead screens show your flight number and carousel number — find your flight, then go to that belt number' } },
        ]
      },
      {
        from: 'yyz_baggage_claim', to: 'yyz_customs',
        steps: [
          { templateKey:'follow_signs',     params:{ dest:'Customs Declaration' },           direction:'straight', icon:'🏛️', sign:{ type:'customs', text:'CUSTOMS / DOUANES →', color:'green' } },
          { templateKey:'declaration_card', params:{},                                        direction:'straight', icon:'📋' },
          { templateKey:'exit_through_green', params:{},                                      direction:'straight', icon:'🟢', landmark:{ name:'Green & Red Customs Channels', emoji:'🟢', desc:'Green channel (left) = nothing to declare. Red channel (right) = goods to declare. Officers may stop you in either' } },
        ]
      },
      {
        from: 'yyz_customs', to: 'yyz_arrivals_hall',
        steps: [
          { templateKey:'through_doors',    params:{ desc:'automatic sliding glass' },       direction:'straight', icon:'🚪', sign:{ type:'exit', text:'EXIT / SORTIE →', color:'green' } },
          { templateKey:'look_ahead',       params:{ what:'Arrivals Hall — you will see families and drivers waiting, and Tim Hortons on your left' }, direction:'straight', icon:'🎉', landmark:{ name:'Tim Hortons (Arrivals Level)', emoji:'☕', desc:'Red and brown Tim Hortons coffee shop — visible immediately as you exit. Great landmark to meet people' } },
        ]
      },
      {
        from: 'yyz_arrivals_hall', to: 'yyz_up_express',
        steps: [
          { templateKey:'follow_signs',     params:{ dest:'UP Express / Ground Transportation' }, direction:'straight', icon:'🚶', sign:{ type:'train', text:'UP EXPRESS / GROUND TRANSPORTATION →', color:'blue' } },
          { templateKey:'take_escalator_down', params:{},                                    direction:'down',    icon:'🔽', sign:{ type:'directional', text:'LEVEL 1 / GROUND TRANSPORT ↓' } },
          { templateKey:'look_ahead',       params:{ what:'UP Express ticket machines — blue and white kiosks. Buy a ticket before boarding' }, direction:'straight', icon:'🎫', landmark:{ name:'UP Express Station', emoji:'🚇', desc:'Blue "UP" logo. Train runs every 15 min. Takes 25 min to Union Station downtown. Tickets from kiosk or mobile app' } },
        ]
      },
      {
        from: 'yyz_arrivals_hall', to: 'yyz_link_train',
        steps: [
          { templateKey:'follow_signs',     params:{ dest:'LINK Train / Terminal 3' },       direction:'straight', icon:'🚆', sign:{ type:'train', text:'LINK TRAIN / TERMINAL 3 →', color:'red' } },
          { templateKey:'take_escalator_down', params:{},                                    direction:'down',    icon:'🔽' },
          { templateKey:'you_arrived',       params:{ dest:'LINK Train Platform (free — runs every few minutes)' }, direction:'straight', icon:'🚆', landmark:{ name:'LINK Train', emoji:'🚆', desc:'Red and white automated train — free to ride. Takes 5 min to Terminal 3' } },
        ]
      },
      {
        from: 'yyz_arrivals_hall', to: 'yyz_ground_transport',
        steps: [
          { templateKey:'follow_signs',     params:{ dest:'Ground Transportation' },         direction:'straight', icon:'🚌', sign:{ type:'directional', text:'GROUND TRANSPORTATION ↓', color:'blue' } },
          { templateKey:'take_escalator_down', params:{},                                    direction:'down',    icon:'🔽' },
          { templateKey:'look_ahead',       params:{ what:'taxi stands, bus bays, and ride-share pickup zones' }, direction:'straight', icon:'🚗', landmark:{ name:'Ground Transportation Level', emoji:'🚌', desc:'Taxis on left, buses in centre, ride-share (Uber/Lyft) in designated zone — check the app for exact zone letter' } },
        ]
      },

      // ── Departures flow ────────────────────────────────────────────────────
      {
        from: 'yyz_checkin', to: 'yyz_security_a',
        steps: [
          { templateKey:'follow_signs',     params:{ dest:'Security' },                      direction:'straight', icon:'🔒', sign:{ type:'security', text:'SECURITY / SÛRETÉ →' } },
          { templateKey:'landmark_turn_right', params:{ lm:'Tim Hortons (red logo)' },       direction:'right',   icon:'➡️', landmark:{ name:'Tim Hortons', emoji:'☕', desc:'Red and brown coffee shop — turn RIGHT here to reach Security' } },
          { templateKey:'join_security_line', params:{},                                      direction:'straight', icon:'🔒', sign:{ type:'security', text:'SECURITY SCREENING →', subtext:'Remove shoes, belts, jackets and laptops' } },
        ]
      },
      {
        from: 'yyz_tim_security', to: 'yyz_security_a',
        steps: [
          { templateKey:'turn_right',       params:{},                                        direction:'right',   icon:'➡️' },
          { templateKey:'walk_short',       params:{},                                        direction:'straight', icon:'🚶' },
          { templateKey:'join_security_line', params:{},                                      direction:'straight', icon:'🔒', sign:{ type:'security', text:'SECURITY / SÛRETÉ →', subtext:'CBSA Pre-Board Screening' } },
        ]
      },
      {
        from: 'yyz_security_a', to: 'yyz_gate_d',
        steps: [
          { templateKey:'go_straight',      params:{},                                        direction:'straight', icon:'🚶', sign:{ type:'gates', text:'GATES D → (D1–D77)' } },
          { templateKey:'walk_short',       params:{},                                        direction:'straight', icon:'🚶' },
          { templateKey:'gate_here',        params:{ gate:'D (check your boarding pass for exact gate number)' }, direction:'straight', icon:'🚪' },
        ]
      },
      {
        from: 'yyz_security_a', to: 'yyz_gate_e',
        steps: [
          { templateKey:'follow_signs',     params:{ dest:'Gates E' },                       direction:'straight', icon:'🚶', sign:{ type:'gates', text:'GATES E → (E1–E74)' } },
          { templateKey:'walk_past',        params:{ lm:'Urban Eatery food court (on your left)' }, direction:'straight', icon:'🚶', landmark:{ name:'Urban Eatery Food Court', emoji:'🍽️', desc:'Large open food court area with many restaurant stalls — keep walking past it to reach E gates' } },
          { templateKey:'walk_past',        params:{ lm:'Starbucks (green logo, on your right)' }, direction:'straight', icon:'🚶', landmark:{ name:'Starbucks', emoji:'☕', desc:'Green Starbucks sign on the right side — gates E are just ahead' } },
          { templateKey:'gate_here',        params:{ gate:'E (check your boarding pass for exact gate number)' }, direction:'straight', icon:'🚪' },
        ]
      },
      {
        from: 'yyz_security_a', to: 'yyz_gate_f',
        steps: [
          { templateKey:'follow_signs',     params:{ dest:'Gates F' },                       direction:'straight', icon:'🚶', sign:{ type:'gates', text:'GATES F → (F71–F87)' } },
          { templateKey:'walk_long',        params:{},                                        direction:'straight', icon:'🚶', landmark:{ name:'Moving Walkways', emoji:'🚶', desc:'Use the moving walkways — they carry you forward automatically' } },
          { templateKey:'take_escalator_up', params:{},                                      direction:'up',      icon:'🔼', sign:{ type:'directional', text:'GATES F ↑' } },
          { templateKey:'gate_here',        params:{ gate:'F (check your boarding pass for exact gate number)' }, direction:'straight', icon:'🚪' },
        ]
      },

      // ── Gate to gate ───────────────────────────────────────────────────────
      {
        from: 'yyz_gate_d', to: 'yyz_gate_e',
        steps: [
          { templateKey:'follow_signs',     params:{ dest:'Gates E' },                       direction:'straight', icon:'🚶', sign:{ type:'gates', text:'GATES E →' } },
          { templateKey:'walk_past',        params:{ lm:'Urban Eatery food court' },         direction:'straight', icon:'🚶', landmark:{ name:'Urban Eatery', emoji:'🍽️', desc:'Large food court — pass it on your left and continue to Gate E' } },
          { templateKey:'gate_here',        params:{ gate:'E area' },                        direction:'straight', icon:'🚪' },
        ]
      },
      {
        from: 'yyz_gate_e', to: 'yyz_gate_d',
        steps: [
          { templateKey:'follow_signs',     params:{ dest:'Gates D' },                       direction:'straight', icon:'🚶', sign:{ type:'gates', text:'← GATES D' } },
          { templateKey:'walk_past',        params:{ lm:'Starbucks on your left' },          direction:'straight', icon:'🚶' },
          { templateKey:'gate_here',        params:{ gate:'D area' },                        direction:'straight', icon:'🚪' },
        ]
      },
      {
        from: 'yyz_starbucks', to: 'yyz_gate_e',
        steps: [
          { templateKey:'go_straight',      params:{},                                        direction:'straight', icon:'🚶' },
          { templateKey:'gate_here',        params:{ gate:'E — the E gates are directly ahead of Starbucks' }, direction:'straight', icon:'🚪' },
        ]
      },
      {
        from: 'yyz_starbucks', to: 'yyz_gate_d',
        steps: [
          { templateKey:'turn_left',        params:{},                                        direction:'left',    icon:'⬅️', sign:{ type:'gates', text:'← GATES D' } },
          { templateKey:'walk_short',       params:{},                                        direction:'straight', icon:'🚶' },
          { templateKey:'gate_here',        params:{ gate:'D' },                             direction:'straight', icon:'🚪' },
        ]
      },
      {
        from: 'yyz_urban_eatery', to: 'yyz_gate_d',
        steps: [
          { templateKey:'turn_left',        params:{},                                        direction:'left',    icon:'⬅️', sign:{ type:'gates', text:'← GATES D' } },
          { templateKey:'walk_short',       params:{},                                        direction:'straight', icon:'🚶' },
          { templateKey:'gate_here',        params:{ gate:'D' },                             direction:'straight', icon:'🚪' },
        ]
      },
      {
        from: 'yyz_urban_eatery', to: 'yyz_gate_e',
        steps: [
          { templateKey:'go_straight',      params:{},                                        direction:'straight', icon:'🚶' },
          { templateKey:'walk_short',       params:{},                                        direction:'straight', icon:'🚶' },
          { templateKey:'gate_here',        params:{ gate:'E — just past the Starbucks' },   direction:'straight', icon:'🚪' },
        ]
      },
      {
        from: 'yyz_duty_free', to: 'yyz_gate_d',
        steps: [
          { templateKey:'turn_right',       params:{},                                        direction:'right',   icon:'➡️', sign:{ type:'gates', text:'GATES D →' } },
          { templateKey:'gate_here',        params:{ gate:'D' },                             direction:'straight', icon:'🚪' },
        ]
      },

      // ── Connections ────────────────────────────────────────────────────────
      {
        from: 'yyz_intl_gate_area', to: 'yyz_security_a',
        steps: [
          { templateKey:'follow_signs',     params:{ dest:'Connections Security' },          direction:'straight', icon:'🔒', sign:{ type:'directional', text:'CONNECTIONS / CORRESPONDANCES →' } },
          { templateKey:'walk_long',        params:{},                                        direction:'straight', icon:'🚶', landmark:{ name:'Connections Sign', emoji:'🔄', desc:'Look for the yellow "CONNECTIONS" sign — do NOT go to baggage claim' } },
          { templateKey:'join_security_line', params:{},                                      direction:'straight', icon:'🔒' },
        ]
      },
      {
        from: 'yyz_gate_area', to: 'yyz_link_train',
        steps: [
          { templateKey:'take_escalator_down', params:{},                                    direction:'down',    icon:'🔽', sign:{ type:'directional', text:'GROUND LEVEL / LINK TRAIN ↓' } },
          { templateKey:'follow_signs',     params:{ dest:'LINK Train / Terminal 3' },       direction:'straight', icon:'🚆', sign:{ type:'train', text:'LINK TRAIN → TERMINAL 3', color:'red' } },
          { templateKey:'ride_to_terminal', params:{ t:'Terminal 3' },                       direction:'straight', icon:'🚆', landmark:{ name:'LINK Train', emoji:'🚆', desc:'Red and white automated train — free. Runs every few minutes between T1 and T3' } },
        ]
      },
    ]
  },

  // ── JFK Terminal 4 (most international flights) ──────────────────────────────
  JFK: {
    nodes: [
      { id:'jfk_gate_area',      nameKey:null, name_en:'Departure Gates (T4)',     aliases:['gate','gates t4','gate a','gate b','international gate'],                                             icon:'🛫', zone:'gates',       terminal:'4' },
      { id:'jfk_security',       nameKey:'security', name_en:'TSA Security (T4)',  aliases:['security','tsa','screening','checkpoint'],                                                            icon:'🔒', zone:'security',    terminal:'4' },
      { id:'jfk_checkin',        nameKey:'check_in', name_en:'Check-in (T4)',      aliases:['check in','check-in','counter','airline desk'],                                                       icon:'🏷️', zone:'check_in',    terminal:'4' },
      { id:'jfk_immigration',    nameKey:'immigration', name_en:'US CBP / Immigration', aliases:['immigration','cbp','border','customs border protection','passport','apc'],                       icon:'🛂', zone:'immigration',  terminal:'4' },
      { id:'jfk_apc',            nameKey:null, name_en:'APC Kiosk (automated passport)',  aliases:['apc','automated passport','kiosk','global entry','nexus'],                                   icon:'💻', zone:'immigration',  terminal:'4' },
      { id:'jfk_baggage',        nameKey:'baggage_claim', name_en:'Baggage Claim',  aliases:['baggage','luggage','bags','carousel','belt'],                                                        icon:'🧳', zone:'baggage',      terminal:'4' },
      { id:'jfk_customs',        nameKey:'customs', name_en:'US Customs Declaration', aliases:['customs','declaration','customs exit'],                                                            icon:'🏛️', zone:'customs',      terminal:'4' },
      { id:'jfk_arrivals',       nameKey:'arrivals_hall', name_en:'Arrivals Hall', aliases:['arrivals','exit','meeting point','pickup'],                                                           icon:'🚪', zone:'arrivals',     terminal:'4' },
      { id:'jfk_airtrain',       nameKey:null, name_en:'AirTrain JFK',             aliases:['airtrain','air train','subway','jamaica','subway station','train','rail'],                            icon:'🚇', zone:'ground',       terminal:'4' },
      { id:'jfk_mcdonalds',      nameKey:'mcdonalds', name_en:"McDonald's (inside T4)", aliases:["mcdonald's","mcdonalds","burger","golden arches","fast food"],                                   icon:'🍔', zone:'gates',        terminal:'4' },
      { id:'jfk_starbucks',      nameKey:'starbucks', name_en:'Starbucks (pre-security)', aliases:['starbucks','coffee jfk'],                                                                      icon:'☕', zone:'pre_security', terminal:'4' },
    ],
    routes: [
      { from:'jfk_checkin', to:'jfk_security', steps: [
        { templateKey:'follow_signs', params:{ dest:'Security Checkpoint' }, direction:'straight', icon:'🔒', sign:{ type:'security', text:'TSA SECURITY →' } },
        { templateKey:'join_security_line', params:{}, direction:'straight', icon:'🔒', landmark:{ name:'TSA Security Lane', emoji:'🔒', desc:'Blue and white TSA sign. PreCheck lane has ✓ symbol — faster if you have PreCheck status' } },
      ]},
      { from:'jfk_security', to:'jfk_gate_area', steps: [
        { templateKey:'go_straight', params:{}, direction:'straight', icon:'🚶', sign:{ type:'gates', text:'ALL GATES →' } },
        { templateKey:'walk_long', params:{}, direction:'straight', icon:'🚶', landmark:{ name:"McDonald's (yellow M)", emoji:'🍔', desc:'Golden arches on your right — gates are past here' } },
        { templateKey:'gate_here', params:{ gate:'(your gate number from boarding pass)' }, direction:'straight', icon:'🚪' },
      ]},
      { from:'jfk_intl_gate', to:'jfk_immigration', steps: [
        { templateKey:'follow_signs', params:{ dest:'US CBP / Immigration' }, direction:'straight', icon:'🛂', sign:{ type:'government', text:'U.S. CUSTOMS & BORDER PROTECTION →' } },
        { templateKey:'use_kiosk', params:{ name:'APC (Automated Passport Control)' }, direction:'straight', icon:'💻', landmark:{ name:'APC Kiosk Machines', emoji:'💻', desc:'White touchscreen machines — eligible: US citizens, green card holders, VWP countries. Scan passport, photo, answer questions. Fast lane after' } },
        { templateKey:'have_passport_ready', params:{}, direction:'straight', icon:'📘' },
      ]},
      { from:'jfk_immigration', to:'jfk_baggage', steps: [
        { templateKey:'collect_bags', params:{ c:null }, direction:'straight', icon:'🧳', sign:{ type:'baggage', text:'BAGGAGE CLAIM →' }, landmark:{ name:'Carousel Screens', emoji:'🖥️', desc:'Look up at the overhead screens — find your flight number and note the carousel number' } },
      ]},
      { from:'jfk_baggage', to:'jfk_customs', steps: [
        { templateKey:'declaration_card', params:{}, direction:'straight', icon:'📋' },
        { templateKey:'exit_through_green', params:{}, direction:'straight', icon:'🟢', landmark:{ name:'CBP Exit Counters', emoji:'🏛️', desc:'Hand your declaration form to the officer — answer questions honestly' } },
      ]},
      { from:'jfk_arrivals', to:'jfk_airtrain', steps: [
        { templateKey:'follow_signs', params:{ dest:'AirTrain JFK' }, direction:'straight', icon:'🚇', sign:{ type:'train', text:'AIRTRAIN JFK →', color:'blue' } },
        { templateKey:'walk_short', params:{}, direction:'straight', icon:'🚶' },
        { templateKey:'you_arrived', params:{ dest:'AirTrain Station. Take the train to Jamaica (for LIRR/subway) or Howard Beach (for A train)' }, direction:'straight', icon:'🚇', landmark:{ name:'AirTrain Station', emoji:'🚇', desc:'Yellow AirTrain — free between terminals, paid ($8.50) to subway stations. Runs 24/7. Jamaica = LIRR and E/J/Z subway. Howard Beach = A train' } },
      ]},
    ]
  },

  // ── LHR Terminal 5 (British Airways hub) ─────────────────────────────────────
  LHR: {
    nodes: [
      { id:'lhr_gate_area',    nameKey:null, name_en:'Departure Gates (T5)',        aliases:['gate','gates','gate a','gate b','gate c'],                                                              icon:'🛫', zone:'gates',        terminal:'5' },
      { id:'lhr_security',     nameKey:'security', name_en:'Security (T5)',          aliases:['security','screening','checkpoint'],                                                                   icon:'🔒', zone:'security',     terminal:'5' },
      { id:'lhr_checkin',      nameKey:'check_in', name_en:'Check-in (T5)',          aliases:['check in','check-in','counter','ba desk','british airways'],                                          icon:'🏷️', zone:'check_in',     terminal:'5' },
      { id:'lhr_immigration',  nameKey:'immigration', name_en:'UK Border Force',     aliases:['immigration','border','passport','uk border','e-gate','egate'],                                       icon:'🛂', zone:'immigration',   terminal:'5' },
      { id:'lhr_baggage',      nameKey:'baggage_claim', name_en:'Baggage Reclaim',   aliases:['baggage','luggage','bags','carousel','reclaim','belt'],                                               icon:'🧳', zone:'baggage',       terminal:'5' },
      { id:'lhr_customs',      nameKey:'customs', name_en:'Customs (T5)',             aliases:['customs','declaration','green channel','nothing to declare'],                                         icon:'🏛️', zone:'customs',       terminal:'5' },
      { id:'lhr_arrivals',     nameKey:'arrivals_hall', name_en:'Arrivals (T5)',      aliases:['arrivals','exit','pick up','meeting point'],                                                          icon:'🚪', zone:'arrivals',      terminal:'5' },
      { id:'lhr_duty_free',    nameKey:'duty_free', name_en:'World Duty Free',        aliases:['duty free','world duty free','shopping','shops'],                                                    icon:'🛍️', zone:'gates',         terminal:'5' },
      { id:'lhr_underground',  nameKey:null, name_en:'London Underground / Elizabeth Line', aliases:['tube','underground','metro','elizabeth line','heathrow express','train','rail','london'],      icon:'🚇', zone:'ground',        terminal:'5' },
      { id:'lhr_starbucks',    nameKey:'starbucks', name_en:'Starbucks (departure)',  aliases:['starbucks','coffee lhr'],                                                                             icon:'☕', zone:'pre_security',  terminal:'5' },
      { id:'lhr_info',         nameKey:'information_desk', name_en:'Information Desk',aliases:['information','info','help'],                                                                          icon:'ℹ️', zone:'general',       terminal:'5' },
    ],
    routes: [
      { from:'lhr_checkin', to:'lhr_security', steps: [
        { templateKey:'follow_signs', params:{ dest:'Security' }, direction:'straight', icon:'🔒', sign:{ type:'security', text:'SECURITY →', color:'purple' } },
        { templateKey:'join_security_line', params:{}, direction:'straight', icon:'🔒', landmark:{ name:'Security', emoji:'🔒', desc:'All liquids in clear bag (100ml max). Remove electronics. Fast track lane if you paid for it' } },
      ]},
      { from:'lhr_security', to:'lhr_duty_free', steps: [
        { templateKey:'go_straight', params:{}, direction:'straight', icon:'🚶' },
        { templateKey:'walk_past', params:{ lm:'World Duty Free (large blue and purple store ahead)' }, direction:'straight', icon:'🛍️', landmark:{ name:'World Duty Free', emoji:'🛍️', desc:'Large blue/purple sign — massive duty-free store. Walk through or around it to reach your gate' } },
      ]},
      { from:'lhr_duty_free', to:'lhr_gate_area', steps: [
        { templateKey:'follow_signs', params:{ dest:'Gates' }, direction:'straight', icon:'🚪', sign:{ type:'gates', text:'DEPARTURE GATES →', color:'purple' } },
        { templateKey:'gate_here', params:{ gate:'(see boarding pass)' }, direction:'straight', icon:'🚪' },
      ]},
      { from:'lhr_intl_gate', to:'lhr_immigration', steps: [
        { templateKey:'follow_signs', params:{ dest:'UK Border Control' }, direction:'straight', icon:'🛂', sign:{ type:'government', text:'UK BORDER FORCE / PASSPORT CONTROL →', color:'purple' } },
        { templateKey:'use_kiosk', params:{ name:'eGate (automated)' }, direction:'straight', icon:'💻', landmark:{ name:'eGates', emoji:'🔄', desc:'Automated passport gates — scan the photo page, look at camera. Eligible: UK, EU, US, Canada, Australia passports. If gates are full, use the manual queue (any passport)' } },
        { templateKey:'have_passport_ready', params:{}, direction:'straight', icon:'📘' },
      ]},
      { from:'lhr_immigration', to:'lhr_baggage', steps: [
        { templateKey:'collect_bags', params:{ c:null }, direction:'straight', icon:'🧳', sign:{ type:'baggage', text:'BAGGAGE RECLAIM →', subtext:'Check screen for belt number' } },
      ]},
      { from:'lhr_baggage', to:'lhr_customs', steps: [
        { templateKey:'exit_through_green', params:{}, direction:'straight', icon:'🟢', sign:{ type:'customs', text:'NOTHING TO DECLARE / GREEN CHANNEL →', color:'green' } },
      ]},
      { from:'lhr_arrivals', to:'lhr_underground', steps: [
        { templateKey:'follow_signs', params:{ dest:'London Underground / Elizabeth Line' }, direction:'straight', icon:'🚇', sign:{ type:'train', text:'LONDON UNDERGROUND ↓', color:'red' } },
        { templateKey:'take_escalator_down', params:{}, direction:'down', icon:'🔽' },
        { templateKey:'you_arrived', params:{ dest:'Heathrow Underground Station' }, direction:'straight', icon:'🚇', landmark:{ name:'London Underground', emoji:'🚇', desc:'Red circle + blue bar (roundel) logo. Piccadilly line = dark blue, cheapest. Elizabeth line = purple, fastest. Buy Oyster card or use contactless card' } },
      ]},
    ]
  },

  // ── DXB Terminal 3 (Emirates hub) ─────────────────────────────────────────────
  DXB: {
    nodes: [
      { id:'dxb_gate_area',    nameKey:null, name_en:'Departure Gates (T3)',        aliases:['gate','gates','concourse a','concourse b','concourse c'],                                              icon:'🛫', zone:'gates',        terminal:'3' },
      { id:'dxb_security',     nameKey:'security', name_en:'Security & Immigration (T3)', aliases:['security','immigration out','departure immigration','passport control depart'],                icon:'🔒', zone:'security',     terminal:'3' },
      { id:'dxb_checkin',      nameKey:'check_in', name_en:'Check-in (T3)',          aliases:['check in','check-in','emirates counter','airline desk'],                                              icon:'🏷️', zone:'check_in',     terminal:'3' },
      { id:'dxb_immigration',  nameKey:'immigration', name_en:'Arrival Immigration (T3)', aliases:['immigration','arrive','passport','border','uae border','ica'],                                  icon:'🛂', zone:'immigration',   terminal:'3' },
      { id:'dxb_baggage',      nameKey:'baggage_claim', name_en:'Baggage Claim (T3)', aliases:['baggage','luggage','bags','carousel','belt','claim'],                                               icon:'🧳', zone:'baggage',       terminal:'3' },
      { id:'dxb_customs',      nameKey:'customs', name_en:'Customs (T3)',             aliases:['customs','declaration','green','nothing to declare'],                                                icon:'🏛️', zone:'customs',       terminal:'3' },
      { id:'dxb_arrivals',     nameKey:'arrivals_hall', name_en:'Arrivals Hall (T3)', aliases:['arrivals','exit','meeting point','pickup','taxi'],                                                   icon:'🚪', zone:'arrivals',      terminal:'3' },
      { id:'dxb_duty_free',    nameKey:'duty_free', name_en:'Dubai Duty Free',        aliases:['duty free','dubai duty free','shopping','gold souk','perfume'],                                     icon:'🛍️', zone:'gates',         terminal:'3' },
      { id:'dxb_metro',        nameKey:null, name_en:'Dubai Metro (Red Line)',        aliases:['metro','dubai metro','red line','train','rail','rapid transit'],                                     icon:'🚇', zone:'ground',        terminal:'3' },
      { id:'dxb_starbucks',    nameKey:'starbucks', name_en:'Starbucks (T3)',          aliases:['starbucks','coffee dxb','cafe'],                                                                    icon:'☕', zone:'general',       terminal:'3' },
    ],
    routes: [
      { from:'dxb_checkin', to:'dxb_security', steps: [
        { templateKey:'follow_signs', params:{ dest:'Security / Departure Immigration' }, direction:'straight', icon:'🔒', sign:{ type:'security', text:'SECURITY / الأمن →' } },
        { templateKey:'join_security_line', params:{}, direction:'straight', icon:'🔒', landmark:{ name:'Security & Passport Control', emoji:'🔒', desc:'DXB has combined security + passport control at departure. Remove shoes, liquids in clear bag. Passport stamped here before you enter gates' } },
      ]},
      { from:'dxb_security', to:'dxb_gate_area', steps: [
        { templateKey:'follow_signs', params:{ dest:'Duty Free & Gates' }, direction:'straight', icon:'🛍️', sign:{ type:'directional', text:'DUBAI DUTY FREE / GATES →' } },
        { templateKey:'walk_past', params:{ lm:'Dubai Duty Free (huge gold and navy shopping area)' }, direction:'straight', icon:'🚶', landmark:{ name:'Dubai Duty Free', emoji:'🛍️', desc:'Massive gold and navy duty-free — world famous for watches, gold, perfume. Gates are beyond. Allow extra time, DXB is very large' } },
        { templateKey:'gate_here', params:{ gate:'(check boarding pass — Concourse A, B, or C)' }, direction:'straight', icon:'🚪' },
      ]},
      { from:'dxb_intl_gate', to:'dxb_immigration', steps: [
        { templateKey:'follow_signs', params:{ dest:'Immigration / الجوازات' }, direction:'straight', icon:'🛂', sign:{ type:'government', text:'IMMIGRATION / الجوازات →', color:'green' } },
        { templateKey:'use_kiosk', params:{ name:'e-Gate (for UAE residents and eligible nationalities)' }, direction:'straight', icon:'💻', landmark:{ name:'UAE e-Gates', emoji:'💻', desc:'UAE residents can use automated e-Gate kiosks. Visitors join the manual queue — officers in white UAE uniform' } },
        { templateKey:'fingerprint_scan', params:{}, direction:'straight', icon:'👆', landmark:{ name:'Biometric Scan', emoji:'👆', desc:'First-time visitors must register fingerprints of both hands and take a photo — this is normal and required by UAE law' } },
        { templateKey:'have_passport_ready', params:{}, direction:'straight', icon:'📘' },
      ]},
      { from:'dxb_immigration', to:'dxb_baggage', steps: [
        { templateKey:'collect_bags', params:{ c:null }, direction:'straight', icon:'🧳', sign:{ type:'baggage', text:'BAGGAGE CLAIM / استلام الأمتعة →' } },
      ]},
      { from:'dxb_baggage', to:'dxb_customs', steps: [
        { templateKey:'exit_through_green', params:{}, direction:'straight', icon:'🟢', sign:{ type:'customs', text:'GREEN CHANNEL / القناة الخضراء →', color:'green' } },
      ]},
      { from:'dxb_arrivals', to:'dxb_metro', steps: [
        { templateKey:'follow_signs', params:{ dest:'Dubai Metro / المترو' }, direction:'down', icon:'🚇', sign:{ type:'train', text:'DUBAI METRO ↓', color:'red' } },
        { templateKey:'take_escalator_down', params:{}, direction:'down', icon:'🔽' },
        { templateKey:'you_arrived', params:{ dest:'Dubai Metro Station — Red Line' }, direction:'straight', icon:'🚇', landmark:{ name:'Dubai Metro', emoji:'🚇', desc:'Driverless automated train. Buy a Nol card (reloadable) from the machine. Red Line takes you to downtown Dubai and Mall of the Emirates' } },
      ]},
    ]
  },

  // ── SIN Changi (single terminal area, T1-T4) ──────────────────────────────────
  SIN: {
    nodes: [
      { id:'sin_gate_area',    nameKey:null, name_en:'Departure Gates',             aliases:['gate','gates'],                                                                                        icon:'🛫', zone:'gates',        terminal:'1' },
      { id:'sin_security',     nameKey:'security', name_en:'Security & Immigration', aliases:['security','immigration','passport','screening'],                                                     icon:'🔒', zone:'security',     terminal:'1' },
      { id:'sin_checkin',      nameKey:'check_in', name_en:'Check-in Hall',          aliases:['check in','check-in','counter'],                                                                      icon:'🏷️', zone:'check_in',     terminal:'1' },
      { id:'sin_immigration',  nameKey:'immigration', name_en:'ICA Immigration',     aliases:['immigration','border','passport','ica'],                                                              icon:'🛂', zone:'immigration',   terminal:'1' },
      { id:'sin_baggage',      nameKey:'baggage_claim', name_en:'Baggage Claim',     aliases:['baggage','luggage','bags','belt','carousel'],                                                         icon:'🧳', zone:'baggage',       terminal:'1' },
      { id:'sin_customs',      nameKey:'customs', name_en:'Customs',                 aliases:['customs','declaration','green channel'],                                                              icon:'🏛️', zone:'customs',       terminal:'1' },
      { id:'sin_arrivals',     nameKey:'arrivals_hall', name_en:'Arrivals Hall',     aliases:['arrivals','exit','pickup'],                                                                           icon:'🚪', zone:'arrivals',      terminal:'1' },
      { id:'sin_mrt',          nameKey:null, name_en:'MRT Station (Changi Airport)',  aliases:['mrt','train','rail','city','downtown singapore'],                                                    icon:'🚇', zone:'ground',        terminal:'1' },
      { id:'sin_jewel',        nameKey:null, name_en:'Jewel Changi (HSBC Rain Vortex)',aliases:['jewel','jewel changi','rain vortex','waterfall','shopping changi'],                               icon:'🌿', zone:'general',       terminal:'1' },
      { id:'sin_butterfly',    nameKey:null, name_en:'Butterfly Garden (T3)',         aliases:['butterfly garden','butterfly','garden','t3 garden'],                                                icon:'🦋', zone:'gates',         terminal:'3' },
    ],
    routes: [
      { from:'sin_checkin', to:'sin_security', steps: [
        { templateKey:'follow_signs', params:{ dest:'Security & Departure Immigration' }, direction:'straight', icon:'🔒', sign:{ type:'security', text:'SECURITY / IMMIGRATION →', color:'green' } },
        { templateKey:'join_security_line', params:{}, direction:'straight', icon:'🔒' },
        { templateKey:'have_passport_ready', params:{}, direction:'straight', icon:'📘', landmark:{ name:'ICA Departure Immigration', emoji:'🛂', desc:'Automated gates for Singapore citizens. Manual queue for visitors — very fast and efficient at Changi' } },
      ]},
      { from:'sin_security', to:'sin_gate_area', steps: [
        { templateKey:'follow_signs', params:{ dest:'Gates' }, direction:'straight', icon:'🚪', sign:{ type:'gates', text:'DEPARTURE GATES →', color:'green' } },
        { templateKey:'walk_short', params:{}, direction:'straight', icon:'🚶' },
        { templateKey:'gate_here', params:{ gate:'(see boarding pass)' }, direction:'straight', icon:'🚪' },
      ]},
      { from:'sin_arrivals', to:'sin_mrt', steps: [
        { templateKey:'follow_signs', params:{ dest:'MRT Train' }, direction:'down', icon:'🚇', sign:{ type:'train', text:'MRT TRAIN / SKYTRAIN ↓', color:'green' } },
        { templateKey:'take_escalator_down', params:{}, direction:'down', icon:'🔽' },
        { templateKey:'you_arrived', params:{ dest:'Changi Airport MRT Station' }, direction:'straight', icon:'🚇', landmark:{ name:'MRT Station', emoji:'🚇', desc:'Red circle NSL line. Runs to Tanah Merah where you change for City Hall. EZ-Link card from machine, or use contactless bank card' } },
      ]},
    ]
  },
};

export function getWaypoints(iata) {
  return WAYPOINTS[iata] || null;
}
