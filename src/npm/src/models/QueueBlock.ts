import { TetrominoType } from 'models/TetrominoType';

interface QueueBlock {
  id: number,
  type: TetrominoType,
};

interface QueueBlockTranslator {
  encode: (queue: QueueBlock[]) => string,
  decode: (queue: string) => QueueBlock[],
};

export {
  QueueBlock,
  QueueBlockTranslator,
};