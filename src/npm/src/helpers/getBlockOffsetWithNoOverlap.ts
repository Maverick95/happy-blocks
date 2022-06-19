import Block from 'models/Block';
import { Grid } from 'classes/Grid';
import CoordinateGenerator from 'models/CoordinateGenerator';
import Coordinate from 'models/Coordinate';
import { getNextOffsetCoordinateDefault } from './CoordinateGenerators';

const getBlockOffsetWithNoOverlap = (
  block: Block,
  grid: Grid,
  getNextOffsetCoordinate: CoordinateGenerator = getNextOffsetCoordinateDefault()
): Coordinate => {

  /* Assumption - each coordinate of block has id > 0. */

  /* List of ids from block required to do lookups without altering grid */

  const ids = [0, ...block.coordinates.map(coordinate => coordinate.id)];

  let offset: Coordinate = null;
  getNextOffsetCoordinate.reset();

  while (offset === null) {
    const next = getNextOffsetCoordinate.next();
    let isValid = true;
    for (var coordinate of block.coordinates) {
      const
        x = block.x + next.x + coordinate.x,
        y = block.y + next.y + coordinate.y;

      /* Normal check on y < 0 excluded so that rotations can allow parts of pieces to plot above the top of the grid (possible in Tetris). */
      /* Last condition is slightly nuanced, grid check is enforced to be inside boundaries so that certain grid behaviour is catered for. */
      
      if (x < 0 || x >= grid.getWidth() || y >= grid.getHeight() || (y >= 0 && !ids.includes(grid.getSpace(x, y)))) {
        isValid = false;
        break;
      }
    }
    if (isValid) {
      offset = {...next};
    }
  }

  return offset;

};

export default getBlockOffsetWithNoOverlap;