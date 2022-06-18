import Coordinate from 'models/Coordinate';
import CoordinateGenerator from 'models/CoordinateGenerator';

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

export {
  offsetCoordinateGenerators,
  getNextOffsetCoordinateDefault,
};