const fs = require('fs');

function readInstructionsFromFile() {
  const fileBuffer = fs.readFileSync("inputs/a_example.txt", {encoding: 'utf-8'});
  return fileBuffer.split('\n');
}

let parsingInstructions = false;
const [grid, foldInstructions] = readInstructionsFromFile()
  .reduce((result, line) => {
    if (line.length === 0) {
      parsingInstructions = true;
      return result;
    }
    if (!parsingInstructions) {
      const [x, y] = line.split(',').map(v => +v);
      const index = (y*100)+x;
      result[0][index] = '#';      
    } else {
      const instruction = line.replace('fold along ', '').split('=');
      result[1].push({direction: instruction[0], value: +instruction[1]});
    }
    return result;
  }, [[], []]);

  console.log(grid, foldInstructions);