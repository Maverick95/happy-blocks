enum TetrominoType {
  O = "O",
  S = "S",
  Z = "Z",
  T = "T",
  L = "L",
  J = "J",
  I = "I",
}

const tetrominos = (): TetrominoType[] => ([
  TetrominoType.I,
  TetrominoType.J,
  TetrominoType.L,
  TetrominoType.O,
  TetrominoType.S,
  TetrominoType.T,
  TetrominoType.Z,
]);

export {
  TetrominoType,
  tetrominos,
};