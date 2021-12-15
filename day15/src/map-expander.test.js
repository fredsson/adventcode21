const { test, expect } = require('@jest/globals');
const mapExpander = require('./map-expander');

test('[expand] should return empty map', () => {
  const result = mapExpander.expand([]);

  expect(result).toEqual([]);
});

test('[expand] should expand vertically', () => {
  const result = mapExpander.expand(['23']);

  expect(result[0].slice(0,2)).toBe('23');
  expect(result[1].slice(0,2)).toBe('34');
});

test('[expand] should expand horizontally', () => {
  const result = mapExpander.expand(['23']);

  expect(result[0]).toBe('2334');
  expect(result[1]).toBe('3445');
});

test('[expand] should wrap risk level', () => {
  const result = mapExpander.expand(['29']);

  expect(result[0]).toBe('2931');
  expect(result[1]).toBe('3142');
});

test('[expand] should expand given number of times', () => {
  const result = mapExpander.expand(['29'], 2);

  expect(result[0]).toBe('293142');
  expect(result[1]).toBe('314253');
  expect(result[2]).toBe('425364');
});
