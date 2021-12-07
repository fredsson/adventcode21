const fs = require('fs');

function readValuesFromFile() {
  const fileBuffer = fs.readFileSync("inputs/a.txt", {encoding: 'utf-8'});
  return fileBuffer.split(',').map(v => +v);
}

function calculateTrueDistance(value) {
  if (value === 0 || value === 1){
    return 1;
  }

  let stepsLeft = value;
  let result = value;
  while (stepsLeft > 1) {
    stepsLeft--;
    result = result + stepsLeft;
  } 
  return result;
}

const positions = readValuesFromFile();
let min = 10000;
let max = -10000;
positions.forEach(position => {
  if (min > position) {
    min = position
  }
  if (max < position) { 
    max = position;
  }
});

if (process.argv[2] !== 'b') {
  const costs = [];
  for (let suggested = min; suggested < max; suggested++) {
  const costToMoveTo = positions
    .map(v => Math.abs(v - suggested))
    .reduce((total, v) => total + v);

    costs.push(costToMoveTo);
  }
  console.log(costs.sort((a, b) => a - b)[0]);
} else {
  const costs = [];
  for (let suggested = min; suggested < max; suggested++) {
  const costToMoveTo = positions
    .map(v => calculateTrueDistance(Math.abs(v - suggested)))
    .reduce((total, v) => total + v);

    costs.push(costToMoveTo);
  }
  console.log(costs.sort((a, b) => a - b)[0]);
}