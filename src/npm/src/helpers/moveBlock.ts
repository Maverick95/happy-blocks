import Direction from 'models/Direction';
import Block from 'models/Block';
import { Grid } from 'classes/Grid';
import getBlockOffsetWithNoOverlap from './getBlockOffsetWithNoOverlap';

const moveBlock = (
  block: Block,
  grid: Grid,
  direction: Direction
): Block => {

  /* List of ids from block required to do lookups without altering grid */

  const ids = [0, ...block.coordinates.map(coordinate => coordinate.id)];

  /* Returned Block object needs to be deep-copy of original */

  const result: Block = {
    x: block.x,
    y: block.y,
    coordinates: block.coordinates.map(coordinate => ({...coordinate})),
  };

  switch (direction) {
    case Direction.LEFT:
      result.x--;
    break;
    case Direction.DOWN:
      result.y++;
    break;
    case Direction.RIGHT:
      result.x++;
    break;
  }

  let isValid = true;
  for (var coordinate of result.coordinates) {
    const
      x = result.x + coordinate.x,
      y = result.y + coordinate.y;

    /* Normal check on y < 0 excluded so that rotations can allow parts of pieces to plot above the top of the grid (possible in Tetris). */
    /* Last condition is slightly nuanced, grid check is enforced to be inside boundaries so that certain grid behaviour is catered for. */
    
    if (x < 0 || x >= grid.getWidth() || y >= grid.getHeight() || (y >= 0 && !ids.includes(grid.getSpace(x, y)))) {
      isValid = false;
      break;
    }
  }

  return isValid ? result : null;

};

const pushBlock = (
  block: Block,
  grid: Grid,
): Block => {

  /* List of ids from block required to do lookups without altering grid */

  const ids = [0, ...block.coordinates.map(coordinate => coordinate.id)];

  /* Returned Block object needs to be deep-copy of original */

  const result: Block = {
    x: block.x,
    y: block.y,
    coordinates: block.coordinates.map(coordinate => ({...coordinate})),
  };

  /* Group yMax by x for block. */

  const columns = {};
  block.coordinates.forEach(coordinate => {
    if (typeof columns[coordinate.x] === 'undefined') {
      columns[coordinate.x] = coordinate.y;
    }
    else if (coordinate.y > columns[coordinate.x]) {
      columns[coordinate.x] = coordinate.y;
    }
  });

  let yDiff = 0;
  let continueCheck = true;

  while (continueCheck) {
    Object.keys(columns).forEach(x => {
      const xGrid = block.x + parseInt(x);
      const yGrid = block.y + columns[x] + yDiff + 1;
      if (yGrid >= grid.getHeight() || !ids.includes(grid.getSpace(xGrid, yGrid))) {
        continueCheck = false;
      }
    });
    if (continueCheck) { yDiff++; }
  }

  result.y += yDiff;
  return result;
};

export {
  moveBlock,
  pushBlock,
};