import React, { MouseEventHandler } from 'react';
import { Menu, Item, useContextMenu, ItemParams } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import { HistoryList } from './HistoryList';
import { Text } from '../../Text';
import { ChessHistoryIndex, PairedMove } from '../types';
import { isPartialBlackMove } from '../util';
import { isChessRecursiveHistoryIndex } from '../lib';
import { NestedHistoryRow } from './NestedHistoryRow';

type Props = {
  pairedMove: PairedMove;
  pairedIndex: number;
  startingLinearIndex: number;
  focusedIndex?: ChessHistoryIndex;
  className?: string;
  containerClassName?: string;
  isNested?: boolean;
  onFocus: (i: ChessHistoryIndex) => void;
  onDelete: (i: ChessHistoryIndex) => void;
};

export const HistoryRow = React.forwardRef<HTMLDivElement | null, Props>(
  (
    {
      pairedMove,
      pairedIndex,
      startingLinearIndex,
      onFocus,
      onDelete,
      className,
      focusedIndex,
      containerClassName,
      isNested = false,
    },
    ref
  ) => {
    const moveCount = pairedIndex + 1;

    const [whiteMove, blackMove] = isPartialBlackMove(pairedMove)
      ? [undefined, pairedMove[0]] // if it's a partial black move treat it as a full move with white as undefined
      : pairedMove;

    const whiteMoveLinearIndex = startingLinearIndex;
    const blackMoveLinearIndex = whiteMoveLinearIndex + 1;

    const menuId = `${moveCount}-${whiteMoveLinearIndex}:${blackMoveLinearIndex}`;

    const { show } = useContextMenu({
      id: menuId,
    });

    const handleRightClickWhite: MouseEventHandler = (event) => {
      show({
        event,
        props: {
          color: 'white',
        },
      });
    };

    const handleRightClickBlack: MouseEventHandler = (event) => {
      show({
        event,
        props: {
          color: 'black',
        },
      });
    };

    const handleOnDelete = (s: ItemParams) => {
      if (s.props.color === 'white') {
        onDelete(whiteMoveLinearIndex);
      }

      if (s.props.color === 'black') {
        onDelete(blackMoveLinearIndex);
      }
    };

    const renderNestedContent = () => {
      const [focusedMoveIndex, focusedBranchIndex, focusedNestedIndex] =
        isChessRecursiveHistoryIndex(focusedIndex)
          ? focusedIndex
          : [focusedIndex, undefined, undefined];

      return (
        <>
          {whiteMove?.branchedHistories && (
            <>
              {whiteMove.branchedHistories.map(
                (branchedHistory, branchIndex) => {
                  const focusedIndexPerBranch =
                    focusedMoveIndex === whiteMoveLinearIndex &&
                    focusedBranchIndex === branchIndex
                      ? focusedNestedIndex
                      : undefined;

                  return (
                    <HistoryList
                      key={`${whiteMove.san}-branch-${branchIndex}`}
                      history={branchedHistory}
                      onRefocus={(nestedIndex) =>
                        onFocus([
                          whiteMoveLinearIndex,
                          branchIndex,
                          nestedIndex,
                        ])
                      }
                      onDelete={(nestedIndex) =>
                        onDelete([
                          whiteMoveLinearIndex,
                          branchIndex,
                          nestedIndex,
                        ])
                      }
                      // className={cls.nestedHistory}
                      className="pl-2"
                      rootPairedIndex={pairedIndex} // continue this move
                      focusedIndex={focusedIndexPerBranch}
                      isNested={true}
                    />
                  );
                }
              )}
              {blackMove && (
                <div
                  // className={cx(cls.row, cls.rowBelowNested, className)}
                  className={`flex pt-1 pt-1 ${className}`}
                >
                  <Text
                  // className={cx(cls.text, cls.rowIndex)}
                  >{`${moveCount}.`}</Text>
                  <Text
                    // className={cx(cls.text, cls.move, cls.blackMove)}
                    className="flex-1 cursor-pointer nfont-bold"
                  >
                    ...
                  </Text>
                  <Text
                    // className={cx(cls.text, cls.move, cls.blackMove, {
                    //   [cls.activeMove]: blackMoveLinearIndex === focusedIndex,
                    // })}
                    className={`flex-1 cursor-pointer mfont-bold ${
                      blackMoveLinearIndex === focusedIndex ? 'font-black' : ''
                    }`}
                    onClick={() => onFocus(blackMoveLinearIndex)}
                  >
                    {blackMove.san}
                  </Text>
                </div>
              )}
            </>
          )}
          {blackMove?.branchedHistories?.map((branchedHistory, branchIndex) => {
            const focusedIndexPerBranch =
              focusedMoveIndex === blackMoveLinearIndex &&
              focusedBranchIndex === branchIndex
                ? focusedNestedIndex
                : undefined;

            return (
              <HistoryList
                history={branchedHistory}
                onRefocus={(nestedIndex) =>
                  onFocus([blackMoveLinearIndex, branchIndex, nestedIndex])
                }
                onDelete={(nestedIndex) =>
                  onDelete([blackMoveLinearIndex, branchIndex, nestedIndex])
                }
                key={`${blackMove.san}-branch-${branchIndex}`}
                // className={cls.nestedHistory}
                className="pl-2"
                rootPairedIndex={pairedIndex + 1} // start a new move
                focusedIndex={focusedIndexPerBranch}
                isNested={true}
              />
            );
          })}
        </>
      );
    };

    return (
      <div
        // className={cx(cls.container, containerClassName)}
        className={containerClassName}
        ref={isNested ? undefined : ref}
      >
        <div
          //  className="row"
          className={`flex pt-1 pt-1 ${className}`}
        >
          <Text
            // className={cx(cls.text, cls.rowIndex)}
            className="flex-1 cursor-pointer"
          >{`${moveCount}.`}</Text>
          {whiteMove ? (
            <Text
              // className={cx(cls.text, cls.move, cls.whiteMove, {
              //   [cls.activeMove]: whiteMoveLinearIndex === focusedIndex,
              // })}
              className={`flex-1 cursor-pointer bg-slate-400 hover:bg-slate-500 ${
                whiteMoveLinearIndex === focusedIndex ? 'font-black' : ''
              }`}
              onClick={() => onFocus(whiteMoveLinearIndex)}
              onContextMenu={handleRightClickWhite}
            >
              {whiteMove.san}
            </Text>
          ) : (
            <Text
              // className={cx(cls.text, cls.move, cls.whiteMove)}
              className="flex-1 cursor-pointer hover:bg-red-100 bg-red-500"
              onContextMenu={handleRightClickWhite}
            >
              ...
            </Text>
          )}
          {blackMove && whiteMove?.branchedHistories ? (
            <Text
              // className={cx(cls.text, cls.move, cls.blackMove)}
              className="flex-1 cursor-pointer hover:bg-red-100 bg-red-500"
              onContextMenu={handleRightClickBlack}
            >
              ...
            </Text>
          ) : (
            <Text
              // className={cx(cls.text, cls.move, cls.blackMove, {
              //   [cls.activeMove]: blackMoveLinearIndex === focusedIndex,
              // })}
              className={`flex-1 cursor-pointer bg-slate-400 ${
                blackMoveLinearIndex === focusedIndex ? 'font-black' : ''
              }`}
              onClick={() => onFocus(blackMoveLinearIndex)}
              onContextMenu={handleRightClickBlack}
            >
              {blackMove?.san}
            </Text>
          )}
        </div>
        <Menu id={menuId}>
          <Item
            id="delete"
            onClick={handleOnDelete}
            className="hover:cursor-pointer"
          >
            Delete from here
          </Item>
        </Menu>
        <NestedHistoryRow
          focusedIndex={focusedIndex}
          pairedIndex={pairedIndex}
          startingLinearIndex={startingLinearIndex}
          onFocus={onFocus}
          onDelete={onDelete}
          className={className}
          pairedMove={pairedMove}
        />
        {/* {renderNestedContent()} */}
      </div>
    );
  }
);

