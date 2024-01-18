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
    'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R w KQkq - 0 1'
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

describe('Fen State Notation', () => {
  describe('Turn', () => {
    test('Invalid Turn', () => {
      const actual = () => {
        new ChessFENBoard(
          'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R u KQkq - 0 1' // Notice the invalid 'u' in the 1st position
        );
      };

      expect(actual).toThrow('InvalidTurnNotation');
    });

    test('White Turn', () => {
      const actual = new ChessFENBoard(
        'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R w KQkq - 0 1'
      ).fen;

      expect(actual).toBe(
        'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R w KQkq - 0 1'
      );
    });

    test('Black Turn', () => {
      const actual = new ChessFENBoard(
        'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R b KQkq - 0 1'
      ).fen;

      expect(actual).toBe(
        'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R b KQkq - 0 1'
      );
    });
  });

  describe('Castling Rights', () => {
    test('Invalid Castling Rights Notatoin', () => {
      const actual = () => {
        new ChessFENBoard(
          'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R w Kskq - 0 1' // Notice the invalid 's' in the 2nd position
        );
      };

      expect(actual).toThrow('InvalidCastlingRightsNotation');
    });

    test('Fails when colors are reversed (black first)', () => {
      const actual = () => {
        new ChessFENBoard(
          'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R w kqKQ - 0 1'
        );
      };

      expect(actual).toThrow('InvalidCastlingRightsNotation');
    });

    test('No Castling', () => {
      const actual = new ChessFENBoard(
        'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R b - - 0 1'
      ).fen;

      expect(actual).toBe(
        'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R b - - 0 1'
      );
    });

    test('White King & Black Queen only', () => {
      const actual = new ChessFENBoard(
        'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R b Kq - 0 1'
      ).fen;

      expect(actual).toBe(
        'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R b Kq - 0 1'
      );
    });

    test('White King, Black King & Queen only', () => {
      const actual = new ChessFENBoard(
        'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R b Kkq - 0 1'
      ).fen;

      expect(actual).toBe(
        'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R b Kkq - 0 1'
      );
    });

    test('Black King only', () => {
      const actual = new ChessFENBoard(
        'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R b k - 0 1'
      ).fen;

      expect(actual).toBe(
        'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R b k - 0 1'
      );
    });
  });

  describe('EnPassant', () => {
    test('Fails when enPassant is invalid', () => {
      const actual = () => {
        new ChessFENBoard(
          'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R w - e 0 1' // Notice the invalid 'e' in the 3rd position
        );
      };

      expect(actual).toThrow('InvalidEnPassantNotation');
    });

    test('Fails when enPassant Square is invalid', () => {
      const actual = () => {
        new ChessFENBoard(
          'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R w - e9 0 1' // Notice the invalid 'e9' in the 3rd position
        );
      };

      expect(actual).toThrow('InvalidEnPassantNotation');
    });

    test('No EnPassant', () => {
      const actual = new ChessFENBoard(
        'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R w - - 0 1'
      ).fen;

      expect(actual).toBe(
        'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R w - - 0 1'
      );
    });

    test('No EnPassant', () => {
      const actual = new ChessFENBoard(
        'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R w - - 0 1'
      ).fen;

      expect(actual).toBe(
        'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R w - - 0 1'
      );
    });

    test('EnPassant with Valid Square', () => {
      const actual = new ChessFENBoard(
        'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R w - e3 0 1'
      ).fen;

      expect(actual).toBe(
        'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R w - e3 0 1'
      );
    });
  });

  describe('Half Moves', () => {
    test('Negative Half Moves Count', () => {
      const actual = () => {
        new ChessFENBoard(
          'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R w - - -2 1' // Notice the invalid '-2' in the 4th position
        );
      };

      expect(actual).toThrow('InvalidHalfMovesNotation');
    });

    test('Half Moves as String', () => {
      const actual = () => {
        new ChessFENBoard(
          'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R w - - s 1' // Notice the invalid 's' in the 4th position
        );
      };

      expect(actual).toThrow('InvalidHalfMovesNotation');
    });

    test('Half Moves as Positive Number', () => {
      const actual = new ChessFENBoard(
        'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R w - - 5 1'
      ).fen;

      expect(actual).toBe(
        'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R w - - 5 1'
      );
    });
  });

  describe('Full Moves', () => {
    test('Negative Full Moves Count', () => {
      const actual = () => {
        new ChessFENBoard(
          'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R w - - 0 -1' // Notice the invalid '-1' in the 5th position
        );
      };

      expect(actual).toThrow('InvalidFullMovesNotation');
    });

    test('Zero Full Moves Count (needs to always be positive)', () => {
      const actual = () => {
        new ChessFENBoard(
          'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R w - - 0 0' // Notice the invalid '0' in the 5th position
        );
      };

      expect(actual).toThrow('InvalidFullMovesNotation');
    });

    test('Full Moves as String', () => {
      const actual = () => {
        new ChessFENBoard(
          'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R w - - 0 s' // Notice the invalid 's' in the 5th position
        );
      };

      expect(actual).toThrow('InvalidFullMovesNotation');
    });

    test('Full Moves as String', () => {
      const actual = new ChessFENBoard(
        'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R w - - 0 2'
      ).fen;

      expect(actual).toBe(
        'rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R w - - 0 2'
      );
    });
  });
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
      'rnbqkbnr/pppppppp/8/8/1Pp5/k7/PPPPPPPP/1NBQKBqR w - - 0 1'
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

describe('Set Fen Notation', () => {
  describe('From Fen State', () => {
    test('With Valid Props', () => {
      const chessFenBoard = new ChessFENBoard();

      chessFenBoard.setFenNotation({
        fromState: {
          turn: 'b',
          halfMoves: 5,
          fullMoves: 1,
          castlingRights: {
            w: {
              kingSide: true,
            },
          },
        },
      });

      const actual = chessFenBoard.fen;

      expect(actual).toBe(
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b K - 5 1'
      );
    });

    test('With Invalid Full Moves', () => {
      const chessFenBoard = new ChessFENBoard();

      const actual = () => {
        chessFenBoard.setFenNotation({
          fromState: {
            turn: 'b',
            halfMoves: 5,
            fullMoves: 0,
            castlingRights: {
              w: {
                kingSide: true,
              },
            },
          },
        });
      };

      expect(actual).toThrow('InvalidFenState:InvalidFullMoves');
    });

    test('With Invalid Half Moves', () => {
      const chessFenBoard = new ChessFENBoard();

      const actual = () => {
        chessFenBoard.setFenNotation({
          fromState: {
            turn: 'b',
            halfMoves: -1,
            fullMoves: 2,
            castlingRights: {
              w: {
                kingSide: true,
              },
            },
          },
        });
      };

      expect(actual).toThrow('InvalidFenState:InvalidHalfMoves');
    });
  });

  describe('From Fen Notation', () => {
    test('With Valid Notation', () => {
      const chessFenBoard = new ChessFENBoard();

      chessFenBoard.setFenNotation({
        fromNotation: 'b Kq e3 0 1',
      });

      const actual = chessFenBoard.fen;

      expect(actual).toBe(
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b Kq e3 0 1'
      );
    });

    test('With Invalid Turn', () => {
      const chessFenBoard = new ChessFENBoard();

      const actual = () => {
        chessFenBoard.setFenNotation({
          fromNotation: '- Kq e3 0 1',
        });
      };

      expect(actual).toThrow('InvalidTurnNotation');
    });

    test('With Invalid Full Moves', () => {
      const chessFenBoard = new ChessFENBoard();

      const actual = () => {
        chessFenBoard.setFenNotation({
          fromNotation: 'w Kq e3 0 0',
        });
      };

      expect(actual).toThrow('InvalidFullMovesNotation');
    });
  });
});

describe('move', () => {
  test('moves any existent piece to any square', () => {
    const chessFenBoard = new ChessFENBoard();

    chessFenBoard.move('a2', 'a5');
    chessFenBoard.move('h1', 'c4');
    chessFenBoard.move('e8', 'd1');

    expect(chessFenBoard.fen).toBe(
      'rnbq1bnr/pppppppp/8/P7/2R5/8/1PPPPPPP/RNBkKBN1 w - - 0 1'
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
      'rnbq1bnr/pppppppp/8/P7/2R5/8/1PPPPPPP/RNBkKBN1 w - - 0 1'
    );

    const actual = () => {
      chessFenBoard.move('a2', 'a3');
    };

    expect(actual).toThrow('Move Error: the from square (a2) was empty!');
  });

  test('throws when attempting to move an inexistent piece', () => {
    const chessFenBoard = new ChessFENBoard(
      'rnbq1bnr/pppppppp/8/P7/2R5/8/1PPPPPPP/RNBkKBN1 w - - 0 1'
    );

    const actual = () => {
      chessFenBoard.move('a2', 'a3');
    };

    expect(actual).toThrow('Move Error: the from square (a2) was empty!');
  });

  test('moves with promotion', () => {
    const chessFenBoard = new ChessFENBoard();

    chessFenBoard.move('a2', 'a8', 'Q');

    const actual = chessFenBoard.fen;

    expect(actual).toBe(
      'Qnbqkbnr/pppppppp/8/8/8/8/1PPPPPPP/RNBQKBNR w - - 0 1'
    );
  });

  // test('moves with castling', () => {
  //   const chessFenBoard = new ChessFENBoard('rnbqkb1r/5ppp/p2ppn2/1p6/3NP3/1BN5/PPP2PPP/R1BQK2R w - - 0 ');

  //   chessFenBoard.move('a2', 'a8', 'Q');

  //   const actual = chessFenBoard.fen;

  //   expect(actual).toBe('Qnbqkbnr/pppppppp/8/8/8/8/1PPPPPPP/RNBQKBNR');
  // });
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
