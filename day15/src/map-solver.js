
const NEIGHBOR_COORDINATES = [
  [-1, 0],
  [0, -1],
  [1, 0],
  [0, 1],
];

function buildMapFromLines(lines) {
  if (!lines.length) {
    return [];
  }

  // we assume that the map is a square
  const size = lines[0].length;
  let map = [];
  lines.forEach((line, y) => {
    line.split('').forEach((c, x) => {
      map[(y*size) + x] = +c;
    });
  });

  return {
    get: (v) => map[v],
    width: size,
    length: map.length,
  };
}

function calculateCost(path, last, map) {
  let totalCost = map.get(last);
  let current = path.get(last);
  while (current > 0) {
    totalCost += map.get(current);
    current = path.get(current);
  }

  return totalCost;
}

function calculateNeighborIndices(current, map, width) {
  const x = current % width;
  const y = Math.floor(current/width);

  return NEIGHBOR_COORDINATES.map(([dx, dy]) => {
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= width || nx < 0 || ny < 0) {
      return undefined;
    }
    return (ny*width) + nx;
  }).filter(v => map.get(v) !== undefined);
}

function calculateCostToGoal(current, goalIndex, width) {
  const cx = current % width;
  const cy = Math.floor(current / width);
  const gx = goalIndex % width;
  const gy = Math.floor(goalIndex / width);
  
  return gx - cx + gy - cy;
}

function popFromSet(set, cheapestPaths) {
  const first = Array.from(set.values()).sort((a,b) => cheapestPaths.get(a) - cheapestPaths.get(b))[0];
  set.delete(first);
  return first;
}

function findCostForShortestPath(map, startIndex, goalIndex) {
  if (startIndex === goalIndex) {
    return 0;
  }

  const open = new Set();
  open.add(startIndex);
  const cheapestPaths = new Map([[startIndex, 0]]);
  const pathCosts = new Map();
  const heuristicCost = new Map(); 
  while(open.size) {
    const current = popFromSet(open, heuristicCost);

    if (current === goalIndex) {
      return calculateCost(pathCosts, current, map);
    }

    calculateNeighborIndices(current, map, map.width).forEach(n => {
      const cost = cheapestPaths.get(current) + map.get(n);
      const currentCheapest = cheapestPaths.get(n) ?? Infinity;
      if (cost < currentCheapest) {
        pathCosts.set(n, current);
        cheapestPaths.set(n, cost);
        heuristicCost.set(n, cost + calculateCostToGoal(n, goalIndex, map.width));
        open.add(n);
      }
    });
  }

  return undefined;
}

module.exports = {
  buildMapFromLines,
  findCostForShortestPath,
}