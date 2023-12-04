'use client';

import { Chessboard } from 'react-chessboard';
import { ChessFEN, ChessPGN, getPgnDetails } from '../lib/util';
import { ContainerWithDimensions } from './ContainerWithDimensions';
import { DisplayablePost, DisplayableUser } from '../lib/types';

type Props = {
  posts: DisplayablePost[];
  // itemBoardSizePx: number;
  containerClassName?: string;
};

export const Feed = (props: Props) => {
  return (
    <ContainerWithDimensions
      className="w-full"
      render={({ width }) => {
        return (
          <div className={`${props.containerClassName} flex flex-col w-full`}>
            {props.posts.map((post, i) => {
              if (post.type === 'FEN') {
                return (
                  <article className="mb-10" key={i}>
                    <header className="mb-2 flex justify-between">
                      <div>
                        By{' '}
                        <a href={`u/${post.author.username}`}>
                          @{post.author.username}
                        </a>
                      </div>
                      {/* <div>
                        {header.white} ({header.whiteElo}) - {header.black} (
                        {header.blackElo})
                      </div> */}
                      {/* <div>{header.result}</div> */}
                    </header>
                    <main className="bg-white overflow-hidden rounded-lg">
                      <Chessboard
                        position={post.content}
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
                        {/* {game.categories.map((c) => (
                          <a className="mr-1 hover:underline " href={`#${c}`}>
                            #{c}
                          </a>
                        ))} */}
                      </div>
                    </footer>
                  </article>
                );
              }

              // console.log('gere', post.content);

              const { fen, header } = getPgnDetails(post.content);

              return (
                <article className="mb-10" key={i}>
                  <header className="mb-2 flex justify-between">
                    <div>
                      By{' '}
                      <a href={`u/${post.author.username}`}>
                        @{post.author.username}
                      </a>
                    </div>
                    <div>
                      {header.white} ({header.whiteElo}) - {header.black} (
                      {header.blackElo})
                    </div>
                    <div>{header.result}</div>
                  </header>
                  <main className="bg-white overflow-hidden rounded-lg">
                    <Chessboard
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
                      {/* {game.categories.map((c) => (
                        <a className="mr-1 hover:underline " href={`#${c}`}>
                          #{c}
                        </a>
                      ))} */}
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
