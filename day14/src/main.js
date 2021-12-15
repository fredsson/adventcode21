const fs = require('fs');
const sequencer = require('./sequencer');

function readPolymerFromFile() {
  const fileBuffer = fs.readFileSync("inputs/a.txt", {encoding: 'utf-8'});
  return fileBuffer.split('\n');
}

function parseInput(lines) {
  result = [];
  result.push(lines[0]);

  const instructions = new Map();
  for (line of lines.slice(2)) {
    const [from, addition] = line.split('->');
    instructions.set(from.trim(), addition.trim());
  }
  result.push(instructions);

  return result;
}

let [startSequence, instructions] = parseInput(readPolymerFromFile());
if (process.argv[2] !== 'b') {
let resultSequence = startSequence;
  for (let step = 0; step < 10; step++) {
    resultSequence = resultSequence.split('').reduce((n, char, index) => {
      const pair = char + resultSequence[index + 1];
      const addition = instructions.get(pair);
      if (addition) {
        return n+char+addition;
      }
      return n+char;
    },'');
  }

  const charOccurences = resultSequence.split('').reduce((totals, c) => {
    const value = totals.get(c);
    if (!value) {
      totals.set(c, 1);
    } else {
      totals.set(c, value + 1);
    }
    return totals;
  }, new Map());
  sortedOccurences = Array.from(charOccurences).sort(([_, valA], [__, valB] ) => valA - valB);
  console.log(sortedOccurences[sortedOccurences.length-1][1] - sortedOccurences[0][1]);
} else {
  const instance = sequencer.initialize(startSequence);
  for (let step = 0; step < 40; step++) {
    instance.sequence(instructions);
  }

  const result = instance.findMostAndLeastCommonElements();
  console.log(result.most.sum - result.least.sum);
}


