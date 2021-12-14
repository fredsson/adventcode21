const fs = require('fs');

function readInstructionsFromFile() {
  const fileBuffer = fs.readFileSync("inputs/a.txt", {encoding: 'utf-8'});
  return fileBuffer.split('\n');
}

const lines = readInstructionsFromFile();

let positions = [];
let instructions = [];
let parsingInstructions = false;
for (const line of lines) {
  if (line.length === 0) {
    parsingInstructions = true;
    continue;
  }
  if (!parsingInstructions) {
    const position = line.split(',').map(v => +v);
    positions.push(position);
  } else {
    const instruction = line.replace('fold along ', '').split('=');
    instructions.push(instruction);
  }
}

function foldGrid(positions, instruction) {
  const [foldAxis, foldValue] = instruction;
  if (foldAxis === 'y') {
    return positions.map(([x, y]) => {
      if (y > foldValue) {
        return [x, foldValue - (y - foldValue)];
      }
      return [x,y];
    });
  } else {
    return positions.map(([x, y]) => {
      if (x > foldValue) {
        return [foldValue - (x - foldValue), y];
      }
      return [x,y];
    });
  }
}

if (process.argv[2] !== 'b') {
  positions = foldGrid(positions, instructions[0]);

  const uniquePositions = positions
    .sort(([a,b], [c,d]) => a === c ? b-d : a-c)
    .filter(([x,y], index) => {
      const next = positions[index+1];
      return x !== next?.[0] || y !== next?.[1];
    })

  console.log(uniquePositions.length);
} else {
  for (const instruction of instructions) {
    positions = foldGrid(positions, instruction);
  }

  const [maxX,maxY] = positions.reduce(([x, y], [maxX, maxY]) => {
    return [Math.max(maxX, x), Math.max(maxY, y)];
  }, [-1, -1]);

  for (let y = 0; y <= maxY; y++) {
    let line = '';
    for (let x = 0; x <= maxX; x++) {
      const hasPosition = positions.some(([px,py]) => px === x && py === y);
      line += hasPosition ? '#' : ' ';
    }
    console.log(line);
  }
}
