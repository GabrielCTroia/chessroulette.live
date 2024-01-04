import { ChessFENBoard } from './ChessFENBoard';

const STARTING_BOARD = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
];

test('starts with starting fen when nothing is given', () => {
  const chessFenBoard = new ChessFENBoard();

  expect(chessFenBoard.fen).toBe(ChessFENBoard.STARTING_FEN);
  expect(chessFenBoard.board).toEqual(STARTING_BOARD);
});

test('starts with given FEN', () => {
  const chessFenBoard = new ChessFENBoard(
    'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R w KQkq - 0 1'
  );

  expect(chessFenBoard.fen).toBe(
    'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R'
  );

  expect(chessFenBoard.board).toEqual([
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', '', '', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', 'p', '', '', '', ''],
    ['', '', 'p', '', 'P', 'P', '', ''],
    ['', '', 'P', '', '', 'N', 'P', ''],
    ['P', 'P', '', 'P', '', '', '', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', '', 'R'],
  ]);
});

describe('put', () => {
  test('adds any piece in any square', () => {
    const chessFenBoard = new ChessFENBoard();

    chessFenBoard.put('a3', 'k');
    chessFenBoard.put('g1', 'q');
    chessFenBoard.put('b4', 'P');
    chessFenBoard.put('c4', 'p');
    chessFenBoard.put('a1', '');

    expect(chessFenBoard.fen).toBe(
      'rnbqkbnr/pppppppp/8/8/1Pp5/k7/PPPPPPPP/1NBQKBqR'
    );

    expect(chessFenBoard.board).toEqual([
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', 'P', 'p', '', '', '', '', ''],
      ['k', '', '', '', '', '', '', ''],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['', 'N', 'B', 'Q', 'K', 'B', 'q', 'R'],
    ]);
  });
});

describe('move', () => {
  test('moves any existent piece to any square', () => {
    const chessFenBoard = new ChessFENBoard();

    chessFenBoard.move('a2', 'a5');
    chessFenBoard.move('h1', 'c4');
    chessFenBoard.move('e8', 'd1');

    expect(chessFenBoard.fen).toBe(
      'rnbq1bnr/pppppppp/8/P7/2R5/8/1PPPPPPP/RNBkKBN1'
    );

    expect(chessFenBoard.board).toEqual([
      ['r', 'n', 'b', 'q', '', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      ['', '', '', '', '', '', '', ''],
      ['P', '', '', '', '', '', '', ''],
      ['', '', 'R', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'k', 'K', 'B', 'N', ''],
    ]);
  });

  test('throws when attempting to move an inexistent piece', () => {
    const chessFenBoard = new ChessFENBoard(
      'rnbq1bnr/pppppppp/8/P7/2R5/8/1PPPPPPP/RNBkKBN1'
    );

    const actual = () => {
      chessFenBoard.move('a2', 'a3');
    };

    expect(actual).toThrow('Move Error: the from square was empty');
  });

  test('throws when attempting to move an inexistent piece', () => {
    const chessFenBoard = new ChessFENBoard(
      'rnbq1bnr/pppppppp/8/P7/2R5/8/1PPPPPPP/RNBkKBN1'
    );

    const actual = () => {
      chessFenBoard.move('a2', 'a3');
    };

    expect(actual).toThrow('Move Error: the from square was empty');
  });

  test('moves with promotion', () => {
    const chessFenBoard = new ChessFENBoard();

    chessFenBoard.move('a2', 'a8', 'Q');

    const actual = chessFenBoard.fen;

    expect(actual).toBe('Qnbqkbnr/pppppppp/8/8/8/8/1PPPPPPP/RNBQKBNR');
  });
});

describe('piece', () => {
  const chessFenBoard = new ChessFENBoard();

  const actualWhiteBishop = chessFenBoard.piece('c1');
  expect(actualWhiteBishop).toBe('B');

  const actualWhitePawn = chessFenBoard.piece('a2');
  expect(actualWhitePawn).toBe('P');

  const actualBlackKing = chessFenBoard.piece('e8');
  expect(actualBlackKing).toBe('k');
});
