const { test, expect } = require('@jest/globals');
const snailfishCalculator = require('./snailfish-calculator.js');

test('[add] should add two numbers', () => {
  const result = snailfishCalculator.add('3','2');

  expect(result).toBe('[3,2]');
});

test('[add] should add number and pair', () => {
  const result = snailfishCalculator.add('3','[2,2]');

  expect(result).toBe('[3,[2,2]]');
});

test('[add] should split numbers larger than 10', () => {
  const result = snailfishCalculator.add('3','[12,2]');

  expect(result).toBe('[3,[[6,6],2]]');
});

test('[add] should split uneven number correctly', () => {
  const result = snailfishCalculator.add('3','[13,2]');

  expect(result).toBe('[3,[[6,7],2]]');
});

test('[add] should split multiple numbers', () => {
  const result = snailfishCalculator.add('3','[13,15]');

  expect(result).toBe('[3,[[6,7],[7,8]]]');
});

test('[add] should explode number when 5 levels down', () => {
  const result = snailfishCalculator.add('3','[[1,[[2,3],5]]]');

  expect(result).toBe('[3,[[3,[0,8]]]]');
});

test('[add] should explode pair in second position', () => {
  const result = snailfishCalculator.add('3','[[1,[5,[2,3]]]]');

  expect(result).toBe('[3,[[1,[7,0]]]]');
});

test('[magnitude] should give correct magnitude for single pair', () => {
  const result = snailfishCalculator.magnitude('[3,2]');

  expect(result).toBe(13);
});

test('[magnitude] should give correct magnitude for multi level pair', () => {
  const result = snailfishCalculator.magnitude('[[3,2],[3,2]]');

  expect(result).toBe(65);
});