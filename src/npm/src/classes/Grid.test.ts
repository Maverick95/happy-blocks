import Grid from './Grid';

describe('Grid', () => {
  test('initialization leaves empty grid', () => {
    // ARRANGE
    const width = 3, height = 5;
    const grid = new Grid(width, height);
    // ASSERT
    expect(grid.getWidth()).toEqual(width);
    expect(grid.getHeight()).toEqual(height);
    new Array(width).map((_, index) => index).forEach(x =>
      new Array(height).map((_, index) => index).forEach(y =>
        expect(grid.getSpace(x, y)).toEqual(0)
      ));
    new Array(height).map((_, index) => index).forEach(y =>
      expect(grid.getOccupiedForRow(y)).toEqual(0));
  });

  test.each([
    [ 1, -1 ], [ 1,  7 ],
    [-1,  1 ], [ 5,  1 ],
    [-1, -1 ], [-1,  7 ],
    [ 5, -1 ], [ 5,  7 ]
  ])('should be undefined at x=%d y=%d', (x, y) => {
    // ARRANGE
    const width = 3, height = 5;
    const grid = new Grid(width, height);
    // ASSERT
    expect(grid.getSpace(x, y)).toBeUndefined();
  });

  test('adding to grid space updates correctly', () => {
    // ARRANGE
    const width = 3, height = 5;
    const value = 7, x = 1, y = 2;
    const grid = new Grid(width, height);
    // ACT
    grid.setSpace(value, x, y);
    // ASSERT
    expect(grid.getSpace(x, y)).toEqual(value);
    expect(grid.getOccupiedForRow(y)).toEqual(1);
    // ACT
    grid.setSpace(value + 1, x, y);
    // ASSERT
    expect(grid.getSpace(x, y)).toEqual(value + 1);
    expect(grid.getOccupiedForRow(y)).toEqual(1);
  });

  test('removing from grid space updates correctly', () => {
    // ARRANGE
    const width = 3, height = 5;
    const value = 7, x = 1, y = 2;
    const grid = new Grid(width, height);
    // ACT
    grid.setSpace(value, x, y);
    grid.clearSpace(x, y);
    // ASSERT
    expect(grid.getSpace(x, y)).toEqual(0);
    expect(grid.getOccupiedForRow(y)).toEqual(0);
    // ACT
    grid.clearSpace(x, y);
    expect(grid.getSpace(x, y)).toEqual(0);
    expect(grid.getOccupiedForRow(y)).toEqual(0);
  });
});