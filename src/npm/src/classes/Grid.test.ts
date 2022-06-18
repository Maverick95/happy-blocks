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

});