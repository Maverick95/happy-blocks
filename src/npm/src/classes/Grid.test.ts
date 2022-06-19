import { DeleteRowsResult, Grid } from './Grid';

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
      { id:  1, x: 0, y: 1, },      //  - - -         - - -
      { id:  2, x: 0, y: 2, },      //  X - -         - - -
      { id:  3, x: 1, y: 2, },      //  X X X         - - -
      { id:  4, x: 2, y: 2, },      //  X - -     ->  - - -
      { id:  5, x: 0, y: 3, },      //  - X X         X X X
      { id:  6, x: 1, y: 4, },      //  X - X         X - -
      { id:  7, x: 2, y: 4, },      //  X X X         X - X
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
    const expected_result: DeleteRowsResult = {
      delete: [
        { id: 10, x: 0, y: 6 },
        { id: 11, x: 1, y: 6 },
        { id: 12, x: 2, y: 6 },
        { id:  6, x: 1, y: 4 },
        { id:  7, x: 2, y: 4 },
        { id:  1, x: 0, y: 1 },
      ],
      update: [
        { id:  8, x: 0, y: 6, },
        { id:  9, x: 2, y: 6, },
        { id:  2, x: 0, y: 4, },
        { id:  3, x: 1, y: 4, },
        { id:  4, x: 2, y: 4, },
        { id:  5, x: 0, y: 5, },
      ],
    };
    // ACT
    input.forEach(({id, x, y}) => grid.setSpace(id, x, y));
    const actual_result = grid.deleteRows([1, 4, 6]);
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
    
    expect(actual_result).toEqual(expected_result);
  });

  // Test Case from real-world example of code failing.
  test('deleting rows TDD - case 1', () => {
    // ARRANGE
    const grid = new Grid(10, 20);

    grid.setSpace( 1, 9, 19);
    grid.setSpace( 2, 9, 18);
    grid.setSpace( 3, 8, 19);
    grid.setSpace( 4, 7, 19);
    grid.setSpace( 5, 6, 19);
    grid.setSpace( 6, 5, 19);
    
    grid.setSpace( 7, 5, 18);
    grid.setSpace( 8, 4, 19);
    grid.setSpace( 9, 2, 19);
    grid.setSpace(10, 3, 18);
    grid.setSpace(11, 3, 19);
    grid.setSpace(12, 4, 18);

    grid.setSpace(13, 0, 16);
    grid.setSpace(14, 0, 17);
    grid.setSpace(15, 0, 18);
    grid.setSpace(16, 0, 19);
    grid.setSpace(17, 6, 17);
    grid.setSpace(18, 6, 18);
    
    grid.setSpace(19, 7, 18);
    grid.setSpace(20, 8, 18);
    grid.setSpace(21, 2, 17);    
    grid.setSpace(22, 2, 18);
    grid.setSpace(23, 1, 18);
    grid.setSpace(24, 1, 19);

    /*
      -  -  -  -  -  -  -  -  -  -    0
    ...
     13  -  -  -  -  -  -  -  -  -    16
     14  - 21  -  -  - 17  -  -  -    17
     15 23 22 10 12  7 18 19 20  2    18
     16 24  9 11  8  6  5  4  3  1    19
    */

    const expected: DeleteRowsResult = {
      delete: [
        { id: 16, x:  0, y: 19 },
        { id: 24, x:  1, y: 19 },
        { id:  9, x:  2, y: 19 },
        { id: 11, x:  3, y: 19 },
        { id:  8, x:  4, y: 19 },
        { id:  6, x:  5, y: 19 },
        { id:  5, x:  6, y: 19 },
        { id:  4, x:  7, y: 19 },
        { id:  3, x:  8, y: 19 },
        { id:  1, x:  9, y: 19 },
        { id: 15, x:  0, y: 18 },
        { id: 23, x:  1, y: 18 },
        { id: 22, x:  2, y: 18 },
        { id: 10, x:  3, y: 18 },
        { id: 12, x:  4, y: 18 },
        { id:  7, x:  5, y: 18 },
        { id: 18, x:  6, y: 18 },
        { id: 19, x:  7, y: 18 },
        { id: 20, x:  8, y: 18 },
        { id:  2, x:  9, y: 18 },
      ],
      update: [
        { id: 13, x:  0, y: 18 },
        { id: 14, x:  0, y: 19 },
        { id: 21, x:  2, y: 19 },
        { id: 17, x:  6, y: 19 },
      ],
    };

    // ACT
    const actual = grid.deleteRows([18, 19, 18, 19, 19, 18]);

    // ASSERT
    expect(actual).toEqual(expected);
  });
});