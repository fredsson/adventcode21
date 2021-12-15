const { test, expect } = require('@jest/globals');
const mapSolver = require('./map-solver');

test('[buildMapFromLines] should build empty map', () => {
  const map = mapSolver.buildMapFromLines([]);
  expect(map.length).toBe(0);
});

test('[buildMapFromLines] should build map with single tile', () => {
  const map = mapSolver.buildMapFromLines(['2']);

  expect(map.length).toBe(1);
  expect(map.get(0)).toBe(2);
});

test('[buildMapFromLines] should build map for multiple tiles on single line', () => {
  const map = mapSolver.buildMapFromLines(['233']);

  expect(map.get(0)).toBe(2);
  expect(map.get(1)).toBe(3);
  expect(map.get(2)).toBe(3);
});

test('[buildMapFromLines] should build map for multiple tiles on multiple lines', () => {
  const map = mapSolver.buildMapFromLines(['233', '546']);

  expect(map.get(0)).toBe(2);
  expect(map.get(3)).toBe(5);
  expect(map.get(5)).toBe(6);
});

test('[findCostForShortestPath] should give no cost for finding path to current location', () => {
  const map = mapSolver.buildMapFromLines(['']);

  const cost = mapSolver.findCostForShortestPath(map, 0, 0);

  expect(cost).toBe(0);
});

test('[findCostForShortestPath] should give cost for single tile path', () => {
  const map = mapSolver.buildMapFromLines(['24']);

  const cost = mapSolver.findCostForShortestPath(map, 0, 1);

  expect(cost).toBe(4);
});

test('[findCostForShortestPath] should give cost for small square', () => {
  const map = mapSolver.buildMapFromLines([
    '24',
    '56'
  ]);

  const cost = mapSolver.findCostForShortestPath(map, 0, 3);

  expect(cost).toBe(10);
});

test('[findCostForShortestPath] should give cost for small complex path', () => {
  const map = mapSolver.buildMapFromLines([
    '2438',
    '2348',
    '9118',
    '9155',
  ]);

  const cost = mapSolver.findCostForShortestPath(map, 0, 15);

  expect(cost).toBe(17);
});