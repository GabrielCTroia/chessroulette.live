import React from 'react';
import { Menu, Item, useContextMenu, ItemParams } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import { Text } from '../../Text';
import {
  ChessHistoryIndex_NEW,
  ChessHistoryRecursiveIndexes_NEW,
  ChessHistoryTurn_NEW,
  ChessRecursiveHistoryIndex_NEW,
} from '../history/types';
import { NestedHistories } from './NestedHistories';
import { ChessColor, invoke } from '@xmatter/util-kit';
import { renderHistoryIndex } from '../history/util';

export type HistoryRowProps = {
  rowId: string;
  historyTurn: ChessHistoryTurn_NEW;
  historyTurnIndex: number;
  onFocus: (i: ChessHistoryIndex_NEW) => void;
  onDelete: (i: ChessHistoryIndex_NEW) => void;
  // focusedIndex?: ChessRecursiveHistoryIndex_NEW;
  focusedOnMovePosition?: 0 | 1;
  focusedOnRecursiveIndexes?: ChessHistoryRecursiveIndexes_NEW;
  className?: string;
  containerClassName?: string;
  moveCount?: number;
} & (
  | {
      isNested: true;
      // historyRootTurnIndex: number;
      rootHistoryIndex: ChessHistoryIndex_NEW;
    }
  | {
      isNested?: boolean;
      // historyRootTurnIndex?: undefined;
      rootHistoryIndex?: undefined;
    }
);

export const HistoryRow = React.forwardRef<
  HTMLDivElement | null,
  HistoryRowProps
>(
  (
    {
      rowId,
      historyTurn: [whiteMove, blackMove],
      historyTurnIndex,
      onFocus,
      onDelete,
      className,
      containerClassName,
      moveCount = historyTurnIndex + 1,
      // focusedIndex,
      // isFocused,
      focusedOnMovePosition,
      focusedOnRecursiveIndexes,
      isNested = false,
      rootHistoryIndex,
    },
    ref
  ) => {
    const whiteMoveIndex: ChessHistoryIndex_NEW = [historyTurnIndex, 0];
    const blackMoveIndex: ChessHistoryIndex_NEW = [historyTurnIndex, 1];

    const { show } = useContextMenu({ id: rowId });

    const handleOnDelete = ({ props }: ItemParams) => {
      if (props.color === 'white') {
        onDelete(whiteMoveIndex);
      }

      if (props.color === 'black') {
        onDelete(blackMoveIndex);
      }
    };

    // const [focusedTurnIndex, focusedMovePosition, focusedNestedIndex] =
    //   focusedIndex || [];

    // const focus = invoke(() => {
    //   if (focusedNestedIndex) {
    //     return undefined;
    //   }

    //   if (focusedTurnIndex === historyTurnIndex) {
    //     return focusedMovePosition;
    //   }
    // });

    const shouldSplit = !!whiteMove.branchedHistories;

    const blackMoveRender = blackMove ? (
      <Text
        className={`flex-1 cursor-pointer p-1 hover:bg-slate-500 ${
          // focus === 1 && 'font-black bg-slate-600'
          !focusedOnRecursiveIndexes && focusedOnMovePosition === 1 && 'font-black bg-slate-600'
        }`}
        onClick={() => {
          if (!blackMove.isNonMove) {
            onFocus(blackMoveIndex);
          }
        }}
        onContextMenu={(event) => show({ event, props: { color: 'black' } })}
      >
        <Text
          style={{
            fontSize: 11,
          }}
        >
          HTI: [{historyTurnIndex}, 1]
        </Text>
        {blackMove.san}
      </Text>
    ) : (
      <div className="flex-1" />
    );

    return (
      <div className={containerClassName} ref={isNested ? undefined : ref}>
        <div className={`flex ${className} ${shouldSplit && 'flex-col'}`}>
          <div id="header" className="flex flex-1">
            <Text className="flex-0 p-1 pr-2 cursor-pointer">{moveCount}.</Text>
            <Text
              className={`flex-1 cursor-pointer p-1 sbg-slate-600 hover:bg-slate-500 ${
                // focus === 0 && 'font-black bg-slate-600'
                !focusedOnRecursiveIndexes && focusedOnMovePosition === 0 && 'font-black bg-slate-600'
              }`}
              onContextMenu={(event) =>
                show({ event, props: { color: 'white' } })
              }
              onClick={() => {
                if (!whiteMove.isNonMove) {
                  // console.log(
                  //   'row on focus',
                  //   renderHistoryIndex(whiteMoveIndex),
                  //   'focusedIndex:',
                  //   focusedIndex ? renderHistoryIndex(focusedIndex) : 'na'
                  // );

                  onFocus(whiteMoveIndex);
                }
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                }}
              >
                {/* HI: {historyTurnIndex ? renderHistoryIndex(historyTurnIndex) : 'n/a'} */}
                HTI: [{historyTurnIndex}, 0]
              </Text>
              {whiteMove.san}
            </Text>

            {shouldSplit ? (
              <Text
                className={`flex-1 cursor-pointer p-1 hover:bg-slate-500`}
                onContextMenu={(event) =>
                  show({ event, props: { color: 'white' } })
                }
              >
                ...
              </Text>
            ) : (
              blackMoveRender
            )}
          </div>
          {whiteMove.branchedHistories && (
            <NestedHistories
              branchedHistories={whiteMove.branchedHistories}
              rootHistoryIndex={[historyTurnIndex, 0]}
              onFocus={onFocus}
              onDelete={onDelete}
              className="pl-2 mt-2 border-l border-slate-500 ml-1 sbg-red-500"
              rowClassName={containerClassName}
              focusedRecursiveIndexes={focusedOnRecursiveIndexes}
              // focusedRecursiveIndexes={focusedNestedIndex}
            />
          )}
          {shouldSplit && (
            <div className="flex flex-1">
              <Text className="flex-0 p-1 pr-2 cursor-pointer">
                {moveCount}.
              </Text>
              <Text
                className="flex-1 cursor-pointer p-1 hover:bg-slate-500"
                onContextMenu={(event) =>
                  show({ event, props: { color: 'black' } })
                }
              >
                ...
              </Text>
              {blackMoveRender}
            </div>
          )}
        </div>

        {blackMove?.branchedHistories && (
          <NestedHistories
            branchedHistories={blackMove.branchedHistories}
            rootHistoryIndex={[historyTurnIndex, 1]}
            onFocus={onFocus}
            onDelete={onDelete}
            className="pl-2 mt-2 border-l border-slate-500 ml-1 sbg-blue-500"
            rowClassName={containerClassName}
            focusedRecursiveIndexes={focusedOnRecursiveIndexes}
            // focusedRecursiveIndexes={focusedNestedIndex}
          />
        )}
        <Menu id={rowId}>
          <Item
            id="delete"
            onClick={handleOnDelete}
            className="hover:cursor-pointer"
          >
            Delete from here
          </Item>
        </Menu>
      </div>
    );
  }
);
