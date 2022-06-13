import Block from 'models/Block';
import Rotation from 'models/Rotation';
import Grid from 'classes/Grid';
import Coordinate from 'models/Coordinate';
import CoordinateGenerator from 'models/CoordinateGenerator';
import { getNextCoordinateDefault } from './CoordinateGenerators';

const rotateBlock = (
  block: Block,
  grid: Grid,
  rotation: Rotation = Rotation.CLOCKWISE,
  getNextCoordinate: CoordinateGenerator = getNextCoordinateDefault(),
): Block => {

  /* Assumption - each coordinate of block has id > 0. */

  /* List of ids from block required to do lookups without altering grid */

  const ids = [0, ...block.coordinates.map(coordinate => coordinate.id)];

  /* Returned Block object needs to be deep-copy of original */

  const result: Block = {
    x: block.x,
    y: block.y,
    coordinates: block.coordinates.map(coordinate => ({...coordinate})),
  };

  /* Basic rotation around origin coordinate is simple mapping. */

  result.coordinates.forEach(coordinate => {
    const x = coordinate.x, y = coordinate.y;
    if (rotation === Rotation.CLOCKWISE) {
      coordinate.x = (y === 0 ? 0 : -y);
      coordinate.y = x;
    }
    else {
      coordinate.x = y;
      coordinate.y = (x === 0 ? 0 : -x);
    }
  });

  let offset: Coordinate = null;
  getNextCoordinate.reset();

  while (offset === null) {
    const next = getNextCoordinate.next();
    let isValid = true;
    for (var coordinate of result.coordinates) {
      const
        x = result.x + next.x + coordinate.x,
        y = result.y + next.y + coordinate.y;

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

  result.x += offset.x;
  result.y += offset.y;
  return result;
};

export default rotateBlock;
