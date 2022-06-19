import Block from 'models/Block';
import Rotation from 'models/Rotation';
import { Grid } from 'classes/Grid';
import { offsetCoordinateGenerators } from './CoordinateGenerators';
import getBlockOffsetWithNoOverlap from './getBlockOffsetWithNoOverlap';

const rotateBlock = (
  block: Block,
  grid: Grid,
  rotation: Rotation = Rotation.CLOCKWISE,
  offsetCoordinateGenerator: string = 'default',
): Block => {

  /* Assumption - each coordinate of block has id > 0. */

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

  const getNextOffsetCoordinate = offsetCoordinateGenerators[offsetCoordinateGenerator](); 

  const offset = getBlockOffsetWithNoOverlap(result, grid, getNextOffsetCoordinate);
  result.x += offset.x;
  result.y += offset.y;
  return result;
};

export default rotateBlock;
