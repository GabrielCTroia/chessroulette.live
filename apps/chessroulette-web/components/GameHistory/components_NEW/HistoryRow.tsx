import React from 'react';
import { Menu, Item, useContextMenu, ItemParams } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import { Text } from '../../Text';
import {
  ChessHistoryIndex_NEW,
  ChessHistoryTurn_NEW,
  ChessRecursiveHistoryIndex_NEW,
} from '../history/types';
import { NestedHistories } from './NestedHistories';
import { invoke } from '@xmatter/util-kit';

export type HistoryRowProps = {
  rowId: string;
  historyTurn: ChessHistoryTurn_NEW;
  historyTurnIndex: number;
  onFocus: (i: ChessHistoryIndex_NEW) => void;
  onDelete: (i: ChessHistoryIndex_NEW) => void;
  focusedIndex?: ChessRecursiveHistoryIndex_NEW;
  className?: string;
  containerClassName?: string;
  moveCount?: number;
  isNested?: boolean;
};

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
      focusedIndex,
      containerClassName,
      isNested = false,
      moveCount = historyTurnIndex + 1,
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

    const [focusedTurnIndex, focusedMovePosition, focusedNestedIndex] =
      focusedIndex || [];
    const focus = invoke(() => {
      if (focusedNestedIndex) {
        return undefined;
      }

      if (focusedTurnIndex === historyTurnIndex) {
        return focusedMovePosition;
      }
    });

    const shouldSplit = !!whiteMove.branchedHistories;

    const blackMoveRender = blackMove ? (
      <Text
        className={`flex-1 cursor-pointer p-1 hover:bg-slate-500 ${
          focus === 1 && 'font-black bg-slate-600'
        }`}
        onClick={() => {
          if (!blackMove.isNonMove) {
            onFocus(blackMoveIndex);
          }
        }}
        onContextMenu={(event) => show({ event, props: { color: 'black' } })}
      >
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
                focus === 0 && 'font-black bg-slate-600'
              }`}
              onContextMenu={(event) =>
                show({ event, props: { color: 'white' } })
              }
              onClick={() => {
                if (!whiteMove.isNonMove) {
                  onFocus(whiteMoveIndex);
                }
              }}
            >
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
            <div>
              <>
                <NestedHistories
                  branchedHistories={whiteMove.branchedHistories}
                  historyIndex={[historyTurnIndex, 0]}
                  onFocus={onFocus}
                  onDelete={onDelete}
                  className="pl-2 mt-2 border-l border-slate-500 ml-1 sbg-red-500"
                  rowClassName={containerClassName}
                  focusedRecursiveIndexes={focusedNestedIndex}
                />
              </>
            </div>
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
            historyIndex={[historyTurnIndex, 1]}
            onFocus={onFocus}
            onDelete={onDelete}
            className="pl-2 mt-2 border-l border-slate-500 ml-1 sbg-blue-500"
            rowClassName={containerClassName}
            focusedRecursiveIndexes={focusedNestedIndex}
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
