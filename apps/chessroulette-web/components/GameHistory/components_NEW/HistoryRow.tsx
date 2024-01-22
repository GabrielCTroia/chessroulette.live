import React, { MouseEventHandler } from 'react';
import { Menu, Item, useContextMenu, ItemParams } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import { Text } from '../../Text';
import { ChessHistoryIndex_NEW, ChessHistoryTurn_NEW } from '../history/types';
import {
  ChessColor,
  getRandomInt,
  isBlackColor,
  isWhiteColor,
} from '@xmatter/util-kit';
import { NestedHistories } from './NestedHistories';

type Props = {
  rowId: string;
  historyTurn: ChessHistoryTurn_NEW;
  historyTurnIndex: number;
  onFocus: (i: ChessHistoryIndex_NEW) => void;
  onDelete: (i: ChessHistoryIndex_NEW) => void;
  focusedColor?: ChessColor;
  isNested?: boolean;
  className?: string;
  containerClassName?: string;
};

export const HistoryRow = React.forwardRef<HTMLDivElement | null, Props>(
  (
    {
      rowId,
      historyTurn: [whiteMove, blackMove],
      historyTurnIndex,
      onFocus,
      onDelete,
      className,
      focusedColor,
      containerClassName,
      isNested = false,
    },
    ref
  ) => {
    const whiteMoveIndex: ChessHistoryIndex_NEW = [historyTurnIndex, 0];
    const blackMoveIndex: ChessHistoryIndex_NEW = [historyTurnIndex, 1];

    const moveCount = historyTurnIndex + 1;

    const { show } = useContextMenu({ id: rowId });

    const handleOnDelete = ({ props }: ItemParams) => {
      if (props.color === 'white') {
        console.log('whiteMoveIndex', whiteMoveIndex);
        onDelete(whiteMoveIndex);
      }

      if (props.color === 'black') {
        console.log('blackIndex', blackMoveIndex);
        onDelete(blackMoveIndex);
      }
    };

    return (
      <div className={containerClassName} ref={isNested ? undefined : ref}>
        <Menu id={rowId}>
          <Item
            id="delete"
            onClick={handleOnDelete}
            className="hover:cursor-pointer"
          >
            Delete from here {rowId}
          </Item>
        </Menu>
        <div className={`flex pt-1 pt-1 ${className}`}>
          <Text className="flex-0 pr-2 cursor-pointer">{moveCount}.</Text>
          <Text
            className={`flex-1 cursor-pointer bg-slate-600 hover:bg-slate-500 ${
              focusedColor && isWhiteColor(focusedColor) && 'font-black'
            }`}
            onClick={() => onFocus(whiteMoveIndex)}
            onContextMenu={(event) =>
              show({ event, props: { color: 'white' } })
            }
          >
            {whiteMove.san}
          </Text>

          {blackMove ? (
            <Text
              className={`flex-1 cursor-pointer bg-slate-400 hover:bg-slate-500 ${
                focusedColor && isBlackColor(focusedColor) && 'font-black'
              }`}
              onClick={() => onFocus(blackMoveIndex)}
              onContextMenu={(event) =>
                show({ event, props: { color: 'black' } })
              }
            >
              {blackMove.san}
            </Text>
          ) : (
            <div className="flex-1"></div>
          )}
        </div>
        {whiteMove.branchedHistories && (
          <NestedHistories
            branchedHistories={whiteMove.branchedHistories}
            historyIndex={[historyTurnIndex, 0]}
            onFocus={onFocus}
            onDelete={onDelete}
            className="pl-2 mb-2 mt-2 border-l ml-1 bg-red-500"
          />
        )}
        {blackMove?.branchedHistories && (
          <NestedHistories
            branchedHistories={blackMove.branchedHistories}
            historyIndex={[historyTurnIndex, 1]}
            onFocus={onFocus}
            onDelete={onDelete}
            className="pl-2 mb-2 mt-2 border-l ml-1 bg-blue-500"
          />
        )}
      </div>
    );
  }
);
