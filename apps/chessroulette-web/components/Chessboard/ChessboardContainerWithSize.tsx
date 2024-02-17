import {
  ChessboardContainer,
  ChessboardContainerProps,
} from './ChessboardContainer';
import { ContainerWithDimensions } from '../ContainerWithDimensions';
import { max, min } from '@xmatter/util-kit';

export type ChessboardContainerWithSizeProps = Omit<
  ChessboardContainerProps,
  'sizePx'
> & {
  sizePx?: number;
};

export const ChessboardContainerWithSize = ({
  sizePx,
  ...props
}: ChessboardContainerWithSizeProps) => {
  if (sizePx) {
    return <ChessboardContainer sizePx={sizePx} {...props} />;
  }

  return (
    <ContainerWithDimensions
      id="chessboard-container-with-size"
      className="w-full h-full"
      render={(d) => (
        <ChessboardContainer {...props} sizePx={min(d.width, d.height)} />
      )}
    />
  );
};
