const fs = require('fs');
const box = require('./box');

function readTargetAreaFromFile() {
  const fileBuffer = fs.readFileSync('inputs/a.txt', {encoding: 'utf-8'});
  return fileBuffer;
}

function parseTargetArea(line) {
  const [xPart, yPart] = line.replace('target area: ', '').split(', ');
  const targetX = xPart.replace('x=', '').split('..').map(v => +v);
  const targetY = yPart.replace('y=', '').split('..').map(v => +v); 
  return [targetX, targetY];
}

function simulate(startVelocity, targetArea) {
  let x = 0;
  let y = 0;
  let dx = startVelocity[0];
  let dy = startVelocity[1];
  let vertex = 0;
  let hasBeenInsideTarget = false;
  while(!box.hasPassed(targetArea, x, y)) {
    x += dx;
    y += dy;
    vertex = Math.max(vertex, y);
    dx = dx === 0 ? 0 : dx > 0 ? dx - 1 : dx + 1;
    dy -= 1;
    if (!hasBeenInsideTarget) {
      hasBeenInsideTarget = box.inside(targetArea, x, y);
    }
  }
  return [vertex, hasBeenInsideTarget];
}

const targetAreaPositions = parseTargetArea(readTargetAreaFromFile());
const targetArea = box.initialize(targetAreaPositions);



const dyEnd = Math.abs(targetArea.position[1]) + targetArea.size[1];
const dxEnd = Math.abs(targetArea.position[0] + targetArea.size[0]);

const dyStart = process.argv[2] !== 'b' ? 1 : -dyEnd;
const dxStart = process.argv[2] !== 'b' ? 1 : -dxEnd;

// all startVelocities that end up inside target area
const candidateVelocities = [];
for (let dy = dyStart; dy <= dyEnd; dy++) {
  for (let dx = dxStart; dx <= dxEnd; dx++) {
    const [parabolaVertex, insideTargetArea] = simulate([dx,dy], targetArea);
    if (insideTargetArea) {
      candidateVelocities.push({
        vertex: parabolaVertex,
        velocity: [dx,dy],
      });
    }
  }
}

if (process.argv[2] !== 'b') {
  console.log(candidateVelocities.sort((v1, v2) => v2.vertex - v1.vertex)[0].vertex);
} else {
  console.log(candidateVelocities.length);
}
