import { Grid } from '../classes/Grid';
import Block from 'models/Block';
import { pushBlock } from './moveBlock';

describe('pushBlock', () => {

  test('returns correct result if no spaces to move based on grid limits', () => {
    // ARRANGE
    /*
    ----------
    ----------
    ----------
    ------+---
    ------++--
    ------+---
    */
    const block: Block = {
      x: 6,
      y: 4,
      coordinates: [
        { x: 0, y: -1, id: 1 },
        { x: 0, y:  0, id: 2 },
        { x: 1, y:  0, id: 3 },
        { x: 0, y:  1, id: 4 },
      ]
    };
    const grid: Grid = new Grid(10, 6);
    const expected: Block = {
      x: 6,
      y: 4,
      coordinates: [
        { x: 0, y: -1, id: 1 },
        { x: 0, y:  0, id: 2 },
        { x: 1, y:  0, id: 3 },
        { x: 0, y:  1, id: 4 },
      ]
    }

    // ACT
    const actual = pushBlock(block, grid);

    // ASSERT
    expect(actual).toEqual(expected);
  });

  test('returns correct result if no spaces to move based on pieces', () => {
    // ARRANGE
    /*
    ----------
    ----------
    ------+---
    ------++--
    -----X+---
    ---XXXXXX-
    */
    const block: Block = {
      x: 6,
      y: 3,
      coordinates: [
        { x: 0, y: -1, id: 1 },
        { x: 0, y:  0, id: 2 },
        { x: 1, y:  0, id: 3 },
        { x: 0, y:  1, id: 4 },
      ]
    };
    const grid: Grid = new Grid(10, 6);
    grid.setSpace(1,  6,  2);
    grid.setSpace(2,  6,  3);
    grid.setSpace(3,  7,  3);
    grid.setSpace(4,  6,  4);
    grid.setSpace(5,  3,  5);
    grid.setSpace(6,  4,  5);
    grid.setSpace(7,  5,  4);
    grid.setSpace(8,  5,  5);
    grid.setSpace(9,  6,  5);
    grid.setSpace(10, 7,  5);
    grid.setSpace(11, 8,  5);

    const expected: Block = {
      x: 6,
      y: 3,
      coordinates: [
        { x: 0, y: -1, id: 1 },
        { x: 0, y:  0, id: 2 },
        { x: 1, y:  0, id: 3 },
        { x: 0, y:  1, id: 4 },
      ]
    }

    // ACT
    const actual = pushBlock(block, grid);

    // ASSERT
    expect(actual).toEqual(expected);
  });

  test('returns correct result if spaces to move until grid limits', () => {
    // ARRANGE
    /*
    ----------
    ------+---
    ------++--
    ------+---
    ----------
    ----------
    */
    const block: Block = {
      x: 6,
      y: 2,
      coordinates: [
        { x: 0, y: -1, id: 1 },
        { x: 0, y:  0, id: 2 },
        { x: 1, y:  0, id: 3 },
        { x: 0, y:  1, id: 4 },
      ]
    };
    const grid: Grid = new Grid(10, 6);
    const expected: Block = {
      x: 6,
      y: 4,
      coordinates: [
        { x: 0, y: -1, id: 1 },
        { x: 0, y:  0, id: 2 },
        { x: 1, y:  0, id: 3 },
        { x: 0, y:  1, id: 4 },
      ]
    }

    // ACT
    const actual = pushBlock(block, grid);

    // ASSERT
    expect(actual).toEqual(expected);
  });

  test('returns correct result if spaces to move until pieces', () => {
    // ARRANGE
    /*
    ----------
    ------+---
    ------++--
    ------+---
    -----X----
    ---XXXXXX-
    */
    const block: Block = {
      x: 6,
      y: 2,
      coordinates: [
        { x: 0, y: -1, id: 1 },
        { x: 0, y:  0, id: 2 },
        { x: 1, y:  0, id: 3 },
        { x: 0, y:  1, id: 4 },
      ]
    };
    const grid: Grid = new Grid(10, 6);
    grid.setSpace(1,  6,  1);
    grid.setSpace(2,  6,  2);
    grid.setSpace(3,  7,  2);
    grid.setSpace(4,  6,  3);
    grid.setSpace(5,  3,  5);
    grid.setSpace(6,  4,  5);
    grid.setSpace(7,  5,  4);
    grid.setSpace(8,  5,  5);
    grid.setSpace(9,  6,  5);
    grid.setSpace(10, 7,  5);
    grid.setSpace(11, 8,  5);

    const expected: Block = {
      x: 6,
      y: 3,
      coordinates: [
        { x: 0, y: -1, id: 1 },
        { x: 0, y:  0, id: 2 },
        { x: 1, y:  0, id: 3 },
        { x: 0, y:  1, id: 4 },
      ]
    }

    // ACT
    const actual = pushBlock(block, grid);

    // ASSERT
    expect(actual).toEqual(expected);
  });

  test('returns correct result if no spaces to move to where restriction is not from max Y', () => {
    // ARRANGE
    /*
    ----------
    ------+---
    ------++--
    ------+X--
    ----------
    -------X--
    */
    const block: Block = {
      x: 6,
      y: 2,
      coordinates: [
        { x: 0, y: -1, id: 1 },
        { x: 0, y:  0, id: 2 },
        { x: 1, y:  0, id: 3 },
        { x: 0, y:  1, id: 4 },
      ]
    };
    const grid: Grid = new Grid(10, 6);
    grid.setSpace(1,  6,  1);
    grid.setSpace(2,  6,  2);
    grid.setSpace(3,  7,  2);
    grid.setSpace(4,  6,  3);
    grid.setSpace(5,  7,  3);
    grid.setSpace(6,  7,  5);

    const expected: Block = {
      x: 6,
      y: 2,
      coordinates: [
        { x: 0, y: -1, id: 1 },
        { x: 0, y:  0, id: 2 },
        { x: 1, y:  0, id: 3 },
        { x: 0, y:  1, id: 4 },
      ]
    }

    // ACT
    const actual = pushBlock(block, grid);

    // ASSERT
    expect(actual).toEqual(expected);
  });

  test('returns correct result if no spaces to move until restriction is not from max Y', () => {
    // ARRANGE
    /*
    ------+---
    ------++--
    ------+---
    -------X--
    ----------
    -------X--
    */
    const block: Block = {
      x: 6,
      y: 1,
      coordinates: [
        { x: 0, y: -1, id: 1 },
        { x: 0, y:  0, id: 2 },
        { x: 1, y:  0, id: 3 },
        { x: 0, y:  1, id: 4 },
      ]
    };
    const grid: Grid = new Grid(10, 6);
    grid.setSpace(1,  6,  0);
    grid.setSpace(2,  6,  1);
    grid.setSpace(3,  7,  1);
    grid.setSpace(4,  6,  2);
    grid.setSpace(5,  7,  3);
    grid.setSpace(6,  7,  5);

    const expected: Block = {
      x: 6,
      y: 2,
      coordinates: [
        { x: 0, y: -1, id: 1 },
        { x: 0, y:  0, id: 2 },
        { x: 1, y:  0, id: 3 },
        { x: 0, y:  1, id: 4 },
      ]
    }

    // ACT
    const actual = pushBlock(block, grid);

    // ASSERT
    expect(actual).toEqual(expected);
  });

})