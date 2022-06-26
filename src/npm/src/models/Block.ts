import Coordinate from './Coordinate';

interface Block {
  x: number,
  y: number,
  coordinates: Coordinate[],
  finished?: boolean,
}

export default Block;