const fs = require('fs');
const mapSolver = require('./map-solver');

function readLinesFromFile() {
  const fileBuffer = fs.readFileSync('inputs/a.txt', {encoding: 'utf-8'});
  return fileBuffer.split('\n');
}

if (process.argv[2] !== 'b') {
  const map = mapSolver.buildMapFromLines(readLinesFromFile());
  const cost = mapSolver.findCostForShortestPath(map, 0, map.length - 1);

  console.log(cost);
}
