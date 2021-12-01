const fs = require('fs');

function readValuesFromFile() {
  const fileBuffer = fs.readFileSync("inputs/a.txt", {encoding: 'utf-8'});
  return fileBuffer.split('\n').map(v => +v);
}

function calculateDistances(values) {
  return values.map((v, index, arr) => {
    if (index === 0) {
      return 0;
    }

    return v - arr[index - 1];
  });
}

function calculateSlidingWindowDistance(values) {
  return values.map((v, index, arr) => {
    if (index + 3 > arr.length) {
      return 0;
    }
    const current = v + arr[index + 1] + arr[index + 2];
    const next = arr[index + 1] + arr[index + 2] + arr[index + 3]
    return next - current;
  });
}

const values = readValuesFromFile();
const distanceFunction = process.argv[2] === 'b' ? calculateSlidingWindowDistance : calculateDistances;
const increasingDistances = distanceFunction(values).filter(v => v > 0);

console.log(increasingDistances.length);
