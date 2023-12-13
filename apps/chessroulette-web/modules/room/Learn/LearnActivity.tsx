'use client';

import movexConfig from 'apps/chessroulette-web/movex.config';
import { ResourceIdentifier } from 'movex-core-util';
import { MovexBoundResource } from 'movex-react';
import { ContainerWithDimensions } from 'apps/chessroulette-web/components/ContainerWithDimensions';
import { Freeboard } from 'apps/chessroulette-web/components/Chessboard/Freeboard';
import { LearnTemplate } from './LearnTemplate';
import { PlayerBox } from 'apps/chessroulette-web/components/PlayerBox';
import { GameHistory } from 'apps/chessroulette-web/components/GameHistory';
import { getNewChessGame } from 'apps/chessroulette-web/lib/chess';
import { ChessFEN, ChessPGN } from '@xmatter/util-kit';

type ChessColor = 'white' | 'black';

type Props = {
  rid: ResourceIdentifier<'room'>;
  fen?: ChessFEN;
  playingColor?: ChessColor;
};

export const pgnToHistory = (pgn: ChessPGN) =>
  getNewChessGame({ pgn }).history({ verbose: true });

const getHistory = (pgn: ChessPGN) => pgnToHistory(pgn);

export default ({ playingColor = 'white', ...props }: Props) => {
  return (
    <MovexBoundResource
      movexDefinition={movexConfig}
      rid={props.rid}
      render={({ boundResource: { state, dispatch } }) => {
        if (state.activity.activityType !== 'learn') {
          return null;
        }

        const { activityState } = state.activity;

        return (
          <LearnTemplate
            // mainContainerClass="flex items-center"
            mainComponent={
              <ContainerWithDimensions
                className="h-full w-full"
                render={(s) => (
                  <Freeboard
                    sizePx={s.height} // TODO: Here this fails when the height is super small! need to look into it
                    fen={activityState.fen}
                    onPieceDrop={(payload) =>
                      dispatch({
                        type: 'dropPiece',
                        payload,
                      })
                    }
                  />
                )}
              />
            }
            rightSideComponent={
              <div
                className="flex flex-1s flex-col space-between gap-6 w-full h-full  relative"
                style={{
                  minWidth: 0,
                  minHeight: 0,
                }}
              >
                <div
                  className="flex-1 flex flex-col sgap-6"
                  style={{
                    minWidth: 0,
                    minHeight: 0,
                  }}
                >
                  {/* <div className="np-grow"> */}
                  <PlayerBox />
                  {/* </div> */}
                  <div
                    className="flex flex-col flex-1 relative h-full gap-2 bg-slate-700 px-4 mt-6 mb-3"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      // overflowY: 'scroll',
                      overflow: 'scroll',
                      alignItems: 'stretch',
                      // padding: 20
                      // height: '100%',
                      // background: 'blue',
                    }}
                  >
                    {/* <div
                      className="bg-blue-100 sflex-1"
                      style={{
                        height: '500px',
                        background: 'green',
                      }}
                    /> */}
                    <GameHistory
                      history={getHistory(
                        ` 1.e4 e5 2.Nf3 Nc6 3.Bb5 Nf6 4.d3 Bc5 5.c3 O-O 6.O-O d5 7.Nbd2 dxe4 8.dxe4 a5
                        9.Qc2 Qe7 10.a4 Nb8 11.h3 Rd8 12.Re1 h6 13.Bf1 Nbd7 14.Nc4 b6 15.Bd2 Ba6
                        16.b3 Qe6 17.Rad1 Bf8 18.Be3 Bb7 19.Bd3 Re8 20.Ncd2 Ba6 21.Bxa6 Rxa6 22.Nc4 Qc6
                        23.Bc1 b5 24.axb5 Qxb5 25.Nfd2 Rb8 26.Ba3 a4 27.b4 c5 28.bxc5 Qc6 29.Ra1 Re8
                        30.Bb4 Nxc5 31.Ra2 Nfd7 32.Rd1 Rea8 33.Ra3 Ne6 34.Rb1 Bc5 35.Qd1 Nf4 36.Qf1 Kh7
                        37.g3 Ne6 38.h4 Bxb4 39.cxb4 Nd4 40.Na5 Qb5 41.Qd1 Rf6 42.Kg2 Rc8 43.Rb2 Nc5
                        44.Qf1 Qxf1+ 45.Kxf1 Ncb3 46.Naxb3 axb3 47.Nxb3 Rc3 48.b5 Rb6 49.Nxd4 Rxa3
                        50.Nc6 f6 51.h5 Rc3 52.Ne7 Rc5 53.Rd2 Rcxb5 54.Nf5 Rb8 55.Kg2 R5b7 56.Kh3 Rb2
                        57.Rxb2 Rxb2 58.f3 g6 59.hxg6+ Kxg6 60.g4 h5 61.gxh5+ Kxh5 62.Kg3 Kg5 63.Ne7 Rd2
                        64.Nf5 Rd3 65.Ne7 Ra3 66.Nf5 Kg6 67.Nd6 Rb3 68.Nf5 Kf7 69.Nd6+ Ke6 70.Nf5 Ra3
                        71.Ng7+ Ke7 72.Nf5+ Kd7 73.Nh6 Ra1 74.Kg2 Ra8 75.Kg3 Rh8 76.Nf5 Rg8+ 77.Kf2 Rg5
                        78.Ne3 Kd6 79.Nf5+ Kc5 80.Ke3 Rg8 81.Kd3 Ra8 82.Ke3 Ra2 83.Ne7 Kd6 84.Nf5+ Ke6
                        85.Nh6 Ke7 86.Kd3 Kf8 87.Ke3 Kg7 88.Nf5+ Kg6 89.Ne7+ Kg5 90.Nd5 Rb2 91.Kd3 Rb7
                        92.Ke3 Rd7 93.Nc3 Rd6 94.Nd5 Rd7 95.Nc3 Rd8 96.Ne2 Kh4 97.Nc3 Kg3 98.Nd5 Rd6
                        99.f4 Rxd5 100.exd5 exf4+ 101.Kd2 f3 102.d6 f2 103.d7 f1=Q 104.d8=Q Qf4+
                        105.Kd3 Qf1+ 106.Kd2 Qf2+ 107.Kd1 Qf3+ 108.Kd2 Qf4+ 109.Ke2 Qc4+ 110.Kd2 f5
                        111.Qb8+ Kf2 112.Qd6 f4 113.Qf6 Qb4+ 114.Kc2 Kg3 115.Qg6+ Kf2 116.Qa6 f3
                        117.Kd3 Qc5 118.Qb7 Kg3 119.Qh7 Qc1 120.Kd4 Qd2+ 121.Ke5 Qf4+ 122.Kd5 f2
                        123.Qg8+ Qg4 124.Qb8+ Kg2 125.Qb2 Kg1 126.Qb6 Kf1  0-1`
                      )}
                      // history={getHistory(
                      //   ` 1.e4 e5 2.Nf3 Nc6 3.Bb5`
                      // )}
                      focusedIndex={2}
                      onRefocus={() => {
                        console.log('on refocus');
                      }}
                      // containerClassName="px-1"
                    />
                  </div>
                  <div className="bg-slate-700 p-4">
                    FEN: {activityState.fen}
                  </div>
                </div>
              </div>
            }
            // rightSideComponent={<RoomParticipants rid={rid} />}
          />
        );
      }}
    />
  );
};
