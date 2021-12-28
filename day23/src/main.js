const fs = require('fs');
const Grid = require('./grid');
const Heap = require('heap');

function readLayoutFromFile() {
  const fileBuffer = fs.readFileSync('inputs/a.txt', {encoding: 'utf-8'});
  return fileBuffer.split('\n');
}

const lines = readLayoutFromFile();
const grid = Grid.init(lines);
const bag = new Heap((a, b) => {
  if (a.prio === b.prio) {
    return b.cost - a.cost;
  }
  return b.prio - a.prio;
});

/* state:
pod: the amphipod
spot: the spot the the amphipod can move to
cost: cost of movement to this spot
prio: how urgent it is to move here
grid: the grid before this movement has happened
*/

const initialMoves = grid.getPossibleMovesWithCost();
initialMoves.map(m => ({
  ...m,
  grid,
  totalCost: m.cost,
})).forEach(s => bag.push(s));

let minCost = Infinity;
let winner = undefined;
while(bag.size()) {
  const state = bag.pop();

  const nextGrid = state.grid.swap({x: state.pod.x, y: state.pod.y}, state.spot);
  if (nextGrid.solved()) {
    const cost = state.totalCost;
    if (cost < minCost) {
      minCost = cost;
      winner = nextGrid;
    }
    continue;
  }
  const availableMoves = nextGrid.getPossibleMovesWithCost();
  availableMoves.map(m => ({
    ...m,
    grid: nextGrid,
    totalCost: state.totalCost + m.cost,
  })).filter(s => s.totalCost <= minCost).forEach(s => bag.push(s));
}

console.log('------');
winner.print();
console.log(winner.trace());
console.log('------');
console.log(minCost);
