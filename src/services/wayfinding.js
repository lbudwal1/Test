import { WAYPOINTS } from '../data/airportWaypoints.js';
import { renderStep, locName, LOC_NAMES } from '../i18n/navTemplates.js';

// ─── Fuzzy search for a waypoint ──────────────────────────────────────────────
// Returns ranked list of { node, score } for user query
export function searchWaypoints(airportIata, query) {
  const data = WAYPOINTS[airportIata];
  if (!data) return [];

  const q = query.toLowerCase().trim();
  if (!q || q.length < 2) return [];

  // Normalize gate queries: "gate d42" → ["gate d", "d42", "d 42"]
  const gateMatch = q.match(/^(?:gate\s*)?([a-f])\s*(\d+)$/i);
  const zoneMatch  = q.match(/^gates?\s*([a-f])$/i);

  const results = [];

  for (const node of data.nodes) {
    let score = 0;

    // Exact alias match
    for (const alias of node.aliases) {
      const a = alias.toLowerCase();
      if (a === q) { score = 100; break; }
      if (a.includes(q) || q.includes(a)) { score = Math.max(score, 70); }
      // Partial word overlap
      const qWords = q.split(/\s+/);
      const aWords = a.split(/\s+/);
      const overlap = qWords.filter(w => aWords.some(aw => aw.includes(w) || w.includes(aw)));
      if (overlap.length > 0) score = Math.max(score, 40 + overlap.length * 10);
    }

    // Name match
    const name = node.name_en.toLowerCase();
    if (name.includes(q)) score = Math.max(score, 60);
    if (name.startsWith(q)) score = Math.max(score, 80);

    // Gate zone match: "d42" → zones gates_d
    if (gateMatch) {
      const letter = gateMatch[1].toLowerCase();
      if (node.zone === `gates_${letter}` || node.zone === 'gates') score = Math.max(score, 85);
    }
    if (zoneMatch) {
      const letter = zoneMatch[1].toLowerCase();
      if (node.zone === `gates_${letter}`) score = Math.max(score, 90);
    }

    // Zone keyword boosts
    if ((q.includes('coffee') || q.includes('cafe')) && (node.id.includes('tim') || node.id.includes('starbucks'))) score = Math.max(score, 75);
    if ((q.includes('food') || q.includes('eat') || q.includes('restaurant')) && node.id.includes('eatery')) score = Math.max(score, 75);
    if ((q.includes('train') || q.includes('metro') || q.includes('subway') || q.includes('rail')) && (node.zone === 'ground')) score = Math.max(score, 65);
    if ((q.includes('exit') || q.includes('out') || q.includes('leave')) && node.zone === 'arrivals_hall') score = Math.max(score, 65);

    if (score > 0) results.push({ node, score });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 6);
}

// ─── Route lookup ──────────────────────────────────────────────────────────────
// Finds the best route from fromId → toId using direct match then BFS
export function getRoute(airportIata, fromId, toId) {
  const data = WAYPOINTS[airportIata];
  if (!data) return null;

  // Normalize IDs: gate zone collapses (gate_d42 → yyz_gate_d etc.)
  const resolvedFrom = resolveZone(fromId, data);
  const resolvedTo   = resolveZone(toId, data);

  if (!resolvedFrom || !resolvedTo) return null;
  if (resolvedFrom === resolvedTo) return [];

  // Try direct route
  const direct = findDirectRoute(data, resolvedFrom, resolvedTo);
  if (direct) return enrichSteps(direct.steps, data, resolvedFrom, resolvedTo);

  // Try reverse then flip
  const reverse = findDirectRoute(data, resolvedTo, resolvedFrom);
  if (reverse) {
    const flipped = [...reverse.steps].reverse().map(s => flipDirection(s));
    return enrichSteps(flipped, data, resolvedFrom, resolvedTo);
  }

  // BFS through routes
  const bfsResult = bfs(data, resolvedFrom, resolvedTo);
  if (bfsResult) return enrichSteps(bfsResult, data, resolvedFrom, resolvedTo);

  return null;
}

