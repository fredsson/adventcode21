
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

  return map;
}

function findCostForShortestPath(map, startIndex, goalIndex) {
  if (startIndex === goalIndex) {
    return 0;
  }
  
  return map[goalIndex];
}

module.exports = {
  buildMapFromLines,
  findCostForShortestPath,
}