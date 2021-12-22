const fs = require('fs');
const mapProjector = require('./map-projector');

function readMapFromFile() {
  const fileBuffer = fs.readFileSync('inputs/a.txt', {encoding: 'utf-8'});
  return fileBuffer.split('\n');
}

function printGrid(grid, width) {
  for (let y = 0; y < width; y++) {
    let line = '';
    for (let x = 0; x < width; x++) {
      const index = (y*width)+x;
      line += grid[index];
    }
    console.log(line);
  }
}

function buildGrid(lines) {
  let grid = [];
  let width = undefined;
  lines.forEach((line, y) => {
    line.split('').forEach((o, x) => {
      width = line.length;
      const index = (y * line.length) + x;
      grid[index] = o;
    });
  });

  return [grid, width];
}

function buildProjectionGrid(grid, projectionWidth, projector, lookup, step) {
  let next = [];
  for (let y = 0; y < projectionWidth; y++) {
    for (let x = 0; x < projectionWidth; x++) {
      const index = (y*projectionWidth) + x;
  
      const neighbors = projector.neighbors(index);
      const lookupIndex = parseInt(neighbors.map(v => {
        if (v === undefined) {
          return step % 2 === 0 ? '0' : '1';
        }
        return grid[v] === '#' ? '1' : '0';
      }).join(''), 2);
  
      next[index] = lookup[lookupIndex];
    }
  }
  return next;
}

const lines = readMapFromFile();
const lookup = lines[0];
let [grid, currentWidth] = buildGrid(lines.slice(2));

const noOfSteps = process.argv[2] !== 'b' ? 2 : 50;

for (let step = 0; step < noOfSteps; step++) {
  const projectionWidth = currentWidth + 2;
  const projector = mapProjector.init(currentWidth, projectionWidth);
  let next = buildProjectionGrid(grid, projectionWidth, projector, lookup, step);

  grid = next;
  currentWidth = projectionWidth;
}

console.log(grid.reduce((total, v) => {
  if (v === '#') {
    return total + 1;
  }
  return total;
},0))
