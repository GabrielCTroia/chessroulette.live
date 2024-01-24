type Theme = {
  name: string;
  board: {
    darkSquare: string;
    lightSquare: string;
    arrowColors: [string, string, string];
    lastMoveToSquare: string;
    lastMoveFromSquare: string;
  };
};

const chessrouletteTheme: Theme = {
  name: 'chessroulette',
  board: {
    darkSquare: 'rgba(0, 163, 255, .4)',
    lightSquare: 'white',
    arrowColors: ['#11c6d1', '#f2358d', '#6f7381'],
    lastMoveToSquare: 'rgba(234, 183, 255, .5)',
    lastMoveFromSquare: 'rgba(234, 183, 255, .5)',
  },
};

const outpostTheme: Theme = {
  name: 'outpost',
  board: {
    darkSquare: '#C8A07D',
    lightSquare: 'white',
    arrowColors: ['#11c6d1', '#f2358d', '#6f7381'],
    lastMoveToSquare: 'rgba(95, 15, 15, .6)',
    lastMoveFromSquare: 'rgba(95, 15, 15, .6)',
  },
};

export const defaultTheme = chessrouletteTheme;

export const themes = {
  chessroulette: chessrouletteTheme,
  cr: chessrouletteTheme,
  outpost: outpostTheme,
  op: outpostTheme,
};