function resolveZone(id, data) {
  if (data.nodes.find(n => n.id === id)) return id;

  // Try to match partial: if id contains 'gate_d' → find gates_d node
  const node = data.nodes.find(n =>
    n.id === id ||
    n.zone === id ||
    n.aliases.some(a => a.toLowerCase() === id.toLowerCase())
  );
  return node?.id || null;
}

function findDirectRoute(data, fromId, toId) {
  return data.routes?.find(r =>
    r.from === fromId && r.to === toId
  ) || null;
}

function bfs(data, startId, endId) {
  // Build adjacency from routes
  const adj = {};
  for (const route of (data.routes || [])) {
    if (!adj[route.from]) adj[route.from] = [];
    adj[route.from].push({ to: route.to, steps: route.steps });
    // Bi-directional (reversed)
    if (!adj[route.to]) adj[route.to] = [];
    adj[route.to].push({ to: route.from, steps: [...route.steps].reverse().map(flipDirection) });
  }

  const visited = new Set([startId]);
  const queue = [{ id: startId, steps: [] }];

  while (queue.length > 0) {
    const { id, steps } = queue.shift();
    const neighbors = adj[id] || [];

    for (const { to, steps: edgeSteps } of neighbors) {
      if (visited.has(to)) continue;
      const newSteps = [...steps, ...edgeSteps];
      if (to === endId) return newSteps;
      visited.add(to);
      queue.push({ id: to, steps: newSteps });
    }
  }

  return null;
}

function flipDirection(step) {
  const flip = { left: 'right', right: 'left', up: 'down', down: 'up', straight: 'straight' };
  const flipIcon = { '⬅️': '➡️', '➡️': '⬅️', '🔽': '🔼', '🔼': '🔽' };
  return {
    ...step,
    direction: flip[step.direction] || step.direction,
    icon: flipIcon[step.icon] || step.icon,
  };
}

function enrichSteps(steps, data, fromId, toId) {
  // Add a preamble "You are at X" and final "arrived at Y" if not present
  const fromNode = data.nodes.find(n => n.id === fromId);
  const toNode   = data.nodes.find(n => n.id === toId);
  const result = [...steps];

  if (toNode && result.length > 0) {
    const last = result[result.length - 1];
    if (!last.templateKey?.includes('you_arrived') && !last.templateKey?.includes('gate_here')) {
      result.push({
        templateKey: 'you_arrived',
        params: { dest: toNode.name_en },
        direction: 'straight',
        icon: '✅',
      });
    }
  }

  return result;
}

// ─── Translate a full set of steps ─────────────────────────────────────────────
export function translateSteps(steps, lang) {
  return steps.map(step => ({
    ...step,
    instruction: renderStep(step.templateKey, translateParams(step.params || {}, lang), lang),
  }));
}

function translateParams(params, lang) {
  const out = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === null || v === undefined) { out[k] = v; continue; }
    // If the value is a LOC_NAMES key, translate it
    if (LOC_NAMES[v]) {
      out[k] = locName(v, lang);
    } else {
      out[k] = v; // pass through as-is (already plain text)
    }
  }
  return out;
}

// ─── Haversine distance in metres ─────────────────────────────────────────────
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = x => x * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Find the nearest waypoint node to a GPS position ─────────────────────────
// Returns { node, distanceMeters } or null if no nodes have coordinates.
export function getNearestWaypoint(airportIata, lat, lng) {
  const data = WAYPOINTS[airportIata];
  if (!data) return null;
  let best = null;
  let bestDist = Infinity;
  for (const node of data.nodes) {
    if (node.lat == null || node.lng == null) continue;
    const dist = haversine(lat, lng, node.lat, node.lng);
    if (dist < bestDist) {
      bestDist = dist;
      best = { node, distanceMeters: Math.round(dist) };
    }
  }
  return best;
}

// ─── Suggest completions ───────────────────────────────────────────────────────
export function getSuggestions(airportIata, query, lang = 'en') {
  const results = searchWaypoints(airportIata, query);
  return results.map(r => ({
    id: r.node.id,
    label: r.node.nameKey ? locName(r.node.nameKey, lang) : r.node.name_en,
    sublabel: r.node.name_en,
    icon: r.node.icon,
    zone: r.node.zone,
    score: r.score,
  }));
}
