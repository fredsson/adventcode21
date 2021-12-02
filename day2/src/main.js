const fs = require('fs');

function readCommandsFromFile() {
  const fileBuffer = fs.readFileSync("inputs/a.txt", {encoding: 'utf-8'});
  return fileBuffer.split('\n');
}

function applyCommand(command, valueAsString, result) {
  if (command === 'up') {
    result.depth -= +valueAsString;
  } else if (command === 'down') {
    result.depth += +valueAsString;
  } else if (command === 'forward') {
    result.horizontal += +valueAsString;
  }
  return result;
}

function applyComplicatedCommands(command, valueAsString, result) {
  if (command === 'up') {
    result.aim -= +valueAsString;
  } else if (command === 'down') {
    result.aim += +valueAsString;
  } else if (command === 'forward') {
    const value = +valueAsString;
    result.horizontal += value;
    result.depth += result.aim * value;
  }

  return result;
}

const commandFunction = process.argv[2] === 'b' ? applyComplicatedCommands : applyCommand;

const commands = readCommandsFromFile();

const position = commands
  .map(v => v.split(' '))
  .reduce((result, commandTuple) => {
    const [command, value] = commandTuple;
    return commandFunction(command, value, result);
  }, {horizontal: 0, depth: 0, aim: 0});

console.log(position.horizontal * position.depth);