// const useStyles = createUseStyles((theme) => ({
//   // container: {},
//   // row: {
//   //   display: 'flex',
//   //   paddingBottom: spacers.smaller,
//   //   paddingTop: spacers.smaller,
//   // },
//   // initStateRow: {
//   //   flex: 1,
//   // },
//   // resultRow: {},
//   // text: {
//   //   fontSize: '14px',
//   // },
//   rowIndex: {
//     paddingRight: spacers.default,
//   },
//   move: {
//     cursor: 'pointer',
//   },
//   whiteMove: {
//     flex: 1,
//     fontWeight: 300,
//   },
//   blackMove: {
//     flex: 1,
//     fontWeight: 300,
//   },
//   filler: {
//     flex: 1,
//   },
//   activeMove: {
//     fontWeight: 800,
//   },

//   // nestedHistory: {
//   //   marginTop: spacers.smaller,
//   //   ...(theme.name === 'lightDefault'
//   //     ? {
//   //         background: hexToRgba(theme.colors.primary, 0.07),
//   //       }
//   //     : {
//   //         background: hexToRgba(theme.colors.positiveDarker, 0.07),
//   //       }),
//   //   border: `1px solid ${theme.colors.negativeLight}`,
//   //   borderColor: hexToRgba(theme.colors.primary, 0.1),
//   //   borderWidth: 0,
//   //   borderLeftWidth: '1px',
//   //   borderTopWidth: '1px',
//   //   borderLeftColor: hexToRgba(theme.colors.primary, 0.4),
//   //   borderBottomWidth: '1px',
//   //   ...softBorderRadius,

//   //   paddingLeft: spacers.small,
//   // },
//   rowBelowNested: {
//     // marginTop: spacers.small,
//   },
// }));
