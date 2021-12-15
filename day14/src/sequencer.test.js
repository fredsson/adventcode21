const { test, expect, it } = require("@jest/globals");
const sequencer = require('./sequencer');

test('[initialize] should initalize with single pair in sequence', () => {
  const instance = sequencer.initialize('NN');

  expect(instance.pairs().get('NN')).toBe(1);
});

test('[initialize] should initalize with multiple pairs in sequence', () => {
  const instance = sequencer.initialize('NNCB');

  expect(instance.pairs().get('CB')).toBe(1);
});

test('[sequence] should generate new pair', () => {
  const expectedInstructions = new Map([
    ['NN', 'C'],
    ['NC', 'B'],
    ['CB', 'H'],
  ]);

  const instance = sequencer.initialize('NNCB');
  instance.sequence(expectedInstructions);

  expect(instance.pairs().get('NC')).toBe(1);
});

it('[findMostAndLeastCommonElements] should return nothing for empty sequence', () => {
  const instance = sequencer.initialize('');

  const leastAndMostCommon = instance.findMostAndLeastCommonElements();


  expect(leastAndMostCommon.least.sum).toBe(0);
  expect(leastAndMostCommon.most.sum).toBe(0);
});

it('[findMostAndLeastCommonElements] should return most common for single pair', () => {
  const instance = sequencer.initialize('NN');

  const leastAndMostCommon = instance.findMostAndLeastCommonElements();

  expect(leastAndMostCommon.least.sum).toBe(2);
  expect(leastAndMostCommon.least.key).toBe('N');
  expect(leastAndMostCommon.most.sum).toBe(2);
  expect(leastAndMostCommon.most.key).toBe('N');
});

it('[findMostAndLeastCommonElements] should return most common for multiple pairs', () => {
  const instance = sequencer.initialize('NNB');

  const leastAndMostCommon = instance.findMostAndLeastCommonElements();

  expect(leastAndMostCommon.least.key).toBe('B');
  expect(leastAndMostCommon.least.sum).toBe(1);
  expect(leastAndMostCommon.most.key).toBe('N');
  expect(leastAndMostCommon.most.sum).toBe(2);
});

it('[findMostAndLeastCommonElements] should return most common after sequence', () => {
  const expectedInstructions = new Map([
    ['CH', 'B'],
    ['CB', 'H'],
    ['NH', 'C'],
    ['HB', 'C'],
    ['HC', 'B'],
    ['HN', 'C'],
    ['NN', 'C'],
    ['BH', 'H'],
    ['NC', 'B'],
    ['NB', 'B'],
    ['BN', 'B'],
    ['BB', 'N'],
    ['BC', 'B'],
    ['CC', 'N'],
    ['CN', 'C'],
  ]);
  const instance = sequencer.initialize('NCNBCHB');
  instance.sequence(expectedInstructions);

  const leastAndMostCommon = instance.findMostAndLeastCommonElements();

  expect(leastAndMostCommon.least.key).toBe('H');
  expect(leastAndMostCommon.least.sum).toBe(1);
  expect(leastAndMostCommon.most.key).toBe('B');
  expect(leastAndMostCommon.most.sum).toBe(6);
});