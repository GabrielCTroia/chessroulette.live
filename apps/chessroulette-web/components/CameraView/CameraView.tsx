'use client';
import { CSSProperties } from 'react';

import demo1 from './assets/1.jpg';
import demo2 from './assets/2.jpg';
import demo3 from './assets/3.jpg';
import demo4 from './assets/4.jpg';
import { getRandomInt } from 'apps/chessroulette-web/util';

const DemoImgs = [demo1, demo2, demo3, demo4];

export type Props = {
  // sizePx: number;
  style?: CSSProperties;
  clasName?: string;
  demoImgId?: 1 | 2 | 3 | 4;
};

export const CameraView = (props: Props) => {
  const imgSrc =
    DemoImgs[
      props.demoImgId ? props.demoImgId : getRandomInt(0, DemoImgs.length - 1)
    ];

  return (
    <div className={props.clasName} style={props.style}>
      <img src={imgSrc.src} />
    </div>
  );
};
