const fs = require('fs');

function readLaternFishTimersFromFile() {
  const fileBuffer = fs.readFileSync("inputs/a.txt", {encoding: 'utf-8'});
  return fileBuffer.split(',').map(v => +v);
}

const daysToSimulate = process.argv[2] === 'b' ? 256 : 80;
let lanternFishByDaysToSpawn = new Map([[1, 0], [2, 0], [3, 0], [4, 0], [5, 0]]);

readLaternFishTimersFromFile().forEach(fish => {
  const value = lanternFishByDaysToSpawn.get(fish);
  lanternFishByDaysToSpawn.set(fish, value + 1);
});

let lanternFishTable = Array.from(lanternFishByDaysToSpawn.entries())
  .map(([key, value]) => ({daysLeft: key, fish: value}));

for (let day = 0; day < daysToSimulate; day++) {
  lanternFishTable = lanternFishTable.map(v => {
    v.daysLeft--;
    return v;
  });

  const fishesThatWillSpanNew = lanternFishTable.find(v => v.daysLeft <= -1);
  if (!fishesThatWillSpanNew){
    continue;
  }

  const currentFishesOnSixDays = lanternFishTable.find(v => v.daysLeft === 6);
  if (currentFishesOnSixDays) {
    currentFishesOnSixDays.fish += fishesThatWillSpanNew.fish;
    lanternFishTable = lanternFishTable.filter(v => v !== fishesThatWillSpanNew);
  } else {
    fishesThatWillSpanNew.daysLeft = 6;
  }
  lanternFishTable.push({ daysLeft: 8, fish: fishesThatWillSpanNew.fish});
}

console.log(lanternFishTable.reduce((total, fishes) => total + fishes.fish, 0));