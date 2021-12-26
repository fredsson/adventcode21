const fs = require('fs');

function readLinesFromFile() {
  const fileBuffer = fs.readFileSync('inputs/a.txt', {encoding: 'utf-8'});
  return fileBuffer.split('\n');
}

function printGrid(grid, width, height) {
  console.log('-----------');
  for (let y = 0; y < height; y++) {
    let line = '';
    for (let x = 0; x < width; x++) {
      const index = (y*width)+x;
      line += grid[index];
    }
    console.log(line);
  }
  console.log('-----------');
}

function coordinatesFromIndex(index, width) {
  const y = Math.floor(index / width);
  const x = index % width;
  return [x,y];
}

function getNextHorizontalIndex(index, width) {
  const [x,y] = coordinatesFromIndex(index, width);
  const nextX = (x + 1) % width;
  return (y * width) + nextX;
}

function getNextVerticalIndex(index, width, height) {
  const [x, y] = coordinatesFromIndex(index, width);
  const nextY = (y + 1) % height;
  return (nextY * width) + x;
}

const lines = readLinesFromFile();

let grid = [];
let height = lines.length;
let width = lines[0].length;
lines.forEach((line, y) => {
  line.split('').forEach((v, x) => {
    const index = (y*width)+x;
    grid[index] = v;
  });
});

let moving = Infinity;
let steps = 0;
while(moving > 0) {
  steps++;
  moving = 0;
  const eastFacingThatCanMove = grid
    .map((v, index) => ({v, index, neighborIndex: getNextHorizontalIndex(index, width)}))
    .filter(({v, neighborIndex}) => {
      const isEastFacing = v === '>';
      const canMoveEast = grid[neighborIndex] === '.';
      
      return isEastFacing && canMoveEast;
    });
  moving += eastFacingThatCanMove.length;

  eastFacingThatCanMove.forEach(({index, neighborIndex}) => {
    grid[index] = '.';
    grid[neighborIndex] = '>';
  });

  const southFacingThatCanMove = grid
    .map((v, index) => ({v, index, neighborIndex: getNextVerticalIndex(index, width, height)}))
    .filter(({v, neighborIndex}) => {
      const isSouthFacing = v === 'v';
      const canMoveSouth = grid[neighborIndex] === '.';
      return isSouthFacing && canMoveSouth;
    });
  moving += southFacingThatCanMove.length;

  southFacingThatCanMove.forEach(({index, neighborIndex}) => {
    grid[index] = '.';
    grid[neighborIndex] = 'v';
  });
}

console.log(steps);
