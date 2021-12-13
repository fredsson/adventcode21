const fs = require('fs');

function readOctopusFromFile() {
  const fileBuffer = fs.readFileSync("inputs/a.txt", {encoding: 'utf-8'});
  return fileBuffer.split('\n').map(v => v.trim());
}
function calcNeighbors(currentIndex) {
  const NEIGHBORS = [
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1]
  ];

  return NEIGHBORS.map(([dx, dy]) => {
    const x = (currentIndex % 10);
    const y = Math.floor(currentIndex / 10);

    if (x === 0 && dx === -1) {
      return undefined;
    } else if (x === 9 && dx === 1) {
      return undefined;
    }

    if (y === 0 && dy === -1) {
      return undefined;
    } else if (y === 9 && dy === 1) {
      return undefined;
    }

    const nx = (currentIndex % 10) + dx;
    const ny = Math.floor(currentIndex / 10) + dy;
    return (ny * 10) + nx;
  }).filter(v => v !== undefined);
}

function increaseEnergy(index, grid, alreadyFlashed) {
  if (alreadyFlashed.has(index) | grid[index] === undefined) {
    return 0;
  }
  let flashes = 0;

  grid[index]++;
  if (grid[index] > 9) {
    grid[index] = 0;
    alreadyFlashed.add(index);
    flashes++;
    flashes += calcNeighbors(index)
      .map(nindex => increaseEnergy(nindex, grid, alreadyFlashed))
      .reduce((total, v) => total + v, 0);
  }

  return flashes;
}

let grid = [];
readOctopusFromFile().forEach((line, y) => {
  line.split('').forEach((o, x) => {
    const index = (y * 10) + x;
    grid[index] = +o;
  });
});


if (process.argv[2] !== 'b') {
  const maxSteps = 100;
  let totalFlashes = 0;
  for (let step = 0; step < maxSteps; step++) {
    const flashedSet = new Set();
    totalFlashes += grid
      .map((_, index) => {
        return increaseEnergy(index, grid, flashedSet);
      })
      .reduce((total, v) => total + v, 0);
  }
  console.log(totalFlashes);

} else {
  const maxSteps = 10000;
  let totalFlashes = 0;
  for (let step = 0; step < maxSteps; step++) {
    const flashedSet = new Set();
    totalFlashes += grid
      .map((_, index) => {
        return increaseEnergy(index, grid, flashedSet);
      })
      .reduce((total, v) => total + v, 0);
    if (flashedSet.size === grid.length) {
      console.log(step + 1);
      break;
    }
  }
}
