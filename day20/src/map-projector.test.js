const { test, expect } = require('@jest/globals');
const mapProjector = require('./map-projector');

test('[neighbors] should give no neighbors for empty map', () => {
  const projection = mapProjector.init(0, 0);

  const neighbors = projection.neighbors(0);

  expect(neighbors).toEqual([
    undefined, undefined, undefined,
    undefined, undefined, undefined,
    undefined, undefined, undefined
  ]);
});

test('[neighbors] should give correct corner neighbors for double sized map', () => {
  const projection = mapProjector.init(2, 4);

  const neighbors = projection.neighbors(0);

  expect(neighbors).toEqual([
    undefined, undefined, undefined,
    undefined, undefined, undefined,
    undefined, undefined, 0
  ]);
});

test('[neighbors] should give correct end corner neighbor for double sized map', () => {
  const projection = mapProjector.init(2, 4);

  const neighbors = projection.neighbors(3);

  expect(neighbors).toEqual([
    undefined, undefined, undefined,
    undefined, undefined, undefined,
    1, undefined, undefined
  ]);
});


test('[neighbors] should give correct center neighbors', () => {
  const projection = mapProjector.init(2, 4);

  const neighbors = projection.neighbors(5);

  expect(neighbors).toEqual([
    undefined, undefined, undefined,
    undefined, 0, 1,
    undefined, 2, 3
  ]);
});

test('[neighbors] should give correct center neighbors', () => {
  const projection = mapProjector.init(2, 4);

  const neighbors = projection.neighbors(12);

  expect(neighbors).toEqual([
    undefined, undefined, 2,
    undefined, undefined, undefined,
    undefined, undefined, undefined
  ]);
});

// # .
// . #

// . . . .
// . # . .
// . . # .
// . . . .

/*test('[project] should give correct top-middle neighbor for double sized map', () => {
  const projection = mapProjector.init(2, 4);

  const neighbors = projection.neighbors(3);

  expect(neighbors).toEqual([
    undefined, undefined, undefined,
    undefined, undefined, undefined,
    1, 2, 3
  ]);
});*/