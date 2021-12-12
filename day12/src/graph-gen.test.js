const { expect } = require('@jest/globals');
const graphGen = require('./graph-gen');

test('should return empty graph when there is no segments', () => {
  const graph = graphGen.parseIntoTree([]);
  expect(graph).toEqual(new Map());
});

test('should return graph with single segment', () => {
  const expectedMap = new Map([
    ['start', {key: 'start', neighbors: ['a']}],
    ['a', {key: 'a', neighbors: ['start']}]
  ]);
  const graph = graphGen.parseIntoTree(['start-a']);
  expect(graph).toEqual(expectedMap);
});

test('should return graph with multiple neighbors for single node', () => {
  const expectedMap = new Map([
    ['start', {key: 'start', neighbors: ['a', 'b']}],
    ['a', {key: 'a', neighbors: ['start']}],
    ['b', {key: 'b', neighbors: ['start']}]
  ]);
  const graph = graphGen.parseIntoTree(['start-a', 'start-b']);
  expect(graph).toEqual(expectedMap);
});

test('should return graph with multiple levels of neighbors', () => {
  const expectedMap = new Map([
    ['start', {key: 'start', neighbors: ['a']}],
    ['a', {key: 'a', neighbors: ['start', 'b']}],
    ['b', {key: 'b', neighbors: ['a']}]
  ]);
  const graph = graphGen.parseIntoTree(['start-a', 'a-b']);
  expect(graph).toEqual(expectedMap);
});
