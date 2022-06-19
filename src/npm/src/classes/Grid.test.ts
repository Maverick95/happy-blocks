import { Grid } from './Grid';

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

  test('deleting rows updates grid correctly', () => {
    // ARRANGE
    const width = 3, height = 7;
    const grid = new Grid(width, height);
    const input = [
      { id:  1, x: 0, y: 1, },      //  - - -
      { id:  2, x: 0, y: 2, },      //  X - -
      { id:  3, x: 1, y: 2, },      //  X X X    
      { id:  4, x: 2, y: 2, },      //  X - -
      { id:  5, x: 0, y: 3, },      //  - X X
      { id:  6, x: 1, y: 4, },      //  X - X
      { id:  7, x: 2, y: 4, },      //  X X X
      { id:  8, x: 0, y: 5, },
      { id:  9, x: 2, y: 5, },
      { id: 10, x: 0, y: 6, },
      { id: 11, x: 1, y: 6, },
      { id: 12, x: 2, y: 6, },
    ];
    const expected_spaces = [
      { id:  2, x: 0, y: 4, },
      { id:  3, x: 1, y: 4, },    
      { id:  4, x: 2, y: 4, },
      { id:  5, x: 0, y: 5, },
      { id:  8, x: 0, y: 6, },
      { id:  9, x: 2, y: 6, },
    ];
    const expected_occupied = [ 0, 0, 0, 0, 3, 1, 2 ];
    // ACT
    input.forEach(({id, x, y}) => grid.setSpace(id, x, y));
    grid.deleteRows([1, 4, 6]);
    // ASSERT
    new Array(width).map((_, index) => index).forEach(x =>
      new Array(height).map((_, index) => index).forEach(y => {
        const expected_lookup = expected_spaces.find((value) => value.x === x && value.y === y);
        if (expected_lookup) {
          expect(grid.getSpace(x, y)).toEqual(expected_lookup.id);
        }
        else {
          expect(grid.getSpace(x, y)).toEqual(0);
        }
      }
    ));
    new Array(height).map((_, index) => index).forEach(y =>
      expect(grid.getOccupiedForRow(y)).toEqual(expected_occupied[y]));
  });
});