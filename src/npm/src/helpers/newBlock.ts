import Grid from 'classes/Grid';
import getTetromino from 'data/getTetromino';
import TetrominoType from 'models/TetrominoType';
import Block from 'models/Block';
import {
  startCoordinateGenerators,
  offsetCoordinateGenerators,
} from './CoordinateGenerators';
import getBlockOffsetWithNoOverlap from './getBlockOffsetWithNoOverlap';

const newBlock = (
  type: TetrominoType,
  grid: Grid,
  startCoordinateGenerator: string = 'default',
  offsetCoordinateGenerator: string = 'default',
): Block => {

  const getStartCoordinate = startCoordinateGenerators[startCoordinateGenerator](type, grid);  
  const getNextOffsetCoordinate = offsetCoordinateGenerators[offsetCoordinateGenerator]();
  const tetromino = getTetromino(type);

  const result: Block = {
    ...getStartCoordinate.next(),
    coordinates: [...tetromino.coordinates],
  };

  const offset = getBlockOffsetWithNoOverlap(result, grid, getNextOffsetCoordinate);

  result.x += offset.x;
  result.y += offset.y;
  return result;
};

export default newBlock;