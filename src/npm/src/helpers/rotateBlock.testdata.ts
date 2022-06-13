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

/*
----------
----------
------+---
----O-++--
------+---
XXXXXXXXXX
*/

const testData: RotateBlockDefaultTestData[] = [
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
      { x: 0, y: 5, id:  5, },
      { x: 1, y: 5, id:  6, },
      { x: 2, y: 5, id:  7, },
      { x: 3, y: 5, id:  8, },
      { x: 4, y: 5, id:  9, },
      { x: 5, y: 5, id: 10, },
      { x: 6, y: 5, id: 11, },
      { x: 7, y: 5, id: 12, },
      { x: 8, y: 5, id: 13, },
      { x: 9, y: 5, id: 14, },
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
  }
];

export {
  RotateBlockDefaultTestData,
  testData,
};