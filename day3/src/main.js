const fs = require('fs');

function readBinaryValuesFromFile() {
  const fileBuffer = fs.readFileSync("inputs/a.txt", {encoding: 'utf-8'});
  return fileBuffer.split('\n').map(v => v);
}

function sumBinaryPositions(binaryValues) {
  return binaryValues.map(v => v.split('')).reduce((values, currentBinary) => {
    currentBinary.forEach((v, index) => {
      if (!values[index]) {
        values[index] = 0;
      }
      values[index] += +v;
    });
    return values;
  }, []);
}

function calculateMostCommonBits(binarySum, total) {
  return binarySum.map(v => v >= (total / 2) ? 1 : 0).join('');
}

function calculateLeastCommonBits(binarySum, total) {
  return binarySum.map(v => v >= (total / 2) ? 0 : 1).join('');
}

function searchForBinaryValue(binaryValues, valueBasedOnSum) {
  let searchIndex = 0;
  let candidates = binaryValues;
  while (searchIndex <= binaryValues[0].length) {
    const sumForIndex = candidates.map(bv => +bv[searchIndex]).reduce((v, total) => total + v, 0);
    const binaryToKeep = valueBasedOnSum(sumForIndex, candidates.length);

    candidates = candidates.filter(v => v[searchIndex] === binaryToKeep);

    if (candidates.length === 1) {
      return candidates[0];
    }
    searchIndex++;
  }
}

function findOxygenBinary(binaryValues) {
  return searchForBinaryValue(
    binaryValues,
    (sum, valuesLeft) => sum >= (valuesLeft/2) ? '1' : '0'
  );
}

function findScrubberBinary(binaryValues) {
  return searchForBinaryValue(
    binaryValues,
    (sum, valuesLeft) => sum >= (valuesLeft/2) ? '0' : '1'
  );
} 

const binaryValues = readBinaryValuesFromFile();

const solveFirstProblem = process.argv[2] !== 'b'
if (solveFirstProblem) {
  const binarySum = sumBinaryPositions(binaryValues);
  const mostCommonBits = calculateMostCommonBits(binarySum, binaryValues.length);
  const leastCommonBits = calculateLeastCommonBits(binarySum, binaryValues.length);
  
  const gammaRate = parseInt(mostCommonBits, 2);
  const epsilonRate = parseInt(leastCommonBits, 2);
  
  console.log(gammaRate * epsilonRate); 
} else {
  const oxygenRating = parseInt(findOxygenBinary(binaryValues), 2);
  const scrubberRating = parseInt(findScrubberBinary(binaryValues), 2);
  
  console.log(oxygenRating * scrubberRating);
}


