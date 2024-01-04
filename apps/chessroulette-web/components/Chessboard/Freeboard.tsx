'use client';

import { ChessFENBoard } from '@xmatter/util-kit';
import { useArrowColor } from './useArrowColor';
import {
  ChessboardContainer,
  ChessboardContainerProps,
} from './ChessboardContainer';

type Props = ChessboardContainerProps;

export const Freeboard = ({
  fen = ChessFENBoard.STARTING_FEN,
  ...props
}: Props) => {
  // const [canCall, setCanCall] = useState(false);

  // TODO: This isn't yet working correctly
  // const onArrowsChangeConditioned = useCallbackIf<
  //   NonNullable<ChessboardProps['onArrowsChange']>
  // >(
  //   canCall,
  //   (arrows) => {
  //     if (arrows.length === 0) {
  //       props.onArrowsChange?.([]);
  //     }
  //     else {
  //       props.onArrowsChange?.([...props.arrows || [], ...arrows]);
  //     }
  //   },
  //   [props.onArrowsChange, props.arrows?.length]
  // );

  // useEffect(() => {
  //   setTimeout(() => {
  //     setCanCall(true);
  //   }, 50);
  // }, []);

  // console.log('customArrows', props.arrows);

  return <ChessboardContainer fen={fen} {...props} />;
};
