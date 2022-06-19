import { Grid } from '../classes/Grid';
import { testData } from './rotateBlock.testdata';
import rotateBlock from './rotateBlock';

describe('rotateBlock', () => {

  test.each(testData)('rotateBlock - Test Case %#', (data) => {
    const grid = new Grid(data.width, data.height);
    data.spaces.forEach(space => grid.setSpace(space.id, space.x, space.y));
    const actual = rotateBlock(data.block, grid);
    expect(actual).toEqual(data.expected);
  });

});