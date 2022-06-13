import Grid from 'classes/Grid';
import rotateBlock from 'helpers/rotateBlock';
import getTetromino from 'data/getTetromino';

const grid = (): Grid => new Grid(0, 0);

export {
  grid,
  rotateBlock as rotate,
  getTetromino as tetromino,
};
