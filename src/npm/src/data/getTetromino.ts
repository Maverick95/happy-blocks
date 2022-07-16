import { TetrominoType } from 'models/TetrominoType';
import Tetromino from 'models/Tetromino';

const tetrominos = (): Record<TetrominoType, Tetromino> => ({
  
  [TetrominoType.O]: {
      classNames: ['tetromino-o'],
      coordinates: [
        {x:  0, y:  0},
        {x:  0, y:  1},
        {x:  1, y:  0},
        {x:  1, y:  1},
      ],
    },
    [TetrominoType.S] : {
      classNames: ['tetromino-s'],
      coordinates: [
        {x: -1, y:  1},
        {x:  0, y:  0},
        {x:  0, y:  1},
        {x:  1, y:  0},
      ],
    },
    [TetrominoType.Z]: {
      classNames: ['tetromino-z'],
      coordinates: [
        {x: -1, y:  0},
        {x:  0, y:  0},
        {x:  0, y:  1},
        {x:  1, y:  1},
      ],
    },
    [TetrominoType.T]: {
      classNames: ['tetromino-t'],
      coordinates: [
        {x: -1, y:  0},
        {x:  0, y:  0},
        {x:  0, y:  1},
        {x:  1, y:  0},
      ],
    },
    [TetrominoType.L]: {
      classNames: ['tetromino-l'],
      coordinates: [
        {x: -1, y:  0},
        {x: -1, y:  1},
        {x:  0, y:  0},
        {x:  1, y:  0},
      ],
    },
    [TetrominoType.J]: {
      classNames: ['tetromino-j'],
      coordinates: [
        {x: -1, y: -1},
        {x: -1, y:  0},
        {x:  0, y:  0},
        {x:  1, y:  0},
      ],
    },
    [TetrominoType.I]: {
      classNames: ['tetromino-i'],
      coordinates: [
        {x: -1, y:  0},
        {x:  0, y:  0},
        {x:  1, y:  0},
        {x:  2, y:  0},
      ],
    },
  });

  const getTetromino = (type: TetrominoType): Tetromino => tetrominos()[type];

  export default getTetromino;
