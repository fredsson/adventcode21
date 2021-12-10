const fs = require('fs');

function readLinesFromFile() {
  const fileBuffer = fs.readFileSync("inputs/a.txt", {encoding: 'utf-8'});
  return fileBuffer.split('\n').map(v => v);
}

function prepareDigitKey(stringToConvert) {
  return stringToConvert.split('').sort().join('');
}

const lines = readLinesFromFile();

if (process.argv[2] !== 'b') {
  const knownDigitsBySignalLength = new Map([
    [2, 1],
    [3, 7],
    [4, 4],
    [7, 8]
  ]);

  const outputSignals = lines.reduce((signals, line) => {
    const output = line.split('|')[1];
    return signals.concat(output.split(' '));
  }, []);

  const knownSignalCount = outputSignals.reduce((totals, signal) => {
    const digitByLength = knownDigitsBySignalLength.get(signal.length);
    if (digitByLength){
      const currentTotal = totals.get(digitByLength) ?? 0;
      totals.set(digitByLength, currentTotal + 1);
    }
    return totals;
  }, new Map());

  console.log(Array.from(knownSignalCount.values()).reduce((total, v) => total + v, 0));
} else {
  const decodedOutput = [];
  lines.forEach(line => {
    const [input, output] = line.split('|');

    const signals = input.split(' ');
    const digitOne = signals.find(s => s.length === 2);
    const digitSeven = signals.find(s => s.length === 3);
    const digitFour = signals.find(s => s.length === 4);
    const digitEight = signals.find(s => s.length === 7);
    const digitNine = signals.find(s => s.length === 6 && 
      s.split('').filter(v => !digitSeven.includes(v) && !digitFour.includes(v)).length === 1
    );
    const digitSix = signals.find(s => s.length === 6 &&
      digitOne.split('').filter(v => !s.includes(v)).length === 1
    );
    const digitZero = signals.find(s => s.length === 6 && s !== digitSix && s !== digitNine);
    const digitFive = signals.find(s => s.length === 5 && 
      digitSix.split('').filter(v => !s.includes(v)).length === 1
    );
    const digitThree = signals.find(s => s.length === 5 && s !== digitFive && 
      !s.split('').filter(v => !digitNine.includes(v)).length
    )
    const digitTwo = signals.find(s => s.length === 5 && s !== digitFive && s !== digitThree);

    const signalsForDigit = new Map([
      [prepareDigitKey(digitZero), 0],
      [prepareDigitKey(digitOne), 1],
      [prepareDigitKey(digitTwo), 2],
      [prepareDigitKey(digitThree), 3],
      [prepareDigitKey(digitFour), 4],
      [prepareDigitKey(digitFive), 5],
      [prepareDigitKey(digitSix), 6],
      [prepareDigitKey(digitSeven), 7],
      [prepareDigitKey(digitEight), 8],
      [prepareDigitKey(digitNine), 9]
    ]);
    const total = output.trim().split(' ')
      .map(v => signalsForDigit.get(prepareDigitKey(v)))
      .reduce((total, v) => total + v, '');

    decodedOutput.push(total);  
  });

  console.log(decodedOutput.reduce((total, v) => total + +v, 0));
}
