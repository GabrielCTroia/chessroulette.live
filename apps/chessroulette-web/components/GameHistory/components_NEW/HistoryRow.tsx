import React, { MouseEventHandler } from 'react';
import { Menu, Item, useContextMenu, ItemParams } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import { HistoryList } from './HistoryList';
import { Text } from '../../Text';
import { ChessHistoryIndex, PairedMove } from '../types';
import { isPartialBlackMove } from '../util';
import { isChessRecursiveHistoryIndex } from '../lib';
import {
  ChessHistoryIndex_NEW,
  ChessHistoryTurn_NEW,
  ChessRecursiveHistoryTurn_NEW,
} from '../history/types';
import { ChessColor, isBlackColor, isWhiteColor } from '@xmatter/util-kit';
// import { NestedHistoryRow } from './NestedHistoryRow';

type Props = {
  historyTurn: ChessHistoryTurn_NEW;
  historyTurnIndex: number;
  // TODO: Starting linear index is needed?
  // startingLinearIndex: number;
  onFocus: (i: ChessHistoryIndex_NEW) => void;
  onDelete: (i: ChessHistoryIndex_NEW) => void;

  // TODO: Would be simpler to do it this way, or with an index? The calculation then happens somewhere outside
  // onFocus: (c: ChessColor) => void;
  // onDelete: (c: ChessColor) => void;
  focusedColor?: ChessColor;

  isNested?: boolean;
  // focusedIndex?: ChessHistoryIndex_NEW;
  className?: string;
  containerClassName?: string;
};

export const HistoryRow = React.forwardRef<HTMLDivElement | null, Props>(
  (
    {
      historyTurn: [whiteMove, blackMove],
      historyTurnIndex,
      // startingLinearIndex,
      onFocus,
      onDelete,
      className,
      // focusedIndex,
      focusedColor,
      containerClassName,
      isNested = false,
    },
    ref
  ) => {
    // const moveCount = historyTurnIndex + 1;

    // TODO: Do we need these??
    // const whiteMoveIndex = startingLinearIndex;
    // const blackMoveIndex = whiteMoveLinearIndex + 1;

    const whiteMoveIndex: ChessHistoryIndex_NEW = [historyTurnIndex, 0];
    const blackMoveIndex: ChessHistoryIndex_NEW = [historyTurnIndex, 1];

    // const menuId = `${historyTurnIndex}-${whiteMoveLinearIndex}:${blackMoveLinearIndex}`;
    const menuId = `${historyTurnIndex}`;

    const { show } = useContextMenu({ id: menuId });

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

    const handleOnDelete = ({ props }: ItemParams) => {
      // onDelete(props);
      if (props.color === 'white') {
        onDelete(whiteMoveIndex);
        // onDelete(whiteMoveLinearIndex);
      }

      if (props.color === 'black') {
        // onDelete(blackMoveLinearIndex);
        onDelete(blackMoveIndex);
      }
    };

    return (
      <div className={containerClassName} ref={isNested ? undefined : ref}>
        <div className={`flex pt-1 pt-1 ${className}`}>
          <Text className="flex-1 cursor-pointer">{`${
            historyTurnIndex + 1
          }.`}</Text>
          {whiteMove ? (
            <Text
              className={`flex-1 cursor-pointer bg-slate-400 hover:bg-slate-500 ${
                // whiteMoveLinearIndex === focusedIndex ? 'font-black' : ''
                focusedColor && isWhiteColor(focusedColor) ? 'font-black' : ''
              }`}
              onClick={() => onFocus(whiteMoveIndex)}
              onContextMenu={handleRightClickWhite}
            >
              {whiteMove.san}
            </Text>
          ) : (
            <Text
              className="flex-1 cursor-pointer hover:bg-red-100 bg-red-500"
              onContextMenu={handleRightClickWhite}
            >
              ...
            </Text>
          )}
          {blackMove && whiteMove?.branchedHistories ? (
            <Text
              className="flex-1 cursor-pointer hover:bg-red-100 bg-red-500"
              onContextMenu={handleRightClickBlack}
            >
              ...
            </Text>
          ) : (
            <Text
              className={`flex-1 cursor-pointer bg-slate-400 ${
                // blackMoveLinearIndex === focusedIndex ? 'font-black' : ''
                focusedColor && isBlackColor(focusedColor) ? 'font-black' : ''
              }`}
              // onClick={() => onFocus(blackMoveLinearIndex)}
              onClick={() => onFocus(blackMoveIndex)}
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
        {/* <NestedHistoryRow
          focusedIndex={focusedIndex}
          pairedIndex={pairedIndex}
          startingLinearIndex={startingLinearIndex}
          onFocus={onFocus}
          onDelete={onDelete}
          className={className}
          pairedMove={pairedMove}
        /> */}
        {/* {renderNestedContent()} */}
      </div>
    );
  }
);
