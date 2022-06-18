import Coordinate from 'models/Coordinate';
import CoordinateGenerator from 'models/CoordinateGenerator';
import { getNextOffsetCoordinateDefault } from "./CoordinateGenerators";

describe('CoordinateGenerators', () => {

  describe('getNextOffsetCoordinateDefault', () => {

    describe('next', () => {

      let generator: CoordinateGenerator = null;

      beforeAll(() => {
        generator = getNextOffsetCoordinateDefault();
      });

      test.each<Coordinate>([
        { x:   0, y:   0 },
        { x:   0, y:  -1 },
        { x:   1, y:   0 },
        { x:   0, y:   1 },
        { x:  -1, y:   0 },
        { x:   0, y:  -2 },
        { x:   1, y:  -1 },
        { x:   2, y:   0 },
        { x:   1, y:   1 },
        { x:   0, y:   2 },
        { x:  -1, y:   1 },
        { x:  -2, y:   0 },
        { x:  -1, y:  -1 },
        { x:   0, y:  -3 },
      ])('Iteration %# should generate correct next argument as %o', (expected) => {
        const actual = generator.next();
        expect(actual).toEqual(expected);
      });

    });

    test('reset', () => {
      const generator = getNextOffsetCoordinateDefault();
      for (let x = 0; x < 10; x++) {
        generator.next();
      }
      generator.reset();
      let actual = generator.next();
      expect(actual).toEqual({x: 0, y:  0});
      actual = generator.next();
      expect(actual).toEqual({x: 0, y: -1});
    });

    test('should keep generator instances unique', () => {
      const
        generator_1 = getNextOffsetCoordinateDefault(),
        generator_2 = getNextOffsetCoordinateDefault();
      generator_1.next();
      const
        actual_1 = generator_1.next(),
        actual_2 = generator_2.next();
      expect(actual_1).toEqual({x: 0, y: -1});
      expect(actual_2).toEqual({x: 0, y:  0});
    });

  });

});