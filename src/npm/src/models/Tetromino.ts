import Coordinate from './Coordinate';

interface Tetromino {
  classNames: string[],
  color: string,
  coordinates: Coordinate[],
};

export default Tetromino;