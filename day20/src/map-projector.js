
  const NEIGHBORS = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [0, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
  ];


function neighbors(index, originalWidth, projectedWidth) {
  if (!originalWidth) {
    return [
      undefined, undefined, undefined,
      undefined, undefined, undefined,
      undefined, undefined, undefined
    ];    
  }

  const x = index % projectedWidth;
  const y = Math.floor(index / projectedWidth);

  const neighbors = NEIGHBORS.map(([dx,dy]) => {
    const nx = x + dx - 1;
    const ny = y + dy - 1;
    if (nx < 0 || ny < 0 || nx >= originalWidth || ny >= originalWidth) {
      return undefined;
    }

    return (ny*originalWidth)+nx;
  });

  return neighbors;
}

module.exports = {
  init: (originalWidth, projectedWidth) => {
    return {
      neighbors: (index) => neighbors(index, originalWidth, projectedWidth),
    }
  },
}