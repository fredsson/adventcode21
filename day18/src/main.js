const fs = require('fs');
const snailfishCalculator = require('./snailfish-calculator');

function readSnailFishHomeworkFromFile() {
  const fileBuffer = fs.readFileSync('inputs/a.txt', {encoding: 'utf-8'});
  return fileBuffer.split('\n');
}

const lines = readSnailFishHomeworkFromFile();

if (process.argv[2] !== 'b') {
  const result = lines.reduce((previousLine, line) => {
    if (!previousLine) {
      return line;
    }
    return snailfishCalculator.add(previousLine, line);
  }, undefined);

  console.log(snailfishCalculator.magnitude(result));
} else {
  const magnitudes = [];
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines.length; j++) {
      if (i === j) {
        continue;
      }

      const a = lines[i];
      const b = lines[j];

      const result = snailfishCalculator.add(a,b);
      magnitudes.push(snailfishCalculator.magnitude(result));
    }
  }
  console.log(magnitudes.sort((a,b) => b-a)[0]);
}