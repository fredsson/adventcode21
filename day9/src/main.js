const fs = require('fs');

function readLinesFromFile() {
  const fileBuffer = fs.readFileSync("inputs/a.txt", {encoding: 'utf-8'});
  return fileBuffer.split('\n').map(v => v);
}

const lines = readLinesFromFile();
if (process.argv[2] !== 'b') {
  const lowestValues = [];
  lines.forEach((line, y) => {
    line.split('').forEach((value, x) =>{
      const neighbors = [
        line[x - 1],
        lines[y - 1]?.[x],
        line[x + 1],
        lines[y + 1]?.[x]
      ].filter(v => v !== undefined);

      const lowest = neighbors.every(v => v > value);
      if (lowest){
        lowestValues.push(value);
      }
    });
  });

  console.log(lowestValues.reduce((total, v) => total + +v + 1, 0));
} else {
  const seeds = [];
  lines.forEach((line, y) => {
    line.split('').forEach((value, x) =>{
      if (value >= 9) {
        return;
      }

      seeds.push({
        value,
        x,
        y
      });
    });
  });

  seeds.sort((a,b) => b.value - a.value);
  const basins = [];
  while(seeds.length) {
    const value = seeds.pop();
    const neighbors = [
      {x: value.x - 1, y: value.y},
      {x: value.x, y: value.y - 1},
      {x: value.x + 1, y: value.y},
      {x: value.x, y: value.y + 1},
    ];
    const basinWhereValueBelongs = basins.find(b => {
      return neighbors.some(n => b.find(bv => bv.x === n.x && bv.y === n.y));
    });
    if (basinWhereValueBelongs){
      basinWhereValueBelongs.push(value);
    } else {
      basins.push([value]);
    }
  }
  const basinTotals = basins
    .map(basin => basin.reduce((total) => total+ 1, 0))
    .sort((a, b) => b - a);
  console.log(basinTotals.slice(0, 3).reduce((total, v) => total * v, 1));
}
