import Grid from 'classes/Grid';
import Coordinate from 'models/Coordinate';
import CoordinateGenerator from 'models/CoordinateGenerator';
import TetrominoType from 'models/TetrominoType';
import random from './random';

const getNextOffsetCoordinateDefault = (): CoordinateGenerator => {

  const next: Coordinate = { x: 0, y: 0 };

  return ({
    next: (): Coordinate => {
      const result: Coordinate = { ...next };
      if (next.x >= 0 && next.y < 0) {
        next.x++; next.y++;
      }
      else if (next.x > 0 && next.y >= 0) {
        next.x--; next.y++;
      }
      else if (next.x <= 0 && next.y > 0) {
        next.x--; next.y--;
      }
      else if (next.x < 0 && next.y <= 0) {
        next.y -= (++next.x === 0 ? 2 : 1);
      }
      else {
        next.y--;
      }
      return result;
    },
    reset: (): void => {
      next.x = 0; next.y = 0;
    },
  });

};

const offsetCoordinateGenerators: Record<string, () => CoordinateGenerator> = {
  'default': getNextOffsetCoordinateDefault,
};

const getNextStartCoordinateDefault = (_: TetrominoType, grid: Grid): CoordinateGenerator => {

  return ({
    next: (): Coordinate => ({
      x: Math.floor(random() * grid.getWidth()),
      y: 0
    }),
    reset: (): void => { },
  });

};

const startCoordinateGenerators: Record<string, (type: TetrominoType, grid: Grid) => CoordinateGenerator> = {
  'default': getNextStartCoordinateDefault,
};

export {
  offsetCoordinateGenerators,
  getNextOffsetCoordinateDefault,
  startCoordinateGenerators,
  getNextStartCoordinateDefault,
};