import { ChessColor } from '@xmatter/util-kit';
import { ChapterState } from '../activity/reducer';

export type LayoutContainerDimensions = {
  width: number;
  height: number;
  verticalPadding: number;
  horizontalPadding: number;
};

export type GenericLayoutExtendedDimensions = {
  container: LayoutContainerDimensions;
  top: LayoutContainerDimensions;
  main: LayoutContainerDimensions;
  bottom: LayoutContainerDimensions;
  center: LayoutContainerDimensions;
  left: LayoutContainerDimensions;
  right: LayoutContainerDimensions;
  isMobile: boolean;
};

export type EditModeState = Pick<
  ChapterState,
  'fen' | 'arrowsMap' | 'circlesMap'
> & {
  orientation: ChessColor;
};
