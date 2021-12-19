const { test, expect } = require('@jest/globals');
const box = require('./box');

test('[initialize] should provide correct position', () => {
  let b = box.initialize([[20, 10], [5, 20]]);

  expect(b.position[0]).toBe(10);
  expect(b.position[1]).toBe(5);
});

test('[initialize] should provide correct negative position', () => {
  let b = box.initialize([[20, -10], [5, 20]]);

  expect(b.position[0]).toBe(-10);
  expect(b.position[1]).toBe(5);
});

test('[initialize] should provide correct size', () => {
  let b = box.initialize([[20, 10], [5, 20]]);

  expect(b.size[0]).toBe(10);
  expect(b.size[1]).toBe(15);
});

test('[initialize] should provide correct size when in negative', () => {
  let b = box.initialize([[-10, 30], [5, -5]]);

  expect(b.size[0]).toBe(40);
  expect(b.size[1]).toBe(10);
});

test('[inside] should be inside box', () => {
  let b = box.initialize([[20, 10], [5, 20]]);

  expect(box.inside(b, 15, 6)).toBe(true);
});

test('[inside] should not be inside box when x is outside', () => {
  let b = box.initialize([[20, 10], [5, 20]]);

  expect(box.inside(b, 1, 6)).toBe(false);
});

test('[inside] should not be inside box when y is outside', () => {
  let b = box.initialize([[20, 10], [5, 20]]);

  expect(box.inside(b, 14, -2)).toBe(false);
});

test('[inside] should be inside box when x start in negative', () => {
  let b = box.initialize([[20, -10], [5, 20]]);

  expect(box.inside(b, -7, 15)).toBe(true);
});

test('[inside] should be inside box when y start in negative', () => {
  let b = box.initialize([[20, -10], [-5, 20]]);

  expect(box.inside(b, 7, -2)).toBe(true);
});

test('[hasPassed] should have passed when x is after box edge', () => {
  let b = box.initialize([[20, -10], [-5, 20]]);

  expect(box.hasPassed(b, 21, -2)).toBe(true);
});

test('[hasPassed] should not have passed when x is inside box', () => {
  let b = box.initialize([[20, -10], [-5, 20]]);

  expect(box.hasPassed(b, 15, -2)).toBe(false);
});

test('[hasPassed] should not have passed when x is before box', () => {
  let b = box.initialize([[20, -10], [-5, 20]]);

  expect(box.hasPassed(b, -20, -2)).toBe(false);
});

test('[hasPassed] should have passed when y is after box edge', () => {
  let b = box.initialize([[20, -10], [-5, 20]]);

  expect(box.hasPassed(b, 15, -7)).toBe(true);
});

test('[hasPassed] should not have passed when y is inside box', () => {
  let b = box.initialize([[20, -10], [-5, 20]]);

  expect(box.hasPassed(b, 15, 15)).toBe(false);
});

test('[hasPassed] should not have passed when y is before box', () => {
  let b = box.initialize([[20, -10], [-5, 20]]);

  expect(box.hasPassed(b, 15, -3)).toBe(false);
});

test('[hasPassed] should not have passed when y is above box and box is in negatives', () => {
  let b = box.initialize([[20, 30], [-5, -10]]);

  expect(box.hasPassed(b, 0, 0)).toBe(false);
});