import Grid from 'classes/Grid';
import moveBlock from 'helpers/moveBlock';
import { randomizers } from 'helpers/Randomizers';
import rotateBlock from 'helpers/rotateBlock';
import getTetromino from 'data/getTetromino';

const grid = (): Grid => new Grid(0, 0);

export {
  grid,
  moveBlock as move,
  randomizers,
  rotateBlock as rotate,
  getTetromino as tetromino,
};
