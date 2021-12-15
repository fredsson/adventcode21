
function mergeKey(map, key, value) {
  const current = map.get(key) ?? 0;
  map.set(key, current + value);
}

function sequenceOnce(pairs, instructions, chars) {
  const nextGeneration = new Map();
  pairs.forEach((sum, pair) => {
    const addition = instructions.get(pair);
    if (addition) {
      mergeKey(chars, addition, sum);
      mergeKey(nextGeneration, pair[0] + addition, sum);
      mergeKey(nextGeneration, addition + pair[1], sum);
    }
  });
  return nextGeneration;
}

function initialize(startSequence) {
  pairs = new Map();
  chars = new Map();

  startSequence.split('').forEach((v, index) => {
    mergeKey(chars, v, 1);
    if (index < startSequence.length - 1) {
      mergeKey(pairs, v + startSequence[index + 1], 1);
    }
  });

  return {
    sequence: (instructions) => {
      pairs = sequenceOnce(pairs, instructions, chars);
    },
    pairs: () => pairs,
    findMostAndLeastCommonElements: () => {
      const sortedOccurences = Array.from(chars).sort(([_, valA], [__, valB] ) => valA - valB);
      const leastOccurences = sortedOccurences[0];
      const mostOccurences = sortedOccurences[sortedOccurences.length - 1]; 

      return {
        least: sortedOccurences[0] ? { key: leastOccurences[0], sum: Math.ceil(leastOccurences[1])} : {key: '', sum: 0},
        most: mostOccurences ? {key: mostOccurences[0], sum: Math.ceil(mostOccurences[1])} : {key: '', sum: 0},
      };
    },
  };
}

module.exports = {
  initialize,
}