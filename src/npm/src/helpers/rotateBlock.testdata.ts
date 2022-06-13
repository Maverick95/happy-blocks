/* Test data requires a block, instructions to construct a grid, and an expected block. */

import Block from 'models/Block';
import Coordinate from 'models/Coordinate';
import rotateBlock from './rotateBlock';

interface RotateBlockDefaultTestData {
  block: Block,
  width: number,
  height: number,
  spaces: Coordinate[],
  expected: Block,
}

/* Here is a poor text representation of the test cases. */

/*
- means unoccupied
X means occupied
+ means occupied by a piece to be rotated
O indicates the origin
*/

const testData: RotateBlockDefaultTestData[] = [

  /*
  ----------
  ----------
  ------+---
  ----O-++--
  ------+---
  XXXXXXXXXX
  */

  {
    block: {
      x: 4,
      y: 3,
      coordinates: [
        { x: 2, y: -1, id: 1, },
        { x: 2, y:  0, id: 2, },
        { x: 3, y:  0, id: 3, },
        { x: 2, y:  1, id: 4, },
      ],
    },
    width: 10,
    height: 6,
    spaces: [
      { x: 0, y: 5, id: 101, },
      { x: 1, y: 5, id: 102, },
      { x: 2, y: 5, id: 103, },
      { x: 3, y: 5, id: 104, },
      { x: 4, y: 5, id: 105, },
      { x: 5, y: 5, id: 106, },
      { x: 6, y: 5, id: 107, },
      { x: 7, y: 5, id: 108, },
      { x: 8, y: 5, id: 109, },
      { x: 9, y: 5, id: 110, },
    ],
    expected: {
      x: 4,
      y: 1,
      coordinates: [
        { x:  1, y:  2, id: 1, },
        { x:  0, y:  2, id: 2, },
        { x:  0, y:  3, id: 3, },
        { x: -1, y:  2, id: 4, },
      ],
    },
  },

  /*
  ----------
  +---------
  +---------
  +O--------
  +---------
  +---------
  */

  {
    block: {
      x: 1,
      y: 3,
      coordinates: [
        { x: -1, y: -2, id: 1, },
        { x: -1, y: -1, id: 2, },
        { x: -1, y:  0, id: 3, },
        { x: -1, y:  1, id: 4, },
        { x: -1, y:  2, id: 5, },
      ],
    },
    width: 10,
    height: 6,
    spaces: [],
    expected: {
      x: 2,
      y: 3,
      coordinates: [
        { x:  2, y: -1, id: 1, },
        { x:  1, y: -1, id: 2, },
        { x:  0, y: -1, id: 3, },
        { x: -1, y: -1, id: 4, },
        { x: -2, y: -1, id: 5, },
      ],
    },
  },

  /*
  ----------
  ----------
  --++x-----
  xx++xx----
  xxxOxxxxxx
  xxxxxxxxxx
  */

  {
    block: {
      x: 3,
      y: 4,
      coordinates: [
        { x: -1, y: -2, id: 1, },
        { x: -1, y: -1, id: 2, },
        { x:  0, y: -2, id: 3, },
        { x:  0, y: -1, id: 4, },
      ],
    },
    width: 10,
    height: 6,
    spaces: [
      { x: 4, y: 2, id: 101, },
      { x: 0, y: 3, id: 102, },
      { x: 1, y: 3, id: 103, },
      { x: 4, y: 3, id: 104, },
      { x: 5, y: 3, id: 105, },
      { x: 0, y: 4, id: 106, },
      { x: 1, y: 4, id: 107, },
      { x: 2, y: 4, id: 108, },
      { x: 4, y: 4, id: 109, },
      { x: 5, y: 4, id: 110, },
      { x: 6, y: 4, id: 111, },
      { x: 7, y: 4, id: 112, },
      { x: 8, y: 4, id: 113, },
      { x: 9, y: 4, id: 114, },
      { x: 0, y: 5, id: 115, },
      { x: 1, y: 5, id: 116, },
      { x: 2, y: 5, id: 117, },
      { x: 3, y: 5, id: 118, },
      { x: 4, y: 5, id: 119, },
      { x: 5, y: 5, id: 120, },
      { x: 6, y: 5, id: 121, },
      { x: 7, y: 5, id: 122, },
      { x: 8, y: 5, id: 123, },
      { x: 9, y: 5, id: 124, },
    ],
    expected: {
      x: 3,
      y: 1,
      coordinates: [
        { x:  2, y: -1, id: 1, },
        { x:  1, y: -1, id: 2, },
        { x:  2, y:  0, id: 3, },
        { x:  1, y:  0, id: 4, },
      ],
    },
  },

  /*
  ----------
  ---------+
  --x----x-O
  --x--x-x-+
  -xx--x-x-+
  -xxxx-x-x+
  */

  {
    block: {
      x: 9,
      y: 2,
      coordinates: [
        { x:  0, y: -1, id: 1, },
        { x:  0, y:  0, id: 2, },
        { x:  0, y:  1, id: 3, },
        { x:  0, y:  2, id: 4, },
        { x:  0, y:  3, id: 5, },
      ],
    },
    width: 10,
    height: 6,
    spaces: [
      { x: 2, y: 2, id: 101, },
      { x: 7, y: 2, id: 102, },
      { x: 2, y: 3, id: 103, },
      { x: 5, y: 3, id: 104, },
      { x: 7, y: 3, id: 105, },
      { x: 1, y: 4, id: 106, },
      { x: 2, y: 4, id: 107, },
      { x: 5, y: 4, id: 108, },
      { x: 7, y: 4, id: 109, },
      { x: 1, y: 5, id: 110, },
      { x: 2, y: 5, id: 111, },
      { x: 3, y: 5, id: 112, },
      { x: 4, y: 5, id: 113, },
      { x: 6, y: 5, id: 114, },
      { x: 8, y: 5, id: 115, },
    ],
    expected: {
      x: 8,
      y: 1,
      coordinates: [
        { x:  1, y:  0, id: 1, },
        { x:  0, y:  0, id: 2, },
        { x: -1, y:  0, id: 3, },
        { x: -2, y:  0, id: 4, },
        { x: -3, y:  0, id: 5, },
      ],
    },
  },

  /*
  ----------
  ---+++o---
  ----+-----
  ----+-----
  ----------
  ----------
  */

  {
    block: {
      x: 6,
      y: 1,
      coordinates: [
        { x: -3, y:  0, id: 1, },
        { x: -2, y:  0, id: 2, },
        { x: -2, y:  1, id: 3, },
        { x: -2, y:  2, id: 4, },
        { x: -1, y:  0, id: 5, },
      ],
    },
    width: 10,
    height: 6,
    spaces: [],
    expected: {
      x: 6,
      y: 1,
      coordinates: [
        { x:  0, y: -3, id: 1, },
        { x:  0, y: -2, id: 2, },
        { x: -1, y: -2, id: 3, },
        { x: -2, y: -2, id: 4, },
        { x:  0, y: -1, id: 5, },
      ],
    },
  },

];

export {
  RotateBlockDefaultTestData,
  testData,
};