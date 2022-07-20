import { QueueBlock, QueueBlockTranslator } from 'models/QueueBlock';
import { TetrominoType, tetrominos } from 'models/TetrominoType';

const generatorForCharSeparator = (sep: string): QueueBlockTranslator => ({
  
  encode: (queue: QueueBlock[]) =>
    queue.map(qb => `${qb.id}${sep}${qb.type}`).join(sep),

  decode: (queue: string) => {
    const data = queue.split(sep);
    const ids = data.filter((_, index) => index % 2 === 0);
    const types = data.filter((_, index) => index % 2 > 0);
    if (ids.length !== types.length) {
      throw new Error('Bad decode input');
    }
    const ids_parsed = ids.map(id => parseInt(id));
    if (ids_parsed.some(id => isNaN(id))) {
      throw new Error('Bad decode input');
    }
    const ids_parsed_sorted = [...ids_parsed];
    ids_parsed_sorted.sort();
    if (ids_parsed_sorted.some((value, index, array) => index > 0 && array[index - 1] === value)) {
      throw new Error('Bad decode input');
    }
    const types_allowed = tetrominos();
    if (types.some(type => !types_allowed.some(t => t === type))) {
      throw new Error('Bad decode input');
    }
    const queueBlock = ids_parsed.map((id, index) => ({ id, type: types[index] as TetrominoType }));
    return queueBlock;
  }

});

export {
  generatorForCharSeparator,
};