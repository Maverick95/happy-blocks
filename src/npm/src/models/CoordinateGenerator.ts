import Coordinate from './Coordinate';

interface CoordinateGenerator {
  next: () => Coordinate,
  reset: () => void,
};

export default CoordinateGenerator;