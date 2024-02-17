import {
  ChessboardContainer,
  ChessboardContainerProps,
} from './ChessboardContainer';
import { ContainerWithDimensions } from '../ContainerWithDimensions';

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
      className="w-full h-full"
      render={(d) => <ChessboardContainer {...props} sizePx={d.width} />}
    />
  );
};
