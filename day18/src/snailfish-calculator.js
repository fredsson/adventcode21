const NUMBER_PATTERN = /\d+/g;
const PAIR_PATTERN = /\[\d*,\d*\]/g;
function split(value) {
  const matches = Array.from(value.matchAll(NUMBER_PATTERN))
    .map(m => ({v: +m[0], index: m.index}))
    .filter(m => m.v >= 10);
  
  if (!matches.length) {
    return {
      didSplit: false
    };
  }

  const firstMatchToSplit = matches[0];

  const left = Math.floor(firstMatchToSplit.v / 2);
  const right = Math.ceil(firstMatchToSplit.v / 2);

  return {
    didSplit: true,
    result: value.replace(firstMatchToSplit.v.toString(), `[${left},${right}]`)
  }
}

function replaceInString(original, replacement, startIndex, endIndex) {
  return original.substr(0, startIndex) + replacement + original.substr(endIndex);
}

function findExplosion(value) {
  let found = false;
  let startIndex = -1;
  let endIndex = -1;
  let count = 0;
  for (let i = 0; i < value.length; i++) {
    const c = value[i];
    if (c === '[') {
      count++;
    }
    if (c === ']') {
      count--;
    }
    // count [ until 4
    if (count === 5) {
      found = true;
      count = 0;
      startIndex = i;
    }
    // take until first ],
    if (found && c === ']') {
      endIndex = i;
      break;
    }
  }

  return {
    found,
    startIndex,
    endIndex,
  };
}

function findNumberToLeft(value, startIndex) {
  let found = false;
  let targetEndIndex = -1;
  let targetStartIndex = -1;
  for (let i = startIndex; i > 0; i--) {
    const c = value[i];
    const matchesNumber = c.match(NUMBER_PATTERN); 
    if (matchesNumber && targetEndIndex === -1) {
      found = true;
      targetEndIndex = i;
    }
    if (found && !matchesNumber) {
      targetStartIndex = i;
      break;
    }
  }

  return {
    found,
    startIndex: targetStartIndex,
    endIndex: targetEndIndex,
    value: found ? +value.slice(targetStartIndex+1, targetEndIndex+1) : undefined,
  };
}

function findNumberToRight(value, startIndex) {
  let found = false;
  let targetStartIndex = -1;
  let targetEndIndex = -1;
  for (let i = startIndex; i < value.length; i++) {
    const c = value[i];
    const matchesNumber = c.match(NUMBER_PATTERN); 
    if (matchesNumber && targetStartIndex === -1) {
      found = true;
      targetStartIndex = i;
    }
    if (found && !matchesNumber) {
      targetEndIndex = i;
      break;
    }
    // is a number, go until we find , and then parse + add + replace
  }

  return {
    found,
    startIndex: targetStartIndex,
    endIndex: targetEndIndex,
    value: found ? +value.slice(targetStartIndex, targetEndIndex) : undefined,
  };  
}

function explode(value) {
  const firstExplosion = findExplosion(value);
  if (!firstExplosion.found) {
    return {
      didExplode: false
    };
  }

  const valueToExplode = value.slice(firstExplosion.startIndex, firstExplosion.endIndex+1);
  const [first, second] = JSON.parse(valueToExplode);

  const targetLeft = findNumberToLeft(value, firstExplosion.startIndex);
  const targetRight = findNumberToRight(value, firstExplosion.endIndex + 1);

  let result = value;
  if (targetRight.found) {
    const resultToRight = (second + targetRight.value).toString();
    result = replaceInString(result, resultToRight, targetRight.startIndex, targetRight.endIndex);
  }
  result = replaceInString(result, '0', firstExplosion.startIndex, firstExplosion.endIndex + 1);
  if (targetLeft.found) {
    const resultToLeft = (first + targetLeft.value).toString();
    result = replaceInString(result, resultToLeft, targetLeft.startIndex+1, targetLeft.endIndex + 1);
  }
  return {
    didExplode: true,
    result
  };
}

function reduce(value) {
  let result = value;
  while(true) {
    let explodeValue = explode(result);
    if (explodeValue.didExplode) {
      result = explodeValue.result;
      continue;
    }

    let splitValue = split(result);
    if (splitValue.didSplit) {
      result = splitValue.result;
      continue;
    }
    break;
  }
  return result;
}

function add(a, b) {
  let result = `[${a},${b}]`;
  result = reduce(result);
  return result;
}

function magnitude(value) {
  let result = value;
  let matches = Array.from(result.matchAll(PAIR_PATTERN));
  while (matches.length) {
    matches.forEach(v => {
      const [first, second] = JSON.parse(v);
      const magnitude = first * 3 + second * 2;
      
      result = result.replace(v, magnitude);
    });
    matches = Array.from(result.matchAll(PAIR_PATTERN));
  }
  return +result;
}

module.exports = {
  add,
  magnitude,
}