'use client';

import { Chessboard } from 'react-chessboard';
import { ChessPGN, getPgnDetails } from '../lib/util';
import { ContainerWithDimensions } from './ContainerWithDimensions';

type Props = {
  games: {
    pgn: ChessPGN;
    categories: string[];
  }[];
  // itemBoardSizePx: number;
  containerClassName?: string;
};

export const BoardList = (props: Props) => {
  return (
    <ContainerWithDimensions
      className="w-full"
      render={({ width }) => {
        return (
          <div className={`${props.containerClassName} flex flex-col`}>
            {props.games.map((game, i) => {
              const { fen, header } = getPgnDetails(game.pgn);

              return (
                <article className="mb-10">
                  <header className="mb-2 flex justify-between">
                    <div>
                      {header.white} ({header.whiteElo}) - {header.black} (
                      {header.blackElo})
                    </div>
                    <div>{header.result}</div>
                  </header>
                  <main className="bg-white overflow-hidden rounded-lg">
                    <Chessboard
                      key={i}
                      position={fen}
                      boardWidth={width}
                      showBoardNotation
                      snapToCursor={false}
                      arePiecesDraggable={false}
                      customDarkSquareStyle={{
                        backgroundColor: 'rgba(0, 163, 255, .4)',
                      }}
                      customLightSquareStyle={{
                        backgroundColor: 'white',
                      }}
                    />
                  </main>
                  <footer className="mt-4 flex justify-between">
                    <div>
                      <button className="text-2xl">♡</button>
                      {/* <a href="#"></a> */}
                    </div>
                    <div>
                      {game.categories.map((c) => (
                        <a className="mr-1 hover:underline " href={`#${c}`}>
                          #{c}
                        </a>
                      ))}
                    </div>
                  </footer>
                </article>
              );
            })}
          </div>
        );
      }}
    />
  );
};
