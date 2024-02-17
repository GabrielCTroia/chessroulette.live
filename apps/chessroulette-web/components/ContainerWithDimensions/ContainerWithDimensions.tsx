import React, { useRef, ReactElement } from 'react';
import { useContainerDimensions } from './useContainerDimensions';

type Props = React.HTMLProps<HTMLDivElement> & {
  render: (p: { width: number; height: number }) => ReactElement;
};

export const ContainerWithDimensions: React.FC<Props> = ({
  render,
  ...props
}) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const dimensions = useContainerDimensions(targetRef);

  console.log('dimensions changed', dimensions)

  return (
    <div ref={targetRef} {...props}>
      {dimensions.updated &&
        render({
          width: dimensions.width,
          height: dimensions.height,
        })}
    </div>
  );
};
