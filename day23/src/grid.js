var PF = require('pathfinding');

const AMPHIPOD_TOKENS = ['A', 'B', 'C', 'D'];

const TARGET_COLUMN_BY_POD_TYPE = {
  A: 3,
  B: 5,
  C: 7,
  D: 9
}

const COST_BY_POD_TYPE = {
  A: 1,
  B: 10,
  C: 100,
  D: 1000,
}

const TARGETS_BY_POD_TYPE = {
  A: [{x:3,y:2}, {x:3, y:3}],
  B: [{x:5,y:2}, {x:5, y:3}],
  C: [{x:7,y:2}, {x:7, y:3}],
  D: [{x:9,y:2}, {x:9, y:3}],
}

function printGrid(grid, width, height) {
  console.log('-----------');
  for (let y = 0; y < height; y++) {
    let line = '';
    for (let x = 0; x < width; x++) {
      const index = (y*width)+x;
      line += grid[index];
    }
    console.log(line);
  }
  console.log('-----------');
}

function initGrid(lines, grid, width, amphipods, availableSpots) {
  lines.forEach((line, y) => {
    while (line.length < width) {
      line += '#';
    }
    line.split('').forEach((v, x) => {
      const index = (y * width) + x;
      if (AMPHIPOD_TOKENS.includes(v)) {
        amphipods.push({x, y, t: v});
      } else if (v === '.' && !Object.values(TARGET_COLUMN_BY_POD_TYPE).includes(x)) {
        availableSpots.push({x, y});
      }
      grid[index] = v == ' ' ? '#' : v;
    });
  });
}

function findPath(position, target, grid, width) {
  const matrix = [];
  grid.forEach((v, index) => {
    const x = index % width;
    const y = Math.floor(index / width);
    if (!matrix[y]) {
      matrix[y] = [];
    } 
    if (x === position.x && y === position.y) {
      matrix[y].push(0);
    } else {
      matrix[y].push(v === '.' ? 0 : 1);
    }
  });
  const pfGrid = new PF.Grid(matrix);
  const finder = new PF.DijkstraFinder();
  const p = finder.findPath(position.x, position.y, target.x, target.y, pfGrid);
  if(!p.length) {
    return undefined;
  }
  return p
    .filter(([x,y]) => x !== position.x || y !== position.y) // remove start position
    .map(([x,y]) => ({x,y})); // map to expected format
}

function findPathsToGoal(pod, grid, width) {
  const targets = TARGETS_BY_POD_TYPE[pod.t];
  const blocked = !targets.every(t => {
    const index = (t.y * width) + t.x;
    return grid[index] === '.' || grid[index] === pod.t; 
  });
  if (blocked) {
    return [];
  }

  return targets.map(t => {
    const path = findPath({x: pod.x, y: pod.y}, t, grid, width);
    if (!path) {
      return undefined;
    }

    return {pod, spot: t, cost: path.length * COST_BY_POD_TYPE[pod.t], prio: (1000*t.y)};
  }).filter(p => p !== undefined);
}

function getPossibleMovesWithCost(amphipods, availableSpots, grid, width) {
  let endGoalIsBlocked = false;
  return amphipods
    .filter(pod => {
      const notInCorrectColumn = pod.x !== TARGET_COLUMN_BY_POD_TYPE[pod.t];
      if (notInCorrectColumn) {
        return true;
      }

      const neighbor = grid[((pod.y+1)*width)+pod.x];
      if (neighbor === '.') {
        endGoalIsBlocked = true;
        return false;
      }
      const neighborIsWrongType = pod.y === 2 && neighbor !== pod.t;
      return neighborIsWrongType;
    })
    .map(pod => {
      if (endGoalIsBlocked) {
        return [];
      }
      if (pod.y === 1) {
        return findPathsToGoal(pod, grid, width);
      }
      const goalSpots = findPathsToGoal(pod, grid, width);
      return goalSpots.concat(availableSpots.map(spot => {
        const path = findPath({x: pod.x, y: pod.y}, spot, grid, width);
        if (!path) {
          return undefined;
        }
        return {pod, spot, cost: path.length * COST_BY_POD_TYPE[pod.t], prio: 1};
      }).filter(v => v !== undefined));
    }).flat();
}

function solved(grid, width) {
  return Object.entries(TARGET_COLUMN_BY_POD_TYPE)
    .map(([type, column]) => {
      return [
        {x: column, y: 2, type},
        {x: column, y: 3, type}
      ];
    })
    .flat()
    .filter(v => {
      const index = (v.y * width) + v.x;
      return grid[index] === v.type;
    }).length === 8;
}

function swap(position, target, oldGrid, width, height, oldAmphipods, oldAvailableSpots, targets) {
  return ((grid, amphipods, availableSpots, targets) => {
    // move pod:
    const pod = amphipods.find(a => a.x === position.x && a.y === position.y);
    pod.x = target.x;
    pod.y = target.y;

    // remove open spot:
    availableSpots = availableSpots.filter(spot => spot.x !== target.x || spot.y !== target.y);

    // swap grid:
    const positionIndex = (position.y * width) + position.x;
    const targetIndex = (target.y * width) + target.x;
    const temp = grid[positionIndex];
    grid[positionIndex] = '.';
    grid[targetIndex] = temp;

    targets.push({position, target});

    return {
      print: () => printGrid(grid, width, height),
      swap: (position, target) => swap(position, target, grid, width, height, amphipods, availableSpots, targets),
      getPossibleMovesWithCost: () => getPossibleMovesWithCost(amphipods, availableSpots, grid, width),
      solved: () => solved(grid, width),
      trace: () => targets,
    }
  })(oldGrid.slice(0), oldAmphipods.map(a => ({...a})), oldAvailableSpots.slice(0), targets.slice(0));
}

module.exports = {
  init: (lines) => {
    const grid = [];
    const amphipods = [];
    const availableSpots = [];
    const width = lines[0].length;
    const height = lines.length;
    initGrid(lines, grid, width, amphipods, availableSpots);
    return {
      print: () => printGrid(grid, width, height),
      swap: (position, target) => swap(position, target, grid, width, height, amphipods, availableSpots, []),
      findPath: (position, target) => findPath(position, target, grid, width),
      getPossibleMovesWithCost: () => getPossibleMovesWithCost(amphipods, availableSpots, grid, width),
      solved: () => solved(grid, width),
    };
  },
};